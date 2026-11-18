export const EXTRA_TOOLS_SIX_NAV_SCRIPT=String.raw`
const EXTRA_TOOLS_V2_GROUPS=[
 {id:'docs',icon:'📄',ro:'Documente și fișiere',en:'Documents and files',descriptionRo:'Creare, scanare și organizare',descriptionEn:'Create, scan and organise',items:[
  ['documents','📝','Creează document','Create document','Editor de text și salvare PDF','Text editor and PDF export'],
  ['ocr','📷','Scanează și extrage text','Scan and read text','Fotografie sau imagine din galerie','Camera or gallery image'],
  ['my-documents','📚','Documentele mele','My documents','Biblioteca PDF existentă','Existing saved PDF library']]},
 {id:'translate',icon:'🌍',ro:'Traduceri inteligente',en:'Smart translations',descriptionRo:'Traducere asistată de Eva',descriptionEn:'Eva-assisted translation',items:[
  ['translate','💬','Tradu text','Translate text','Traducere și copiere rezultat','Translate and copy result']]},
 {id:'studio',icon:'✨',ro:'Studio creativ AI',en:'Creative AI studio',descriptionRo:'Povești și ilustrații',descriptionEn:'Stories and illustrations',items:[
  ['storybook','📖','Mini-carte narată','Narrated mini-book','Transformă o întâmplare în capitole de ascultat','Turn a story into chapters to listen to'],
  ['creator-images','🎨','Generează ilustrații','Generate illustrations','Desene și imagini realizate cu Eva','Create illustrations with Eva']]},
 {id:'creator',icon:'🌐',ro:'Creare pagini și imagini',en:'Websites and images',descriptionRo:'Generatorul existent',descriptionEn:'Existing creation tools',items:[
  ['creator-website','🌐','Creează site web','Create website','Generatorul de site-uri existent','Existing website builder'],
  ['creator-images','🪄','Creează sau editează imagini','Create or edit images','Generatorul și editorul de imagini','Existing image tools']]},
 {id:'analysis',icon:'📊',ro:'Analiză și calcule',en:'Analysis and calculations',descriptionRo:'Statistici și grafice',descriptionEn:'Statistics and charts',items:[
  ['analysis','📈','Statistici și grafice','Statistics and charts','Calcule pe datele introduse','Calculate from entered data']]},
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
 root.classList.add('extra-tools-choose','extra-tools-workspace','extra-tools-v2');
 $('moduleTitle').textContent=learningLabel(titleRo,titleEn);
 $('moduleLead').textContent='';host.replaceChildren();
 const head=document.createElement('div');head.className='education-toolbar extra-work-head';
 const backButton=extraToolsBtn(learningLabel('← Înapoi','← Back'),back,true);
 if(!extraToolsMountNavigation(root,backButton,head))head.append(backButton);
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
function extraToolsV2Storybook(work,area,addPdf,input,primary,secondary,note){
 note('Creează o mini-carte în capitole scurte, ascult-o cu vocea Android și salvează textul ca PDF. Animația imaginilor și muzica de fundal vor fi integrate separat.','Create a short chapter book, listen with Android voice, and save the text as PDF. Animated artwork and background music are separate upcoming features.');
 work.title=extraToolsField(area,extraToolsLocale('Titlul mini-cărții','Mini-book title'),'text',extraToolsLocale('Ex.: O poveste din copilărie','e.g. A childhood memory'));
 const editor=input(extraToolsLocale('Povestea, întâmplarea sau ideea ta','Your story, event or idea'),
  extraToolsLocale('Povestește în câteva fraze ce s-a întâmplat...','Describe what happened in a few sentences...'));
 const kind=extraToolsField(area,extraToolsLocale('Tipul poveștii','Story type'),'select');
 for(const [key,ro,en] of [['documentary','Documentar narativ','Narrative documentary'],
  ['family','Amintire de familie','Family memory'],['children','Poveste pentru copii','Children’s story'],
  ['travel','Jurnal de călătorie','Travel story']]){
  const option=document.createElement('option');option.value=key;option.textContent=extraToolsLocale(ro,en);kind.append(option);
 }
 const length=extraToolsField(area,extraToolsLocale('Număr capitole','Number of chapters'),'select');
 for(const n of [3,4,5]){const option=document.createElement('option');option.value=String(n);option.textContent=String(n);length.append(option);}
 const viewer=extraToolsEl('section','extra-storybook-reader');viewer.hidden=true;
 const count=extraToolsEl('p','extra-storybook-counter');
 const page=extraToolsEl('div','extra-storybook-page');
 const controls=extraToolsActions(viewer);
 let chapters=[],position=0;
 function render(){
  if(!chapters.length)return;
  if(typeof stopSpeech==='function')stopSpeech();
  count.textContent=extraToolsLocale('Capitol ','Chapter ')+(position+1)+' / '+chapters.length;
  page.textContent=chapters[position];
  back.disabled=position===0;next.disabled=position===chapters.length-1;
 }
 const back=secondary('← Capitolul anterior','← Previous chapter',()=>{if(position>0){position--;render()}});
 const next=secondary('Capitolul următor →','Next chapter →',()=>{if(position<chapters.length-1){position++;render()}});
 const listen=primary('🔊 Ascultă pagina','🔊 Listen to page',()=>{if(chapters.length)speakText(chapters[position]);});
 const stop=secondary('■ Oprește lectura','■ Stop reading',()=>{if(typeof stopSpeech==='function')stopSpeech()});
 controls.append(back,next,listen,stop);viewer.append(count,page);area.append(viewer);
 const create=primary('✨ Creează mini-cartea','✨ Create mini-book',async()=>{
  const raw=editor.value.trim();if(raw.length<30){extraToolsStatus(extraToolsLocale('Descrie povestea în cel puțin 30 de caractere.','Describe the story in at least 30 characters.'));return}
  const title=work.title.value.trim()||extraToolsLocale('Mini-cartea mea','My mini-book');
  const instruction='Transformă întâmplarea într-o mini-carte originală, în '+length.value+' capitole scurte, fiecare de aproximativ 100-170 cuvinte. Gen: '+kind.value+'. Titlul este '+title+'. Folosește EXACT antetele: CAPITOL 1:, CAPITOL 2: ... până la CAPITOL '+length.value+':. Un singur capitol sub fiecare antet, cu fraze naturale potrivite pentru ascultare. Nu inventa persoane, fapte istorice sau surse, dacă nu sunt în poveste. Dacă lipsesc detalii, păstrează tonul de poveste creativă, fără pretenții de documentar verificat.';
  await extraToolsAI(instruction,raw);
  if(work!==extraToolsSession||!work.output)return;
  const result=work.output;
  const matches=[...result.matchAll(/(?:^|\n)\s*(?:CAPITOL|CHAPTER)\s+\d+\s*:/gi)];
  chapters=[];
  if(matches.length>1){
   for(let i=0;i<matches.length;i++)chapters.push(result.slice(matches[i].index+(result[matches[i].index]==='\n'?1:0),matches[i+1]?.index??result.length).trim());
  }else{
   const paras=result.split(/\n\s*\n/).map(x=>x.trim()).filter(Boolean);
   const groupSize=Math.max(1,Math.ceil(paras.length/Number(length.value)));
   for(let i=0;i<paras.length;i+=groupSize)chapters.push(paras.slice(i,i+groupSize).join('\n\n'));
  }
  chapters=chapters.filter(Boolean);position=0;
  if(chapters.length){viewer.hidden=false;work.result.hidden=true;render();}
 });
 extraToolsActions(area,create,secondary('Copiază mini-cartea','Copy mini-book',()=>extraToolsCopy(work.output||'')));
 addPdf();
}
// Upgrade the existing Tools entry screen after all global app functions have been declared.
queueMicrotask(()=>{
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
#view-module.extra-tools-v2 .extra-tools-v2-choices{width:100%;max-width:100%;overflow-y:auto}
#view-module.extra-tools-v2 .extra-tools-v2-grid{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:10px!important;padding:6px!important;width:100%;box-sizing:border-box}
#view-module.extra-tools-v2 .extra-tools-v2-card{min-width:0!important;min-height:118px!important;padding:12px!important;border:1px solid #a46a80!important;border-radius:15px!important;background:linear-gradient(160deg,#173747,#102835)!important;box-shadow:0 3px 9px #0004;color:#f5fcff!important;text-align:left!important}
#view-module.extra-tools-v2 .extra-tools-v2-card .education-art{font-size:25px!important;display:block!important;margin-bottom:4px!important}
#view-module.extra-tools-v2 .extra-tools-v2-card strong{display:block!important;font-size:clamp(13px,3.8vw,17px)!important;line-height:1.2!important;overflow-wrap:anywhere}
#view-module.extra-tools-v2 .extra-tools-v2-card small{display:block!important;margin-top:5px!important;color:#b5d2db!important;font-size:12px!important;line-height:1.3!important}
#view-module.extra-tools-workspace .extra-storybook-reader{border:1px solid #a56c80;border-radius:16px;padding:12px;background:#142f41;margin:12px 0}
#view-module.extra-tools-workspace .extra-storybook-counter{color:#efbfca;font-weight:800;margin:0 0 8px}
#view-module.extra-tools-workspace .extra-storybook-page{white-space:pre-wrap;overflow-wrap:anywhere;line-height:1.65;font-size:16px;color:#f7fbff;min-height:160px}
#view-module.extra-tools-workspace .extra-storybook-reader[hidden]{display:none!important}
`;
