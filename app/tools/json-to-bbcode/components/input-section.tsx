import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { InputSectionProps } from '../types'

export function InputSection({ 
  jsonInput, 
  onJsonInputChange, 
  onConvert, 
  onLoadExample, 
  onClear 
}: InputSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>JSON Input</CardTitle>
        <CardDescription>
          Paste your JSON structure representing BBCode elements
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="json-input">JSON Structure</Label>
          <Textarea
            id="json-input"
            value={jsonInput}
            onChange={(e) => onJsonInputChange(e.target.value)}
            placeholder='Paste your JSON here...'
            className="min-h-[200px] font-mono text-sm"
          />
        </div>
        
        <div className="flex gap-2">
          <Button onClick={onConvert}>Convert to BBCode</Button>
          <Button variant="outline" onClick={onLoadExample}>Load Example</Button>
          <Button variant="outline" onClick={onClear}>Clear All</Button>
        </div>
      </CardContent>
    </Card>
  )
}