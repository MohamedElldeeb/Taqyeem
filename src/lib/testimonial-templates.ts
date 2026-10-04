export type TemplateId =
  | '01-glass-orbs'
  | '02-soft-clay'
  | '03-tilted-stack'
  | '04-extruded-type'
  | '05-floating-note'
  | '06-neumorphic'
  | '07-liquid-chrome'
  | '08-ticket-stub'
  | '09-inflated-bubble'
  | '10-paper-depth'
  | '11-spotlight-podium'
  | '12-horizon-grid'
  | '01-neon-editorial'
  | '02-luxury-editorial'
  | '03-minimal-modern'
  | '04-warm-organic'
  | '05-bold-contemporary'
  | '06-magazine-editorial'
  | '07-soft-premium'
  | '08-brutalist-modern'

export const DEFAULT_TEMPLATE_ID: TemplateId = '01-glass-orbs'

export const TEMPLATE_IDS: TemplateId[] = [
  '01-glass-orbs',
  '02-soft-clay',
  '03-tilted-stack',
  '04-extruded-type',
  '05-floating-note',
  '06-neumorphic',
  '07-liquid-chrome',
  '08-ticket-stub',
  '09-inflated-bubble',
  '10-paper-depth',
  '11-spotlight-podium',
  '12-horizon-grid',
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
  '01-glass-orbs': 'زجاجي',
  '02-soft-clay': 'طيني',
  '03-tilted-stack': 'طبقات',
  '04-extruded-type': 'بارز',
  '05-floating-note': 'ورقة',
  '06-neumorphic': 'نافر',
  '07-liquid-chrome': 'كروم',
  '08-ticket-stub': 'تذكرة',
  '09-inflated-bubble': 'فقاعة',
  '10-paper-depth': 'عمق',
  '11-spotlight-podium': 'منصة',
  '12-horizon-grid': 'أفق',
  '01-neon-editorial': 'نيون',
  '02-luxury-editorial': 'فاخر',
  '03-minimal-modern': 'بسيط',
  '04-warm-organic': 'طبيعي',
  '05-bold-contemporary': 'جريء',
  '06-magazine-editorial': 'مجلة',
  '07-soft-premium': 'ناعم',
  '08-brutalist-modern': 'حاد',
}

export const TEMPLATE_LABELS_EN: Record<TemplateId, string> = {
  '01-glass-orbs': '3D Glass',
  '02-soft-clay': 'Soft Clay',
  '03-tilted-stack': 'Tilted Stack',
  '04-extruded-type': 'Extruded Type',
  '05-floating-note': 'Floating Note',
  '06-neumorphic': 'Neumorphic',
  '07-liquid-chrome': 'Liquid Chrome',
  '08-ticket-stub': 'Ticket Stub',
  '09-inflated-bubble': 'Inflated Bubble',
  '10-paper-depth': 'Paper Depth',
  '11-spotlight-podium': 'Spotlight Podium',
  '12-horizon-grid': 'Horizon Grid',
  '01-neon-editorial': 'Neon Cyber',
  '02-luxury-editorial': 'Royal Luxury',
  '03-minimal-modern': 'Clean Minimal',
  '04-warm-organic': 'Warm Artisan',
  '05-bold-contemporary': 'Bold Dynamic',
  '06-magazine-editorial': 'Editorial Magazine',
  '07-soft-premium': 'Soft Botanic',
  '08-brutalist-modern': 'Brutalist Studio',
}

export const DEFAULT_BRAND_BY_TEMPLATE: Record<TemplateId, string> = {
  '01-glass-orbs': '#7C5CFF',
  '02-soft-clay': '#FF7A59',
  '03-tilted-stack': '#2F6BFF',
  '04-extruded-type': '#FF5A36',
  '05-floating-note': '#F2C230',
  '06-neumorphic': '#3D7BFF',
  '07-liquid-chrome': '#00E0B8',
  '08-ticket-stub': '#E4572E',
  '09-inflated-bubble': '#6D4DFF',
  '10-paper-depth': '#0E9F8A',
  '11-spotlight-podium': '#C9A2FF',
  '12-horizon-grid': '#FF4F8B',
  '01-neon-editorial': '#22D3EE',
  '02-luxury-editorial': '#8E2C3B',
  '03-minimal-modern': '#E2502B',
  '04-warm-organic': '#B0603A',
  '05-bold-contemporary': '#FF4D1F',
  '06-magazine-editorial': '#C2412D',
  '07-soft-premium': '#5E7A68',
  '08-brutalist-modern': '#2B5BFF',
}
