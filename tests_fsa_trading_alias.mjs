import assert from 'node:assert/strict';
import worker from './backend.js';
import {parseNamedBusinessInformation,researchNamedBusiness,businessResearchReply} from './local_business_evidence.mjs';

const message="Vorbesc despre magazinul Sunny's Premiere din London Road, Grays.";
const target=parseNamedBusinessInformation(message);
assert.equal(target.name,"Sunny's Premiere");
const fsaRealistic={
 FHRSID:1832059,BusinessName:'Skk Convenience Store',BusinessType:'Retailers - other',
 AddressLine1:"Sunny's",AddressLine2:'433 London Road',
 AddressLine3:'South Stifford',AddressLine4:'Grays',PostCode:'RM20 4AB',
 Phone:''
};
const queries=[];
const fsa=async url=>{
 const u=new URL(url);queries.push(u);
 assert.equal(u.hostname,'api.ratings.food.gov.uk');
 assert.equal(u.searchParams.get('businessTypeId'),'4613');
 if(u.searchParams.get('name'))return Response.json({establishments:[]});
 assert.equal(u.searchParams.get('address'),'Grays');
 return Response.json({establishments:[fsaRealistic]});
};
const verified=await researchNamedBusiness(target,{apiKey:'',fetcher:fsa});
assert.equal(verified.verified,true,'Registered legal name may differ from actual trading name');
assert.equal(verified.name,"Sunny's");
assert.equal(verified.details.registeredName,'Skk Convenience Store');
assert.match(verified.details.address,/433 London Road/);
assert.match(verified.details.address,/RM20 4AB/);
assert.equal(verified.details.phone,undefined,'Do not invent a phone number missing from FSA');
assert.equal(queries.length,2,'Search registered name first, then city records for trading aliases');
assert.equal(queries[0].searchParams.get('name'),'sunny');
assert.equal(queries[1].searchParams.get('name'),null);
assert.match(businessResearchReply(verified),/Denumire în registrul oficial: Skk Convenience Store/);

const changedStreet=await researchNamedBusiness({...target,street:'Derwent Parade'},{
 apiKey:'',fetcher:async()=>Response.json({establishments:[fsaRealistic]})
});
assert.equal(changedStreet.verified,false,'No match from wrong street');
const changedCity=await researchNamedBusiness({...target,city:'Manchester'},{
 apiKey:'',fetcher:async()=>Response.json({establishments:[fsaRealistic]})
});
assert.equal(changedCity.verified,false,'No match from wrong city');
const noTradingAlias=await researchNamedBusiness(target,{
 apiKey:'',fetcher:async()=>Response.json({establishments:[{
  ...fsaRealistic,BusinessName:'Another Convenience Store',AddressLine1:'Another Store'
 }]})
});
assert.equal(noTradingAlias.verified,false,'Do not use only street and city for an unrelated shop');

// Check the actual request path with credits exhausted, not just helper logic.
const original=globalThis.fetch,seen=[];
globalThis.fetch=async url=>{
 const u=new URL(url);seen.push(u);
 if(u.hostname==='api.exa.ai')return Response.json({error:'quota exceeded'},{status:402});
 if(u.hostname==='api.ratings.food.gov.uk')return fsa(u.href);
 throw Error('Unexpected provider: '+u.hostname);
};
try{
 const response=await worker.fetch(new Request('https://unit.test/api/chat',{
  method:'POST',headers:{'content-type':'application/json'},
  body:JSON.stringify({message,language:'ro',module:'assistant',history:[]})
 }),{EXA_API_KEY:'out-of-credits',AI:{run:async()=>{throw Error('No model needed')}}});
 assert.equal(response.status,200);
 const output=await response.json();
 assert.equal(output.business_verified,true);
 assert.equal(output.business_research_reason,'public_business_record');
 assert.match(output.reply,/Sunny's/);
 assert.match(output.reply,/Skk Convenience Store/);
 assert.match(output.reply,/433 London Road/);
 assert.doesNotMatch(output.reply,/nu am putut verifica/i);
 assert.ok(seen.some(u=>u.hostname==='api.exa.ai'));
 assert.ok(seen.some(u=>u.hostname==='api.ratings.food.gov.uk'));
}finally{globalThis.fetch=original}
console.log('PASS Sunny FSA trading alias, legal business name, exact city/street and Exa 402 fallback');
