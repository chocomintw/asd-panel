// context/theme-context.tsx
'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light' | 'system'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Get initial theme from localStorage or system preference
    const storedTheme = localStorage.getItem('theme') as Theme
    if (storedTheme) {
      setThemeState(storedTheme)
    }
    setMounted(true)
  }, [])

  const setTheme = (theme: Theme) => {
    setThemeState(theme)
    localStorage.setItem('theme', theme)
  }

  useEffect(() => {
    if (!mounted) return

    const root = window.document.documentElement
    root.classList.remove('light', 'dark')

    let currentTheme = theme
    if (theme === 'system') {
      currentTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }

    root.classList.add(currentTheme)
  }, [theme, mounted])

  // Don't render children until mounted to avoid hydration issues
  if (!mounted) {
    return <div style={{ visibility: 'hidden' }}>{children}</div>
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  
  if (context === undefined) {
    // Return a default theme instead of throwing error
    return {
      theme: 'system' as Theme,
      setTheme: () => {} // no-op function
    }
  }
  
  return context
}