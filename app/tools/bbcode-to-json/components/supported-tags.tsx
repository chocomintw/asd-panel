import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SUPPORTED_TAGS } from '../lib/constants'

function TagCategory({ title, tags }: { title: string; tags: string[] }) {
  return (
    <div>
      <strong>{title}</strong>
      {tags.map((tag, index) => (
        <div key={index} className="text-xs">{tag}</div>
      ))}
    </div>
  )
}

export function SupportedTagsSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Supported BBCode Tags</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 text-sm">
          <TagCategory title="📝 Formatting" tags={SUPPORTED_TAGS.formatting} />
          <TagCategory title="🎨 Styling" tags={SUPPORTED_TAGS.styling} />
          <TagCategory title="↔️ Alignment" tags={SUPPORTED_TAGS.alignment} />
          <TagCategory title="📋 Lists" tags={SUPPORTED_TAGS.lists} />
          <TagCategory title="🖼️ Media" tags={SUPPORTED_TAGS.media} />
          <TagCategory title="📦 Blocks" tags={SUPPORTED_TAGS.blocks} />
          <TagCategory title="📊 Tables" tags={SUPPORTED_TAGS.tables} />
          <TagCategory title="⚡ Special" tags={SUPPORTED_TAGS.special} />
          <TagCategory title="📄 Documents" tags={SUPPORTED_TAGS.documents} />
        </div>
      </CardContent>
    </Card>
  )
}