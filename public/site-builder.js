/* YRUZPHOTO Site Builder: renders published Payload sections on the existing site. */
(() => {
  const escapeHtml = (value) => String(value == null ? '' : value).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const safeLink = (input) => {
    const url = String(input || '').trim();
    if (/^(https?:\/\/[^\s<>"'`]+|mailto:[^\s<>"'`]+|\/?(?:index|portfolio|projet|tarifs|equipement|contact)\.html(?:[?#][^\s<>"'`]*)?|#[\w-]+|\/)$/i.test(url)) return url;
    return '';
  };
  const safeImage = (input) => {
    const url = String(input || '').trim();
    return /^(https?:\/\/[^\s<>"'`]+|\/api\/media\/[^\s<>"'`]+|\/assets\/[^\s<>"'`]+|assets\/[^\s<>"'`]+)$/i.test(url) ? url : '';
  };
  const img = (media, alt = '') => {
    const src = safeImage(media?.url);
    if (!src) return '';
    return `<img loading="lazy" src="${escapeHtml(src)}" alt="${escapeHtml(media?.alt || alt)}">`;
  };
  const heading = (title, desc = '') => title || desc ? `<div class="cms-section-heading">${title ? `<h2>${escapeHtml(title)}</h2>` : ''}${desc ? `<p>${escapeHtml(desc)}</p>` : ''}</div>` : '';
  const button = (label, link, secondary = false) => {
    const url = safeLink(link);
    if (!label || !url) return '';
    const ext = /^https?:\/\//.test(url);
    return `<a class="cms-cta ${secondary ? 'cms-cta-secondary' : ''}" href="${escapeHtml(url)}"${ext ? ' target="_blank" rel="noopener noreferrer"' : ''}>${escapeHtml(label)} <span aria-hidden="true">\u2197</span></a>`;
  };
  const renderSection = (section, projects) => {
    switch (section.type) {
      case 'texte': return `<section class="cms-block cms-block-text cms-align-${section.align === 'center' ? 'center' : 'left'}">${section.eyebrow ? `<span class="cms-eyebrow">${escapeHtml(section.eyebrow)}</span>` : ''}${heading(section.title, section.body)}${button(section.buttonLabel, section.buttonUrl)}</section>`;
      case 'photoTexte': {
        if (!safeImage(section.image?.url)) return '';
        return `<section class="cms-block cms-image-text ${section.placement === 'right' ? 'cms-image-right' : ''}"><div class="cms-image-text-media">${img(section.image, section.title)}${section.caption ? `<span>${escapeHtml(section.caption)}</span>` : ''}</div><div class="cms-image-text-copy">${heading(section.title, section.description)}${button(section.buttonLabel, section.buttonUrl)}</div></section>`;
      }
      case 'carrouselPhotos': {
        const slides = (section.slides || []).filter(item => safeImage(item.image?.url));
        if (!slides.length) return '';
        return `<section class="cms-block cms-carousel-block">${heading(section.title, section.description)}<div class="cms-photo-carousel" data-cms-carousel><div class="cms-carousel-main"><a class="cms-carousel-open" target="_blank" rel="noopener noreferrer" href="${escapeHtml(safeLink(slides[0].link) || safeImage(slides[0].image.url))}">${img(slides[0].image, section.title)}<span class="cms-open-badge">AGRANDIR \u2197</span></a><button class="cms-nav-arrow cms-arrow-prev" type="button" aria-label="Photo precedente">\u2190</button><button class="cms-nav-arrow cms-arrow-next" type="button" aria-label="Photo suivante">\u2192</button></div><div class="cms-carousel-meta"><span class="cms-slide-counter">01 / ${String(slides.length).padStart(2, '0')}</span><span class="cms-slide-caption">${escapeHtml(slides[0].caption || '')}</span></div><div class="cms-carousel-thumbs">${slides.map((slide, i) => `<button type="button" aria-label="Afficher la photo ${i + 1}" aria-current="${i === 0}" data-cms-slide="${i}" data-cms-url="${escapeHtml(safeImage(slide.image.url))}" data-cms-alt="${escapeHtml(slide.image.alt || '')}" data-cms-caption="${escapeHtml(slide.caption || '')}" data-cms-link="${escapeHtml(safeLink(slide.link))}">${img(slide.image)}</button>`).join('')}</div></div></section>`;
      }
      case 'grillePhotos': {
        const photos = (section.photos || []).filter(item => safeImage(item.image?.url));
        if (!photos.length) return '';
        const cols = ['2', '3', '4'].includes(section.columns) ? section.columns : '3';
        return `<section class="cms-block cms-grid-block">${heading(section.title)}<div class="cms-photo-grid" style="--cms-cols:${cols}">${photos.map(item => `<a class="cms-photo-grid-item" href="${escapeHtml(safeImage(item.image.url))}" target="_blank" rel="noopener noreferrer">${img(item.image, item.caption)}${item.caption ? `<span>${escapeHtml(item.caption)}</span>` : ''}</a>`).join('')}</div></section>`;
      }
      case 'carrouselProjets': {
        let selected = (projects || []).filter(p => {
          if (!p) return false;
          const graphic = p.mode !== 'video' && /graphis|design|cr[eé]ation graphique|identit[eé] visuelle|branding/i.test(String(p.category || ''));
          return section.mode === 'all' || (section.mode === 'graphisme' ? graphic : section.mode === 'photo' ? p.mode === 'photo' && !graphic : p.mode === 'video');
        });
        if (section.selection === 'manual') {
          const ids = section.chosenSlugs || [];
          selected = ids.map(id => selected.find(p => p.id === id)).filter(Boolean);
        }
        selected = selected.slice(0, Math.max(1, Math.min(Number(section.limit) || 8, 30)));
        if (!selected.length) return '';
        return `<section class="cms-block cms-projects-block">${heading(section.title)}<div class="cms-projects-scroller" tabindex="0" aria-label="Projets a faire defiler">${selected.map(p => `<a class="cms-project-card" href="projet.html?id=${encodeURIComponent(p.id)}"><span class="cms-project-cover">${img({url:p.cover, alt:p.title})}</span><span class="cms-project-meta">${escapeHtml(p.category || (p.mode === 'photo' ? 'PHOTO' : 'VIDEO'))}</span><strong>${escapeHtml(p.title)}</strong><span class="cms-project-go" aria-hidden="true">\u2197</span></a>`).join('')}</div><div class="cms-project-controls"><button type="button" data-cms-project-dir="-1" aria-label="Faire defiler a gauche">\u2190</button><span>FAIRE DEFILER LES REPORTAGES</span><button type="button" data-cms-project-dir="1" aria-label="Faire defiler a droite">\u2192</button></div></section>`;
      }
      case 'boutons': {
        const links = (section.buttons || []).map(b => button(b.label, b.url, b.style === 'secondary')).filter(Boolean);
        if (!links.length) return '';
        return `<section class="cms-block cms-button-block">${heading(section.title)}<div class="cms-button-row">${links.join('')}</div></section>`;
      }
      default: return '';
    }
  };
  const replaceText = (selector, text) => {
    if (typeof text !== 'string' || !text.trim()) return;
    const el = document.querySelector(selector); if (el) el.textContent = text;
  };
  const updateButton = (selector, label, url) => {
    const el = document.querySelector(selector); if (!el) return;
    const safe = safeLink(url);
    if (safe) el.href = safe;
    if (label) el.textContent = label;
  };
  const pageMap = {
    accueil: { title: '.hero-inner h1', intro: '.hero-inner p' },
    portfolio: { title: '.catalog-heading h1', intro: '.catalog-heading p' },
    services: { title: '.services-heading h1', intro: '.services-heading p' },
    histoire: { title: '.story-intro .story-copy h2', intro: '.story-intro .story-copy p' },
    contact: { title: 'main h1', intro: 'main .contact-page-intro p' },
    equipement: { title: 'main h1', intro: 'main .equip-intro p' },
  };
  const mount = pageKey => {
    const existing = document.querySelector(`[data-cms-page="${pageKey}"]`);
    if (existing) return existing;
    let anchor = null, method = 'afterend';
    if (pageKey === 'accueil') anchor = document.querySelector('section.hero');
    else if (pageKey === 'histoire') anchor = document.querySelector('section.story');
    else if (pageKey === 'portfolio') anchor = document.querySelector('.catalog-heading');
    else if (pageKey === 'services') anchor = document.querySelector('.services-hero');
    else if (pageKey === 'contact') { anchor = document.querySelector('main'); method = 'beforeend'; }
    else if (pageKey === 'equipement') { anchor = document.querySelector('main'); method = 'beforeend'; }
    if (!anchor) return null;
    const wrapper = document.createElement('div');
    wrapper.className = 'cms-sections'; wrapper.dataset.cmsPage = pageKey;
    wrapper.setAttribute('aria-label', `Sections ${pageKey}`);
    anchor.insertAdjacentElement(method, wrapper);
    return wrapper;
  };
  const applyPage = (key, data, projects) => {
    if (!data) return;
    const selectors = pageMap[key];
    if (selectors) { replaceText(selectors.title, data.heading); replaceText(selectors.intro, data.intro); }
    const bottomSelector = { portfolio: '.catalog-bottom a', services: '.services-cta a', equipement: '.equip-bottom a' }[key];
    if (bottomSelector) updateButton(bottomSelector, data.bottomButtonLabel, data.bottomButtonUrl);
    if (key === 'accueil') {
      updateButton('.hero-actions .btn.light', data.mainButtonLabel, data.mainButtonUrl);
      updateButton('.hero-actions .btn.outline', data.secondButtonLabel, data.secondButtonUrl);
      const urls = (data.heroImages || []).map(item => safeImage(item?.url)).filter(Boolean);
      if (urls.length && typeof window.yruzSetHeroImages === 'function') window.yruzSetHeroImages(urls);
      if (typeof window.yruzSetCarouselCards === 'function') window.yruzSetCarouselCards(data.featuredCards || {});
    }
    if (key === 'services') {
      (data.serviceCards || []).forEach((item, index) => {
        const scope = `.services-board .service-column:nth-child(${index + 1})`;
        const photo = safeImage(item?.image?.url);
        const img = document.querySelector(`${scope} .service-visual img`);
        if (img && photo) { img.src = photo; img.alt = item.image.alt || img.alt; }
        replaceText(`${scope} .service-caption`, item.caption);
        updateButton(`${scope} .service-link`, item.buttonLabel, item.buttonUrl);
      });
    }
    if (key === 'histoire') {
      (data.storyCards || []).forEach((item, index) => {
        const scope = `.story-panel:nth-child(${index + 1})`;
        const photo = safeImage(item?.image?.url);
        const img = document.querySelector(`${scope} .story-photo img`);
        if (img && photo) { img.src = photo; img.alt = item.image.alt || img.alt; }
        replaceText(`${scope} .story-copy h2`, item.title);
        replaceText(`${scope} .story-copy p`, item.body);
      });
    }
    const html = (data.sections || []).map(section => renderSection(section, projects)).join('');
    const wrapper = html ? mount(key) : null;
    if (wrapper) { wrapper.innerHTML = html; wrapper.querySelectorAll('[data-cms-carousel]').forEach(initCarousel); wrapper.querySelectorAll('.cms-projects-block').forEach(initProjectCarousel); }
    if (key === 'portfolio') {
      const grid = document.getElementById('catalogGrid');
      if (grid && data.universeSections) {
        ['photo','video','graphisme'].forEach(kind => {
          let zone = document.querySelector(`[data-cms-portfolio-kind="${kind}"]`);
          if (!zone) {
            zone = document.createElement('div');zone.className='cms-sections cms-portfolio-kind';
            zone.dataset.cmsPortfolioKind=kind;
            grid.insertAdjacentElement('afterend', zone);
          }
          zone.innerHTML = (data.universeSections[kind] || []).map(block=>renderSection(block,projects)).join('');
          zone.querySelectorAll('[data-cms-carousel]').forEach(initCarousel);
          zone.querySelectorAll('.cms-projects-block').forEach(initProjectCarousel);
        });
        const sync = () => {
          const kind = new URLSearchParams(location.search).get('type') || 'photo';
          document.querySelectorAll('[data-cms-portfolio-kind]').forEach(el => {el.hidden = el.dataset.cmsPortfolioKind !== kind;});
        };
        document.querySelectorAll('[data-filter]').forEach(btn => btn.addEventListener('click',()=>setTimeout(sync,0)));
        window.addEventListener('popstate',sync);
        sync();
      }
    }
  };
  const initCarousel = root => {
    const thumbs = [...root.querySelectorAll('[data-cms-slide]')];
    const link = root.querySelector('.cms-carousel-open');
    const mainImg = link.querySelector('img');
    const counter = root.querySelector('.cms-slide-counter');
    const caption = root.querySelector('.cms-slide-caption');
    let current = 0, pointerX = null;
    const display = idx => {
      current = (idx + thumbs.length) % thumbs.length;
      const thumb = thumbs[current];
      mainImg.src = thumb.dataset.cmsUrl;
      mainImg.alt = thumb.dataset.cmsAlt;
      caption.textContent = thumb.dataset.cmsCaption;
      link.href = thumb.dataset.cmsLink || thumb.dataset.cmsUrl;
      counter.textContent = `${String(current + 1).padStart(2, '0')} / ${String(thumbs.length).padStart(2, '0')}`;
      thumbs.forEach((btn, index) => btn.setAttribute('aria-current', String(index === current)));
      thumb.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    };
    root.querySelector('.cms-arrow-prev').addEventListener('click', () => display(current - 1));
    root.querySelector('.cms-arrow-next').addEventListener('click', () => display(current + 1));
    thumbs.forEach((thumb, index) => thumb.addEventListener('click', () => display(index)));
    const main = root.querySelector('.cms-carousel-main');
    main.addEventListener('pointerdown', event => { pointerX = event.clientX; });
    main.addEventListener('pointerup', event => {
      if (pointerX === null) return;
      const delta = event.clientX - pointerX; pointerX = null;
      if (Math.abs(delta) > 55) { display(current + (delta < 0 ? 1 : -1)); root.dataset.swiped = 'true'; setTimeout(() => delete root.dataset.swiped, 250); }
    });
    link.addEventListener('click', event => { if (root.dataset.swiped) event.preventDefault(); });
    root.addEventListener('keydown', event => { if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); display(current + (event.key === 'ArrowRight' ? 1 : -1)); } });
  };
  const initProjectCarousel = root => {
    const track = root.querySelector('.cms-projects-scroller');
    root.querySelectorAll('[data-cms-project-dir]').forEach(btn => btn.addEventListener('click', () => {
      const direction = Number(btn.dataset.cmsProjectDir) || 1;
      track.scrollBy({ left: direction * Math.max(260, track.clientWidth * .8), behavior: 'smooth' });
    }));
  };
  const applyNavigation = nav => {
    if (!nav) return;
    const root = document.querySelector('header nav'); if (!root) return;
    if (Array.isArray(nav.links) && nav.links.length) {
      const old = [...root.querySelectorAll('a')].filter(a => !a.classList.contains('nav-cta') && !a.classList.contains('nav-instagram'));
      const before = old[0] || root.querySelector('.nav-cta');
      const fragment = document.createDocumentFragment();
      const currentPath = location.pathname.split('/').pop() || 'index.html';
      nav.links.forEach(item => {
        const href = safeLink(item.url); if (!href || !item.label) return;
        const a = document.createElement('a'); a.href = href; a.textContent = item.label;
        if (href.split(/[?#]/)[0] === currentPath || (currentPath === 'index.html' && href === 'index.html#accueil')) a.classList.add('active');
        if (item.newTab) { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
        fragment.append(a);
      });
      root.insertBefore(fragment, before);
      old.forEach(a => a.remove());
    }
    updateButton('header nav .nav-cta', nav.ctaLabel, nav.ctaUrl);
    updateButton('footer .footer-contact', nav.footerContactLabel, nav.footerContactUrl);
    const instagram = safeLink(nav.instagramUrl);
    if (instagram) document.querySelectorAll('a[href*="instagram.com/"]').forEach(a => { a.href = instagram; });
  };
  const currentFile = location.pathname.split('/').pop() || 'index.html';
  const currentPage = ({ 'index.html': 'accueil', 'portfolio.html': 'portfolio', 'tarifs.html': 'services', 'contact.html': 'contact', 'equipement.html': 'equipement' })[currentFile];
  const pages = currentPage === 'accueil' ? ['accueil', 'histoire', 'services'] : currentPage ? [currentPage] : ['portfolio'];
  const load = async (key, first) => {
    try {
      const response = await fetch(`/cms-content?page=${encodeURIComponent(key)}`, { cache: 'no-store' });
      if (!response.ok) return;
      const data = await response.json();
      if (first) applyNavigation(data.navigation);
      applyPage(key, data.page, data.projects || []);
    } catch (error) { console.warn('YRUZPHOTO: sections CMS non disponibles', error); }
  };
  pages.forEach((page, index) => load(page, index === 0));
})();
