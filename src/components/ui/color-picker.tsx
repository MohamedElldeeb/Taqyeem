import * as React from 'react'

import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

/**
 * Full HSV color picker — saturation/value field + hue strip + hex input,
 * like a design tool's picker (not a handful of fixed swatches). Pointer
 * events unify mouse and touch, so dragging works the same on desktop and
 * mobile. A few quick presets stay underneath for convenience, but they
 * are shortcuts into the same continuous picker, not the only choice.
 */

interface Hsv {
  h: number // 0-360
  s: number // 0-1
  v: number // 0-1
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const m = /^#?([0-9a-fA-F]{6})$/.exec(hex.trim())
  if (!m) return null
  const int = parseInt(m[1], 16)
  return { r: (int >> 16) & 255, g: (int >> 8) & 255, b: int & 255 }
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => Math.round(Math.max(0, Math.min(255, n))).toString(16).padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase()
}

function rgbToHsv(r: number, g: number, b: number): Hsv {
  const rn = r / 255
  const gn = g / 255
  const bn = b / 255
  const max = Math.max(rn, gn, bn)
  const min = Math.min(rn, gn, bn)
  const d = max - min
  let h = 0
  if (d !== 0) {
    if (max === rn) h = ((gn - bn) / d) % 6
    else if (max === gn) h = (bn - rn) / d + 2
    else h = (rn - gn) / d + 4
    h *= 60
    if (h < 0) h += 360
  }
  const s = max === 0 ? 0 : d / max
  const v = max
  return { h, s, v }
}

function hsvToRgb(h: number, s: number, v: number): { r: number; g: number; b: number } {
  const c = v * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = v - c
  let r = 0
  let g = 0
  let b = 0
  if (h < 60) [r, g, b] = [c, x, 0]
  else if (h < 120) [r, g, b] = [x, c, 0]
  else if (h < 180) [r, g, b] = [0, c, x]
  else if (h < 240) [r, g, b] = [0, x, c]
  else if (h < 300) [r, g, b] = [x, 0, c]
  else [r, g, b] = [c, 0, x]
  return { r: (r + m) * 255, g: (g + m) * 255, b: (b + m) * 255 }
}

function hsvToHex(hsv: Hsv): string {
  const { r, g, b } = hsvToRgb(hsv.h, hsv.s, hsv.v)
  return rgbToHex(r, g, b)
}

const QUICK_PRESETS = ['#087F5B', '#A9431E', '#1D4ED8', '#7C3AED', '#C9A96E', '#E2502B', '#111111']

export interface ColorPickerProps {
  value: string
  onChange: (hex: string) => void
  className?: string
}

function usePointerDrag(
  ref: React.RefObject<HTMLDivElement | null>,
  onMove: (x: number, y: number) => void,
) {
  const dragging = React.useRef(false)

  const handlePoint = React.useCallback(
    (clientX: number, clientY: number) => {
      const el = ref.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
      const y = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height))
      onMove(x, y)
    },
    [ref, onMove],
  )

  const onPointerDown = React.useCallback(
    (e: React.PointerEvent) => {
      dragging.current = true
      ;(e.target as Element).setPointerCapture(e.pointerId)
      handlePoint(e.clientX, e.clientY)
    },
    [handlePoint],
  )

  const onPointerMove = React.useCallback(
    (e: React.PointerEvent) => {
      if (!dragging.current) return
      handlePoint(e.clientX, e.clientY)
    },
    [handlePoint],
  )

  const onPointerUp = React.useCallback((e: React.PointerEvent) => {
    dragging.current = false
    try {
      ;(e.target as Element).releasePointerCapture(e.pointerId)
    } catch {
      // ignore — capture may already be released
    }
  }, [])

  return { onPointerDown, onPointerMove, onPointerUp }
}

function ColorPicker({ value, onChange, className }: ColorPickerProps) {
  const rgb = hexToRgb(value) ?? { r: 8, g: 127, b: 91 }
  const hsv = React.useMemo(() => rgbToHsv(rgb.r, rgb.g, rgb.b), [rgb.r, rgb.g, rgb.b])
  const [hexInput, setHexInput] = React.useState(value)

  React.useEffect(() => {
    setHexInput(value)
  }, [value])

  const svRef = React.useRef<HTMLDivElement>(null)
  const hueRef = React.useRef<HTMLDivElement>(null)

  const svDrag = usePointerDrag(svRef, (x, y) => {
    onChange(hsvToHex({ h: hsv.h, s: x, v: 1 - y }))
  })
  const hueDrag = usePointerDrag(hueRef, (x) => {
    onChange(hsvToHex({ h: x * 360, s: hsv.s, v: hsv.v }))
  })

  function commitHex(raw: string) {
    const normalized = raw.startsWith('#') ? raw : `#${raw}`
    if (hexToRgb(normalized)) {
      onChange(normalized.toUpperCase())
    }
  }

  const hueColor = hsvToHex({ h: hsv.h, s: 1, v: 1 })

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <div
        ref={svRef}
        onPointerDown={svDrag.onPointerDown}
        onPointerMove={svDrag.onPointerMove}
        onPointerUp={svDrag.onPointerUp}
        className="relative h-40 w-full touch-none rounded-lg"
        style={{
          backgroundColor: hueColor,
          backgroundImage:
            'linear-gradient(to top, #000, rgba(0,0,0,0)), linear-gradient(to right, #fff, rgba(255,255,255,0))',
          cursor: 'crosshair',
        }}
      >
        <div
          className="pointer-events-none absolute size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.3)]"
          style={{ left: `${hsv.s * 100}%`, top: `${(1 - hsv.v) * 100}%`, backgroundColor: value }}
        />
      </div>

      <div
        ref={hueRef}
        onPointerDown={hueDrag.onPointerDown}
        onPointerMove={hueDrag.onPointerMove}
        onPointerUp={hueDrag.onPointerUp}
        className="relative h-4 w-full touch-none rounded-full"
        style={{
          background:
            'linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)',
          cursor: 'pointer',
        }}
      >
        <div
          className="pointer-events-none absolute top-1/2 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.3)]"
          style={{ left: `${(hsv.h / 360) * 100}%`, backgroundColor: hueColor }}
        />
      </div>

      <div className="flex items-center gap-3">
        <div
          className="size-9 shrink-0 rounded-md border border-border"
          style={{ backgroundColor: value }}
          aria-hidden
        />
        <Input
          aria-label="كود اللون (Hex)"
          dir="ltr"
          value={hexInput}
          onChange={(event) => setHexInput(event.target.value)}
          onBlur={() => commitHex(hexInput)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') commitHex(hexInput)
          }}
          className="font-mono"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2.5 py-1.5 px-1 overflow-x-auto scrollbar-hidden overscroll-contain">
        {QUICK_PRESETS.map((preset) => (
          <button
            key={preset}
            type="button"
            aria-label={preset}
            onClick={() => onChange(preset)}
            className="size-7 shrink-0 rounded-full transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2"
            style={{
              backgroundColor: preset,
              outline: value.toUpperCase() === preset.toUpperCase() ? `2px solid ${preset}` : undefined,
              outlineOffset: 2,
            }}
          />
        ))}
      </div>
    </div>
  )
}

export { ColorPicker }
