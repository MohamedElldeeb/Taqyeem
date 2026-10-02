import * as React from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends React.ComponentProps<'div'> {
  hoverEffect?: boolean
  glass?: boolean
}

function Card({ className, hoverEffect = false, glass = false, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-border bg-surface shadow-xs transition-all duration-200',
        hoverEffect && 'hover:-translate-y-0.5 hover:shadow-md hover:border-border-hover',
        glass && 'glass-panel',
        className,
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('flex flex-col gap-1.5 p-6 md:p-7', className)}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<'h3'>) {
  return (
    <h3
      className={cn('text-lg font-bold leading-tight tracking-tight text-ink md:text-xl', className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p className={cn('text-sm text-ink-muted leading-relaxed', className)} {...props} />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('p-6 pt-0 md:p-7 md:pt-0', className)} {...props} />
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('flex items-center p-6 pt-0 md:p-7 md:pt-0 border-t border-border/60 mt-4', className)}
      {...props}
    />
  )
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
