export type TemplateId =
  | 'neon'
  | 'luxury'
  | 'minimal'
  | 'organic'
  | 'bold'
  | 'magazine'
  | 'soft'
  | 'brutalist'

export const DEFAULT_TEMPLATE_ID: TemplateId = 'neon'

export const TEMPLATE_IDS: TemplateId[] = [
  'neon',
  'luxury',
  'minimal',
  'organic',
  'bold',
  'magazine',
  'soft',
  'brutalist',
]

export const TEMPLATE_LABELS: Record<TemplateId, string> = {
  neon: 'نيون',
  luxury: 'فاخر',
  minimal: 'بسيط',
  organic: 'طبيعي',
  bold: 'جريء',
  magazine: 'مجلة',
  soft: 'ناعم',
  brutalist: 'حاد',
}
