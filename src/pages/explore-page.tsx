import { Card, CardContent } from '@/components/ui/card'
import { Compass } from 'lucide-react'

export default function ExplorePage() {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">探索</h1>
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          <Compass className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>好友推荐即将上线</p>
        </CardContent>
      </Card>
    </div>
  )
}
