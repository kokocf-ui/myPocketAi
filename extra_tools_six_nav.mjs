export const EXTRA_TOOLS_SIX_NAV_SCRIPT=String.raw`
const EXTRA_TOOLS_V2_GROUPS=[
 {id:'docs',icon:'📄',ro:'Documente și fișiere',en:'Documents and files',descriptionRo:'Creare, scanare și organizare',descriptionEn:'Create, scan and organise',items:[
  ['documents','📝','Creează document','Create document','Editor de text și salvare PDF','Text editor and PDF export'],
  ['ocr','📷','Scanează și extrage text','Scan and read text','Fotografie sau imagine din galerie','Camera or gallery image'],
  ['my-documents','📚','Documentele mele','My documents','Biblioteca PDF existentă','Existing saved PDF library']]},
 {id:'creator',icon:'🌐',ro:'Creare pagini și imagini',en:'Websites and images',descriptionRo:'Generatorul existent',descriptionEn:'Existing creation tools',items:[
  ['creator-website','🌐','Creează site web','Create website','Generatorul de site-uri existent','Existing website builder'],
  ['creator-images','🪄','Creează sau editează imagini','Create or edit images','Generatorul și editorul de imagini','Existing image tools']]},
 {id:'ideas',icon:'💡',ro:'Idei și proiecte',en:'Ideas and projects',descriptionRo:'Planuri și dezvoltarea ideilor',descriptionEn:'Plans and idea development',items:[
  ['ideas','🧠','Dezvoltă o idee','Develop an idea','Transformă obiectivul într-un plan de acțiune','Turn a goal into an action plan']]}
];
let extraToolsV2ReturnGroup=null;
let extraToolsV2ActiveGroup=null;
function extraToolsV2Card(icon,ro,en,descriptionRo,descriptionEn,action){
 const b=document.createElement('button');b.type='button';b.className='education-card extra-tools-v2-card';
 const art=document.createElement('span');art.className='education-art';art.textContent=icon;
 const title=document.createElement('strong');title.textContent=learningLabel(ro,en);
 const desc=document.createElement('small');desc.textContent=learningLabel(descriptionRo,descriptionEn);
 b.append(art,title,desc);b.onclick=action;return b;
}
function extraToolsV2Screen(titleRo,titleEn,back){
 extraToolsStop();resetExtraToolsScreen();
 const root=$('view-module'),host=$('moduleContent');
 root.classList.remove('extra-tools-v2');
 root.classList.add('extra-tools-active','extra-tools-workspace','extra-tools-v2');
 $('moduleTitle').textContent=learningLabel(titleRo,titleEn);
 $('moduleLead').textContent='';host.replaceChildren();
 const head=document.createElement('div');head.className='education-toolbar extra-work-head';
 const backButton=extraToolsBtn(learningLabel('← Înapoi','← Back'),back,true);
 if(!extraToolsMountNavigation(root,backButton,head)){head.append(backButton);host.prepend(head);}
 const area=document.createElement('section');area.className='extra-tools-workarea extra-tools-v2-choices';
 const grid=document.createElement('div');grid.className='education-grid extra-tools-v2-grid';
 area.append(grid);host.append(area);
 return grid;
}
function extraToolsV2Main(){
 extraToolsV2ActiveGroup=null;extraToolsV2ReturnGroup=null;
 const grid=extraToolsV2Screen('Mai multe instrumente','More tools',()=>{
  const home=$('view-module')?.querySelector('.module-home-btn');if(home)home.click();
 });
 for(const group of EXTRA_TOOLS_V2_GROUPS){
  grid.append(extraToolsV2Card(group.icon,group.ro,group.en,group.descriptionRo,group.descriptionEn,
    ()=>extraToolsV2OpenGroup(group.id)));
 }
}
function extraToolsV2OpenGroup(id){
 const group=EXTRA_TOOLS_V2_GROUPS.find(item=>item.id===id);if(!group)return extraToolsV2Main();
 extraToolsV2ActiveGroup=id;extraToolsV2ReturnGroup=null;
 const grid=extraToolsV2Screen(group.ro,group.en,()=>extraToolsV2Main());
 for(const item of group.items){
  grid.append(extraToolsV2Card(item[1],item[2],item[3],item[4],item[5],()=>extraToolsV2Action(item[0],id)));
 }
}
function extraToolsV2Action(key,groupId){
 extraToolsV2ReturnGroup=groupId;
 if(key==='my-documents')return renderMyDocuments();
 if(key==='creator-website'||key==='creator-images'){
  extraToolsOpenWorkspace('creator');
  const work=extraToolsSession;
  if(work){if(key==='creator-website')extraCreatorWorkingWebsite(work);
   else extraCreatorWorkingImages(work);}
  return;
 }
 extraToolsOpenWorkspace(key);
}
// Upgrade the existing Tools entry screen after all global app functions have been declared.
queueMicrotask(()=>{
 if(typeof openModule!=='function'||typeof renderExtraToolsChoices!=='function')return;
 const nativeOpenModule=openModule;
 openModule=function(key){
  if(key==='tools'){extraToolsV2ReturnGroup=null;extraToolsV2ActiveGroup=null;}
  return nativeOpenModule(key);
 };
 renderExtraToolsChoices=function(){
  const target=extraToolsV2ReturnGroup;
  extraToolsV2ReturnGroup=null;
  if(target)return extraToolsV2OpenGroup(target);
  return extraToolsV2Main();
 };
});
`;
export const EXTRA_TOOLS_SIX_NAV_STYLE=String.raw`
/* Unified, screen-centred category selectors: do not change active navigation. */
#view-module.extra-tools-v2 .extra-tools-v2-choices{
 display:flex!important;flex-direction:column!important;align-items:center!important;
 justify-content:safe center!important;width:100%!important;max-width:100%!important;
 min-height:0!important;max-height:100%!important;overflow-y:auto!important;
 padding:clamp(8px,2dvh,24px) 7px!important;box-sizing:border-box!important;
}
#view-module.extra-tools-v2 .extra-tools-v2-grid{
 display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;
 grid-template-rows:none!important;grid-auto-rows:minmax(112px,auto)!important;
 align-content:center!important;justify-content:center!important;
 align-items:stretch!important;gap:clamp(9px,1.4dvh,16px)!important;
 width:min(100%,720px)!important;height:auto!important;min-height:0!important;
 margin:auto!important;padding:6px!important;overflow:visible!important;box-sizing:border-box!important;
}
#view-module.extra-tools-v2 .extra-tools-v2-card{
 display:flex!important;flex-direction:column!important;align-items:center!important;
 justify-content:center!important;text-align:center!important;width:100%!important;height:auto!important;
 min-width:0!important;min-height:112px!important;max-height:none!important;
 padding:12px 10px!important;gap:5px!important;
 border:1px solid #a46a80!important;border-radius:15px!important;
 background:linear-gradient(160deg,#173747,#102835)!important;
 box-shadow:0 3px 9px #0004!important;color:#f5fcff!important;
}
#view-module.extra-tools-v2 .extra-tools-v2-card:last-child:nth-child(odd){
 grid-column:1/-1!important;justify-self:center!important;width:calc(50% - 6px)!important;
}
#view-module.extra-tools-v2 .extra-tools-v2-card .education-art{
 display:block!important;align-self:center!important;margin:0!important;
 font-size:clamp(22px,3.6dvh,29px)!important;line-height:1.1!important;
}
#view-module.extra-tools-v2 .extra-tools-v2-card strong{
 display:block!important;min-width:0!important;
 font-size:clamp(13px,3.8vw,17px)!important;line-height:1.2!important;
 text-align:center!important;overflow-wrap:anywhere!important;
}
#view-module.extra-tools-v2 .extra-tools-v2-card small{
 display:block!important;color:#b5d2db!important;font-size:clamp(11px,2.7vw,13px)!important;
 line-height:1.26!important;text-align:center!important;
}
/* Reuse central alignment for Education / Organisation selection cards too. */
#view-module.learning-choose .education-card,
#view-module.organize-choose .education-card{
 align-items:center!important;justify-content:center!important;text-align:center!important;
}
#view-module.learning-choose .education-card strong,
#view-module.learning-choose .education-card small,
#view-module.organize-choose .education-card strong,
#view-module.organize-choose .education-card small{text-align:center!important;width:100%!important}
#view-module.learning-choose .education-grid{max-width:820px!important;margin-left:auto!important;margin-right:auto!important}
@media(max-height:620px){
 #view-module.extra-tools-v2 .extra-tools-v2-choices{justify-content:flex-start!important}
 #view-module.extra-tools-v2 .extra-tools-v2-grid{margin:0 auto!important;grid-auto-rows:minmax(104px,auto)!important}
 #view-module.extra-tools-v2 .extra-tools-v2-card{min-height:104px!important}
}


`;
