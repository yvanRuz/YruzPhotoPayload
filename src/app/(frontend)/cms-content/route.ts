import { getStudioContent } from '@/lib/studio-store'
import { getCatalog } from '@/lib/catalog'

export const dynamic = 'force-dynamic'
const validPageKeys = new Set(['accueil','portfolio','services','histoire','contact','equipement'])
const headers = { 'Cache-Control': 'no-store, max-age=0' }
export async function GET(request: Request) {
  const key = new URL(request.url).searchParams.get('page') || ''
  if (!validPageKeys.has(key)) return Response.json({ error: 'Page inconnue' }, { status: 400, headers })
  try {
    const content = await getStudioContent()
    const page: any = content.pages?.[key] || null
    const publishedPage = page?.published !== false ? page : null
    const needsProjects = publishedPage?.sections?.some((block:any) => block.type === 'carrouselProjets') || ['photo','video','graphisme'].some(mode => publishedPage?.universeSections?.[mode]?.some((block:any) => block.type === 'carrouselProjets'))
    const projects = needsProjects ? await getCatalog() : []
    return Response.json({ page: publishedPage, navigation: content.navigation, projects }, { headers })
  } catch (error) {
    console.warn('Studio content unavailable; legacy page preserved:', error)
    return Response.json({ page: null, navigation: null, projects: [] }, { headers })
  }
}
