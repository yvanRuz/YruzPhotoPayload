import { getPayload } from 'payload'
import config from '@payload-config'
import fallback from '../../seed/projects.json'
import fallbackSite from '../../seed/site.json'
const mediaUrl=(m:any):string=>typeof m==='object'&&m&&typeof m.url==='string'?m.url:''
const mediaValue=(m:any,fallbackValue='')=>mediaUrl(m)||fallbackValue

// Read a custom cover of the first video without changing the existing project schema.
const firstVideoCover=(raw:unknown):string=>{
 if(typeof raw!=='string'||!raw.trim().startsWith('{'))return ''
 try{const data=JSON.parse(raw);const url=data?.version===2?data?.videos?.[0]?.cover?.url:''
  return typeof url==='string'&&/^(https:\/\/|\/api\/media\/|\/assets\/)/i.test(url)?url:''
 }catch{return ''}
}
// Reuse a YouTube thumbnail if the video project has no custom cover.
const youtubeCover=(raw:unknown):string=>{
 const first=typeof raw==='string'?(raw.trim().startsWith('{')?(()=>{try{return JSON.parse(raw)?.videos?.[0]?.url||''}catch{return ''}})():raw.split(/\r?\n/).map(value=>value.trim()).find(Boolean)||''):''
 if(!/^https:\/\//i.test(first))return ''
 try{
  const u=new URL(first),h=u.hostname.toLowerCase().replace(/^www\./,'')
  let id=''
  if(h==='youtu.be')id=u.pathname.split('/')[1]||''
  else if(['youtube.com','m.youtube.com','music.youtube.com','youtube-nocookie.com'].includes(h)){
   const parts=u.pathname.split('/').filter(Boolean)
   if(parts[0]==='watch')id=u.searchParams.get('v')||''
   else if(['shorts','live','embed','v'].includes(parts[0]))id=parts[1]||''
  }
  return /^[a-zA-Z0-9_-]{11}$/.test(id)?`https://i.ytimg.com/vi/${id}/hqdefault.jpg`:''
 }catch{return ''}
}

export async function getCatalog(){
 try{
  const payload=await getPayload({config})
  const result=await payload.find({collection:'projects',limit:300,depth:1,sort:'order',overrideAccess:true})
  if(!result.docs.length)return fallback
  // A new CMS project must not make the existing Le Mans / legacy reports disappear.
  // CMS records override fallback entries by slug; unpublished CMS records stay hidden.
  const managed=new Set(result.docs.map((p:any)=>p.slug))
  const fromDb=result.docs.filter((p:any)=>p.published!==false).map((p:any)=>({
   id:p.slug,mode:p.mode,title:p.title,category:p.category||'',cover:mediaValue(p.cover,p.legacyCover||firstVideoCover(p.video)||youtubeCover(p.video)),
   gallery:(p.gallery||[]).map((g:any)=>mediaValue(g.photo,g.legacyUrl||'')).filter(Boolean),
   video:p.video||'',order:p.order??10
  }))
  const retained=fallback.filter((p:any)=>!managed.has(p.id))
  return [...fromDb,...retained].sort((a:any,b:any)=>(Number(a.order)||10)-(Number(b.order)||10))
 }catch(error){console.error('Payload catalogue indisponible',error);return fallback}
}
export async function getSite(){
 try{const payload=await getPayload({config});const doc:any=await payload.findGlobal({slug:'site',depth:1,overrideAccess:true});return {...fallbackSite,...doc,homeImages:[mediaUrl(doc.home_image_1),mediaUrl(doc.home_image_2)].filter(Boolean)}}
 catch(error){console.error('Payload site indisponible',error);return fallbackSite}
}
