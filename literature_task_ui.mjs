import {splitLiteraturePages} from './literature_reader_pagination.mjs';
export const LITERATURE_TASK_UI_SCRIPT=splitLiteraturePages.toString()+'\n'+String.raw`

function litSimpleNode(tag,text='',className=''){const el=document.createElement(tag);el.textContent=text;if(className)el.className=className;return el}
function litSimpleButton(text,fn){const b=litSimpleNode('button',text,'lit-activity-button');b.type='button';b.onclick=fn;return b}
function litSimpleLabel(ro,en){return learningLabel(ro,en)}

let litReaderOpen=null;
function litShowMaterialReader(title,text){
 const body=String(text||'').trim();if(!body)return;
 if(litReaderOpen?.isConnected)litReaderOpen.close();
 const dialog=document.createElement('dialog');dialog.className='lit-material-reader';
 dialog.setAttribute('aria-label',title);
 const head=litSimpleNode('div','','lit-reader-head');
 const caption=litSimpleNode('strong',title,'lit-reader-title');
 const close=litSimpleButton(litSimpleLabel('Înapoi','Back'),()=>dialog.close());
 close.classList.add('lit-reader-close');head.append(caption,close);
 const content=litSimpleNode('article','','lit-reader-scroll');
 // Target a small readable page even on a landscape phone; unusual content
 // may still scroll inside the page rather than cover the fixed Android dock.
 const vh=typeof window!=='undefined'?window.innerHeight:680;
 const vw=typeof window!=='undefined'?window.innerWidth:420;
 const pageChars=Math.max(300,Math.min(1200,Math.round(
  (Math.max(120,vh*.84-230)/26)*(Math.min(780,vw*.92)/9.5))));
 const pages=splitLiteraturePages(body,pageChars);
 const controls=[];let active=0;
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
  content.replaceChildren();
  hgDisplayStudyText(content,pages[active]||body);
  content.scrollTop=0;
  for(const control of controls){
   control.previous.disabled=active===0;
   control.next.disabled=active===pages.length-1;
   control.previous.setAttribute('aria-disabled',String(control.previous.disabled));
   control.next.setAttribute('aria-disabled',String(control.next.disabled));
   control.counter.textContent=litSimpleLabel('Pagina ','Page ')+(active+1)+' '+litSimpleLabel('din','of')+' '+pages.length;
  }
 }
 const top=pages.length>1?makePager('top'):null;
 const bottom=pages.length>1?makePager('bottom'):null;
 // PDF/print exports retain the entire unpaginated material, not only the visible page.
 const actions=litSimpleNode('div','','lit-reader-footer');
 const material={title,text:body};
 const save=litSimpleButton(litSimpleLabel('💾 Salvează PDF','💾 Save PDF'),()=>eduOpenPrint('save',material,()=>dialog.close()));
 const print=litSimpleButton(litSimpleLabel('🖨 Imprimă','🖨 Print'),()=>eduOpenPrint('print',material,()=>dialog.close()));
 actions.append(save,print);
 dialog.append(head);
 if(top)dialog.append(top);
 dialog.append(content);
 if(bottom)dialog.append(bottom);
 dialog.append(actions);
 display(0);
 dialog.addEventListener('close',()=>{dialog.remove();if(litReaderOpen===dialog)litReaderOpen=null});
 document.body.append(dialog);litReaderOpen=dialog;
 try{dialog.showModal()}catch{dialog.setAttribute('open','')}
}

let litSimpleSerial=0,litSimpleAbort=null;
async function litSimpleGenerate(out,status,mode,request,source='',onReady=null){
 if(litSimpleAbort)litSimpleAbort.abort();
 const controller=new AbortController();litSimpleAbort=controller;
 const serial=++litSimpleSerial;
 const snapshot=[litJourney.country,litJourney.grade,litJourney.branch,litJourney.topic].join('|');
 const plan=litProgram();litJourney.busy=true;
 status.textContent=litSimpleLabel('Se pregătește materialul…','Preparing study material…');
 const isHungarianAdmission=litJourney.country==='HU'&&litJourney.branch==='admission';
 const apiSubject=isHungarianAdmission?'school_admission':'language_literature';
 // Interface/output language is a user choice. The target curriculum may
 // be Hungarian, Polish etc. without changing the user's Settings language.
 const answerLanguage=(typeof state!=='undefined'&&state.language)||litJourney.language||'ro';
 const language=LIT_LANGUAGES.find(x=>x[0]===answerLanguage)?.[2]||
  (typeof Intl!=='undefined'&&Intl.DisplayNames
    ?new Intl.DisplayNames(['en'],{type:'language'}).of(answerLanguage):'English');
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
 'For lessons give substantial definitions and explanations, rules and grade-appropriate examples. '+
 'For exercises and tests produce at least five clear numbered tasks without exposing their solutions until the learner answers. '+
 'For literary study cover the author, context, themes, structure and evidence-based interpretation. '+
 'For an essay or summary provide a complete coherent text, not a template. Never invent quotations or an author attribution. '+
 'Task: '+request+'. '+source;
 try{
  const response=await fetch(CLIENT_CONFIG.apiUrl,{method:'POST',
   headers:{'Content-Type':'application/json'},
   body:JSON.stringify({message:prompt.slice(0,3900),module:'education_study',
    education_subject:apiSubject,education_activity:mode,
    language:answerLanguage,history:[]}),
   signal:controller.signal});
  const data=await response.json();
  if(!response.ok||data.status!=='success'||data.education_subject!==apiSubject||
     typeof data.reply!=='string'||!data.reply.trim())throw Error('no_educational_reply');
  if(controller.signal.aborted||!out.isConnected||serial!==litSimpleSerial||
     snapshot!==[litJourney.country,litJourney.grade,litJourney.branch,litJourney.topic].join('|'))return;
  const text=String(data.reply).trim().slice(0,72000);
  if(/(?:nu am coordonate gps|permite accesul la locație|departure address\/postcode|do not have usable gps)/i.test(text))
    throw Error('wrong_intent');
  hgDisplayStudyText(out,text);
  if(typeof onReady==='function')onReady(text);
  status.textContent=mode==='correction'?
    litSimpleLabel('Răspunsurile au fost evaluate.','Answers checked.'):
    litSimpleLabel('Materialul este afișat. Poți salva PDF sau imprima.','Material displayed. You can save or print.');
  out.scrollIntoView({behavior:'auto',block:'nearest'});
 }catch(error){
  if(controller.signal.aborted||serial!==litSimpleSerial)return;
  status.textContent=litSimpleLabel(
    'Materialul nu a putut fi generat. Încearcă din nou; nu este necesară localizarea telefonului.',
    'The lesson could not be generated. Try again; no phone location is required.');
  if(!out.textContent.trim())out.append(litSimpleNode('p',
    litSimpleLabel('Momentan nu există un răspuns educațional verificabil.','No usable educational response is available yet.')));
 }finally{
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
 litSimpleHeading(panel,title,litSimpleLabel('Alege o singură activitate. Rezultatul apare aici.','Choose one activity; its result appears here.'));
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
 const out=litSimpleNode('article','','lit-result lit-activity-output');out.setAttribute('aria-live','polite');
 const run=(mode)=>{
  const phrase=request?.value.trim()||'';
  if(needsInput&&!phrase&&mode!=='lesson'){request.focus();status.textContent=litSimpleLabel('Introdu textul sau cuvântul solicitat.','Enter the requested text or word.');return}
  assignmentText='';review.hidden=true;review.open=false;answers.value='';
  out.replaceChildren();
  if(mode==='lesson'){
   const basic=branch==='admission'?null:(LIT_OFFLINE_THEORY_DATA[topic[0]]||LIT_OFFLINE_THEORY_DATA[branch==='vocabulary'?'vocabulary':'grammar']);
   if(basic?.length===4){out.append(litSimpleNode('h4',litSimpleLabel('Repere de bază','Key concepts')));
    out.append(litSimpleNode('p',litSimpleLabel(basic[0],basic[1])));
    out.append(litSimpleNode('h4',litSimpleLabel('Exemplu','Example')));
    out.append(litSimpleNode('p',litSimpleLabel(basic[2],basic[3])))}
  }
  const school=branch==='admission'&&litJourney.targetSchool
    ?' Școală vizată: '+litJourney.targetSchool+'. Numele singur nu confirmă cerințele oficiale.'
    :'';
  const task=title+'. '+(branch==='admission'?topic[3]+school+' ':'')+
    (phrase?'Textul utilizatorului: '+phrase+'. ':'')+'Solicitare: '+mode+'.';
  litSimpleGenerate(out,status,mode,task,'',text=>{
   if(mode==='exercises'||mode==='test'){assignmentText=text;review.hidden=false}
   litShowMaterialReader(title+' · '+litSimpleLabel(
    mode==='lesson'?'Teorie':mode==='examples'?'Exemple':mode==='exercises'?'Exerciții':mode==='test'?'Test':mode==='define'?'Definiție':mode==='analysis'?'Analiză':'Material',
    mode==='lesson'?'Theory':mode==='examples'?'Examples':mode==='exercises'?'Exercises':mode==='test'?'Test':mode==='define'?'Definition':mode==='analysis'?'Analysis':'Material'),text);
  });
 };
 const buttons=branch==='analysis'?[['Analizează','Analyse','analysis'],['Explică metoda','Explain method','lesson']]:
  branch==='writing'?[['Compune','Compose','write'],['Explică','Explain','lesson']]:
  branch==='vocabulary'&&litJourney.topic==='dictionary'?[['Caută definiția','Define','define'],['Exemple','Examples','examples']]:
  [['Teorie','Theory','lesson'],['Exemple','Examples','examples'],['Exerciții','Exercises','exercises'],['Teste','Tests','test']];
 for(const [ro,en,mode]of buttons)bar.append(litSimpleButton(litSimpleLabel(ro,en),()=>run(mode)));
 panel.append(bar,status,out);

 const review=litSimpleNode('details','','lit-activity-review');
 review.hidden=true;
 const summary=litSimpleNode('summary',litSimpleLabel('Răspunde la întrebări și verifică','Answer and check the questions'));
 const answers=litSimpleNode('textarea','','lit-input');answers.rows=3;answers.placeholder=litSimpleLabel('Răspunde la exercițiile afișate mai sus','Answer the exercises shown above');
 let assignmentText='';
 const correction=litSimpleNode('article','','lit-result lit-activity-output');
 review.append(summary,answers,litSimpleButton(litSimpleLabel('Corectează','Check answers'),()=>{
  if(!assignmentText){status.textContent=litSimpleLabel('Alege mai întâi Exerciții sau Teste.','Choose Exercises or Tests first.');return}
  if(!answers.value.trim()){answers.focus();return}
  litSimpleGenerate(correction,status,'correction',
   'Evaluează răspunsul elevului: '+answers.value.trim().slice(0,1500)+'.',
   'Întrebările originale: '+assignmentText.slice(0,2200)+'. Oferă corectarea pe fiecare întrebare.',
   text=>litShowMaterialReader(litSimpleLabel('Corectarea exercițiilor','Corrected answers'),text));
 }),correction);
 panel.append(review);
 if(!needsInput)run('lesson');
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
 let chosen=null,searchNumber=0;
 const select=(name,author,url,work=null)=>{
  chosen={name,author,url,work};title.textContent=name+' — '+author;results.replaceChildren();acts.replaceChildren();
  const types=[['Studiază','Study','study'],['Rezumat','Summary','summary'],['Eseu','Essay','essay'],['Analiză pe text','Text analysis','analysis']];
  for(const [ro,en,mode] of types)acts.append(litSimpleButton(litSimpleLabel(ro,en),()=>{
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
   for(const section of sections)chapters.append(litSimpleButton(section.title,()=>
    litShowMaterialReader(chosen.name+' — '+section.title,section.text)));
   acts.append(chapters,litSimpleButton(litSimpleLabel('Citește opera integral','Read complete work'),()=>
    litShowMaterialReader(chosen.name+' — '+chosen.author,sections.map(s=>s.title+'\n\n'+s.text).join('\n\n'))));
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
  const parts=term.split(/\s+[—–-]\s+/),name=parts[0],author=fold(parts[1]||'');
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
   const response=await fetch('https://openlibrary.org/search.json?title='+encodeURIComponent(name)+'&limit=25&fields=key,title,author_name',{credentials:'omit'});
   if(!response.ok)throw Error('catalog');
   const data=await response.json();if(n!==searchNumber||!results.isConnected)return;
   rows=(data.docs||[]).flatMap(x=>(x.author_name||[]).map(w=>({title:String(x.title||''),author:String(w||''),url:/^\/works\/OL\d+W$/.test(x.key||'')?'https://openlibrary.org'+x.key:''})))
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
  if(exact.length>1)rows=exact;
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
 panel.append(search,litSimpleButton(litSimpleLabel('Caută autorul / opera','Search author / work'),find),feedback,results,title,acts,passage,out);
 showCountryLibrary();
}

`;
