import { Link } from 'react-router-dom'
import { Heart, QrCode, MessageSquareText, Palette } from 'lucide-react'

import { Button } from '@/components/ui/button'

const WHATSAPP_URL = 'https://wa.me/201125800098'

// Real, already-generated testimonial images from the live pipeline (not
// mockups/fake data) — safe to showcase per CLAUDE.md/DESIGN.md §7.
const HERO_TESTIMONIAL_URL =
  'https://yqghkumzazhppkqrvtfa.supabase.co/storage/v1/object/public/generated-content/a5e5d0d2-4560-4e63-9691-f938fa1b0a2d/c22b10bf-2d53-4fc2-857d-2bc1182da8ed.png'
const WALL_PREVIEW_URLS = [
  'https://yqghkumzazhppkqrvtfa.supabase.co/storage/v1/object/public/generated-content/a5e5d0d2-4560-4e63-9691-f938fa1b0a2d/f2d13257-4802-4bef-b510-db9cbdb12240.png',
  'https://yqghkumzazhppkqrvtfa.supabase.co/storage/v1/object/public/generated-content/a5e5d0d2-4560-4e63-9691-f938fa1b0a2d/c22b10bf-2d53-4fc2-857d-2bc1182da8ed.png',
]

const HOW_IT_WORKS = [
  { title: 'اعمل لينك التقييم الخاص ببيزنسك', desc: 'في ثواني، تقييم يجهزلك لينك ثابت وQR خاص بمتجرك.' },
  { title: 'شاركه مع عميلك', desc: 'حطه على الطاولة، جنب الكاشير، أو على الفاتورة — أي حد يقدر يمسحه بسهولة.' },
  { title: 'العميل يكتب رأيه', desc: 'تقييم ونص بسيط، من غير ما يعمل حساب أو يحمّل تطبيق.' },
  { title: 'تقييم يحوّله لتصميم جاهز', desc: 'رأي العميل بالظبط زي ما كتبه، في تصميم احترافي بهوية متجرك، ويتحفظ في Wall of Love بتاعك.' },
]

const QR_PLACEMENTS = ['عند الكاشير', 'على الطاولة', 'على الفاتورة', 'داخل الطلب', 'بعد تقديم الخدمة']

