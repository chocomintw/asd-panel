'use client'

import { useState, useEffect } from 'react'
import { DynamicFormRenderer } from '@/components/paperwork/dynamic-form-renderer'
import { OutputPreview } from '@/components/paperwork/output-preview'
import { PaperworkTemplate } from '@/types/paperwork'
import { notFound, useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import * as Icons from 'lucide-react'

export default function TemplatePage() {
  const params = useParams()
  const [template, setTemplate] = useState<PaperworkTemplate | null>(null)
  const [loading, setLoading] = useState(true)
  const [generatedOutput, setGeneratedOutput] = useState('')

  useEffect(() => {
    const loadTemplate = async () => {
      try {
        console.log(`🔄 Loading template: ${params.category}/${params.template}`)
        
        const response = await fetch(`/api/paperwork-generators/${params.category}/${params.template}`)
        console.log('📡 API Response status:', response.status)
        
        if (response.ok) {
          const templateData = await response.json()
          console.log('✅ Template loaded successfully:', templateData.name)
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
    console.log('📝 Output generated, length:', output.length)
    setGeneratedOutput(output)
  }

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
          
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md shadow-sm">
              <CardHeader>
                <div className="animate-pulse">
                  <div className="h-6 bg-gray-300/50 dark:bg-gray-700/50 rounded w-3/4 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-300/50 dark:bg-gray-700/50 rounded w-full"></div>
                    <div className="h-4 bg-gray-300/50 dark:bg-gray-700/50 rounded w-5/6"></div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="animate-pulse space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-12 bg-gray-300/50 dark:bg-gray-700/50 rounded"></div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md shadow-sm">
              <CardHeader>
                <div className="animate-pulse">
                  <div className="h-6 bg-gray-300/50 dark:bg-gray-700/50 rounded w-1/2 mb-4"></div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="animate-pulse">
                  <div className="h-64 bg-gray-300/50 dark:bg-gray-700/50 rounded"></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (!template) {
    notFound()
  }

  const categoryName = params.category?.toString().replace(/-/g, ' ') || 'Category'
  const templateName = template.name || params.template?.toString().replace(/-/g, ' ') || 'Template'

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
              {categoryName}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-linear-to-br from-gray-900 via-gray-800 to-gray-700 dark:from-white dark:via-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
              {templateName}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              {template.description || 'Fill out the form below to generate your document'}
              <span className="block text-sm mt-2 opacity-80">
                {template.fields?.length || 0} fields to complete
              </span>
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Form Section */}
          <div className="space-y-4">
            <Card className="border-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md shadow-lg border-transparent">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                  <Icons.Edit3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Document Form
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  Fill out all the required fields to generate your document
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DynamicFormRenderer 
                  template={template}
                  onGenerate={handleGenerate}
                />
              </CardContent>
            </Card>

            {/* Template Info */}
            <Card className="border-0 bg-white/60 dark:bg-gray-900/60 backdrop-blur-md shadow-sm border-transparent">
              <CardHeader>
                <CardTitle className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Template Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Category:</span>
                    <p className="text-gray-900 dark:text-gray-100 font-medium capitalize">{categoryName}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Fields:</span>
                    <p className="text-gray-900 dark:text-gray-100 font-medium">{template.fields?.length || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Output Preview Section */}
          <div className="space-y-4">
            <Card className="border-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md shadow-lg border-transparent">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                  <Icons.FileText className="h-5 w-5 text-green-600 dark:text-green-400" />
                  Output Preview
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  {generatedOutput ? 
                    'Your generated document is ready' : 
                    'Fill out the form to see the generated output'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <OutputPreview output={generatedOutput} />
              </CardContent>
            </Card>

            {/* Quick Actions */}
            {generatedOutput && (
              <Card className="border-0 bg-white/60 dark:bg-gray-900/60 backdrop-blur-md shadow-sm border-transparent">
                <CardHeader>
                  <CardTitle className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="backdrop-blur-sm bg-green-500/10 text-green-700 dark:text-green-300 border border-transparent">
                      ✓ Ready
                    </Badge>
                    <Badge variant="secondary" className="backdrop-blur-sm bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-transparent">
                      {generatedOutput.length} chars
                    </Badge>
                    <Badge variant="secondary" className="backdrop-blur-sm bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-transparent">
                      {generatedOutput.split('\n').length} lines
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}