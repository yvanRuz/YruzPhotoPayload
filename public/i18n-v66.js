/* YRUZPHOTO V66 — FR/EN public UI. Original text is always preserved. */
(() => {
  'use strict';
  const KEY='yruzphoto-language';
  let lang='fr';
  try { lang=localStorage.getItem(KEY)==='en'?'en':'fr'; } catch {}
  const pairs = [
    ['ACCUEIL','HOME'],['ÉQUIPEMENT','GEAR'],['MON ÉQUIPEMENT','MY GEAR'],['SERVICES','SERVICES'],['CONTACT','CONTACT'],['PORTFOLIO','PORTFOLIO'],['PHOTO','PHOTO'],['VIDÉO','VIDEO'],['GRAPHISME','DESIGN'],['DESIGN','DESIGN'],
    ['PARLONS DE VOTRE PROJET','LET’S TALK ABOUT YOUR PROJECT'],['↗   PARLONS DE VOTRE PROJET','↗   LET’S TALK ABOUT YOUR PROJECT'],['PARLONS DE VOTRE PROJET ↗','LET’S TALK ABOUT YOUR PROJECT ↗'],
    ['PHOTOGRAPHE & VIDÉASTE','PHOTOGRAPHER & FILMMAKER'],['Basé à Paris, passionné de Sport Automobile et de musique,','Based in Paris, passionate about motorsport and music,'],['je fais des photos et des vidéos pour capturer des émotions.','I create photos and films to capture emotions.'],
    ['MES TRAVAUX ↗','MY WORK ↗'],['MES TRAVAUX  ↗','MY WORK ↗'],['MES TRAVAUX','MY WORK'],['MON ÉQUIPEMENT  ↗','MY GEAR ↗'],['MON ÉQUIPEMENT ↗','MY GEAR ↗'],['DÉFILER ↓','SCROLL ↓'],
    ['YRUZPHOTO — MON HISTOIRE','YRUZPHOTO — MY STORY'],['01 — LE PARCOURS','01 — THE JOURNEY'],['DÉFILER POUR DÉCOUVRIR →','SCROLL TO DISCOVER →'],['01 / LE DÉBUT','01 / THE BEGINNING'],['CHAPITRE 01','CHAPTER 01'],['CHAPITRE 02 — LA PASSION','CHAPTER 02 — THE PASSION'],['CHAPITRE 03 — AUJOURD’HUI','CHAPTER 03 — TODAY'],['CHAPITRE 03 — AUJOURD\'HUI','CHAPTER 03 — TODAY'],
    ["TOUT PART D'UN REGARD.",'IT ALL STARTS WITH A LOOK.'],['TOUT PART','IT ALL STARTS'],["D'UN REGARD.",'WITH A LOOK.'],['LE MOUVEMENT.','MOTION.'],["L'ÉMOTION.",'EMOTION.'],['LA SUITE', 'THE STORY'],["S'ÉCRIT.",'GOES ON.'],['PREMIERS REGARDS — IMAGE ILLUSTRATIVE','FIRST LOOKS — ILLUSTRATIVE IMAGE'],['SPORT AUTOMOBILE — LE MANS','MOTORSPORT — LE MANS'],['AU PLUS PRÈS DES ÉMOTIONS','CLOSE TO THE EMOTIONS'],['CHAQUE IMAGE A UNE HISTOIRE.','EVERY IMAGE TELLS A STORY.'],
    ["Photographier, c'est apprendre à remarquer ce que les autres ne voient pas toujours.",'Photography means learning to notice what others may overlook.'],["Du sport automobile à la musique, l'envie de capturer une atmosphère et de raconter l'instant.",'From motorsport to music, a passion for capturing atmospheres and telling the story of a moment.'],['Une nouvelle rencontre, un projet, un moment à saisir. Et toujours la même curiosité.','A new encounter, a new project, a moment to capture. Always driven by curiosity.'],['DÉCOUVRIR MES PROJETS ↗','EXPLORE MY PROJECTS ↗'],['PHOTOGRAPHIE & VIDÉO','PHOTOGRAPHY & VIDEO'],
    ['TRAVAUX RÉCENTS','RECENT WORK'],['MES TRAVAUX EN IMAGES','MY WORK IN IMAGES'],['Reportages photo, films et créations graphiques : des images qui racontent une histoire, quel que soit leur format.','Photography, films and graphic design: images that tell a story, whatever the medium.'],['TOUT VOIR ↗','VIEW ALL ↗'],['TOUT VOIR — TOUS LES PROJETS ↗','VIEW ALL — EVERY PROJECT ↗'],['FAIRE TOURNER','ROTATE'],['PHOTO / VIDÉO / DESIGN','PHOTO / VIDEO / DESIGN'],
    ['MES SERVICES','MY SERVICES'],['Les mêmes prestations que sur ma page Services : photo, vidéo et création graphique, adaptées à chaque projet.','The same services as on my Services page: photography, filmmaking and graphic design tailored to each project.'],['ÉVÉNEMENT / SOIRÉE','EVENT / NIGHTLIFE'],['Photo portrait','Portrait photography'],['Photo ambiance','Atmosphere photography'],['Détail','Details'],['Action / reportage','Action / coverage'],['Format YouTube','YouTube format'],['Ours','Rough cut'],['Reportage','Reportage'],['Inside','Behind the scenes'],['Interview','Interview'],['COMMUNICATION / ANNONCE','COMMUNICATION / CAMPAIGN'],['Affiche','Poster'],['Post','Social post'],['Annonce','Announcement'],['Habillage social media','Social media design'],['CHOISIR CE SERVICE ↗','CHOOSE THIS SERVICE ↗'],["PARLER D'UN FILM ↗",'DISCUSS A FILM ↗'],['PRÉPARER UN VISUEL ↗','CREATE A VISUAL ↗'],['VOIR TOUS MES SERVICES ↗','VIEW ALL MY SERVICES ↗'],
    ['RESTONS CONNECTÉS','LET’S STAY CONNECTED'],['ME SUIVRE.','FOLLOW ME.'],['Les coulisses, les images et les prochains projets, à retrouver sur Instagram.','Behind the scenes, new photographs and upcoming projects on Instagram.'],['SUIVRE SUR INSTAGRAM ↗','FOLLOW ON INSTAGRAM ↗'],
    ['UN PROJET EN TÊTE ?','HAVE A PROJECT IN MIND?'],['DISCUTONS-EN.','LET’S TALK.'],['Une idée, un événement ou une collaboration ? Décris-moi ton projet et préparons une création qui te ressemble.','An idea, an event or a collaboration? Tell me about your project and let’s create something that feels like you.'],['VOTRE NOM','YOUR NAME'],['VOTRE E-MAIL','YOUR EMAIL'],['VOTRE PROJET','YOUR PROJECT'],['PARLEZ-MOI DE VOTRE PROJET','TELL ME ABOUT YOUR PROJECT'],['Votre nom','Your name'],['Quelques mots sur vos besoins...','A few words about what you need...'],['Mariage','Wedding'],['Portrait','Portrait'],['Corporate & Marque','Corporate & brand'],['Film & Aftermovie','Film & aftermovie'],['Autre projet','Other project'],["PRÉPARER MON E-MAIL ↗",'COMPOSE MY EMAIL ↗'],['Prototype : le bouton ouvre votre messagerie, sans enregistrer aucune donnée sur le site.','The button opens your email app. No information is stored on this website.'],
    ['MES CRÉATIONS / COLLECTIONS','MY CREATIONS / COLLECTIONS'],['LE PORTFOLIO','THE PORTFOLIO'],['Photographie, vidéo et graphisme : chaque création a son histoire. Choisis un univers pour explorer les projets.','Photography, filmmaking and design: every creation has a story. Choose a category to explore my work.'],['CHOISIS UNE CARTE POUR OUVRIR LE PROJET ↗','SELECT A CARD TO OPEN THE PROJECT ↗'],['YRUZPHOTO / COLLECTIONS','YRUZPHOTO / COLLECTIONS'],['LES PROJETS ARRIVENT.','PROJECTS COMING SOON.'],['De nouvelles créations seront visibles ici dès leur mise en ligne.','New work will appear here as soon as it is published.'],['06 PROJETS','06 PROJECTS'],['PROJETS','PROJECTS'],['PROJET INTROUVABLE','PROJECT NOT FOUND'],['Ce dossier n’existe pas dans le catalogue.','This project does not exist in the collection.'],['RETOUR AU PORTFOLIO ↗','BACK TO THE PORTFOLIO ↗'],['TOUS LES PROJETS ↑','ALL PROJECTS ↑'],['VOIR LES AUTRES PROJETS ↗','EXPLORE OTHER PROJECTS ↗'],
    ['DES FORMATS CLAIRS POUR CHAQUE BESOIN','TAILORED FORMATS FOR EVERY NEED'],['Photo, vidéo et design : une offre pensée pour couvrir un événement, raconter une histoire et livrer des contenus prêts à être diffusés.','Photo, video and design services to cover your event, tell your story and deliver work ready to share.'],['SUR MESURE','TAILORED TO YOU'],['UN BESOIN PLUS SPÉCIFIQUE ?','HAVE SOMETHING SPECIFIC IN MIND?'],['Chaque mission peut être adaptée selon la durée, le lieu, les livrables et le niveau d’accompagnement attendu.','Every project can be tailored to the duration, location, deliverables and level of support you need.'],
    ['YRUZPHOTO / INVENTAIRE INTERACTIF','YRUZPHOTO / INTERACTIVE GEAR'],['MON','MY'],['ÉQUIPEMENT','GEAR'],['Découvre mon matériel, sélectionne un équipement et prépare ton sac avant de partir en tournage.','Explore my equipment, choose what to pack and get ready for the shoot.'],['01 — INVENTAIRE','01 — INVENTORY'],['LES OBJETS PRÉSENTÉS SONT DES EXEMPLES MODIFIABLES.','THE ITEMS SHOWN ARE CUSTOMISABLE EXAMPLES.'],['DÉCOUVRIR LE PORTFOLIO ↗','EXPLORE THE PORTFOLIO ↗'],['PRÊT À PARTIR','READY TO GO'],['ÉQUIPER','PACK'],['DÉSÉQUIPER','REMOVE'],['SAC À DOS','BACKPACK'],['CAMÉRA','CAMERA'],['OPTIQUE','LENS'],['LUMIÈRE','LIGHTING'],['TOUT','ALL'],
    ['UN PROJET À IMAGINER','A PROJECT TO CREATE'],['Chaque collaboration commence par un échange. Décrivez votre idée et préparons ensemble la suite.','Every collaboration starts with a conversation. Tell me your idea and let’s plan what comes next.'],
    ['MAQUETTE DE PRÉSENTATION','PRESENTATION PREVIEW'],['PROTOTYPE DE PRÉSENTATION','PRESENTATION PREVIEW'],['CONTENUS ET PHOTOS ILLUSTRATIFS','ILLUSTRATIVE CONTENT AND IMAGES'],['PHOTOS ILLUSTRATIVES','ILLUSTRATIVE PHOTOGRAPHS'],['DOSSIER PROJET','PROJECT DETAILS'],['RETOUR EN HAUT ↑','BACK TO TOP ↑'],['RETOUR À L’ACCUEIL ↑','BACK TO HOME ↑'],["RETOUR À L'ACCUEIL ↑",'BACK TO HOME ↑'],['INSTAGRAM ↗','INSTAGRAM ↗'],
    ['COLLECTION SECRÈTE · MES RENCONTRES','SECRET COLLECTION · MY ENCOUNTERS'],['ÉDITION PERSONNELLE / COLLECTION','PERSONAL EDITION / COLLECTION'],['RETOUR AU SITE','BACK TO SITE'],['LE POKÉDEX','THE POKÉDEX'],['Mes rencontres, mes photos, ma collection.','My encounters, my photographs, my collection.'],['TOUTES','ALL'],['LÉGENDAIRE','LEGENDARY'],['RARE','RARE'],['PEU COMMUNE','UNCOMMON'],['COMMUN','COMMON'],['CATÉGORIE','CATEGORY'],['ÉVÉNEMENT','EVENT'],['FICHE DE RENCONTRE','ENCOUNTER PROFILE'],['PHOTOGRAPHIES ASSOCIÉES','RELATED PHOTOS'],['UNE RENCONTRE,','ONE ENCOUNTER,'],['UNE HISTOIRE.','ONE STORY.'],['Sélectionne une carte du classeur pour découvrir son histoire et ses photographies.','Select a card to discover its story and photos.'],['SÉLECTIONNE UNE CARTE POUR DÉCOUVRIR SON HISTOIRE','SELECT A CARD TO DISCOVER ITS STORY'],['UTILISE LES FLÈCHES POUR TOURNER LES PAGES','USE THE ARROWS TO TURN THE PAGES'],['RETOUR À L’ACCUEIL ↗','BACK TO HOME ↗'],['IMAGES D’AUJOURD’HUI, MÉMOIRES DE DEMAIN.','IMAGES OF TODAY, MEMORIES OF TOMORROW.'],['La collection est prête. Ajoute tes premiers portraits depuis le Studio YRUZPHOTO.','The collection is ready. Add your first portraits in YRUZPHOTO Studio.'],['Aucune carte ne correspond à cette recherche.','No cards match your search.'],['Photographies à venir.','Photos coming soon.'],['COLLECTION MOMENTANÉMENT INDISPONIBLE.','COLLECTION TEMPORARILY UNAVAILABLE.'],
    ['AGRANDIR ↗','ENLARGE ↗'],['AGRANDIR','ENLARGE'],['PHOTO SUIVANTE','NEXT PHOTO'],['PHOTO PRÉCÉDENTE','PREVIOUS PHOTO'],['FAIRE DEFILER LES REPORTAGES','SCROLL THROUGH PROJECTS'],['FAIRE DÉFILER LES REPORTAGES','SCROLL THROUGH PROJECTS'],

    ["© 2026 • MAQUETTE DE PRÉSENTATION","© 2026 • PRESENTATION PREVIEW"],
    ["PARLONS-EN.","LET’S TALK."],
    ["MATÉRIEL D'EXEMPLE À PERSONNALISER","CUSTOMISABLE EXAMPLE GEAR"],
    ["02 — SAC À DOS","02 — BACKPACK"],
    ["MON SAC À DOS","MY BACKPACK"],
    ["PRÊT À PARTIR ↗","READY TO GO ↗"],
    ["ÉQUIPE UNE CAMÉRA ET AU MOINS UN AUTRE OBJET","PACK A CAMERA AND AT LEAST ONE OTHER ITEM"],
    ["· UTILISE LES FLÈCHES POUR TOURNER LES PAGES","· USE THE ARROWS TO TURN THE PAGES"],
    ["Choisis une carte de l'album pour afficher son portrait et les photos de cette rencontre.","Select an album card to see the portrait and photographs from this encounter."],
    ["IMAGES D'AUJOURD'HUI, MÉMOIRES DE DEMAIN.","IMAGES OF TODAY, MEMORIES OF TOMORROW."],
    ["RETOUR À L'ACCUEIL ↗","BACK TO HOME ↗"],
    ["GLISSER OU CLIQUER","SWIPE OR CLICK"],
    ["GALERIE DU PROJET","PROJECT GALLERY"],
    ["LES IMAGES","THE IMAGES"],
    ["FILM","FILM"],
    ["LA VIDÉO","THE VIDEO"],
    ["REGARDER LE FILM","WATCH THE FILM"],
    ["Regarder sur YouTube","Watch on YouTube"],
    ["GALERIE DE DÉMONSTRATION — PHOTOS À REMPLACER","DEMO GALLERY — PHOTOS TO REPLACE"],
    ["DOSSIER PRÊT À RECEVOIR VOS FICHIERS","READY FOR YOUR MEDIA FILES"],
    ["PHOTOS DE DÉMONSTRATION","SAMPLE PHOTOS"],
    ["POUR ALLER PLUS LOIN","DISCOVER MORE"],
    ["À DÉCOUVRIR AUSSI","MORE TO EXPLORE"],
    ["← TOUS LES PROJETS","← ALL PROJECTS"],
    ["LIEN VIDÉO NON RECONNU. AJOUTE UNE URL YOUTUBE VALIDE DEPUIS LE STUDIO.","VIDEO LINK NOT RECOGNISED. ADD A VALID YOUTUBE URL IN STUDIO."],
    ["LA COLLECTION ATTEND SES PREMIÈRES CARTES","THE COLLECTION IS WAITING FOR ITS FIRST CARDS"],
    ["OUVERTURE DE LA COLLECTION…","OPENING THE COLLECTION…"],
    ["PARLEZ-MOI DE VOTRE PROJET","TELL ME ABOUT YOUR PROJECT"],
    ["VOS COORDONNÉES","YOUR CONTACT DETAILS"],
  ];
  // V67: additional hard-coded strings from the actual site pages and galleries.
  // Custom texts entered in the Studio remain author-controlled in their English fields.
  pairs.push(
    ['PHOTOGRAPHIE','PHOTOGRAPHY'],
    ['SERVICES.','SERVICES.'],
    ['MODE DÉMONSTRATION','DEMO MODE'],
    ['08 ÉQUIPEMENTS','08 GEAR ITEMS'],
    ['RÉINITIALISER ↺','RESET ↺'],
    ['0 / 4 emplacements équipés','0 / 4 ITEMS PACKED'],
    ['emplacements équipés','items packed'],
    ['ÉQUIPEMENTS','GEAR ITEMS'],
    ['CONTACT ↗','CONTACT ↗'],
    ['IG ↗','IG ↗'],
    ['◈ PHOTO','◈ PHOTO'],
    ['▶ VIDÉO','▶ VIDEO'],
    ['✦ GRAPHISME','✦ DESIGN'],
    ['PROJETS PHOTO','PHOTO PROJECTS'],
    ['PROJETS VIDÉO','VIDEO PROJECTS'],
    ['PROJETS GRAPHISME','DESIGN PROJECTS'],
    ['MA GALERIE','MY GALLERY'],
    ['MES PHOTOS','MY PHOTOS'],
    ['PHOTOS','PHOTOS'],
    ['VIDÉOS','VIDEOS'],
    ['VISUELS','IMAGES'],
    ['CLIQUEZ POUR AGRANDIR','CLICK TO ENLARGE'],
    ['CLIQUEZ POUR OUVRIR','CLICK TO OPEN'],
    ['PHOTO PRÉCÉDENTE','PREVIOUS PHOTO'],
    ['PHOTOGRAPHIE PRÉCÉDENTE','PREVIOUS PHOTO'],
    ['PHOTOGRAPHIE SUIVANTE','NEXT PHOTO'],
    ['PRÉCÉDENT','PREVIOUS'],
    ['SUIVANT','NEXT'],
    ['Agrandir la photo','Enlarge photo'],
    ['Choisir une photographie','Choose a photograph'],
    ['Choisir une photo','Choose a photo'],
    ['Visionneuse de photos','Photo viewer'],
    ['Fermer la visionneuse','Close photo viewer'],
    ['Choisir une photographie','Choose a photograph'],
    ['Afficher la photo','Show photo'],
    ['Lire la vidéo','Play video'],
    ['Votre navigateur ne prend pas en charge cette vidéo.','Your browser does not support this video.'],
    ['Les médias de ce projet seront ajoutés prochainement.','Media for this project will be added soon.'],
    ['AUCUN PROJET','NO PROJECTS'],
    ['AUCUNE PHOTO','NO PHOTOS'],
    ['AUCUNE VIDÉO','NO VIDEOS'],
    ['IMAGES À VENIR','PHOTOS COMING SOON'],
    ['CHARGEMENT DES PROJETS','LOADING PROJECTS'],
    ['CHARGEMENT…','LOADING…'],
    ['RETOUR','BACK'],
    ['DÉCOUVRIR','DISCOVER'],
    ['EN SAVOIR PLUS','LEARN MORE'],
    ['VOIR LE PROJET','VIEW PROJECT'],
    ['OUVRIR LE PROJET','OPEN PROJECT'],
    ['DEMANDE DE DEVIS','REQUEST A QUOTE'],
    ['PHOTOGRAPHE','PHOTOGRAPHER'],
    ['VIDÉASTE','FILMMAKER'],
    ['PHOTOGRAPHIE ET VIDÉO','PHOTOGRAPHY AND VIDEO'],
    ['LE CLASSEUR','THE BINDER'],
    ['TOURNER LA PAGE','TURN THE PAGE'],
    ['PAGE SUIVANTE','NEXT PAGE'],
    ['PAGE PRÉCÉDENTE','PREVIOUS PAGE'],
    ['CARTE SUIVANTE','NEXT CARD'],
    ['CARTE PRÉCÉDENTE','PREVIOUS CARD'],
    ['OUVRIR LA FICHE','OPEN PROFILE'],
    ['FERMER LA FICHE','CLOSE PROFILE'],
    ['LES RENCONTRES','ENCOUNTERS'],
    ['RECHERCHER UNE PERSONNE','SEARCH FOR A PERSON'],
    ['RECHERCHER','SEARCH'],
    ['TRIER','SORT'],
    ['TOUTES LES RARETÉS','ALL RARITIES'],
    ['LÉGENDAIRES','LEGENDARY'],
    ['RARES','RARE'],
    ['PEU COMMUNES','UNCOMMON'],
    ['COMMUNES','COMMON'],
    ['RETOUR AU CLASSEUR','BACK TO THE BINDER'],
    ['APERÇU','PREVIEW'],
    ['ÉQUIPEMENT AUDIO','AUDIO EQUIPMENT'],
    ['AUDIO','AUDIO'],
    ['LENTILLE','LENS'],
    ['OBJECTIF','LENS'],
    ['ACCESSOIRES','ACCESSORIES'],
    ['DANS LE SAC','IN THE BAG'],
    ['AJOUTER AU SAC','ADD TO BAG'],
    ['RETIRER DU SAC','REMOVE FROM BAG'],
    ['CONTACTEZ-MOI','CONTACT ME'],
    ['ÉCRIVEZ-MOI','GET IN TOUCH'],
    ['ENVOYER','SEND'],
    ['VOTRE MESSAGE','YOUR MESSAGE'],
    ['ÉVÉNEMENT','EVENT'],
    ['INTERVIEW','INTERVIEW'],
    ['CRÉATION GRAPHIQUE','GRAPHIC DESIGN'],
    ['CRÉATIONS GRAPHIQUES','GRAPHIC DESIGN'],
    ['TOUS LES PROJETS','ALL PROJECTS']
  );
  const titlePairs = new Map([
    ['YRUZPHOTO — Prototype','YRUZPHOTO — Portfolio'],
    ['Portfolio — YRUZPHOTO','Portfolio — YRUZPHOTO'],
    ['Projet — YRUZPHOTO','Project — YRUZPHOTO'],
    ['Services — YRUZPHOTO','Services — YRUZPHOTO'],
    ['Mon équipement — YRUZPHOTO','My Gear — YRUZPHOTO'],
    ['Contact — YRUZPHOTO','Contact — YRUZPHOTO'],
    ['Le Pokédex — YRUZPHOTO','The Pokédex — YRUZPHOTO']
  ]);
  let frenchTitle = null;
  function updateTitle(){
    if(lang==='en'){
      // Only translate a known stock page title; never replace a custom project title.
      const translated=titlePairs.get(document.title);
      if(translated){if(frenchTitle===null)frenchTitle=document.title;document.title=translated}
    }else if(frenchTitle!==null){
      if(document.title===titlePairs.get(frenchTitle))document.title=frenchTitle;
      frenchTitle=null;
    }
  }
  function translateDynamic(value) {
    let match;
    if((match=/^(\d+)\s+VISUELS?\s*[·•]\s*CLIQUEZ POUR AGRANDIR$/i.exec(value)))return `${match[1]} IMAGES · CLICK TO ENLARGE`;
    if((match=/^(\d+)\s+PHOTOS?\s*(?:[·•]\s*(\d+)\s+VIDÉOS?)?$/i.exec(value)))return `${match[1]} ${Number(match[1])===1?'PHOTO':'PHOTOS'}${match[2]?' · '+match[2]+' '+(Number(match[2])===1?'VIDEO':'VIDEOS'):''}`;
    if((match=/^(\d+)\s+ÉQUIPEMENTS?$/i.exec(value)))return `${match[1]} GEAR ITEMS`;
    if((match=/^(\d+)\s*\/\s*(\d+)\s+emplacements équipés$/i.exec(value)))return `${match[1]} / ${match[2]} ITEMS PACKED`;
    if((match=/^Afficher la photo\s+(\d+)$/i.exec(value)))return `Show photo ${match[1]}`;
    if((match=/^Choisir une photographie\s+(\d+)$/i.exec(value)))return `Choose photograph ${match[1]}`;
    if((match=/^Agrandir la photo\s+(\d+)(?:\s+sur\s+(\d+))?$/i.exec(value)))return `Enlarge photo ${match[1]}${match[2]?' of '+match[2]:''}`;
    if((match=/^Lire la vidéo\s+(.+)$/i.exec(value)))return `Play video: ${match[1]}`;
    if((match=/^Visionneuse de photos$/i.exec(value)))return `Photo viewer`;
    return null;
  }
  const normalized = s => String(s||'').replace(/\s+/g,' ').trim();
  const dict = new Map(pairs.map(([fr,en])=>[normalized(fr),en]));
  const tracked=new Map();
  const translatedAttrs=new Map();
  let observer,processing=false;
  const skip=node=>!node.parentElement||node.parentElement.closest('script,style,noscript,textarea,code,pre,[contenteditable],.yruz-lang-switch,#studioRoot');
  function translateTextNode(node){
    if(skip(node))return;
    const raw=node.nodeValue||'';
    if(!raw.trim())return;
    const prior=tracked.get(node);
    // DOM libraries can replace a text node in place. Translate its *new* original,
    // never restore stale text from the previous version when switching to French.
    if(prior && raw===prior.en)return;
    if(prior && raw===prior.fr){const en=dict.get(normalized(raw))||translateDynamic(normalized(raw));if(en)node.nodeValue=prior.en=en;return}
    const value=normalized(raw),en=dict.get(value)||translateDynamic(value);
    if(!en)return;
    const final=raw.replace(/^(\s*)[\s\S]*?(\s*)$/,(_all,prefix,suffix)=>prefix+en+suffix);
    tracked.set(node,{fr:raw,en:final});
    node.nodeValue=final;
  }
  function translateAttributes(root){
    const nodes=[];if(root.nodeType===1)nodes.push(root);
    if(root.querySelectorAll)nodes.push(...root.querySelectorAll('[placeholder],[aria-label],[title]'));
    for(const el of nodes)for(const attr of ['placeholder','aria-label','title']){
      if(!el.hasAttribute?.(attr)||el.closest?.('.yruz-lang-switch'))continue;
      const old=el.getAttribute(attr),en=dict.get(normalized(old))||translateDynamic(normalized(old));if(!en)continue;
      if(!translatedAttrs.has(el))translatedAttrs.set(el,{});
      const state=translatedAttrs.get(el);
      // Replacing a placeholder or label while English is selected must refresh
      // the French value used on the way back, not restore an old CMS value.
      if(state[attr]!==old)state[attr]=old;
      if(old!==en)el.setAttribute(attr,en);
    }
  }
  function scan(root=document.body){
    if(lang!=='en'||!root)return;
    if(root.nodeType===3){translateTextNode(root);return}
    if(root.nodeType!==1)return;
    translateAttributes(root);
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    let node;while((node=walker.nextNode()))translateTextNode(node);
  }
  function restore(){
    for(const [node,state] of tracked)if(node.isConnected&&node.nodeValue===state.en)node.nodeValue=state.fr;
    tracked.clear();
    for(const [el,values] of translatedAttrs)if(el.isConnected)for(const [key,value] of Object.entries(values))el.setAttribute(key,value);
    translatedAttrs.clear();
  }
  function ui(){
    const host=document.querySelector('header#header')||document.querySelector('.pd-nav');
    if(!host||host.querySelector('.yruz-lang-switch'))return;
    const el=document.createElement('div');el.className='yruz-lang-switch';el.setAttribute('role','group');el.setAttribute('aria-label','Langue / Language');
    el.innerHTML='<button type="button" data-lang="fr" lang="fr" aria-label="Français" title="Français">🇫🇷<span>FR</span></button><span class="yruz-lang-sep" aria-hidden="true"></span><button type="button" data-lang="en" lang="en" aria-label="English" title="English">🇬🇧<span>EN</span></button>';
    el.addEventListener('click',e=>{const btn=e.target.closest('[data-lang]');if(btn)select(btn.dataset.lang)});
    host.append(el);
  }
  function updateButtons(){document.querySelectorAll('.yruz-lang-switch [data-lang]').forEach(b=>{const active=b.dataset.lang===lang;b.classList.toggle('is-active',active);b.setAttribute('aria-pressed',String(active))})}
  function select(value){
    const next=value==='en'?'en':'fr';if(next===lang)return;
    if(lang==='en')restore();
    lang=next;
    try{localStorage.setItem(KEY,lang)}catch{}
    document.documentElement.lang=lang;
    window.dispatchEvent(new CustomEvent('yruz:language-change',{detail:{lang}}));
    window.YRUZ_REAPPLY_CONTENT?.();
    if(lang==='en')scan();
    updateTitle();
    updateButtons();
  }
  window.YRUZ_LANG={current:()=>lang,select,refresh:()=>{if(lang==='en')scan();updateTitle();updateButtons()}};
  function start(){
    document.documentElement.lang=lang;ui();updateButtons();if(lang==='en')scan();updateTitle();
    observer=new MutationObserver(mutations=>{
      if(lang!=='en'||processing)return;
      processing=true;
      observer.disconnect();
      try{
        for(const mutation of mutations){
          if(mutation.type==='characterData'){scan(mutation.target);continue}
          if(mutation.type==='attributes'){translateAttributes(mutation.target);continue}
          for(const node of mutation.addedNodes)if(node.nodeType===1||node.nodeType===3)scan(node);
        }
      }
      finally{observer.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['placeholder','aria-label','title']});processing=false}
    });
    observer.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['placeholder','aria-label','title']});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
