import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import app from './index.js';
import contentService from './education_pack_service.mjs';
import {SCIENCE_LOWER_TOPIC_LESSONS,scienceLowerTopicContent} from './science_lower_secondary_lessons.mjs';
import {scienceLoadSharedPack,scienceValidateSharedPack} from './science_shared_pack_loader.mjs';
import {PHYSICS_LAWS} from './physics_laws_reference.mjs';
import {CHEMISTRY_LAWS} from './chemistry_laws_reference.mjs';
import {ASTRONOMY_LAWS} from './astronomy_laws_reference.mjs';
import {BIOLOGY_REFERENCE,biologyReferenceText} from './biology_reference.mjs';
import {CHEMISTRY_UNIVERSITY_CORE} from './chemistry_university_core.mjs';
const subjects=['physics','chemistry','biology','astronomy'];
const refs={physics:PHYSICS_LAWS,chemistry:CHEMISTRY_LAWS,biology:BIOLOGY_REFERENCE,astronomy:ASTRONOMY_LAWS};
const packs={};
let topics=0,references=0;
for(const subject of subjects){
 const pack=JSON.parse(await readFile(new URL('./public/education/science/shared-v2/'+subject+'.json',import.meta.url),'utf8'));
 assert.ok(scienceValidateSharedPack(pack,subject));
 assert.deepEqual(pack.topics,SCIENCE_LOWER_TOPIC_LESSONS[subject]);
 assert.deepEqual(pack.references,refs[subject]);
 const {schema,subject:id,version,...payload}=pack;
 assert.equal(version,createHash('sha256').update(JSON.stringify(payload)).digest('hex'));
 for(const [topic,row] of Object.entries(pack.topics))for(const lang of ['ro','en','de','fr']){
  const source=scienceLowerTopicContent(subject,topic,lang);
  assert.equal(source.sourceLanguage,'ro');
  assert.equal(source.explanation,row.content[1]);assert.equal(source.answer,row.content[4]);
 }
 topics+=Object.keys(pack.topics).length;references+=pack.references.length;
 packs[subject]=pack;
}
assert.equal(topics,33);assert.equal(references,92);
assert.deepEqual(packs.chemistry.universityCore,CHEMISTRY_UNIVERSITY_CORE);
assert.equal(CHEMISTRY_UNIVERSITY_CORE.length,28);
assert.equal(biologyReferenceText(BIOLOGY_REFERENCE[0],'en'),biologyReferenceText(BIOLOGY_REFERENCE[0],'ro'),'Reader receives original source, never a missing English body');
const memory=new Map();
memory.set('pocketai.science.shared.v1.physics','legacy bilingual cache');
memory.set('engine.translation.cache','keep dynamic translations');
const storage={getItem:k=>memory.get(k)||null,setItem:(k,v)=>memory.set(k,v),removeItem:k=>memory.delete(k)};
const offline=async()=>{throw Error('offline')};
for(const subject of subjects){
 const fetcher=async(url,options)=>{
  assert.equal(url,'/education/science/shared-v2/'+subject+'.json');assert.equal(options.cache,'no-store');
  return {ok:true,json:async()=>packs[subject]};
 };
 let row=await scienceLoadSharedPack(subject,{fetcher,storage});
 assert.equal(row.offline,false);assert.deepEqual(row.references,packs[subject].references);
 assert.deepEqual(row.universityCore,packs[subject].universityCore);
 row=await scienceLoadSharedPack(subject,{fetcher:offline,storage});
 assert.equal(row.offline,true);assert.deepEqual(row.topics,packs[subject].topics);
}
assert.equal(memory.has('pocketai.science.shared.v1.physics'),false);
assert.equal(memory.get('engine.translation.cache'),'keep dynamic translations');
const emptyStorage={getItem:()=>null,setItem(){throw Error('quota')}};
await assert.rejects(scienceLoadSharedPack('physics',{fetcher:offline,storage:emptyStorage}),/science_shared_pack_unavailable/);
await assert.rejects(scienceLoadSharedPack('../biology',{fetcher:offline,storage}),/invalid_subject/);
for(const mutate of [p=>p.subject='chemistry',p=>p.schema='mypocket-science-shared/v1',p=>p.topics.units.content.pop(),p=>p.references[0].explainRo='',p=>p.references[0].en='Translated',p=>p.universityCore.push({}),p=>p.sourceLanguage='en',p=>p.references.push(p.references[0])]){
 const bad=structuredClone(packs.physics);mutate(bad);
 assert.equal(scienceValidateSharedPack(bad,'physics'),false);
 await assert.rejects(scienceLoadSharedPack('physics',{fetcher:async()=>({ok:true,json:async()=>bad}),storage:emptyStorage}),/science_shared_pack_unavailable/);
 assert.equal((await scienceLoadSharedPack('physics',{fetcher:async()=>({ok:true,json:async()=>bad}),storage})).offline,true,'Invalid network pack must not poison valid cache');
}
// Legacy bilingual cache must never be mistaken for source-only v2.
await assert.rejects(scienceLoadSharedPack('physics',{fetcher:offline,storage:{getItem:k=>k.includes('.v1.')?JSON.stringify(packs.physics):null}}),/unavailable/);
let revised=structuredClone(packs.physics);revised.version='a'.repeat(64);revised.topics.units.content[0]='Actualizat';revised.references[0].ro='Referință actualizată';
const next=await scienceLoadSharedPack('physics',{fetcher:async()=>({ok:true,json:async()=>revised}),storage});
assert.equal(next.topics.units.content[0],'Actualizat','Content update without rebuilding frontend');
assert.equal((await scienceLoadSharedPack('physics',{fetcher:offline,storage})).references[0].ro,'Referință actualizată');
let live=structuredClone(packs.physics),assetCalls=0;
const assets={ASSETS:{fetch:async req=>{assetCalls++;return Response.json(live)}}};
const env={EDUCATION_PACKS:{fetch:req=>contentService.fetch(req,assets)}};
const url='https://science-packs.test/education/science/shared-v2/physics.json';
assert.deepEqual(await(await app.fetch(new Request(url),env)).json(),live);
live=structuredClone(revised);
assert.equal((await(await app.fetch(new Request(url),env)).json()).references[0].ro,'Referință actualizată','Independent service update without frontend rebuild');
assert.equal((await contentService.fetch(new Request(url,{method:'HEAD'}),assets)).status,200);
const beforeRejected=assetCalls;
for(const bad of [url.replace('physics','other'),url.replace('shared-v2','shared')])assert.equal((await contentService.fetch(new Request(bad),assets)).status,404);
assert.equal((await contentService.fetch(new Request(url,{method:'POST'}),assets)).status,405);
assert.equal(assetCalls,beforeRejected);
const html=await(await app.fetch(new Request('https://science-packs.test/'))).text();
assert.ok(html.includes('const SCIENCE_LOWER_TOPIC_LESSONS=Object.create(null)'));
for(const symbol of ['PHYSICS_LAWS_DATA','CHEMISTRY_LAWS_DATA','ASTRONOMY_LAWS_DATA','BIOLOGY_REFERENCE','CHEMISTRY_UNIVERSITY_CORE'])assert.ok(html.includes('const '+symbol+'=[];'));
for(const pack of Object.values(packs))assert.ok(!html.includes(JSON.stringify(pack.references)),'Reference bank must not be embedded: '+pack.subject);
assert.ok(!html.includes('Măsurarea leagă o mărime fizică de o unitate.'));
assert.ok(Buffer.byteLength(html)<8_000_000);
console.log('PASS 4 source-only science packs: 33 topics, 92 references, 28 core courses; updates, schema rejection, isolated cache, source metadata, HTML decoupling');
