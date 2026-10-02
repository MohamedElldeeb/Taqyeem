import type { TemplateId } from '@/lib/testimonial-templates'

interface TemplatePreviewProps {
  templateId: TemplateId
  size?: number
  className?: string
}

export function TemplatePreview({ templateId, size, className }: TemplatePreviewProps) {
  const fluid = !size || size <= 0
  const src = '/template-previews/' + templateId + '.png'
  return (
    <img
      src={src}
      alt=""
      className={className}
      style={
        fluid
          ? { width: '100%', aspectRatio: '1 / 1', objectFit: 'cover', display: 'block' }
          : { width: size, height: size, objectFit: 'cover', borderRadius: 12, display: 'block' }
      }
    />
  )
}