function LandingPage() {
  return (
    <div className="min-h-dvh bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-gutter py-4 md:px-gutter-lg">
          <span className="text-lg font-semibold text-ink">تقييم · Taqyeem</span>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium text-muted-text hover:text-ink">
              تسجيل الدخول
            </Link>
            <Button asChild size="sm">
              <Link to="/signup">ابدأ مجانًا</Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="mx-auto w-full max-w-5xl px-gutter py-section-gap md:px-gutter-lg">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div className="flex flex-col gap-6 text-center lg:text-right">
              <h1 className="text-3xl font-semibold leading-tight text-ink sm:text-4xl lg:text-5xl">
                حوّل كلام عملائك إلى دليل يخلّي الناس تثق فيك
              </h1>
              <p className="max-w-prose text-lg text-muted-text lg:self-end">
                عميلك بيكتب رأيه الحقيقي في ثواني، وتقييم يحوّله لتصميم احترافي بهوية متجرك، ويجمعهم كلهم
                في صفحة واحدة اسمها Wall of Love — تقدر ترجعلها وتشاركها في أي وقت.
              </p>
              <div className="flex flex-col items-center gap-3 sm:flex-row lg:justify-end">
                <Button asChild size="lg">
                  <Link to="/signup">ابدأ مجانًا</Link>
                </Button>
                <Button asChild variant="secondary" size="lg">
                  <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">
                    كلمنا على واتساب
                  </a>
                </Button>
              </div>
            </div>

            <div className="mx-auto w-full max-w-[420px]">
              <img
                src={HERO_TESTIMONIAL_URL}
                alt="نموذج تصميم تقييم حقيقي تم إنشاؤه عبر تقييم"
                className="aspect-square w-full rounded-lg border border-border object-cover"
              />
            </div>
          </div>
        </section>

        {/* المشكلة / الحل / النتيجة */}
        <section className="border-t border-border bg-muted-surface">
          <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-8 px-gutter py-section-gap md:grid-cols-3 md:px-gutter-lg">
            <div className="flex flex-col gap-2 text-center md:text-right">
              <h3 className="text-sm font-semibold text-emerald">المشكلة</h3>
              <p className="text-ink">
                رأي العميل الحلو بيضيع — بين واتساب، تعليق على إنستجرام، أو كلمة قالها وراحت.
              </p>
            </div>
            <div className="flex flex-col gap-2 text-center md:text-right">
              <h3 className="text-sm font-semibold text-emerald">الحل</h3>
              <p className="text-ink">لينك تقييم واحد وبسيط، أو QR تحطه قدام عميلك.</p>
            </div>
            <div className="flex flex-col gap-2 text-center md:text-right">
              <h3 className="text-sm font-semibold text-emerald">النتيجة</h3>
              <p className="text-ink">تصاميم تقييم جاهزة بهوية متجرك، ومحفوظة في Wall of Love دايم.</p>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="mx-auto w-full max-w-5xl px-gutter py-section-gap md:px-gutter-lg">
          <div className="mb-10 flex flex-col items-center gap-2 text-center">
            <h2 className="text-2xl font-semibold text-ink">إزاي بيشتغل تقييم</h2>
            <p className="text-muted-text">أربع خطوات بسيطة، من رأي العميل لحد ما يبقى جزء من هوية متجرك.</p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.title} className="flex flex-col gap-3 rounded-lg border border-border p-5">
                <span className="flex size-8 items-center justify-center rounded-full bg-emerald text-sm font-semibold text-white">
                  {i + 1}
                </span>
                <h3 className="font-semibold text-ink">{step.title}</h3>
                <p className="text-sm text-muted-text">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Wall of Love value */}
        <section className="border-t border-border bg-muted-surface">
          <div className="mx-auto grid w-full max-w-5xl grid-cols-1 items-center gap-10 px-gutter py-section-gap md:px-gutter-lg lg:grid-cols-2">
            <div className="flex flex-col gap-4 text-center lg:text-right">
              <Heart className="mx-auto size-8 text-emerald lg:mx-0" strokeWidth={1.5} />
              <h2 className="text-2xl font-semibold text-ink">Wall of Love بتاعك</h2>
              <p className="max-w-prose text-muted-text lg:self-end">
                كل رأي حلو من عميلك بيتحول لأصل تسويقي تقدر ترجع له وتشاركه في أي وقت — لينك ثابت تبعته
                لأي عميل جديد كدليل على ثقة الناس فيك.
              </p>
            </div>
            <div className="mx-auto grid w-full max-w-md grid-cols-2 gap-4">
              {WALL_PREVIEW_URLS.map((url) => (
                <img
                  key={url}
                  src={url}
                  alt="تصميم تقييم من Wall of Love"
                  loading="lazy"
                  className="aspect-square w-full rounded-lg border border-border object-cover"
                />
              ))}
            </div>
          </div>
        </section>

        {/* Branding value */}
        <section className="mx-auto w-full max-w-5xl px-gutter py-section-gap md:px-gutter-lg">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="flex flex-col gap-3">
              <Palette className="size-8 text-emerald" strokeWidth={1.5} />
              <h3 className="text-xl font-semibold text-ink">تصميم بهوية متجرك، مش سكرين شوت عشوائي</h3>
              <p className="text-muted-text">
                اسم متجرك، لونك المميز، شعارك، واسم وتقييم العميل — كله في تصميم واحد احترافي يعكس إن متجرك
                بيهتم بتجربة عملائه.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <MessageSquareText className="size-8 text-emerald" strokeWidth={1.5} />
              <h3 className="text-xl font-semibold text-ink">كلام عميلك، من غير أي تعديل</h3>
              <p className="text-muted-text">
                النص اللي بيكتبه عميلك بيفضل زي ما هو بالظبط — إحنا بس بنصممه بشكل يخلّي الناس تشوفه
                ويثقوا فيه.
              </p>
            </div>
          </div>
        </section>

        {/* QR value */}
        <section className="border-t border-border bg-muted-surface">
          <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-6 px-gutter py-section-gap text-center md:px-gutter-lg">
            <QrCode className="size-8 text-emerald" strokeWidth={1.5} />
            <h2 className="text-2xl font-semibold text-ink">حط الـQR في أي مكان يشوفه عميلك</h2>
            <div className="flex flex-wrap justify-center gap-2">
              {QR_PLACEMENTS.map((place) => (
                <span
                  key={place}
                  className="rounded-full border border-border bg-surface px-4 py-1.5 text-sm text-ink"
                >
                  {place}
                </span>
              ))}
            </div>
            <p className="max-w-prose text-muted-text">
              QR → تقييم → تصميم جاهز → Wall of Love. كل ده من مسحة واحدة.
            </p>
          </div>
        </section>

        {/* Final CTA */}
        <section className="mx-auto flex w-full max-w-5xl flex-col items-center gap-6 px-gutter py-section-gap text-center md:px-gutter-lg">
          <h2 className="text-2xl font-semibold text-ink">جاهز تبدأ تجمع آراء عملائك؟</h2>
          <p className="max-w-prose text-muted-text">
            تقييم لسه في مرحلة البيتا — نطاق مفتوح للتجربة مع أول مجموعة من المتاجر.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link to="/signup">ابدأ تجربتك</Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">
                تواصل معنا
              </a>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-3 px-gutter py-8 text-center md:px-gutter-lg">
          <span className="text-sm font-medium text-ink">تقييم · Taqyeem</span>
          <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="text-sm text-emerald hover:text-emerald-deep">
            كلمنا على واتساب
          </a>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
