export const EXTRA_TOOLS_SIX_NAV_SCRIPT=String.raw`
const EXTRA_TOOLS_V2_GROUPS=[
 {id:'docs',icon:'📄',ro:'Documente și fișiere',en:'Documents and files',descriptionRo:'Creare, scanare și organizare',descriptionEn:'Create, scan and organise',items:[
  ['documents','📝','Creează document','Create document','Editor de text și salvare PDF','Text editor and PDF export'],
  ['ocr','📷','Scanează și extrage text','Scan and read text','Fotografie sau imagine din galerie','Camera or gallery image'],
  ['my-documents','📚','Documentele mele','My documents','Biblioteca PDF existentă','Existing saved PDF library']]},
 {id:'translate',icon:'🌍',ro:'Traduceri inteligente',en:'Smart translations',descriptionRo:'Traducere asistată de Eva',descriptionEn:'Eva-assisted translation',items:[
  ['translate','💬','Tradu text','Translate text','Traducere și copiere rezultat','Translate and copy result']]},
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
function extraToolsV2Storybook(work,area,addPdf,input,primary,secondary,note){
 const compose=extraToolsEl('section','extra-storybook-compose');
 area.append(compose);
 const hint=extraToolsEl('p','extra-work-note',extraToolsLocale(
  'Eva creează povești originale sau documentare istorice bazate pe surse, cu imagini reprezentative și narațiune vocală.',
  'Eva creates original stories or source-grounded historical documentaries, with representative images and narration.'));
 compose.append(hint);
 work.title=extraToolsField(compose,extraToolsLocale('Titlul mini-cărții','Mini-book title'),
  'text',extraToolsLocale('Ex.: Soldații de teracotă','e.g. The Terracotta Army'));
 const editor=extraToolsField(compose,extraToolsLocale('Subiectul sau povestea','Story subject or idea'),
  'textarea',extraToolsLocale('Despre ce vrei să povestească Eva?','What should Eva write about?'));
 work.editor=editor;
 editor.rows=4;
 const kind=extraToolsField(compose,extraToolsLocale('Tipul poveștii','Story type'),'select');
 for(const [key,ro,en] of [
  ['children','Poveste pentru copii','Children’s story'],
  ['documentary','Documentar istoric factual','Factual historical documentary'],
  ['family','Amintire de familie','Family memory'],
  ['travel','Jurnal de călătorie','Travel story']
 ]){
  const option=extraToolsEl('option','',extraToolsLocale(ro,en));option.value=key;kind.append(option);
 }
 const chaptersCount=extraToolsField(compose,extraToolsLocale('Număr capitole','Number of chapters'),'select');
 for(const n of [3,4,5]){
  const option=extraToolsEl('option','',String(n));option.value=String(n);chaptersCount.append(option);
 }
 const imageChoice=extraToolsEl('label','extra-storybook-image-option');
 const autoImages=extraToolsEl('input');autoImages.type='checkbox';autoImages.checked=true;
 const imageChoiceText=extraToolsEl('span','',extraToolsLocale('Caută automat imagini reprezentative (fotografii, statui, picturi, ilustrații)','Automatically find representative images, statues, paintings and illustrations'));
 imageChoice.append(autoImages,imageChoiceText);compose.append(imageChoice);
 const statusLine=extraToolsEl('p','extra-storybook-status');statusLine.setAttribute('role','status');compose.append(statusLine);
 const reader=extraToolsEl('section','extra-storybook-reader');reader.hidden=true;
 const cover=extraToolsEl('h3','extra-storybook-cover');
 const progress=extraToolsEl('p','extra-storybook-counter');
 const paper=extraToolsEl('article','extra-storybook-page');
 const references=extraToolsEl('div','extra-storybook-references');
 const readerActions=extraToolsActions(reader);
 const previous=secondary('← Capitol anterior','← Previous chapter',()=>navigate(-1));
 const next=secondary('Capitol următor →','Next chapter →',()=>navigate(1));
 readerActions.append(previous,next);
 const edit=secondary('✏️ Revino la editor','✏️ Back to editor',()=>{
  motion.stopNarration();
  reader.hidden=true;compose.hidden=false;
  reader.scrollIntoView({block:'nearest'});
 });
 const copy=secondary('📋 Copiază mini-cartea','📋 Copy mini-book',()=>extraToolsCopy(work.output||''));
 extraToolsActions(reader,edit,copy);
 reader.prepend(cover,progress,paper,references);
 area.append(reader);
 const motion=extraStorybookMotionAttach(work,reader);
 let book=[],index=0;
 function navigate(direction){
  const newIndex=Math.max(0,Math.min(book.length-1,index+direction));
  if(newIndex===index||!book.length)return;
  motion.stopNarration();index=newIndex;display();
 }
 function display(){
  if(!book.length)return;
  cover.textContent=work.title.value.trim()||extraToolsLocale('Mini-cartea mea','My mini-book');
  progress.textContent=extraToolsLocale('Capitolul ','Chapter ')+(index+1)+' / '+book.length;
  paper.replaceChildren();
  const safeTitle=String(book[index].title||'').trim();
  const chapterLabel=extraToolsLocale('Capitolul ','Chapter ')+(index+1);
  const heading=extraToolsEl('h4','extra-storybook-chapter-title',chapterLabel+
   (safeTitle&&safeTitle.length<=58&&!/[.!?;:]/.test(safeTitle)&&!(/^(capitol|chapter)/i).test(safeTitle)?' — '+safeTitle:''));
  const body=extraToolsEl('p','extra-storybook-prose',book[index].text);
  paper.append(heading,body);
  references.replaceChildren();
  for(const item of Array.isArray(work.storybookReferences)?work.storybookReferences:[]){
   if(typeof item?.url!=='string'||!item.url.startsWith('https://'))continue;
   const link=extraToolsEl('a','',extraToolsLocale('Sursa documentarului: ','Documentary source: ')+String(item.title||'Wikipedia').slice(0,90));
   link.href=item.url;link.target='_blank';link.rel='noopener';references.append(link);
  }
  previous.disabled=index===0;next.disabled=index===book.length-1;
  motion.setCurrent(index);
  paper.scrollTop=0;area.scrollTop=0;
 }
 work.storybookShowChapter=chapterIndex=>{index=Math.max(0,Math.min(book.length-1,chapterIndex));display();};
 const create=primary('✨ Creează cartea cu fotografii','✨ Create photo storybook',async()=>{
  let autoIllustrate=false;
  const seed=editor.value.trim(),title=work.title.value.trim();
  if(title.length<2||seed.length<20){
   statusLine.textContent=extraToolsLocale('Completează titlul și descrie povestea în cel puțin 20 de caractere.',
    'Enter a title and describe the story in at least 20 characters.');return;
  }
  if(work.controller)return;
  if(typeof stopSpeech==='function')stopSpeech();
  if(document.activeElement?.blur)document.activeElement.blur();
  const count=Number(chaptersCount.value);
  const ctrl=new AbortController();work.controller=ctrl;
  const timeout=setTimeout(()=>ctrl.abort(),65000);
  create.disabled=true;
  create.textContent=extraToolsLocale('⏳ Eva scrie…','⏳ Eva is writing…');
  statusLine.textContent=extraToolsLocale('Eva pregătește capitolele…','Eva is preparing the chapters…');
  book=[];work.output='';work.storybookReferences=[];reader.hidden=true;
  try{
   const response=await fetch(CLIENT_CONFIG.apiUrl,{
    method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({message:seed,story_seed:seed,title,story_type:kind.value,
      chapter_count:count,language:state.language||'ro',module:'creative_storybook',history:[]}),
    signal:ctrl.signal
   });
   const data=await response.json().catch(()=>null);
   if(work!==extraToolsSession||!area.isConnected)return;
   if(!response.ok&&data?.error==='storybook_documentary_sources_unavailable'){
    statusLine.textContent=extraToolsLocale(
     'Nu am putut verifica informații istorice despre acest subiect. Eva nu inventează un documentar.',
     'Historical sources could not be verified. Eva will not invent a documentary.');return;
   }
   if(!response.ok&&data?.error==='storybook_quality_invalid'){
    statusLine.textContent=extraToolsLocale(
     'Textul generat nu a respectat tipul ales. Nu afișăm ficțiune drept documentar sau capitole neterminate.',
     'Generated text did not meet the chosen genre. Fiction will not be shown as history.');return;
   }
   if(!response.ok||data?.status!=='success'||data?.module!=='creative_storybook'||
      !Array.isArray(data.chapters)||data.chapters.length!==count||
      data.chapters.some((part,i)=>Number(part.number)!==i+1||String(part.text||'').length<170)){
     statusLine.textContent=extraToolsLocale(
      'Eva nu a creat capitolele cerute. Nu afișăm rezultate de știri sau texte incomplete ca mini-carte.',
      'Eva did not create the requested chapters. News snippets or incomplete text will not be shown as a book.');
     return;
   }
   book=data.chapters.map(part=>({title:String(part.title||'').slice(0,110),text:String(part.text||'').trim()}));
   work.output=book.map((part,i)=>'CAPITOL '+(i+1)+':\n'+part.text).join('\n\n');
   if(work.pdf)work.pdf.hidden=false;
   work.storybookGenre=kind.value;
   work.storybookReferences=Array.isArray(data.references)?data.references:[];
   index=0;compose.hidden=true;reader.hidden=false;
   motion.setBook(book);display();
   autoIllustrate=autoImages.checked;
  }catch(error){
   if(work===extraToolsSession)statusLine.textContent=error?.name==='AbortError'?
    extraToolsLocale('Cererea a durat prea mult. Încearcă din nou.','The request timed out. Try again.'):
    extraToolsLocale('Nu am putut contacta serviciul de creare a poveștii.','Could not reach the story creation service.');
  }finally{
   clearTimeout(timeout);
   if(work===extraToolsSession){
    work.controller=null;create.disabled=false;
    create.textContent=extraToolsLocale('✨ Creează cartea cu fotografii','✨ Create photo storybook');
    if(autoIllustrate&&reader.isConnected){Promise.resolve().then(()=>{
     if(work===extraToolsSession&&reader.isConnected)void motion.makeIllustrations();
    });}
   }
  }
 });
 extraToolsActions(compose,create);
 addPdf();
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
/* Reader has a dedicated page instead of stacking a result inside the editor. */
#view-module.extra-tools-workspace .extra-storybook-compose{
 width:100%!important;max-width:720px!important;margin:0 auto!important;
}
#view-module.extra-tools-workspace .extra-storybook-reader{
 width:100%!important;max-width:720px!important;margin:0 auto!important;
 border:1px solid #a56c80!important;border-radius:16px!important;
 padding:12px!important;background:#142f41!important;box-sizing:border-box!important;
}
#view-module.extra-tools-workspace .extra-storybook-reader[hidden],
#view-module.extra-tools-workspace .extra-storybook-compose[hidden]{display:none!important}
#view-module.extra-tools-workspace .extra-storybook-cover{
 text-align:center!important;color:#f9f4eb!important;font-size:clamp(18px,4.6vw,24px)!important;
 margin:3px 0 12px!important;line-height:1.24!important;
}
#view-module.extra-tools-workspace .extra-storybook-counter{
 color:#efbfca!important;font-weight:800!important;
 text-align:center!important;margin:0 0 9px!important;
}
#view-module.extra-tools-workspace .extra-storybook-page{
 background:#fffdf5!important;color:#182b35!important;
 padding:clamp(14px,3.2vw,28px)!important;border-radius:12px!important;
 box-shadow:0 4px 15px #0004!important;min-height:190px!important;
 overflow-wrap:anywhere!important;line-height:1.65!important;
 font-size:clamp(15px,3.8vw,18px)!important;
}
#view-module.extra-tools-workspace .extra-storybook-chapter-title{
 font-family:Georgia,serif!important;font-size:1.12em!important;
 margin:0 0 14px!important;color:#23303a!important;
}
#view-module.extra-tools-workspace .extra-storybook-prose{
 white-space:pre-wrap!important;margin:0!important;font-family:Georgia,serif!important;
}
#view-module.extra-tools-workspace .extra-storybook-status{
 color:#d6e9f2!important;text-align:center!important;
 margin:9px 0!important;font-size:14px!important;
}
@media(max-height:620px){
 #view-module.extra-tools-v2 .extra-tools-v2-choices{justify-content:flex-start!important}
 #view-module.extra-tools-v2 .extra-tools-v2-grid{margin:0 auto!important;grid-auto-rows:minmax(104px,auto)!important}
 #view-module.extra-tools-v2 .extra-tools-v2-card{min-height:104px!important}
}

#view-module.extra-tools-workspace .extra-storybook-image-option{
 display:flex!important;align-items:center!important;gap:10px!important;
 padding:9px 11px!important;border:1px solid #70455f!important;
 border-radius:12px!important;background:#173547!important;font-size:13px!important;
 color:#f2f6fb!important;line-height:1.4!important;margin:5px auto 10px!important;
 max-width:720px!important;
}
#view-module.extra-tools-workspace .extra-storybook-references{display:flex;flex-direction:column;gap:6px;font-size:12px;padding:8px 4px}
#view-module.extra-tools-workspace .extra-storybook-references a{color:#e7b8d0;text-decoration:underline;overflow-wrap:anywhere}
#view-module.extra-tools-workspace .extra-storybook-image-option input{
 width:18px!important;height:18px!important;flex:0 0 auto!important;accent-color:#8e3e60!important;
}
`;
