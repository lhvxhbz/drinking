import { useState } from 'react'
import { format, addMonths, subMonths } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useAuthStore } from '@/stores/auth'
import { useMonthlyStats } from '@/features/stats/stats-hooks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DRINK_CATEGORY_LABELS, DRINK_CATEGORY_EMOJIS, type DrinkCategory } from '@/types'
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'

const COLORS = ['#6b4c3b', '#c9a96e', '#5a9e6f', '#e07b39', '#8b5cf6']

export default function StatsPage() {
  const { user } = useAuthStore()
  const [month, setMonth] = useState(new Date())
  const { stats, loading } = useMonthlyStats(user?.id, month)

  const categoryData = Object.entries(stats.categoryDistribution)
    .filter(([, v]) => v > 0)
    .map(([k, v]) => ({
      name: `${DRINK_CATEGORY_EMOJIS[k as DrinkCategory]} ${DRINK_CATEGORY_LABELS[k as DrinkCategory]}`,
      value: v,
    }))

  const ratingData = Object.entries(stats.ratingDistribution).map(([k, v]) => ({
    name: `${k}星`,
    count: v,
  }))

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center text-muted-foreground">
        加载中...
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* 月份选择 */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">饮品统计</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => setMonth(subMonths(month, 1))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium w-20 text-center">
            {format(month, 'yyyy年M月', { locale: zhCN })}
          </span>
          <Button variant="outline" size="icon" onClick={() => setMonth(addMonths(month, 1))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* 概览卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-primary">{stats.totalDays}</p>
            <p className="text-sm text-muted-foreground mt-1">打卡天数</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-primary">{stats.totalDrinks}</p>
            <p className="text-sm text-muted-foreground mt-1">饮品杯数</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-accent">{stats.avgRating || '-'}</p>
            <p className="text-sm text-muted-foreground mt-1">平均评分</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl">
              {stats.topCategory ? DRINK_CATEGORY_EMOJIS[stats.topCategory] : '-'}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {stats.topCategory ? DRINK_CATEGORY_LABELS[stats.topCategory] : '最爱品类'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 图表行 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 品类分布 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">品类分布</CardTitle>
          </CardHeader>
          <CardContent>
            {categoryData.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">暂无数据</p>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* 评分分布 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">评分分布</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={ratingData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#6b4c3b" radius={[4, 4, 0, 0]} name="杯数" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* 近 6 个月趋势 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">近 6 个月趋势</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={stats.recentMonths}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#6b4c3b"
                strokeWidth={2}
                dot={{ r: 4 }}
                name="饮品杯数"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 每日打卡柱状图 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">每日饮品数</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.dailyCounts.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">暂无数据</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stats.dailyCounts}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="date"
                  tickFormatter={(v) => parseInt(v.split('-')[2], 10).toString()}
                />
                <YAxis allowDecimals={false} />
                <Tooltip labelFormatter={(v) => `${v}`} />
                <Bar dataKey="count" fill="#c9a96e" radius={[3, 3, 0, 0]} name="杯数" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
