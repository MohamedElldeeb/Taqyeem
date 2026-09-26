import * as React from 'react'

import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'

export interface Merchant {
  id: string
  user_id: string
  business_name: string
  slug: string
  logo_url: string | null
  brand_color: string
  created_at: string
  updated_at: string
}

interface MerchantContextValue {
  merchant: Merchant | null
  loading: boolean
  refetch: () => Promise<void>
}

const MerchantContext = React.createContext<MerchantContextValue | null>(null)

/**
 * Loads the merchant row owned by the signed-in user, if onboarding has
 * been completed. `merchant === null` (once loading is false) means the
 * user is authenticated but has not finished onboarding yet.
 * Provided once at the app root so RequireOnboarding and DashboardShell
 * share a single fetch instead of querying independently.
 */
function MerchantProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth()
  const [merchant, setMerchant] = React.useState<Merchant | null>(null)
  const [loading, setLoading] = React.useState(true)

  const refetch = React.useCallback(async () => {
    if (!user) {
      setMerchant(null)
      setLoading(false)
      return
    }

    setLoading(true)
    const { data } = await supabase
      .from('merchants')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()

    setMerchant(data)
    setLoading(false)
  }, [user])

  React.useEffect(() => {
    // AuthProvider's own session check hasn't resolved yet, so `user` is
    // only transiently null here — deciding anything now (including
    // "no user, no merchant") would race ahead of the real answer and
    // cause a false redirect to /onboarding on every hard page load.
    // Stay in our own initial `loading: true` until auth actually settles.
    if (authLoading) return
    refetch()
  }, [authLoading, refetch])

  const value = React.useMemo(() => ({ merchant, loading, refetch }), [merchant, loading, refetch])

  return <MerchantContext.Provider value={value}>{children}</MerchantContext.Provider>
}

function useMerchant() {
  const context = React.useContext(MerchantContext)
  if (!context) {
    throw new Error('useMerchant must be used within a MerchantProvider')
  }
  return context
}

export { MerchantProvider, useMerchant }
