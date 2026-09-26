import type { GeneratedTestimonialData } from '@/components/testimonial/GeneratedTestimonialCard'

/**
 * Mock generated-testimonial samples for Phase 3.
 * reviewText values simulate real customer input and are rendered verbatim
 * by GeneratedTestimonialCard — never rewritten, never summarized.
 */
export const MOCK_TESTIMONIAL_READY: GeneratedTestimonialData = {
  merchant: {
    businessName: 'ركن القهوة',
    brandColor: '#A9431E',
  },
  customerName: 'سارة محمد',
  rating: 5,
  reviewText:
    'من أول مرة دخلت المكان حسيت بفرق كبير، القهوة طعمها مختلف والريحة بتنور المكان كله. الموظفين كانوا لطاف جدا وسريعين في التحضير. أكيد هرجع تاني وهرشح المكان لكل صحابي.',
}

export const MOCK_TESTIMONIAL_READY_NO_NAME: GeneratedTestimonialData = {
  merchant: {
    businessName: 'أتيليه نور',
    brandColor: '#5B4B8A',
  },
  rating: 4,
  reviewText:
    'التصميم كان أحسن بكتير مما توقعت، والتسليم كان في الميعاد بالظبط. في تفاصيل بسيطة حابب تتحسن بس عموما تجربة كويسة جدا.',
}
