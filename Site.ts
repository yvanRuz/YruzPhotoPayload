import type { GlobalConfig } from 'payload'

// Onglets de presentation : aucun changement de noms de champs,
// donc aucune nouvelle colonne PostgreSQL n'est requise.
export const Site: GlobalConfig = {
  slug: 'site',
  label: 'Gestion du site',
  admin: { group: 'YRUZPHOTO - Contenus' },
  access: { read: () => true, update: ({ req }) => Boolean(req.user) },
  fields: [
    {
      type: 'tabs',
      tabs: [
        { label: 'Accueil', fields: [
          { name: 'hero_subtitle', type: 'textarea', label: 'Texte sous YRUZPHOTO' },
          { name: 'home_image_1', type: 'upload', relationTo: 'media', label: 'Photo de fond 1' },
          { name: 'home_image_2', type: 'upload', relationTo: 'media', label: 'Photo de fond 2' },
        ] },
        { label: 'Portfolio', fields: [
          { name: 'works_title', type: 'text', label: 'Titre de la section Mes travaux' },
          { name: 'works_description', type: 'textarea', label: 'Presentation des travaux' },
        ] },
        { label: 'Services', fields: [
          { name: 'services_title', type: 'text', label: 'Titre de la section Services' },
          { name: 'services_description', type: 'textarea', label: 'Presentation des services' },
        ] },
        { label: 'Contact et liens', fields: [
          { name: 'contact_title', type: 'text', label: 'Titre de la section Contact' },
          { name: 'contact_intro', type: 'textarea', label: 'Texte de contact' },
          { name: 'contact_email', type: 'email', label: 'Adresse e-mail' },
          { name: 'instagram', type: 'text', label: 'Lien Instagram' },
        ] },
      ],
    },
  ],
}
