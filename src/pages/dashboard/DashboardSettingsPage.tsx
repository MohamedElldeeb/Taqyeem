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
import { ColorSwatchPicker } from '@/components/ui/color-swatch-picker'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { TemplatePreview } from '@/components/testimonial/TemplatePreview'
import { useMerchant } from '@/hooks/useMerchant'
import { supabase } from '@/lib/supabase'
import { TEMPLATE_IDS, TEMPLATE_LABELS, type TemplateId } from '@/lib/testimonial-templates'

/**
 * Brand Settings — persists business_name/brand_color via the existing
 * merchants_update_own RLS policy (owner-scoped, unchanged from Phase 6).
 * Logo replacement stays disabled ("قريباً") — swapping/deleting a live
 * logo is a larger feature (storage cleanup, re-upload flow) out of
 * scope for this hardening pass.
 */
function DashboardSettingsPage() {
  const { merchant, refetch } = useMerchant()
  const [businessName, setBusinessName] = React.useState(merchant?.business_name ?? '')
  const [brandColor, setBrandColor] = React.useState(merchant?.brand_color ?? '#087F5B')
  const [saving, setSaving] = React.useState(false)
  const [saved, setSaved] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const [savingTemplate, setSavingTemplate] = React.useState(false)
  const [templateError, setTemplateError] = React.useState<string | null>(null)

  if (!merchant) return null

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
    setSaving(true)
    setError(null)
    setSaved(false)

    const { error: updateError } = await supabase
      .from('merchants')
      .update({ business_name: businessName.trim(), brand_color: brandColor })
      .eq('id', merchant!.id)

    setSaving(false)

    if (updateError) {
      setError('تعذر حفظ التغييرات. حاول مرة أخرى.')
      return
    }

    await refetch()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

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
            <Label>الشعار</Label>
            <div className="flex items-center gap-4">
              {merchant.logo_url ? (
                <img
                  src={merchant.logo_url}
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
              <Button variant="secondary" size="sm" disabled>
                رفع شعار (قريباً)
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="brandColor">لون العلامة التجارية</Label>
            <ColorSwatchPicker value={brandColor} onChange={setBrandColor} />
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
                    <TemplatePreview templateId={templateId} brandColor={brandColor} size={140} />
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
