import * as React from 'react'

import { cn } from '@/lib/utils'

/**
 * Content-agnostic page shell: safe max-width + RTL-aware gutter padding.
 * No navigation, no product content — later phases compose inside this.
 */
function AppShell({ className, children, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'mx-auto w-full max-w-5xl px-gutter py-section-gap md:px-gutter-lg',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export { AppShell }
