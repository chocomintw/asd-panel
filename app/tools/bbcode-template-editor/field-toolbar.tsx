import { Button } from '@/components/ui/button';
import { Type, Calendar, Link, List, CheckSquare } from 'lucide-react';
import { FieldType, colorMap } from './types';

interface FieldToolbarProps {
  onInsertField: (fieldType: string, options?: any) => void;
}

const fieldTypes: FieldType[] = [
  { type: 'text', icon: Type, label: 'Text Input', placeholder: '{{text:field_name}}', color: 'blue' },
  { type: 'textarea', icon: Type, label: 'Text Area', placeholder: '{{textarea:field_name}}', color: 'green' },
  { type: 'date', icon: Calendar, label: 'Date Picker', placeholder: '{{date:field_name}}', color: 'purple' },
  { type: 'select', icon: List, label: 'Dropdown', placeholder: '{{select:field_name}}', color: 'orange' },
  { type: 'checkbox', icon: CheckSquare, label: 'Checkbox', placeholder: '{{checkbox:field_name}}', color: 'red' },
  { type: 'list', icon: List, label: 'Dynamic List', placeholder: '{{list:field_name}}', color: 'yellow' },
];

export function FieldToolbar({ onInsertField }: FieldToolbarProps) {
  const handleFieldInsert = (fieldType: string) => {
    let options = {};

    if (fieldType === 'select') {
      options = { dataSource: 'custom' };
    } else if (fieldType === 'checkbox') {
      options = { checkedValue: '[cbc]', uncheckedValue: '[cb]' };
    } else if (fieldType === 'date') {
      options = { dateFormat: 'YYYY-MM-DD' };
    }

    onInsertField(fieldType, options);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <span className="text-sm font-medium w-full">Form Fields:</span>
        {fieldTypes.map(({ type, icon: Icon, label, color }) => {
          const colors = colorMap[color];
          return (
            <Button
              key={`${type}-${label}`}
              variant="ghost"
              size="sm"
              onClick={() => handleFieldInsert(type)}
              className={`flex items-center gap-2 backdrop-blur-sm bg-white/40 dark:bg-gray-800/40 hover:bg-white/60 dark:hover:bg-gray-800/60 border border-transparent transition-all duration-300 ${colors.accent}`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

