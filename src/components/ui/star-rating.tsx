import * as React from 'react'
import { Star } from 'lucide-react'
import { useLanguage } from '@/lib/language-context'
import { cn } from '@/lib/utils'

export interface StarRatingProps {
  value: number
  onChange: (value: number) => void
  max?: number
  disabled?: boolean
  accentColor?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showLabel?: boolean
  className?: string
}

const RATING_LABELS_AR: Record<number, string> = {
  1: 'تحتاج إلى تحسين (١/٥)',
  2: 'مقبولة (٢/٥)',
  3: 'جيدة ومُرضية (٣/٥)',
  4: 'رائعة جداً (٤/٥)',
  5: 'تجربة استثنائية ممتازة! (٥/٥)',
}

const RATING_LABELS_EN: Record<number, string> = {
  1: 'Needs Improvement (1/5)',
  2: 'Fair (2/5)',
  3: 'Good (3/5)',
  4: 'Very Good (4/5)',
  5: 'Outstanding Experience! (5/5)',
}

function StarRating({
  value,
  onChange,
  max = 5,
  disabled = false,
  accentColor,
  size = 'md',
  showLabel = false,
  className,
}: StarRatingProps) {
  const { language } = useLanguage()
  const [hovered, setHovered] = React.useState<number | null>(null)
  const displayValue = hovered ?? value

  const sizeClasses = {
    sm: 'size-5',
    md: 'size-7',
    lg: 'size-9',
    xl: 'size-11',
  }

  const activeColor = accentColor || '#F59E0B' // Warm vibrant gold default, or custom merchant brand color

  const labels = language === 'ar' ? RATING_LABELS_AR : RATING_LABELS_EN

  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      <div
        role="radiogroup"
        aria-label={language === 'ar' ? 'التقييم بالنجوم' : 'Star rating'}
        className="flex items-center gap-1.5"
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
              aria-label={`${star} / ${max}`}
              disabled={disabled}
              onMouseEnter={() => !disabled && setHovered(star)}
              onFocus={() => !disabled && setHovered(star)}
              onBlur={() => !disabled && setHovered(null)}
              onClick={() => !disabled && onChange(star)}
              className={cn(
                'group relative rounded-xl p-1.5 transition-all duration-200 cursor-pointer disabled:cursor-default',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2',
                !disabled && 'hover:scale-125 active:scale-95',
              )}
            >
              <Star
                className={cn(
                  sizeClasses[size],
                  'transition-all duration-200',
                  filled ? 'drop-shadow-xs' : 'opacity-40',
                )}
                style={{
                  color: filled ? activeColor : '#CBD5E1',
                  fill: filled ? activeColor : 'transparent',
                }}
              />
            </button>
          )
        })}
      </div>

      {showLabel && displayValue > 0 && (
        <span className="text-xs font-semibold text-ink-muted animate-fade-in">
          {labels[displayValue]}
        </span>
      )}
    </div>
  )
}

export { StarRating }
