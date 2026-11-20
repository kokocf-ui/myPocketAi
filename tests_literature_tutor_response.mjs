import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import backend from './backend.js';
import {LITERATURE_TASK_UI_SCRIPT} from './literature_task_ui.mjs';
import {litEssaySpec,litEssayWords,litEssayQuality} from './literature_essay_contract.mjs';

const androidPdf=readFileSync(new URL('./android/app/src/main/java/ai/mypocket/mobile/MainActivity.java',import.meta.url),'utf8');
assert.match(androidPdf,/int requestedEssayPages=data\.optInt\("essayPages",0\)/,
 'Native PDF bridge must consume the requested essay pages');
assert.match(androidPdf,/new PdfRenderer\(descriptor\)/,
 'Inspect true PDF page count, not mobile reader pages');
assert.match(androidPdf,/for\(int attempt=0;attempt<\(essayPdf\?7:1\);attempt\+\+\)/,
 'Bounded A4 font scaling prevents fake blank-page padding');
assert.match(androidPdf,/actualPages==requestedEssayPages/,
 'Exact A4 sheet count must be verified before saving');
assert.match(androidPdf,/output\.delete\(\); \/\/ No fake extra sheets or silent partial PDF\./,
 'Never save an incomplete essay under the requested sheet count');

new vm.Script(LITERATURE_TASK_UI_SCRIPT,{filename:'literature_task_ui.mjs:browser'});

async function tutoring(message,mode,reply){
 let model='',input;const calls=[];
 const res=await backend.fetch(new Request('https://education-fixture.test/api/chat',{
  method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({
   module:'education_study',education_subject:'language_literature',education_activity:mode,
   language:'ro',message,history:[]})
 }),{AI:{run:async(m,p)=>{model=m;input=p;calls.push({m,p});return {response:typeof reply==='function'?reply(m,p,calls.length-1):reply}}}});
 return {res,data:await res.json(),model,input,calls};
}
const lessonText='Morfologia studiază structura cuvintelor. Sintaxa studiază propoziția, părțile de propoziție, relațiile gramaticale și topica. Exemplul 1: Copiii citesc. Exemplul 2: Maria este veselă.';
const grammar=await tutoring('Explică morfologie și sintaxă pentru clasa a VIII-a, România','lesson',lessonText);
assert.equal(grammar.res.status,200,'Grammar must not route to any GPS fallback');
assert.equal(grammar.data.status,'success');
assert.equal(grammar.data.reply,lessonText);
assert.equal(grammar.data.education_subject,'language_literature');
assert.equal(grammar.data.education_activity,'lesson');
assert.equal(grammar.input.messages[1].content.includes('morfologie'),true);
assert.match(grammar.input.messages[0].content,/language and literature teacher/);
assert.ok(grammar.model.startsWith('@cf/'));
const dictionary=await tutoring('Abreviere — definiție și exemple pentru România','define',
 'Abreviere: reducerea în scris a unui cuvânt ori grup de cuvinte. Exemple: dr., etc., nr.');
assert.equal(dictionary.res.status,200);
assert.match(dictionary.data.reply,/Abreviere/);
assert.match(dictionary.input.messages[0].content,/dictionary definition/);
const quiz=await tutoring('Creează un test de gramatică, clasa a VIII-a','test','1. Identifică subiectul.\n2. Identifică predicatul.\n3. Stabilește cazul.\n4. Alege forma corectă.\n5. Analizează fraza.');
assert.equal(quiz.data.education_activity,'test');
assert.match(quiz.input.messages[0].content,/five numbered assessment questions/);
const essaySegment=n=>Array.from({length:4},(_,i)=>
 'Paragraful '+(n+1)+'-'+(i+1)+'. '+Array(6).fill(
 'Poemul urmărește raportul dintre idealul inaccesibil și alegerea umană, prin alternarea unor perspective narative și lirice.').join(' ')
 ).join('\n\n');
