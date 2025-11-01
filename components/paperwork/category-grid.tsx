'use client'

import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'

interface Category {
  id: string
  name: string
  description: string
  templateCount: number
}

const STATIC_CATEGORIES = [
  { 
    id: 'training-bureau', 
    name: 'Training Bureau', 
    description: 'Training and certification forms'
  },
  { 
    id: 'field-training-program', 
    name: 'Field Training Program', 
    description: 'Field training officer evaluations and reports'
  },
  { 
    id: 'basic-sergeant-supervisory-school', 
    name: 'Basic Sergeant Supervisory School', 
    description: 'Supervisory and leadership documentation'
  },
  { 
    id: 'court-services-bureau', 
    name: 'Court Services Bureau', 
    description: 'Court-related documents and legal forms'
  }
]

export function CategoryGrid() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTemplateCounts = async () => {
      try {
        const categoriesWithCounts = await Promise.all(
          STATIC_CATEGORIES.map(async (category) => {
            try {
              const response = await fetch(`/api/paperwork-generators/${category.id}`)
              if (response.ok) {
                const templates = await response.json()
                return {
                  ...category,
                  templateCount: templates.length
                }
              }
            } catch (error) {
              console.error(`Error fetching templates for ${category.id}:`, error)
            }
            return {
              ...category,
              templateCount: 0
            }
          })
        )
        setCategories(categoriesWithCounts)
      } catch (error) {
        console.error('Error fetching template counts:', error)
        setCategories(STATIC_CATEGORIES.map(cat => ({ ...cat, templateCount: 0 })))
      } finally {
        setLoading(false)
      }
    }

    fetchTemplateCounts()
  }, [])

  const navigateToCategory = (categoryId: string) => {
    router.push(`/paperwork-generators/${categoryId}`)
  }

  if (loading) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {STATIC_CATEGORIES.map((category) => (
        <Card key={category.id} className="p-6 h-full flex flex-col border-border/50">
          <div className="h-7 bg-muted rounded mb-4 min-h-14 custom-pulse"></div>
          <div className="h-12 bg-muted rounded mb-4 min-h-[60px] custom-pulse"></div>
          <div className="mt-auto space-y-2">
            <div className="h-4 bg-muted rounded w-1/2 custom-pulse"></div>
            <div className="h-4 bg-muted rounded w-3/4 custom-pulse"></div>
          </div>
        </Card>
      ))}
    </div>
  )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category) => (
        <Card 
          key={category.id} 
          className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group border-2 border-border/50 hover:border-primary/50 bg-card/50 backdrop-blur-sm h-full flex flex-col"
          onClick={() => navigateToCategory(category.id)}
        >
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-xl line-clamp-2 min-h-14 flex items-start text-card-foreground/90">
              {category.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-1 flex flex-col">
            <CardDescription className="text-sm mb-4 line-clamp-3 min-h-[60px] text-muted-foreground/80">
              {category.description}
            </CardDescription>
            <div className="mt-auto space-y-2">
              <div className="text-xs text-muted-foreground/70">
                {category.templateCount} template{category.templateCount !== 1 ? 's' : ''} available
              </div>
              <Button variant="link" className="p-0 h-auto text-primary/80 hover:text-primary font-semibold transition-colors">
                View templates →
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}