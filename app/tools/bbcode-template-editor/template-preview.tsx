import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Download, Save, ArrowUpRight, Edit } from 'lucide-react';
import { PaperworkTemplate, TemplateField, ValidationResult } from './types';
import { FieldEditor } from './field-editor';

interface TemplatePreviewProps {
  template: PaperworkTemplate | null;
  validation: ValidationResult;
  onUpdateTemplate: (template: PaperworkTemplate) => void;
  onDownload: () => void;
  onSave: () => void;
}

export function TemplatePreview({
  template,
  validation,
  onUpdateTemplate,
  onDownload,
  onSave,
}: TemplatePreviewProps) {
  const updateField = (fieldId: string, updates: Partial<TemplateField>) => {
    if (!template) return;
    
    const updatedFields = template.fields.map(field =>
      field.id === fieldId ? { ...field, ...updates } : field
    );
    
    onUpdateTemplate({ ...template, fields: updatedFields });
  };

  if (!template) {
    return (
      <Card className="border-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md shadow-sm hover:shadow-lg transition-all duration-500 h-full">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-purple-500/10 backdrop-blur-sm border border-transparent">
                <Download className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <CardTitle className="text-xl text-gray-900 dark:text-gray-100">
                  Template Preview
                </CardTitle>
                <Badge variant="secondary" className="mt-2 backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border border-transparent">
                  No template
                </Badge>
              </div>
            </div>
            <ArrowUpRight className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Download className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Generate a template to see preview</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md shadow-sm hover:shadow-lg transition-all duration-500 h-full">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-green-500/10 backdrop-blur-sm border border-transparent">
              <Download className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <CardTitle className="text-xl text-gray-900 dark:text-gray-100">
                Template Preview
              </CardTitle>
              <Badge variant="secondary" className="mt-2 backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border border-transparent">
                {template.fields.length} fields
              </Badge>
            </div>
          </div>
          <ArrowUpRight className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="template-name">Template Name</Label>
          <Input
            id="template-name"
            value={template.name}
            onChange={(e) => onUpdateTemplate({ ...template, name: e.target.value })}
            placeholder="Enter template name"
            className="backdrop-blur-sm bg-white/40 dark:bg-gray-800/40 border-transparent"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="template-description">Description</Label>
          <Input
            id="template-description"
            value={template.description}
            onChange={(e) => onUpdateTemplate({ ...template, description: e.target.value })}
            placeholder="Enter template description"
            className="backdrop-blur-sm bg-white/40 dark:bg-gray-800/40 border-transparent"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="template-category">Category</Label>
          <Input
            id="template-category"
            value={template.category}
            onChange={(e) => onUpdateTemplate({ ...template, category: e.target.value })}
            placeholder="e.g., training-bureau"
            className="backdrop-blur-sm bg-white/40 dark:bg-gray-800/40 border-transparent"
          />
        </div>

        {/* Fixed: Show ALL fields with proper scrolling */}
        <div className="border rounded-lg p-4 bg-white/40 dark:bg-gray-800/40 border-transparent">
          <h4 className="font-semibold mb-3 flex items-center justify-between">
            <span>Form Fields ({template.fields.length})</span>
            <Edit className="h-4 w-4 text-gray-500" />
          </h4>
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            {template.fields.length > 0 ? (
              template.fields.map((field) => (
                <div key={field.id} className="relative">
                  <FieldEditor
                    field={field}
                    onUpdate={(updates) => updateField(field.id, updates)}
                  />
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                <p>No fields generated yet</p>
                <p className="text-sm">Add fields to your BBCode template and click "Generate Template"</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={onDownload} 
            className="flex items-center gap-2 backdrop-blur-sm bg-white/40 dark:bg-gray-800/40 hover:bg-white/60 dark:hover:bg-gray-800/60 border border-transparent"
            disabled={!validation.isValid}
          >
            <Download className="h-4 w-4" />
            Download Template
          </Button>
          
          <Button 
            onClick={onSave} 
            variant="outline" 
            className="flex items-center gap-2 backdrop-blur-sm bg-white/40 dark:bg-gray-800/40 hover:bg-white/60 dark:hover:bg-gray-800/60 border border-transparent"
            disabled={!validation.isValid}
          >
            <Save className="h-4 w-4" />
            Save to Paperwork
          </Button>
        </div>

        {/* Quick JSON Preview */}
        <div className="border rounded-lg p-4 backdrop-blur-sm bg-white/40 dark:bg-gray-800/40 border-transparent">
          <h4 className="font-semibold mb-2">JSON Preview</h4>
          <pre className="text-xs bg-muted p-2 rounded max-h-32 overflow-y-auto backdrop-blur-sm">
            {JSON.stringify({
              id: template.id,
              name: template.name,
              category: template.category,
              fields: template.fields.length,
              fieldTypes: template.fields.map(f => f.type),
              valid: validation.isValid
            }, null, 2)}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
}