import { promises as fs } from 'node:fs'
import path from 'node:path'
import { NextResponse } from 'next/server'
export const dynamic='force-dynamic'
const allowed=new Set(['','index.html','portfolio.html','projet.html','tarifs.html','equipement.html','contact.html','pokedex.html'])
export async function GET(_request:Request,{params}:any){
 const result=await params
 const name=Array.isArray(result?.route)?result.route.join('/'):''
 if(!allowed.has(name))return new Response('Not found',{status:404})
 const file=path.join(process.cwd(),'public','site',name||'index.html')
 const html=await fs.readFile(file,'utf8')
 // Legacy scripts/images keep working from the new application root.
 return new NextResponse(html,{headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'}})
}
