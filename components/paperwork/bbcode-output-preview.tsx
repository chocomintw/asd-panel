'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Copy, Download } from 'lucide-react'

interface BBCodeOutputPreviewProps {
  output: string;
}

export function BBCodeOutputPreview({ output }: BBCodeOutputPreviewProps) {
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(output)
      console.log('BBCode copied to clipboard!')
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const downloadAsFile = () => {
    const blob = new Blob([output], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'bbcode-output.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border-transparent">
            {output ? `${output.length} chars` : 'Empty'}
          </Badge>
          {output && (
            <Badge variant="secondary" className="backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border-transparent">
              {output.split('\n').length} lines
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {output && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                className="backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border-transparent"
              >
                <Copy className="h-4 w-4 mr-1" />
                Copy
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={downloadAsFile}
                className="backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border-transparent"
              >
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
            </>
          )}
        </div>
      </div>

      {!output ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>No output generated yet</p>
          <p className="text-sm mt-1">Fill out the form and click "Generate BBCode"</p>
        </div>
      ) : (
        <pre className="whitespace-pre-wrap font-mono text-sm bg-white/80 dark:bg-gray-900/80 p-4 rounded border border-gray-300 dark:border-gray-600 max-h-96 overflow-y-auto">
          {output}
        </pre>
      )}

      {output && (
        <div className="text-xs text-muted-foreground">
          <p>
            <strong>Note:</strong> This is the generated BBCode output. You can copy and paste it into any forum or platform that supports BBCode.
          </p>
        </div>
      )}
    </div>
  )
}