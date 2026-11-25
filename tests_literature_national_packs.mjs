import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {EDUCATION_COUNTRY_UI_SCRIPT} from './education_country_ui.mjs';
import {LITERATURE_TASK_UI_SCRIPT} from './literature_task_ui.mjs';
import {literatureLoadAuthoredCatalog,literatureLoadNationalYear} from './literature_authored_pack_loader.mjs';
import {literatureNationalYearMaterial} from './literature_national_authored_material.mjs';
import {NATIONAL_PACK_PARTS,collectNationalPacks,displayedYears,slugOf} from './scripts/build_literature_national_packs.mjs';
import frontend from './index.js';
import service from './education_pack_service.mjs';

// 1. Every pack and the catalog are valid, current and render in all four modes.
execFileSync(process.execPath,['scripts/build_literature_national_packs.mjs'],{stdio:'pipe'});
const read=async p=>JSON.parse(await readFile(new URL('./public/education/literature/authored/'+p,import.meta.url),'utf8'));
const catalog=await read('catalog.json');
const {packs,errors}=await collectNationalPacks();
assert.deepEqual(errors,[]);
assert.ok(packs.length>=1&&catalog.years.length>=1);
for(const {country,pack,lang} of packs){
 assert.ok(displayedYears(country,pack.stage).includes(pack.grade),'selector offers '+country+' '+pack.grade);
 for(const record of Object.values(pack.chapters))assert.deepEqual(Object.keys(record),[lang],'single source language');
}
// FR CP and HU legacy packs keep their own loader and are not duplicated in the catalog.
assert.ok(!catalog.years.some(y=>y.country==='FR'&&y.grade==='CP'));
assert.ok(!catalog.years.some(y=>y.country==='HU'&&y.stage==='beginner'));

// 2. Catalog loader: validation, cache and offline.
const store=new Map();const storage={getItem:k=>store.get(k)??null,setItem:(k,v)=>store.set(k,v)};
const ok=data=>async()=>({ok:true,json:async()=>structuredClone(data)});
const down=async()=>{throw Error('offline')};
let c=await literatureLoadAuthoredCatalog({storage,fetcher:ok(catalog)});
assert.equal(c.offline,false);assert.equal(c.catalog.version,catalog.version);
c=await literatureLoadAuthoredCatalog({storage,fetcher:down});
assert.equal(c.offline,true);
await assert.rejects(literatureLoadAuthoredCatalog({storage:null,fetcher:ok({...catalog,schema:'x'})}),/catalog_unavailable/);
await assert.rejects(literatureLoadAuthoredCatalog({storage:null,fetcher:down}),/catalog_unavailable/);

// 3. Pack loader: England Y1 (first published national pack, now in textbook sequence).
const entry=catalog.years.find(y=>y.country==='GB-ENG'&&y.grade==='Y1');
assert.ok(entry);assert.deepEqual(entry.languages.map(l=>l.lang),['en']);
const eng=await read('GB-ENG/en-y1.json');
let p=await literatureLoadNationalYear(entry,'en',{storage,fetcher:ok(eng)});
assert.equal(p.offline,false);assert.ok(Array.isArray(eng.units)&&eng.units.length>=2);assert.ok(Object.keys(p.chapters).length>=24&&Object.keys(p.chapters).length<=40);
const engKeys=Object.keys(eng.chapters),firstKey=engKeys[0];
const poemKey=engKeys.find(k=>eng.chapters[k].en.title.startsWith('Rhymes and poems'));assert.ok(poemKey,'England Y1 has a poems lesson');
p=await literatureLoadNationalYear(entry,'en',{storage,fetcher:down});
assert.equal(p.offline,true,'validated cached pack works offline');
await assert.rejects(literatureLoadNationalYear(entry,'fr',{storage:null,fetcher:ok(eng)}),/unknown_national_year_language/);
await assert.rejects(literatureLoadNationalYear(entry,'en',{storage:null,fetcher:ok({...eng,version:'f'.repeat(64)})}),/unavailable/,'version must match catalog');
const foreign=structuredClone(eng);foreign.chapters[firstKey]={en:eng.chapters[firstKey].en,fr:{}};
await assert.rejects(literatureLoadNationalYear(entry,'en',{storage:null,fetcher:ok(foreign)}),/unavailable/,'one language per chapter');
const stranger=structuredClone(eng);stranger.chapters[firstKey.replace('-y1-','-y2-')]=eng.chapters[firstKey];
await assert.rejects(literatureLoadNationalYear(entry,'en',{storage:null,fetcher:ok(stranger)}),/unavailable/,'chapters of another year are rejected');
// Older cached copy stays usable offline after a catalog update.
const newer={...entry,languages:[{...entry.languages[0],version:'a'.repeat(64)}]};
p=await literatureLoadNationalYear(newer,'en',{storage,fetcher:down});assert.equal(p.offline,true);

