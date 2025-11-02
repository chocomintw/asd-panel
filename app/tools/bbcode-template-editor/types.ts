export interface TemplateField {
  rows: number;
  id: string;
  type: 'text' | 'textarea' | 'date' | 'select' | 'list' | 'checkbox';
  name: string;
  label: string;
  defaultValue?: string;
  required?: boolean;
  placeholder?: string;
  options?: string[];
  dateFormat?: string;
  dataSource?: 'locations' | 'penal_code' | 'vehicles' | 'custom';
  checkedValue?: string;
  uncheckedValue?: string;
  saveToLocal?: boolean;
  // BBCode formatting - make it consistent
  bbcodeFormat?: BBCodeFormat;
}

// Add proper BBCodeFormat interface
export interface BBCodeFormat {
  prefix?: string;
  suffix?: string;
  wrapInTag?: string;
  tagAttributes?: string;
}

export interface PaperworkTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  version?: string;
  author?: string;
  created?: string;
  baseContent?: string;
  template: string;
  fields: TemplateField[];
  formConfig?: {
    layout?: 'vertical' | 'horizontal';
    submitText?: string;
  };
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface FieldType {
  type: TemplateField['type'];
  icon: React.ComponentType<any>;
  label: string;
  placeholder: string;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'yellow';
}

export type DataSource = {
  locations: string[];
  penal_code: string[];
  vehicles: string[];
  custom: string[];
};

export const colorMap = {
  blue: { 
    light: 'from-blue-500/8 to-blue-600/4', 
    medium: 'from-blue-500/12 to-blue-600/8',
    accent: 'text-blue-600',
    glow: 'from-blue-500/20 to-blue-600/10',
    bg: 'bg-blue-500/8'
  },
  green: { 
    light: 'from-green-500/8 to-green-600/4', 
    medium: 'from-green-500/12 to-green-600/8',
    accent: 'text-green-600',
    glow: 'from-green-500/20 to-green-600/10',
    bg: 'bg-green-500/8'
  },
  purple: { 
    light: 'from-purple-500/8 to-purple-600/4', 
    medium: 'from-purple-500/12 to-purple-600/8',
    accent: 'text-purple-600',
    glow: 'from-purple-500/20 to-purple-600/10',
    bg: 'bg-purple-500/8'
  },
  orange: { 
    light: 'from-orange-500/8 to-orange-600/4', 
    medium: 'from-orange-500/12 to-orange-600/8',
    accent: 'text-orange-600',
    glow: 'from-orange-500/20 to-orange-600/10',
    bg: 'bg-orange-500/8'
  },
  red: { 
    light: 'from-red-500/8 to-red-600/4', 
    medium: 'from-red-500/12 to-red-600/8',
    accent: 'text-red-600',
    glow: 'from-red-500/20 to-red-600/10',
    bg: 'bg-red-500/8'
  },
  yellow: { 
    light: 'from-yellow-500/8 to-yellow-600/4', 
    medium: 'from-yellow-500/12 to-yellow-600/8',
    accent: 'text-yellow-600',
    glow: 'from-yellow-500/20 to-yellow-600/10',
    bg: 'bg-yellow-500/8'
  }
} as const;

export const dateFormats = [
  'YYYY-MM-DD',
  'MM/DD/YYYY',
  'DD/MM/YYYY',
  'MMMM DD, YYYY',
  'DD MMMM YYYY'
];

export const getDefaultBBCodeFormat = (type: string): BBCodeFormat => {
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