import { supabase } from '@/lib/supabase'

/**
 * Public branding fields only — exactly what get_merchant_public_by_slug()
 * returns. Never user_id, email, or any other private field (see the
 * migration for the narrow SECURITY DEFINER function backing this).
 */
export interface PublicMerchant {
  id: string
  business_name: string
  slug: string
  logo_url: string | null
  brand_color: string
}

export async function getPublicMerchantBySlug(
  slug: string,
): Promise<PublicMerchant | null> {
  const { data, error } = await supabase.rpc('get_merchant_public_by_slug', {
    p_slug: slug,
  })

  if (error) throw error
  return data?.[0] ?? null
}
