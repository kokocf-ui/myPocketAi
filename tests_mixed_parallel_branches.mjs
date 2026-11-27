import assert from 'node:assert/strict';
import {discoverMixedGroundOperators,normalizeMixedOperatorEvidence} from './mixed_ground_operator_discovery.mjs';
import {searchMixedIndicativeOptions} from './mixed_indicative_search.mjs';
const origin={city:'Grays',country_code:'GB',latitude:51.475,longitude:.325};
const destination={city:'Oradea',country_code:'RO',latitude:47.0612,longitude:21.9473};
const coach={url:'https://www.flixbus.co.uk/bus-routes/london-oradea',title:'London to Oradea Coach Travel',
 text:'Connections with changes are available. Check dates with the operator.'};
const train={url:'https://www.eurostar.com/uk-en/train/london-to-brussels',title:'London to Brussels train tickets'};
const continuation={url:'https://www.flixbus.com/bus-routes/brussels-oradea',title:'Brussels to Oradea Coach Travel'};
const rail={url:'https://www.bahn.de/angebot/london-oradea',title:'London to Oradea train tickets'};
const evidence=normalizeMixedOperatorEvidence([coach],{origin,destination});
assert.equal(evidence.length,1,'A city-pair offer with changes is retained without constructing intermediate cities');
assert.equal(evidence[0].route_scope,'operator_city_pair');
assert.equal(evidence[0].changes_status,'unknown','Search excerpt cannot verify transfer locations');
assert.equal(evidence[0].direct_service_verified,false);
assert.equal(evidence[0].through_ticket_verified,false);
assert.equal(evidence[0].transfer_verified,false);
assert.equal(evidence[0].timetable_verified,false);

// Deterministic barrier, not timing thresholds: corridor progress has to occur
// while BOTH end-to-end mode queries are still pending. Reversing the old
// serial order fails by the watchdog instead of leaving the test hung.
for(const failCityPair of [false,true]){
 let release,watchdog,directStarted=0,corridorBeforeRelease=false;
 const pending=new Promise(resolve=>{release=resolve});
 const queries=[],progress=[];
 const work=discoverMixedGroundOperators({EXA_API_KEY:'fixture',GEOAPIFY_API_KEY:'fixture'},{
  origin,destination,
  onProgress:part=>{
   progress.push(part);
   if(part.connections?.length){
    corridorBeforeRelease=true;
    assert.equal(directStarted,2,'Both rail and coach discovery launched before corridor finished');
    release();
   }
  },
  fetcher:async(input,init)=>{
   const u=new URL(String(input));
   if(u.hostname==='api.geoapify.com'){
    assert.equal(u.pathname,'/v2/places','Nearby origin city already supplies geography proof');
    const local=u.searchParams.get('filter').includes('0.325,51.475');
    return Response.json({features:[{properties:local?
     {name:'London',country_code:'gb',population:9000000,lat:51.51,lon:-.13}:
     {name:'Brussels',country_code:'be',population:1200000,lat:50.85,lon:4.35}}]});
   }
   assert.equal(u.hostname,'api.exa.ai','No new provider / booking scraper');
   const q=JSON.parse(init.body).query;queries.push(q);
   if(/London to Brussels/.test(q))return Response.json({results:[train]});
   if(/Brussels to Oradea/.test(q))return Response.json({results:[continuation]});
   directStarted++;
   await pending;
   if(failCityPair)return new Response('{}',{status:503});
   return Response.json({results:[q.includes('train rail')?rail:coach]});
  }
 });
 try{
  const result=await Promise.race([work,new Promise((_,reject)=>{
   watchdog=setTimeout(()=>reject(Error('Corridor was blocked by city-pair discovery')),2000);
  })]);
  assert.equal(corridorBeforeRelease,true);
  assert.ok(result.connections.some(c=>c.modes.join('>')==='train>coach'));
  assert.equal(result.status,'official_operator_options','A successful corridor is usable despite both failed city-pair branches');
  assert.ok(queries.length<=8,'Existing two end-to-end + six corridor ceiling is unchanged');
  assert.ok(queries.some(q=>q.includes('train rail')),'Explicit rail branch');
  assert.ok(queries.some(q=>q.includes('coach bus')),'Explicit coach branch');
  if(failCityPair){
   assert.equal(result.operators.length,0);
   assert.ok(result.sourceErrors.includes('exa_http_503'));
   assert.ok(progress.some(p=>p.connections?.length),'Keep early corridor evidence even when all city-pair queries fail');
  }else{
   assert.deepEqual(new Set(result.operators.map(o=>o.mode)),new Set(['coach','train']));
  }
 }finally{clearTimeout(watchdog);release()}
}

