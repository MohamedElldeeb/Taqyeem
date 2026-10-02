import * as React from 'react'
import { useTheme } from '@/lib/theme-context'
import { cn } from '@/lib/utils'

interface AnimatedBackgroundProps {
  variant?: 'hero' | 'subtle' | 'mesh' | 'brand' | 'minimal' | 'auth-dark' | 'auth'
  brandColor?: string
  showGrid?: boolean
  showDots?: boolean
  showParticles?: boolean
  showBeam?: boolean
  showSpotlight?: boolean
  className?: string
}

export function AnimatedBackground({
  variant = 'hero',
  brandColor,
  showGrid = true,
  showDots = true,
  showParticles = true,
  showBeam = true,
  showSpotlight = false,
  className,
}: AnimatedBackgroundProps) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  const primaryColor = brandColor || (isDark ? '#059669' : '#10b981')
  const [mousePos, setMousePos] = React.useState({ x: 50, y: 50 })

  React.useEffect(() => {
    if (!showSpotlight) return
    const handleMouseMove = (e: MouseEvent) => {
      const x = Math.round((e.clientX / window.innerWidth) * 100)
      const y = Math.round((e.clientY / window.innerHeight) * 100)
      setMousePos({ x, y })
    }
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [showSpotlight])

  // Auth / Focus Page Layout with Signature 3-Part Radial Gradient Composition
  if (variant === 'auth-dark' || variant === 'auth') {
    return (
      <div
        className={cn(
          'pointer-events-none fixed inset-0 overflow-hidden z-0 select-none transition-colors duration-500',
          isDark ? 'bg-[#020707]' : 'bg-white',
          className,
        )}
        aria-hidden
      >
        {/* Dynamic Dual-Mode Radial Gradient */}
        <div
          className="absolute inset-0 transition-all duration-500"
          style={{
            background: isDark
              ? 'radial-gradient(95% 75% at 85% 0%, rgba(5, 150, 105, 0.376) 0%, rgba(5, 150, 105, 0.145) 35%, transparent 75%), radial-gradient(500px at 15% 95%, rgba(13, 148, 136, 0.18) 0%, transparent 70%), linear-gradient(rgb(5, 21, 19) 0%, rgb(3, 13, 12) 55%, rgb(2, 7, 7) 100%)'
              : 'radial-gradient(95% 75% at 85% 0%, rgba(16, 185, 129, 0.22) 0%, rgba(16, 185, 129, 0.06) 35%, transparent 75%), radial-gradient(500px at 15% 95%, rgba(13, 148, 136, 0.14) 0%, transparent 70%), linear-gradient(rgb(255, 255, 255) 0%, rgb(250, 250, 249) 55%, rgb(244, 244, 245) 100%)',
          }}
        />

        {/* Dynamic Drifting Emerald Luminous Orb (Top End) */}
        <div
          className="absolute -top-24 end-8 size-[580px] rounded-full blur-[130px] animate-orb-1 opacity-70"
          style={{
            background: isDark
              ? 'radial-gradient(circle, rgba(16, 185, 129, 0.55) 0%, rgba(5, 150, 105, 0.25) 55%, transparent 100%)'
              : 'radial-gradient(circle, rgba(16, 185, 129, 0.28) 0%, rgba(5, 150, 105, 0.1) 55%, transparent 100%)',
          }}
        />

        {/* Secondary Ambient Teal Orb (Bottom Start) */}
        <div
          className="absolute -bottom-20 start-6 size-[460px] rounded-full blur-[140px] animate-orb-2 opacity-35"
          style={{
            background: isDark
              ? 'radial-gradient(circle, rgba(13, 148, 136, 0.45) 0%, rgba(15, 23, 42, 0.2) 65%, transparent 100%)'
              : 'radial-gradient(circle, rgba(13, 148, 136, 0.22) 0%, rgba(240, 253, 250, 0.1) 65%, transparent 100%)',
          }}
        />

        {/* Dot Matrix Pattern */}
        {showDots && (
          <div
            className={cn(
              'absolute inset-0 bg-dot-pattern [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_85%)]',
              isDark ? 'opacity-15 invert' : 'opacity-25'
            )}
          />
        )}

        {/* Floating Twinkling Stars & Particles */}
        {showParticles && (
          <div className="absolute inset-0 overflow-hidden">
            <div
              className={cn(
                'absolute top-[20%] start-[18%] size-2.5 rounded-full blur-[0.5px] animate-particle-1',
                isDark ? 'bg-emerald-400/90' : 'bg-emerald-500/70'
              )}
              style={{
                boxShadow: isDark
                  ? '0 0 16px 4px rgba(16, 185, 129, 0.8)'
                  : '0 0 12px 2px rgba(16, 185, 129, 0.4)',
              }}
            />
            <div
              className={cn(
                'absolute top-[35%] end-[22%] size-3 rounded-full blur-[0.5px] animate-particle-2',
                isDark ? 'bg-emerald-300/80' : 'bg-emerald-400/60'
              )}
              style={{
                boxShadow: isDark
                  ? '0 0 18px 4px rgba(52, 211, 153, 0.8)'
                  : '0 0 14px 2px rgba(52, 211, 153, 0.35)',
              }}
            />
            <div
              className={cn(
                'absolute top-[65%] start-[25%] size-2 rounded-full blur-[0.5px] animate-particle-3',
                isDark ? 'bg-teal-300/80' : 'bg-teal-400/60'
              )}
              style={{
                boxShadow: isDark
                  ? '0 0 14px 3px rgba(45, 212, 191, 0.7)'
                  : '0 0 10px 2px rgba(45, 212, 191, 0.3)',
              }}
            />
            <div className={cn('absolute top-[28%] start-[45%] animate-twinkle-1', isDark ? 'text-emerald-400/80' : 'text-emerald-500/50')}>
              <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
              </svg>
            </div>
            <div className={cn('absolute top-[72%] end-[16%] animate-twinkle-2', isDark ? 'text-emerald-300/75' : 'text-emerald-400/40')}>
              <svg className="size-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
              </svg>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Hero / Dashboard / General Pages
  return (
    <div
      className={cn(
        'pointer-events-none fixed inset-0 overflow-hidden z-0 select-none transition-colors duration-500',
        className,
      )}
      aria-hidden
    >
      {/* 1. Base Multi-Stop Themed Radial Mesh */}
      <div className="absolute inset-0 bg-radial-mesh opacity-90 transition-all duration-500" />
      <div className="absolute inset-0 bg-aurora-glow opacity-80 transition-all duration-500" />

      {/* 2. Interactive Spotlight Gradient */}
      {showSpotlight && (
        <div
          className="absolute inset-0 transition-opacity duration-700 opacity-60"
          style={{
            background: `radial-gradient(700px circle at ${mousePos.x}% ${mousePos.y}%, rgba(16, 185, 129, 0.12), transparent 70%)`,
          }}
        />
      )}

      {/* 3. Grid Pattern */}
      {showGrid && (
        <div className="absolute inset-0 bg-grid-pattern opacity-45 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_85%)]" />
      )}

      {/* 4. Dot Matrix */}
      {showDots && (
        <div className="absolute inset-0 bg-dot-pattern opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_90%)]" />
      )}

      {/* 5. Animated Light Beam */}
      {showBeam && variant === 'hero' && (
        <div className="absolute -top-10 left-0 right-0 h-96 overflow-hidden pointer-events-none">
          <div className="beam-light" />
        </div>
      )}

      {/* Floating Radiant Orbs */}
      <div
        className={cn(
          'absolute rounded-full blur-[110px] animate-orb-1',
          variant === 'hero'
            ? '-top-28 start-1/4 size-[560px] opacity-70'
            : variant === 'subtle'
            ? '-top-36 start-1/3 size-[380px] opacity-40'
            : '-top-20 start-1/4 size-[460px] opacity-60',
        )}
        style={{
          background: `radial-gradient(circle, ${primaryColor} 0%, rgba(16, 185, 129, ${isDark ? '0.5' : '0.28'}) 55%, transparent 100%)`,
        }}
      />

      <div
        className={cn(
          'absolute rounded-full blur-[130px] animate-orb-2',
          variant === 'hero'
            ? 'top-1/4 end-6 size-[520px] opacity-55'
            : variant === 'subtle'
            ? 'top-1/3 end-4 size-[340px] opacity-30'
            : 'top-1/4 end-10 size-[420px] opacity-45',
        )}
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(79, 70, 229, 0.65) 0%, rgba(13, 148, 136, 0.35) 60%, transparent 100%)'
            : 'radial-gradient(circle, rgba(16, 185, 129, 0.28) 0%, rgba(13, 148, 136, 0.16) 60%, transparent 100%)',
        }}
      />

      <div
        className={cn(
          'absolute rounded-full blur-[120px] animate-orb-3',
          variant === 'hero'
            ? 'top-2/3 start-8 size-[460px] opacity-35'
            : variant === 'subtle'
            ? 'bottom-10 start-8 size-[300px] opacity-20'
            : 'top-1/2 start-6 size-[380px] opacity-30',
        )}
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(245, 158, 11, 0.55) 0%, rgba(16, 185, 129, 0.25) 60%, transparent 100%)'
            : 'radial-gradient(circle, rgba(245, 158, 11, 0.2) 0%, rgba(16, 185, 129, 0.08) 60%, transparent 100%)',
        }}
      />

      {(variant === 'hero' || variant === 'brand') && (
        <div
          className="absolute -bottom-32 end-1/4 size-[500px] rounded-full blur-[140px] animate-orb-4 opacity-40"
          style={{
            background: `radial-gradient(circle, rgba(13, 148, 136, ${isDark ? '0.5' : '0.2'}) 0%, ${primaryColor}${isDark ? '40' : '15'} 50%, transparent 100%)`,
          }}
        />
      )}

      {/* Floating Particles */}
      {showParticles && (
        <div className="absolute inset-0 overflow-hidden">
          <div
            className={cn('absolute top-[18%] start-[15%] size-2.5 rounded-full blur-[0.5px] animate-particle-1', isDark ? 'bg-emerald-400/80' : 'bg-emerald-500/50')}
            style={{ boxShadow: `0 0 14px 3px rgba(16, 185, 129, ${isDark ? '0.7' : '0.3'})` }}
          />
          <div
            className={cn('absolute top-[32%] end-[20%] size-3 rounded-full blur-[0.5px] animate-particle-2', isDark ? 'bg-indigo-400/70' : 'bg-emerald-400/40')}
            style={{ boxShadow: `0 0 16px 3px rgba(16, 185, 129, ${isDark ? '0.7' : '0.25'})` }}
          />
          <div
            className={cn('absolute top-[58%] start-[28%] size-2 rounded-full blur-[0.5px] animate-particle-3', isDark ? 'bg-amber-400/80' : 'bg-amber-500/40')}
            style={{ boxShadow: `0 0 12px 2px rgba(245, 158, 11, ${isDark ? '0.7' : '0.25'})` }}
          />
          <div
            className={cn('absolute top-[45%] end-[12%] size-2.5 rounded-full blur-[0.5px] animate-particle-1', isDark ? 'bg-teal-300/80' : 'bg-teal-400/40')}
            style={{ boxShadow: `0 0 14px 3px rgba(20, 184, 166, ${isDark ? '0.7' : '0.25'})` }}
          />

          <div className={cn('absolute top-[22%] start-[42%] animate-twinkle-1', isDark ? 'text-amber-400/70' : 'text-amber-500/40')}>
            <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
            </svg>
          </div>
          <div className={cn('absolute top-[68%] end-[18%] animate-twinkle-2', isDark ? 'text-emerald-400/70' : 'text-emerald-500/40')}>
            <svg className="size-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
            </svg>
          </div>
        </div>
      )}
    </div>
  )
}
