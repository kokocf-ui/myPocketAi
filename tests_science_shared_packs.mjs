import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import app from './index.js';
import {SCIENCE_LOWER_TOPIC_LESSONS,scienceLowerTopicContent} from './science_lower_secondary_lessons.mjs';
import {scienceLoadSharedPack} from './science_shared_pack_loader.mjs';
const subjects=['physics','chemistry','biology','astronomy'];
const packs={};
for(const subject of subjects){
 const pack=JSON.parse(await readFile(new URL('./public/education/science/shared/'+subject+'.json',import.meta.url),'utf8'));
 assert.equal(pack.schema,'mypocket-science-shared/v1');assert.equal(pack.subject,subject);
 assert.deepEqual(pack.topics,SCIENCE_LOWER_TOPIC_LESSONS[subject],'All original notes preserved for '+subject);
 assert.equal(pack.version,createHash('sha256').update(JSON.stringify(pack.topics)).digest('hex'));
 for(const [topic,row] of Object.entries(pack.topics))for(const lang of ['ro','en']){
  const old=scienceLowerTopicContent(subject,topic,lang);
  assert.equal(old.explanation,row[lang][1]);assert.equal(old.answer,row[lang][4]);
 }
 packs[subject]=pack;
}
const memory=new Map();
const storage={getItem:k=>memory.get(k)||null,setItem:(k,v)=>memory.set(k,v)};
const offline=async()=>{throw Error('offline')};
for(const subject of subjects){
 const fetcher=async(url,options)=>{
  assert.equal(url,'/education/science/shared/'+subject+'.json');assert.equal(options.cache,'no-store');
  return {ok:true,json:async()=>packs[subject]};
 };
 let row=await scienceLoadSharedPack(subject,{fetcher,storage});
 assert.equal(row.offline,false);assert.deepEqual(row.topics,packs[subject].topics);
 row=await scienceLoadSharedPack(subject,{fetcher:offline,storage});
 assert.equal(row.offline,true);assert.deepEqual(row.topics,packs[subject].topics);
}
const emptyStorage={getItem:()=>null,setItem(){throw Error('quota')}};
await assert.rejects(scienceLoadSharedPack('physics',{fetcher:offline,storage:emptyStorage}),/science_shared_pack_unavailable/);
await assert.rejects(scienceLoadSharedPack('../biology',{fetcher:offline,storage}),/invalid_subject/);
await assert.rejects(scienceLoadSharedPack('physics',{fetcher:async()=>({ok:true,json:async()=>packs.chemistry}),storage:emptyStorage}),/science_shared_pack_unavailable/);
let revised=structuredClone(packs.physics);revised.version='a'.repeat(64);revised.topics.units.ro[0]='Actualizat';
const next=await scienceLoadSharedPack('physics',{fetcher:async()=>({ok:true,json:async()=>revised}),storage});
assert.equal(next.topics.units.ro[0],'Actualizat','Content updates do not need a new frontend payload');
assert.equal((await scienceLoadSharedPack('physics',{fetcher:offline,storage})).topics.units.ro[0],'Actualizat');
const html=await(await app.fetch(new Request('https://science-packs.test/'))).text();
assert.ok(html.includes('const SCIENCE_LOWER_TOPIC_LESSONS=Object.create(null)'));
assert.ok(!html.includes('Măsurarea leagă o mărime fizică de o unitate.'),'Shared lesson should not be embedded in the HTML');
console.log('PASS science shared packs: 4 subjects, exact content, updates, offline cache and unavailable cases');
