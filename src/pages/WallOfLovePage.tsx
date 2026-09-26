import * as React from 'react'
import { useParams } from 'react-router-dom'

import { GeneratedTestimonialCard } from '@/components/testimonial/GeneratedTestimonialCard'
import { getPublicMerchantBySlug, type PublicMerchant } from '@/lib/public-merchant'
import { getPublicTestimonialsBySlug, type PublicTestimonial } from '@/lib/public-wall-of-love'

type PageState =
  | { status: 'loading' }
  | { status: 'not-found' }
  | { status: 'ready'; merchant: PublicMerchant; testimonials: PublicTestimonial[] }

/**
 * /w/{merchant-slug} — public Wall of Love.
 * A merchant-branded social-proof page, not an admin surface: no login,
 * no filters, no analytics, no management controls. A review appears once
 * it exists as a submitted review — generation failure never hides the
 * underlying (real, immutable) customer text; it just shows the clean
 * text-card fallback GeneratedTestimonialCard already renders in the
 * absence of a generated image, so the page always looks premium.
 */
function WallOfLovePage() {
  const { slug } = useParams<{ slug: string }>()
  const [state, setState] = React.useState<PageState>({ status: 'loading' })

  React.useEffect(() => {
    let cancelled = false
    setState({ status: 'loading' })

    if (!slug) {
      setState({ status: 'not-found' })
      return
    }

    Promise.all([getPublicMerchantBySlug(slug), getPublicTestimonialsBySlug(slug)])
      .then(([merchant, testimonials]) => {
        if (cancelled) return
        if (!merchant) {
          setState({ status: 'not-found' })
          return
        }
        setState({ status: 'ready', merchant, testimonials })
      })
      .catch((error) => {
        console.error('Failed to load Wall of Love', error)
        if (!cancelled) setState({ status: 'not-found' })
      })

    return () => {
      cancelled = true
    }
  }, [slug])

  if (state.status === 'loading') {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-background px-gutter text-center">
        <p className="text-muted-text">جاري التحميل...</p>
      </main>
    )
  }

  if (state.status === 'not-found') {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-background px-gutter text-center">
        <p className="text-muted-text">لم يتم العثور على هذا المتجر.</p>
      </main>
    )
  }

  const { merchant, testimonials } = state

  return (
    <main className="min-h-dvh bg-background">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-16 px-gutter py-gutter-lg md:px-gutter-lg md:py-section-gap">
        <header className="flex flex-col items-center gap-4 text-center">
          {merchant.logo_url ? (
            <img
              src={merchant.logo_url}
              alt=""
              className="size-16 rounded-full object-cover"
            />
          ) : (
            <div
              className="flex size-16 items-center justify-center rounded-full text-xl font-semibold text-white"
              style={{ backgroundColor: merchant.brand_color }}
              aria-hidden
            >
              {merchant.business_name.trim().charAt(0)}
            </div>
          )}
          <h1 className="text-3xl font-semibold text-ink">{merchant.business_name}</h1>
          <p
            className="h-1 w-12 rounded-full"
            style={{ backgroundColor: merchant.brand_color }}
            aria-hidden
          />
          <p className="max-w-prose text-muted-text">ماذا يقول عملاؤنا</p>
        </header>

        {testimonials.length === 0 ? (
          <p className="text-center text-muted-text">لا توجد تقييمات بعد.</p>
        ) : (
          <section
            className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
            aria-label="آراء العملاء"
          >
            {testimonials.map((testimonial) => (
              <GeneratedTestimonialCard
                key={testimonial.id}
                status="ready"
                data={{
                  merchant: {
                    businessName: merchant.business_name,
                    brandColor: merchant.brand_color,
                  },
                  customerName: testimonial.customer_name ?? undefined,
                  rating: testimonial.rating,
                  reviewText: testimonial.original_text,
                  generatedImageUrl: testimonial.image_url ?? undefined,
                }}
              />
            ))}
          </section>
        )}

        <footer className="flex flex-col items-center gap-2 border-t border-border pt-8 text-center">
          <span className="text-sm text-muted-text">مدعوم من تقييم</span>
        </footer>
      </div>
    </main>
  )
}

export default WallOfLovePage
