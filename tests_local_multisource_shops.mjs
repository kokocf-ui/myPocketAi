import assert from 'node:assert/strict';
import worker from './backend.js';
import {parseNamedBusinessInformation,researchNamedBusiness,isStreetOnlyPlace,businessResearchReply} from './local_business_evidence.mjs';
import {nearbyUkRegisteredRetailers} from './uk_food_retailers.mjs';
const sample="Vorbesc despre magazinul Sunny's Premiere din London road, Grays";
const parsed=parseNamedBusinessInformation(sample);
assert.deepEqual(parsed,{name:"Sunny's Premiere",street:'London road',city:'Grays',country:''});
assert.equal(parseNamedBusinessInformation('Ce magazine găsești în jurul străzii Morii din Oradea, România?'),null);
assert.equal(parseNamedBusinessInformation("Cum ajung la magazinul Sunny's din Grays?"),null);
assert.equal(isStreetOnlyPlace('Strada Bumbacului'),true);
assert.equal(isStreetOnlyPlace('Strada Morii','Strada Morii'),true);
assert.equal(isStreetOnlyPlace('Premier Sunny’s', 'London Road'),false);
const official={
 title:"Sunny's | Premier-stores.co.uk",
 url:'https://www.premier-stores.co.uk/our-stores/sunnys-1',
 highlights:['Sunny’s is on 433 London Road, Grays RM20 4AB'],
 text:"Sunny's. 433 London Road Grays RM20 4AB 01375378797 Monday: 5:00 am-10:00 pm Tuesday: 5:00 am-10:00 pm Wednesday: 5:00 am-10:00 pm Thursday: 5:00 am-10:00 pm Friday: 5:00 am-10:00 pm Saturday: 5:00 am-10:00 pm Sunday: 6:00 am-10:00 pm Food to Go Fresh Bread Fresh Fruit & Vegetables Frozen Foods"
};
const exaFetcher=async(url,opt)=>{
 assert.equal(new URL(url).hostname,'api.exa.ai');
 assert.ok(JSON.parse(opt.body).query.includes('London road'));
 return Response.json({results:[
  {title:'Sunny Shop Manchester',url:'https://example.org/wrong',text:'Sunny Shop Manchester, West Road'},
  official
 ]});
};
const verified=await researchNamedBusiness(parsed,{apiKey:'test',fetcher:exaFetcher});
assert.equal(verified.verified,true);
assert.equal(verified.sources.length,1,'Reject unrelated town and street pages');
assert.equal(verified.sources[0].official,true);
assert.match(businessResearchReply(verified),/01375378797/);
assert.match(businessResearchReply(verified),/433 London road/i);
assert.match(businessResearchReply(verified),/pâine proaspătă/);
assert.match(businessResearchReply(verified),/premier-stores/);
const unverified=await researchNamedBusiness(parsed,{apiKey:'test',fetcher:async()=>Response.json({results:[
 {title:'Sunny London',url:'https://example.org/wrong',text:'Other Road, Grays'}
]})});
assert.equal(unverified.verified,false);
assert.match(businessResearchReply(unverified),/Nu am putut verifica/);
assert.equal((await researchNamedBusiness(parsed,{apiKey:''})).verified,false);
let fsaQueries=[];
const mockFsa=async(url,options)=>{
 const u=new URL(url);fsaQueries.push(u);
 assert.equal(options.headers['x-api-version'],'2');
 return Response.json({establishments:[
  {BusinessName:'Skk Convenience Store',BusinessType:'Retailers - other',
   FHRSID:1832059,PostCode:'RM20 4AB',AddressLine1:"Sunny's",AddressLine2:'433 London Road',
   AddressLine3:'South Stifford',AddressLine4:'Grays',geocode:{latitude:51.47755,longitude:0.30069}},
  {BusinessName:'Shop out of range',BusinessType:'Retailers - other',geocode:{latitude:52.1,longitude:0.3}},
  {BusinessName:'Café incorrectly classified',BusinessType:'Restaurant/Cafe/Canteen',
   geocode:{latitude:51.47755,longitude:0.30069}}
 ]});
};
const fsa=await nearbyUkRegisteredRetailers(51.4775,0.3007,1500,{fetcher:mockFsa});
assert.equal(fsa.length,1);
assert.equal(fsa[0].tags.name,'Skk Convenience Store');
assert.match(fsa[0].tags.fsa_address,/433 London Road/);
assert.equal(fsaQueries[0].searchParams.get('businessTypeId'),'4613');
assert.ok(Number(fsaQueries[0].searchParams.get('maxDistanceLimit'))<1);
assert.equal((await nearbyUkRegisteredRetailers(47.03,21.96,1500,{fetcher:mockFsa})).length,0,
 'Never query UK register around Romania');

