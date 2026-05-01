import { Star } from 'lucide-react'

interface StarRatingProps {
  value: number
  onChange?: (value: number) => void
  size?: number
}

export function StarRating({ value, onChange, size = 24 }: StarRatingProps) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange?.(star)}
          className={onChange ? 'cursor-pointer' : 'cursor-default'}
        >
          <Star
            size={size}
            className={star <= value ? 'fill-accent text-accent' : 'text-muted-foreground/30'}
          />
        </button>
      ))}
    </div>
  )
}
