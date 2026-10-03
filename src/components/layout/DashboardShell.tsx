import * as React from 'react'
import {
  ChevronsUpDown,
  ExternalLink,
  Heart,
  Home,
  LogOut,
  MessageSquareText,
  Palette,
  PanelLeftClose,
  PanelLeftOpen,
  QrCode,
  Sparkles,
} from 'lucide-react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'

import { FullPageSpinner } from '@/components/auth/RequireAuth'
import { LanguageToggle } from '@/components/ui/language-toggle'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { AnimatedBackground } from '@/components/ui/animated-background'
import { BrandIcon, BrandLogo } from '@/components/ui/brand-logo'
import { useAuth } from '@/lib/auth-context'
import { useLanguage } from '@/lib/language-context'
import { useMerchant, type Merchant } from '@/hooks/useMerchant'
import { cn } from '@/lib/utils'

function MerchantAvatar({
  merchant,
  size = 'md',
  className,
}: {
  merchant: Merchant
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  const sizeClasses = {
    sm: 'size-7 text-xs rounded-lg',
    md: 'size-9 text-sm rounded-xl',
    lg: 'size-11 text-base rounded-2xl',
  }[size]

  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center font-bold text-white shadow-2xs transition-transform duration-200',
        sizeClasses,
        className,
      )}
      style={{ backgroundColor: merchant.brand_color }}
      aria-hidden
    >
      {merchant.business_name.trim().charAt(0) || 'ت'}
    </div>
  )
}

function MerchantProfileDropdown({
  merchant,
  userEmail,
  onLogout,
}: {
  merchant: Merchant
  userEmail?: string
  onLogout: () => void
}) {
  const [isOpen, setIsOpen] = React.useState(false)
  const dropdownRef = React.useRef<HTMLDivElement>(null)
  const { t, isRTL } = useLanguage()

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Interactive Trigger Button in Toolbar */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className={cn(
          'group flex items-center gap-2 rounded-xl border py-1 px-2 transition-all duration-200 cursor-pointer text-start select-none shadow-2xs',
          isOpen
            ? 'border-emerald-border bg-emerald-surface/60 shadow-sm ring-2 ring-emerald-500/20'
            : 'border-border/80 bg-surface/80 hover:border-emerald-border/60 hover:bg-surface',
        )}
        title={`${merchant.business_name} - ${isRTL ? 'الهوية البصرية والتخصيص' : 'Branding & Identity'}`}
      >
        <MerchantAvatar merchant={merchant} size="sm" />

        <div className="hidden sm:flex flex-col min-w-0 max-w-[120px] md:max-w-[150px]">
          <span className="truncate text-xs font-bold text-ink leading-tight">
            {merchant.business_name}
          </span>
          <span className="truncate text-[10px] text-ink-subtle leading-tight font-mono">
            /r/{merchant.slug}
          </span>
        </div>

        <ChevronsUpDown className="size-3.5 shrink-0 text-ink-muted group-hover:text-ink transition-colors ms-0.5" />
      </button>

      {/* Floating Popover Menu */}
      {isOpen && (
        <div
          className={cn(
            'absolute z-50 rounded-2xl border border-border/80 bg-surface/95 backdrop-blur-xl p-2 text-ink shadow-2xl animate-scale-in top-full mt-2 w-64',
            isRTL ? 'left-0 origin-top-left' : 'right-0 origin-top-right',
          )}
          role="menu"
        >
          {/* Header User Info */}
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-background-subtle/70 border border-border/40 mb-1.5">
            <MerchantAvatar merchant={merchant} size="md" />
            <div className="flex flex-col min-w-0">
              <span className="truncate text-xs sm:text-sm font-bold text-ink leading-tight">
                {merchant.business_name}
              </span>
              <span className="truncate text-[11px] text-ink-subtle mt-0.5 font-mono">
                {userEmail ?? `/r/${merchant.slug}`}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-0.5">
            {/* Branding & Store Identity Page Link */}
            <Link
              to="/dashboard/branding"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-ink transition-all hover:bg-emerald-surface hover:text-emerald-deep"
              role="menuitem"
            >
              <Palette className="size-4 text-emerald" />
              <span>{isRTL ? 'الهوية البصرية والعلامة' : 'Branding & Identity'}</span>
            </Link>

            {/* Public Wall */}
            <a
              href={`/w/${merchant.slug}`}
              target="_blank"
              rel="noreferrer"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold text-ink transition-all hover:bg-emerald-surface hover:text-emerald-deep"
              role="menuitem"
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="size-4 text-indigo-500" />
                <span>{t('action_view_public')}</span>
              </div>
              <ExternalLink className="size-3.5 text-ink-subtle" />
            </a>

            {/* QR Code */}
            <Link
              to="/dashboard/qr"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-ink transition-all hover:bg-emerald-surface hover:text-emerald-deep"
              role="menuitem"
            >
              <QrCode className="size-4 text-amber-500" />
              <span>{t('nav_qr')}</span>
            </Link>
          </div>

          <div className="my-1.5 border-t border-border/60" />

          {/* Logout Action */}
          <button
            type="button"
            onClick={() => {
              setIsOpen(false)
              onLogout()
            }}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-danger transition-colors hover:bg-danger-surface cursor-pointer"
            role="menuitem"
          >
            <LogOut className="size-4" />
            <span>{t('action_logout')}</span>
          </button>
        </div>
      )}
    </div>
  )
}

