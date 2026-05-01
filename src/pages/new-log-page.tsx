import { useSearchParams } from 'react-router-dom'
import { DrinkLogForm } from '@/features/drink-log/drink-log-form'

export default function NewLogPage() {
  const [searchParams] = useSearchParams()
  const defaultDate = searchParams.get('date') ?? undefined

  return (
    <div className="p-6">
      <DrinkLogForm defaultDate={defaultDate} />
    </div>
  )
}
