import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  isSameDay,
  addMonths,
  subMonths,
} from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { useAuthStore } from '@/stores/auth'
import { useDrinkLogStore } from '@/stores/drink-log'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DRINK_CATEGORY_EMOJIS } from '@/types'

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六']

export function CalendarView() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { logs, loading, currentMonth, fetchLogs, setCurrentMonth } = useDrinkLogStore()

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })
  const startPadding = getDay(monthStart)

  useEffect(() => {
    if (user) {
      fetchLogs(user.id, format(monthStart, 'yyyy-MM-dd'), format(monthEnd, 'yyyy-MM-dd'))
    }
  }, [user, currentMonth])

  const logsByDate = useMemo(() => {
    const map = new Map<string, typeof logs>()
    for (const log of logs) {
      const existing = map.get(log.log_date) ?? []
      existing.push(log)
      map.set(log.log_date, existing)
    }
    return map
  }, [logs])

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* 头部 */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">
          {format(currentMonth, 'yyyy年 M月', { locale: zhCN })}
        </h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setCurrentMonth(new Date())}>
            今天
          </Button>
          <Button variant="outline" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* 星期标题 */}
      <div className="grid grid-cols-7 mb-2">
        {WEEKDAYS.map((day) => (
          <div key={day} className="text-center text-sm text-muted-foreground py-2">
            {day}
          </div>
        ))}
      </div>

      {/* 日历网格 */}
      <div className="grid grid-cols-7 gap-1">
        {/* 前面的空白 */}
        {Array.from({ length: startPadding }).map((_, i) => (
          <div key={`pad-${i}`} />
        ))}

        {days.map((day) => {
          const dateStr = format(day, 'yyyy-MM-dd')
          const dayLogs = logsByDate.get(dateStr) ?? []
          const isToday = isSameDay(day, new Date())

          return (
            <Card
              key={dateStr}
              className={`p-2 min-h-[80px] cursor-pointer transition-colors hover:bg-accent/50 ${
                isToday ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => navigate(`/calendar/${dateStr}`)}
            >
              <div className="text-sm font-medium mb-1">{format(day, 'd')}</div>
              <div className="flex flex-wrap gap-0.5">
                {dayLogs.slice(0, 3).map((log) => (
                  <span key={log.id} className="text-xs" title={log.drink_name}>
                    {DRINK_CATEGORY_EMOJIS[log.category]}
                  </span>
                ))}
                {dayLogs.length > 3 && (
                  <Badge variant="secondary" className="text-[10px] px-1">
                    +{dayLogs.length - 3}
                  </Badge>
                )}
              </div>
            </Card>
          )
        })}
      </div>

      {/* 新增按钮 */}
      <Button
        className="fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-lg"
        onClick={() => navigate('/log/new')}
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  )
}
