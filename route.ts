import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getCatalog } from '@/lib/catalog'

export const dynamic = 'force-dynamic'

const pageKeys = new Set(['accueil', 'portfolio', 'services', 'histoire', 'contact', 'equipement'])
const text = (v: unknown): string => typeof v === 'string' ? v : ''
const image = (value: any) => {
  if (!value || typeof value !== 'object') return null
  const url = typeof value.url === 'string' ? value.url : ''
  if (!/^(https?:\/\/|\/api\/media\/|\/assets\/)/i.test(url)) return null
  return { url, alt: text(value.alt), width: value.width || null, height: value.height || null }
}
const link = (value: unknown) => {
  const v = text(value).trim()
  if (!v || /[<>"'`\\]/.test(v)) return ''
  if (/^(https?:\/\/[^\s]+|mailto:[^\s]+|\/?(?:index|portfolio|projet|tarifs|equipement|contact)\.html(?:[?#][^\s]+)?|#[\w-]+|\/)$/i.test(v)) return v
  return ''
}

function normalizeSection(section: any) {
  if (!section || typeof section !== 'object') return null
  const base = { type: text(section.blockType), title: text(section.title) }
  switch (section.blockType) {
    case 'texte':
      return { ...base, eyebrow: text(section.eyebrow), body: text(section.body), align: section.align === 'center' ? 'center' : 'left', buttonLabel: text(section.buttonLabel), buttonUrl: link(section.buttonUrl) }
    case 'photoTexte':
      return { ...base, image: image(section.image), description: text(section.description), caption: text(section.caption), placement: section.placement === 'right' ? 'right' : 'left', buttonLabel: text(section.buttonLabel), buttonUrl: link(section.buttonUrl) }
    case 'carrouselPhotos':
      return { ...base, description: text(section.description), slides: (Array.isArray(section.slides) ? section.slides : []).map((slide: any) => ({ image: image(slide.image), caption: text(slide.caption), link: link(slide.link) })).filter((slide: any) => slide.image) }
    case 'grillePhotos':
      return { ...base, columns: ['2', '3', '4'].includes(section.columns) ? section.columns : '3', photos: (Array.isArray(section.photos) ? section.photos : []).map((entry: any) => ({ image: image(entry.image), caption: text(entry.caption) })).filter((entry: any) => entry.image) }
    case 'carrouselProjets':
      return { ...base, mode: ['photo', 'video', 'all'].includes(section.mode) ? section.mode : 'photo', selection: section.selection === 'manual' ? 'manual' : 'auto', chosenSlugs: (Array.isArray(section.chosenProjects) ? section.chosenProjects : []).map((p: any) => typeof p === 'object' && p ? text(p.slug) : '').filter(Boolean), limit: Math.max(1, Math.min(30, Number(section.limit) || 8)) }
    case 'boutons':
      return { ...base, buttons: (Array.isArray(section.buttons) ? section.buttons : []).map((btn: any) => ({ label: text(btn.label), url: link(btn.url), style: btn.style === 'secondary' ? 'secondary' : 'primary' })).filter((btn: any) => btn.label && btn.url) }
    default:
      return null
  }
}

export async function GET(request: Request) {
  const pageKey = new URL(request.url).searchParams.get('page') || ''
  if (!pageKeys.has(pageKey)) return NextResponse.json({ error: 'Unknown page' }, { status: 400 })
  try {
    const payload = await getPayload({ config })
    const [result, navigation] = await Promise.all([
      payload.find({ collection: 'site-pages', where: { and: [{ pageKey: { equals: pageKey } }, { published: { equals: true } }] }, limit: 1, depth: 2, overrideAccess: true }),
      payload.findGlobal({ slug: 'navigation-site', depth: 0, overrideAccess: true }),
    ])
    const doc: any = result.docs[0]
    const hasProjectSection = Array.isArray(doc?.sections) && doc.sections.some((s: any) => s.blockType === 'carrouselProjets')
    const projects = hasProjectSection ? await getCatalog() : []
    const data = {
      page: doc ? {
        title: text(doc.title), heading: text(doc.heading), intro: text(doc.intro),
        mainButtonLabel: text(doc.mainButtonLabel), mainButtonUrl: link(doc.mainButtonUrl),
        secondButtonLabel: text(doc.secondButtonLabel), secondButtonUrl: link(doc.secondButtonUrl),
        bottomButtonLabel: text(doc.bottomButtonLabel), bottomButtonUrl: link(doc.bottomButtonUrl),
        sections: (Array.isArray(doc.sections) ? doc.sections : []).map(normalizeSection).filter(Boolean),
      } : null,
      navigation: navigation ? {
        links: (Array.isArray((navigation as any).links) ? (navigation as any).links : []).filter((l: any) => l.enabled !== false).map((l: any) => ({ label: text(l.label), url: link(l.url), newTab: Boolean(l.newTab) })).filter((l: any) => l.label && l.url),
        ctaLabel: text((navigation as any).ctaLabel), ctaUrl: link((navigation as any).ctaUrl),
        instagramUrl: link((navigation as any).instagramUrl),
        footerContactLabel: text((navigation as any).footerContactLabel), footerContactUrl: link((navigation as any).footerContactUrl),
      } : null,
      projects,
    }
    return NextResponse.json(data, { headers: { 'Cache-Control': 'no-store, max-age=0' } })
  } catch (error) {
    console.error('YRUZPHOTO page builder unavailable', error)
    return NextResponse.json({ page: null, navigation: null, projects: [] }, { headers: { 'Cache-Control': 'no-store' } })
  }
}
