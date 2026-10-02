import * as React from 'react'
import { cn } from '@/lib/utils'

export interface TextareaProps extends React.ComponentProps<'textarea'> {
  hasError?: boolean
}

function Textarea({ className, hasError = false, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        'flex min-h-28 w-full rounded-lg border border-border bg-surface px-3.5 py-3 text-sm text-ink font-medium placeholder:text-ink-subtle transition-all duration-200 resize-y',
        'hover:border-border-hover',
        'focus-visible:outline-none focus-visible:border-emerald focus-visible:ring-4 focus-visible:ring-emerald/15',
        'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted-surface',
        hasError && 'border-danger focus-visible:border-danger focus-visible:ring-danger/15',
        className,
      )}
      {...props}
    />
  )
}

export { Textarea }
