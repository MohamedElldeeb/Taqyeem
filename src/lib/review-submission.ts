import { supabase } from '@/lib/supabase'

export interface ReviewSubmissionInput {
  merchantId: string
  rating: number
  reviewText: string
  customerName: string
}

/**
 * Real public review submission (anon insert into `reviews`).
 * Deliberately never sends `status` — the database default ('submitted')
 * and its CHECK/RLS constraints are the only things that decide it.
 * `reviewText` is sent exactly as typed — never trimmed, altered, or
 * otherwise processed.
 */
export async function submitReview(input: ReviewSubmissionInput): Promise<void> {
  const { error } = await supabase.from('reviews').insert({
    merchant_id: input.merchantId,
    customer_name: input.customerName.trim() || null,
    rating: input.rating,
    original_text: input.reviewText,
  })

  if (error) throw error
}
