# YRUZPHOTO V32 – Migration vers Payload CMS

Cette version transforme la **V31** en projet **Next.js + Payload 3 + PostgreSQL + Vercel Blob**, tout en servant l'interface HTML/CSS/JS existante. La page `/admin` devient une vraie administration Payload.

## Préparation

1. Créer un **nouveau dépôt / une branche de test**, ne pas remplacer immédiatement le site public.
2. Prévoir une base PostgreSQL hébergée (ex. Neon), et créer une base **séparée de toute base professionnelle**.
3. Sur Vercel, connecter un stockage **Blob**. Copier dans les variables d'environnement (Production et Preview) `DATABASE_URL`, `PAYLOAD_SECRET` et `BLOB_READ_WRITE_TOKEN`. La clé `PAYLOAD_SECRET` doit être longue et aléatoire, ne jamais la commiter.
4. Copier `.env.example` vers `.env.local` sur le PC pour travailler localement (Node ≥20.18.1).
5. `npm install` puis `npm run dev` pour la première initialisation de schéma en **environnement local** (synchronisation automatique activée uniquement en développement). Pour la production, générer et appliquer des migrations PostgreSQL (`npm run migrate:create`, puis `npm run migrate`) avant de servir les requêtes.
6. Ouvrir `http://localhost:3000/admin` et créer le compte administrateur.
7. Effectuer `npm run seed` **une seule fois, sur la base locale**, après les migrations. Cela ajoute les neuf projets, dont les seize photos Le Mans qui sont déjà présentes dans `public/assets/projects/mans-nuit/`.
8. Vérifier `http://localhost:3000`, `/portfolio.html`, `projet.html?id=mans-nuit`, `/admin`, et les images.
9. Déployer ensuite ce projet **sur un projet Vercel de test** comme application Next.js (Framework Next.js, build `npm run build`, pas de dossier `dist`).

## Utilisation

- Admin → Médiathèque : importer photos. En production, Blob stocke les fichiers (upload direct).
- Admin → Projets photo / vidéo : titre, catégorie, couverture, galerie, ordre, publication.
- Admin → Textes et coordonnées : titres, adresse e-mail, Instagram, les **deux photos de fond d'accueil** (importer dans la médiathèque).
- Après enregistrement, les routes `/data.js` et `/site-config.js` délivrent les dernières données au visiteur sans commit GitHub.
- Les photos historiques incluses avec le projet fonctionnent même avant l'import via leur chemin `legacyUrl`. Pour un nouveau projet, utiliser les images de la médiathèque.

## Important avant production

- Le contenu public actuel reste chargé depuis les pages existantes, mais la conversion en Next.js est nouvelle et **doit être vérifiée dans le navigateur**.
- Les migrations Payload doivent être mises en place et validées sur la base de test.
- Le premier compte administrateur doit être créé depuis un environnement sécurisé et la création de comptes doit ensuite être maîtrisée.
- Les images de `public/assets/` sont versionnées avec le site; les nouveaux uploads doivent aller dans Blob.
- Le formulaire Contact continue d'ouvrir le logiciel de messagerie (aucun service d'envoi n'est ajouté).
- Le back-office Payload n'est pas un éditeur visuel de CSS : il gère les contenus définis dans les collections.
- Ne pas publier tant que les tests de projet, de médias, de connexion, de sauvegarde et de responsive ne sont pas validés.

## État de vérification

Source générée. Sans accès aux comptes Vercel/DB/Blob ni téléchargement des dépendances, le serveur complet **n'a pas été exécuté**. Les vérifications de production restent nécessaires.
