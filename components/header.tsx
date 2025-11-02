// components/header.tsx
'use client'

import { usePathname } from 'next/navigation'
import { useAuth } from '@/context/auth-context'
import ThemeToggle from '@/components/theme-toggle'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LogOut, User, Settings, Home } from 'lucide-react'
import Link from 'next/link'

export function Header() {
  const { user, signOut } = useAuth()
  const pathname = usePathname()

  // hide header on auth pages
  if (pathname?.startsWith('/auth')) return null

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <header className="relative overflow-hidden border-b border-transparent">
      {/* Blurred background gradient */}
      <div className="absolute inset-0 bg-linear-to-br from-blue-50/80 via-white to-purple-50/80 dark:from-gray-900 dark:via-blue-950/50 dark:to-purple-900/30 backdrop-blur-md -z-10" />
      
      {/* Subtle background effects */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 left-1/4 w-[320px] h-80 rounded-full bg-linear-to-br from-blue-200/20 via-cyan-200/15 to-purple-200/10 blur-2xl opacity-60 animate-[float_8s_ease-in-out_infinite] dark:from-blue-500/5 dark:via-cyan-500/3 dark:to-purple-500/5" />
        <div className="absolute -top-16 right-1/4 w-60 h-60 rounded-full bg-linear-to-tr from-purple-200/15 via-pink-200/10 to-rose-200/10 blur-xl opacity-50 animate-[float_6s_ease-in-out_infinite_reverse] dark:from-purple-500/5 dark:via-pink-500/3 dark:to-rose-500/5" />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(120,120,120,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(120,120,120,0.02)_1px,transparent_1px)] bg-size-[32px_32px] mask-[linear-gradient(to_bottom,black,transparent)] dark:bg-[linear-gradient(rgba(180,180,180,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(180,180,180,0.03)_1px,transparent_1px)]" />
      </div>

      <div className="container flex h-16 items-center justify-between px-4 relative">
        {/* Logo/Brand section */}
        <div className="flex items-center gap-3">
          <Link 
            href="/" 
            className="flex items-center gap-2 group transition-all duration-300"
          >
            <div className="p-2 rounded-lg bg-transparent/60 dark:bg-transparent-900/60 border border-transparent group-hover:scale-110 transition-transform duration-300 shadow-xs">
              <Home className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
              <span className="font-bold text-lg text-foreground">
                Dashboard
              </span>
          </Link>
        </div>

        {/* User menu section */}
        <div className="flex items-center gap-3">
          {user && (
            <>
              {/* Theme toggle - removed glass effect */}
              <ThemeToggle />

              {/* User avatar with dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="relative h-9 w-9 rounded-full p-0 hover:bg-transparent focus:bg-transparent"
                  >
                    <Avatar className="h-9 w-9 border-2 border-white/20 dark:border-gray-800/20 shadow-xs">
                      <AvatarImage src={user?.photoURL || ''} alt={user?.displayName || 'User'} />
                      <AvatarFallback className="bg-linear-to-br from-blue-500 to-purple-600 text-white text-sm font-medium">
                        {user?.displayName ? user.displayName.charAt(0).toUpperCase() : (user?.email || '').charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent 
                  className="w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg"
                  align="end"
                >
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none text-gray-900 dark:text-gray-100">
                        {user?.displayName || 'User'}
                      </p>
                      <p className="text-xs leading-none text-gray-600 dark:text-gray-400">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200">
                    <User className="h-4 w-4 mr-2 text-gray-600 dark:text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200">
                    <Settings className="h-4 w-4 mr-2 text-gray-600 dark:text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleSignOut} 
                    className="hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200 text-red-600 dark:text-red-400"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </div>

      {/* Subtle bottom glow */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-blue-200/30 to-transparent dark:via-blue-500/10" />
    </header>
  )
}