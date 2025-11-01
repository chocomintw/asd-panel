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
import * as Icons from 'lucide-react'
import cardsData from '@/data/cards.json'

export default function Dashboard() {
  const { user } = useAuth()

  // typed view of the JSON
  const cards = cardsData as Array<{
    title: string
    description: string
    href: string
    icon: string
    color: string
  }>

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* decorative background layers */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-24 -top-32 w-[520px] h-[520px] rounded-full bg-linear-to-br from-blue-200/30 to-transparent blur-3xl opacity-80 animate-[float_12s_ease-in-out_infinite]" />
        <div className="absolute -right-24 top-40 w-[420px] h-[420px] rounded-full bg-linear-to-tr from-purple-200/25 to-transparent blur-2xl opacity-70 animate-[float_10s_ease-in-out_infinite]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.02),rgba(0,0,0,0.02))] mix-blend-overlay" />
        <svg className="absolute inset-0 w-full h-full opacity-5" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="rgba(255,255,255,0.02)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0.02)" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#g)" transform="skewX(-12)" />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome back, {user?.displayName || 'User'}!
            </h1>
            <p className="text-muted-foreground">
              Here is an overview of all accessible tools and reports you can use.
            </p>
          </div>

          {/* theme toggle removed from here */}
          <div />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map(({ title, description, href, icon, color }) => {
            const Icon = (Icons as any)[icon] ?? Icons.BookOpen
            return (
              <Link
                key={title}
                href={href}
                className="group focus:outline-none"
                aria-label={title}
              >
                <Card
                  className={
                    'relative overflow-hidden transform-gpu transition duration-500 will-change-transform ' +
                    'hover:scale-[1.03] hover:-translate-y-2 focus-visible:ring-2 focus-visible:ring-offset-2 ' +
                    'focus-visible:ring-primary/60 cursor-pointer'
                  }
                >
                  {/* animated gradient glow */}
                  <div
                    className={
                      'absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-80 transition-opacity duration-500 blur-[22px] ' +
                      (color === 'blue'
                        ? 'bg-linear-to-br from-blue-400/20 to-transparent'
                        : color === 'green'
                        ? 'bg-linear-to-br from-green-400/18 to-transparent'
                        : color === 'purple'
                        ? 'bg-linear-to-br from-purple-400/18 to-transparent'
                        : color === 'orange'
                        ? 'bg-linear-to-br from-orange-400/18 to-transparent'
                        : color === 'yellow'
                        ? 'bg-linear-to-br from-yellow-400/16 to-transparent'
                        : 'bg-linear-to-br from-red-400/18 to-transparent')
                    }
                  />

                  <span
                    className={
                      'absolute -top-8 -right-10 w-40 h-40 rounded-full opacity-0 group-hover:opacity-60 transition-all duration-700 transform-gpu ' +
                      (color === 'blue'
                        ? 'bg-blue-400/10'
                        : color === 'green'
                        ? 'bg-green-400/10'
                        : color === 'purple'
                        ? 'bg-purple-400/10'
                        : color === 'orange'
                        ? 'bg-orange-400/10'
                        : color === 'yellow'
                        ? 'bg-yellow-400/8'
                        : 'bg-red-400/10')
                    }
                  />

                  <CardHeader className="flex items-center gap-4 pb-4 relative z-10">
                    <div
                      className={
                        'w-12 h-12 rounded-lg flex items-center justify-center transition-transform duration-500 transform-gpu ' +
                        'group-hover:scale-110 group-hover:rotate-6 ' +
                        (color === 'blue'
                          ? 'bg-blue-500/10'
                          : color === 'green'
                          ? 'bg-green-500/10'
                          : color === 'purple'
                          ? 'bg-purple-500/10'
                          : color === 'orange'
                          ? 'bg-orange-500/10'
                          : color === 'yellow'
                          ? 'bg-yellow-500/10'
                          : 'bg-red-500/10')
                      }
                    >
                      <Icon className={`h-6 w-6 ${color === 'yellow' ? 'text-yellow-500' : `text-${color}-500`}`} />
                    </div>

                    <div className="min-w-0">
                      <CardTitle className="text-lg truncate">{title}</CardTitle>
                      <CardDescription className="text-sm text-muted-foreground truncate">
                        {description}
                      </CardDescription>
                    </div>
                  </CardHeader>

                  <CardContent className="relative z-10">
                    <p className="text-sm text-muted-foreground">{description}</p>
                    <div className="mt-4 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400 text-sm text-primary">
                      Open →
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}