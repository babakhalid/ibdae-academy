import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

console.log('[Supabase] Initializing client with URL:', supabaseUrl)

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storageKey: 'ibdae-academy-auth-session',
    storage: {
      getItem: (key) => {
        const item = localStorage.getItem(key)
        console.log('[Supabase] Storage getItem:', key, item ? 'found' : 'not found')
        return item
      },
      setItem: (key, value) => {
        console.log('[Supabase] Storage setItem:', key)
        localStorage.setItem(key, value)
      },
      removeItem: (key) => {
        console.log('[Supabase] Storage removeItem:', key)
        localStorage.removeItem(key)
      },
    },
  },
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'x-client-info': 'supabase-js-web',
      'apikey': supabaseAnonKey,
    },
    fetch: (url, options = {}) => {
      // Log all Supabase requests
      console.log('[Supabase] Fetch:', url)
      const fetchPromise = fetch(url, options)

      // Add timeout to all requests
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Fetch timeout')), 10000)
      )

      return Promise.race([fetchPromise, timeoutPromise]) as Promise<Response>
    },
  },
})
