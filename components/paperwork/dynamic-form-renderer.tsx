'use client'

import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { PaperworkTemplate, FormField, FormValues } from '@/types/paperwork'
import { useState } from 'react'

interface DynamicFormRendererProps {
  template: PaperworkTemplate
  onGenerate: (output: string) => void
}

// Update the main component to handle missing template property
export function DynamicFormRenderer({ template, onGenerate }: DynamicFormRendererProps) {
  // Add validation at the top of the component
  if (!template || typeof template !== 'object') {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-500">
            <h3 className="font-semibold mb-2">Invalid Template</h3>
            <p>Template data is missing or corrupted.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!template.fields || !Array.isArray(template.fields)) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-500">
            <h3 className="font-semibold mb-2">Invalid Template Structure</h3>
            <p>Template fields are missing or invalid.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const { register, handleSubmit, control, formState: { errors } } = useForm({
    defaultValues: getDefaultValues(template.fields)
  })

  const onSubmit = (data: FormValues) => {
    console.log('Form data submitted:', data)
    const output = generateOutput(template, data)
    console.log('Generated output:', output)
    onGenerate(output) // This should pass the output to the parent component
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{template.name}</CardTitle>
        <CardDescription>{template.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Your form fields */}
          {template.fields.map(field => (
            <FormFieldRenderer
              key={field.id}
              field={field}
              register={register}
              control={control}
              errors={errors}
            />
          ))}
          
          <Button type="submit" className="w-full">Generate Document</Button>
        </form>
      </CardContent>
    </Card>
  )
}

// FormFieldRenderer Component
interface FormFieldRendererProps {
  field: FormField
  register: any
  control: any
  errors: any
}

function FormFieldRenderer({ field, register, control, errors }: FormFieldRendererProps) {
  const error = errors[field.id]

  // Handle list fields as arrays
  if (field.type === 'list') {
    return <ArrayFieldRenderer field={field} control={control} errors={errors} />
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={field.id}>
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      
      {field.type === 'select' ? (
        <Controller
          name={field.id}
          control={control}
          rules={{ required: field.required ? `${field.label} is required` : false }}
          render={({ field: controllerField }) => (
            <Select onValueChange={controllerField.onChange} value={controllerField.value}>
              <SelectTrigger>
                <SelectValue placeholder={field.placeholder || `Select ${field.label}`} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      ) : field.type === 'textarea' ? (
        <Textarea
          {...register(field.id, {
            required: field.required ? `${field.label} is required` : false,
          })}
          placeholder={field.placeholder}
          rows={field.rows || 4}
        />
      ) : (
        <Input
          {...register(field.id, {
            required: field.required ? `${field.label} is required` : false,
          })}
          placeholder={field.placeholder}
          type={getInputType(field.type)}
        />
      )}
      
      {field.description && (
        <p className="text-sm text-muted-foreground">{field.description}</p>
      )}
      
      {error && (
        <p className="text-sm text-red-500">{error.message}</p>
      )}
    </div>
  )
}

// Helper function to map field types to input types
function getInputType(fieldType: string): string {
  switch (fieldType) {
    case 'date': return 'date'
    case 'url': return 'url'
    default: return 'text'
  }
}

// ArrayFieldRenderer Component for array fields (lists)
interface ArrayFieldRendererProps {
  field: FormField
  control: any
  errors: any
}

function ArrayFieldRenderer({ field, control, errors }: ArrayFieldRendererProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: field.id
  })

  const error = errors[field.id]

  return (
    <div className="space-y-3">
      <Label>
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      
      <div className="space-y-2">
        {fields.map((item, index) => (
          <div key={item.id} className="flex gap-2 items-start">
            <Input
              {...control.register(`${field.id}.${index}`)}
              placeholder={field.placeholder || `Item ${index + 1}`}
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => remove(index)}
              className="shrink-0"
            >
              Remove
            </Button>
          </div>
        ))}
        
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append('')}
        >
          Add Item
        </Button>
      </div>
      
      {field.description && (
        <p className="text-sm text-muted-foreground">{field.description}</p>
      )}
      
      {error && (
        <p className="text-sm text-red-500">{error.message}</p>
      )}
    </div>
  )
}

// Helper function to get default values
function getDefaultValues(fields: FormField[]): FormValues {
  const defaultValues: FormValues = {}
  
  fields.forEach(field => {
    // Handle list fields as arrays
    if (field.type === 'list') {
      defaultValues[field.id] = field.defaultValue || ['']
    } else {
      defaultValues[field.id] = field.defaultValue || ''
    }
  })
  
  return defaultValues
}

function generateOutput(template: PaperworkTemplate, data: FormValues): string {
  console.log('🔧 Generating output from template...')
  console.log('Template content:', template.template)
  console.log('Form data:', data)
  
  if (!template.template) {
    console.error('❌ No template content found')
    return 'Error: Template content is missing'
  }
  
  // Start with the template content
  let output = template.template
  
  // Replace all {{field_id}} placeholders with actual values
  template.fields.forEach(field => {
    const placeholder = `{{${field.id}}}`
    const value = data[field.id] || ''
    
    console.log(`Replacing ${placeholder} with:`, value)
    
    // Handle different field types
    let formattedValue = String(value || '')
    
    // Handle array fields (lists)
    if (Array.isArray(value)) {
      const nonEmptyItems = value.filter(item => item && item.trim())
      if (field.listType === 'numbered') {
        formattedValue = nonEmptyItems.map((item, index) => `${index + 1}. ${item}`).join('\n')
      } else if (field.listType === 'checkbox') {
        formattedValue = nonEmptyItems.map(item => `☐ ${item}`).join('\n')
      } else {
        formattedValue = nonEmptyItems.map(item => `• ${item}`).join('\n')
      }
    }
    
    // Replace all occurrences of the placeholder
    output = output.replace(new RegExp(placeholder, 'g'), formattedValue)
  })
  
  // Clean up any remaining empty placeholders
  output = output.replace(/\{\{[^}]+\}\}/g, '')
  
  console.log('Final output:', output)
  return output
}