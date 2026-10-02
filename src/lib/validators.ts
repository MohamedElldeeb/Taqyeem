export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim())
}

export function isValidPassword(password: string, minLength: number = 6): boolean {
  return password.length >= minLength
}

export function isValidSlug(slug: string): boolean {
  const clean = slug.trim().toLowerCase()
  return clean.length >= 2 && clean.length <= 48 && SLUG_REGEX.test(clean)
}

export function isValidBusinessName(name: string): boolean {
  return name.trim().length >= 2
}
