import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const templatesDirectory = path.join(process.cwd(), 'data', 'paperwork-templates')

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ category: string }> }
) {
  try {
    const { category } = await params
    
    console.log(`🔍 Loading templates for category: ${category}`)
    
    const categoryPath = path.join(templatesDirectory, category)
    
    if (!fs.existsSync(categoryPath)) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    const files = fs.readdirSync(categoryPath)
    const jsonFiles = files.filter(file => file.endsWith('.json'))

    const templates = []
    
    for (const file of jsonFiles) {
      try {
        const filePath = path.join(categoryPath, file)
        const content = fs.readFileSync(filePath, 'utf8')
        const templateData = JSON.parse(content)
        
        templates.push({
          id: file.replace('.json', ''),
          name: templateData.name || 'Unnamed Template',
          description: templateData.description || 'No description available',
        })
      } catch (fileError) {
        console.error(`Error reading file ${file}:`, fileError)
      }
    }

    return NextResponse.json(templates)
  } catch (error) {
    console.error('Error loading templates:', error)
    return NextResponse.json(
      { error: 'Failed to load templates' },
      { status: 500 }
    )
  }
}