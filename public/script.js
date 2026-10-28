// YRUZPHOTO V26 — carrousel triptyque miroir, synchronisé avec le cadran.
// Les creations graphiques sont des projets photo avec la categorie GRAPHISME.
// Pas de nouvelle colonne PostgreSQL : publication directe depuis Payload.
const isGraphicProject = p => p && p.mode !== 'video' && /graphis|design|cr[eé]ation graphique|identit[eé] visuelle|branding/i.test(String(p.category || ''));
const projectsForMode = selected => (window.YRUZ_PROJECTS || []).filter(p => selected === 'graphisme' ? isGraphicProject(p) : selected === 'photo' ? p.mode === 'photo' && !isGraphicProject(p) : p.mode === 'video');
// V44: optional Studio-authored featured cards. Null = original Payload projects.
const featuredCards = {photo:null,video:null,graphisme:null};
const carouselItems = kind => Array.isArray(featuredCards[kind]) ? featuredCards[kind].filter(c=>c.enabled!==false && c.cover && c.title).map((c,i)=>({
  id:'studio-'+kind+'-'+i,mode:kind,category:c.category||kind.toUpperCase(),title:c.title,cover:c.cover,
  gallery:[],url:c.link||'',isStudioCard:true
})) : projectsForMode(kind);
let photos = projectsForMode('photo');
const mansProject = (window.YRUZ_PROJECTS || []).find(p => p.id === 'mans-nuit');
const heroImages=(window.YRUZ_SITE_CONFIG?.homeImages?.length ? window.YRUZ_SITE_CONFIG.homeImages : [photos[0]?.gallery?.[1]||photos[0]?.cover,photos[0]?.gallery?.[2]||photos[0]?.cover]).filter(Boolean);
let heroIndex=0;
window.yruzSetHeroImages = function (urls) { if (!Array.isArray(urls) || !urls.length) return; heroImages.splice(0, heroImages.length, ...urls); heroIndex = 0; drawHero(); };
function drawHero(){
  const bg=document.getElementById('heroBg');
  if(!bg||!heroImages.length)return;
  bg.style.opacity='.5';
  setTimeout(()=>{
    bg.style.backgroundImage=`url("${heroImages[heroIndex]}")`;
    bg.style.opacity='1';
  },150);
  const counter=document.getElementById('heroCounter');
  if(counter)counter.textContent=`${String(heroIndex+1).padStart(2,'0')} / ${String(heroImages.length).padStart(2,'0')}`;
}
function changeHero(delta){
  if(!heroImages.length)return;
  heroIndex=(heroIndex+delta+heroImages.length)%heroImages.length;
  drawHero();
}
document.getElementById('nextHero')?.addEventListener('click',()=>changeHero(1));
document.getElementById('prevHero')?.addEventListener('click',()=>changeHero(-1));
drawHero();

let mode='photo';
let projects=carouselItems(mode);
let current=0;
let activeValue=0;
let cards=[];
let dragging=null;
let lastWheel=0;
let animationFrame=0;
let dragDial=null;
let dialInertiaFrame=0;

const stage=document.getElementById('stage');
const dots=document.getElementById('dots');
const timeline=document.querySelector('.carousel-timeline');
const progressBar=document.getElementById('carouselProgress');
const knob=document.querySelector('.rotation-knob');
const counter=document.getElementById('carouselCounter');
const prevBtn=document.getElementById('prevCard');
const nextBtn=document.getElementById('nextCard');
const topAll=document.getElementById('topAll');
const allProjects=document.getElementById('allProjects');

