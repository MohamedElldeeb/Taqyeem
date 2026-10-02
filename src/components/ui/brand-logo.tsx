import * as React from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '@/lib/language-context'
import { useTheme } from '@/lib/theme-context'
import { cn } from '@/lib/utils'

export interface BrandIconProps extends React.SVGProps<SVGSVGElement> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export function BrandIcon({ size = 'md', className, ...props }: BrandIconProps) {
  const sizeMap = {
    xs: 'size-6',
    sm: 'size-8',
    md: 'size-9',
    lg: 'size-11',
    xl: 'size-14',
  }

  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('shrink-0 shadow-xs rounded-2xl transition-transform', sizeMap[size], className)}
      aria-hidden="true"
      {...props}
    >
      <defs>
        <linearGradient id="taqyeem-icon-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="50%" stopColor="#059669" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>
        <linearGradient id="taqyeem-icon-shine" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Squircle Rounded Container */}
      <rect width="64" height="64" rx="18" fill="url(#taqyeem-icon-gradient)" />
      <rect width="64" height="64" rx="18" fill="url(#taqyeem-icon-shine)" />

      {/* Primary Left Quotation Mark (Solid White) */}
      <path
        d="M25.5 19.5 C29.64 19.5 33 22.86 33 27 C33 29.35 31.92 31.45 30.2 32.85 C29.1 36.2 26.2 39.8 18.5 43.5 C21.2 39.8 22.1 36.8 21.6 34.2 C18.8 33.6 18 30.8 18 27 C18 22.86 21.36 19.5 25.5 19.5 Z"
        fill="#FFFFFF"
      />

      {/* Secondary Right Quotation Mark (Soft Mint/Translucent White) */}
      <path
        d="M44.5 19.5 C48.64 19.5 52 22.86 52 27 C52 29.35 50.92 31.45 49.2 32.85 C48.1 36.2 45.2 39.8 37.5 43.5 C40.2 39.8 41.1 36.8 40.6 34.2 C37.8 33.6 37 30.8 37 27 C37 22.86 40.36 19.5 44.5 19.5 Z"
        fill="#FFFFFF"
        fillOpacity="0.75"
      />
    </svg>
  )
}

export interface BrandLogoProps {
  variant?: 'full' | 'icon' | 'compact' | 'stacked'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  theme?: 'light' | 'dark' | 'auto'
  showTagline?: boolean
  tagline?: string
  href?: string
  className?: string
}

export function BrandLogo({
  variant = 'full',
  size = 'md',
  theme = 'auto',
  showTagline = true,
  tagline,
  href,
  className,
}: BrandLogoProps) {
  const { language } = useLanguage()
  const { resolvedTheme } = useTheme()
  const isDark = theme === 'dark' || (theme === 'auto' && resolvedTheme === 'dark')

  const defaultTagline = language === 'ar' ? 'منصة التقييمات الذكية' : 'Social Proof Platform'
  const displayTagline = tagline ?? defaultTagline

  const titleSizes = {
    xs: 'text-xs font-extrabold',
    sm: 'text-sm font-extrabold',
    md: 'text-base font-extrabold tracking-tight',
    lg: 'text-lg font-extrabold tracking-tight',
    xl: 'text-2xl font-black tracking-tight',
  }

  const taglineSizes = {
    xs: 'text-[9px]',
    sm: 'text-[10px]',
    md: 'text-[11px]',
    lg: 'text-xs',
    xl: 'text-xs',
  }

  const content = (
    <div
      className={cn(
        'inline-flex items-center gap-2.5 select-none transition-all group',
        variant === 'stacked' && 'flex-col text-center gap-2',
        className,
      )}
    >
      <BrandIcon size={size} className="group-hover:scale-105 transition-transform" />

      {variant !== 'icon' && (
        <div className={cn('flex flex-col min-w-0', variant === 'stacked' ? 'items-center' : 'items-start')}>
          <div className="flex items-center gap-1.5 leading-none">
            <span
              className={cn(
                titleSizes[size],
                isDark ? 'text-white' : 'text-slate-900 group-hover:text-emerald-deep transition-colors',
              )}
            >
              تقييم
            </span>
            <span className={cn('text-xs font-bold opacity-40', isDark ? 'text-white' : 'text-slate-400')}>·</span>
            <span
              className={cn(
                titleSizes[size],
                isDark ? 'text-slate-100' : 'text-slate-900 group-hover:text-emerald-deep transition-colors',
              )}
            >
              Taqyeem
            </span>
          </div>

          {showTagline && (
            <span
              className={cn(
                'font-bold leading-tight mt-1 transition-colors',
                taglineSizes[size],
                isDark ? 'text-emerald-400' : 'text-emerald-600',
              )}
            >
              {displayTagline}
            </span>
          )}
        </div>
      )}
    </div>
  )

  if (href) {
    return (
      <Link to={href} className="inline-flex items-center">
        {content}
      </Link>
    )
  }

  return content
}
