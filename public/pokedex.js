/* Le Pokédex : public gallery reading published Studio content only. */
(()=>{
'use strict';
const $=s=>document.querySelector(s);
const escapeHtml=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safeImage=v=>{const src=typeof v==='string'?v:v?.url;return /^(https?:\/\/[^\s<>"'`]+|\/api\/media\/[^\s<>"'`]+|\/?assets\/[^\s<>"'`]+)$/i.test(String(src||''))?src:''};
const rarities={commun:{label:'COMMUN',symbol:'●'},rare:{label:'RARE',symbol:'◆'},legendaire:{label:'LÉGENDAIRE',symbol:'★'}};
let cards=[],filter='all',term='',page=0,selected=null,chosenPhoto=0,turning=false;
const mobile=()=>matchMedia('(max-width:760px)').matches;
const perSpread=()=>mobile()?2:8;
const getFiltered=()=>cards.filter(c=>(filter==='all'||c.rarity===filter)&&(!term||[c.title,c.subtitle,c.category,c.event,c.date,c.description].some(v=>String(v||'').toLocaleLowerCase('fr').includes(term))));
const pad=i=>String(i).padStart(3,'0');
function numberOf(card){return pad(cards.indexOf(card)+1)}
function cardHTML(card,interactive=true){
 if(!card)return '<div class="pd-slot-empty" aria-hidden="true"><span>YRUZPHOTO</span></div>';
 const rarity=rarities[card.rarity]?card.rarity:'commun',cover=safeImage(card.cover);
 const photo=cover?`<img src="${escapeHtml(cover)}" alt="${escapeHtml(card.cover?.alt||card.title||'Portrait')}" loading="lazy">`:'';
 const contents=`<span class="pd-card-photo">${photo}</span><span class="pd-corner" aria-hidden="true"></span><span class="pd-card-index">#${numberOf(card)}</span><span class="pd-card-rank" aria-label="${rarities[rarity].label}">${rarities[rarity].symbol}</span><span class="pd-card-meta"><strong>${escapeHtml(card.title||'RENCONTRE')}</strong><small>${escapeHtml(card.subtitle||card.category||rarities[rarity].label)}</small></span>`;
 return interactive?`<button type="button" class="pd-card rarity-${rarity} ${selected===card.id?'is-selected':''}" data-card="${escapeHtml(card.id)}" aria-label="Voir la carte ${escapeHtml(card.title||'sans nom')} (${rarities[rarity].label})">${contents}</button>`:`<div class="pd-card rarity-${rarity}">${contents}</div>`;
}
function leafHTML(items,side){return `<div class="pd-leaf pd-leaf-${side}"><div class="pd-slot-grid">${items.map(c=>cardHTML(c)).join('')}</div></div>`}
function renderBook(){
 const matches=getFiltered(),per=perSpread(),max=Math.max(1,Math.ceil(matches.length/per));page=Math.max(0,Math.min(max-1,page));
 const slice=matches.slice(page*per,(page+1)*per),book=$('#pd-book');book.classList.toggle('empty',!matches.length);
 if(!matches.length&&cards.length&&term){book.innerHTML='<div class="pd-no-match">Aucune carte ne correspond à cette recherche.</div>'}
 else{
  const blank=Array.from({length:mobile()?2:8},(_,i)=>slice[i]||null);
  if(mobile())book.innerHTML=leafHTML(blank,'right');
  else book.innerHTML=leafHTML(blank.slice(0,4),'left')+'<div class="pd-spine" aria-hidden="true">'+Array.from({length:4},()=>'<span class="pd-ring"></span>').join('')+'</div>'+leafHTML(blank.slice(4,8),'right');
 }
 $('#pd-pagination').textContent=`${String(page+1).padStart(2,'0')} / ${String(max).padStart(2,'0')}`;
 $('#pd-prev').disabled=page===0;$('#pd-next').disabled=page>=max-1;
 if(!cards.length)$('#pd-book').setAttribute('aria-label','La collection attend ses premières cartes');
}
function renderDetails(){
 const card=cards.find(c=>c.id===selected&&c.published!==false),pane=$('#pd-detail');
 if(!card){pane.innerHTML='<div class="pd-detail-placeholder"><span class="pd-detail-symbol">◇</span><strong>UNE RENCONTRE,<br>UNE HISTOIRE.</strong><p>'+(!cards.length?'La collection est prête. Ajoute tes premiers portraits depuis le Studio YRUZPHOTO.':'Sélectionne une carte du classeur pour découvrir son histoire et ses photographies.')+'</p></div>';return}
 const r=rarities[card.rarity]||rarities.commun;
 const gallery=[card.cover,...(card.gallery||[])].filter(item=>safeImage(item));
 chosenPhoto=Math.max(0,Math.min(chosenPhoto,gallery.length-1));
 const featured=gallery[chosenPhoto]||card.cover,cover=safeImage(featured);
 pane.innerHTML=`<div class="pd-detail-tagline"><span>FICHE DE RENCONTRE</span><span>#${numberOf(card)}</span></div>
 <div class="pd-card pd-detail-card rarity-${escapeHtml(card.rarity)}"><span class="pd-card-photo">${cover?`<img src="${escapeHtml(cover)}" alt="${escapeHtml(featured?.alt||card.title||'Portrait')}">`:''}</span><span class="pd-corner"></span><span class="pd-card-index">#${numberOf(card)}</span><span class="pd-card-rank">${r.symbol}</span><span class="pd-card-meta"><strong>${escapeHtml(card.title||'RENCONTRE')}</strong><small>${escapeHtml(card.subtitle||card.category||'YRUZPHOTO')}</small></span></div>
 <div class="pd-detail-body"><div class="pd-detail-line"><h2>${escapeHtml(card.title||'Rencontre')}</h2><span class="pd-chip ${escapeHtml(card.rarity)}">${r.label}</span></div><p class="pd-detail-role">${escapeHtml(card.subtitle||card.category||'PORTRAIT')}</p>
 ${card.description?`<p class="pd-description">${escapeHtml(card.description)}</p>`:''}
 <div class="pd-facts">${card.category?`<div class="pd-fact"><strong>CATÉGORIE</strong><span>${escapeHtml(card.category)}</span></div>`:''}${card.event?`<div class="pd-fact"><strong>ÉVÉNEMENT</strong><span>${escapeHtml(card.event)}</span></div>`:''}${card.date?`<div class="pd-fact"><strong>DATE</strong><span>${escapeHtml(card.date)}</span></div>`:''}</div>
 <div class="pd-detail-gallery-title">PHOTOGRAPHIES ASSOCIÉES · ${gallery.length}</div>
 ${gallery.length?`<div class="pd-detail-gallery">${gallery.map((photo,i)=>`<button type="button" data-gallery="${i}" class="pd-gallery-photo ${i===chosenPhoto?'active':''}" aria-label="Voir la photo ${i+1}"><img src="${escapeHtml(safeImage(photo))}" alt="${escapeHtml(photo.alt||'Portrait')}" loading="lazy"></button>`).join('')}</div>`:'<p class="pd-gallery-empty">Photographies à venir.</p>'}
 </div>`;
}
function refreshFilters(){
 const counts={all:cards.length,legendaire:0,rare:0,commun:0};cards.forEach(c=>counts[c.rarity]=(counts[c.rarity]||0)+1);
 $('#pd-filters').querySelectorAll('button').forEach(btn=>{btn.classList.toggle('is-active',btn.dataset.filter===filter);btn.setAttribute('aria-pressed',String(btn.dataset.filter===filter));btn.title=`${counts[btn.dataset.filter]||0} carte(s)`});
}
function rerender(keepSelection=true){
 const matches=getFiltered();if(!keepSelection||!matches.some(c=>c.id===selected)){selected=matches[0]?.id||null;chosenPhoto=0}
 renderBook();renderDetails();refreshFilters();
}
function turn(direction){
 if(turning)return;
 const max=Math.max(1,Math.ceil(getFiltered().length/perSpread()));const next=page+direction;if(next<0||next>=max)return;
 const book=$('#pd-book'),source=book.querySelector(mobile()?'.pd-leaf-right':direction>0?'.pd-leaf-right':'.pd-leaf-left');
 const finish=()=>{page=next;turning=false;renderBook()};
 if(!source||matchMedia('(prefers-reduced-motion:reduce)').matches){finish();return}
 turning=true;const layer=document.createElement('div');layer.className='pd-turn-layer '+(direction>0?'next':'previous');layer.innerHTML=source.outerHTML;book.appendChild(layer);
 requestAnimationFrame(()=>requestAnimationFrame(()=>layer.classList.add('go')));
 setTimeout(finish,550);
}
async function init(){
 try{
  const res=await fetch('/cms-content?page=pokedex',{cache:'no-store'});if(!res.ok)throw new Error('HTTP '+res.status);
  const data=await res.json();const content=data.page;
  if(content){
   $('#pd-heading').textContent=content.heading||'LE POKÉDEX';$('#pd-intro').textContent=content.intro||'Mes rencontres, mes photos, ma collection.';
   cards=(Array.isArray(content.cards)?content.cards:[]).filter(c=>c&&c.published!==false).map((c,i)=>({...c,id:c.id||`carte-${i}`,rarity:rarities[c.rarity]?c.rarity:'commun'}));
  }
  rerender(false);
 }catch(error){console.warn('Pokédex : impossible de lire les contenus',error);$('#pd-book').innerHTML='<div class="pd-loader">COLLECTION MOMENTANÉMENT INDISPONIBLE.</div>';$('#pd-detail').innerHTML='<div class="pd-detail-placeholder"><strong>À BIENTÔT.</strong><p>La collection ne peut pas être chargée pour le moment.</p></div>'}
}
$('#pd-filters').addEventListener('click',event=>{const btn=event.target.closest('[data-filter]');if(!btn)return;filter=btn.dataset.filter;page=0;rerender(false)});
$('#pd-query').addEventListener('input',event=>{term=event.target.value.trim().toLocaleLowerCase('fr');page=0;rerender(false)});
$('#pd-book').addEventListener('click',event=>{const btn=event.target.closest('[data-card]');if(!btn||turning)return;selected=btn.dataset.card;chosenPhoto=0;renderBook();renderDetails();if(mobile())$('#pd-detail').scrollIntoView({behavior:'smooth',block:'start'})});
$('#pd-detail').addEventListener('click',event=>{const photo=event.target.closest('[data-gallery]');if(!photo)return;chosenPhoto=Number(photo.dataset.gallery)||0;renderDetails()});
$('#pd-prev').addEventListener('click',()=>turn(-1));$('#pd-next').addEventListener('click',()=>turn(1));
document.addEventListener('keydown',event=>{if(/input|textarea/i.test(document.activeElement.tagName))return;if(event.key==='ArrowRight')turn(1);if(event.key==='ArrowLeft')turn(-1)});
let touchX=null;$('#pd-book').addEventListener('touchstart',e=>{touchX=e.touches[0]?.clientX??null},{passive:true});$('#pd-book').addEventListener('touchend',e=>{if(touchX===null)return;const dx=(e.changedTouches[0]?.clientX??touchX)-touchX;touchX=null;if(Math.abs(dx)>70)turn(dx<0?1:-1)},{passive:true});
let wasMobile=mobile();window.addEventListener('resize',()=>{if(wasMobile!==mobile()){wasMobile=mobile();page=0;rerender()}});
init();
})();
