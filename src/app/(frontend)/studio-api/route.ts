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
      const folder = (params.get('folder') || '').trim().slice(0, 55)
      const conditions: any[] = []
      if (search) conditions.push({or:[{alt:{contains:search}},{filename:{contains:search}}]})
      if (folder && folder !== 'all') {
        const content = await getStudioContent()
        const assignments = content.libraryFolders?.assignments || {}
        if (folder !== '__unassigned__') {
          const ids = Object.entries(assignments).filter(([,name])=>name===folder).map(([id])=>/^\d+$/.test(id)?Number(id):id)
          if (!ids.length) return Response.json({media:[],page:1,totalPages:1,totalDocs:0,hasNextPage:false,hasPrevPage:false},{headers})
          conditions.push({id:{in:ids}})
        } else {
          const ids = Object.keys(assignments).map(id=>/^\d+$/.test(id)?Number(id):id)
          if (ids.length) conditions.push({id:{not_in:ids}})
        }
      }
      const result = await payload.find({
        collection: 'media',
        page,
        limit: 36,
        sort: '-createdAt',
        depth: 0,
        overrideAccess: true,
        ...(conditions.length ? {where: conditions.length===1?conditions[0]:{and:conditions}} : {}),
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

// Rename only the editable media title (alt); the original filename and Blob URL
// remain unchanged, so existing galleries and Pokédex cards do not break.
export async function PATCH(request: Request) {
  try {
    const origin = request.headers.get('origin')
    if (!origin || new URL(origin).host !== new URL(request.url).host)
      return Response.json({ error: 'Origine de la requête invalide' }, { status: 403, headers })
    if (!request.headers.get('content-type')?.includes('application/json'))
      return Response.json({ error: 'Format JSON attendu' }, { status: 415, headers })
    const { payload, user } = await authenticated(request)
    if (!user) return Response.json({ error: 'Connexion requise' }, { status: 401, headers })
    const body = await request.json()
    if (body?.action !== 'rename-media') return Response.json({ error: 'Opération inconnue' }, { status: 400, headers })
    const id = String(body?.id ?? '')
    const name = typeof body?.name === 'string' ? body.name.trim() : ''
    if (!/^[a-zA-Z0-9_-]{1,80}$/.test(id) || !name || name.length > 160 || /[<>\x00-\x1f]/.test(name))
      return Response.json({ error: 'Identifiant ou nom invalide (160 caractères max.)' }, { status: 400, headers })
    const updated = await payload.update({ collection: 'media', id: /^\d+$/.test(id) ? Number(id) : id, data: { alt: name }, overrideAccess: true })
    return Response.json({ id: updated.id, alt: updated.alt, filename: updated.filename || '', url: updated.url || '' }, { headers })
  } catch (error) {
    console.error('Studio media rename error:', error)
    return Response.json({ error: 'Impossible de renommer cette photographie.' }, { status: 500, headers })
  }
}

// Remove a media file from Payload/Blob only if it is no longer referenced by
// the live Studio pages or project covers/galleries. Never cascade a delete.
export async function DELETE(request: Request) {
  try {
    const origin = request.headers.get('origin')
    if (!origin || new URL(origin).host !== new URL(request.url).host)
      return Response.json({error:'Origine invalide'}, {status:403,headers})
    const {payload,user} = await authenticated(request)
    if (!user) return Response.json({error:'Connexion requise'}, {status:401,headers})
    const id = new URL(request.url).searchParams.get('id') || ''
    if (!/^[a-zA-Z0-9_-]{1,80}$/.test(id)) return Response.json({error:'Identifiant invalide'}, {status:400,headers})
    const mediaId = /^\d+$/.test(id)?Number(id):id
    const original: any = await payload.findByID({collection:'media',id:mediaId,overrideAccess:true,depth:0})
    const content = await getStudioContent()
    // Public Studio images reference their Blob URL; multiple uses remain safe.
    if (original.url && JSON.stringify(content.pages).includes(JSON.stringify(original.url)))
      return Response.json({error:'Cette photo est utilisée sur le site ou dans le Pokédex. Retire-la de ces pages, publie, puis supprime-la.'},{status:409,headers})
    let referenced = false, moreProjects = true, page = 1
    while (moreProjects && page <= 25 && !referenced) {
      const result = await payload.find({collection:'projects',limit:100,page,depth:0,overrideAccess:true})
      referenced = result.docs.some((p:any)=>{
        const same = (value:any)=>String(value?.id ?? value ?? '')===id
        const sameUrl = (value:any)=>Boolean(original.url && value === original.url)
        return same(p.cover) || sameUrl(p.legacyCover) || (p.gallery || []).some((g:any)=>same(g.photo)||sameUrl(g.legacyUrl))
      })
      moreProjects = result.hasNextPage
      page++
    }
    if (referenced || moreProjects)
      return Response.json({error:'Cette photo est utilisée dans un projet (ou il y a trop de projets pour garantir une suppression sans risque). Retire-la des projets avant de la supprimer.'},{status:409,headers})
    await payload.delete({collection:'media',id:mediaId,overrideAccess:true})
    return Response.json({deleted:true,id},{headers})
  } catch(error) {
    console.error('Studio media delete error:',error)
    return Response.json({error:'Suppression impossible. Vérifie les références de cette photo dans Payload.'},{status:500,headers})
  }
}
