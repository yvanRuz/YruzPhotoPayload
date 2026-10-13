(()=>{
 const s=window.YRUZ_SITE_CONFIG;
 if(!s)return;
 const setText=(selector,value)=>{const el=document.querySelector(selector);if(el&&typeof value==='string')el.textContent=value;};
 if(document.querySelector('#accueil')){
  setText('.hero-inner p',s.hero_subtitle);
  setText('#portfolio .section-top h2',s.works_title);
  setText('#portfolio .section-top p',s.works_description);
  setText('#services .section-top h2',s.services_title);
  setText('#services .section-top p',s.services_description);
  setText('#contact h2',s.contact_title);
  setText('#contact > div > p',s.contact_intro);
 }
 if(document.querySelector('.contact-page')){
  setText('.contact-page-intro p',s.contact_intro);
  setText('.contact h2',s.contact_title);
 }
 if(s.contact_email){
  document.querySelectorAll('a[href^="mailto:"]').forEach(a=>{a.href='mailto:'+encodeURIComponent(s.contact_email);if(a.classList.contains('email'))a.textContent=s.contact_email+' ↗';});
 }
 if(s.instagram)document.querySelectorAll('a[href="https://www.instagram.com/"]').forEach(a=>a.href=s.instagram);
})();