const originalFetch=globalThis.fetch;
const seen=[];
globalThis.fetch=async(url,options)=>{
 const u=new URL(typeof url==='string'?url:url.url||url.toString());seen.push(u);
 if(u.hostname==='api.exa.ai')return exaFetcher(u.href,options);
 if(u.hostname==='api.ratings.food.gov.uk')return mockFsa(u.href,options);
 if(u.hostname==='api.geoapify.com'&&u.pathname==='/v2/places')
  return Response.json({features:[
   {type:'Feature',geometry:{type:'Point',coordinates:[0.3007,51.4775]},
    properties:{name:'London Road',street:'London Road',categories:['commercial'],
     datasource:{raw:{shop:'convenience'}}}}
  ]});
 if(u.hostname==='photon.komoot.io')return Response.json({features:[
  {type:'Feature',geometry:{type:'Point',coordinates:[0.3008,51.4777]},
   properties:{name:'Strada Bumbacului',osm_key:'shop',osm_value:'convenience'}}
 ]});
 throw Error('Unexpected provider '+u.hostname+u.pathname);
};
const env={EXA_API_KEY:'test',GEOAPIFY_API_KEY:'test',AI:{run:async()=>{throw Error('LLM is not needed for verified local source queries')}}};
try{
 let r=await worker.fetch(new Request('https://unit.test/api/chat',{method:'POST',
  headers:{'content-type':'application/json'},body:JSON.stringify({message:sample,language:'ro',module:'assistant',history:[]})}),env);
 assert.equal(r.status,200);
 let body=await r.json();
 assert.equal(body.business_verified,true,'Business details must use Exa and source evidence');
 assert.match(body.reply,/premier-stores/);
 assert.doesNotMatch(body.reply,/cred că este/i);
 r=await worker.fetch(new Request('https://unit.test/api/chat',{method:'POST',
  headers:{'content-type':'application/json'},
  body:JSON.stringify({message:'Ce magazine găsești în jurul meu?',language:'ro',module:'assistant',
   history:[],location_requested:true,location:{latitude:51.4775,longitude:0.3007,accuracy:20}})}),env);
 assert.equal(r.status,200);
 body=await r.json();
 assert.equal(body.search_ok,true);
 assert.ok(body.places.some(x=>x.name==='Skk Convenience Store'),'Official small retailer should be present');
 assert.equal(body.places.some(x=>/London Road|Bumbacului/i.test(x.name)),false,
  'A street alone is not a named shop, even when the provider classifies it as retail');
 assert.ok(String(body.source).includes('UK Food Standards Agency'));
 assert.equal(body.location_source,'browser_gps');
 assert.ok(seen.some(u=>u.hostname==='api.ratings.food.gov.uk'));
 assert.ok(seen.some(u=>u.hostname==='api.geoapify.com'));
 assert.ok(seen.some(u=>u.hostname==='photon.komoot.io'));
}finally{globalThis.fetch=originalFetch}
console.log('PASS verified local shop research, UK FSA supplementary listings, road false positives and GPS integrity');
