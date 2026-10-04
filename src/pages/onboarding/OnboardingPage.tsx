import * as React from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { AlertCircle, Check, Copy, Rocket, Sparkles, Upload } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ColorPicker } from '@/components/ui/color-picker'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LanguageToggle } from '@/components/ui/language-toggle'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { AnimatedBackground } from '@/components/ui/animated-background'
import { BrandLogo } from '@/components/ui/brand-logo'
import { useAuth } from '@/lib/auth-context'
import { useLanguage } from '@/lib/language-context'
import { useMerchant } from '@/hooks/useMerchant'
import { slugify } from '@/lib/slugify'
import { supabase } from '@/lib/supabase'
import { FullPageSpinner } from '@/components/auth/RequireAuth'
import { isValidBusinessName, isValidSlug } from '@/lib/validators'

function OnboardingPage() {
  const { user } = useAuth()
  const { merchant, loading: merchantLoading, refetch } = useMerchant()
  const { t, isRTL } = useLanguage()
  const navigate = useNavigate()

  const [businessName, setBusinessName] = React.useState('')
  const [slug, setSlug] = React.useState('')
  const [slugTouched, setSlugTouched] = React.useState(false)
  const [touched, setTouched] = React.useState<{ businessName?: boolean; slug?: boolean }>({})
  const [brandColor, setBrandColor] = React.useState('#059669')
  const [logoFile, setLogoFile] = React.useState<File | null>(null)
  const [logoPreviewUrl, setLogoPreviewUrl] = React.useState<string | null>(null)

  const [submitting, setSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [createdSlug, setCreatedSlug] = React.useState<string | null>(null)
  const [copied, setCopied] = React.useState(false)

  const businessNameError = React.useMemo(() => {
    if (!touched.businessName) return null
    if (!businessName.trim()) return t('val_biz_name_required')
    if (!isValidBusinessName(businessName)) return t('val_biz_name_min')
    return null
  }, [businessName, touched.businessName, t])

  const slugError = React.useMemo(() => {
    if (!touched.slug) return null
    if (!slug.trim()) return t('val_slug_required')
    if (slug.trim().length < 2) return t('val_slug_min')
    if (!isValidSlug(slug)) return t('val_slug_invalid')
    return null
  }, [slug, touched.slug, t])

  if (merchantLoading) {
    return <FullPageSpinner />
  }

  if (merchant) {
    return <Navigate to="/dashboard" replace />
  }

  function handleBusinessNameChange(value: string) {
    setBusinessName(value)
    if (!slugTouched) {
      setSlug(slugify(value))
    }
  }

  function handleSlugChange(value: string) {
    setSlugTouched(true)
    setSlug(slugify(value))
  }

  function handleLogoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null
    setLogoFile(file)
    setLogoPreviewUrl(file ? URL.createObjectURL(file) : null)
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setTouched({ businessName: true, slug: true })
    if (!user) return

    const isBizValid = isValidBusinessName(businessName)
    const isSlugValid = isValidSlug(slug)

    if (!isBizValid || !isSlugValid) {
      return
    }

    setSubmitting(true)
    setError(null)

    let logoUrl: string | null = null

    if (logoFile) {
      const extension = logoFile.name.split('.').pop() ?? 'png'
      const path = `${user.id}/logo-${Date.now()}.${extension}`
      const { error: uploadError } = await supabase.storage
        .from('logos')
        .upload(path, logoFile, { upsert: true })

      if (uploadError) {
        setSubmitting(false)
        setError('تعذر رفع الشعار. حاول مرة أخرى.')
        return
      }

      logoUrl = supabase.storage.from('logos').getPublicUrl(path).data.publicUrl
    }

    const { error: insertError } = await supabase.from('merchants').insert({
      user_id: user.id,
      business_name: businessName.trim(),
      slug: slug.trim(),
      logo_url: logoUrl,
      brand_color: brandColor,
    })

    setSubmitting(false)

    if (insertError) {
      if (insertError.code === '23505') {
        setError('هذا الرابط مستخدم بالفعل، برجاء اختيار رابط آخر.')
      } else {
        setError('حدث خطأ أثناء إنشاء المتجر. حاول مرة أخرى.')
      }
      return
    }

    await refetch()
    setCreatedSlug(slug.trim())
  }

  const reviewLink = createdSlug ? `${window.location.origin}/r/${createdSlug}` : ''

  async function handleCopy() {
    await navigator.clipboard.writeText(reviewLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (createdSlug) {
    return (
      <main className="relative flex min-h-dvh items-center justify-center bg-background px-4 py-8 selection:bg-emerald/20 overflow-hidden">
        {/* Animated Mesh Background */}
        <AnimatedBackground variant="hero" showDots showParticles />

        <Card className="w-full max-w-md border-emerald-border/80 bg-surface/95 backdrop-blur-xl p-6 text-center shadow-xl animate-scale-in relative z-10">
          <CardHeader className="flex flex-col items-center gap-3">
            <div className="flex size-16 items-center justify-center rounded-3xl bg-emerald text-white shadow-lg animate-float-gentle">
              <Rocket className="size-8" />
            </div>
            <CardTitle className="text-2xl font-extrabold text-ink">
              {t('onboarding_complete_title')}
            </CardTitle>
            <CardDescription className="text-sm text-ink-muted">
              {t('onboarding_complete_desc')}
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-4 mt-2">
            <div className="flex items-center gap-2 rounded-xl border border-border bg-background-subtle p-2">
              <code className="flex-1 truncate text-start text-xs font-mono text-ink">
                {reviewLink}
              </code>
              <Button variant="secondary" size="xs" onClick={handleCopy} className="gap-1.5 shrink-0">
                {copied ? <Check className="size-3.5 text-emerald" /> : <Copy className="size-3.5" />}
                <span>{copied ? t('action_copied') : t('action_copy')}</span>
              </Button>
            </div>

            <Button
              size="lg"
              variant="primaryGlow"
              onClick={() => navigate('/dashboard')}
              className="w-full font-bold shadow-md"
            >
              {t('onboarding_go_dashboard')}
            </Button>
          </CardContent>
        </Card>
      </main>
    )
  }

  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center bg-background px-4 py-12 selection:bg-emerald/20 overflow-hidden">
      {/* Animated Mesh Background */}
      <AnimatedBackground variant="mesh" showDots showParticles />

      {/* Top Header */}
      <div className="absolute top-4 inset-x-4 flex items-center justify-between max-w-5xl mx-auto z-10">
        <BrandLogo href="/" size="sm" />
        <div className="flex items-center gap-2">
          <ThemeToggle variant="minimal" />
          <LanguageToggle variant="pill" />
        </div>
      </div>

      <div className="w-full max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-6">
        {/* Setup Form */}
        <Card className="lg:col-span-7 border-border bg-surface p-2 shadow-xl animate-fade-in">
          <CardHeader>
            <div className="inline-flex size-10 items-center justify-center rounded-xl bg-emerald-surface text-emerald mb-1">
              <Sparkles className="size-5" />
            </div>
            <CardTitle className="text-2xl font-extrabold text-ink">
              {t('onboarding_title')}
            </CardTitle>
            <CardDescription className="text-sm text-ink-muted">
              {t('onboarding_subtitle')}
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 pt-0">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="businessName" className="text-xs font-bold text-ink">
                  {t('onboarding_biz_name_label')}
                </Label>
                <Input
                  id="businessName"
                  required
                  value={businessName}
                  onChange={(event) => handleBusinessNameChange(event.target.value)}
                  onBlur={() => setTouched((prev) => ({ ...prev, businessName: true }))}
                  hasError={Boolean(businessNameError)}
                  disabled={submitting}
                  placeholder={isRTL ? 'مثال: متجر الرياض للقهوة المختصة' : 'e.g. Specialty Coffee Co.'}
                />
                {businessNameError && (
                  <p className="flex items-center gap-1 text-[11px] font-semibold text-rose-500 animate-fade-in">
                    <AlertCircle className="size-3 shrink-0" />
                    <span>{businessNameError}</span>
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="slug" className="text-xs font-bold text-ink">
                  {t('onboarding_slug_label')}
                </Label>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-semibold text-ink-subtle select-none" dir="ltr">
                    /r/
                  </span>
                  <Input
                    id="slug"
                    required
                    dir="ltr"
                    value={slug}
                    onChange={(event) => handleSlugChange(event.target.value)}
                    onBlur={() => setTouched((prev) => ({ ...prev, slug: true }))}
                    hasError={Boolean(slugError)}
                    disabled={submitting}
                    placeholder="store-name"
                    className="font-mono"
                  />
                </div>
                {slugError && (
                  <p className="flex items-center gap-1 text-[11px] font-semibold text-rose-500 animate-fade-in">
                    <AlertCircle className="size-3 shrink-0" />
                    <span>{slugError}</span>
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="logo" className="text-xs font-bold text-ink">
                  {t('onboarding_logo_label')}
                </Label>
                <div className="flex items-center gap-4 rounded-xl border border-dashed border-border p-3">
                  {logoPreviewUrl ? (
                    <img
                      src={logoPreviewUrl}
                      alt="Logo Preview"
                      className="size-14 rounded-2xl object-cover border border-border shadow-xs"
                    />
                  ) : (
                    <div
                      className="flex size-14 items-center justify-center rounded-2xl text-xl font-bold text-white shadow-xs"
                      style={{ backgroundColor: brandColor }}
                    >
                      {businessName.trim().charAt(0) || 'ت'}
                    </div>
                  )}

                  <div className="flex-1 flex flex-col gap-1">
                    <Button variant="secondary" size="xs" asChild className="w-fit cursor-pointer">
                      <label htmlFor="logo">
                        <Upload className="size-3.5" />
                        {logoFile ? 'تغيير الصورة' : 'اختيار شعار'}
                      </label>
                    </Button>
                    <Input
                      id="logo"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      disabled={submitting}
                      className="hidden"
                    />
                    <span className="text-[11px] text-ink-subtle">PNG, JPG حتى 5 ميجابايت</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-bold text-ink">
                  {t('onboarding_brand_color_label')}
                </Label>
                <ColorPicker value={brandColor} onChange={setBrandColor} />
              </div>

              {error && (
                <div className="rounded-xl border border-danger-border bg-danger-surface p-3 animate-fade-in">
                  <p className="text-xs font-semibold text-danger">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                size="lg"
                variant="primaryGlow"
                loading={submitting}
                className="mt-2 font-bold shadow-md"
              >
                {t('action_continue')}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Live Interactive Preview Card */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <span className="text-xs font-bold text-ink-subtle">
            {isRTL ? 'معاينة حية فورية لصفحتك' : 'Live Preview'}
          </span>
          <Card className="border-border bg-surface/90 backdrop-blur-md p-5 shadow-lg">
            <div className="flex flex-col items-center gap-4 text-center">
              {logoPreviewUrl ? (
                <img
                  src={logoPreviewUrl}
                  alt="Logo"
                  className="size-16 rounded-2xl object-cover border border-border shadow-xs"
                />
              ) : (
                <div
                  className="flex size-16 items-center justify-center rounded-2xl text-2xl font-extrabold text-white shadow-xs transition-colors"
                  style={{ backgroundColor: brandColor }}
                >
                  {businessName.trim().charAt(0) || 'ت'}
                </div>
              )}

              <div className="flex flex-col gap-1">
                <h3 className="text-base font-bold text-ink">
                  {businessName.trim() || (isRTL ? 'اسم متجرك' : 'Your Store Name')}
                </h3>
                <span className="text-xs font-mono text-ink-subtle">
                  /r/{slug.trim() || 'your-slug'}
                </span>
              </div>

              <div className="w-full rounded-xl border border-border bg-background-subtle p-3 flex flex-col gap-2">
                <div className="flex justify-center gap-1 text-amber-400">
                  ⭐⭐⭐⭐⭐
                </div>
                <p className="text-xs text-ink-muted italic">
                  "{isRTL ? 'إيه رأيك في تجربتك معانا؟' : 'How was your experience with us?'}"
                </p>
              </div>

              <div
                className="w-full h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white shadow-xs transition-colors"
                style={{ backgroundColor: brandColor }}
              >
                {t('review_submit_btn')}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </main>
  )
}

export default OnboardingPage
