import type { AuthError } from '@supabase/supabase-js'

/**
 * Maps Supabase Auth errors to user-facing Arabic messages. Never forward
 * `error.message` directly to the UI — it's English, implementation-specific,
 * and can leak details (e.g. exact validation rules) we'd rather phrase
 * ourselves. Unrecognized errors fall back to a generic message; the
 * original error is left for the caller to console.error if useful.
 */
function mapAuthError(error: AuthError | { code?: string; message?: string } | null): string {
  if (!error) return 'حدث خطأ غير متوقع. حاول مرة أخرى.'

  const code = 'code' in error ? error.code : undefined
  const message = error.message ?? ''

  if (code === 'invalid_credentials' || message.includes('Invalid login credentials')) {
    return 'البريد الإلكتروني أو كلمة المرور غير صحيحة.'
  }

  if (code === 'email_not_confirmed' || message.includes('Email not confirmed')) {
    return 'من فضلك فعّل حسابك من خلال رسالة التأكيد المرسلة إلى بريدك الإلكتروني.'
  }

  if (code === 'user_already_exists' || message.includes('already registered')) {
    return 'الحساب ده موجود بالفعل. من فضلك سجّل الدخول بدل إنشاء حساب جديد.'
  }

  if (code === 'weak_password' || message.includes('Password should be at least')) {
    return 'كلمة المرور قصيرة جدًا. يجب أن تكون 6 أحرف على الأقل.'
  }

  if (code === 'over_email_send_rate_limit' || message.includes('rate limit')) {
    return 'تم إرسال عدد كبير من الطلبات. برجاء الانتظار قليلاً قبل المحاولة مرة أخرى.'
  }

  if (code === 'same_password') {
    return 'كلمة المرور الجديدة مطابقة للقديمة. من فضلك اختر كلمة مرور مختلفة.'
  }

  if (
    code === 'validation_failed' ||
    message.includes('Unsupported provider') ||
    message.includes('provider is not enabled')
  ) {
    return 'تسجيل الدخول عبر Google غير مفعّل بعد في إعدادات Supabase (Authentication > Providers > Google).'
  }

  if (
    code === 'otp_expired' ||
    code === 'otp_disabled' ||
    message.includes('expired') ||
    message.includes('invalid')
  ) {
    return 'رابط إعادة تعيين كلمة المرور غير صالح أو انتهت صلاحيته. اطلب رابطًا جديدًا.'
  }

  return 'حدث خطأ، برجاء المحاولة مرة أخرى.'
}

export { mapAuthError }
