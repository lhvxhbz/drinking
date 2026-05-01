import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns'
import type { DrinkCategory } from '@/types'

export interface MonthlyStats {
  totalDays: number
  totalDrinks: number
  avgRating: number
  topCategory: DrinkCategory | null
  categoryDistribution: Record<DrinkCategory, number>
  ratingDistribution: Record<number, number>
  dailyCounts: { date: string; count: number }[]
  recentMonths: { month: string; count: number }[]
}

const EMPTY_STATS: MonthlyStats = {
  totalDays: 0,
  totalDrinks: 0,
  avgRating: 0,
  topCategory: null,
  categoryDistribution: { coffee: 0, milk_tea: 0, juice: 0, soda: 0, other: 0 },
  ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  dailyCounts: [],
  recentMonths: [],
}

export function useMonthlyStats(userId: string | undefined, month: Date) {
  const [stats, setStats] = useState<MonthlyStats>(EMPTY_STATS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return
    fetchStats(userId, month).then((s) => {
      setStats(s)
      setLoading(false)
    })
  }, [userId, month])

  return { stats, loading }
}

async function fetchStats(userId: string, month: Date): Promise<MonthlyStats> {
  const startDate = format(startOfMonth(month), 'yyyy-MM-dd')
  const endDate = format(endOfMonth(month), 'yyyy-MM-dd')

  // 当月记录
  const { data: logs } = await supabase
    .from('drink_logs')
    .select('*')
    .eq('user_id', userId)
    .gte('log_date', startDate)
    .lte('log_date', endDate)

  if (!logs || logs.length === 0) return EMPTY_STATS

  // 打卡天数
  const uniqueDays = new Set(logs.map((l) => l.log_date))

  // 平均评分
  const avgRating = logs.reduce((sum, l) => sum + l.rating, 0) / logs.length

  // 品类分布
  const categoryDistribution: Record<DrinkCategory, number> = {
    coffee: 0, milk_tea: 0, juice: 0, soda: 0, other: 0,
  }
  for (const log of logs) {
    categoryDistribution[log.category as DrinkCategory]++
  }
  const topCategory = Object.entries(categoryDistribution).sort(
    ([, a], [, b]) => b - a
  )[0][0] as DrinkCategory

  // 评分分布
  const ratingDistribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  for (const log of logs) {
    ratingDistribution[log.rating]++
  }

  // 每日打卡数
  const dailyMap = new Map<string, number>()
  for (const log of logs) {
    dailyMap.set(log.log_date, (dailyMap.get(log.log_date) ?? 0) + 1)
  }
  const dailyCounts = Array.from(dailyMap.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date))

  // 最近 6 个月趋势
  const recentMonths: { month: string; count: number }[] = []
  for (let i = 5; i >= 0; i--) {
    const m = subMonths(month, i)
    const s = format(startOfMonth(m), 'yyyy-MM-dd')
    const e = format(endOfMonth(m), 'yyyy-MM-dd')
    const { count } = await supabase
      .from('drink_logs')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('log_date', s)
      .lte('log_date', e)
    recentMonths.push({
      month: format(m, 'M月'),
      count: count ?? 0,
    })
  }

  return {
    totalDays: uniqueDays.size,
    totalDrinks: logs.length,
    avgRating: Math.round(avgRating * 10) / 10,
    topCategory,
    categoryDistribution,
    ratingDistribution,
    dailyCounts,
    recentMonths,
  }
}
