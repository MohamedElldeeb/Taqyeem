import * as React from 'react'
import { Star } from 'lucide-react'

import { cn } from '@/lib/utils'

export interface StarRatingProps {
  value: number
  onChange: (value: number) => void
  max?: number
  disabled?: boolean
  accentColor?: string
  className?: string
}

const RATING_LABELS: Record<number, string> = {
  1: 'سيئة',
  2: 'مقبولة',
  3: 'جيدة',
  4: 'جيدة جداً',
  5: 'ممتازة',
}

function StarRating({
  value,
  onChange,
  max = 5,
  disabled = false,
  accentColor,
  className,
}: StarRatingProps) {
  const [hovered, setHovered] = React.useState<number | null>(null)
  const displayValue = hovered ?? value

  return (
    <div
      role="radiogroup"
      aria-label="التقييم"
      className={cn('flex items-center gap-1', className)}
      onMouseLeave={() => setHovered(null)}
    >
      {Array.from({ length: max }, (_, index) => index + 1).map((star) => {
        const filled = star <= displayValue
        return (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={value === star}
            aria-label={`${star} من ${max} — ${RATING_LABELS[star]}`}
            disabled={disabled}
            onMouseEnter={() => setHovered(star)}
            onFocus={() => setHovered(star)}
            onBlur={() => setHovered(null)}
            onClick={() => onChange(star)}
            className={cn(
              'rounded-sm p-1 transition-transform disabled:cursor-not-allowed disabled:opacity-50',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border focus-visible:ring-offset-2 focus-visible:ring-offset-background',
              !disabled && 'hover:scale-110',
            )}
          >
            <Star
              className="size-8"
              style={{
                color: filled ? (accentColor ?? 'var(--color-emerald)') : 'var(--color-border)',
                fill: filled ? (accentColor ?? 'var(--color-emerald)') : 'transparent',
              }}
            />
          </button>
        )
      })}
    </div>
  )
}

export { StarRating }
