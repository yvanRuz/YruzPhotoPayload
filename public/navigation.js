(() => {
 const header=document.getElementById('header');
 if(!header)return;
 const update=()=>header.classList.toggle('is-scrolled',window.scrollY>30);
 window.addEventListener('scroll',update,{passive:true});update();
 const toggle=document.querySelector('.mobile-toggle');
 const nav=document.getElementById('nav');
 if(toggle&&nav&&!document.body.contains(document.getElementById('stage'))){
  toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open))});
 }
})();

(function(){
 const items=[...document.querySelectorAll('.reveal-section')];
 if(!items.length)return;
 if(!('IntersectionObserver' in window)){items.forEach(el=>el.classList.add('is-visible'));return}
 const io=new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
   if(entry.isIntersecting){entry.target.classList.add('is-visible');io.unobserve(entry.target)}
  });
 },{threshold:.16, rootMargin:'0px 0px -8% 0px'});
 items.forEach(el=>io.observe(el));
})();
