import { list } from '@vercel/blob'
import pg from 'pg'

// Published Studio sections live in Neon; historical section snapshots stay in Blob.
// Media files are still managed by Payload and Vercel Blob.
const PREFIX = 'yruzphoto-studio/content-'
export type StudioRecord = {
  revision: string
  savedAt: string
  navigation: Record<string, unknown>
  pages: Record<string, unknown>
  libraryFolders: { names: string[]; assignments: Record<string, string> }
  mediaFrames: Record<string, { x: number; y: number; zoom: number; fit: string }>
}

// Original sample inventory, visible until the owner customizes the equipment page.
// Keeping the same identifiers preserves saved backpack selections.
const initialEquipment = [
  {id:'cam-a',slot:'camera',name:'Boîtier principal',category:'CAMÉRA',glyph:'📷',description:'Boîtier polyvalent pour la photographie et la captation vidéo.',specs:['Capteur : à renseigner','Monture : à renseigner','Résolution : à renseigner'],image:null},
  {id:'cam-b',slot:'camera',name:'Boîtier secondaire',category:'CAMÉRA',glyph:'📸',description:'Second boîtier pour varier les prises de vue.',specs:['Modèle : à renseigner','Usage : photo / vidéo','Accessoires : à renseigner'],image:null},
  {id:'lens-a',slot:'lens',name:'Objectif polyvalent',category:'OPTIQUE',glyph:'🔭',description:'Optique adaptée aux reportages et scènes variées.',specs:['Focale : à renseigner','Ouverture : à renseigner','Stabilisation : à renseigner'],image:null},
  {id:'lens-b',slot:'lens',name:'Téléobjectif',category:'OPTIQUE',glyph:'🔎',description:'Pour rapprocher l’action et les sujets éloignés.',specs:['Focale : à renseigner','Ouverture : à renseigner','Monture : à renseigner'],image:null},
  {id:'mic-a',slot:'audio',name:'Micro canon',category:'AUDIO',glyph:'🎙️',description:'Capture directionnelle pour les interviews et les tournages.',specs:['Connectique : à renseigner','Alimentation : à renseigner','Directivité : à renseigner'],image:null},
  {id:'mic-b',slot:'audio',name:'Micro cravate',category:'AUDIO',glyph:'🎤',description:'Enregistrement discret de la voix sur le terrain.',specs:['Type : sans-fil / filaire','Portée : à renseigner','Autonomie : à renseigner'],image:null},
  {id:'light-a',slot:'light',name:'Flash cobra',category:'LUMIÈRE',glyph:'⚡',description:'Flash mobile pour des portraits et événements.',specs:['Puissance : à renseigner','TTL : à renseigner','Compatibilité : à renseigner'],image:null},
  {id:'light-b',slot:'light',name:'Panneau LED',category:'LUMIÈRE',glyph:'💡',description:'Éclairage continu pour les vidéos et interviews.',specs:['Température : à renseigner','Puissance : à renseigner','Alimentation : à renseigner'],image:null},
]

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
  histoire: 'Mon histoire', equipement: 'Équipement', contact: 'Contact', pokedex: 'Le Pokédex',
}
const defaults = (): StudioRecord => ({
  revision: 'initial',
  savedAt: '',
  navigation: structuredClone(defaultNavigation),
  libraryFolders: { names: [], assignments: {} },
  mediaFrames: {},
  pages: Object.fromEntries(Object.entries(pageNames).map(([k, title]) => [k, {
    title, heading: '', intro: '', mainButtonLabel: '', mainButtonUrl: '',
    secondButtonLabel: '', secondButtonUrl: '', bottomButtonLabel: '',
    bottomButtonUrl: '', published: true, sections: [], heroImages: [null, null],
    serviceCards: Array.from({length: 3}, () => ({image:null,caption:'',buttonLabel:'',buttonUrl:''})),
    storyCards: Array.from({length: 3}, () => ({image:null,title:'',body:''})), textOverrides: {},
    ...(k === 'accueil' ? { featuredCards: {photo:null, video:null, graphisme:null} } : {}),
    ...(k === 'portfolio' ? { universeSections: {photo:[],video:[],graphisme:[]} } : {}),
    ...(k === 'equipement' ? { equipmentCustomized: false, equipmentItems: structuredClone(initialEquipment) } : {}),
    ...(k === 'pokedex' ? { heading: 'LE POKÉDEX', intro: 'Mes rencontres, mes photos, ma collection.', sortMode: 'rarity', cards: [] } : {}),
  }])),
})

