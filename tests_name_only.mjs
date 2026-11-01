import assert from 'node:assert/strict';
import {webcrypto} from 'node:crypto';
import worker from './backend.js';
globalThis.crypto ??= webcrypto;

// Deterministic regression: a tourist may know only a business name, not its category or town.
const gps={latitude:51.49,longitude:0.28,updatedAt:Date.now()};
const feature=(name,lat=51.489,lon=0.286)=>({type:'Feature',properties:{
  name,lat,lon,city:'West Thurrock',country_code:'gb',
  formatted:name+', Weston Avenue, West Thurrock, RM20 3LP, United Kingdom',
  categories:['commercial']
},geometry:{type:'Point',coordinates:[lon,lat]}});
let scenario='matched',calls=[];
const names=['Decathlon Lakeside','Decathlon','Magazin Decathlon'];

globalThis.fetch=async input=>{
 const u=new URL(input);calls.push({path:u.pathname,host:u.hostname,name:u.searchParams.get('name'),categories:u.searchParams.get('categories')});
 if(u.pathname==='/v2/places'){
  if(u.searchParams.has('name')){
   assert.equal(u.searchParams.get('name'),'decathlon','the business name must be sent to Geoapify');
   assert.ok(u.searchParams.get('filter')?.startsWith('circle:'),'GPS circle must be sent');
   if(scenario==='provider-error')return new Response('{}',{status:503});
   return Response.json({features:scenario==='matched'?[feature('Decathlon')]:scenario==='multiple'?
     [feature('Decathlon'),feature('Decathlon',51.51,0.40)]:[]});
  }
  return Response.json({features:[]});
 }
 if(u.pathname==='/v1/geocode/search')return Response.json({features:[]});
 if(u.pathname==='/v1/geocode/reverse')return Response.json({features:[{properties:{city:'Grays',county:'Thurrock'}}]});
 if(u.pathname==='/api/interpreter')return new Response('{}',{status:503});
 if(u.hostname==='api.exa.ai')return Response.json({results:[]});
 if(u.hostname==='photon.komoot.io')return Response.json({features:[]});
 throw new Error('Unexpected provider '+u.hostname+u.pathname);
};

const env={GEOAPIFY_API_KEY:'fixture',AI:{run:async()=>({response:'Fixture only'})}};
const ask=async(message,extra={})=>{
 calls=[];
 const req=new Request('https://fixture/api/chat',{method:'POST',body:JSON.stringify({
  message,module:'assistant',language:'ro',history:[],location:gps,...extra
 })});
 const reply=await worker.fetch(req,env);
 assert.ok(reply.ok,'backend request must succeed');
 return reply.json();
};

const old={info:console.info,warn:console.warn,error:console.error};
console.info=console.warn=console.error=()=>{};
try{
 for(const message of names){
  scenario='matched';
  const result=await ask(message);
  assert.equal(result.status,'success',message);
  assert.equal(result.named_venue,true,message);
  assert.equal(result.needs_travel_confirmation,true,message);
  assert.equal(result.route_context?.pending,'profile',message);
  assert.ok(Number.isFinite(result.route_context?.destination?.latitude),message);
  assert.match(result.route_context?.destination?.label||'',/Decathlon, Weston Avenue/,message);
  assert.ok(Number.isFinite(result.straight_line_distance_km),message);
  assert.equal(calls.filter(x=>x.path==='/v2/places'&&x.name==='decathlon').length,1,message);
  console.error=old.error;console.log('PASS name-only '+JSON.stringify({input:message,lookup:'decathlon',found:true,confirmation:true}));console.error=()=>{};
 }
 scenario='multiple';
 const multiple=await ask('Decathlon');
 assert.equal(multiple.needs_destination_clarification,true);
 assert.ok(multiple.destination_candidates.length>=2);
 console.log('PASS ambiguous name -> choose among mapped candidates, never guess');

 scenario='empty';
 const empty=await ask('Decathlon');
 assert.equal(empty.needs_travel_confirmation,undefined);
 assert.equal(empty.search_ok,false);
 assert.match(empty.reply,/Nu voi inventa o adresă/);
 console.log('PASS provider returns no matching venue -> no invented coordinates');

 scenario='provider-error';
 const unavailable=await ask('Decathlon');
 assert.equal(unavailable.search_ok,false);
 assert.equal(unavailable.needs_travel_confirmation,undefined);
 console.log('PASS provider HTTP 503 -> fail closed; live provider status needs diagnostics');

 scenario='matched';
 const quick=await ask('Magazin Decathlon',{quick_place_search:true});
 assert.equal(calls.some(x=>x.path==='/v2/places'&&x.name==='decathlon'),false,'quick category flow must bypass named-venue lookup');
 assert.equal(quick.needs_travel_confirmation,undefined);
 console.log('PASS quick search does not invoke named-venue lookup');
}finally{console.info=old.info;console.warn=old.warn;console.error=old.error}
console.log('PASS: all name-only business regression scenarios completed.');