const finishedEssay=Array.from({length:5},(_,i)=>essaySegment(i)).join('\n\n');
assert.equal(litEssaySpec(5).targetWords,2000);
assert.ok(litEssayQuality(finishedEssay,5).ok,'A genuine long-form answer must pass the A4 length gate');
assert.equal(litEssayQuality('Un eseu scurt.',5).reason,'essay_too_short');
const essayBackend=await tutoring('Scrie un eseu interpretativ de aproximativ 2000 de cuvinte, 5 pagini A4, despre Luceafărul, fără citate inventate.','essay',
 (_,__,part)=>essaySegment(part));
assert.equal(essayBackend.res.status,200);
assert.equal(essayBackend.calls.length,5,'Five printed A4 pages use five different 400-word narrative sections');
assert.ok(essayBackend.calls.every(call=>call.p.max_tokens>=2400),
 'Each section needs a full model response budget');
assert.equal(essayBackend.data.essay_pages,5);
assert.ok(essayBackend.data.essay_words>=litEssaySpec(5).minWords);
assert.match(essayBackend.input.messages[0].content,/entire requested essay/);
const tooShort=await tutoring('Scrie 5 pagini A4 despre Luceafărul','essay','Introducere și concluzie.');
assert.equal(tooShort.res.status,503,'Do not label 40 words as five A4 pages');
assert.equal(tooShort.data.error,'essay_too_short');
assert.equal(grammar.input.max_tokens,2800,'Ordinary lessons retain their normal budget');
const bad=await tutoring('Morfologie și sintaxă','lesson',
 'Nu am coordonate GPS utilizabile. Permite accesul la locație.');
assert.equal(bad.res.status,503,'A GPS result must be rejected, never marked as a complete lesson');
assert.equal(bad.data.error,'education_wrong_intent');

class El{
 constructor(tag='div'){this.tagName=tag.toUpperCase();this.children=[];this._text='';this.value='';this.className='';this.hidden=false;this.isConnected=true;this.attrs={};this.style={};
  this.classList={add:()=>{},remove:()=>{}};}
 get textContent(){return this._text+this.children.map(c=>c?.textContent||'').join('')}
 set textContent(v){this._text=String(v);this.children=[]}
 append(...x){this.children.push(...x)}
 replaceChildren(...x){this._text='';this.children=[...x]}
 setAttribute(k,v){this.attrs[k]=v}
 addEventListener(){}
 remove(){this.isConnected=false}
 focus(){this.focused=true}
 scrollIntoView(){}
}
const requests=[];
let nextResponse={status:'success',education_subject:'language_literature',reply:'1. Exemplu de subiect. 2. Alt exemplu.'};
const literature={stage:'workspace',branch:'grammar',topic:'grammar',country:'RO',grade:'8',level:'lower',track:'TC',region:'',language:'ro',busy:false};
const cfg={
 document:{body:new El('body'),createElement:tag=>new El(tag)},
 window:{innerHeight:680,innerWidth:420},
 AbortController,
 litJourney:literature,litProgram:()=>({verified:false}),
 litCurrentTopic:()=>['grammar','Morfologie și sintaxă','Morphology and syntax'],
 LIT_LANGUAGES:[['ro','Română','Romanian']],
 LIT_OFFLINE_THEORY_DATA:{grammar:['Morfologia','Morphology','Propoziția','Sentence']},
 LIT_VERIFIED_AUTHORS:[],
 educationCountrySelection:{label:'România'},
 learningLabel:(ro,en)=>ro,
 CLIENT_CONFIG:{apiUrl:'https://education-fixture.test/api/chat'},
 hgDisplayStudyText:(el,val)=>{el.replaceChildren(new El('p'));el.children[0].textContent=val},
 fetch:async(url,options)=>{
  const payload=JSON.parse(options.body);requests.push(payload);
  return {ok:true,json:async()=>nextResponse};
 }
};
const ui=vm.runInNewContext(LITERATURE_TASK_UI_SCRIPT+
 '\n({workspace:litSimpleWorkspace,generate:litSimpleGenerate})',cfg);
const all=element=>[element,...element.children.flatMap(all)];
const readerOverlay=()=>cfg.document.body.children.filter(x=>x.className==='lit-reader-overlay'&&x.isConnected).at(-1);
const readerText=()=>readerOverlay()?.children[0]?.textContent||'';
const assertReader=text=>{
 const overlay=readerOverlay();
 assert.equal(overlay?.className,'lit-reader-overlay','A dedicated reader opens above the app');
 assert.equal(overlay?.children[0]?.attrs['aria-modal'],'true','Reader is modal');
 assert.ok(readerText().includes(text),'Reader contains: '+text);
};

