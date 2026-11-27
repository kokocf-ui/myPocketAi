import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import vm from 'node:vm';
import {FOREIGN_LANGUAGES} from './foreign_languages_curriculum.mjs';
import {foreignResourceKey,foreignValidateResource,foreignLoadResource} from './foreign_language_resource_loader.mjs';
import {FOREIGN_LANGUAGE_RESOURCES_SCRIPT} from './foreign_language_resources_ui.mjs';
import service from './education_pack_service.mjs';
const directory='public/education/languages/resources-v1';
const keys=FOREIGN_LANGUAGES.flatMap(l=>(l.variants.length?l.variants:['standard']).map(v=>foreignResourceKey(l.id,v)));
assert.equal(keys.length,19);assert.deepEqual((await readdir(directory)).sort(),keys.map(k=>k+'.json').sort());
const totals={entries:0,lessons:0,forms:0,guides:0};
for(const key of keys){
 const data=JSON.parse(await readFile(directory+'/'+key+'.json','utf8'));
 assert.equal(foreignValidateResource(data,key),true,key);
 const {schema,key:_,version,...payload}=data;assert.equal(version,createHash('sha256').update(JSON.stringify(payload)).digest('hex'));
 for(const [counter,value] of Object.entries({entries:data.dictionary.length,lessons:data.lessons.length,forms:data.lessons.reduce((n,l)=>n+l.forms.length,0),guides:data.guide.length}))totals[counter]+=value;
 for(const mutate of [x=>x.key='invalid',x=>x.variant='invalid',x=>x.dictionary.push(x.dictionary[0]),x=>x.dictionary[0].phonetic='',x=>x.dictionary[0].notation='score',x=>x.guide[0].entryIds=['missing'],x=>x.lessons[0].task.answers=[],x=>x.lessons[0].forms=[],x=>x.sourceLanguage='en',x=>x.version='not-a-hash']){
  const broken=structuredClone(data);mutate(broken);assert.equal(foreignValidateResource(broken,key),false,key+' rejects malformed resource');
 }
 let saved=null,requested=[];const storage={getItem:()=>saved,setItem:(k,v)=>{saved=v;assert.equal(k,'pocketai.languages.resources.v1.'+key)}};
 const fetcher=async(url,opts)=>{requested.push(url);assert.equal(opts.cache,'no-store');return{ok:true,json:async()=>data}};
 const online=await foreignLoadResource(data.language,data.variant,{storage,fetcher});assert.equal(online.offline,false);assert.equal(online.data.version,version);assert.deepEqual(requested,['/education/languages/resources-v1/'+key+'.json']);
 const fail=async()=>{throw Error('offline')};
 assert.equal((await foreignLoadResource(data.language,data.variant,{storage,fetcher:fail})).offline,true);
 assert.equal((await foreignLoadResource(data.language,data.variant,{storage:{getItem(){throw Error('blocked')},setItem(){throw Error('quota')}},fetcher})).data.version,version);
 await assert.rejects(foreignLoadResource(data.language,data.variant,{storage:null,fetcher:fail}),/unavailable/);
 await assert.rejects(foreignLoadResource(data.language,data.variant,{storage:{getItem:()=>'{broken'},fetcher:fail}),/unavailable/);
 const revised=structuredClone(data);revised.scopeNote+=' Updated independently.';
 const updated=await foreignLoadResource(data.language,data.variant,{storage,fetcher:async()=>({ok:true,json:async()=>revised})});assert.ok(updated.data.scopeNote.endsWith('independently.'));
 let hits=0;const env={ASSETS:{fetch:async()=>{hits++;return new Response(JSON.stringify(data),{headers:{'Cache-Control':'max-age=100'}})}}};
 const url='https://packs.test/education/languages/resources-v1/'+key+'.json';
 for(const method of ['GET','HEAD']){const result=await service.fetch(new Request(url,{method}),env);assert.equal(result.status,200);assert.equal(result.headers.get('Cache-Control'),'no-store');if(method==='HEAD')assert.equal(await result.text(),'')}
 const denied=await service.fetch(new Request(url,{method:'POST'}),env);assert.equal(denied.status,405);assert.equal(hits,2);
}
for(const tuple of [['en','standard'],['en','../GB'],['xx','standard'],['el','GB']])assert.throws(()=>foreignResourceKey(...tuple),/invalid/);
for(const path of ['/education/languages/resources-v1/../secret','/education/languages/resources-v1/en-GB.json.js'])assert.equal((await service.fetch(new Request('https://packs.test'+path),{})).status,404);
new vm.Script(FOREIGN_LANGUAGE_RESOURCES_SCRIPT);
console.log('PASS 19 independently hashed language packs, strict schema, variants, safe routes, update/cache/quota/retry: '+JSON.stringify(totals));
