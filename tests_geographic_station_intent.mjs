import assert from 'node:assert/strict';
import {webcrypto} from 'node:crypto';
import worker from './backend.js';
globalThis.crypto??=webcrypto;
const saved={info:console.info,warn:console.warn,error:console.error};
console.info=console.warn=console.error=()=>{};
let returnArea=true;
const gps={latitude:51.49,longitude:0.28,updatedAt:Date.now()};
const stop=(name,id,lon)=>({name,id,lat:51.495,lon,motType:'NaptanRailStation',network:'national-rail'});
const stations=[stop('London Victoria Rail Station','910GVCTR',-.144),
  {name:'Victoria Underground Station',id:'940GZZLUVIC',lat:51.496,lon:-.144,motType:'NaptanMetroStation',modes:['tube']}];
let calls=[];
globalThis.fetch=async input=>{
 const u=new URL(input);calls.push(u);
 if(u.pathname.includes('/StopPoint/Search/')){
  assert.equal(decodeURIComponent(u.pathname).split('/').at(-1),'Victoria');
  return Response.json({matches:stations});
 }
 if(u.pathname==='/v1/geocode/search'){
  const text=u.searchParams.get('text');
  return Response.json({features:text==='West Dulwich'&&returnArea?[{
   properties:{result_type:'suburb',name:'West Dulwich',formatted:'West Dulwich, London, United Kingdom',lat:51.439,lon:-.084},
   geometry:{coordinates:[-.084,51.439]}
  }]:[]});
 }
 if(u.pathname==='/v2/places'){
  if(u.searchParams.get('name')==='decathlon')return Response.json({features:[{
   properties:{name:'Decathlon',lat:51.489,lon:.286,
    formatted:'Decathlon, Weston Avenue, South Ockendon, UK'},
   geometry:{coordinates:[.286,51.489]}
  }]});
  // Deliberately tempting false positives for "West" and "Victoria".
  return Response.json({features:[{
   properties:{name:'Premier Inn Thurrock West',lat:51.49,lon:.28,
     formatted:'Premier Inn Thurrock West, Stonehouse Lane, Thurrock'},
   geometry:{coordinates:[.28,51.49]}
  },{
   properties:{name:'The Royal Victoria & Bull Hotel',lat:51.45,lon:.21,
     formatted:'The Royal Victoria & Bull Hotel, Dartford'},
   geometry:{coordinates:[.21,51.45]}
  }]});
 }
 if(u.hostname==='photon.komoot.io')return Response.json({features:[]});
 if(u.pathname==='/v1/geocode/reverse')return Response.json({features:[]});
 throw Error('unexpected provider '+u.hostname+u.pathname);
};
const env={GEOAPIFY_API_KEY:'fixture',TFL_APP_KEY:'fixture',AI:{run:async()=>({response:'fixture'})}};
const ask=async message=>{
 calls=[];
 const req=new Request('https://fixture/api/chat',{method:'POST',body:JSON.stringify({
  message,language:'ro',module:'assistant',history:[],location:gps
 })});
 return (await worker.fetch(req,env)).json();
};
try{
 const district=await ask('West Dulwich');
 assert.equal(district.route_context?.destination?.resolution_source,'verified_geographic_area');
 assert.match(district.reply,/West Dulwich/);
 assert.doesNotMatch(district.reply,/Premier Inn/);
 assert.equal(calls.filter(u=>u.pathname==='/v2/places').length,0);
 const victoria=await ask('Victoria station');
 assert.equal(victoria.named_venue,true);
 assert.equal(victoria.needs_destination_clarification,true);
 assert.ok(victoria.destination_candidates.length>=2);
 assert.ok(victoria.destination_candidates.every(x=>/Victoria.*Station/i.test(x.label)));
 assert.ok(!JSON.stringify(victoria).includes('Royal Victoria'));
 assert.ok(calls.some(u=>u.pathname.includes('/StopPoint/Search/')));
 const london=await ask('London Victoria station');
 assert.equal(london.needs_destination_clarification,true);
 assert.ok(london.destination_candidates.every(x=>/Victoria.*Station/i.test(x.label)));
 assert.ok(!JSON.stringify(london).includes('ibis Styles'));
 const brand=await ask('Decathlon');
 assert.equal(brand.needs_travel_confirmation,true);
 assert.match(brand.route_context?.destination?.label||'',/Decathlon/);
 returnArea=false;
 const missing=await ask('West Dulwich');
 assert.equal(missing.route_context?.destination,undefined);
 assert.match(missing.reply,/Nu am putut confirma zona/);
 assert.ok(!JSON.stringify(missing).includes('Premier Inn'));
}finally{console.info=saved.info;console.warn=saved.warn;console.error=saved.error}
console.log('PASS: West Dulwich district, Victoria station, London Victoria station, Decathlon regression and fail-closed missing area.');
