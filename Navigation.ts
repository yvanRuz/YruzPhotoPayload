import type { GlobalConfig } from 'payload'

const navLinks = [
  { label: 'ACCUEIL', url: 'index.html', enabled: true },
  { label: 'PORTFOLIO', url: 'portfolio.html', enabled: true },
  { label: 'EQUIPEMENT', url: 'equipement.html', enabled: true },
  { label: 'SERVICES', url: 'tarifs.html', enabled: true },
  { label: 'CONTACT', url: 'contact.html', enabled: true },
]

export const Navigation: GlobalConfig = {
  slug: 'navigation-site',
  label: 'Menu et liens du site',
  admin: { group: '03 - Navigation et reglages', description: 'Modifier les liens du menu, leur ordre et le bouton de contact. Enregistrer pour actualiser le site.' },
  access: { read: () => true, update: ({ req }) => Boolean(req.user) },
  fields: [
    { name: 'links', type: 'array', label: 'Menu principal (ordre modifiable)', defaultValue: navLinks, admin: { description: 'Deplacer, masquer ou modifier une entree du menu.' }, fields: [
      { name: 'label', type: 'text', label: 'Texte dans le menu', required: true },
      { name: 'url', type: 'text', label: 'Destination (exemple: portfolio.html ou https://...)', required: true },
      { name: 'enabled', type: 'checkbox', label: 'Afficher ce lien', defaultValue: true },
      { name: 'newTab', type: 'checkbox', label: 'Ouvrir dans un nouvel onglet', defaultValue: false },
    ] },
    { name: 'ctaLabel', type: 'text', label: 'Texte du bouton dans le menu', defaultValue: 'PARLONS DE VOTRE PROJET' },
    { name: 'ctaUrl', type: 'text', label: 'Lien du bouton', defaultValue: 'contact.html' },
    { name: 'instagramUrl', type: 'text', label: 'Lien Instagram (facultatif)' },
    { name: 'footerContactLabel', type: 'text', label: 'Footer - texte du lien Contact' },
    { name: 'footerContactUrl', type: 'text', label: 'Footer - destination du lien Contact' },
  ],
}