<<<<<<< HEAD
// V77: Studio pages are stored in Neon. Historical Blob snapshots are read only
// for their one-time import. No missing or inaccessible snapshot is ever
// replaced automatically by demo data.
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, max: 3 })
let initialization: Promise<void> | undefined

export class StudioRecoveryError extends Error {
  readonly code = 'STUDIO_RECOVERY_PENDING'
  constructor(message: string, readonly retryAt: string | null = null) {
    super(message)
    this.name = 'StudioRecoveryError'
  }
}

async function ensureTable(): Promise<void> {
  if (!initialization) {
    initialization = Promise.all([
      pool.query(`CREATE TABLE IF NOT EXISTS yruzphoto_studio_content (
        id integer PRIMARY KEY CHECK (id = 1),
        revision text NOT NULL,
        content jsonb NOT NULL,
        updated_at timestamptz NOT NULL DEFAULT now()
      )`),
      // Shared across Vercel instances: prevents repeated list() calls while
      // Blob is rate-limited or unavailable. It contains no site content.
      pool.query(`CREATE TABLE IF NOT EXISTS yruzphoto_studio_migration_control (
        id integer PRIMARY KEY CHECK (id = 1),
        retry_at timestamptz NOT NULL DEFAULT to_timestamp(0),
        manual_retry_at timestamptz NOT NULL DEFAULT to_timestamp(0),
        last_error text NOT NULL DEFAULT ''
      )`),
    ]).then(() => undefined).catch(error => { initialization = undefined; throw error })
  }
  return initialization
}

=======
// V76: Studio content now lives in Neon, not in a new Blob on every publish.
// Only a one-time import reads the historical versioned Blob objects.
// Keeping a single SQL row avoids list() calls on every site visit.
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, max: 3 })
let initialization: Promise<void> | undefined
async function ensureTable(): Promise<void> {
  if (!initialization) {
    initialization = pool.query(`CREATE TABLE IF NOT EXISTS yruzphoto_studio_content (
      id integer PRIMARY KEY CHECK (id = 1),
      revision text NOT NULL,
      content jsonb NOT NULL,
      updated_at timestamptz NOT NULL DEFAULT now()
    )`).then(() => undefined).catch(error => { initialization = undefined; throw error })
  }
  return initialization
}
>>>>>>> 8d62acb33eea76d1beda5229cfec80667c0afe65
async function fromDatabase(): Promise<StudioRecord | null> {
  await ensureTable()
  const result = await pool.query('SELECT content FROM yruzphoto_studio_content WHERE id = 1')
  return result.rows[0]?.content as StudioRecord || null
}
<<<<<<< HEAD

=======
>>>>>>> 8d62acb33eea76d1beda5229cfec80667c0afe65
function mergeWithDefaults(stored: StudioRecord): StudioRecord {
  const initial = defaults()
  return {
    revision: String(stored.revision || 'initial'),
    savedAt: String(stored.savedAt || ''),
    navigation: { ...initial.navigation, ...(stored.navigation || {}) },
    libraryFolders: {
      names: Array.isArray(stored.libraryFolders?.names) ? stored.libraryFolders.names : [],
      assignments: stored.libraryFolders?.assignments && typeof stored.libraryFolders.assignments === 'object' ? stored.libraryFolders.assignments : {},
    },
    mediaFrames: stored.mediaFrames && typeof stored.mediaFrames === 'object' ? stored.mediaFrames : initial.mediaFrames,
    pages: Object.fromEntries(Object.entries(initial.pages).map(([key, value]) => [
      key, { ...(value as Record<string, unknown>), ...((stored.pages || {})[key] as Record<string, unknown> || {}) },
    ])),
  }
}
<<<<<<< HEAD

async function importLegacyBlob(): Promise<StudioRecord> {
  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (!token) throw new Error('Token de lecture Vercel Blob manquant')

=======
async function importLegacyBlob(): Promise<StudioRecord> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) throw new Error('BLOB_READ_WRITE_TOKEN missing; cannot migrate Studio')
  // Imported once. Subsequent reads and saves are entirely Neon-based.
