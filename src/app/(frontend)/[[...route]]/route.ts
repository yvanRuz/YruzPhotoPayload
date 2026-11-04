import { promises as fs } from 'node:fs'
import path from 'node:path'
import { NextResponse } from 'next/server'
import { getStudioContent } from '@/lib/studio-store'
export const dynamic='force-dynamic'
const allowed=new Set(['','index.html','portfolio.html','projet.html','tarifs.html','equipement.html','contact.html','pokedex.html'])
export async function GET(_request:Request,{params}:any){
 const result=await params
 const name=Array.isArray(result?.route)?result.route.join('/'):''
 if(!allowed.has(name))return new Response('Not found',{status:404})
 const file=path.join(process.cwd(),'public','site',name||'index.html')
 let html=await fs.readFile(file,'utf8')
 // Load the published Studio homepage before the browser builds its original cards.
 // Without this bootstrap, /cms-content arrives after script.js has already painted
 // the legacy cards, causing the visible one-second replacement/flicker.
 if(name===''||name==='index.html'){
  try{
   const content=await getStudioContent()
   const home:any=content.pages?.accueil
   const publishedHome=home?.published!==false?home:null
   const bootstrap={page:publishedHome,navigation:content.navigation}
   const json=JSON.stringify(bootstrap).replace(/</g,'\\u003c').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029')
   const script=`<script>window.YRUZ_INITIAL_HOME=${json};</script>`
   html=html.replace('</head>',script+'</head>')
  }catch(error){
   // If Blob is unavailable, retain the existing legacy/fallback behavior.
   console.warn('YRUZPHOTO initial Studio content unavailable:',error)
  }
 }
 // Legacy scripts/images keep working from the new application root.
 return new NextResponse(html,{headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'}})
}
