import * as React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  LayoutDashboard,
  Lock,
  ExternalLink,
} from 'lucide-react'

import { BrandIcon, BrandLogo } from '@/components/ui/brand-logo'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { LanguageToggle } from '@/components/ui/language-toggle'
import { Button } from '@/components/ui/button'
import { AnimatedBackground } from '@/components/ui/animated-background'
import { useLanguage } from '@/lib/language-context'
import { useAuth } from '@/lib/auth-context'
import { cn } from '@/lib/utils'

const WHATSAPP_URL = 'https://wa.me/201125800098'

export interface AppShellProps extends React.ComponentProps<'div'> {
  showHeader?: boolean
  showFooter?: boolean
  showBreadcrumb?: boolean
  backUrl?: string
  backLabel?: string
  pageTitle?: string
  showLanguageToggle?: boolean
  showThemeToggle?: boolean
  showBackground?: boolean
}

export function AppShell({
  className,
  children,
  showHeader = true,
  showFooter = true,
  showBreadcrumb = true,
  backUrl,
  backLabel,
  pageTitle,
  showLanguageToggle = true,
  showThemeToggle = true,
  showBackground = true,
  ...props
}: AppShellProps) {
  const { isRTL, t } = useLanguage()
  const auth = useAuth()
  const navigate = useNavigate()

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight

  const handleBack = () => {
    if (backUrl) {
      navigate(backUrl)
    } else if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate('/')
    }
  }

  return (
    <div className="min-h-dvh flex flex-col bg-background text-ink selection:bg-emerald/20 selection:text-emerald-deep relative overflow-x-hidden">
      {/* Full Luxury Animated Background */}
      {showBackground && (
        <>
          <AnimatedBackground
            variant="hero"
            showSpotlight
            showGrid
            showDots
            showParticles
            showBeam
          />

          {/* Floating Ambient Glow Orbs */}
          <div className="pointer-events-none fixed top-1/4 start-1/2 -translate-x-1/2 size-[650px] rounded-full bg-gradient-to-tr from-emerald-400/25 via-teal-300/18 to-transparent dark:from-emerald-500/18 dark:via-emerald-600/10 dark:to-transparent blur-[120px] animate-pulse-glow z-0" />
          <div className="pointer-events-none fixed -bottom-24 -start-24 size-[480px] rounded-full bg-gradient-to-tr from-indigo-400/20 via-cyan-300/15 to-transparent dark:from-indigo-600/15 blur-[100px] animate-orb-2 z-0" />
          <div className="pointer-events-none fixed -top-20 -end-20 size-[420px] rounded-full bg-gradient-to-tr from-amber-400/20 via-teal-300/15 to-transparent dark:from-amber-600/10 blur-[90px] animate-orb-3 z-0" />

          {/* Concentric Animated Radar Wave */}
          <div className="pointer-events-none fixed top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 size-[720px] rounded-full border border-emerald-500/20 dark:border-emerald-500/15 z-0 animate-radar-wave" />

          {/* Drifting Ambient Particle Specks */}
          <div className="pointer-events-none fixed top-24 start-1/5 size-2.5 rounded-full bg-emerald-400/60 blur-[1px] animate-float-slow z-0" />
          <div className="pointer-events-none fixed bottom-28 end-1/4 size-3 rounded-full bg-teal-400/50 blur-[1px] animate-float-reverse z-0" />
          <div className="pointer-events-none fixed top-1/2 end-1/6 size-2 rounded-full bg-amber-400/60 blur-[1px] animate-twinkle-1 z-0" />
        </>
      )}

      {/* 1. Fixed Top Glass Header - Exact Landing Page Style */}
      {showHeader && (
        <header className="fixed top-0 inset-x-0 z-50 glass-header bg-white/85 dark:bg-[#04120f]/90 border-b border-border/80 dark:border-emerald-500/20 backdrop-blur-xl transition-all duration-300 shadow-xs">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6 md:px-8">
            <BrandLogo href="/" size="md" />

            <div className="flex items-center gap-2.5 sm:gap-4">
              {showThemeToggle && <ThemeToggle variant="minimal" />}
              {showLanguageToggle && <LanguageToggle variant="pill" />}

              {auth?.user ? (
                <Button
                  asChild
                  size="sm"
                  variant="primaryGlow"
                  className="hidden sm:inline-flex shadow-xs font-bold"
                >
                  <Link to="/dashboard" className="flex items-center gap-1.5">
                    <LayoutDashboard className="size-3.5" />
                    <span>{t('nav_dashboard')}</span>
                  </Link>
                </Button>
              ) : (
                <>
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

                  <Button
                    asChild
                    size="sm"
                    variant="primaryGlow"
                    className="hidden sm:inline-flex shadow-xs font-bold"
                  >
                    <Link to="/signup" className="flex items-center gap-1.5">
                      <span>{t('action_start_free')}</span>
                      <ArrowIcon className="size-3.5" />
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </header>
      )}

      {/* 2. Main Content Area */}
      <main className="flex-1 w-full relative z-10 pt-20 sm:pt-24 pb-14">
        <div
          className={cn(
            'mx-auto w-full max-w-6xl px-4 sm:px-6 md:px-8 animate-fade-in',
            className,
          )}
          {...props}
        >
          {/* Breadcrumb & Top Back Action */}
          {showBreadcrumb && (
            <div className="mb-8 flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-4">
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-2 text-xs font-bold text-ink-muted hover:text-emerald transition-colors group cursor-pointer"
              >
                <span className="flex size-7 items-center justify-center rounded-lg border border-border/80 bg-surface/80 group-hover:border-emerald-border group-hover:bg-emerald-surface shadow-2xs transition-all">
                  <ArrowLeft className="size-3.5 rtl:rotate-180 group-hover:-translate-x-0.5 rtl:group-hover:translate-x-0.5 transition-transform" />
                </span>
                <span>{backLabel || (isRTL ? 'الرجوع إلى الصفحة السابقة' : 'Return to previous page')}</span>
              </button>

              <nav className="flex items-center gap-2 text-xs text-ink-subtle" aria-label="Breadcrumb">
                <Link to="/" className="hover:text-emerald transition-colors">
                  {isRTL ? 'الرئيسية' : 'Home'}
                </Link>
                <span>/</span>
                <span className="text-ink font-semibold">
                  {pageTitle || (isRTL ? 'معاينة التقييمات' : 'Testimonial Showcase')}
                </span>
              </nav>
            </div>
          )}

          {children}
        </div>
      </main>

      {/* 3. Luxury Modern SaaS Footer - Exact Landing Page Style */}
      {showFooter && (
        <footer className="relative isolate border-t border-border/80 bg-surface/90 backdrop-blur-xl pt-14 pb-12 text-ink overflow-hidden mt-auto">
          {/* Subtle Ambient Background Light */}
          <div className="pointer-events-none absolute -bottom-20 start-1/2 -translate-x-1/2 size-96 rounded-full bg-gradient-to-tr from-emerald-400/25 via-teal-300/20 to-transparent dark:from-emerald-500/15 blur-[100px] z-0" />

          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 md:px-8 relative z-10">
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
                    <Link to="/" className="hover:text-emerald transition-colors">
                      {isRTL ? 'الصفحة الرئيسية' : 'Home Page'}
                    </Link>
                  </li>
                  <li>
                    <Link to="/preview/testimonial" className="hover:text-emerald transition-colors">
                      {isRTL ? 'معاينة تصاميم التقييمات' : 'Testimonial Showcase'}
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
      )}
    </div>
  )
}
