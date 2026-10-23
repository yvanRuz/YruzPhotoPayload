import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import sharp from 'sharp'
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Projects } from './collections/Projects'
import { Site } from './globals/Site'
import { SitePages } from './collections/SitePages'
import { Navigation } from './globals/Navigation'
export default buildConfig({
 secret:process.env.PAYLOAD_SECRET||'',
 admin:{user:'users',meta:{titleSuffix:'— YRUZPHOTO'}},
 editor:lexicalEditor(),sharp,
 db:postgresAdapter({pool:{connectionString:process.env.DATABASE_URL||''},push:process.env.NODE_ENV!=='production'}),
 collections:[Users,Media,Projects,SitePages],globals:[Site,Navigation],
 plugins:[vercelBlobStorage({enabled:Boolean(process.env.BLOB_READ_WRITE_TOKEN),collections:{media:true},token:process.env.BLOB_READ_WRITE_TOKEN||'',clientUploads:true})],
 typescript:{outputFile:'src/payload-types.ts'}
})
