import * as React from 'react'
import { Check, Copy, Download } from 'lucide-react'
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

/**
 * Review link + QR. Encodes the real /r/{slug} URL for the authenticated
 * merchant — the slug is the existing source of truth (useMerchant()),
 * never regenerated or duplicated here. The QR is generated entirely
 * client-side (qrcode.react → canvas); nothing is stored in Supabase.
 */
function DashboardQrPage() {
  const { merchant } = useMerchant()
  const [copied, setCopied] = React.useState(false)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const reviewLink = `${window.location.origin}/r/${merchant?.slug ?? ''}`

  async function handleCopy() {
    await navigator.clipboard.writeText(reviewLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleDownload() {
    const canvas = canvasRef.current
    if (!canvas || !merchant) return

    const link = document.createElement('a')
    link.download = `taqyeem-qr-${merchant.slug}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-ink">QR Code</h1>
        <p className="text-muted-text">
          اطلب من عملائك مسح الرمز لترك تقييم مباشرة على صفحتك.
        </p>
      </header>

      <Card className="max-w-sm">
        <CardHeader>
          <CardTitle>رمز الاستجابة السريعة</CardTitle>
          <CardDescription>يوصل عملاءك مباشرة لرابط تقييمك.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <div className="flex size-48 items-center justify-center rounded-md border border-border bg-surface p-3">
            <QRCodeCanvas
              ref={canvasRef}
              value={reviewLink}
              size={176}
              marginSize={0}
              level="M"
            />
          </div>
          <code className="w-full break-all rounded-md border border-border bg-muted-surface px-3 py-2 text-center text-sm text-ink">
            {reviewLink}
          </code>
          <div className="flex w-full gap-2">
            <Button variant="secondary" size="sm" onClick={handleCopy} className="flex-1">
              {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
              {copied ? 'تم النسخ' : 'نسخ الرابط'}
            </Button>
            <Button variant="secondary" size="sm" onClick={handleDownload} className="flex-1">
              <Download className="size-4" />
              تحميل QR
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default DashboardQrPage
