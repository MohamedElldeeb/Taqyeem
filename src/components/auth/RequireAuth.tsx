import { Navigate, useLocation } from 'react-router-dom'

import { useAuth } from '@/lib/auth-context'

function FullPageSpinner() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background">
      <span className="text-sm text-muted-text">جاري التحميل...</span>
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
