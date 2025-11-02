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

interface CommitInfo {
  sha: string;
  commit: {
    author: {
      date: string;
      name: string;
    };
    message: string;
  };
  html_url: string;
}

export default function Dashboard() {
  const { user } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [commitInfo, setCommitInfo] = useState<CommitInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
    fetchLatestCommit()
  }, [])

  const fetchLatestCommit = async () => {
    try {
      const response = await fetch('/api/github-commit')
      if (response.ok) {
        const commitData = await response.json()
        setCommitInfo(commitData)
      }
    } catch (error) {
      console.error('Failed to fetch commit info:', error)
    } finally {
      setLoading(false)
    }
  }

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
      glow: 'from-blue-500/20 to-blue-600/10',
      bg: 'bg-blue-500/8'
    },
    green: { 
      light: 'from-green-500/8 to-green-600/4', 
      medium: 'from-green-500/12 to-green-600/8',
      dark: 'from-green-400/15 to-green-600/8', 
      accent: 'text-green-600',
      glow: 'from-green-500/20 to-green-600/10',
      bg: 'bg-green-500/8'
    },
    purple: { 
      light: 'from-purple-500/8 to-purple-600/4', 
      medium: 'from-purple-500/12 to-purple-600/8',
      dark: 'from-purple-400/15 to-purple-600/8', 
      accent: 'text-purple-600',
      glow: 'from-purple-500/20 to-purple-600/10',
      bg: 'bg-purple-500/8'
    },
    orange: { 
      light: 'from-orange-500/8 to-orange-600/4', 
      medium: 'from-orange-500/12 to-orange-600/8',
      dark: 'from-orange-400/15 to-orange-600/8', 
      accent: 'text-orange-600',
      glow: 'from-orange-500/20 to-orange-600/10',
      bg: 'bg-orange-500/8'
    },
    yellow: { 
      light: 'from-yellow-500/8 to-yellow-600/4', 
      medium: 'from-yellow-500/12 to-yellow-600/8',
      dark: 'from-yellow-400/15 to-yellow-600/8', 
      accent: 'text-yellow-600',
      glow: 'from-yellow-500/20 to-yellow-600/10',
      bg: 'bg-yellow-500/8'
    },
    red: { 
      light: 'from-red-500/8 to-red-600/4', 
      medium: 'from-red-500/12 to-red-600/8',
      dark: 'from-red-400/15 to-red-600/8', 
      accent: 'text-red-600',
      glow: 'from-red-500/20 to-red-600/10',
      bg: 'bg-red-500/8'
    },
  }

  const featuredCards = cards.filter(card => card.featured)
  const regularCards = cards.filter(card => !card.featured)

  const formatCommitDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) {
      return 'today'
    } else if (diffDays === 1) {
      return 'yesterday'
    } else if (diffDays < 7) {
      return `${diffDays} days ago`
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7)
      return `${weeks} week${weeks > 1 ? 's' : ''} ago`
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      })
    }
  }

  const getShortSha = (sha: string) => {
    return sha.substring(0, 7)
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-blue-950/30 dark:to-purple-900/20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50/80 via-white to-purple-50/80 dark:from-gray-900 dark:via-blue-950/50 dark:to-purple-900/30 relative overflow-hidden">
      {/* Enhanced animated gradient orbs */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {/* Light theme gradients */}
        <div className="absolute -left-24 -top-32 w-[520px] h-[520px] rounded-full bg-linear-to-br from-blue-200/40 via-cyan-200/30 to-purple-200/20 blur-3xl opacity-70 animate-[float_12s_ease-in-out_infinite] dark:from-blue-500/10 dark:via-cyan-500/5 dark:to-purple-500/10" />
        <div className="absolute -right-24 top-40 w-[420px] h-[420px] rounded-full bg-linear-to-tr from-purple-200/30 via-pink-200/20 to-rose-200/20 blur-2xl opacity-60 animate-[float_10s_ease-in-out_infinite_reverse] dark:from-purple-500/10 dark:via-pink-500/5 dark:to-rose-500/10" />
        <div className="absolute left-1/2 -bottom-32 w-[480px] h-[480px] rounded-full bg-linear-to-t from-green-200/25 via-emerald-200/20 to-cyan-200/15 blur-3xl opacity-50 animate-[float_15s_ease-in-out_infinite] dark:from-green-500/10 dark:via-emerald-500/5 dark:to-cyan-500/10" />
        
        {/* Additional subtle gradients */}
        <div className="absolute top-1/4 -right-12 w-[320px] h-80 rounded-full bg-linear-to-l from-yellow-200/20 to-orange-200/15 blur-2xl opacity-40 animate-[float_8s_ease-in-out_infinite] dark:from-yellow-500/5 dark:to-orange-500/5" />
        <div className="absolute bottom-1/4 -left-12 w-[280px] h-[280px] rounded-full bg-linear-to-r from-indigo-200/20 to-violet-200/15 blur-2xl opacity-30 animate-[float_14s_ease-in-out_infinite_reverse] dark:from-indigo-500/5 dark:to-violet-500/5" />
        
        {/* Grid pattern with theme adaptation */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(120,120,120,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(120,120,120,0.03)_1px,transparent_1px)] bg-size-[64px_64px] mask-[radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)] dark:bg-[linear-gradient(rgba(180,180,180,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(180,180,180,0.05)_1px,transparent_1px)]" />
        
        {/* Subtle noise texture */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWx0ZXI9InVybCgjYSkiIG9wYWNpdHk9Ii4wMiIvPjwvc3ZnPg==')] opacity-30 dark:opacity-10" />
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Header Section */}
        <div className="text-center mb-12 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-96 h-96 bg-linear-to-r from-primary/5 to-primary/10 rounded-full blur-3xl opacity-20 animate-pulse dark:from-primary/10 dark:to-primary/5" />
          </div>
          
          <div className="relative">
            <Badge variant="secondary" className="mb-4 animate-fade-in backdrop-blur-sm bg-white/60 dark:bg-gray-900/60 border border-transparent shadow-sm">
              👋 Welcome back
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-linear-to-br from-gray-900 via-gray-800 to-gray-700 dark:from-white dark:via-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
              Hello, {user?.displayName || 'User'}!
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Everything you need to manage your workflow efficiently. 
              <span className="block text-sm mt-2 opacity-80">Select a tool below to get started</span>
            </p>
          </div>
        </div>

        {/* Featured Cards Section */}
        {featuredCards.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold flex items-center gap-2 text-gray-800 dark:text-gray-200">
                <Icons.Star className="h-5 w-5 text-yellow-500" />
                Featured Tools
                <Badge variant="secondary" className="ml-2 backdrop-blur-sm bg-white/60 dark:bg-gray-900/60 border border-transparent">
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
                    <Card className="relative overflow-hidden border-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md shadow-sm hover:shadow-lg transition-all duration-500 group-hover:scale-[1.02] h-full border-transparent">
                      {/* Background Gradient on Hover */}
                      <div className={`absolute inset-0 bg-linear-to-br ${colors.medium} opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-lg`} />
                      
                      {/* Glow Effect */}
                      <div className={`absolute inset-0 bg-linear-to-br ${colors.glow} opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10`} />

                      <CardHeader className="pb-4 relative z-10">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-4">
                            {/* Icon without border */}
                            <div className={`p-3 rounded-xl ${colors.bg} backdrop-blur-sm group-hover:scale-110 transition-all duration-300 border border-transparent`}>
                              <Icon className={`h-6 w-6 ${colors.accent}`} />
                            </div>
                            <div>
                              <CardTitle className="text-xl flex items-center gap-2 text-gray-900 dark:text-gray-100">
                                {title}
                                <Icons.Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                              </CardTitle>
                              {category && (
                                <Badge variant="secondary" className="mt-1 text-xs backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border border-transparent">
                                  {category}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <Icons.ArrowUpRight className="h-5 w-5 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300 transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </div>
                      </CardHeader>

                      <CardContent className="relative z-10">
                        <CardDescription className="text-base leading-relaxed text-gray-600 dark:text-gray-300">
                          {description}
                        </CardDescription>
                        <div className="flex items-center justify-between mt-6">
                          <Button variant="ghost" size="sm" className="backdrop-blur-sm bg-white/40 dark:bg-gray-800/40 hover:bg-white/60 dark:hover:bg-gray-800/60 border border-transparent transition-all duration-300 text-gray-700 dark:text-gray-300">
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
            <h2 className="text-2xl font-semibold flex items-center gap-2 text-gray-800 dark:text-gray-200">
              <Icons.Grid className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              All Tools
              <Badge variant="secondary" className="ml-2 backdrop-blur-sm bg-white/60 dark:bg-gray-900/60 border border-transparent">
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
                  <Card className="relative overflow-hidden border-0 bg-white/60 dark:bg-gray-900/60 backdrop-blur-md shadow-xs hover:shadow-md transition-all duration-500 group-hover:scale-105 h-full border-transparent">
                    {/* Subtle background gradient */}
                    <div className={`absolute inset-0 bg-linear-to-br ${colors.light} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg`} />
                    
                    {/* Minimal accent line */}
                    <div className={`absolute top-4 left-0 w-1 h-8 ${colors.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-r-full`} />

                    <CardHeader className="pb-3 relative z-10">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          {/* Icon without border */}
                          <div className={`p-2 rounded-lg ${colors.bg} backdrop-blur-sm group-hover:scale-110 transition-all duration-300 border border-transparent`}>
                            <Icon className={`h-5 w-5 ${colors.accent}`} />
                          </div>
                          <div>
                            <CardTitle className="text-lg text-gray-900 dark:text-gray-100">{title}</CardTitle>
                            {category && (
                              <Badge variant="secondary" className="mt-1 text-xs backdrop-blur-sm bg-white/40 dark:bg-gray-800/40 border border-transparent">
                                {category}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Icons.ArrowUpRight className="h-4 w-4 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-300 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </div>
                    </CardHeader>

                    <CardContent className="relative z-10">
                      <CardDescription className="text-sm leading-relaxed text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                        {description}
                      </CardDescription>
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-xs text-gray-500 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors duration-300">
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
          <div className="inline-flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400 backdrop-blur-sm bg-white/40 dark:bg-gray-900/40 rounded-full px-6 py-3 border border-transparent shadow-sm">
            <div className="flex items-center gap-2">
              <Icons.CheckCircle className="h-4 w-4 text-green-500" />
              <span>{cards.length} tools available</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-gray-300/50 dark:bg-gray-600/50" />
            <div className="flex items-center gap-2">
              <Icons.Clock className="h-4 w-4 text-blue-500" />
              {loading ? (
                <span>Loading...</span>
              ) : commitInfo ? (
                <a
                  href={commitInfo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 flex items-center gap-1"
                >
                  <Icons.GitCommit className="h-3 w-3" />
                  <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                    {getShortSha(commitInfo.sha)}
                  </code>
                  <span>{formatCommitDate(commitInfo.commit.author.date)}</span>
                </a>
              ) : (
                <span>Unable to load commit info</span>
              )}
            </div>
            <div className="w-1 h-1 rounded-full bg-gray-300/50 dark:bg-gray-600/50" />
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