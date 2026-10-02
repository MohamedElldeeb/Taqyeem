import { useState } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import {
  GeneratedTestimonialCard,
  type GeneratedTestimonialData,
} from '@/components/testimonial/GeneratedTestimonialCard'
import {
  MOCK_TESTIMONIAL_READY,
  MOCK_TESTIMONIAL_READY_NO_NAME,
} from '@/mock/generated-testimonials'
import { useLanguage } from '@/lib/language-context'
import { Sparkles, CheckCircle2, Sliders } from 'lucide-react'

const ADDITIONAL_SAMPLES: Record<string, GeneratedTestimonialData> = {
  short: {
    merchant: {
      businessName: 'عطور الياسمين',
      brandColor: '#059669',
    },
    customerName: 'أحمد خليل',
    rating: 5,
    reviewText: 'منتج فاخر جدا وثبات العطر خيالي. شكرا لكم!',
  },
  long: {
    merchant: {
      businessName: 'عيادة د. سمير للأسنان',
      brandColor: '#2563EB',
    },
    customerName: 'مريم العتيبي',
    rating: 5,
    reviewText:
      'دكتور ممتاز وطاقم محترف ومتعاون لأقصى درجة. التجربة كانت مريحة جدا وبدون أي ألم، والنتيجة النهائية أجمل مما كنت أحلم به. أنصح كل من يبحث عن عناية طبية راقية بزيارتهم.',
  },
}

function TestimonialPreviewPage() {
  const { isRTL } = useLanguage()
  const [activePreset, setActivePreset] = useState<'default' | 'short' | 'long'>('default')

  const getActiveReadyData = () => {
    if (activePreset === 'short') return ADDITIONAL_SAMPLES.short
    if (activePreset === 'long') return ADDITIONAL_SAMPLES.long
    return MOCK_TESTIMONIAL_READY
  }

  return (
    <AppShell
      pageTitle={isRTL ? 'معاينة تصاميم التقييمات' : 'Testimonial Showcase'}
      className="max-w-6xl"
      showBreadcrumb
      showFooter
      showHeader
    >
      <div className="flex flex-col gap-10">
        {/* Page Header */}
        <header className="flex flex-col gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-border bg-emerald-surface px-3.5 py-1 text-xs font-bold text-emerald-deep w-fit shadow-2xs">
            <Sparkles className="size-3.5" />
            <span>{isRTL ? 'معاينة التصاميم · Creative Showcase' : 'Creative Showcase · Visual Templates'}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-ink tracking-tight">
            {isRTL ? 'معاينة تصاميم التقييمات التفاعلية' : 'Interactive Testimonial Designs Showcase'}
          </h1>

          <p className="max-w-2xl text-sm sm:text-base text-ink-muted leading-relaxed">
            {isRTL
              ? 'استعراض لحالات التصاميم المختلفة مع تناسق الخطوط التلقائي وضمان عدم اقتطاع النص في جميع المقاسات.'
              : 'Showcase of testimonial card states with adaptive typography ensuring text is never clipped regardless of length.'}
          </p>

          {/* Review Length Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-muted">
              <Sliders className="size-3.5" />
              {isRTL ? 'طول نص التقييم:' : 'Review Length:'}
            </span>
            <button
              onClick={() => setActivePreset('default')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                activePreset === 'default'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-surface border border-border text-ink-muted hover:text-ink hover:bg-background-subtle'
              }`}
            >
              {isRTL ? 'نص قياسي (Default)' : 'Standard (Default)'}
            </button>
            <button
              onClick={() => setActivePreset('short')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                activePreset === 'short'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-surface border border-border text-ink-muted hover:text-ink hover:bg-background-subtle'
              }`}
            >
              {isRTL ? 'نص قصير (Short)' : 'Short Review'}
            </button>
            <button
              onClick={() => setActivePreset('long')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                activePreset === 'long'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-surface border border-border text-ink-muted hover:text-ink hover:bg-background-subtle'
              }`}
            >
              {isRTL ? 'نص طويل (Long)' : 'Long Review'}
            </button>
          </div>
        </header>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
          {/* 1. Processing */}
          <section className="flex flex-col gap-3">
            <div className="flex items-center gap-2 px-1">
              <span className="size-2 shrink-0 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-xs sm:text-sm font-bold text-ink">
                {isRTL ? 'قيد التجهيز (Processing)' : 'Processing State'}
              </span>
            </div>
            <GeneratedTestimonialCard status="processing" />
          </section>

          {/* 2. Ready with Name */}
          <section className="flex flex-col gap-3">
            <div className="flex items-center gap-2 px-1">
              <span className="size-2 shrink-0 rounded-full bg-emerald-500" />
              <span className="text-xs sm:text-sm font-bold text-ink">
                {isRTL ? 'مكتمل مع اسم العميل (Ready)' : 'Ready with Customer Name'}
              </span>
            </div>
            <GeneratedTestimonialCard status="ready" data={getActiveReadyData()} />
          </section>

          {/* 3. Ready Anonymous */}
          <section className="flex flex-col gap-3">
            <div className="flex items-center gap-2 px-1">
              <span className="size-2 shrink-0 rounded-full bg-teal-500" />
              <span className="text-xs sm:text-sm font-bold text-ink">
                {isRTL ? 'مكتمل بدون اسم (Anonymous)' : 'Ready Anonymous'}
              </span>
            </div>
            <GeneratedTestimonialCard
              status="ready"
              data={MOCK_TESTIMONIAL_READY_NO_NAME}
            />
          </section>

          {/* 4. Failed */}
          <section className="flex flex-col gap-3">
            <div className="flex items-center gap-2 px-1">
              <span className="size-2 shrink-0 rounded-full bg-rose-500" />
              <span className="text-xs sm:text-sm font-bold text-ink">
                {isRTL ? 'حالة إعادة المحاولة (Failed)' : 'Failed State & Retry'}
              </span>
            </div>
            <GeneratedTestimonialCard status="failed" onRetry={() => {}} />
          </section>
        </div>

        {/* Feature Highlights Banner */}
        <div className="rounded-2xl border border-border/80 bg-surface/70 backdrop-blur-md p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-surface text-emerald-deep shrink-0">
              <CheckCircle2 className="size-5" />
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-bold text-ink">
                {isRTL ? 'محتوى أصلي 100% بدون أي تعديل أو اختصار' : '100% Authentic Content Preserved'}
              </p>
              <p className="text-xs text-ink-muted">
                {isRTL
                  ? 'يتكيف التصميم وحجم الخطوط بمرونة مع طول نص التقييم ليظهر كاملا بوضوح تام.'
                  : 'Design and typography dynamically adjust to fit full customer review verbatim without clipping.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}

export default TestimonialPreviewPage

