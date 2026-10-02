import * as React from 'react'
import { Check } from 'lucide-react'

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
import { TemplatePreview } from '@/components/testimonial/TemplatePreview'
import { useAuth } from '@/lib/auth-context'
import { useMerchant } from '@/hooks/useMerchant'
import { supabase } from '@/lib/supabase'
import { TEMPLATE_IDS, TEMPLATE_LABELS, type TemplateId } from '@/lib/testimonial-templates'

const MAX_LOGO_BYTES = 5 * 1024 * 1024

/**
 * Brand Settings — persists business_name/brand_color/logo_url via the
 * existing merchants_update_own RLS policy (owner-scoped). Logo upload
 * goes to the `logos` storage bucket (public read, owner-scoped write,
 * keyed on auth.uid() — see migration 20260923153500), the same bucket
 * and path convention OnboardingPage already uses. Works from any device
 * (desktop file picker, mobile camera/gallery) since `accept="image/*"`
 * on a native file input triggers the OS's own picker UI everywhere.
 */
function DashboardSettingsPage() {
  const { user } = useAuth()
  const { merchant, refetch } = useMerchant()
  const [businessName, setBusinessName] = React.useState(merchant?.business_name ?? '')
  const [brandColor, setBrandColor] = React.useState(merchant?.brand_color ?? '#087F5B')
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
      setError('حجم الصورة كبير جدًا (الحد الأقصى 5 ميجا).')
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
  }

  async function handleSave() {
    if (!user) return

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
    setTimeout(() => setSaved(false), 2000)
  }

  const displayedLogoUrl = logoPreviewUrl ?? merchant.logo_url

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-ink">الإعدادات</h1>
        <p className="text-muted-text">بيانات متجرك وهويته البصرية.</p>
      </header>

      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle>هوية المتجر</CardTitle>
          <CardDescription>هذه البيانات تظهر لعملائك في صفحة التقييم و Wall of Love.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="businessName">اسم المتجر</Label>
            <Input
              id="businessName"
              value={businessName}
              onChange={(event) => setBusinessName(event.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="logo">الشعار</Label>
            <div className="flex items-center gap-4">
              {displayedLogoUrl ? (
                <img
                  src={displayedLogoUrl}
                  alt=""
                  className="size-16 rounded-full object-cover"
                />
              ) : (
                <div
                  className="flex size-16 items-center justify-center rounded-full text-xl font-semibold text-white"
                  style={{ backgroundColor: brandColor }}
                  aria-hidden
                >
                  {businessName.trim().charAt(0)}
                </div>
              )}
              <div className="flex flex-col gap-1">
                <Button variant="secondary" size="sm" asChild>
                  <label htmlFor="logo" className="cursor-pointer">
                    {merchant.logo_url || logoFile ? 'تغيير الشعار' : 'رفع شعار'}
                  </label>
                </Button>
                <Input
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                />
                {logoFile && <span className="text-xs text-muted-text">هيتم الرفع عند الحفظ</span>}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label>لون العلامة التجارية</Label>
            <ColorPicker value={brandColor} onChange={setBrandColor} />
          </div>

          {error && <p className="text-sm text-danger">{error}</p>}

          <Button className="w-fit" onClick={handleSave} disabled={saving}>
            {saved && <Check className="size-4" />}
            {saving ? 'جاري الحفظ...' : saved ? 'تم الحفظ' : 'حفظ التغييرات'}
          </Button>
        </CardContent>
      </Card>

      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>تصميم التقييم</CardTitle>
          <CardDescription>
            اختر التصميم الذي يستخدم تلقائيًا لكل تقييم جديد. التصاميم السابقة لا تتغير عند اختيار تصميم مختلف.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {TEMPLATE_IDS.map((templateId) => {
              const isSelected = merchant.default_template_id === templateId
              return (
                <button
                  key={templateId}
                  type="button"
                  onClick={() => handleSelectTemplate(templateId)}
                  disabled={savingTemplate}
                  className={`flex flex-col items-center gap-2 rounded-xl border-2 p-2 transition ${
                    isSelected ? 'border-emerald' : 'border-transparent hover:border-border'
                  }`}
                >
                  <div className="relative">
                    <TemplatePreview templateId={templateId} size={140} />
                    {isSelected && (
                      <div className="absolute left-1 top-1 flex size-6 items-center justify-center rounded-full bg-emerald text-white">
                        <Check className="size-4" />
                      </div>
                    )}
                  </div>
                  <span className="text-sm font-medium text-ink">{TEMPLATE_LABELS[templateId]}</span>
                </button>
              )
            })}
          </div>
          {templateError && <p className="text-sm text-danger">{templateError}</p>}
        </CardContent>
      </Card>
    </div>
  )
}

export default DashboardSettingsPage
