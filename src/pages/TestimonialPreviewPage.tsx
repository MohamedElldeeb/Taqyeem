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
import { CheckCircle2, Sliders, Palette, Check } from 'lucide-react'
import { TEMPLATE_IDS, TEMPLATE_LABELS, TEMPLATE_LABELS_EN, DEFAULT_BRAND_BY_TEMPLATE, type TemplateId } from '@/lib/testimonial-templates'
import { LiveTemplatePreview } from '@/components/testimonial/LiveTemplatePreview'

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
  const [selectedTemplateId, setSelectedTemplateId] = useState<TemplateId>('01-neon-editorial')

  const getActiveReadyData = () => {
    if (activePreset === 'short') return ADDITIONAL_SAMPLES.short
    if (activePreset === 'long') return ADDITIONAL_SAMPLES.long
    return MOCK_TESTIMONIAL_READY
  }

  const readyData = getActiveReadyData()

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
            <Palette className="size-3.5" />
            <span>{isRTL ? `معاينة القوالب والتصاميم (${TEMPLATE_IDS.length} قالباً)` : `Creative Templates Showcase (${TEMPLATE_IDS.length} Styles)`}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-ink tracking-tight">
            {isRTL ? 'معاينة قوالب وتصاميم التقييمات التفاعلية' : 'Interactive Designer Templates Showcase'}
          </h1>

          <p className="max-w-2xl text-sm sm:text-base text-ink-muted leading-relaxed">
            {isRTL
              ? `استعراض لقوالب التصاميم الـ ${TEMPLATE_IDS.length} مع حالات المعالجة المختلفة وتناسق الخطوط التلقائي.`
              : `Showcase of the ${TEMPLATE_IDS.length} designer templates and testimonial card states with adaptive typography.`}
          </p>

          {/* Review Length Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-muted">
              <Sliders className="size-3.5" />
              {isRTL ? 'طول نص التقييم:' : 'Review Length:'}
            </span>
            <button
              onClick={() => setActivePreset('default')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                activePreset === 'default'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-surface border border-border text-ink-muted hover:text-ink hover:bg-background-subtle'
              }`}
            >
              {isRTL ? 'نص قياسي (Default)' : 'Standard (Default)'}
            </button>
            <button
              onClick={() => setActivePreset('short')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                activePreset === 'short'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-surface border border-border text-ink-muted hover:text-ink hover:bg-background-subtle'
              }`}
            >
              {isRTL ? 'نص قصير (Short)' : 'Short Review'}
            </button>
            <button
              onClick={() => setActivePreset('long')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                activePreset === 'long'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-surface border border-border text-ink-muted hover:text-ink hover:bg-background-subtle'
              }`}
            >
              {isRTL ? 'نص طويل (Long)' : 'Long Review'}
            </button>
          </div>
        </header>

        {/* 20 Designer Templates Gallery Row */}
        <section className="flex flex-col gap-3 rounded-2xl border border-border/80 bg-surface/90 backdrop-blur-md p-5 shadow-xs">
          <div className="flex items-center justify-between gap-2 pb-2 border-b border-border/60">
            <div className="flex items-center gap-2">
              <Palette className="size-4 text-emerald" />
              <span className="text-sm font-bold text-ink">
                {isRTL ? `اختر قالباً للمعاينة المباشرة (${TEMPLATE_IDS.length} قالباً):` : `Select Designer Template to Preview (${TEMPLATE_IDS.length} Styles):`}
              </span>
            </div>
            <span className="text-xs font-bold text-emerald-deep bg-emerald-surface px-2.5 py-0.5 rounded-full border border-emerald-border/60">
              {TEMPLATE_LABELS[selectedTemplateId]}
            </span>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 pt-1">
            {TEMPLATE_IDS.map((tId) => {
              const isSelected = selectedTemplateId === tId
              return (
                <button
                  key={tId}
                  type="button"
                  onClick={() => setSelectedTemplateId(tId)}
                  className={`group relative flex flex-col items-center overflow-hidden rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'border-emerald ring-2 ring-emerald/30 shadow-md scale-105 bg-emerald-surface/30'
                      : 'border-border/80 bg-background-subtle/50 hover:border-border hover:bg-surface hover:shadow-xs'
                  }`}
                >
                  <div className="relative aspect-square w-full overflow-hidden bg-slate-100 dark:bg-slate-950">
                    <LiveTemplatePreview
                      templateId={tId}
                      brandColor={DEFAULT_BRAND_BY_TEMPLATE[tId]}
                      className="size-full pointer-events-none"
                    />
                    {isSelected && (
                      <div className="absolute top-1 end-1 flex size-4 items-center justify-center rounded-full bg-emerald text-white shadow-xs z-10">
                        <Check className="size-2.5 stroke-[3]" />
                      </div>
                    )}
                  </div>
                  <span
                    className={`w-full text-center py-1 text-[10px] font-bold truncate px-1 ${
                      isSelected ? 'text-emerald-deep font-black' : 'text-ink-muted group-hover:text-ink'
                    }`}
                  >
                    {isRTL ? TEMPLATE_LABELS[tId] : TEMPLATE_LABELS_EN[tId]}
                  </span>
                </button>
              )
            })}
          </div>
        </section>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
          {/* 1. Selected Template Render Preview */}
          <section className="flex flex-col gap-3">
            <div className="flex items-center gap-2 px-1">
              <span className="size-2 shrink-0 rounded-full bg-indigo-500" />
              <span className="text-xs sm:text-sm font-bold text-ink">
                {isRTL ? `قالب: ${TEMPLATE_LABELS[selectedTemplateId]}` : `Template: ${TEMPLATE_LABELS_EN[selectedTemplateId]}`}
              </span>
            </div>
            <div className="aspect-square w-full max-w-[520px] overflow-hidden rounded-2xl border border-border/80 bg-slate-100 dark:bg-slate-950 shadow-md">
              <LiveTemplatePreview
                templateId={selectedTemplateId}
                brandColor={readyData.merchant.brandColor || DEFAULT_BRAND_BY_TEMPLATE[selectedTemplateId]}
                data={{
                  quote: readyData.reviewText,
                  customer: readyData.customerName,
                  merchant: readyData.merchant.businessName,
                  rating: readyData.rating,
                }}
                className="size-full"
              />
            </div>
          </section>

          {/* 2. Ready with Name */}
          <section className="flex flex-col gap-3">
            <div className="flex items-center gap-2 px-1">
              <span className="size-2 shrink-0 rounded-full bg-emerald-500" />
              <span className="text-xs sm:text-sm font-bold text-ink">
                {isRTL ? 'مكتمل مع اسم العميل (Live Ready)' : 'Live Ready with Name'}
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

          {/* 4. Processing */}
          <section className="flex flex-col gap-3">
            <div className="flex items-center gap-2 px-1">
              <span className="size-2 shrink-0 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-xs sm:text-sm font-bold text-ink">
                {isRTL ? 'قيد التجهيز (Processing)' : 'Processing State'}
              </span>
            </div>
            <GeneratedTestimonialCard status="processing" />
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