// 4. Renderer: four modes, source labels, protected original, wrong year rejected.
for(const key of engKeys)for(const mode of ['lesson','examples','exercises','test']){
 const m=literatureNationalYearMaterial({pack:p,country:'GB-ENG',stage:'beginner',grade:'Y1',topicKey:key,mode});
 assert.equal(m.origin,'authored_national_year');assert.equal(m.sourceLanguage,'en');
 assert.ok(m.text.includes(p.chapters[key].en.sample));assert.ok(m.text.startsWith('# '+p.chapters[key].en.title));
 assert.ok(m.text.includes('England · Year 1'));
 if(mode==='test')assert.ok(m.text.includes(p.chapters[key].en.test[4]));
}
assert.equal(literatureNationalYearMaterial({pack:p,country:'GB-ENG',stage:'beginner',grade:'Y2',topicKey:poemKey,mode:'lesson'}),null);
assert.equal(literatureNationalYearMaterial({pack:p,country:'IE',stage:'beginner',grade:'Y1',topicKey:poemKey,mode:'lesson'}),null);

// 5. Real Literature activity flow: national pack wins over the generic chapter and is
// shown in its source language; with another UI language a failed translation shows
// the original with an explicit warning, never as a translation.
const journey={country:'GB-ENG',level:'beginner',grade:'Y1',branch:'program',topic:poemKey,language:'en',busy:false};
let translateCalls=0;
const cfg={state:{language:'en'},litJourney:journey,learningLabel:(ro,en)=>ro,litProgram:()=>({units:[]}),
 litCurrentTopic:()=>[journey.topic,'Poezie: imagine, ritm și sens · 1','',''],
 LIT_LANGUAGES:[['ro','Română','Romanian'],['en','English','English']],LIT_OFFLINE_THEORY_DATA:{},
 educationCountrySelection:{label:'England'},CLIENT_CONFIG:{apiUrl:'/api'},localStorage:storage,
 document:{createElement:()=>({textContent:''}),getElementById:()=>null},AbortController,setTimeout,clearTimeout,console,
 fetch:async()=>{translateCalls++;throw Error('offline')},__pack:p};
