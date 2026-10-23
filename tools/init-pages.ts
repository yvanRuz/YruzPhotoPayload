import { getPayload } from 'payload'
import config from '../src/payload.config'

// One-time, non-destructive setup: creates the navigation's page entries only
// when they do not already exist. Never deletes or resets a page or photos.
const pages = [
  { title: 'Accueil', pageKey: 'accueil' },
  { title: 'Portfolio', pageKey: 'portfolio' },
  { title: 'Services', pageKey: 'services' },
  { title: 'Mon histoire', pageKey: 'histoire' },
  { title: 'Contact', pageKey: 'contact' },
  { title: 'Equipement', pageKey: 'equipement' },
]

async function main() {
  if (!process.env.DATABASE_URL || !process.env.PAYLOAD_SECRET) throw new Error('DATABASE_URL and PAYLOAD_SECRET required')
  const payload = await getPayload({ config })
  for (const page of pages) {
    const existing = await payload.find({ collection: 'site-pages', where: { pageKey: { equals: page.pageKey } }, limit: 1, overrideAccess: true })
    if (existing.docs.length) {
      console.log('Already exists:', page.pageKey)
    } else {
      await payload.create({ collection: 'site-pages', data: { ...page, published: true, sections: [] }, overrideAccess: true })
      console.log('Created:', page.pageKey)
    }
  }
  console.log('YRUZPHOTO: page skeletons ready. Existing projects, site settings and media untouched.')
  process.exit(0)
}
main().catch(err => { console.error(err); process.exit(1) })
