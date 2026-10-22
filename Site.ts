import type { GlobalConfig } from 'payload'
export const Site:GlobalConfig={slug:'site',label:'Personnalisation du site',admin:{group:'Gestion du site'},access:{read:()=>true,update:({req})=>Boolean(req.user)},fields:[
{name:'hero_subtitle',type:'textarea',label:'Sous-titre d’accueil'},
{name:'works_title',type:'text',label:'Titre travaux'},
{name:'works_description',type:'textarea',label:'Description travaux'},
{name:'services_title',type:'text',label:'Titre services'},
{name:'services_description',type:'textarea',label:'Description services'},
{name:'contact_title',type:'text',label:'Titre contact'},
{name:'contact_intro',type:'textarea',label:'Introduction contact'},
{name:'contact_email',type:'email',label:'Adresse e-mail'},
{name:'instagram',type:'text',label:'Lien Instagram'},
{name:'home_image_1',type:'upload',relationTo:'media',label:'Fond accueil 1'},
{name:'home_image_2',type:'upload',relationTo:'media',label:'Fond accueil 2'},
// YRUZPHOTO V34 — champs complémentaires, les champs historiques restent inchangés.
{name:'header_cta_label',type:'text',label:'Menu — texte du bouton contact'},
{name:'header_cta_url',type:'text',label:'Menu — destination du bouton contact'},
{name:'instagram_label',type:'text',label:'Réseaux — libellé Instagram'},
{name:'portfolio_intro',type:'textarea',label:'Portfolio — introduction'},
{name:'services_photo_image',type:'upload',relationTo:'media',label:'Services — image PHOTO'},
{name:'services_photo_caption',type:'text',label:'Services — légende PHOTO'},
{name:'services_video_image',type:'upload',relationTo:'media',label:'Services — image VIDÉO'},
{name:'services_video_caption',type:'text',label:'Services — légende VIDÉO'},
{name:'services_design_image',type:'upload',relationTo:'media',label:'Services — image DESIGN'},
{name:'services_design_caption',type:'text',label:'Services — légende DESIGN'},
{name:'story_title_1',type:'text',label:'Mon histoire — titre chapitre 1'},
{name:'story_text_1',type:'textarea',label:'Mon histoire — texte chapitre 1'},
{name:'story_image_1',type:'upload',relationTo:'media',label:'Mon histoire — image chapitre 1'},
{name:'story_title_2',type:'text',label:'Mon histoire — titre chapitre 2'},
{name:'story_text_2',type:'textarea',label:'Mon histoire — texte chapitre 2'},
{name:'story_image_2',type:'upload',relationTo:'media',label:'Mon histoire — image chapitre 2'},
{name:'story_title_3',type:'text',label:'Mon histoire — titre chapitre 3'},
{name:'story_text_3',type:'textarea',label:'Mon histoire — texte chapitre 3'},
{name:'story_image_3',type:'upload',relationTo:'media',label:'Mon histoire — image chapitre 3'},
{name:'contact_instagram_cta',type:'text',label:'Contact — texte du lien Instagram'},
{name:'seo_home_title',type:'text',label:'Référencement — titre page accueil'},
{name:'seo_home_description',type:'textarea',label:'Référencement — description accueil'}

,{name:'nav_home_label',type:'text',label:'Menu — Accueil'}
,{name:'nav_portfolio_label',type:'text',label:'Menu — Portfolio'}
,{name:'nav_services_label',type:'text',label:'Menu — Services'}
,{name:'nav_equipment_label',type:'text',label:'Menu — Équipement'}
,{name:'nav_contact_label',type:'text',label:'Menu — Contact'}
,{name:'services_photo_description',type:'textarea',label:'Services — description PHOTO'}
,{name:'services_video_description',type:'textarea',label:'Services — description VIDÉO'}
,{name:'services_design_description',type:'textarea',label:'Services — description DESIGN'}
]}
