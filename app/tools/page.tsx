'use client'

import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowUpRight } from 'lucide-react'
import toolsCategories from '@/data/tools-categories/index.json'

export default function ToolsIndex() {
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
              🛠️ Tool Collection
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-linear-to-br from-gray-900 via-gray-800 to-gray-700 dark:from-white dark:via-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
              Administrative Tools
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Powerful tools to streamline your administrative workflows
              <span className="block text-sm mt-2 opacity-80">
                Pick a tool to get started with your data conversion and template creation needs
              </span>
            </p>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {toolsCategories.map((tool) => (
            <Link
              key={tool.id}
              href={`/tools/${tool.folder}`}
              className="group"
            >
              <Card className="border-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md shadow-sm hover:shadow-lg transition-all duration-500 h-full group-hover:-translate-y-2">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-blue-500/10 backdrop-blur-sm border border-transparent">
                        <div className="w-6 h-6 flex items-center justify-center text-blue-600 dark:text-blue-400 text-lg">
                          {tool.icon}
                        </div>
                      </div>
                      <div>
                        <CardTitle className="text-xl text-gray-900 dark:text-gray-100">
                          {tool.title}
                        </CardTitle>
                        <Badge variant="secondary" className="mt-2 backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border border-transparent">
                          {tool.category}
                        </Badge>
                      </div>
                    </div>
                    <ArrowUpRight className="h-5 w-5 text-gray-500 dark:text-gray-400 group-hover:scale-110 transition-transform" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground leading-relaxed">
                    {tool.description}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Category Summary */}
        <div className="mt-12 border rounded-lg p-6 bg-white/40 dark:bg-gray-800/40 border-transparent backdrop-blur-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Tool Categories</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-2">Data Conversion</h4>
              <p className="text-sm">Convert between different data formats like BBCode and JSON</p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-2">Template Creation</h4>
              <p className="text-sm">Create and manage dynamic paperwork templates with form fields</p>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-8">
          <div className="border-t pt-6 border-gray-200/50 dark:border-gray-700/50">
            <p className="text-sm text-muted-foreground">
              Need a custom tool? <span className="text-primary">Contact @chocomintw</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}