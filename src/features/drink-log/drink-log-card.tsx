import type { IDrinkLog } from '@/types'
import { DRINK_CATEGORY_LABELS, DRINK_CATEGORY_EMOJIS } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { StarRating } from './star-rating'

interface DrinkLogCardProps {
  log: IDrinkLog
  onClick?: () => void
}

export function DrinkLogCard({ log, onClick }: DrinkLogCardProps) {
  return (
    <Card className="cursor-pointer hover:bg-accent/30 transition-colors" onClick={onClick}>
      <CardContent className="p-4 flex items-start gap-3">
        <span className="text-2xl">{DRINK_CATEGORY_EMOJIS[log.category]}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium truncate">{log.drink_name}</span>
            {log.is_recommended && (
              <Badge variant="secondary" className="text-xs">推荐</Badge>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
            {log.brand && <span>{log.brand}</span>}
            <span>{DRINK_CATEGORY_LABELS[log.category]}</span>
          </div>
          <div className="mt-1">
            <StarRating value={log.rating} size={14} />
          </div>
          {log.comment && (
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{log.comment}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
