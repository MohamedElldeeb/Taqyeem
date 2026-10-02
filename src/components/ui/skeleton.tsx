import { cn } from '@/lib/utils'

interface SkeletonProps extends React.ComponentProps<'div'> {
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

export function Skeleton({ className, rounded = 'md', ...props }: SkeletonProps) {
  const roundedClasses = {
    sm: 'rounded-md',
    md: 'rounded-xl',
    lg: 'rounded-2xl',
    xl: 'rounded-3xl',
    full: 'rounded-full',
  }

  return (
    <div
      className={cn(
        'animate-pulse bg-slate-200/80',
        roundedClasses[rounded],
        className,
      )}
      {...props}
    />
  )
}
