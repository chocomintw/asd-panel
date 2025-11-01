// components/protected-route.tsx
'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/context/auth-context'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  console.log('ProtectedRoute state:', { pathname, loading, user })

  const isAuthRoute = !!pathname?.startsWith('/auth')

  // If user just signed in while on an auth page, send them to the app root
  useEffect(() => {
    if (user && isAuthRoute) {
      router.replace('/')
    }
  }, [user, isAuthRoute, router])

  const shouldRedirect = !loading && !user && !isAuthRoute

  useEffect(() => {
    if (shouldRedirect && pathname !== '/auth') {
      router.replace('/auth')
    }
  }, [shouldRedirect, router, pathname])

  // single return path to avoid hook-order issues
  let content: React.ReactNode = null

  if (loading) {
    content = (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  } else if (isAuthRoute) {
    content = <>{children}</>
  } else if (shouldRedirect) {
    content = null
  } else {
    content = <>{children}</>
  }

  return <>{content}</>
}