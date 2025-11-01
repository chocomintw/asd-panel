// app/page.tsx
'use client'

import Link from 'next/link'
import { useAuth } from '@/context/auth-context'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import * as Icons from 'lucide-react'
import cardsData from '@/data/cards.json'
import { useState, useEffect } from 'react'

export default function Dashboard() {
  const { user } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // typed view of the JSON
  const cards = cardsData as Array<{
    title: string
    description: string
    href: string
    icon: string
    color: string
    category?: string
    featured?: boolean
  }>

  const colorMap = {
    blue: { 
      light: 'from-blue-500/8 to-blue-600/4', 
      medium: 'from-blue-500/12 to-blue-600/8',
      dark: 'from-blue-400/15 to-blue-600/8', 
      accent: 'text-blue-600',
      glow: 'from-blue-500/20 to-blue-600/10'
    },
    green: { 
      light: 'from-green-500/8 to-green-600/4', 
      medium: 'from-green-500/12 to-green-600/8',
      dark: 'from-green-400/15 to-green-600/8', 
      accent: 'text-green-600',
      glow: 'from-green-500/20 to-green-600/10'
    },
    purple: { 
      light: 'from-purple-500/8 to-purple-600/4', 
      medium: 'from-purple-500/12 to-purple-600/8',
      dark: 'from-purple-400/15 to-purple-600/8', 
      accent: 'text-purple-600',
      glow: 'from-purple-500/20 to-purple-600/10'
    },
    orange: { 
      light: 'from-orange-500/8 to-orange-600/4', 
      medium: 'from-orange-500/12 to-orange-600/8',
      dark: 'from-orange-400/15 to-orange-600/8', 
      accent: 'text-orange-600',
      glow: 'from-orange-500/20 to-orange-600/10'
    },
    yellow: { 
      light: 'from-yellow-500/8 to-yellow-600/4', 
      medium: 'from-yellow-500/12 to-yellow-600/8',
      dark: 'from-yellow-400/15 to-yellow-600/8', 
      accent: 'text-yellow-600',
      glow: 'from-yellow-500/20 to-yellow-600/10'
    },
    red: { 
      light: 'from-red-500/8 to-red-600/4', 
      medium: 'from-red-500/12 to-red-600/8',
      dark: 'from-red-400/15 to-red-600/8', 
      accent: 'text-red-600',
      glow: 'from-red-500/20 to-red-600/10'
    },
  }

  const featuredCards = cards.filter(card => card.featured)
  const regularCards = cards.filter(card => !card.featured)

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Enhanced background layers */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {/* Animated gradient orbs */}
        <div className="absolute -left-24 -top-32 w-[520px] h-[520px] rounded-full bg-linear-to-br from-blue-200/20 via-purple-200/15 to-transparent blur-3xl opacity-60 animate-[float_12s_ease-in-out_infinite]" />
        <div className="absolute -right-24 top-40 w-[420px] h-[420px] rounded-full bg-linear-to-tr from-purple-200/20 via-pink-200/10 to-transparent blur-2xl opacity-50 animate-[float_10s_ease-in-out_infinite_reverse]" />
        <div className="absolute left-1/2 -bottom-32 w-[480px] h-[480px] rounded-full bg-linear-to-t from-green-200/15 via-cyan-200/10 to-transparent blur-3xl opacity-40 animate-[float_15s_ease-in-out_infinite]" />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-size-[64px_64px] mask-[radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Header Section */}
        <div className="text-center mb-12 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-96 h-96 bg-linear-to-r from-primary/3 to-primary/8 rounded-full blur-3xl opacity-20 animate-pulse" />
          </div>
          
          <div className="relative">
            <Badge variant="secondary" className="mb-4 animate-fade-in backdrop-blur-sm bg-background/50 border-0">
              👋 Welcome back
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-linear-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
              Hello, {user?.displayName || 'User'}!
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Everything you need to manage your workflow efficiently. 
              <span className="block text-sm mt-2 opacity-80">Select a tool below to get started</span>
            </p>
          </div>
        </div>

        {/* Featured Cards Section */}
        {featuredCards.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <Icons.Star className="h-5 w-5 text-yellow-500" />
                Featured Tools
                <Badge variant="secondary" className="ml-2 backdrop-blur-sm bg-background/50 border-0">
                  {featuredCards.length}
                </Badge>
              </h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {featuredCards.map(({ title, description, href, icon, color, category }) => {
                const Icon = (Icons as any)[icon] ?? Icons.Star
                const colors = colorMap[color as keyof typeof colorMap] || colorMap.blue
                
                return (
                  <Link
                    key={title}
                    href={href}
                    className="group focus:outline-none block"
                    aria-label={title}
                  >
                    <Card className="relative overflow-hidden border-0 bg-linear-to-br from-background/50 to-background/30 backdrop-blur-sm shadow-sm hover:shadow-lg transition-all duration-500 group-hover:scale-[1.02] h-full">
                      {/* Background Gradient on Hover */}
                      <div className={`absolute inset-0 bg-linear-to-br ${colors.medium} opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-lg`} />
                      
                      {/* Glow Effect */}
                      <div className={`absolute inset-0 bg-linear-to-br ${colors.glow} opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10`} />

                      <CardHeader className="pb-4 relative z-10">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl bg-linear-to-br ${colors.light} backdrop-blur-sm border border-border/10 group-hover:scale-110 transition-all duration-300`}>
                              <Icon className={`h-6 w-6 ${colors.accent}`} />
                            </div>
                            <div>
                              <CardTitle className="text-xl flex items-center gap-2">
                                {title}
                                <Icons.Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                              </CardTitle>
                              {category && (
                                <Badge variant="secondary" className="mt-1 text-xs backdrop-blur-sm bg-background/30 border-0">
                                  {category}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <Icons.ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors duration-300 transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </div>
                      </CardHeader>

                      <CardContent className="relative z-10">
                        <CardDescription className="text-base leading-relaxed text-foreground/70">
                          {description}
                        </CardDescription>
                        <div className="flex items-center justify-between mt-6">
                          <Button variant="ghost" size="sm" className="backdrop-blur-sm bg-background/30 hover:bg-background/50 border-0 transition-all duration-300">
                            Open Tool
                            <Icons.ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                          </Button>
                          <div className="flex gap-1">
                            {[...Array(3)].map((_, i) => (
                              <div
                                key={i}
                                className={`w-1 h-1 rounded-full ${colors.accent} opacity-20 group-hover:opacity-100 transition-all duration-300`}
                                style={{ animationDelay: `${i * 0.1}s` }}
                              />
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* All Tools Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <Icons.Grid className="h-5 w-5 text-primary" />
              All Tools
              <Badge variant="secondary" className="ml-2 backdrop-blur-sm bg-background/50 border-0">
                {regularCards.length}
              </Badge>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularCards.map(({ title, description, href, icon, color, category }) => {
              const Icon = (Icons as any)[icon] ?? Icons.BookOpen
              const colors = colorMap[color as keyof typeof colorMap] || colorMap.blue
              
              return (
                <Link
                  key={title}
                  href={href}
                  className="group focus:outline-none block"
                  aria-label={title}
                >
                  <Card className="relative overflow-hidden border-0 bg-background/40 backdrop-blur-sm shadow-xs hover:shadow-md transition-all duration-500 group-hover:scale-105 h-full">
                    {/* Subtle background gradient */}
                    <div className={`absolute inset-0 bg-linear-to-br ${colors.light} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg`} />
                    
                    {/* Minimal accent line */}
                    <div className={`absolute top-4 left-0 w-1 h-8 ${colors.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-r-full`} />

                    <CardHeader className="pb-3 relative z-10">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg bg-background/50 backdrop-blur-sm border border-border/5 group-hover:bg-linear-to-br ${colors.light} group-hover:scale-110 transition-all duration-300`}>
                            <Icon className={`h-5 w-5 ${colors.accent}`} />
                          </div>
                          <div>
                            <CardTitle className="text-lg text-foreground/90">{title}</CardTitle>
                            {category && (
                              <Badge variant="secondary" className="mt-1 text-xs backdrop-blur-sm bg-background/30 border-0">
                                {category}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Icons.ArrowUpRight className="h-4 w-4 text-muted-foreground/70 group-hover:text-foreground transition-colors duration-300 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </div>
                    </CardHeader>

                    <CardContent className="relative z-10">
                      <CardDescription className="text-sm leading-relaxed text-foreground/60 group-hover:text-foreground/70 transition-colors duration-300">
                        {description}
                      </CardDescription>
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-xs text-muted-foreground/60 group-hover:text-foreground/60 transition-colors duration-300">
                          Click to open
                        </span>
                        <div className="flex gap-0.5">
                          {[...Array(2)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-1 h-1 rounded-full ${colors.accent} opacity-0 group-hover:opacity-100 transition-all duration-300`}
                              style={{ animationDelay: `${i * 0.2}s` }}
                            />
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Footer Stats */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-6 text-sm text-muted-foreground/60 backdrop-blur-sm bg-background/30 rounded-full px-6 py-3 border-0">
            <div className="flex items-center gap-2">
              <Icons.CheckCircle className="h-4 w-4 text-green-500" />
              <span>{cards.length} tools available</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-border/30" />
            <div className="flex items-center gap-2">
              <Icons.Clock className="h-4 w-4 text-blue-500" />
              <span>Updated recently</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-border/30" />
            <div className="flex items-center gap-2">
              <Icons.Shield className="h-4 w-4 text-purple-500" />
              <span>Secure access</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}