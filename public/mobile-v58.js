/* YRUZPHOTO V58 : etiquette de progression du parcours tactile, mobile uniquement. */
(() => {
  'use strict';
  const mq = window.matchMedia('(max-width:767px)');
  const story = document.querySelector('#histoire');
  const viewport = story?.querySelector('.story-window');
  const panels = story?.querySelectorAll('.story-panel');
  const counter = story?.querySelector('#storyNumber');
  const hint = story?.querySelector('.story-progress-label');
  if (!viewport || !panels?.length) return;
  let ticking = false;
  function update() {
    ticking = false;
    if (!mq.matches) return;
    const index = Math.max(0, Math.min(panels.length-1,
      Math.round(viewport.scrollLeft / Math.max(1,viewport.clientWidth))));
    if (counter) counter.textContent = `${String(index+1).padStart(2,'0')} / ${String(panels.length).padStart(2,'0')}`;
    if (hint) hint.textContent = index === panels.length-1 ? 'FIN DU PARCOURS' : 'GLISSER POUR CONTINUER →';
  }
  viewport.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }, {passive:true});
  mq.addEventListener?.('change',update);
  window.addEventListener('resize',update, {passive:true});
  update();
})();
