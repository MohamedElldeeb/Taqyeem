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
          <stop offset="45%" stopColor="#059669" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>
        <linearGradient id="taqyeem-icon-shine" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.32" />
          <stop offset="60%" stopColor="#FFFFFF" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Squircle Rounded Container */}
      <rect width="64" height="64" rx="16" fill="url(#taqyeem-icon-gradient)" />
      <rect width="64" height="64" rx="16" fill="url(#taqyeem-icon-shine)" />
      <rect x="0.75" y="0.75" width="62.5" height="62.5" rx="15.25" stroke="#FFFFFF" strokeOpacity="0.2" strokeWidth="1.5" />

      {/* Primary Left Quotation Mark */}
      <path
        d="M24 18 C28.4 18 32 21.6 32 26 C32 28.5 30.8 30.7 28.9 32.2 C27.5 35.8 24.2 39.6 16.5 43.5 C19.5 39.5 20.4 36.3 19.8 33.6 C16.9 32.9 16 30 16 26 C16 21.6 19.6 18 24 18 Z"
        fill="#FFFFFF"
      />

      {/* Secondary Right Quotation Mark */}
      <path
        d="M43 18 C47.4 18 51 21.6 51 26 C51 28.5 49.8 30.7 47.9 32.2 C46.5 35.8 43.2 39.6 35.5 43.5 C38.5 39.5 39.4 36.3 38.8 33.6 C35.9 32.9 35 30 35 26 C35 21.6 38.6 18 43 18 Z"
        fill="#FFFFFF"
        fillOpacity="0.88"
      />

      {/* Golden Micro Star Accent */}
      <path
        d="M47 11.5 L48.3 14.2 L51.2 14.6 L49.1 16.6 L49.6 19.5 L47 18.1 L44.4 19.5 L44.9 16.6 L42.8 14.6 L45.7 14.2 Z"
        fill="url(#taqyeem-star-icon)"
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
