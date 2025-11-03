'use client'

import { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Download, Upload, ArrowUpRight, Users, Target, BarChart3, Copy } from 'lucide-react'

interface Personnel {
  id: string
  firstName: string
  lastName: string
  requestedStation: 'Senora Sheriff\'s Station' | 'Davis Sheriff\'s Station'
  examGrade: number
  assignedStation?: 'Senora Sheriff\'s Station' | 'Davis Sheriff\'s Station'
  gotRequested?: boolean
}

interface AssignmentResult {
  assignments: Personnel[]
  statistics: {
    totalAssigned: number
    senoraCount: number
    davisCount: number
    requestedFulfilled: number
    successRate: number
  }
}

export default function StationAssignmentTool() {
  const [personnel, setPersonnel] = useState<Personnel[]>([])
  const [assignments, setAssignments] = useState<AssignmentResult | null>(null)
  const [senoraRatio, setSenoraRatio] = useState(50)
  const [jsonInput, setJsonInput] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [guaranteedStation, setGuaranteedStation] = useState<'none' | 'senora' | 'davis'>('none')
  const [spreadsheetInput, setSpreadsheetInput] = useState('')
  const [showSpreadsheetInput, setShowSpreadsheetInput] = useState(false)
  const [googleSheetsUrl, setGoogleSheetsUrl] = useState('')
  const [showGoogleSheetsImport, setShowGoogleSheetsImport] = useState(false)
  const [classIdFilter, setClassIdFilter] = useState('')

  // Sample data for testing
  const sampleData: Personnel[] = [
    { id: '1', firstName: 'John', lastName: 'Doe', requestedStation: "Senora Sheriff's Station", examGrade: 45 },
    { id: '2', firstName: 'Jane', lastName: 'Smith', requestedStation: "Davis Sheriff's Station", examGrade: 48 },
    { id: '3', firstName: 'Mike', lastName: 'Johnson', requestedStation: "Senora Sheriff's Station", examGrade: 42 },
    { id: '4', firstName: 'Sarah', lastName: 'Williams', requestedStation: "Davis Sheriff's Station", examGrade: 39 },
    { id: '5', firstName: 'Chris', lastName: 'Brown', requestedStation: "Senora Sheriff's Station", examGrade: 47 },
    { id: '6', firstName: 'Emily', lastName: 'Davis', requestedStation: "Davis Sheriff's Station", examGrade: 44 },
  ]

  const loadSampleData = () => {
    setPersonnel(sampleData)
    setJsonInput(JSON.stringify(sampleData, null, 2))
  }

  const importFromJson = () => {
    try {
      const data = JSON.parse(jsonInput)
      if (Array.isArray(data)) {
        const validatedData = data.map((person, index) => {
          // Validate station name
          const isValidStation = person.requestedStation === "Senora Sheriff's Station" || person.requestedStation === "Davis Sheriff's Station"
          
          return {
            id: person.id || `person-${index + 1}`,
            firstName: person.firstName || '',
            lastName: person.lastName || '',
            requestedStation: isValidStation ? person.requestedStation : "Senora Sheriff's Station",
            examGrade: Number(person.examGrade) || 0
          }
        })
        setPersonnel(validatedData)
      }
    } catch (error) {
      alert('Invalid JSON format. Please check your data.')
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string)
          setJsonInput(JSON.stringify(data, null, 2))
          importFromJson()
        } catch (error) {
          alert('Error reading file. Please ensure it contains valid JSON.')
        }
      }
      reader.readAsText(file)
    }
  }

  const importFromSpreadsheetData = () => {
  try {
    const lines = spreadsheetInput.trim().split('\n')
    const jsonData: Personnel[] = []

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue

      // Handle both tab-separated and comma-separated values
      const cells = line.split('\t').length > 1 ? line.split('\t') : line.split(',')
      
      // Try to detect column types by content
      let name = '', grade = 0, station = "Senora Sheriff's Station" as 'Senora Sheriff\'s Station' | 'Davis Sheriff\'s Station'
      
      cells.forEach(cell => {
        const value = cell.trim()
        if (!value) return
        
        // Check if it's a grade (number)
        if (!isNaN(parseInt(value)) && parseInt(value) <= 50) {
          grade = parseInt(value)
        }
        // Check if it's a station name
        else if (value.includes('Davis') || value.includes('Senora')) {
          station = value.includes('Davis') ? "Davis Sheriff's Station" : "Senora Sheriff's Station"
        }
        // Otherwise assume it's a name
        else {
          name = value
        }
      })

      if (!name || grade === 0) continue

      const nameParts = name.split(' ')
      const firstName = nameParts[0] || ''
      const lastName = nameParts.slice(1).join(' ') || ''

      jsonData.push({
        id: `person-${i + 1}`,
        firstName,
        lastName,
        requestedStation: station,
        examGrade: grade
      })
    }

    if (jsonData.length > 0) {
      setPersonnel(jsonData)
      setJsonInput(JSON.stringify(jsonData, null, 2))
      setShowSpreadsheetInput(false)
      setSpreadsheetInput('')
      alert(`Successfully imported ${jsonData.length} personnel records!`)
    } else {
      alert('No valid data found. Please check your format.')
    }
  } catch (error) {
    alert('Error parsing spreadsheet data. Please check your format.')
  }
}

