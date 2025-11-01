export interface BBCodeElement {
  type: string;
  content?: string | BBCodeElement[];
  items?: BBCodeElement[];
  [key: string]: any;
}

export interface InputSectionProps {
  jsonInput: string;
  onJsonInputChange: (value: string) => void;
  onConvert: () => void;
  onLoadExample: () => void;
  onClear: () => void;
}