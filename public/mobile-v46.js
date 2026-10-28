/* YRUZPHOTO V46 — menu tactile, actif uniquement sur smartphone.
   Capture l'evenement avant les anciennes ecoutes, afin d'eviter un double toggle
   sur les pages Portfolio et Projet. Aucun comportement ajoute au bureau. */
(() => {
  'use strict';
  const mobile = window.matchMedia('(max-width: 767px)');
  const toggle = document.querySelector('#header .mobile-toggle');
  const nav = document.getElementById('nav');
  if (!toggle || !nav) return;

  toggle.setAttribute('aria-controls', 'nav');
  const close = () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Ouvrir le menu');
  };
  toggle.addEventListener('click', event => {
    if (!mobile.matches) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const isOpen = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Fermer le menu' : 'Ouvrir le menu');
  }, true);
  nav.addEventListener('click', event => {
    if (mobile.matches && event.target.closest('a')) close();
  });
  document.addEventListener('keydown', event => {
    if (mobile.matches && event.key === 'Escape') { close(); toggle.focus(); }
  });
  document.addEventListener('click', event => {
    if (mobile.matches && nav.classList.contains('open') &&
        !event.target.closest('#header')) close();
  });
  mobile.addEventListener?.('change', close);
  window.addEventListener('orientationchange', () => {
    if (mobile.matches && typeof window.renderCarousel === 'function') {
      requestAnimationFrame(() => window.renderCarousel());
    }
  });
})();
