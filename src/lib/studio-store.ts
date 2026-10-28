import { list, put } from '@vercel/blob'

// Site sections live in Vercel Blob; media and reports stay in Payload + Neon.
// Versioned immutable objects avoid stale CDN caches after publishing.
const PREFIX = 'yruzphoto-studio/content-'
export type StudioRecord = {
  revision: string
  savedAt: string
  navigation: Record<string, unknown>
  pages: Record<string, unknown>
}

const defaultNavigation = {
  links: [
    { label: 'ACCUEIL', url: 'index.html', enabled: true, newTab: false },
    { label: 'PORTFOLIO', url: 'portfolio.html', enabled: true, newTab: false },
    { label: 'ÉQUIPEMENT', url: 'equipement.html', enabled: true, newTab: false },
    { label: 'SERVICES', url: 'tarifs.html', enabled: true, newTab: false },
    { label: 'CONTACT', url: 'contact.html', enabled: true, newTab: false },
  ],
  ctaLabel: 'PARLONS DE VOTRE PROJET',
  ctaUrl: 'contact.html',
  instagramUrl: '',
  footerContactLabel: 'CONTACT',
  footerContactUrl: 'contact.html',
}
const pageNames: Record<string, string> = {
  accueil: 'Accueil', portfolio: 'Portfolio', services: 'Services',
  histoire: 'Mon histoire', equipement: 'Équipement', contact: 'Contact',
}
const defaults = (): StudioRecord => ({
  revision: 'initial',
  savedAt: '',
  navigation: structuredClone(defaultNavigation),
  pages: Object.fromEntries(Object.entries(pageNames).map(([k, title]) => [k, {
    title, heading: '', intro: '', mainButtonLabel: '', mainButtonUrl: '',
    secondButtonLabel: '', secondButtonUrl: '', bottomButtonLabel: '',
    bottomButtonUrl: '', published: true, sections: [], heroImages: [null, null],
    serviceCards: Array.from({length: 3}, () => ({image:null,caption:'',buttonLabel:'',buttonUrl:''})),
    storyCards: Array.from({length: 3}, () => ({image:null,title:'',body:''})),
  }])),
})

let memo: { expires: number, value: StudioRecord } | undefined
function token(): string {
  if (!process.env.BLOB_READ_WRITE_TOKEN) throw new Error('BLOB_READ_WRITE_TOKEN missing')
  return process.env.BLOB_READ_WRITE_TOKEN
}

export async function getStudioContent(): Promise<StudioRecord> {
  if (memo && Date.now() < memo.expires) return structuredClone(memo.value)
  const key = token()
  // Paginated because Vercel Blob lists items in pathname order (not upload time).
  let cursor: string | undefined
  let latest: { pathname: string, url: string } | undefined
  let loops = 0
  do {
    const batch = await list({ prefix: PREFIX, limit: 1000, cursor, token: key })
    for (const blob of batch.blobs) {
      if (blob.pathname.endsWith('.json') && (!latest || blob.pathname > latest.pathname)) {
        latest = { pathname: blob.pathname, url: blob.url }
      }
    }
    cursor = batch.hasMore ? batch.cursor : undefined
    loops++
  } while (cursor && loops < 30)
  if (!latest) {
    const empty = defaults()
    memo = { expires: Date.now() + 10_000, value: empty }
    return structuredClone(empty)
  }
  const response = await fetch(latest.url, { cache: 'no-store' })
  if (!response.ok) throw new Error(`Blob fetch failed: ${response.status}`)
  const stored = await response.json() as StudioRecord
  // Fills any pages added in future versions without removing existing edits.
  const initial = defaults()
  const value: StudioRecord = {
    revision: String(stored.revision || 'initial'),
    savedAt: String(stored.savedAt || ''),
    navigation: { ...initial.navigation, ...(stored.navigation || {}) },
    pages: Object.fromEntries(Object.entries(initial.pages).map(([key, value]) => [
      key, { ...(value as Record<string, unknown>), ...((stored.pages || {})[key] as Record<string, unknown> || {}) },
    ])),
  }
  memo = { expires: Date.now() + 10_000, value }
  return structuredClone(value)
}

