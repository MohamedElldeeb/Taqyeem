import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-all select-none',
  {
    variants: {
      variant: {
        default:
          'border-emerald-border bg-emerald-surface text-emerald-deep',
        primary:
          'border-transparent bg-emerald text-white shadow-xs',
        secondary:
          'border-border bg-muted-surface text-ink',
        outline:
          'border-border bg-transparent text-ink-muted',
        destructive:
          'border-danger-border bg-danger-surface text-danger font-medium',
        warning:
          'border-amber-200 bg-amber-50 text-amber-800 font-medium',
        indigo:
          'border-indigo-100 bg-indigo-50 text-indigo-700 font-medium',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean
  dotColor?: string
}

function Badge({ className, variant, dot = false, dotColor, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {dot && (
        <span
          className="size-1.5 rounded-full shrink-0"
          style={{ backgroundColor: dotColor || 'currentColor' }}
        />
      )}
      {children}
    </span>
  )
}

export { Badge, badgeVariants }
