import { NextResponse } from 'next/server'
import { getTemplateCategoriesWithCount } from '@/lib/paperwork-templates'

export async function GET() {
  try {
    const categories = await getTemplateCategoriesWithCount()
    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error in categories API:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}