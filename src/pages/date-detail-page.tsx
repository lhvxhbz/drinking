import { useParams, useNavigate } from 'react-router-dom'
import { format, parseISO } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { ArrowLeft, Plus } from 'lucide-react'
import { useDrinkLogStore } from '@/stores/drink-log'
import { DrinkLogCard } from '@/features/drink-log/drink-log-card'
import { Button } from '@/components/ui/button'

export default function DateDetailPage() {
  const { date } = useParams<{ date: string }>()
  const navigate = useNavigate()
  const { getLogsByDate } = useDrinkLogStore()

  if (!date) return null

  const logs = getLogsByDate(date)
  const displayDate = format(parseISO(date), 'M月d日 EEEE', { locale: zhCN })

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate('/calendar')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-xl font-semibold">{displayDate}</h1>
      </div>

      {logs.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg mb-2">这天还没有记录</p>
          <p className="text-sm">点击下方按钮添加第一杯饮品</p>
        </div>
      ) : (
        <div className="space-y-3">
          {logs.map((log) => (
            <DrinkLogCard key={log.id} log={log} />
          ))}
        </div>
      )}

      <Button
        className="fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-lg"
        onClick={() => navigate(`/log/new?date=${date}`)}
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  )
}
