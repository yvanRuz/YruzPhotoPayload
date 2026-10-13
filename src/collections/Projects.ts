import type { CollectionConfig } from 'payload'
export const Projects:CollectionConfig={
 slug:'projects',labels:{singular:'Projet',plural:'Projets photo / vidéo'},admin:{useAsTitle:'title',defaultColumns:['title','mode','order','published']},
 access:{read:({req})=>req.user ? true : {published:{equals:true}},create:({req})=>Boolean(req.user),update:({req})=>Boolean(req.user),delete:({req})=>Boolean(req.user)},
 fields:[
  {name:'slug',type:'text',label:'Identifiant URL',unique:true,required:true,validate:(v:any)=>typeof v==='string'&&/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v)||'Utiliser uniquement a-z, chiffres et tirets.'},
  {name:'title',type:'text',label:'Titre',required:true},
  {name:'mode',type:'select',label:'Format',required:true,defaultValue:'photo',options:[{label:'Photo',value:'photo'},{label:'Vidéo',value:'video'}]},
  {name:'category',type:'text',label:'Catégorie'},
  {name:'cover',type:'upload',relationTo:'media',label:'Couverture depuis la médiathèque'},
  {name:'legacyCover',type:'text',label:'Couverture historique (automatique)'},
  {name:'gallery',type:'array',label:'Galerie / ordre des photos',fields:[{name:'photo',type:'upload',relationTo:'media',label:'Photographie'},{name:'legacyUrl',type:'text',label:'Chemin historique'}]},
  {name:'video',type:'text',label:'Adresse de la vidéo'},
  {name:'order',type:'number',label:'Ordre',defaultValue:10,required:true},
  {name:'published',type:'checkbox',label:'Visible sur le site',defaultValue:true}
 ]
}
