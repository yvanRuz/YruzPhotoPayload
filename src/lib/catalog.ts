import { getPayload } from 'payload'
import config from '@payload-config'
import fallback from '../../seed/projects.json'
import fallbackSite from '../../seed/site.json'
const mediaUrl=(m:any):string=>typeof m==='object'&&m&&typeof m.url==='string'?m.url:''
const mediaValue=(m:any,fallbackValue='')=>mediaUrl(m)||fallbackValue
export async function getCatalog(){
 try{
  const payload=await getPayload({config})
  const result=await payload.find({collection:'projects',where:{published:{equals:true}},limit:300,depth:1,sort:'order',overrideAccess:true})
  if(!result.docs.length)return fallback
  return result.docs.map((p:any)=>({id:p.slug,mode:p.mode,title:p.title,category:p.category||'',cover:mediaValue(p.cover,p.legacyCover||''),gallery:(p.gallery||[]).map((g:any)=>mediaValue(g.photo,g.legacyUrl||'')).filter(Boolean),video:p.video||''}))
 }catch(error){console.error('Payload catalogue indisponible',error);return fallback}
}
export async function getSite(){
 try{const payload=await getPayload({config});const doc:any=await payload.findGlobal({slug:'site',depth:1,overrideAccess:true});return {...fallbackSite,...doc,homeImages:[mediaUrl(doc.home_image_1),mediaUrl(doc.home_image_2)].filter(Boolean)}}
 catch(error){console.error('Payload site indisponible',error);return fallbackSite}
}
