export type TemplateId =
  | '01-neon-editorial'
  | '02-luxury-editorial'
  | '03-minimal-modern'
  | '04-warm-organic'
  | '05-bold-contemporary'
  | '06-magazine-editorial'
  | '07-soft-premium'
  | '08-brutalist-modern'

export const DEFAULT_TEMPLATE_ID: TemplateId = '01-neon-editorial'

export const TEMPLATE_IDS: TemplateId[] = [
  '01-neon-editorial',
  '02-luxury-editorial',
  '03-minimal-modern',
  '04-warm-organic',
  '05-bold-contemporary',
  '06-magazine-editorial',
  '07-soft-premium',
  '08-brutalist-modern',
]

export const TEMPLATE_LABELS: Record<TemplateId, string> = {
  '01-neon-editorial': 'نيون',
  '02-luxury-editorial': 'فاخر',
  '03-minimal-modern': 'بسيط',
  '04-warm-organic': 'طبيعي',
  '05-bold-contemporary': 'جريء',
  '06-magazine-editorial': 'مجلة',
  '07-soft-premium': 'ناعم',
  '08-brutalist-modern': 'حاد',
}

export const DEFAULT_BRAND_BY_TEMPLATE: Record<TemplateId, string> = {
  '01-neon-editorial': '#22D3EE',
  '02-luxury-editorial': '#8E2C3B',
  '03-minimal-modern': '#E2502B',
  '04-warm-organic': '#B0603A',
  '05-bold-contemporary': '#FF4D1F',
  '06-magazine-editorial': '#C2412D',
  '07-soft-premium': '#5E7A68',
  '08-brutalist-modern': '#2B5BFF',
}
