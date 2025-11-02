'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import * as Icons from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'

interface Category {
  id: string
  name: string
  description: string
  icon: string
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red'
  templateCount: number
}

const colorMap = {
  blue: { 
    light: 'from-blue-500/8 to-blue-600/4', 
    medium: 'from-blue-500/12 to-blue-600/8',
    accent: 'text-blue-600',
    glow: 'from-blue-500/20 to-blue-600/10',
    bg: 'bg-blue-500/8'
  },
  green: { 
    light: 'from-green-500/8 to-green-600/4', 
    medium: 'from-green-500/12 to-green-600/8',
    accent: 'text-green-600',
    glow: 'from-green-500/20 to-green-600/10',
    bg: 'bg-green-500/8'
  },
  purple: { 
    light: 'from-purple-500/8 to-purple-600/4', 
    medium: 'from-purple-500/12 to-purple-600/8',
    accent: 'text-purple-600',
    glow: 'from-purple-500/20 to-purple-600/10',
    bg: 'bg-purple-500/8'
  },
  orange: { 
    light: 'from-orange-500/8 to-orange-600/4', 
    medium: 'from-orange-500/12 to-orange-600/8',
    accent: 'text-orange-600',
    glow: 'from-orange-500/20 to-orange-600/10',
    bg: 'bg-orange-500/8'
  },
  red: { 
    light: 'from-red-500/8 to-red-600/4', 
    medium: 'from-red-500/12 to-red-600/8',
    accent: 'text-red-600',
    glow: 'from-red-500/20 to-red-600/10',
    bg: 'bg-red-500/8'
  }
}

// Base categories structure
const baseCategories = [
  {
    id: 'training-bureau',
    name: 'Training Bureau',
    description: 'All BBCode formats used by Training Bureau',
    icon: 'GraduationCap',
    color: 'blue' as const
  },
  {
    id: 'field-training-program',
    name: 'Field Training Program',
    description: 'All BBCode formats used by Field Training Program',
    icon: 'Users',
    color: 'green' as const
  },
  {
    id: 'basic-sergeant-supervisory-school',
    name: 'Basic Sergeant Supervisory School',
    description: 'All BBCode formats used by the Basic Sergeant Supervisory School',
    icon: 'Award',
    color: 'purple' as const
  },
  {
    id: 'court-services-bureau',
    name: 'Court Services Bureau',
    description: 'All BBCode formats used by Court Services Bureau',
    icon: 'Scale',
    color: 'orange' as const
  },
  {
    id: 'administrative-services-division',
    name: 'Administrative Services Division Headquarters',
    description: 'All BBCode formats used by Administrative Services Division Headquarters',
    icon: 'Building',
    color: 'red' as const
  }
]