const str = (value: unknown, max = 2000): string => typeof value === 'string' ? value.trim().slice(0, max) : ''
const bool = (value: unknown) => value !== false
const url = (v: unknown): string => {
  const s = str(v, 1000)
  if (!s || /[<>'"`\\\s]/.test(s)) return ''
  return /^(https?:\/\/[^\s<>'"`]+|mailto:[^\s]+|(?:\/?(?:index|portfolio|projet|tarifs|equipement|contact)\.html)(?:[?#][^\s]*)?|\/?#[a-z\w-]+|\/)$/i.test(s) ? s : ''
}
const image = (v: unknown) => {
  if (!v || typeof v !== 'object') return null
  const value = v as {url?:unknown,alt?:unknown}
  const raw = str(value.url, 1600)
  if (!/^(https?:\/\/[^\s<>"'`]+|\/api\/media\/[^\s<>"'`]+|\/?assets\/[^\s<>"'`]+)$/i.test(raw)) return null
  return { url: raw, alt: str(value.alt, 250) }
}
const buttonFields = (p: Record<string, unknown>) => ({
  buttonLabel: str(p.buttonLabel, 160), buttonUrl: url(p.buttonUrl),
})

function cleanSection(raw: unknown): unknown | null {
  if (!raw || typeof raw !== 'object') return null
  const b = raw as Record<string, unknown>
  const type = str(b.type, 40)
  const common = { type, title: str(b.title, 180) }
  if (type === 'texte') return { ...common, eyebrow: str(b.eyebrow, 100), body: str(b.body, 8000), align: b.align === 'center' ? 'center' : 'left', ...buttonFields(b) }
  if (type === 'photoTexte') return { ...common, image: image(b.image), description: str(b.description, 4000), caption: str(b.caption, 280), placement: b.placement === 'right' ? 'right' : 'left', ...buttonFields(b) }
  if (type === 'carrouselPhotos') return { ...common, description: str(b.description, 3000), slides: (Array.isArray(b.slides) ? b.slides : []).slice(0, 150).map((r:any) => ({ image: image(r.image), caption: str(r.caption, 300), link: url(r.link) })).filter((r:any) => r.image) }
  if (type === 'grillePhotos') return { ...common, columns: ['2','3','4'].includes(String(b.columns)) ? String(b.columns) : '3', photos: (Array.isArray(b.photos) ? b.photos : []).slice(0, 150).map((r:any) => ({ image: image(r.image), caption: str(r.caption, 300) })).filter((r:any) => r.image) }
  if (type === 'carrouselProjets') return { ...common, mode: ['photo','video','all'].includes(String(b.mode)) ? b.mode : 'photo', selection: b.selection === 'manual' ? 'manual' : 'auto', chosenSlugs: (Array.isArray(b.chosenSlugs) ? b.chosenSlugs : []).slice(0,30).map((s:any) => str(s, 100)), limit: Math.max(1, Math.min(30, Number(b.limit) || 8)) }
  if (type === 'boutons') return { ...common, buttons: (Array.isArray(b.buttons) ? b.buttons : []).slice(0, 40).map((r:any) => ({ label: str(r.label, 140), url: url(r.url), style: r.style === 'secondary' ? 'secondary' : 'primary' })).filter((r:any) => r.label && r.url) }
  return null
}

export function sanitizeStudio(raw: unknown): StudioRecord {
  const input = raw && typeof raw === 'object' ? raw as Record<string, any> : {}
  const initial = defaults()
  const nav = input.navigation || {}
  const inputPages = input.pages || {}
  const navigation = {
    links: (Array.isArray(nav.links) ? nav.links : initial.navigation.links as any[]).slice(0,20).map((r:any) => ({ label: str(r.label,80), url: url(r.url), enabled: bool(r.enabled), newTab: r.newTab === true })).filter((r:any) => r.label && r.url),
    ctaLabel: str(nav.ctaLabel,140), ctaUrl: url(nav.ctaUrl), instagramUrl: url(nav.instagramUrl),
    footerContactLabel: str(nav.footerContactLabel,80), footerContactUrl: url(nav.footerContactUrl),
  }
  const pages: Record<string, unknown> = {}
  for (const [key,title] of Object.entries(pageNames)) {
    const p = inputPages[key] && typeof inputPages[key] === 'object' ? inputPages[key] : {}
    pages[key] = {
      title, heading: str(p.heading,250), intro: str(p.intro,4000),
      mainButtonLabel: str(p.mainButtonLabel,160), mainButtonUrl: url(p.mainButtonUrl),
      secondButtonLabel: str(p.secondButtonLabel,160), secondButtonUrl: url(p.secondButtonUrl),
      bottomButtonLabel: str(p.bottomButtonLabel,160), bottomButtonUrl: url(p.bottomButtonUrl),
      published: bool(p.published),
      heroImages: (Array.isArray(p.heroImages) ? p.heroImages : []).slice(0,2).map(image),
      serviceCards: (Array.isArray(p.serviceCards) ? p.serviceCards : []).slice(0,3).map((row:any) => ({image:image(row.image),caption:str(row.caption,150),buttonLabel:str(row.buttonLabel,140),buttonUrl:url(row.buttonUrl)})),
      storyCards: (Array.isArray(p.storyCards) ? p.storyCards : []).slice(0,3).map((row:any) => ({image:image(row.image),title:str(row.title,200),body:str(row.body,4000)})),
      sections: (Array.isArray(p.sections) ? p.sections : []).slice(0, 80).map(cleanSection).filter(Boolean),
    }
  }
  return { revision: 'initial', savedAt: '', navigation, pages }
}

export async function saveStudioContent(input: unknown, expectedRevision: unknown): Promise<StudioRecord> {
  const previous = await getStudioContent()
  if (str(expectedRevision, 100) !== previous.revision) {
    throw Object.assign(new Error('Une modification plus récente existe. Actualisez le Studio avant d’enregistrer.'), { code: 'CONFLICT' })
  }
  const next: StudioRecord = {
    ...sanitizeStudio(input),
    revision: `${Date.now()}-${crypto.randomUUID()}`,
    savedAt: new Date().toISOString(),
  }
  const pathname = `${PREFIX}${next.revision}.json`
  await put(pathname, JSON.stringify(next), { access: 'public', contentType: 'application/json', token: token() })
  memo = { expires: Date.now() + 10_000, value: next }
  return structuredClone(next)
}
