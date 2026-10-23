(()=>{
 const s=window.YRUZ_SITE_CONFIG;
 if(!s)return;
 const text=(sel,val)=>{if(typeof val!=='string'||!val.trim())return;document.querySelectorAll(sel).forEach(el=>el.textContent=val)};
 const image=(sel,url)=>{if(typeof url!=='string'||!/^https?:\/\//.test(url))return;document.querySelectorAll(sel).forEach(el=>{el.src=url;el.loading='lazy'})};
 const urlSafe=url=>{
   if(typeof url!=='string'||!url.trim())return null;
   const v=url.trim();
   if(/^(?:https?:\/\/|mailto:)/i.test(v))return v;
   if(/^(?:\/|\.\/?|#)[^\\<>"'`]*$/.test(v))return v;
   if(/^(?:index|portfolio|projet|tarifs|equipement|contact)\.html(?:[?#][^<>"'`]*)?$/.test(v))return v;
   return null;
 };
 const link=(sel,url,label)=>{document.querySelectorAll(sel).forEach(el=>{
   const safe=urlSafe(url);if(safe)el.setAttribute('href',safe);
   if(typeof label==='string'&&label.trim())el.textContent=label;
 })};
 // Accueil et portfolio
 text('.hero-inner p',s.hero_subtitle);
 text('#portfolio .section-top h2',s.works_title);
 text('#portfolio .section-top p',s.works_description);
 text('#services .section-top h2',s.services_title);
 text('#services .section-top p',s.services_description);
 text('.catalog-heading p',s.portfolio_intro);
 link('.hero-actions .btn.light',s.home_cta_url,s.home_cta_title);
 link('.hero-actions .btn.outline',s.home_secondary_url,s.home_secondary_title);
 // Les 3 services, sur accueil et page dédiée
 for(const type of ['photo','video','design']){
   const idx={photo:1,video:2,design:3}[type];
   const scope='.services-board .service-column:nth-child('+idx+')';
   image(scope+' .service-visual img',s['service_'+type+'_image_url']);
   text(scope+' .service-caption',s['service_'+type+'_caption']);
   link(scope+' .service-link',s['service_'+type+'_cta_url'],s['service_'+type+'_cta_label']);
 }
 // Histoire: l'animation horizontale n'est pas modifiée
 for(let i=1;i<=3;i++){
   const scope='.story-panel:nth-child('+i+')';
   image(scope+' .story-photo img',s['story_image_'+i+'_url']);
   text(scope+' .story-copy h2',s['story_title_'+i]);
   text(scope+' .story-copy p',s['story_text_'+i]);
 }
 // Boutons, navigation et réseaux
 const nav={nav_home_label:'index.html',nav_portfolio_label:'portfolio.html',nav_services_label:'tarifs.html',nav_equipment_label:'equipement.html',nav_contact_label:'contact.html'};
 for(const [key,target] of Object.entries(nav))text('header nav a[href="'+target+'"]',s[key]);
 link('header nav a.nav-cta',s.contact_button_url,s.contact_button_label);
 link('main .contact .email',null,null);
 text('#contact h2',s.contact_title);
 text('#contact > div > p',s.contact_intro);
 text('.contact-page-intro p',s.contact_intro);
 if(typeof s.contact_email==='string'&&s.contact_email.trim()){
   document.querySelectorAll('a[href^="mailto:"]').forEach(el=>{el.href='mailto:'+s.contact_email.trim();if(el.classList.contains('email'))el.textContent=s.contact_email+' ↗'})
 }
 const instagram=urlSafe(s.instagram);
 if(instagram)document.querySelectorAll('a[href*="instagram.com/"]').forEach(el=>el.href=instagram);
 link('.follow-action',s.contact_action_url,s.contact_action_label);
 // SEO pour la page d'accueil; la balise description doit exister pour être éditée
 if(document.getElementById('accueil')){
   if(s.seo_title)document.title=s.seo_title;
   const meta=document.querySelector('meta[name="description"]');if(meta&&s.seo_description)meta.content=s.seo_description;
 }
})();
