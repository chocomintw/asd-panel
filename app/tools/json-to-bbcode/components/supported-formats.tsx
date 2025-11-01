import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SUPPORTED_FORMATS } from '../lib/constants'

function FormatCategory({ title, formats }: { title: string; formats: string[] }) {
  return (
    <div>
      <strong className="text-sm">{title}</strong>
      <div className="mt-1 space-y-1">
        {formats.map((format, index) => (
          <div key={index} className="text-xs text-muted-foreground font-mono bg-muted px-2 py-1 rounded">
            {format}
          </div>
        ))}
      </div>
    </div>
  )
}

export function SupportedFormatsSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Supported JSON Element Types</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
          <FormatCategory title="📝 Formatting" formats={SUPPORTED_FORMATS.formatting} />
          <FormatCategory title="🎨 Text Styling" formats={SUPPORTED_FORMATS.styling} />
          <FormatCategory title="↔️ Alignment" formats={SUPPORTED_FORMATS.alignment} />
          <FormatCategory title="📋 Lists" formats={SUPPORTED_FORMATS.lists} />
          <FormatCategory title="🔗 Media" formats={SUPPORTED_FORMATS.media} />
          <FormatCategory title="📦 Blocks" formats={SUPPORTED_FORMATS.blocks} />
          <FormatCategory title="📊 Tables" formats={SUPPORTED_FORMATS.tables} />
          <FormatCategory title="⚡ Special" formats={SUPPORTED_FORMATS.special} />
          <FormatCategory title="📄 Documents" formats={SUPPORTED_FORMATS.documents} />
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-sm text-blue-900 mb-2">JSON Structure Example:</h4>
          <pre className="text-xs text-blue-800 bg-white p-3 rounded border">
{`{
  "type": "bold",
  "content": "Your text here"
}`}</pre>
          <pre className="text-xs text-blue-800 bg-white p-3 rounded border mt-2">
{`{
  "type": "color",
  "color": "red", 
  "content": "Colored text"
}`}</pre>
        </div>
      </CardContent>
    </Card>
  )
}