const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
const easeOutCubic=t=>1-Math.pow(1-t,3);
function stopAnimation(){ if(animationFrame) cancelAnimationFrame(animationFrame); animationFrame=0; }
function stopDialInertia(){ if(dialInertiaFrame) cancelAnimationFrame(dialInertiaFrame); dialInertiaFrame=0; }
function updateLinks(){
  if(topAll) topAll.href=`portfolio.html?type=${mode}`;
  if(allProjects) allProjects.href=`portfolio.html?type=${mode}`;
}
function distanceFromCenter(i, center){
  const n=projects.length;
  if(!n)return 0;
  // Galerie circulaire : les derniers projets apparaissent a gauche
  // du premier des l'ouverture, et inversement en fin de parcours.
  let d=i-center;
  if(d>n/2)d-=n;
  if(d< -n/2)d+=n;
  return d;
}
function setDialFromValue(value){
  if(!projects.length)return;
  const max=Math.max(1,projects.length-1);
  const ratio=clamp(value/max,0,1);
  if(progressBar)progressBar.style.width=`${ratio*100}%`;
  if(knob)knob.style.setProperty('--dial-position',`${ratio*100}%`);
  if(timeline){
    timeline.setAttribute('aria-valuemin','1');
    timeline.setAttribute('aria-valuemax',String(projects.length));
    timeline.setAttribute('aria-valuenow',String(Math.round(clamp(value,0,max))+1));
  }
}
function renderCarousel(value=activeValue){
  if(!projects.length)return;
  activeValue=clamp(value,0,Math.max(0,projects.length-1));
  const selected=Math.round(activeValue);
  current=selected;
  const narrow=window.innerWidth<650;
  const medium=window.innerWidth<1100;
  const primaryShift=narrow?145:medium?218:284;
  const secondaryShift=narrow?232:medium?346:470;
  cards.forEach((card,i)=>{
    const d=distanceFromCenter(i,activeValue);
    const mag=Math.abs(d);
    const side=Math.sign(d)||1;
    let x=0,y=0,z=0,scale=1,rotateY=0,rotateZ=0,opacity=1,blur=0,bright=1,sat=1,mirror=.24;
    let visible=mag<=2.35;
    let state='front';
    if(mag<=1.05){
      const influence=mag;
      x=d*primaryShift;
      y=mag*25;
      z=-mag*145;
      scale=1-(mag*.18);
      rotateY=-d*25;
      rotateZ=-d*.65;
      opacity=1-(mag*.14);
      blur=mag*.2;
      bright=1-(mag*.1);
      sat=1-(mag*.04);
      mirror=.22-(mag*.05);
      state=(mag<.45)?'current':'neighbour';
    } else if(mag<=2.35){
      const extra=mag-1;
      x=side*(secondaryShift+extra*76);
      y=42+extra*16;
      z=-245-extra*68;
      scale=.77-extra*.09;
      rotateY=-side*(32+extra*5);
      rotateZ=-side*.9;
      opacity=Math.max(.16,.56-extra*.24);
      blur=.35+extra*.55;
      bright=.8-extra*.13;
      sat=.9-extra*.08;
      mirror=.1+.08*Math.max(0,.8-extra);
      state='backrow';
    }
    card.classList.toggle('is-current',state==='current');
    card.classList.toggle('is-neighbour',state==='neighbour');
    card.classList.toggle('is-backrow',state==='backrow');
    card.classList.toggle('is-moving',Math.abs(activeValue-selected)>.03);
    card.style.opacity=visible?String(opacity):'0';
    card.style.pointerEvents=visible?'auto':'none';
    card.style.zIndex=String(200-Math.round(mag*40)+(state==='current'?40:state==='neighbour'?18:0));
    card.style.transform=`translate3d(calc(-50% + ${x}px),${y}px,${z}px) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) scale(${scale})`;
    card.style.filter=`brightness(${bright}) saturate(${sat}) blur(${blur}px)`;
    card.style.setProperty('--mirror-opacity',String(Math.max(0,mirror)));
    card.style.setProperty('--card-depth',String(1-Math.min(1,mag/3)));
    card.setAttribute('aria-hidden',visible?'false':'true');
    card.tabIndex=visible?0:-1;
  });
  setDialFromValue(activeValue);
  if(counter)counter.textContent=`${String(selected+1).padStart(2,'0')} / ${String(projects.length).padStart(2,'0')}`;
}
function animateTo(target,{duration}={}){
  if(!projects.length)return;
  stopAnimation();
  stopDialInertia();
  const max=Math.max(0,projects.length-1);
  const to=clamp(target,0,max);
  const from=activeValue;
  const delta=to-from;
  const totalDuration=duration ?? clamp(300+Math.abs(delta)*170,320,760);
  const start=performance.now();
  function tick(now){
    const t=clamp((now-start)/totalDuration,0,1);
    renderCarousel(from+delta*easeOutCubic(t));
    if(t<1){animationFrame=requestAnimationFrame(tick);}else{animationFrame=0;renderCarousel(to);}
  }
  animationFrame=requestAnimationFrame(tick);
}
function mountCards(){
  if(!stage)return;
  stage.querySelectorAll('.portfolio-card,.portfolio-empty-v42').forEach(node=>node.remove());
  if(dots)dots.replaceChildren();
  cards=[];
  if(prevBtn)prevBtn.disabled=projects.length<2;
  if(nextBtn)nextBtn.disabled=projects.length<2;
  if(!projects.length){
    const empty=document.createElement('div');
    empty.className='portfolio-empty-v42';
    empty.innerHTML='<span class="portfolio-empty-kicker">À VENIR / GRAPHISME</span><strong>DE NOUVELLES CRÉATIONS<br>TRÈS BIENTÔT.</strong><p>Les projets graphiques apparaîtront ici dès leur publication dans le back-office.</p><a href="contact.html">PARLONS DE VOTRE PROJET ↗</a>';
    stage.append(empty);
    if(progressBar)progressBar.style.width='0%';
    if(knob)knob.style.setProperty('--dial-position','0%');
    if(counter)counter.textContent='00 / 00';
    return;
  }
  projects.forEach((p,i)=>{
    const card=document.createElement('button');
    card.type='button';
    card.className='portfolio-card floating-card';
    card.style.setProperty('--card-image',`url("${p.cover}")`);
    card.setAttribute('aria-label',`Projet ${p.title} — sélectionner ou ouvrir`);

    const shell=document.createElement('span');
    shell.className='card-shell';

    const image=document.createElement('img');
    image.src=p.cover;
    image.alt=p.title;
    image.loading='lazy';
    shell.appendChild(image);

    const txt=document.createElement('span');
    txt.className='card-text';
    const cat=document.createElement('span');
    cat.className='card-category';
    cat.textContent=p.category;
    const title=document.createElement('span');
    title.className='card-title';
    title.textContent=p.title;
    txt.append(cat,title);

    const arrow=document.createElement('span');
    arrow.className='card-go';
    arrow.textContent='↗';

    const reflection=document.createElement('span');
    reflection.className='card-reflection';
    reflection.setAttribute('aria-hidden','true');

    card.append(shell,txt,arrow,reflection);
    card.addEventListener('click',()=>{
      if(stage?.dataset.justDragged)return;
      const closeToSelected=Math.round(activeValue)===i && Math.abs(activeValue-i)<.18;
      if(closeToSelected) location.href=p.isStudioCard ? (p.url || `portfolio.html?type=${mode}`) : window.yruzProjectUrl(p);
      else animateTo(i);
    });
    stage.appendChild(card);
    cards.push(card);
  });
  activeValue=0;
  current=0;
  renderCarousel(0);
}
function applyMode(newMode){
  mode=newMode;
  projects=carouselItems(mode);
  document.querySelectorAll('[data-home-mode]').forEach(btn=>{
    const on=btn.dataset.homeMode===mode;
    btn.classList.toggle('active',on);
    btn.setAttribute('aria-pressed',String(on));
  });
  updateLinks();
  mountCards();
}
mountCards();
updateLinks();
// Site Builder loads asynchronously and calls this when published content arrives.
window.yruzSetCarouselCards = function (config) {
  for (const kind of ['photo','video','graphisme']) {
    featuredCards[kind] = Array.isArray(config?.[kind]) ? config[kind].map(c=>({
      title:String(c.title||''),category:String(c.category||''),cover:String(c.cover?.url||''),
      link:String(c.link||''),enabled:c.enabled!==false
    })) : null;
  }
  applyMode(mode);
};

