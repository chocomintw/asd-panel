// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/context/auth-context'
import ProtectedRoute from '@/components/protected-route'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Discord OIDC Auth',
  description: 'Authenticate with Discord using Firebase OIDC',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ProtectedRoute>
            {children}
          </ProtectedRoute>
        </AuthProvider>
      </body>
    </html>
  )
}