// Fast coach page is published without waiting for slow rail OR corridor work.
let releaseRail,fastTimer,coachBeforeRail=false;
const railPending=new Promise(resolve=>{releaseRail=resolve});
try{
 const fast=discoverMixedGroundOperators({EXA_API_KEY:'fixture'},{
  origin:{...origin,city:'London'},destination,
  onProgress:part=>{if(part.operators?.some(o=>o.mode==='coach')){coachBeforeRail=true;releaseRail()}},
  fetcher:async(_,init)=>{
   if(JSON.parse(init.body).query.includes('train rail')){await railPending;return Response.json({results:[rail]})}
   return Response.json({results:[coach]});
  }
 });
 const result=await Promise.race([fast,new Promise((_,reject)=>{fastTimer=setTimeout(()=>reject(Error('Rail blocked coach progress')),2000)})]);
 assert.equal(coachBeforeRail,true);
 assert.equal(result.operators.length,2);
 assert.equal(result.queriesUsed,2);
}finally{clearTimeout(fastTimer);releaseRail()}

// Keep the six-option cap while reserving visibility for a slower mode.
const manyCoach=[
 ['flixbus.com','FlixBus'],['nationalexpress.com','National Express'],
 ['blablacar.com','BlaBlaCar Bus'],['euro-fratello.ro','Euro Fratello'],['tarsin.ro','Tarsin']
].map(([domain])=>({url:'https://'+domain+'/fixture-route',title:'London to Oradea Coach Travel'}));
const manyRail=[rail,{url:'https://www.oebb.at/fixture-route',title:'London to Oradea train tickets'}];
const diversified=await discoverMixedGroundOperators({BRAVE_API_KEY:'fixture'},{
 origin:{...origin,city:'London'},destination,
 fetcher:async input=>{
  const u=new URL(String(input));assert.equal(u.hostname,'api.search.brave.com');
  return Response.json({web:{results:u.searchParams.get('q').includes('train rail')?manyRail:manyCoach}});
 }
});
assert.equal(diversified.queriesUsed,2,'Brave-only search also has independent mode queries');
assert.equal(diversified.operators.length,6,'Retain the old visible option ceiling');
assert.equal(diversified.operators.filter(o=>o.mode==='train').length,2,'Coach-heavy results do not hide rail');

// Airport access enrichment must start before an unrelated ground branch ends.
let releaseGround,airTimer,preparedBeforeGround=false;
const groundPending=new Promise(resolve=>{releaseGround=resolve});
try{
 const search=searchMixedIndicativeOptions({}, {origin,destination,international:true},{
  discoverAir:async()=>({status:'candidate_results_only',candidates:[{id:'fixture-flight'}]}),
  discoverGround:async()=>{await groundPending;return {operators:evidence}},
  prepare:async(_,{candidates})=>{preparedBeforeGround=true;releaseGround();return candidates}
 });
 const result=await Promise.race([search,new Promise((_,reject)=>{airTimer=setTimeout(()=>reject(Error('Air enrichment blocked behind ground')),2000)})]);
 assert.equal(preparedBeforeGround,true);
 assert.equal(result.operator_options.length,1);
 assert.equal(result.flight_details_prepared,true);
}finally{clearTimeout(airTimer);releaseGround()}
console.log('PASS independent rail/coach/corridor branches, early ground progress, failed city-pair isolation, through-offer uncertainty, concurrent air enrichment; fixtures only');
