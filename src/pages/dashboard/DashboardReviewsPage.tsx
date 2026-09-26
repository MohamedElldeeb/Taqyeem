import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { StarRating } from '@/components/ui/star-rating'
import { GeneratedTestimonialCard } from '@/components/testimonial/GeneratedTestimonialCard'
import { useMerchant } from '@/hooks/useMerchant'
import { useMerchantReviews, type MerchantReview, type ReviewDbStatus } from '@/hooks/useMerchantReviews'
import { toCardStatus } from '@/lib/generated-content-status'

const STATUS_LABEL: Record<ReviewDbStatus, string> = {
  submitted: 'جارٍ تجهيز التقييم',
  processing: 'بنجهز الصورة...',
  completed: 'جاهزة',
  failed: 'فشل الإنشاء',
}

const STATUS_VARIANT: Record<ReviewDbStatus, 'default' | 'secondary' | 'destructive'> = {
  submitted: 'secondary',
  processing: 'secondary',
  completed: 'default',
  failed: 'destructive',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })
}

/**
 * Reviews entry point only (simple list). Full reviews management
 * (bulk actions, retry, etc.) is Phase 13.
 */
function DashboardReviewsPage() {
  const { merchant } = useMerchant()
  const { reviews, loading, error, refetch } = useMerchantReviews(merchant?.id)

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-ink">التقييمات</h1>
        <p className="text-muted-text">كل التقييمات التي وصلتك من عملائك.</p>
      </header>

      {loading && <p className="text-sm text-muted-text">جاري التحميل...</p>}

      {!loading && error && (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-8 text-center">
            <p className="text-sm text-danger">تعذر تحميل التقييمات.</p>
            <Button variant="secondary" size="sm" onClick={refetch}>
              إعادة المحاولة
            </Button>
          </CardContent>
        </Card>
      )}

      {!loading && !error && reviews.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <Heart className="size-10 text-muted-text" strokeWidth={1.5} />
            <p className="font-medium text-ink">لا توجد تقييمات بعد</p>
            <p className="max-w-sm text-sm text-muted-text">
              شارك رابط التقييم أو رمز QR الخاص بك مع عملائك لتبدأ في جمع آرائهم الحقيقية.
            </p>
            <Button asChild size="sm">
              <Link to="/dashboard/qr">مشاركة رابط التقييم</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {!loading && !error && reviews.length > 0 && (
        <div className="flex flex-col gap-4">
          {reviews.map((review) => (
            <ReviewRow key={review.id} review={review} businessName={merchant?.business_name ?? ''} brandColor={merchant?.brand_color ?? '#087F5B'} />
          ))}
        </div>
      )}
    </div>
  )
}

function ReviewRow({
  review,
  businessName,
  brandColor,
}: {
  review: MerchantReview
  businessName: string
  brandColor: string
}) {
  const cardStatus = review.generated_content
    ? toCardStatus(review.generated_content.status)
    : 'processing'

  return (
    <Card>
      <CardContent className="flex flex-col gap-4 pt-6 sm:flex-row">
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-medium text-ink">{review.customer_name ?? 'عميل مجهول'}</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-text">{formatDate(review.created_at)}</span>
              <Badge variant={STATUS_VARIANT[review.status]}>{STATUS_LABEL[review.status]}</Badge>
            </div>
          </div>
          <StarRating value={review.rating} onChange={() => {}} disabled />
          <p className="text-sm text-muted-text">{review.original_text}</p>
        </div>

        <GeneratedTestimonialCard
          className="max-w-[220px] shrink-0 rounded-md"
          status={cardStatus}
          data={
            cardStatus === 'ready' && review.generated_content?.image_url
              ? {
                  merchant: { businessName, brandColor },
                  customerName: review.customer_name ?? undefined,
                  rating: review.rating,
                  reviewText: review.original_text,
                  generatedImageUrl: review.generated_content.image_url,
                }
              : undefined
          }
        />
      </CardContent>
    </Card>
  )
}

export default DashboardReviewsPage
