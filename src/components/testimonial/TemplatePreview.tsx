import type { TemplateId } from '@/lib/testimonial-templates'

/**
 * Live miniature of each approved testimonial template — same composition
 * and colors as the production SVG renderer (supabase/functions/
 * taqyeem-generation-pipeline/templates.ts), scaled down for the
 * merchant-facing picker. Sample content only; the real render uses the
 * exact customer review/name/rating/logo.
 */

const SAMPLE_QUOTE = 'الخدمة كانت ممتازة جدًا والتعامل راقي، أكيد هرجع لكم تاني.'
const SAMPLE_NAME = 'محمد أحمد'
const HEADING = 'آراء عملاؤنا'

function Stars({ color = '#F2B600' }: { color?: string }) {
  return <span style={{ color, letterSpacing: 2 }}>★★★★★</span>
}

function Artboard({ children, background }: { children: React.ReactNode; background: string }) {
  return (
    <div
      dir="rtl"
      style={{
        width: 1080,
        height: 1080,
        position: 'relative',
        overflow: 'hidden',
        background,
        fontFamily: "'Cairo', 'Segoe UI', Tahoma, sans-serif",
        boxSizing: 'border-box',
      }}
    >
      {children}
    </div>
  )
}

function NeonPreview({ brand }: { brand: string }) {
  return (
    <Artboard background="#060A14">
      <div style={{ position: 'absolute', inset: 88, display: 'flex', flexDirection: 'column', gap: 40, color: '#F4F6FB' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ padding: '10px 28px', border: `2px solid ${brand}`, borderRadius: 999, color: brand, fontSize: 26, fontWeight: 700 }}>{HEADING}</div>
          <Stars color="#FFC83D" />
        </div>
        <p style={{ fontSize: 56, fontWeight: 700, lineHeight: 1.5 }}>{SAMPLE_QUOTE}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 36, fontWeight: 700, color: '#fff' }}>{SAMPLE_NAME}</div>
          <div style={{ fontSize: 24, color: 'rgba(244,246,251,0.72)' }}>Taqyeem</div>
        </div>
      </div>
    </Artboard>
  )
}

function LuxuryPreview({ brand }: { brand: string }) {
  return (
    <Artboard background="radial-gradient(ellipse at 50% 0%, #2A2A2E 0%, #18181B 55%, #121214 100%)">
      <div style={{ position: 'absolute', inset: 124, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 36, color: '#F2ECE0' }}>
        <div style={{ fontSize: 26, color: '#C9A96E' }}>{HEADING}</div>
        <p style={{ fontSize: 52, lineHeight: 1.7 }}>{SAMPLE_QUOTE}</p>
        <Stars color="#D4AF37" />
        <div style={{ fontSize: 32, fontWeight: 600 }}>{SAMPLE_NAME}</div>
        <div style={{ width: 48, height: 3, background: brand }} />
      </div>
    </Artboard>
  )
}

function MinimalPreview({ brand }: { brand: string }) {
  return (
    <Artboard background="#F5F2EC">
      <div style={{ position: 'absolute', left: -300, bottom: -300, width: 600, height: 600, borderRadius: '50%', background: brand }} />
      <div style={{ position: 'absolute', inset: 88, color: '#111' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 26, fontWeight: 700 }}>{HEADING}</div>
          <div style={{ fontSize: 20, color: '#555' }}>Taqyeem</div>
        </div>
        <p style={{ fontSize: 62, fontWeight: 800, marginTop: 120 }}>{SAMPLE_QUOTE}</p>
        <div style={{ position: 'absolute', bottom: 0, left: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ fontSize: 34, fontWeight: 800 }}>{SAMPLE_NAME}</div>
          <Stars color="#F2B600" />
        </div>
      </div>
    </Artboard>
  )
}

