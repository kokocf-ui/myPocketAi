import assert from 'node:assert/strict';
import {discoverMixedGroundOperators,normalizeMixedOperatorEvidence}
 from './mixed_ground_operator_discovery.mjs';
const origin={label:'Mill Lane, Grays, England, UK',country_code:'GB',latitude:51.475,longitude:0.325};
const destination={label:'Strada Nufărului 1, Oradea, România',country_code:'RO'};
const official={url:'https://www.flixbus.co.uk/bus-routes/london-oradea',
 title:'London to Oradea Coach Travel | Cheap bus tickets',
 text:'London to Oradea Bus from £92.97'};
const normalized=normalizeMixedOperatorEvidence([
 official,
 {url:'https://malicious.example/path',title:official.title},
 {url:'http://www.flixbus.co.uk/bus-routes/london-oradea',title:official.title},
 {url:'https://www.flixbus.co.uk/bus-routes/oradea-london',title:'Oradea to London Coach Travel'},
 {url:'https://www.flixbus.co.uk/coach/oradea',title:'Bus to Oradea'},
 official
],{origin,destination});
assert.equal(normalized.length,1,'Only outbound official operator route evidence should survive');
// A real Romanian address often puts the postcode BEFORE the city.
// It must not be interpreted as a city named "410100 Oradea".
const postalDestination={...destination,label:'Strada Nufărului 1, 410100 Oradea, România'};
const postalRoutes=normalizeMixedOperatorEvidence([official],{
 origin,destination:postalDestination
});
assert.equal(postalRoutes.length,1,'Postal prefix must not hide matching official coach routes');
assert.equal(postalRoutes[0].to,'Oradea');
const explicitPostcodeCity={...postalDestination,city:'410100 Oradea'};
assert.equal(normalizeMixedOperatorEvidence([official],{
 origin,destination:explicitPostcodeCity
}).length,1,'Structured city fields with postal prefixes must be cleaned too');
assert.equal(normalized[0].operator,'FlixBus');
assert.equal(normalized[0].mode,'coach');
assert.equal(normalized[0].from,'London');
assert.equal(normalized[0].to,'Oradea');
assert.equal(normalized[0].timetable_verified,false);
assert.equal(normalized[0].door_to_door_complete,false);
assert.equal(normalized[0].access_transfer_needed,true);
assert.deepEqual(normalized[0].fareFrom,{amount:92.97,currency:'GBP',kind:'published_starting_at'});
const calls=[];
const fetcher=async(url,opts)=>{
 const u=new URL(String(url));calls.push({host:u.hostname,body:opts.body||null});
 if(u.hostname==='api.exa.ai')return {ok:true,json:async()=>({results:[official]})};
 if(u.hostname==='api.geoapify.com')return {ok:true,json:async()=>({features:[
  {properties:{city:'London',country_code:'gb',result_type:'city'}}
 ]})};
 throw Error('Unexpected external host: '+u.hostname);
};
const live=await discoverMixedGroundOperators({EXA_API_KEY:'mock',GEOAPIFY_API_KEY:'mock'},
 {origin,destination,fetcher});
assert.equal(live.status,'official_operator_options');
assert.equal(live.operators.length,1);
assert.equal(live.operators[0].operator,'FlixBus');
assert.equal(live.operators[0].country_match_verified,true);
assert.ok(calls.filter(c=>c.host==='api.exa.ai').length===2);
assert.ok(calls.every(c=>!String(c.body||'').includes('Mill Lane')),
 'Street addresses must not be disclosed to a search provider');
assert.ok(calls.every(c=>!String(c.body||'').includes('Nufărului')),
 'Destination street names must not be disclosed to a search provider');
const falseLocation=await discoverMixedGroundOperators(
 {EXA_API_KEY:'mock',GEOAPIFY_API_KEY:'mock'},
 {origin,destination,fetcher:async u=>{
  if(String(u).includes('api.exa.ai'))return {ok:true,json:async()=>({results:[official]})};
  return {ok:true,json:async()=>({features:[{properties:{city:'Paris',country_code:'gb'}}]})};
 }});
assert.equal(falseLocation.operators.length,0,
 'A London operator leg must not be attached to an unrelated departure country');
const noKey=await discoverMixedGroundOperators({}, {origin,destination,fetcher});
assert.equal(noKey.status,'search_providers_not_configured');
assert.equal(noKey.operators.length,0);

const fallbackRequests=[];
const brave=await discoverMixedGroundOperators(
 {EXA_API_KEY:'mock-exa',BRAVE_API_KEY:'mock-brave',GEOAPIFY_API_KEY:'mock-geo'},
 {origin,destination,fetcher:async(url,opts)=>{
  const u=new URL(String(url));
  fallbackRequests.push({host:u.hostname,query:u.searchParams.get('q')});
  if(u.hostname==='api.exa.ai')return {ok:false,status:402};
  if(u.hostname==='api.search.brave.com')return {ok:true,json:async()=>({
   web:{results:[{url:official.url,title:official.title,
    description:'London to Oradea Bus from £92.97'}]}
  })};
  if(u.pathname==='/v2/places')return {ok:true,json:async()=>({features:[
   {properties:{name:'London',country_code:'gb',population:8900000,
     categories:['populated_place.city']}}
  ]})};
  return {ok:true,json:async()=>({features:[
   {properties:{city:'London',country_code:'gb'}}
  ]})};
 }});
assert.equal(brave.status,'official_operator_options',
 'Fallback should find an official coach page when Exa has no remaining credits');
assert.equal(brave.operators.length,1);
assert.equal(brave.operators[0].operator,'FlixBus');
assert.ok(fallbackRequests.some(r=>r.host==='api.search.brave.com'));
assert.ok(fallbackRequests.some(r=>String(r.query).includes('London')),
 'Nearby major cities must be discovered from geography, not preset for the country');
console.log('PASS official coach route discovery, verified geography, indicative fare, zero fabricated transfers');
