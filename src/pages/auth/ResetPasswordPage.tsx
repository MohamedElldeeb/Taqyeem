import * as React from 'react'
import { Link } from 'react-router-dom'

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
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'

type LinkStatus = 'checking' | 'ready' | 'invalid'

/**
 * Supabase's password-reset email links here with the recovery tokens in
 * the URL; supabase-js (detectSessionInUrl, on by default) picks them up
 * automatically and fires a PASSWORD_RECOVERY auth event once it has
 * established the session. We wait for either that event or a session to
 * actually appear before showing the form — a link that's expired or was
 * already used never produces one, so we fall back to "invalid" rather
 * than showing a form that would just fail.
 */
function ResetPasswordPage() {
  const { updatePassword, signOut } = useAuth()

  const [linkStatus, setLinkStatus] = React.useState<LinkStatus>('checking')
  const [password, setPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')
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

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('كلمتا المرور غير متطابقتين.')
      return
    }

    if (password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل.')
      return
    }

    setSubmitting(true)
    const { error: updateError } = await updatePassword(password)
    setSubmitting(false)

    if (updateError) {
      setError(updateError)
      return
    }

    // The recovery link grants a real (if narrow-purpose) session — sign
    // out explicitly so the user lands back at a clean, deliberate login
    // with their new password instead of being silently left signed in.
    await signOut()
    setSuccess(true)
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-gutter">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>إعادة تعيين كلمة المرور</CardTitle>
          {linkStatus === 'ready' && !success && (
            <CardDescription>اختر كلمة مرور جديدة لحسابك.</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {linkStatus === 'checking' && (
            <p className="text-sm text-muted-text">جاري التحقق من الرابط...</p>
          )}

          {linkStatus === 'invalid' && (
            <div className="flex flex-col gap-4">
              <p className="text-sm text-danger">
                رابط إعادة تعيين كلمة المرور غير صالح أو انتهت صلاحيته. اطلب رابطًا جديدًا.
              </p>
              <Link to="/forgot-password" className="text-center text-sm font-medium text-emerald">
                طلب رابط جديد
              </Link>
            </div>
          )}

          {linkStatus === 'ready' &&
            (success ? (
              <div className="flex flex-col gap-4">
                <p className="text-sm text-ink">تم تغيير كلمة المرور بنجاح.</p>
                <Link to="/login" className="text-center text-sm font-medium text-emerald">
                  تسجيل الدخول
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="password">كلمة المرور الجديدة</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    disabled={submitting}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    disabled={submitting}
                  />
                </div>

                {error && <p className="text-sm text-danger">{error}</p>}

                <Button type="submit" disabled={submitting}>
                  {submitting ? 'جاري الحفظ...' : 'تغيير كلمة المرور'}
                </Button>
              </form>
            ))}
        </CardContent>
      </Card>
    </main>
  )
}

export default ResetPasswordPage
