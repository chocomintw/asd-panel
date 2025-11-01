import { Card, CardContent } from '@/components/ui/card'

interface ErrorSectionProps {
  error: string;
}

export function ErrorSection({ error }: ErrorSectionProps) {
  if (!error) return null;

  return (
    <Card className="border-red-200 bg-red-50">
      <CardContent className="pt-6">
        <div className="text-red-700 text-sm">{error}</div>
      </CardContent>
    </Card>
  )
}