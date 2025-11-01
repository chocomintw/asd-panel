import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

type Params = { params: { category: string } }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  return { title: `Paperwork • ${params.category}` }
}

export default async function CategoryIndex({ params }: Params) {
  const category = params.category

  let indexData: Array<{ slug?: string; file?: string; title?: string; description?: string }>
  try {
    const mod = await import(`@/data/paperwork-categories/${category}/index.json`)
    indexData = mod?.default ?? mod
  } catch {
    return notFound()
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl font-bold capitalize">{category.replace(/[-_]/g, ' ')}</h1>
        <p className="text-sm text-muted-foreground">Select a template to open its generator.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {indexData.map((t) => {
          const fileBase = t.slug ?? (t.file ? t.file.replace(/\.json$/i, '') : undefined)
          if (!fileBase) return null

          return (
            <Link key={fileBase} href={`/paperwork-generator/${category}/${fileBase}`} className="group">
              <Card className="p-4 hover:-translate-y-1 transition-transform">
                <CardHeader>
                  <CardTitle>{t.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">{t.description}</div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}