'use client'

import { useState, useEffect } from 'react'
import { DynamicFormRenderer } from '@/components/paperwork/dynamic-form-renderer'
import { OutputPreview } from '@/components/paperwork/output-preview'
import { PaperworkTemplate } from '@/types/paperwork'
import { notFound, useParams } from 'next/navigation'

export default function TemplatePage() {
  const params = useParams()
  const [template, setTemplate] = useState<PaperworkTemplate | null>(null)
  const [loading, setLoading] = useState(true)
  const [generatedOutput, setGeneratedOutput] = useState('')

  useEffect(() => {
    const loadTemplate = async () => {
      try {
        // FIX: Use paperwork-generators instead of templates
        const response = await fetch(`/api/paperwork-generators/${params.category}/${params.template}`)
        console.log('📡 API Response status:', response.status)
        
        if (response.ok) {
          const templateData = await response.json()
          setTemplate(templateData)
        } else {
          console.log('❌ API returned error status')
          notFound()
        }
      } catch (error) {
        console.error('Error loading template:', error)
        notFound()
      } finally {
        setLoading(false)
      }
    }

    if (params.category && params.template) {
      loadTemplate()
    }
  }, [params.category, params.template])

  const handleGenerate = (output: string) => {
    setGeneratedOutput(output)
  }

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="h-96 bg-gray-200 rounded"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!template) {
    notFound()
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">{template.name}</h1>
        <p className="text-sm text-muted-foreground">{template.description}</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <DynamicFormRenderer 
          template={template}
          onGenerate={handleGenerate}
        />
        
        <OutputPreview output={generatedOutput} />
      </div>
    </div>
  )
}