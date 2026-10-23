import type { CollectionConfig } from 'payload'

// Only re-groups existing fields. No SQL schema change.
export const Projects: CollectionConfig = {
  slug: 'projects',
  labels: { singular: 'Reportage', plural: 'Reportages photo / vidéo' },
  admin: { group: '02 - Projets et photos', useAsTitle: 'title', defaultColumns: ['title', 'mode', 'order', 'published'] },
  access: {
    read: ({ req }) => req.user ? true : { published: { equals: true } },
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [{ type: 'tabs', tabs: [
    { label: '01 - Présentation', fields: [
      { name: 'title', type: 'text', label: 'Titre du reportage', required: true },
      { name: 'slug', type: 'text', label: 'Identifiant du projet dans l’URL', unique: true, required: true,
        validate: (value: any) => typeof value === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) || 'Utiliser uniquement a-z, chiffres et tirets.' },
      { name: 'mode', type: 'select', label: 'Type', defaultValue: 'photo', required: true,
        options: [{ label: 'Photographie', value: 'photo' }, { label: 'Vidéo', value: 'video' }] },
      { name: 'category', type: 'text', label: 'Catégorie' },
    ] },
    { label: '02 - Photos et vidéos', fields: [
      { name: 'cover', type: 'upload', relationTo: 'media', label: 'Photo de couverture' },
      { name: 'legacyCover', type: 'text', label: 'Ancienne couverture (projets déjà importés)' },
      { name: 'gallery', type: 'array', label: 'Photographies de la galerie — ordre modifiable',
        fields: [
          { name: 'photo', type: 'upload', relationTo: 'media', label: 'Photo issue de la médiathèque' },
          { name: 'legacyUrl', type: 'text', label: 'Ancien fichier (si présent)' },
        ] },
      { name: 'video', type: 'text', label: 'Adresse ou chemin du fichier vidéo' },
    ] },
    { label: '03 - Publication', fields: [
      { name: 'order', type: 'number', label: 'Ordre dans le portfolio', required: true, defaultValue: 10 },
      { name: 'published', type: 'checkbox', label: 'Afficher sur le site', defaultValue: true },
    ] },
  ] }],
}
