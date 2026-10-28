/* YRUZPHOTO STUDIO — No external dependencies. Auth and writes stay server-side. */
(() => {
'use strict';
const pageNames = {accueil:'Accueil',portfolio:'Portfolio',services:'Services',histoire:'Mon histoire',equipement:'Équipement',contact:'Contact'};
const pageIcons = {accueil:'⌂',portfolio:'▧',services:'◇',histoire:'◌',equipement:'▤',contact:'✉'};
const sectionNames = {texte:'Titre, texte et bouton',photoTexte:'Photo + texte',carrouselPhotos:'Carrousel de photographies',grillePhotos:'Grille de photos',carrouselProjets:'Carrousel de reportages',boutons:'Boutons et liens'};
const $ = s => document.querySelector(s);
const e = v => String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const validSrc = s => { const x=String(s||'').trim(); return /^(https?:\/\/[^\s<>"'`]+|\/api\/media\/[^\s<>"'`]+|\/?assets\/[^\s<>"'`]+)$/i.test(x)?x:'' };
const clone = x => JSON.parse(JSON.stringify(x));
let state=null, media=[], projects=[], selection='accueil', dirty=false, loading=false, picker=null, uploadTarget=null, uploading=false;
// Client-side view state only. Media files remain in Payload/Blob, not this page JSON.
const library={page:1,totalPages:1,totalDocs:0,items:[],search:'',selected:new Map(),loading:false,requestId:0};
let libraryDestination='portfolio', pickerPage=1, pickerPages=1, librarySearchTimer, pickerSearchTimer;
let toastTimer;
function message(txt,error=false){const el=$('#toast');el.textContent=txt;el.classList.toggle('error',error);el.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('visible'),4500)}
function setStatus(txt,warning=false){const el=$('#saveStatus');el.textContent=txt;el.classList.toggle('unsaved',warning)}
function markDirty(){dirty=true;setStatus('Modifications non publiées',true);$('#saveBtn').disabled=false;renderPreview()}
window.addEventListener('beforeunload', event => {if(dirty){event.preventDefault();event.returnValue=''}});
const currentRoot=()=>selection==='links'?state?.content?.navigation:state?.content?.pages?.[selection];
function field(label,path,value,kind='text',options=[]){
  const id=`field-${path.replace(/[^a-z0-9]/gi,'-')}`;
  if(kind==='checkbox')return `<label class="field-check"><input type="checkbox" data-field="${e(path)}" ${value?'checked':''}>${e(label)}</label>`;
  if(kind==='select')return `<div class="field"><label for="${id}">${e(label)}</label><select id="${id}" data-field="${e(path)}">${options.map(([v,l])=>`<option value="${e(v)}" ${String(value)===String(v)?'selected':''}>${e(l)}</option>`).join('')}</select></div>`;
  if(kind==='textarea')return `<div class="field"><label for="${id}">${e(label)}</label><textarea id="${id}" data-field="${e(path)}">${e(value)}</textarea></div>`;
  return `<div class="field"><label for="${id}">${e(label)}</label><input id="${id}" type="text" data-field="${e(path)}" value="${e(value)}" autocomplete="off"></div>`;
}
function mediaField(indexPath,image,label='Photo choisie'){
  const src=validSrc(image?.url);
  return `<div class="media-choice">${src?`<img src="${e(src)}" alt="${e(image?.alt||label)}">`:'<div style="width:104px;height:82px;display:grid;place-items:center;background:#1a3447">▧</div>'}<div><strong>${src?e(image.alt||label):'Aucune photographie sélectionnée'}</strong><button type="button" class="outline-btn" data-action="choose-image" data-path="${e(indexPath)}">${src?'Changer':'Choisir dans la médiathèque'} ↗</button><button type="button" class="outline-btn" data-action="upload-field" data-path="${e(indexPath)}">↑ Importer ici</button></div></div>`;
}
function action(action,label,attrs='',danger=false){return `<button type="button" class="mini-btn ${danger?'delete':''}" data-action="${e(action)}" ${attrs}>${e(label)}</button>`}
const blockDefault = type => ({
  texte:{type,title:'Nouveau titre',eyebrow:'',body:'',align:'left',buttonLabel:'',buttonUrl:''},
  photoTexte:{type,title:'',image:null,description:'',caption:'',placement:'left',buttonLabel:'',buttonUrl:''},
  carrouselPhotos:{type,title:'Mon carrousel',description:'',slides:[]},
  grillePhotos:{type,title:'Ma galerie',columns:'3',photos:[]},
  carrouselProjets:{type,title:'Découvrez mes reportages',mode:'photo',selection:'auto',chosenSlugs:[],limit:8},
  boutons:{type,title:'',buttons:[]},
}[type] || {type:'texte',title:'Nouveau bloc'});
function renderSection(block,index){
 const base=`sections.${index}`, head=`<div class="block-top"><div><span class="block-num">SECTION ${String(index+1).padStart(2,'0')} / ${e(block.type)}</span><h3>${e(sectionNames[block.type]||block.type)}</h3></div><div class="mini-actions">${action('move-section','↑',`data-index="${index}" data-dir="-1"`)}${action('move-section','↓',`data-index="${index}" data-dir="1"`)}${action('remove-section','Supprimer',`data-index="${index}"`,true)}</div></div>`;
 let f='';
 if(block.type==='texte')f=field('Surtitre',`${base}.eyebrow`,block.eyebrow)+field('Titre',`${base}.title`,block.title)+field('Paragraphe',`${base}.body`,block.body,'textarea')+field('Alignement',`${base}.align`,block.align,'select',[['left','À gauche'],['center','Centré']])+`<div class="field-row">${field('Texte du bouton',`${base}.buttonLabel`,block.buttonLabel)}${field('Destination du bouton',`${base}.buttonUrl`,block.buttonUrl)}</div>`;
 if(block.type==='photoTexte')f=mediaField(`${base}.image`,block.image)+field('Titre',`${base}.title`,block.title)+field('Description',`${base}.description`,block.description,'textarea')+field('Légende',`${base}.caption`,block.caption)+field('Placement',`${base}.placement`,block.placement,'select',[['left','Photo à gauche'],['right','Photo à droite']])+`<div class="field-row">${field('Texte du bouton',`${base}.buttonLabel`,block.buttonLabel)}${field('Lien du bouton',`${base}.buttonUrl`,block.buttonUrl)}</div>`;
 if(block.type==='carrouselPhotos'||block.type==='grillePhotos'){
   const arrKey=block.type==='carrouselPhotos'?'slides':'photos';const rows=Array.isArray(block[arrKey])?block[arrKey]:[];
   f=field('Titre',`${base}.title`,block.title)+(block.type==='carrouselPhotos'?field('Description',`${base}.description`,block.description,'textarea'):field('Colonnes',`${base}.columns`,block.columns,'select',[['2','2 colonnes'],['3','3 colonnes'],['4','4 colonnes']]))+
   `<p class="small-counter">${rows.length} photographie${rows.length>1?'s':''} — ordre modifiable</p><div class="collection-items">`+
   rows.map((row,j)=>`<div class="collection-item">${row.image?.url?`<img src="${e(validSrc(row.image.url))}" alt="">`:''}<div class="item-fields">${field('Légende',`${base}.${arrKey}.${j}.caption`,row.caption)}${block.type==='carrouselPhotos'?field('Lien au clic (optionnel)',`${base}.${arrKey}.${j}.link`,row.link):''}</div><div class="item-actions">${action('swap-image','Changer',`data-path="${base}.${arrKey}.${j}.image"`)}${action('move-item','↑',`data-index="${index}" data-key="${arrKey}" data-item="${j}" data-dir="-1"`)}${action('move-item','↓',`data-index="${index}" data-key="${arrKey}" data-item="${j}" data-dir="1"`)}${action('remove-item','✕',`data-index="${index}" data-key="${arrKey}" data-item="${j}"`,true)}</div></div>`).join('')+
   `</div><div class="add-row">${action('add-image','+ Choisir une photographie',`data-index="${index}" data-key="${arrKey}"`)}${action('upload-gallery','↑ Importer plusieurs photos',`data-index="${index}" data-key="${arrKey}"`)}</div>`;
 }
 if(block.type==='carrouselProjets'){
   f=field('Titre',`${base}.title`,block.title)+field('Afficher',`${base}.mode`,block.mode,'select',[['photo','Photographies'],['video','Vidéos'],['graphisme','Graphisme'],['all','Tous les univers']])+field('Sélection',`${base}.selection`,block.selection,'select',[['auto','Automatique : tous les projets publiés'],['manual','Sélection manuelle']])+field('Nombre maximum de projets',`${base}.limit`,block.limit);
   if(block.selection==='manual')f+=`<div class="info-strip">Choisissez les reportages à afficher :${projects.map(p=>`<label class="field-check" style="margin:12px 0"><input type="checkbox" data-action="toggle-project" data-index="${index}" data-slug="${e(p.slug)}" ${(block.chosenSlugs||[]).includes(p.slug)?'checked':''}>${e(p.title)} (${/graphis|design|cr[eé]ation graphique|identit[eé] visuelle|branding/i.test(String(p.category||'')) ? 'GRAPHISME' : e(p.mode)})</label>`).join('')}</div>`;
 }
 if(block.type==='boutons'){
   f=field('Titre de la section',`${base}.title`,block.title)+(block.buttons||[]).map((b,j)=>`<div class="collection-item"><div class="item-fields">${field('Texte du bouton',`${base}.buttons.${j}.label`,b.label)}${field('Lien du bouton',`${base}.buttons.${j}.url`,b.url)}${field('Style',`${base}.buttons.${j}.style`,b.style,'select',[['primary','Principal'],['secondary','Secondaire']])}</div>${action('remove-item','✕',`data-index="${index}" data-key="buttons" data-item="${j}"`,true)}</div>`).join('')+`<div class="add-row">${action('add-button','+ Ajouter un bouton',`data-index="${index}"`)}</div>`;
 }
 return `<article class="block-card" data-block-index="${index}">${head}${f}</article>`;
}
function renderSidebar(){
 $('#pageNav').innerHTML=Object.entries(pageNames).map(([key,name])=>`<button type="button" class="side-item ${selection===key?'active':''}" data-nav="${key}"><span class="side-icon">${pageIcons[key]}</span><span>${name}</span><span class="side-arrow">›</span></button>`).join('');
 document.querySelectorAll('[data-nav="links"], [data-nav="media"]').forEach(el=>el.classList.toggle('active',selection===el.dataset.nav));
}
function renderPage(){
 const p=currentRoot();const blocks=Array.isArray(p.sections)?p.sections:[];
 const ctas=selection==='accueil'?`<div class="field-row">${field('Bouton principal (texte)','mainButtonLabel',p.mainButtonLabel)}${field('Lien du bouton principal','mainButtonUrl',p.mainButtonUrl)}</div><div class="field-row">${field('Second bouton (texte)','secondButtonLabel',p.secondButtonLabel)}${field('Lien du second bouton','secondButtonUrl',p.secondButtonUrl)}</div>`:(['portfolio','services','equipement'].includes(selection)?`<div class="field-row">${field('Bouton bas de page (texte)','bottomButtonLabel',p.bottomButtonLabel)}${field('Lien du bouton','bottomButtonUrl',p.bottomButtonUrl)}</div>`:'');
 const imageSettings = selection==='accueil' ? `<section class="form-panel"><div class="panel-eyebrow">FONDS D’ACCUEIL</div><h2>Photographies de couverture</h2><p>Ces deux photos alimentent le fond défilant de l’accueil.</p>${[0,1].map(i=>mediaField(`heroImages.${i}`,p.heroImages?.[i],`Fond d’accueil ${i+1}`)).join('')}</section>` : selection==='services' ? `<section class="form-panel"><div class="panel-eyebrow">VISUELS / SERVICES</div><h2>Photos et boutons des prestations</h2><p>Chaque modification se reflète sur les cartes de la page Services.</p>${['PHOTO','VIDÉO','DESIGN'].map((title,i)=>`<h3>${title}</h3>${mediaField(`serviceCards.${i}.image`,p.serviceCards?.[i]?.image,`Visuel ${title}`)}${field('Légende',`serviceCards.${i}.caption`,p.serviceCards?.[i]?.caption)}<div class="field-row">${field('Texte du bouton',`serviceCards.${i}.buttonLabel`,p.serviceCards?.[i]?.buttonLabel)}${field('Lien du bouton',`serviceCards.${i}.buttonUrl`,p.serviceCards?.[i]?.buttonUrl)}</div>`).join('')}</section>` : selection==='histoire' ? `<section class="form-panel"><div class="panel-eyebrow">MON HISTOIRE</div><h2>Les trois chapitres</h2><p>Changez les photos et les textes sans modifier l’animation horizontale.</p>${[0,1,2].map(i=>`<h3>Chapitre ${i+1}</h3>${mediaField(`storyCards.${i}.image`,p.storyCards?.[i]?.image,`Chapitre ${i+1}`)}${field('Titre',`storyCards.${i}.title`,p.storyCards?.[i]?.title)}${field('Texte',`storyCards.${i}.body`,p.storyCards?.[i]?.body,'textarea')}`).join('')}</section>` : '';
 return `<section class="form-panel"><div class="panel-eyebrow">01 / CONTENUS PRINCIPAUX</div><h2>Textes et liens de la page</h2><p>Ces réglages remplacent les textes et destinations existants lorsqu’ils sont renseignés.</p>${field('Titre principal','heading',p.heading)}${field('Texte d’introduction','intro',p.intro,'textarea')}${ctas}<div style="margin-top:24px">${field('Afficher les personnalisations CMS','published',p.published,'checkbox')}</div></section>${imageSettings}<div class="section-heading"><div><h2>Sections de la page</h2><p>Ajoutez un carrousel, des photos, des boutons et réorganisez-les librement.</p></div></div>${!blocks.length?'<div class="empty-state">Cette page ne contient encore aucune section personnalisée. Ajoutez-en une ci-dessous.</div>':blocks.map(renderSection).join('')}<div class="add-row"><select id="newBlockType">${Object.entries(sectionNames).map(([k,n])=>`<option value="${k}">${e(n)}</option>`).join('')}</select><button type="button" data-action="add-section">+ Ajouter une section</button></div>`;
}
function renderNavigation(){
 const n=currentRoot();return `<section class="form-panel"><div class="panel-eyebrow">MENU PRINCIPAL</div><h2>Liens de navigation</h2><p>Modifiez l’ordre, les titres et les destinations. Les changements s’appliquent sur toutes les pages.</p>${(n.links||[]).map((x,i)=>`<div class="nav-line"><div>${field('Titre',`links.${i}.label`,x.label)}</div><div>${field('Lien',`links.${i}.url`,x.url)}</div><div class="nav-options">${field('Visible',`links.${i}.enabled`,x.enabled,'checkbox')}${field('Nouvel onglet',`links.${i}.newTab`,x.newTab,'checkbox')}</div><div class="item-actions">${action('move-nav','↑',`data-index="${i}" data-dir="-1"`)}${action('move-nav','↓',`data-index="${i}" data-dir="1"`)}${action('remove-nav','✕',`data-index="${i}"`,true)}</div></div>`).join('')}<div class="add-row">${action('add-nav','+ Ajouter un lien')}</div></section><section class="form-panel"><div class="panel-eyebrow">BOUTONS ET RÉSEAUX</div><h2>Autres liens</h2><div class="field-row">${field('Texte du bouton contact','ctaLabel',n.ctaLabel)}${field('Destination','ctaUrl',n.ctaUrl)}</div>${field('Adresse Instagram','instagramUrl',n.instagramUrl)}<div class="field-row">${field('Footer : libellé contact','footerContactLabel',n.footerContactLabel)}${field('Footer : destination','footerContactUrl',n.footerContactUrl)}</div></section>`;
}
// Single media hub: search the entire Payload collection, upload without leaving
// Studio, and reuse selected photos in a new gallery or carousel on any page.
function renderLibrary(){
 return `<section class="form-panel library-intro">
   <div class="panel-eyebrow">MÉDIATHÈQUE / PHOTOGRAPHIES</div>
   <h2>Toutes tes photographies au même endroit</h2>
   <p>Importe tes fichiers dans Payload + Vercel Blob, puis sélectionne les images pour alimenter la page de ton choix.</p>
   <div id="libraryDropzone" class="library-dropzone" tabindex="0" role="button" aria-label="Importer des photographies">
     <div class="library-drop-icon">↑</div>
     <strong>Dépose tes images ici</strong>
     <span>ou clique pour sélectionner plusieurs photographies</span>
     <small>JPG, PNG, WebP, GIF, AVIF — 3,5 Mo par fichier pour cet import direct</small>
   </div>
   <p id="libraryUploadProgress" class="library-progress" role="status" hidden></p>
 </section>
 <section class="form-panel library-panel">
  <div class="library-heading"><div><div class="panel-eyebrow">BIBLIOTHÈQUE</div><h2>Photographies disponibles <span id="libraryCount" class="library-total"></span></h2></div><button class="outline-btn" data-library-action="reload">Actualiser ↻</button></div>
  <div class="library-tools"><input id="librarySearch" type="search" placeholder="Rechercher une photo par son nom…" value="${e(library.search)}" aria-label="Rechercher une photographie"><button class="outline-btn" data-library-action="clear">Effacer la sélection</button></div>
  <div id="libraryGrid" class="library-grid" aria-live="polite"><p class="library-hint">Chargement des photographies…</p></div>
  <div id="libraryPager" class="library-pager"></div>
 </section>
 <section class="form-panel library-publish">
  <div class="panel-eyebrow">UTILISER SUR LE SITE</div><h2>Créer un carrousel ou une galerie</h2>
  <p>Sélectionne des photos ci-dessus puis indique la page à alimenter. Les photos sont déjà importées ; il ne reste qu'à publier la nouvelle section.</p>
  <div class="library-publish-row"><label for="libraryDestination">Ajouter à la page</label><select id="libraryDestination">${Object.entries(pageNames).map(([key,name])=>`<option value="${key}" ${libraryDestination===key?'selected':''}>${e(name)}</option>`).join('')}</select></div>
  <div class="library-publish-actions"><span id="librarySelectionCount" class="library-selection-count">0 photo sélectionnée</span><button type="button" class="primary-btn" data-library-action="carousel" disabled>+ Créer un carrousel</button><button type="button" class="outline-btn" data-library-action="gallery" disabled>+ Créer une grille photo</button></div>
 </section>`;
}
function syncLibraryView(){
 const grid=$('#libraryGrid');if(!grid)return;
 const selected=library.selected;
 grid.innerHTML=library.items.length?library.items.map(m=>{
  const key=String(m.id),src=validSrc(m.url),checked=selected.has(key);
  return `<article class="library-photo ${checked?'selected':''}"><button type="button" class="library-select" data-library-action="toggle" data-id="${e(key)}" aria-pressed="${checked?'true':'false'}" aria-label="${checked?'Désélectionner':'Sélectionner'} ${e(m.alt||m.filename)}"><img loading="lazy" src="${e(src)}" alt="${e(m.alt||m.filename)}"><span class="library-tick">${checked?'✓':'+'}</span></button><div class="library-photo-info"><strong title="${e(m.alt||m.filename)}">${e(m.alt||m.filename||'Sans titre')}</strong><div class="library-photo-actions"><a href="${e(src)}" target="_blank" rel="noopener">Voir ↗</a><button type="button" data-library-action="copy" data-id="${e(key)}">Copier le lien</button></div></div></article>`
 }).join(''):'<div class="empty-state">Aucune photographie trouvée. Importe tes premières photos ci-dessus.</div>';
 const c=$('#libraryCount');if(c)c.textContent=`(${library.totalDocs})`;
 const pager=$('#libraryPager');if(pager)pager.innerHTML=`<span>Page ${library.page} sur ${library.totalPages}</span><div><button type="button" data-library-action="prev" ${library.page<=1?'disabled':''}>← Précédente</button><button type="button" data-library-action="next" ${library.page>=library.totalPages?'disabled':''}>Suivante →</button></div>`;
 const count=$('#librarySelectionCount');if(count)count.textContent=`${selected.size} photographie${selected.size>1?'s':''} sélectionnée${selected.size>1?'s':''}`;
 document.querySelectorAll('[data-library-action="carousel"],[data-library-action="gallery"],[data-library-action="clear"]').forEach(btn=>{btn.disabled=!selected.size});
}
async function loadLibrary(page=1){
 const requestId=++library.requestId;library.loading=true;
 const grid=$('#libraryGrid');if(grid)grid.innerHTML='<p class="library-hint">Chargement de la médiathèque…</p>';
 try{
  const query=new URLSearchParams({view:'media',page:String(page),search:library.search});
  const response=await fetch(`/studio-api?${query}`,{cache:'no-store',credentials:'same-origin'});
  const result=await response.json().catch(()=>({}));
  if(!response.ok)throw Error(result.error||`Erreur HTTP ${response.status}`);
  if(requestId!==library.requestId)return;
  library.items=Array.isArray(result.media)?result.media:[];
  library.page=Number(result.page)||page;
  library.totalPages=Math.max(1,Number(result.totalPages)||1);
  library.totalDocs=Number(result.totalDocs)||0;
  syncLibraryView();
 }catch(err){
  if(requestId!==library.requestId)return;
  if(grid)grid.innerHTML=`<div class="danger-message">Impossible de charger les photographies : ${e(err.message)}. Vérifie ta session Payload.</div>`;
 }finally{if(requestId===library.requestId)library.loading=false}
}
function createFromLibrary(type){
 if(!state||!library.selected.size)return;
 const page=libraryDestination;
 const root=state.content?.pages?.[page];if(!root){message('Page introuvable',true);return}
 if(!Array.isArray(root.sections))root.sections=[];
 const photos=[...library.selected.values()].map(m=>({image:{url:m.url,alt:m.alt||m.filename||''},caption:'',link:''}));
 const section=clone(blockDefault(type));
 if(type==='carrouselPhotos')section.slides=photos;
 else section.photos=photos;
 root.sections.push(section);
 library.selected.clear();
 selection=page;markDirty();render();
 message(`${photos.length} photo(s) ajoutée(s) à la page ${pageNames[page]}. Clique sur « Publier les modifications ».`);
}
async function handleLibraryAction(btn){
 const operation=btn.dataset.libraryAction,id=String(btn.dataset.id||'');
 if(operation==='toggle'){
  const photo=library.items.find(m=>String(m.id)===id);if(!photo)return;
  if(library.selected.has(id))library.selected.delete(id);else library.selected.set(id,photo);
  syncLibraryView();return;
 }
 if(operation==='copy'){
  const photo=library.items.find(m=>String(m.id)===id);if(!photo)return;
  try{await navigator.clipboard.writeText(new URL(photo.url,location.origin).href);message('Lien de la photographie copié')}catch{window.prompt('Copie le lien :',new URL(photo.url,location.origin).href)}return;
 }
 if(operation==='reload'){loadLibrary(library.page);return}
 if(operation==='clear'){library.selected.clear();syncLibraryView();return}
 if(operation==='prev'||operation==='next'){const next=library.page+(operation==='next'?1:-1);if(next>=1&&next<=library.totalPages)loadLibrary(next);return}
 if(operation==='carousel'||operation==='gallery')createFromLibrary(operation==='carousel'?'carrouselPhotos':'grillePhotos');
}
function renderPreview(){
 if(!state||selection==='media')return;
 let html='';
 if(selection==='links'){
  const nav=currentRoot();html=`<div class="preview-card"><span class="tag">MENU</span><h3>Liens publiés</h3>${(nav.links||[]).filter(x=>x.enabled).map(x=>`<div class="preview-block"><b>${e(x.label)}</b><small>${e(x.url)}</small></div>`).join('')}<div class="preview-block"><b>CTA : ${e(nav.ctaLabel)}</b><small>${e(nav.ctaUrl)}</small></div></div>`;
 } else {
  const p=currentRoot();const blocks=p.sections||[];
  html=`<div class="preview-card"><span class="tag">${p.published?'ACTIF':'PERSONNALISATION MASQUÉE'}</span><h3>${e(p.heading||pageNames[selection])}</h3><p>${e(p.intro||'Présentation existante conservée.')}</p>${blocks.map(b=>`<div class="preview-block"><b>${e(b.title||sectionNames[b.type]||'Section')}</b><small>${e(sectionNames[b.type])}</small>${b.image?.url?`<img src="${e(validSrc(b.image.url))}" alt="">`:''}${b.slides?.length?`<div class="preview-thumb-row">${b.slides.slice(0,4).map(s=>s.image?.url?`<img src="${e(validSrc(s.image.url))}" alt="">`:'').join('')}</div><small>${b.slides.length} photos</small>`:''}${b.photos?.length?`<small>${b.photos.length} photos</small>`:''}${b.buttons?.length?`<small>${b.buttons.length} boutons</small>`:''}</div>`).join('')}</div>`;
 }
 $('#previewBody').innerHTML=html;
}
function render(){
 if(!state)return;renderSidebar();
 const isLinks=selection==='links',isMedia=selection==='media';
 $('#editorTitle').textContent=isMedia?'Médiathèque':isLinks?'Menu et liens du site':pageNames[selection];
 $('#crumb').textContent=isMedia?'PHOTOGRAPHIES / BIBLIOTHÈQUE':isLinks?'NAVIGATION / LIENS':'PAGES DU SITE / '+pageNames[selection].toUpperCase();
 $('#editorSubtitle').textContent=isMedia?'Importer, organiser et réutiliser tes photos sans quitter le Studio.':isLinks?'Tous les boutons et liens principaux depuis un seul endroit.':'Textes, sections et photographies : tout est modifiable ici.';
 $('#viewLive').href={accueil:'/index.html',portfolio:'/portfolio.html',services:'/tarifs.html',histoire:'/index.html#mon-histoire',equipement:'/equipement.html',contact:'/contact.html',links:'/index.html'}[selection]||'/portfolio.html';
 $('#saveBtn').hidden=isMedia&&!dirty;
 $('.main-layout').classList.toggle('library-layout',isMedia);
 $('.preview-pane').hidden=isMedia;
 $('#editor').innerHTML=isMedia?renderLibrary():isLinks?renderNavigation():renderPage();
 if(isMedia){loadLibrary(library.page);if(!dirty)setStatus('Photographies enregistrées automatiquement');return}
 renderPreview();
}
function setNested(root,path,value){
 const bits=String(path).split('.');let node=root;
 for(let i=0;i<bits.length-1;i++) {const key=/^\d+$/.test(bits[i])?Number(bits[i]):bits[i];if(node[key]===undefined||node[key]===null)node[key]={};node=node[key]}
 const last=bits[bits.length-1];node[/^\d+$/.test(last)?Number(last):last]=value;
}
function getNested(root,path){return String(path).split('.').reduce((o,key)=>o?.[key],root)}
function move(arr,from,to){if(!Array.isArray(arr)||to<0||to>=arr.length)return false;const [item]=arr.splice(from,1);arr.splice(to,0,item);return true}
function openPicker(callback){picker=callback;pickerPage=1;$('#mediaModal').showModal();$('#mediaSearch').value='';showMedia(1)}
async function showMedia(page=1){
 const grid=$('#mediaGrid');grid.innerHTML='<p>Chargement des photographies…</p>';
 try{
  const query=new URLSearchParams({view:'media',page:String(page),search:$('#mediaSearch').value.trim()});
  const response=await fetch(`/studio-api?${query}`,{cache:'no-store',credentials:'same-origin'});
  if(!response.ok)throw Error(`HTTP ${response.status}`);
  const result=await response.json();window._currentMedia=result.media||[];pickerPage=Number(result.page)||page;pickerPages=Math.max(1,Number(result.totalPages)||1);
  grid.innerHTML=window._currentMedia.length?window._currentMedia.map((m,i)=>`<button type="button" data-photo="${i}"><img loading="lazy" src="${e(validSrc(m.url))}" alt="${e(m.alt||m.filename)}"><small>${e(m.alt||m.filename)}</small></button>`).join(''):'<p>Aucune photographie trouvée.</p>';
  $('#mediaPager').innerHTML=`<span>Page ${pickerPage} / ${pickerPages}</span><div><button type="button" data-picker-page="${pickerPage-1}" ${pickerPage<=1?'disabled':''}>←</button><button type="button" data-picker-page="${pickerPage+1}" ${pickerPage>=pickerPages?'disabled':''}>→</button></div>`;
 }catch(err){grid.innerHTML=`<p class="danger-message">Impossible de charger la médiathèque : ${e(err.message)}</p>`}
}
function closePicker(){$('#mediaModal').close();picker=null}
function applyUploaded(photos,target){
 if(!photos.length||!state)return;
 const root=currentRoot();
 if(target?.kind==='gallery'){
   const section=root?.sections?.[target.index];
   if(!section||!Array.isArray(section[target.key])){message('La galerie a changé : choisissez à nouveau la section',true);return}
   photos.forEach(photo=>section[target.key].push({image:{url:photo.url,alt:photo.alt},caption:'',link:''}));
 }else if(target?.kind==='field'){
   setNested(root,target.path,{url:photos[0].url,alt:photos[0].alt});
 }else if(picker){
   const callback=picker;closePicker();callback(photos[0]);return;
 }
 markDirty();render();
}
async function importPhotos(files){
 if(uploading||!files.length)return;
 const target=uploadTarget;uploadTarget=null;
 const validTypes=new Set(['image/jpeg','image/png','image/webp','image/avif','image/gif']);
 const photos=[];let failures=[];
 uploading=true;$('#uploadProgress').hidden=false;$('#directUploadInput').disabled=true;
 for(let i=0;i<files.length;i++){
  const file=files[i];const progress=`Importation ${i+1}/${files.length} : ${file.name}`;
  $('#uploadProgress').textContent=progress;
  const libraryProgress=$('#libraryUploadProgress');if(libraryProgress){libraryProgress.hidden=false;libraryProgress.textContent=progress;}
  if(!validTypes.has(file.type)){failures.push(`${file.name} : format non accepté`);continue}
  // Serverless functions on Vercel have request body limits; keep each upload below 4MB.
  if(file.size>3.5*1024*1024){failures.push(`${file.name} : fichier trop lourd (3,5 Mo maximum dans le Studio)`);continue}
  try{
   const data=new FormData();data.append('file',file,file.name);
   data.append('_payload',JSON.stringify({alt:file.name.replace(/\.[^.]+$/,'').replace(/[-_]+/g,' ')}));
   const result=await fetch('/api/media',{method:'POST',body:data,credentials:'same-origin'});
   const json=await result.json().catch(()=>({}));
   if(!result.ok)throw Error(json?.errors?.[0]?.message||json?.message||`HTTP ${result.status}`);
   const doc=json.doc||json;
   if(!doc.url)throw Error('URL de la photographie absente');
   const photo={id:doc.id,url:doc.url,alt:doc.alt||file.name,filename:doc.filename||file.name};
   media.unshift(photo);photos.push(photo);
  }catch(err){failures.push(`${file.name} : ${err.message||'échec'}`)}
 }
 uploading=false;$('#directUploadInput').disabled=false;$('#directUploadInput').value='';
 $('#uploadProgress').hidden=true;
 const libraryProgress=$('#libraryUploadProgress');if(libraryProgress)libraryProgress.hidden=true;
 if($('#mediaModal').open)showMedia(pickerPage);
 if(photos.length&&(target||picker))applyUploaded(photos,target);
 if(selection==='media')loadLibrary(1);
 if(failures.length)message(`${photos.length} importée(s). ${failures.length} échec(s) : ${failures.slice(0,2).join(' / ')}`,true);
 else message(target?`${photos.length} photo(s) importée(s) et ajoutée(s) à ta page. Clique sur Publier.`:`${photos.length} photo(s) enregistrée(s) dans la médiathèque Payload et Vercel Blob.`);
}

async function refreshMedia(){if($('#mediaModal').open)await showMedia(pickerPage);if(selection==='media')await loadLibrary(library.page);message('Médiathèque actualisée')}
async function initialLoad(){try{const r=await fetch('/studio-api',{cache:'no-store'});if(!r.ok)throw Error('HTTP '+r.status);const data=await r.json();state={revision:data.content.revision,content:data.content};media=data.media||[];projects=data.projects||[];dirty=false;$('#saveBtn').disabled=false;setStatus(data.content.savedAt?'Enregistré — modifications en ligne':'Prêt à publier');render()}catch(error){console.error(error);setStatus('Connexion impossible',true);$('#editor').innerHTML='<div class="danger-message">Impossible de charger le Studio. Vérifiez votre connexion Payload et la variable BLOB_READ_WRITE_TOKEN dans Vercel.</div>';message('Chargement impossible',true)}}
async function save(){if(!state||loading)return;loading=true;$('#saveBtn').disabled=true;setStatus('Publication en cours…');try{const r=await fetch('/studio-api',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({revision:state.revision,content:state.content}),credentials:'same-origin'});const data=await r.json();if(!r.ok)throw Error(data.error||'Erreur '+r.status);state.revision=data.revision;state.content=data.content;dirty=false;setStatus('Publié — actualise ton site');message('✓ Modifications publiées sur YRUZPHOTO')}catch(error){setStatus('Publication échouée',true);message(error.message||'Erreur pendant la publication',true)}finally{loading=false;$('#saveBtn').disabled=false}}
function onAction(btn){const command=btn.dataset.action,index=Number(btn.dataset.index),i=Number(btn.dataset.item),dir=Number(btn.dataset.dir);
 const root=currentRoot(),sections=root?.sections||[];
 if(command==='add-section'){const type=$('#newBlockType').value;sections.push(clone(blockDefault(type)));markDirty();render();return}
 if(command==='move-section'){if(move(sections,index,index+dir)){markDirty();render()}return}
 if(command==='remove-section'){if(confirm('Supprimer cette section de votre page ?')){sections.splice(index,1);markDirty();render()}return}
 if(command==='choose-image'||command==='swap-image'){const path=btn.dataset.path;openPicker(photo=>{setNested(root,path,{url:photo.url,alt:photo.alt});markDirty();render()});return}
 if(command==='add-image'){const key=btn.dataset.key;openPicker(photo=>{sections[index][key].push({image:{url:photo.url,alt:photo.alt},caption:'',link:''});markDirty();render()});return}
 if(command==='upload-field'){uploadTarget={kind:'field',path:btn.dataset.path};$('#directUploadInput').click();return}
 if(command==='upload-gallery'){uploadTarget={kind:'gallery',index,key:btn.dataset.key};$('#directUploadInput').click();return}
 if(command==='move-item'||command==='remove-item'){const list=sections[index][btn.dataset.key];if(command==='move-item')move(list,i,i+dir);else list.splice(i,1);markDirty();render();return}
 if(command==='add-button'){sections[index].buttons.push({label:'Nouveau bouton',url:'contact.html',style:'primary'});markDirty();render();return}
 if(command==='add-nav'){root.links.push({label:'NOUVEAU LIEN',url:'portfolio.html',enabled:true,newTab:false});markDirty();render();return}
 if(command==='remove-nav'){root.links.splice(index,1);markDirty();render();return}
 if(command==='move-nav'){if(move(root.links,index,index+dir)){markDirty();render()}return}
 if(command==='toggle-project'){const b=sections[index];const sl=btn.dataset.slug;const set=new Set(b.chosenSlugs||[]);btn.checked?set.add(sl):set.delete(sl);b.chosenSlugs=[...set];markDirty();return}
}
document.addEventListener('click',event=>{
 const mediaAction=event.target.closest('[data-library-action]');if(mediaAction){handleLibraryAction(mediaAction);return}
 if(event.target.closest('#libraryDropzone')){uploadTarget=null;$('#directUploadInput').click();return}
 const nav=event.target.closest('[data-nav]');if(nav){selection=nav.dataset.nav;render();return}
 const actionBtn=event.target.closest('[data-action]');if(actionBtn){onAction(actionBtn);return}
});
$('#editor').addEventListener('input',event=>{
 if(event.target.id==='librarySearch'){
  library.search=event.target.value;clearTimeout(librarySearchTimer);
  librarySearchTimer=setTimeout(()=>loadLibrary(1),300);return;
 }
 const input=event.target.closest('[data-field]');if(!input)return;const value=input.type==='checkbox'?input.checked:input.value;setNested(currentRoot(),input.dataset.field,value);markDirty()});
$('#editor').addEventListener('change',event=>{
 if(event.target.id==='libraryDestination'){libraryDestination=event.target.value;return}
 const input=event.target.closest('[data-field]');if(!input)return;const value=input.type==='checkbox'?input.checked:input.value;setNested(currentRoot(),input.dataset.field,value);markDirty();if(input.dataset.field.endsWith('selection'))render()});
$('#saveBtn').addEventListener('click',save);
$('#closeMedia').addEventListener('click',closePicker);
$('#mediaModal').addEventListener('click',event=>{
 if(event.target===$('#mediaModal')){closePicker();return}
 const pageBtn=event.target.closest('[data-picker-page]');if(pageBtn){showMedia(Number(pageBtn.dataset.pickerPage));return}
 const btn=event.target.closest('[data-photo]');if(btn){const photo=window._currentMedia[Number(btn.dataset.photo)];if(photo&&picker){const callback=picker;closePicker();callback(photo)}}});
$('#mediaSearch').addEventListener('input',()=>{clearTimeout(pickerSearchTimer);pickerSearchTimer=setTimeout(()=>showMedia(1),300)});
$('#refreshMedia').addEventListener('click',refreshMedia);
$('#studioUploadBtn').addEventListener('click',()=>{uploadTarget=null;$('#directUploadInput').click()});
$('#directUploadInput').addEventListener('change',event=>{const files=Array.from(event.target.files||[]);importPhotos(files)});
$('#editor').addEventListener('keydown',event=>{if(event.target.id==='libraryDropzone'&&(event.key==='Enter'||event.key===' ')){event.preventDefault();uploadTarget=null;$('#directUploadInput').click()}});
$('#editor').addEventListener('dragover',event=>{const zone=event.target.closest('#libraryDropzone');if(zone){event.preventDefault();zone.classList.add('dragging')}});
$('#editor').addEventListener('dragleave',event=>{const zone=event.target.closest('#libraryDropzone');if(zone)zone.classList.remove('dragging')});
$('#editor').addEventListener('drop',event=>{const zone=event.target.closest('#libraryDropzone');if(!zone)return;event.preventDefault();zone.classList.remove('dragging');uploadTarget=null;importPhotos([...event.dataTransfer.files])});
initialLoad();
})();
