import type { GlobalConfig } from 'payload'

// Existing field names only: no database migration required.
export const Site: GlobalConfig = {
  slug: 'site',
  label: 'Textes, fonds et coordonnées',
  admin: { group: '03 - Réglages existants' },
  access: { read: () => true, update: ({ req }) => Boolean(req.user) },
  fields: [{ type: 'tabs', tabs: [
    { label: 'Accueil', fields: [
      { name: 'hero_subtitle', type: 'textarea', label: 'Présentation sous le logo' },
      { name: 'home_image_1', type: 'upload', relationTo: 'media', label: 'Premier fond de l’accueil' },
      { name: 'home_image_2', type: 'upload', relationTo: 'media', label: 'Deuxième fond de l’accueil' },
    ] },
    { label: 'Portfolio et services', fields: [
      { name: 'works_title', type: 'text', label: 'Titre Mes travaux' },
      { name: 'works_description', type: 'textarea', label: 'Introduction des travaux' },
      { name: 'services_title', type: 'text', label: 'Titre des services' },
      { name: 'services_description', type: 'textarea', label: 'Introduction des services' },
    ] },
    { label: 'Contact', fields: [
      { name: 'contact_title', type: 'text', label: 'Titre contact' },
      { name: 'contact_intro', type: 'textarea', label: 'Texte contact' },
      { name: 'contact_email', type: 'email', label: 'Adresse e-mail' },
      { name: 'instagram', type: 'text', label: 'Lien Instagram' },
    ] },
  ] }],
}
