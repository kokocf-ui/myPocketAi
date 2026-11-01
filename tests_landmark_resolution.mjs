import assert from 'node:assert/strict';
import {webcrypto} from 'node:crypto';
import worker from './backend.js';
globalThis.crypto??=webcrypto;

const logs={info:console.info,warn:console.warn,error:console.error};
console.info=console.warn=console.error=()=>{};
const gps={latitude:51.48,longitude:.28,updatedAt:Date.now()};
const london={name:'Emirates Stadium',formatted:'Emirates Stadium, Hornsey Road, London, N7 7AJ, United Kingdom',
  city:'London',country:'United Kingdom',country_code:'gb',lat:51.555,lon:-.108,
  categories:['entertainment.stadium']};
const abroad={name:'Stadionul Arsenal',formatted:'Stadionul Arsenal, Reșița, România',
  city:'Reșița',country:'Romania',country_code:'ro',lat:45.31,lon:21.88,
  categories:['entertainment.stadium']};
let mode='valid',calls=[];
globalThis.fetch=async input=>{
 const url=new URL(input);calls.push(url);
 if(url.pathname==='/v1/geocode/search'){
  const q=url.searchParams.get('text')||'';
  if(mode==='valid'&&/Emirates Stadium/i.test(q))
   return Response.json({features:[{properties:abroad},{properties:london}]});
  if(mode==='wrong'||/Arsenal|Anonymous|Anonim/i.test(q))
   return Response.json({features:[{properties:abroad}]});
  return Response.json({features:[]});
 }
 if(url.pathname==='/v2/places')return Response.json({features:[]});
 if(url.hostname==='photon.komoot.io')return Response.json({features:[]});
 if(url.pathname==='/v1/geocode/reverse')return Response.json({features:[]});
 if(url.hostname==='overpass-api.de')return Response.json({elements:[]});
 throw new Error('unexpected URL '+url.toString());
};
const env={GEOAPIFY_API_KEY:'test',AI:{run:async()=>({response:'No invented place'})}};
async function ask(message,extra={}){
 calls=[];
 return (await worker.fetch(new Request('https://test/api/chat',{
  method:'POST',body:JSON.stringify({message,language:'ro',module:'assistant',location:gps,history:[],...extra})
 }),env)).json();
}
try{
 let result=await ask('Vreau sa ajung la stadionul Arsenal');
 assert.equal(result.needs_travel_mode,true,'ask for mode only once coordinates verified');
 assert.equal(result.route_context?.pending,'profile');
 assert.ok(result.route_context?.destination?.label.includes('Emirates Stadium'));
 assert.ok(!JSON.stringify(result).includes('Reșița'),'never substitute the foreign club name');
 assert.ok(result.straight_line_distance_km>3,'distance hides inappropriate full walking suggestion');
 assert.equal(result.place_lookup?.strategy,'verified_destination_preflight');
 assert.ok(calls.some(x=>x.pathname==='/v1/geocode/search'&&/Emirates Stadium, London/i.test(x.searchParams.get('text'))));
 result=await ask('Stadionul Arsenal');
 assert.equal(result.needs_travel_confirmation,true);
 assert.match(result.route_context?.destination?.label||'',/Emirates Stadium/);
 assert.equal(result.place_lookup?.strategy,'verified_landmark_alias');
 mode='wrong';
 result=await ask('Vreau sa ajung la stadionul Arsenal');
 assert.equal(result.needs_travel_mode,undefined,'no transport offered for wrong destination');
 assert.equal(result.needs_destination_clarification,true);
 assert.equal(result.route_context?.destination,undefined);
 assert.ok(!JSON.stringify(result).includes('Reșița'));
 result=await ask('Stadionul Arsenal');
 assert.equal(result.needs_travel_confirmation,undefined,'plain unverified lookup does not ask for journey');
 assert.equal(result.search_ok,false);
 result=await ask('Vreau sa ajung la muzeul Anonim');
 assert.equal(result.needs_travel_mode,undefined,'an unverified landmark must not trigger mode options');
 assert.equal(result.needs_destination_clarification,true);
}finally{console.info=logs.info;console.warn=logs.warn;console.error=logs.error}
console.log('PASS: Arsenal popular/official name is map verified, no distant Reșița substitution, no premature transport for unknown landmarks.');
