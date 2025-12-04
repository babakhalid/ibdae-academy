module.exports = {
  apps: [{
    name: 'vite-dev-server',
    script: 'npm',
    args: 'run dev -- --host 0.0.0.0 --port 3000',
    cwd: '/workspace/template',
    env: {
      NODE_ENV: 'development'
    },
    max_restarts: 5,
    min_uptime: '10s',
    restart_delay: 3000,
    error_file: '/tmp/vite-error.log',
    out_file: '/tmp/vite-out.log',
    log_file: '/tmp/vite-combined.log'
  }]
};