>>>>>>> 8d62acb33eea76d1beda5229cfec80667c0afe65
  let cursor: string | undefined
  let latest: { pathname: string; url: string } | undefined
  let loops = 0
  do {
<<<<<<< HEAD
    const batch = await list({ prefix: PREFIX, limit: 1000, cursor, token })
=======
    const batch = await list({ prefix: PREFIX, limit: 1000, cursor, token: process.env.BLOB_READ_WRITE_TOKEN })
>>>>>>> 8d62acb33eea76d1beda5229cfec80667c0afe65
    for (const blob of batch.blobs) {
      if (blob.pathname.endsWith('.json') && (!latest || blob.pathname > latest.pathname)) {
        latest = { pathname: blob.pathname, url: blob.url }
      }
    }
    cursor = batch.hasMore ? batch.cursor : undefined
    loops++
  } while (cursor && loops < 30)
<<<<<<< HEAD

  // No automatic 'initial' document is published: an empty list can also mean
  // a misconfigured Blob store. Protect the owner's previous changes.
  if (!latest) throw new Error('Aucune sauvegarde Studio trouvée dans ce Blob Store')
  if (cursor) throw new Error('La liste des sauvegardes Studio est incomplète')

  const url = new URL(latest.url)
  // Do not forward the private token to a URL outside the official Blob CDN.
  if (url.protocol !== 'https:' || !/^[a-z0-9-]+\.(private|public)\.blob\.vercel-storage\.com$/.test(url.hostname)) {
    throw new Error('Adresse de sauvegarde Blob invalide')
  }
  const privateStore = url.hostname.includes('.private.blob.vercel-storage.com')
  const response = await fetch(url, {
    cache: 'no-store',
    // A private Blob URL returns HTTP 403 without an Authorization header.
    headers: privateStore ? { Authorization: `Bearer ${token}` } : undefined,
    signal: AbortSignal.timeout(20000),
  })
  if (!response.ok) throw new Error(`Lecture de la sauvegarde Blob refusée : HTTP ${response.status}`)

  const stored: unknown = await response.json()
  if (!stored || typeof stored !== 'object' || !('pages' in stored) ||
      !stored.pages || typeof stored.pages !== 'object' || !Object.keys(stored.pages).length) {
    throw new Error('Le fichier de sauvegarde Studio ne contient pas de pages valides')
  }
  return mergeWithDefaults(stored as StudioRecord)
}

async function claimMigration(): Promise<boolean> {
  const result = await pool.query(`INSERT INTO yruzphoto_studio_migration_control (id, retry_at)
    VALUES (1, now() + interval '5 minutes')
    ON CONFLICT (id) DO UPDATE SET retry_at = EXCLUDED.retry_at, last_error = ''
    WHERE yruzphoto_studio_migration_control.retry_at <= now()
    RETURNING id`)
  return Boolean(result.rowCount)
}

function readableFailure(error: unknown): string {
  const raw = error instanceof Error ? error.message : ''
  if (/HTTP 403/.test(raw)) return 'Vercel Blob refuse la lecture de la sauvegarde (HTTP 403). Les données restent protégées.'
  if (/HTTP 429/.test(raw)) return 'Le quota Vercel Blob est temporairement limité (HTTP 429).'
  if (/Aucune sauvegarde/.test(raw)) return 'Aucune sauvegarde Studio trouvée. Vérifier le Blob Store connecté, sans le recréer.'
  if (/Token de lecture/.test(raw)) return 'Token Vercel Blob absent. Vérifier la connexion du stockage à ce projet.'
  return 'Sauvegarde Studio temporairement inaccessible ; la récupération doit être réessayée.'
}

async function migrationUnavailable(): Promise<StudioRecoveryError> {
  const result = await pool.query(`SELECT retry_at, last_error
    FROM yruzphoto_studio_migration_control WHERE id = 1`)
  const row = result.rows[0]
  if (!row) return new StudioRecoveryError('Récupération du Studio en cours.')
  return new StudioRecoveryError(
    row.last_error || 'Récupération des données du Studio en cours. Réessaye dans quelques instants.',
    row.retry_at ? new Date(row.retry_at).toISOString() : null,
  )
}

