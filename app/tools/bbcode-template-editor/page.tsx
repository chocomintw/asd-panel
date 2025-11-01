'use client'

import { useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Download, Upload, Type, Calendar, Link, List, Plus, Trash2, Save, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

interface TemplateField {
  id: string;
  type: 'text' | 'textarea' | 'date' | 'url' | 'select' | 'list' | 'list_item';
  name: string;
  label: string;
  defaultValue?: string;
  required?: boolean;
  placeholder?: string;
  options?: string[];
  items?: TemplateField[];
  listType?: 'bullet' | 'numbered' | 'checkbox';
  rows?: number;
}

interface PaperworkTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  version?: string;
  author?: string;
  created?: string;
  baseContent?: string;
  template: string;
  fields: TemplateField[];
  formConfig?: {
    layout?: 'vertical' | 'horizontal';
    submitText?: string;
  };
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export default function BBCodeTemplateEditor() {
  const [bbcodeContent, setBBCodeContent] = useState('')
  const [template, setTemplate] = useState<PaperworkTemplate | null>(null)
  const [category, setCategory] = useState('training-bureau')
  const [templateName, setTemplateName] = useState('')
  const [templateDescription, setTemplateDescription] = useState('')
  const [validation, setValidation] = useState<ValidationResult>({ isValid: false, errors: [], warnings: [] })
  const [isGenerating, setIsGenerating] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Field type configurations
  const fieldTypes = [
    { type: 'text' as const, icon: Type, label: 'Text Input', placeholder: '{{text:field_name}}' },
    { type: 'textarea' as const, icon: Type, label: 'Text Area', placeholder: '{{textarea:field_name}}' },
    { type: 'date' as const, icon: Calendar, label: 'Date Picker', placeholder: '{{date:field_name}}' },
    { type: 'url' as const, icon: Link, label: 'URL Input', placeholder: '{{url:field_name}}' },
    { type: 'select' as const, icon: List, label: 'Dropdown', placeholder: '{{select:field_name}}' },
    { type: 'list' as const, icon: List, label: 'Bullet List', placeholder: '{{list:field_name}}' },
    { type: 'list' as const, icon: List, label: 'Numbered List', placeholder: '{{list:field_name:numbered}}' },
    { type: 'list' as const, icon: List, label: 'Checklist', placeholder: '{{list:field_name:checkbox}}' },
  ]

  const insertField = (fieldType: string, listType: string = 'bullet') => {
    if (!textareaRef.current) return

    const textarea = textareaRef.current
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = bbcodeContent.substring(start, end)
    
    const fieldName = selectedText || `field_${Date.now()}`
    
    let placeholder: string
    if (fieldType === 'list') {
      placeholder = `{{list:${fieldName}:${listType}}}`
    } else {
      placeholder = `{{${fieldType}:${fieldName}}}`
    }

    const newContent = bbcodeContent.substring(0, start) + placeholder + bbcodeContent.substring(end)
    setBBCodeContent(newContent)

    // Set cursor after inserted field
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + placeholder.length, start + placeholder.length)
    }, 0)
  }

  const insertListItem = (listName: string) => {
    if (!textareaRef.current) return

    const textarea = textareaRef.current
    const start = textarea.selectionStart
    
    const placeholder = `{{list_item:${listName}:item_${Date.now()}}}`

    const newContent = bbcodeContent.substring(0, start) + placeholder + bbcodeContent.substring(start)
    setBBCodeContent(newContent)

    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + placeholder.length, start + placeholder.length)
    }, 0)
  }

  const validateTemplateStructure = (template: PaperworkTemplate): ValidationResult => {
    const errors: string[] = []
    const warnings: string[] = []

    // Required field checks
    if (!template.id?.trim()) errors.push('Template ID is required')
    if (!template.name?.trim()) errors.push('Template name is required')
    if (!template.description?.trim()) errors.push('Template description is required')
    if (!template.category?.trim()) errors.push('Category is required')
    if (!template.template?.trim()) errors.push('Template content is required')
    
    // ID format validation
    if (template.id && !/^[a-z0-9-]+$/.test(template.id)) {
      errors.push('Template ID must contain only lowercase letters, numbers, and hyphens')
    }

    // Category validation
    const validCategories = ['training-bureau', 'field-training-program', 'basic-sergeant-supervisory-school', 'court-services-bureau']
    if (template.category && !validCategories.includes(template.category)) {
      warnings.push(`Category "${template.category}" is not in the standard list`)
    }

    // Fields validation
    if (!template.fields || !Array.isArray(template.fields)) {
      errors.push('Fields must be an array')
    } else {
      // Check for duplicate field names
      const fieldNames = template.fields.map(f => f.name)
      const duplicateNames = fieldNames.filter((name, index) => fieldNames.indexOf(name) !== index)
      if (duplicateNames.length > 0) {
        errors.push(`Duplicate field names: ${duplicateNames.join(', ')}`)
      }

      // Validate each field
      template.fields.forEach((field, index) => {
        const fieldPrefix = `Field "${field.name || 'unnamed'}":`
        
        if (!field.id?.trim()) errors.push(`${fieldPrefix} Missing ID`)
        if (!field.type?.trim()) errors.push(`${fieldPrefix} Missing type`)
        if (!field.name?.trim()) errors.push(`${fieldPrefix} Missing name`)
        if (!field.label?.trim()) errors.push(`${fieldPrefix} Missing label`)
        
        // Field type validation
        const validTypes = ['text', 'textarea', 'date', 'url', 'select', 'list', 'list_item']
        if (field.type && !validTypes.includes(field.type)) {
          errors.push(`${fieldPrefix} Invalid type "${field.type}"`)
        }

        // Select field validation
        if (field.type === 'select' && (!field.options || !Array.isArray(field.options) || field.options.length === 0)) {
          errors.push(`${fieldPrefix} Select fields must have options array with at least one option`)
        }

        // List field validation
        if (field.type === 'list') {
          if (!field.listType || !['bullet', 'numbered', 'checkbox'].includes(field.listType)) {
            errors.push(`${fieldPrefix} List fields must have a valid listType (bullet, numbered, or checkbox)`)
          }
          if (!field.items || !Array.isArray(field.items)) {
            errors.push(`${fieldPrefix} List fields must have an items array`)
          }
        }

        // List item validation
        if (field.type === 'list_item') {
          if (!field.name.includes(':')) {
            warnings.push(`${fieldPrefix} List items should reference a parent list (format: parent_list:item_id)`)
          }
        }
      })
    }

    // Check for orphaned list items
    if (template.fields) {
      const listFields = template.fields.filter(f => f.type === 'list')
      const listItemFields = template.fields.filter(f => f.type === 'list_item')
      
      listItemFields.forEach(item => {
        const parentListName = item.name.split(':')[0]
        const parentListExists = listFields.some(list => list.name === parentListName)
        if (!parentListExists) {
          errors.push(`List item "${item.name}" references non-existent parent list "${parentListName}"`)
        }
      })
    }

    // Check if all placeholders in template have corresponding fields
    const placeholderRegex = /{{(\w+):([^:}]+)(?::([^}]+))?}}/g
    const placeholders = Array.from(template.template.matchAll(placeholderRegex))
    const fieldNames = template.fields?.map(f => f.name) || []
    
    placeholders.forEach(match => {
      const fieldName = match[2]
      if (!fieldNames.includes(fieldName)) {
        warnings.push(`Placeholder "{{${match[0]}}" in content has no corresponding field`)
      }
    })

    // Check if all fields have placeholders in content
    template.fields?.forEach(field => {
      if (field.type !== 'list_item' && !template.template.includes(`{{${field.type}:${field.name}}`)) {
        warnings.push(`Field "${field.name}" has no placeholder in the template content`)
      }
    })

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    }
  }

  const validateJSON = (jsonString: string): ValidationResult => {
    const errors: string[] = []
    const warnings: string[] = []

    try {
      const parsed = JSON.parse(jsonString)
      
      // Basic JSON structure validation
      if (typeof parsed !== 'object' || parsed === null) {
        errors.push('Template must be a valid JSON object')
        return { isValid: false, errors, warnings }
      }

      // Validate against PaperworkTemplate interface
      return validateTemplateStructure(parsed as PaperworkTemplate)
      
    } catch (error) {
      errors.push('Invalid JSON format: ' + (error instanceof Error ? error.message : 'Unknown error'))
      return { isValid: false, errors, warnings }
    }
  }

  const generateTemplate = async () => {
    setIsGenerating(true)
    
    try {
      // Parse BBCode content and extract fields
      const fieldRegex = /{{(\w+):([^:}]+)(?::([^}]+))?}}/g
      const fields: TemplateField[] = []
      let match

      // First pass: collect all fields
      const fieldMap = new Map()
      
      while ((match = fieldRegex.exec(bbcodeContent)) !== null) {
        const [, fieldType, fieldName, modifier] = match
        const fieldId = fieldName.toLowerCase().replace(/[^a-z0-9]/g, '_')
        
        if (fieldType === 'list_item') {
          // List items will be handled in the second pass
          continue
        }

        // Create valid field with all required properties
        const field: TemplateField = {
          id: fieldId,
          type: fieldType as TemplateField['type'],
          name: fieldName,
          label: fieldName.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
          required: true,
          placeholder: `Enter ${fieldName.replace(/_/g, ' ')}`
        }

        // Add type-specific properties
        if (fieldType === 'list') {
          field.listType = (modifier as 'bullet' | 'numbered' | 'checkbox') || 'bullet'
          field.items = []
        } else if (fieldType === 'select') {
          field.options = ['Option 1', 'Option 2', 'Option 3']
        } else if (fieldType === 'textarea') {
          field.rows = 4
        }

        fieldMap.set(fieldName, field)
        fields.push(field)
      }

      // Second pass: handle list items
      fieldRegex.lastIndex = 0 // Reset regex
      while ((match = fieldRegex.exec(bbcodeContent)) !== null) {
        const [, fieldType, fieldName, itemId] = match
        
        if (fieldType === 'list_item') {
          const parentList = fieldMap.get(fieldName)
          if (parentList && parentList.type === 'list') {
            const itemName = itemId || `item_${parentList.items!.length + 1}`
            parentList.items!.push({
              id: itemName,
              type: 'list_item',
              name: `${fieldName}:${itemName}`,
              label: `Item ${parentList.items!.length + 1}`,
              required: false,
              placeholder: `Enter list item`
            })
          }
        }
      }

      // Create valid template with all required fields
      const newTemplate: PaperworkTemplate = {
        id: templateName.toLowerCase().replace(/[^a-z0-9-]/g, '-') || 'untitled-template',
        name: templateName || 'Untitled Template',
        description: templateDescription || 'Template generated from BBCode editor',
        category: category || 'custom',
        fields: fields,
        template: bbcodeContent,
        version: '1.0',
        author: 'ASD Panel', 
        created: new Date().toISOString().split('T')[0],
        formConfig: {
          layout: 'vertical',
          submitText: 'Generate Document'
        }
      }

      // Validate the generated template
      const validationResult = validateTemplateStructure(newTemplate)
      setValidation(validationResult)
      setTemplate(newTemplate)

      if (!validationResult.isValid) {
        console.warn('Template validation failed:', validationResult.errors)
      }

    } catch (error) {
      console.error('Error generating template:', error)
      setValidation({
        isValid: false,
        errors: ['Failed to generate template: ' + (error instanceof Error ? error.message : 'Unknown error')],
        warnings: []
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadTemplate = () => {
    if (!template) return

    // Re-validate before download
    const validationResult = validateTemplateStructure(template)
    setValidation(validationResult)

    if (!validationResult.isValid) {
      alert(`Template validation failed:\n${validationResult.errors.join('\n')}`)
      return
    }

    try {
      const jsonString = JSON.stringify(template, null, 2)
      
      // Validate JSON stringification
      JSON.parse(jsonString) // This will throw if there are circular references
      
      const blob = new Blob([jsonString], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${template.id}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      alert('Error creating template file: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  const saveToPaperworkGenerators = async () => {
    if (!template) return

    // Validate template first
    const validationResult = validateTemplateStructure(template)
    setValidation(validationResult)

    if (!validationResult.isValid) {
      alert(`Cannot save template. Please fix these issues:\n${validationResult.errors.join('\n')}`)
      return
    }

    try {
      // This would be your actual API endpoint
      const response = await fetch('/api/paperwork-generators/save-template', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          template,
          category: template.category,
          templateId: template.id
        })
      })

      if (response.ok) {
        alert(`Template "${template.name}" saved successfully to ${template.category}!`)
      } else {
        const error = await response.json()
        alert(`Error saving template: ${error.error}`)
      }
    } catch (error) {
      console.error('Error saving template:', error)
      alert('Error saving template. Please try again.')
    }
  }

  const loadTemplate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const jsonString = e.target?.result as string
        const validationResult = validateJSON(jsonString)
        
        if (!validationResult.isValid) {
          setValidation(validationResult)
          alert(`Invalid template file:\n${validationResult.errors.join('\n')}`)
          return
        }
        
        const loadedTemplate = JSON.parse(jsonString) as PaperworkTemplate
        setTemplate(loadedTemplate)
        setCategory(loadedTemplate.category)
        setTemplateName(loadedTemplate.name)
        setTemplateDescription(loadedTemplate.description)
        setValidation(validationResult)
        
        // Convert template back to editable BBCode with field placeholders
        // Use template property first, then fallback to baseContent
        let content = loadedTemplate.template || loadedTemplate.baseContent || ''
        
        // Only process if we have fields
        if (loadedTemplate.fields) {
          loadedTemplate.fields.forEach(field => {
            if (field.type === 'list') {
              const placeholder = `{{list:${field.name}:${field.listType}}}`
              content = content.replace(new RegExp(placeholder, 'g'), placeholder)
              
              // Also replace list items
              field.items?.forEach(item => {
                const itemName = item.name.split(':')[1] || item.name
                const itemPlaceholder = `{{list_item:${field.name}:${itemName}}}`
                content = content.replace(new RegExp(itemPlaceholder, 'g'), itemPlaceholder)
              })
            } else {
              const placeholder = `{{${field.type}:${field.name}}}`
              content = content.replace(new RegExp(placeholder, 'g'), placeholder)
            }
          })
        }
        
        setBBCodeContent(content)
      } catch (error) {
        setValidation({
          isValid: false,
          errors: ['Error loading template file - invalid JSON format'],
          warnings: []
        })
        alert('Error loading template file - invalid JSON format')
      }
    }
    reader.readAsText(file)
  }

  const addListItem = (listField: TemplateField) => {
    if (!template) return

    const newItem: TemplateField = {
      id: `item_${Date.now()}`,
      type: 'list_item',
      name: `${listField.name}:item_${listField.items!.length + 1}`,
      label: `Item ${listField.items!.length + 1}`,
      required: false,
      placeholder: `Enter list item`,
    }

    const updatedFields = template.fields.map(field => 
      field.id === listField.id 
        ? { ...field, items: [...field.items!, newItem] }
        : field
    )

    const updatedTemplate = { ...template, fields: updatedFields }
    setTemplate(updatedTemplate)

    // Validate after update
    setValidation(validateTemplateStructure(updatedTemplate))

    // Also add to BBCode content
    const itemName = newItem.name.split(':')[1]
    const placeholder = `{{list_item:${listField.name}:${itemName}}}`
    setBBCodeContent(prev => prev + `\n${placeholder}`)
  }

  const removeListItem = (listField: TemplateField, itemId: string) => {
    if (!template) return

    const updatedFields = template.fields.map(field =>
      field.id === listField.id
        ? { ...field, items: field.items!.filter(item => item.id !== itemId) }
        : field
    )

    const updatedTemplate = { ...template, fields: updatedFields }
    setTemplate(updatedTemplate)
    setValidation(validateTemplateStructure(updatedTemplate))

    // Remove from BBCode content
    const itemName = itemId.split(':')[1] || itemId
    const itemRegex = new RegExp(`{{list_item:${listField.name}:${itemName}}}[\\r\\n]*`, 'g')
    setBBCodeContent(prev => prev.replace(itemRegex, ''))
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">BBCode Template Editor</h1>
        <p className="text-sm text-muted-foreground">
          Create dynamic paperwork templates with form fields and lists
        </p>
      </header>

      {/* Validation Status */}
      {validation.errors.length > 0 || validation.warnings.length > 0 ? (
        <Card className={`mb-6 ${validation.isValid ? 'border-yellow-200' : 'border-red-200'}`}>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              {validation.isValid ? (
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
              )}
              <div className="flex-1">
                <h4 className={`font-semibold ${validation.isValid ? 'text-green-700' : 'text-red-700'}`}>
                  {validation.isValid ? 'Template is Valid' : 'Template Validation Failed'}
                </h4>
                
                {validation.errors.length > 0 && (
                  <div className="mt-2">
                    <h5 className="text-sm font-medium text-red-700">Errors:</h5>
                    <ul className="text-sm text-red-600 list-disc list-inside space-y-1">
                      {validation.errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {validation.warnings.length > 0 && (
                  <div className="mt-2">
                    <h5 className="text-sm font-medium text-yellow-700">Warnings:</h5>
                    <ul className="text-sm text-yellow-600 list-disc list-inside space-y-1">
                      {validation.warnings.map((warning, index) => (
                        <li key={index}>{warning}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : template && (
        <Card className="mb-6 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 text-green-700">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Template is valid and ready to use</span>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Editor Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Template Editor</CardTitle>
            <CardDescription>
              Write your BBCode and insert form fields and lists where needed
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Template Configuration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="training-bureau"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="templateName">Template Name</Label>
                <Input
                  id="templateName"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="My Template"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="templateDescription">Description</Label>
              <Input
                id="templateDescription"
                value={templateDescription}
                onChange={(e) => setTemplateDescription(e.target.value)}
                placeholder="Template description"
              />
            </div>

            {/* Field Insertion Toolbar */}
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <span className="text-sm font-medium w-full">Basic Fields:</span>
                {fieldTypes.slice(0, 5).map(({ type, icon: Icon, label, placeholder }) => (
                  <Button
                    key={`${type}-${label}`}
                    variant="outline"
                    size="sm"
                    onClick={() => insertField(type)}
                    className="flex items-center gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </Button>
                ))}
              </div>
              
              <div className="flex flex-wrap gap-2">
                <span className="text-sm font-medium w-full">Lists:</span>
                {fieldTypes.slice(5).map(({ type, icon: Icon, label, placeholder }) => (
                  <Button
                    key={`${type}-${label}`}
                    variant="outline"
                    size="sm"
                    onClick={() => insertField(type, label.toLowerCase().includes('numbered') ? 'numbered' : label.toLowerCase().includes('check') ? 'checkbox' : 'bullet')}
                    className="flex items-center gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </Button>
                ))}
              </div>
            </div>

            {/* BBCode Editor */}
            <div className="space-y-2">
              <Label htmlFor="bbcode-editor">BBCode Content with Fields</Label>
              <Textarea
                ref={textareaRef}
                id="bbcode-editor"
                value={bbcodeContent}
                onChange={(e) => setBBCodeContent(e.target.value)}
                placeholder={`[b]Document Title[/b]

{{text:document_title}}

Here's a bullet list:
{{list:features}}
{{list_item:features:item_1}}
{{list_item:features:item_2}}

Here's a numbered list:
{{list:steps:numbered}}
{{list_item:steps:step_1}}
{{list_item:steps:step_2}}

Checklist:
{{list:tasks:checkbox}}
{{list_item:tasks:task_1}}
{{list_item:tasks:task_2}}`}
                className="min-h-[400px] font-mono text-sm"
              />
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={generateTemplate} 
                disabled={!bbcodeContent.trim() || isGenerating}
              >
                {isGenerating ? 'Generating...' : 'Generate Template'}
              </Button>
              
              <Button variant="outline" asChild>
                <label className="cursor-pointer">
                  <Upload className="h-4 w-4 mr-2" />
                  Load Template
                  <input
                    type="file"
                    accept=".json"
                    onChange={loadTemplate}
                    className="hidden"
                  />
                </label>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Preview & Export Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Template Preview</CardTitle>
            <CardDescription>
              Preview and export your generated template
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {template ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="template-name">Template Name</Label>
                  <Input
                    id="template-name"
                    value={template.name}
                    onChange={(e) => setTemplate({ ...template, name: e.target.value })}
                    placeholder="Enter template name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="template-description">Description</Label>
                  <Input
                    id="template-description"
                    value={template.description}
                    onChange={(e) => setTemplate({ ...template, description: e.target.value })}
                    placeholder="Enter template description"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="template-category">Category</Label>
                  <Input
                    id="template-category"
                    value={template.category}
                    onChange={(e) => setTemplate({ ...template, category: e.target.value })}
                    placeholder="e.g., training-bureau"
                  />
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-3">Form Fields ({template.fields.length})</h4>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {template.fields.map((field) => (
                      <div
                        key={field.id}
                        className="p-3 border rounded-md border-gray-200"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="font-medium">{field.label}</div>
                            <div className="text-sm text-muted-foreground">
                              {field.type} • {field.name}
                              {field.listType && ` • ${field.listType}`}
                            </div>
                            
                            {/* List Items */}
                            {field.type === 'list' && field.items && field.items.length > 0 && (
                              <div className="mt-2 space-y-1">
                                <div className="text-xs font-medium text-muted-foreground">Items:</div>
                                {field.items.map((item) => (
                                  <div key={item.id} className="flex items-center justify-between text-sm bg-white p-2 rounded border">
                                    <span>{item.label}</span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removeListItem(field, item.id)}
                                      className="h-6 w-6 p-0"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex gap-1 ml-2">
                            {field.type === 'list' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => addListItem(field)}
                                className="h-8 w-8 p-0"
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            )}
                            <span className="px-2 py-1 text-xs bg-gray-100 rounded capitalize">
                              {field.type}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={downloadTemplate} 
                    className="flex items-center gap-2"
                    disabled={!validation.isValid}
                  >
                    <Download className="h-4 w-4" />
                    Download Template
                  </Button>
                  
                  <Button 
                    onClick={saveToPaperworkGenerators} 
                    variant="outline" 
                    className="flex items-center gap-2"
                    disabled={!validation.isValid}
                  >
                    <Save className="h-4 w-4" />
                    Save to Paperwork
                  </Button>
                </div>

                {/* Quick JSON Preview */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">JSON Preview</h4>
                  <pre className="text-xs bg-muted p-2 rounded max-h-32 overflow-y-auto">
                    {JSON.stringify({
                      id: template.id,
                      name: template.name,
                      category: template.category,
                      fields: template.fields.length,
                      valid: validation.isValid
                    }, null, 2)}
                  </pre>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Type className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Generate a template to see preview</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Field Syntax Help */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Field Syntax Reference</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Basic Fields</h4>
              <div className="space-y-1">
                <div><code>{`{{text:field_name}}`}</code> - Single line text</div>
                <div><code>{`{{textarea:content}}`}</code> - Multi-line text area</div>
                <div><code>{`{{date:post_date}}`}</code> - Date picker</div>
                <div><code>{`{{url:website_link}}`}</code> - URL input</div>
                <div><code>{`{{select:category}}`}</code> - Dropdown selection</div>
              </div>
              
              <h4 className="font-semibold mb-2 mt-4">List Fields</h4>
              <div className="space-y-1">
                <div><code>{`{{list:features}}`}</code> - Bullet list</div>
                <div><code>{`{{list:steps:numbered}}`}</code> - Numbered list</div>
                <div><code>{`{{list:tasks:checkbox}}`}</code> - Checklist</div>
                <div><code>{`{{list_item:list_name:item_id}}`}</code> - List item</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Usage Example</h4>
              <pre className="bg-muted p-3 rounded text-xs">
{`[b]Project Requirements[/b]

Key Features:
{{list:features}}
{{list_item:features:feat_1}}
{{list_item:features:feat_2}}

Implementation Steps:
{{list:steps:numbered}}
{{list_item:steps:step_1}}
{{list_item:steps:step_2}}

Tasks:
{{list:tasks:checkbox}}
{{list_item:tasks:task_1}}
{{list_item:tasks:task_2}}

Due Date: {{date:due_date}}`}</pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}