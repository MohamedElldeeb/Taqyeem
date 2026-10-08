import { supabase } from '@/lib/supabase'

export interface ReviewSubmissionInput {
  merchantId: string
  rating: number
  reviewText: string
  customerName: string
  orderNumber?: string
}

export interface DiscountCode {
  code: string
  percentOff: number
  expiresAt: string
}

export interface ReviewSubmissionResult {
  isPublished: boolean
  googleReviewUrl: string | null
  facebookReviewUrl: string | null
  repeatCode: DiscountCode | null
  shareCode: DiscountCode | null
}

/**
 * Real public review submission (anon insert into `reviews`).
 * Deliberately never sends `status` or `is_published` — the database
 * default/trigger (rating >= 4) and its CHECK/RLS constraints are the
 * only things that decide them. `reviewText` is sent exactly as typed —
 * never trimmed, altered, or otherwise processed.
 *
 * The DB trigger on insert creates the Feature 4 repeat-purchase code
 * (always) and the Feature 1 share-reward code (4-5 star only), and
 * routes to either testimonial generation or a merchant alert. This
 * function makes a second round trip to `get_review_result`, a narrow
 * capability-style RPC keyed on the review id — safe because that id is
 * not guessable and was never shown to anyone else.
 *
 * The id is generated client-side (not read back via `.select()`):
 * anon has no SELECT policy on `reviews` (only the owning merchant does),
 * so asking Postgres to return the inserted row would itself fail under
 * RLS and roll back an otherwise-valid insert.
 */
export async function submitReview(input: ReviewSubmissionInput): Promise<ReviewSubmissionResult> {
  const reviewId = crypto.randomUUID()

  const { error } = await supabase.from('reviews').insert({
    id: reviewId,
    merchant_id: input.merchantId,
    customer_name: input.customerName.trim() || null,
    rating: input.rating,
    original_text: input.reviewText,
    order_number: input.orderNumber?.trim() || null,
  })

  if (error) throw error

  const { data: result, error: resultError } = await supabase.rpc('get_review_result', {
    p_review_id: reviewId,
  })

  if (resultError || !result || result.length === 0) {
    // The review itself is safely stored even if this follow-up read
    // fails — fall back to a minimal result rather than throwing, since
    // the customer's submission already succeeded.
    return {
      isPublished: input.rating >= 4,
      googleReviewUrl: null,
      facebookReviewUrl: null,
      repeatCode: null,
      shareCode: null,
    }
  }

  const row = result[0]
  return {
    isPublished: row.is_published,
    googleReviewUrl: row.google_review_url,
    facebookReviewUrl: row.facebook_review_url,
    repeatCode: row.repeat_code
      ? { code: row.repeat_code, percentOff: row.repeat_percent, expiresAt: row.repeat_expires_at }
      : null,
    shareCode: row.share_code
      ? { code: row.share_code, percentOff: row.share_percent, expiresAt: row.share_expires_at }
      : null,
  }
}
