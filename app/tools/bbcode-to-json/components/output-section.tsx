import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface OutputSectionProps {
  jsonOutput: string;
  onCopy: () => void;
}

export function OutputSection({ jsonOutput, onCopy }: OutputSectionProps) {
  if (!jsonOutput) return null;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>JSON Output</CardTitle>
          <Button variant="outline" size="sm" onClick={onCopy}>
            Copy JSON
          </Button>
        </div>
        <CardDescription>
          Structured JSON representation of your BBCode
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm max-h-96 overflow-y-auto">
            <code className="whitespace-pre-wrap wrap-break-word">
              {jsonOutput}
            </code>
          </pre>
        </div>
      </CardContent>
    </Card>
  )
}