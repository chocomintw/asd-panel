import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Download, Copy, FileText } from 'lucide-react'

interface TemplateExporterProps {
  jsonOutput: string;
  onCopyTemplate: () => void;
  onDownloadTemplate: () => void;
}

export function TemplateExporter({ jsonOutput, onCopyTemplate, onDownloadTemplate }: TemplateExporterProps) {
  if (!jsonOutput) return null;

  const templateStructure = {
    template: {
      name: "Generated from BBCode",
      description: "Paperwork template generated from BBCode converter",
      version: "1.0",
      structure: JSON.parse(jsonOutput),
      fields: extractFieldsFromJSON(JSON.parse(jsonOutput))
    }
  };

  const templateJSON = JSON.stringify(templateStructure, null, 2);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          <CardTitle>Paperwork Template</CardTitle>
        </div>
        <CardDescription>
          Export this JSON structure as a template for your paperwork generator
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border rounded-md bg-muted/50">
          <pre className="p-4 text-sm overflow-auto max-h-64 whitespace-pre-wrap wrap-break-word font-mono">
            {templateJSON}
          </pre>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={onCopyTemplate} className="flex items-center gap-2">
            <Copy className="h-4 w-4" />
            Copy Template
          </Button>
          <Button onClick={onDownloadTemplate} variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download Template
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Helper function to extract form fields from the JSON structure
function extractFieldsFromJSON(jsonStructure: any): any[] {
  const fields: any[] = [];
  
  function traverse(element: any, path: string = '') {
    if (!element) return;
    
    // Extract potential form fields based on element type
    switch (element.type) {
      case 'text':
        if (element.content && typeof element.content === 'string') {
          fields.push({
            id: `field_${fields.length + 1}`,
            type: 'text',
            label: `Text Field ${fields.length + 1}`,
            path: path ? `${path}.content` : 'content',
            defaultValue: element.content
          });
        }
        break;
        
      case 'bold':
      case 'italic':
      case 'underline':
        fields.push({
          id: `field_${fields.length + 1}`,
          type: 'text',
          label: `Formatted Text ${fields.length + 1}`,
          path: path ? `${path}.content` : 'content',
          defaultValue: element.content,
          formatting: element.type
        });
        break;
        
      case 'list':
        if (element.items && Array.isArray(element.items)) {
          element.items.forEach((item: any, index: number) => {
            traverse(item, path ? `${path}.items[${index}]` : `items[${index}]`);
          });
        }
        break;
        
      case 'list_item':
        traverse({ type: 'text', content: element.content }, path);
        break;
    }
    
    // Recursively traverse nested content
    if (element.content && Array.isArray(element.content)) {
      element.content.forEach((child: any, index: number) => {
        traverse(child, path ? `${path}.content[${index}]` : `content[${index}]`);
      });
    }
  }
  
  traverse(jsonStructure);
  return fields;
}