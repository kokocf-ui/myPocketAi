import assert from 'node:assert/strict';
import {discoverMixedGroundOperators,normalizeMixedOperatorEvidence,
 discoverGroundCorridorCities,composeOfficialGroundConnections,resolveMixedOriginLocality}
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

const trainPage={url:'https://www.eurostar.com/uk-en/train/london-to-brussels',
 title:'London to Brussels train tickets | Eurostar'};
const busContinuation={url:'https://www.flixbus.com/bus-routes/brussels-oradea',
 title:'Brussels to Oradea Coach Travel | FlixBus'};
const routePages=[
 ...normalizeMixedOperatorEvidence([trainPage],{
  origin:{city:'London'},destination:{city:'Brussels'}}),
 ...normalizeMixedOperatorEvidence([busContinuation],{
  origin:{city:'Brussels'},destination:{city:'Oradea'}})
];
const chains=composeOfficialGroundConnections(routePages,{
 fromCity:'London',toCity:'Oradea',interchanges:[{name:'Brussels'}]
});
assert.equal(chains.length,1,'Two genuine operator route pages can form an indicative train+coach chain');
assert.deepEqual(chains[0].modes,['train','coach']);
assert.equal(chains[0].transferCity,'Brussels');
assert.equal(chains[0].door_to_door_complete,false);
assert.equal(chains[0].transfer_verified,false);
assert.equal(composeOfficialGroundConnections(routePages.slice(0,1),{
 fromCity:'London',toCity:'Oradea',interchanges:[{name:'Brussels'}]
}).length,0,'One operator leg must never be presented as a complete train+coach chain');
assert.equal(composeOfficialGroundConnections(routePages.slice(1),{
 fromCity:'London',toCity:'Oradea',interchanges:[{name:'Brussels'}]
}).length,0,'Cannot invent the missing first leg');
const corridorOrigin={latitude:51.475,longitude:0.325},corridorDestination={
 latitude:47.0612,longitude:21.9473
};
const checkCities=await discoverGroundCorridorCities({GEOAPIFY_API_KEY:'mock'},{
 origin:corridorOrigin,destination:corridorDestination,fetcher:async url=>{
  const u=new URL(String(url));
  assert.equal(u.hostname,'api.geoapify.com');
  assert.equal(u.searchParams.get('lang'),'en','Request English names for official route lookup');
  const features=[
   {properties:{name:'Cologne',country_code:'de',
    lat:50.94,lon:6.96,population:1100000}},
   {properties:{name:'Brussels',country_code:'be',
    lat:50.85,lon:4.35,population:185000}},
   {properties:{name:'Wien',country_code:'at',lat:48.2,lon:16.37,
    population:1950000,datasource:{raw:{'name:en':'Vienna'}}}}
  ];
  return {ok:true,json:async()=>({features})};
 }
});
assert.ok(checkCities.some(x=>x.name==='Brussels'),
 'Corridor city must come from live geographic candidate evidence');
assert.equal(checkCities[0].name,'Brussels',
 'The nearer rail interchange must not be hidden by a larger but remote city');
assert.ok(checkCities.some(x=>x.name==='Vienna'),
 'Geoapify local name Wien should use the sourced English name Vienna');
assert.ok(!checkCities.some(x=>x.name==='London'),
 'The example is not a preset static route');
const corridorCalls=[];
const integrated=await discoverMixedGroundOperators({
 BRAVE_API_KEY:'mock-brave',GEOAPIFY_API_KEY:'mock-geo'
},{origin,destination:{...destination,latitude:47.0612,longitude:21.9473},
 fetcher:async(url,opts)=>{
  const u=new URL(String(url));
  if(u.hostname==='api.geoapify.com'){
   if(u.pathname==='/v2/places'){
    const isLocal=u.searchParams.get('filter').includes('0.325,51.475');
    return {ok:true,json:async()=>({features:[isLocal?{
     properties:{name:'London',country_code:'gb',population:9000000,
      lat:51.51,lon:-0.13}
    }:{properties:{name:'Brussels',country_code:'be',
      population:1200000,lat:50.85,lon:4.35}}]})};
   }
   return {ok:true,json:async()=>({features:[{
    properties:{city:'London',country_code:'gb'}
   }]})};
  }
  if(u.hostname==='api.search.brave.com'){
   const q=u.searchParams.get('q')||'';
   corridorCalls.push(q);
   const coachFirst={url:'https://www.flixbus.com/bus-routes/london-brussels',
    title:'London to Brussels Coach Travel'};
   const rows=/London to Brussels/i.test(q)?
     (/train tickets Eurostar/i.test(q)?[trainPage]:[coachFirst]):
    /Brussels to Oradea/i.test(q)?[busContinuation]:[official];
   return {ok:true,json:async()=>({web:{results:rows}})};
  }
  throw Error('Unexpected test host '+u.hostname);
 }
});
assert.ok(integrated.connections.some(x=>
 x.modes.join('>')==='train>coach'&&x.transferCity==='Brussels'),
 'End-to-end discovery must expose evidence-backed rail+coach interchange');
assert.ok(corridorCalls.some(x=>/London to Brussels/i.test(x)));
assert.ok(corridorCalls.some(x=>/Brussels to Oradea/i.test(x)));
assert.ok(corridorCalls.some(x=>/London to Brussels.*train tickets Eurostar/i.test(x)),
 'Rail-specific fallback is independent from a broad coach-dominated search');
assert.ok(!corridorCalls.some(x=>/Mill Lane|Nufărului/i.test(x)),
 'Never pass street-level private route endpoints to the search provider');

console.log('PASS official coach route discovery, verified geography, indicative fare, zero fabricated transfers');

for(const title of ['Cheap bus tickets from London to Oradea','Bus London to Oradea - Buy affordable tickets']){
 const rows=normalizeMixedOperatorEvidence([{url:'https://global.flixbus.com/bus-routes/bus-london-oradea',title}],{origin,destination});
 assert.equal(rows.length,1);assert.equal(rows[0].from,'London','Official FlixBus title formats must not turn advertising words into a city');
}

let reversedGPS=0;
const gpsOrigin=await resolveMixedOriginLocality({GEOAPIFY_API_KEY:'fixture'},
 {latitude:51.475,longitude:.325,label:'Locația telefonului (GPS)'},{fetcher:async()=>{
  reversedGPS++;return Response.json({results:[{city:'Grays',country_code:'gb'}]});
 }});
assert.equal(gpsOrigin.city,'Grays','Localised GPS label is not a locality to send to train/coach search');
assert.equal(reversedGPS,1);
const denied=await discoverMixedGroundOperators({EXA_API_KEY:'fixture'},
 {origin:{...origin,city:'Grays'},destination:{...destination,city:'Oradea'},
 fetcher:async()=>new Response('{}',{status:402})});
assert.deepEqual(denied.sourceErrors,['exa_http_402','exa_http_402']);
assert.equal(denied.searchIncomplete,true,'A quota failure is not a completed negative search');