document.querySelectorAll('[data-home-mode]').forEach(btn=>btn.addEventListener('click',()=>applyMode(btn.dataset.homeMode)));
prevBtn?.addEventListener('click',()=>animateTo(current-1));
nextBtn?.addEventListener('click',()=>animateTo(current+1));
window.addEventListener('resize',()=>renderCarousel(activeValue),{passive:true});

if(timeline){
  timeline.setAttribute('role','slider');
  timeline.tabIndex=0;
  const positionFromEvent=e=>{
    const r=timeline.getBoundingClientRect();
    const ratio=clamp((e.clientX-r.left)/Math.max(r.width,1),0,1);
    return ratio*Math.max(0,projects.length-1);
  };
  timeline.addEventListener('pointerdown',e=>{
    if(e.button!==0 && e.pointerType==='mouse')return;
    stopAnimation();
    stopDialInertia();
    dragDial={id:e.pointerId,lastX:e.clientX,lastTime:performance.now(),velocity:0,lastValue:activeValue};
    timeline.setPointerCapture(e.pointerId);
    timeline.classList.add('is-grabbing');
    const value=positionFromEvent(e);
    dragDial.lastValue=value;
    renderCarousel(value);
  });
  timeline.addEventListener('pointermove',e=>{
    if(!dragDial || e.pointerId!==dragDial.id)return;
    const now=performance.now();
    const dt=Math.max(now-dragDial.lastTime,16);
    const value=positionFromEvent(e);
    dragDial.velocity=(value-dragDial.lastValue)/dt;
    dragDial.lastX=e.clientX;
    dragDial.lastTime=now;
    dragDial.lastValue=value;
    renderCarousel(value);
  });
  const finishDial=e=>{
    if(!dragDial || e.pointerId!==dragDial.id)return;
    const velocity=dragDial.velocity;
    dragDial=null;
    timeline.classList.remove('is-grabbing');
    if(e.type==='pointercancel'){animateTo(Math.round(activeValue));return;}
    let position=activeValue;
    let momentum=velocity*170;
    const max=Math.max(0,projects.length-1);
    const step=()=>{
      momentum*=.88;
      position=clamp(position+momentum,0,max);
      renderCarousel(position);
      if(Math.abs(momentum)>.003){dialInertiaFrame=requestAnimationFrame(step);}
      else{dialInertiaFrame=0;animateTo(Math.round(position),{duration:340});}
    };
    if(Math.abs(momentum)>.003) step();
    else animateTo(Math.round(activeValue),{duration:300});
  };
  timeline.addEventListener('pointerup',finishDial);
  timeline.addEventListener('pointercancel',finishDial);
  timeline.addEventListener('wheel',e=>{
    if(e.ctrlKey)return;
    e.preventDefault();
    const now=performance.now();
    if(now-lastWheel<180)return;
    lastWheel=now;
    animateTo(current + ((e.deltaY+e.deltaX)>0?1:-1),{duration:340});
  },{passive:false});
  timeline.addEventListener('keydown',e=>{
    if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;
    e.preventDefault();
    if(e.key==='Home')animateTo(0,{duration:360});
    else if(e.key==='End')animateTo(projects.length-1,{duration:360});
    else animateTo(current + (e.key==='ArrowRight'?1:-1),{duration:300});
  });
}

