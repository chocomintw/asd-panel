import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Download, Save, ArrowUpRight, Edit, Trash2 } from 'lucide-react';
import { PaperworkTemplate, TemplateField, ValidationResult } from './types';
import { FieldEditor } from './field-editor';
import { useEffect, useState } from 'react';

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
  const [useLocalStorage, setUseLocalStorage] = useState(false);

  const getFieldStorageKey = (fieldName: string) => {
    return `bbcode-form-${template?.id}-${fieldName}`;
  };

  // Load localStorage preference on component mount
  useEffect(() => {
    const savedPreference = localStorage.getItem('template-use-localstorage');
    if (savedPreference) {
      setUseLocalStorage(JSON.parse(savedPreference));
    }
  }, []);

  // Save localStorage preference when it changes
  useEffect(() => {
    localStorage.setItem('template-use-localstorage', JSON.stringify(useLocalStorage));
  }, [useLocalStorage]);

  // Load saved field values from localStorage when template changes and localStorage is enabled
  useEffect(() => {
    if (useLocalStorage && template) {
      const updatedFields = template.fields.map(field => {
        const storageKey = getFieldStorageKey(field.name);
        const savedValue = localStorage.getItem(storageKey);
        
        if (savedValue !== null) {
          try {
            // Try to parse as JSON in case it's a complex object
            const parsedValue = JSON.parse(savedValue);
            return { ...field, value: parsedValue };
          } catch {
            // If it's not valid JSON, use as string
            return { ...field, value: savedValue };
          }
        }
        return field;
      });

      onUpdateTemplate({ ...template, fields: updatedFields });
    }
  }, [useLocalStorage, template?.id]);

  const updateField = (fieldId: string, updates: Partial<TemplateField>) => {
    if (!template) return;
    
    const updatedFields = template.fields.map(field =>
      field.id === fieldId ? { ...field, ...updates } : field
    );
    
    const updatedTemplate = { ...template, fields: updatedFields };
    onUpdateTemplate(updatedTemplate);

    // Save individual field value to localStorage if enabled
    if (useLocalStorage) {
      const updatedField = updatedFields.find(f => f.id === fieldId);
      if (updatedField && 'value' in updates) {
        const storageKey = getFieldStorageKey(updatedField.name);
        const valueToStore = typeof updates.value === 'string' 
          ? updates.value 
          : JSON.stringify(updates.value);
        localStorage.setItem(storageKey, valueToStore);
      }
    }
  };

  const handleLocalStorageToggle = (checked: boolean) => {
    setUseLocalStorage(checked);
    
    if (checked && template) {
      // Save all current field values to localStorage when enabling
      template.fields.forEach(field => {
        if (field.value) {
          const storageKey = getFieldStorageKey(field.name);
          const valueToStore = typeof field.value === 'string' 
            ? field.value 
            : JSON.stringify(field.value);
          localStorage.setItem(storageKey, valueToStore);
        }
      });
      console.log('Field values saved to localStorage');
    } else if (!checked && template) {
      // Remove all saved field data when disabling
      template.fields.forEach(field => {
        const storageKey = getFieldStorageKey(field.name);
        localStorage.removeItem(storageKey);
      });
      console.log('Field values removed from localStorage');
    }
  };

  const clearAllFieldData = () => {
    if (!template) return;
    
    template.fields.forEach(field => {
      const storageKey = getFieldStorageKey(field.name);
      localStorage.removeItem(storageKey);
    });
    
    // Reset field values in the template
    const resetFields = template.fields.map(field => ({
      ...field,
      value: '' // or whatever default value you prefer
    }));
    
    onUpdateTemplate({ ...template, fields: resetFields });
    console.log('All field data cleared from localStorage and form');
  };

  const getSavedFieldCount = () => {
    if (!template) return 0;
    return template.fields.filter(field => {
      const storageKey = getFieldStorageKey(field.name);
      return localStorage.getItem(storageKey) !== null;
    }).length;
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

        {/* LocalStorage Toggler */}
        <div className="border rounded-lg p-4 bg-white/40 dark:bg-gray-800/40 border-transparent space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="localstorage-toggle" className="text-base">
                Save Field Values to LocalStorage
              </Label>
              <p className="text-sm text-muted-foreground">
                {useLocalStorage 
                  ? `${getSavedFieldCount()} of ${template.fields.length} fields saved` 
                  : 'Field values will not persist on page refresh'
                }
              </p>
            </div>
            <Switch
              id="localstorage-toggle"
              checked={useLocalStorage}
              onCheckedChange={handleLocalStorageToggle}
            />
          </div>
          
          {useLocalStorage && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllFieldData}
              className="w-full flex items-center gap-2 backdrop-blur-sm bg-white/40 dark:bg-gray-800/40 hover:bg-white/60 dark:hover:bg-gray-800/60 border border-transparent"
            >
              <Trash2 className="h-3 w-3" />
              Clear All Saved Field Data
            </Button>
          )}
        </div>

        {/* Form Fields */}
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
                  {useLocalStorage && (
                    <div className="text-xs text-muted-foreground mt-1 flex justify-between">
                      <span>LocalStorage: {getFieldStorageKey(field.name)}</span>
                      <span>
                        {localStorage.getItem(getFieldStorageKey(field.name)) ? '✓ Saved' : 'Not saved'}
                      </span>
                    </div>
                  )}
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
              valid: validation.isValid,
              useLocalStorage: useLocalStorage,
              savedFields: getSavedFieldCount()
            }, null, 2)}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
}