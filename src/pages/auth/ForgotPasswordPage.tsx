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

function ForgotPasswordPage() {
  const { requestPasswordReset } = useAuth()

  const [email, setEmail] = React.useState('')
  const [submitting, setSubmitting] = React.useState(false)
  const [sent, setSent] = React.useState(false)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setSubmitting(true)

    // Always show the same neutral confirmation regardless of whether the
    // email is actually registered — revealing that would let signup-style
    // account enumeration happen through this form instead.
    await requestPasswordReset(email)

    setSubmitting(false)
    setSent(true)
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-gutter">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>نسيت كلمة المرور؟</CardTitle>
          <CardDescription>
            هنبعتلك رابط لإعادة تعيين كلمة المرور على بريدك الإلكتروني.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sent ? (
            <div className="flex flex-col gap-4">
              <p className="text-sm text-ink">
                لو البريد الإلكتروني ده مسجل عندنا، هتوصلك رسالة لإعادة تعيين كلمة المرور
                خلال لحظات.
              </p>
              <Link to="/login" className="text-center text-sm font-medium text-emerald">
                العودة لتسجيل الدخول
              </Link>
            </div>
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

              <Button type="submit" disabled={submitting}>
                {submitting ? 'جاري الإرسال...' : 'إرسال رابط إعادة التعيين'}
              </Button>

              <p className="text-center text-sm text-muted-text">
                <Link to="/login" className="font-medium text-emerald">
                  العودة لتسجيل الدخول
                </Link>
              </p>
            </form>
          )}
        </CardContent>
      </Card>
    </main>
  )
}

export default ForgotPasswordPage
