export interface BBCodeElement {
  type: string;
  content?: string | BBCodeElement[];
  items?: BBCodeElement[];
  [key: string]: any;
}

export interface TagPattern {
  regex: RegExp;
  type: string;
  multiLine?: boolean;
}

export interface InputSectionProps {
  bbcode: string;
  onBBCodeChange: (value: string) => void;
  onParse: () => void;
  onLoadExample: () => void;
  onClear: () => void;
}