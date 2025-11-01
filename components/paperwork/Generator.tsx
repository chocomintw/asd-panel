'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

type FieldDef = { name: string; label: string; type: string; required?: boolean }
type Category = {
  id: string
  title: string
  description?: string
  icon?: string
  color?: string
  fields: FieldDef[]
}

export default function Generator({ category }: { category: Category }) {
  const form = useForm<Record<string, any>>({ defaultValues: {} })
  const [generated, setGenerated] = useState<string>('')

  useEffect(() => {
    const defaults: Record<string, any> = {}
    category.fields.forEach((f) => (defaults[f.name] = ''))
    form.reset(defaults)
  }, [category, form])

  const escapeBB = (s = '') => s.replace(/\[/g, '\\[').replace(/\]/g, '\\]')

  const onSubmit = (values: Record<string, any>) => {
    const lines: string[] = []
    lines.push(`[form id="${category.id}" title="${category.title}"]`)
    for (const f of category.fields) {
      const val = (values[f.name] ?? '').toString().trim()
      lines.push(`[field name="${f.name}" type="${f.type}"]${escapeBB(val)}[/field]`)
    }
    lines.push(`[/form]`)
    const bb = lines.join('\n')
    setGenerated(bb)
    try {
      navigator.clipboard.writeText(bb)
    } catch {}
  }

  return (
    <Card className="p-4">
      <CardHeader>
        <CardTitle>{category.title}</CardTitle>
        <div className="text-sm text-muted-foreground">{category.description}</div>
      </CardHeader>

      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-3">
            {category.fields.map((f) =>
              f.type === 'textarea' ? (
                <label key={f.name} className="space-y-1">
                  <div className="text-sm font-medium">{f.label}</div>
                  <Textarea {...form.register(f.name)} />
                </label>
              ) : (
                <label key={f.name} className="space-y-1">
                  <div className="text-sm font-medium">{f.label}</div>
                  <Input {...form.register(f.name)} type={f.type === 'number' ? 'number' : f.type === 'date' ? 'date' : 'text'} />
                </label>
              )
            )}
          </div>

          <div className="flex items-center gap-3 mt-4">
            <Button type="submit">Generate BBCode</Button>
            <Button variant="ghost" onClick={() => { form.reset(); setGenerated('') }}>
              Reset
            </Button>
          </div>

          {generated && (
            <div className="mt-3">
              <div className="text-sm font-medium mb-2">Generated BBCode</div>
              <pre className="rounded-md border bg-muted p-3 text-sm whitespace-pre-wrap wrap-break-word">{generated}</pre>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}