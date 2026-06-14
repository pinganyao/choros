export const SITE_NAME = 'Choros'

export const DEFAULT_TITLE = 'Choros — Greek Traditional Music & Dance'

export const DEFAULT_DESCRIPTION =
  'Choros — an interactive map of Greek traditional music and dances. Explore every region of Greece and discover its musical heritage.'

export const OG_IMAGE_PATH = '/og-logo.png'

/** Absolute site origin, set at build time via VITE_SITE_URL or VERCEL_URL. */
export function getSiteUrl(): string {
  const url = import.meta.env.VITE_SITE_URL ?? ''
  return url.replace(/\/$/, '')
}

export function absoluteUrl(path: string): string {
  const siteUrl = getSiteUrl()
  const normalized = path.startsWith('/') ? path : `/${path}`
  return siteUrl ? `${siteUrl}${normalized}` : normalized
}

export function pageTitle(title: string): string {
  if (title === DEFAULT_TITLE) {
    return title
  }
  if (title.includes(SITE_NAME)) {
    return title
  }
  return `${title} — ${SITE_NAME}`
}
