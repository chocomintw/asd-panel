import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Trash2, Plus } from 'lucide-react';
import { TemplateField, dateFormats, BBCodeFormat } from './types';
import { loadDataSource } from './data-sources';

interface FieldEditorProps {
  field: TemplateField;
  onUpdate: (field: TemplateField) => void;
}

export function FieldEditor({ field, onUpdate }: FieldEditorProps) {
  const handleUpdate = (updates: Partial<TemplateField>) => {
    onUpdate({ ...field, ...updates });
  };

  const handleOptionUpdate = (index: number, value: string) => {
    const newOptions = [...(field.options || [])];
    newOptions[index] = value;
    handleUpdate({ options: newOptions });
  };

  const addOption = () => {
    const newOptions = [...(field.options || []), `Option ${(field.options?.length || 0) + 1}`];
    handleUpdate({ options: newOptions });
  };

  const removeOption = (index: number) => {
    const newOptions = field.options?.filter((_, i) => i !== index) || [];
    handleUpdate({ options: newOptions });
  };

  const handleDataSourceChange = async (source: string) => {
    if (source === 'custom') {
      handleUpdate({ dataSource: 'custom', options: field.options || ['Option 1'] });
    } else {
      try {
        const data = await loadDataSource(source as any);
        handleUpdate({ dataSource: source as any, options: data });
      } catch (error) {
        console.error('Error loading data source:', error);
        handleUpdate({ dataSource: 'custom', options: field.options || ['Option 1'] });
      }
    }
  };

  // Default BBCode formats for each field type
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
        return { prefix: '[list]\n', suffix: '\n[/list]' };
      default:
        return { prefix: '', suffix: '' };
    }
  };

  const bbcodeFormat: BBCodeFormat = field.bbcodeFormat || getDefaultBBCodeFormat(field.type);

  const handleBBCodeFormatUpdate = (updates: Partial<BBCodeFormat>) => {
    handleUpdate({
      bbcodeFormat: { ...bbcodeFormat, ...updates }
    });
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700">
      {/* Basic Field Properties */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`${field.id}-label`}>Label</Label>
          <Input
            id={`${field.id}-label`}
            value={field.label}
            onChange={(e) => handleUpdate({ label: e.target.value })}
            placeholder="Field label"
            className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${field.id}-name`}>Field Name</Label>
          <Input
            id={`${field.id}-name`}
            value={field.name}
            onChange={(e) => handleUpdate({ name: e.target.value })}
            placeholder="field_name"
            className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${field.id}-placeholder`}>Placeholder</Label>
        <Input
          id={`${field.id}-placeholder`}
          value={field.placeholder || ''}
          onChange={(e) => handleUpdate({ placeholder: e.target.value })}
          placeholder="Enter placeholder text"
          className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
        />
      </div>

      {/* BBCode Formatting Options */}
      <div className="border-t pt-4">
        <Label className="text-sm font-medium mb-3 block">BBCode Formatting</Label>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`${field.id}-prefix`}>Prefix</Label>
            <Input
              id={`${field.id}-prefix`}
              value={bbcodeFormat.prefix || ''}
              onChange={(e) => handleBBCodeFormatUpdate({ prefix: e.target.value })}
              placeholder="e.g., [b]"
              className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 font-mono text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${field.id}-suffix`}>Suffix</Label>
            <Input
              id={`${field.id}-suffix`}
              value={bbcodeFormat.suffix || ''}
              onChange={(e) => handleBBCodeFormatUpdate({ suffix: e.target.value })}
              placeholder="e.g., [/b]"
              className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 font-mono text-sm"
            />
          </div>
        </div>
        <div className="mt-2">
          <Label htmlFor={`${field.id}-wrapTag`}>Wrap in Tag</Label>
          <Input
            id={`${field.id}-wrapTag`}
            value={bbcodeFormat.wrapInTag || ''}
            onChange={(e) => handleBBCodeFormatUpdate({ wrapInTag: e.target.value })}
            placeholder="e.g., b, i, u, color=red"
            className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 font-mono text-sm"
          />
          <p className="text-xs text-gray-500 mt-1">
            Tag name only (b, i, u) or with attributes (color=red, size=large)
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          checked={field.required || false}
          onCheckedChange={(checked) => handleUpdate({ required: checked })}
          className="data-[state=checked]:bg-blue-600"
        />
        <Label className="text-sm font-medium">Required Field</Label>
      </div>

      {/* Type-specific configurations */}
      {field.type === 'textarea' && (
        <div className="space-y-2">
          <Label htmlFor={`${field.id}-rows`}>Rows</Label>
          <Input
            id={`${field.id}-rows`}
            type="number"
            value={field.rows || 4}
            onChange={(e) => handleUpdate({ rows: parseInt(e.target.value) || 4 })}
            min="1"
            max="20"
            className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
          />
        </div>
      )}

      {field.type === 'date' && (
        <div className="space-y-2">
          <Label htmlFor={`${field.id}-dateFormat`}>Date Format</Label>
          <Select 
            value={field.dateFormat || 'YYYY-MM-DD'} 
            onValueChange={(value) => handleUpdate({ dateFormat: value })}
          >
            <SelectTrigger className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {dateFormats.map(format => (
                <SelectItem key={format} value={format}>{format}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {field.type === 'checkbox' && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`${field.id}-checked`}>Checked Value</Label>
            <Input
              id={`${field.id}-checked`}
              value={field.checkedValue || '[cbc]'}
              onChange={(e) => handleUpdate({ checkedValue: e.target.value })}
              placeholder="[cbc]"
              className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 font-mono"
            />
            <p className="text-xs text-gray-500">Shows when checkbox is checked</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${field.id}-unchecked`}>Unchecked Value</Label>
            <Input
              id={`${field.id}-unchecked`}
              value={field.uncheckedValue || '[cb]'}
              onChange={(e) => handleUpdate({ uncheckedValue: e.target.value })}
              placeholder="[cb]"
              className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 font-mono"
            />
            <p className="text-xs text-gray-500">Shows when checkbox is unchecked</p>
          </div>
        </div>
      )}

      {field.type === 'select' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Data Source</Label>
            <Select 
              value={field.dataSource || 'custom'} 
              onValueChange={handleDataSourceChange}
            >
              <SelectTrigger className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="custom">Custom Options</SelectItem>
                <SelectItem value="locations">GTAW Locations</SelectItem>
                <SelectItem value="penal_code">Penal Code</SelectItem>
                <SelectItem value="vehicles">Vehicles</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {field.dataSource === 'custom' && (
            <div className="space-y-2">
              <Label>Options</Label>
              <div className="space-y-2">
                {field.options?.map((option, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={option}
                      onChange={(e) => handleOptionUpdate(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeOption(index)}
                      className="shrink-0 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={addOption} 
                  className="w-full bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Option
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {(field.type === 'text' || field.type === 'textarea') && (
        <div className="flex items-center space-x-2">
          <Switch
            checked={field.saveToLocal || false}
            onCheckedChange={(checked) => handleUpdate({ saveToLocal: checked })}
            className="data-[state=checked]:bg-blue-600"
          />
          <Label className="text-sm font-medium">Save to Local Storage</Label>
        </div>
      )}

      {/* List fields are dynamic - no configuration needed */}
      {field.type === 'list' && (
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            <strong>Dynamic List:</strong> Users can add/remove items as needed. Each item becomes a bullet point in the final document.
          </p>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
            BBCode Output: [list]• item1\n• item2[/list]
          </p>
        </div>
      )}

      {/* BBCode Preview */}
      <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded border border-gray-200 dark:border-gray-700">
        <Label className="text-sm font-medium mb-2 block">BBCode Preview</Label>
        <div className="space-y-2">
          <div>
            <Label className="text-xs text-gray-500">Placeholder:</Label>
            <pre className="text-xs bg-white dark:bg-gray-900 p-2 rounded border font-mono whitespace-pre-wrap">
              {generateBBCodePlaceholder(field, bbcodeFormat)}
            </pre>
          </div>
          <div>
            <Label className="text-xs text-gray-500">Example Output:</Label>
            <pre className="text-xs bg-green-50 dark:bg-green-900/20 p-2 rounded border font-mono whitespace-pre-wrap">
              {generateBBCodeExample(field, bbcodeFormat)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to generate BBCode placeholder
function generateBBCodePlaceholder(field: TemplateField, bbcodeFormat: BBCodeFormat): string {
  const { prefix = '', suffix = '', wrapInTag = '' } = bbcodeFormat;
  
  let content = `{{${field.type}:${field.name}}}`;
  
  if (wrapInTag) {
    const tagParts = wrapInTag.split('=');
    const tagName = tagParts[0];
    const attributes = tagParts[1] ? `=${tagParts[1]}` : '';
    content = `[${tagName}${attributes}]${content}[/${tagName}]`;
  }
  
  return `${prefix}${content}${suffix}`;
}

// Helper function to generate BBCode example with actual values
function generateBBCodeExample(field: TemplateField, bbcodeFormat: BBCodeFormat): string {
  const { prefix = '', suffix = '', wrapInTag = '' } = bbcodeFormat;
  
  let content = getFieldExampleValue(field);
  
  if (wrapInTag) {
    const tagParts = wrapInTag.split('=');
    const tagName = tagParts[0];
    const attributes = tagParts[1] ? `=${tagParts[1]}` : '';
    content = `[${tagName}${attributes}]${content}[/${tagName}]`;
  }
  
  return `${prefix}${content}${suffix}`;
}

// Helper function to get example values for each field type
  function getFieldExampleValue(field: TemplateField): string {
    switch (field.type) {
      case 'text':
        return 'Sample Text';
      case 'textarea':
        return 'Multi-line\ntext example';
      case 'date':
        return new Date().toISOString().split('T')[0];
      case 'select':
        return field.options?.[0] || 'Selected Option';
      case 'checkbox':
        return field.checkedValue || '[cbc]';
      case 'list':
        return 'First Item\n[*]Second Item\n[*]Third Item'; // Fixed list format
      default:
        return 'Field Value';
    }
  }