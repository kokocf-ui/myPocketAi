import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {cachedMixedFlightSearch} from './mixed_serpapi_discovery.mjs';
const cacheEntries=new Map();
const cache={
 match:async request=>cacheEntries.get(request.url)?.clone()||null,
 put:async(request,response)=>{cacheEntries.set(request.url,response.clone())}
};
const query={departureAirports:['LTN','STN'],arrivalAirports:['DEB','CLJ'],
 outboundDate:'2026-11-20',currency:'GBP',userInitiated:true,stops:1};
let calls=0;
const found={status:'candidate_results_only',candidates:[{
 legs:[{from:'LTN',to:'DEB',startLocal:'2026-11-20 06:05',endLocal:'2026-11-20 09:45'}],
 fareObserved:{amount:68,currency:'GBP',indicative:true}
}]};
const deps={cache,cacheBaseUrl:'https://pocketai.example.test',
 search:async()=>{calls++;return found}};
const first=await cachedMixedFlightSearch({},query,deps);
const second=await cachedMixedFlightSearch({},query,{...deps,
 search:async()=>{throw Error('SerpApi must not be queried twice for same airports/date')}});
assert.equal(first.candidates.length,1);
assert.equal(second.candidates.length,1);
assert.equal(second.cacheReused,true);
assert.equal(calls,1);
assert.equal(cacheEntries.size,1);
const key=[...cacheEntries.keys()][0];
assert.ok(!key.includes('Mill Lane')&&!key.includes('api_key')&&!key.includes('51.48'),
 'Cache key must contain neither a user address nor credentials nor coordinates');
const cached=JSON.parse(await cacheEntries.values().next().value.clone().text());
assert.equal(cached.observedAt.length,24);
assert.ok(!('origin' in cached));
const searchError=await cachedMixedFlightSearch({},{
 ...query,outboundDate:'2026-11-21'
},{...deps,search:async()=>({status:'free_quota_not_confirmed',candidates:[]})});
assert.equal(searchError.status,'free_quota_not_confirmed');
assert.equal(cacheEntries.size,1,'Never cache quota outage as no-flights');
const liveAgain=await cachedMixedFlightSearch({},{
 ...query,outboundDate:'2026-11-21'
},{...deps,search:async()=>found});
assert.equal(liveAgain.candidates.length,1,'Next search can recover after provider outage');
const backend=readFileSync(new URL('./backend.js',import.meta.url),'utf8');
const fields=backend.slice(backend.indexOf('const mixedFlightFields=async()=>{'),
 backend.indexOf('// Operator pages are a SECOND',backend.indexOf('const mixedFlightFields=async()=>{')));
assert.ok(fields.includes('if(!result?.candidates?.length)return diagnostic'),
 'Retain diagnostic status for no flight results');
assert.ok(fields.includes('let candidates=raw,detailsReady=false'));
assert.ok(fields.includes('new Promise(resolve=>setTimeout(()=>resolve(null),8500))'),
 'Do not make air search results dependent on unlimited ground itinerary latency');
assert.ok(fields.includes('flight_candidates:candidates'));
assert.ok(backend.includes('cacheBaseUrl:new URL(request.url).origin'));
const frontend=readFileSync(new URL('./index.js',import.meta.url),'utf8');
const start=frontend.indexOf('function renderMixedUnifiedResults(');
const end=frontend.indexOf('function mixedResultsSectionTitle(',start);
assert.ok(frontend.slice(start,end).includes('mixed-flight-search-disclosure'),
 'Keep airline source diagnostics visible even alongside coach cards');
console.log('PASS airline reliability: cache valid dated flights, preserve status, do not block air cards on ground supplier');
