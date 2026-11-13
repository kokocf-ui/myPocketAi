import {splitLiteraturePages} from './literature_reader_pagination.mjs';
import {parseStudyBlocks,renderStudyBlocks,STUDY_TYPOGRAPHY_CSS} from './literature_study_typography.mjs';
import {literatureOfflineActivity,LIT_PRIMARY_COMMUNICATION} from './literature_offline_activity.mjs';
export const LITERATURE_TASK_UI_SCRIPT=splitLiteraturePages.toString()+'\n'+parseStudyBlocks.toString()+'\n'+renderStudyBlocks.toString()+'\nconst COMMUNICATION_G1='+JSON.stringify(LIT_PRIMARY_COMMUNICATION)+';\n'+literatureOfflineActivity.toString()+'\nconst LIT_STUDY_CSS='+JSON.stringify(STUDY_TYPOGRAPHY_CSS)+';\n'+String.raw`

function litSimpleNode(tag,text='',className=''){const el=document.createElement(tag);el.textContent=text;if(className)el.className=className;return el}
function litSimpleButton(text,fn){const b=litSimpleNode('button',text,'lit-activity-button');b.type='button';b.onclick=fn;return b}
function litSimpleLabel(ro,en){return learningLabel(ro,en)}

let litReaderOpen=null;
// Even if optional pagination/typography fails on an Android WebView, never
// expose raw **Markdown** syntax in the reading window. PDF retains raw source.
function litReaderSafeText(value){
 return String(value||'').replace(/^\s{0,3}#{1,6}\s+/gm,'')
  .replace(/\*\*([^*\n]+)\*\*/g,'$1')
  .replace(/__([^_\\n]+)__/g,'$1');
}
function litEnsureTypography(){
 if(document.getElementById?.('lit-typography-v2'))return;
 const style=document.createElement('style');style.id='lit-typography-v2';
 style.textContent=LIT_STUDY_CSS;
 (document.head||document.body)?.append(style);
}
function litRenderPoemPage(host,text){
 host.replaceChildren();
 host.classList?.add('lit-poetry-document');
 for(const block of String(text||'').split(/\n\s*\n/).map(s=>s.trim()).filter(Boolean)){
  const isSection=/^Strofele\s+\d+\s*[–-]\s*\d+$/u.test(block);
  host.append(litSimpleNode(isSection?'h3':'p',block,isSection?'lit-poem-section':'lit-poem-stanza'));
 }
}
function litShowMaterialReader(title,text,options={}){
 const raw=String(text||'').trim();
 if(!raw)return false;
 let overlay=null;
 try{
  if(litReaderOpen?.isConnected){
   try{litReaderOpen.litClose?.()}catch{}
  }
  const host=document.body||document.documentElement;
  if(!host?.append)throw Error('reader_host_missing');
  overlay=document.createElement('div');
  overlay.className='lit-reader-overlay';
  overlay.setAttribute('data-literature-reader','true');
  // Visible even when old app CSS or Android WebView does not apply the
  // dynamically-injected stylesheet. This is the only necessary inline style.
  overlay.style.cssText='position:fixed!important;inset:0!important;z-index:2147483000!important;display:flex!important;align-items:center!important;justify-content:center!important;background:rgba(0,8,18,.92)!important;padding:8px!important;box-sizing:border-box!important';
  const reader=document.createElement('section');
  reader.className='lit-material-reader lit-reader-visible';
  reader.setAttribute('role','dialog');
  reader.setAttribute('aria-modal','true');
  reader.setAttribute('aria-label',title);
  reader.setAttribute('tabindex','-1');
  reader.style.cssText='display:flex!important;flex-direction:column!important;position:relative!important;inset:auto!important;z-index:2!important;width:min(96vw,820px)!important;height:min(84dvh,790px)!important;max-height:84dvh!important;overflow:hidden!important;border:2px solid #5297ac!important;border-radius:19px!important;background:#0b2639!important;color:#f0faff!important';
  const previousFocus=document.activeElement;
  const previousOverflow=host.style?.overflow||'';
  let closed=false;
  const onKey=e=>{
   if(e.key==='Escape'||e.key==='Esc'){e.preventDefault?.();e.stopPropagation?.();close()}
  };
  function close(){
   if(closed)return;
   closed=true;
   document.removeEventListener?.('keydown',onKey,true);
   overlay.remove();
   if(host.style)host.style.overflow=previousOverflow;
   if(litReaderOpen===overlay)litReaderOpen=null;
   try{previousFocus?.focus?.()}catch{}
  }
  overlay.litClose=close;
  const head=litSimpleNode('div','','lit-reader-head');
  const caption=litSimpleNode('strong',title,'lit-reader-title');
  const back=litSimpleButton(litSimpleLabel('Înapoi','Back'),close);
  back.classList.add('lit-reader-close');
  head.append(caption,back);
  const content=litSimpleNode('article',litReaderSafeText(raw),'lit-reader-scroll');
  content.style.cssText='flex:1 1 auto!important;overflow-y:auto!important;min-height:0!important;white-space:pre-wrap!important;padding:16px!important';
  const actions=litSimpleNode('div','','lit-reader-footer');
  const material={title,text:raw};
  const save=litSimpleButton(litSimpleLabel('💾 Salvează PDF','💾 Save PDF'),()=>eduOpenPrint('save',material,close));
  const print=litSimpleButton(litSimpleLabel('🖨 Imprimă','🖨 Print'),()=>eduOpenPrint('print',material,close));
  actions.append(save,print);
  reader.append(head,content,actions);
  overlay.append(reader);
  // The raw lesson is visible in a real reader BEFORE the optional pager,
  // text parser, styling or page-size calculation starts.
  host.append(overlay);
  litReaderOpen=overlay;
  if(host.style)host.style.overflow='hidden';
  document.addEventListener?.('keydown',onKey,true);
  try{back.focus?.()}catch{}
  // The pager is essential. Build it independently of optional fonts and
  // rich-text formatting; Android may reject style injection without affecting reading.
  try{
   const vh=typeof window!=='undefined'?window.innerHeight:680;
   const vw=typeof window!=='undefined'?window.innerWidth:420;
   const pageChars=Math.max(300,Math.min(1200,Math.round(
    (Math.max(120,vh*.84-230)/26)*(Math.min(780,vw*.92)/9.5))));
   let pages=[];
   try{pages=splitLiteraturePages(raw,pageChars)}catch(pageError){
    console.warn?.('literature_page_split_fallback',String(pageError?.message||pageError));
   }
   if(!Array.isArray(pages)||!pages.length){
    // Retain complete paragraphs/stanzas even if the reusable splitter fails.
    pages=[];let page='';
    for(const para of raw.split(/\n\s*\n/)){
     if(page&&page.length+para.length+2>pageChars){pages.push(page);page=''}
     page+=(page?'\n\n':'')+para;
    }
    if(page)pages.push(page);
    if(!pages.length)pages=[raw];
   }
   const controls=[];let active=options.startAt
    ?Math.max(0,pages.findIndex(page=>page.includes(options.startAt))):0;
   const makePager=position=>{
    const bar=litSimpleNode('nav','','lit-page-navigation');
    bar.setAttribute('aria-label',litSimpleLabel('Navigare pagini','Page navigation')+' '+position);
    bar.style.cssText='display:grid;grid-template-columns:minmax(0,1fr) auto minmax(0,1fr);align-items:center;gap:6px;padding:5px 10px;min-height:42px;background:#103149;border-top:1px solid #346477;border-bottom:1px solid #346477;flex:0 0 auto';
    const previous=litSimpleButton(litSimpleLabel('← Anterioară','← Previous'),()=>display(active-1));
    const next=litSimpleButton(litSimpleLabel('Următoarea →','Next →'),()=>display(active+1));
    const counter=litSimpleNode('span','','lit-page-counter');
    counter.setAttribute('aria-live','polite');
    counter.style.cssText='white-space:nowrap;font-size:12px;text-align:center;color:#c5e7f0';
    for(const button of [previous,next])button.style.cssText='min-height:35px;min-width:0;max-width:100%;font-size:13px;padding:5px 8px;border:1px solid #42899f;background:#184b61;color:#f4feff;border-radius:9px';
    previous.style.justifySelf='start';next.style.justifySelf='end';
    bar.append(previous,counter,next);controls.push({previous,next,counter});
    return bar;
   };
   function display(index){
    active=Math.max(0,Math.min(pages.length-1,index));
    try{
     if(options.poetry===true)litRenderPoemPage(content,pages[active]||raw);
     else renderStudyBlocks(content,pages[active]||raw);
    }
    catch(error){
     content.textContent=litReaderSafeText(pages[active]||raw);
     if(typeof window!=='undefined')window.__pocketLiteratureReaderDetail=
      'formatter:'+String(error?.name||'error');
     console.warn?.('literature_reader_plain_text_fallback',String(error?.message||error));
    }
    content.scrollTop=0;
    for(const control of controls){
     control.previous.disabled=active===0;
     control.next.disabled=active===pages.length-1;
     control.previous.setAttribute('aria-disabled',String(control.previous.disabled));
     control.next.setAttribute('aria-disabled',String(control.next.disabled));
     control.counter.textContent=litSimpleLabel('Pagina ','Page ')+(active+1)+' '+litSimpleLabel('din','of')+' '+pages.length;
    }
   }
   // The bottom pager remains visible even for single-page material. Android
   // landscape uses one bar to keep a readable text area.
   const bottom=makePager('bottom');
   reader.insertBefore(bottom,actions);
   if(vh>=540){reader.insertBefore(makePager('top'),content)}
   try{litEnsureTypography()}catch(styleError){
    console.warn?.('literature_reader_style_fallback',String(styleError?.message||styleError));
   }
   display(active);
  }catch(decoratingError){
   // A broken formatter must not close the reader or lose the source text.
   content.textContent=litReaderSafeText(raw);
   if(typeof window!=='undefined')window.__pocketLiteratureReaderDetail=
    'decorator:'+String(decoratingError?.name||'error');
   console.error?.('literature_reader_decoration_failed',String(decoratingError?.message||decoratingError));
  }
  return true;
 }catch(openError){
  try{overlay?.remove?.()}catch{}
  if(typeof window!=='undefined')window.__pocketLiteratureReaderDetail=
   'open:'+String(openError?.name||'error');
  console.error?.('literature_reader_open_failed',String(openError?.message||openError));
  return false;
 }
}

let litSimpleSerial=0,litSimpleAbort=null;
async function litSimpleGenerate(out,status,mode,request,source='',onReady=null){
 if(litSimpleAbort)litSimpleAbort.abort();
 const controller=new AbortController();litSimpleAbort=controller;
 let timeoutId=null,didTimeout=false;
 const serial=++litSimpleSerial;
 const snapshot=[litJourney.country,litJourney.grade,litJourney.branch,litJourney.topic].join('|');
 let plan={verified:false};
 try{plan=litProgram()||plan}catch(error){console.warn?.('lit_program_unavailable',String(error?.message||error))}
 litJourney.busy=true;
 status.textContent=litSimpleLabel('Se pregătește materialul…','Preparing study material…');
 const isHungarianAdmission=litJourney.country==='HU'&&litJourney.branch==='admission';
 const apiSubject=isHungarianAdmission?'school_admission':'language_literature';
 // Interface/output language is a user choice. The target curriculum may
 // be Hungarian, Polish etc. without changing the user's Settings language.
 const answerLanguage=(typeof state!=='undefined'&&state.language)||litJourney.language||'ro';
 const language=LIT_LANGUAGES.find(x=>x[0]===answerLanguage)?.[2]||
  (typeof Intl!=='undefined'&&Intl.DisplayNames
    ?new Intl.DisplayNames(['en'],{type:'language'}).of(answerLanguage):'English');
 const currentTopic=typeof litCurrentTopic==='function'?litCurrentTopic():null;
 const key=String(currentTopic?.[0]||litJourney.topic||'');
 const availableNotes=typeof LIT_OFFLINE_THEORY_DATA==='object'?
  (LIT_OFFLINE_THEORY_DATA[key]||LIT_OFFLINE_THEORY_DATA[litJourney.branch]):null;
 let localMaterial=null;
 try{
  if(litJourney.country==='RO'&&['ro','en'].includes(answerLanguage))
   localMaterial=literatureOfflineActivity({topicKey:key,
    title:litSimpleLabel(currentTopic?.[1]||'Lecție',currentTopic?.[2]||'Lesson'),
    mode,grade:litJourney.grade,language:answerLanguage,notes:availableNotes});
 }catch(error){console.warn?.('lit_offline_material_unavailable',String(error?.message||error))}
 const present=(material,local=false)=>{
  // Do not silently drop a synchronous offline result before its element is
  // attached to the document; a just-created workspace can still be detached.
  if((controller.signal.aborted&&!didTimeout)||serial!==litSimpleSerial||
   snapshot!==[litJourney.country,litJourney.grade,litJourney.branch,litJourney.topic].join('|'))return;
  const text=String(material||'').trim().slice(0,72000);
  if(!text)return;
  // Keep only an internal plain-text copy. All styled content belongs to
  // the independent reader and must never be mounted inside the workspace.
  out.textContent=text;
  status.textContent=local?
   litSimpleLabel('Material local disponibil. Funcționează fără AI și fără localizare.',
    'Local study material is available without AI or location.'):
   (mode==='correction'?litSimpleLabel('Răspunsurile au fost evaluate.','Answers checked.'):
   litSimpleLabel('Materialul este afișat. Poți salva PDF sau imprima.','Material displayed. You can save or print.'));
  if(typeof onReady==='function'){
   try{if(onReady(text)===false)throw Error('reader_could_not_attach')}catch(readerError){
    // Reader/popup errors never invalidate the already rendered study material.
    const errorCode=typeof window!=='undefined'?String(window.__pocketLiteratureReaderDetail||'reader_could_not_attach').slice(0,60):'reader_could_not_attach';
    status.textContent=litSimpleLabel(
     'Fereastra de lectură nu s-a putut deschide ('+errorCode+').',
     'The reader could not open ('+errorCode+').');
    if(typeof console!=='undefined')console.warn('literature_reader_unavailable',
     String(readerError?.message||readerError));
   }
  }
  // The reader overlay is the only visible document; never scroll to hidden text.
 };
 // Grade I Romanian basics are authored and instantly available, independent of
 // online inference quotas. These examples are not asserted to be official tests.
 if(localMaterial&&String(litJourney.grade)==='1'&&mode!=='correction'){
  try{present(localMaterial.text,true)}finally{
   if(serial===litSimpleSerial){litJourney.busy=false;litSimpleAbort=null}
  }
  return;
 }
 const curriculumLanguage=LIT_LANGUAGES.find(x=>x[0]===litJourney.language)?.[2]||
  litJourney.language||'the original study language';
 const admissionPolicy=isHungarianAdmission
  ?' This is entry/transfer preparation for Hungary. Present practice prompts in Hungarian and explain the method in the user interface language. Different written exams apply for entry to grades 5, 7 and 9. Never imply any school-specific admission requirement, year, exemption, assessment rule, document or deadline is verified without an official source. If a school name is supplied but not its official policy, explicitly ask the learner to check the chosen school. '
  :'';
 const prompt=(isHungarianAdmission?'You are a Hungarian school admission tutor for language, mathematics and transfer. Write in ':'You are an experienced language and literature teacher. Write in ')+language+
 '. Country of education: '+(educationCountrySelection.label||litJourney.country)+
 '. Original curriculum language: '+curriculumLanguage+
 '. Explain lesson content and the national curriculum in '+language+
 '. Retain proper names, original literary titles, technical symbols and original-language examples as needed, with explanations in '+language+'.'+
 '. Class/year: '+litJourney.grade+'. Profile: '+litJourney.track+'. Region: '+(litJourney.region||'unspecified')+
 '. Curriculum: '+(plan.verified?'general framework identified; order is pedagogical':'advisory plan; do not claim an officially verified national syllabus')+
 '. Activity: '+mode+'. '+admissionPolicy+' Explain the lesson fully and directly, without offering a form. '+
 'For lessons give substantial definitions and explanations, rules and grade-appropriate examples. Use short clear headings, never type dashes/equals as decorative rules. List alternatives a., b., c. and exercises 1., 2., 3., each on its own line. '+
 'For exercises and tests produce at least five clear numbered tasks without exposing their solutions until the learner answers. '+
 'For literary study cover the author, context, themes, structure and evidence-based interpretation. '+
 'For an essay or summary provide a complete coherent text, not a template. Never invent quotations or an author attribution. '+
 'Task: '+request+'. '+source;
 try{
  // Bound the online wait: no lesson may remain on "preparing" indefinitely.
  const response=await Promise.race([fetch(CLIENT_CONFIG.apiUrl,{method:'POST',
   headers:{'Content-Type':'application/json'},
   body:JSON.stringify({message:prompt.slice(0,3900),module:'education_study',
    education_subject:apiSubject,education_activity:mode,
    language:answerLanguage,history:[]}),
   signal:controller.signal}),
   new Promise((_,reject)=>{
    if(typeof setTimeout!=='function')return;
    timeoutId=setTimeout(()=>{
     didTimeout=true;controller.abort();reject(Error('education_timeout'));
    },11000);
   })
  ]);
  const data=await response.json();
  if(!response.ok||data.status!=='success'||data.education_subject!==apiSubject||
     typeof data.reply!=='string'||!data.reply.trim())throw Error(String(data.error||('http_'+response.status)));
  if(controller.signal.aborted||serial!==litSimpleSerial||
     snapshot!==[litJourney.country,litJourney.grade,litJourney.branch,litJourney.topic].join('|'))return;
  const text=String(data.reply).trim();
  if(/(?:nu am coordonate gps|permite accesul la locație|departure address\/postcode|do not have usable gps)/i.test(text))
   throw Error('wrong_intent');
  present(text,false);
 }catch(error){
  if((controller.signal.aborted&&!didTimeout)||serial!==litSimpleSerial)return;
  if(localMaterial?.text){
   present(localMaterial.text,true);
  }else{
   const code=String(error?.message||'');
   const quota=code==='ai_quota_exceeded';
   const unavailable=code==='education_timeout'||didTimeout||
    code==='education_generation_unavailable'||code==='education_text_empty'||code==='Failed to fetch';
   status.textContent=quota?
    litSimpleLabel('Limita serviciului AI a fost atinsă. Materialul online nu poate fi generat momentan.','AI usage limit reached; online material is temporarily unavailable.'):
    unavailable?litSimpleLabel('Serviciul AI nu a răspuns. Încearcă din nou mai târziu.','The AI service did not respond. Try again later.'):
    litSimpleLabel('Nu s-a putut obține un răspuns educațional valid. Încearcă din nou.','No valid educational response was returned. Please try again.');
   if(!out.textContent.trim())out.append(litSimpleNode('p',
    litSimpleLabel('Acest material necesită un răspuns al serviciului AI. Nu au fost generate explicații inventate.','This material requires an AI response. No made-up lesson is shown.')));
  }
 }finally{
  if(timeoutId!==null&&typeof clearTimeout==='function')clearTimeout(timeoutId);
  if(serial===litSimpleSerial){litJourney.busy=false;litSimpleAbort=null}
 }
}
function litSimpleHeading(panel,title,note){
 panel.append(litSimpleNode('h3',title,'lit-activity-heading'));
 if(note)panel.append(litSimpleNode('p',note,'lit-activity-note'));
}
function litSimpleWorkspace(panel){
 const branch=litJourney.branch,topic=litCurrentTopic();
 const country=educationCountrySelection.label||litJourney.country;
 panel.append(litSimpleNode('p',country+' · '+litJourney.grade,'lit-activity-note'));
 if(branch==='literature'){litSimpleLiterature(panel);return}
 if(!topic){panel.append(litSimpleNode('p',litSimpleLabel('Selectează un capitol.','Choose a chapter.')));return}
 const title=litSimpleLabel(topic[1],topic[2]);
 litSimpleHeading(panel,title,litSimpleLabel('Alege o activitate. Materialul se deschide într-o fereastră separată.','Choose an activity. Study material opens in a separate reader.'));
 if(branch==='admission'){
  panel.append(litSimpleNode('p',litSimpleLabel(
   'Pentru admitere în Ungaria: probele și transferul depind de clasa-țintă și instituție. Exercițiile de aici sunt de pregătire, nu subiecte oficiale.',
   'Hungarian admission and transfer requirements depend on target grade and school. These are practice exercises, not official examination papers.'
  ),'lit-activity-note'));
  const sourceLink=litSimpleNode('a',litSimpleLabel('Sursa: procedura de admitere KIFIR','Source: KIFIR admissions guidance'));
  sourceLink.href=HUNGARY_ADMISSION_REFERENCES.foreignPupils;sourceLink.target='_blank';sourceLink.rel='noopener noreferrer';
  panel.append(sourceLink);
 }
 const needsInput=['analysis','writing'].includes(branch)||(branch==='vocabulary'&&litJourney.topic==='dictionary');
 const request=needsInput?litSimpleNode(branch==='vocabulary'?'input':'textarea','','lit-input lit-activity-input'):null;
 if(request){request.placeholder=branch==='analysis'?litSimpleLabel('Propoziția sau fragmentul de analizat','Sentence or passage to analyse'):
    branch==='vocabulary'?litSimpleLabel('Cuvântul sau expresia','Word or expression'):
    litSimpleLabel('Cerința de redactare','Writing task');request.setAttribute('aria-label',request.placeholder);if(request.tagName==='TEXTAREA')request.rows=3;panel.append(request)}
 const bar=litSimpleNode('div','','lit-activity-bar');
 const status=litSimpleNode('p','','lit-activity-status');status.setAttribute('role','status');
 const out=litSimpleNode('article','','lit-result lit-activity-output');
 out.hidden=true;out.setAttribute('aria-hidden','true');
 const run=(mode)=>{
  const phrase=request?.value.trim()||'';
  if(needsInput&&!phrase&&mode!=='lesson'){request.focus();status.textContent=litSimpleLabel('Introdu textul sau cuvântul solicitat.','Enter the requested text or word.');return}
  assignmentText='';review.hidden=true;review.open=false;answers.value='';
  out.replaceChildren();

  const school=branch==='admission'&&litJourney.targetSchool
    ?' Școală vizată: '+litJourney.targetSchool+'. Numele singur nu confirmă cerințele oficiale.'
    :'';
  const task=title+'. '+(branch==='admission'?topic[3]+school+' ':'')+
    (phrase?'Textul utilizatorului: '+phrase+'. ':'')+'Solicitare: '+mode+'.';
  litSimpleGenerate(out,status,mode,task,'',text=>{
   // Do not expose the answer form underneath until the reader truly opens.
   const displayed=litShowMaterialReader(title+' · '+litSimpleLabel(
    mode==='lesson'?'Teorie':mode==='examples'?'Exemple':mode==='exercises'?'Exerciții':mode==='test'?'Test':mode==='define'?'Definiție':mode==='analysis'?'Analiză':'Material',
    mode==='lesson'?'Theory':mode==='examples'?'Examples':mode==='exercises'?'Exercises':mode==='test'?'Test':mode==='define'?'Definition':mode==='analysis'?'Analysis':'Material'),text);
   if((mode==='exercises'||mode==='test')&&displayed){assignmentText=text;review.hidden=false}
   return displayed;
  });
 };
 const buttons=branch==='analysis'?[['Analizează','Analyse','analysis'],['Explică metoda','Explain method','lesson']]:
  branch==='writing'?[['Compune','Compose','write'],['Explică','Explain','lesson']]:
  branch==='vocabulary'&&litJourney.topic==='dictionary'?[['Caută definiția','Define','define'],['Exemple','Examples','examples']]:
  [['Teorie','Theory','lesson'],['Exemple','Examples','examples'],['Exerciții','Exercises','exercises'],['Teste','Tests','test']];
 for(const [ro,en,mode]of buttons)bar.append(litSimpleButton(litSimpleLabel(ro,en),()=>run(mode)));
 panel.append(bar,status);

 const review=litSimpleNode('details','','lit-activity-review');
 review.hidden=true;
 const summary=litSimpleNode('summary',litSimpleLabel('Răspunde la întrebări și verifică','Answer and check the questions'));
 const answers=litSimpleNode('textarea','','lit-input');answers.rows=3;answers.placeholder=litSimpleLabel('Răspunde la exercițiile afișate mai sus','Answer the exercises shown above');
 let assignmentText='';
 const correction=litSimpleNode('article','','lit-result lit-activity-output');
 correction.hidden=true;correction.setAttribute('aria-hidden','true');
 review.append(summary,answers,litSimpleButton(litSimpleLabel('Corectează','Check answers'),()=>{
  if(!assignmentText){status.textContent=litSimpleLabel('Alege mai întâi Exerciții sau Teste.','Choose Exercises or Tests first.');return}
  if(!answers.value.trim()){answers.focus();return}
  litSimpleGenerate(correction,status,'correction',
   'Evaluează răspunsul elevului: '+answers.value.trim().slice(0,1500)+'.',
   'Întrebările originale: '+assignmentText.slice(0,2200)+'. Oferă corectarea pe fiecare întrebare.',
   text=>litShowMaterialReader(litSimpleLabel('Corectarea exercițiilor','Corrected answers'),text));
 }));
 panel.append(review);
 // No automatic AI request: the learner explicitly chooses one activity.
 // This prevents racing a background lesson request with the first button tap.
}
// A verified, fixed-edition work must not be described by a free-form model.
// These original teaching notes are based on the 98-stanza 1883 source, not
// an imagined theatre script. For other titles, retain the existing workflow.
function litVerifiedLuceafarulMaterial(chosen,mode,passage=''){
 if(chosen?.name!=='Luceafărul'||chosen?.author!=='Mihai Eminescu'||
   chosen?.work?.sections?.length!==7)return null;
 const intro='Luceafărul — Mihai Eminescu\\nSursă primară: '+chosen.url+
  '\\nPrima publicare: Almanahul „România Jună”, aprilie 1883.'+
  '\\nGen: poem romantic (NU piesă de teatru).'+
  '\\nText de referință: 98 de strofe, 392 de versuri, în patru părți.'+
  '\\nExistă variante: manuscris de 105 strofe; ediția Maiorescu din 1883 de 94 de strofe.';
 const material={"study":"REPERE PENTRU STUDIU — STRUCTURA ÎN PATRU PĂRȚI\n\nPartea I. Poemul prezintă fata de împărat într-un spațiu terestru și visarea ei către Luceafăr. Chemarea se repetă, iar astrul capătă două întrupări, încercând să apropie existența cosmică de cea umană. Fata nu acceptă trecerea într-un univers incompatibil cu propria ei condiție: ea își dorește ca el să fie muritor.\n\nPartea a II-a. Cătălin, pajul curții, o curtează pe Cătălina. Dialogul lor aduce o iubire apropiată, posibilă și desfășurată în timpul omenesc. Contrastul nu trebuie simplificat în „bun” și „rău”: planurile ilustrează două condiții existențiale diferite.\n\nPartea a III-a. Hyperion se îndreaptă către Demiurg pentru a cere schimbarea condiției sale. Discursul Demiurgului explică imposibilitatea renunțării la esența nemuritoare și opune durata cosmică trecerii individuale.\n\nPartea a IV-a. Cătălin și Cătălina își trăiesc apropierea în lumea pământească. Hyperion revine la distanța proprie, iar finalul accentuează separarea dintre destinul muritor și existența cosmică.\n\nPERSONAJE ȘI FUNCȚII\n\nHyperion — personaj simbolic al aspirației spre absolut și al condiției incompatibile cu lumea comună. Cătălina — ființa umană atrasă de ideal, dar incapabilă să locuiască în lumea astrului. Cătălin — expresia afectivității și alegerii terestre. Demiurgul — instanța ordinii cosmice care îi definește lui Hyperion limitele.\n\nTEME ȘI MOTIVE\n\nIubirea imposibilă; idealul în opoziție cu realul; condiția ființei excepționale; timpul și eternitatea; visul, oglinda, marea, cerul și călătoria cosmică. Urmărește diferența dintre dorința personajelor și ceea ce le permite natura lor.\n\nCHEIE DE LECTURĂ\n\nPentru fiecare parte notează: cine vorbește, cui i se adresează, ce dorește, ce imagini poetice predomină și ce opoziție se construiește. Compară cele două chemări ale fetei și revenirea finală a lui Hyperion. Susține interpretările cu strofe din textul complet.\n\nPoemul nu este piesă de teatru; cele patru părți nu sunt acte dramatice.","summary":"REZUMAT DETALIAT — PARTEA I\n\nÎntr-un cadru de basm, o fată de împărat își petrece serile contemplând Luceafărul. Fascinația se transformă într-o legătură prin vis și chemare. Astrul răspunde de două ori, în forme diferite, îmbinând imagini ale mării, cerului, luminii și originilor cosmice. El îi propune fetei un destin dincolo de condiția omenească, dar întâlnirea nu poate fi împlinită în termenii ei. Fata îl dorește aproape și îi cere să renunțe la nemurire pentru a deveni asemenea ei.\n\nPARTEA A II-A\n\nPe planul terestru apare pajul Cătălin, care se apropie de Cătălina și îi propune un mod de a iubi accesibil. Discuția lor contrastează cu solemnitatea chemărilor către astrul îndepărtat: iubirea omenească se poate învăța și trăi în cadrul vieții obișnuite. Fata oscilează între atracția pentru ideal și posibilitatea unei relații reale.\n\nPARTEA A III-A\n\nPentru a răspunde cererii Cătălinei, Hyperion pornește într-o călătorie cosmică spre Demiurg. Drumul său traversează imagini ale spațiului și timpului la scară universală. El solicită renunțarea la nemurire, dar Demiurgul îi arată că această schimbare ar anula propria lui esență. Nemurirea nu poate fi tranzacționată pentru durata scurtă a unei vieți umane.\n\nPARTEA A IV-A\n\nÎntre timp, Cătălin și Cătălina se apropie într-un peisaj nocturn pământesc. Luceafărul este invocat din nou, însă sensul chemării nu mai este același: astrul rămâne martor și simbol, nu partener posibil. Hyperion constată separarea ireversibilă a celor două lumi. Finalul păstrează contrastul dintre condiția muritoare, cu bucurii și limite, și existența cosmică, durabilă, dar solitară.\n\nIDEA CENTRALĂ\n\nPoemul nu relatează doar o poveste de dragoste neîmplinită; pune în conflict două forme de existență și întreabă dacă iubirea poate înlătura diferența dintre timpul uman și eternitate.","essay":"ESEU — IUBIREA, IDEALUL ȘI CONDIȚIA FIINȚEI EXCEPȚIONALE\n\nIntroducere. „Luceafărul” este un poem romantic care îmbină povestirea cu meditația filozofică. Cele 98 de strofe ale textului de referință sunt organizate în patru părți, cu alternanța planului cosmic și terestru. În centrul construcției se află raportul dintre aspirația către absolut și limitele experienței umane.\n\nPrima parte construiește o atracție imposibilă. Fata de împărat îl privește pe Luceafăr ca pe un ideal îndepărtat, în timp ce astrul încearcă să intre într-o formă accesibilă omului. Cele două întrupări nu rezolvă diferența de natură dintre personaje. Cererea Cătălinei ca Hyperion să devină muritor este punctul de plecare al conflictului metafizic.\n\nA doua parte mută accentul asupra lumii pământești. Cătălin și Cătălina comunică într-un registru direct și concret, unde sentimentele se pot transforma în relație. Prin contrast, întâlnirea cu Hyperion este solemnă și imposibil de stabilizat într-o viață comună.\n\nA treia parte oferă dimensiunea filozofică a poemului. Călătoria către Demiurg transformă o cerere amoroasă într-o problemă despre natura existenței. Răspunsul Demiurgului arată că identitatea astrului nu poate fi schimbată după regulile lumii muritoare.\n\nÎn final, apropierea celor doi tineri este pusă în opoziție cu singurătatea lui Hyperion. Această încheiere nu trebuie citită doar ca o pedeapsă pentru iubirea neîmplinită: ea exprimă distanța radicală dintre planuri și imposibilitatea înlocuirii unuia cu celălalt.\n\nConcluzie. Poemul transformă o intrigă de basm într-o meditație romantică asupra idealului, cunoașterii, iubirii și destinului. Un eseu complet poate fi susținut prin compararea chemărilor din prima parte, a dialogului cu Demiurgul și a imaginii finale a astrului.","analysis":"ANALIZĂ LITERARĂ — SPECIFICUL ROMANTIC\n\nPoemul combină un cadru de basm, un conflict sentimental și un nivel de reflecție filozofică. Titlul trimite la astrul observat de fată, dar și la figura simbolică a lui Hyperion. Antiteza dintre planul pământesc și cel cosmic organizează atât acțiunea, cât și limbajul.\n\nSTRUCTURĂ ȘI COMPOZIȚIE\n\nÎn partea I predomină chemarea, visul și întâlnirea imposibilă; în partea a II-a intervine perechea umană Cătălin–Cătălina; partea a III-a deschide perspectiva cosmică prin călătoria lui Hyperion; ultima parte aduce cele două planuri din nou față în față. Repetițiile de situație și schimbările de registru marchează evoluția conflictului.\n\nIMAGINI, MOTIVE ȘI ANTITEZE\n\nUrmărește imaginile luminii, ale mării și cerului, mișcarea dintre sus și jos, precum și distanța dintre somn/vis și realitatea imediată. Planul cosmic utilizează reprezentări ample ale originilor și timpului; planul terestru prezintă apropierea directă dintre două ființe muritoare. Interpretează aceste imagini în relație cu replicile și acțiunile personajelor.\n\nPERSONAJE ȘI CONDIȚII EXISTENȚIALE\n\nHyperion nu este doar un îndrăgostit respins: el întruchipează un mod de existență care nu poate deveni muritor fără să se anuleze. Cătălina trăiește tensiunea dintre aspirația către ideal și posibilitatea iubirii pământești. Cătălin nu reprezintă universul cosmic, ci viața accesibilă. Demiurgul exprimă legea care distinge aceste planuri.\n\nCONFLICTUL ȘI FINALUL\n\nConflictul exterior al alegerii amoroase reflectă un conflict ontologic: nemurirea nu poate fi abandonată ca un privilegiu oarecare, iar o viață umană nu se poate prelungi în eternitatea astrului. Finalul reconfigurează chemarea inițială și accentuează singurătatea cosmică.\n\nGHID PENTRU ARGUMENTARE\n\nÎntr-o analiză pe text, alege câte un fragment verificat din fiecare parte. Identifică procedeele expresive, explică felul în care susțin tema și compară imaginea lui Hyperion de la început cu cea din final. Nu inventa citate și nu transforma cele patru părți în acte dramatice."};
 if(!Object.prototype.hasOwnProperty.call(material,mode))return null;
 const excerpt=mode==='analysis'&&String(passage||'').trim()
   ?'\\n\\nFRAGMENT FURNIZAT DE UTILIZATOR (de verificat cu ediția):\\n'+String(passage).trim().slice(0,2800):'';
 return intro+'\\n\\n'+material[mode]+excerpt;
}

function litSimpleLiterature(panel){
 litSimpleHeading(panel,litSimpleLabel('Literatură: autor și operă','Literature: author and work'),
  litSimpleLabel('Selectează opera corectă, apoi Studiază, Rezumat, Eseu sau Analiză pe text.','Select a work, then Study, Summary, Essay or Text analysis.'));
 const search=litSimpleNode('input','','lit-input');search.type='search';
 search.placeholder=litSimpleLabel('Titlu — autor (ex.: Luceafărul — Mihai Eminescu)','Title — author');search.setAttribute('aria-label',search.placeholder);
 const feedback=litSimpleNode('p','','lit-activity-status');feedback.setAttribute('role','status');
 const results=litSimpleNode('div','','lit-activity-results');
 const title=litSimpleNode('h3','','lit-activity-heading');
 const acts=litSimpleNode('div','','lit-activity-bar');
 const textArea=litSimpleNode('textarea','','lit-input');textArea.rows=4;textArea.placeholder=litSimpleLabel('Fragment propriu pentru analiză (opțional)','Your own passage for analysis (optional)');
 const passage=litSimpleNode('details','','lit-activity-review');passage.append(litSimpleNode('summary',litSimpleLabel('Adaugă un fragment pentru analiză','Add a passage to analyse')),textArea);
 const out=litSimpleNode('article','','lit-result lit-activity-output');
 out.hidden=true;out.setAttribute('aria-hidden','true');
 let chosen=null,searchNumber=0;
 const select=(name,author,url,work=null)=>{
  chosen={name,author,url,work};title.textContent=name+' — '+author;results.replaceChildren();acts.replaceChildren();
  const types=[['Studiază','Study','study'],['Rezumat','Summary','summary'],['Eseu','Essay','essay'],['Analiză pe text','Text analysis','analysis']];
  for(const [ro,en,mode] of types)acts.append(litSimpleButton(litSimpleLabel(ro,en),()=>{
   const checked=litVerifiedLuceafarulMaterial(chosen,mode,textArea.value);
   if(checked){
    feedback.textContent=litSimpleLabel('Fișă verificată, din ediția de referință.','Verified notes from the reference edition.');
    litShowMaterialReader(chosen.name+' — '+chosen.author,checked);
    return;
   }
   out.replaceChildren();litSimpleGenerate(out,feedback,mode,'Opera: '+chosen.name+'. Autor: '+chosen.author+'.',
   'Sursă bibliografică (metadate, nu text integral): '+chosen.url+'. '+
   (textArea.value.trim()?'Fragment introdus de utilizator: '+textArea.value.trim().slice(0,28000):'Text integral indisponibil; nu inventa citate sau lectura unei ediții.'),
   result=>litShowMaterialReader(chosen.name+' — '+chosen.author,result));
  }));
  // Contents can be shown only for a confirmed licensed source with actual text.
  // Do not manufacture chapter titles, missing lines or verses from catalogue metadata.
  const sections=Array.isArray(chosen.work?.sections)?chosen.work.sections:[];
  const readable=sections.length>0&&sections.every(s=>s&&s.rightsVerified===true&&
   typeof s.title==='string'&&typeof s.text==='string'&&s.text.trim()&&
   typeof s.license==='string'&&s.license.trim());
  if(readable){
   const chapters=litSimpleNode('details','','lit-activity-review');
   chapters.append(litSimpleNode('summary',litSimpleLabel('Cuprins · Capitole / Poezie','Contents · Chapters / Poem')));
   const isLuceafarul=chosen.name==='Luceafărul'&&chosen.author==='Mihai Eminescu';
   const entireWork=sections.map(s=>s.title+'\n\n'+s.text).join('\n\n');
   for(const section of sections)chapters.append(litSimpleButton(section.title,()=>
    isLuceafarul
     ?litShowMaterialReader(chosen.name+' — '+chosen.author,entireWork,{poetry:true,startAt:section.title})
     :litShowMaterialReader(chosen.name+' — '+section.title,section.text)));
   acts.append(chapters,litSimpleButton(litSimpleLabel('Citește opera integral','Read complete work'),()=>
    litShowMaterialReader(chosen.name+' — '+chosen.author,entireWork,{poetry:isLuceafarul})));
  }else{
   const source=litSimpleNode('a',litSimpleLabel('Sursa / ediția operei','Work source / edition'));
   if(/^https:\/\//.test(chosen.url||'')){
    source.href=chosen.url;source.target='_blank';source.rel='noopener noreferrer';
    acts.append(source);
   }
   acts.append(litSimpleButton(litSimpleLabel('Textul integral sau capitolele','Full text or chapters'),()=>{
    litShowMaterialReader(chosen.name+' — '+chosen.author,litSimpleLabel(
     'Momentan sunt disponibile numai datele bibliografice. Pentru textul integral sau capitole este necesară o sursă cu drepturi de afișare confirmate. Poți consulta ediția folosind linkul «Sursa / ediția operei».',
     'Only bibliographic metadata is available. Full text and chapters require a source with verified display rights. See the work source link.'));
   }));
  }
  feedback.textContent=litSimpleLabel('Opera selectată; alege activitatea.','Work selected; choose an activity.');
  title.scrollIntoView({block:'nearest',behavior:'auto'});
 };
 const fold=value=>String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim();
 // Instant country-specific starter bibliography; never presented as compulsory reading.
 const showCountryLibrary=()=>{
  const matches=LIT_VERIFIED_AUTHORS.filter(a=>a.country===litJourney.country)
   .flatMap(a=>a.works.map(w=>({title:w.title,author:a.name,url:w.sourceUrl||a.sourceUrl,work:w}))).slice(0,8);
  results.replaceChildren();
  for(const entry of matches)results.append(litSimpleButton(entry.title+' — '+entry.author,
   ()=>select(entry.title,entry.author,entry.url,entry.work)));
  if(matches.length)feedback.textContent=litSimpleLabel('Bibliotecă locală de studiu: ','Local study library: ')+matches.length+' '+
   litSimpleLabel('opere documentate. Nu sunt declarate lecturi obligatorii.','documented works, not labelled compulsory.');
  else feedback.textContent=litSimpleLabel(
   'Biblioteca acestei țări este în curs de completare. Poți căuta un titlu sau autor în catalogul internațional.',
   'The local country library is being expanded. Search for a title or author in the international catalogue.');
 };
 const find=async()=>{
  const term=search.value.trim(),n=++searchNumber;
  if(!term){showCountryLibrary();return}
  if(term.length<3){feedback.textContent=litSimpleLabel('Introdu cel puțin trei caractere.','Enter at least three characters.');search.focus();return}
  results.replaceChildren();feedback.textContent=litSimpleLabel('Se caută operele…','Searching works…');
  const parts=term.split(/\s+[—–-]\s+/).map(x=>x.trim()).filter(Boolean);
  // Accept both "Luceafărul — Mihai Eminescu" and the natural
  // "Mihai Eminescu — Luceafărul"; the latter previously searched for
  // a title named after the author and required an author named Luceafărul.
  const firstIsAuthor=parts.length>=2&&LIT_VERIFIED_AUTHORS.some(a=>
   [a.name,...(a.aliases||[])].some(alias=>fold(alias)===fold(parts[0])));
  if(firstIsAuthor){const first=parts[0];parts[0]=parts[1];parts[1]=first}
  const name=parts[0]||'',author=fold(parts[1]||'');
  const local=[];
  for(const a of LIT_VERIFIED_AUTHORS){
   const byAuthor=[a.name,...(a.aliases||[])].some(n=>fold(n).includes(fold(name)));
   if(author&&![a.name,...(a.aliases||[])].some(n=>fold(n).includes(author)))continue;
   for(const w of a.works)if(byAuthor||fold(w.title).includes(fold(name)))
    local.push({title:w.title,author:a.name,url:w.sourceUrl||a.sourceUrl,work:w});
  }
  // An exact title is a WORK lookup, not a search for critiques or study guides.
  const localExact=[...new Map(local.filter(x=>fold(x.title)===fold(name))
   .map(x=>[fold(x.title)+'|'+fold(x.author),x])).values()];
  if(localExact.length===1){const x=localExact[0];select(x.title,x.author,x.url,x.work||null);return}
  let rows=localExact.length?localExact:local;
  if(!rows.length)try{
   const response=await fetch('https://openlibrary.org/search.json?title='+encodeURIComponent(name)+'&limit=25&fields=key,title,author_name,edition_count,first_publish_year',{credentials:'omit'});
   if(!response.ok)throw Error('catalog');
   const data=await response.json();if(n!==searchNumber||!results.isConnected)return;
   rows=(data.docs||[]).flatMap(x=>(x.author_name||[]).map(w=>({title:String(x.title||''),author:String(w||''),url:/^\/works\/OL\d+W$/.test(x.key||'')?'https://openlibrary.org'+x.key:'',
     editionCount:Number(x.edition_count)||0,firstYear:Number(x.first_publish_year)||null})))
    .filter(x=>fold(x.title)===fold(name)&&(!author||fold(x.author).includes(author)));
  }catch{feedback.textContent=litSimpleLabel('Catalog indisponibil; nu pot confirma atribuirea.','Catalogue unavailable; attribution unverified.');return}
  // A person-name query is different from a book-title query. Open
  // the exact author's own works, not titles merely containing that name.
  if(!rows.length&&!parts[1])try{
   const response=await fetch('https://openlibrary.org/search/authors.json?q='+encodeURIComponent(name)+'&limit=8',{credentials:'omit'});
   if(!response.ok)throw Error('author_search');
   const data=await response.json();
   if(n!==searchNumber||!results.isConnected)return;
   const matches=(data.docs||[]).filter(x=>fold(x.name)===fold(name));
   const author=matches.length===1?matches[0]:null;
   const key=String(author?.key||'').replace(/^\/authors\//,'');
   if(/^OL\d+A$/.test(key)){
    const worksResponse=await fetch('https://openlibrary.org/authors/'+key+'/works.json?limit=50',{credentials:'omit'});
    if(!worksResponse.ok)throw Error('author_works');
    const works=await worksResponse.json();
    if(n!==searchNumber||!results.isConnected)return;
    rows=(works.entries||[]).filter(x=>String(x.title||'').trim())
     .map(x=>({title:String(x.title).trim(),author:String(author.name),url:
      /^\/works\/OL\d+W$/.test(x.key||'')?'https://openlibrary.org'+x.key:
      'https://openlibrary.org/authors/'+key}));
   }
  }catch{feedback.textContent=litSimpleLabel('Catalogul autorilor nu este disponibil acum.','Author catalogue unavailable right now.')}
  // Open Library exposes work-level metadata; collapse editions/repeated catalogue rows.
  // When the full title resolves exactly once, open that work rather than an essay about it.
  const exact=[...new Map(rows.filter(x=>fold(x.title)===fold(name))
   .map(x=>[fold(x.title)+'|'+fold(x.author),x])).values()];
  if(exact.length===1){const x=exact[0];select(x.title,x.author,x.url,x.work||null);return}
  if(exact.length>1){
   // On a shared title, never silently select a critic's book. A documented
   // work that dominates the index by editions can be prioritized, otherwise
   // show an author disambiguation rather than guessing.
   const ranking=[...exact].sort((a,b)=>(b.editionCount||0)-(a.editionCount||0));
   if(!author&&!local.length&&(ranking[0].editionCount||0)>=5&&
      (ranking[0].editionCount||0)>=(ranking[1].editionCount||0)*3){
    const x=ranking[0];select(x.title,x.author,x.url,x.work||null);return
   }
   rows=ranking;
  }
  const distinct=[...new Map(rows.map(x=>[fold(x.title)+'|'+fold(x.author),x])).values()];
  let page=0;
  const show=()=>{
   const batch=distinct.slice(page,page+7);
   for(const row of batch)results.append(litSimpleButton(row.title+' — '+row.author,()=>select(row.title,row.author,row.url,row.work||null)));
   page+=batch.length;
   if(page<distinct.length)results.append(litSimpleButton(
    litSimpleLabel('Alte opere','More works'),()=>{
     const last=results.lastElementChild;if(last?.textContent===litSimpleLabel('Alte opere','More works'))last.remove();
     show();
    }));
  };
  show();
  feedback.textContent=distinct.length?distinct.length+' '+litSimpleLabel('rezultate distincte','distinct matches'):
   litSimpleLabel('Nicio potrivire sigură. Încearcă titlul și autorul.','No confident match; try title and author.');
 };
 search.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();find()}});
 panel.append(search,litSimpleButton(litSimpleLabel('Caută autorul / opera','Search author / work'),find),feedback,results,title,acts,passage);
 showCountryLibrary();
}

`;
