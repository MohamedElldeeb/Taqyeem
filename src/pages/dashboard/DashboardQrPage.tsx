import * as React from 'react'
import { Check, Copy, Download, QrCode, Sparkles } from 'lucide-react'
import { QRCodeCanvas } from 'qrcode.react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useMerchant } from '@/hooks/useMerchant'
import { useLanguage } from '@/lib/language-context'
import { useToast } from '@/components/ui/toast'

function DashboardQrPage() {
  const { merchant } = useMerchant()
  const { t, isRTL } = useLanguage()
  const { showToast } = useToast()
  const [copied, setCopied] = React.useState(false)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const reviewLink = `${window.location.origin}/r/${merchant?.slug ?? ''}`

  async function handleCopy() {
    await navigator.clipboard.writeText(reviewLink)
    setCopied(true)
    showToast(t('action_copied'), reviewLink, 'success')
    setTimeout(() => setCopied(false), 2000)
  }

  function handleDownload() {
    const canvas = canvasRef.current
    if (!canvas || !merchant) return

    const link = document.createElement('a')
    link.download = `taqyeem-qr-${merchant.slug}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
    showToast(t('action_download'), `taqyeem-qr-${merchant.slug}.png`, 'success')
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Header */}
      <header className="flex flex-col gap-1.5">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-border bg-emerald-surface px-3 py-1 text-xs font-bold text-emerald-deep w-fit shadow-2xs">
          <QrCode className="size-3.5" />
          <span>{isRTL ? 'رمز QR السريع · Quick Access' : 'Quick QR Code Generator'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
          {t('dash_qr_title')}
        </h1>
        <p className="text-sm text-ink-muted">
          {t('dash_qr_subtitle')}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* QR Code Card */}
        <Card className="md:col-span-7 lg:col-span-6 overflow-hidden border-border/80 bg-surface/90 backdrop-blur-md shadow-md transition-all duration-300 hover:shadow-xl">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-lg font-bold text-ink">
              {t('dash_qr_card_title')}
            </CardTitle>
            <CardDescription className="text-xs text-ink-muted">
              {t('dash_qr_card_desc')}
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col items-center gap-5 p-6 pt-2">
            {/* QR Canvas Frame with animated luxury ambient glow */}
            <div className="relative group/qr flex size-60 items-center justify-center rounded-3xl border-2 border-border bg-background p-4 shadow-lg transition-all duration-500 hover:scale-[1.02] hover:border-emerald-border hover:shadow-emerald/10">
              <div className="absolute -inset-1 rounded-[26px] bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-indigo-500/20 blur-md opacity-40 group-hover/qr:opacity-80 transition-opacity" />
              <div className="relative z-10 p-2 bg-white rounded-2xl shadow-inner">
                <QRCodeCanvas
                  ref={canvasRef}
                  value={reviewLink}
                  size={192}
                  marginSize={0}
                  level="M"
                />
              </div>
            </div>

            {/* Review Link Bar */}
            <code className="w-full break-all rounded-xl border border-border bg-background-subtle/80 px-3.5 py-2.5 text-center text-xs font-mono text-ink select-all shadow-2xs">
              {reviewLink}
            </code>

            {/* Action Buttons */}
            <div className="flex w-full flex-col sm:flex-row gap-2.5">
              <Button
                variant="secondary"
                size="default"
                onClick={handleCopy}
                className="flex-1 gap-2 text-xs font-bold transition-all active:scale-95"
              >
                {copied ? <Check className="size-4 text-emerald" /> : <Copy className="size-4" />}
                <span>{copied ? t('action_copied') : t('action_copy')}</span>
              </Button>

              <Button
                variant="primaryGlow"
                size="default"
                onClick={handleDownload}
                className="flex-1 gap-2 text-xs font-bold shadow-md transition-all active:scale-95"
              >
                <Download className="size-4" />
                <span>{t('dash_qr_download_png')}</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Guidance & Pro Tips Card */}
        <div className="md:col-span-5 lg:col-span-6 flex flex-col gap-4">
          <Card className="border-emerald-border/80 bg-gradient-to-br from-emerald-surface/60 via-surface to-surface p-6 shadow-xs transition-all duration-300 hover:shadow-md">
            <div className="flex items-start gap-3.5">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-emerald text-white shadow-md animate-pulse">
                <Sparkles className="size-5" />
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className="text-sm font-bold text-emerald-deep">
                  {t('dash_qr_print_hint')}
                </h3>
                <p className="text-xs text-ink-muted leading-relaxed">
                  {isRTL
                    ? 'يمكنك طباعة الرمز على بطاقات طاولة، ملصقات الأكياس، أو الفواتير المطبوعة. العميل يمسح الرمز بكاميرا الجوال ليفتح صفحة التقييم مباشرة في ثوانٍ بدون أي تطبيق.'
                    : 'Print the code on table cards, packaging stickers, or invoices. Customers scan with their phone camera to instantly submit authentic feedback without any app.'}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-border/80 shadow-xs transition-all duration-300 hover:shadow-md">
            <h4 className="text-xs font-bold text-ink-muted mb-3 flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-emerald" />
              <span>{isRTL ? 'أفضل أماكن لوضع الـ QR' : 'Recommended Placement Spots'}</span>
            </h4>
            <div className="flex flex-col gap-2.5 text-xs text-ink font-medium">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-background-subtle/50 border border-border/40 hover:border-emerald-border/60 transition-colors">
                <span className="text-emerald font-bold">✓</span>
                <span>{isRTL ? 'بجوار شاشة الكاشير / نقطة البيع' : 'Next to cashier screen / POS checkout'}</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-background-subtle/50 border border-border/40 hover:border-emerald-border/60 transition-colors">
                <span className="text-emerald font-bold">✓</span>
                <span>{isRTL ? 'على طاولات الجلوس والاستقبال' : 'On seating tables and reception counters'}</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-background-subtle/50 border border-border/40 hover:border-emerald-border/60 transition-colors">
                <span className="text-emerald font-bold">✓</span>
                <span>{isRTL ? 'ملصق على بوكس الشحن والطلبات الخارجية' : 'Stickers on delivery boxes and takeaway bags'}</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-background-subtle/50 border border-border/40 hover:border-emerald-border/60 transition-colors">
                <span className="text-emerald font-bold">✓</span>
                <span>{isRTL ? 'أسفل الفاتورة أو الإيصال الإلكتروني' : 'Bottom of receipt or digital invoice'}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default DashboardQrPage

