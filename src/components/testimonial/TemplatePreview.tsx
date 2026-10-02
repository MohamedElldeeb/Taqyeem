import type { TemplateId } from '@/lib/testimonial-templates'

/**
 * Real reference screenshot of the approved template (the exact HTML/CSS
 * design, rendered once at its default brand color) — not a hand-built
 * CSS approximation. Approximating these from inline styles drifted from
 * the real design in practice, so the picker now shows the actual
 * reference output instead.
 */
interface TemplatePreviewProps {
  templateId: TemplateId
  size?: number
}

export function TemplatePreview({ templateId, size = 180 }: TemplatePreviewProps) {
  return (
    <img
      src={`/template-previews/${templateId}.png`}
      alt=""
      width={size}
      height={size}
      style={{ width: size, height: size, objectFit: 'cover', borderRadius: 12, display: 'block' }}
    />
  )
}
