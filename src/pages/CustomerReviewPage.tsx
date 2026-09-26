import * as React from 'react'
import { useParams } from 'react-router-dom'
import { CheckCircle2, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { StarRating } from '@/components/ui/star-rating'
import { Textarea } from '@/components/ui/textarea'
import { getPublicMerchantBySlug, type PublicMerchant } from '@/lib/public-merchant'
import { submitReview } from '@/lib/review-submission'
import { cn } from '@/lib/utils'

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error'
type MerchantLookupState =
  | { status: 'loading' }
  | { status: 'not-found' }
  | { status: 'found'; merchant: PublicMerchant }

/**
 * /r/{merchant-slug} — the customer-facing review page.
 * No account, no navigation chrome. Must be completable in seconds.
 * The review text entered here is treated as immutable source content —
 * it is only ever passed through unchanged, never processed or rewritten.
 */
function CustomerReviewPage() {
  const { slug } = useParams<{ slug: string }>()
  const [lookup, setLookup] = React.useState<MerchantLookupState>({ status: 'loading' })

  React.useEffect(() => {
    let cancelled = false
    setLookup({ status: 'loading' })

    if (!slug) {
      setLookup({ status: 'not-found' })
      return
    }

    getPublicMerchantBySlug(slug)
      .then((merchant) => {
        if (cancelled) return
        setLookup(merchant ? { status: 'found', merchant } : { status: 'not-found' })
      })
      .catch((error) => {
        console.error('Failed to load merchant by slug', error)
        if (!cancelled) setLookup({ status: 'not-found' })
      })

    return () => {
      cancelled = true
    }
  }, [slug])

  const [rating, setRating] = React.useState(0)
  const [reviewText, setReviewText] = React.useState('')
  const [customerName, setCustomerName] = React.useState('')
  const [status, setStatus] = React.useState<SubmitStatus>('idle')
  const [attemptedSubmit, setAttemptedSubmit] = React.useState(false)

  if (lookup.status === 'loading') {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-background px-gutter text-center">
        <p className="text-muted-text">جاري التحميل...</p>
      </main>
    )
  }

  if (lookup.status === 'not-found') {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-background px-gutter text-center">
        <p className="text-muted-text">لم يتم العثور على هذا المتجر.</p>
      </main>
    )
  }

  const merchant = lookup.merchant
  const ratingMissing = attemptedSubmit && rating === 0
  const textMissing = attemptedSubmit && reviewText.trim().length === 0

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    if (rating === 0 || reviewText.trim().length === 0) {
      setAttemptedSubmit(true)
      return
    }

    setStatus('submitting')
    try {
      await submitReview({
        merchantId: merchant.id,
        rating,
        reviewText,
        customerName,
      })
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-background px-gutter">
        <div className="flex w-full max-w-sm flex-col items-center gap-4 text-center">
          <CheckCircle2 className="size-14 text-emerald" strokeWidth={1.5} />
          <h1 className="text-2xl font-semibold text-ink">شكراً لك!</h1>
          <p className="text-muted-text">
            تم استلام تقييمك بنجاح. رأيك يعني الكثير لـ{merchant.business_name}.
          </p>
        </div>
      </main>
    )
  }

  const isSubmitting = status === 'submitting'

  return (
    <main className="flex min-h-dvh flex-col bg-background">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col gap-8 px-gutter py-gutter-lg">
        <header className="flex flex-col items-center gap-3 text-center">
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
          <h1 className="text-lg font-semibold text-ink">{merchant.business_name}</h1>
          <p className="text-xl font-medium text-ink">إيه رأيك في تجربتك معانا؟</p>
        </header>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <StarRating
              value={rating}
              onChange={setRating}
              disabled={isSubmitting}
              accentColor={merchant.brand_color}
            />
            {ratingMissing && (
              <p className="text-sm text-danger">برجاء اختيار تقييم</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="reviewText">تجربتك بالتفصيل</Label>
            <Textarea
              id="reviewText"
              value={reviewText}
              onChange={(event) => setReviewText(event.target.value)}
              disabled={isSubmitting}
              placeholder="اكتب رأيك هنا..."
              rows={5}
              className={cn(textMissing && 'border-danger')}
            />
            {textMissing && (
              <p className="text-sm text-danger">برجاء كتابة تقييمك</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="customerName">اسمك (اختياري)</Label>
            <Input
              id="customerName"
              value={customerName}
              onChange={(event) => setCustomerName(event.target.value)}
              disabled={isSubmitting}
              placeholder="مثال: محمد أحمد"
            />
          </div>

          {status === 'error' && (
            <p className="rounded-md border border-danger/30 bg-danger/5 px-3 py-2 text-sm text-danger">
              حدث خطأ أثناء إرسال تقييمك. برجاء المحاولة مرة أخرى.
            </p>
          )}

          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            style={{ backgroundColor: merchant.brand_color }}
            className="hover:opacity-90"
          >
            {isSubmitting && <Loader2 className="animate-spin" />}
            {isSubmitting ? 'جاري الإرسال...' : 'إرسال التقييم'}
          </Button>
        </form>
      </div>
    </main>
  )
}

export default CustomerReviewPage
