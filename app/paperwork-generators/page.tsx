import { CategoryGrid } from '@/components/paperwork/category-grid'

export default function PaperworkGeneratorsPage() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-foreground/90">Paperwork Generators</h1>
        <p className="text-muted-foreground/80">
          Choose a category to access pre-built paperwork templates
        </p>
      </header>
      
      <CategoryGrid />
      
      {/* Custom Templates Card */}
      <div className="mt-12 max-w-md mx-auto">
        <a 
          href="/tools/bbcode-template-editor" 
          className="group block"
        >
          <div className="p-8 border-2 border-dashed border-muted/50 rounded-lg hover:border-primary/50 hover:shadow-lg transition-all duration-300 group-hover:bg-muted/20 text-center h-full backdrop-blur-sm">
            <h3 className="text-xl font-semibold mb-4 group-hover:text-primary/80 transition-colors text-foreground/90">
              Create Custom Template
            </h3>
            <p className="text-muted-foreground/80 leading-relaxed">
              Design your own paperwork template using our visual editor
            </p>
          </div>
        </a>
      </div>
    </div>
  )
}