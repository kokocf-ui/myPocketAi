import assert from 'node:assert/strict';
import {webcrypto} from 'node:crypto';
import worker from './backend.js';
globalThis.crypto??=webcrypto;
const saved={info:console.info,warn:console.warn,error:console.error};
console.info=console.warn=console.error=()=>{};
const gps={latitude:51.49,longitude:.28,updatedAt:Date.now()};
let requests=[],photonAvailable=true;
const near={type:'Feature',properties:{name:'Decathlon',osm_key:'shop',
  street:'Weston Avenue',city:'South Ockendon',postcode:'RM20 3LP',country:'United Kingdom'},
  geometry:{type:'Point',coordinates:[.286,51.489]}};
const far={type:'Feature',properties:{name:'Decathlon',osm_key:'shop',city:'Paris',country:'France'},
  geometry:{type:'Point',coordinates:[2.3,48.8]}};
globalThis.fetch=async input=>{
 const u=new URL(input);requests.push(u);
 if(u.pathname==='/v2/places'){
  if(u.searchParams.has('name'))assert.equal(u.searchParams.get('name'),'decathlon');
  return Response.json({features:[]});
 }
 if(u.hostname==='photon.komoot.io'){
  assert.equal(u.searchParams.get('q'),'decathlon');
  assert.equal(u.searchParams.get('lat'),String(gps.latitude));
  assert.equal(u.searchParams.get('lon'),String(gps.longitude));
  return Response.json({features:photonAvailable?[far,near]:[]});
 }
 if(u.pathname==='/v1/geocode/search')return Response.json({features:[]});
 if(u.pathname==='/v1/geocode/reverse')return Response.json({features:[{properties:{city:'Grays',county:'Thurrock'}}]});
 if(u.pathname==='/api/interpreter')return new Response('{}',{status:503});
 throw Error('Unexpected external request: '+u.hostname+u.pathname);
};
const env={GEOAPIFY_API_KEY:'fixture',AI:{run:async()=>({response:'Fixture only'})}};
const ask=async(message,extra={})=>{
 requests=[];
 const response=await worker.fetch(new Request('https://fixture/api/chat',
 {method:'POST',body:JSON.stringify({message,language:'ro',module:'assistant',
 location:gps,history:[],...extra})}),env);
 return response.json();
};
try{
 for(const message of ['Decathlon','Decathlon Lakeside','Magazin Decathlon']){
  const result=await ask(message);
  assert.equal(result.route_context?.pending,'profile',message);
  assert.equal(result.needs_travel_confirmation,true,message);
  assert.equal(result.place_lookup?.strategy,'photon_name_search',message);
  assert.equal(result.place_lookup?.nameFilterFeatures,0,message);
  assert.equal(result.place_lookup?.photonMatched,1,message);
  assert.ok(result.route_context.destination.label.includes('Weston Avenue'),message);
  assert.ok(!result.route_context.destination.label.includes('Paris'),message);
  assert.ok(requests.some(u=>u.hostname==='photon.komoot.io'),message);
  console.info=saved.info;console.log('PASS Photon fallback: '+message);console.info=()=>{};
 }
 photonAvailable=false;
 const noResult=await ask('Decathlon');
 assert.equal(noResult.search_ok,false);
 assert.equal(noResult.place_lookup?.photonFeatures,0);
 assert.equal(noResult.place_lookup?.photonHttp,200);
 console.info=saved.info;console.log('PASS Photon empty result -> safe failure');console.info=()=>{};
 const quick=await ask('Magazin Decathlon',{quick_place_search:true});
 assert.equal(quick.needs_travel_confirmation,undefined);
 assert.equal(requests.some(u=>u.hostname==='photon.komoot.io'),false,
   'quick category requests must not enter name-only Photon branch');
 console.info=saved.info;console.log('PASS quick searches remain isolated');console.info=()=>{};
}finally{console.info=saved.info;console.warn=saved.warn;console.error=saved.error}
