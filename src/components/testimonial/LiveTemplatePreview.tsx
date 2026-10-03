import * as React from 'react'

import { DEFAULT_BRAND_BY_TEMPLATE, type TemplateId } from '@/lib/testimonial-templates'

export interface LiveTemplateData {
  heading?: string
  quote?: string
  customer?: string
  rating?: number
  merchant?: string
  logoUrl?: string
}

interface LiveTemplatePreviewProps {
  templateId: TemplateId
  brandColor?: string
  size?: number
  className?: string
  data?: LiveTemplateData
}

const CANVAS_PX = 1080

const DEFAULT_DEMO_DATA: LiveTemplateData = {
  quote: 'الخدمة كانت ممتازة جدًا والتعامل راقي، أكيد هرجع لكم تاني.',
  customer: 'محمد أحمد',
  rating: 5,
  merchant: 'Taqyeem',
}

const htmlCache = new Map<TemplateId, Promise<string>>()

function loadTemplateHtml(templateId: TemplateId): Promise<string> {
  let cached = htmlCache.get(templateId)
  if (!cached) {
    cached = fetch(`/templates/${templateId}.html`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.text()
      })
      .then((html) => html.replace('<head>', '<head>\n<base href="/templates/">'))
    htmlCache.set(templateId, cached)
  }
  return cached
}

export function LiveTemplatePreview({
  templateId,
  brandColor,
  size,
  className,
  data,
}: LiveTemplatePreviewProps) {
  const fluid = !size || size <= 0
  const wrapperRef = React.useRef<HTMLDivElement>(null)
  const iframeRef = React.useRef<HTMLIFrameElement>(null)
  const [srcDoc, setSrcDoc] = React.useState<string | null>(null)
  const [ready, setReady] = React.useState(false)
  const [measuredSize, setMeasuredSize] = React.useState(size ?? 180)

  const effectiveBrand = brandColor || DEFAULT_BRAND_BY_TEMPLATE[templateId] || '#22D3EE'

  React.useEffect(() => {
    if (!fluid) return
    const el = wrapperRef.current
    if (!el) return
    
    // Immediate measurement
    const rect = el.getBoundingClientRect()
    if (rect.width > 0) setMeasuredSize(rect.width)

    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width
      if (width && width > 0) setMeasuredSize(width)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [fluid])

  React.useEffect(() => {
    let cancelled = false
    setReady(false)
    loadTemplateHtml(templateId)
      .then((html) => {
        if (!cancelled) setSrcDoc(html)
      })
      .catch((err) => {
        console.warn('Failed to load template:', templateId, err)
      })
    return () => {
      cancelled = true
    }
  }, [templateId])

  const render = React.useCallback(() => {
    const win = iframeRef.current?.contentWindow as (Window & { taqyeemRender?: (d: unknown) => void }) | null
    if (win?.taqyeemRender) {
      win.taqyeemRender({
        ...DEFAULT_DEMO_DATA,
        ...data,
        brandColor: effectiveBrand,
      })
    }
  }, [effectiveBrand, data])

  React.useEffect(() => {
    if (ready) render()
  }, [ready, render])

  const displaySize = fluid ? Math.max(measuredSize || 180, 80) : size!
  const scale = displaySize / CANVAS_PX

  return (
    <div
      ref={wrapperRef}
      className={`relative overflow-hidden select-none bg-slate-950 ${className ?? ''}`}
      style={
        fluid
          ? { width: '100%', height: '100%' }
          : { width: displaySize, height: displaySize, borderRadius: 12 }
      }
    >
      {srcDoc && (
        <iframe
          ref={iframeRef}
          srcDoc={srcDoc}
          title={templateId}
          scrolling="no"
          tabIndex={-1}
          aria-hidden="true"
          onLoad={() => {
            setReady(true)
            const win = iframeRef.current?.contentWindow as (Window & { taqyeemRender?: (d: unknown) => void }) | null
            if (win?.taqyeemRender) {
              win.taqyeemRender({
                ...DEFAULT_DEMO_DATA,
                ...data,
                brandColor: effectiveBrand,
              })
            }
          }}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: CANVAS_PX,
            height: CANVAS_PX,
            border: 'none',
            pointerEvents: 'none',
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            opacity: ready ? 1 : 0,
            transition: 'opacity 0.2s ease',
          }}
        />
      )}
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs">
          <div
            className="size-5 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: effectiveBrand, borderTopColor: 'transparent' }}
          />
        </div>
      )}
    </div>
  )
}
