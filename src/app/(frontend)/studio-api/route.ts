import { getPayload } from 'payload'
import config from '@payload-config'
import { getStudioContent, saveStudioContent } from '@/lib/studio-store'

export const dynamic = 'force-dynamic'
const headers = { 'Cache-Control': 'no-store' }
async function authenticated(request: Request) {
  const payload = await getPayload({ config })
  const auth = await payload.auth({ headers: request.headers, canSetHeaders: false })
  return { payload, user: auth.user }
}
export async function GET(request: Request) {
  try {
    const { payload, user } = await authenticated(request)
    if (!user) return Response.json({ error: 'Connexion requise' }, { status: 401, headers })
    // Independent, paginated library. Authenticated users can browse beyond the
    // 200 images loaded into the original page editor; no new database tables.
    const params = new URL(request.url).searchParams
    if (params.get('view') === 'media') {
      const pageParam = Number.parseInt(params.get('page') || '1', 10)
      const page = Number.isFinite(pageParam) ? Math.max(1, Math.min(pageParam, 10000)) : 1
      const search = (params.get('search') || '').trim().slice(0, 80)
      const result = await payload.find({
        collection: 'media',
        page,
        limit: 36,
        sort: '-createdAt',
        depth: 0,
        overrideAccess: true,
        ...(search ? { where: { or: [{ alt: { contains: search } }, { filename: { contains: search } }] } } : {}),
      })
      return Response.json({
        media: result.docs.map((m: any) => ({ id: m.id, url: m.url || '', alt: m.alt || '', filename: m.filename || '' })).filter((m) => m.url),
        page: result.page, totalPages: result.totalPages, totalDocs: result.totalDocs,
        hasNextPage: result.hasNextPage, hasPrevPage: result.hasPrevPage,
      }, { headers })
    }
    const [content, media, projects] = await Promise.all([
      getStudioContent(),
      payload.find({ collection: 'media', limit: 200, sort: '-createdAt', depth: 0, overrideAccess: true }),
      payload.find({ collection: 'projects', limit: 200, sort: 'order', depth: 0, overrideAccess: true }),
    ])
    return Response.json({ content, media: media.docs.map((m: any) => ({ id:m.id, url:m.url||'', alt:m.alt||'', filename:m.filename||'' })).filter(m=>m.url), projects: projects.docs.map((p:any)=>({id:p.id,slug:p.slug,title:p.title,mode:p.mode,category:p.category||''})) }, { headers })
  } catch (error) {
    console.error('Studio read error:', error)
    return Response.json({ error: 'Lecture du Studio impossible. Vérifiez Vercel Blob.' }, { status: 503, headers })
  }
}
export async function POST(request: Request) {
  try {
    const origin = request.headers.get('origin')
    if (!origin || new URL(origin).host !== new URL(request.url).host) return Response.json({ error: 'Origine de la requête invalide' }, { status: 403, headers })
    const { user } = await authenticated(request)
    if (!user) return Response.json({ error: 'Connexion requise' }, { status: 401, headers })
    if (!request.headers.get('content-type')?.includes('application/json')) return Response.json({ error: 'Format JSON attendu' }, { status: 415, headers })
    const raw = await request.text()
    if (raw.length > 1_000_000) return Response.json({ error: 'Document trop volumineux' }, { status: 413, headers })
    const body = JSON.parse(raw)
    const saved = await saveStudioContent(body.content, body.revision)
    return Response.json({ savedAt: saved.savedAt, revision: saved.revision, content: saved }, { headers })
  } catch (error:any) {
    if (error?.code === 'CONFLICT') return Response.json({ error: error.message }, { status: 409, headers })
    console.error('Studio save error:', error)
    return Response.json({ error: 'Enregistrement impossible, vérifiez Vercel Blob.' }, { status: 503, headers })
  }
}