let migration: Promise<void> | undefined
async function migrateOnce(): Promise<void> {
  await ensureTable()
  if (!await claimMigration()) throw await migrationUnavailable()
  try {
    const imported = await importLegacyBlob()
    await pool.query(`INSERT INTO yruzphoto_studio_content (id, revision, content)
      VALUES (1, $1, $2::jsonb) ON CONFLICT (id) DO NOTHING`,
      [imported.revision, JSON.stringify(imported)])
    await pool.query(`UPDATE yruzphoto_studio_migration_control SET last_error = '', retry_at = now()
      WHERE id = 1`)
  } catch (error) {
    const reason = readableFailure(error)
    const result = await pool.query(`UPDATE yruzphoto_studio_migration_control
      SET last_error = $1, retry_at = now() + interval '6 hours'
      WHERE id = 1 RETURNING retry_at`, [reason])
    throw new StudioRecoveryError(reason, result.rows[0]?.retry_at ? new Date(result.rows[0].retry_at).toISOString() : null)
  }
}

export async function requestStudioMigrationRetry(): Promise<boolean> {
  // Authenticated route only. One manual retry per 10 minutes prevents
  // repeated paid operations when the quota is already exhausted.
  if (await fromDatabase()) return true
  const result = await pool.query(`UPDATE yruzphoto_studio_migration_control
    SET retry_at = now() - interval '1 second',
        manual_retry_at = now() + interval '10 minutes', last_error = ''
    WHERE id = 1 AND last_error <> '' AND manual_retry_at <= now()
    RETURNING id`)
  return Boolean(result.rowCount)
}

export async function getStudioContent(): Promise<StudioRecord> {
  const existing = await fromDatabase()
  if (existing) return structuredClone(mergeWithDefaults(existing))
  if (!migration) migration = migrateOnce().finally(() => { migration = undefined })
  await migration
  const persisted = await fromDatabase()
  if (!persisted) throw new StudioRecoveryError('Importation terminée, mais aucune sauvegarde n’a été inscrite dans Neon.')
=======
  if (!latest) return defaults()
  const response = await fetch(latest.url, { cache: 'no-store' })
  if (!response.ok) throw new Error(`Studio Blob migration unavailable: HTTP ${response.status}`)
  return mergeWithDefaults(await response.json() as StudioRecord)
}

let migration: Promise<StudioRecord> | undefined
export async function getStudioContent(): Promise<StudioRecord> {
  const existing = await fromDatabase()
  if (existing) return structuredClone(mergeWithDefaults(existing))
  // Never silently erase the owner's published changes if Blob is quota-blocked.
  if (!migration) migration = (async () => {
    const imported = await importLegacyBlob()
    await pool.query(`INSERT INTO yruzphoto_studio_content (id,revision,content)
      VALUES (1,$1,$2::jsonb) ON CONFLICT (id) DO NOTHING`,
      [imported.revision, JSON.stringify(imported)])
    return imported
  })().catch(error => { migration = undefined; throw error })
  await migration
  const persisted = await fromDatabase()
  if (!persisted) throw new Error('Studio migration was not persisted in Neon')
>>>>>>> 8d62acb33eea76d1beda5229cfec80667c0afe65
  return structuredClone(mergeWithDefaults(persisted))
}

const str = (value: unknown, max = 2000): string => typeof value === 'string' ? value.trim().slice(0, max) : ''
const bool = (value: unknown) => value !== false
// Priority from top of the collector album to bottom. Stable sort preserves
// the user's chosen order inside each rarity tier.
const pokedexPriority: Record<string, number> = { legendaire: 0, rare: 1, peu_commune: 2, commun: 3 }
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
const english = (v: any, keys: readonly string[], max = 2500) => {
  const raw = v && typeof v === 'object' ? v : {}
  return Object.fromEntries(keys.map(k => [k, str(raw[k], max)]).filter(([,v]) => v))
}
const textOverridesEn = (v: any) => Object.fromEntries(
  Object.entries(v && typeof v === 'object' ? v : {}).filter(([k]) => /^[a-zA-Z][a-zA-Z0-9]{0,60}$/.test(k))
    .slice(0,80).map(([k,v]) => [k, str(v,1200)]).filter(([,v]) => v)
)
const sectionEnglish = (b: Record<string, any>, locale: 'en' | 'ptBr' = 'en') => english(b[locale], ['eyebrow','title','body','description','caption','buttonLabel'],8000)
const buttonFields = (p: Record<string, unknown>) => ({
  buttonLabel: str(p.buttonLabel, 160), buttonUrl: url(p.buttonUrl),
})

