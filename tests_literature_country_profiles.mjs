import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import frontend from './index.js';
import {EDUCATION_EUROPE_COUNTRIES} from './education_all_country_subject_matrix.mjs';
import {LIT_EU_PROGRAMS} from './literature_curriculum_europe.mjs';
import {literatureClientGradeExpand} from './literature_europe_client_lazy.mjs';
import {literatureLoadCountryProfile} from './literature_profile_loader.mjs';

const before=JSON.parse(JSON.stringify(LIT_EU_PROGRAMS));
const profiles={};
for(const code of [...EDUCATION_EUROPE_COUNTRIES,'OTHER-EU']){
 const asset=JSON.parse(await readFile(new URL('./public/education/literature/profiles/'+code+'.json',import.meta.url),'utf8'));
 assert.equal(asset.schema,'mypocket-literature-profile/v1');
 assert.equal(asset.country,code);
 assert.deepEqual(asset.profile,before[code]??null,'Asset must preserve the existing browser catalogue for '+code);
 assert.equal(asset.version,createHash('sha256').update(JSON.stringify(asset.profile)).digest('hex'));
 profiles[code]=asset;
}
// The same year expander must produce identical chapter rows after partitioning.
for(const [country,level,grade] of [['RO','medium','9'],['FR','lower','6e'],['HU','beginner','1'],['AD','medium','1']]){
 const a=structuredClone(before),b={[country]:structuredClone(profiles[country].profile)};
 assert.deepEqual(literatureClientGradeExpand(b,{country,level,grade}),literatureClientGradeExpand(a,{country,level,grade}),country);
}
const map=new Map();
const storage={getItem:k=>map.get(k)||null,setItem:(k,v)=>map.set(k,v)};
let current=profiles.RO;
let calls=0;
const online=async(url,options)=>{
 calls++;assert.equal(url,'/education/literature/profiles/RO.json');assert.equal(options.cache,'no-store');
 return {ok:true,json:async()=>current};
};
let result=await literatureLoadCountryProfile('ro',{fetcher:online,storage});
assert.deepEqual(result.profile,profiles.RO.profile);assert.equal(result.offline,false);
const unavailable=async()=>{throw Error('offline')};
result=await literatureLoadCountryProfile('RO',{fetcher:unavailable,storage});
assert.equal(result.offline,true);assert.deepEqual(result.profile,profiles.RO.profile);
await assert.rejects(literatureLoadCountryProfile('FR',{fetcher:unavailable,storage}),/literature_profile_unavailable/);
current={...profiles.RO,country:'FR'};
result=await literatureLoadCountryProfile('RO',{fetcher:online,storage});
assert.equal(result.offline,true,'A wrong-country response must not poison cache');
current={...profiles.RO,version:'f'.repeat(64),profile:{note:'updated'}};
result=await literatureLoadCountryProfile('RO',{fetcher:online,storage});
assert.equal(result.offline,false);assert.equal(result.profile.note,'updated','A new asset version is fetched without changing app code');
result=await literatureLoadCountryProfile('RO',{fetcher:unavailable,storage});
assert.equal(result.profile.note,'updated');
const nullResult=await literatureLoadCountryProfile('AD',{fetcher:async()=>({ok:true,json:async()=>profiles.AD}),storage});
assert.equal(nullResult.profile,null,'No invented national profile');
await assert.rejects(literatureLoadCountryProfile('../RO',{fetcher:online,storage}),/invalid_country/);
const blockedStorage={setItem(){throw Error('quota')},getItem(){throw Error('blocked')}};
result=await literatureLoadCountryProfile('RO',{fetcher:async()=>({ok:true,json:async()=>profiles.RO}),storage:blockedStorage});
assert.ok(result.profile,'Blocked local storage must not break online use');
await assert.rejects(literatureLoadCountryProfile('RO',{fetcher:unavailable,storage:blockedStorage}),/literature_profile_unavailable/);
assert.ok(calls>=3);
const html=await(await frontend.fetch(new Request('https://profile-test.example/'))).text();
assert.ok(html.includes('const LIT_EUROPE_PROGRAMS=Object.create(null)'));
assert.ok(!html.includes('Ministerul Educației: programe Limba și literatura română, clasa a IX-a (2026)'),
 'The national profile must not be embedded in the page');
console.log('PASS Literature country profile parity, validation, refresh, offline and missing-data behavior');
