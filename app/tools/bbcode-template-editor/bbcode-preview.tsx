import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PaperworkTemplate } from './types';

interface BBCodePreviewProps {
  template: PaperworkTemplate | null;
  bbcodeContent: string;
}

export function BBCodePreview({ template, bbcodeContent }: BBCodePreviewProps) {
  if (!template) {
    return (
      <Card className="border-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md shadow-sm">
        <CardHeader>
          <CardTitle>BBCode Output Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Generate a template to see BBCode output preview</p>
        </CardContent>
      </Card>
    );
  }

  // Generate example BBCode with sample values
    const generateExampleBBCode = (content: string): string => {
    return content
        .replace(/{{text:([^}]+)}}/g, 'Sample Text')
        .replace(/{{textarea:([^}]+)}}/g, 'Multi-line\ntext example')
        .replace(/{{date:([^}]+)}}/g, new Date().toISOString().split('T')[0])
        .replace(/{{select:([^}]+)}}/g, (match, fieldName) => {
        const field = template.fields.find(f => f.name === fieldName);
        return field?.options?.[0] || 'Selected Option';
        })
        .replace(/{{checkbox:([^}]+)}}/g, (match, fieldName) => {
        const field = template.fields.find(f => f.name === fieldName);
        return field?.checkedValue || '[cbc]';
        })
        .replace(/{{list:([^}]+)}}/g, '[list]First Item\n[*]Second Item\n[*]Third Item[/list]'); // Fixed list format
    };

  const exampleBBCode = generateExampleBBCode(bbcodeContent);

  return (
    <Card className="border-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md shadow-sm">
      <CardHeader>
        <CardTitle>BBCode Output Preview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-2">Raw BBCode with Placeholders</h4>
          <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-3 rounded border font-mono whitespace-pre-wrap max-h-40 overflow-y-auto">
            {bbcodeContent}
          </pre>
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-2">Example Output with Values</h4>
          <pre className="text-xs bg-green-50 dark:bg-green-900/20 p-3 rounded border font-mono whitespace-pre-wrap max-h-40 overflow-y-auto">
            {exampleBBCode}
          </pre>
        </div>
        
        <div className="text-xs text-muted-foreground">
          <p><strong>Note:</strong> This shows how the BBCode will look when fields are filled with example values.</p>
          <p className="mt-1">• Select fields show the first option</p>
          <p>• Checkboxes show the checked value</p>
          <p>• Lists show example list items</p>
          <p>• Date fields show today's date</p>
        </div>
      </CardContent>
    </Card>
  );
}