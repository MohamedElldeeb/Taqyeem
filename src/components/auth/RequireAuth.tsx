import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/lib/auth-context'
import { useLanguage } from '@/lib/language-context'
import { BrandIcon } from '@/components/ui/brand-logo'

function FullPageSpinner({ message }: { message?: string }) {
  const { isRTL } = useLanguage()

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-5 bg-background px-4 text-center relative overflow-hidden select-none animate-fade-in">
      {/* Dynamic Ambient Background Glow */}
      <div className="absolute inset-0 bg-radial-mesh opacity-60 pointer-events-none" />
      <div className="absolute size-80 rounded-full bg-emerald-500/15 blur-3xl animate-pulse pointer-events-none" />

      {/* Brand Logo with Glowing Pulse Animation */}
      <div className="relative z-10 flex flex-col items-center gap-4">
        <div className="relative group">
          <div className="absolute -inset-3 rounded-3xl bg-gradient-to-r from-emerald-500/30 via-teal-500/25 to-indigo-500/25 blur-xl animate-pulse" />
          <BrandIcon size="xl" className="relative transition-transform duration-500 hover:scale-105 shadow-md" />
        </div>

        <div className="flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-1.5 leading-none">
            <span className="text-base font-extrabold text-ink">تقييم</span>
            <span className="text-xs font-bold text-ink-muted">·</span>
            <span className="text-base font-extrabold text-ink">Taqyeem</span>
          </div>

          <div className="flex items-center gap-2 pt-1.5 text-xs font-semibold text-ink-muted">
            <span className="size-2 rounded-full bg-emerald-500 animate-ping" />
            <span>{message ?? (isRTL ? 'جاري التحميل...' : 'Loading...')}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth()
  const location = useLocation()

  if (loading) return <FullPageSpinner />

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return children
}

export { RequireAuth, FullPageSpinner }