function cleanSection(raw: unknown): unknown | null {
  if (!raw || typeof raw !== 'object') return null
  const b = raw as Record<string, unknown>
  const type = str(b.type, 40)
  const common = { type, title: str(b.title, 180), en: sectionEnglish(b), ptBr: sectionEnglish(b, 'ptBr') }
  if (type === 'texte') return { ...common, eyebrow: str(b.eyebrow, 100), body: str(b.body, 8000), align: b.align === 'center' ? 'center' : 'left', ...buttonFields(b) }
  if (type === 'photoTexte') return { ...common, image: image(b.image), description: str(b.description, 4000), caption: str(b.caption, 280), placement: b.placement === 'right' ? 'right' : 'left', ...buttonFields(b) }
  if (type === 'carrouselPhotos') return { ...common, description: str(b.description, 3000), slides: (Array.isArray(b.slides) ? b.slides : []).slice(0, 150).map((r:any) => ({ image: image(r.image), caption: str(r.caption, 300), captionEn: str(r.captionEn, 300), captionPtBr: str(r.captionPtBr, 300), link: url(r.link) })).filter((r:any) => r.image) }
  if (type === 'grillePhotos') return { ...common, columns: ['2','3','4'].includes(String(b.columns)) ? String(b.columns) : '3', photos: (Array.isArray(b.photos) ? b.photos : []).slice(0, 150).map((r:any) => ({ image: image(r.image), caption: str(r.caption, 300), captionEn: str(r.captionEn, 300), captionPtBr: str(r.captionPtBr, 300) })).filter((r:any) => r.image) }
  if (type === 'carrouselProjets') return { ...common, mode: ['photo','video','graphisme','all'].includes(String(b.mode)) ? b.mode : 'photo', selection: b.selection === 'manual' ? 'manual' : 'auto', chosenSlugs: (Array.isArray(b.chosenSlugs) ? b.chosenSlugs : []).slice(0,30).map((s:any) => str(s, 100)), limit: Math.max(1, Math.min(30, Number(b.limit) || 8)) }
  if (type === 'boutons') return { ...common, buttons: (Array.isArray(b.buttons) ? b.buttons : []).slice(0, 40).map((r:any) => ({ label: str(r.label, 140), labelEn: str(r.labelEn, 140), labelPtBr: str(r.labelPtBr, 140), url: url(r.url), style: r.style === 'secondary' ? 'secondary' : 'primary' })).filter((r:any) => r.label && r.url) }
  return null
}

