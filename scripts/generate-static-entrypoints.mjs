import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { pageMetadata, publicPages, SITE_URL } from '../src/config/seo.js'

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const distDirectory = path.join(projectRoot, 'dist')
const source = await readFile(path.join(distDirectory, 'index.html'), 'utf8')

const escapeHtml = value => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;')

function replaceMeta(html, selector, value, attribute = 'name') {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const pattern = new RegExp(`<meta([^>]*${attribute}=["']${escapedSelector}["'][^>]*)>`, 'i')
  return html.replace(pattern, match => {
    const escapedValue = escapeHtml(value)
    return /content=["'][^"']*["']/i.test(match)
      ? match.replace(/content=["'][^"']*["']/i, `content="${escapedValue}"`)
      : match.replace(/\s*\/?\s*>$/, ` content="${escapedValue}" />`)
  })
}

function renderMetadata(html, { title, description, canonical, indexable }) {
  let output = html.replace(/<title>[^<]*<\/title>/i, `<title>${escapeHtml(title)}</title>`)
  output = replaceMeta(output, 'description', description)
  output = replaceMeta(output, 'robots', indexable ? 'index, follow' : 'noindex, nofollow')
  output = replaceMeta(output, 'og:title', title, 'property')
  output = replaceMeta(output, 'og:description', description, 'property')
  output = replaceMeta(output, 'og:url', canonical || SITE_URL, 'property')
  output = replaceMeta(output, 'twitter:title', title)
  output = replaceMeta(output, 'twitter:description', description)
  if (canonical) {
    output = output.replace(/<link\s+rel=["']canonical["'][^>]*>/i, `<link rel="canonical" href="${escapeHtml(canonical)}" />`)
  } else {
    output = output.replace(/\s*<link\s+rel=["']canonical["'][^>]*>/i, '')
  }
  return output
}

for (const { path: routePath } of publicPages) {
  const metadata = pageMetadata[routePath]
  const canonical = `${SITE_URL}${routePath === '/' ? '' : routePath}`
  const html = renderMetadata(source, { ...metadata, canonical, indexable: true })
  const outputPath = routePath === '/'
    ? path.join(distDirectory, 'index.html')
    : path.join(distDirectory, routePath.slice(1), 'index.html')
  await mkdir(path.dirname(outputPath), { recursive: true })
  await writeFile(outputPath, html, 'utf8')
}

const notFoundHtml = renderMetadata(source, {
  title: 'Page Not Found | Panther X Vision',
  description: 'The requested Panther X Vision page could not be found.',
  canonical: null,
  indexable: false,
})
await writeFile(path.join(distDirectory, '404.html'), notFoundHtml, 'utf8')

const adminHtml = renderMetadata(source, {
  title: 'Reviews Admin | Panther X Vision',
  description: 'Protected Panther X Vision review moderation dashboard.',
  canonical: null,
  indexable: false,
})
const adminPath = path.join(distDirectory, 'admin', 'reviews', 'index.html')
await mkdir(path.dirname(adminPath), { recursive: true })
await writeFile(adminPath, adminHtml, 'utf8')
