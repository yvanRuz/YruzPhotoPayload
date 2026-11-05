import { getPayload } from 'payload'
import config from '@payload-config'
import starterProjects from '../../../../seed/projects.json'
export const dynamic = 'force-dynamic'
const headers={'Cache-Control':'no-store'}
const clean=(s:unknown,max=160):string=>typeof s==='string'?s.trim().slice(0,max):''
const graphic=(p:any)=>p.mode!=='video'&&/graphis|design|cr[eé]ation graphique|identit[eé] visuelle|branding/i.test(String(p.category||''))
const uploadId=(m:any):number|string|null=> {
  if (typeof m === 'number' || typeof m === 'string') return m
  if(m && typeof m==='object' && (typeof m.id==='number'||typeof m.id==='string'))return m.id
  return null
}
const photo=(m:any)=>m && typeof m==='object' ? ({id:m.id||null,url:clean(m.url,2000),alt:clean(m.alt,250)}) : null
const compact=(p:any)=>({
 source:'payload',
 id:p.id,slug:p.slug,title:p.title,mode:p.mode,category:p.category||'',universe:graphic(p)?'graphisme':p.mode==='video'?'video':'photo',
 cover:photo(p.cover),legacyCover:p.legacyCover||'', gallery:(p.gallery||[]).map((g:any)=>({photo:photo(g.photo),legacyUrl:g.legacyUrl||''})),
 video:p.video||'',order:p.order??10,published:p.published!==false
})
// The cards visible on the original Portfolio are in seed/projects.json, not
// necessarily in PostgreSQL. Expose them in Studio as editable virtual records.
// Saving one creates a regular Payload project with the SAME slug; getCatalog()
// already gives that Payload project priority over its starter counterpart.
const starterAsProject=(p:any)=>({
 id:`starter:${p.id}`,source:'starter',slug:p.id,title:p.title,mode:p.mode,
 category:p.category||'',universe:graphic(p)?'graphisme':p.mode==='video'?'video':'photo',
 cover:null,legacyCover:p.cover||'',gallery:(p.gallery||[]).map((url:string)=>({photo:null,legacyUrl:url})),
 video:p.video||'',order:p.order??10,published:p.published!==false,
})
const authorize=async(request:Request)=>{
 const payload=await getPayload({config});const auth=await payload.auth({headers:request.headers,canSetHeaders:false});
 return {payload,user:auth.user}
}
export async function GET(request:Request){
 try{const {payload,user}=await authorize(request);if(!user)return Response.json({error:'Connexion requise'},{status:401,headers})
  const result=await payload.find({collection:'projects',limit:300,sort:'order',depth:1,overrideAccess:true});
  const existing=new Set(result.docs.map((p:any)=>p.slug))
  const starter=starterProjects.filter((p:any)=>!existing.has(p.id)).map(starterAsProject)
  const projects=[...result.docs.map(compact),...starter].sort((a:any,b:any)=>Number(a.order??10)-Number(b.order??10))
  return Response.json({projects},{headers})
 }catch(err){console.error('Studio projects read:',err);return Response.json({error:'Lecture des projets impossible'},{status:503,headers})}
}
export async function POST(request:Request){
 try{
  const origin=request.headers.get('origin');if(!origin||new URL(origin).host!==new URL(request.url).host)return Response.json({error:'Origine non autorisée'},{status:403,headers})
  const {payload,user}=await authorize(request);if(!user)return Response.json({error:'Connexion requise'},{status:401,headers})
  const raw=await request.text();if(raw.length>120_000)return Response.json({error:'Projet trop volumineux'},{status:413,headers})
  const input=JSON.parse(raw);const id=input.id;const kind=String(input.universe||'photo');
  if(!['photo','video','graphisme'].includes(kind))return Response.json({error:'Rubrique invalide'},{status:400,headers})
  const title=clean(input.title,180),slug=clean(input.slug,120).toLowerCase();
  if(!title||!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))return Response.json({error:'Titre et identifiant valides requis (lettres minuscules et tirets)'},{status:400,headers})
  const isStarter=typeof id==='string'&&id.startsWith('starter:')
  if(isStarter){
   // Prevent creating a second card with a new slug while the old starter card remains.
   const original=id.slice('starter:'.length)
   if(!starterProjects.some((p:any)=>p.id===original)||slug!==original)return Response.json({error:'L’identifiant d’un projet initial doit rester identique'},{status:400,headers})
   const existing=await payload.find({collection:'projects',where:{slug:{equals:slug}},limit:1,depth:0,overrideAccess:true})
   if(existing.docs.length)return Response.json({error:'Ce projet existe déjà dans Payload. Actualise le Studio avant de le modifier.'},{status:409,headers})
  }
  const data:any={title,slug,mode:kind==='video'?'video':'photo',category:kind==='graphisme'?'GRAPHISME':clean(input.category,150),
    video:clean(input.video,2000),order:Math.max(0,Math.min(99999,Math.round(Number(input.order)||0))),published:input.published!==false,
    cover:uploadId(input.cover),legacyCover:clean(input.legacyCover,2000),
    gallery:(Array.isArray(input.gallery)?input.gallery:[]).slice(0,150).map((row:any)=>({photo:uploadId(row.photo),legacyUrl:clean(row.legacyUrl,2000)}))}
  const result=id&&!isStarter?await payload.update({collection:'projects',id,data,overrideAccess:true}):await payload.create({collection:'projects',data,overrideAccess:true});
  const saved=await payload.findByID({collection:'projects',id:result.id,depth:1,overrideAccess:true});
  return Response.json({project:compact(saved)},{headers})
 }catch(err:any){console.error('Studio projects save:',err);return Response.json({error:clean(err?.message,220)||'Enregistrement impossible'},{status:400,headers})}
}
