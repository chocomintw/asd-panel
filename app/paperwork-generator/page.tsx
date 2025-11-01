'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import * as Icons from 'lucide-react'
import categoriesData from '@/data/paperwork-categories.json'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Copy, ChevronLeft } from 'lucide-react'
import { useClipboard } from 'use-clipboard-copy'
import { useForm } from 'react-hook-form'

/* shadcn/ui form primitives */
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

type FieldDef = { name: string; label: string; type: string; required?: boolean }
type Category = {
  id: string
  title: string
  description: string
  icon: string
  color: string
  fields: FieldDef[]
}

export default function PaperworkGenerator() {
  const categories = categoriesData as Category[]
  const [selected, setSelected] = useState<Category | null>(null)
  const [generated, setGenerated] = useState<string>('')
  const clipboard = useClipboard()

  // Create a react-hook-form instance
  const form = useForm<Record<string, any>>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {},
  })

  // Build default values when selected changes
  useEffect(() => {
    if (!selected) {
      form.reset({})
      setGenerated('')
      return
    }
    const defaults: Record<string, any> = {}
    selected.fields.forEach((f) => {
      defaults[f.name] = ''
    })
    form.reset(defaults)
    setGenerated('')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected])

  const openCategory = (cat: Category) => {
    setSelected(cat)
  }

  const escapeBB = (s: string) => s.replace(/\[/g, '\\[').replace(/\]/g, '\\]')

  const onSubmit = (values: Record<string, any>) => {
    if (!selected) return
    const lines: string[] = []
    lines.push(`[form id="${selected.id}" title="${selected.title}"]`)
    for (const f of selected.fields) {
      const val = (values[f.name] ?? '').toString().trim()
      lines.push(
        `[field name="${f.name}" type="${f.type}"]${escapeBB(val)}[/field]`
      )
    }
    lines.push(`[/form]`)
    const bb = lines.join('\n')
    setGenerated(bb)
    clipboard.copy(bb)
  }

  const handleCopy = async () => {
    if (!generated) return
    try {
      await navigator.clipboard.writeText(generated)
    } catch {
      clipboard.copy(generated)
    }
  }

  const iconFor = (name: string) => (Icons as any)[name] ?? Icons.FileText

  const selectedPreview = useMemo(() => selected, [selected])

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Paperwork Generator</h1>
            <p className="text-sm text-muted-foreground">
              Choose a category to start a quick paperwork form.
            </p>
          </div>

          {/* Unified design: Back and Return use the same Button style */}
          {selected ? (
            <Button
              variant="ghost"
              className="flex items-center gap-2"
              onClick={() => setSelected(null)}
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>
          ) : (
            <Button asChild variant="ghost" className="flex items-center gap-2">
              <Link href="/" className="inline-flex items-center gap-2">
                <ChevronLeft className="h-4 w-4 transform rotate-180" />
                <span>Return to dashboard</span>
              </Link>
            </Button>
          )}
        </header>

        {!selected ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => {
              const Icon = iconFor(cat.icon)
              return (
                <button
                  key={cat.id}
                  onClick={() => openCategory(cat)}
                  className={
                    'group text-left transform-gpu transition duration-300 hover:scale-[1.02] hover:-translate-y-1 ' +
                    'rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60'
                  }
                >
                  <Card className="p-4">
                    <CardHeader className="flex items-center gap-4 pb-2">
                      <div
                        className={
                          'w-12 h-12 rounded-md flex items-center justify-center ' +
                          (cat.color === 'blue'
                            ? 'bg-blue-500/10'
                            : cat.color === 'green'
                            ? 'bg-green-500/10'
                            : cat.color === 'purple'
                            ? 'bg-purple-500/10'
                            : cat.color === 'orange'
                            ? 'bg-orange-500/10'
                            : cat.color === 'yellow'
                            ? 'bg-yellow-500/10'
                            : 'bg-red-500/10')
                        }
                      >
                        <Icon className="h-6 w-6 text-current" />
                      </div>
                      <CardTitle className="text-base">{cat.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground pt-0">
                      {cat.description}
                    </CardContent>
                  </Card>
                </button>
              )
            })}
          </div>
        ) : (
          <section className="space-y-4">
            <Card className="p-4">
              <CardHeader className="flex items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-lg">{selected.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{selected.description}</p>
                </div>
                <div className="text-sm text-muted-foreground">Preview</div>
              </CardHeader>

              <CardContent className="space-y-4">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                    noValidate
                  >
                    <div className="grid gap-3">
                      {selectedPreview!.fields.map((f) => {
                        const key = f.name
                        const required = !!f.required
                        if (f.type === 'textarea') {
                          return (
                            <FormField
                              key={key}
                              control={form.control}
                              name={key}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{f.label}</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      {...field}
                                      value={field.value ?? ''}
                                      onChange={(e) => field.onChange(e.target.value)}
                                      className="w-full"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )
                        }

                        // default to simple input (text, date, number)
                        return (
                          <FormField
                            key={key}
                            control={form.control}
                            name={key}
                            rules={{ required: required ? `${f.label} is required` : false }}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{f.label}</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    value={field.value ?? ''}
                                    onChange={(e) => field.onChange(e.target.value)}
                                    type={f.type === 'number' ? 'number' : f.type === 'date' ? 'date' : 'text'}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )
                      })}
                    </div>

                    <div className="flex items-center gap-3 mt-4">
                      <Button type="submit">Generate BBCode</Button>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          const cleared: Record<string, any> = {}
                          selected.fields.forEach((f) => (cleared[f.name] = ''))
                          form.reset(cleared)
                          setGenerated('')
                        }}
                      >
                        Reset
                      </Button>
                    </div>
                  </form>
                </Form>

                {generated ? (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium">Generated BBCode</div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" onClick={handleCopy} className="flex items-center gap-2">
                          <Copy className="h-4 w-4" /> Copy
                        </Button>
                      </div>
                    </div>
                    <pre className="rounded-md border bg-muted p-3 text-sm overflow-auto whitespace-pre-wrap">
                      {generated}
                    </pre>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </section>
        )}
      </div>
    </div>
  )
}