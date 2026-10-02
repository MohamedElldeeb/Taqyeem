import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white button-specular hover:brightness-105 active:brightness-95',
        primaryGlow:
          'bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 text-white button-specular hover:shadow-glow-emerald-lg hover:brightness-105 active:brightness-95',
        secondary:
          'bg-surface text-ink border border-border/80 shadow-xs hover:bg-muted-surface/80 hover:border-border-hover hover:shadow-sm active:bg-muted-surface',
        outline:
          'border border-border/90 bg-transparent text-ink hover:bg-muted-surface/80 hover:border-emerald-border/80',
        ghost: 'text-ink-muted hover:bg-muted-surface/80 hover:text-ink',
        destructive:
          'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-xs hover:brightness-105 active:brightness-95',
        link: 'text-emerald underline-offset-4 hover:underline p-0 h-auto font-semibold',
      },
      size: {
        xs: 'h-8 rounded-lg px-3 text-xs',
        sm: 'h-9.5 rounded-xl px-4 text-xs',
        default: 'h-11 rounded-xl px-5 text-sm',
        lg: 'h-12.5 rounded-2xl px-7 text-base',
        xl: 'h-14 rounded-2xl px-8 text-base tracking-wide',
        icon: 'size-10 rounded-xl',
        iconSm: 'size-8 rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button'
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="animate-spin" />
          <span>{children}</span>
        </>
      ) : (
        children
      )}
    </Comp>
  )
}

export { Button, buttonVariants }
