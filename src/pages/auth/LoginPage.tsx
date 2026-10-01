import * as React from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'

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

const UNCONFIRMED_MESSAGE = 'من فضلك فعّل حسابك من خلال رسالة التأكيد المرسلة إلى بريدك الإلكتروني.'

function LoginPage() {
  const { session, loading, signIn, resendConfirmation } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [submitting, setSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [resendState, setResendState] = React.useState<'idle' | 'sending' | 'sent'>('idle')
  const [resendError, setResendError] = React.useState<string | null>(null)

  if (!loading && session) {
    return <Navigate to="/dashboard" replace />
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setSubmitting(true)
    setError(null)
    setResendState('idle')

    const { error: signInError } = await signIn(email, password)
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
    <main className="flex min-h-dvh items-center justify-center bg-background px-gutter">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>تسجيل الدخول</CardTitle>
          <CardDescription>ادخل إلى لوحة تحكم متجرك.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                disabled={submitting}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                disabled={submitting}
              />
            </div>

            {error && (
              <div className="flex flex-col gap-2">
                <p className="text-sm text-danger">{error}</p>
                {error === UNCONFIRMED_MESSAGE && (
                  <div className="flex flex-col gap-1">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      disabled={resendState === 'sending' || !email}
                      onClick={handleResend}
                    >
                      {resendState === 'sending' ? 'جاري الإرسال...' : 'إعادة إرسال رسالة التأكيد'}
                    </Button>
                    {resendState === 'sent' && (
                      <p className="text-center text-sm text-muted-text">
                        تم إرسال رسالة التأكيد مرة أخرى.
                      </p>
                    )}
                    {resendError && <p className="text-center text-sm text-danger">{resendError}</p>}
                  </div>
                )}
              </div>
            )}

            <Button type="submit" disabled={submitting}>
              {submitting ? 'جاري الدخول...' : 'تسجيل الدخول'}
            </Button>

            <p className="text-center text-sm">
              <Link to="/forgot-password" className="font-medium text-emerald">
                نسيت كلمة المرور؟
              </Link>
            </p>

            <p className="text-center text-sm text-muted-text">
              ليس لديك حساب؟{' '}
              <Link to="/signup" className="font-medium text-emerald">
                إنشاء حساب جديد
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}

export default LoginPage