const press=(panel,text)=>{
 const b=all(panel).find(x=>x.tagName==='BUTTON'&&x.textContent===text);
 assert.ok(b,'Missing action button: '+text);b.onclick();return b
};
const flush=()=>new Promise(resolve=>setTimeout(resolve,0));
const panel=new El('div');ui.workspace(panel);await flush();
assert.equal(requests.length,0,'Opening a workspace must not launch AI requests automatically');
press(panel,'Teorie');await flush();
assert.equal(requests[0].module,'education_study');
assert.equal(requests[0].education_subject,'language_literature');
assert.equal(requests[0].education_activity,'lesson');
assert.ok(!requests[0].message.includes('Never request location/GPS'));
let review=all(panel).find(x=>x.tagName==='DETAILS');
assert.ok(review,'Exercise review exists internally');
assert.equal(review.hidden,true,'Review must not be visible before exercise/test generation');
assert.ok(!panel.textContent.includes('1. Exemplu de subiect.'),
 'Material is never inserted beneath the workspace buttons');
assertReader('1. Exemplu de subiect.');
nextResponse={status:'success',education_subject:'language_literature',reply:'1. Găsește subiectul. 2. Găsește predicatul. 3. Analizează substantivul. 4. Analizează verbul. 5. Rescrie corect.'};
press(panel,'Teste');await flush();
assert.equal(requests.at(-1).education_activity,'test');
assert.equal(review.hidden,false,'Answer checking only appears after a real test is loaded');
const answer=all(review).find(x=>x.tagName==='TEXTAREA');
answer.value='1. Copiii. 2. Citesc.';
nextResponse={status:'success',education_subject:'language_literature',reply:'1. Corect. 2. Corect. Continuă cu 3–5.'};
press(panel,'Corectează');await flush();
assert.equal(requests.at(-1).education_activity,'correction');
assert.ok(!panel.textContent.includes('5. Rescrie corect.'),
 'Test questions are never repeated underneath the activity grid');
assert.ok(!panel.textContent.includes('1. Corect.'),
 'Correction is shown in reader only');
assertReader('1. Corect.');
press(panel,'Teorie');await flush();
assert.equal(review.hidden,true,'Switching back to Theory hides irrelevant answer checking');
assert.equal(requests.at(-1).education_activity,'lesson');
literature.branch='vocabulary';literature.topic='dictionary';
cfg.litCurrentTopic=()=>['dictionary','Dicționar — cuvinte și expresii','Dictionary'];
nextResponse={status:'success',education_subject:'language_literature',reply:'Abreviere: formă prescurtată a unui cuvânt; exemplu: nr.'};
const dictionaryPanel=new El('div');ui.workspace(dictionaryPanel);
const field=all(dictionaryPanel).find(x=>x.tagName==='INPUT');field.value='Abreviere';
press(dictionaryPanel,'Caută definiția');await flush();
assert.equal(requests.at(-1).education_activity,'define');
assert.doesNotMatch(dictionaryPanel.textContent,/Abreviere: formă prescurtată/);
assertReader('Abreviere:');
assert.equal(all(dictionaryPanel).find(x=>x.tagName==='DETAILS')?.hidden,true,
 'Dictionary does not show answer checking');

nextResponse={status:'success',education_subject:'language_literature',reply:'Nu am coordonate GPS utilizabile. Permite accesul la locație.'};
press(dictionaryPanel,'Caută definiția');await flush();
assert.ok(!dictionaryPanel.textContent.includes('Materialul este afișat'),
 'Bad GPS reply is not accepted as a prepared study material');
assert.match(dictionaryPanel.textContent,/Nu s-a putut obține un răspuns educațional valid/);
assert.doesNotMatch(dictionaryPanel.textContent,/nu este necesară localizarea telefonului/);

