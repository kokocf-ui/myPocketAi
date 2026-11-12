import assert from 'node:assert/strict';
import vm from 'node:vm';
import backend from './backend.js';
import {LITERATURE_TASK_UI_SCRIPT} from './literature_task_ui.mjs';

new vm.Script(LITERATURE_TASK_UI_SCRIPT,{filename:'literature_task_ui.mjs:browser'});

async function tutoring(message,mode,reply){
 let model='',input;
 const res=await backend.fetch(new Request('https://education-fixture.test/api/chat',{
  method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({
   module:'education_study',education_subject:'language_literature',education_activity:mode,
   language:'ro',message,history:[]})
 }),{AI:{run:async(m,p)=>{model=m;input=p;return {response:reply}}}});
 return {res,data:await res.json(),model,input};
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
const readerOverlay=()=>cfg.document.body.children.at(-1);
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

console.log('PASS: grammar, dictionary, test, correction, no premature answer box, no GPS contamination');
