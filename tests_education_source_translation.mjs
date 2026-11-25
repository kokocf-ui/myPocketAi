import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
import {EDUCATION_COUNTRY_UI_SCRIPT} from './education_country_ui.mjs';
import {LITERATURE_TASK_UI_SCRIPT} from './literature_task_ui.mjs';
const LIT_HU_GRADE1_CHAPTERS=JSON.parse(await readFile(new URL('./public/education/literature/authored/HU/1.json',import.meta.url),'utf8')).chapters;
const LIT_HU_PRIMARY_BATCH=Object.fromEntries(await Promise.all(['2','3','4'].map(async g=>[g,JSON.parse(await readFile(new URL('./public/education/literature/authored/HU/'+g+'.json',import.meta.url),'utf8')).chapters])));
const france=JSON.parse(await readFile(new URL('./public/education/literature/authored/FR/CP.json',import.meta.url),'utf8'));
for(const row of Object.values(france.chapters))assert.deepEqual(Object.keys(row),['fr']);
for(const row of Object.values(LIT_HU_GRADE1_CHAPTERS))assert.deepEqual(Object.keys(row),['hu']);
for(const year of Object.values(LIT_HU_PRIMARY_BATCH)){
 assert.deepEqual(Object.keys(year.meaning),['hu']);
 for(const row of Object.values(year.chapters))assert.deepEqual(Object.keys(row),['hu']);
}
const store=new Map();let calls=0,offline=false,damage=false,waiting=null;
const journey={country:'FR',level:'beginner',grade:'CP',branch:'program',topic:'eu-year-fr-beginner-cp-intelegere',language:'fr',busy:false};
const cfg={state:{language:'ro'},litJourney:journey,
 learningLabel:(ro,en)=>ro,litProgram:()=>({units:[]}),litCurrentTopic:()=>[journey.topic,'Titre','Title',''],
 LIT_LANGUAGES:[['ro','Română','Romanian'],['en','English','English'],['de','Deutsch','German'],['fr','Français','French'],['hu','Magyar','Hungarian']],
 LIT_OFFLINE_THEORY_DATA:{},educationCountrySelection:{label:'France'},CLIENT_CONFIG:{apiUrl:'/api'},
 localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v)},
 document:{createElement:()=>({textContent:''}),getElementById:()=>null},AbortController,setTimeout,clearTimeout,console,
 fetch:async(_url,opts)=>{
  calls++;if(offline)throw Error('offline');
  const data=JSON.parse(opts.body);assert.equal(data.education_translate,true);
  const original=JSON.parse(data.message.split('Input JSON: ')[1]);
  assert.ok(original.text.includes('__EDU_KEEP_'),'Original passage should be protected');
  assert.ok(!original.text.includes('Mila a un livre. Elle lit avec Léo.'),'Original passage must not be sent for translation');
  if(waiting)await waiting;
  const text=damage?original.text.replace(/__EDU_KEEP_[A-Z]+__/,'lost'):data.language+' translated '+original.text;
  return {ok:true,json:async()=>({status:'success',reply:JSON.stringify({text})})};
 },__chapters:france.chapters,__hu:LIT_HU_GRADE1_CHAPTERS};
const ui=vm.runInNewContext(EDUCATION_COUNTRY_UI_SCRIPT+'\n'+LITERATURE_TASK_UI_SCRIPT+
 '\nObject.assign(LIT_NATIONAL_AUTHORED,__chapters);Object.assign(LIT_HU_GRADE1_CHAPTERS,__hu);({generate:litSimpleGenerate,translate:eduTranslateSourceText})',cfg);
const element=()=>({textContent:'',append(n){this.textContent+=n.textContent}});
async function run(mode='exercises'){
 const status=element();let text='';await ui.generate(element(),status,mode,'','',x=>{text=x});return {status:status.textContent,text};
}
let x=await run();assert.match(x.text,/^ro translated/);assert.match(x.text,/Mila a un livre\. Elle lit avec Léo\./);assert.doesNotMatch(x.text,/__EDU_KEEP_/);assert.equal(calls,1);
// Cached translations are language/content-specific and can be used offline.
offline=true;x=await run();assert.match(x.text,/^ro translated/);assert.equal(calls,1);
cfg.state.language='de';x=await run();assert.match(x.text,/Mila a un livre/);assert.doesNotMatch(x.text,/translated/);assert.match(x.status,/Traducerea nu este disponibilă; lecția este afișată în limba originală/);assert.equal(journey.busy,false);
// Failure is never cached as success: retry works.
offline=false;damage=true;x=await run();assert.doesNotMatch(x.text,/translated|lost/);assert.match(x.text,/Mila a un livre/);assert.match(x.status,/Traducerea nu este disponibilă/);
damage=false;x=await run();assert.match(x.text,/^de translated/);assert.match(x.text,/Mila a un livre/);
// The original language is always available without translation or network.
const before=calls;cfg.state.language='fr';offline=true;x=await run();assert.match(x.text,/Mila a un livre/);assert.equal(calls,before);
// Snapshot the requested target and reject late responses after a language change.
offline=false;cfg.state.language='en';let resolve;waiting=new Promise(r=>resolve=r);let shown='';const status=element();
const pending=ui.generate(element(),status,'lesson','','',t=>{shown=t});await Promise.resolve();cfg.state.language='hu';resolve();await pending;waiting=null;assert.equal(shown,'');assert.equal(journey.busy,false);
// Protect quoted examples, multiple occurrences and source changes in the cache key.
cfg.state.language='ro';let captured=[];cfg.fetch=async(_u,o)=>{const q=JSON.parse(o.body),p=JSON.parse(q.message.split('Input JSON: ')[1]);captured.push(p.text);return {ok:true,json:async()=>({status:'success',reply:JSON.stringify({text:'Tradus '+p.text})})}};
const a=await ui.translate('Le mot « chat » et TEXTE. TEXTE.','same','fr',{targetLanguage:'ro',protectedTexts:['TEXTE']});
assert.equal(a,'Tradus Le mot « chat » et TEXTE. TEXTE.');assert.ok(!captured[0].includes('chat')&&!captured[0].includes('TEXTE'));
const b=await ui.translate('Le mot « chat » et AUTRE. AUTRE.','same','fr',{targetLanguage:'ro',protectedTexts:['AUTRE']});assert.match(b,/AUTRE/);assert.equal(captured.length,2);
journey.country='HU';journey.grade='1';journey.topic='hu-beginner-1-year-focus';journey.language='hu';cfg.state.language='fr';
x=await run('lesson');assert.match(x.text,/^Tradus /);assert.match(x.text,/szem · szék · sál/);assert.ok(!captured.at(-1).includes('szem · szék · sál'));
console.log('PASS single-source FR/HU translation routing, protected text, selected target, cache/offline, failure, retry and language race');
