import { ExternalLink, Heart } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { GeneratedTestimonialCard } from '@/components/testimonial/GeneratedTestimonialCard'
import { useMerchant } from '@/hooks/useMerchant'
import { useMerchantReviews } from '@/hooks/useMerchantReviews'
import { toCardStatus } from '@/lib/generated-content-status'

/**
 * Wall of Love entry point only — links out to the real public page
 * and shows a quick preview using the current merchant's own real
 * reviews. Not a management screen.
 */
function DashboardWallOfLovePage() {
  const { merchant } = useMerchant()
  const { reviews, loading } = useMerchantReviews(merchant?.id)

  if (!merchant) return null

  const previewReviews = reviews.slice(0, 3)

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-ink">Wall of Love</h1>
        <p className="text-muted-text">
          هذا شكل صفحتك العامة كما يراها زوارك وعملاؤك.
        </p>
      </header>

      <Button asChild className="w-fit">
        <a href={`/w/${merchant.slug}`} target="_blank" rel="noreferrer">
          فتح الصفحة العامة
          <ExternalLink className="size-4" />
        </a>
      </Button>

      {loading && <p className="text-sm text-muted-text">جاري التحميل...</p>}

      {!loading && previewReviews.length === 0 && (
        <div className="flex flex-col items-center gap-3 rounded-md border border-border py-12 text-center">
          <Heart className="size-10 text-muted-text" strokeWidth={1.5} />
          <p className="text-sm text-muted-text">
            لا توجد تقييمات بعد لعرضها هنا. بمجرد وصول أول تقييم سيظهر تلقائيًا.
          </p>
        </div>
      )}

      {!loading && previewReviews.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {previewReviews.map((review) => (
            <GeneratedTestimonialCard
              key={review.id}
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
          ))}
        </div>
      )}
    </div>
  )
}

export default DashboardWallOfLovePage
