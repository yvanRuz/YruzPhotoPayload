/* V21 : micro-animations de titres, compatibles avec le scroll horizontal. */
(()=>{
 if(document.body.classList.contains('subpage'))return;
 const sections=[...document.querySelectorAll('.portfolio-section,.services,.testimonials,.contact,.follow-section')];
 sections.forEach(section=>{
  if(!section.querySelector(':scope > .ambient-lines')){
   const decoration=document.createElement('div');decoration.className='ambient-lines';decoration.setAttribute('aria-hidden','true');section.prepend(decoration);
  }
 });
 if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 const targets=[...document.querySelectorAll('.section-top .eyebrow,.section-top h2,.section-top p,.testimonials > .eyebrow,.testimonials > h2,.contact > div > .eyebrow,.contact > div > h2,.follow-section > .eyebrow,.follow-section > h2,.follow-section > p')];
 if(!('IntersectionObserver' in window))return;
 targets.forEach(el=>el.classList.add('yruz-text-reveal'));
 // Commencer avec les textes deja visibles, puis activer l'observateur.
 const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('yruz-text-visible');observer.unobserve(entry.target)}});
 },{threshold:.12,rootMargin:'0px 0px -7% 0px'});
 targets.forEach(el=>{if(el.getBoundingClientRect().top<window.innerHeight*.85){el.classList.add('yruz-text-visible')}else{observer.observe(el)}});
 document.body.classList.add('yruz-motion-ready');
})();
