/* YRUZPHOTO V50 — lightweight photo enlargement and non-destructive framing.
 * Works with asynchronously rendered carousels. Does not alter desktop layout. */
(() => {
  'use strict';
  const safe = raw => {
    const value = String(raw || '').trim();
    return /^(https?:\/\/[^\s<>"'`]+|\/?(?:api\/media|assets)\/[^\s<>"'`]+)$/i.test(value) ? value : '';
  };
  const selectors = [
    '#stage .card-shell img', '#catalogGrid .catalog-card img',
    '.project-cover img', '.cms-carousel-open img', '.cms-photo-grid img',
    '.cms-image-text-media img', '.cms-project-cover img',
    '.service-visual img', '.story-photo img', '.gallery-image img',
    '.pd-card img', '.pd-detail img'
  ].join(',');
  let frames = {}, lastFocus = null, current = null, scheduled = false;
  const viewer = document.createElement('dialog');
  viewer.id = 'yruz-photo-viewer';
  viewer.setAttribute('aria-label', 'Photographie en grand');
  viewer.innerHTML = `<div class="ypv-bar"><span>YRUZPHOTO / PHOTOGRAPHIE</span><button type="button" class="ypv-close" aria-label="Fermer la photographie">✕</button></div><button type="button" class="ypv-prev" aria-label="Photographie précédente">←</button><figure><img alt=""><figcaption></figcaption></figure><button type="button" class="ypv-next" aria-label="Photographie suivante">→</button>`;
  document.body.appendChild(viewer);
  const image = viewer.querySelector('figure img');
  const caption = viewer.querySelector('figcaption');
  const getTargets = () => [...document.querySelectorAll(selectors)].filter(img => safe(img.getAttribute('src')) && img.getAttribute('src') !== '#');
  function applyFrame(img) {
    const url = img.getAttribute('src') || '';
    const frame = frames[url] || frames[img.src];
    if (!frame) {
      if (img.dataset.yruzFramed === 'yes') {
        img.style.objectPosition = '';
        img.style.objectFit = '';
        img.style.transform = '';
        delete img.dataset.yruzFramed;
      }
      return;
    }
    img.dataset.yruzFramed = 'yes';
    img.style.objectPosition = `${frame.x}% ${frame.y}%`;
    img.style.objectFit = frame.fit === 'contain' ? 'contain' : 'cover';
    const zoom = Math.max(1, Math.min(2, Number(frame.zoom) || 1));
    img.style.transform = `scale(${zoom})`;
  }
  function open(url, alt) {
    const src = safe(url); if (!src) return;
    if (!viewer.open) lastFocus = document.activeElement;
    current = src;
    image.src = src;
    image.alt = alt || 'Photographie YRUZPHOTO';
    // The original photograph is always displayed in full: crop affects only previews.
    image.style.objectFit = 'contain';
    caption.textContent = image.alt;
    if (!viewer.open) viewer.showModal();
  }
  function navigate(dir) {
    const all = getTargets().map(img => ({url:img.getAttribute('src'),alt:img.alt}));
    const filtered = all.filter(x => safe(x.url));
    if (!filtered.length) return;
    const index = filtered.findIndex(x => x.url === current);
    const next = filtered[(index + dir + filtered.length) % filtered.length];
    open(next.url, next.alt);
  }
  function attach() {
    scheduled = false;
    const hero = document.querySelector('.hero');
    const heroBg = document.getElementById('heroBg');
    if (hero && heroBg && !hero.querySelector('.yruz-hero-enlarge')) {
      const badge = document.createElement('span');
      badge.className = 'yruz-photo-enlarge yruz-hero-enlarge';
      badge.setAttribute('role','button');badge.tabIndex=0;
      badge.setAttribute('aria-label','Voir la photographie d’accueil en grand');badge.title='Agrandir le fond d’accueil';badge.textContent='⛶';
      const show = event => {
        event.preventDefault();event.stopPropagation();
        const background = heroBg.style.backgroundImage || getComputedStyle(heroBg).backgroundImage;
        const match = background.match(/^url\(["']?(.*?)["']?\)$/);
        if (match && safe(match[1])) open(match[1],'Photographie d’accueil — YRUZPHOTO');
      };
      badge.addEventListener('click',show);
      badge.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' ')show(event)});
      hero.appendChild(badge);
    }
    for (const img of getTargets()) {
      applyFrame(img);
      if (img.dataset.yruzZoomAttached === 'yes') continue;
      const box = img.parentElement;
      if (!box || box.closest('.mans-filmstrip, .cms-carousel-thumbs, .pd-detail-thumbs')) continue;
      img.dataset.yruzZoomAttached = 'yes';
      // A span avoids nesting a button within interactive portfolio cards.
      const button = document.createElement('span');
      button.className = 'yruz-photo-enlarge';
      button.setAttribute('role', 'button');
      button.setAttribute('tabindex', '0');
      button.setAttribute('aria-label', 'Voir la photographie en grand');
      button.setAttribute('title', 'Agrandir la photographie');
      button.textContent = '⛶';
      if (getComputedStyle(box).position === 'static') box.style.position = 'relative';
      box.appendChild(button);
      const trigger = event => {
        event.preventDefault(); event.stopPropagation(); event.stopImmediatePropagation?.();
        open(img.getAttribute('src'), img.alt);
      };
      button.addEventListener('click', trigger);
      button.addEventListener('keydown', event => {if (event.key === 'Enter' || event.key === ' ') trigger(event)});
    }
  }
  function schedule() { if (scheduled) return; scheduled = true; requestAnimationFrame(attach); }
  viewer.querySelector('.ypv-close').addEventListener('click', () => viewer.close());
  viewer.querySelector('.ypv-prev').addEventListener('click', () => navigate(-1));
  viewer.querySelector('.ypv-next').addEventListener('click', () => navigate(1));
  viewer.addEventListener('click', e => {if (e.target === viewer) viewer.close()});
  viewer.addEventListener('close', () => {image.removeAttribute('src');lastFocus?.focus?.()});
  document.addEventListener('keydown', e => {if (!viewer.open) return;if (e.key === 'ArrowLeft') navigate(-1);if (e.key === 'ArrowRight') navigate(1)});
  const observer = new MutationObserver(changes => {
    if (changes.some(change => change.type === 'childList' || (change.type === 'attributes' && change.attributeName === 'src'))) schedule();
  });
  observer.observe(document.body, {childList:true,subtree:true,attributes:true,attributeFilter:['src']});
  fetch('/cms-content?page=accueil&framesOnly=1', {cache:'no-store'})
    .then(response => response.ok ? response.json() : null)
    .then(data => {if (data?.mediaFrames && typeof data.mediaFrames === 'object') frames = data.mediaFrames; schedule()})
    .catch(() => schedule());
  schedule();
})();