// Simulate an Android WebView where appending the reader fails. The error must
// be explicit, the education screen must not claim success, and the answer form
// must not appear before the questions have been opened.
literature.branch='grammar';literature.topic='grammar';
cfg.litCurrentTopic=()=>['grammar','Morfologie și sintaxă','Morphology'];
nextResponse={status:'success',education_subject:'language_literature',reply:'1. Exercițiu de test; 2. Exemplu.'};
const brokenHost=cfg.document.body;
const originalAppend=brokenHost.append;
brokenHost.append=()=>{throw Error('simulated_dom_append_rejection')};
const blockedPanel=new El('div');ui.workspace(blockedPanel);
press(blockedPanel,'Teste');await flush();
assert.match(blockedPanel.textContent,/Fereastra de lectură nu s-a putut deschide/);
assert.match(blockedPanel.textContent,/open:Error/);
assert.equal(all(blockedPanel).find(x=>x.tagName==='DETAILS')?.hidden,true,
 'Answer form must remain hidden until modal actually opens');
brokenHost.append=originalAppend;

// Integrated UI regression: selecting a verified work and pressing Essay must
// reach the AI with the chosen length, rather than opening a short static sheet.
literature.branch='literature';literature.topic='authors';
cfg.LIT_VERIFIED_AUTHORS=[{country:'RO',name:'Mihai Eminescu',works:[{
 title:'Luceafărul',sourceUrl:'https://example.org/edition',sections:Array.from({length:7},(_,i)=>({
 title:'Partea '+(i+1),text:'Versuri verificate în ediție.',rightsVerified:true,license:'Public domain'}))
}]}];
let essayWaitMs=null;
cfg.setTimeout=(fn,ms)=>{essayWaitMs=ms;return setTimeout(fn,ms)};
cfg.clearTimeout=clearTimeout;
nextResponse={status:'success',education_subject:'language_literature',
 essay_pages:5,reply:finishedEssay};
const litPanel=new El('div');ui.workspace(litPanel);
press(litPanel,'Luceafărul — Mihai Eminescu');
const selectors=all(litPanel).filter(x=>x.tagName==='SELECT');
assert.equal(selectors.length,1,'Essay type has one selector; page count is explicitly visible');
const pageButtons=all(litPanel).filter(x=>x.tagName==='BUTTON'&&x.className?.split(/\s+/).includes('lit-essay-page-choice'));
assert.equal(pageButtons.length,5,'Android must show all five A4 lengths without a scrollable native popup');
selectors[0].value='interpretativ';
pageButtons[4].onclick();
assert.equal(pageButtons[4].attrs['aria-pressed'],'true','Fifth A4 page choice is active');
press(litPanel,'Eseu');await flush();
const essayPayload=requests.at(-1);
assert.equal(essayPayload.education_activity,'essay');
assert.match(essayPayload.message,/eseu interpretativ complet/);
assert.match(essayPayload.message,/2000 cuvinte/);
assert.equal(essayPayload.education_essay_pages,5);
assert.match(essayPayload.message,/5 pagini A4/);
assert.equal(essayWaitMs,180000,'Multi-part A4 essays have sufficient network time');
assertReader('Paragraful 1-1');
assert.doesNotMatch(readerText(),/ESEU — IUBIREA, IDEALUL/,'No static short essay');
// The PDF export must carry the 5-A4 request into Android, not the screen
// pager's independent 5/7 reading pages.
const nativeRequests=[];
cfg.window.PocketAndroidPrint={postMessage:json=>nativeRequests.push(JSON.parse(json))};
const essayReader=readerOverlay();
press(essayReader,'💾 Salvează PDF');
assert.equal(nativeRequests.at(-1)?.essayPages,5,'Native PDF receives exact requested A4 length');
assert.equal(nativeRequests.at(-1)?.text,finishedEssay,'Native PDF contains entire essay');
cfg.window.pocketEduPrintResult('a4Mismatch:5:2');
assert.equal(essayReader.isConnected,true,'Do not close reader or claim success if PDF has two instead of five A4 pages');
press(essayReader,'💾 Salvează PDF');
cfg.window.pocketEduPrintResult('saved:5');
assert.equal(essayReader.isConnected,false,'Close reader only after Android confirms five actual A4 pages');
console.log('PASS: grammar, dictionary, test, correction, no premature answer box, no GPS contamination');
