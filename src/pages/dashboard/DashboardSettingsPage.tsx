import * as React from 'react'
import { Check, Palette, RotateCcw, Sparkles, Sun, Trash2, Upload } from 'lucide-react'

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
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { LiveTemplatePreview } from '@/components/testimonial/LiveTemplatePreview'
import { useAuth } from '@/lib/auth-context'
import { useMerchant } from '@/hooks/useMerchant'
import { supabase } from '@/lib/supabase'
import { TEMPLATE_IDS, TEMPLATE_LABELS, TEMPLATE_LABELS_EN, type TemplateId } from '@/lib/testimonial-templates'
import { useLanguage } from '@/lib/language-context'
import { useToast } from '@/components/ui/toast'

const MAX_LOGO_BYTES = 5 * 1024 * 1024

function DashboardSettingsPage() {
  const { user } = useAuth()
  const { merchant, refetch } = useMerchant()
  const { t, isRTL } = useLanguage()
  const { showToast } = useToast()

  const [businessName, setBusinessName] = React.useState(merchant?.business_name ?? '')
  const [brandColor, setBrandColor] = React.useState(merchant?.brand_color ?? '#059669')
  const [logoFile, setLogoFile] = React.useState<File | null>(null)
  const [logoPreviewUrl, setLogoPreviewUrl] = React.useState<string | null>(null)
  const [removeExistingLogo, setRemoveExistingLogo] = React.useState(false)
  const [saving, setSaving] = React.useState(false)
  const [saved, setSaved] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const [savingTemplate, setSavingTemplate] = React.useState(false)
  const [templateError, setTemplateError] = React.useState<string | null>(null)

  // Keep state in sync with loaded / updated merchant profile
  React.useEffect(() => {
    if (merchant) {
      setBusinessName(merchant.business_name ?? '')
      setBrandColor(merchant.brand_color ?? '#059669')
      setRemoveExistingLogo(false)
      setLogoFile(null)
      if (logoPreviewUrl) {
        URL.revokeObjectURL(logoPreviewUrl)
        setLogoPreviewUrl(null)
      }
      setError(null)
    }
  }, [merchant?.id, merchant?.business_name, merchant?.brand_color, merchant?.logo_url])

  React.useEffect(() => {
    return () => {
      if (logoPreviewUrl) URL.revokeObjectURL(logoPreviewUrl)
    }
  }, [logoPreviewUrl])

  if (!merchant) return null

  const isDirty =
    businessName.trim() !== (merchant.business_name ?? '').trim() ||
    brandColor.toLowerCase() !== (merchant.brand_color ?? '#059669').toLowerCase() ||
    logoFile !== null ||
    removeExistingLogo

  function handleReset() {
    if (!merchant) return
    setBusinessName(merchant.business_name ?? '')
    setBrandColor(merchant.brand_color ?? '#059669')
    setLogoFile(null)
    if (logoPreviewUrl) {
      URL.revokeObjectURL(logoPreviewUrl)
      setLogoPreviewUrl(null)
    }
    setRemoveExistingLogo(false)
    setError(null)
  }

  function handleLogoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null
    event.target.value = ''
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError(isRTL ? 'الملف المختار مش صورة.' : 'Selected file is not an image.')
      return
    }
    if (file.size > MAX_LOGO_BYTES) {
      setError(isRTL ? 'حجم الصورة كبير جداً (الحد الأقصى 5 ميجا).' : 'Image size exceeds 5MB limit.')
      return
    }

    setError(null)
    setRemoveExistingLogo(false)
    setLogoFile(file)
    if (logoPreviewUrl) URL.revokeObjectURL(logoPreviewUrl)
    setLogoPreviewUrl(URL.createObjectURL(file))
  }

  function handleClearSelectedLogo() {
    setLogoFile(null)
    if (logoPreviewUrl) {
      URL.revokeObjectURL(logoPreviewUrl)
      setLogoPreviewUrl(null)
    }
    if (merchant?.logo_url) {
      setRemoveExistingLogo(true)
    }
  }

  async function handleSelectTemplate(templateId: TemplateId) {
    if (templateId === merchant!.default_template_id || savingTemplate) return

    setSavingTemplate(true)
    setTemplateError(null)

    const { error: updateError } = await supabase
      .from('merchants')
      .update({ default_template_id: templateId })
      .eq('id', merchant!.id)

    setSavingTemplate(false)

    if (updateError) {
      setTemplateError(isRTL ? 'تعذر حفظ التصميم. حاول مرة أخرى.' : 'Failed to update template.')
      return
    }

    await refetch()
    showToast(t('action_saved'), TEMPLATE_LABELS[templateId], 'success')
  }

  async function handleSave() {
    if (!user || !merchant) return

    if (!businessName.trim() || businessName.trim().length < 2) {
      setError(t('val_biz_name_min'))
      return
    }

    setSaving(true)
    setError(null)
    setSaved(false)

    let logoUrl = removeExistingLogo ? null : merchant.logo_url

    if (logoFile) {
      const extension = logoFile.name.split('.').pop() ?? 'png'
      const path = `${user.id}/logo-${Date.now()}.${extension}`
      const { error: uploadError } = await supabase.storage
        .from('logos')
        .upload(path, logoFile, { upsert: true, contentType: logoFile.type })

      if (uploadError) {
        setSaving(false)
        setError(isRTL ? 'تعذر رفع الشعار. حاول مرة أخرى.' : 'Failed to upload logo.')
        return
      }

      logoUrl = supabase.storage.from('logos').getPublicUrl(path).data.publicUrl
    }

    const { error: updateError } = await supabase
      .from('merchants')
      .update({
        business_name: businessName.trim(),
        brand_color: brandColor,
        logo_url: logoUrl,
      })
      .eq('id', merchant.id)

    setSaving(false)

    if (updateError) {
      setError(isRTL ? 'تعذر حفظ التغييرات. حاول مرة أخرى.' : 'Failed to save changes.')
      return
    }

    // Reset local staging state
    setLogoFile(null)
    if (logoPreviewUrl) {
      URL.revokeObjectURL(logoPreviewUrl)
      setLogoPreviewUrl(null)
    }
    setRemoveExistingLogo(false)

    // Sync latest merchant row into context
    await refetch()
    setSaved(true)
    showToast(t('action_saved'), undefined, 'success')
    setTimeout(() => setSaved(false), 2500)
  }

  const displayedLogoUrl = removeExistingLogo ? null : (logoPreviewUrl ?? merchant.logo_url)

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-8">
      {/* Header */}
      <header className="flex flex-col gap-2">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-border bg-emerald-surface px-3 py-1 text-xs font-bold text-emerald-deep w-fit shadow-2xs">
          <Palette className="size-3.5" />
          <span>{isRTL ? 'الهوية البصرية وتخصيص المتجر' : 'Branding & Store Identity'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
          {t('dash_settings_title')}
        </h1>
        <p className="text-sm text-ink-muted">{t('dash_settings_subtitle')}</p>
      </header>

      {/* Grid: left = Brand Identity, right = Theme + Templates stacked */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

        {/* Brand Identity Card */}
        <Card className="border-border/80 bg-surface/90 backdrop-blur-md shadow-sm transition-all duration-300 hover:shadow-md">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 text-white shadow-sm">
                  <Palette className="size-4.5" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold text-ink">
                    {t('dash_settings_identity_card')}
                  </CardTitle>
                  <CardDescription className="text-xs text-ink-muted mt-0.5">
                    {t('dash_settings_identity_desc')}
                  </CardDescription>
                </div>
              </div>

              {isDirty && (
                <span className="text-[11px] font-bold text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20 shrink-0">
                  {isRTL ? 'تعديلات غير محفوظة' : 'Unsaved changes'}
                </span>
              )}
            </div>
          </CardHeader>

          <CardContent className="flex flex-col gap-6 pt-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="businessName" className="text-xs font-bold text-ink">
                {t('dash_settings_biz_name')}
              </Label>
              <Input
                id="businessName"
                value={businessName}
                onChange={(event) => setBusinessName(event.target.value)}
                placeholder={isRTL ? 'مثال: متجر الأصالة' : 'e.g. Acme Coffee'}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="logo" className="text-xs font-bold text-ink">
                {t('dash_settings_logo')}
              </Label>
              <div className="flex items-center gap-4 rounded-2xl border border-dashed border-border p-4 bg-background-subtle/50 transition-colors hover:border-emerald-border/60">
                {displayedLogoUrl ? (
                  <img
                    src={displayedLogoUrl}
                    alt=""
                    className="size-16 rounded-2xl object-cover border border-border shadow-xs shrink-0"
                  />
                ) : (
                  <div
                    className="flex size-16 shrink-0 items-center justify-center rounded-2xl text-2xl font-extrabold text-white shadow-xs"
                    style={{ backgroundColor: brandColor }}
                    aria-hidden
                  >
                    {businessName.trim().charAt(0) || 'ت'}
                  </div>
                )}
                <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Button variant="secondary" size="sm" asChild className="w-fit cursor-pointer">
                      <label htmlFor="logo">
                        <Upload className="size-4" />
                        <span>
                          {displayedLogoUrl
                            ? t('dash_settings_change_logo')
                            : t('dash_settings_upload_logo')}
                        </span>
                      </label>
                    </Button>

                    {displayedLogoUrl && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleClearSelectedLogo}
                        className="text-danger hover:text-danger hover:bg-danger-surface border-border/80"
                        title={t('action_remove_logo')}
                      >
                        <Trash2 className="size-3.5" />
                        <span className="text-xs">{t('action_remove_logo')}</span>
                      </Button>
                    )}
                  </div>

                  <Input
                    id="logo"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="hidden"
                  />
                  <span className="text-[11px] text-ink-subtle">
                    {logoFile
                      ? (isRTL ? 'سيتم الرفع عند الضغط على حفظ التغييرات' : 'Will be uploaded upon saving')
                      : t('dash_settings_logo_hint')}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-xs font-bold text-ink">
                {t('dash_settings_brand_color')}
              </Label>
              <ColorPicker value={brandColor} onChange={setBrandColor} />
            </div>

            {error && (
              <div className="rounded-xl border border-danger-border bg-danger-surface p-3 animate-fade-in">
                <p className="text-xs font-semibold text-danger">{error}</p>
              </div>
            )}

            {/* Actions: Save + Reset */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button
                onClick={handleSave}
                disabled={saving || !isDirty}
                variant="primaryGlow"
                size="lg"
                className="font-bold shadow-md gap-2 cursor-pointer"
              >
                {saved && <Check className="size-4 text-white" />}
                <span>{saving ? t('action_saving') : saved ? t('action_saved') : t('action_save')}</span>
              </Button>

              {isDirty && (
                <Button
                  type="button"
                  onClick={handleReset}
                  disabled={saving}
                  variant="outline"
                  size="lg"
                  className="font-bold gap-2 text-ink-muted hover:text-ink cursor-pointer"
                >
                  <RotateCcw className="size-4" />
                  <span>{t('action_reset')}</span>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Right column: Theme + Templates stacked */}
        <div className="flex flex-col gap-6">

          {/* Theme Appearance Card */}
          <Card className="border-border/80 bg-surface/90 backdrop-blur-md shadow-sm transition-all duration-300 hover:shadow-md">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-sm">
                  <Sun className="size-4.5" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold text-ink">
                    {isRTL ? 'مظهر وتنسيق الواجهة' : 'Interface Theme'}
                  </CardTitle>
                  <CardDescription className="text-xs text-ink-muted mt-0.5">
                    {isRTL ? 'اختر المظهر المفضل للتطبيق (فاتح أو داكن أو حسب نظام جهازك).' : 'Choose your preferred application theme (Light, Dark, or System default).'}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <ThemeToggle variant="segmented" />
            </CardContent>
          </Card>

          {/* Review Template Selection Card */}
          <Card className="border-border/80 bg-surface/90 backdrop-blur-md shadow-sm transition-all duration-300 hover:shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-400 to-purple-600 text-white shadow-sm">
                    <Sparkles className="size-4.5" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold text-ink">
                      {t('dash_settings_template_card')}
                    </CardTitle>
                    <CardDescription className="text-xs text-ink-muted mt-0.5">
                      {t('dash_settings_template_desc')}
                    </CardDescription>
                  </div>
                </div>

                <span className="text-[11px] font-bold text-indigo-500 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20 shrink-0">
                  {TEMPLATE_IDS.length} {isRTL ? 'قالب حصري' : 'Presets'}
                </span>
              </div>
            </CardHeader>

            <CardContent className="flex flex-col gap-5 pt-2">
              {/* Active Selected Template Live Highlight */}
              <div className="flex flex-col sm:flex-row items-center gap-4 rounded-2xl border border-emerald-border/60 bg-emerald-surface/20 p-3.5 shadow-2xs">
                <div className="size-28 sm:size-32 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-950 border border-emerald/30 shadow-md shrink-0 relative">
                  <LiveTemplatePreview
                    templateId={(merchant.default_template_id as TemplateId) || '01-glass-orbs'}
                    brandColor={brandColor}
                    data={{
                      merchant: businessName.trim() || merchant.business_name || 'Taqyeem',
                      logoUrl: displayedLogoUrl || undefined,
                      customer: isRTL ? 'عميل مميز' : 'Verified Buyer',
                      quote: isRTL ? 'تجربة شراء استثنائية وجودة لا غبار عليها.' : 'Exceptional buying experience and top quality.',
                    }}
                    className="size-full pointer-events-none"
                  />
                  <div className="absolute top-1.5 end-1.5 flex size-5 items-center justify-center rounded-full bg-emerald text-white shadow-md z-10">
                    <Check className="size-3 stroke-[3]" />
                  </div>
                </div>

                <div className="flex flex-col items-center sm:items-start text-center sm:text-start gap-1.5 min-w-0 flex-1">
                  <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-deep bg-emerald-surface px-2 py-0.5 rounded-full border border-emerald-border/80">
                    <Sparkles className="size-3" />
                    <span>{isRTL ? 'القالب الافتراضي المطبق' : 'Active Default Template'}</span>
                  </div>
                  <h4 className="text-sm font-extrabold text-ink">
                    {isRTL
                      ? TEMPLATE_LABELS[(merchant.default_template_id as TemplateId) || '01-glass-orbs']
                      : TEMPLATE_LABELS_EN[(merchant.default_template_id as TemplateId) || '01-glass-orbs']}
                    <span className="text-ink-muted text-xs font-normal ms-1.5">
                      ({isRTL ? TEMPLATE_LABELS_EN[(merchant.default_template_id as TemplateId) || '01-glass-orbs'] : TEMPLATE_LABELS[(merchant.default_template_id as TemplateId) || '01-glass-orbs']})
                    </span>
                  </h4>
                  <p className="text-xs text-ink-muted leading-relaxed">
                    {isRTL
                      ? 'يتم تطبيق هذا النمط التلقائي على جميع بطاقات التقييمات الجديدة وتوليد الصور الترويجية.'
                      : 'All new customer review cards and promotional images will automatically use this aesthetic.'}
                  </p>
                </div>
              </div>

              {/* Template Selection Grid */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold text-ink">
                    {isRTL ? 'اختر القالب المفضل للمعاينة والتطبيق:' : 'Choose template style:'}
                  </Label>
                  <span className="text-[11px] text-ink-subtle">
                    {isRTL ? 'اضغط لتطبيق القالب فوراً' : 'Click any card to apply'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 max-h-[380px] sm:max-h-[420px] overflow-y-auto scrollbar-sleek overscroll-contain touch-pan-y pe-1.5 py-1">
                  {TEMPLATE_IDS.map((templateId) => {
                    const isSelected = merchant.default_template_id === templateId
                    return (
                      <button
                        key={templateId}
                        type="button"
                        onClick={() => handleSelectTemplate(templateId)}
                        disabled={savingTemplate}
                        className={`group relative flex flex-col items-center overflow-hidden rounded-2xl border-2 transition-all duration-200 cursor-pointer text-start ${
                          isSelected
                            ? 'border-emerald bg-emerald-surface/40 shadow-md scale-[1.02] ring-2 ring-emerald-500/30'
                            : 'border-border/80 bg-surface/90 hover:border-emerald-border/80 hover:bg-surface hover:shadow-sm hover:scale-[1.01]'
                        }`}
                      >
                        <div className="relative w-full aspect-square overflow-hidden bg-slate-100 dark:bg-slate-950 flex items-center justify-center shrink-0">
                          <LiveTemplatePreview
                            templateId={templateId}
                            brandColor={brandColor}
                            data={{
                              merchant: businessName.trim() || merchant.business_name || 'Taqyeem',
                              logoUrl: displayedLogoUrl || undefined,
                            }}
                            className="size-full pointer-events-none"
                          />
                          {isSelected && (
                            <div className="absolute inset-0 bg-emerald/10 pointer-events-none z-10" />
                          )}
                          {isSelected && (
                            <div className="absolute top-1.5 end-1.5 flex size-5 items-center justify-center rounded-full bg-emerald text-white shadow-md animate-scale-in z-20">
                              <Check className="size-3 stroke-[3]" />
                            </div>
                          )}
                          <div className="absolute bottom-1.5 start-1.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 backdrop-blur-xs text-[9px] font-bold text-white px-1.5 py-0.5 rounded-md pointer-events-none">
                            {TEMPLATE_LABELS_EN[templateId]}
                          </div>
                        </div>
                        <div className="w-full flex items-center justify-between py-2 px-2 gap-1 bg-surface/80">
                          <span className={`text-[11px] font-bold truncate ${
                            isSelected ? 'text-emerald-deep font-black' : 'text-ink group-hover:text-emerald-deep'
                          } transition-colors`}>
                            {isRTL ? TEMPLATE_LABELS[templateId] : TEMPLATE_LABELS_EN[templateId]}
                          </span>
                          {isSelected && (
                            <span className="size-1.5 rounded-full bg-emerald shrink-0" />
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {templateError && (
                <p className="text-xs font-semibold text-danger animate-fade-in">{templateError}</p>
              )}
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  )
}

export default DashboardSettingsPage
