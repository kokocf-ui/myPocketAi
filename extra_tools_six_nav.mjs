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
  'Transformă o idee în capitole de citit și ascultat. Versiunea actuală nu include încă animații sau muzică.',
  'Turn an idea into chapters to read and listen. Animated pictures and music are not available yet.'));
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
  ['documentary','Documentar narativ','Narrative documentary'],
  ['family','Amintire de familie','Family memory'],
  ['travel','Jurnal de călătorie','Travel story']
 ]){
  const option=extraToolsEl('option','',extraToolsLocale(ro,en));option.value=key;kind.append(option);
 }
 const chaptersCount=extraToolsField(compose,extraToolsLocale('Număr capitole','Number of chapters'),'select');
 for(const n of [3,4,5]){
  const option=extraToolsEl('option','',String(n));option.value=String(n);chaptersCount.append(option);
 }
 const state=extraToolsEl('p','extra-storybook-status');state.setAttribute('role','status');compose.append(state);
 const reader=extraToolsEl('section','extra-storybook-reader');reader.hidden=true;
 const cover=extraToolsEl('h3','extra-storybook-cover');
 const progress=extraToolsEl('p','extra-storybook-counter');
 const paper=extraToolsEl('article','extra-storybook-page');
 const readerActions=extraToolsActions(reader);
 const previous=secondary('← Capitol anterior','← Previous chapter',()=>navigate(-1));
 const next=secondary('Capitol următor →','Next chapter →',()=>navigate(1));
 const listen=primary('🔊 Ascultă','🔊 Listen',()=>{if(book.length)speakText(book[index].text);});
 const stop=secondary('■ Oprește','■ Stop',()=>{if(typeof stopSpeech==='function')stopSpeech()});
 readerActions.append(previous,next,listen,stop);
 const edit=secondary('✏️ Revino la editor','✏️ Back to editor',()=>{
  if(typeof stopSpeech==='function')stopSpeech();
  reader.hidden=true;compose.hidden=false;
  reader.scrollIntoView({block:'nearest'});
 });
 const copy=secondary('📋 Copiază mini-cartea','📋 Copy mini-book',()=>extraToolsCopy(work.output||''));
 extraToolsActions(reader,edit,copy);
 reader.prepend(cover,progress,paper);
 area.append(reader);
 let book=[],index=0;
 function navigate(direction){
  const newIndex=Math.max(0,Math.min(book.length-1,index+direction));
  if(newIndex===index||!book.length)return;
  index=newIndex;display();
 }
 function display(){
  if(!book.length)return;
  if(typeof stopSpeech==='function')stopSpeech();
  cover.textContent=work.title.value.trim()||extraToolsLocale('Mini-cartea mea','My mini-book');
  progress.textContent=extraToolsLocale('Capitolul ','Chapter ')+(index+1)+' / '+book.length;
  paper.replaceChildren();
  const heading=extraToolsEl('h4','extra-storybook-chapter-title',
   extraToolsLocale('Capitolul ','Chapter ')+(index+1)+(book[index].title&&
   !/^capitol|chapter/i.test(book[index].title)?' — '+book[index].title:''));
  const body=extraToolsEl('p','extra-storybook-prose',book[index].text);
  paper.append(heading,body);
  previous.disabled=index===0;next.disabled=index===book.length-1;
  paper.scrollTop=0;area.scrollTop=0;
 }
 const create=primary('✨ Creează mini-cartea','✨ Create mini-book',async()=>{
  const seed=editor.value.trim(),title=work.title.value.trim();
  if(title.length<2||seed.length<20){
   state.textContent=extraToolsLocale('Completează titlul și descrie povestea în cel puțin 20 de caractere.',
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
  state.textContent=extraToolsLocale('Eva pregătește capitolele…','Eva is preparing the chapters…');
  book=[];work.output='';reader.hidden=true;
  try{
   const response=await fetch(CLIENT_CONFIG.apiUrl,{
    method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({message:seed,story_seed:seed,title,story_type:kind.value,
      chapter_count:count,language:typeof state==='object'?'ro':'ro',module:'creative_storybook',history:[]}),
    signal:ctrl.signal
   });
   const data=await response.json().catch(()=>null);
   if(work!==extraToolsSession||!area.isConnected)return;
   if(!response.ok||data?.status!=='success'||data?.module!=='creative_storybook'||
      !Array.isArray(data.chapters)||data.chapters.length!==count||
      data.chapters.some((part,i)=>Number(part.number)!==i+1||String(part.text||'').length<170)){
     state.textContent=extraToolsLocale(
      'Eva nu a creat capitolele cerute. Nu afișăm rezultate de știri sau texte incomplete ca mini-carte.',
      'Eva did not create the requested chapters. News snippets or incomplete text will not be shown as a book.');
     return;
   }
   book=data.chapters.map(part=>({title:String(part.title||'').slice(0,110),text:String(part.text||'').trim()}));
   work.output=book.map((part,i)=>'CAPITOL '+(i+1)+':\n'+part.text).join('\n\n');
   if(work.pdf)work.pdf.hidden=false;
   index=0;compose.hidden=true;reader.hidden=false;
   display();
  }catch(error){
   if(work===extraToolsSession)state.textContent=error?.name==='AbortError'?
    extraToolsLocale('Cererea a durat prea mult. Încearcă din nou.','The request timed out. Try again.'):
    extraToolsLocale('Nu am putut contacta serviciul de creare a poveștii.','Could not reach the story creation service.');
  }finally{
   clearTimeout(timeout);
   if(work===extraToolsSession){
    work.controller=null;create.disabled=false;
    create.textContent=extraToolsLocale('✨ Creează mini-cartea','✨ Create mini-book');
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
