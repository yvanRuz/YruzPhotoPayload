/* YRUZPHOTO V66 — FR/EN public UI. Original text is always preserved. */
(() => {
  'use strict';
  const KEY='yruzphoto-language';
  let lang='fr';
  try { const saved=localStorage.getItem(KEY);lang=['en','pt-BR'].includes(saved)?saved:'fr'; } catch {}
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
  // V69 — Traductions professionnelles de l’interface en portugais brésilien.
  const ptPairs = [
  [
    "ACCUEIL",
    "INÍCIO"
  ],
  [
    "ÉQUIPEMENT",
    "EQUIPAMENTO"
  ],
  [
    "MON ÉQUIPEMENT",
    "MEU EQUIPAMENTO"
  ],
  [
    "SERVICES",
    "SERVIÇOS"
  ],
  [
    "CONTACT",
    "CONTATO"
  ],
  [
    "PORTFOLIO",
    "PORTFÓLIO"
  ],
  [
    "PHOTO",
    "FOTO"
  ],
  [
    "VIDÉO",
    "VÍDEO"
  ],
  [
    "GRAPHISME",
    "DESIGN GRÁFICO"
  ],
  [
    "DESIGN",
    "DESIGN"
  ],
  [
    "PHOTOGRAPHIE",
    "FOTOGRAFIA"
  ],
  [
    "PARLONS DE VOTRE PROJET",
    "VAMOS FALAR DO SEU PROJETO"
  ],
  [
    "↗   PARLONS DE VOTRE PROJET",
    "↗   VAMOS FALAR DO SEU PROJETO"
  ],
  [
    "PARLONS DE VOTRE PROJET ↗",
    "VAMOS FALAR DO SEU PROJETO ↗"
  ],
  [
    "PHOTOGRAPHE & VIDÉASTE",
    "FOTÓGRAFO E VIDEOMAKER"
  ],
  [
    "Basé à Paris, passionné de Sport Automobile et de musique,",
    "Radicado em Paris, apaixonado por automobilismo e música,"
  ],
  [
    "je fais des photos et des vidéos pour capturer des émotions.",
    "faço fotos e vídeos para registrar emoções."
  ],
  [
    "MES TRAVAUX ↗",
    "MEUS TRABALHOS ↗"
  ],
  [
    "MES TRAVAUX  ↗",
    "MEUS TRABALHOS ↗"
  ],
  [
    "MES TRAVAUX",
    "MEUS TRABALHOS"
  ],
  [
    "MON ÉQUIPEMENT  ↗",
    "MEU EQUIPAMENTO ↗"
  ],
  [
    "MON ÉQUIPEMENT ↗",
    "MEU EQUIPAMENTO ↗"
  ],
  [
    "DÉFILER ↓",
    "ROLAR ↓"
  ],
  [
    "YRUZPHOTO — MON HISTOIRE",
    "YRUZPHOTO — MINHA HISTÓRIA"
  ],
  [
    "01 — LE PARCOURS",
    "01 — A TRAJETÓRIA"
  ],
  [
    "DÉFILER POUR DÉCOUVRIR →",
    "DESLIZE PARA DESCOBRIR →"
  ],
  [
    "01 / LE DÉBUT",
    "01 / O COMEÇO"
  ],
  [
    "CHAPITRE 01",
    "CAPÍTULO 01"
  ],
  [
    "CHAPITRE 02 — LA PASSION",
    "CAPÍTULO 02 — A PAIXÃO"
  ],
  [
    "CHAPITRE 03 — AUJOURD’HUI",
    "CAPÍTULO 03 — HOJE"
  ],
  [
    "CHAPITRE 03 — AUJOURD'HUI",
    "CAPÍTULO 03 — HOJE"
  ],
  [
    "TOUT PART D'UN REGARD.",
    "TUDO COMEÇA COM UM OLHAR."
  ],
  [
    "TOUT PART",
    "TUDO COMEÇA"
  ],
  [
    "D'UN REGARD.",
    "COM UM OLHAR."
  ],
  [
    "LE MOUVEMENT.",
    "O MOVIMENTO."
  ],
  [
    "L'ÉMOTION.",
    "A EMOÇÃO."
  ],
  [
    "LA SUITE",
    "A HISTÓRIA"
  ],
  [
    "S'ÉCRIT.",
    "CONTINUA."
  ],
  [
    "PREMIERS REGARDS — IMAGE ILLUSTRATIVE",
    "PRIMEIROS OLHARES — IMAGEM ILUSTRATIVA"
  ],
  [
    "SPORT AUTOMOBILE — LE MANS",
    "AUTOMOBILISMO — LE MANS"
  ],
  [
    "AU PLUS PRÈS DES ÉMOTIONS",
    "MAIS PERTO DAS EMOÇÕES"
  ],
  [
    "CHAQUE IMAGE A UNE HISTOIRE.",
    "CADA IMAGEM CONTA UMA HISTÓRIA."
  ],
  [
    "Photographier, c'est apprendre à remarquer ce que les autres ne voient pas toujours.",
    "Fotografar é aprender a perceber o que nem sempre os outros veem."
  ],
  [
    "Du sport automobile à la musique, l'envie de capturer une atmosphère et de raconter l'instant.",
    "Do automobilismo à música, a vontade de registrar atmosferas e contar a história de cada instante."
  ],
  [
    "Une nouvelle rencontre, un projet, un moment à saisir. Et toujours la même curiosité.",
    "Um novo encontro, um projeto, um momento a registrar. E sempre a mesma curiosidade."
  ],
  [
    "DÉCOUVRIR MES PROJETS ↗",
    "CONHEÇA MEUS PROJETOS ↗"
  ],
  [
    "PHOTOGRAPHIE & VIDÉO",
    "FOTOGRAFIA E VÍDEO"
  ],
  [
    "TRAVAUX RÉCENTS",
    "TRABALHOS RECENTES"
  ],
  [
    "MES TRAVAUX EN IMAGES",
    "MEUS TRABALHOS EM IMAGENS"
  ],
  [
    "Reportages photo, films et créations graphiques : des images qui racontent une histoire, quel que soit leur format.",
    "Reportagens fotográficas, filmes e criações gráficas: imagens que contam histórias, em qualquer formato."
  ],
  [
    "TOUT VOIR ↗",
    "VER TUDO ↗"
  ],
  [
    "TOUT VOIR — TOUS LES PROJETS ↗",
    "VER TUDO — TODOS OS PROJETOS ↗"
  ],
  [
    "FAIRE TOURNER",
    "GIRAR"
  ],
  [
    "PHOTO / VIDÉO / DESIGN",
    "FOTO / VÍDEO / DESIGN"
  ],
  [
    "MES SERVICES",
    "MEUS SERVIÇOS"
  ],
  [
    "Les mêmes prestations que sur ma page Services : photo, vidéo et création graphique, adaptées à chaque projet.",
    "Os mesmos serviços da página Serviços: fotografia, vídeo e design gráfico, adaptados a cada projeto."
  ],
  [
    "ÉVÉNEMENT / SOIRÉE",
    "EVENTO / FESTA"
  ],
  [
    "Photo portrait",
    "Fotografia de retrato"
  ],
  [
    "Photo ambiance",
    "Fotografia de ambiente"
  ],
  [
    "Détail",
    "Detalhes"
  ],
  [
    "Action / reportage",
    "Ação / cobertura"
  ],
  [
    "Format YouTube",
    "Formato YouTube"
  ],
  [
    "Ours",
    "Versão preliminar"
  ],
  [
    "Reportage",
    "Reportagem"
  ],
  [
    "Inside",
    "Bastidores"
  ],
  [
    "Interview",
    "Entrevista"
  ],
  [
    "COMMUNICATION / ANNONCE",
    "COMUNICAÇÃO / CAMPANHA"
  ],
  [
    "Affiche",
    "Cartaz"
  ],
  [
    "Post",
    "Publicação"
  ],
  [
    "Annonce",
    "Anúncio"
  ],
  [
    "Habillage social media",
    "Identidade visual para redes sociais"
  ],
  [
    "CHOISIR CE SERVICE ↗",
    "ESCOLHER ESTE SERVIÇO ↗"
  ],
  [
    "PARLER D'UN FILM ↗",
    "CONVERSAR SOBRE UM FILME ↗"
  ],
  [
    "PRÉPARER UN VISUEL ↗",
    "CRIAR UMA PEÇA VISUAL ↗"
  ],
  [
    "VOIR TOUS MES SERVICES ↗",
    "VER TODOS OS MEUS SERVIÇOS ↗"
  ],
  [
    "RESTONS CONNECTÉS",
    "VAMOS NOS CONECTAR"
  ],
  [
    "ME SUIVRE.",
    "ME ACOMPANHE."
  ],
  [
    "Les coulisses, les images et les prochains projets, à retrouver sur Instagram.",
    "Bastidores, fotos e próximos projetos no Instagram."
  ],
  [
    "SUIVRE SUR INSTAGRAM ↗",
    "ACOMPANHAR NO INSTAGRAM ↗"
  ],
  [
    "UN PROJET EN TÊTE ?",
    "TEM UM PROJETO EM MENTE?"
  ],
  [
    "DISCUTONS-EN.",
    "VAMOS CONVERSAR."
  ],
  [
    "Une idée, un événement ou une collaboration ? Décris-moi ton projet et préparons une création qui te ressemble.",
    "Uma ideia, um evento ou uma colaboração? Conte sobre seu projeto e vamos criar algo com a sua cara."
  ],
  [
    "VOTRE NOM",
    "SEU NOME"
  ],
  [
    "VOTRE E-MAIL",
    "SEU E-MAIL"
  ],
  [
    "VOTRE PROJET",
    "SEU PROJETO"
  ],
  [
    "PARLEZ-MOI DE VOTRE PROJET",
    "CONTE SOBRE SEU PROJETO"
  ],
  [
    "Votre nom",
    "Seu nome"
  ],
  [
    "Quelques mots sur vos besoins...",
    "Conte um pouco sobre o que você precisa..."
  ],
  [
    "Mariage",
    "Casamento"
  ],
  [
    "Portrait",
    "Retrato"
  ],
  [
    "Corporate & Marque",
    "Corporativo e marcas"
  ],
  [
    "Film & Aftermovie",
    "Filme e aftermovie"
  ],
  [
    "Autre projet",
    "Outro projeto"
  ],
  [
    "PRÉPARER MON E-MAIL ↗",
    "PREPARAR MEU E-MAIL ↗"
  ],
  [
    "Prototype : le bouton ouvre votre messagerie, sans enregistrer aucune donnée sur le site.",
    "O botão abre seu aplicativo de e-mail. Nenhum dado é salvo neste site."
  ],
  [
    "MES CRÉATIONS / COLLECTIONS",
    "MINHAS CRIAÇÕES / COLEÇÕES"
  ],
  [
    "LE PORTFOLIO",
    "O PORTFÓLIO"
  ],
  [
    "Photographie, vidéo et graphisme : chaque création a son histoire. Choisis un univers pour explorer les projets.",
    "Fotografia, vídeo e design: cada criação tem sua história. Escolha uma categoria para explorar os projetos."
  ],
  [
    "CHOISIS UNE CARTE POUR OUVRIR LE PROJET ↗",
    "ESCOLHA UM CARTÃO PARA ABRIR O PROJETO ↗"
  ],
  [
    "LES PROJETS ARRIVENT.",
    "EM BREVE, NOVOS PROJETOS."
  ],
  [
    "De nouvelles créations seront visibles ici dès leur mise en ligne.",
    "Novos trabalhos aparecerão aqui assim que forem publicados."
  ],
  [
    "06 PROJETS",
    "06 PROJETOS"
  ],
  [
    "PROJETS",
    "PROJETOS"
  ],
  [
    "PROJET INTROUVABLE",
    "PROJETO NÃO ENCONTRADO"
  ],
  [
    "Ce dossier n’existe pas dans le catalogue.",
    "Este projeto não está no catálogo."
  ],
  [
    "RETOUR AU PORTFOLIO ↗",
    "VOLTAR AO PORTFÓLIO ↗"
  ],
  [
    "TOUS LES PROJETS ↑",
    "TODOS OS PROJETOS ↑"
  ],
  [
    "VOIR LES AUTRES PROJETS ↗",
    "VER OUTROS PROJETOS ↗"
  ],
  [
    "DES FORMATS CLAIRS POUR CHAQUE BESOIN",
    "FORMATOS PARA CADA NECESSIDADE"
  ],
  [
    "Photo, vidéo et design : une offre pensée pour couvrir un événement, raconter une histoire et livrer des contenus prêts à être diffusés.",
    "Fotografia, vídeo e design: serviços para cobrir eventos, contar histórias e entregar conteúdo pronto para publicar."
  ],
  [
    "SUR MESURE",
    "SOB MEDIDA"
  ],
  [
    "UN BESOIN PLUS SPÉCIFIQUE ?",
    "PRECISA DE ALGO MAIS ESPECÍFICO?"
  ],
  [
    "Chaque mission peut être adaptée selon la durée, le lieu, les livrables et le niveau d’accompagnement attendu.",
    "Cada trabalho pode ser adaptado à duração, ao local, às entregas e ao acompanhamento necessário."
  ],
  [
    "YRUZPHOTO / INVENTAIRE INTERACTIF",
    "YRUZPHOTO / INVENTÁRIO INTERATIVO"
  ],
  [
    "MON",
    "MEU"
  ],
  [
    "Découvre mon matériel, sélectionne un équipement et prépare ton sac avant de partir en tournage.",
    "Conheça meus equipamentos, escolha o que levar e prepare a mochila para a produção."
  ],
  [
    "01 — INVENTAIRE",
    "01 — INVENTÁRIO"
  ],
  [
    "LES OBJETS PRÉSENTÉS SONT DES EXEMPLES MODIFIABLES.",
    "OS ITENS EXIBIDOS SÃO EXEMPLOS PERSONALIZÁVEIS."
  ],
  [
    "DÉCOUVRIR LE PORTFOLIO ↗",
    "EXPLORAR O PORTFÓLIO ↗"
  ],
  [
    "PRÊT À PARTIR",
    "PRONTO PARA SAIR"
  ],
  [
    "ÉQUIPER",
    "EQUIPAR"
  ],
  [
    "DÉSÉQUIPER",
    "REMOVER"
  ],
  [
    "SAC À DOS",
    "MOCHILA"
  ],
  [
    "CAMÉRA",
    "CÂMERA"
  ],
  [
    "OPTIQUE",
    "LENTE"
  ],
  [
    "LUMIÈRE",
    "ILUMINAÇÃO"
  ],
  [
    "TOUT",
    "TUDO"
  ],
  [
    "UN PROJET À IMAGINER",
    "UM PROJETO PARA CRIAR"
  ],
  [
    "Chaque collaboration commence par un échange. Décrivez votre idée et préparons ensemble la suite.",
    "Toda parceria começa com uma conversa. Conte sua ideia e vamos planejar os próximos passos."
  ],
  [
    "MAQUETTE DE PRÉSENTATION",
    "PRÉVIA DE APRESENTAÇÃO"
  ],
  [
    "PROTOTYPE DE PRÉSENTATION",
    "PRÉVIA DE APRESENTAÇÃO"
  ],
  [
    "CONTENUS ET PHOTOS ILLUSTRATIFS",
    "CONTEÚDO E FOTOS ILUSTRATIVOS"
  ],
  [
    "PHOTOS ILLUSTRATIVES",
    "FOTOGRAFIAS ILUSTRATIVAS"
  ],
  [
    "DOSSIER PROJET",
    "DETALHES DO PROJETO"
  ],
  [
    "RETOUR EN HAUT ↑",
    "VOLTAR AO TOPO ↑"
  ],
  [
    "RETOUR À L’ACCUEIL ↑",
    "VOLTAR AO INÍCIO ↑"
  ],
  [
    "RETOUR À L'ACCUEIL ↑",
    "VOLTAR AO INÍCIO ↑"
  ],
  [
    "COLLECTION SECRÈTE · MES RENCONTRES",
    "COLEÇÃO SECRETA · MEUS ENCONTROS"
  ],
  [
    "ÉDITION PERSONNELLE / COLLECTION",
    "EDIÇÃO PESSOAL / COLEÇÃO"
  ],
  [
    "RETOUR AU SITE",
    "VOLTAR AO SITE"
  ],
  [
    "LE POKÉDEX",
    "A POKÉDEX"
  ],
  [
    "Mes rencontres, mes photos, ma collection.",
    "Meus encontros, minhas fotos, minha coleção."
  ],
  [
    "TOUTES",
    "TODAS"
  ],
  [
    "LÉGENDAIRE",
    "LENDÁRIA"
  ],
  [
    "RARE",
    "RARA"
  ],
  [
    "PEU COMMUNE",
    "INCOMUM"
  ],
  [
    "COMMUN",
    "COMUM"
  ],
  [
    "CATÉGORIE",
    "CATEGORIA"
  ],
  [
    "ÉVÉNEMENT",
    "EVENTO"
  ],
  [
    "FICHE DE RENCONTRE",
    "PERFIL DO ENCONTRO"
  ],
  [
    "PHOTOGRAPHIES ASSOCIÉES",
    "FOTOGRAFIAS RELACIONADAS"
  ],
  [
    "UNE RENCONTRE,",
    "UM ENCONTRO,"
  ],
  [
    "UNE HISTOIRE.",
    "UMA HISTÓRIA."
  ],
  [
    "Sélectionne une carte du classeur pour découvrir son histoire et ses photographies.",
    "Selecione uma carta do álbum para descobrir sua história e fotografias."
  ],
  [
    "SÉLECTIONNE UNE CARTE POUR DÉCOUVRIR SON HISTOIRE",
    "SELECIONE UMA CARTA PARA CONHECER SUA HISTÓRIA"
  ],
  [
    "UTILISE LES FLÈCHES POUR TOURNER LES PAGES",
    "USE AS SETAS PARA VIRAR AS PÁGINAS"
  ],
  [
    "RETOUR À L’ACCUEIL ↗",
    "VOLTAR AO INÍCIO ↗"
  ],
  [
    "IMAGES D’AUJOURD’HUI, MÉMOIRES DE DEMAIN.",
    "IMAGENS DE HOJE, MEMÓRIAS DE AMANHÃ."
  ],
  [
    "La collection est prête. Ajoute tes premiers portraits depuis le Studio YRUZPHOTO.",
    "A coleção está pronta. Adicione os primeiros retratos no Studio YRUZPHOTO."
  ],
  [
    "Aucune carte ne correspond à cette recherche.",
    "Nenhuma carta corresponde à sua busca."
  ],
  [
    "Photographies à venir.",
    "Fotos em breve."
  ],
  [
    "COLLECTION MOMENTANÉMENT INDISPONIBLE.",
    "COLEÇÃO TEMPORARIAMENTE INDISPONÍVEL."
  ],
  [
    "AGRANDIR ↗",
    "AMPLIAR ↗"
  ],
  [
    "AGRANDIR",
    "AMPLIAR"
  ],
  [
    "PHOTO SUIVANTE",
    "PRÓXIMA FOTO"
  ],
  [
    "PHOTO PRÉCÉDENTE",
    "FOTO ANTERIOR"
  ],
  [
    "FAIRE DEFILER LES REPORTAGES",
    "PERCORRER OS PROJETOS"
  ],
  [
    "FAIRE DÉFILER LES REPORTAGES",
    "PERCORRER OS PROJETOS"
  ],
  [
    "PARLONS-EN.",
    "VAMOS CONVERSAR."
  ],
  [
    "MATÉRIEL D'EXEMPLE À PERSONNALISER",
    "EQUIPAMENTOS DE EXEMPLO PARA PERSONALIZAR"
  ],
  [
    "02 — SAC À DOS",
    "02 — MOCHILA"
  ],
  [
    "MON SAC À DOS",
    "MINHA MOCHILA"
  ],
  [
    "PRÊT À PARTIR ↗",
    "PRONTO PARA SAIR ↗"
  ],
  [
    "ÉQUIPE UNE CAMÉRA ET AU MOINS UN AUTRE OBJET",
    "EQUIPE UMA CÂMERA E PELO MENOS MAIS UM ITEM"
  ],
  [
    "· UTILISE LES FLÈCHES POUR TOURNER LES PAGES",
    "· USE AS SETAS PARA VIRAR AS PÁGINAS"
  ],
  [
    "Choisis une carte de l'album pour afficher son portrait et les photos de cette rencontre.",
    "Escolha uma carta do álbum para ver o retrato e as fotos deste encontro."
  ],
  [
    "IMAGES D'AUJOURD'HUI, MÉMOIRES DE DEMAIN.",
    "IMAGENS DE HOJE, MEMÓRIAS DE AMANHÃ."
  ],
  [
    "RETOUR À L'ACCUEIL ↗",
    "VOLTAR AO INÍCIO ↗"
  ],
  [
    "GLISSER OU CLIQUER",
    "DESLIZE OU CLIQUE"
  ],
  [
    "GALERIE DU PROJET",
    "GALERIA DO PROJETO"
  ],
  [
    "LES IMAGES",
    "AS IMAGENS"
  ],
  [
    "FILM",
    "FILME"
  ],
  [
    "LA VIDÉO",
    "O VÍDEO"
  ],
  [
    "REGARDER LE FILM",
    "ASSISTIR AO FILME"
  ],
  [
    "Regarder sur YouTube",
    "Assistir no YouTube"
  ],
  [
    "GALERIE DE DÉMONSTRATION — PHOTOS À REMPLACER",
    "GALERIA DE DEMONSTRAÇÃO — SUBSTITUIR FOTOS"
  ],
  [
    "DOSSIER PRÊT À RECEVOIR VOS FICHIERS",
    "PROJETO PRONTO PARA RECEBER ARQUIVOS"
  ],
  [
    "PHOTOS DE DÉMONSTRATION",
    "FOTOS DE EXEMPLO"
  ],
  [
    "POUR ALLER PLUS LOIN",
    "SAIBA MAIS"
  ],
  [
    "À DÉCOUVRIR AUSSI",
    "EXPLORE TAMBÉM"
  ],
  [
    "← TOUS LES PROJETS",
    "← TODOS OS PROJETOS"
  ],
  [
    "LA COLLECTION ATTEND SES PREMIÈRES CARTES",
    "A COLEÇÃO AGUARDA SUAS PRIMEIRAS CARTAS"
  ],
  [
    "OUVERTURE DE LA COLLECTION…",
    "ABRINDO A COLEÇÃO…"
  ],
  [
    "VOS COORDONNÉES",
    "SEUS DADOS DE CONTATO"
  ],
  [
    "MODE DÉMONSTRATION",
    "MODO DE DEMONSTRAÇÃO"
  ],
  [
    "08 ÉQUIPEMENTS",
    "08 EQUIPAMENTOS"
  ],
  [
    "RÉINITIALISER ↺",
    "REDEFINIR ↺"
  ],
  [
    "emplacements équipés",
    "itens equipados"
  ],
  [
    "ÉQUIPEMENTS",
    "EQUIPAMENTOS"
  ],
  [
    "◈ PHOTO",
    "◈ FOTO"
  ],
  [
    "▶ VIDÉO",
    "▶ VÍDEO"
  ],
  [
    "✦ GRAPHISME",
    "✦ DESIGN GRÁFICO"
  ],
  [
    "PROJETS PHOTO",
    "PROJETOS DE FOTO"
  ],
  [
    "PROJETS VIDÉO",
    "PROJETOS DE VÍDEO"
  ],
  [
    "PROJETS GRAPHISME",
    "PROJETOS DE DESIGN"
  ],
  [
    "MA GALERIE",
    "MINHA GALERIA"
  ],
  [
    "MES PHOTOS",
    "MINHAS FOTOS"
  ],
  [
    "PHOTOS",
    "FOTOS"
  ],
  [
    "VIDÉOS",
    "VÍDEOS"
  ],
  [
    "VISUELS",
    "IMAGENS"
  ],
  [
    "CLIQUEZ POUR AGRANDIR",
    "CLIQUE PARA AMPLIAR"
  ],
  [
    "CLIQUEZ POUR OUVRIR",
    "CLIQUE PARA ABRIR"
  ],
  [
    "PHOTOGRAPHIE PRÉCÉDENTE",
    "FOTO ANTERIOR"
  ],
  [
    "PHOTOGRAPHIE SUIVANTE",
    "PRÓXIMA FOTO"
  ],
  [
    "PRÉCÉDENT",
    "ANTERIOR"
  ],
  [
    "SUIVANT",
    "PRÓXIMO"
  ],
  [
    "Agrandir la photo",
    "Ampliar a foto"
  ],
  [
    "Choisir une photographie",
    "Escolher uma fotografia"
  ],
  [
    "Choisir une photo",
    "Escolher uma foto"
  ],
  [
    "Visionneuse de photos",
    "Visualizador de fotos"
  ],
  [
    "Fermer la visionneuse",
    "Fechar o visualizador"
  ],
  [
    "Afficher la photo",
    "Exibir a foto"
  ],
  [
    "Lire la vidéo",
    "Reproduzir o vídeo"
  ],
  [
    "Votre navigateur ne prend pas en charge cette vidéo.",
    "Seu navegador não suporta este vídeo."
  ],
  [
    "Les médias de ce projet seront ajoutés prochainement.",
    "Os arquivos deste projeto serão adicionados em breve."
  ],
  [
    "AUCUN PROJET",
    "NENHUM PROJETO"
  ],
  [
    "AUCUNE PHOTO",
    "NENHUMA FOTO"
  ],
  [
    "AUCUNE VIDÉO",
    "NENHUM VÍDEO"
  ],
  [
    "IMAGES À VENIR",
    "IMAGENS EM BREVE"
  ],
  [
    "CHARGEMENT DES PROJETS",
    "CARREGANDO PROJETOS"
  ],
  [
    "CHARGEMENT…",
    "CARREGANDO…"
  ],
  [
    "RETOUR",
    "VOLTAR"
  ],
  [
    "DÉCOUVRIR",
    "DESCOBRIR"
  ],
  [
    "EN SAVOIR PLUS",
    "SAIBA MAIS"
  ],
  [
    "VOIR LE PROJET",
    "VER PROJETO"
  ],
  [
    "OUVRIR LE PROJET",
    "ABRIR PROJETO"
  ],
  [
    "DEMANDE DE DEVIS",
    "SOLICITAR ORÇAMENTO"
  ],
  [
    "PHOTOGRAPHE",
    "FOTÓGRAFO"
  ],
  [
    "VIDÉASTE",
    "VIDEOMAKER"
  ],
  [
    "PHOTOGRAPHIE ET VIDÉO",
    "FOTOGRAFIA E VÍDEO"
  ],
  [
    "LE CLASSEUR",
    "O ÁLBUM"
  ],
  [
    "TOURNER LA PAGE",
    "VIRAR A PÁGINA"
  ],
  [
    "PAGE SUIVANTE",
    "PRÓXIMA PÁGINA"
  ],
  [
    "PAGE PRÉCÉDENTE",
    "PÁGINA ANTERIOR"
  ],
  [
    "CARTE SUIVANTE",
    "PRÓXIMA CARTA"
  ],
  [
    "CARTE PRÉCÉDENTE",
    "CARTA ANTERIOR"
  ],
  [
    "OUVRIR LA FICHE",
    "ABRIR PERFIL"
  ],
  [
    "FERMER LA FICHE",
    "FECHAR PERFIL"
  ],
  [
    "LES RENCONTRES",
    "OS ENCONTROS"
  ],
  [
    "RECHERCHER UNE PERSONNE",
    "BUSCAR UMA PESSOA"
  ],
  [
    "RECHERCHER",
    "BUSCAR"
  ],
  [
    "TRIER",
    "ORDENAR"
  ],
  [
    "TOUTES LES RARETÉS",
    "TODAS AS RARIDADES"
  ],
  [
    "LÉGENDAIRES",
    "LENDÁRIAS"
  ],
  [
    "RARES",
    "RARAS"
  ],
  [
    "PEU COMMUNES",
    "INCOMUNS"
  ],
  [
    "COMMUNES",
    "COMUNS"
  ],
  [
    "RETOUR AU CLASSEUR",
    "VOLTAR AO ÁLBUM"
  ],
  [
    "APERÇU",
    "PRÉVIA"
  ],
  [
    "ÉQUIPEMENT AUDIO",
    "EQUIPAMENTO DE ÁUDIO"
  ],
  [
    "AUDIO",
    "ÁUDIO"
  ],
  [
    "LENTILLE",
    "LENTE"
  ],
  [
    "OBJECTIF",
    "LENTE"
  ],
  [
    "ACCESSOIRES",
    "ACESSÓRIOS"
  ],
  [
    "DANS LE SAC",
    "NA MOCHILA"
  ],
  [
    "AJOUTER AU SAC",
    "ADICIONAR À MOCHILA"
  ],
  [
    "RETIRER DU SAC",
    "RETIRAR DA MOCHILA"
  ],
  [
    "CONTACTEZ-MOI",
    "ENTRE EM CONTATO"
  ],
  [
    "ÉCRIVEZ-MOI",
    "FALE COMIGO"
  ],
  [
    "ENVOYER",
    "ENVIAR"
  ],
  [
    "VOTRE MESSAGE",
    "SUA MENSAGEM"
  ],
  [
    "ÉVÉNEMENT",
    "EVENTO"
  ],
  [
    "CRÉATION GRAPHIQUE",
    "DESIGN GRÁFICO"
  ],
  [
    "CRÉATIONS GRAPHIQUES",
    "CRIAÇÕES GRÁFICAS"
  ],
  [
    "TOUS LES PROJETS",
    "TODOS OS PROJETOS"
  ]
];
  const titlePairs = new Map([
    ['YRUZPHOTO — Prototype','YRUZPHOTO — Portfolio'],
    ['Portfolio — YRUZPHOTO','Portfolio — YRUZPHOTO'],
    ['Projet — YRUZPHOTO','Project — YRUZPHOTO'],
    ['Services — YRUZPHOTO','Services — YRUZPHOTO'],
    ['Mon équipement — YRUZPHOTO','My Gear — YRUZPHOTO'],
    ['Contact — YRUZPHOTO','Contact — YRUZPHOTO'],
    ['Le Pokédex — YRUZPHOTO','The Pokédex — YRUZPHOTO']
  ]);
  const ptTitlePairs = new Map([
    ['YRUZPHOTO — Prototype','YRUZPHOTO — Portfólio'],
    ['Portfolio — YRUZPHOTO','Portfólio — YRUZPHOTO'],
    ['Projet — YRUZPHOTO','Projeto — YRUZPHOTO'],
    ['Services — YRUZPHOTO','Serviços — YRUZPHOTO'],
    ['Mon équipement — YRUZPHOTO','Meu equipamento — YRUZPHOTO'],
    ['Contact — YRUZPHOTO','Contato — YRUZPHOTO'],
    ['Le Pokédex — YRUZPHOTO','A Pokédex — YRUZPHOTO']
  ]);
  let frenchTitle = null;
  function updateTitle(){
    const titles = lang==='pt-BR' ? ptTitlePairs : lang==='en' ? titlePairs : null;
    if(titles){
      const original = frenchTitle || document.title;
      const translated=titles.get(original);
      if(translated){frenchTitle=original;document.title=translated;}
    } else if(frenchTitle !== null){
      document.title=frenchTitle;frenchTitle=null;
    }
  }
  function translateDynamic(value) {
    let match;
    if (lang==='pt-BR') {
      if((match=/^(\d+)\s+VISUELS?\s*[·•]\s*CLIQUEZ POUR AGRANDIR$/i.exec(value)))return `${match[1]} IMAGENS · CLIQUE PARA AMPLIAR`;
      if((match=/^(\d+)\s+PHOTOS?\s*(?:[·•]\s*(\d+)\s+VIDÉOS?)?$/i.exec(value)))return `${match[1]} ${Number(match[1])===1?'FOTO':'FOTOS'}${match[2]?' · '+match[2]+' '+(Number(match[2])===1?'VÍDEO':'VÍDEOS'):''}`;
      if((match=/^(\d+)\s+ÉQUIPEMENTS?$/i.exec(value)))return `${match[1]} EQUIPAMENTOS`;
      if((match=/^(\d+)\s*\/\s*(\d+)\s+emplacements équipés$/i.exec(value)))return `${match[1]} / ${match[2]} ITENS EQUIPADOS`;
      if((match=/^Afficher la photo\s+(\d+)$/i.exec(value)))return `Exibir foto ${match[1]}`;
      if((match=/^Agrandir la photo\s+(\d+)(?:\s+sur\s+(\d+))?$/i.exec(value)))return `Ampliar foto ${match[1]}${match[2]?' de '+match[2]:''}`;
      if((match=/^Lire la vidéo\s+(.+)$/i.exec(value)))return `Reproduzir vídeo: ${match[1]}`;
      return null;
    }
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
  const ptDict = new Map(ptPairs.map(([fr,pt])=>[normalized(fr),pt]));
  const translation = value => (lang === 'pt-BR' ? ptDict : dict).get(normalized(value)) || translateDynamic(normalized(value));
  const tracked=new Map();
  const translatedAttrs=new Map();
  let observer,processing=false;
  const skip=node=>!node.parentElement||node.parentElement.closest('script,style,noscript,textarea,code,pre,[contenteditable],.yruz-lang-switch,#studioRoot');
  function translateTextNode(node){
    if(skip(node))return;
    const raw=node.nodeValue||'';
    if(!raw.trim())return;
    const prior=tracked.get(node);
    if(prior && raw===prior.translated)return;
    const original=prior && raw===prior.fr ? prior.fr : raw;
    const translated=translation(original);
    if(!translated)return;
    const final=original.replace(/^(\s*)[\s\S]*?(\s*)$/,(_all,prefix,suffix)=>prefix+translated+suffix);
    tracked.set(node,{fr:original,translated:final});
    if(raw!==final)node.nodeValue=final;
  }
  function translateAttributes(root){
    const nodes=[];if(root.nodeType===1)nodes.push(root);
    if(root.querySelectorAll)nodes.push(...root.querySelectorAll('[placeholder],[aria-label],[title]'));
    for(const el of nodes)for(const attr of ['placeholder','aria-label','title']){
      if(!el.hasAttribute?.(attr)||el.closest?.('.yruz-lang-switch'))continue;
      const current=el.getAttribute(attr);
      const previous=translatedAttrs.get(el)?.[attr];
      if(previous && current===previous.translated)continue;
      const original=previous && current===previous.fr ? previous.fr : current;
      const translated=translation(original);if(!translated)continue;
      if(!translatedAttrs.has(el))translatedAttrs.set(el,{});
      translatedAttrs.get(el)[attr]={fr:original,translated};
      if(current!==translated)el.setAttribute(attr,translated);
    }
  }
  function scan(root=document.body){
    if(lang==='fr'||!root)return;
    if(root.nodeType===3){translateTextNode(root);return}
    if(root.nodeType!==1)return;
    translateAttributes(root);
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    let node;while((node=walker.nextNode()))translateTextNode(node);
  }
  function restore(){
    for(const [node,state] of tracked)if(node.isConnected&&node.nodeValue===state.translated)node.nodeValue=state.fr;
    tracked.clear();
    for(const [el,values] of translatedAttrs)if(el.isConnected)for(const [key,value] of Object.entries(values))if(el.getAttribute(key)===value.translated)el.setAttribute(key,value.fr);
    translatedAttrs.clear();
  }
  const languages={
    fr:{flag:'🇫🇷',code:'FR',name:'Français'},
    en:{flag:'🇬🇧',code:'EN',name:'English'},
    'pt-BR':{flag:'🇧🇷',code:'BR',name:'Português (Brasil)'}
  };
  function closeLanguageMenus(){
    document.querySelectorAll('.yruz-lang-switch.is-open').forEach(el=>{
      el.classList.remove('is-open');
      el.querySelector('.yruz-lang-trigger')?.setAttribute('aria-expanded','false');
    });
  }
  function ui(){
    const host=document.querySelector('header#header')||document.querySelector('.pd-nav');
    if(!host||host.querySelector('.yruz-lang-switch'))return;
    const el=document.createElement('div');
    el.className='yruz-lang-switch';
    el.innerHTML=`<button class="yruz-lang-trigger" type="button" aria-label="Changer de langue" aria-haspopup="true" aria-expanded="false" aria-controls="yruz-lang-options"><span class="yruz-lang-current-flag" aria-hidden="true">🇫🇷</span><span class="yruz-lang-current-code">FR</span><svg class="yruz-lang-chevron" viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><path d="m3 6 5 5 5-5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg></button><div class="yruz-lang-options" id="yruz-lang-options" role="group" aria-label="Choisir une langue">${Object.entries(languages).map(([key,item])=>`<button type="button" data-lang="${key}" lang="${key}" aria-label="${item.name}"><span class="yruz-lang-flag" aria-hidden="true">${item.flag}</span><span class="yruz-lang-name">${item.name}</span><span class="yruz-lang-check" aria-hidden="true">✓</span></button>`).join('')}</div>`;
    el.addEventListener('click',event=>{
      const option=event.target.closest('[data-lang]');
      if(option){select(option.dataset.lang);closeLanguageMenus();return;}
      if(event.target.closest('.yruz-lang-trigger')){
        const opening=!el.classList.contains('is-open');
        closeLanguageMenus();
        el.classList.toggle('is-open',opening);
        el.querySelector('.yruz-lang-trigger').setAttribute('aria-expanded',String(opening));
      }
    });
    document.addEventListener('pointerdown',event=>{if(!el.contains(event.target))closeLanguageMenus()});
    document.addEventListener('keydown',event=>{if(event.key==='Escape'){closeLanguageMenus();el.querySelector('.yruz-lang-trigger')?.focus()}});
    host.append(el);
  }
  function updateButtons(){
    const current=languages[lang]||languages.fr;
    document.querySelectorAll('.yruz-lang-switch').forEach(el=>{
      const flag=el.querySelector('.yruz-lang-current-flag');
      const code=el.querySelector('.yruz-lang-current-code');
      const trigger=el.querySelector('.yruz-lang-trigger');
      if(flag)flag.textContent=current.flag;
      if(code)code.textContent=current.code;
      if(trigger)trigger.setAttribute('aria-label',`Langue : ${current.name}. Changer de langue`);
      el.querySelectorAll('[data-lang]').forEach(button=>{
        const active=button.dataset.lang===lang;
        button.classList.toggle('is-active',active);
        button.setAttribute('aria-pressed',String(active));
      });
    });
  }
  function select(value){
    const next=['fr','en','pt-BR'].includes(value)?value:'fr';if(next===lang)return;
    if(lang!=='fr')restore();
    lang=next;
    try{localStorage.setItem(KEY,lang)}catch{}
    document.documentElement.lang=lang;
    window.dispatchEvent(new CustomEvent('yruz:language-change',{detail:{lang}}));
    window.YRUZ_REAPPLY_CONTENT?.();
    if(lang!=='fr')scan();
    updateTitle();
    updateButtons();
  }
  window.YRUZ_LANG={current:()=>lang,select,refresh:()=>{if(lang!=='fr')scan();updateTitle();updateButtons()}};
  function start(){
    document.documentElement.lang=lang;ui();updateButtons();if(lang!=='fr')scan();updateTitle();
    observer=new MutationObserver(mutations=>{
      if(lang==='fr'||processing)return;
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
