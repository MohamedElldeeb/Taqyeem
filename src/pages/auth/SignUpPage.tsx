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
import { supabase } from '@/lib/supabase'

function SignUpPage() {
  const { session, loading, signUp } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [submitting, setSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [needsEmailConfirmation, setNeedsEmailConfirmation] = React.useState(false)
  const [alreadyExists, setAlreadyExists] = React.useState(false)

  if (!loading && session) {
    return <Navigate to="/onboarding" replace />
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setSubmitting(true)
    setError(null)

    const { error: signUpError, alreadyExists: existing } = await signUp(email, password)
    setSubmitting(false)

    if (signUpError) {
      setError(signUpError)
      return
    }

    if (existing) {
      setAlreadyExists(true)
      return
    }

    // With email confirmation enabled, signUp succeeds but no session exists yet.
    const { data } = await supabase.auth.getSession()
    if (data.session) {
      navigate('/onboarding')
    } else {
      setNeedsEmailConfirmation(true)
    }
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-gutter">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>إنشاء حساب تاجر</CardTitle>
          <CardDescription>ابدأ في جمع تقييمات عملائك الحقيقية.</CardDescription>
        </CardHeader>
        <CardContent>
          {alreadyExists ? (
            <div className="flex flex-col gap-4">
              <p className="text-sm text-ink">
                الحساب ده موجود بالفعل. من فضلك سجّل الدخول بدل إنشاء حساب جديد.
              </p>
              <Button onClick={() => navigate('/login')}>تسجيل الدخول</Button>
            </div>
          ) : needsEmailConfirmation ? (
            <p className="text-sm text-ink">
              تم إنشاء الحساب. برجاء تفعيل بريدك الإلكتروني من الرسالة المرسلة إليك ثم
              تسجيل الدخول.
            </p>
          ) : (
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
                  minLength={6}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  disabled={submitting}
                />
              </div>

              {error && <p className="text-sm text-danger">{error}</p>}

              <Button type="submit" disabled={submitting}>
                {submitting ? 'جاري الإنشاء...' : 'إنشاء الحساب'}
              </Button>

              <p className="text-center text-sm text-muted-text">
                لديك حساب بالفعل؟{' '}
                <Link to="/login" className="font-medium text-emerald">
                  تسجيل الدخول
                </Link>
              </p>
            </form>
          )}
        </CardContent>
      </Card>
    </main>
  )
}

export default SignUpPage
