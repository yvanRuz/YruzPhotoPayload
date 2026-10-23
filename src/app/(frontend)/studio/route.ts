import { promises as fs } from 'node:fs'
import path from 'node:path'
import { getPayload } from 'payload'
import config from '@payload-config'

export const dynamic = 'force-dynamic'
export async function GET(request: Request) {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: request.headers, canSetHeaders: false })
  if (!user) return Response.redirect(new URL('/admin/login', request.url))
  const html = await fs.readFile(path.join(process.cwd(), 'public', 'studio.html'), 'utf8')
  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'private, no-store' } })
}
