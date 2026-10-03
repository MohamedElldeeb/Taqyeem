import * as React from 'react'
import { Link } from 'react-router-dom'
import {
  Heart,
  QrCode,
  MessageSquareText,
  Palette,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  CheckCircle2,
  Star,
  ExternalLink,
  ShieldCheck,
  Zap,
  Check,
  LogIn,
  Lock,
  TrendingUp,
  Copy,
  Share2,
  Utensils,
  Package,
  Receipt,
  CreditCard,
  Smartphone,
  Send,
  Globe,
  Scan,
  MessageCircle,
  FileText,
  Layers,
  Eye,
  SlidersHorizontal,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { LanguageToggle } from '@/components/ui/language-toggle'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { AnimatedBackground } from '@/components/ui/animated-background'
import { BrandLogo, BrandIcon } from '@/components/ui/brand-logo'
import { useLanguage } from '@/lib/language-context'
import { type TemplateId } from '@/lib/testimonial-templates'

const WHATSAPP_URL = 'https://wa.me/201125800098'

const HERO_PRESETS_AR = [
  {
    name: 'سارة عبد الله',
    rating: 5,
    text: 'استلمت طلبي في الوقت المحدد بالضبط والأكل كان طازج وسخن. فريق التوصيل كان محترم جداً، تجربة ممتازة ومن أول مرة وأكيد هطلب تاني!',
    color: '#059669',
    merchant: 'مطعم الأصيل المحدث',
  },
  {
    name: 'محمد إبراهيم',
    rating: 5,
    text: 'أفضل تجربة تسوق أونلاين في مصر! التغليف فاخر، والمنتج خامته فوق الوصف. شكراً على الاهتمام بأدق التفاصيل.',
    color: '#4F46E5',
    merchant: 'بوتيك فيلوست',
  },
  {
    name: 'نور الهدى',
    rating: 5,
    text: 'خدمة عملاء قمة في الذوق والسرعة. ردوا على كل استفساراتي ووصل الطلب قبل الموعد بيوم كامل. خمس نجوم وتستاهلوا أكثر!',
    color: '#D97706',
    merchant: 'عطور ريماس الفاخرة',
  },
]

const HERO_PRESETS_EN = [
  {
    name: 'Sarah Jenkins',
    rating: 5,
    text: 'Received my order right on time and the quality exceeded all my expectations. The packaging was immaculate. Definitely ordering again!',
    color: '#059669',
    merchant: 'Artisan Cafe & Bakery',
  },
  {
    name: 'Marcus Vance',
    rating: 5,
    text: 'Best online shopping experience this year. Customer service resolved my sizing question in minutes. 10/10 recommendation!',
    color: '#4F46E5',
    merchant: 'Velox Apparel Studio',
  },
  {
    name: 'Elena Rostova',
    rating: 5,
    text: 'Flawless craftsmanship and super fast delivery. These reviews convinced me to buy, and now I am leaving one myself!',
    color: '#D97706',
    merchant: 'Lumina Home Living',
  },
]

const BRAND_PALETTE = [
  { name: 'Emerald', hex: '#059669', bg: 'bg-emerald-500' },
  { name: 'Indigo', hex: '#4F46E5', bg: 'bg-indigo-600' },
  { name: 'Amber', hex: '#D97706', bg: 'bg-amber-600' },
  { name: 'Rose', hex: '#E11D48', bg: 'bg-rose-600' },
  { name: 'Teal', hex: '#0D9488', bg: 'bg-teal-600' },
]

export interface TemplateShowcaseItem {
  id: TemplateId
  nameAr: string
  nameEn: string
  taglineAr: string
  taglineEn: string
  industryAr: string
  industryEn: string
  color: string
  category: 'luxury' | 'minimal' | 'bold' | 'organic'
  sampleQuoteAr: string
  sampleQuoteEn: string
  sampleCustomerAr: string
  sampleCustomerEn: string
  sampleMerchantAr: string
  sampleMerchantEn: string
  badgeAr: string
  badgeEn: string
}

const TEMPLATES_SHOWCASE_DATA: TemplateShowcaseItem[] = [
  {
    id: '01-neon-editorial',
    nameAr: 'نيون الساحر',
    nameEn: 'Neon Cyber Noir',
    taglineAr: 'توهج أزرق سيبراني حديث وتأثيرات ضوئية فاخرة',
    taglineEn: 'Luminous cyan glow with futuristic dark-mode ambiance',
    industryAr: 'كافيهات ومطاعم حديثة · متاجر إلكترونية · تقنية',
    industryEn: 'Modern Cafes · E-Commerce · Tech Brands',
    color: '#22D3EE',
    category: 'bold',
    sampleQuoteAr: 'تجربة فوق الخيال! الأجواء والقهوة من عالم ثاني، والخدمة سريعة جداً. أنصح به بشدة!',
    sampleQuoteEn: 'Next-level experience! The coffee and ambiance are unmatched. Lightning-fast service!',
    sampleCustomerAr: 'سارة عبد الله',
    sampleCustomerEn: 'Sarah Jenkins',
    sampleMerchantAr: 'سايبر لاونج · Cyber Lounge',
    sampleMerchantEn: 'Cyber Lounge & Cafe',
    badgeAr: 'الأكثر شعبية 🔥',
    badgeEn: 'Most Popular 🔥',
  },
  {
    id: '02-luxury-editorial',
    nameAr: 'الفخامة الملكية',
    nameEn: 'Royal Luxury Velvet',
    taglineAr: 'درجات العنابي والذهبي الدافئ للبوتيكات الفاخرة',
    taglineEn: 'Burgundy velvet & gold accents for luxury brands',
    industryAr: 'عطور ومجوهرات · أزياء راقية · مطاعم فاخرة',
    industryEn: 'Perfumes & Jewelry · Haute Couture · Fine Dining',
    color: '#8E2C3B',
    category: 'luxury',
    sampleQuoteAr: 'تغليف راقي وفخامة غير مسبوقة. العطر ثباته مذهل وجودته تضاهي أفخم الماركات العالمية.',
    sampleQuoteEn: 'Impeccable luxury packaging and outstanding longevity. Quality rivals top global brands.',
    sampleCustomerAr: 'محمد إبراهيم',
    sampleCustomerEn: 'Marcus Vance',
    sampleMerchantAr: 'عطور ريماس الملكية',
    sampleMerchantEn: 'Remas Royal Fragrances',
    badgeAr: 'فاخر حصري 👑',
    badgeEn: 'Exclusive Luxury 👑',
  },
  {
    id: '03-minimal-modern',
    nameAr: 'المينيمال السويسري',
    nameEn: 'Clean Minimalist',
    taglineAr: 'خطوط هندسية نظيفة ومساحات بيضاء مريحة للعين',
    taglineEn: 'Clean typography and breathable architectural layout',
    industryAr: 'شركات ناشئة · منتجات تقنية · استوديوهات التصميم',
    industryEn: 'Tech Startups · Minimalist Apparel · Design Studios',
    color: '#E2502B',
    category: 'minimal',
    sampleQuoteAr: 'تصميم أنيق وسهولة مطلقة في الطلب. وصل في الموعد المحدد بجودة تصنيع متقنة للغاية.',
    sampleQuoteEn: 'Flawless minimalism and seamless ordering. Arrived right on schedule with top-tier craft.',
    sampleCustomerAr: 'كريم عادل',
    sampleCustomerEn: 'Lucas Meyer',
    sampleMerchantAr: 'ستوديو فيلوكس · Velox',
    sampleMerchantEn: 'Velox Design Goods',
    badgeAr: 'بسيط وأنيق ⚡',
    badgeEn: 'Clean & Modern ⚡',
  },
  {
    id: '04-warm-organic',
    nameAr: 'الدفء الحرفي',
    nameEn: 'Warm Artisan Craft',
    taglineAr: 'ألوان التيراكوتا والتراب الدافئة للمنتجات المصنوعة يدوياً',
    taglineEn: 'Earthy terracotta tones for artisanal & handmade goods',
    industryAr: 'مخابز حرفية · قهوة مختصة · منتجات طبيعية',
    industryEn: 'Artisan Bakeries · Specialty Coffee · Organic Living',
    color: '#B0603A',
    category: 'organic',
    sampleQuoteAr: 'طعم المخبوزات طازج وكأنها مخبوزة في البيت، كل قطعة مصنوعة بحب واهتمام بأدق تفصيل.',
    sampleQuoteEn: 'Everything is freshly baked with genuine love. Pure artisanal quality in every single bite.',
    sampleCustomerAr: 'نور الهدى',
    sampleCustomerEn: 'Elena Rostova',
    sampleMerchantAr: 'مخبز الأصالة الحرفي',
    sampleMerchantEn: 'Artisan Hearth Bakery',
    badgeAr: 'طبيعي وحرفي 🌿',
    badgeEn: 'Warm & Organic 🌿',
  },
  {
    id: '05-bold-contemporary',
    nameAr: 'الجريء المعاصر',
    nameEn: 'Bold Contemporary',
    taglineAr: 'ألوان حيوية نارية وتصميم قوي يوقف حركة التمرير فوراً',
    taglineEn: 'High-contrast energetic layout designed to stop the scroll',
    industryAr: 'ملابس الشارع · لياقة وبدنية · برجر وأكلات عصرية',
    industryEn: 'Streetwear · Fitness & Gyms · Trendy Fast Food',
    color: '#FF4D1F',
    category: 'bold',
    sampleQuoteAr: 'الخامة ممتازة ومريحة جداً في التمرين، والتصميم ملفت وجذاب. تجربة تسوق 10/10!',
    sampleQuoteEn: 'Outstanding fabric and maximum athletic comfort. The design turns heads everywhere.',
    sampleCustomerAr: 'عمر خالد',
    sampleCustomerEn: 'Alex Rivera',
    sampleMerchantAr: 'فيت براند · FitBrand',
    sampleMerchantEn: 'FitBrand Athletics',
    badgeAr: 'عالي الطاقة 🚀',
    badgeEn: 'High Energy 🚀',
  },
  {
    id: '06-magazine-editorial',
    nameAr: 'المجلة التحريرية',
    nameEn: 'Editorial Magazine',
    taglineAr: 'تنسيق مستوحى من أغلفة المجلات العالمية وأسلوب التايبوجرافي الكلاسيكي',
    taglineEn: 'Editorial cover layout with classic serif typography',
    industryAr: 'عيادات تجميل · صالونات فاخرة · ديكور وأثاث',
    industryEn: 'Beauty Clinics · Premium Salons · Home & Decor',
    color: '#C2412D',
    category: 'luxury',
    sampleQuoteAr: 'نتائج فوق التوقعات واهتمام فائق بالتفاصيل. تعامل راقي وفريق محترف يستحق كل الشكر.',
    sampleQuoteEn: 'Results far exceeded my highest expectations. True professionalism and luxury care.',
    sampleCustomerAr: 'منى الشريف',
    sampleCustomerEn: 'Sophia Laurent',
    sampleMerchantAr: 'عيادات إيليت · Elite Clinic',
    sampleMerchantEn: 'Elite Aesthetic Clinic',
    badgeAr: 'أناقة كلاسيكية 🖋️',
    badgeEn: 'Classic Editorial 🖋️',
  },
  {
    id: '07-soft-premium',
    nameAr: 'الباستيل الهادئ',
    nameEn: 'Soft Pastel Botanic',
    taglineAr: 'أخضر ميرمية هادئ ودرجات الباستيل للمنتجات الصحية والجمالية',
    taglineEn: 'Serene sage greens and soft botanic warmth for wellness',
    industryAr: 'عناية بالبشرة · سبا ومنتجعات · مستحضرات طبيعية',
    industryEn: 'Skincare & Spas · Wellness · Natural Cosmetics',
    color: '#5E7A68',
    category: 'organic',
    sampleQuoteAr: 'المنتجات طبيعية 100% وفرقت معايا جداً من أول أسبوع. التغليف أنيق والريحة منعشة!',
    sampleQuoteEn: '100% clean and soothing ingredients. Made a noticeable difference from week one!',
    sampleCustomerAr: 'ياسمين طارق',
    sampleCustomerEn: 'Chloe Bennett',
    sampleMerchantAr: 'بوتانيك كير · Botanic Care',
    sampleMerchantEn: 'Botanic Pure Skincare',
    badgeAr: 'هادئ ومريح 🌸',
    badgeEn: 'Serene & Clean 🌸',
  },
  {
    id: '08-brutalist-modern',
    nameAr: 'البروتاليست المعماري',
    nameEn: 'Brutalist Studio',
    taglineAr: 'شبكة هندسية جريئة وأزرق كهربائي للتصميمات الحديثة والابتكارية',
    taglineEn: 'Architectural geometry and electric cobalt for creatives',
    industryAr: 'استوديوهات إبداعية · وكالات تسويق · معارض فنية',
    industryEn: 'Creative Agencies · Marketing Studios · Art Galleries',
    color: '#2B5BFF',
    category: 'minimal',
    sampleQuoteAr: 'فريق عمل استثنائي أضاف قيمة حقيقية لمشروعنا. دقة في المواعيد واحترافية غير مسبوقة.',
    sampleQuoteEn: 'Exceptional creative talent that elevated our entire brand identity. 100% recommended.',
    sampleCustomerAr: 'طارق حسام',
    sampleCustomerEn: 'Daniel Hayes',
    sampleMerchantAr: 'استوديو نكسوس · Nexus',
    sampleMerchantEn: 'Nexus Creative Studio',
    badgeAr: 'تصميم جريء 📐',
    badgeEn: 'Architectural Grid 📐',
  },
]

function LandingPage() {
  const { t, isRTL } = useLanguage()
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight

  const presets = isRTL ? HERO_PRESETS_AR : HERO_PRESETS_EN
  const [selectedPresetIndex, setSelectedPresetIndex] = React.useState(0)
  const [selectedBrandColor, setSelectedBrandColor] = React.useState(BRAND_PALETTE[0].hex)
  const [selectedQrPlacementIndex, setSelectedQrPlacementIndex] = React.useState(0)
  
  // Template Showcase Interactive State
  const [activeTemplateId, setActiveTemplateId] = React.useState<TemplateId>('01-neon-editorial')
  const [activeCategory, setActiveCategory] = React.useState<'all' | 'luxury' | 'minimal' | 'bold' | 'organic'>('all')
  const [templatePreviewMode, setTemplatePreviewMode] = React.useState<'rendered' | 'live'>('rendered')

  // Card 3 & 4 Interactive States
  const [tamperMode, setTamperMode] = React.useState<'quote' | 'audit'>('quote')
  const [wallCategoryIndex, setWallCategoryIndex] = React.useState(0)
  const [copiedLink, setCopiedLink] = React.useState(false)

  const handleCopyBioLink = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText('https://taqyeem.app/w/your-brand')
    }
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }

  const currentDemo = presets[selectedPresetIndex]

  const qrPlacements = [
    { label: isRTL ? 'عند الكاشير' : 'At Checkout', icon: '💳' },
    { label: isRTL ? 'على الطاولات' : 'On Tables', icon: '🍽️' },
    { label: isRTL ? 'على الفاتورة' : 'On Receipts', icon: '🧾' },
    { label: isRTL ? 'داخل الطلب والشحن' : 'Inside Packaging', icon: '📦' },
    { label: isRTL ? 'بطاقات الشكر' : 'Thank You Cards', icon: '💌' },
  ]

  const wallReviews = [
    {
      id: 'all',
      tabLabel: isRTL ? 'الكل (142)' : 'All (142)',
      name: isRTL ? 'سارة عبد الله' : 'Sarah Jenkins',
      avatar: 'S',
      avatarBg: 'bg-emerald-600',
      tag: isRTL ? 'طلب تم استلامه وتوثيقه' : 'Verified Purchase',
      rating: 5,
      time: isRTL ? 'منذ ساعتين' : '2h ago',
      quote: isRTL
        ? '«استلمت طلبي في الوقت المحدد بالضبط والأكل كان طازج وسخن. فريق التوصيل محترم جداً والتغليف ممتاز!»'
        : '“Received my order right on time and packaging was immaculate. 100% ordering again!”',
    },
    {
      id: 'five-star',
      tabLabel: isRTL ? 'تقييم 5 نجوم (128)' : '5-Star (128)',
      name: isRTL ? 'محمد إبراهيم' : 'Marcus Vance',
      avatar: 'M',
      avatarBg: 'bg-indigo-600',
      tag: isRTL ? 'عميل دائم' : 'Repeat VIP Buyer',
      rating: 5,
      time: isRTL ? 'منذ 5 ساعات' : '5h ago',
      quote: isRTL
        ? '«أفضل متجر تعاملت معه في مصر! خدمة عملاء فورية والمنتج خامته فوق الوصف.»'
        : '“Best online store this year. Customer service resolved my sizing question in minutes!”',
    },
    {
      id: 'spotlights',
      tabLabel: isRTL ? 'توصيات مميزة' : 'Top Spotlights',
      name: isRTL ? 'نور الهدى' : 'Elena Rostova',
      avatar: 'N',
      avatarBg: 'bg-amber-600',
      tag: isRTL ? 'تقييم موثق 100%' : '100% Authentic Review',
      rating: 5,
      time: isRTL ? 'منذ يوم' : '1d ago',
      quote: isRTL
        ? '«صفحة التقييمات العامة شجعتني أشتري بدون أي تردد. مصداقية وجودة تستحق كل الدعم!»'
        : '“This public wall helped me buy without hesitation. Honest reviews build pure buyer trust!”',
    },
  ]

  return (
    <div className="min-h-dvh bg-background text-ink overflow-x-hidden selection:bg-emerald/20 selection:text-emerald-deep relative pb-16 sm:pb-0">
      {/* Global Ambient Background */}
      <AnimatedBackground
        variant="hero"
        showSpotlight
        showGrid
        showDots
        showParticles
        showBeam
      />

      {/* 1. Fixed Top Glass Header */}
      <header className="fixed top-0 inset-x-0 z-50 glass-header bg-white/85 dark:bg-[#04120f]/90 border-b border-border/80 dark:border-emerald-500/20 backdrop-blur-xl transition-all duration-300 shadow-xs">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6 md:px-8">
          <BrandLogo href="/" size="md" />

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-extrabold text-ink-muted">
            <a
              href="#templates"
              className="inline-flex items-center gap-1.5 hover:text-emerald transition-colors py-1 px-2.5 rounded-xl hover:bg-emerald-surface/50"
            >
              <Palette className="size-3.5 text-emerald" />
              <span>{isRTL ? 'قوالب التصاميم (8 قوالب)' : 'Templates (8 Styles)'}</span>
            </a>
            <a
              href="#features"
              className="hover:text-emerald transition-colors py-1 px-2.5 rounded-xl hover:bg-emerald-surface/50"
            >
              {isRTL ? 'المميزات' : 'Features'}
            </a>
            <a
              href="#how-it-works"
              className="hover:text-emerald transition-colors py-1 px-2.5 rounded-xl hover:bg-emerald-surface/50"
            >
              {isRTL ? 'كيف يعمل؟' : 'How It Works'}
            </a>
          </nav>

          <div className="flex items-center gap-2.5 sm:gap-4">
            <ThemeToggle variant="minimal" />
            <LanguageToggle variant="pill" />

            <Button
              asChild
              size="sm"
              variant="outline"
              className="hidden sm:inline-flex text-xs sm:text-sm font-bold text-ink hover:text-emerald bg-surface hover:bg-emerald-surface/60 border-border/80 hover:border-emerald-border/80 shadow-2xs transition-all cursor-pointer"
            >
              <Link to="/login">
                {t('action_login')}
              </Link>
            </Button>

            <Button asChild size="sm" variant="primaryGlow" className="hidden sm:inline-flex shadow-xs font-bold">
              <Link to="/signup" className="flex items-center gap-1.5">
                <span>{t('action_start_free')}</span>
                <ArrowIcon className="size-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="pt-16 sm:pt-20">
        {/* ========================================================================= */}
        {/* SECTION 1: HERO (Luminous Studio & Interactive Testimonial Simulator)    */}
        {/* ========================================================================= */}
        <section className="relative isolate overflow-hidden pt-8 pb-20 sm:pt-14 sm:pb-28">
          {/* Ambient Multi-Layer Animations */}
          <div className="pointer-events-none absolute top-12 start-1/2 -translate-x-1/2 size-[650px] rounded-full bg-gradient-to-tr from-emerald-400/35 via-teal-300/25 to-emerald-200/20 dark:from-emerald-500/18 dark:via-emerald-600/10 dark:to-transparent blur-[110px] z-0 animate-pulse-glow" />
          
          {/* Subtle Rotating Geometric Orbit Rings */}
          <div className="pointer-events-none absolute top-20 end-1/4 size-[480px] rounded-full border border-emerald-500/25 dark:border-emerald-500/15 z-0 animate-spin-slow opacity-60 hidden lg:block" />
          <div className="pointer-events-none absolute top-32 end-1/4 size-[320px] rounded-full border border-dashed border-emerald-500/30 dark:border-emerald-500/15 z-0 animate-spin-slow opacity-40 hidden lg:block" />

          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 md:px-8 relative z-10">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
              
              {/* Hero Left Content */}
              <div className="flex flex-col items-center text-center lg:items-start lg:text-start lg:col-span-6 gap-6">
                
                {/* Floating Live Badge */}
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-border bg-emerald-surface/90 px-4 py-1.5 text-xs font-extrabold text-emerald-deep shadow-xs backdrop-blur-md">
                  <span className="relative flex size-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full size-2 bg-emerald-600" />
                  </span>
                  <span>{t('landing_badge')}</span>
                </div>

                {/* Main Heading */}
                <h1 className="text-3.5xl font-extrabold leading-[1.18] text-ink sm:text-5xl lg:text-[3.25rem] tracking-tight">
                  <span className="gradient-text-emerald">
                    {t('landing_hero_title')}
                  </span>
                </h1>

                {/* Subtitle */}
                <p className="max-w-xl text-base sm:text-lg text-ink-muted leading-relaxed font-normal">
                  {t('landing_hero_subtitle')}
                </p>

                {/* CTAs */}
                <div className="flex flex-col w-full sm:w-auto sm:flex-row items-center gap-3 pt-1">
                  <Button asChild size="lg" variant="primaryGlow" className="w-full sm:w-auto shadow-md">
                    <Link to="/signup" className="flex items-center justify-center gap-2">
                      <span>{t('landing_hero_cta_primary')}</span>
                      <ArrowIcon className="size-4" />
                    </Link>
                  </Button>

                  <Button asChild variant="secondary" size="lg" className="w-full sm:w-auto">
                    <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2">
                      <MessageSquareText className="size-4 text-emerald" />
                      <span>{t('landing_hero_cta_secondary')}</span>
                    </a>
                  </Button>
                </div>

                {/* Trust Proof Badges */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-3 text-xs font-bold text-ink-muted border-t border-border/80 w-full">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="size-4 text-emerald" />
                    <span>{t('landing_hero_stat_trust')}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Zap className="size-4 text-emerald" />
                    <span>{t('landing_hero_stat_speed')}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="size-4 text-emerald" />
                    <span>{isRTL ? 'بدون تحميل تطبيقات' : 'Zero App Downloads'}</span>
                  </div>
                </div>
              </div>

              {/* Hero Right: Interactive Live Simulator Card */}
              <div className="lg:col-span-6 flex flex-col items-center">
                <div className="relative w-full max-w-[460px] py-6 sm:py-7">
                  
                  {/* Subtle, Soft Ambient Glow (Only in Dark Mode for Obsidian Atmosphere) */}
                  <div
                    className="pointer-events-none absolute -inset-4 rounded-3xl blur-3xl opacity-0 dark:opacity-25 transition-opacity duration-700 -z-10"
                    style={{ backgroundColor: currentDemo.color }}
                  />

                  {/* Floating Stat Badge 1 - Top End */}
                  <div className="absolute -top-1 -end-2 sm:-top-3 sm:-end-5 z-20 hidden sm:flex items-center gap-2 rounded-2xl border border-border/80 dark:border-emerald-border/60 bg-surface/95 px-3.5 py-2 shadow-md hover:shadow-lg transition-all backdrop-blur-md animate-float-gentle">
                    <span className="flex size-7 items-center justify-center rounded-xl bg-emerald-surface text-emerald font-black text-xs">
                      ⭐
                    </span>
                    <div className="flex flex-col text-start">
                      <span className="text-[11px] font-black text-ink">5.0 ★★★★★</span>
                      <span className="text-[9px] font-bold text-ink-subtle">
                        {isRTL ? 'تقييمات موثقة 100%' : '100% Verified'}
                      </span>
                    </div>
                  </div>

                  {/* Floating Stat Badge 2 - Bottom Start */}
                  <div className="absolute -bottom-1 -start-2 sm:-bottom-3 sm:-start-5 z-20 hidden sm:flex items-center gap-2 rounded-2xl border border-border/80 dark:border-indigo-900/50 bg-surface/95 px-3.5 py-2 shadow-md hover:shadow-lg transition-all backdrop-blur-md animate-float-reverse">
                    <span className="flex size-7 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-black text-xs">
                      ⚡
                    </span>
                    <div className="flex flex-col text-start">
                      <span className="text-[11px] font-black text-ink">
                        {isRTL ? '+340% زيادة ثقة' : '+340% Conversion'}
                      </span>
                      <span className="text-[9px] font-bold text-emerald">
                        {isRTL ? 'أثر فوري للمبيعات' : 'High ROI Proof'}
                      </span>
                    </div>
                  </div>

                  {/* Modern Luxury Glass Container with Clean Multi-Stop Shadow */}
                  <div className="rounded-3xl border border-border/80 dark:border-emerald-500/20 bg-surface/95 backdrop-blur-xl p-4 sm:p-5 shadow-[0_20px_50px_-15px_rgba(15,23,42,0.1),0_4px_16px_rgba(15,23,42,0.04)] ring-1 ring-black/[0.04] dark:ring-white/[0.08] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_35px_-5px_rgba(16,185,129,0.15)] relative z-10">
                    
                    {/* Live Generator Switcher Header */}
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-border/70">
                      <div className="flex items-center gap-2">
                        <span className="flex size-2 rounded-full bg-emerald animate-pulse" />
                        <span className="text-xs font-bold text-ink">
                          {isRTL ? 'مولّد التقييم الحي التفاعلي' : 'Live Interactive Generator'}
                        </span>
                      </div>
                      <a
                        href="#templates"
                        className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-deep bg-emerald-surface px-2.5 py-1 rounded-full border border-emerald-border/70 hover:scale-105 transition-transform shadow-2xs"
                      >
                        <Palette className="size-3 text-emerald" />
                        <span>{isRTL ? '8 قوالب حصرية' : '8 Templates'}</span>
                      </a>
                    </div>

                    {/* Presets Chips */}
                    <div className="flex items-center gap-1.5 mb-3 overflow-x-auto pb-1 scrollbar-hidden overscroll-contain">
                      {presets.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedPresetIndex(idx)}
                          className={`rounded-xl px-3 py-1.5 text-[11px] font-bold transition-all cursor-pointer truncate shrink-0 ${
                            selectedPresetIndex === idx
                              ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-400/40 scale-105'
                              : 'bg-background-subtle border border-border text-ink-muted hover:text-ink hover:border-emerald-border'
                          }`}
                        >
                          {preset.merchant}
                        </button>
                      ))}
                    </div>

                    {/* The Rendered Testimonial Creative Frame */}
                    <div
                      className="relative aspect-square w-full overflow-hidden rounded-2xl p-6 text-white shadow-lg flex flex-col justify-between transition-all duration-700"
                      style={{
                        background: `
                          radial-gradient(ellipse 95% 75% at 85% 0%, ${currentDemo.color}60 0%, ${currentDemo.color}25 35%, transparent 75%),
                          radial-gradient(circle 500px at 15% 95%, rgba(13, 148, 136, 0.18) 0%, transparent 70%),
                          linear-gradient(180deg, #051513 0%, #030d0c 55%, #020707 100%)
                        `,
                      }}
                    >
                      {/* Internal ambient radial glow */}
                      <div
                        className="absolute -top-1/4 -right-1/4 size-3/4 rounded-full blur-3xl opacity-50 transition-all duration-500 pointer-events-none"
                        style={{ backgroundColor: currentDemo.color }}
                      />

                      {/* Creative Top Header */}
                      <div className="relative z-10 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="flex size-8 items-center justify-center rounded-xl text-xs font-bold text-white shadow-xs transition-colors"
                            style={{ backgroundColor: currentDemo.color }}
                          >
                            {currentDemo.merchant.charAt(0)}
                          </div>
                          <span className="text-xs font-bold text-white/90">
                            {currentDemo.merchant}
                          </span>
                        </div>
                        <span className="text-[10px] text-white/60 font-semibold">
                          {isRTL ? 'تقييم موثق' : 'Verified Review'}
                        </span>
                      </div>

                      {/* Creative Hero Quote */}
                      <div className="relative z-10 flex flex-col gap-3 my-auto">
                        <span
                          className="text-4xl font-black leading-none opacity-80 select-none self-start"
                          style={{ color: currentDemo.color }}
                        >
                          “
                        </span>
                        <p className="text-start text-sm sm:text-base font-bold leading-relaxed text-white">
                          {currentDemo.text}
                        </p>
                      </div>

                      {/* Creative Footer */}
                      <div className="relative z-10 flex items-center justify-between pt-3 border-t border-white/10">
                        <span
                          className="text-xs font-extrabold transition-colors"
                          style={{ color: currentDemo.color }}
                        >
                          {currentDemo.name}
                        </span>
                        <div className="flex items-center gap-0.5 text-amber-400">
                          {Array.from({ length: currentDemo.rating }).map((_, i) => (
                            <Star key={i} className="size-3.5 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Status pill below card */}
                    <div className="mt-3.5 pt-2.5 border-t border-border/50 flex items-center justify-between text-xs font-bold text-ink-muted px-1">
                      <div className="flex items-center gap-1.5 text-emerald">
                        <Check className="size-4" />
                        <span>{isRTL ? 'تصميم فوري بهوية المتجر' : 'Instant Branded Creative'}</span>
                      </div>
                      <span className="text-[11px] text-ink-subtle">
                        {isRTL ? 'جاهز للنشر على السوشيال ميديا' : 'Ready to Share on Stories'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 2: BENTO MATRIX (The 4 Pillars with Interactive Micro-Widgets)   */}
        {/* ========================================================================= */}
        <section id="features" className="relative isolate py-20 md:py-28 border-t border-border/80 overflow-hidden bg-background-subtle/50">
          {/* 1. Animated Geometric Dot Grid Pattern */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#059669_1.2px,transparent_1.2px)] [background-size:28px_28px] opacity-25 dark:opacity-15 z-0" />

          {/* 2. Vibrant Multi-Color Floating Ambient Orbs (High Visibility in Light & Dark Themes) */}
          <div className="pointer-events-none absolute -top-20 -start-20 size-[420px] rounded-full bg-gradient-to-tr from-emerald-400/35 via-teal-300/25 to-emerald-200/20 dark:from-emerald-500/20 dark:via-emerald-600/10 dark:to-transparent blur-[80px] animate-orb-2 z-0" />
          <div className="pointer-events-none absolute -bottom-20 -end-20 size-[450px] rounded-full bg-gradient-to-tr from-indigo-400/30 via-cyan-300/20 to-sky-200/15 dark:from-indigo-600/20 dark:via-blue-600/10 dark:to-transparent blur-[90px] animate-orb-3 z-0" />
          <div className="pointer-events-none absolute top-1/3 end-1/4 size-72 rounded-full bg-gradient-to-tr from-amber-400/25 via-orange-300/20 to-transparent dark:from-amber-600/15 dark:to-transparent blur-[80px] animate-orb-1 z-0" />

          {/* 3. Concentric Animated Radar Wave Rings (Center Section Ripple) */}
          <div className="pointer-events-none absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 size-[650px] rounded-full border border-emerald-500/30 dark:border-emerald-500/20 z-0 animate-radar-wave" />
          <div
            className="pointer-events-none absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 size-[850px] rounded-full border border-teal-500/25 dark:border-teal-500/15 z-0 animate-radar-wave"
            style={{ animationDelay: '2s' }}
          />

          {/* 4. Drifting Ambient Shimmer Particle Elements */}
          <div className="pointer-events-none absolute top-20 start-1/4 size-3 rounded-full bg-emerald-400/60 blur-[1px] animate-float-slow z-0" />
          <div className="pointer-events-none absolute bottom-32 start-1/3 size-4 rounded-full bg-indigo-400/50 blur-[1px] animate-float-reverse z-0" />
          <div className="pointer-events-none absolute top-40 end-1/3 size-3.5 rounded-full bg-amber-400/60 blur-[1px] animate-twinkle-1 z-0" />

          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 md:px-8 relative z-10">
            <div className="mb-14 flex flex-col items-center gap-3 text-center">
              <Badge variant="default" dot>
                {isRTL ? 'لماذا تقييم؟' : 'Why Taqyeem?'}
              </Badge>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-ink tracking-tight">
                {isRTL ? 'كل ما تحتاجه لبناء ثقة عملاء حقيقية' : 'Everything to Build Unshakable Social Proof'}
              </h2>
              <p className="max-w-xl text-sm sm:text-base text-ink-muted">
                {isRTL
                  ? 'منظومة متكاملة تضمن جمع آراء العملاء بأسهل طريقة، وتحويلها لأصول تسويقية فعالة.'
                  : 'An effortless engine to collect genuine customer love and convert it into high-converting sales assets.'}
              </p>
            </div>

            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Bento Card 1: Redesigned Interactive QR Experience (Large - Span 7) */}
              <div className="md:col-span-7 rounded-3xl border border-border bg-surface p-7 sm:p-8 shadow-xs hover:border-emerald-border hover:shadow-2xl transition-all duration-500 flex flex-col justify-between group relative overflow-hidden">
                {/* Ambient Top Glow */}
                <div className="pointer-events-none absolute -top-10 -start-10 size-48 rounded-full bg-emerald-500/15 blur-3xl opacity-60" />

                <div className="flex flex-col gap-3 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-surface text-emerald border border-emerald-border shadow-xs group-hover:scale-110 transition-transform">
                      <QrCode className="size-6" />
                    </div>
                    <span className="text-[11px] font-extrabold text-emerald bg-emerald-surface/90 px-3 py-1 rounded-full border border-emerald-border">
                      {isRTL ? 'مسح سريع بالكاميرا' : 'Instant Camera Scan'}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-extrabold text-ink">
                    {t('landing_qr_title')}
                  </h3>
                  <p className="text-sm text-ink-muted leading-relaxed max-w-xl">
                    {t('landing_qr_desc')}
                  </p>
                </div>

                {/* Rich Interactive Visual Area: Live QR Stand & Placement Selector */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center mt-5 pt-5 border-t border-border/70 relative z-10">
                  
                  {/* Left Column: Interactive QR Stand Mockup with Animated Laser Scanner */}
                  <div className="sm:col-span-5 flex flex-col items-center">
                    <div className="w-full max-w-[210px] rounded-2xl border border-emerald-500/30 bg-gradient-to-b from-[#05211b] via-[#031511] to-[#020b08] p-3.5 shadow-xl text-center relative overflow-hidden group/qr">
                      
                      {/* Animated Laser Scan Beam */}
                      <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_8px_#10b981] animate-scanline z-20 pointer-events-none" />

                      {/* Stand Header */}
                      <div className="flex items-center justify-center gap-1.5 mb-2.5">
                        <div className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-[10px] font-bold text-emerald-300">
                          {isRTL ? 'امسح وشارك تقييمك' : 'Scan & Review'}
                        </span>
                      </div>

                      {/* High-Fidelity QR Code Pattern Frame */}
                      <div className="relative mx-auto size-28 rounded-xl bg-white p-2 shadow-inner flex items-center justify-center">
                        <svg viewBox="0 0 100 100" className="size-full text-slate-900" fill="currentColor">
                          {/* Corner Finder 1 (Top Left) */}
                          <rect x="5" y="5" width="28" height="28" rx="4" fill="#047857" />
                          <rect x="10" y="10" width="18" height="18" rx="2" fill="#ffffff" />
                          <rect x="14" y="14" width="10" height="10" rx="1.5" fill="#047857" />

                          {/* Corner Finder 2 (Top Right) */}
                          <rect x="67" y="5" width="28" height="28" rx="4" fill="#047857" />
                          <rect x="72" y="10" width="18" height="18" rx="2" fill="#ffffff" />
                          <rect x="76" y="14" width="10" height="10" rx="1.5" fill="#047857" />

                          {/* Corner Finder 3 (Bottom Left) */}
                          <rect x="5" y="67" width="28" height="28" rx="4" fill="#047857" />
                          <rect x="10" y="72" width="18" height="18" rx="2" fill="#ffffff" />
                          <rect x="14" y="76" width="10" height="10" rx="1.5" fill="#047857" />

                          {/* Data Modules */}
                          <rect x="38" y="8" width="6" height="6" rx="1" />
                          <rect x="48" y="8" width="6" height="6" rx="1" />
                          <rect x="56" y="16" width="6" height="6" rx="1" />
                          <rect x="38" y="24" width="6" height="6" rx="1" />
                          <rect x="48" y="24" width="6" height="6" rx="1" />
                          <rect x="8" y="38" width="6" height="6" rx="1" />
                          <rect x="24" y="38" width="6" height="6" rx="1" />
                          <rect x="38" y="38" width="8" height="8" rx="2" fill="#059669" />
                          <rect x="54" y="38" width="6" height="6" rx="1" />
                          <rect x="68" y="38" width="6" height="6" rx="1" />
                          <rect x="84" y="38" width="6" height="6" rx="1" />
                          <rect x="8" y="54" width="6" height="6" rx="1" />
                          <rect x="24" y="54" width="6" height="6" rx="1" />
                          <rect x="38" y="54" width="6" height="6" rx="1" />
                          <rect x="54" y="54" width="8" height="8" rx="2" fill="#059669" />
                          <rect x="72" y="54" width="6" height="6" rx="1" />
                          <rect x="84" y="54" width="6" height="6" rx="1" />
                          <rect x="38" y="68" width="6" height="6" rx="1" />
                          <rect x="48" y="76" width="6" height="6" rx="1" />
                          <rect x="58" y="68" width="6" height="6" rx="1" />
                          <rect x="68" y="78" width="6" height="6" rx="1" />
                          <rect x="84" y="68" width="6" height="6" rx="1" />
                          <rect x="76" y="86" width="6" height="6" rx="1" />
                          <rect x="86" y="86" width="6" height="6" rx="1" />
                        </svg>

                        {/* Center Brand Pill */}
                        <div className="absolute inset-0 m-auto size-6 rounded-md bg-emerald-600 text-white flex items-center justify-center text-[10px] font-black shadow-xs">
                          “
                        </div>
                      </div>

                      {/* Stand Dynamic Placement Badge */}
                      <div className="mt-2.5 inline-flex items-center gap-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                        <span>{qrPlacements[selectedQrPlacementIndex].icon}</span>
                        <span>{qrPlacements[selectedQrPlacementIndex].label}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Interactive Placement Spot Chips */}
                  <div className="sm:col-span-7 flex flex-col gap-2.5">
                    <span className="text-[11px] font-bold text-ink-subtle text-start">
                      {isRTL ? 'اختر مكان التوزيع لعرضه:' : 'Select placement spot to preview:'}
                    </span>

                    <div className="flex flex-wrap gap-2">
                      {qrPlacements.map((item, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedQrPlacementIndex(idx)}
                          className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                            selectedQrPlacementIndex === idx
                              ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-400/40 scale-105'
                              : 'bg-background-subtle border border-border text-ink-muted hover:text-ink hover:border-emerald-border'
                          }`}
                        >
                          <span>{item.icon}</span>
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>

                    <div className="mt-1 flex items-center gap-1.5 text-[11px] font-bold text-emerald">
                      <Zap className="size-3.5" />
                      <span>{isRTL ? 'تجربة سريعة بدون أي تحميل أو تطبيقات' : 'Fast 5-second flow with zero app downloads'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bento Card 2: Interactive Brand Matcher (Span 5) */}
              <div
                className="md:col-span-5 rounded-3xl border bg-surface p-7 sm:p-8 shadow-xs hover:shadow-2xl transition-all duration-500 flex flex-col justify-between group relative overflow-hidden"
                style={{
                  borderColor: `${selectedBrandColor}40`,
                  boxShadow: `0 12px 30px -10px ${selectedBrandColor}20`,
                }}
              >
                {/* Background Ambient Radial Glow matching selected color */}
                <div
                  className="pointer-events-none absolute -top-10 -end-10 size-40 rounded-full blur-3xl opacity-40 transition-all duration-700"
                  style={{ backgroundColor: selectedBrandColor }}
                />

                <div className="flex flex-col gap-3.5 relative z-10">
                  <div className="flex items-center justify-between">
                    <div
                      className="flex size-12 items-center justify-center rounded-2xl border shadow-xs group-hover:scale-110 transition-all duration-500"
                      style={{
                        backgroundColor: `${selectedBrandColor}18`,
                        borderColor: `${selectedBrandColor}35`,
                        color: selectedBrandColor,
                      }}
                    >
                      <Palette className="size-6 transition-colors duration-500" />
                    </div>
                    <span
                      className="text-[11px] font-extrabold px-3 py-1 rounded-full border transition-all duration-500"
                      style={{
                        backgroundColor: `${selectedBrandColor}18`,
                        borderColor: `${selectedBrandColor}35`,
                        color: selectedBrandColor,
                      }}
                    >
                      {isRTL ? 'مخصص لهويتك' : 'Brand Adaptive'}
                    </span>
                  </div>

                  <h3 className="text-xl font-extrabold text-ink">
                    {t('landing_branding_title')}
                  </h3>
                  <p className="text-sm text-ink-muted leading-relaxed">
                    {t('landing_branding_desc')}
                  </p>

                  {/* Interactive Live Mini-Creative Preview */}
                  <div
                    className="mt-2 rounded-2xl p-3.5 text-white transition-all duration-500 shadow-md relative overflow-hidden"
                    style={{
                      background: `
                        radial-gradient(ellipse 90% 70% at 85% 0%, ${selectedBrandColor}70 0%, ${selectedBrandColor}25 40%, transparent 80%),
                        linear-gradient(145deg, #071f1a 0%, #030d0b 100%)
                      `,
                      border: `1px solid ${selectedBrandColor}45`,
                    }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div
                          className="flex size-7 items-center justify-center rounded-lg text-xs font-black text-white shadow-xs transition-colors duration-500"
                          style={{ backgroundColor: selectedBrandColor }}
                        >
                          T
                        </div>
                        <div className="flex flex-col text-start">
                          <span className="text-xs font-bold text-white leading-tight">
                            {isRTL ? 'متجر الأناقة العصري' : 'Elegance Studio'}
                          </span>
                          <span className="text-[10px] text-white/60">
                            {isRTL ? 'تطبيق تلقائي للهوية' : 'Automatic Palette Match'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className="size-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                    <div
                      className="mt-2.5 text-[11px] font-medium leading-relaxed rounded-lg p-2 transition-all duration-500 text-start"
                      style={{
                        backgroundColor: `${selectedBrandColor}15`,
                        borderLeft: isRTL ? undefined : `2.5px solid ${selectedBrandColor}`,
                        borderRight: isRTL ? `2.5px solid ${selectedBrandColor}` : undefined,
                      }}
                    >
                      {isRTL
                        ? '“تجربة رائعة وتغليف فاخر، الهوية البصرية تطابق متجرنا بدقة 100%!”'
                        : '“Flawless product quality and brand styling matched our exact palette 100%!”'}
                    </div>
                  </div>
                </div>

                {/* Interactive Real Palette Switcher */}
                <div className="pt-4 mt-3 border-t border-border/70 flex flex-col gap-2 relative z-10">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-ink-subtle">
                      {isRTL ? 'اختر لون هوية متجرك:' : 'Pick your brand palette:'}
                    </span>
                    <span
                      className="text-[11px] font-black transition-colors duration-500"
                      style={{ color: selectedBrandColor }}
                    >
                      {BRAND_PALETTE.find((p) => p.hex === selectedBrandColor)?.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-hidden overscroll-contain">
                    {BRAND_PALETTE.map((pal) => (
                      <button
                        key={pal.name}
                        type="button"
                        onClick={() => setSelectedBrandColor(pal.hex)}
                        className={`size-8 rounded-full shadow-xs border-2 transition-all duration-300 cursor-pointer flex items-center justify-center shrink-0 ${
                          selectedBrandColor === pal.hex
                            ? 'scale-125 border-ink ring-2 ring-emerald/40 shadow-md'
                            : 'border-white dark:border-slate-800 hover:scale-110 opacity-80 hover:opacity-100'
                        } ${pal.bg}`}
                        title={pal.name}
                        aria-label={pal.name}
                      >
                        {selectedBrandColor === pal.hex && (
                          <span className="size-2 rounded-full bg-white shadow-xs" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bento Card 3: 100% Unaltered Real Voices & Anti-Tamper (Span 5) */}
              <div className="md:col-span-5 rounded-3xl border border-emerald-500/20 bg-surface p-6 sm:p-8 shadow-xs hover:border-emerald-500/40 hover:shadow-2xl transition-all duration-500 flex flex-col justify-between group relative overflow-hidden">
                {/* Ambient Emerald Glow */}
                <div className="pointer-events-none absolute -top-12 -end-12 size-44 rounded-full bg-emerald-500/15 blur-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-700" />

                <div className="flex flex-col gap-3 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-surface text-emerald border border-emerald-border shadow-xs group-hover:scale-110 transition-transform">
                      <ShieldCheck className="size-6" />
                    </div>
                    <span className="text-[11px] font-extrabold text-emerald bg-emerald-surface/90 px-3 py-1 rounded-full border border-emerald-border flex items-center gap-1.5">
                      <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      {isRTL ? 'حماية من التعديل' : 'Anti-Tamper'}
                    </span>
                  </div>

                  <h3 className="text-xl font-extrabold text-ink">
                    {t('landing_unaltered_title')}
                  </h3>
                  <p className="text-sm text-ink-muted leading-relaxed">
                    {t('landing_unaltered_desc')}
                  </p>

                  {/* Interactive Visual Studio: Verbatim Quote vs Cryptographic Seal */}
                  <div className="mt-3 rounded-2xl border border-emerald-500/25 bg-gradient-to-b from-[#141e1b] via-[#0d1613] to-[#070e0c] p-4 shadow-xl relative overflow-hidden">
                    {/* Top Status Bar */}
                    <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <span className="flex size-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
                        <span className="text-[10px] font-bold text-slate-200">
                          {tamperMode === 'quote'
                            ? (isRTL ? 'تقييم أصلي وموثق' : 'Authentic Customer Capture')
                            : (isRTL ? 'سجل التدقيق المشفر' : 'Cryptographic Audit Log')}
                        </span>
                      </div>
                      <span className="text-[9px] font-mono font-bold text-emerald-300 bg-emerald-500/15 px-2 py-0.5 rounded border border-emerald-500/30">
                        {tamperMode === 'quote' ? '100% Verbatim' : 'SHA-256 Validated'}
                      </span>
                    </div>

                    {/* Mode Content */}
                    {tamperMode === 'quote' ? (
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="flex size-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300 font-black text-[10px] border border-emerald-500/30">
                              {isRTL ? 'س' : 'S'}
                            </div>
                            <span className="text-xs font-bold text-slate-100">
                              {isRTL ? 'سارة عبد الله' : 'Sarah Jenkins'}
                            </span>
                            <span className="inline-flex items-center text-[9px] font-bold text-emerald-400 bg-emerald-500/15 px-1.5 py-0.2 rounded border border-emerald-500/30">
                              ✓ {isRTL ? 'مشتري حقيقي' : 'Verified'}
                            </span>
                          </div>
                          <div className="flex text-amber-400 text-[10px]">★★★★★</div>
                        </div>

                        <div className="rounded-xl bg-black/40 border border-emerald-500/20 p-2.5 text-[11px] text-slate-200 leading-relaxed text-start relative">
                          <span className="text-emerald-400 font-serif text-sm me-1">“</span>
                          {isRTL
                            ? 'الخدمة كانت فوق الممتازة واستلمت المنتج مغلف بعناية فائقة، تجربة تستحق التكرار بكل ثقة!'
                            : 'The service was top notch and arrived in immaculate packaging. 100% ordering again with full confidence!'}
                          <span className="text-emerald-400 font-serif text-sm ms-1">”</span>
                        </div>

                        <div className="flex items-center justify-between text-[9px] text-emerald-300/90 pt-1">
                          <span className="flex items-center gap-1">
                            <Check className="size-3 text-emerald-400" />
                            {isRTL ? 'تطابق الحروف 100%' : '100% Character Match'}
                          </span>
                          <span>{isRTL ? 'بدون أي تعديل بالذكاء الاصطناعي' : 'Zero AI Tweaks'}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2 font-mono text-[10px] text-start">
                        <div className="rounded-lg bg-black/50 p-2 border border-emerald-500/20 space-y-1 text-slate-300">
                          <div className="flex justify-between">
                            <span className="text-slate-400">algorithm:</span>
                            <span className="text-emerald-300 font-bold">SHA-256 HMAC</span>
                          </div>
                          <div className="flex justify-between truncate">
                            <span className="text-slate-400">hash:</span>
                            <span className="text-emerald-400 font-bold">8f2a79b1...94d2e105</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">status:</span>
                            <span className="text-emerald-400 font-bold">● Sealed & Immutable</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">modifications:</span>
                            <span className="text-emerald-300">0 (Strict Lock)</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-[9px] text-emerald-400 pt-0.5">
                          <span>✓ Cryptographic Integrity Verified</span>
                          <span className="text-slate-400">2026-10-02 UTC</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Interactive Mode Segmented Toggle */}
                  <div className="flex items-center gap-1 rounded-2xl bg-slate-100 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 p-1 mt-1">
                    <button
                      type="button"
                      onClick={() => setTamperMode('quote')}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-xl text-[11px] font-extrabold transition-all cursor-pointer select-none ${
                        tamperMode === 'quote'
                          ? 'bg-white dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 shadow-xs border border-slate-200/90 dark:border-emerald-500/40'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                      }`}
                    >
                      <FileText className="size-3 text-emerald-600 dark:text-emerald-400" />
                      <span>{isRTL ? 'نص العميل الأصلي' : 'Verbatim Quote'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTamperMode('audit')}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-xl text-[11px] font-extrabold transition-all cursor-pointer select-none ${
                        tamperMode === 'audit'
                          ? 'bg-white dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 shadow-xs border border-slate-200/90 dark:border-emerald-500/40'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                      }`}
                    >
                      <ShieldCheck className="size-3 text-indigo-600 dark:text-indigo-400" />
                      <span>{isRTL ? 'الختم المشفر' : 'Security Hash'}</span>
                    </button>
                  </div>
                </div>

                {/* Bottom Trust Guarantee Strip with High Contrast */}
                <div className="pt-3 mt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-between gap-2 p-2.5 sm:p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200/90 dark:border-emerald-500/30 shadow-2xs relative z-10">
                  <div className="flex items-center gap-2 text-xs font-black text-slate-950 dark:text-slate-100">
                    <div className="flex size-6 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-xs shrink-0">
                      <Lock className="size-3.5" />
                    </div>
                    <span className="truncate">{isRTL ? 'نص أصلي بدون أي تعديل أو تزييف' : 'Verbatim Genuine Customer Text'}</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-500/20 px-2 py-0.5 rounded-lg border border-emerald-300 dark:border-emerald-500/40 shrink-0">
                    <Check className="size-3 text-emerald-600 dark:text-emerald-400" />
                    <span>{isRTL ? 'موثوق 100%' : '100% Genuine'}</span>
                  </span>
                </div>
              </div>

              {/* Bento Card 4: Dedicated Wall of Love Live Stream (Span 7) */}
              <div className="md:col-span-7 rounded-3xl border border-emerald-500/20 bg-surface p-6 sm:p-8 shadow-xs hover:border-emerald-500/40 hover:shadow-2xl transition-all duration-500 flex flex-col justify-between group relative overflow-hidden">
                {/* Ambient Emerald Glow */}
                <div className="pointer-events-none absolute -top-12 -end-12 size-48 rounded-full bg-emerald-500/15 blur-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-700" />

                <div className="flex flex-col gap-3 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-surface text-emerald border border-emerald-border shadow-xs group-hover:scale-110 transition-transform">
                      <Heart className="size-6" />
                    </div>
                    <span className="text-[11px] font-extrabold text-emerald bg-emerald-surface/90 px-3 py-1 rounded-full border border-emerald-border flex items-center gap-1.5">
                      <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      {isRTL ? 'صفحة عامة لرابط البايو' : 'Public Bio Link'}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-extrabold text-ink">
                    {t('landing_wall_title')}
                  </h3>
                  <p className="text-sm text-ink-muted leading-relaxed max-w-xl">
                    {t('landing_wall_desc')}
                  </p>
                </div>

                {/* Interactive Live Wall Showcase & Browser Stream Simulator */}
                <div className="mt-4 pt-4 border-t border-border/70 flex flex-col gap-3 relative z-10">
                  
                  {/* Browser Window Header with Copy Link Action */}
                  <div className="rounded-2xl border border-emerald-500/25 bg-gradient-to-b from-[#131f1c] via-[#0c1613] to-[#070e0c] p-3 sm:p-4 shadow-xl">
                    <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-white/10 gap-2">
                      {/* Window Controls */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="size-2.5 rounded-full bg-rose-500/80" />
                        <span className="size-2.5 rounded-full bg-amber-500/80" />
                        <span className="size-2.5 rounded-full bg-emerald-500/80" />
                      </div>

                      {/* Bio Link URL Bar with Interactive Copy */}
                      <div className="flex items-center justify-between flex-1 max-w-md mx-2 rounded-lg bg-black/40 border border-white/10 px-2.5 py-1 text-xs">
                        <div className="flex items-center gap-1.5 text-slate-300 font-mono text-[11px] truncate">
                          <Lock className="size-3 text-emerald-400 shrink-0" />
                          <span className="text-emerald-400 font-bold">taqyeem.app</span>
                          <span className="text-slate-400">/w/your-brand</span>
                        </div>
                        <button
                          type="button"
                          onClick={handleCopyBioLink}
                          className="ms-2 inline-flex items-center gap-1 text-[10px] font-bold text-emerald-300 hover:text-white transition-colors cursor-pointer shrink-0"
                          title="Copy Public Bio Link"
                        >
                          {copiedLink ? (
                            <>
                              <Check className="size-3 text-emerald-400" />
                              <span>{isRTL ? 'تم النسخ!' : 'Copied!'}</span>
                            </>
                          ) : (
                            <>
                              <Copy className="size-3" />
                              <span>{isRTL ? 'نسخ' : 'Copy'}</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Live Shoppers Pulse */}
                      <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-md border border-emerald-500/30 shrink-0">
                        <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>{isRTL ? '18 متسوق يتصفح الآن' : '18 live shoppers'}</span>
                      </div>
                    </div>

                    {/* Interactive Review Category Tabs */}
                    <div className="flex items-center gap-2 mb-3 overflow-x-auto pb-1 scrollbar-none">
                      {wallReviews.map((rev, idx) => (
                        <button
                          key={rev.id}
                          type="button"
                          onClick={() => setWallCategoryIndex(idx)}
                          className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1 text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                            wallCategoryIndex === idx
                              ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-400/40 scale-102'
                              : 'bg-black/30 border border-white/10 text-slate-300 hover:text-white hover:border-white/20'
                          }`}
                        >
                          <span>{rev.tabLabel}</span>
                        </button>
                      ))}
                    </div>

                    {/* Spotlight Live Review Card with 3D Depth Layer */}
                    <div className="relative">
                      {/* Active Spotlight Card */}
                      <div className="rounded-xl border border-emerald-500/30 bg-surface/90 backdrop-blur-md p-3 shadow-lg flex flex-col gap-2 relative z-10 text-start">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`flex size-7 items-center justify-center rounded-lg ${wallReviews[wallCategoryIndex].avatarBg} text-white font-black text-xs shadow-xs`}>
                              {wallReviews[wallCategoryIndex].avatar}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-ink leading-tight">
                                {wallReviews[wallCategoryIndex].name}
                              </span>
                              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                                ✓ {wallReviews[wallCategoryIndex].tag}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-0.5">
                            <div className="flex text-amber-400 text-xs">★★★★★</div>
                            <span className="text-[9px] text-ink-subtle">{wallReviews[wallCategoryIndex].time}</span>
                          </div>
                        </div>

                        <p className="text-[11px] sm:text-xs text-ink-muted leading-relaxed font-medium">
                          {wallReviews[wallCategoryIndex].quote}
                        </p>
                      </div>

                      {/* Peek Layer Stack Beneath */}
                      <div className="absolute inset-x-2 -bottom-1.5 h-6 rounded-xl border border-white/5 bg-surface/40 backdrop-blur-xs -z-0 opacity-70" />
                    </div>
                  </div>

                  {/* Bottom Action & Metric Row */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald bg-emerald-surface/90 border border-emerald-border/80 px-3 py-1.5 rounded-xl">
                      <TrendingUp className="size-4 shrink-0" />
                      <span>{isRTL ? '+48% ثقة أعلى عند الشراء' : '+48% Checkout Trust'}</span>
                    </div>

                    <Button asChild variant="primaryGlow" size="sm" className="gap-1.5 shadow-md font-bold">
                      <Link to="/preview/testimonial">
                        <span>{t('action_open_preview')}</span>
                        <ExternalLink className="size-3.5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 3: DESIGNER TESTIMONIAL TEMPLATES SHOWCASE                       */}
        {/* ========================================================================= */}
        <section id="templates" className="relative isolate py-20 md:py-28 overflow-hidden bg-surface/60 border-t border-border/80 scroll-mt-16">
          {/* Animated Background Orbs and Dot Grid */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#059669_1.2px,transparent_1.2px)] [background-size:28px_28px] opacity-25 dark:opacity-15 z-0" />
          <div className="pointer-events-none absolute top-1/4 start-1/2 -translate-x-1/2 size-[620px] rounded-full bg-gradient-to-tr from-emerald-400/30 via-teal-300/20 to-emerald-200/15 dark:from-emerald-500/15 dark:via-emerald-600/10 dark:to-transparent blur-[100px] animate-pulse-glow z-0" />
          <div className="pointer-events-none absolute -bottom-20 -end-20 size-[480px] rounded-full bg-gradient-to-tr from-indigo-400/25 via-purple-300/15 to-transparent dark:from-indigo-600/15 blur-[90px] animate-orb-2 z-0" />
          <div className="pointer-events-none absolute -top-20 -start-20 size-[420px] rounded-full bg-gradient-to-tr from-amber-400/25 via-orange-300/15 to-transparent dark:from-amber-600/10 blur-[90px] animate-orb-3 z-0" />

          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 md:px-8 relative z-10">
            {/* Section Header */}
            <div className="mb-12 flex flex-col items-center gap-3.5 text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-border bg-emerald-surface/90 px-4 py-1.5 text-xs font-extrabold text-emerald-deep shadow-xs backdrop-blur-md">
                <Palette className="size-3.5" />
                <span>{t('landing_templates_badge')}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-ink tracking-tight">
                {t('landing_templates_title')}
              </h2>

              <p className="max-w-2xl text-sm sm:text-base text-ink-muted leading-relaxed">
                {t('landing_templates_subtitle')}
              </p>

              {/* Category Filter Chips */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-3">
                {[
                  { key: 'all' as const, labelAr: 'الكل (8 قوالب)', labelEn: 'All Templates (8)', icon: Layers },
                  { key: 'luxury' as const, labelAr: 'فاخر وملكي', labelEn: 'Luxury & Royal', icon: Sparkles },
                  { key: 'minimal' as const, labelAr: 'عصري وبسيط', labelEn: 'Clean & Minimal', icon: SlidersHorizontal },
                  { key: 'bold' as const, labelAr: 'حيوي وجريء', labelEn: 'Bold & Dynamic', icon: Zap },
                  { key: 'organic' as const, labelAr: 'طبيعي وناعم', labelEn: 'Warm & Organic', icon: Heart },
                ].map((cat) => {
                  const CatIcon = cat.icon
                  const isActive = activeCategory === cat.key
                  return (
                    <button
                      key={cat.key}
                      type="button"
                      onClick={() => setActiveCategory(cat.key)}
                      className={`inline-flex items-center gap-1.5 rounded-2xl px-3.5 py-2 text-xs font-bold transition-all duration-200 cursor-pointer shadow-2xs select-none ${
                        isActive
                          ? 'bg-emerald text-white shadow-md shadow-emerald/25 ring-2 ring-emerald/40 scale-105'
                          : 'bg-surface border border-border/80 text-ink-muted hover:text-ink hover:border-emerald-border/70 hover:bg-emerald-surface/30'
                      }`}
                    >
                      <CatIcon className={`size-3.5 ${isActive ? 'text-white' : 'text-emerald'}`} />
                      <span>{isRTL ? cat.labelAr : cat.labelEn}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Template Showcase Dual-Pane Stage */}
            {(() => {
              const filteredTemplates = TEMPLATES_SHOWCASE_DATA.filter(
                (item) => activeCategory === 'all' || item.category === activeCategory,
              )
              const activeTemplate =
                TEMPLATES_SHOWCASE_DATA.find((item) => item.id === activeTemplateId) ??
                TEMPLATES_SHOWCASE_DATA[0]

              return (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
                  
                  {/* Left (Large): Active Template Spotlight & Live Interactive Frame (Span 7) */}
                  <div className="lg:col-span-7 flex flex-col h-full min-h-0">
                    <div className="rounded-3xl border border-border/80 bg-surface/95 backdrop-blur-xl p-5 sm:p-6 shadow-xl relative overflow-hidden group flex flex-col justify-between h-full min-h-0">
                      
                      {/* Ambient Glow behind the card matched to template color */}
                      <div
                        className="pointer-events-none absolute -top-12 -start-12 size-64 rounded-full blur-3xl opacity-30 transition-all duration-700"
                        style={{ backgroundColor: activeTemplate.color }}
                      />

                      {/* Header bar */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-3 border-b border-border/70 relative z-10 shrink-0">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="flex size-9 items-center justify-center rounded-xl text-white font-bold shadow-xs transition-colors shrink-0"
                            style={{ backgroundColor: activeTemplate.color }}
                          >
                            <Palette className="size-4.5" />
                          </div>
                          <div className="flex flex-col text-start">
                            <span className="text-sm font-extrabold text-ink leading-tight">
                              {isRTL ? activeTemplate.nameAr : activeTemplate.nameEn}
                            </span>
                            <span className="text-[11px] text-ink-muted">
                              {isRTL ? activeTemplate.industryAr : activeTemplate.industryEn}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className="text-[11px] font-extrabold px-3 py-1 rounded-full border shadow-2xs"
                            style={{
                              backgroundColor: `${activeTemplate.color}15`,
                              borderColor: `${activeTemplate.color}40`,
                              color: activeTemplate.color,
                            }}
                          >
                            {isRTL ? activeTemplate.badgeAr : activeTemplate.badgeEn}
                          </span>

                          {/* View Toggle */}
                          <button
                            type="button"
                            onClick={() =>
                              setTemplatePreviewMode((m) => (m === 'rendered' ? 'live' : 'rendered'))
                            }
                            className="inline-flex items-center gap-1 text-[11px] font-bold rounded-xl border border-border bg-background-subtle px-2.5 py-1 text-ink-muted hover:text-ink hover:border-emerald-border transition-colors cursor-pointer shadow-2xs"
                            title={isRTL ? 'تبديل وضع العرض' : 'Toggle Preview View'}
                          >
                            <Eye className="size-3 text-emerald" />
                            <span>{templatePreviewMode === 'rendered' ? (isRTL ? 'عرض مباشر' : 'Live Mode') : (isRTL ? 'عرض الصورة' : 'Rendered')}</span>
                          </button>
                        </div>
                      </div>

                      {/* Stage Viewport */}
                      <div className="relative aspect-square w-full rounded-2xl overflow-hidden border border-border/80 bg-slate-950/90 dark:bg-slate-950 shadow-inner group/preview flex items-center justify-center p-2.5 sm:p-4 my-auto">
                        {templatePreviewMode === 'rendered' ? (
                          <div className="relative size-full flex items-center justify-center overflow-hidden">
                            <img
                              src={`/template-previews/${activeTemplate.id}.png`}
                              alt={isRTL ? activeTemplate.nameAr : activeTemplate.nameEn}
                              className="size-full object-contain rounded-xl drop-shadow-2xl transition-transform duration-500 group-hover/preview:scale-[1.01]"
                              loading="lazy"
                            />
                            {/* Watermark/Verified Tag Overlay */}
                            <div className="absolute top-2.5 end-2.5 flex items-center gap-1.5 rounded-full bg-slate-950/80 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-white border border-white/20 shadow-md">
                              <ShieldCheck className="size-3.5 text-emerald-400" />
                              <span>{isRTL ? 'تقييم موثق 100%' : '100% Verified'}</span>
                            </div>
                          </div>
                        ) : (
                          /* Interactive Live Simulator Frame */
                          <div
                            className="relative size-full rounded-xl p-6 sm:p-8 flex flex-col justify-between text-white select-none transition-all duration-500 overflow-hidden"
                            style={{
                              background: `
                                radial-gradient(ellipse 95% 75% at 85% 0%, ${activeTemplate.color}65 0%, ${activeTemplate.color}25 35%, transparent 75%),
                                radial-gradient(circle 500px at 15% 95%, rgba(13, 148, 136, 0.2) 0%, transparent 70%),
                                linear-gradient(180deg, #051513 0%, #030d0c 55%, #020707 100%)
                              `,
                            }}
                          >
                            {/* Ambient Glow */}
                            <div
                              className="absolute -top-1/4 -right-1/4 size-3/4 rounded-full blur-3xl opacity-40 pointer-events-none"
                              style={{ backgroundColor: activeTemplate.color }}
                            />

                            {/* Header */}
                            <div className="relative z-10 flex items-center justify-between">
                              <div className="flex items-center gap-2.5">
                                <div
                                  className="flex size-8 items-center justify-center rounded-xl text-xs font-bold text-white shadow-xs"
                                  style={{ backgroundColor: activeTemplate.color }}
                                >
                                  {(isRTL ? activeTemplate.sampleMerchantAr : activeTemplate.sampleMerchantEn).charAt(0)}
                                </div>
                                <span className="text-xs sm:text-sm font-bold text-white/90">
                                  {isRTL ? activeTemplate.sampleMerchantAr : activeTemplate.sampleMerchantEn}
                                </span>
                              </div>
                              <span
                                className="flex size-7 items-center justify-center rounded-lg bg-white/5 font-serif text-lg font-black opacity-90"
                                style={{ color: activeTemplate.color }}
                              >
                                “
                              </span>
                            </div>

                            {/* Quote */}
                            <div className="relative z-10 flex flex-col gap-2.5 my-auto">
                              <p className="text-start text-sm sm:text-base font-bold leading-relaxed text-white">
                                {isRTL ? activeTemplate.sampleQuoteAr : activeTemplate.sampleQuoteEn}
                              </p>
                            </div>

                            {/* Footer */}
                            <div className="relative z-10 flex items-center justify-between pt-3 border-t border-white/10">
                              <div className="flex items-center gap-1.5">
                                <span
                                  className="size-2 rounded-full"
                                  style={{ backgroundColor: activeTemplate.color }}
                                />
                                <span className="text-xs font-bold text-white/90">
                                  {isRTL ? activeTemplate.sampleCustomerAr : activeTemplate.sampleCustomerEn}
                                </span>
                              </div>
                              <div className="flex items-center gap-0.5 text-amber-400">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star key={i} className="size-3.5 fill-amber-400 text-amber-400" />
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Tagline & Specs Bar */}
                      <div className="mt-3 flex items-center justify-between gap-2 px-1 text-xs shrink-0">
                        <span className="font-semibold text-ink-muted truncate text-[11px] sm:text-xs">
                          {isRTL ? activeTemplate.taglineAr : activeTemplate.taglineEn}
                        </span>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-surface text-emerald-deep border border-emerald-border/80 shrink-0">
                          4K UHD
                        </span>
                      </div>

                      {/* Actions Bar */}
                      <div className="mt-3 pt-3 border-t border-border/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shrink-0">
                        <div className="flex items-center gap-2 text-xs text-ink-muted text-start">
                          <Sparkles className="size-4 text-emerald shrink-0" />
                          <span>
                            {isRTL
                              ? 'يتم تطبيق ألوان وشعار متجرك تلقائياً على هذا القالب'
                              : 'Your brand color and logo auto-adapt to this template'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                          <Button asChild size="sm" variant="primaryGlow" className="text-xs font-bold gap-1.5 shadow-xs">
                            <Link to="/signup">
                              <span>{t('action_start_free')}</span>
                              <ArrowIcon className="size-3.5" />
                            </Link>
                          </Button>
                          <Button asChild size="sm" variant="outline" className="text-xs font-bold gap-1.5 shadow-2xs">
                            <Link to="/preview/testimonial">
                              <span>{t('action_open_preview')}</span>
                              <ExternalLink className="size-3" />
                            </Link>
                          </Button>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Right (Selector Grid): 8 Interactive Template Cards (Span 5) */}
                  <div className="lg:col-span-5 flex flex-col h-full min-h-0">
                    <div className="rounded-3xl border border-border/80 bg-surface/95 backdrop-blur-xl p-4 sm:p-5 shadow-xl flex flex-col justify-between h-full min-h-0 relative">
                      
                      {/* Header bar */}
                      <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-border/70 shrink-0">
                        <span className="text-xs sm:text-sm font-extrabold text-ink tracking-tight flex items-center gap-2">
                          <Layers className="size-4 text-emerald" />
                          <span>{isRTL ? 'اختر قالباً للمعاينة والتطبيق:' : 'Select preset to preview:'}</span>
                        </span>
                        <span className="text-[10.5px] font-bold text-ink-subtle px-2 py-0.5 rounded-full bg-background-subtle border border-border">
                          {filteredTemplates.length} {isRTL ? 'قوالب' : 'presets'}
                        </span>
                      </div>

                      {/* 8-Template Grid - Proportionally sized so all 8 presets fit perfectly */}
                      <div className="grid grid-cols-2 gap-2 sm:gap-2.5 flex-1 min-h-0 overflow-y-auto scrollbar-sleek overscroll-contain touch-pan-y pe-1 py-0.5">
                        {filteredTemplates.map((template) => {
                          const isSelected = template.id === activeTemplate.id
                          return (
                            <button
                              key={template.id}
                              type="button"
                              onClick={() => setActiveTemplateId(template.id)}
                              className={`group relative flex flex-col items-center overflow-hidden rounded-xl border-2 transition-all duration-200 cursor-pointer text-start ${
                                isSelected
                                  ? 'border-emerald bg-emerald-surface/40 shadow-md scale-[1.01] ring-1 ring-emerald-500/30'
                                  : 'border-border/80 bg-surface/90 hover:border-emerald-border/80 hover:bg-surface hover:shadow-xs'
                              }`}
                            >
                              {/* Thumbnail */}
                              <div className="relative aspect-[16/8.5] w-full overflow-hidden bg-slate-950 flex items-center justify-center p-1">
                                <img
                                  src={`/template-previews/${template.id}.png`}
                                  alt={isRTL ? template.nameAr : template.nameEn}
                                  className="size-full object-contain rounded-md transition-transform duration-300 group-hover:scale-105"
                                  loading="lazy"
                                />
                                {isSelected && (
                                  <div className="absolute inset-0 bg-emerald/10 pointer-events-none" />
                                )}
                                {isSelected && (
                                  <div className="absolute top-1 inset-inline-end-1 flex size-4.5 items-center justify-center rounded-full bg-emerald text-white shadow-xs animate-scale-in">
                                    <Check className="size-2.5 stroke-[3]" />
                                  </div>
                                )}
                                <span
                                  className="absolute bottom-0.5 inset-inline-start-1 text-[8px] font-black px-1 py-0.2 rounded bg-slate-950/85 backdrop-blur-xs text-white border border-white/20"
                                >
                                  {isRTL ? template.badgeAr : template.badgeEn}
                                </span>
                              </div>

                              {/* Label */}
                              <div className="w-full px-2 py-1.5 flex flex-col gap-0.5 bg-surface/90">
                                <div className="flex items-center justify-between gap-1">
                                  <span
                                    className={`truncate text-[10.5px] sm:text-[11px] font-bold ${
                                      isSelected ? 'text-emerald-deep' : 'text-ink group-hover:text-emerald-deep'
                                    } transition-colors`}
                                  >
                                    {isRTL ? template.nameAr : template.nameEn}
                                  </span>
                                  <span
                                    className="size-1.5 rounded-full shrink-0"
                                    style={{ backgroundColor: template.color }}
                                  />
                                </div>
                                <span className="truncate text-[9px] sm:text-[9.5px] text-ink-subtle">
                                  {isRTL ? template.industryAr.split('·')[0] : template.industryEn.split('·')[0]}
                                </span>
                              </div>
                            </button>
                          )
                        })}
                      </div>

                      {/* Footer sub-bar */}
                      <div className="mt-2.5 pt-2.5 border-t border-border/70 flex items-center justify-between text-xs text-ink-muted shrink-0">
                        <span className="text-[10.5px] flex items-center gap-1.5 truncate">
                          <Sparkles className="size-3.5 text-emerald shrink-0" />
                          <span>{isRTL ? 'جميع القوالب تدعم الخط العربي واللاتيني' : 'Arabic & Latin typography ready'}</span>
                        </span>
                        <span className="text-[9.5px] font-extrabold text-emerald-deep px-2 py-0.5 rounded-md bg-emerald-surface border border-emerald-border/60 shrink-0 ms-2">
                          8 PRESETS
                        </span>
                      </div>

                    </div>
                  </div>

                </div>
              )
            })()}

            {/* Bottom 4-Feature Capability Highlights Strip */}
            <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-surface/90 border border-border/80 shadow-2xs">
                <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald border border-emerald-500/30 shrink-0">
                  <Zap className="size-4.5" />
                </div>
                <div className="flex flex-col text-start">
                  <span className="text-xs font-extrabold text-ink leading-tight">
                    {isRTL ? 'توليد فوري بجودة 4K' : 'Instant 4K Ultra Render'}
                  </span>
                  <span className="text-[10px] text-ink-muted">
                    {isRTL ? 'بدون انتظار أو معالجة بطيئة' : 'Rendered in milliseconds'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-surface/90 border border-border/80 shadow-2xs">
                <div className="flex size-9 items-center justify-center rounded-xl bg-teal-500/15 text-teal-600 dark:text-teal-400 border border-teal-500/30 shrink-0">
                  <Palette className="size-4.5" />
                </div>
                <div className="flex flex-col text-start">
                  <span className="text-xs font-extrabold text-ink leading-tight">
                    {isRTL ? 'تطابق ألوان هويتك' : 'Auto Palette Calibrated'}
                  </span>
                  <span className="text-[10px] text-ink-muted">
                    {isRTL ? 'تطبيق تلقائي لشعارك ورمزك' : 'Seamless merchant branding'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-surface/90 border border-border/80 shadow-2xs">
                <div className="flex size-9 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30 shrink-0">
                  <Smartphone className="size-4.5" />
                </div>
                <div className="flex flex-col text-start">
                  <span className="text-xs font-extrabold text-ink leading-tight">
                    {isRTL ? 'مقاسات إنستجرام وتيك توك' : '1:1 & 9:16 Social Ready'}
                  </span>
                  <span className="text-[10px] text-ink-muted">
                    {isRTL ? 'جاهز للنشر كستوري أو بوست' : 'Perfect for Stories & Feeds'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-surface/90 border border-border/80 shadow-2xs">
                <div className="flex size-9 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 shrink-0">
                  <ShieldCheck className="size-4.5" />
                </div>
                <div className="flex flex-col text-start">
                  <span className="text-xs font-extrabold text-ink leading-tight">
                    {isRTL ? 'كلام العميل الصادق 100%' : '100% Verbatim & Verified'}
                  </span>
                  <span className="text-[10px] text-ink-muted">
                    {isRTL ? 'بدون أي تحريف أو تغيير' : 'Uncompromised authenticity'}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 4: HOW IT WORKS (Connected 4-Step Velocity Pipeline)            */}
        {/* ========================================================================= */}
        <section id="how-it-works" className="relative isolate py-20 md:py-28 overflow-hidden bg-background-subtle/50 border-t border-border/80 scroll-mt-16">
          {/* 1. Geometric Dot Grid Pattern */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#059669_1.2px,transparent_1.2px)] [background-size:28px_28px] opacity-25 dark:opacity-15 z-0" />

          {/* 2. Vibrant Multi-Color Floating Ambient Orbs */}
          <div className="pointer-events-none absolute top-1/4 start-1/2 -translate-x-1/2 size-[580px] rounded-full bg-gradient-to-tr from-emerald-400/35 via-teal-300/25 to-emerald-200/20 dark:from-emerald-500/20 dark:via-emerald-600/10 dark:to-transparent blur-[90px] animate-pulse-glow z-0" />
          <div className="pointer-events-none absolute -bottom-16 -start-16 size-[420px] rounded-full bg-gradient-to-tr from-indigo-400/30 via-cyan-300/20 to-transparent dark:from-indigo-600/18 blur-[90px] animate-orb-2 z-0" />
          <div className="pointer-events-none absolute -top-16 -end-16 size-[380px] rounded-full bg-gradient-to-tr from-amber-400/25 via-orange-300/20 to-transparent dark:from-amber-600/12 blur-[80px] animate-orb-3 z-0" />

          {/* 3. Center Concentric Radar Ripple Wave */}
          <div className="pointer-events-none absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 size-[650px] rounded-full border border-emerald-500/30 dark:border-emerald-500/20 z-0 animate-radar-wave" />

          {/* 4. Drifting Ambient Shimmer Particle Elements */}
          <div className="pointer-events-none absolute top-24 start-1/5 size-3 rounded-full bg-emerald-400/70 blur-[1px] animate-float-slow z-0" />
          <div className="pointer-events-none absolute bottom-24 end-1/4 size-3.5 rounded-full bg-teal-400/60 blur-[1px] animate-float-reverse z-0" />
          <div className="pointer-events-none absolute top-1/2 end-1/5 size-2.5 rounded-full bg-amber-400/70 blur-[1px] animate-twinkle-1 z-0" />

          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 md:px-8 relative z-10">
            {/* Section Header */}
            <div className="mb-14 flex flex-col items-center gap-3.5 text-center">
              <span className="inline-flex items-center gap-2 text-xs font-extrabold text-emerald bg-emerald-surface px-4 py-1.5 rounded-full border border-emerald-border shadow-xs">
                <Sparkles className="size-3.5" />
                <span>{isRTL ? 'خطوات الانطلاق السريع' : 'Instant Velocity Pipeline'}</span>
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-ink tracking-tight">
                {t('landing_how_title')}
              </h2>
              <p className="max-w-2xl text-sm sm:text-base text-ink-muted leading-relaxed">
                {t('landing_how_subtitle')}
              </p>
            </div>

            {/* Stepper Cards Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              
              {/* CARD 1: Instant QR & Vanity Link */}
              <div className="group relative flex flex-col justify-between rounded-3xl border border-emerald-200/80 dark:border-emerald-500/20 bg-white dark:bg-[#071914] p-5 sm:p-6 shadow-[0_10px_30px_-5px_rgba(16,185,129,0.1)] dark:shadow-none hover:border-emerald-400 hover:shadow-[0_20px_40px_-5px_rgba(16,185,129,0.2)] transition-all duration-300 hover:-translate-y-1.5 overflow-hidden">
                {/* Subtle Card Background Glow */}
                <div className="pointer-events-none absolute -top-12 -end-12 size-36 rounded-full bg-emerald-500/10 blur-2xl group-hover:bg-emerald-500/20 transition-all" />

                <div className="flex flex-col gap-4">
                  {/* Step Header Badge */}
                  <div className="flex items-center justify-between">
                    <span className="flex size-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-sm font-black text-white shadow-md shadow-emerald-500/25 group-hover:scale-105 transition-transform">
                      01
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-200 dark:border-emerald-500/30 px-2.5 py-1 rounded-xl shadow-2xs">
                      <Zap className="size-3 text-emerald-600 dark:text-emerald-400" />
                      <span>{isRTL ? 'إعداد في 10 ثوانٍ' : '10s Setup'}</span>
                    </span>
                  </div>

                  {/* Micro Visual Mockup: 3D QR & Vanity Link */}
                  <div className="relative h-44 rounded-2xl bg-gradient-to-b from-emerald-50/90 via-white to-slate-50 dark:from-emerald-950/40 dark:via-slate-950/60 dark:to-slate-950/80 border border-emerald-200/80 dark:border-emerald-500/25 p-3 flex flex-col items-center justify-between overflow-hidden shadow-inner">
                    {/* Glowing Scanning Line */}
                    <div className="absolute inset-x-4 top-1/2 -translate-y-4 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_10px_#10b981] animate-pulse pointer-events-none" />

                    {/* QR Code Container */}
                    <div className="relative size-20 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-500/40 p-2 shadow-sm flex items-center justify-center group-hover:scale-105 transition-transform">
                      {/* Stylized QR Matrix */}
                      <div className="grid grid-cols-3 gap-1 size-full opacity-90">
                        <div className="size-full rounded-xs bg-emerald-600 dark:bg-emerald-400" />
                        <div className="size-full rounded-xs bg-slate-900 dark:bg-white" />
                        <div className="size-full rounded-xs bg-emerald-600 dark:bg-emerald-400" />
                        <div className="size-full rounded-xs bg-slate-900 dark:bg-white" />
                        <div className="size-full rounded-xs bg-emerald-500 flex items-center justify-center">
                          <BrandIcon className="size-2.5 text-white" />
                        </div>
                        <div className="size-full rounded-xs bg-slate-900 dark:bg-white" />
                        <div className="size-full rounded-xs bg-emerald-600 dark:bg-emerald-400" />
                        <div className="size-full rounded-xs bg-slate-900 dark:bg-white" />
                        <div className="size-full rounded-xs bg-emerald-600 dark:bg-emerald-400" />
                      </div>
                    </div>

                    {/* Link Snippet Pill */}
                    <div className="w-full flex items-center justify-between gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 px-2.5 py-1.5 rounded-xl text-[11px] font-mono shadow-xs">
                      <span className="truncate text-slate-900 dark:text-slate-100 font-bold dir-ltr text-start">taqyeem.app/r/brand</span>
                      <span className="flex items-center gap-0.5 text-[10px] text-emerald-800 dark:text-emerald-300 font-extrabold bg-emerald-100 dark:bg-emerald-500/20 px-1.5 py-0.5 rounded-md border border-emerald-300 dark:border-emerald-500/30 shrink-0">
                        <Check className="size-2.5 text-emerald-600 dark:text-emerald-400" />
                        <span>{isRTL ? 'جاهز' : 'Ready'}</span>
                      </span>
                    </div>
                  </div>

                  {/* Title & Copy */}
                  <div className="flex flex-col gap-1.5">
                    <h3 className="text-base font-black text-slate-950 dark:text-white leading-snug group-hover:text-emerald-600 transition-colors">
                      {t('landing_step_1_title')}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                      {t('landing_step_1_desc')}
                    </p>
                  </div>
                </div>

                {/* Feature Checkpoints */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-border/60 flex flex-col gap-1.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>{isRTL ? 'رابط دائم ومخصص لعلامتك' : 'Permanent custom vanity URL'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>{isRTL ? 'تخصيص كامل للشعار والألوان' : 'Full brand logo & color theming'}</span>
                  </div>
                </div>
              </div>

              {/* CARD 2: Multi-Touchpoint Deployment */}
              <div className="group relative flex flex-col justify-between rounded-3xl border border-teal-200/80 dark:border-teal-500/20 bg-white dark:bg-[#071914] p-5 sm:p-6 shadow-[0_10px_30px_-5px_rgba(20,184,166,0.1)] dark:shadow-none hover:border-teal-400 hover:shadow-[0_20px_40px_-5px_rgba(20,184,166,0.2)] transition-all duration-300 hover:-translate-y-1.5 overflow-hidden">
                {/* Subtle Card Background Glow */}
                <div className="pointer-events-none absolute -top-12 -end-12 size-36 rounded-full bg-teal-500/10 blur-2xl group-hover:bg-teal-500/20 transition-all" />

                <div className="flex flex-col gap-4">
                  {/* Step Header Badge */}
                  <div className="flex items-center justify-between">
                    <span className="flex size-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-teal-600 to-cyan-500 text-sm font-black text-white shadow-md shadow-teal-500/25 group-hover:scale-105 transition-transform">
                      02
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-500/15 border border-teal-200 dark:border-teal-500/30 px-2.5 py-1 rounded-xl shadow-2xs">
                      <Scan className="size-3 text-teal-600 dark:text-teal-400" />
                      <span>{isRTL ? '4 نقاط تواجد' : '4 Touchpoints'}</span>
                    </span>
                  </div>

                  {/* Micro Visual Mockup: Placement Channels Grid */}
                  <div className="relative h-44 rounded-2xl bg-gradient-to-b from-teal-50/90 via-white to-slate-50 dark:from-teal-950/40 dark:via-slate-950/60 dark:to-slate-950/80 border border-teal-200/80 dark:border-teal-500/25 p-2.5 flex flex-col justify-between overflow-hidden shadow-inner">
                    <div className="grid grid-cols-2 gap-1.5">
                      <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-teal-100 dark:border-white/10 px-2 py-1.5 rounded-xl text-[11px] font-bold text-slate-800 dark:text-slate-100 shadow-2xs">
                        <Utensils className="size-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                        <span className="truncate">{isRTL ? 'طاولات الطعام' : 'Table Tents'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-teal-100 dark:border-white/10 px-2 py-1.5 rounded-xl text-[11px] font-bold text-slate-800 dark:text-slate-100 shadow-2xs">
                        <Package className="size-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
                        <span className="truncate">{isRTL ? 'داخل الطرود' : 'Packaging'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-teal-100 dark:border-white/10 px-2 py-1.5 rounded-xl text-[11px] font-bold text-slate-800 dark:text-slate-100 shadow-2xs">
                        <Receipt className="size-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                        <span className="truncate">{isRTL ? 'على الفاتورة' : 'Receipts'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-teal-100 dark:border-white/10 px-2 py-1.5 rounded-xl text-[11px] font-bold text-slate-800 dark:text-slate-100 shadow-2xs">
                        <CreditCard className="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span className="truncate">{isRTL ? 'عند الكاشير' : 'Checkout'}</span>
                      </div>
                    </div>

                    {/* Instant Tap Scan Bar */}
                    <div className="flex items-center justify-center gap-1.5 bg-teal-100/90 dark:bg-teal-500/20 border border-teal-300 dark:border-teal-500/30 text-teal-900 dark:text-teal-200 px-2.5 py-1.5 rounded-xl text-[10px] font-extrabold shadow-2xs">
                      <Smartphone className="size-3 shrink-0 text-teal-600 dark:text-teal-400" />
                      <span>{isRTL ? 'مسح فوري بكاميرا الهاتف بدون تطبيقات' : 'Native Camera Scan · Zero Friction'}</span>
                    </div>
                  </div>

                  {/* Title & Copy */}
                  <div className="flex flex-col gap-1.5">
                    <h3 className="text-base font-black text-slate-950 dark:text-white leading-snug group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                      {t('landing_step_2_title')}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                      {t('landing_step_2_desc')}
                    </p>
                  </div>
                </div>

                {/* Feature Checkpoints */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-border/60 flex flex-col gap-1.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="size-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                    <span>{isRTL ? 'سهل الوصول في لحظة رضا العميل' : 'Captures praise at peak delight'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="size-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                    <span>{isRTL ? 'جاهز للطباعة بدقة المتجهات الفائقة' : 'Print-ready high-res vector output'}</span>
                  </div>
                </div>
              </div>

              {/* CARD 3: 5-Second Frictionless Review */}
              <div className="group relative flex flex-col justify-between rounded-3xl border border-indigo-200/80 dark:border-indigo-500/20 bg-white dark:bg-[#071914] p-5 sm:p-6 shadow-[0_10px_30px_-5px_rgba(99,102,241,0.1)] dark:shadow-none hover:border-indigo-400 hover:shadow-[0_20px_40px_-5px_rgba(99,102,241,0.2)] transition-all duration-300 hover:-translate-y-1.5 overflow-hidden">
                {/* Subtle Card Background Glow */}
                <div className="pointer-events-none absolute -top-12 -end-12 size-36 rounded-full bg-indigo-500/10 blur-2xl group-hover:bg-indigo-500/20 transition-all" />

                <div className="flex flex-col gap-4">
                  {/* Step Header Badge */}
                  <div className="flex items-center justify-between">
                    <span className="flex size-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-500 text-sm font-black text-white shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform">
                      03
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-indigo-800 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-500/15 border border-indigo-200 dark:border-indigo-500/30 px-2.5 py-1 rounded-xl shadow-2xs">
                      <MessageSquareText className="size-3 text-indigo-600 dark:text-indigo-400" />
                      <span>{isRTL ? '5 ثوانٍ فقط' : '5-Sec Flow'}</span>
                    </span>
                  </div>

                  {/* Micro Visual Mockup: Review Submission Flow */}
                  <div className="relative h-44 rounded-2xl bg-gradient-to-b from-indigo-50/90 via-white to-slate-50 dark:from-indigo-950/40 dark:via-slate-950/60 dark:to-slate-950/80 border border-indigo-200/80 dark:border-indigo-500/25 p-2.5 flex flex-col justify-between overflow-hidden shadow-inner">
                    {/* Star Rating Strip */}
                    <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-indigo-100 dark:border-white/10 px-2.5 py-1 rounded-xl shadow-2xs">
                      <div className="flex items-center gap-0.5 text-amber-500">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className="size-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="text-[10px] font-extrabold text-amber-900 dark:text-amber-300 bg-amber-100 dark:bg-amber-500/20 px-1.5 py-0.5 rounded-md border border-amber-300 dark:border-amber-500/30">5.0</span>
                    </div>

                    {/* Customer Speech Bubble */}
                    <div className="bg-white dark:bg-slate-900 border border-indigo-100 dark:border-white/10 p-2 rounded-xl text-[11px] font-medium text-slate-800 dark:text-slate-100 shadow-2xs">
                      <p className="line-clamp-2 leading-relaxed text-slate-800 dark:text-slate-200 italic font-semibold">
                        &ldquo;{isRTL ? 'تجربة ممتازة وتغليف فاخر، هطلب تاني أكيد! 👏' : 'Exceptional quality and pristine packaging! 👏'}&rdquo;
                      </p>
                    </div>

                    {/* Submit Button Mockup */}
                    <div className="w-full flex items-center justify-center gap-1 bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 text-white font-black py-1.5 rounded-xl text-[10px] shadow-sm">
                      <Send className="size-2.5" />
                      <span>{isRTL ? 'إرسال التقييم بنقرة واحدة' : 'Submit Review in 1-Tap'}</span>
                    </div>
                  </div>

                  {/* Title & Copy */}
                  <div className="flex flex-col gap-1.5">
                    <h3 className="text-base font-black text-slate-950 dark:text-white leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {t('landing_step_3_title')}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                      {t('landing_step_3_desc')}
                    </p>
                  </div>
                </div>

                {/* Feature Checkpoints */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-border/60 flex flex-col gap-1.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="size-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    <span>{isRTL ? 'بدون تسجيل دخول أو إنشاء حساب' : 'Zero logins or complex account forms'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="size-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    <span>{isRTL ? 'معدل إكمال تقييمات يصل إلى 87%' : 'Up to 87% review completion rate'}</span>
                  </div>
                </div>
              </div>

              {/* CARD 4: Auto-Converted Social Proof Creative */}
              <div className="group relative flex flex-col justify-between rounded-3xl border border-amber-200/80 dark:border-amber-500/20 bg-white dark:bg-[#071914] p-5 sm:p-6 shadow-[0_10px_30px_-5px_rgba(245,158,11,0.1)] dark:shadow-none hover:border-amber-400 hover:shadow-[0_20px_40px_-5px_rgba(245,158,11,0.2)] transition-all duration-300 hover:-translate-y-1.5 overflow-hidden">
                {/* Subtle Card Background Glow */}
                <div className="pointer-events-none absolute -top-12 -end-12 size-36 rounded-full bg-amber-500/10 blur-2xl group-hover:bg-amber-500/20 transition-all" />

                <div className="flex flex-col gap-4">
                  {/* Step Header Badge */}
                  <div className="flex items-center justify-between">
                    <span className="flex size-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-emerald-500 text-sm font-black text-white shadow-md shadow-amber-500/25 group-hover:scale-105 transition-transform">
                      04
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-500/15 border border-amber-200 dark:border-amber-500/30 px-2.5 py-1 rounded-xl shadow-2xs">
                      <Sparkles className="size-3 text-amber-600 dark:text-amber-400" />
                      <span>{isRTL ? 'جاهز للنشر' : 'Share Ready'}</span>
                    </span>
                  </div>

                  {/* Micro Visual Mockup: Branded Story Creative & Multi-Export */}
                  <div className="relative h-44 rounded-2xl bg-gradient-to-b from-amber-50/90 via-white to-slate-50 dark:from-amber-950/40 dark:via-slate-950/60 dark:to-slate-950/80 border border-amber-200/80 dark:border-amber-500/25 p-2.5 flex flex-col justify-between overflow-hidden shadow-inner">
                    {/* Verified Certificate Strip */}
                    <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-500/30 px-2 py-1 rounded-xl shadow-2xs">
                      <div className="flex items-center gap-1 text-[10px] font-extrabold text-emerald-800 dark:text-emerald-300">
                        <ShieldCheck className="size-3 text-emerald-600 dark:text-emerald-400" />
                        <span>{isRTL ? 'تقييم موثق 100%' : '100% Verified Review'}</span>
                      </div>
                      <div className="flex items-center gap-0.5 text-amber-500">
                        <Star className="size-2.5 fill-amber-400 text-amber-400" />
                        <span className="text-[10px] font-bold text-slate-800 dark:text-slate-100">5.0</span>
                      </div>
                    </div>

                    {/* Mini Testimonial Glass Preview */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 px-2.5 py-1.5 rounded-xl shadow-2xs">
                      <p className="text-[10px] font-extrabold text-slate-900 dark:text-white truncate">
                        {isRTL ? 'سارة عبد الله · عميل موثق ⭐️' : 'Sarah A. · Verified Shopper ⭐️'}
                      </p>
                      <p className="text-[9px] text-slate-600 dark:text-slate-300 truncate font-medium">
                        {isRTL ? 'أفضل متجر تعاملت معه في مصر!' : 'Best shopping experience ever!'}
                      </p>
                    </div>

                    {/* 1-Click Multi-Channel Share Strip */}
                    <div className="grid grid-cols-3 gap-1">
                      <div className="flex items-center justify-center gap-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 py-1 rounded-lg text-[9px] font-bold text-slate-700 dark:text-slate-200 hover:text-emerald-600">
                        <Share2 className="size-2.5 text-rose-500" />
                        <span>{isRTL ? 'ستوري' : 'Story'}</span>
                      </div>
                      <div className="flex items-center justify-center gap-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 py-1 rounded-lg text-[9px] font-bold text-slate-700 dark:text-slate-200 hover:text-emerald-600">
                        <MessageCircle className="size-2.5 text-emerald-600 dark:text-emerald-400" />
                        <span>{isRTL ? 'واتساب' : 'WhatsApp'}</span>
                      </div>
                      <div className="flex items-center justify-center gap-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 py-1 rounded-lg text-[9px] font-bold text-slate-700 dark:text-slate-200 hover:text-emerald-600">
                        <Globe className="size-2.5 text-indigo-600 dark:text-indigo-400" />
                        <span>{isRTL ? 'المتجر' : 'Bio-Link'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Title & Copy */}
                  <div className="flex flex-col gap-1.5">
                    <h3 className="text-base font-black text-slate-950 dark:text-white leading-snug group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      {t('landing_step_4_title')}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                      {t('landing_step_4_desc')}
                    </p>
                  </div>
                </div>

                {/* Feature Checkpoints */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-border/60 flex flex-col gap-1.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="size-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                    <span>{isRTL ? 'أصل تسويقي فوري جاهز لمواقع التواصل' : 'Ready-to-post high-impact visual creative'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="size-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                    <span>{isRTL ? 'حفظ دائم في صفحة متجرك العامة' : 'Auto-synced to public Wall of Love'}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Pipeline Trust Banner */}
            <div className="mt-12 rounded-3xl border border-slate-200/90 dark:border-emerald-500/30 bg-white dark:bg-[#071914] p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-[0_10px_30px_-10px_rgba(15,23,42,0.08)] dark:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] relative overflow-hidden">
              {/* Subtle Ambient Accent Glow */}
              <div className="pointer-events-none absolute -top-10 -start-10 size-40 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 blur-2xl" />
              <div className="pointer-events-none absolute -bottom-10 -end-10 size-40 rounded-full bg-teal-500/10 dark:bg-teal-500/20 blur-2xl" />

              <div className="flex items-center gap-4 text-center sm:text-start relative z-10">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-500/30 shrink-0">
                  <TrendingUp className="size-6" />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-sm sm:text-base font-black text-slate-950 dark:text-white tracking-tight leading-snug">
                    {isRTL
                      ? 'من مسح الباركود إلى زيادة المبيعات ومعدل إتمام الطلبات في أقل من دقيقة!'
                      : 'From instant scan to higher checkout conversions in under 60 seconds.'}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                    {isRTL
                      ? 'أداة الإثبات الاجتماعي الأولى المصممة خصيصاً للمتاجر والمطاعم والبراندات'
                      : 'The dedicated social proof engine designed for modern retail, dining, and D2C brands.'}
                  </p>
                </div>
              </div>

              <Button
                asChild
                variant="primaryGlow"
                size="default"
                className="font-black shrink-0 shadow-lg shadow-emerald-500/25 px-5 py-2.5 text-xs sm:text-sm relative z-10 cursor-pointer hover:scale-105 transition-all"
              >
                <Link to="/preview/testimonial" className="flex items-center gap-2">
                  <span>{isRTL ? 'جرّب المحاكي المباشر' : 'Try Live Simulator'}</span>
                  {isRTL ? <ArrowLeft className="size-4" /> : <ArrowRight className="size-4" />}
                </Link>
              </Button>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 4: LIVE BIO-LINK & SOCIAL PROOF ENGINE                           */}
        {/* ========================================================================= */}
        <section className="relative isolate border-t border-border/80 bg-background-subtle/70 py-20 md:py-28 overflow-hidden">
          {/* 1. Animated Geometric Dot Grid Pattern */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#059669_1.2px,transparent_1.2px)] [background-size:28px_28px] opacity-25 dark:opacity-15 z-0" />

          {/* 2. Vibrant Multi-Color Floating Ambient Orbs (High Visibility in Light & Dark Themes) */}
          <div className="pointer-events-none absolute top-10 end-10 size-[450px] rounded-full bg-gradient-to-tr from-emerald-400/40 via-teal-300/30 to-emerald-200/20 dark:from-emerald-500/20 dark:via-emerald-600/10 dark:to-transparent blur-[80px] animate-orb-1 z-0" />
          <div className="pointer-events-none absolute bottom-10 start-10 size-[420px] rounded-full bg-gradient-to-tr from-indigo-400/35 via-cyan-300/25 to-sky-200/20 dark:from-indigo-600/20 dark:via-blue-600/10 dark:to-transparent blur-[90px] animate-orb-2 z-0" />
          <div className="pointer-events-none absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 size-80 rounded-full bg-gradient-to-tr from-teal-400/30 via-emerald-300/25 to-transparent dark:from-teal-600/15 blur-[70px] animate-pulse-glow z-0" />

          {/* 3. Concentric Animated Radar Wave Rings */}
          <div className="pointer-events-none absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 size-[680px] rounded-full border border-emerald-500/30 dark:border-emerald-500/20 z-0 animate-radar-wave" />

          {/* 4. Drifting Ambient Shimmer Particles */}
          <div className="pointer-events-none absolute top-20 end-1/4 size-3.5 rounded-full bg-emerald-400/70 blur-[1px] animate-float-slow z-0" />
          <div className="pointer-events-none absolute bottom-20 start-1/4 size-3 rounded-full bg-teal-400/60 blur-[1px] animate-float-reverse z-0" />
          <div className="pointer-events-none absolute top-1/3 start-1/5 size-2.5 rounded-full bg-amber-400/70 blur-[1px] animate-twinkle-1 z-0" />

          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 md:px-8 relative z-10">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
              
              {/* Left Column: High-Impact Copy & Value Pillars */}
              <div className="flex flex-col gap-6 lg:col-span-6 text-center lg:text-start items-center lg:items-start">
                <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald bg-emerald-surface px-3.5 py-1.5 rounded-full border border-emerald-border shadow-xs">
                  <Sparkles className="size-3.5" />
                  <span>{isRTL ? 'منظومة الإثبات الاجتماعي الحية' : 'Live Social Proof Engine'}</span>
                </span>

                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-ink tracking-tight leading-tight">
                  {isRTL
                    ? 'حوّل آراء عملائك الحقيقية إلى أقوى أداة لزيادة مبيعاتك'
                    : 'Turn Customer Love into Your Highest-Converting Sales Asset'}
                </h2>

                <p className="max-w-xl text-sm sm:text-base text-ink-muted leading-relaxed">
                  {isRTL
                    ? 'رابط موحد لصفحتك العامة تضعه في بايو إنستجرام وتيك توك وترسله في محادثات واتساب لتحويل أي عميل متردد إلى مشتري فوري ومطمئن.'
                    : 'A single high-converting public bio link for Instagram, TikTok, and WhatsApp chats that turns hesitant shoppers into confident buyers in seconds.'}
                </p>

                {/* 3 Value Pillars */}
                <div className="flex flex-col gap-3.5 w-full max-w-lg my-1">
                  <div className="flex items-start gap-3 text-start p-3 rounded-2xl bg-surface/60 border border-border/80 shadow-2xs hover:border-emerald-border/60 transition-colors">
                    <div className="flex size-8 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald shrink-0 mt-0.5 border border-emerald-500/30">
                      <Share2 className="size-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs sm:text-sm font-bold text-ink">
                        {isRTL ? 'مشاركة فورية في المحادثات والبايو' : '1-Click WhatsApp & Bio Sharing'}
                      </span>
                      <span className="text-xs text-ink-muted">
                        {isRTL
                          ? 'أرسل الرابط لأي عميل يسأل عن جودة الخدمة ليبدد أي تردد فوراً.'
                          : 'Send directly to inquiring shoppers in chats to eliminate any purchase hesitation.'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-start p-3 rounded-2xl bg-surface/60 border border-border/80 shadow-2xs hover:border-emerald-border/60 transition-colors">
                    <div className="flex size-8 items-center justify-center rounded-xl bg-teal-500/15 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5 border border-teal-500/30">
                      <Zap className="size-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs sm:text-sm font-bold text-ink">
                        {isRTL ? 'تحديث فوري بدون أي مجهود' : 'Auto-Updating Real-Time Feed'}
                      </span>
                      <span className="text-xs text-ink-muted">
                        {isRTL
                          ? 'كل تقييم جديد يضاف لصفحتك لحظياً وبشكل منظم بدون الحاجة لتعديل يدوي.'
                          : 'Every new 5-star review appears in real time without coding or manual upkeep.'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-start p-3 rounded-2xl bg-surface/60 border border-border/80 shadow-2xs hover:border-emerald-border/60 transition-colors">
                    <div className="flex size-8 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5 border border-amber-500/30">
                      <CheckCircle2 className="size-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs sm:text-sm font-bold text-ink">
                        {isRTL ? 'مصداقية 100% بدون تزييف' : '100% Genuine Buyer Proof'}
                      </span>
                      <span className="text-xs text-ink-muted">
                        {isRTL
                          ? 'تنسيق بصري فاخر يبرز كلام العميل الصادق ويبني ثقة لا تتزعزع.'
                          : 'Luxury presentation that preserves honest customer words to inspire deep trust.'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* CTAs */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                  <Button asChild size="lg" variant="primaryGlow" className="shadow-md font-bold">
                    <Link to="/preview/testimonial" className="flex items-center gap-2">
                      <span>{t('action_open_preview')}</span>
                      <ExternalLink className="size-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="secondary" size="lg" className="font-bold">
                    <Link to="/signup">
                      <span>{t('action_start_free')}</span>
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Right Column: High-Fidelity Interactive Bio-Link Showcase Viewport */}
              <div className="lg:col-span-6 relative">
                {/* Radiant Backdrop Glow */}
                <div className="pointer-events-none absolute -top-10 -end-10 size-64 rounded-full bg-emerald-500/20 blur-3xl -z-10" />

                <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-[#091f1a] via-[#051411] to-[#020b08] p-4 sm:p-6 shadow-2xl relative overflow-hidden">
                  
                  {/* Smartphone / Browser Chrome Bar */}
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-emerald-500/20">
                    <div className="flex items-center gap-1.5">
                      <span className="size-2.5 rounded-full bg-rose-500/80" />
                      <span className="size-2.5 rounded-full bg-amber-500/80" />
                      <span className="size-2.5 rounded-full bg-emerald-500/80" />
                    </div>

                    <div className="flex items-center gap-1.5 rounded-full bg-black/40 border border-emerald-500/25 px-3 py-1 text-[11px] font-mono text-slate-200">
                      <Lock className="size-3 text-emerald-400" />
                      <span className="text-emerald-400 font-bold">taqyeem.app</span>
                      <span className="text-slate-400">/w/artisan-studio</span>
                    </div>

                    <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-md border border-emerald-500/30">
                      <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>{isRTL ? 'مباشر' : 'Live'}</span>
                    </div>
                  </div>

                  {/* Brand Profile Strip */}
                  <div className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 mb-4 text-start">
                    <div className="flex items-center gap-3">
                      <div className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-black text-lg shadow-md">
                        T
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-extrabold text-white">
                            {isRTL ? 'بوتيك الأناقة العصري' : 'Artisan Luxury Studio'}
                          </span>
                          <span className="size-3.5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center text-[9px] font-black">
                            ✓
                          </span>
                        </div>
                        <span className="text-[11px] text-emerald-300 font-semibold">
                          {isRTL ? 'صفحة التقييمات الرسمية المعتمدة' : 'Official Verified Review Wall'}
                        </span>
                      </div>
                    </div>

                    <div className="hidden sm:flex flex-col items-end">
                      <div className="flex text-amber-400 text-xs">★★★★★</div>
                      <span className="text-[10px] font-bold text-slate-300">
                        {isRTL ? '5.0 · 142 تقييم' : '5.0 · 142 Reviews'}
                      </span>
                    </div>
                  </div>

                  {/* Testimonial Cards Stream */}
                  <div className="flex flex-col gap-3">
                    
                    {/* Review Card 1 */}
                    <div className="rounded-2xl border border-emerald-500/25 bg-gradient-to-r from-white/8 via-white/5 to-transparent p-3.5 shadow-sm text-start hover:border-emerald-500/40 transition-colors">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="flex size-6 items-center justify-center rounded-lg bg-emerald-600 text-white text-[10px] font-black">
                            {isRTL ? 'س' : 'S'}
                          </span>
                          <span className="text-xs font-bold text-white">
                            {isRTL ? 'سارة عبد الله' : 'Sarah Jenkins'}
                          </span>
                          <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/15 px-1.5 py-0.5 rounded border border-emerald-500/25">
                            ✓ {isRTL ? 'مشتري موثق' : 'Verified Buyer'}
                          </span>
                        </div>
                        <div className="flex text-amber-400 text-xs">★★★★★</div>
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed font-medium">
                        {isRTL
                          ? '«استلمت طلبي في الوقت المحدد بالضبط والأكل كان طازج وسخن. التغليف فاخر والتعامل قمة في الرقي!»'
                          : '“Received my order right on time and packaging was immaculate. Top quality and prompt customer care!”'}
                      </p>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5 text-[10px] text-slate-400">
                        <span>{isRTL ? '📦 طلب تم تسليمه بنجاح' : '📦 Order delivered successfully'}</span>
                        <span>{isRTL ? 'منذ ساعتين' : '2h ago'}</span>
                      </div>
                    </div>

                    {/* Review Card 2 */}
                    <div className="rounded-2xl border border-indigo-500/25 bg-gradient-to-r from-white/8 via-white/5 to-transparent p-3.5 shadow-sm text-start hover:border-indigo-500/40 transition-colors">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="flex size-6 items-center justify-center rounded-lg bg-indigo-600 text-white text-[10px] font-black">
                            {isRTL ? 'م' : 'M'}
                          </span>
                          <span className="text-xs font-bold text-white">
                            {isRTL ? 'محمد إبراهيم' : 'Marcus Vance'}
                          </span>
                          <span className="text-[9px] font-bold text-indigo-400 bg-indigo-500/15 px-1.5 py-0.5 rounded border border-indigo-500/25">
                            ✓ {isRTL ? 'عميل دائم VIP' : 'VIP Repeat Buyer'}
                          </span>
                        </div>
                        <div className="flex text-amber-400 text-xs">★★★★★</div>
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed font-medium">
                        {isRTL
                          ? '«أفضل متجر تعاملت معه، رد سريع على الاستفسارات والخامة ممتازة وتستحق كل قرش.»'
                          : '“Best merchant experience this year. Fast response and the product quality exceeded all expectations!”'}
                      </p>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5 text-[10px] text-slate-400">
                        <span>{isRTL ? '💎 مجموعة فاخرة' : '💎 Luxury Collection'}</span>
                        <span>{isRTL ? 'منذ 4 ساعات' : '4h ago'}</span>
                      </div>
                    </div>

                  </div>

                  {/* Floating Shopper Trust Banner */}
                  <div className="mt-3.5 flex items-center justify-between rounded-xl bg-emerald-500/15 border border-emerald-500/30 px-3 py-2 text-xs font-bold text-emerald-300">
                    <div className="flex items-center gap-2">
                      <span className="size-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
                      <span>{isRTL ? '24 متسوق يتصفحون الصفحة الآن' : '24 active shoppers on this wall'}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-emerald-400">
                      <TrendingUp className="size-3.5" />
                      <span>{isRTL ? '+48% زيادة إتمام الشراء' : '+48% Checkout Surge'}</span>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 5: HIGH-CONVERSION CTA (Luxury Emerald Noir Spotlight Card)      */}
        {/* ========================================================================= */}
        <section className="relative isolate overflow-hidden py-20 md:py-28 border-t border-border/80 bg-background-subtle/50">
          {/* 1. Geometric Dot Grid Pattern */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#059669_1.2px,transparent_1.2px)] [background-size:28px_28px] opacity-25 dark:opacity-15 z-0" />

          {/* 2. Vibrant Multi-Color Floating Ambient Orbs */}
          <div className="pointer-events-none absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 size-[650px] rounded-full bg-gradient-to-tr from-emerald-400/35 via-teal-300/25 to-emerald-200/20 dark:from-emerald-500/20 dark:via-emerald-600/10 dark:to-transparent blur-[110px] animate-pulse-glow z-0" />
          <div className="pointer-events-none absolute -top-16 -start-16 size-[400px] rounded-full bg-gradient-to-tr from-indigo-400/30 via-cyan-300/20 to-transparent dark:from-indigo-600/18 blur-[90px] animate-orb-1 z-0" />
          <div className="pointer-events-none absolute -bottom-16 -end-16 size-[420px] rounded-full bg-gradient-to-tr from-amber-400/25 via-orange-300/20 to-transparent dark:from-amber-600/12 blur-[90px] animate-orb-2 z-0" />

          {/* 3. Expanding Radar Ripple Wave */}
          <div className="pointer-events-none absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 size-[720px] rounded-full border border-emerald-500/30 dark:border-emerald-500/20 z-0 animate-radar-wave" />

          {/* 4. Drifting Shimmer Particles */}
          <div className="pointer-events-none absolute top-16 start-1/4 size-3 rounded-full bg-emerald-400/70 blur-[1px] animate-float-slow z-0" />
          <div className="pointer-events-none absolute bottom-16 end-1/4 size-3.5 rounded-full bg-teal-400/60 blur-[1px] animate-float-reverse z-0" />

          <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 relative z-10">
            {/* Distinct Container with Animated Glowing Border */}
            <div className="relative rounded-3xl border border-emerald-500/30 dark:border-emerald-border/60 bg-gradient-to-b from-surface via-surface/95 to-emerald-500/10 dark:to-emerald-surface/30 p-8 sm:p-14 shadow-2xl backdrop-blur-2xl text-center overflow-hidden animate-border-glow">
              
              {/* Internal Radiant Spotlight */}
              <div className="pointer-events-none absolute -top-24 start-1/2 -translate-x-1/2 size-96 rounded-full bg-emerald-500/30 blur-[90px] z-0" />

              <div className="relative z-10 flex flex-col items-center gap-6">
                <div className="inline-flex size-14 items-center justify-center rounded-3xl bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white shadow-lg animate-float-gentle">
                  <Sparkles className="size-7" />
                </div>

                <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-ink tracking-tight">
                  {t('landing_cta_ready_title')}
                </h2>

                <p className="max-w-xl text-base text-ink-muted leading-relaxed">
                  {t('landing_cta_ready_desc')}
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-3.5 pt-2 w-full sm:w-auto">
                  <Button asChild size="xl" variant="primaryGlow" className="w-full sm:w-auto shadow-xl font-bold">
                    <Link to="/signup" className="flex items-center justify-center gap-2">
                      <span>{t('landing_hero_cta_primary')}</span>
                      <ArrowIcon className="size-4.5" />
                    </Link>
                  </Button>
                  <Button asChild variant="secondary" size="xl" className="w-full sm:w-auto font-bold">
                    <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">
                      {t('action_contact_wa')}
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ========================================================================= */}
      {/* SECTION 6: LUXURY MODERN SAAS FOOTER                                     */}
      {/* ========================================================================= */}
      <footer className="relative isolate border-t border-border/80 bg-surface/90 backdrop-blur-xl pt-14 pb-28 sm:pb-12 text-ink overflow-hidden">
        {/* Subtle Ambient Background Light */}
        <div className="pointer-events-none absolute -bottom-20 start-1/2 -translate-x-1/2 size-96 rounded-full bg-gradient-to-tr from-emerald-400/25 via-teal-300/20 to-transparent dark:from-emerald-500/15 blur-[100px] z-0" />

        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 md:px-8">
          {/* Main Footer Grid */}
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12 pb-12 border-b border-border/70">
            
            {/* Col 1: Brand & Mission (Span 6) */}
            <div className="lg:col-span-6 flex flex-col gap-4 text-start">
              <BrandLogo href="/" size="md" />
              
              <p className="max-w-md text-sm text-ink-muted leading-relaxed">
                {isRTL
                  ? 'المنصة الذكية المتكاملة لجمع وتصميم آراء وتقييمات العملاء وتحويلها لأصول تسويقية تضاعف المبيعات وثقة المشترين.'
                  : 'The intelligent platform to collect, style, and publish authentic customer reviews into high-converting social proof.'}
              </p>

              {/* Status & Security Badge */}
              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <div className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{isRTL ? 'المنظومة تعمل بكفاءة 100%' : 'All Systems Operational'}</span>
                </div>
                <div className="inline-flex items-center gap-1 rounded-xl bg-background-subtle border border-border px-2.5 py-1 text-xs font-semibold text-ink-subtle">
                  <Lock className="size-3 text-emerald" />
                  <span>{isRTL ? 'تقييمات مشفرة وموثقة' : '100% Verbatim Verified'}</span>
                </div>
              </div>
            </div>

            {/* Col 2: Quick Links & Pages (Span 3) */}
            <div className="lg:col-span-3 flex flex-col gap-3 text-start">
              <span className="text-xs font-extrabold text-ink tracking-wider">
                {isRTL ? 'روابط سريعة' : 'Quick Links'}
              </span>
              <ul className="flex flex-col gap-2.5 text-xs sm:text-sm text-ink-muted">
                <li>
                  <Link to="/preview/testimonial" className="hover:text-emerald transition-colors">
                    {isRTL ? 'صفحة Wall of Love العامة' : 'Dedicated Wall of Love'}
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="hover:text-emerald transition-colors">
                    {isRTL ? 'تسجيل دخول التجار' : 'Merchant Login'}
                  </Link>
                </li>
                <li>
                  <Link to="/signup" className="hover:text-emerald transition-colors">
                    {isRTL ? 'إنشاء حساب جديد' : 'Create Free Account'}
                  </Link>
                </li>
                <li>
                  <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="hover:text-emerald transition-colors flex items-center gap-1">
                    <span>{isRTL ? 'الدعم الفني المباشر' : 'WhatsApp Support'}</span>
                    <ExternalLink className="size-3" />
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 3: Community & Social (Span 3) */}
            <div className="lg:col-span-3 flex flex-col gap-3 text-start">
              <span className="text-xs font-extrabold text-ink tracking-wider">
                {isRTL ? 'تواصل معنا' : 'Connect'}
              </span>
              <p className="text-xs text-ink-muted">
                {isRTL ? 'تابع آخر التحديثات وتواصل مع فريقنا مباشرة.' : 'Stay updated and reach out anytime.'}
              </p>

              {/* Social Channels */}
              <div className="flex items-center gap-2 pt-1">
                {/* WhatsApp */}
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="flex size-9 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all shadow-xs hover:scale-110"
                  title="WhatsApp"
                  aria-label="WhatsApp"
                >
                  <svg className="size-4 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                </a>

                {/* Instagram */}
                <a
                  href="https://www.instagram.com/taqyeem.site?stkn=MXRkazMwb3N3c2h1Ng=="
                  target="_blank"
                  rel="noreferrer"
                  className="flex size-9 items-center justify-center rounded-xl border border-pink-500/30 bg-pink-500/10 text-pink-500 hover:bg-pink-500 hover:text-white transition-all shadow-xs hover:scale-110"
                  title="Instagram"
                  aria-label="Instagram"
                >
                  <svg className="size-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>

                {/* Facebook */}
                <a
                  href="https://www.facebook.com/share/18Vb2gQpWY/"
                  target="_blank"
                  rel="noreferrer"
                  className="flex size-9 items-center justify-center rounded-xl border border-blue-500/30 bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition-all shadow-xs hover:scale-110"
                  title="Facebook"
                  aria-label="Facebook"
                >
                  <svg className="size-4 fill-current" viewBox="0 0 24 24">
                    <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.592 0 9 1.582 9 4.615V8z" />
                  </svg>
                </a>
              </div>
            </div>

          </div>

          {/* Bottom Copyright Sub-bar */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ink-muted">
            <div className="flex items-center gap-2">
              <BrandIcon size="xs" />
              <span>
                {isRTL
                  ? '© 2026 منصة تقييم. جميع الحقوق محفوظة.'
                  : '© 2026 Taqyeem Platform. All rights reserved.'}
              </span>
            </div>

            <div className="flex items-center gap-4 text-[11px] text-ink-subtle">
              <span>{isRTL ? 'صُنع بكل ثقة لخدمة التجار والشركات الناشئة' : 'Built for ambitious e-commerce merchants'}</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Fixed Mobile Bottom Action Dock / Tabs */}
      <nav className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-between gap-2 border-t border-border bg-surface/95 backdrop-blur-xl px-4 py-2.5 pb-[max(0.6rem,env(safe-area-inset-bottom))] shadow-[0_-4px_20px_rgba(0,0,0,0.1)] sm:hidden">
        <Link
          to="/login"
          className="flex flex-1 flex-col items-center justify-center gap-1 rounded-xl py-1 text-[11px] font-bold text-ink-muted hover:text-emerald transition-colors active:scale-95"
        >
          <LogIn className="size-4" />
          <span>{t('action_login')}</span>
        </Link>

        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noreferrer"
          className="flex flex-1 flex-col items-center justify-center gap-1 rounded-xl py-1 text-[11px] font-bold text-emerald hover:text-emerald-deep transition-colors active:scale-95"
        >
          <svg className="size-4 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
          </svg>
          <span>{isRTL ? 'واتساب' : 'WhatsApp'}</span>
        </a>

        <Button asChild size="sm" variant="primaryGlow" className="flex-1 font-bold shadow-md h-9 text-xs">
          <Link to="/signup" className="flex items-center justify-center gap-1">
            <span>{t('action_start_free')}</span>
            <ArrowIcon className="size-3.5" />
          </Link>
        </Button>
      </nav>
    </div>
  )
}

export default LandingPage
