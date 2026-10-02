import * as React from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.ComponentProps<'input'> {
  hasError?: boolean
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
  showPasswordToggle?: boolean
}

function Input({
  className,
  type = 'text',
  hasError = false,
  startIcon,
  endIcon,
  showPasswordToggle,
  ...props
}: InputProps) {
  const isPassword = type === 'password'
  const enablePasswordToggle = showPasswordToggle ?? isPassword
  const [showPassword, setShowPassword] = React.useState(false)

  const resolvedType = isPassword && enablePasswordToggle ? (showPassword ? 'text' : 'password') : type
  const hasEndElement = Boolean(endIcon || (isPassword && enablePasswordToggle))

  return (
    <div className="relative flex w-full items-center">
      {startIcon && (
        <div className="pointer-events-none absolute start-3.5 flex items-center justify-center text-slate-400">
          {startIcon}
        </div>
      )}

      <input
        type={resolvedType}
        className={cn(
          'flex h-11 w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-ink font-medium placeholder:text-ink-subtle transition-all duration-200',
          'hover:border-border-hover',
          'focus-visible:outline-none focus-visible:border-emerald focus-visible:ring-4 focus-visible:ring-emerald/15',
          'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted-surface',
          hasError
            ? '!border-rose-500 !ring-rose-500/20 focus-visible:!border-rose-400 focus-visible:!ring-rose-500/25'
            : 'hover:border-border-hover focus-visible:border-emerald focus-visible:ring-4 focus-visible:ring-emerald/15',
          startIcon && 'ps-11',
          hasEndElement && 'pe-11',
          className,
        )}
        {...props}
      />

      {isPassword && enablePasswordToggle ? (
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute end-3.5 flex items-center justify-center text-slate-400 hover:text-slate-200 focus:outline-none transition-colors cursor-pointer p-0.5"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      ) : endIcon ? (
        <div className="absolute end-3.5 flex items-center justify-center text-slate-400">
          {endIcon}
        </div>
      ) : null}
    </div>
  )
}

export { Input }
