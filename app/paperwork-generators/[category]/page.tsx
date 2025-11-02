// app/paperwork-generators/[category]/page.tsx
'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import * as Icons from 'lucide-react'

interface Template {
  id: string
  name: string
  description: string
}

export default function CategoryPage() {
  const params = useParams()
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        console.log(`🔄 Loading templates for category: ${params.category}`)
        
        const response = await fetch(`/api/paperwork-generators/${params.category}`)
        console.log(`📡 Response status: ${response.status}`)
        
        if (!response.ok) {
          throw new Error(`Failed to load templates: ${response.status}`)
        }

        const templatesData = await response.json()
        console.log(`✅ Templates loaded:`, templatesData)
        
        // Handle different response formats
        if (Array.isArray(templatesData)) {
          setTemplates(templatesData)
        } else if (templatesData && typeof templatesData === 'object') {
          // If it's a single object, wrap it in an array
          setTemplates([templatesData])
        } else {
          setTemplates([])
        }
        
        setError(null)
      } catch (err) {
        console.error('💥 Error loading templates:', err)
        setError(err instanceof Error ? err.message : 'Failed to load templates')
        setTemplates([])
      } finally {
        setLoading(false)
      }
    }

    if (params.category) {
      loadTemplates()
    } else {
      setLoading(false)
    }
  }, [params.category])

  const categoryName = params.category?.toString().replace(/-/g, ' ') || 'Category'

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50/80 via-white to-purple-50/80 dark:from-gray-900 dark:via-blue-950/50 dark:to-purple-900/30 relative overflow-hidden">
        {/* Background effects */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -left-24 -top-32 w-[520px] h-[520px] rounded-full bg-linear-to-br from-blue-200/40 via-cyan-200/30 to-purple-200/20 blur-3xl opacity-70 animate-[float_12s_ease-in-out_infinite] dark:from-blue-500/10 dark:via-cyan-500/5 dark:to-purple-500/10" />
          <div className="absolute -right-24 top-40 w-[420px] h-[420px] rounded-full bg-linear-to-tr from-purple-200/30 via-pink-200/20 to-rose-200/20 blur-2xl opacity-60 animate-[float_10s_ease-in-out_infinite_reverse] dark:from-purple-500/10 dark:via-pink-500/5 dark:to-rose-500/10" />
        </div>

        <div className="max-w-7xl mx-auto p-6">
          <div className="text-center mb-12 relative">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300/50 dark:bg-gray-700/50 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-300/50 dark:bg-gray-700/50 rounded w-96 mx-auto"></div>
            </div>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="border-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md shadow-sm">
                <CardHeader>
                  <div className="animate-pulse">
                    <div className="h-6 bg-gray-300/50 dark:bg-gray-700/50 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-300/50 dark:bg-gray-700/50 rounded w-full"></div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-300/50 dark:bg-gray-700/50 rounded w-1/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
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
        
        {/* Grid pattern with theme adaptation */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(120,120,120,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(120,120,120,0.03)_1px,transparent_1px)] bg-size-[64px_64px] mask-[radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)] dark:bg-[linear-gradient(rgba(180,180,180,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(180,180,180,0.05)_1px,transparent_1px)]" />
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Header Section */}
        <div className="text-center mb-12 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-96 h-96 bg-linear-to-r from-primary/5 to-primary/10 rounded-full blur-3xl opacity-20 animate-pulse dark:from-primary/10 dark:to-primary/5" />
          </div>
          
          <div className="relative">
            <Badge variant="secondary" className="mb-4 animate-fade-in backdrop-blur-sm bg-white/60 dark:bg-gray-900/60 border border-transparent shadow-sm capitalize">
              📁 {categoryName}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-linear-to-br from-gray-900 via-gray-800 to-gray-700 dark:from-white dark:via-gray-200 dark:to-gray-400 bg-clip-text text-transparent capitalize">
              {categoryName} Templates
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              {templates.length} professional template{templates.length !== 1 ? 's' : ''} ready to use
              <span className="block text-sm mt-2 opacity-80">Select a template to get started</span>
            </p>
          </div>
        </div>

        {error && (
          <Card className="mb-6 border-0 bg-red-50/80 dark:bg-red-900/20 backdrop-blur-md shadow-sm border-transparent">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Icons.AlertTriangle className="h-5 w-5 text-red-500" />
                <p className="text-red-700 dark:text-red-300">Error: {error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Templates Grid */}
        {templates.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {templates.map((template) => (
              <Link
                key={template.id}
                href={`/paperwork-generators/${params.category}/${template.id}`}
                className="group focus:outline-none block"
              >
                <Card className="relative overflow-hidden border-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md shadow-sm hover:shadow-lg transition-all duration-500 group-hover:scale-105 h-full border-transparent">
                  {/* Background Gradient on Hover */}
                  <div className="absolute inset-0 bg-linear-to-br from-blue-500/8 to-purple-500/6 opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-lg" />
                  
                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-linear-to-br from-blue-500/12 to-purple-500/8 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10" />

                  <CardHeader className="pb-3 relative z-10">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-500/10 backdrop-blur-sm group-hover:scale-110 transition-all duration-300 border border-transparent">
                          <Icons.FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <CardTitle className="text-lg text-gray-900 dark:text-gray-100 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors">
                            {template.name}
                          </CardTitle>
                        </div>
                      </div>
                      <Icons.ArrowUpRight className="h-4 w-4 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-300 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </CardHeader>

                  <CardContent className="relative z-10">
                    <CardDescription className="text-sm leading-relaxed text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                      {template.description}
                    </CardDescription>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-xs text-gray-500 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors duration-300">
                        Use this template
                      </span>
                      <div className="flex gap-0.5">
                        {[...Array(2)].map((_, i) => (
                          <div
                            key={i}
                            className="w-1 h-1 rounded-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-all duration-300"
                            style={{ animationDelay: `${i * 0.2}s` }}
                          />
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="max-w-2xl mx-auto">
            <Card className="border-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md shadow-lg text-center border-transparent">
              <CardContent className="p-12">
                <div className="text-gray-400 dark:text-gray-600 mb-6">
                  <Icons.FileSearch className="w-20 h-20 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  No Templates Found
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-2">
                  No JSON template files found in the {categoryName} directory.
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  Check the data directory or create new templates using the template editor.
                </p>
                <Button asChild variant="outline" className="backdrop-blur-sm bg-white/40 dark:bg-gray-800/40 border border-transparent">
                  <Link href="/tools/bbcode-template-editor">
                    <Icons.Plus className="h-4 w-4 mr-2" />
                    Create Template
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Back to Categories */}
        <div className="mt-12 text-center">
          <Button asChild variant="ghost" className="backdrop-blur-sm bg-white/40 dark:bg-gray-800/40 border border-transparent">
            <Link href="/paperwork-generators">
              <Icons.ArrowLeft className="h-4 w-4 mr-2" />
              Back to Categories
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}