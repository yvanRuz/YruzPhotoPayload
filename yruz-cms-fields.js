// YRUZPHOTO — gestion dynamique des champs additionnels Payload.
// N'écrase jamais les textes quand un champ CMS est vide.
(() => {
  const config = window.YRUZ_SITE_CONFIG || {};
  const text = (selector, value) => {
    if (typeof value !== 'string' || !value.trim()) return;
    document.querySelectorAll(selector).forEach(el => { el.textContent = value; });
  };
  const media = value => value && typeof value === 'object' && typeof value.url === 'string' ? value.url : '';
  const image = (selector, data) => {
    const url = media(data);
    if (!url) return;
    document.querySelectorAll(selector).forEach(el => { el.src = url; });
  };
  // URL autorisées : http(s), mailto, tel et URLs internes. Pas de javascript:.
  const safeUrl = value => {
    if (typeof value !== 'string') return '';
    const raw = value.trim();
    if (raw.startsWith('/') && !raw.startsWith('//')) return raw;
    if (raw.startsWith('#')) return raw;
    try {const parsed = new URL(raw); if (['https:', 'http:', 'mailto:', 'tel:'].includes(parsed.protocol)) return raw;} catch {}
    return '';
  };
  const link = (selector, value, label) => {
    const url = safeUrl(value);
    document.querySelectorAll(selector).forEach(el => {
      if (url) el.setAttribute('href', url);
      if (label && typeof label === 'string') el.textContent = label;
    });
  };
  text('.nav-cta', config.header_cta_label);
  link('.nav-cta',config.header_cta_url);
  if (config.instagram) link('a[href*="instagram.com"]',config.instagram);
  text('.nav-instagram',config.instagram_label);
  text('.catalog-heading p',config.portfolio_intro);
  const cols = Array.from(document.querySelectorAll('.service-column'));
  [['services_photo_image','services_photo_caption'],['services_video_image','services_video_caption'],['services_design_image','services_design_caption']].forEach(([mediaKey,captionKey],i) => {
    if (!cols[i]) return;
    const img=cols[i].querySelector('.service-visual img');
    const url=media(config[mediaKey]);
    if(img && url) img.src=url;
    const caption=cols[i].querySelector('.service-caption');
    if(caption && typeof config[captionKey]==='string' && config[captionKey].trim()) caption.textContent=config[captionKey];
  });
  for (let i=1;i<=3;i++) {
    const node=document.querySelectorAll('.story-panel')[i-1];
    if(!node) continue;
    const heading=node.querySelector('.story-copy h2');
    const para=node.querySelector('.story-copy p');
    const img=node.querySelector('.story-photo img');
    if(heading && config['story_title_'+i]) heading.textContent=config['story_title_'+i];
    if(para && config['story_text_'+i]) para.textContent=config['story_text_'+i];
    const url=media(config['story_image_'+i]);
    if(img && url) img.src=url;
  }
  text('.follow-action',config.contact_instagram_cta);
  if(config.seo_home_title && document.querySelector('#accueil')) document.title=config.seo_home_title;
  if(config.seo_home_description && document.querySelector('#accueil')) {
    const meta=document.querySelector('meta[name="description"]');
    if(meta) meta.content=config.seo_home_description;
  }
})();
