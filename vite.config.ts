import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Custom plugin to receive and log browser console messages in terminal
function terminalLogger() {
  return {
    name: 'terminal-logger',
    configureServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        // Handle log endpoint
        if (req.url === '/api/log' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk: any) => {
            body += chunk.toString();
          });
          req.on('end', () => {
            try {
              const { level, message } = JSON.parse(body);
              const timestamp = new Date().toLocaleTimeString();
              console.log(`\n[${timestamp}] [BROWSER ${level.toUpperCase()}]`, message);
            } catch (e) {
              // Ignore parse errors
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ ok: true }));
          });
          return;
        }
        next();
      });
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  plugins: [
    react(),
    terminalLogger(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
