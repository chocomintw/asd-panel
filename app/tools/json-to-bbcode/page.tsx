'use client'

import { useState } from 'react'
import { InputSection } from './components/input-section'
import { OutputSection } from './components/output-section'
import { ErrorSection } from './components/error-section'
import { SupportedFormatsSection } from './components/supported-formats'
import { JSONToBBCodeConverter } from './lib/json-to-bbcode-converter'
import { EXAMPLE_JSON } from './lib/constants'

export default function JsonToBBCodeTool() {
  const [jsonInput, setJsonInput] = useState('')
  const [bbcodeOutput, setBBCodeOutput] = useState('')
  const [error, setError] = useState('')

  const convertToBBCode = () => {
    try {
      setError('')
      
      if (!jsonInput.trim()) {
        setBBCodeOutput('')
        return
      }

      const bbcode = JSONToBBCodeConverter.convert(jsonInput)
      setBBCodeOutput(bbcode)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error converting JSON to BBCode')
      console.error('Conversion error:', err)
    }
  }

  const clearAll = () => {
    setJsonInput('')
    setBBCodeOutput('')
    setError('')
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(bbcodeOutput)
      alert('BBCode copied to clipboard!')
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const loadExample = () => {
    setJsonInput(EXAMPLE_JSON)
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">JSON to BBCode Converter</h1>
        <p className="text-sm text-muted-foreground">
          Convert structured JSON data back to BBCode format
        </p>
      </header>

      <div className="grid gap-6">
        <InputSection
          jsonInput={jsonInput}
          onJsonInputChange={setJsonInput}
          onConvert={convertToBBCode}
          onLoadExample={loadExample}
          onClear={clearAll}
        />

        <ErrorSection error={error} />

        <OutputSection 
          bbcodeOutput={bbcodeOutput} 
          onCopy={copyToClipboard} 
        />

        <SupportedFormatsSection />
      </div>
    </div>
  )
}