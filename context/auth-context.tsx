// context/auth-context.tsx
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import type { User } from 'firebase/auth'
import { getAuthClient } from '@/lib/firebase'

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let unsubscribe: (() => void) | undefined
    let mounted = true
    let fallback: ReturnType<typeof setTimeout> | null = null

    console.log('AuthProvider: init client auth subscription')

    // start fallback immediately
    fallback = setTimeout(() => {
      console.warn('AuthProvider fallback: setting loading=false after timeout')
      setLoading(false)
      fallback = null
    }, 10000)

    getAuthClient()
      .then(async (auth) => {
        if (!mounted) return
        if (!auth) {
          console.warn('getAuthClient returned null')
          if (fallback) {
            clearTimeout(fallback)
            fallback = null
          }
          setLoading(false)
          return
        }
        const { onAuthStateChanged } = await import('firebase/auth')
        unsubscribe = onAuthStateChanged(auth, (u) => {
          console.log('Auth state changed:', u ? u.email : 'No user')
          if (fallback) {
            clearTimeout(fallback)
            fallback = null
          }
          setUser(u)
          setLoading(false)
        })
      })
      .catch((err) => {
        console.error('Error initializing auth client:', err)
        if (fallback) {
          clearTimeout(fallback)
          fallback = null
        }
        setLoading(false)
      })

    return () => {
      mounted = false
      if (fallback) {
        clearTimeout(fallback)
        fallback = null
      }
      if (typeof unsubscribe === 'function') unsubscribe()
    }
  }, [])

  const signIn = async () => {
    const { signInWithDiscordOIDC } = await import('@/lib/discord-oidc')
    await signInWithDiscordOIDC()
  }

  const signOut = async () => {
    const { logout } = await import('@/lib/discord-oidc')
    await logout()
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)