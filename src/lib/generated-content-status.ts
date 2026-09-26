import type { GeneratedTestimonialStatus } from '@/components/testimonial/GeneratedTestimonialCard'

export type GeneratedContentDbStatus = 'pending' | 'processing' | 'completed' | 'failed'

/**
 * Maps the real `generated_content.status` values (Phase 7/10) to the
 * GeneratedTestimonialCard status vocabulary, so future phases that fetch
 * real rows can pass them straight into the existing component.
 */
export function toCardStatus(status: GeneratedContentDbStatus): GeneratedTestimonialStatus {
  switch (status) {
    case 'pending':
    case 'processing':
      return 'processing'
    case 'completed':
      return 'ready'
    case 'failed':
      return 'failed'
  }
}
