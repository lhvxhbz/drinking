import { Star } from 'lucide-react'

interface StarRatingProps {
  value: number
  onChange?: (value: number) => void
  size?: number
}

export function StarRating({ value, onChange, size = 24 }: StarRatingProps) {
  const handleClick = (star: number, e: React.MouseEvent<HTMLButtonElement>) => {
    if (!onChange) return
    // 点击左半边 = x.5，右半边 = x.0
    const rect = e.currentTarget.getBoundingClientRect()
    const isLeftHalf = e.clientX - rect.left < rect.width / 2
    onChange(isLeftHalf ? star - 0.5 : star)
  }

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = value >= star
        const halfFilled = !filled && value >= star - 0.5

        return (
          <button
            key={star}
            type="button"
            onClick={(e) => handleClick(star, e)}
            className={`relative ${onChange ? 'cursor-pointer' : 'cursor-default'}`}
            style={{ width: size, height: size }}
          >
            {/* 底层空星 */}
            <Star
              size={size}
              className="absolute inset-0 text-muted-foreground/30"
            />
            {/* 半星填充层 */}
            {halfFilled && (
              <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
                <Star size={size} className="fill-accent text-accent" />
              </div>
            )}
            {/* 全星填充层 */}
            {filled && (
              <Star size={size} className="absolute inset-0 fill-accent text-accent" />
            )}
          </button>
        )
      })}
      <span className="ml-1 text-sm text-muted-foreground self-center">{value}</span>
    </div>
  )
}
