import * as React from 'react'
import { Link } from 'react-router-dom'
import { AlertCircle, CheckCircle2, KeyRound, Lock } from 'lucide-react'

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
import { useAuth } from '@/lib/auth-context'
import { useLanguage } from '@/lib/language-context'
import { useTheme } from '@/lib/theme-context'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'

type LinkStatus = 'checking' | 'ready' | 'invalid'

function ResetPasswordPage() {
  const { updatePassword, signOut } = useAuth()
  const { t } = useLanguage()
  const { resolvedTheme } = useTheme()

  const isDark = resolvedTheme === 'dark'

  const [linkStatus, setLinkStatus] = React.useState<LinkStatus>('checking')
  const [password, setPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')
  const [touched, setTouched] = React.useState<{ password?: boolean; confirmPassword?: boolean }>({})
  const [submitting, setSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState(false)

  React.useEffect(() => {
    let active = true

    const { data: subscription } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return
      if (event === 'PASSWORD_RECOVERY' || session) {
        setLinkStatus('ready')
      }
    })

    supabase.auth.getSession().then(({ data }) => {
      if (active && data.session) setLinkStatus('ready')
    })

    const timeout = setTimeout(() => {
      if (active) setLinkStatus((current) => (current === 'checking' ? 'invalid' : current))
    }, 3000)

    return () => {
      active = false
      subscription.subscription.unsubscribe()
      clearTimeout(timeout)
    }
  }, [])

  const passwordError = React.useMemo(() => {
    if (!touched.password) return null
    if (!password) return t('val_password_required')
    if (password.length < 6) return t('val_password_min')
    return null
  }, [password, touched.password, t])

  const confirmPasswordError = React.useMemo(() => {
    if (!touched.confirmPassword) return null
    if (!confirmPassword) return t('val_confirm_password_required')
    if (password !== confirmPassword) return t('val_password_match')
    return null
  }, [password, confirmPassword, touched.confirmPassword, t])

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setTouched({ password: true, confirmPassword: true })
    setError(null)

    if (password.length < 6) {
      return
    }

    if (password !== confirmPassword) {
      return
    }

    setSubmitting(true)
    const { error: updateError } = await updatePassword(password)
    setSubmitting(false)

    if (updateError) {
      setError(updateError)
      return
    }

    await signOut()
    setSuccess(true)
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

      {/* Card Container */}
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
              <KeyRound className="size-5 sm:size-6" />
            </div>
            <CardTitle className={cn('text-xl sm:text-2xl font-extrabold', isDark ? 'text-white' : 'text-ink')}>
              {t('auth_reset_title')}
            </CardTitle>
            {linkStatus === 'ready' && !success && (
              <CardDescription className={cn('text-xs sm:text-sm', isDark ? 'text-slate-400' : 'text-ink-muted')}>
                {t('auth_reset_subtitle')}
              </CardDescription>
            )}
          </CardHeader>

          <CardContent className="p-4 sm:p-6 pt-2">
            {linkStatus === 'checking' && (
              <div className={cn('flex items-center justify-center gap-2 py-6 text-sm font-semibold', isDark ? 'text-slate-400' : 'text-ink-muted')}>
                <span>جاري التحقق من صلاحية الرابط...</span>
              </div>
            )}

            {linkStatus === 'invalid' && (
              <div className="flex flex-col gap-4 text-center py-2">
                <p className="text-sm font-semibold text-rose-400">
                  رابط إعادة تعيين كلمة المرور غير صالح أو انتهت صلاحيته.
                </p>
                <Button asChild variant="secondary" size="lg" className={isDark ? 'bg-slate-800 text-white border-slate-700 hover:bg-slate-700' : ''}>
                  <Link to="/forgot-password">طلب رابط جديد</Link>
                </Button>
              </div>
            )}

            {linkStatus === 'ready' &&
              (success ? (
                <div className="flex flex-col items-center gap-4 text-center py-2 animate-fade-in">
                  <div className="flex size-14 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400">
                    <CheckCircle2 className="size-8" />
                  </div>
                  <p className={cn('text-sm font-bold', isDark ? 'text-white' : 'text-ink')}>تم تحديث كلمة المرور بنجاح!</p>
                  <Button asChild size="lg" variant="primaryGlow" className="w-full font-bold shadow-lg">
                    <Link to="/login">{t('auth_back_to_login')}</Link>
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="password" className={cn('text-xs font-bold', isDark ? 'text-slate-300' : 'text-ink')}>
                      {t('auth_password_label')}
                    </Label>
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

                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="confirmPassword" className={cn('text-xs font-bold', isDark ? 'text-slate-300' : 'text-ink')}>
                      {t('auth_confirm_password_label')}
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      onBlur={() => setTouched((prev) => ({ ...prev, confirmPassword: true }))}
                      hasError={Boolean(confirmPasswordError)}
                      disabled={submitting}
                      placeholder="••••••••"
                      startIcon={<Lock className={cn('size-4', isDark ? 'text-slate-400' : 'text-ink-subtle')} />}
                      className={isDark ? 'bg-[#03110e]/90 border-emerald-900/50 text-white placeholder:text-slate-500 focus:border-emerald-400 focus:ring-emerald-500/20' : ''}
                    />
                    {confirmPasswordError && (
                      <p className="flex items-center gap-1 text-[11px] font-semibold text-rose-400 animate-fade-in">
                        <AlertCircle className="size-3 shrink-0" />
                        <span>{confirmPasswordError}</span>
                      </p>
                    )}
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-400 animate-fade-in font-semibold">
                      <AlertCircle className="size-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <Button type="submit" size="lg" variant="primaryGlow" loading={submitting} className="font-bold shadow-lg">
                    {t('auth_change_password_btn')}
                  </Button>
                </form>
              ))}
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

export default ResetPasswordPage
