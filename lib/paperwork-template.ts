import { PaperworkTemplate, TemplateCategory } from '@/types/paperwork'

// Known categories and templates
const KNOWN_CATEGORIES = ['communications', 'hr', 'finance', 'custom'] as const
type KnownCategory = typeof KNOWN_CATEGORIES[number]

// Template registry - maps categories to their templates
const templateRegistry: Record<KnownCategory, string[]> = {
  communications: ['forum-post', 'announcement', 'meeting-minutes'],
  hr: ['employee-onboarding', 'performance-review', 'timeoff-request'],
  finance: ['expense-report', 'budget-request', 'invoice'],
  custom: [] // Will be populated from user-created templates
}

export async function getTemplateCategories(): Promise<string[]> {
  return [...KNOWN_CATEGORIES]
}

export async function getTemplatesByCategory(category: string): Promise<PaperworkTemplate[]> {
  try {
    const templates = templateRegistry[category as KnownCategory] || []
    const loadedTemplates: PaperworkTemplate[] = []
    
    for (const templateId of templates) {
      try {
        const template = await import(`@/data/paperwork-templates/${category}/${templateId}.json`)
        loadedTemplates.push(template.default)
      } catch (error) {
        console.warn(`Failed to load template ${templateId} from ${category}:`, error)
      }
    }
    
    return loadedTemplates
  } catch (error) {
    console.error(`Error loading templates for category ${category}:`, error)
    return []
  }
}

export async function getTemplate(category: string, templateId: string): Promise<PaperworkTemplate | null> {
  try {
    const template = await import(`@/data/paperwork-templates/${category}/${templateId}.json`)
    return template.default
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

// Add this function - it was missing
export async function getTemplateCategoriesWithCount(): Promise<TemplateCategory[]> {
  const categories = await getTemplateCategories()
  const allTemplates = await getAllTemplates()
  
  return categories.map(category => ({
    id: category,
    name: category.charAt(0).toUpperCase() + category.slice(1),
    description: `${category} paperwork templates`,
    templateCount: allTemplates.filter(t => t.category === category).length
  }))
}

// Helper to register new templates (for custom templates)
export function registerTemplate(category: KnownCategory, templateId: string) {
  if (!templateRegistry[category].includes(templateId)) {
    templateRegistry[category].push(templateId)
  }
}