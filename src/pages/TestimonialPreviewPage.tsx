import { AppShell } from '@/components/layout/AppShell'
import { GeneratedTestimonialCard } from '@/components/testimonial/GeneratedTestimonialCard'
import {
  MOCK_TESTIMONIAL_READY,
  MOCK_TESTIMONIAL_READY_NO_NAME,
} from '@/mock/generated-testimonials'

/**
 * Phase 3 inspection route only — not a product page.
 * Shows the generated testimonial creative's processing/ready/failed states
 * with realistic Arabic mock data, side by side, for visual review.
 */
function TestimonialPreviewPage() {
  return (
    <AppShell className="max-w-6xl">
      <div className="flex flex-col gap-10">
        <header className="flex flex-col gap-2">
          <span className="text-sm font-medium text-emerald">تقييم · Taqyeem</span>
          <h1 className="text-3xl font-semibold text-ink">
            معاينة التقييم المُصمَّم بالذكاء الاصطناعي
          </h1>
          <p className="max-w-prose text-muted-text">
            هذه معاينة داخلية لحالات عرض الصورة الناتجة (قيد الإنشاء، جاهزة،
            فشل) — وليست صفحة منتج نهائية.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <section className="flex flex-col gap-3">
            <h2 className="text-sm font-medium text-muted-text">قيد الإنشاء</h2>
            <GeneratedTestimonialCard status="processing" />
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-sm font-medium text-muted-text">جاهزة — مع اسم</h2>
            <GeneratedTestimonialCard status="ready" data={MOCK_TESTIMONIAL_READY} />
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-sm font-medium text-muted-text">
              جاهزة — بدون اسم عميل
            </h2>
            <GeneratedTestimonialCard
              status="ready"
              data={MOCK_TESTIMONIAL_READY_NO_NAME}
            />
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-sm font-medium text-muted-text">فشل الإنشاء</h2>
            <GeneratedTestimonialCard status="failed" onRetry={() => {}} />
          </section>
        </div>
      </div>
    </AppShell>
  )
}

export default TestimonialPreviewPage
