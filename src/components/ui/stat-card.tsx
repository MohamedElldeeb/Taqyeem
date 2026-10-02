import type { LucideIcon } from 'lucide-react'
import { Card } from './card'
import { Skeleton } from './skeleton'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon: LucideIcon
  iconColor?: 'emerald' | 'indigo' | 'amber' | 'purple'
  loading?: boolean
  trend?: string
  className?: string
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  iconColor = 'emerald',
  loading = false,
  trend,
  className,
}: StatCardProps) {
  const colorMap = {
    emerald: {
      bg: 'bg-emerald-surface',
      text: 'text-emerald-deep',
      border: 'border-emerald-border/60',
      glow: 'group-hover:shadow-emerald/15',
    },
    indigo: {
      bg: 'bg-indigo-500/10 dark:bg-indigo-500/15',
      text: 'text-indigo-600 dark:text-indigo-400',
      border: 'border-indigo-500/20',
      glow: 'group-hover:shadow-indigo-500/15',
    },
    amber: {
      bg: 'bg-amber-500/10 dark:bg-amber-500/15',
      text: 'text-amber-600 dark:text-amber-400',
      border: 'border-amber-500/20',
      glow: 'group-hover:shadow-amber-500/15',
    },
    purple: {
      bg: 'bg-purple-500/10 dark:bg-purple-500/15',
      text: 'text-purple-600 dark:text-purple-400',
      border: 'border-purple-500/20',
      glow: 'group-hover:shadow-purple-500/15',
    },
  }

  const activeColor = colorMap[iconColor]

  return (
    <Card
      hoverEffect
      className={cn(
        'group relative overflow-hidden p-4 sm:p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md',
        activeColor.glow,
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1 flex-1 min-w-0">
          <span className="text-xs font-bold text-ink-muted truncate">
            {title}
          </span>
          {loading ? (
            <Skeleton className="h-8 w-20 my-1" />
          ) : (
            <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-ink group-hover:text-emerald-deep transition-colors">
              {value}
            </span>
          )}
          {description && (
            <p className="text-[11px] text-ink-subtle truncate">{description}</p>
          )}
          {trend && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald">
              {trend}
            </span>
          )}
        </div>
        <div
          className={cn(
            'flex size-10 sm:size-11 shrink-0 items-center justify-center rounded-xl border transition-all duration-300 group-hover:scale-105 shadow-2xs',
            activeColor.bg,
            activeColor.text,
            activeColor.border,
          )}
        >
          <Icon className="size-5" />
        </div>
      </div>
    </Card>
  )
}

