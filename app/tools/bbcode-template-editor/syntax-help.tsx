import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function SyntaxHelp() {
  return (
    <Card className="border-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md shadow-sm">
      <CardHeader>
        <CardTitle>BBCode Syntax Reference</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h4 className="font-semibold mb-2">Field Types with BBCode</h4>
            <div className="space-y-2">
              <div><code>{`{{text:name}}`}</code> → <code>John Doe</code></div>
              <div><code>{`{{textarea:description}}`}</code> → Multi-line text</div>
              <div><code>{`{{date:incident_date}}`}</code> → <code>2024-01-15</code></div>
              <div><code>{`{{select:location}}`}</code> → Selected option</div>
              <div><code>{`{{checkbox:signed}}`}</code> → <code>[cbc]</code> or <code>[cb]</code></div>
              <div><code>{`{{list:items}}`}</code> → <code>[list]• item1\n• item2[/list]</code></div>
            </div>
            
            <h4 className="font-semibold mb-2 mt-4">Common BBCode Tags</h4>
            <div className="space-y-1">
              <div><code>[b]bold[/b]</code> - <b>bold text</b></div>
              <div><code>[i]italic[/i]</code> - <i>italic text</i></div>
              <div><code>[u]underline[/u]</code> - <u>underline</u></div>
              <div><code>[color=red]text[/color]</code> - colored text</div>
              <div><code>[size=large]text[/size]</code> - sized text</div>
              <div><code>[list]• item[/list]</code> - bullet list</div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Complete BBCode Example</h4>
            <pre className="bg-muted p-3 rounded text-xs backdrop-blur-sm dark:bg-gray-800/40 font-mono">
{`[b]Incident Report[/b]
[i]Date: {{date:incident_date}}[/i]

[b]Location:[/b] {{select:location}}

[b]Description:[/b]
{{textarea:incident_description}}

[b]Witnesses:[/b]
[list]
{{list:witnesses}}
[/list]

[b]Evidence Collected:[/b] {{checkbox:evidence}}
[b]Report Filed:[/b] {{checkbox:report_filed}}

[size=small][color=gray]End of Report[/color][/size]`}</pre>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}