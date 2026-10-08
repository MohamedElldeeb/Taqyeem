import * as React from 'react'

import { supabase } from '@/lib/supabase'

export interface WeeklyInsight {
  week_start: string
  week_end: string
  review_count: number
  content: string
}

/**
 * The merchant's most recent AI weekly digest (Feature 3), if one has
 * been generated yet. RLS (weekly_insights_owner_select) already scopes
 * this to the signed-in merchant's own rows.
 */
function useLatestWeeklyInsight(merchantId: string | undefined) {
  const [insight, setInsight] = React.useState<WeeklyInsight | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    let cancelled = false

    if (!merchantId) {
      setInsight(null)
      setLoading(false)
      return
    }

    setLoading(true)
    supabase
      .from('weekly_insights')
      .select('week_start, week_end, review_count, content')
      .eq('merchant_id', merchantId)
      .order('week_start', { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (cancelled) return
        setInsight(data)
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [merchantId])

  return { insight, loading }
}

export { useLatestWeeklyInsight }