export function sanitizeStudio(raw: unknown): StudioRecord {
  const input = raw && typeof raw === 'object' ? raw as Record<string, any> : {}
  const initial = defaults()
  const nav = input.navigation || {}
  const inputPages = input.pages || {}
  const navigation = {
    links: (Array.isArray(nav.links) ? nav.links : initial.navigation.links as any[]).slice(0,20).map((r:any) => ({ label: str(r.label,80), labelEn: str(r.labelEn,120), labelPtBr: str(r.labelPtBr,120), url: url(r.url), enabled: bool(r.enabled), newTab: r.newTab === true })).filter((r:any) => r.label && r.url),
    ctaLabel: str(nav.ctaLabel,140), ctaLabelEn: str(nav.ctaLabelEn,160), ctaLabelPtBr: str(nav.ctaLabelPtBr,160), ctaUrl: url(nav.ctaUrl), instagramUrl: url(nav.instagramUrl),
    footerContactLabel: str(nav.footerContactLabel,80), footerContactLabelEn: str(nav.footerContactLabelEn,120), footerContactLabelPtBr: str(nav.footerContactLabelPtBr,120), footerContactUrl: url(nav.footerContactUrl),
  }
  const pages: Record<string, unknown> = {}
  for (const [key,title] of Object.entries(pageNames)) {
    const p = inputPages[key] && typeof inputPages[key] === 'object' ? inputPages[key] : {}
    pages[key] = {
      title, heading: str(p.heading,250), intro: str(p.intro,4000),
      en: { ...english(p.en, ['heading','intro','mainButtonLabel','secondButtonLabel','bottomButtonLabel'],4500),
        textOverrides: textOverridesEn(p.en?.textOverrides) },
      ptBr: { ...english(p.ptBr, ['heading','intro','mainButtonLabel','secondButtonLabel','bottomButtonLabel'],4500),
        textOverrides: textOverridesEn(p.ptBr?.textOverrides) },
      mainButtonLabel: str(p.mainButtonLabel,160), mainButtonUrl: url(p.mainButtonUrl),
      secondButtonLabel: str(p.secondButtonLabel,160), secondButtonUrl: url(p.secondButtonUrl),
      bottomButtonLabel: str(p.bottomButtonLabel,160), bottomButtonUrl: url(p.bottomButtonUrl),
      published: bool(p.published),
      heroImages: (Array.isArray(p.heroImages) ? p.heroImages : []).slice(0,2).map(image),
      serviceCards: (Array.isArray(p.serviceCards) ? p.serviceCards : []).slice(0,3).map((row:any) => ({image:image(row.image),caption:str(row.caption,150),buttonLabel:str(row.buttonLabel,140),buttonUrl:url(row.buttonUrl),
        en: english(row.en,['caption','buttonLabel'],300), ptBr: english(row.ptBr,['caption','buttonLabel'],300)})),
      storyCards: (Array.isArray(p.storyCards) ? p.storyCards : []).slice(0,3).map((row:any) => ({image:image(row.image),title:str(row.title,200),body:str(row.body,4000),kicker:str(row.kicker,150),indexLabel:str(row.indexLabel,150),caption:str(row.caption,220),note:str(row.note,250),buttonLabel:str(row.buttonLabel,150),buttonUrl:url(row.buttonUrl),
      en: english(row.en,['title','body','kicker','indexLabel','caption','note','buttonLabel'],4000), ptBr: english(row.ptBr,['title','body','kicker','indexLabel','caption','note','buttonLabel'],4000)})),
      textOverrides: Object.fromEntries(Object.entries(p.textOverrides && typeof p.textOverrides==='object' ? p.textOverrides : {}).filter(([k]) => /^[a-zA-Z][a-zA-Z0-9]{0,60}$/.test(k)).slice(0,60).map(([k,v]) => [k,str(v,900)])),
      ...(key === 'accueil' ? { featuredCards: Object.fromEntries(['photo','video','graphisme'].map(mode => {
        const original = p.featuredCards?.[mode]
        return [mode, Array.isArray(original) ? original.slice(0,30).map((r:any)=>({
          title:str(r.title,180), category:str(r.category,140), titleEn:str(r.titleEn,180), categoryEn:str(r.categoryEn,140), titlePtBr:str(r.titlePtBr,180), categoryPtBr:str(r.categoryPtBr,140), cover:image(r.cover), link:url(r.link), enabled:bool(r.enabled)
        })) : null]
      })) } : {}),
      ...(key === 'equipement' ? {
        equipmentCustomized: p.equipmentCustomized === true,
        equipmentItems: (Array.isArray(p.equipmentItems) ? p.equipmentItems : initialEquipment)
          .slice(0, 48).map((raw:any, i:number) => ({
            id: /^[a-zA-Z0-9_-]{1,80}$/.test(String(raw?.id||'')) ? String(raw.id) : `gear-${i+1}`,
            slot: ['camera','lens','audio','light'].includes(String(raw?.slot)) ? raw.slot : 'camera',
            name: str(raw?.name, 140), category: str(raw?.category, 85),
            glyph: str(raw?.glyph, 16), description: str(raw?.description, 2400),
            specs: (Array.isArray(raw?.specs) ? raw.specs : []).slice(0,20).map((v:any)=>str(v,250)).filter(Boolean),
            image: image(raw?.image), en: english(raw?.en,['name','category','description'],2400), ptBr: english(raw?.ptBr,['name','category','description'],2400),
          })).filter((item:any) => item.name)
      } : {}),
      ...(key === 'pokedex' ? { sortMode: p.sortMode === 'manual' ? 'manual' : 'rarity', cards: (Array.isArray(p.cards) ? p.cards : []).slice(0,200).map((raw:any, index:number) => ({
        id: str(raw.id, 80) || `carte-${index+1}`,
        title: str(raw.title, 160), subtitle: str(raw.subtitle, 180),
        rarity: ['commun','peu_commune','rare','legendaire'].includes(String(raw.rarity)) ? raw.rarity : 'commun',
        category: str(raw.category, 140), event: str(raw.event, 180),
        date: str(raw.date, 100), description: str(raw.description, 3000),
        cover: image(raw.cover), gallery: (Array.isArray(raw.gallery) ? raw.gallery : []).slice(0,40).map(image).filter(Boolean),
        published: bool(raw.published), en: english(raw.en,['subtitle','category','event','description'],3000), ptBr: english(raw.ptBr,['subtitle','category','event','description'],3000),
      })).sort((a:any,b:any) => p.sortMode === 'manual' ? 0 : (pokedexPriority[a.rarity] ?? 3) - (pokedexPriority[b.rarity] ?? 3)) } : {}),
      ...(key === 'portfolio' ? { projectEnglish: Object.fromEntries(
        Object.entries(p.projectEnglish && typeof p.projectEnglish === 'object' ? p.projectEnglish : {}).filter(([key]) => /^[a-zA-Z0-9_-]{1,120}$/.test(key)).slice(0,350)
          .map(([slug, value]) => [slug, english(value,['title','category'],250)])
      ) } : {}),
      ...(key === 'portfolio' ? { projectPortuguese: Object.fromEntries(
        Object.entries(p.projectPortuguese && typeof p.projectPortuguese === 'object' ? p.projectPortuguese : {}).filter(([key]) => /^[a-zA-Z0-9_-]{1,120}$/.test(key)).slice(0,350)
          .map(([slug, value]) => [slug, english(value,['title','category'],250)])
      ) } : {}),
      ...(key === 'portfolio' ? { universeSections: Object.fromEntries(['photo','video','graphisme'].map(mode => [
        mode, (Array.isArray(p.universeSections?.[mode]) ? p.universeSections[mode] : []).slice(0,80).map(cleanSection).filter(Boolean)
      ])) } : {}),
      sections: (Array.isArray(p.sections) ? p.sections : []).slice(0, 80).map(cleanSection).filter(Boolean),
    }
  }
  // Virtual media folders and non-destructive per-image framing are stored in
  // the published Studio JSON. Payload media records and Blob URLs remain intact.
  const rawFolders = input.libraryFolders && typeof input.libraryFolders === 'object' ? input.libraryFolders : {}
  const names: string[] = Array.from(new Set<string>(
    (Array.isArray(rawFolders.names) ? rawFolders.names : [])
      .slice(0, 150)
      .map((n: unknown) => str(n, 55))
      .filter((n: string) => n.length > 0 && !/[<>\x00-\x1f]/.test(n))
  ))
  const assignments: Record<string,string> = {}
  for (const [id, name] of Object.entries(rawFolders.assignments && typeof rawFolders.assignments === 'object' ? rawFolders.assignments : {}).slice(0,20000)) {
    if (/^[a-zA-Z0-9_-]{1,80}$/.test(id) && names.includes(String(name))) assignments[id] = String(name)
  }
  const mediaFrames: Record<string,{x:number;y:number;zoom:number;fit:string}> = {}
  const inputFrames = input.mediaFrames && typeof input.mediaFrames === 'object' ? input.mediaFrames : {}
  const limit = (v:any,min:number,max:number,d:number) => Number.isFinite(Number(v))? Math.max(min,Math.min(max,Number(v))):d
  for (const [source, frame] of Object.entries(inputFrames).slice(0,20000)) {
    if (!image({url:source}) || !frame || typeof frame !== 'object') continue
    const f = frame as any
    mediaFrames[source] = { x:limit(f.x,0,100,50),y:limit(f.y,0,100,50),zoom:limit(f.zoom,1,2,1),fit:f.fit==='contain'?'contain':'cover' }
  }
  return { revision: 'initial', savedAt: '', navigation, pages, libraryFolders:{names,assignments}, mediaFrames }
}

export async function saveStudioContent(input: unknown, expectedRevision: unknown): Promise<StudioRecord> {
  // Ensure migration finishes before accepting any edit; never overwrite an
  // inaccessible historical Studio snapshot with demo/default content.
  await getStudioContent()
  const next: StudioRecord = {
    ...sanitizeStudio(input),
    revision: `${Date.now()}-${crypto.randomUUID()}`,
    savedAt: new Date().toISOString(),
  }
  // Optimistic concurrency: the existing revision must still match.
  const result = await pool.query(`UPDATE yruzphoto_studio_content
    SET revision = $1, content = $2::jsonb, updated_at = now()
    WHERE id = 1 AND revision = $3 RETURNING id`,
    [next.revision, JSON.stringify(next), str(expectedRevision, 100)])
  if (!result.rowCount) {
    throw Object.assign(new Error('Une modification plus récente existe. Actualisez le Studio avant d’enregistrer.'), { code: 'CONFLICT' })
  }
  return structuredClone(next)
}