function OrganicPreview({ brand }: { brand: string }) {
  return (
    <Artboard background="#F1E6D3">
      <div style={{ position: 'absolute', inset: '140px 120px', background: '#FBF6EC', borderRadius: 32, padding: '64px 76px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 28, color: '#2E2419' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 25, color: '#6E5A43' }}>
            <span style={{ width: 12, height: 12, borderRadius: '50%', background: brand, display: 'inline-block' }} />
            {HEADING}
          </div>
          <Stars color="#E0A82E" />
        </div>
        <p style={{ fontSize: 46, fontWeight: 600, lineHeight: 1.7, flexGrow: 1 }}>{SAMPLE_QUOTE}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E4D7C1', paddingTop: 20 }}>
          <div style={{ fontSize: 32, fontWeight: 700 }}>{SAMPLE_NAME}</div>
          <div style={{ fontSize: 21, color: '#8A7760' }}>Taqyeem</div>
        </div>
      </div>
    </Artboard>
  )
}

function BoldPreview({ brand }: { brand: string }) {
  return (
    <Artboard background="#111111">
      <div style={{ position: 'absolute', top: 0, right: 0, width: 620, height: 330, background: brand, padding: '76px 88px 0 0', boxSizing: 'border-box', color: '#fff' }}>
        <div style={{ fontSize: 44, fontWeight: 900 }}>{HEADING}</div>
        <div style={{ marginTop: 22 }}><Stars color="#FFC83D" /></div>
      </div>
      <p style={{ position: 'absolute', top: 400, right: 88, left: 88, fontSize: 56, fontWeight: 800, lineHeight: 1.5, color: '#fff' }}>{SAMPLE_QUOTE}</p>
      <div style={{ position: 'absolute', right: 88, bottom: 96, color: '#fff' }}>
        <div style={{ width: 64, height: 6, background: brand, marginBottom: 14 }} />
        <div style={{ fontSize: 36, fontWeight: 800 }}>{SAMPLE_NAME}</div>
      </div>
      <div style={{ position: 'absolute', left: 0, bottom: 0, width: 400, height: 170, background: '#E8E4DC', display: 'flex', alignItems: 'center', padding: '0 88px', fontSize: 26, fontWeight: 800, color: '#111' }}>Taqyeem</div>
    </Artboard>
  )
}

function MagazinePreview({ brand }: { brand: string }) {
  return (
    <Artboard background="#E5DFD5">
      <div style={{ position: 'absolute', top: 80, right: 88, left: 88, display: 'flex', justifyContent: 'space-between', borderTop: '3px solid #1A1A1A', borderBottom: '1px solid #1A1A1A', paddingTop: 14, paddingBottom: 14, color: '#1A1A1A' }}>
        <div style={{ fontSize: 32, fontWeight: 900 }}>{HEADING}</div>
        <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: 3 }}>TAQYEEM</div>
      </div>
      <div style={{ position: 'absolute', top: 250, right: 150, width: 800, height: 720, background: brand, transform: 'rotate(-4deg)' }} />
      <div style={{ position: 'absolute', top: 236, right: 120, bottom: 112, left: 120, background: '#FFFDF8', padding: '56px 72px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 20, color: '#1A1A1A' }}>
        <p style={{ fontSize: 48, fontWeight: 700, lineHeight: 1.6, flexGrow: 1 }}>{SAMPLE_QUOTE}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #1A1A1A', paddingTop: 20 }}>
          <div style={{ fontSize: 30, fontWeight: 800 }}>{SAMPLE_NAME}</div>
          <Stars color="#E8A800" />
        </div>
      </div>
    </Artboard>
  )
}

function SoftPreview({ brand }: { brand: string }) {
  return (
    <Artboard background="#ECE6DF">
      <div style={{ position: 'absolute', top: -220, right: -180, width: 700, height: 700, borderRadius: '50%', background: `radial-gradient(circle, ${brand}40 0%, ${brand}00 70%)` }} />
      <div style={{ position: 'absolute', inset: 96, background: '#FAF7F3', borderRadius: 56, padding: '72px 80px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 32, color: '#2A2420' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ padding: '12px 24px', borderRadius: 999, background: `${brand}1F`, fontSize: 24, fontWeight: 600 }}>{HEADING}</div>
          <Stars color="#E5AE2E" />
        </div>
        <p style={{ fontSize: 46, fontWeight: 500, lineHeight: 1.7, flexGrow: 1 }}>{SAMPLE_QUOTE}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderRadius: 32, background: '#F2EDE7' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: brand, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 700 }}>م</div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>{SAMPLE_NAME}</div>
          </div>
          <div style={{ fontSize: 18, color: '#7A6F66' }}>Taqyeem</div>
        </div>
      </div>
    </Artboard>
  )
}

function BrutalistPreview({ brand }: { brand: string }) {
  return (
    <Artboard background="#F0F0EE">
      <div style={{ position: 'absolute', inset: 56, border: '5px solid #0A0A0A', display: 'flex', flexDirection: 'column' }}>
        <div style={{ height: 210, display: 'flex', borderBottom: '5px solid #0A0A0A' }}>
          <div style={{ flexGrow: 1, background: '#0A0A0A', display: 'flex', alignItems: 'center', padding: '0 56px', color: '#F0F0EE', fontSize: 46, fontWeight: 900 }}>{HEADING}</div>
          <div style={{ width: 300, background: brand, display: 'flex', alignItems: 'center', padding: '0 40px', fontSize: 22, fontWeight: 800, color: '#0A0A0A' }}>Taqyeem</div>
        </div>
        <div style={{ flexGrow: 1, padding: '48px 56px', display: 'flex', alignItems: 'center', color: '#0A0A0A' }}>
          <p style={{ fontSize: 54, fontWeight: 900, lineHeight: 1.4, margin: 0 }}>{SAMPLE_QUOTE}</p>
        </div>
        <div style={{ height: 160, display: 'flex', borderTop: '5px solid #0A0A0A' }}>
          <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 20, padding: '0 56px', fontSize: 36, fontWeight: 800, color: '#0A0A0A' }}>{SAMPLE_NAME}</div>
          <div style={{ width: 300, background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Stars color="#FFC21A" />
          </div>
        </div>
      </div>
    </Artboard>
  )
}

const ARTBOARDS: Record<TemplateId, (props: { brand: string }) => React.ReactElement> = {
  neon: NeonPreview,
  luxury: LuxuryPreview,
  minimal: MinimalPreview,
  organic: OrganicPreview,
  bold: BoldPreview,
  magazine: MagazinePreview,
  soft: SoftPreview,
  brutalist: BrutalistPreview,
}

interface TemplatePreviewProps {
  templateId: TemplateId
  brandColor: string
  size?: number
}

export function TemplatePreview({ templateId, brandColor, size = 180 }: TemplatePreviewProps) {
  const Board = ARTBOARDS[templateId] ?? ARTBOARDS.neon
  const scale = size / 1080

  return (
    <div style={{ width: size, height: size, overflow: 'hidden', borderRadius: 12 }}>
      <div style={{ width: 1080, height: 1080, transform: `scale(${scale})`, transformOrigin: 'top right' }}>
        <Board brand={brandColor} />
      </div>
    </div>
  )
}