if(stage){
  stage.addEventListener('pointerdown',e=>{
    if(e.pointerType==='mouse' && e.button!==0)return;
    dragging={x:e.clientX,y:e.clientY,id:e.pointerId};
  });
  stage.addEventListener('pointerup',e=>{
    if(!dragging || dragging.id!==e.pointerId)return;
    const dx=e.clientX-dragging.x, dy=e.clientY-dragging.y;
    dragging=null;
    if(Math.abs(dx)>40 && Math.abs(dx)>Math.abs(dy)*1.15){
      stage.dataset.justDragged='yes';
      animateTo(current + (dx<0?1:-1),{duration:340});
      setTimeout(()=>delete stage.dataset.justDragged,160);
    }
  });
  stage.addEventListener('pointercancel',()=>dragging=null);
  stage.addEventListener('click',e=>{ if(stage.dataset.justDragged){ e.preventDefault(); e.stopPropagation(); } },true);
  stage.addEventListener('keydown',e=>{
    if(e.key==='ArrowLeft' || e.key==='ArrowRight'){
      e.preventDefault();
      animateTo(current + (e.key==='ArrowRight'?1:-1),{duration:300});
    }
  });
  if(window.matchMedia('(hover:hover) and (pointer:fine)').matches){
    stage.addEventListener('pointermove',e=>{
      const card=e.target.closest('.floating-card.is-current');
      if(!card)return;
      const r=card.getBoundingClientRect();
      card.style.setProperty('--glare-x',`${Math.round((e.clientX-r.left)/r.width*100)}%`);
      card.style.setProperty('--glare-y',`${Math.round((e.clientY-r.top)/r.height*100)}%`);
    });
  }
}

const toggle=document.querySelector('.mobile-toggle');
if(toggle){
  toggle.onclick=()=>{
    const nav=document.getElementById('nav');
    const isOpen=nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded',String(isOpen));
  };
}
document.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',()=>{
  document.getElementById('nav')?.classList.remove('open');
  toggle?.setAttribute('aria-expanded','false');
}));
const contactForm=document.getElementById('contactForm');
if(contactForm){
  contactForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    const data=new FormData(e.currentTarget);
    const subject=`Demande de devis — ${data.get('type')}`;
    const body=`Bonjour,\n\nJe m'appelle ${data.get('nom')}.\nMon adresse e-mail : ${data.get('email')}\n\nProjet : ${data.get('type')}\n\n${data.get('message')}\n\nCordialement,\n${data.get('nom')}`;
    location.href=`mailto:${window.YRUZ_SITE_CONFIG?.contact_email || 'contact@yruzphoto.fr'}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}
