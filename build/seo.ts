// After the app is built, writes a page for every report with its own <head>: title, description,
// canonical URL, Open Graph and Twitter card tags, and JSON-LD. Link previews and most crawlers don't
// run JavaScript, so without this every shared link would show the home page's preview.
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'
import type { Plugin } from 'vite'
import type { ReportData } from '../src/reportData.ts'
import {
  homeTitle,
  reportDescription,
  reportTitle,
  siteDescription,
  siteName,
  siteTitle,
  siteUrl,
} from '../src/seo.ts'

interface Page {
  file: string
  title: string
  /** Title for link previews, which show the site name separately. */
  socialTitle: string
  description: string
  url: string
  image: string
  imageAlt: string
  type: 'website' | 'article'
  published?: string
  jsonLd: object
  noindex?: boolean
}

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function head(p: Page): string {
  const meta = (attr: string, key: string, value: string) =>
    `<meta ${attr}="${key}" content="${esc(value)}">`
  return [
    `<title>${esc(p.title)}</title>`,
    meta('name', 'description', p.description),
    p.noindex ? meta('name', 'robots', 'noindex') : `<link rel="canonical" href="${esc(p.url)}">`,
    meta('property', 'og:site_name', siteName),
    meta('property', 'og:type', p.type),
    meta('property', 'og:title', p.socialTitle),
    meta('property', 'og:description', p.description),
    meta('property', 'og:url', p.url),
    meta('property', 'og:image', p.image),
    meta('property', 'og:image:type', p.image.endsWith('.png') ? 'image/png' : 'image/jpeg'),
    meta('property', 'og:image:width', '1200'),
    meta('property', 'og:image:height', '630'),
    meta('property', 'og:image:alt', p.imageAlt),
    meta('property', 'og:locale', 'en_GB'),
    ...(p.published ? [meta('property', 'article:published_time', p.published)] : []),
    meta('name', 'twitter:card', 'summary_large_image'),
    meta('name', 'twitter:title', p.socialTitle),
    meta('name', 'twitter:description', p.description),
    meta('name', 'twitter:image', p.image),
    meta('name', 'twitter:image:alt', p.imageAlt),
    `<script type="application/ld+json">${JSON.stringify(p.jsonLd).replace(/</g, '\\u003c')}</script>`,
  ]
    .map((line) => `    ${line}`)
    .join('\n')
}

/** Swaps the template's <title> and description for the page's full set of tags. */
function render(template: string, p: Page): string {
  const out = template
    .replace(/^\s*<meta name="description"[^>]*>\n/m, '')
    .replace(/^\s*<title>.*<\/title>/m, head(p))
  if (out === template) throw new Error('seo: index.html has no <title> to replace')
  return out
}

export function seoPages(): Plugin {
  let root = ''
  let outDir = ''
  return {
    name: 'seo-pages',
    apply: 'build',
    configResolved(config) {
      root = config.root
      outDir = path.resolve(config.root, config.build.outDir)
    },
    async writeBundle() {
      const template = readFileSync(path.join(outDir, 'index.html'), 'utf8')
      const reportsDir = path.join(root, 'reports')
      const reports = readdirSync(reportsDir)
        .map((id) => ({
          id,
          ...(JSON.parse(
            readFileSync(path.join(reportsDir, id, 'report.json'), 'utf8'),
          ) as ReportData),
        }))
        .sort((a, b) => b.reportedAt.localeCompare(a.reportedAt))

      const write = (file: string, html: string) => {
        mkdirSync(path.dirname(path.join(outDir, file)), { recursive: true })
        writeFileSync(path.join(outDir, file), html)
      }

      const home: Page = {
        file: 'index.html',
        title: homeTitle(),
        socialTitle: siteTitle,
        description: siteDescription,
        url: siteUrl,
        image: `${siteUrl}og-image.png`,
        imageAlt: `${siteName}: tampered and fake Ledger wallets, and where they were bought`,
        type: 'website',
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: siteName,
          url: siteUrl,
          description: siteDescription,
        },
      }
      write('index.html', render(template, home))
      // GitHub Pages serves this for unknown paths; the app then redirects to the home page.
      write('404.html', render(template, { ...home, noindex: true }))

      mkdirSync(path.join(outDir, 'og'), { recursive: true })
      for (const r of reports) {
        const file = r.preview?.file ?? r.images[0]?.file
        const pictured = r.images.find((img) => img.file === file)
        if (!file || !pictured) throw new Error(`seo: reports/${r.id} has no preview image`)
        await sharp(path.join(reportsDir, r.id, file))
          .rotate()
          .resize(1200, 630, { fit: 'cover', position: r.preview?.position ?? 'centre' })
          .jpeg({ quality: 82, mozjpeg: true })
          .toFile(path.join(outDir, 'og', `${r.id}.jpg`))

        const url = `${siteUrl}report/${r.id}/`
        const image = `${siteUrl}og/${r.id}.jpg`
        const description = reportDescription(r)
        write(
          `report/${r.id}/index.html`,
          render(template, {
            file: `report/${r.id}/index.html`,
            title: reportTitle(r),
            socialTitle: r.title,
            description,
            url,
            image,
            imageAlt: pictured.caption ?? r.title,
            type: 'article',
            published: r.reportedAt,
            jsonLd: {
              '@context': 'https://schema.org',
              '@type': 'Article',
              headline: r.title,
              description,
              image: [image],
              datePublished: r.reportedAt,
              url,
              mainEntityOfPage: url,
              isPartOf: { '@type': 'WebSite', name: siteName, url: siteUrl },
              publisher: { '@type': 'Organization', name: siteName, url: siteUrl },
            },
          }),
        )
      }

      const urls = [
        { loc: siteUrl, lastmod: reports[0]?.reportedAt },
        ...reports.map((r) => ({ loc: `${siteUrl}report/${r.id}/`, lastmod: r.reportedAt })),
      ]
      write(
        'sitemap.xml',
        '<?xml version="1.0" encoding="UTF-8"?>\n' +
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
          urls
            .map(
              (u) =>
                `  <url><loc>${esc(u.loc)}</loc>${u.lastmod ? `<lastmod>${u.lastmod.slice(0, 10)}</lastmod>` : ''}</url>`,
            )
            .join('\n') +
          '\n</urlset>\n',
      )
    },
  }
}
