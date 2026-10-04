import * as React from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { AlertCircle, Lock, Mail } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LanguageToggle } from '@/components/ui/language-toggle'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { AnimatedBackground } from '@/components/ui/animated-background'
import { BrandLogo } from '@/components/ui/brand-logo'
import { GoogleAuthButton } from '@/components/auth/GoogleAuthButton'
import { useAuth } from '@/lib/auth-context'
import { useLanguage } from '@/lib/language-context'
import { useTheme } from '@/lib/theme-context'
import { isValidEmail } from '@/lib/validators'
import { cn } from '@/lib/utils'

const UNCONFIRMED_MESSAGE = 'من فضلك فعّل حسابك من خلال رسالة التأكيد المرسلة إلى بريدك الإلكتروني.'

function LoginPage() {
  const { session, loading, signIn, resendConfirmation } = useAuth()
  const { t } = useLanguage()
  const { resolvedTheme } = useTheme()
  const navigate = useNavigate()

  const isDark = resolvedTheme === 'dark'

  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [touched, setTouched] = React.useState<{ email?: boolean; password?: boolean }>({})
  const [submitting, setSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [resendState, setResendState] = React.useState<'idle' | 'sending' | 'sent'>('idle')
  const [resendError, setResendError] = React.useState<string | null>(null)

  const emailError = React.useMemo(() => {
    if (!touched.email) return null
    if (!email.trim()) return t('val_email_required')
    if (!isValidEmail(email)) return t('val_email_invalid')
    return null
  }, [email, touched.email, t])

  const passwordError = React.useMemo(() => {
    if (!touched.password) return null
    if (!password) return t('val_password_required')
    if (password.length < 6) return t('val_password_min')
    return null
  }, [password, touched.password, t])

  if (!loading && session) {
    return <Navigate to="/dashboard" replace />
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setTouched({ email: true, password: true })

    const isEmailValid = email.trim() && isValidEmail(email)
    const isPasswordValid = password && password.length >= 6

    if (!isEmailValid || !isPasswordValid) {
      return
    }

    setSubmitting(true)
    setError(null)
    setResendState('idle')

    const { error: signInError } = await signIn(email.trim(), password)
    setSubmitting(false)

    if (signInError) {
      setError(signInError)
      return
    }

    navigate('/dashboard')
  }

  async function handleResend() {
    setResendState('sending')
    setResendError(null)
    const { error: resendErr } = await resendConfirmation(email)
    if (resendErr) {
      setResendError(resendErr)
      setResendState('idle')
      return
    }
    setResendState('sent')
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

      {/* Login Card Container */}
      <div className="w-full max-w-[440px] my-auto py-2 z-10">
        <Card
          className={cn(
            'w-full rounded-3xl p-2 sm:p-3 backdrop-blur-2xl animate-scale-in overflow-hidden transition-all duration-300',
            isDark ? 'glass-card-dark' : 'glass-card border-border/80 bg-surface/95 shadow-2xl'
          )}
        >
          <CardHeader className="text-center pb-2 pt-4">
            <div className={cn(
              'mx-auto mb-2 flex size-13 sm:size-14 items-center justify-center rounded-2xl transition-colors',
              isDark
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                : 'bg-emerald-surface text-emerald-deep border border-emerald-border shadow-xs'
            )}>
              <Lock className="size-5 sm:size-6" />
            </div>
            <CardTitle className={cn('text-xl sm:text-2xl font-extrabold', isDark ? 'text-white' : 'text-ink')}>
              {t('auth_login_title')}
            </CardTitle>
            <CardDescription className={cn('text-xs sm:text-sm', isDark ? 'text-slate-400' : 'text-ink-muted')}>
              {t('auth_login_subtitle')}
            </CardDescription>
          </CardHeader>

          <CardContent className="p-4 sm:p-6 pt-2 flex flex-col gap-4">
            <GoogleAuthButton onError={(err) => setError(err)} />

            <div className="relative my-0.5 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className={cn('w-full border-t', isDark ? 'border-emerald-900/40' : 'border-border/80')} />
              </div>
              <div className={cn(
                'relative px-3 py-0.5 text-[11px] font-semibold tracking-wide rounded-full',
                isDark ? 'bg-[#03110e] text-slate-400 border border-emerald-950/80' : 'bg-surface text-ink-muted border border-border/60'
              )}>
                {t('auth_or_divider')}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email" className={cn('text-xs font-bold', isDark ? 'text-slate-300' : 'text-ink')}>
                {t('auth_email_label')}
              </Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
                hasError={Boolean(emailError)}
                disabled={submitting}
                placeholder="you@store.com"
                startIcon={<Mail className={cn('size-4', isDark ? 'text-slate-400' : 'text-ink-subtle')} />}
                className={isDark ? 'bg-[#03110e]/90 border-emerald-900/50 text-white placeholder:text-slate-500 focus:border-emerald-400 focus:ring-emerald-500/20' : ''}
              />
              {emailError && (
                <p className="flex items-center gap-1 text-[11px] font-semibold text-rose-400 animate-fade-in">
                  <AlertCircle className="size-3 shrink-0" />
                  <span>{emailError}</span>
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className={cn('text-xs font-bold', isDark ? 'text-slate-300' : 'text-ink')}>
                  {t('auth_password_label')}
                </Label>
                <Link
                  to="/forgot-password"
                  className={cn('text-xs font-semibold transition-colors', isDark ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald hover:text-emerald-deep')}
                >
                  {t('auth_forgot_link')}
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
                hasError={Boolean(passwordError)}
                disabled={submitting}
                placeholder="••••••••"
                startIcon={<Lock className={cn('size-4', isDark ? 'text-slate-400' : 'text-ink-subtle')} />}
                className={isDark ? 'bg-[#03110e]/90 border-emerald-900/50 text-white placeholder:text-slate-500 focus:border-emerald-400 focus:ring-emerald-500/20' : ''}
              />
              {passwordError && (
                <p className="flex items-center gap-1 text-[11px] font-semibold text-rose-400 animate-fade-in">
                  <AlertCircle className="size-3 shrink-0" />
                  <span>{passwordError}</span>
                </p>
              )}
            </div>

            {error && (
              <div className="flex flex-col gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 animate-fade-in text-rose-400">
                <p className="text-xs font-semibold">{error}</p>
                {error === UNCONFIRMED_MESSAGE && (
                  <div className="flex flex-col gap-1 mt-1">
                    <Button
                      type="button"
                      variant="secondary"
                      size="xs"
                      disabled={resendState === 'sending' || !email}
                      onClick={handleResend}
                      className={isDark ? 'bg-slate-800 text-white border-slate-700 hover:bg-slate-700' : ''}
                    >
                      {resendState === 'sending' ? t('action_submitting') : t('auth_resend_confirm')}
                    </Button>
                    {resendState === 'sent' && (
                      <p className="text-center text-xs text-emerald-400 font-semibold">
                        تم إرسال رسالة التأكيد مرة أخرى.
                      </p>
                    )}
                    {resendError && <p className="text-center text-xs text-rose-300">{resendError}</p>}
                  </div>
                )}
              </div>
            )}

            <Button type="submit" size="lg" variant="primaryGlow" loading={submitting} className="mt-2 font-bold shadow-lg">
              {t('auth_sign_in_btn')}
            </Button>

            <div className={cn('pt-2 text-center text-xs', isDark ? 'text-slate-400' : 'text-ink-muted')}>
              <span>{t('auth_no_account')} </span>
              <Link to="/signup" className="font-bold text-emerald-500 hover:text-emerald-400 transition-colors">
                {t('action_signup')}
              </Link>
            </div>
          </form>
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

export default LoginPage
