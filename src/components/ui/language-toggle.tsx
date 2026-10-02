import { Languages } from 'lucide-react'
import { useLanguage } from '@/lib/language-context'
import { cn } from '@/lib/utils'

interface LanguageToggleProps {
  className?: string
  variant?: 'pill' | 'darkPill' | 'ghost' | 'minimal'
}

export function LanguageToggle({ className, variant = 'pill' }: LanguageToggleProps) {
  const { language, toggleLanguage } = useLanguage()

  // Target code to switch to: if Arabic -> show EN, if English -> show AR
  const targetCode = language === 'ar' ? 'EN' : 'AR'
  const tooltipText = language === 'ar' ? 'Switch to English' : 'التحويل للعربية'

  if (variant === 'darkPill') {
    return (
      <button
        type="button"
        onClick={toggleLanguage}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold text-white/90',
          'border border-white/15 bg-white/5 hover:bg-white/10 hover:border-emerald-500/40 hover:text-white',
          'transition-all duration-200 cursor-pointer select-none active:scale-95',
          className,
        )}
        title={tooltipText}
        aria-label="Toggle language"
      >
        <span>{targetCode}</span>
        <Languages className="size-3 text-emerald-400 stroke-[2]" />
      </button>
    )
  }

  if (variant === 'minimal') {
    return (
      <button
        type="button"
        onClick={toggleLanguage}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold text-ink',
          'border border-border/80 bg-surface/80 hover:bg-surface hover:border-emerald-border hover:text-emerald',
          'transition-all duration-200 cursor-pointer select-none active:scale-95',
          className,
        )}
        title={tooltipText}
        aria-label="Toggle language"
      >
        <span>{targetCode}</span>
        <Languages className="size-3 text-emerald stroke-[2]" />
      </button>
    )
  }

  if (variant === 'ghost') {
    return (
      <button
        type="button"
        onClick={toggleLanguage}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-xs font-semibold text-ink-muted',
          'hover:bg-muted-surface hover:text-ink transition-all duration-200 cursor-pointer select-none active:scale-95',
          className,
        )}
        title={tooltipText}
        aria-label="Toggle language"
      >
        <span>{targetCode}</span>
        <Languages className="size-3 text-emerald stroke-[2]" />
      </button>
    )
  }

  // Default clean pill
  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold text-ink',
        'border border-border/80 bg-surface/90 hover:bg-surface hover:border-emerald/40 hover:text-emerald shadow-2xs',
        'transition-all duration-200 cursor-pointer select-none active:scale-95',
        className,
      )}
      title={tooltipText}
      aria-label="Toggle language"
    >
      <span>{targetCode}</span>
      <Languages className="size-3 text-emerald stroke-[2]" />
    </button>
  )
}