function DashboardShell() {
  const { merchant, loading } = useMerchant()
  const { user, signOut } = useAuth()
  const { t, isRTL } = useLanguage()
  const navigate = useNavigate()

  const [isCollapsed, setIsCollapsed] = React.useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('taqyeem_sidebar_collapsed')
      return saved !== null ? JSON.parse(saved) : false
    } catch {
      return false
    }
  })

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev
      try {
        localStorage.setItem('taqyeem_sidebar_collapsed', JSON.stringify(next))
      } catch {}
      return next
    })
  }

  if (loading || !merchant) return <FullPageSpinner />

  async function handleLogout() {
    await signOut()
    navigate('/login')
  }

  const navItems = [
    { to: '/dashboard', label: t('nav_home'), icon: Home, end: true },
    { to: '/dashboard/reviews', label: t('nav_reviews'), icon: MessageSquareText, end: false },
    { to: '/dashboard/wall-of-love', label: t('nav_wall_of_love'), icon: Heart, end: false },
    { to: '/dashboard/qr', label: t('nav_qr'), icon: QrCode, end: false },
    { to: '/dashboard/branding', label: t('nav_branding') || t('nav_settings'), icon: Palette, end: false },
  ]

  return (
    <div className="flex min-h-dvh bg-transparent text-ink relative overflow-x-hidden">
      {/* Luxury Ambient Animated Background */}
      <AnimatedBackground
        variant="hero"
        showGrid
        showDots
        showParticles
        showBeam
        showSpotlight
      />

      {/* Desktop Collapsible Sidebar */}
      <aside
        className={cn(
          'hidden md:flex flex-col shrink-0 border-e border-border/80 bg-surface/90 backdrop-blur-xl py-5 relative z-20 transition-all duration-300 ease-in-out',
          isCollapsed ? 'w-[76px] px-2.5 gap-6' : 'w-64 px-4 gap-6',
        )}
      >
        {/* Brand Header */}
        <div className={cn('flex items-center', isCollapsed ? 'justify-center px-0' : 'px-1')}>
          {isCollapsed ? (
            <NavLink to="/dashboard" title="Taqyeem · تقييم">
              <BrandIcon size="sm" className="hover:scale-105 transition-transform" />
            </NavLink>
          ) : (
            <BrandLogo href="/dashboard" size="sm" />
          )}
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1.5 flex-1">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              title={isCollapsed ? label : undefined}
              className={({ isActive }) =>
                cn(
                  'group relative flex items-center rounded-xl text-sm font-semibold transition-all duration-200',
                  isCollapsed ? 'justify-center p-2.5' : 'gap-3.5 px-3.5 py-2.5',
                  isActive
                    ? 'bg-emerald text-white shadow-md shadow-emerald/25'
                    : 'text-ink-muted hover:bg-muted-surface hover:text-ink active:scale-[0.98]',
                )
              }
            >
              <Icon className="size-4.5 shrink-0 transition-transform group-hover:scale-110" />
              {!isCollapsed && <span>{label}</span>}
              {isCollapsed && (
                <span className="sr-only">{label}</span>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex min-h-dvh flex-1 flex-col min-w-0 relative z-10">
        {/* Top bar (Toolbar) */}
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-border/80 bg-surface/85 backdrop-blur-md px-4 py-2.5 md:px-8">
          {/* Left / Start Area */}
          <div className="flex items-center gap-3">
            {/* Mobile Brand Logo */}
            <div className="md:hidden flex items-center">
              <BrandLogo href="/dashboard" size="xs" />
            </div>

            {/* Desktop Collapse Sidebar Button */}
            <div className="hidden md:flex items-center gap-3">
              <button
                type="button"
                onClick={toggleCollapse}
                className="inline-flex size-8 items-center justify-center rounded-xl border border-border bg-surface/80 text-ink-muted hover:text-ink hover:bg-background-subtle transition-all cursor-pointer shadow-2xs"
                title={isCollapsed ? (isRTL ? 'توسيع القائمة' : 'Expand Sidebar') : (isRTL ? 'طي القائمة' : 'Collapse Sidebar')}
              >
                {isCollapsed ? (
                  <PanelLeftOpen className={cn('size-4', isRTL && 'rotate-180')} />
                ) : (
                  <PanelLeftClose className={cn('size-4', isRTL && 'rotate-180')} />
                )}
              </button>
            </div>
          </div>

          {/* Right / End Area: Language + Theme + Merchant Profile Dropdown */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
            <LanguageToggle variant="pill" />
            <ThemeToggle variant="minimal" />

            <div className="h-5 w-px bg-border/80 mx-0.5" />

            <MerchantProfileDropdown
              merchant={merchant}
              userEmail={user?.email}
              onLogout={handleLogout}
            />
          </div>
        </header>

        {/* Content View with Page Animation */}
        <main className="flex-1 px-4 py-6 pb-24 md:px-8 md:py-8 md:pb-12 min-w-0">
          <div className="mx-auto w-full animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-border bg-surface/95 backdrop-blur-xl shadow-lg pb-[max(0.5rem,env(safe-area-inset-bottom))] md:hidden">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                'relative flex flex-1 flex-col items-center justify-center gap-1 py-2 text-[11px] font-bold transition-all duration-200',
                isActive
                  ? 'text-emerald'
                  : 'text-ink-muted hover:text-ink active:scale-90',
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute top-0 h-1 w-8 rounded-full bg-emerald shadow-xs" />
                )}
                <div
                  className={cn(
                    'flex size-8 items-center justify-center rounded-xl transition-all',
                    isActive ? 'bg-emerald-surface text-emerald scale-110' : '',
                  )}
                >
                  <Icon className="size-4.5" />
                </div>
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

export { DashboardShell }

