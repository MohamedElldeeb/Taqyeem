import { Navigate } from 'react-router-dom'

import { FullPageSpinner } from '@/components/auth/RequireAuth'
import { useMerchant } from '@/hooks/useMerchant'

/**
 * Gates the dashboard: an authenticated user without a merchant row yet
 * has not finished onboarding, so send them there first.
 */
function RequireOnboarding({ children }: { children: React.ReactNode }) {
  const { merchant, loading } = useMerchant()

  if (loading) return <FullPageSpinner />

  if (!merchant) {
    return <Navigate to="/onboarding" replace />
  }

  return children
}

export { RequireOnboarding }
