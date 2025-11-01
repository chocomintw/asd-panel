'use client'

import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import categoriesIndex from '@/data/paperwork-categories/index.json'

export default function PaperworkIndex() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Paperwork Generator</h1>
        <p className="text-sm text-muted-foreground">Pick a category to open specific templates.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {categoriesIndex.map((c, idx) => (
          <Link
            key={c.id ?? idx}
            href={`/paperwork-generator/${c.folder}`}
            className="group"
          >
            <Card className="p-4 hover:-translate-y-1 transition-transform">
              <CardHeader>
                <CardTitle>{c.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">{c.description}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}