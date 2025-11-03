import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Download, Save, ArrowUpRight, Edit, Trash2, Asterisk } from 'lucide-react';
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
  const [localStorageValues, setLocalStorageValues] = useState<Record<string, any>>({});

  const getFieldStorageKey = (fieldName: string) => {
    return `bbcode-form-${template?.id}-${fieldName}`;
  };

  // Update localStorage values state whenever template changes
  useEffect(() => {
    if (template) {
      const newValues: Record<string, any> = {};
      template.fields.forEach(field => {
        const storageKey = getFieldStorageKey(field.name);
        const savedValue = localStorage.getItem(storageKey);
        if (savedValue !== null) {
          try {
            newValues[field.name] = JSON.parse(savedValue);
          } catch {
            newValues[field.name] = savedValue;
          }
        }
      });
      setLocalStorageValues(newValues);
    }
  }, [template]);

  // Load saved field values from localStorage when template changes
  useEffect(() => {
    if (template) {
      const updatedFields = template.fields.map(field => {
        const storageKey = getFieldStorageKey(field.name);
        const savedValue = localStorage.getItem(storageKey);
        
        if (savedValue !== null) {
          try {
            const parsedValue = JSON.parse(savedValue);
            return { ...field, value: parsedValue, localStorage: true };
          } catch {
            return { ...field, value: savedValue, localStorage: true };
          }
        }
        return { ...field, localStorage: field.localStorage || false };
      });

      onUpdateTemplate({ ...template, fields: updatedFields });
    }
  }, [template?.id]);

  const updateField = (fieldId: string, updates: Partial<TemplateField>) => {
    if (!template) return;
    
    const updatedFields = template.fields.map(field =>
      field.id === fieldId ? { ...field, ...updates } : field
    );
    
    const updatedTemplate = { ...template, fields: updatedFields };
    onUpdateTemplate(updatedTemplate);

    // Save individual field value to localStorage if enabled for this field
    const updatedField = updatedFields.find(f => f.id === fieldId);
    if (updatedField && 'value' in updates && updatedField.localStorage) {
      const storageKey = getFieldStorageKey(updatedField.name);
      const valueToStore = typeof updates.value === 'string' 
        ? updates.value 
        : JSON.stringify(updates.value);
      localStorage.setItem(storageKey, valueToStore);
      
      // Update localStorage values state for real-time JSON preview
      setLocalStorageValues(prev => ({
        ...prev,
        [updatedField.name]: updates.value
      }));
    }
  };

  const handleFieldLocalStorageToggle = (fieldId: string, enabled: boolean) => {
    if (!template) return;
    
    const updatedFields = template.fields.map(field => {
      if (field.id === fieldId) {
        const updatedField = { ...field, localStorage: enabled };
        
        // If enabling, save current value to localStorage
        if (enabled && field.value) {
          const storageKey = getFieldStorageKey(field.name);
          const valueToStore = typeof field.value === 'string' 
            ? field.value 
            : JSON.stringify(field.value);
          localStorage.setItem(storageKey, valueToStore);
          
          // Update localStorage values state
          setLocalStorageValues(prev => ({
            ...prev,
            [field.name]: field.value
          }));
        }
        // If disabling, remove from localStorage
        else if (!enabled) {
          const storageKey = getFieldStorageKey(field.name);
          localStorage.removeItem(storageKey);
          
          // Remove from localStorage values state
          setLocalStorageValues(prev => {
            const newValues = { ...prev };
            delete newValues[field.name];
            return newValues;
          });
        }
        
        return updatedField;
      }
      return field;
    });

    onUpdateTemplate({ ...template, fields: updatedFields });
  };

  const handleFieldRequiredToggle = (fieldId: string, enabled: boolean) => {
    if (!template) return;
    
    const updatedFields = template.fields.map(field =>
      field.id === fieldId ? { ...field, required: enabled } : field
    );
    
    onUpdateTemplate({ ...template, fields: updatedFields });
  };

  const clearAllFieldData = () => {
    if (!template) return;
    
    template.fields.forEach(field => {
      const storageKey = getFieldStorageKey(field.name);
      localStorage.removeItem(storageKey);
    });
    
    // Reset localStorage values state
    setLocalStorageValues({});
    
    // Reset field values and localStorage flags in the template
    const resetFields = template.fields.map(field => ({
      ...field,
      value: '',
      localStorage: false
    }));
    
    onUpdateTemplate({ ...template, fields: resetFields });
  };

  const getSavedFieldCount = () => {
    if (!template) return 0;
    return template.fields.filter(field => {
      const storageKey = getFieldStorageKey(field.name);
      return localStorage.getItem(storageKey) !== null;
    }).length;
  };

  const getRequiredFieldCount = () => {
    if (!template) return 0;
    return template.fields.filter(field => field.required).length;
  };

  // Get current field values including localStorage data for JSON preview
  const getCurrentFieldValues = () => {
    if (!template) return [];
    
    return template.fields.map(field => {
      // Use localStorage value if available, otherwise use field value
      const currentValue = localStorageValues[field.name] !== undefined 
        ? localStorageValues[field.name] 
        : field.value;
      
      return {
        ...field,
        value: currentValue
      };
    });
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

  const currentFieldValues = getCurrentFieldValues();

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

        {/* Field Settings Summary */}
        <div className="border rounded-lg p-4 bg-white/40 dark:bg-gray-800/40 border-transparent space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-0.5">
              <Label className="text-base flex items-center gap-2">
                <Asterisk className="h-4 w-4 text-red-500" />
                Required Fields
              </Label>
              <p className="text-sm text-muted-foreground">
                {getRequiredFieldCount()} of {template.fields.length} fields required
              </p>
            </div>
            <div className="space-y-0.5">
              <Label className="text-base">
                Field Value Storage
              </Label>
              <p className="text-sm text-muted-foreground">
                {getSavedFieldCount()} of {template.fields.length} fields saved to localStorage
              </p>
            </div>
          </div>
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
                <div key={field.id} className="relative border rounded-lg p-3 bg-white/30 dark:bg-gray-800/30">
                  <FieldEditor
                    field={field}
                    onUpdate={(updates) => updateField(field.id, updates)}
                  />
                  
                  {/* Field Settings Row */}
                  <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-gray-200/50 dark:border-gray-700/50">
                    {/* Required Toggle */}
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor={`required-${field.id}`} className="text-sm flex items-center gap-1">
                          <Asterisk className="h-3 w-3 text-red-500" />
                          Required
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          {field.required ? 'Field is required' : 'Field is optional'}
                        </p>
                      </div>
                      <Switch
                        id={`required-${field.id}`}
                        checked={field.required || false}
                        onCheckedChange={(checked) => handleFieldRequiredToggle(field.id, checked)}
                      />
                    </div>

                    {/* LocalStorage Toggle */}
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor={`localstorage-${field.id}`} className="text-sm">
                          Save to Storage
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          {field.localStorage ? 'Value persists' : 'Value resets'}
                        </p>
                      </div>
                      <Switch
                        id={`localstorage-${field.id}`}
                        checked={field.localStorage || false}
                        onCheckedChange={(checked) => handleFieldLocalStorageToggle(field.id, checked)}
                      />
                    </div>
                  </div>

                  {/* Storage Status */}
                  {field.localStorage && (
                    <div className="text-xs text-muted-foreground mt-2 flex justify-between">
                      <span>Storage Key: {getFieldStorageKey(field.name)}</span>
                      <span className={localStorage.getItem(getFieldStorageKey(field.name)) ? 'text-green-600' : 'text-yellow-600'}>
                        {localStorage.getItem(getFieldStorageKey(field.name)) ? '✓ Saved' : 'Not saved yet'}
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
              fieldValues: currentFieldValues.map(f => ({
                name: f.name,
                type: f.type,
                value: f.value,
                required: f.required || false,
                localStorage: f.localStorage || false
              })),
              valid: validation.isValid,
              requiredFields: getRequiredFieldCount(),
              savedFields: getSavedFieldCount(),
              totalFields: template.fields.length
            }, null, 2)}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
}

export default TemplatePreview;