import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'
import projects from '../seed/projects.json'
import site from '../seed/site.json'
const payload=await getPayload({config})
const existing=await payload.find({collection:'projects',limit:1})
if(existing.totalDocs>0){console.log('Projets existants : import annulé pour ne pas écraser vos modifications.');process.exit(0)}
for(const p of projects){
 await payload.create({collection:'projects',data:{slug:p.id,title:p.title,mode:p.mode,category:p.category||'',legacyCover:p.cover,gallery:(p.gallery||[]).map((legacyUrl:string)=>({legacyUrl})),video:p.video||'',order:p.order||10,published:p.published!==false}})
}
await payload.updateGlobal({slug:'site',data:site})
console.log('Import terminé : '+projects.length+' projets. Les photos historiques restent servies depuis /assets/.')
process.exit(0)
