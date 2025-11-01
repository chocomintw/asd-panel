'use client'

import { useState } from 'react'
import { InputSection } from './components/input-section'
import { OutputSection } from './components/output-section'
import { ErrorSection } from './components/error-section'
import { SupportedTagsSection } from './components/supported-tags'
import { TemplateExporter } from './components/template-exporter'
import { BBCodeParser } from './lib/bbcode-parser'
import { EXAMPLE_BBCODE } from './lib/constants'

export default function BBCodeToJsonTool() {
  const [bbcode, setBBCode] = useState('')
  const [jsonOutput, setJsonOutput] = useState('')
  const [error, setError] = useState('')

  const parseBBCodeToJSON = () => {
    try {
      setError('')
      
      if (!bbcode.trim()) {
        setJsonOutput('')
        return
      }

      const parsed = BBCodeParser.parse(bbcode)
      setJsonOutput(JSON.stringify(parsed, null, 2))
    } catch (err) {
      setError('Error parsing BBCode. Please check your input.')
      console.error('Parsing error:', err)
    }
  }

  const clearAll = () => {
    setBBCode('')
    setJsonOutput('')
    setError('')
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(jsonOutput)
      alert('JSON copied to clipboard!')
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const copyTemplateToClipboard = async () => {
    try {
      const templateStructure = {
        template: {
          name: "Generated from BBCode",
          description: "Paperwork template generated from BBCode converter",
          version: "1.0",
          structure: JSON.parse(jsonOutput),
          fields: extractFieldsFromJSON(JSON.parse(jsonOutput))
        }
      };
      
      await navigator.clipboard.writeText(JSON.stringify(templateStructure, null, 2))
      alert('Template copied to clipboard!')
    } catch (err) {
      console.error('Failed to copy template:', err)
    }
  }

  const downloadTemplate = () => {
    try {
      const templateStructure = {
        template: {
          name: "Generated from BBCode",
          description: "Paperwork template generated from BBCode converter",
          version: "1.0",
          structure: JSON.parse(jsonOutput),
          fields: extractFieldsFromJSON(JSON.parse(jsonOutput))
        }
      };
      
      const blob = new Blob([JSON.stringify(templateStructure, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'paperwork-template.json'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Failed to download template:', err)
    }
  }

  const loadExample = () => {
    setBBCode(EXAMPLE_BBCODE)
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">BBCode to JSON Parser</h1>
        <p className="text-sm text-muted-foreground">
          Convert BBCode formatted text to structured JSON data for paperwork templates
        </p>
      </header>

      <div className="grid gap-6">
        <InputSection
          bbcode={bbcode}
          onBBCodeChange={setBBCode}
          onParse={parseBBCodeToJSON}
          onLoadExample={loadExample}
          onClear={clearAll}
        />

        <ErrorSection error={error} />

        {jsonOutput && (
          <>
            <OutputSection 
              jsonOutput={jsonOutput} 
              onCopy={copyToClipboard} 
            />
            
            <TemplateExporter
              jsonOutput={jsonOutput}
              onCopyTemplate={copyTemplateToClipboard}
              onDownloadTemplate={downloadTemplate}
            />
          </>
        )}

        <SupportedTagsSection />
      </div>
    </div>
  )
}

// Helper function to extract form fields from JSON structure
function extractFieldsFromJSON(jsonStructure: any): any[] {
  const fields: any[] = [];
  
  function traverse(element: any, path: string = '') {
    if (!element) return;
    
    switch (element.type) {
      case 'text':
        if (element.content && typeof element.content === 'string' && element.content.trim()) {
          fields.push({
            id: `field_${fields.length + 1}`,
            type: 'text',
            label: `Text Field ${fields.length + 1}`,
            path: path ? `${path}.content` : 'content',
            defaultValue: element.content,
            required: false
          });
        }
        break;
        
      case 'bold':
      case 'italic':
      case 'underline':
        if (element.content && typeof element.content === 'string' && element.content.trim()) {
          fields.push({
            id: `field_${fields.length + 1}`,
            type: 'text',
            label: `Formatted Text ${fields.length + 1}`,
            path: path ? `${path}.content` : 'content',
            defaultValue: element.content,
            formatting: element.type,
            required: false
          });
        }
        break;
        
      case 'list':
        if (element.items && Array.isArray(element.items)) {
          element.items.forEach((item: any, index: number) => {
            traverse(item, path ? `${path}.items[${index}]` : `items[${index}]`);
          });
        }
        break;
        
      case 'list_item':
        traverse({ type: 'text', content: element.content }, path);
        break;
    }
    
    if (element.content && Array.isArray(element.content)) {
      element.content.forEach((child: any, index: number) => {
        traverse(child, path ? `${path}.content[${index}]` : `content[${index}]`);
      });
    }
  }
  
  traverse(jsonStructure);
  return fields;
}