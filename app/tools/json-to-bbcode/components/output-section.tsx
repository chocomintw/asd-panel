import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface OutputSectionProps {
  bbcodeOutput: string;
  onCopy: () => void;
}

export function OutputSection({ bbcodeOutput, onCopy }: OutputSectionProps) {
  if (!bbcodeOutput) return null;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>BBCode Output</CardTitle>
          <Button variant="outline" size="sm" onClick={onCopy}>
            Copy BBCode
          </Button>
        </div>
        <CardDescription>
          Generated BBCode from your JSON structure
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm max-h-96 overflow-y-auto whitespace-pre-wrap wrap-break-word">
            {bbcodeOutput}
          </pre>
        </div>
      </CardContent>
    </Card>
  )
}