'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect } from 'react'

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
        
        setTemplates(templatesData)
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

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-muted rounded w-1/2 mb-8"></div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 capitalize">
          {params.category?.toString().replace(/-/g, ' ')} Templates
        </h1>
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <p className="text-destructive">Error: {error}</p>
          <p className="text-destructive/80 text-sm mt-2">
            Check the browser console for more details.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold capitalize text-foreground/90">
          {params.category?.toString().replace(/-/g, ' ')} Templates
        </h1>
        <p className="text-muted-foreground/80 mt-2">
          {templates.length} template{templates.length !== 1 ? 's' : ''} available
        </p>
      </header>
      
      {templates.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <Link
              key={template.id}
              href={`/paperwork-generators/${params.category}/${template.id}`}
              className="block p-6 border border-border/50 rounded-lg hover:border-primary/50 hover:shadow-lg transition-all duration-300 bg-card/50 backdrop-blur-sm group"
            >
              <h3 className="font-semibold text-lg mb-3 text-card-foreground/90 group-hover:text-primary/80 transition-colors">
                {template.name}
              </h3>
              <p className="text-sm text-muted-foreground/80 line-clamp-2">
                {template.description}
              </p>
              <div className="mt-4 text-xs text-primary/80 font-medium group-hover:text-primary group-hover:underline transition-colors">
                Use this template →
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border-2 border-dashed border-muted/50 rounded-lg bg-muted/20">
          <div className="text-muted-foreground/60 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-muted-foreground/80 text-lg">No templates found</p>
          <p className="text-muted-foreground/60 text-sm mt-2">
            No JSON template files found in the {params.category} directory.
          </p>
        </div>
      )}
    </div>
  )
}