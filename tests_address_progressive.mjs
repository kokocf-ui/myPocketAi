import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const frontend=readFileSync(new URL('./index.js',import.meta.url),'utf8');
const browserCode=s=>s.split(String.fromCharCode(92,92)).join(String.fromCharCode(92));
const normalize=s=>String(s||'').normalize('NFD').replace(/\p{M}/gu,'').toLowerCase().trim();
const start=frontend.indexOf('function canonicalAddressCityQuery(');
const end=frontend.indexOf('\nfunction renderStructuredAddressPicker(',start);
assert.ok(start>0&&end>start);
const canonicalAddressCityQuery=new Function(browserCode(frontend.slice(start,end))+
 '\nreturn canonicalAddressCityQuery;')();
for(const q of ['Londra','Londr','Londres','Londyn','London'])
 assert.equal(canonicalAddressCityQuery('GB',q),'London','Locale-aware spelling '+q);
assert.equal(canonicalAddressCityQuery('GB','Lond'),'Lond','A short prefix is not forced into one city');
assert.equal(canonicalAddressCityQuery('RO','Londra'),'Londra','Do not change country context');

const m=frontend.indexOf('  const matchCached=(stage,q)=>{');
const n=frontend.indexOf('\n  function prewarmStreets()',m);
assert.ok(m>0&&n>m);
const getCache=new Function('normalize','selected','region','localityIndex','canonicalAddressCityQuery',
 browserCode(frontend.slice(m,n))+'\nreturn matchCached;');
const selected={country:{code:'GB'}};
const index=new Map();
const london={city:'London',label:'London, England, United Kingdom',country_code:'GB',latitude:51.5074,longitude:-0.1278};
index.set('GB|||city|lon',[london]);
const cached=getCache(normalize,selected,'',index,canonicalAddressCityQuery);
for(const q of ['Lon','Lond','Londr','Londra','London'])
 assert.deepEqual(cached('city',q),[london],'Do not erase previously verified city when typing '+q);
assert.deepEqual(cached('city','Manchester'),[]);
selected.city={city:'London'};
const oxford={city:'London',street:'Oxford Street',postcode:'W1D',label:'Oxford Street, London',latitude:51.514,longitude:-0.14};
index.set('GB|London||street|o',[oxford]);
assert.deepEqual(cached('street','O'),[oxford],'First-letter street lookup reuses verified results');
assert.deepEqual(cached('street','Ox'),[oxford]);
assert.deepEqual(cached('street','V'),[]);
selected.city={city:'Manchester'};
assert.deepEqual(cached('street','O'),[],'Do not reuse street candidates in the wrong city');

assert.ok(frontend.includes("if(stage==='city'||stage==='street'||stage==='number'){"),
 'Show existing city and street matches immediately');
assert.ok(frontend.includes("if(candidates.length)localityIndex.set(keyFor(stage,query),candidates);"),
 'Store fresh verified choices for city as well as street');
assert.ok(frontend.includes("if(key.split('|')[3]!=='city')localityIndex.delete(key);"),
 'Preserve verified cities when user selects a destination town');
assert.ok(frontend.includes(".module-result-card[hidden]{display:none!important}"),
 'Do not show the town-centre fallback while a verified station is selected');
assert.ok(frontend.includes("stage==='street'?140:200"),
 'Street lookup is active from the first letter with limited debounce');
const backend=readFileSync(new URL('./backend.js',import.meta.url),'utf8');
assert.ok(backend.includes("stage==='number'?{}:{type:types[stage]}"),
 'City requests must be filtered by city type');
assert.ok(backend.includes("stage==='street'&&query.trim().length===1"),
 'One-letter streets should be eligible for nearby prefix lookup');
console.log('PASS progressive address picker: Romanian exonyms, prefix cache, first-letter streets, city isolation and hidden buttons');
