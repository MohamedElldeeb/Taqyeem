/**
 * Basic Latin slug sanitizer for merchant review links (/r/{slug}).
 * Does not transliterate Arabic — merchants with Arabic business names
 * type their own Latin slug; this only normalizes whatever is typed.
 */
export function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}
