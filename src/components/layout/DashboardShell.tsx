import { Heart, Home, LogOut, MessageSquareText, QrCode, Settings } from 'lucide-react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'

import { FullPageSpinner } from '@/components/auth/RequireAuth'
import { useAuth } from '@/lib/auth-context'
import { useMerchant, type Merchant } from '@/hooks/useMerchant'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { to: '/dashboard', label: 'الرئيسية', icon: Home, end: true },
  { to: '/dashboard/reviews', label: 'التقييمات', icon: MessageSquareText, end: false },
  { to: '/dashboard/wall-of-love', label: 'Wall of Love', icon: Heart, end: false },
  { to: '/dashboard/qr', label: 'QR Code', icon: QrCode, end: false },
  { to: '/dashboard/settings', label: 'الإعدادات', icon: Settings, end: false },
] as const

function MerchantMark({ merchant }: { merchant: Merchant }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      {merchant.logo_url ? (
        <img
          src={merchant.logo_url}
          alt=""
          className="size-9 shrink-0 rounded-full object-cover"
        />
      ) : (
        <div
          className="flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
          style={{ backgroundColor: merchant.brand_color }}
          aria-hidden
        >
          {merchant.business_name.trim().charAt(0)}
        </div>
      )}
      <span className="truncate text-sm font-medium text-ink">{merchant.business_name}</span>
    </div>
  )
}

function DashboardShell() {
  const { merchant, loading } = useMerchant()
  const { signOut } = useAuth()
  const navigate = useNavigate()

  if (loading || !merchant) return <FullPageSpinner />

  async function handleLogout() {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="flex min-h-dvh bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden w-60 shrink-0 flex-col gap-8 border-e border-border bg-surface px-4 py-6 md:flex">
        <span className="px-2 text-sm font-semibold text-emerald">تقييم · Taqyeem</span>
        <div className="px-2">
          <MerchantMark merchant={merchant} />
        </div>
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-text transition-colors hover:bg-muted-surface hover:text-ink',
                  isActive && 'bg-muted-surface text-emerald',
                )
              }
            >
              <Icon className="size-4" />
              {label}
            </NavLink>
          ))}
        </nav>
        <button
          type="button"
          onClick={handleLogout}
          className="mt-auto flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-text transition-colors hover:bg-muted-surface hover:text-danger"
        >
          <LogOut className="size-4" />
          تسجيل الخروج
        </button>
      </aside>

      <div className="flex min-h-dvh flex-1 flex-col">
        {/* Top bar */}
        <header className="flex items-center justify-between gap-3 border-b border-border bg-surface px-gutter py-3 md:px-8">
          <div className="min-w-0 md:hidden">
            <MerchantMark merchant={merchant} />
          </div>
          <span className="hidden text-sm text-muted-text md:inline">لوحة التحكم</span>
          <div className="flex shrink-0 items-center gap-4">
            <a
              href={`/w/${merchant.slug}`}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium text-emerald hover:text-emerald-deep"
            >
              عرض الصفحة العامة
            </a>
            <button
              type="button"
              onClick={handleLogout}
              className="text-sm font-medium text-muted-text hover:text-danger md:hidden"
            >
              خروج
            </button>
          </div>
        </header>

        <main className="flex-1 px-gutter py-8 pb-24 md:px-8 md:pb-8">
          <div className="mx-auto w-full max-w-5xl">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 flex border-t border-border bg-surface pb-[max(0.5rem,env(safe-area-inset-bottom))] md:hidden">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                'flex flex-1 flex-col items-center gap-1 py-2 text-[11px] font-medium text-muted-text',
                isActive && 'text-emerald',
              )
            }
          >
            <Icon className="size-5" />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

export { DashboardShell }
