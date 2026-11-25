import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import frontend from './index.js';
import {EDUCATION_EUROPE_COUNTRIES} from './education_all_country_subject_matrix.mjs';
import {buildMathCountrySupplementCatalog} from './math_country_supplement_catalog.mjs';
import {mathLoadCountrySupplement} from './math_country_supplement_loader.mjs';
const source=buildMathCountrySupplementCatalog();
const combined={bulk:{},second:{},final:{}};
const packs={};
for(const country of EDUCATION_EUROPE_COUNTRIES){
 const pack=JSON.parse(await readFile(new URL('./public/education/math/supplements/'+country+'.json',import.meta.url),'utf8'));
 assert.equal(pack.schema,'mypocket-math-supplements/v1');assert.equal(pack.country,country);
 assert.equal(pack.version,createHash('sha256').update(JSON.stringify(pack.banks)).digest('hex'));
 for(const name of Object.keys(combined))Object.assign(combined[name],pack.banks[name]);
 packs[country]=pack;
}
assert.deepEqual(combined,source,'All three legacy teaching banks must round-trip exactly');
assert.deepEqual(Object.fromEntries(Object.entries(combined).map(([k,v])=>[k,Object.keys(v).length])),{bulk:30,second:69,final:30});
const map=new Map();const storage={setItem:(k,v)=>map.set(k,v),getItem:k=>map.get(k)||null};
const online=async(url,opts)=>{assert.equal(url,'/education/math/supplements/NO.json');assert.equal(opts.cache,'no-store');return {ok:true,json:async()=>packs.NO}};
const offline=async()=>{throw Error('offline')};
let data=await mathLoadCountrySupplement('no',{fetcher:online,storage});
assert.equal(data.offline,false);assert.deepEqual(data.banks,packs.NO.banks);
data=await mathLoadCountrySupplement('NO',{fetcher:offline,storage});assert.equal(data.offline,true);
assert.deepEqual(data.banks,packs.NO.banks);
await assert.rejects(mathLoadCountrySupplement('HU',{fetcher:offline,storage}),/math_supplement_unavailable/);
await assert.rejects(mathLoadCountrySupplement('../NO',{fetcher:offline,storage}),/invalid_country/);
const wrong=async()=>({ok:true,json:async()=>packs.HU});
assert.equal((await mathLoadCountrySupplement('NO',{fetcher:wrong,storage})).offline,true,'Invalid response must not poison cache');
const newer=structuredClone(packs.NO);newer.version='b'.repeat(64);newer.banks.bulk['NO|lower|8|algebra'][0].title='Updated';
const result=await mathLoadCountrySupplement('NO',{fetcher:async()=>({ok:true,json:async()=>newer}),storage});
assert.equal(result.banks.bulk['NO|lower|8|algebra'][0].title,'Updated');
assert.equal((await mathLoadCountrySupplement('NO',{fetcher:offline,storage})).banks.bulk['NO|lower|8|algebra'][0].title,'Updated');
const html=await(await frontend.fetch(new Request('https://math-supplements.test/'))).text();
for(const key of ['MATH_BULK_FIRST_LESSONS','MATH_SECOND_BATCH_FIRST_LESSONS','MATH_FINAL_FIRST_LESSONS']){
 assert.ok(html.includes('const '+key+'=Object.create(null)'),'No national starter bank in HTML: '+key);
}
console.log('PASS 50 Maths country supplements: 129 original entries, exact parity, updates and offline cache');
