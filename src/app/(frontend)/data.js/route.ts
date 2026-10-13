import { getCatalog } from '@/lib/catalog'
export const dynamic = 'force-dynamic'
export async function GET() {
  const data = await getCatalog()
  const script = `window.YRUZ_PROJECTS = ${JSON.stringify(data).replace(/</g, String.fromCharCode(92) + 'u003c')};\nwindow.yruzProjectUrl = p => 'projet.html?id=' + encodeURIComponent(p.id);`
  return new Response(script, {headers: {'Content-Type':'text/javascript; charset=utf-8','Cache-Control':'no-store'}})
}
