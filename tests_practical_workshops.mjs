import assert from 'node:assert/strict';
import {readFile,readdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {practicalValidatePack,practicalLoadPack,practicalCheckpointCorrect,practicalCanSelfReview} from './practical_course_pack_loader.mjs';
import service from './education_pack_service.mjs';
const ids=['finance','trades','business','digital','career','daily'];
const directory='public/education/practical/course-v1';
assert.deepEqual((await readdir(directory)).sort(),ids.map(id=>id+'.json').sort());
const scenarios=new Set();let bytes=0;
for(const id of ids){
 const file=directory+'/'+id+'.json',raw=await readFile(file,'utf8'),data=JSON.parse(raw);bytes+=Buffer.byteLength(raw);
 assert.equal(practicalValidatePack(data,id),true,id);
 const hash=createHash('sha256').update(JSON.stringify(data.content)).digest('hex');
 if(process.argv.includes('--refresh-hashes')){data.version=hash;await writeFile(file,JSON.stringify(data,null,2)+'\n')}else assert.equal(data.version,hash,id+' digest');
 for(const w of data.content.workshops){
  assert.ok(!scenarios.has(w.scenario));scenarios.add(w.scenario);
  const cp=w.checkpoint,value=cp.type==='number'?String(cp.answer):String(cp.correct);
  assert.equal(practicalCheckpointCorrect(cp,value),true,w.id);assert.equal(practicalCheckpointCorrect(cp,''),false);
  if(cp.type==='number'){assert.equal(practicalCheckpointCorrect(cp,String(cp.answer).replace('.',',')),true);assert.equal(practicalCheckpointCorrect(cp,'Infinity'),false);assert.equal(practicalCheckpointCorrect(cp,'1e9'),false)}
  const ready={draft:w.template+'\nConcluzie proprie cu explicații, calcul și justificare.',seed:w.template,evidence:Object.fromEntries(w.evidence.map(e=>[e.id,true])),answer:value};
  assert.equal(practicalCanSelfReview(w,ready),true,w.id+' self-review completeness');
  for(const state of [{...ready,answer:''},{...ready,draft:w.template},{...ready,draft:'TRANSLATED TEMPLATE',seed:'TRANSLATED TEMPLATE'},{...ready,evidence:{}},{...ready,draft:'scurt'}])assert.equal(practicalCanSelfReview(w,state),false,w.id+' rejects incomplete work');
 }
 for(const mutate of [x=>x.id='wrong',x=>x.content.course.chapters[0].id='bad',x=>x.content.workshops.pop(),x=>x.content.workshops[0].checkpoint.type='unknown',x=>x.content.workshops[0].evidence.push(x.content.workshops[0].evidence[0]),x=>x.content.pathway.safety='',x=>x.sourceLanguage='en']){const bad=structuredClone(data);mutate(bad);assert.equal(practicalValidatePack(bad,id),false)}
 let cache=null;const storage={setItem:(k,v)=>{assert.equal(k,'pocketai.practical.course.v1.'+id);cache=v},getItem:()=>cache};
 const fetcher=async(url,opts)=>{assert.equal(url,'/education/practical/course-v1/'+id+'.json');assert.equal(opts.cache,'no-store');return{ok:true,json:async()=>data}};
 assert.equal((await practicalLoadPack(id,{storage,fetcher})).offline,false);
 const fail=async()=>{throw Error('offline')};assert.equal((await practicalLoadPack(id,{storage,fetcher:fail})).offline,true);
 assert.equal((await practicalLoadPack(id,{storage:{setItem(){throw Error('quota')}},fetcher})).data.id,id);
 await assert.rejects(practicalLoadPack(id,{storage:null,fetcher:fail}),/unavailable/);await assert.rejects(practicalLoadPack(id,{storage:{getItem:()=>'{bad'},fetcher:fail}),/unavailable/);
 const url='https://packs.test/education/practical/course-v1/'+id+'.json';const env={ASSETS:{fetch:async()=>new Response(raw)}};
 assert.equal((await service.fetch(new Request(url),env)).status,200);assert.equal(await(await service.fetch(new Request(url,{method:'HEAD'}),env)).text(),'');assert.equal((await service.fetch(new Request(url,{method:'POST'}),env)).status,405);
}
await assert.rejects(practicalLoadPack('../secret'),/invalid/);
assert.equal(scenarios.size,36);
console.log('PASS 6 canonical practical packs, 36 unique guided scenarios, schema/hash/routes, numeric/choice checks, no untouched-template completion, cache/offline/quota ('+bytes+' bytes)');
