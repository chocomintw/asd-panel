import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const templatesDirectory = path.join(process.cwd(), 'data', 'paperwork-templates')

export async function POST(request: NextRequest) {
  try {
    const { template, category, templateId } = await request.json()

    // Validate required fields
    if (!template?.id || !template?.name || !template?.category || !template?.baseContent || !template?.fields) {
      return NextResponse.json(
        { error: 'Invalid template structure' },
        { status: 400 }
      )
    }

    // Ensure category directory exists
    const categoryPath = path.join(templatesDirectory, category)
    if (!fs.existsSync(categoryPath)) {
      fs.mkdirSync(categoryPath, { recursive: true })
      console.log(`Created category directory: ${categoryPath}`)
    }

    // Save template file
    const filePath = path.join(categoryPath, `${templateId}.json`)
    fs.writeFileSync(filePath, JSON.stringify(template, null, 2))

    console.log(`Template saved: ${filePath}`)

    return NextResponse.json({ 
      success: true, 
      message: `Template saved to ${filePath}`,
      path: filePath
    })
  } catch (error) {
    console.error('Error saving template:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}