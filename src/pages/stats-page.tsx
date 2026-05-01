import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function StatsPage() {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">饮品统计</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">本月打卡</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">--</p>
            <p className="text-sm text-muted-foreground">天</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">最爱品类</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-accent">--</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