const ui=vm.runInNewContext(EDUCATION_COUNTRY_UI_SCRIPT+'\n'+LITERATURE_TASK_UI_SCRIPT+'\nLIT_NATIONAL_YEAR.pack=__pack;({generate:litSimpleGenerate})',cfg);
const element=()=>({textContent:'',append(n){this.textContent+=n.textContent}});
const run=async(mode='lesson')=>{const status=element();let text='',details=null;await ui.generate(element(),status,mode,'','',(t,d)=>{text=t;details=d});return {text,status:status.textContent,details}};
let x=await run();
assert.match(x.text,/^# Rhymes and poems/);assert.match(x.text,/The sun is up, the sky is blue/);
assert.equal(translateCalls,0,'source language needs no translation');assert.equal(journey.busy,false);
x=await run('test');assert.match(x.text,/Check what you know/);
cfg.state.language='ro';x=await run();
assert.ok(translateCalls>0);assert.match(x.text,/The sun is up/);assert.equal(x.details.translationFailed,true);
assert.match(x.status,/lecția este afișată în limba originală/);
// Another year must not reuse this pack.
cfg.state.language='en';journey.grade='Y2';journey.topic=poemKey.replace('-y1-','-y2-');x=await run();
assert.doesNotMatch(x.text,/The sun is up, the sky is blue/);

// 6. Frontend serializes the generic loaders and the language-of-instruction step.
const html=await(await frontend.fetch(new Request('https://lit-national.test/'))).text();
for(const needle of ['const literatureLoadAuthoredCatalog=','const literatureLoadNationalYear=','function litWithNationalYear(proceed)','function litNationalCatalogPrefetch()','function litNationalCatalogNow()',
 'lit-instruction-language','const LIT_NATIONAL_YEAR={pack:null}','function literatureNationalYearMaterial('])assert.ok(html.includes(needle),needle);
assert.ok(!html.includes('The sun is up, the sky is blue'),'lesson text is not bundled in the HTML');
const script=html.split('<script>')[1]?.split('</script>')[0];new vm.Script(script);

// 7. Separate Education service serves the catalog and national packs, not other paths.
const assets={fetch:async req=>new Response('{}',{status:new URL(req.url).pathname.includes('missing')?404:200})};
for(const path of ['/education/literature/authored/catalog.json','/education/literature/authored/GB-ENG/en-y1.json'])
 assert.equal((await service.fetch(new Request('https://e.test'+path),{ASSETS:assets})).status,200,path);
assert.equal((await service.fetch(new Request('https://e.test/education/literature/authored/gb/en-y1.json'),{ASSETS:assets})).status,404);
assert.equal((await service.fetch(new Request('https://e.test/education/literature/authored/catalog.js'),{ASSETS:assets})).status,404);

// 8. Textbook-sequence packs (TR year 1): units cover every lesson in order,
// the loader keeps units/source and rejects broken unit lists.
const trEntry=catalog.years.find(y=>y.country==='TR'&&y.grade==='1');
const tr=await read('TR/tr-1.json');
assert.ok(Array.isArray(tr.units)&&tr.units.length>=8&&Object.keys(tr.chapters).length>=30,'TR year 1 follows the textbook sequence');
assert.deepEqual(tr.units.flatMap(u=>u.keys),Object.keys(tr.chapters));
let trp=await literatureLoadNationalYear(trEntry,'tr',{storage:null,fetcher:ok(tr)});
assert.deepEqual(trp.units,tr.units);assert.equal(trp.source,tr.source);
const broken=structuredClone(tr);broken.units[0].keys.push(broken.units[1].keys[0]);
await assert.rejects(literatureLoadNationalYear(trEntry,'tr',{storage:null,fetcher:ok(broken)}),/unavailable/,'a lesson may belong to one unit only');
for(const key of Object.keys(tr.chapters))assert.ok(literatureNationalYearMaterial({pack:trp,country:'TR',stage:'beginner',grade:'1',topicKey:key,mode:'lesson'})?.text.includes(tr.chapters[key].tr.sample));
// Tutor layer: every textbook lesson explains step by step (lesson mode) and the
// test mode ends with the answers; the answers never leak into lesson/exercise modes.
for(const {country,lang,pack} of packs.filter(p=>p.pack.units)){
 assert.equal(pack.labels.length,9,country+' textbook pack needs tutor labels');
 const entry=catalog.years.find(y=>y.country===country&&y.lang===lang)||catalog.years.find(y=>y.country===country);
 const loaded=await literatureLoadNationalYear(entry,lang,{storage:null,fetcher:ok(pack)});
 for(const [key,row] of Object.entries(pack.chapters)){
  const c=row[lang];assert.ok(c.steps.length>=3&&c.answers.length===c.test.length,country+' '+key);
  const mat=mode=>literatureNationalYearMaterial({pack:loaded,country,stage:entry.stage,grade:entry.grade,topicKey:key,mode})?.text||'';
  const lesson=mat('lesson'),test=mat('test'),ex=mat('exercises');
  assert.ok(lesson.includes(pack.labels[7])&&c.steps.every(s=>lesson.includes(s)),country+' '+key+' steps');
  assert.ok(test.includes(pack.labels[8])&&c.answers.every(a=>test.includes(a)),country+' '+key+' answers');
  assert.ok(!lesson.includes(pack.labels[8])&&!ex.includes(pack.labels[8]),country+' '+key+' answers only in test mode');
 }
}
const brokenHelp=structuredClone(tr);const k0=Object.keys(brokenHelp.chapters)[0];brokenHelp.chapters[k0].tr.answers.pop();
await assert.rejects(literatureLoadNationalYear(trEntry,'tr',{storage:null,fetcher:ok(brokenHelp)}),/unavailable/,'answers must match the test');
const totalLessons=packs.reduce((n,p)=>n+Object.keys(p.pack.chapters).length,0);

console.log('PASS national Literature packs: '+packs.length+' packs / '+totalLessons+' lessons (textbook sequence: '+packs.filter(p=>p.pack.units).map(p=>p.country+' '+p.lang).join(', ')+'); catalog, loaders, cache/offline, single source, renderer, activity flow, original-language fallback, no HTML bundling, service paths');
