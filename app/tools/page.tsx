'use client'

import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import toolsCategories from '@/data/tools-categories/index.json'

export default function ToolsIndex() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Administrative Tools</h1>
        <p className="text-sm text-muted-foreground">Pick a category to access specific tools.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {toolsCategories.map((tool, idx) => (
          <Link
            key={tool.id ?? idx}
            href={`/tools/${tool.folder}`}
            className="group"
          >
            <Card className="p-4 hover:-translate-y-1 transition-transform">
              <CardHeader>
                <CardTitle>{tool.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">{tool.description}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}