'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'
import { CalendarIcon, CheckSquare, List, Type, Calendar as CalendarLucide, Save } from 'lucide-react'
import { PaperworkTemplate } from '@/types/paperwork'
import { cn } from '@/lib/utils'

interface BBCodeFormRendererProps {
  template: PaperworkTemplate;
  onGenerate: (output: string) => void;
}

interface FormData {
  [key: string]: any;
}

interface SafeFormField {
  id: string;
  name: string;
  type: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  defaultValue?: string;
  options?: string[];
  rows?: number;
  checkedValue?: string;
  uncheckedValue?: string;
  bbcodeFormat?: {
    prefix?: string;
    suffix?: string;
    wrapInTag?: string;
  };
  localStorage?: boolean;
}

export function BBCodeFormRenderer({ template, onGenerate }: BBCodeFormRendererProps) {
  const [formData, setFormData] = useState<FormData>({})
  const [listItems, setListItems] = useState<{ [key: string]: string[] }>({})
  const [isLoaded, setIsLoaded] = useState(false)

  // Generate a unique storage key based on template
  const storageKey = `bbcode-form-${template.id}`

  // Load saved data from localStorage on component mount
  useEffect(() => {
    const loadSavedData = () => {
      try {
        const saved = localStorage.getItem(storageKey)
        if (saved) {
          const parsedData = JSON.parse(saved)
          console.log('📥 Loading saved data:', parsedData)
          
          // Set form data from localStorage
          setFormData(parsedData.formData || {})
          
          // Set list items from localStorage
          setListItems(parsedData.listItems || {})
        }
      } catch (error) {
        console.error('Error loading from localStorage:', error)
      } finally {
        setIsLoaded(true)
      }
    }

    loadSavedData()
  }, [storageKey])

  // Initialize form data AFTER localStorage is loaded
  useEffect(() => {
    if (!isLoaded) return

    const initialData: FormData = {}
    let hasInitialData = false

    template.fields?.forEach(field => {
      const safeField = field as SafeFormField
      
      // Use saved value if available, otherwise use default
      const savedValue = formData[safeField.name]
      
      if (safeField.type === 'checkbox') {
        initialData[safeField.name] = savedValue !== undefined ? savedValue : false
      } else if (safeField.type === 'list') {
        initialData[safeField.name] = []
        // Use saved list items or initialize with empty string
        const savedListItems = listItems[safeField.name]
        if (savedListItems && savedListItems.length > 0) {
          setListItems(prev => ({ ...prev, [safeField.name]: savedListItems }))
        } else {
          setListItems(prev => ({ ...prev, [safeField.name]: [''] }))
        }
      } else {
        // For text, textarea, etc. - use saved value or default
        initialData[safeField.name] = savedValue !== undefined ? savedValue : (safeField.defaultValue || '')
      }
      
      if (savedValue !== undefined) {
        hasInitialData = true
      }
    })

    // Only update form data if we have initial values to set
    if (hasInitialData) {
      setFormData(prev => ({ ...prev, ...initialData }))
    }
  }, [isLoaded, template])

  // Save to localStorage whenever formData or listItems changes
  useEffect(() => {
    if (!isLoaded) return // Don't save until we've finished loading

    const saveToStorage = () => {
      try {
        // Get fields that have localStorage enabled
        const fieldsWithLocalStorage = template.fields?.filter(field => 
          (field as SafeFormField).localStorage
        ) || []

        if (fieldsWithLocalStorage.length > 0) {
          // Only save data for fields with localStorage enabled
          const formDataToSave: FormData = {}
          const listItemsToSave: { [key: string]: string[] } = {}

          fieldsWithLocalStorage.forEach(field => {
            const safeField = field as SafeFormField
            if (formData[safeField.name] !== undefined) {
              formDataToSave[safeField.name] = formData[safeField.name]
            }
            if (listItems[safeField.name] !== undefined) {
              listItemsToSave[safeField.name] = listItems[safeField.name]
            }
          })

          const dataToSave = {
            formData: formDataToSave,
            listItems: listItemsToSave,
            savedAt: new Date().toISOString()
          }
          
          localStorage.setItem(storageKey, JSON.stringify(dataToSave))
          console.log('💾 Saved to localStorage:', dataToSave)
        }
      } catch (error) {
        console.error('Error saving to localStorage:', error)
      }
    }

    saveToStorage()
  }, [formData, listItems, storageKey, template.fields, isLoaded])

  const handleInputChange = (fieldName: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }))
  }

  const handleListChange = (listName: string, index: number, value: string) => {
    setListItems(prev => {
      const newItems = [...(prev[listName] || [])]
      newItems[index] = value
      return { ...prev, [listName]: newItems }
    })
  }

  const addListItem = (listName: string) => {
    setListItems(prev => ({
      ...prev,
      [listName]: [...(prev[listName] || []), '']
    }))
  }

  const removeListItem = (listName: string, index: number) => {
    setListItems(prev => ({
      ...prev,
      [listName]: (prev[listName] || []).filter((_, i) => i !== index)
    }))
  }

  // Clear localStorage
  const clearStorage = () => {
    localStorage.removeItem(storageKey)
    // Reset form to defaults
    const initialData: FormData = {}
    template.fields?.forEach(field => {
      const safeField = field as SafeFormField
      if (safeField.type === 'checkbox') {
        initialData[safeField.name] = false
      } else if (safeField.type === 'list') {
        initialData[safeField.name] = []
        setListItems(prev => ({ ...prev, [safeField.name]: [''] }))
      } else {
        initialData[safeField.name] = safeField.defaultValue || ''
      }
    })
    setFormData(initialData)
  }

  const generateBBCode = () => {
    let output = template.template || ''

    // Create a mapping of field identifiers to field objects
    const fieldMap = new Map()
    
    template.fields?.forEach(field => {
      const safeField = field as SafeFormField
      
      // Map by field ID (without 'field_' prefix)
      const fieldId = safeField.id.replace('field_', '')
      fieldMap.set(fieldId, safeField)
      
      // Map by field name (lowercase for case-insensitive matching)
      fieldMap.set(safeField.name.toLowerCase(), safeField)
      
      // Map by full field ID
      fieldMap.set(safeField.id, safeField)
    })

    // Process each unique placeholder only once
    const processedPlaceholders = new Set()
    
    // Use a while loop to find and replace placeholders one by one
    let placeholderMatch
    const placeholderRegex = /\{\{[^}]+\}\}/g
    
    while ((placeholderMatch = placeholderRegex.exec(output)) !== null) {
      const placeholder = placeholderMatch[0]
      
      // Skip if we've already processed this exact placeholder
      if (processedPlaceholders.has(placeholder)) {
        continue
      }

      const content = placeholder.replace('{{', '').replace('}}', '')
      
      let field: SafeFormField | undefined
      let value = ''

      for (const [key, fieldObj] of fieldMap) {
        if (content.includes(key)) {
          field = fieldObj
          break
        }
      }

      if (!field) {
        const parts = content.split(':')
        if (parts.length === 2) {
          const [type, identifier] = parts
          field = fieldMap.get(identifier) || fieldMap.get(identifier.toLowerCase())
        } else {
          field = fieldMap.get(content) || fieldMap.get(content.toLowerCase())
        }
      }

      if (field) {
        switch (field.type) {
          case 'text':
          case 'textarea':
          case 'url':
            value = formData[field.name] || ''
            break
          
          case 'date':
            if (formData[field.name]) {
              try {
                const date = new Date(formData[field.name])
                value = format(date, 'MMMM dd, yyyy')
              } catch (error) {
                value = formData[field.name] || ''
              }
            }
            break
          
          case 'select':
            value = formData[field.name] || ''
            break
          
          case 'checkbox':
            value = formData[field.name] ? 
              (field.checkedValue || '[cbc]') : 
              (field.uncheckedValue || '[cb]')
            break
          
          case 'list':
            const items = listItems[field.name]?.filter(item => item.trim()) || []
            if (items.length > 0) {
              // Create proper BBCode list format - NO [list] tags here!
              value = items.map(item => `[*]${item}`).join('')
            } else {
              value = ''
            }
            break
          
          default:
            value = ''
        }

        // Apply BBCode formatting if the field has bbcodeFormat
        if (field.bbcodeFormat) {
          const { prefix = '', suffix = '', wrapInTag = '' } = field.bbcodeFormat
          
          if (wrapInTag) {
            const tagParts = wrapInTag.split('=')
            const tagName = tagParts[0]
            const attributes = tagParts[1] ? `=${tagParts[1]}` : ''
            value = `[${tagName}${attributes}]${value}[/${tagName}]`
          }
          
          value = `${prefix}${value}${suffix}`
        }

        // Replace ALL instances of this placeholder in the output
        output = output.replace(new RegExp(placeholder, 'g'), value)
        
        // Mark this placeholder as processed
        processedPlaceholders.add(placeholder)
        
        // Reset the regex since we modified the string
        placeholderRegex.lastIndex = 0
      }
    }

    onGenerate(output)
  }

  // ... rest of your component remains the same (getFieldIcon, getFieldBadges, renderField, etc.)

  const getFieldIcon = (type: string) => {
    switch (type) {
      case 'text': return <Type className="h-4 w-4" />
      case 'textarea': return <Type className="h-4 w-4" />
      case 'date': return <CalendarLucide className="h-4 w-4" />
      case 'select': return <List className="h-4 w-4" />
      case 'checkbox': return <CheckSquare className="h-4 w-4" />
      case 'list': return <List className="h-4 w-4" />
      case 'url': return <Type className="h-4 w-4" />
      default: return <Type className="h-4 w-4" />
    }
  }

  const getFieldBadges = (field: SafeFormField) => {
    const badges = []
    
    if (field.required && field.type !== 'checkbox') {
      badges.push(
        <Badge key="required" variant="destructive" className="text-xs">
          Required
        </Badge>
      )
    }
    
    if (field.localStorage) {
      badges.push(
        <Badge key="localstorage" variant="secondary" className="text-xs">
          <Save className="h-3 w-3 mr-1" />
          Auto-save
        </Badge>
      )
    }
    
    return badges
  }

  const renderField = (field: any) => {
    const safeField = field as SafeFormField
    
    // Common props that apply to most inputs
    const commonProps = {
      id: safeField.name,
      required: safeField.required && safeField.type !== 'checkbox', // Never required for checkboxes
      placeholder: safeField.placeholder,
      className: cn(
        "bg-white/80 dark:bg-gray-900/80 border-gray-300 dark:border-gray-600",
        safeField.required && safeField.type !== 'checkbox' && "border-l-2 border-l-red-500" // Visual indicator for required fields (except checkboxes)
      )
    }

    const fieldValue = formData[safeField.name] || ''
    const showRequiredMessage = safeField.required && safeField.type !== 'checkbox' && !fieldValue

    switch (safeField.type) {
      case 'text':
      case 'url':
        return (
          <div className="space-y-2">
            <Input
              {...commonProps}
              type={safeField.type === 'url' ? 'url' : 'text'}
              value={fieldValue}
              onChange={(e) => handleInputChange(safeField.name, e.target.value)}
            />
            {showRequiredMessage && (
              <p className="text-xs text-red-500">This field is required</p>
            )}
          </div>
        )
      
      case 'textarea':
        return (
          <div className="space-y-2">
            <Textarea
              {...commonProps}
              rows={safeField.rows || 4}
              value={fieldValue}
              onChange={(e) => handleInputChange(safeField.name, e.target.value)}
            />
            {showRequiredMessage && (
              <p className="text-xs text-red-500">This field is required</p>
            )}
          </div>
        )
      
      case 'date':
        return (
          <div className="space-y-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal bg-white/80 dark:bg-gray-900/80 border-gray-300 dark:border-gray-600",
                    !fieldValue && "text-muted-foreground",
                    safeField.required && "border-l-2 border-l-red-500"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {fieldValue ? format(new Date(fieldValue), 'PPP') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={fieldValue ? new Date(fieldValue) : undefined}
                  onSelect={(date) => handleInputChange(safeField.name, date?.toISOString() || '')}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {showRequiredMessage && (
              <p className="text-xs text-red-500">This field is required</p>
            )}
          </div>
        )
      
      case 'select':
        return (
          <div className="space-y-2">
            <Select 
              value={fieldValue} 
              onValueChange={(value) => handleInputChange(safeField.name, value)}
            >
              <SelectTrigger className={cn(
                "bg-white/80 dark:bg-gray-900/80 border-gray-300 dark:border-gray-600",
                safeField.required && "border-l-2 border-l-red-500"
              )}>
                <SelectValue placeholder={safeField.placeholder || "Select an option"} />
              </SelectTrigger>
              <SelectContent>
                {safeField.options?.map((option: string, index: number) => (
                  <SelectItem key={index} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {showRequiredMessage && (
              <p className="text-xs text-red-500">This field is required</p>
            )}
          </div>
        )
      
      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Switch
              checked={fieldValue || false}
              onCheckedChange={(checked) => handleInputChange(safeField.name, checked)}
              id={safeField.name}
            />
            <Label htmlFor={safeField.name} className="text-sm">
              {fieldValue ? 
                (safeField.checkedValue || '[cbc]') : 
                (safeField.uncheckedValue || '[cb]')}
            </Label>
          </div>
        )
      
      case 'list':
        const items = listItems[safeField.name] || ['']
        const hasListItems = items.some(item => item.trim() !== '')
        
        return (
          <div className="space-y-2">
            <div className="space-y-2">
              {items.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder={`List item ${index + 1}`}
                    value={item}
                    onChange={(e) => handleListChange(safeField.name, index, e.target.value)}
                    className={cn(
                      "bg-white/80 dark:bg-gray-900/80 border-gray-300 dark:border-gray-600",
                      safeField.required && "border-l-2 border-l-red-500"
                    )}
                    required={safeField.required}
                  />
                  {items.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeListItem(safeField.name, index)}
                      className="shrink-0 bg-white/80 dark:bg-gray-900/80 border-gray-300 dark:border-gray-600"
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addListItem(safeField.name)}
                className="w-full bg-white/80 dark:bg-gray-900/80 border-gray-300 dark:border-gray-600"
              >
                Add List Item
              </Button>
            </div>
            {safeField.required && !hasListItems && (
              <p className="text-xs text-red-500">At least one list item is required</p>
            )}
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {template.fields?.map((field) => {
          const safeField = field as SafeFormField
          return (
            <Card key={safeField.id} className="border-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-transparent">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-blue-500/10">
                      {getFieldIcon(safeField.type)}
                    </div>
                    <div>
                      <CardTitle className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {safeField.label}
                      </CardTitle>
                      <CardDescription className="text-xs text-gray-600 dark:text-gray-400">
                        {safeField.type} • {safeField.required && safeField.type !== 'checkbox' ? 'Required' : 'Optional'}
                        {safeField.localStorage && ' • Auto-save enabled'}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {getFieldBadges(safeField)}
                    <Badge variant="secondary" className="backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border-transparent">
                      {safeField.type}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {renderField(field)}
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="flex gap-2">
        <Button 
          onClick={generateBBCode}
          className="flex-1 backdrop-blur-sm bg-blue-600 hover:bg-blue-700 text-white border-transparent"
          size="lg"
        >
          Generate BBCode
        </Button>
        
        <Button 
          onClick={clearStorage}
          variant="outline"
          className="backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border-transparent"
          size="lg"
        >
          Clear Saved
        </Button>
      </div>
    </div>
  )
}