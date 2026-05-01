import { Card, CardContent } from '@/components/ui/card'
import { Users } from 'lucide-react'

export default function FriendsPage() {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">好友</h1>
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          <Users className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>好友功能即将上线</p>
        </CardContent>
      </Card>
    </div>
  )
}
