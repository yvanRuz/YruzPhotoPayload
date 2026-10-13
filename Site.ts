import type { GlobalConfig } from 'payload'
export const Site:GlobalConfig={slug:'site',label:'Textes et coordonnées',access:{read:()=>true,update:({req})=>Boolean(req.user)},fields:[
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
{name:'home_image_2',type:'upload',relationTo:'media',label:'Fond accueil 2'}
]}
