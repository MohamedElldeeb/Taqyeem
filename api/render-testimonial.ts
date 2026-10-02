import type { VercelRequest, VercelResponse } from '@vercel/node'
import chromium from '@sparticuz/chromium'
import { chromium as playwrightChromium } from 'playwright-core'
import { existsSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
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
  let stage = 'executablePath'
  try {
    const executablePath = await chromium.executablePath()
    stage = 'launch'
    browser = await playwrightChromium.launch({
      args: chromium.args,
      executablePath,
      headless: true,
    })

    stage = 'newPage'
    const page = await browser.newPage({ viewport: { width: 1080, height: 1080 }, deviceScaleFactor: 1 })
    const consoleLines: string[] = []
    page.on('console', (msg) => consoleLines.push(`[${msg.type()}] ${msg.text()}`))
    page.on('pageerror', (e) => consoleLines.push(`[pageerror] ${e.message}`))

    const data = {
      heading: typeof heading === 'string' ? heading : undefined,
      quote,
      customer: typeof customer === 'string' ? customer : undefined,
      rating: typeof rating === 'number' ? rating : undefined,
      merchant: typeof merchant === 'string' ? merchant : undefined,
      brandColor: typeof brandColor === 'string' ? brandColor : undefined,
      logoUrl: typeof logoUrl === 'string' ? logoUrl : undefined,
    }

    stage = 'addInitScript'
    await page.addInitScript((d) => {
      ;(window as unknown as { TAQYEEM_DATA: unknown }).TAQYEEM_DATA = d
    }, data)

    stage = 'goto'
    await page.goto(pathToFileURL(templatePath).href)
    stage = 'waitForSelector'
    try {
      await page.waitForSelector('html[data-ready="true"]', { timeout: 15000 })
    } catch (waitErr) {
      const readyState = await page.evaluate(() => document.readyState).catch(() => 'unknown')
      const dataReady = await page.evaluate(() => document.documentElement.getAttribute('data-ready')).catch(() => 'unknown')
      const hasRenderFn = await page.evaluate(() => typeof (window as unknown as { taqyeemRender?: unknown }).taqyeemRender).catch(() => 'unknown')
      throw new Error(
        `${(waitErr as Error).message} | readyState=${readyState} dataReady=${dataReady} taqyeemRender=${hasRenderFn} console=${JSON.stringify(consoleLines)}`,
      )
    }

    stage = 'eval'
    const overflow = await page.$eval('[data-slot="quote"]', (el) => (el as HTMLElement).dataset.overflow)

    stage = 'screenshot'
    const png = await page.screenshot({ clip: { x: 0, y: 0, width: 1080, height: 1080 } })

    res.setHeader('Content-Type', 'image/png')
    if (overflow === 'true') res.setHeader('X-Taqyeem-Overflow', 'true')
    res.status(200).send(png)
  } catch (err) {
    console.error('render failed at', stage, err)
    const message = err instanceof Error ? err.message : String(err)
    const stack = err instanceof Error ? err.stack : undefined
    res.status(500).json({ error: 'render_failed', stage, message, stack })
  } finally {
    if (browser) await browser.close().catch(() => {})
  }
}
