import { mkdir, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { publicPages, SITE_URL } from '../src/config/seo.js'

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const publicDirectory = path.join(projectRoot, 'public')
const sitemapPath = path.join(publicDirectory, 'sitemap.xml')

const escapeXml = value => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&apos;')

const urls = publicPages.map(({ path: routePath, changeFrequency, priority }) => {
  const url = `${SITE_URL}${routePath === '/' ? '/' : routePath}`
  return [
    '  <url>',
    `    <loc>${escapeXml(url)}</loc>`,
    `    <changefreq>${changeFrequency}</changefreq>`,
    `    <priority>${priority.toFixed(1)}</priority>`,
    '  </url>',
  ].join('\n')
}).join('\n')

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  urls,
  '</urlset>',
  '',
].join('\n')

await mkdir(publicDirectory, { recursive: true })
await writeFile(sitemapPath, sitemap, 'utf8')
