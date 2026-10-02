import type { VercelRequest, VercelResponse } from '@vercel/node'
import chromium from '@sparticuz/chromium'
import { chromium as playwrightChromium } from 'playwright-core'
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'

/**
 * Renders one of the 8 approved testimonial templates (api/_templates/*.html
 * — the exact HTML/CSS source, not a re-implementation) with headless
 * Chromium and returns a 1080x1080 PNG. This is the only rendering method
 * that reproduces the designs exactly, per the templates' own README —
 * Satori/canvas/SVG re-implementations drift from the real CSS output.
 *
 * Called server-side only, by the Supabase Edge Function
 * (taqyeem-generation-pipeline), authenticated with a shared secret header
 * — never reachable from the browser or billed to an anonymous caller.
 */

/**
 * Templates reference fonts via `url('../fonts/<file>.ttf')`, resolved
 * relative to the template's own path. Chromium's own file:// fetch for
 * these has proven unreliable in the Vercel serverless environment (the
 * bundled file is intermittently reported as ERR_FILE_NOT_FOUND even
 * though Node's own fs can always see it) — inlining the font bytes as
 * data: URIs removes that separate fetch entirely.
 */
const fontDataUriCache = new Map<string, string>()
function inlineFonts(html: string): string {
  return html.replace(/url\('\.\.\/fonts\/([^']+)'\)/g, (match, fileName: string) => {
    let dataUri = fontDataUriCache.get(fileName)
    if (!dataUri) {
      const fontPath = path.join(process.cwd(), 'api', 'fonts', fileName)
      const base64 = readFileSync(fontPath).toString('base64')
      dataUri = `url('data:font/ttf;base64,${base64}')`
      fontDataUriCache.set(fileName, dataUri)
    }
    return dataUri
  })
}

const TEMPLATE_IDS = new Set([
  '01-neon-editorial',
  '02-luxury-editorial',
  '03-minimal-modern',
  '04-warm-organic',
  '05-bold-contemporary',
  '06-magazine-editorial',
  '07-soft-premium',
  '08-brutalist-modern',
])

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method_not_allowed' })
    return
  }

  const secret = req.headers['x-render-secret']
  if (!process.env.RENDER_SECRET || secret !== process.env.RENDER_SECRET) {
    res.status(401).json({ error: 'unauthorized' })
    return
  }

  const { templateId, heading, quote, customer, rating, merchant, brandColor, logoUrl } =
    (req.body ?? {}) as Record<string, unknown>

  if (typeof templateId !== 'string' || !TEMPLATE_IDS.has(templateId)) {
    res.status(400).json({ error: 'unknown_template' })
    return
  }
  if (typeof quote !== 'string' || !quote.trim()) {
    res.status(400).json({ error: 'quote_required' })
    return
  }

  const templatePath = path.join(process.cwd(), 'api', '_templates', `${templateId}.html`)
  if (!existsSync(templatePath)) {
    res.status(500).json({ error: 'template_file_missing' })
    return
  }

  let browser
  try {
    const executablePath = await chromium.executablePath()
    browser = await playwrightChromium.launch({
      args: chromium.args,
      executablePath,
      headless: true,
    })

    const page = await browser.newPage({ viewport: { width: 1080, height: 1080 }, deviceScaleFactor: 1 })

    const data = {
      heading: typeof heading === 'string' ? heading : undefined,
      quote,
      customer: typeof customer === 'string' ? customer : undefined,
      rating: typeof rating === 'number' ? rating : undefined,
      merchant: typeof merchant === 'string' ? merchant : undefined,
      brandColor: typeof brandColor === 'string' ? brandColor : undefined,
      logoUrl: typeof logoUrl === 'string' ? logoUrl : undefined,
    }

    await page.addInitScript((d) => {
      ;(window as unknown as { TAQYEEM_DATA: unknown }).TAQYEEM_DATA = d
    }, data)

    const html = inlineFonts(readFileSync(templatePath, 'utf-8'))
    await page.setContent(html, { waitUntil: 'load' })
    await page.waitForSelector('html[data-ready="true"]', { timeout: 15000 })

    const overflow = await page.$eval('[data-slot="quote"]', (el) => (el as HTMLElement).dataset.overflow)

    const png = await page.screenshot({ clip: { x: 0, y: 0, width: 1080, height: 1080 } })

    res.setHeader('Content-Type', 'image/png')
    if (overflow === 'true') res.setHeader('X-Taqyeem-Overflow', 'true')
    res.status(200).send(png)
  } catch (err) {
    console.error('render failed', err)
    res.status(500).json({ error: 'render_failed' })
  } finally {
    if (browser) await browser.close().catch(() => {})
  }
}
