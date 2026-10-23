import type { Block, CollectionConfig, Field } from 'payload'

// The site stays static in design; editors control the order and content here.
// Payload's native Blocks field supplies sortable, duplicable, collapsible sections.
const linkValid = (value: unknown): true | string => {
  if (value === undefined || value === null || value === '') return true
  if (typeof value !== 'string') return 'Saisir un lien valide.'
  const val = value.trim()
  if (/^(https?:\/\/[^\s<>"'`]+|mailto:[^\s<>"'`]+|\/?(?:index|portfolio|projet|tarifs|equipement|contact)\.html(?:[?#][^\s<>"'`]*)?|\/?(?:#[-\w]+)|\/)$/i.test(val)) return true
  return 'Utiliser https://, mailto:, /, #section ou une page interne (.html).'
}

const buttonFields: Field[] = [
  { name: 'buttonLabel', label: 'Texte du bouton (facultatif)', type: 'text' },
  { name: 'buttonUrl', label: 'Destination du bouton', type: 'text', validate: linkValid, admin: { description: 'Exemple : portfolio.html, contact.html ou https://exemple.fr' } },
]

const TextBlock: Block = {
  slug: 'texte',
  labels: { singular: 'Titre / texte / bouton', plural: 'Textes' },
  fields: [
    { name: 'eyebrow', label: 'Petit surtitre', type: 'text' },
    { name: 'title', label: 'Grand titre', type: 'text', required: true },
    { name: 'body', label: 'Texte', type: 'textarea' },
    { name: 'align', label: 'Alignement', type: 'select', defaultValue: 'left', options: [{ label: 'A gauche', value: 'left' }, { label: 'Centre', value: 'center' }] },
    ...buttonFields,
  ],
}

const ImageBlock: Block = {
  slug: 'photoTexte',
  labels: { singular: 'Photo + texte', plural: 'Photos et textes' },
  fields: [
    { name: 'image', type: 'upload', relationTo: 'media', label: 'Photographie', required: true },
    { name: 'title', type: 'text', label: 'Titre' },
    { name: 'description', type: 'textarea', label: 'Description' },
    { name: 'caption', type: 'text', label: 'Legende de la photographie' },
    { name: 'placement', type: 'select', label: 'Position de la photo', defaultValue: 'left', options: [{ label: 'A gauche', value: 'left' }, { label: 'A droite', value: 'right' }] },
    ...buttonFields,
  ],
}

const CarouselBlock: Block = {
  slug: 'carrouselPhotos',
  labels: { singular: 'Carrousel de photos', plural: 'Carrousels de photos' },
  fields: [
    { name: 'title', type: 'text', label: 'Titre du carrousel' },
    { name: 'description', type: 'textarea', label: 'Description (facultative)' },
    { name: 'slides', type: 'array', label: 'Photographies - deplacer pour changer l ordre', minRows: 1, admin: { description: 'Chaque photo vient de la Mediatheque (Vercel Blob). Faites glisser les lignes pour changer leur ordre.' }, fields: [
      { name: 'image', type: 'upload', relationTo: 'media', label: 'Photographie', required: true },
      { name: 'caption', type: 'text', label: 'Legende (facultative)' },
      { name: 'link', type: 'text', label: 'Lien au clic (facultatif)', validate: linkValid },
    ] },
  ],
}

const GridBlock: Block = {
  slug: 'grillePhotos',
  labels: { singular: 'Grille / mosaique de photos', plural: 'Grilles photos' },
  fields: [
    { name: 'title', type: 'text', label: 'Titre de la galerie' },
    { name: 'columns', type: 'select', label: 'Colonnes sur ordinateur', defaultValue: '3', options: [
      { label: '2 colonnes', value: '2' }, { label: '3 colonnes', value: '3' }, { label: '4 colonnes', value: '4' },
    ] },
    { name: 'photos', type: 'array', label: 'Images', minRows: 1, fields: [
      { name: 'image', type: 'upload', relationTo: 'media', required: true, label: 'Photo' },
      { name: 'caption', type: 'text', label: 'Legende' },
    ] },
  ],
}

const ProjectsBlock: Block = {
  slug: 'carrouselProjets',
  labels: { singular: 'Carrousel de reportages', plural: 'Carrousels de reportages' },
  fields: [
    { name: 'title', type: 'text', label: 'Titre de la section', defaultValue: 'DECOUVRIR MES REPORTAGES' },
    { name: 'mode', type: 'select', label: 'Projets a afficher', defaultValue: 'photo', options: [
      { label: 'Photos uniquement', value: 'photo' }, { label: 'Videos uniquement', value: 'video' }, { label: 'Photos et videos', value: 'all' },
    ] },
    { name: 'selection', type: 'select', label: 'Choix des projets', defaultValue: 'auto', options: [
      { label: 'Automatique (tous les projets publies)', value: 'auto' }, { label: 'Selection manuelle', value: 'manual' },
    ] },
    { name: 'chosenProjects', type: 'relationship', relationTo: 'projects', hasMany: true, label: 'Selectionner les reportages', admin: { condition: (_data, siblingData) => siblingData?.selection === 'manual' } },
    { name: 'limit', type: 'number', label: 'Nombre maximum de projets', defaultValue: 8, min: 1, max: 30 },
  ],
}

const ButtonsBlock: Block = {
  slug: 'boutons',
  labels: { singular: 'Boutons / liens', plural: 'Boutons' },
  fields: [
    { name: 'title', type: 'text', label: 'Titre (facultatif)' },
    { name: 'buttons', type: 'array', label: 'Boutons', minRows: 1, fields: [
      { name: 'label', type: 'text', label: 'Texte affiche', required: true },
      { name: 'url', type: 'text', label: 'Lien', required: true, validate: linkValid },
      { name: 'style', type: 'select', label: 'Apparence', defaultValue: 'primary', options: [{ label: 'Principal', value: 'primary' }, { label: 'Secondaire', value: 'secondary' }] },
    ] },
  ],
}

export const SitePages: CollectionConfig = {
  slug: 'site-pages',
  labels: { singular: 'Page du site', plural: 'Pages du site' },
  admin: {
    group: '01 - Pages du site',
    useAsTitle: 'title',
    defaultColumns: ['title', 'pageKey', 'published', 'updatedAt'],
    description: 'Ouvrir Accueil, Portfolio ou Services, ajouter des blocs, puis enregistrer. Le site est mis a jour sans nouveau deploiement.',
  },
  access: {
    read: ({ req }) => req.user ? true : { published: { equals: true } },
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: 'title', type: 'text', required: true, label: 'Nom dans le back-office', admin: { description: 'Exemple : Portfolio. Ne change pas le nom du fichier HTML.' } },
    { name: 'pageKey', type: 'select', required: true, unique: true, label: 'Page reliee au site', options: [
      { label: 'Accueil', value: 'accueil' }, { label: 'Portfolio', value: 'portfolio' }, { label: 'Services', value: 'services' },
      { label: 'Mon histoire (sur accueil)', value: 'histoire' }, { label: 'Contact', value: 'contact' }, { label: 'Equipement', value: 'equipement' },
    ] },
    { type: 'tabs', tabs: [
      { label: '01 - Textes et boutons', fields: [
        { name: 'heading', type: 'text', label: 'Titre principal de cette page (facultatif)', admin: { description: 'Si vide, le titre actuel reste affiche.' } },
        { name: 'intro', type: 'textarea', label: 'Paragraphe de presentation (facultatif)' },
        { name: 'mainButtonLabel', type: 'text', label: 'Accueil - texte du bouton principal', admin: { condition: data => data?.pageKey === 'accueil' } },
        { name: 'mainButtonUrl', type: 'text', label: 'Accueil - lien du bouton principal', validate: linkValid, admin: { condition: data => data?.pageKey === 'accueil' } },
        { name: 'secondButtonLabel', type: 'text', label: 'Accueil - texte du 2e bouton', admin: { condition: data => data?.pageKey === 'accueil' } },
        { name: 'secondButtonUrl', type: 'text', label: 'Accueil - lien du 2e bouton', validate: linkValid, admin: { condition: data => data?.pageKey === 'accueil' } },
        { name: 'bottomButtonLabel', type: 'text', label: 'Bouton de bas de page - texte', admin: { condition: data => ['portfolio', 'services', 'equipement'].includes(data?.pageKey) } },
        { name: 'bottomButtonUrl', type: 'text', label: 'Bouton de bas de page - lien', validate: linkValid, admin: { condition: data => ['portfolio', 'services', 'equipement'].includes(data?.pageKey) } },
      ] },
      { label: '02 - Ajouter des sections', fields: [
        { name: 'sections', type: 'blocks', label: 'Sections affichees sur le site (ordre modifiable)', blocks: [TextBlock, ImageBlock, CarouselBlock, GridBlock, ProjectsBlock, ButtonsBlock],
          admin: { initCollapsed: true, description: 'Ajouter un bloc, choisir ses photos ou liens, et faire glisser pour reordonner. Aucun code necessaire.' } },
      ] },
      { label: '03 - Publication', fields: [
        { name: 'published', type: 'checkbox', defaultValue: true, label: 'Activer les modifications de cette page', admin: { description: 'Decocher pour conserver la page actuelle sans afficher ses blocs CMS.' } },
      ] },
    ] },
  ],
}
