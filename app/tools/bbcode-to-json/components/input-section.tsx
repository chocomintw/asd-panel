import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { InputSectionProps } from '../types'

export function InputSection({ bbcode, onBBCodeChange, onParse, onLoadExample, onClear }: InputSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>BBCode Input</CardTitle>
        <CardDescription>
          Paste your BBCode content below. Supports common tags including lists with [*] items.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="bbcode-input">BBCode Content</Label>
          <Textarea
            id="bbcode-input"
            value={bbcode}
            onChange={(e) => onBBCodeChange(e.target.value)}
            placeholder="Paste your BBCode here..."
            className="min-h-[200px] font-mono"
          />
        </div>
        
        <div className="flex gap-2">
          <Button onClick={onParse}>Parse to JSON</Button>
          <Button variant="outline" onClick={onLoadExample}>Load Example</Button>
          <Button variant="outline" onClick={onClear}>Clear All</Button>
        </div>
      </CardContent>
    </Card>
  )
}