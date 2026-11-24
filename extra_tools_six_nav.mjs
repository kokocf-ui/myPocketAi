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
  ['ideas','🧠','Dezvoltă o idee','Develop an idea','Transformă obiectivul într-un plan de acțiune','Turn a goal into an action plan']]},
 {id:'fun',icon:'✨',ro:'Divertisment',en:'Just for fun',descriptionRo:'Zodii, maxime, bancuri și jocuri',descriptionEn:'Zodiac, quotes, jokes and games',items:[
  ['fun-astro','☀️','Astrologie și zodii','Astrology and zodiac','Horoscop și astrogramă simplificată','Horoscope and simplified birth chart'],
  ['fun-maxim','📜','Maxima zilei','Quote of the day','O cugetare nouă în fiecare zi','One thought each day'],
  ['fun-jokes','😄','Bancul zilei','Joke of the day','Bancuri și colecție offline','Jokes and offline collection'],
  ['fun-puzzles','🧩','Integrame, rebus și Sudoku','Crosswords and Sudoku','Jocuri offline pentru relaxare','Offline logic and word games']]}
];
let extraToolsV2ReturnGroup=null;
let extraToolsV2ActiveGroup=null;
function extraToolsV2Icon(id){
 const p={docs:'<rect x="30" y="15" width="62" height="90" rx="7"/><path d="M43 35h36M43 49h36M43 63h29M43 77h36"/>',creator:'<circle cx="62" cy="62" r="43"/><path d="M19 62h86M62 19c-20 20-20 66 0 86M62 19c20 20 20 66 0 86M29 38h66M29 87h66"/>',ideas:'<path d="M42 81c-28-28-10-67 20-67s48 39 20 67l-4 10H46zM46 98h32M52 108h20"/><path d="M53 57l9 10 10-10M62 67v18"/>',fun:'<circle cx="62" cy="62" r="40"/><path d="m62 26 10 21 23 3-17 16 4 23-20-11-20 11 4-23-17-16 23-3z"/>',astro:'<circle cx="62" cy="62" r="32"/><circle cx="62" cy="62" r="12"/><path d="M62 13v13M62 98v13M13 62h13M98 62h13"/>',maxim:'<path d="M28 18h68v88H28zM41 37h42M41 53h42M41 69h32M41 85h28"/>',jokes:'<circle cx="62" cy="62" r="39"/><path d="M44 50h8M72 50h8M39 73c11 23 35 23 46 0"/>',puzzles:'<rect x="24" y="24" width="76" height="76" rx="4"/><path d="M49 24v76M75 24v76M24 49h76M24 75h76"/>'};
 const k=id==='fun-astro'?'astro':id==='fun-maxim'?'maxim':id==='fun-jokes'?'jokes':id==='fun-puzzles'?'puzzles':id;
 return '<svg viewBox="0 0 124 124" width="110" height="110" fill="none" stroke="#8cd8e2" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true">'+(p[k]||p.docs)+'</svg>';
}
function extraToolsV2Card(icon,ro,en,descriptionRo,descriptionEn,action,key){
 const b=document.createElement('button');b.type='button';b.className='education-card extra-tools-v2-card';
 const art=document.createElement('span');art.className='extra-tools-v2-artwork';art.innerHTML=extraToolsV2Icon(key||'docs');
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
    ()=>extraToolsV2OpenGroup(group.id),group.id));
 }
}
function extraToolsV2OpenGroup(id){
 const group=EXTRA_TOOLS_V2_GROUPS.find(item=>item.id===id);if(!group)return extraToolsV2Main();
 extraToolsV2ActiveGroup=id;extraToolsV2ReturnGroup=null;
 const grid=extraToolsV2Screen(group.ro,group.en,()=>extraToolsV2Main());
 for(const item of group.items){
  grid.append(extraToolsV2Card(item[1],item[2],item[3],item[4],item[5],()=>extraToolsV2Action(item[0],id),item[0]));
 }
}
function extraToolsV2Action(key,groupId){
 extraToolsV2ReturnGroup=groupId;
 if(key.startsWith('fun-'))return extraFunOpen(key);
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

/* Only More tools adopts the large cards from the journey selector. */
#view-module.extra-tools-v2 .extra-tools-v2-choices{justify-content:flex-start!important;overflow-y:auto!important;overscroll-behavior:contain!important;padding:12px 9px 22px!important}
#view-module.extra-tools-v2 .extra-tools-v2-grid{
 display:grid!important;grid-template-columns:minmax(0,1fr)!important;grid-auto-rows:auto!important;
 align-content:start!important;width:min(100%,680px)!important;margin:0 auto!important;
 padding:5px 4px 20px!important;gap:15px!important;
}
#view-module.extra-tools-v2 .extra-tools-v2-card,
#view-module.extra-tools-v2 .extra-tools-v2-card:last-child:nth-child(odd){
 width:100%!important;min-height:183px!important;max-height:none!important;
 grid-column:auto!important;justify-self:stretch!important;display:flex!important;
 flex-direction:column!important;align-items:center!important;justify-content:center!important;
 margin:0!important;padding:14px!important;gap:6px!important;text-align:center!important;
 border:2px solid #a46d83!important;border-radius:24px!important;
 background:linear-gradient(145deg,#193c50,#122c3b)!important;color:#f6fbff!important;
 box-shadow:0 5px 0 #061522,0 10px 15px #0007!important;
}
#view-module.extra-tools-v2 .extra-tools-v2-card:active{transform:scale(.985)}
#view-module.extra-tools-v2 .extra-tools-v2-card:focus-visible{outline:3px solid #91dce5!important;outline-offset:2px}
#view-module.extra-tools-v2 .extra-tools-v2-artwork{display:flex!important;align-items:center!important;justify-content:center!important;height:97px!important;width:114px!important}
#view-module.extra-tools-v2 .extra-tools-v2-artwork svg{height:100%;max-width:100%}
#view-module.extra-tools-v2 .extra-tools-v2-card strong{font-size:clamp(19px,5.3vw,24px)!important;line-height:1.15!important}
#view-module.extra-tools-v2 .extra-tools-v2-card small{font-size:clamp(12px,3vw,15px)!important;max-width:95%!important}
@media(max-height:620px){#view-module.extra-tools-v2 .extra-tools-v2-card{min-height:155px!important}#view-module.extra-tools-v2 .extra-tools-v2-grid{grid-auto-rows:auto!important}}
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
