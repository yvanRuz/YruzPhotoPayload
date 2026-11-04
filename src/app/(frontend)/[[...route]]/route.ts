import { promises as fs } from 'node:fs'
import path from 'node:path'
import { NextResponse } from 'next/server'
import { getStudioContent } from '@/lib/studio-store'

export const dynamic = 'force-dynamic'
const allowed = new Set(['', 'index.html', 'portfolio.html', 'projet.html', 'tarifs.html', 'equipement.html', 'contact.html', 'pokedex.html'])
const pageKeys: Record<string, string> = {
  '': 'accueil', 'index.html': 'accueil', 'tarifs.html': 'services',
  'portfolio.html': 'portfolio', 'equipement.html': 'equipement', 'contact.html': 'contact',
}

// Only allow image URLs that the public site accepts. Escape for an HTML attribute.
function imageUrl(value: unknown): string {
  const url = typeof value === 'string' ? value.trim() : ''
  return /^(https?:\/\/[^\s<>"'`]+|\/api\/media\/[^\s<>"'`]+|\/assets\/[^\s<>"'`]+|assets\/[^\s<>"'`]+)$/i.test(url) ? url : ''
}
function escapeAttr(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
}

// Replace the stock service images in the server response BEFORE the browser parses the HTML.
// The old approach rendered Unsplash images first and swapped them after /cms-content resolved.
function renderServiceImages(html: string, page: any): string {
  const cards = Array.isArray(page?.serviceCards) ? page.serviceCards : []
  let index = 0
  // Both homepage and Services use their own img attribute order (alt before src on homepage).
  return html.replace(/<div class="service-visual"><img\b[^>]*>/g, (original) => {
    const card = cards[index++]
    const url = imageUrl(card?.image?.url)
    if (!url) return original
    const alt = typeof card?.image?.alt === 'string' ? card.image.alt : ''
    let result = original.replace(/\bsrc="[^"]*"/, `src="${escapeAttr(url)}"`)
    if (alt) result = result.replace(/\balt="[^"]*"/, `alt="${escapeAttr(alt)}"`)
    return result
  })
}

// The homepage also contains static demo pictures for Services and Mon histoire.
// Replace them in the server HTML, rather than rendering them for 1-2 seconds.
function renderStoryImages(html: string, page: any): string {
  const cards = Array.isArray(page?.storyCards) ? page.storyCards : []
  let index = 0
  return html.replace(/(<div class="story-photo[^"]*"><img\s+src=")[^"]*("\s+alt=")[^"]*(")/g, (original, start, middle, end) => {
    const card = cards[index++]
    const url = imageUrl(card?.image?.url)
    if (!url) return original
    return start + escapeAttr(url) + middle + escapeAttr(String(card.image?.alt || '')) + end
  })
}

export async function GET(_request: Request, { params }: any) {
  const result = await params
  const name = Array.isArray(result?.route) ? result.route.join('/') : ''
  if (!allowed.has(name)) return new Response('Not found', { status: 404 })
  let html = await fs.readFile(path.join(process.cwd(), 'public', 'site', name || 'index.html'), 'utf8')
  const key = pageKeys[name]
  if (key) {
    try {
      const content = await getStudioContent()
      const page: any = content.pages?.[key]
      const published = page?.published !== false ? page ?? null : null
      if (key === 'services' && published) html = renderServiceImages(html, published)
      const related: Record<string, any> = {}
      if (key === 'accueil') {
        for (const relatedKey of ['services', 'histoire']) {
          const relatedPage: any = content.pages?.[relatedKey]
          related[relatedKey] = relatedPage?.published !== false ? relatedPage ?? null : null
        }
        if (related.services) html = renderServiceImages(html, related.services)
        if (related.histoire) html = renderStoryImages(html, related.histoire)
        // The browser starts downloading the published hero, not the stock background.
        const hero = Array.isArray(published?.heroImages) ? published.heroImages.map((item:any) => imageUrl(item?.url)).find(Boolean) : ''
        if (hero) html = html.replace('</head>', `<link rel="preload" as="image" href="${escapeAttr(hero)}" fetchpriority="high"></head>`)
      }
      // Bootstrap all visible homepage blocks in one server response; no late stock-image swap.
      const bootstrap = { key, page: published, related, navigation: content.navigation }
      const json = JSON.stringify(bootstrap)
        .replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029')
      html = html.replace('</head>', `<script>window.YRUZ_INITIAL_PAGE=${json};${key === 'accueil' ? `window.YRUZ_INITIAL_HOME={page:window.YRUZ_INITIAL_PAGE.page,navigation:window.YRUZ_INITIAL_PAGE.navigation};` : ''}</script></head>`)
    } catch (error) {
      console.warn('YRUZPHOTO initial Studio content unavailable:', error)
    }
  }
  return new NextResponse(html, { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } })
}
