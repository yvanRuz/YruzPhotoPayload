import type { CollectionConfig } from 'payload'

// Interface en onglets, memes identifiants de champs que la version en ligne.
export const Projects: CollectionConfig = {
  slug: 'projects',
  labels: { singular: 'Reportage', plural: 'Reportages photo et video' },
  admin: {
    group: 'YRUZPHOTO - Contenus',
    useAsTitle: 'title',
    defaultColumns: ['title', 'mode', 'order', 'published'],
    description: 'Creez un reportage, choisissez sa couverture, ses photos et sa visibilite sur le site.',
  },
  access: {
    read: ({ req }) => req.user ? true : { published: { equals: true } },
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    { type: 'tabs', tabs: [
      { label: 'Informations', fields: [
        { name: 'title', type: 'text', label: 'Titre du reportage', required: true },
        { name: 'slug', type: 'text', label: 'Identifiant URL', unique: true, required: true,
          validate: (v: any) => typeof v === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v) || 'Utiliser uniquement a-z, chiffres et tirets.' },
        { name: 'mode', type: 'select', label: 'Type de reportage', required: true, defaultValue: 'photo',
          options: [{ label: 'Photo', value: 'photo' }, { label: 'Video', value: 'video' }] },
        { name: 'category', type: 'text', label: 'Categorie' },
      ] },
      { label: 'Photos et video', fields: [
        { name: 'cover', type: 'upload', relationTo: 'media', label: 'Photographie de couverture' },
        { name: 'legacyCover', type: 'text', label: 'Ancienne couverture (laisser si existante)', admin: { description: 'Pour les projets historiques uniquement.' } },
        { name: 'gallery', type: 'array', label: 'Galerie de photos - ordre modifiable',
          fields: [
            { name: 'photo', type: 'upload', relationTo: 'media', label: 'Photographie' },
            { name: 'legacyUrl', type: 'text', label: 'Ancien chemin image', admin: { description: 'Conserver pour les photos importees avec les anciennes versions.' } },
          ] },
        { name: 'video', type: 'text', label: 'Lien ou chemin de la video' },
      ] },
      { label: 'Publication', fields: [
        { name: 'order', type: 'number', label: 'Ordre dans le portfolio', defaultValue: 10, required: true },
        { name: 'published', type: 'checkbox', label: 'Afficher sur le site', defaultValue: true },
      ] },
    ] },
  ],
}
