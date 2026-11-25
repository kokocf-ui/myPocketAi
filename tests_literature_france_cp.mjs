import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import frontend from './index.js';
import {LIT_EU_PROGRAMS} from './literature_curriculum_europe.mjs';
import {literatureClientGradeExpand} from './literature_europe_client_lazy.mjs';
import {literatureNationalAuthoredMaterial} from './literature_national_authored_material.mjs';
import {literatureLoadAuthoredYear} from './literature_authored_pack_loader.mjs';
import {LITERATURE_TASK_UI_SCRIPT} from './literature_task_ui.mjs';
const pack=JSON.parse(await readFile(new URL('./public/education/literature/authored/FR/CP.json',import.meta.url),'utf8'));
assert.equal(pack.version,createHash('sha256').update(JSON.stringify(pack.chapters)).digest('hex'));
assert.equal(pack.status,'partial-original-material-independent-review-pending');
assert.match(pack.source,/education\.gouv\.fr/);
const keys=Object.keys(pack.chapters);assert.equal(keys.length,3);
const programs=JSON.parse(JSON.stringify(LIT_EU_PROGRAMS));
const picker=literatureClientGradeExpand(programs,{country:'FR',level:'beginner',grade:'CP'});
for(const key of keys){
 assert.ok(picker.some(row=>row[0]===key),'Each authored chapter must be reachable in the actual picker');
 for(const language of ['fr','ro','en'])for(const mode of ['lesson','examples','exercises','test']){
  const args={chapters:pack.chapters,country:'FR',stage:'beginner',grade:'CP',topicKey:key,language,mode};
  const result=literatureNationalAuthoredMaterial(args),row=pack.chapters[key][language];
  assert.equal(result?.topic,key);assert.equal(result.origin,'authored_france_cp');assert.ok(result.text.includes(row.sample));
  if(mode==='lesson'||mode==='examples')assert.ok(result.text.includes(row.worked));
  else{assert.equal((result.text.match(/^\d+\. /gm)||[]).length,5);assert.ok(!result.text.includes(row.worked),'No worked answer before learner responds')}
 }
}
const base={chapters:pack.chapters,country:'FR',stage:'beginner',grade:'CP',topicKey:keys[0],language:'fr',mode:'lesson'};
for(const change of [{country:'HU'},{stage:'lower'},{grade:'CE1'},{topicKey:'not-a-chapter'},{language:'de'},{mode:'correction'}])
 assert.equal(literatureNationalAuthoredMaterial({...base,...change}),null);
const memory=new Map();const storage={getItem:k=>memory.get(k)||null,setItem:(k,v)=>memory.set(k,v)};
let calls=0;const fetcher=async(url,opts)=>{calls++;assert.equal(url,'/education/literature/authored/FR/CP.json');assert.equal(opts.cache,'no-store');return {ok:true,json:async()=>pack}};
await assert.rejects(literatureLoadAuthoredYear('FR','beginner','CP',{storage,fetcher:async()=>{throw Error('offline')}}),/literature_authored_year_unavailable/);
let loaded=await literatureLoadAuthoredYear('FR','beginner','CP',{storage,fetcher});assert.equal(loaded.offline,false);assert.deepEqual(loaded.chapters,pack.chapters);
loaded=await literatureLoadAuthoredYear('FR','beginner','CP',{storage,fetcher:async()=>{throw Error('offline')}});assert.equal(loaded.offline,true);
const invalid=structuredClone(pack);delete invalid.chapters[keys[0]].fr.test;
loaded=await literatureLoadAuthoredYear('FR','beginner','CP',{storage,fetcher:async()=>({ok:true,json:async()=>invalid})});assert.equal(loaded.offline,true);
await assert.rejects(literatureLoadAuthoredYear('FR','beginner','CE1',{storage,fetcher}),/unknown_authored_year/);
const changed=structuredClone(pack);changed.chapters[keys[0]].fr.title='Titre mis à jour';changed.version=createHash('sha256').update(JSON.stringify(changed.chapters)).digest('hex');
loaded=await literatureLoadAuthoredYear('FR','beginner','CP',{storage,fetcher:async()=>({ok:true,json:async()=>changed})});assert.equal(loaded.chapters[keys[0]].fr.title,'Titre mis à jour');
const journey={country:'FR',level:'beginner',grade:'CP',branch:'program',topic:keys[0],track:'TC',region:'',language:'fr',busy:false};let key=keys[0],requests=0;
const cfg={litJourney:journey,state:{language:'fr'},litProgram:()=>({verified:false,units:[{id:journey.topic,topic:'genres'}]}),litCurrentTopic:()=>[key,'Titre','Title',''],
 LIT_LANGUAGES:[['ro','Română','Romanian'],['en','English','English'],['fr','Français','French']],LIT_OFFLINE_THEORY_DATA:{},learningLabel:(ro,en)=>ro,
 educationCountrySelection:{label:'France'},CLIENT_CONFIG:{apiUrl:'/api'},document:{createElement:tag=>({tagName:tag.toUpperCase(),textContent:''})},
 AbortController,setTimeout,clearTimeout,fetch:async()=>{requests++;throw new TypeError('Failed to fetch')},__chapters:pack.chapters};
const ui=vm.runInNewContext(LITERATURE_TASK_UI_SCRIPT+'\nObject.assign(LIT_NATIONAL_AUTHORED,__chapters);\n({generate:litSimpleGenerate})',cfg);
const el=()=>({textContent:'',append(node){this.textContent+=node.textContent}});
for(const language of ['fr','ro','en'])for(const k of keys)for(const mode of ['lesson','examples','exercises','test']){
 cfg.state.language=language;key=k;journey.topic=k;let shown='';await ui.generate(el(),el(),mode,'task','',text=>{shown=text});
 assert.ok(shown.includes(pack.chapters[k][language].sample));assert.equal(journey.busy,false);
}
assert.equal(requests,0,'Authored FR CP material must work without AI');
const html=await(await frontend.fetch(new Request('https://test.local/'))).text();
assert.ok(!html.includes('Mila a un livre. Elle lit avec Léo.'),'Authored text must be in the pack, not HTML');
console.log('PASS France CP: 3 original chapters, FR/RO/EN four modes, exact routing, update, invalid response and cached offline');
