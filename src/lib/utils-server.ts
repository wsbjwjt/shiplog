export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public details?: Record<string, unknown>
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function normalizeSemver(version: string): string {
  // Remove 'v' prefix if present
  const clean = version.replace(/^v/, '')

  // Split by dots
  const parts = clean.split('.')

  // Validate each part is numeric
  for (const part of parts) {
    if (!/^\d+$/.test(part)) {
      throw new Error('Invalid semver format')
    }
  }

  // Pad to 3 parts (major.minor.patch)
  while (parts.length < 3) {
    parts.push('0')
  }

  // Only keep major.minor.patch
  return parts.slice(0, 3).join('.')
}

export function isValidSemver(version: string): boolean {
  try {
    normalizeSemver(version)
    return true
  } catch {
    return false
  }
}
