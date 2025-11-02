'use client'

import { useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Upload, Code, ArrowUpRight } from 'lucide-react'

import { PaperworkTemplate, TemplateField, ValidationResult, BBCodeFormat } from './types'
import { validateTemplateStructure, validateJSON } from './validation'
import { FieldToolbar } from './field-toolbar'
import { TemplatePreview } from './template-preview'
import { ValidationStatus } from './validation-status'
import { SyntaxHelp } from './syntax-help'
import { BBCodePreview } from './bbcode-preview';

export default function BBCodeTemplateEditor() {
  const [bbcodeContent, setBBCodeContent] = useState('')
  const [template, setTemplate] = useState<PaperworkTemplate | null>(null)
  const [category, setCategory] = useState('training-bureau')
  const [templateName, setTemplateName] = useState('')
  const [templateDescription, setTemplateDescription] = useState('')
  const [validation, setValidation] = useState<ValidationResult>({ isValid: false, errors: [], warnings: [] })
  const [isGenerating, setIsGenerating] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Fixed insertField function - matches FieldToolbar expectations
  const insertField = (fieldType: string, options: any = {}) => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = bbcodeContent.substring(start, end);
    
    const fieldName = selectedText || `field_${Date.now()}`;
    
    // Simple placeholder - just field type and name
    const placeholder = `{{${fieldType}:${fieldName}}}`;

    const newContent = bbcodeContent.substring(0, start) + placeholder + bbcodeContent.substring(end);
    setBBCodeContent(newContent);

    // Set cursor after inserted field
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + placeholder.length, start + placeholder.length);
    }, 0);
  };

  // Fixed generateTemplate function
  const generateTemplate = async () => {
  setIsGenerating(true);
  
  try {
    // Parse BBCode content and extract fields
    const fieldRegex = /{{(\w+):([^}]+)}}/g;
    const fields: TemplateField[] = [];
    let match;

    // Reset regex lastIndex to ensure we find all matches
    fieldRegex.lastIndex = 0;
    
    while ((match = fieldRegex.exec(bbcodeContent)) !== null) {
      const [, fieldType, fieldName] = match;
      
      // Skip invalid field types
      const validTypes = ['text', 'textarea', 'date', 'select', 'list', 'checkbox'];
      if (!validTypes.includes(fieldType)) {
        console.warn(`Skipping invalid field type: ${fieldType}`);
        continue;
      }

      const fieldId = fieldName.toLowerCase().replace(/[^a-z0-9]/g, '_');

      // Create base field with default BBCode formatting
      const field: TemplateField = {
        id: fieldId,
        type: fieldType as TemplateField['type'],
        name: fieldName,
        label: fieldName.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
        required: true,
        placeholder: `Enter ${fieldName.replace(/_/g, ' ')}`,
        bbcodeFormat: getDefaultBBCodeFormat(fieldType),
        rows: 0
      };

      // Add type-specific properties
      switch (fieldType) {
        case 'select':
          field.options = ['Option 1', 'Option 2', 'Option 3'];
          field.dataSource = 'custom';
          break;
        case 'textarea':
          field.rows = 4;
          break;
        case 'checkbox':
          field.checkedValue = '[cbc]';
          field.uncheckedValue = '[cb]';
          break;
        case 'date':
          field.dateFormat = 'YYYY-MM-DD';
          break;
        case 'list':
          // Lists are dynamic - no special configuration needed
          break;
      }

      fields.push(field);
    }

    console.log(`Generated ${fields.length} fields:`, fields.map(f => `${f.type}:${f.name}`));

    // Create valid template
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
    };

    // Validate the generated template
    const validationResult = validateTemplateStructure(newTemplate);
    setValidation(validationResult);
    setTemplate(newTemplate);

    if (!validationResult.isValid) {
      console.warn('Template validation failed:', validationResult.errors);
    }

  } catch (error) {
    console.error('Error generating template:', error);
    setValidation({
      isValid: false,
      errors: ['Failed to generate template: ' + (error instanceof Error ? error.message : 'Unknown error')],
      warnings: []
    });
  } finally {
    setIsGenerating(false);
  }
  };

  // Helper function for default BBCode formats
  const getDefaultBBCodeFormat = (type: string): BBCodeFormat => {
    switch (type) {
      case 'text':
        return { prefix: '', suffix: '' };
      case 'textarea':
        return { prefix: '', suffix: '\n' };
      case 'date':
        return { prefix: '', suffix: '' };
      case 'select':
        return { prefix: '', suffix: '' };
      case 'checkbox':
        return { prefix: '', suffix: '' };
      case 'list':
        return { prefix: '[list]', suffix: '[/list]' }; // Fixed format
      default:
        return { prefix: '', suffix: '' };
    }
  };

  const downloadTemplate = () => {
    if (!template) return;

    // Re-validate before download
    const validationResult = validateTemplateStructure(template);
    setValidation(validationResult);

    if (!validationResult.isValid) {
      alert(`Template validation failed:\n${validationResult.errors.join('\n')}`);
      return;
    }

    try {
      const jsonString = JSON.stringify(template, null, 2);
      
      // Validate JSON stringification
      JSON.parse(jsonString); // This will throw if there are circular references
      
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${template.id}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      alert('Error creating template file: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const saveToPaperworkGenerators = async () => {
    if (!template) return;

    // Validate template first
    const validationResult = validateTemplateStructure(template);
    setValidation(validationResult);

    if (!validationResult.isValid) {
      alert(`Cannot save template. Please fix these issues:\n${validationResult.errors.join('\n')}`);
      return;
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
      });

      if (response.ok) {
        alert(`Template "${template.name}" saved successfully to ${template.category}!`);
      } else {
        const error = await response.json();
        alert(`Error saving template: ${error.error}`);
      }
    } catch (error) {
      console.error('Error saving template:', error);
      alert('Error saving template. Please try again.');
    }
  };

  const loadTemplate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonString = e.target?.result as string;
        const validationResult = validateJSON(jsonString);
        
        if (!validationResult.isValid) {
          setValidation(validationResult);
          alert(`Invalid template file:\n${validationResult.errors.join('\n')}`);
          return;
        }
        
        const loadedTemplate = JSON.parse(jsonString) as PaperworkTemplate;
        setTemplate(loadedTemplate);
        setCategory(loadedTemplate.category);
        setTemplateName(loadedTemplate.name);
        setTemplateDescription(loadedTemplate.description);
        setValidation(validationResult);
        
        // Convert template back to editable BBCode with field placeholders
        let content = loadedTemplate.template || loadedTemplate.baseContent || '';
        
        // Only process if we have fields
        if (loadedTemplate.fields) {
          loadedTemplate.fields.forEach(field => {
            const placeholder = `{{${field.type}:${field.name}}}`;
            content = content.replace(new RegExp(placeholder, 'g'), placeholder);
          });
        }
        
        setBBCodeContent(content);
      } catch (error) {
        setValidation({
          isValid: false,
          errors: ['Error loading template file - invalid JSON format'],
          warnings: []
        });
        alert('Error loading template file - invalid JSON format');
      }
    };
    reader.readAsText(file);
  };

  const updateTemplate = (updatedTemplate: PaperworkTemplate) => {
    setTemplate(updatedTemplate);
    setValidation(validateTemplateStructure(updatedTemplate));
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50/80 via-white to-purple-50/80 dark:from-gray-900 dark:via-blue-950/50 dark:to-purple-900/30 relative overflow-hidden">
      {/* Enhanced animated gradient orbs */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {/* Light theme gradients */}
        <div className="absolute -left-24 -top-32 w-[520px] h-[520px] rounded-full bg-linear-to-br from-blue-200/40 via-cyan-200/30 to-purple-200/20 blur-3xl opacity-70 animate-[float_12s_ease-in-out_infinite] dark:from-blue-500/10 dark:via-cyan-500/5 dark:to-purple-500/10" />
        <div className="absolute -right-24 top-40 w-[420px] h-[420px] rounded-full bg-linear-to-tr from-purple-200/30 via-pink-200/20 to-rose-200/20 blur-2xl opacity-60 animate-[float_10s_ease-in-out_infinite_reverse] dark:from-purple-500/10 dark:via-pink-500/5 dark:to-rose-500/10" />
        <div className="absolute left-1/2 -bottom-32 w-[480px] h-[480px] rounded-full bg-linear-to-t from-green-200/25 via-emerald-200/20 to-cyan-200/15 blur-3xl opacity-50 animate-[float_15s_ease-in-out_infinite] dark:from-green-500/10 dark:via-emerald-500/5 dark:to-cyan-500/10" />
        
        {/* Additional subtle gradients */}
        <div className="absolute top-1/4 -right-12 w-[320px] h-80 rounded-full bg-linear-to-l from-yellow-200/20 to-orange-200/15 blur-2xl opacity-40 animate-[float_8s_ease-in-out_infinite] dark:from-yellow-500/5 dark:to-orange-500/5" />
        <div className="absolute bottom-1/4 -left-12 w-[280px] h-[280px] rounded-full bg-linear-to-r from-indigo-200/20 to-violet-200/15 blur-2xl opacity-30 animate-[float_14s_ease-in-out_infinite_reverse] dark:from-indigo-500/5 dark:to-violet-500/5" />
        
        {/* Grid pattern with theme adaptation */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(120,120,120,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(120,120,120,0.03)_1px,transparent_1px)] bg-size-[64px_64px] mask-[radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)] dark:bg-[linear-gradient(rgba(180,180,180,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(180,180,180,0.05)_1px,transparent_1px)]" />
        
        {/* Subtle noise texture */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWx0ZXI9InVybCgjYSkiIG9wYWNpdHk9Ii4wMiIvPjwvc3ZnPg==')] opacity-30 dark:opacity-10" />
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Header Section */}
        <div className="text-center mb-12 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-96 h-96 bg-linear-to-r from-primary/5 to-primary/10 rounded-full blur-3xl opacity-20 animate-pulse dark:from-primary/10 dark:to-primary/5" />
          </div>
          
          <div className="relative">
            <Badge variant="secondary" className="mb-4 animate-fade-in backdrop-blur-sm bg-white/60 dark:bg-gray-900/60 border border-transparent shadow-sm">
              🛠️ Template Builder
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-linear-to-br from-gray-900 via-gray-800 to-gray-700 dark:from-white dark:via-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
              BBCode Template Editor
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Create dynamic paperwork templates with form fields and interactive elements
              <span className="block text-sm mt-2 opacity-80">
                Drag & drop fields • Real-time preview • JSON export
              </span>
            </p>
          </div>
        </div>

        {/* Validation Status */}
        <ValidationStatus validation={validation} template={template} />

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Editor Panel */}
          <Card className="border-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md shadow-sm hover:shadow-lg transition-all duration-500 h-full">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-blue-500/10 backdrop-blur-sm border border-transparent">
                    <Code className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-gray-900 dark:text-gray-100">
                      Template Editor
                    </CardTitle>
                    <Badge variant="secondary" className="mt-2 backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border border-transparent">
                      {template?.fields?.length || 0} fields
                    </Badge>
                  </div>
                </div>
                <ArrowUpRight className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </div>
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
                    className="backdrop-blur-sm bg-white/40 dark:bg-gray-800/40 border-transparent"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="templateName">Template Name</Label>
                  <Input
                    id="templateName"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    placeholder="My Template"
                    className="backdrop-blur-sm bg-white/40 dark:bg-gray-800/40 border-transparent"
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
                  className="backdrop-blur-sm bg-white/40 dark:bg-gray-800/40 border-transparent"
                />
              </div>

              {/* Field Insertion Toolbar */}
              <FieldToolbar onInsertField={insertField} />

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

Enter description:
{{textarea:description}}

Select date:
{{date:incident_date}}

Choose location:
{{select:location}}

Agree to terms:
{{checkbox:agreement}}

List items (dynamic):
{{list:items}}`}
                  className="min-h-[400px] font-mono text-sm backdrop-blur-sm bg-white/40 dark:bg-gray-800/40 border-transparent"
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={generateTemplate} 
                  disabled={!bbcodeContent.trim() || isGenerating}
                  className="backdrop-blur-sm bg-white/40 dark:bg-gray-800/40 hover:bg-white/60 dark:hover:bg-gray-800/60 border border-transparent"
                >
                  {isGenerating ? 'Generating...' : 'Generate Template'}
                </Button>
                
                <Button variant="outline" asChild className="backdrop-blur-sm bg-white/40 dark:bg-gray-800/40 hover:bg-white/60 dark:hover:bg-gray-800/60 border border-transparent">
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

          {/* Preview Panel */}
          <TemplatePreview
            template={template}
            validation={validation}
            onUpdateTemplate={updateTemplate}
            onDownload={downloadTemplate}
            onSave={saveToPaperworkGenerators}
          />
        </div>

        {/* BBCode Output Preview - Moved outside the grid */}
        <div className="mt-6">
          <BBCodePreview template={template} bbcodeContent={bbcodeContent} />
        </div>

        {/* Syntax Help */}
        <div className="mt-6">
          <SyntaxHelp />
        </div>
      </div>
    </div>
  );
}