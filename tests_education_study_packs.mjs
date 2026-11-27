import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import app from './index.js';
import service from './education_pack_service.mjs';
import {educationValidateStudyPack,educationLoadStudyPack} from './education_study_pack_loader.mjs';
import {SCIENCE_RO_LESSON_EXTRAS} from './science_ro_course_plan.mjs';
import {PHYSICS_LOWER_ENGLISH_LESSONS} from './physics_lower_english_lessons.mjs';
import {BIOLOGY_UPPER_YEAR_BANK} from './biology_upper_course.mjs';
import {RO5_MATH_LESSONS,RO5_MATH_SOURCES} from './math_ro5_curriculum.mjs';
import {RO678_MATH_LESSONS,RO678_MATH_SOURCES} from './math_ro678_curriculum.mjs';
const packs={};let total=0;
for(const subject of ['math','physics','chemistry','biology']){
 const data=JSON.parse(await readFile('public/education/study-v1/'+subject+'.json','utf8'));
 assert.ok(educationValidateStudyPack(data,subject));
 const {schema,subject:id,version,...payload}=data;
 assert.equal(version,createHash('sha256').update(JSON.stringify(payload)).digest('hex'));
 const banks=data.banks;
 if(subject==='math'){
  assert.deepEqual(banks.ro5.content,RO5_MATH_LESSONS);assert.deepEqual(banks.ro678.content,RO678_MATH_LESSONS);
  assert.deepEqual(data.sources,{ro5:RO5_MATH_SOURCES,ro678:RO678_MATH_SOURCES});
  assert.equal(RO5_MATH_LESSONS.length,71);assert.equal(Object.values(RO678_MATH_LESSONS).flat().length,111);total+=182;
 }else{
  assert.deepEqual(banks.roLower.content,SCIENCE_RO_LESSON_EXTRAS[subject]);
  total+=Object.values(banks.roLower.content).flat().length;
 }
 if(subject==='physics'){
  assert.deepEqual(banks.englishLower.content,PHYSICS_LOWER_ENGLISH_LESSONS);
  assert.equal(banks.englishLower.sourceLanguage,'en');
  assert.equal(Object.values(banks.englishLower.content).flat().length,104);total+=104;
 }
 if(subject==='biology'){
  assert.deepEqual(banks.upper.content,BIOLOGY_UPPER_YEAR_BANK);
  assert.equal(banks.upper.content.flatMap(x=>x.lessons).length,90);total+=90;
 }
 packs[subject]=data;
}
assert.equal(total,631,'All authored items preserved, no title-only substitute');
const map=new Map(),storage={getItem:k=>map.get(k)||null,setItem:(k,v)=>map.set(k,v)};
const offline=async()=>{throw Error('offline')};
for(const [subject,pack] of Object.entries(packs)){
 const fetcher=async(url,opts)=>{assert.equal(url,'/education/study-v1/'+subject+'.json');assert.equal(opts.cache,'no-store');return {ok:true,json:async()=>pack}};
 assert.equal((await educationLoadStudyPack(subject,{fetcher,storage})).offline,false);
 assert.deepEqual((await educationLoadStudyPack(subject,{fetcher:offline,storage})).banks,pack.banks);
}
const noCache={getItem:()=>null,setItem(){throw Error('quota')}};
await assert.rejects(educationLoadStudyPack('astronomy',{fetcher:offline,storage}),/invalid_study_subject/);
await assert.rejects(educationLoadStudyPack('../math',{fetcher:offline,storage}),/invalid_study_subject/);
await assert.rejects(educationLoadStudyPack('math',{fetcher:offline,storage:noCache}),/unavailable/);
assert.equal((await educationLoadStudyPack('math',{fetcher:async()=>({ok:true,json:async()=>packs.math}),storage:noCache})).offline,false,'Quota must not hide valid online material');
for(const mutate of [p=>p.schema='old',p=>p.subject='chemistry',p=>p.version='bad',p=>p.banks.roLower.sourceLanguage='en',p=>p.banks.roLower.content['6'][0].title='',p=>p.banks.roLower.content['6'][0].en={},p=>p.banks.englishLower.content.units[0].subject='chemistry',p=>p.banks.roLower.content['6'].push(p.banks.roLower.content['6'][0]),p=>delete p.banks.roLower.content['8'],p=>p.banks.extra={},p=>p.banks.englishLower.content.units[0].topic='different']){
 const bad=structuredClone(packs.physics);mutate(bad);
 assert.equal(educationValidateStudyPack(bad,'physics'),false);
 await assert.rejects(educationLoadStudyPack('physics',{storage:noCache,fetcher:async()=>({ok:true,json:async()=>bad})}),/unavailable/);
 assert.equal((await educationLoadStudyPack('physics',{storage,fetcher:async()=>({ok:true,json:async()=>bad})})).offline,true,'Invalid network data never poisons good cache');
}
for(const [subject,mutate] of [['math',p=>p.sources.ro5={}],['math',p=>p.banks.ro678.content['6'][0].country='GB-ENG'],['math',p=>p.banks.ro5.content[0].grade='6'],['biology',p=>p.banks.upper.content[0].year=99],['biology',p=>p.banks.upper.content[0].lessons[0].language='en']]){
 const bad=structuredClone(packs[subject]);mutate(bad);assert.equal(educationValidateStudyPack(bad,subject),false);
}
// The same modules evaluate safely without Node. Worksheet files are never
// statically imported into Workers; no fs call is attempted in this sandbox.
const nodeSource=await readFile('education_study_node_source.mjs','utf8');
const worker=vm.runInNewContext(nodeSource.replaceAll('export ','').replaceAll('import.meta.url',JSON.stringify('file:///worker.js'))+';({study:readNodeEducationStudyPack,shared:readNodeEducationSharedPack})',{URL});
assert.equal(worker.study('math').banks.ro5.content.length,0);
assert.equal(worker.shared('physics').references.length,0);
assert.throws(()=>worker.study('../physics'),/invalid_study_subject/);
const changed=structuredClone(packs.math);changed.banks.ro5.content[0].statement='Conținut actualizat separat.';changed.version='b'.repeat(64);
assert.equal((await educationLoadStudyPack('math',{storage,fetcher:async()=>({ok:true,json:async()=>changed})})).banks.ro5.content[0].statement,'Conținut actualizat separat.');
assert.equal((await educationLoadStudyPack('math',{storage,fetcher:offline})).banks.ro5.content[0].statement,'Conținut actualizat separat.');
let published=packs.math,calls=0;
const env={EDUCATION_PACKS:{fetch:req=>service.fetch(req,{ASSETS:{fetch:async()=>{calls++;return Response.json(published)}}})}};
const request=new Request('https://study.test/education/study-v1/math.json');
assert.equal((await(await app.fetch(request,env)).json()).version,packs.math.version);
published=changed;
assert.equal((await(await app.fetch(request,env)).json()).banks.ro5.content[0].statement,'Conținut actualizat separat.');
assert.equal((await app.fetch(new Request(request.url,{method:'HEAD'}),env)).status,200);
const before=calls;
assert.equal((await app.fetch(new Request(request.url,{method:'POST'}),env)).status,405);
assert.equal((await app.fetch(new Request(request.url.replace('math','other')),env)).status,404);assert.equal(calls,before);
const html=await(await app.fetch(new Request('https://study.test/'))).text();
for(const [name,initial] of [['RO5_MATH_LESSONS','[]'],['RO678_MATH_LESSONS','Object.create(null)'],['SCIENCE_RO_LESSON_EXTRAS','Object.create(null)'],['PHYSICS_LOWER_ENGLISH_LESSONS','Object.create(null)'],['BIOLOGY_UPPER_YEAR_BANK','[]']])assert.ok(html.includes('const '+name+'='+initial+';'),'No embedded '+name);
for(const pack of Object.values(packs))for(const bank of Object.values(pack.banks))assert.ok(!html.includes(JSON.stringify(bank.content)),'No embedded bank');
assert.ok(Buffer.byteLength(html)<7_100_000,'Maintain real payload saving, not just file relocation');
console.log('PASS 4 study packs: 631 source cards, provenance, restricted service/updates, validation, quota, offline caches and browser payload reduction');
