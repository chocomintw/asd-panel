import { notFound } from 'next/navigation'
import Generator from '@/components/paperwork/Generator'

type Props = { params: Promise<{ category: string; template: string }> }

export default async function TemplatePage({ params }: Props) {
  const { category, template } = await params

  // load the category index to map slugs -> file names
  let indexData: Array<{ slug?: string; file?: string; title?: string }>
  try {
    const mod = await import(`@/data/paperwork-categories/${category}/index.json`)
    indexData = mod?.default ?? mod
  } catch {
    return notFound()
  }

  const entry = indexData.find(
    (e) => (e.slug ?? (e.file ? e.file.replace(/\.json$/i, '') : undefined)) === template
  )
  if (!entry) return notFound()

  const fileName = entry.file ?? `${entry.slug ?? template}.json`

  // import the template JSON file
  let tpl: any
  try {
    const mod = await import(`@/data/paperwork-categories/${category}/${fileName}`)
    tpl = mod?.default ?? mod
  } catch {
    return notFound()
  }

  if (!tpl) return notFound()

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Generator category={tpl} />
    </div>
  )
}