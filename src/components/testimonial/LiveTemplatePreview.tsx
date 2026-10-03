import * as React from 'react'

import type { TemplateId } from '@/lib/testimonial-templates'

/**
 * Live preview of the real template: loads the exact HTML/CSS file into an
 * iframe at its native 1080x1080 size (so every color-mix()/gradient/blur
 * computes exactly as it does in the final render), then CSS-scales the
 * iframe box down to the thumbnail size. Unlike a static reference
 * screenshot, this calls the template's own `window.taqyeemRender(data)`
 * whenever `brandColor` changes, so the merchant sees their actual brand
 * color applied to the real design before picking it — not an approximation.
 *
 * Sizing mirrors TemplatePreview's "fluid" mode (fills the container width,
 * 1:1 aspect ratio) when `size` is omitted, measured via ResizeObserver
 * since the iframe itself needs an explicit pixel scale factor.
 */
interface LiveTemplatePreviewProps {
  templateId: TemplateId
  brandColor: string
  size?: number
  className?: string
}

const CANVAS_PX = 1080

const DEMO_DATA = {
  heading: undefined,
  quote: 'الخدمة كانت ممتازة جدًا والتعامل راقي، أكيد هرجع لكم تاني.',
  customer: 'محمد أحمد',
  rating: 5,
  merchant: 'Taqyeem',
  logoUrl: undefined,
}

const htmlCache = new Map<TemplateId, Promise<string>>()

function loadTemplateHtml(templateId: TemplateId): Promise<string> {
  let cached = htmlCache.get(templateId)
  if (!cached) {
    cached = fetch(`/templates/${templateId}.html`)
      .then((res) => res.text())
      .then((html) => html.replace('<head>', '<head>\n<base href="/templates/">'))
    htmlCache.set(templateId, cached)
  }
  return cached
}

export function LiveTemplatePreview({ templateId, brandColor, size, className }: LiveTemplatePreviewProps) {
  const fluid = !size || size <= 0
  const wrapperRef = React.useRef<HTMLDivElement>(null)
  const iframeRef = React.useRef<HTMLIFrameElement>(null)
  const [srcDoc, setSrcDoc] = React.useState<string | null>(null)
  const [ready, setReady] = React.useState(false)
  const [measuredSize, setMeasuredSize] = React.useState(size ?? 180)

  React.useEffect(() => {
    if (!fluid) return
    const el = wrapperRef.current
    if (!el) return
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width
      if (width) setMeasuredSize(width)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [fluid])

  React.useEffect(() => {
    let cancelled = false
    setReady(false)
    loadTemplateHtml(templateId).then((html) => {
      if (!cancelled) setSrcDoc(html)
    })
    return () => {
      cancelled = true
    }
  }, [templateId])

  const render = React.useCallback(() => {
    const win = iframeRef.current?.contentWindow as (Window & { taqyeemRender?: (d: unknown) => void }) | null
    if (win?.taqyeemRender) {
      win.taqyeemRender({ ...DEMO_DATA, brandColor })
    }
  }, [brandColor])

  React.useEffect(() => {
    if (ready) render()
  }, [ready, render])

  const displaySize = fluid ? measuredSize : size!
  const scale = displaySize / CANVAS_PX

  return (
    <div
      ref={wrapperRef}
      className={className}
      style={
        fluid
          ? { width: '100%', aspectRatio: '1 / 1', overflow: 'hidden', position: 'relative' }
          : { width: displaySize, height: displaySize, overflow: 'hidden', position: 'relative', borderRadius: 12 }
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
          onLoad={() => setReady(true)}
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
          }}
        />
      )}
    </div>
  )
}
