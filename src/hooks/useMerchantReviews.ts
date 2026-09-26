import * as React from 'react'

import { supabase } from '@/lib/supabase'
import type { GeneratedContentDbStatus } from '@/lib/generated-content-status'

export type ReviewDbStatus = 'submitted' | 'processing' | 'completed' | 'failed'

export interface MerchantReview {
  id: string
  customer_name: string | null
  rating: number
  original_text: string
  status: ReviewDbStatus
  created_at: string
  generated_content: {
    status: GeneratedContentDbStatus
    image_url: string | null
  } | null
}

interface RawGeneratedContent {
  status: GeneratedContentDbStatus
  image_url: string | null
}

interface RawReviewRow {
  id: string
  customer_name: string | null
  rating: number
  original_text: string
  status: ReviewDbStatus
  created_at: string
  generated_content: RawGeneratedContent[] | RawGeneratedContent | null
}

function normalize(row: RawReviewRow): MerchantReview {
  const generatedContent = Array.isArray(row.generated_content)
    ? (row.generated_content[0] ?? null)
    : row.generated_content

  return { ...row, generated_content: generatedContent }
}

const PENDING_POLL_INTERVAL_MS = 4000

/**
 * The authenticated merchant's own reviews, joined with their generated
 * image status in a single query (avoids N+1). RLS already scopes this to
 * the signed-in merchant's own rows (reviews_select_own /
 * generated_content_select_own) — no extra filtering needed here.
 *
 * Polls only while at least one review is still submitted/processing (or
 * its image is pending/processing), and stops automatically once every
 * review has settled into completed/failed.
 */
function useMerchantReviews(merchantId: string | undefined) {
  const [reviews, setReviews] = React.useState<MerchantReview[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  const fetchReviews = React.useCallback(async () => {
    if (!merchantId) {
      setReviews([])
      setLoading(false)
      return
    }

    const { data, error: fetchError } = await supabase
      .from('reviews')
      .select(
        'id, customer_name, rating, original_text, status, created_at, generated_content(status, image_url)',
      )
      .eq('merchant_id', merchantId)
      .order('created_at', { ascending: false })

    if (fetchError) {
      setError(fetchError.message)
      setLoading(false)
      return
    }

    setReviews((data as unknown as RawReviewRow[]).map(normalize))
    setError(null)
    setLoading(false)
  }, [merchantId])

  React.useEffect(() => {
    setLoading(true)
    fetchReviews()
  }, [fetchReviews])

  const hasPending = reviews.some(
    (r) =>
      r.status === 'submitted' ||
      r.status === 'processing' ||
      r.generated_content?.status === 'pending' ||
      r.generated_content?.status === 'processing',
  )

  React.useEffect(() => {
    if (!hasPending) return
    const interval = setInterval(fetchReviews, PENDING_POLL_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [hasPending, fetchReviews])

  return { reviews, loading, error, refetch: fetchReviews }
}

export { useMerchantReviews }
