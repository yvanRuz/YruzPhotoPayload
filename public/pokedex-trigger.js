/* Only display the discreet footer Easter egg when the Studio page is published. */
(()=>{
 const link=document.querySelector('.pokedex-secret-trigger');if(!link)return;
 fetch('/cms-content?page=pokedex',{cache:'no-store'})
  .then(response=>response.ok?response.json():null)
  .then(data=>{if(data&&data.page===null)link.remove()})
  .catch(()=>{});
})();
