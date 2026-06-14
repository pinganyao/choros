import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const publicDir = join(__dirname, '../public')
const regionsFile = join(__dirname, '../src/data/regions.ts')

const siteUrl = (process.env.VITE_SITE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : ''))
  .replace(/\/$/, '')

const slugs = [...readFileSync(regionsFile, 'utf8').matchAll(/slug: '([^']+)'/g)].map((match) => match[1])

const paths = ['/', '/about', ...slugs.map((slug) => `/region/${slug}`)]

if (!siteUrl) {
  console.warn('generate-sitemap: VITE_SITE_URL not set; skipping sitemap and robots update')
  process.exit(0)
}

const today = new Date().toISOString().slice(0, 10)

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths
  .map((path) => {
    const loc = path === '/' ? siteUrl : `${siteUrl}${path}`
    const priority = path === '/' ? '1.0' : path === '/about' ? '0.8' : '0.7'
    const changefreq = path === '/' ? 'weekly' : 'monthly'
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
  })
  .join('\n')}
</urlset>
`

writeFileSync(join(publicDir, 'sitemap.xml'), sitemap)

const robots = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`

writeFileSync(join(publicDir, 'robots.txt'), robots)

console.log(`Wrote sitemap with ${paths.length} URLs to public/sitemap.xml`)
