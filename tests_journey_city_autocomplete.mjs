import assert from 'node:assert/strict';
import worker from './backend.js';

const previous=globalThis.fetch;
const calls=[];
globalThis.fetch=async input=>{
 const url=new URL(String(input));
 calls.push({text:url.searchParams.get('text'),type:url.searchParams.get('type')});
 if(url.searchParams.get('type')==='city'){
  return Response.json({results:[
   {result_type:'city',name:'Oradea',city:'Oradea',country:'Romania',country_code:'ro',lat:47.05,lon:21.93},
   {result_type:'city',name:'Oradea',city:'Oradea',country:'Romania',country_code:'ro',lat:47.05,lon:21.93},
   {result_type:'city',name:'Oran',city:'Oran',country:'Algeria',country_code:'dz',lat:35.69,lon:-0.64}
  ]});
 }
 if(url.searchParams.get('text')?.includes('Oradea')&&url.searchParams.get('text')?.includes('Romania'))
  return Response.json({results:[{name:'Piața Unirii',street:'Piața Unirii',housenumber:'1',
   formatted:'Piața Unirii 1, Oradea, România',city:'Oradea',country:'Romania',
   country_code:'ro',lat:47.055,lon:21.92,result_type:'building'}]});
 return Response.json({results:[]});
};
const suggest=async query=>{
 const response=await worker.fetch(new Request('https://unit.test/api/chat',{
  method:'POST',headers:{'content-type':'application/json'},
  body:JSON.stringify({journey_suggest:{query}})
 }),{GEOAPIFY_API_KEY:'mock'});
 assert.equal(response.status,200);
 return response.json();
};
try{
 const first=await suggest('Piața Unirii 1, Ora');
 assert.equal(first.candidates.length,0,'Partial town cannot be treated as a verified numbered address');
 assert.ok(first.completions.some(c=>/Oradea/.test(c.label)),'Oradea suggested from provider city result');
 assert.equal(first.completions.filter(c=>/Oradea/.test(c.label)).length,1,'City completion deduplicated');
 assert.ok(calls.some(c=>c.type==='city'&&c.text==='Ora'),'City prefix is queried separately');
 const second=await suggest('1 Piața Unirii, Oradea, Romania');
 assert.equal(second.candidates.length,1,'Exact street, number and full locality resolve after completion');
 assert.equal(second.candidates[0].house_number,'1');
 assert.equal(second.candidates[0].country_code,'RO');
 assert.deepEqual(second.completions,[]);
}finally{globalThis.fetch=previous}
console.log('PASS: provider-confirmed town prefix completion; never substitute unverified city centres for exact addresses');
