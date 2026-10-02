import * as React from 'react'
import type { LucideIcon } from 'lucide-react'
import { Card, CardContent } from './card'
import { Button } from './button'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  actionHref?: string
  className?: string
  children?: React.ReactNode
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  actionHref,
  className,
  children,
}: EmptyStateProps) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardContent className="flex flex-col items-center justify-center gap-4 py-14 px-6 text-center">
        <div className="relative flex size-16 items-center justify-center rounded-3xl bg-emerald-surface/80 border border-emerald-border text-emerald shadow-xs">
          <div className="absolute inset-0 rounded-3xl bg-emerald/10 blur-xl -z-10" />
          <Icon className="size-8 stroke-[1.75]" />
        </div>
        <div className="flex flex-col gap-1.5 max-w-md">
          <h3 className="text-base font-bold text-ink">{title}</h3>
          <p className="text-sm text-ink-muted leading-relaxed">{description}</p>
        </div>
        {children}
        {actionLabel && (
          <div className="mt-2">
            {actionHref ? (
              <Button asChild size="default">
                <a href={actionHref}>{actionLabel}</a>
              </Button>
            ) : (
              <Button onClick={onAction} size="default">
                {actionLabel}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