const importFromGoogleSheets = async () => {
  if (!googleSheetsUrl.trim()) {
    alert('Please enter a Google Sheets URL')
    return
  }

  try {
    // Extract spreadsheet ID from URL
    const url = new URL(googleSheetsUrl)
    const pathSegments = url.pathname.split('/')
    const spreadsheetId = pathSegments[pathSegments.length - 2] || pathSegments[pathSegments.length - 1]
    
    if (!spreadsheetId) {
      alert('Invalid Google Sheets URL. Please make sure you copied the full URL.')
      return
    }

    // Convert to CSV export URL
    const csvUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv`
    
    const response = await fetch(csvUrl)
    if (!response.ok) {
      throw new Error('Failed to fetch spreadsheet data')
    }

    const csvData = await response.text()
    
    // Parse CSV data
    const lines = csvData.split('\n').filter(line => line.trim())
    const jsonData: Personnel[] = []

    for (let i = 1; i < lines.length; i++) { // Start from 1 to skip header
      const line = lines[i].trim()
      if (!line) continue

      const cells = line.split(',').map(cell => cell.trim().replace(/^"|"$/g, ''))
      
      // Columns: A=Timestamp, B=Grade, C=Name, D=Class ID, E=?, F=Station
      const grade = parseInt(cells[1]) || 0
      const name = cells[2] || ''
      const classId = cells[3] || ''
      const station = cells[5] || "Senora Sheriff's Station"

      // Filter by Class ID if specified
      if (classIdFilter && classId !== classIdFilter) {
        continue
      }

      if (!name || isNaN(grade)) continue

      const nameParts = name.split(' ')
      const firstName = nameParts[0] || ''
      const lastName = nameParts.slice(1).join(' ') || ''

      const validatedStation: 'Senora Sheriff\'s Station' | 'Davis Sheriff\'s Station' = 
        station.includes('Davis') ? "Davis Sheriff's Station" : "Senora Sheriff's Station"

      jsonData.push({
        id: `person-${i}`,
        firstName,
        lastName,
        requestedStation: validatedStation,
        examGrade: grade
      })
    }

    if (jsonData.length > 0) {
      setPersonnel(jsonData)
      setJsonInput(JSON.stringify(jsonData, null, 2))
      setShowGoogleSheetsImport(false)
      setGoogleSheetsUrl('')
      alert(`Successfully imported ${jsonData.length} personnel records${classIdFilter ? ` for Class ID: ${classIdFilter}` : ''}!`)
    } else {
      alert(`No valid data found${classIdFilter ? ` for Class ID: ${classIdFilter}` : ''}. Please check the format.`)
    }
  } catch (error) {
    console.error('Error importing from Google Sheets:', error)
    alert('Failed to import from Google Sheets. Please check the URL and ensure the sheet is publicly accessible.')
  }
}


  const assignStations = () => {
    if (personnel.length === 0) {
      alert('Please load personnel data first.')
      return
    }

    const totalPeople = personnel.length
    const targetSenora = Math.round(totalPeople * (senoraRatio / 100))
    const targetDavis = totalPeople - targetSenora

    // Sort by exam grade (HIGHEST first) - high grades get priority for their requests
    const sortedPersonnel = [...personnel].sort((a, b) => b.examGrade - a.examGrade)

    const assignments: Personnel[] = []
    let senoraAssigned = 0
    let davisAssigned = 0
    let requestedFulfilled = 0

    // First pass: Assign people to their requested station
    for (const person of sortedPersonnel) {
      const canAssignRequested = 
        (person.requestedStation === 'Senora Sheriff\'s Station' && senoraAssigned < targetSenora) ||
        (person.requestedStation === 'Davis Sheriff\'s Station' && davisAssigned < targetDavis)

      if (canAssignRequested) {
        // Check if this person's requested station is guaranteed
        const isGuaranteedStation = 
          (guaranteedStation === 'senora' && person.requestedStation === 'Senora Sheriff\'s Station') ||
          (guaranteedStation === 'davis' && person.requestedStation === 'Davis Sheriff\'s Station')
        
        let shouldDeny = false
        if (!isGuaranteedStation) {
          // For non-guaranteed stations, use grade-based denial
          const denialChance = Math.max(0, (35 - person.examGrade) / 100)
          shouldDeny = Math.random() < denialChance
        }

        if (!shouldDeny) {
          // Grant the request
          assignments.push({ 
            ...person, 
            assignedStation: person.requestedStation, 
            gotRequested: true 
          })
          if (person.requestedStation === 'Senora Sheriff\'s Station') senoraAssigned++
          else davisAssigned++
          requestedFulfilled++
        } else {
          // Deny the request due to low grade
          assignments.push({ ...person, assignedStation: undefined, gotRequested: false })
        }
      } else {
        // Cannot assign to requested station due to quota
        assignments.push({ ...person, assignedStation: undefined, gotRequested: false })
      }
    }

    // Second pass: Assign remaining people to fill quotas
    const unassigned = assignments.filter(p => !p.assignedStation)
      .sort((a, b) => a.examGrade - b.examGrade)

    for (const person of unassigned) {
      if (senoraAssigned < targetSenora) {
        person.assignedStation = "Senora Sheriff's Station"
        senoraAssigned++
      } else {
        person.assignedStation = "Davis Sheriff's Station"
        davisAssigned++
      }
    }

    const result: AssignmentResult = {
      assignments,
      statistics: {
        totalAssigned: totalPeople,
        senoraCount: senoraAssigned,
        davisCount: davisAssigned,
        requestedFulfilled,
        successRate: Math.round((requestedFulfilled / totalPeople) * 100)
      }
    }

    setAssignments(result)
  }

  const exportAssignments = () => {
    if (!assignments) return

    const exportData = assignments.assignments.map(person => ({
      name: `${person.firstName} ${person.lastName}`,
      requestedStation: person.requestedStation,
      assignedStation: person.assignedStation,
      examGrade: person.examGrade,
      gotRequested: person.gotRequested
    }))

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'station-assignments.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const exportAsText = () => {
    if (!assignments) return

    let text = ''
    
    // Senora Station section
    text += `# Senora Sheriff's Station (${senoraRatio}%)\n`
    const senoraPersonnel = assignments.assignments.filter(p => p.assignedStation === "Senora Sheriff's Station")
    senoraPersonnel.forEach((person, index) => {
      text += `${index + 1}. ${person.firstName} ${person.lastName}\n`
    })
    
    text += `\n`
    
    // Davis Station section
    text += `# Davis Sheriff's Station (${100 - senoraRatio}%)\n`
    const davisPersonnel = assignments.assignments.filter(p => p.assignedStation === "Davis Sheriff's Station")
    davisPersonnel.forEach((person, index) => {
      text += `${index + 1}. ${person.firstName} ${person.lastName}\n`
    })
    
    text += `\n`
    
    // Commands section
    text += `@ASD: FTP Command @CPD: DVS Command @CPD: SEN Command`

    // Copy to clipboard instead of downloading
    navigator.clipboard.writeText(text).then(() => {
      alert('Assignments copied to clipboard!')
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      alert('Assignments copied to clipboard!')
    })
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50/80 via-white to-purple-50/80 dark:from-gray-900 dark:via-blue-950/50 dark:to-purple-900/30 relative overflow-hidden">
      {/* Enhanced animated gradient orbs */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-24 -top-32 w-[520px] h-[520px] rounded-full bg-linear-to-br from-blue-200/40 via-cyan-200/30 to-purple-200/20 blur-3xl opacity-70 animate-[float_12s_ease-in-out_infinite] dark:from-blue-500/10 dark:via-cyan-500/5 dark:to-purple-500/10" />
        <div className="absolute -right-24 top-40 w-[420px] h-[420px] rounded-full bg-linear-to-tr from-purple-200/30 via-pink-200/20 to-rose-200/20 blur-2xl opacity-60 animate-[float_10s_ease-in-out_infinite_reverse] dark:from-purple-500/10 dark:via-pink-500/5 dark:to-rose-500/10" />
        <div className="absolute left-1/2 -bottom-32 w-[480px] h-[480px] rounded-full bg-linear-to-t from-green-200/25 via-emerald-200/20 to-cyan-200/15 blur-3xl opacity-50 animate-[float_15s_ease-in-out_infinite] dark:from-green-500/10 dark:via-emerald-500/5 dark:to-cyan-500/10" />
        <div className="absolute top-1/4 -right-12 w-[320px] h-80 rounded-full bg-linear-to-l from-yellow-200/20 to-orange-200/15 blur-2xl opacity-40 animate-[float_8s_ease-in-out_infinite] dark:from-yellow-500/5 dark:to-orange-500/5" />
        <div className="absolute bottom-1/4 -left-12 w-[280px] h-[280px] rounded-full bg-linear-to-r from-indigo-200/20 to-violet-200/15 blur-2xl opacity-30 animate-[float_14s_ease-in-out_infinite_reverse] dark:from-indigo-500/5 dark:to-violet-500/5" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(120,120,120,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(120,120,120,0.03)_1px,transparent_1px)] bg-size-[64px_64px] mask-[radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)] dark:bg-[linear-gradient(rgba(180,180,180,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(180,180,180,0.05)_1px,transparent_1px)]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWx0ZXI9InVybCgjYSkiIG9wYWNpdHk9Ii4wMiIvPjwvc3ZnPg==')] opacity-30 dark:opacity-10" />
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Header Section */}
        <div className="text-center mb-12 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-96 h-96 bg-linear-to-r from-primary/5 to-primary/10 rounded-full blur-3xl opacity-20 animate-pulse dark:from-primary/10 dark:to-primary/5" />
          </div>
          
          <div className="relative">
            <Badge variant="secondary" className="mb-4 animate-fade-in backdrop-blur-sm bg-white/60 dark:bg-gray-900/60 border border-transparent shadow-sm">
              🚔 Station Assignment
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-linear-to-br from-gray-900 via-gray-800 to-gray-700 dark:from-white dark:via-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
              Patrol Station Assignments
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Assign personnel to Senora Sheriff's Station and Davis Sheriff's Station based on exam grades and preferences
              <span className="block text-sm mt-2 opacity-80">
                Customizable ratios • Priority assignments • JSON import/export • Spreadsheet support
              </span>
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Input Panel */}
          <Card className="border-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md shadow-sm hover:shadow-lg transition-all duration-500 h-full">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-blue-500/10 backdrop-blur-sm border border-transparent">
                    <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-gray-900 dark:text-gray-100">
                      Personnel Data
                    </CardTitle>
                    <Badge variant="secondary" className="mt-2 backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border border-transparent">
                      {personnel.length} personnel loaded
                    </Badge>
                  </div>
                </div>
                <ArrowUpRight className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Station Ratio */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-base">Station Distribution Ratio</Label>
                  <Badge variant="outline" className="backdrop-blur-sm">
                    Senora: {senoraRatio}% / Davis: {100 - senoraRatio}%
                  </Badge>
                </div>
                <Slider
                  value={[senoraRatio]}
                  onValueChange={([value]) => setSenoraRatio(value)}
                  max={100}
                  min={0}
                  step={5}
                  className="backdrop-blur-sm"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>More Davis</span>
                  <span>Balanced</span>
                  <span>More Senora</span>
                </div>
              </div>

              {/* Guaranteed Station Requests */}
              <div className="space-y-3 p-3 rounded-lg bg-white/40 dark:bg-gray-800/40 border border-transparent">
                <Label className="text-base">Guaranteed Station Requests</Label>
                <div className="text-sm text-muted-foreground mb-2">
                  Choose which station gets 100% of requested applicants
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="none-guaranteed"
                      name="guaranteed-station"
                      checked={guaranteedStation === 'none'}
                      onChange={() => setGuaranteedStation('none')}
                      className="h-4 w-4 text-blue-600"
                    />
                    <Label htmlFor="none-guaranteed" className="text-sm">
                      None (Grade-based for both)
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="senora-guaranteed"
                      name="guaranteed-station"
                      checked={guaranteedStation === 'senora'}
                      onChange={() => setGuaranteedStation('senora')}
                      className="h-4 w-4 text-blue-600"
                    />
                    <Label htmlFor="senora-guaranteed" className="text-sm">
                      Senora Sheriff's Station (100% requests)
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="davis-guaranteed"
                      name="guaranteed-station"
                      checked={guaranteedStation === 'davis'}
                      onChange={() => setGuaranteedStation('davis')}
                      className="h-4 w-4 text-blue-600"
                    />
                    <Label htmlFor="davis-guaranteed" className="text-sm">
                      Davis Sheriff's Station (100% requests)
                    </Label>
                  </div>
                </div>
              </div>

              {/* JSON Input */}
              <div className="space-y-2">
                <Label htmlFor="json-input">Import JSON Data</Label>
                <textarea
                  id="json-input"
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  placeholder={`Paste JSON data here...\n\nExample format:\n[\n  {\n    "firstName": "John",\n    "lastName": "Doe",\n    "requestedStation": "Senora Sheriff's Station",\n    "examGrade": 45\n  }\n]`}
                  className="min-h-[200px] w-full font-mono text-sm backdrop-blur-sm bg-white/40 dark:bg-gray-800/40 border border-transparent rounded-md p-3 resize-y"
                />
              </div>

              <div className="flex gap-2 flex-wrap">
                <Button onClick={importFromJson} className="backdrop-blur-sm bg-white/40 dark:bg-gray-800/40 hover:bg-white/60 dark:hover:bg-gray-800/60 border border-transparent">
                  <Upload className="h-4 w-4 mr-2" />
                  Import JSON
                </Button>
                
                <Button variant="outline" onClick={loadSampleData} className="backdrop-blur-sm bg-white/40 dark:bg-gray-800/40 hover:bg-white/60 dark:hover:bg-gray-800/60 border border-transparent">
                  Load Sample Data
                </Button>

                <Button variant="outline" asChild className="backdrop-blur-sm bg-white/40 dark:bg-gray-800/40 hover:bg-white/60 dark:hover:bg-gray-800/60 border border-transparent">
                  <label className="cursor-pointer">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload File
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleFileUpload}
                      className="hidden"
                      ref={fileInputRef}
                    />
                  </label>
                </Button>

                <Button 
                  variant="outline" 
                  onClick={() => setShowSpreadsheetInput(true)}
                  className="backdrop-blur-sm bg-white/40 dark:bg-gray-800/40 hover:bg-white/60 dark:hover:bg-gray-800/60 border border-transparent"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Import Spreadsheet Data
                </Button>
                <Button 
                variant="outline" 
                onClick={() => setShowGoogleSheetsImport(true)}
                className="backdrop-blur-sm bg-white/40 dark:bg-gray-800/40 hover:bg-white/60 dark:hover:bg-gray-800/60 border border-transparent"
                >
                <Upload className="h-4 w-4 mr-2" />
                Import from Google Sheets URL
                </Button>

                {showGoogleSheetsImport && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <Card className="w-full max-w-2xl border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md">
                        <CardHeader>
                            <CardTitle>Import from Google Sheets</CardTitle>
                            <div className="text-sm text-muted-foreground">
                            Paste your Google Sheets URL to import data directly
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                            <Label>Google Sheets URL</Label>
                            <Input
                                type="url"
                                value={googleSheetsUrl}
                                onChange={(e) => setGoogleSheetsUrl(e.target.value)}
                                placeholder="https://docs.google.com/spreadsheets/d/sheetid/edit"
                                className="font-mono text-sm"
                            />
                            <div className="text-xs text-muted-foreground">
                                Make sure the sheet is publicly accessible (File → Share → Anyone with the link can view)
                            </div>
                            </div>

                            {/* Add Class ID Filter Input */}
                            <div className="space-y-2">
                            <Label htmlFor="class-id-filter">Class ID Filter (Optional)</Label>
                            <Input
                                id="class-id-filter"
                                type="text"
                                value={classIdFilter}
                                onChange={(e) => setClassIdFilter(e.target.value)}
                                placeholder="Example: 508"
                                className="font-mono text-sm"
                            />
                            <div className="text-xs text-muted-foreground">
                                Leave empty to import all data. Only rows with matching Class ID will be imported.
                            </div>
                            </div>

                            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                            <h4 className="font-semibold text-sm mb-2">Required Sheet Format:</h4>
                            <div className="text-sm space-y-1">
                                <div><strong>Column A:</strong> Timestamp (auto)</div>
                                <div><strong>Column B:</strong> Exam Grade (0-50)</div>
                                <div><strong>Column C:</strong> Full Name</div>
                                <div><strong>Column D:</strong> Class ID (filtered by above)</div>
                                <div><strong>Column E:</strong> Yes/No (ignored)</div>
                                <div><strong>Column F:</strong> Requested Station</div>
                                <div className="mt-2 text-xs">
                                The sheet should have a header row, data starts from row 2
                                </div>
                            </div>
                            </div>

                            <div className="flex gap-2">
                            <Button onClick={importFromGoogleSheets} className="flex-1">
                                <Upload className="h-4 w-4 mr-2" />
                                Import from Google Sheets
                            </Button>
                            <Button 
                                variant="outline" 
                                onClick={() => {
                                setShowGoogleSheetsImport(false)
                                setGoogleSheetsUrl('')
                                setClassIdFilter('')
                                }}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                            </div>
                        </CardContent>
                        </Card>
                    </div>
                    )}
              </div>

              <Button 
                onClick={assignStations} 
                disabled={personnel.length === 0}
                className="w-full backdrop-blur-sm bg-white/40 dark:bg-gray-800/40 hover:bg-white/60 dark:hover:bg-gray-800/60 border border-transparent"
              >
                <Target className="h-4 w-4 mr-2" />
                Generate Assignments
              </Button>
            </CardContent>
          </Card>

          {/* Results Panel */}
          <Card className="border-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md shadow-sm hover:shadow-lg transition-all duration-500 h-full">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-green-500/10 backdrop-blur-sm border border-transparent">
                    <BarChart3 className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-gray-900 dark:text-gray-100">
                      Assignment Results
                    </CardTitle>
                    <Badge variant="secondary" className="mt-2 backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border border-transparent">
                      {assignments ? `${assignments.statistics.totalAssigned} assigned` : 'No results'}
                    </Badge>
                  </div>
                </div>
                <ArrowUpRight className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {assignments ? (
                <>
                  {/* Statistics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 rounded-lg bg-blue-500/10 backdrop-blur-sm border border-transparent">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{assignments.statistics.senoraCount}</div>
                      <div className="text-sm text-muted-foreground">Senora Station</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-green-500/10 backdrop-blur-sm border border-transparent">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">{assignments.statistics.davisCount}</div>
                      <div className="text-sm text-muted-foreground">Davis Station</div>
                    </div>
                  </div>

                  <div className="text-center p-3 rounded-lg bg-purple-500/10 backdrop-blur-sm border border-transparent">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{assignments.statistics.successRate}%</div>
                    <div className="text-sm text-muted-foreground">Requests Fulfilled</div>
                  </div>

                  {/* Assignments List */}
                  <div className="space-y-3 max-h-[300px] overflow-y-auto">
                    {assignments.assignments.map((person) => (
                      <div key={person.id} className="flex items-center justify-between p-3 rounded-lg bg-white/40 dark:bg-gray-800/40 border border-transparent">
                        <div>
                          <div className="font-medium">{person.firstName} {person.lastName}</div>
                          <div className="text-sm text-muted-foreground">
                            Grade: {person.examGrade}/50 • Requested: {person.requestedStation}
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={person.assignedStation === "Senora Sheriff's Station" ? 'bg-blue-500/20 text-blue-700 dark:text-blue-300' : 'bg-green-500/20 text-green-700 dark:text-green-300'}>
                            {person.assignedStation}
                          </Badge>
                          {person.gotRequested && (
                            <div className="text-xs text-green-600 dark:text-green-400 mt-1">✓ Request Fulfilled</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={exportAssignments} className="flex-1 backdrop-blur-sm bg-white/40 dark:bg-gray-800/40 hover:bg-white/60 dark:hover:bg-gray-800/60 border border-transparent">
                      <Download className="h-4 w-4 mr-2" />
                      Export JSON
                    </Button>
                    <Button onClick={exportAsText} variant="outline" className="flex-1 backdrop-blur-sm bg-white/40 dark:bg-gray-800/40 hover:bg-white/60 dark:hover:bg-gray-800/60 border border-transparent">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy to Clipboard
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Generate assignments to see results</p>
                  <p className="text-sm">Load personnel data and click "Generate Assignments"</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Spreadsheet Data Import Modal */}
      {showSpreadsheetInput && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md">
            <CardHeader>
              <CardTitle>Import Spreadsheet Data</CardTitle>
              <div className="text-sm text-muted-foreground">
                Paste your spreadsheet data (tab or comma separated)
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Spreadsheet Data</Label>
                <textarea
                  value={spreadsheetInput}
                  onChange={(e) => setSpreadsheetInput(e.target.value)}
                  placeholder={`John Doe, 45, Senora Sheriff's Station
Jane Smith, 48, Davis Sheriff's Station
Mike Johnson, 42, Senora Sheriff's Station

Or tab-separated:
John Doe	45	Senora Sheriff's Station
Jane Smith	48	Davis Sheriff's Station`}
                  className="min-h-[200px] w-full font-mono text-sm backdrop-blur-sm bg-white/40 dark:bg-gray-800/40 border border-transparent rounded-md p-3 resize-y"
                />
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                <h4 className="font-semibold text-sm mb-2">Expected Format:</h4>
                <div className="text-sm space-y-1">
                  <div><strong>Option 1 (CSV):</strong> Name, Grade, Station</div>
                  <div><strong>Option 2 (TSV):</strong> Name[TAB]Grade[TAB]Station</div>
                  <div className="mt-2 text-xs">
                    <strong>Example:</strong> "John Doe, 45, Senora Sheriff's Station"
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={importFromSpreadsheetData} className="flex-1">
                  <Upload className="h-4 w-4 mr-2" />
                  Import Data
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowSpreadsheetInput(false)
                    setSpreadsheetInput('')
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}