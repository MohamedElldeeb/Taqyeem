import { ExternalLink, Heart, Sparkles } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { Skeleton } from '@/components/ui/skeleton'
import { GeneratedTestimonialCard } from '@/components/testimonial/GeneratedTestimonialCard'
import { useMerchant } from '@/hooks/useMerchant'
import { useMerchantReviews } from '@/hooks/useMerchantReviews'
import { toCardStatus } from '@/lib/generated-content-status'
import { useLanguage } from '@/lib/language-context'

function DashboardWallOfLovePage() {
  const { merchant } = useMerchant()
  const { reviews, loading } = useMerchantReviews(merchant?.id)
  const { t } = useLanguage()

  if (!merchant) return null

  const previewReviews = reviews.slice(0, 6)

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
              {t('dash_wall_title')}
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-border bg-emerald-surface px-2.5 py-0.5 text-[11px] font-bold text-emerald-deep shadow-2xs">
              <Sparkles className="size-3" />
              {t('dash_wall_preview_badge')}
            </span>
          </div>
          <p className="text-sm text-ink-muted">
            {t('dash_wall_subtitle')}
          </p>
        </div>

        <Button asChild size="default" variant="primaryGlow" className="w-fit shadow-md transition-all active:scale-95">
          <a href={`/w/${merchant.slug}`} target="_blank" rel="noreferrer" className="gap-2">
            <span>{t('dash_wall_open_public')}</span>
            <ExternalLink className="size-4" />
          </a>
        </Button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="aspect-square w-full rounded-2xl" />
          <Skeleton className="aspect-square w-full rounded-2xl" />
          <Skeleton className="aspect-square w-full rounded-2xl" />
        </div>
      )}

      {/* Empty State */}
      {!loading && previewReviews.length === 0 && (
        <EmptyState
          icon={Heart}
          title={t('dash_empty_reviews_title')}
          description={t('dash_empty_reviews_desc')}
          actionLabel={t('dash_qr_card_title')}
          actionHref="/dashboard/qr"
        />
      )}

      {/* Testimonials Preview Grid */}
      {!loading && previewReviews.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {previewReviews.map((review) => (
            <div
              key={review.id}
              className="transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <GeneratedTestimonialCard
                status={
                  review.generated_content ? toCardStatus(review.generated_content.status) : 'processing'
                }
                data={{
                  merchant: {
                    businessName: merchant.business_name,
                    brandColor: merchant.brand_color,
                  },
                  customerName: review.customer_name ?? undefined,
                  rating: review.rating,
                  reviewText: review.original_text,
                  generatedImageUrl: review.generated_content?.image_url ?? undefined,
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default DashboardWallOfLovePage

