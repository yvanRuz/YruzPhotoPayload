(async()=>{
// Retain the original equipment page if Studio content is unavailable or unpublished.
let items=Array.isArray(window.YRUZ_GEAR)?window.YRUZ_GEAR:[];
try {
 const response=await fetch('/cms-content?page=equipement',{cache:'no-store',signal:AbortSignal.timeout(5000)});
 if(response.ok){
  const data=await response.json();const page=data?.page;
  if(page?.equipmentCustomized===true&&Array.isArray(page.equipmentItems)){
   const safeImage=url=>/^(https?:\/\/[^\s<>"'`]+|\/api\/media\/[^\s<>"'`]+|\/?assets\/[^\s<>"'`]+)$/i.test(String(url||''))?url:'';
   items=page.equipmentItems.map((row,i)=>({
    id:String(row.id||`gear-${i}`),slot:['camera','lens','audio','light'].includes(row.slot)?row.slot:'camera',
    name:String(row.name||''),category:String(row.category||''),glyph:String(row.glyph||'◇'),
    description:String(row.description||''),specs:Array.isArray(row.specs)?row.specs:[],
    image:safeImage(row.image?.url||'')
   })).filter(row=>row.name);
   document.querySelector('.demo')?.remove();
   const badge=document.querySelector('.equip-level > span');if(badge)badge.textContent='MON MATÉRIEL';
   const disclaimer=document.querySelector('.equip-bottom > span');if(disclaimer)disclaimer.textContent='MON MATÉRIEL POUR TES PROJETS PHOTO ET VIDÉO.';
   const footer=document.querySelector('.footer > span');if(footer)footer.textContent='© 2026 • YRUZPHOTO';
  }
 }
} catch(error) { console.info('Inventaire Studio indisponible : matériel par défaut conservé.'); }
const slots=[{id:'camera',name:'CAMÉRA',icon:'📷'},{id:'lens',name:'OPTIQUE',icon:'◎'},{id:'audio',name:'AUDIO',icon:'♫'},{id:'light',name:'LUMIÈRE',icon:'✦'}];
const filters=[{id:'all',name:'TOUT VOIR'},...slots.map(x=>({id:x.id,name:x.name}))];
const byId=Object.fromEntries(items.map(x=>[x.id,x]));
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let filter='all';
let lastSpecTrigger=null;
const modal=document.getElementById('equipModal');
// A new storage key ensures an empty bag on the first V13 visit.
let equipped={};
try{const previous=JSON.parse(localStorage.getItem('yruz-gear-loadout-v13')||'{}');for(const slot of slots){if(previous[slot.id]&&byId[previous[slot.id]]?.slot===slot.id)equipped[slot.id]=previous[slot.id]}}catch{}
const $=id=>document.getElementById(id);
function persist(){try{localStorage.setItem('yruz-gear-loadout-v13',JSON.stringify(equipped))}catch{}}
function picture(item){return item.image?`<img src="${escape(item.image)}" alt="" style="max-width:100%;max-height:100px;object-fit:contain">`:escape(item.glyph)}
function draw(){
 $('equipFilters').innerHTML=filters.map(f=>`<button type="button" class="${filter===f.id?'active':''}" data-filter="${f.id}" aria-pressed="${filter===f.id}">${f.name}</button>`).join('');
 const filtered=items.filter(x=>filter==='all'||x.slot===filter);
 $('itemCount').textContent=`${String(filtered.length).padStart(2,'0')} ÉQUIPEMENTS`;
 $('equipGrid').innerHTML=filtered.map(p=>`<div class="equip-item ${equipped[p.slot]===p.id?'equipped':''}"><button type="button" class="equip-item-main" data-item="${escape(p.id)}" aria-label="${equipped[p.slot]===p.id?'Retirer':'Équiper'} ${escape(p.name)}"><span class="item-tag">${escape(p.category)}</span>${equipped[p.slot]===p.id?'<span class="item-status">✓ ÉQUIPÉ</span>':''}<span class="gear-glyph">${picture(p)}</span><span><strong>${escape(p.name)}</strong><small>${equipped[p.slot]===p.id?'CLIQUER POUR RETIRER':'CLIQUER POUR ÉQUIPER +'}</small></span></button><button class="equip-spec-button" type="button" data-spec="${escape(p.id)}" aria-label="Voir les spécifications de ${escape(p.name)}">SPEC ↗</button></div>`).join('');
 $('equipSlots').innerHTML=slots.map(s=>{const obj=byId[equipped[s.id]];return `<button type="button" class="equip-slot ${obj?'filled':''}" data-slot="${s.id}" aria-label="${escape(s.name)} : ${escape(obj?.name||'emplacement vide')}"><span class="slot-icon">${obj?picture(obj):s.icon}</span><strong>${escape(obj?.name||s.name)}</strong><small>${obj?'ÉQUIPÉ • CLIQUER POUR RETIRER':'EMPLACEMENT LIBRE'}</small></button>`}).join('');
 const n=Object.keys(equipped).length;$('equipCount').textContent=String(n).padStart(2,'0');$('equipProgress').style.width=`${n/slots.length*100}%`;$('equipSummary').textContent=`${n} / ${slots.length} emplacements équipés`;
 const ready=n>0;const readyBtn=$('readyButton');readyBtn.classList.toggle('is-ready',ready);readyBtn.setAttribute('aria-disabled',String(!ready));readyBtn.tabIndex=ready?0:-1;$('readyHint').textContent=ready?'TON SETUP EST PRÊT — DÉCOUVRIR LES SERVICES':'SÉLECTIONNE UN OBJET POUR PRÉPARER TON SAC';

}
$('equipFilters').addEventListener('click',e=>{const btn=e.target.closest('[data-filter]');if(!btn)return;filter=btn.dataset.filter;draw()});
// Clicking a catalog item equips it directly; clicking again removes it.
// A flying thumbnail visually connects the item to its actual backpack slot.
function flyToBag(source, slotId, item, originRect, originGlyph){
 if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 const target=document.querySelector(`#equipSlots [data-slot="${slotId}"]`);
 if(!source||!target)return;
 const from=originRect || source?.getBoundingClientRect();if(!from)return;const to=target.getBoundingClientRect();
 const glyph=originGlyph || source?.querySelector('.gear-glyph')?.innerHTML;
 const flyer=document.createElement('div'); flyer.className='gear-flyer';
 flyer.innerHTML=glyph||escape(item.glyph);
 const size=58;
 const x0=from.left+from.width/2-size/2,y0=from.top+from.height/2-size/2;
 const dx=to.left+to.width/2-size/2-x0,dy=to.top+to.height/2-size/2-y0;
 flyer.style.left=`${x0}px`;flyer.style.top=`${y0}px`;
 document.body.appendChild(flyer);
 const anim=flyer.animate([
  {transform:'translate(0,0) scale(.95)',opacity:.95,offset:0},
  {transform:`translate(${dx*.45}px,${dy*.28-35}px) scale(1.18)`,opacity:1,offset:.45},
  {transform:`translate(${dx}px,${dy}px) scale(.52)`,opacity:.15,offset:1}
 ],{duration:680,easing:'cubic-bezier(.22,1,.36,1)'});
 anim.addEventListener('finish',()=>{flyer.remove();target.classList.remove('slot-landed');void target.offsetWidth;target.classList.add('slot-landed');setTimeout(()=>target.classList.remove('slot-landed'),650)},{once:true});
 anim.addEventListener('cancel',()=>flyer.remove(),{once:true});
}
$('equipGrid').addEventListener('click',e=>{
 const btn=e.target.closest('[data-item]');if(!btn)return;
 const item=byId[btn.dataset.item];if(!item)return;
 const removing=equipped[item.slot]===item.id;
 const from=btn.getBoundingClientRect(),glyph=btn.querySelector('.gear-glyph')?.innerHTML;
 if(removing)delete equipped[item.slot];else equipped[item.slot]=item.id;
 persist();draw();
 if(!removing)flyToBag(btn,item.slot,item,from,glyph);
});

// Detailed specifications are shown only on demand, in an accessible overlay.
function openSpecs(item, trigger){
 lastSpecTrigger=trigger;
 const isEquipped=equipped[item.slot]===item.id;
 $('equipModalContent').innerHTML=`<div class="equip-modal-eyebrow">FICHE MATÉRIEL · ${escape(item.category)}</div><div class="equip-modal-header"><span class="equip-modal-glyph">${picture(item)}</span><div><h2 id="equipModalTitle">${escape(item.name)}</h2><p>${escape(item.description||'')}</p></div></div><div class="equip-modal-specs">${(item.specs||[]).map(v=>`<div>${escape(v)}</div>`).join('')}</div><button type="button" id="equipModalAction" class="equip-modal-action">${isEquipped?'RETIRER DU SAC −':'ÉQUIPER CET OBJET +'}</button>`;
 modal.hidden=false;document.body.classList.add('equip-modal-open');
 modal.querySelector('.equip-modal-close').focus();
 $('equipModalAction').addEventListener('click',()=>{
  const removing=equipped[item.slot]===item.id;
  const origin=document.querySelector(`[data-item="${CSS.escape(item.id)}"]`);
  const from=origin?.getBoundingClientRect(),glyph=origin?.querySelector('.gear-glyph')?.innerHTML;
  if(removing)delete equipped[item.slot];else equipped[item.slot]=item.id;
  persist();draw();closeSpecs();
  if(!removing)flyToBag(origin,item.slot,item,from,glyph);
 });
}
function closeSpecs(){if(modal.hidden)return;modal.hidden=true;document.body.classList.remove('equip-modal-open');lastSpecTrigger?.focus();lastSpecTrigger=null;}
modal.addEventListener('click',e=>{if(e.target.closest('[data-close-spec]'))closeSpecs()});
document.addEventListener('keydown',e=>{
 if(modal.hidden)return;
 if(e.key==='Escape'){e.preventDefault();closeSpecs()}
 if(e.key==='Tab'){
  const focusable=[...modal.querySelectorAll('button')].filter(el=>!el.disabled);
  if(!focusable.length)return;
  const first=focusable[0],last=focusable[focusable.length-1];
  if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
  else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
 }
});
$('equipGrid').addEventListener('click',e=>{
 const btn=e.target.closest('[data-spec]');if(!btn)return;
 const item=byId[btn.dataset.spec];if(item)openSpecs(item,btn);
});

$('equipSlots').addEventListener('click',e=>{const btn=e.target.closest('[data-slot]');if(!btn)return;const slot=btn.dataset.slot;const p=byId[equipped[slot]];if(p){delete equipped[slot];persist()}else{filter=slot;}draw()});
$('resetEquip').addEventListener('click',()=>{equipped={};persist();draw()});
$('readyButton').addEventListener('click',e=>{if(e.currentTarget.getAttribute('aria-disabled')==='true')e.preventDefault()});
const toggle=document.querySelector('.mobile-toggle');toggle?.addEventListener('click',()=>{const nav=$('nav');const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open))});
draw();
})();
