// Executed BEFORE the Next build. Prevents the recurring flat-root upload error.
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
const root=process.cwd()
const exists = p => fs.existsSync(path.join(root,p))
const required = [
  'package.json','tsconfig.json','next.config.mjs',
  'src/payload.config.ts','src/collections/Users.ts','src/collections/Media.ts','src/collections/Projects.ts','src/globals/Site.ts',
  'src/lib/catalog.ts','src/lib/studio-store.ts',
  'src/app/(frontend)/studio/route.ts','src/app/(frontend)/studio-api/route.ts','src/app/(frontend)/cms-content/route.ts',
  'src/app/(payload)/layout.tsx','src/app/(payload)/admin/[[...segments]]/page.tsx',
  'public/studio.html','public/studio.js','public/studio.css','public/site-builder.js','public/site-builder.css',
  'seed/projects.json','seed/site.json','public/site/index.html','public/site/portfolio.html',
]
const wrongRoot = ['payload.config.ts','catalog.ts','init-pages.ts','SitePages.ts','Navigation.ts','Projects.ts','Site.ts','Media.ts','Users.ts','page.tsx','layout.tsx','route.ts','studio-store.ts','studio.js','studio.css','site-builder.js','site-builder.css','site-pages.js','site-copy.js']
const errors=[]
for(const f of required)if(!exists(f))errors.push(`Fichier manquant : ${f}`)
for(const f of wrongRoot)if(exists(f))errors.push(`Fichier mal placé à la racine : ${f} — ne pas aplatir les dossiers du ZIP !`)
for(const name of fs.readdirSync(root))if(/^(?:.*-)?route \(\d+\)\.ts$/i.test(name))errors.push(`Fichier route doublon à la racine : ${name}`)
function walk(dir){
 if(!fs.existsSync(dir))return
 for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
  const file=path.join(dir,entry.name)
  if(entry.isDirectory())walk(file)
  else if(/\.(?:ts|tsx|js|mjs)$/.test(file)){
   const src=fs.readFileSync(file,'utf8')
   if(file.endsWith('.js')||file.endsWith('.mjs'))try{execFileSync(process.execPath,['--check',file],{stdio:'pipe'})}catch(e){errors.push(`JavaScript invalide : ${path.relative(root,file)}`)}
   for(const match of src.matchAll(/(?:from\s*|import\s*\()['"](\.\.?\/[^'"]+)['"]/g)){
    const reference=path.resolve(path.dirname(file),match[1]);
    if(!['','.ts','.tsx','.js','.mjs','.json','/index.ts','/index.tsx','/index.js'].some(ext=>fs.existsSync(reference+ext)))errors.push(`Import relatif introuvable : ${path.relative(root,file)} → ${match[1]}`)
   }
  }
 }
}
walk(path.join(root,'src'));walk(path.join(root,'public'));walk(path.join(root,'tools'))
for(let i=1;i<=16;i++)if(!exists(`public/assets/projects/mans-nuit/lemans-2026-${String(i).padStart(2,'0')}.webp`))errors.push(`Photo du Mans absente : ${i}`)
for(const f of ['package.json','seed/projects.json','seed/site.json'])try{JSON.parse(fs.readFileSync(path.join(root,f),'utf8'))}catch(e){errors.push(`JSON invalide : ${f}`)}
for(const f of ['public/site/index.html','public/site/portfolio.html','public/site/tarifs.html','public/site/contact.html','public/site/equipement.html']){
 const html=fs.readFileSync(path.join(root,f),'utf8')
 if(!html.includes('site-builder.js'))errors.push(`Connexion au Studio absente de : ${f}`)
}
if(errors.length){console.error('\nYRUZPHOTO : structure invalide\n'+errors.map(e=>' - '+e).join('\n'));process.exit(1)}
console.log('YRUZPHOTO V40 : arborescence, imports, JS, JSON et 16 photos — contrôles réussis.')
