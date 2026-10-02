import { Laptop, Moon, Sun } from 'lucide-react'
import { useTheme, type Theme } from '@/lib/theme-context'
import { useLanguage } from '@/lib/language-context'
import { cn } from '@/lib/utils'

interface ThemeToggleProps {
  variant?: 'pill' | 'darkPill' | 'minimal' | 'segmented'
  className?: string
}

export function ThemeToggle({ variant = 'pill', className }: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme()
  const { language } = useLanguage()

  const isDark = resolvedTheme === 'dark'

  const tooltipText = isDark
    ? language === 'ar' ? 'التحويل للوضع الفاتح' : 'Switch to Light Mode'
    : language === 'ar' ? 'التحويل للوضع الداكن' : 'Switch to Dark Mode'

  if (variant === 'segmented') {
    const options: { id: Theme; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
      { id: 'light', label: language === 'ar' ? 'فاتح' : 'Light', icon: Sun },
      { id: 'dark', label: language === 'ar' ? 'داكن' : 'Dark', icon: Moon },
      { id: 'system', label: language === 'ar' ? 'تلقائي' : 'System', icon: Laptop },
    ]

    return (
      <div className={cn('inline-flex items-center gap-1 rounded-2xl border border-border bg-background-subtle p-1 shadow-2xs', className)}>
        {options.map(({ id, label, icon: Icon }) => {
          const active = theme === id
          return (
            <button
              key={id}
              type="button"
              onClick={() => setTheme(id)}
              className={cn(
                'flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all duration-150 cursor-pointer select-none',
                active
                  ? 'bg-surface text-emerald shadow-xs border border-border/80'
                  : 'text-ink-muted hover:text-ink hover:bg-surface/50 active:scale-95',
              )}
            >
              <Icon className={cn('size-3.5', active ? 'text-emerald' : 'text-ink-subtle')} />
              <span>{label}</span>
            </button>
          )
        })}
      </div>
    )
  }

  if (variant === 'darkPill') {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold text-white/90',
          'border border-white/15 bg-white/5 hover:bg-white/10 hover:border-emerald-500/40 hover:text-white',
          'transition-all duration-200 cursor-pointer select-none active:scale-95',
          className,
        )}
        title={tooltipText}
        aria-label="Toggle theme"
      >
        <span>{isDark ? (language === 'ar' ? 'فاتح' : 'Light') : (language === 'ar' ? 'داكن' : 'Dark')}</span>
        {isDark ? (
          <Sun className="size-3 text-amber-400" />
        ) : (
          <Moon className="size-3 text-emerald-400" />
        )}
      </button>
    )
  }

  if (variant === 'minimal') {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        className={cn(
          'inline-flex size-8 items-center justify-center rounded-full transition-all duration-200 cursor-pointer select-none active:scale-90',
          isDark
            ? 'border border-emerald-500/30 bg-[#06201a]/90 text-amber-400 hover:border-emerald-400/60 hover:bg-[#092d24] shadow-xs'
            : 'border border-border/80 bg-surface/90 text-emerald-600 hover:border-emerald-border hover:bg-emerald-surface hover:text-emerald-deep shadow-2xs',
          className,
        )}
        title={tooltipText}
        aria-label="Toggle theme"
      >
        {isDark ? (
          <Sun className="size-4 text-amber-400" />
        ) : (
          <Moon className="size-4 text-emerald-600" />
        )}
      </button>
    )
  }

  // Default clean pill
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold text-ink',
        'border border-border/80 bg-surface/90 hover:bg-surface hover:border-emerald/40 hover:text-emerald shadow-2xs',
        'transition-all duration-200 cursor-pointer select-none active:scale-95',
        className,
      )}
      title={tooltipText}
      aria-label="Toggle theme"
    >
      <span>{isDark ? (language === 'ar' ? 'فاتح' : 'Light') : (language === 'ar' ? 'داكن' : 'Dark')}</span>
      {isDark ? (
        <Sun className="size-3 text-amber-400" />
      ) : (
        <Moon className="size-3 text-emerald" />
      )}
    </button>
  )
}
