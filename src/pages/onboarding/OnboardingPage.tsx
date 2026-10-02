import * as React from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Check, Copy } from 'lucide-react'

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
import { useAuth } from '@/lib/auth-context'
import { useMerchant } from '@/hooks/useMerchant'
import { slugify } from '@/lib/slugify'
import { supabase } from '@/lib/supabase'

function OnboardingPage() {
  const { user } = useAuth()
  const { merchant, loading: merchantLoading, refetch } = useMerchant()
  const navigate = useNavigate()

  const [businessName, setBusinessName] = React.useState('')
  const [slug, setSlug] = React.useState('')
  const [slugTouched, setSlugTouched] = React.useState(false)
  const [brandColor, setBrandColor] = React.useState('#087F5B')
  const [logoFile, setLogoFile] = React.useState<File | null>(null)
  const [logoPreviewUrl, setLogoPreviewUrl] = React.useState<string | null>(null)

  const [submitting, setSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [createdSlug, setCreatedSlug] = React.useState<string | null>(null)
  const [copied, setCopied] = React.useState(false)

  if (!merchantLoading && merchant) {
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
    if (!user) return

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
      slug,
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
    setCreatedSlug(slug)
  }

  const reviewLink = createdSlug ? `${window.location.origin}/r/${createdSlug}` : ''

  async function handleCopy() {
    await navigator.clipboard.writeText(reviewLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (createdSlug) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-background px-gutter">
        <Card className="w-full max-w-sm text-center">
          <CardHeader>
            <CardTitle>تم إنشاء متجرك بنجاح!</CardTitle>
            <CardDescription>هذا رابط التقييم الخاص بك، جاهز للمشاركة.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <code className="break-all rounded-md border border-border bg-muted-surface px-3 py-2 text-sm text-ink">
              {reviewLink}
            </code>
            <Button variant="secondary" size="sm" onClick={handleCopy}>
              {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
              {copied ? 'تم النسخ' : 'نسخ الرابط'}
            </Button>
            <Button onClick={() => navigate('/dashboard')}>الذهاب إلى لوحة التحكم</Button>
          </CardContent>
        </Card>
      </main>
    )
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-gutter py-gutter-lg">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>إعداد متجرك</CardTitle>
          <CardDescription>بيانات بسيطة لتجهيز صفحة التقييم الخاصة بك.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="businessName">اسم المتجر</Label>
              <Input
                id="businessName"
                required
                value={businessName}
                onChange={(event) => handleBusinessNameChange(event.target.value)}
                disabled={submitting}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="slug">رابط التقييم الخاص بك</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-text" dir="ltr">
                  /r/
                </span>
                <Input
                  id="slug"
                  required
                  dir="ltr"
                  value={slug}
                  onChange={(event) => handleSlugChange(event.target.value)}
                  disabled={submitting}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="logo">شعار المتجر (اختياري)</Label>
              <div className="flex items-center gap-4">
                {logoPreviewUrl ? (
                  <img
                    src={logoPreviewUrl}
                    alt=""
                    className="size-14 rounded-full object-cover"
                  />
                ) : (
                  <div
                    className="flex size-14 items-center justify-center rounded-full text-lg font-semibold text-white"
                    style={{ backgroundColor: brandColor }}
                    aria-hidden
                  >
                    {businessName.trim().charAt(0) || '؟'}
                  </div>
                )}
                <Input
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  disabled={submitting}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label>لون العلامة التجارية</Label>
              <ColorPicker value={brandColor} onChange={setBrandColor} />
            </div>

            {error && <p className="text-sm text-danger">{error}</p>}

            <Button type="submit" disabled={submitting}>
              {submitting ? 'جاري الإنشاء...' : 'متابعة'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}

export default OnboardingPage
