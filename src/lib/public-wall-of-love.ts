import { supabase } from '@/lib/supabase'

/**
 * Public testimonial fields only — exactly what
 * get_public_testimonials_by_slug() returns. image_url is null unless
 * generation actually completed; no merchant/internal fields included.
 */
export interface PublicTestimonial {
  id: string
  customer_name: string | null
  rating: number
  original_text: string
  created_at: string
  image_url: string | null
}

export async function getPublicTestimonialsBySlug(
  slug: string,
): Promise<PublicTestimonial[]> {
  const { data, error } = await supabase.rpc('get_public_testimonials_by_slug', {
    p_slug: slug,
  })

  if (error) throw error
  return data ?? []
}
