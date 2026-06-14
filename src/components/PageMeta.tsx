import { useEffect } from 'react'
import {
  absoluteUrl,
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  getSiteUrl,
  OG_IMAGE_PATH,
  pageTitle,
} from '../seo/site'

type PageMetaProps = {
  title?: string
  description?: string
  path?: string
  noindex?: boolean
}

function upsertMeta(
  selector: string,
  create: () => HTMLMetaElement,
  content: string,
) {
  let el = document.querySelector(selector) as HTMLMetaElement | null
  if (!el) {
    el = create()
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertLink(rel: string, href: string) {
  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

function removeMeta(selector: string) {
  document.querySelector(selector)?.remove()
}

export function PageMeta({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  path = '/',
  noindex = false,
}: PageMetaProps) {
  useEffect(() => {
    const fullTitle = pageTitle(title)
    const canonical = getSiteUrl() ? absoluteUrl(path) : undefined
    const ogImage = absoluteUrl(OG_IMAGE_PATH)

    document.title = fullTitle

    upsertMeta(
      'meta[name="description"]',
      () => {
        const el = document.createElement('meta')
        el.setAttribute('name', 'description')
        return el
      },
      description,
    )

    upsertMeta(
      'meta[property="og:title"]',
      () => {
        const el = document.createElement('meta')
        el.setAttribute('property', 'og:title')
        return el
      },
      fullTitle,
    )

    upsertMeta(
      'meta[property="og:description"]',
      () => {
        const el = document.createElement('meta')
        el.setAttribute('property', 'og:description')
        return el
      },
      description,
    )

    upsertMeta(
      'meta[property="og:type"]',
      () => {
        const el = document.createElement('meta')
        el.setAttribute('property', 'og:type')
        return el
      },
      'website',
    )

    upsertMeta(
      'meta[property="og:image"]',
      () => {
        const el = document.createElement('meta')
        el.setAttribute('property', 'og:image')
        return el
      },
      ogImage,
    )

    upsertMeta(
      'meta[name="twitter:card"]',
      () => {
        const el = document.createElement('meta')
        el.setAttribute('name', 'twitter:card')
        return el
      },
      'summary_large_image',
    )

    upsertMeta(
      'meta[name="twitter:title"]',
      () => {
        const el = document.createElement('meta')
        el.setAttribute('name', 'twitter:title')
        return el
      },
      fullTitle,
    )

    upsertMeta(
      'meta[name="twitter:description"]',
      () => {
        const el = document.createElement('meta')
        el.setAttribute('name', 'twitter:description')
        return el
      },
      description,
    )

    upsertMeta(
      'meta[name="twitter:image"]',
      () => {
        const el = document.createElement('meta')
        el.setAttribute('name', 'twitter:image')
        return el
      },
      ogImage,
    )

    if (canonical) {
      upsertMeta(
        'meta[property="og:url"]',
        () => {
          const el = document.createElement('meta')
          el.setAttribute('property', 'og:url')
          return el
        },
        canonical,
      )
      upsertLink('canonical', canonical)
    } else {
      removeMeta('meta[property="og:url"]')
      document.querySelector('link[rel="canonical"]')?.remove()
    }

    if (noindex) {
      upsertMeta(
        'meta[name="robots"]',
        () => {
          const el = document.createElement('meta')
          el.setAttribute('name', 'robots')
          return el
        },
        'noindex, nofollow',
      )
    } else {
      removeMeta('meta[name="robots"]')
    }
  }, [title, description, path, noindex])

  return null
}
