// app/api/paperwork-generators/[category]/[template]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const templatesDirectory = path.join(process.cwd(), 'data', 'paperwork-templates')

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ category: string; template: string }> }
) {
  try {
    const { category, template } = await params
    
    console.log(`🔍 API: Looking for template ${template} in ${category}`)
    
    const categoryPath = path.join(templatesDirectory, category)
    const filePath = path.join(categoryPath, `${template}.json`)
    
    console.log(`📁 Category path: ${categoryPath}`)
    console.log(`📄 File path: ${filePath}`)
    
    if (!fs.existsSync(categoryPath)) {
      console.log(`❌ Category directory not found: ${categoryPath}`)
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }
    
    if (!fs.existsSync(filePath)) {
      console.log(`❌ Template file not found: ${filePath}`)
      const files = fs.readdirSync(categoryPath)
      console.log(`📋 Available files in ${category}:`, files)
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }
    
    const content = fs.readFileSync(filePath, 'utf8')
    console.log(`📖 File content length: ${content.length} characters`)
    
    if (!content.trim()) {
      console.log(`❌ Template file is empty: ${filePath}`)
      return NextResponse.json(
        { error: 'Template file is empty' },
        { status: 500 }
      )
    }
    
    let templateData
    try {
      templateData = JSON.parse(content)
    } catch (parseError) {
      console.error(`❌ Error parsing JSON from ${filePath}:`, parseError)
      return NextResponse.json(
        { error: 'Invalid JSON format in template file' },
        { status: 500 }
      )
    }

    // Convert field syntax from old to new
    templateData = convertFieldSyntax(templateData)

    // Ensure template property exists
    templateData = ensureTemplateProperty(templateData)
    
    // FIX: If template property is missing but baseContent exists, use baseContent as template
    if (!templateData.template && templateData.baseContent) {
      console.log(`🔄 Using baseContent as template`)
      templateData.template = templateData.baseContent
    }
    
    // If both are missing, create a basic template from fields
    if (!templateData.template) {
      console.log(`📝 Creating basic template from fields`)
      templateData.template = generateBasicTemplate(templateData)
    }
    
    console.log(`✅ Template loaded successfully: ${templateData.name}`)
    console.log(`✅ Template has ${templateData.fields?.length || 0} fields`)
    console.log(`✅ Template content length: ${templateData.template?.length || 0} chars`)
    
    return NextResponse.json(templateData)
  } catch (error) {
    console.error(`💥 Unexpected error loading template:`, error)
    return NextResponse.json(
      { error: 'Failed to fetch template' },
      { status: 500 }
    )
  }
}

// Helper function to generate a basic template if none exists
function generateBasicTemplate(templateData: any): string {
  let template = `# ${templateData.name || 'Untitled Template'}\n\n`
  
  if (templateData.description) {
    template += `${templateData.description}\n\n`
  }
  
  templateData.fields?.forEach((field: any) => {
    template += `**${field.label}:** {{${field.id}}}\n\n`
  })
  
  return template
}

function convertFieldSyntax(templateData: any) {
  if (!templateData.template) return templateData
  
  let template = templateData.template
  
  // Convert {{type:field_name}} to {{field_id}}
  templateData.fields?.forEach((field: any) => {
    const oldPattern = `{{${field.type}:${field.name}}}`
    const newPattern = `{{${field.id}}}`
    template = template.replace(new RegExp(oldPattern, 'g'), newPattern)
  })
  
  templateData.template = template
  return templateData
}

// Helper function to ensure template property exists with proper structure
function ensureTemplateProperty(templateData: any): any {
  // If template doesn't exist but baseContent does, use baseContent
  if (!templateData.template && templateData.baseContent) {
    templateData.template = templateData.baseContent
  }
  
  // Ensure template is a string
  if (typeof templateData.template !== 'string') {
    templateData.template = ''
  }
  
  // Ensure fields array exists
  if (!Array.isArray(templateData.fields)) {
    templateData.fields = []
  }
  
  // Ensure each field has required properties
  templateData.fields = templateData.fields.map((field: any, index: number) => {
    // If field is a string, convert to object
    if (typeof field === 'string') {
      return {
        id: `field_${index}`,
        name: field,
        label: field,
        type: 'text'
      }
    }
    
    // Ensure field has required properties
    return {
      id: field.id || `field_${index}`,
      name: field.name || field.label || `field_${index}`,
      label: field.label || field.name || `Field ${index + 1}`,
      type: field.type || 'text',
      ...field // Keep any additional properties
    }
  })
  
  return templateData
}