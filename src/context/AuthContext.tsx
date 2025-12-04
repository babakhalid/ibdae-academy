import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

// Helper to log to both console and terminal
const terminalLog = (...args: any[]) => {
  console.log(...args)
  // Send to terminal in development
  if (import.meta.env.DEV) {
    const message = args.map(arg =>
      typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
    ).join(' ')
    fetch('/api/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ level: 'log', message })
    }).catch(() => {})
  }
}

const terminalError = (...args: any[]) => {
  console.error(...args)
  if (import.meta.env.DEV) {
    const message = args.map(arg =>
      typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
    ).join(' ')
    fetch('/api/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ level: 'error', message })
    }).catch(() => {})
  }
}

const terminalWarn = (...args: any[]) => {
  console.warn(...args)
  if (import.meta.env.DEV) {
    const message = args.map(arg =>
      typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
    ).join(' ')
    fetch('/api/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ level: 'warn', message })
    }).catch(() => {})
  }
}

export interface Profile {
  id: string
  email: string | null
  full_name: string | null
  avatar_url: string | null
  role: 'user' | 'admin'
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  updated_at: string
}

interface AuthContextType {
  user: User | null
  session: Session | null
  profile: Profile | null
  loading: boolean
  isAdmin: boolean
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: AuthError | null }>
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<void>
  signInWithGoogle: () => Promise<{ error: AuthError | null }>
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: Error | null }>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = async (userId: string) => {
    terminalLog('[AuthContext] fetchProfile called with userId:', userId)
    try {
      terminalLog('[AuthContext] Calling RPC function get_user_profile...')

      // Add timeout to RPC call
      const rpcPromise = supabase.rpc('get_user_profile', { user_id: userId })
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('RPC timeout')), 5000)
      )

      const result: any = await Promise.race([rpcPromise, timeoutPromise])

      terminalLog('[AuthContext] RPC returned')

      const { data, error } = result

      terminalLog('[AuthContext] RPC completed:', {
        hasData: !!data,
        hasError: !!error,
        dataLength: Array.isArray(data) ? data.length : 'not array',
        errorCode: error?.code,
        errorMessage: error?.message
      })

      if (error) {
        terminalError('[AuthContext] Error fetching profile:', error.message)
        // Return null and let the app continue without profile data
        return null
      }

      // RPC returns an array, get the first element
      const profileData = Array.isArray(data) && data.length > 0 ? data[0] : null

      if (!profileData) {
        terminalWarn('[AuthContext] No profile found for user:', userId)
        return null
      }

      terminalLog('[AuthContext] Profile fetched successfully')
      return profileData as Profile
    } catch (error: any) {
      terminalError('[AuthContext] Exception in fetchProfile:', error?.message || 'Unknown error')
      // Timeout or network error - return null and continue
      return null
    }
  }

  const refreshProfile = async () => {
    if (user) {
      const profileData = await fetchProfile(user.id)
      setProfile(profileData)
    }
  }

  useEffect(() => {
    console.log('[AuthContext] Initializing auth state...')
    let mounted = true

    // Get initial session
    const initAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()

        if (error) {
          console.error('[AuthContext] getSession error:', error)
          if (mounted) {
            setLoading(false)
          }
          return
        }

        console.log('[AuthContext] getSession completed:', {
          hasSession: !!session,
          userId: session?.user?.id,
          userEmail: session?.user?.email
        })

        if (!mounted) return

        setSession(session)
        setUser(session?.user ?? null)

        if (session?.user) {
          console.log('[AuthContext] Fetching profile for user:', session.user.id)
          const profileData = await fetchProfile(session.user.id)
          if (mounted) {
            setProfile(profileData)
            console.log('[AuthContext] Profile set, loading=false')
          }
        }
      } catch (error) {
        console.error('[AuthContext] Error in initAuth:', error)
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    initAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[AuthContext] onAuthStateChange triggered:', {
        event,
        hasSession: !!session,
        userId: session?.user?.id,
        userEmail: session?.user?.email
      })

      if (!mounted) return

      try {
        setSession(session)
        setUser(session?.user ?? null)

        if (session?.user) {
          // Small delay to ensure session is fully set in Supabase client
          console.log('[AuthContext] Auth change: Waiting for session to stabilize...')
          await new Promise(resolve => setTimeout(resolve, 100))

          if (!mounted) return

          console.log('[AuthContext] Auth change: Fetching profile for user:', session.user.id)
          const profileData = await fetchProfile(session.user.id)

          if (mounted) {
            setProfile(profileData)
            console.log('[AuthContext] Auth change: Profile set')
          }
        } else {
          console.log('[AuthContext] Auth change: No session, clearing profile')
          if (mounted) {
            setProfile(null)
          }
        }
      } catch (error) {
        console.error('[AuthContext] Error in onAuthStateChange:', error)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signUp = async (email: string, password: string, fullName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })
    return { error }
  }

  const signIn = async (email: string, password: string) => {
    console.log('[AuthContext] signIn called with email:', email)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error('[AuthContext] signIn error:', {
        message: error.message,
        status: error.status,
        name: error.name
      })
    } else {
      console.log('[AuthContext] signIn successful:', {
        userId: data.user?.id,
        userEmail: data.user?.email,
        hasSession: !!data.session
      })
    }

    return { error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setProfile(null)
  }

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    })
    return { error }
  }

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) {
      return { error: new Error('No user logged in') }
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

      if (error) {
        return { error: new Error(error.message) }
      }

      // Refresh profile after update
      await refreshProfile()
      return { error: null }
    } catch (error) {
      return { error: error as Error }
    }
  }

  const isAdmin = profile?.role === 'admin'

  const value = {
    user,
    session,
    profile,
    loading,
    isAdmin,
    signUp,
    signIn,
    signOut,
    signInWithGoogle,
    updateProfile,
    refreshProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
