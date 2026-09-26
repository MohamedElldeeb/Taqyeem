import * as React from 'react'
import { Link } from 'react-router-dom'
import { Check, Copy, Heart } from 'lucide-react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StarRating } from '@/components/ui/star-rating'
import { useMerchant } from '@/hooks/useMerchant'
import { useMerchantReviews, type ReviewDbStatus } from '@/hooks/useMerchantReviews'

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

function DashboardHomePage() {
  const { merchant } = useMerchant()
  const { reviews, loading } = useMerchantReviews(merchant?.id)
  const [copied, setCopied] = React.useState(false)
  const reviewLink = `${window.location.origin}/r/${merchant?.slug ?? ''}`

  const readyCount = reviews.filter((r) => r.generated_content?.status === 'completed').length
  const latestReviews = reviews.slice(0, 3)

  async function handleCopy() {
    await navigator.clipboard.writeText(reviewLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-ink">الرئيسية</h1>
        <p className="text-muted-text">نظرة سريعة على تقييماتك.</p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardDescription>إجمالي التقييمات</CardDescription>
            <CardTitle className="text-3xl">{loading ? '—' : reviews.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>الصور الجاهزة للمشاركة</CardDescription>
            <CardTitle className="text-3xl">{loading ? '—' : readyCount}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>رابط التقييم</CardTitle>
          <CardDescription>شاركه مع عملائك لجمع آرائهم.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-3">
          <code className="rounded-md border border-border bg-muted-surface px-3 py-2 text-sm text-ink">
            {reviewLink}
          </code>
          <Button variant="secondary" size="sm" onClick={handleCopy}>
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            {copied ? 'تم النسخ' : 'نسخ الرابط'}
          </Button>
          <Button asChild variant="link" size="sm">
            <Link to="/dashboard/qr">عرض QR</Link>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>أحدث التقييمات</CardTitle>
            <CardDescription>آخر 3 تقييمات وردت من عملائك.</CardDescription>
          </div>
          <Button asChild variant="link" size="sm">
            <Link to="/dashboard/reviews">عرض الكل</Link>
          </Button>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {loading && <p className="text-sm text-muted-text">جاري التحميل...</p>}

          {!loading && reviews.length === 0 && (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <Heart className="size-8 text-muted-text" strokeWidth={1.5} />
              <p className="text-sm text-muted-text">
                لا توجد تقييمات بعد. شارك رابط التقييم أو رمز QR مع عملائك للبدء.
              </p>
            </div>
          )}

          {!loading &&
            latestReviews.map((review) => (
              <div
                key={review.id}
                className="flex flex-col gap-2 rounded-md border border-border p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-medium text-ink">
                    {review.customer_name ?? 'عميل مجهول'}
                  </span>
                  <Badge variant={STATUS_VARIANT[review.status]}>
                    {STATUS_LABEL[review.status]}
                  </Badge>
                </div>
                <StarRating value={review.rating} onChange={() => {}} disabled />
                <p className="text-sm text-muted-text">{review.original_text}</p>
              </div>
            ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Wall of Love</CardTitle>
          <CardDescription>شكل صفحتك العامة لعملائك وزوارك.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="secondary" size="sm">
            <Link to="/dashboard/wall-of-love">فتح المعاينة</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default DashboardHomePage
