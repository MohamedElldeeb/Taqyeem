import * as React from 'react'
import { Check, Sparkles, Sun, Upload } from 'lucide-react'

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
import { TemplatePreview } from '@/components/testimonial/TemplatePreview'
import { useAuth } from '@/lib/auth-context'
import { useMerchant } from '@/hooks/useMerchant'
import { supabase } from '@/lib/supabase'
import { TEMPLATE_IDS, TEMPLATE_LABELS, type TemplateId } from '@/lib/testimonial-templates'
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
  const [saving, setSaving] = React.useState(false)
  const [saved, setSaved] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const [savingTemplate, setSavingTemplate] = React.useState(false)
  const [templateError, setTemplateError] = React.useState<string | null>(null)

  React.useEffect(() => {
    return () => {
      if (logoPreviewUrl) URL.revokeObjectURL(logoPreviewUrl)
    }
  }, [logoPreviewUrl])

  if (!merchant) return null

  function handleLogoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null
    event.target.value = ''
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('الملف المختار مش صورة.')
      return
    }
    if (file.size > MAX_LOGO_BYTES) {
      setError('حجم الصورة كبير جداً (الحد الأقصى 5 ميجا).')
      return
    }

    setError(null)
    setLogoFile(file)
    if (logoPreviewUrl) URL.revokeObjectURL(logoPreviewUrl)
    setLogoPreviewUrl(URL.createObjectURL(file))
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
      setTemplateError('تعذر حفظ التصميم. حاول مرة أخرى.')
      return
    }

    await refetch()
    showToast(t('action_saved'), TEMPLATE_LABELS[templateId], 'success')
  }

  async function handleSave() {
    if (!user) return

    if (!businessName.trim() || businessName.trim().length < 2) {
      setError(t('val_biz_name_min'))
      return
    }

    setSaving(true)
    setError(null)
    setSaved(false)

    let logoUrl = merchant!.logo_url

    if (logoFile) {
      const extension = logoFile.name.split('.').pop() ?? 'png'
      const path = `${user.id}/logo-${Date.now()}.${extension}`
      const { error: uploadError } = await supabase.storage
        .from('logos')
        .upload(path, logoFile, { upsert: true, contentType: logoFile.type })

      if (uploadError) {
        setSaving(false)
        setError('تعذر رفع الشعار. حاول مرة أخرى.')
        return
      }

      logoUrl = supabase.storage.from('logos').getPublicUrl(path).data.publicUrl
    }

    const { error: updateError } = await supabase
      .from('merchants')
      .update({ business_name: businessName.trim(), brand_color: brandColor, logo_url: logoUrl })
      .eq('id', merchant!.id)

    setSaving(false)

    if (updateError) {
      setError('تعذر حفظ التغييرات. حاول مرة أخرى.')
      return
    }

    setLogoFile(null)
    if (logoPreviewUrl) URL.revokeObjectURL(logoPreviewUrl)
    setLogoPreviewUrl(null)

    await refetch()
    setSaved(true)
    showToast(t('action_saved'), undefined, 'success')
    setTimeout(() => setSaved(false), 2000)
  }

  const displayedLogoUrl = logoPreviewUrl ?? merchant.logo_url

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-8">
      {/* Header */}
      <header className="flex flex-col gap-2">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-border bg-emerald-surface px-3 py-1 text-xs font-bold text-emerald-deep w-fit shadow-2xs">
          <Sparkles className="size-3.5" />
          <span>{isRTL ? 'إعدادات الحساب والمظهر' : 'Store Settings & Customization'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
          {t('dash_settings_title')}
        </h1>
        <p className="text-sm text-ink-muted">{t('dash_settings_subtitle')}</p>
      </header>

      {/* All three cards in one row: left = Brand Identity, right = Theme + Templates stacked */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

        {/* Brand Identity Card */}
        <Card className="border-border/80 bg-surface/90 backdrop-blur-md shadow-sm transition-all duration-300 hover:shadow-md">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 text-white shadow-sm">
                <Sparkles className="size-4.5" />
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
                <div className="flex flex-col gap-1.5">
                  <Button variant="secondary" size="sm" asChild className="w-fit cursor-pointer">
                    <label htmlFor="logo">
                      <Upload className="size-4" />
                      <span>{merchant.logo_url || logoFile ? t('dash_settings_change_logo') : t('dash_settings_upload_logo')}</span>
                    </label>
                  </Button>
                  <Input
                    id="logo"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="hidden"
                  />
                  <span className="text-[11px] text-ink-subtle">
                    {logoFile ? 'سيتم الرفع عند الضغط على حفظ التغييرات' : t('dash_settings_logo_hint')}
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

            <Button
              onClick={handleSave}
              disabled={saving}
              variant="primaryGlow"
              size="lg"
              className="w-fit font-bold shadow-md gap-2"
            >
              {saved && <Check className="size-4 text-white" />}
              <span>{saving ? t('action_saving') : saved ? t('action_saved') : t('action_save')}</span>
            </Button>
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
            <CardHeader className="pb-2">
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
            </CardHeader>
            <CardContent className="flex flex-col gap-4 pt-4">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {TEMPLATE_IDS.map((templateId) => {
                  const isSelected = merchant.default_template_id === templateId
                  return (
                    <button
                      key={templateId}
                      type="button"
                      onClick={() => handleSelectTemplate(templateId)}
                      disabled={savingTemplate}
                      className={`group relative flex flex-col items-center overflow-hidden rounded-2xl border-2 transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? 'border-emerald bg-emerald-surface/30 shadow-md scale-[1.02]'
                          : 'border-transparent bg-background-subtle/50 hover:border-border hover:bg-surface hover:shadow-sm'
                      }`}
                    >
                      <div className="relative w-full overflow-hidden">
                        <TemplatePreview templateId={templateId} />
                        {isSelected && (
                          <div className="absolute inset-0 bg-emerald/5" />
                        )}
                        {isSelected && (
                          <div className="absolute top-1.5 inset-inline-end-1.5 flex size-5 items-center justify-center rounded-full bg-emerald text-white shadow-md animate-scale-in">
                            <Check className="size-3 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <span className={`w-full text-center py-2 px-1.5 text-[11px] font-bold ${
                        isSelected ? 'text-emerald-deep' : 'text-ink group-hover:text-emerald-deep'
                      } transition-colors`}>
                        {TEMPLATE_LABELS[templateId]}
                      </span>
                    </button>
                  )
                })}
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
