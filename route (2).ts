import { getSite } from '@/lib/catalog'
export const dynamic='force-dynamic'
export async function GET(){const site=await getSite();return new Response('window.YRUZ_SITE_CONFIG='+JSON.stringify(site).replace(/</g,'\u003c')+';', {headers:{'Content-Type':'text/javascript; charset=utf-8','Cache-Control':'no-store'}})}
