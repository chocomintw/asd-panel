import { PaperworkTemplate, TemplateCategory } from '@/types/paperwork'
import fs from 'fs'
import path from 'path'

const templatesDirectory = path.join(process.cwd(), 'data', 'paperwork-templates')

// Server-side functions (for API routes and server components)
export async function getTemplateCategories(): Promise<string[]> {
  try {
    if (!fs.existsSync(templatesDirectory)) {
      fs.mkdirSync(templatesDirectory, { recursive: true })
      return []
    }
    
    const categories = fs.readdirSync(templatesDirectory)
    return categories.filter(cat => 
      fs.statSync(path.join(templatesDirectory, cat)).isDirectory()
    )
  } catch (error) {
    console.error('Error loading template categories:', error)
    return []
  }
}

export async function getTemplatesByCategory(category: string): Promise<PaperworkTemplate[]> {
  try {
    const categoryPath = path.join(templatesDirectory, category)
    
    console.log(`🔍 Looking for templates in: ${categoryPath}`)
    
    if (!fs.existsSync(categoryPath)) {
      console.log(`❌ Category directory doesn't exist: ${categoryPath}`)
      return []
    }
    
    const files = fs.readdirSync(categoryPath)
    console.log(`📁 Files found in ${category}:`, files)
    
    const templates: PaperworkTemplate[] = []
    
    for (const file of files) {
      if (file.endsWith('.json') && file !== 'index.json') {
        try {
          const filePath = path.join(categoryPath, file)
          console.log(`📄 Loading template file: ${filePath}`)
          
          const content = fs.readFileSync(filePath, 'utf8')
          const template = JSON.parse(content)
          
          // Validate required fields
          if (template.id && template.name && template.category && template.baseContent && template.fields) {
            console.log(`✅ Valid template loaded: ${template.name}`)
            templates.push(template)
          } else {
            console.warn(`❌ Invalid template structure in ${file}:`, template)
          }
        } catch (error) {
          console.error(`💥 Error parsing template file ${file}:`, error)
        }
      }
    }
    
    console.log(`🎯 Total valid templates for ${category}:`, templates.length)
    return templates
  } catch (error) {
    console.error(`💥 Error loading templates for category ${category}:`, error)
    return []
  }
}

export async function getTemplate(category: string, templateId: string): Promise<PaperworkTemplate | null> {
  try {
    const filePath = path.join(templatesDirectory, category, `${templateId}.json`)
    
    if (!fs.existsSync(filePath)) {
      return null
    }
    
    const content = fs.readFileSync(filePath, 'utf8')
    const template = JSON.parse(content)
    
    // Validate template
    if (!template.id || !template.name || !template.category || !template.baseContent || !template.fields) {
      console.error('Invalid template structure:', template)
      return null
    }
    
    return template
  } catch (error) {
    console.error(`Error loading template ${templateId} from ${category}:`, error)
    return null
  }
}

export async function getAllTemplates(): Promise<PaperworkTemplate[]> {
  const categories = await getTemplateCategories()
  const allTemplates: PaperworkTemplate[] = []
  
  for (const category of categories) {
    const templates = await getTemplatesByCategory(category)
    allTemplates.push(...templates)
  }
  
  return allTemplates
}

export async function getTemplateCategoriesWithCount(): Promise<TemplateCategory[]> {
  const categories = await getTemplateCategories()
  const allTemplates = await getAllTemplates()
  
  return categories.map(category => {
    const templateCount = allTemplates.filter(t => t.category === category).length
    const displayName = category.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
    
    return {
      id: category,
      name: displayName,
      description: `${displayName} paperwork templates`,
      templateCount
    }
  })
}