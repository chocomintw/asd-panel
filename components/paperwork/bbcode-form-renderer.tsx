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

  // Debug: Check what's actually in the template fields
  useEffect(() => {
    console.log('🔍 FULL TEMPLATE FIELDS DEBUG:')
    template.fields?.forEach((field, index) => {
      console.log(`Field ${index + 1}:`, {
        name: field.name,
        label: field.label,
        type: field.type,
        // Log ALL properties to see what's available
        allProperties: field,
        hasLocalStorage: 'localStorage' in field,
        localStorageValue: (field as any).localStorage,
        stringified: JSON.stringify(field, null, 2)
      })
    })
  }, [template.fields])

  // Generate unique storage keys for each field with localStorage
  const getFieldStorageKey = (fieldName: string) => {
    return `bbcode-form-${template.id}-${fieldName}`
  }

  // Get fields that should use localStorage - with better detection
  const getFieldsWithLocalStorage = () => {
    const fields = template.fields?.filter(field => {
      const fieldAny = field as any
      
      // Check multiple possible property names and locations
      const hasLocalStorage = 
        fieldAny.localStorage === true ||
        fieldAny.localStorage === 'true' ||
        fieldAny.saveToStorage === true ||
        fieldAny.persist === true ||
        fieldAny.attributes?.localStorage === true ||
        fieldAny.settings?.localStorage === true ||
        fieldAny.metadata?.localStorage === true
      
      console.log(`🔍 Checking field "${field.name}" for localStorage:`, {
        localStorage: fieldAny.localStorage,
        saveToStorage: fieldAny.saveToStorage,
        persist: fieldAny.persist,
        attributes: fieldAny.attributes,
        settings: fieldAny.settings,
        metadata: fieldAny.metadata,
        hasLocalStorage
      })
      
      return hasLocalStorage
    }) || []

    console.log('✅ Fields with localStorage enabled:', fields.map(f => f.name))
    return fields
  }

  // Load saved data from localStorage for each field individually
  useEffect(() => {
    const loadSavedData = () => {
      try {
        const fieldsWithLocalStorage = getFieldsWithLocalStorage()
        const loadedFormData: FormData = {}
        const loadedListItems: { [key: string]: string[] } = {}

        console.log('📥 Loading saved data for fields:', fieldsWithLocalStorage.map(f => f.name))

        // Load ALL fields (not just localStorage ones) to ensure proper initialization
        template.fields?.forEach(field => {
          const safeField = field as SafeFormField
          const shouldUseLocalStorage = fieldsWithLocalStorage.some(f => f.name === safeField.name)
          
          if (shouldUseLocalStorage) {
            const fieldStorageKey = getFieldStorageKey(safeField.name)
            const saved = localStorage.getItem(fieldStorageKey)
            
            if (saved) {
              try {
                const parsedData = JSON.parse(saved)
                console.log(`- Field "${safeField.name}":`, parsedData.value)
                
                if (safeField.type === 'list') {
                  loadedListItems[safeField.name] = parsedData.value || ['']
                } else {
                  loadedFormData[safeField.name] = parsedData.value
                }
              } catch (error) {
                console.error(`Error parsing saved data for ${safeField.name}:`, error)
              }
            } else {
              console.log(`- Field "${safeField.name}": No saved data found, will use default`)
              // Initialize with default value if no saved data
              if (safeField.type === 'checkbox') {
                loadedFormData[safeField.name] = false
              } else if (safeField.type === 'list') {
                loadedListItems[safeField.name] = ['']
              } else {
                loadedFormData[safeField.name] = safeField.defaultValue || ''
              }
            }
          } else {
            // For non-localStorage fields, use defaults
            if (safeField.type === 'checkbox') {
              loadedFormData[safeField.name] = false
            } else if (safeField.type === 'list') {
              loadedListItems[safeField.name] = ['']
            } else {
              loadedFormData[safeField.name] = safeField.defaultValue || ''
            }
          }
        })

        console.log('📋 Final loaded form data:', loadedFormData)
        console.log('📋 Final loaded list items:', loadedListItems)

        // Update state with loaded data
        setFormData(loadedFormData)
        setListItems(loadedListItems)
        
      } catch (error) {
        console.error('Error loading from localStorage:', error)
      } finally {
        setIsLoaded(true)
      }
    }

    loadSavedData()
  }, [template.id])

  // Save individual fields to localStorage when they change
  useEffect(() => {
    if (!isLoaded) return

    const fieldsWithLocalStorage = getFieldsWithLocalStorage()
    
    console.log('💾 Checking fields to save:', fieldsWithLocalStorage.map(f => f.name))

    fieldsWithLocalStorage.forEach(field => {
      const safeField = field as SafeFormField
      const fieldStorageKey = getFieldStorageKey(safeField.name)
      
      let valueToSave: any

      if (safeField.type === 'list') {
        valueToSave = listItems[safeField.name] || ['']
      } else {
        valueToSave = formData[safeField.name]
      }

      // Only save if value is defined
      if (valueToSave !== undefined) {
        try {
          const dataToSave = {
            value: valueToSave,
            fieldName: safeField.name,
            fieldType: safeField.type,
            savedAt: new Date().toISOString()
          }
          
          localStorage.setItem(fieldStorageKey, JSON.stringify(dataToSave))
          console.log(`💾 Saved field "${safeField.name}":`, dataToSave)
        } catch (error) {
          console.error(`Error saving field ${safeField.name}:`, error)
        }
      }
    })
  }, [formData, listItems, template.id, isLoaded])

  const handleInputChange = (fieldName: string, value: any) => {
    console.log(`🔄 Changing field "${fieldName}" to:`, value)
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }))
  }

  const handleListChange = (listName: string, index: number, value: string) => {
    console.log(`🔄 Changing list "${listName}" item ${index} to:`, value)
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

  // Clear localStorage for all fields
  const clearStorage = () => {
    const fieldsWithLocalStorage = getFieldsWithLocalStorage()
    
    fieldsWithLocalStorage.forEach(field => {
      const safeField = field as SafeFormField
      const fieldStorageKey = getFieldStorageKey(safeField.name)
      localStorage.removeItem(fieldStorageKey)
    })
    
    console.log('🗑️ Cleared localStorage for all fields')
    
    // Reset form to defaults
    const initialData: FormData = {}
    const initialListItems: { [key: string]: string[] } = {}
    
    template.fields?.forEach(field => {
      const safeField = field as SafeFormField
      if (safeField.type === 'checkbox') {
        initialData[safeField.name] = false
      } else if (safeField.type === 'list') {
        initialData[safeField.name] = []
        initialListItems[safeField.name] = ['']
      } else {
        initialData[safeField.name] = safeField.defaultValue || ''
      }
    })
    
    setFormData(initialData)
    setListItems(initialListItems)
  }

  const generateBBCode = () => {
  let output = template.template || ''

  // Create a mapping of field identifiers to field objects
  const fieldMap = new Map()
  
  template.fields?.forEach(field => {
    const safeField = field as SafeFormField
    
    // Map by full field ID
    fieldMap.set(safeField.id, safeField)
    
    // Map by field name (exact match only)
    fieldMap.set(safeField.name, safeField)
    
    // Map by placeholder patterns
    fieldMap.set(`text:${safeField.name}`, safeField)
    fieldMap.set(`select:${safeField.name}`, safeField)
    fieldMap.set(`textarea:${safeField.name}`, safeField)
    fieldMap.set(`date:${safeField.name}`, safeField)
    fieldMap.set(`checkbox:${safeField.name}`, safeField)
    fieldMap.set(`list:${safeField.name}`, safeField)
    fieldMap.set(`url:${safeField.name}`, safeField)
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

    // Try exact matches first
    field = fieldMap.get(content) // Try exact content match
    
    // If no exact match, try type:name format
    if (!field && content.includes(':')) {
      field = fieldMap.get(content) // This will match "select:Rank" exactly
    }
    
    // If still no match, try field name only (as fallback)
    if (!field) {
      field = fieldMap.get(content) // Try content as field name
    }

    if (field) {
      console.log(`🔧 Processing field "${field.name}" (type: ${field.type}) for placeholder "${placeholder}"`)
      
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
            value = items.map(item => `${item}`).join('\n[*]')
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
      const originalOutput = output
      output = output.replace(new RegExp(placeholder, 'g'), value)
      console.log(`   - Replaced "${placeholder}" with "${value}"`)
      console.log(`   - Output changed: ${originalOutput !== output}`)
      
      // Mark this placeholder as processed
      processedPlaceholders.add(placeholder)
      
      // Reset the regex since we modified the string
      placeholderRegex.lastIndex = 0
    } else {
      console.log(`❌ No field found for placeholder: "${placeholder}"`)
    }
  }

  console.log('🎉 Final BBCode output:', output)
  onGenerate(output)
  }

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
    const fieldsWithLocalStorage = getFieldsWithLocalStorage()
    const hasLocalStorage = fieldsWithLocalStorage.some(f => f.name === field.name)
    
    console.log(`🏷️ Getting badges for "${field.name}": hasLocalStorage = ${hasLocalStorage}`)
    
    if (field.required && field.type !== 'checkbox') {
      badges.push(
        <Badge key="required" variant="destructive" className="text-xs">
          Required
        </Badge>
      )
    }
    
    if (hasLocalStorage) {
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
    const fieldsWithLocalStorage = getFieldsWithLocalStorage()
    const hasLocalStorage = fieldsWithLocalStorage.some(f => f.name === safeField.name)
    
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

    console.log(`🎨 Rendering field "${safeField.name}":`, {
      value: fieldValue,
      hasLocalStorage,
      type: safeField.type
    })

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
            {hasLocalStorage && (
              <p className="text-xs text-green-600">💾 Auto-saved</p>
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
            {hasLocalStorage && (
              <p className="text-xs text-green-600">💾 Auto-saved</p>
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
            {hasLocalStorage && (
              <p className="text-xs text-green-600">💾 Auto-saved</p>
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
            {hasLocalStorage && (
              <p className="text-xs text-green-600">💾 Auto-saved</p>
            )}
          </div>
        )
      
      case 'checkbox':
        return (
          <div className="space-y-2">
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
            {hasLocalStorage && (
              <p className="text-xs text-green-600">💾 Auto-saved</p>
            )}
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
            {hasLocalStorage && (
              <p className="text-xs text-green-600">💾 Auto-saved</p>
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
          const fieldsWithLocalStorage = getFieldsWithLocalStorage()
          const hasLocalStorage = fieldsWithLocalStorage.some(f => f.name === safeField.name)
          
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
                        {hasLocalStorage && ' • Auto-save enabled'}
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
          Clear All Saved Data
        </Button>
      </div>
    </div>
  )
}