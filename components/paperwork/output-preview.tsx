'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Copy, Download, Check } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

interface OutputPreviewProps {
  output: string;
}

export function OutputPreview({ output }: OutputPreviewProps) {
  const [copyState, setCopyState] = useState<'idle' | 'copying' | 'copied'>('idle')
  const [downloadState, setDownloadState] = useState<'idle' | 'downloading'>('idle')
  const [isScrollable, setIsScrollable] = useState(false)
  const preRef = useRef<HTMLPreElement>(null)

  // Debug: Log the output to see what's being received
  useEffect(() => {
    console.log('🔍 OutputPreview received output:', {
      hasOutput: !!output,
      outputLength: output?.length,
      outputType: typeof output,
      outputPreview: output?.substring(0, 100) + '...'
    })
  }, [output])

  // Check if content is scrollable
  useEffect(() => {
    const checkScrollable = () => {
      if (preRef.current) {
        const { scrollHeight, clientHeight } = preRef.current
        setIsScrollable(scrollHeight > clientHeight)
      }
    }

    checkScrollable()
    const timeoutId = setTimeout(checkScrollable, 100)
    window.addEventListener('resize', checkScrollable)
    
    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('resize', checkScrollable)
    }
  }, [output])

  const copyToClipboard = async () => {
    if (copyState === 'copying') return
    
    try {
      setCopyState('copying')
      await navigator.clipboard.writeText(output)
      setCopyState('copied')
      setTimeout(() => setCopyState('idle'), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
      setCopyState('idle')
    }
  }

  const downloadOutput = async () => {
    if (downloadState === 'downloading') return
    
    try {
      setDownloadState('downloading')
      const blob = new Blob([output], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'generated-document.txt'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      setTimeout(() => setDownloadState('idle'), 500)
    } catch (err) {
      console.error('Failed to download:', err)
      setDownloadState('idle')
    }
  }

  return (
    <Card className="relative hover-lift">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            Output Preview
            {output && (
              <span className="relative flex h-2 w-2">
                <span className="custom-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
            )}
          </CardTitle>
          <div className="flex gap-2">
            <Button 
              variant={copyState === 'copied' ? "default" : "outline"}
              size="sm" 
              onClick={copyToClipboard} 
              disabled={!output || copyState === 'copying'}
              className={`relative overflow-hidden ${
                copyState === 'copied' 
                  ? 'bg-green-500 hover:bg-green-600 text-white border-green-500' 
                  : ''
              } ${copyState === 'copying' ? 'opacity-70' : ''}`}
            >
              <div className="flex items-center gap-1">
                {copyState === 'copied' ? (
                  <Check className="h-4 w-4 custom-bounce" />
                ) : copyState === 'copying' ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full custom-spin" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                <span>
                  {copyState === 'copying' ? 'Copying...' : 
                   copyState === 'copied' ? 'Copied!' : 'Copy'}
                </span>
              </div>
              
              {copyState === 'copied' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 bg-white/30 rounded-full custom-ripple" />
                </div>
              )}
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={downloadOutput} 
              disabled={!output || downloadState === 'downloading'}
              className={`relative overflow-hidden ${
                downloadState === 'downloading' ? 'opacity-70' : ''
              }`}
            >
              <div className="flex items-center gap-1">
                {downloadState === 'downloading' ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full custom-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                <span>
                  {downloadState === 'downloading' ? 'Downloading...' : 'Download'}
                </span>
              </div>
              
              {downloadState === 'downloading' && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500">
                  <div className="h-full bg-blue-600 custom-progress" />
                </div>
              )}
            </Button>
          </div>
        </div>
        <CardDescription>
          {output ? (
            <span className="text-green-600 font-medium custom-pulse">
              ✓ Document ready to copy or download
            </span>
          ) : (
            'Fill out the form and generate to see output'
          )}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {output ? (
          <div className="relative group custom-fade-in">
            <pre 
              ref={preRef}
              className="bg-muted p-4 rounded-md whitespace-pre-wrap text-sm max-h-96 overflow-auto border transition-colors custom-scrollbar hover:border-primary/50"
            >
              {output}
            </pre>
            
            {/* Scroll indicator - only show when content is scrollable */}
            {isScrollable && (
              <div className="absolute bottom-3 right-3">
                <div className="flex gap-1 opacity-60">
                  {[1, 2, 3].map((dot) => (
                    <div 
                      key={dot}
                      className="w-1 h-1 bg-current rounded-full custom-bounce"
                      style={{ animationDelay: `${dot * 0.1}s` }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground border-2 border-dashed border-muted rounded-lg">
            <div className="custom-pulse mb-4">
              <div className="w-12 h-12 bg-muted rounded-full mx-auto mb-2" />
              <div className="w-24 h-3 bg-muted rounded mx-auto" />
            </div>
            <p className="text-sm">Fill out the form and generate to see output</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}