function CategoryGrid({ categories, loading }: { categories: Category[], loading: boolean }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {baseCategories.map((category, index) => (
          <Card key={category.id} className="border-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md shadow-sm">
            <CardHeader>
              <div className="animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-300/50 dark:bg-gray-700/50 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-6 bg-gray-300/50 dark:bg-gray-700/50 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-300/50 dark:bg-gray-700/50 rounded w-1/3"></div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="animate-pulse">
                <div className="h-4 bg-gray-300/50 dark:bg-gray-700/50 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-300/50 dark:bg-gray-700/50 rounded w-5/6"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
      {categories.map((category) => {
        const Icon = (Icons as any)[category.icon] ?? Icons.Folder
        const colors = colorMap[category.color]
        
        return (
          <Link
            key={category.id}
            href={`/paperwork-generators/${category.id}`}
            className="group focus:outline-none block"
          >
            <Card className="relative overflow-hidden border bg-white/70 dark:bg-gray-900/70 backdrop-blur-md shadow-sm hover:shadow-lg transition-all duration-500 group-hover:scale-[1.02] h-full border-transparent">
              {/* Background Gradient on Hover */}
              <div className={`absolute inset-0 bg-linear-to-br ${colors.medium} opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-lg`} />
              
              {/* Glow Effect */}
              <div className={`absolute inset-0 bg-linear-to-br ${colors.glow} opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10`} />

              <CardHeader className="pb-4 relative z-10">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${colors.bg} backdrop-blur-sm group-hover:scale-110 transition-all duration-300 border border-transparent`}>
                      <Icon className={`h-6 w-6 ${colors.accent}`} />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-gray-900 dark:text-gray-100">
                        {category.name}
                      </CardTitle>
                      <Badge variant="secondary" className="mt-2 backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border border-transparent text-gray-900 dark:text-white">
                        {category.templateCount} template{category.templateCount !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                  </div>
                  <Icons.ArrowUpRight className="h-5 w-5 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300 transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>
              </CardHeader>

              <CardContent className="relative z-10">
                <CardDescription className="text-base leading-relaxed text-gray-600 dark:text-gray-300">
                  {category.description}
                </CardDescription>
                <div className="flex items-center justify-between mt-6">
                  <Button variant="ghost" size="sm" className="backdrop-blur-sm bg-white/40 dark:bg-gray-800/40 hover:bg-white/60 dark:hover:bg-gray-800/60 border border-transparent transition-all duration-300 text-gray-700 dark:text-gray-300">
                    View Templates
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
      
      {/* Create Custom Template Card - Now inline with categories */}
      <Link href="/tools/bbcode-template-editor" className="group focus:outline-none block">
        <Card className="relative overflow-hidden border bg-white/70 dark:bg-gray-900/70 backdrop-blur-md shadow-sm hover:shadow-lg transition-all duration-500 group-hover:scale-[1.02] h-full border-transparent">
          {/* Background Gradient on Hover */}
          <div className="absolute inset-0 bg-linear-to-br from-purple-500/12 to-pink-500/8 opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-lg" />
          
          {/* Glow Effect */}
          <div className="absolute inset-0 bg-linear-to-br from-purple-500/20 to-pink-500/10 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10" />

          <CardHeader className="pb-4 relative z-10">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-purple-500/10 backdrop-blur-sm group-hover:scale-110 transition-all duration-300 border border-transparent">
                  <Icons.Plus className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <CardTitle className="text-xl text-gray-900 dark:text-gray-100">
                    Create Custom Template
                  </CardTitle>
                  <Badge variant="secondary" className="mt-2 backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border border-transparent text-gray-900 dark:text-white">
                    Custom Builder
                  </Badge>
                </div>
              </div>
              <Icons.ArrowUpRight className="h-5 w-5 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300 transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </div>
          </CardHeader>

          <CardContent className="relative z-10">
            <CardDescription className="text-base leading-relaxed text-gray-600 dark:text-gray-300">
              Design your own paperwork using our visual editor (reBB like) in one drag & drop interface.
            </CardDescription>
            <div className="flex items-center justify-between mt-6">
              <Button variant="ghost" size="sm" className="backdrop-blur-sm bg-white/40 dark:bg-gray-800/40 hover:bg-white/60 dark:hover:bg-gray-800/60 border border-transparent transition-all duration-300 text-gray-700 dark:text-gray-300">
                Start Creating
                <Icons.ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
              <div className="flex gap-1">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 h-1 rounded-full text-purple-600 opacity-20 group-hover:opacity-100 transition-all duration-300"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  )
}

export default function PaperworkGeneratorsPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [totalTemplates, setTotalTemplates] = useState(0)

  useEffect(() => {
    const loadCategoriesWithCounts = async () => {
      try {
        console.log('🔄 Starting to load categories with template counts...')
        
        const categoriesWithCounts = await Promise.all(
          baseCategories.map(async (category) => {
            try {
              console.log(`📡 Fetching templates for category: ${category.id}`)
              
              const response = await fetch(`/api/paperwork-generators/${category.id}`)
              console.log(`📊 Response for ${category.id}:`, response.status, response.statusText)
              
              if (response.ok) {
                const data = await response.json()
                console.log(`✅ Data received for ${category.id}:`, data)
                
                let templateCount = 0
                if (Array.isArray(data)) {
                  templateCount = data.length
                } else if (data && typeof data === 'object') {
                  templateCount = 1
                }
                
                console.log(`📈 Template count for ${category.id}: ${templateCount}`)
                
                return {
                  ...category,
                  templateCount
                }
              } else {
                console.warn(`⚠️ Failed to fetch templates for ${category.id}: ${response.status}`)
                return {
                  ...category,
                  templateCount: 0
                }
              }
            } catch (error) {
              console.error(`❌ Error loading templates for ${category.id}:`, error)
              return {
                ...category,
                templateCount: 0
              }
            }
          })
        )
        
        console.log('🎉 All categories loaded:', categoriesWithCounts)
        setCategories(categoriesWithCounts)
        
        // Calculate total templates
        const total = categoriesWithCounts.reduce((sum, cat) => sum + cat.templateCount, 0)
        setTotalTemplates(total)
      } catch (error) {
        console.error('💥 Error loading categories:', error)
        setCategories(baseCategories.map(cat => ({ ...cat, templateCount: 0 })))
      } finally {
        setLoading(false)
      }
    }

    loadCategoriesWithCounts()
  }, [])

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
            <Badge variant="secondary" className="mb-4 animate-fade-in backdrop-blur-sm bg-white/60 dark:bg-gray-900/60 border border-transparent shadow-sm text-gray-900 dark:text-white">
              📄 Paperwork Templates
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-linear-to-br from-gray-900 via-gray-800 to-gray-700 dark:from-white dark:via-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
              Paperwork Generators
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Choose a category to access pre-built paperwork templates
              <span className="block text-sm mt-2 opacity-80 text-gray-900 dark:text-white">
                {totalTemplates > 0 ? `${totalTemplates} templates available` : 'Loading templates...'}
              </span>
            </p>
          </div>
        </div>

        {/* Category Grid Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
              <Icons.FolderOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              Template Categories
              <Badge variant="secondary" className="ml-2 backdrop-blur-sm bg-white/60 dark:bg-gray-900/60 border border-transparent text-gray-900 dark:text-white">
                {categories.length + 1} categories
              </Badge>
            </h2>
          </div>
          
          <CategoryGrid categories={categories} loading={loading} />
        </div>
      </div>
    </div>
  )
}