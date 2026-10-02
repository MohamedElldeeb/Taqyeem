import * as React from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { Check, CheckCircle2, Copy, ExternalLink, HelpCircle, Mail, RefreshCw, Sparkles } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { LanguageToggle } from '@/components/ui/language-toggle'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { AnimatedBackground } from '@/components/ui/animated-background'
import { BrandLogo } from '@/components/ui/brand-logo'
import { useAuth } from '@/lib/auth-context'
import { useLanguage } from '@/lib/language-context'
import { useTheme } from '@/lib/theme-context'
import { useToast } from '@/components/ui/toast'
import { cn } from '@/lib/utils'

function ConfirmEmailPage() {
  const { resendConfirmation } = useAuth()
  const { t, isRTL } = useLanguage()
  const { resolvedTheme } = useTheme()
  const { showToast } = useToast()
  const location = useLocation()
  const [searchParams] = useSearchParams()

  const isDark = resolvedTheme === 'dark'

  // Retrieve email from navigation state or URL param
  const passedEmail = (location.state as { email?: string })?.email || searchParams.get('email') || ''

  const [resending, setResending] = React.useState(false)
  const [cooldown, setCooldown] = React.useState(0)
  const [copied, setCopied] = React.useState(false)

  // Countdown timer for resending
  React.useEffect(() => {
    if (cooldown <= 0) return
    const interval = setInterval(() => {
      setCooldown((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [cooldown])

  async function handleCopyEmail() {
    if (!passedEmail) return
    await navigator.clipboard.writeText(passedEmail)
    setCopied(true)
    showToast(isRTL ? 'تم النسخ' : 'Copied', passedEmail, 'success')
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleResend() {
    if (!passedEmail || cooldown > 0 || resending) return

    setResending(true)
    const { error } = await resendConfirmation(passedEmail)
    setResending(false)

    if (error) {
      showToast(isRTL ? 'خطأ' : 'Error', error, 'error')
      return
    }

    setCooldown(60)
    showToast(
      isRTL ? 'تم الإرسال' : 'Sent',
      t('auth_email_resent_success'),
      'success'
    )
  }

  return (
    <main className={cn(
      'relative flex min-h-dvh flex-col justify-between items-center p-4 sm:p-6 pt-safe pb-safe selection:bg-emerald/30 overflow-y-auto overflow-x-hidden bg-transparent transition-colors duration-300',
      isDark ? 'text-white' : 'text-ink'
    )}>
      {/* Dynamic Full-Page Themed Radial Gradient Background */}
      <AnimatedBackground variant="auth" showDots showParticles />

      {/* Top Mobile/Desktop Navbar */}
      <header className="w-full max-w-md mx-auto flex items-center justify-between z-20 py-2">
        <BrandLogo href="/" size="sm" theme={isDark ? 'dark' : 'light'} />
        <div className="flex items-center gap-2">
          <ThemeToggle variant="minimal" />
          <LanguageToggle variant={isDark ? 'darkPill' : 'pill'} />
        </div>
      </header>

      {/* Confirm Email Card Container */}
      <div className="w-full max-w-[460px] my-auto py-2 z-10">
        <Card
          className={cn(
            'w-full rounded-3xl p-2 sm:p-4 backdrop-blur-2xl animate-scale-in overflow-hidden transition-all duration-300',
            isDark ? 'glass-card-dark' : 'glass-card border-border/80 bg-surface/95 shadow-2xl'
          )}
        >
          <CardHeader className="text-center pb-2 pt-4">
            {/* Luminous Animated Envelope Graphic */}
            <div className="relative mx-auto mb-3 flex size-18 items-center justify-center">
              <div className={cn(
                'flex size-16 items-center justify-center rounded-3xl transition-all duration-300 animate-float-gentle',
                isDark
                  ? 'bg-gradient-to-tr from-emerald-600/30 to-teal-500/20 text-emerald-400 border border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.35)]'
                  : 'bg-gradient-to-tr from-emerald-50 to-teal-50 text-emerald-deep border border-emerald-border/80 shadow-md'
              )}>
                <Mail className="size-8 stroke-[2.2]" />
              </div>
              <div className="absolute -top-1 -end-1 flex size-6 items-center justify-center rounded-full bg-emerald text-white shadow-md animate-pulse-glow">
                <Sparkles className="size-3.5" />
              </div>
            </div>

            <CardTitle className={cn('text-xl sm:text-2xl font-extrabold tracking-tight', isDark ? 'text-white' : 'text-ink')}>
              {t('auth_confirm_email_title')}
            </CardTitle>
            <CardDescription className={cn('text-xs sm:text-sm max-w-sm mx-auto leading-relaxed mt-1', isDark ? 'text-slate-400' : 'text-ink-muted')}>
              {t('auth_confirm_email_desc')}
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-4 p-4 sm:p-6 pt-2">
            {/* Ultra-Modern Interactive Email Badge */}
            {passedEmail && (
              <div className={cn(
                'group relative flex items-center justify-between gap-3 rounded-2xl border px-3.5 py-2.5 transition-all duration-300',
                isDark
                  ? 'border-emerald-500/30 bg-gradient-to-r from-emerald-950/40 via-[#06241e]/60 to-emerald-950/40 text-emerald-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_4px_12px_rgba(0,0,0,0.2)]'
                  : 'border-emerald-200/80 bg-gradient-to-r from-emerald-50/80 via-white to-emerald-50/80 text-emerald-950 shadow-xs'
              )}>
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={cn(
                    'flex size-7 shrink-0 items-center justify-center rounded-xl',
                    isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700'
                  )}>
                    <CheckCircle2 className="size-4 stroke-[2.5]" />
                  </div>
                  <span className="font-mono text-xs sm:text-sm font-bold truncate tracking-tight">{passedEmail}</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className={cn(
                    'flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-bold transition-all cursor-pointer select-none active:scale-90',
                    isDark
                      ? 'text-emerald-400/80 hover:text-emerald-300 hover:bg-emerald-500/10'
                      : 'text-emerald-700/80 hover:text-emerald-800 hover:bg-emerald-100/60'
                  )}
                  title={copied ? t('action_copied') : t('action_copy')}
                >
                  {copied ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
                  <span>{copied ? t('action_copied') : ''}</span>
                </button>
              </div>
            )}

            {/* Authentic Brand Email Provider Shortcuts (Gmail & Outlook) */}
            <div className="grid grid-cols-2 gap-2.5">
              {/* Gmail Button */}
              <a
                href="https://mail.google.com"
                target="_blank"
                rel="noreferrer"
                className={cn(
                  'group flex items-center justify-center gap-2 rounded-2xl border p-2.5 text-xs font-bold transition-all duration-200 cursor-pointer select-none',
                  'hover:-translate-y-0.5 active:translate-y-0 active:scale-95',
                  isDark
                    ? 'border-white/10 bg-white/5 text-slate-200 hover:border-red-500/40 hover:bg-red-500/10 hover:text-white shadow-xs'
                    : 'border-border/80 bg-white text-ink hover:border-red-400 hover:bg-red-50/50 hover:text-red-700 shadow-xs'
                )}
              >
                <svg className="size-4 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.272H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/>
                </svg>
                <span>Gmail</span>
                <ExternalLink className="size-3 text-ink-subtle opacity-70 group-hover:opacity-100" />
              </a>

              {/* Outlook Button */}
              <a
                href="https://outlook.live.com"
                target="_blank"
                rel="noreferrer"
                className={cn(
                  'group flex items-center justify-center gap-2 rounded-2xl border p-2.5 text-xs font-bold transition-all duration-200 cursor-pointer select-none',
                  'hover:-translate-y-0.5 active:translate-y-0 active:scale-95',
                  isDark
                    ? 'border-white/10 bg-white/5 text-slate-200 hover:border-blue-500/40 hover:bg-blue-500/10 hover:text-white shadow-xs'
                    : 'border-border/80 bg-white text-ink hover:border-blue-400 hover:bg-blue-50/50 hover:text-blue-700 shadow-xs'
                )}
              >
                <svg className="size-4 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                  <path fill="#28A8EA" d="M24 7.2v9.6c0 1.325-1.075 2.4-2.4 2.4H8.4A2.4 2.4 0 0 1 6 16.8V7.2a2.4 2.4 0 0 1 2.4-2.4h13.2c1.325 0 2.4 1.075 2.4 2.4z"/>
                  <path fill="#0078D4" d="M15 4.8l9 6v3.6l-9 6z"/>
                  <path fill="#005A9E" d="M6 7.2l9 6-9 6z"/>
                  <path fill="#106EBE" d="M0 6.6C0 5.164 1.164 4 2.6 4h7.8C11.836 4 13 5.164 13 6.6v10.8c0 1.436-1.164 2.6-2.6 2.6H2.6A2.6 2.6 0 0 1 0 17.4V6.6z"/>
                  <path fill="#FFFFFF" d="M6.5 7.8c-1.878 0-3.1 1.46-3.1 3.7 0 2.24 1.222 3.7 3.1 3.7s3.1-1.46 3.1-3.7c0-2.24-1.222-3.7-3.1-3.7zm0 5.8c-1.002 0-1.6-.9-1.6-2.1 0-1.2.598-2.1 1.6-2.1s1.6.9 1.6 2.1c0 1.2-.598 2.1-1.6 2.1z"/>
                </svg>
                <span>Outlook</span>
                <ExternalLink className="size-3 text-ink-subtle opacity-70 group-hover:opacity-100" />
              </a>
            </div>

            {/* Spam Folder Tip Box (Refined Glassmorphic Callout) */}
            <div className={cn(
              'flex items-start gap-3 rounded-2xl border p-3.5 text-xs leading-relaxed transition-all duration-300 text-start',
              isDark
                ? 'border-amber-500/20 bg-gradient-to-r from-amber-500/5 to-transparent text-amber-300/90'
                : 'border-amber-200/70 bg-gradient-to-r from-amber-50/80 via-amber-50/40 to-transparent text-amber-900'
            )}>
              <div className={cn(
                'flex size-6 shrink-0 items-center justify-center rounded-lg mt-0.5',
                isDark ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-700'
              )}>
                <HelpCircle className="size-3.5" />
              </div>
              <p className="flex-1 font-medium">{t('auth_confirm_email_spam_hint')}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2.5 pt-1">
              <Button asChild size="lg" variant="primaryGlow" className="w-full font-bold shadow-lg">
                <Link to="/login">
                  {t('action_login')}
                </Link>
              </Button>

              {/* Resend Confirmation Link / Button */}
              {passedEmail && (
                <button
                  type="button"
                  disabled={cooldown > 0 || resending}
                  onClick={handleResend}
                  className={cn(
                    'inline-flex items-center justify-center gap-1.5 py-1 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed',
                    isDark ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald hover:text-emerald-deep'
                  )}
                >
                  <RefreshCw className={cn('size-3.5', resending && 'animate-spin')} />
                  <span>
                    {cooldown > 0
                      ? `${t('auth_cooldown_wait')} (${cooldown}s)`
                      : t('auth_resend_confirm')}
                  </span>
                </button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* App Footer / Trust indicator */}
      <footer className={cn('w-full max-w-md mx-auto text-center py-2 z-10 text-[11px]', isDark ? 'text-slate-500' : 'text-ink-subtle')}>
        <span>{t('brand_name')} · {t('brand_tagline')}</span>
      </footer>
    </main>
  )
}

export default ConfirmEmailPage
