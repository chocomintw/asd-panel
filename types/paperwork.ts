export interface PaperworkTemplate {
  id: string
  name: string
  description: string
  category: string
  fields: FormField[]
  template: string
}

export interface FormField {
  id: string;
  type: 'text' | 'textarea' | 'date' | 'url' | 'select' | 'list';
  name: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  description?: string;
  options?: string[]; // For select fields
  rows?: number; // For textarea
  listType?: 'bullet' | 'numbered' | 'checkbox'; // For list fields
  defaultValue?: string | string[];
}

export interface SelectOption {
  value: string
  label: string
}

export interface FormValues {
  [key: string]: string | string[]
}