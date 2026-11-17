import assert from 'node:assert/strict';
import worker from './backend.js';

const oldFetch=globalThis.fetch;
const calls=[];
const addr=(city,house='1')=>({lat:47.0612,lon:21.9273,
 city,street:'Piata Unirii',housenumber:house,
 formatted:'Piata Unirii '+house+', '+city+', Romania',
 country_code:'ro',result_type:'building'});
async function lookup(query){
 const resp=await worker.fetch(new Request('https://test.local/api/chat',{
  method:'POST',headers:{'content-type':'application/json'},
  body:JSON.stringify({journey_suggest:{query}})
 }),{GEOAPIFY_API_KEY:'fixture-key'});
 assert.equal(resp.status,200);
 return resp.json();
}
try {
 globalThis.fetch=async input=>{
  const url=new URL(typeof input==='string'?input:input.url||input.toString());
  calls.push(url);
  assert.equal(url.hostname,'api.geoapify.com');
  const text=url.searchParams.get('text')||'';
  // Provider returns plausible wrong house number and city as well as exact match.
  if(text.includes('1 Piata Unirii')&&text.includes('Ora'))
   return Response.json({results:[addr('Oradea','2'),addr('Oradea'),addr('Cluj-Napoca')]});
  if(text==='Ora')return Response.json({results:[{city:'Oradea',country_code:'ro'},
   {city:'Orastie',country_code:'ro'},{city:'Orange',country_code:'us'}]});
  if(text==='1 Piata Unirii, Oradea')
   return Response.json({results:[addr('Oradea')]});
  if(text==='1 Piata Unirii, Orastie')
   return Response.json({results:[]});
  return Response.json({results:[]});
 };
 let data=await lookup('Piața Unirii 1, Ora');
 assert.equal(data.exact_number_required,true);
 assert.equal(data.candidates?.length,1,'Only matching numbered address in Oradea may appear');
 assert.equal(data.candidates[0].city,'Oradea');
 assert.equal(data.candidates[0].house_number,'1');
 assert.ok(!data.candidates.some(x=>x.city==='Cluj-Napoca'||x.house_number==='2'));
 data=await lookup('Piața Unirii 1, Cla');
 assert.equal(data.candidates?.length,0,'Wrong city prefix must not match Oradea');
 // When the initial autocomplete is empty, city names are discovered from
 // provider evidence, never generated from a fixed Romanian city list.
 data=await lookup('Piața Unirii 1, Or');
 assert.equal(data.candidates?.length,0,'Very short suffix must not claim exact city');
 assert.ok(calls.every(x=>x.searchParams.get('apiKey')==='fixture-key'));
 console.log('PASS exact house number and dynamic city-prefix acceptance');
} finally {globalThis.fetch=oldFetch}
