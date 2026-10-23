(() => {
 const items=window.YRUZ_PROJECTS||[];
 const params=new URLSearchParams(location.search);
 const view=document.body.dataset.page;
 const escapeHtml=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const validMedia = u => {const s=String(u||'').trim();return /^(https?:\/\/|assets\/|medias\/)/i.test(s)&&!/[<>"'`]/.test(s)?s:''};
 const mediaImg=(url,alt,loading='lazy')=>`<img ${loading==='lazy'?'loading="lazy"':''} src="${escapeHtml(validMedia(url))}" alt="${escapeHtml(alt)}">`;
 const card=p=>`<a class="catalog-card" href="${yruzProjectUrl(p)}" aria-label="Ouvrir ${escapeHtml(p.title)}"><span class="catalog-image">${mediaImg(p.cover,p.title)}</span><span class="catalog-meta"><span class="catalog-kind">${p.mode==='video'?'▶ VIDÉO':'◈ PHOTO'} · ${escapeHtml(p.category)}</span><span class="catalog-title">${escapeHtml(p.title)}</span><span class="catalog-arrow" aria-hidden="true">↗</span></span></a>`;
 if(view==='catalog'){
  const grid=document.getElementById('catalogGrid'),tabs=[...document.querySelectorAll('[data-filter]')];
  let filter=params.get('type')==='video'?'video':'photo';
  function render(){tabs.forEach(el=>{const selected=el.dataset.filter===filter;el.classList.toggle('active',selected);el.setAttribute('aria-pressed',String(selected))});const subset=items.filter(p=>p.mode===filter);grid.innerHTML=subset.map(card).join('');document.getElementById('projectCount').textContent=`${String(subset.length).padStart(2,'0')} PROJETS`;const url=new URL(location.href);url.searchParams.set('type',filter);history.replaceState(null,'',url)}
  tabs.forEach(el=>el.addEventListener('click',()=>{filter=el.dataset.filter;render()}));render();
 }
 if(view==='project'){
  const p=items.find(x=>x.id===params.get('id'));const content=document.getElementById('projectContent');
  if(!p){content.innerHTML='<h1>PROJET INTROUVABLE</h1><p>Ce dossier n’existe pas dans le catalogue.</p><a class="btn outline" href="portfolio.html">RETOUR AU PORTFOLIO ↗</a>';return}
  document.title=p.title+' — YRUZPHOTO';
  const related=items.filter(x=>x.mode===p.mode&&x.id!==p.id).slice(0,3);
  const gallery=(Array.isArray(p.gallery)?p.gallery:[]).map(validMedia).filter(Boolean);
  const hasVideo=Boolean(validMedia(p.video));
  const isEmpty=!gallery.length&&!hasVideo;
  const mansCarousel=p.mode==='photo' && gallery.length>1;
  const galleryCarouselMarkup=mansCarousel?`<div class="mans-carousel" aria-label="Carrousel du reportage"><div class="mans-carousel-view"><button type="button" class="mans-slide-button" data-gallery-index="0" aria-label="Agrandir la photographie affichée"><img class="mans-main-image" src="${escapeHtml(gallery[0])}" alt="${escapeHtml(p.title)} — photo 1"><span class="mans-open">AGRANDIR ↗</span></button><button type="button" class="mans-arrow mans-arrow-prev" aria-label="Photographie précédente">←</button><button type="button" class="mans-arrow mans-arrow-next" aria-label="Photographie suivante">→</button></div><div class="mans-carousel-footer"><span class="mans-carousel-count">01 / ${String(gallery.length).padStart(2,'0')}</span><div class="mans-progress"><span></span></div><span class="mans-carousel-label">GLISSER OU CLIQUER</span></div><div class="mans-filmstrip" aria-label="Choisir une photographie">${gallery.map((url,i)=>`<button class="mans-thumb" type="button" data-slide-index="${i}" aria-label="Afficher la photo ${i+1}" aria-current="${i===0?'true':'false'}"><img src="${escapeHtml(url)}" alt="" loading="lazy"></button>`).join('')}</div></div>`:'';
  const galleryMarkup=gallery.length?`<div class="gallery-heading"><div><span class="eyebrow">${p.demoGallery?'PHOTOS DE DÉMONSTRATION':'GALERIE DU PROJET'}</span><h2>LES IMAGES</h2></div><span>${String(gallery.length).padStart(2,'0')} VISUELS · CLIQUEZ POUR AGRANDIR</span></div><div class="project-gallery">${gallery.map((url,i)=>`<button class="gallery-image" type="button" data-gallery-index="${i}" aria-label="Agrandir la photo ${i+1} sur ${gallery.length}">${mediaImg(url,`${p.title} — photo ${i+1}`)}<span class="gallery-zoom">↗</span></button>`).join('')}</div>`:'<div class="gallery-empty">Les médias de ce projet seront ajoutés prochainement.</div>';
  const videoMarkup=hasVideo?`<div class="gallery-heading"><div><span class="eyebrow">FILM</span><h2>LA VIDÉO</h2></div></div><video controls playsinline preload="metadata" poster="${escapeHtml(validMedia(p.cover))}" src="${escapeHtml(validMedia(p.video))}">Votre navigateur ne prend pas en charge cette vidéo.</video>`:'';
  content.innerHTML=`<div class="project-overline">${p.mode==='photo'?'PHOTOGRAPHIE':'VIDÉO'} / ${escapeHtml(p.category)}</div><h1>${escapeHtml(p.title)}</h1><div class="project-actions"><a class="btn outline" href="portfolio.html?type=${p.mode}">← TOUS LES PROJETS</a><span class="project-state">${p.demoGallery?'GALERIE DE DÉMONSTRATION — PHOTOS À REMPLACER':isEmpty?'DOSSIER PRÊT À RECEVOIR VOS FICHIERS':`${gallery.length} PHOTO${gallery.length>1?'S':''}${hasVideo?' · 1 VIDÉO':''}`}</span></div><div class="project-cover">${mediaImg(p.cover,p.title,'eager')}</div>${videoMarkup}${mansCarousel?galleryCarouselMarkup:galleryMarkup}<div class="project-next"><div><span class="eyebrow">POUR ALLER PLUS LOIN</span><h2>À DÉCOUVRIR AUSSI</h2></div><div class="catalog-grid">${related.map(card).join('')}</div></div>`;
  if(gallery.length){
   const overlay=document.createElement('div');overlay.className='yruz-lightbox';overlay.hidden=true;overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-label','Visionneuse de photos');
   overlay.innerHTML='<button class="lb-close" type="button" aria-label="Fermer la visionneuse">✕</button><button class="lb-prev" type="button" aria-label="Photo précédente">←</button><figure><img alt=""><figcaption></figcaption></figure><button class="lb-next" type="button" aria-label="Photo suivante">→</button>';
   document.body.append(overlay);
   let index=0,lastFocus=null;
   const img=overlay.querySelector('img'),cap=overlay.querySelector('figcaption');
   const show=i=>{index=(i+gallery.length)%gallery.length;img.src=gallery[index];img.alt=`${p.title} — photo ${index+1}`;cap.textContent=`${String(index+1).padStart(2,'0')} / ${String(gallery.length).padStart(2,'0')}`};
   const open=i=>{lastFocus=document.activeElement;show(i);overlay.hidden=false;document.body.classList.add('lb-open');overlay.querySelector('.lb-close').focus()};
   const close=()=>{overlay.hidden=true;img.removeAttribute('src');document.body.classList.remove('lb-open');lastFocus?.focus()};
   if(mansCarousel){
    const carousel=content.querySelector('.mans-carousel');
    const main=carousel.querySelector('.mans-main-image');
    const mainBtn=carousel.querySelector('.mans-slide-button');
    const count=carousel.querySelector('.mans-carousel-count');
    const progress=carousel.querySelector('.mans-progress span');
    const thumbs=[...carousel.querySelectorAll('.mans-thumb')];
    let slide=0, startX=null;
    function selectSlide(i){
      slide=(i+gallery.length)%gallery.length;
      main.classList.add('is-changing');
      main.src=gallery[slide];
      main.alt=`${p.title} — photo ${slide+1}`;
      mainBtn.dataset.galleryIndex=String(slide);
      count.textContent=`${String(slide+1).padStart(2,'0')} / ${String(gallery.length).padStart(2,'0')}`;
      progress.style.width=`${((slide+1)/gallery.length)*100}%`;
      thumbs.forEach((thumb,j)=>thumb.setAttribute('aria-current',j===slide?'true':'false'));
      thumbs[slide].scrollIntoView({block:'nearest',inline:'nearest',behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
      requestAnimationFrame(()=>requestAnimationFrame(()=>main.classList.remove('is-changing')));
    }
    carousel.querySelector('.mans-arrow-prev').addEventListener('click',()=>selectSlide(slide-1));
    carousel.querySelector('.mans-arrow-next').addEventListener('click',()=>selectSlide(slide+1));
    thumbs.forEach((thumb,i)=>thumb.addEventListener('click',()=>selectSlide(i)));
    const viewport=carousel.querySelector('.mans-carousel-view');
    viewport.addEventListener('pointerdown',e=>{startX=e.clientX});
    viewport.addEventListener('pointerup',e=>{if(startX===null)return;const delta=e.clientX-startX;startX=null;if(Math.abs(delta)>45){selectSlide(slide+(delta<0?1:-1));viewport.dataset.wasSwiped='1';setTimeout(()=>delete viewport.dataset.wasSwiped,250)}});
    viewport.addEventListener('pointercancel',()=>startX=null);
    viewport.addEventListener('click',e=>{if(viewport.dataset.wasSwiped){e.preventDefault();e.stopPropagation()}},true);
    carousel.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();selectSlide(slide+(e.key==='ArrowRight'?1:-1))}});
    progress.style.width=`${100/gallery.length}%`;
   }
   content.querySelectorAll('[data-gallery-index]').forEach(b=>b.addEventListener('click',()=>open(Number(b.dataset.galleryIndex))));
   overlay.querySelector('.lb-close').addEventListener('click',close);
   overlay.querySelector('.lb-prev').addEventListener('click',()=>show(index-1));
   overlay.querySelector('.lb-next').addEventListener('click',()=>show(index+1));
   overlay.addEventListener('click',e=>{if(e.target===overlay)close()});
   document.addEventListener('keydown',e=>{if(overlay.hidden)return;if(e.key==='Escape')close();else if(e.key==='ArrowLeft')show(index-1);else if(e.key==='ArrowRight')show(index+1);else if(e.key==='Tab'){const buttons=[...overlay.querySelectorAll('button')];if(e.shiftKey&&document.activeElement===buttons[0]){e.preventDefault();buttons[buttons.length-1].focus()}else if(!e.shiftKey&&document.activeElement===buttons[buttons.length-1]){e.preventDefault();buttons[0].focus()}}});
  }
 }
 const toggle=document.querySelector('.mobile-toggle');if(toggle){toggle.addEventListener('click',()=>{const nav=document.getElementById('nav');const opened=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(opened))})}
})();
