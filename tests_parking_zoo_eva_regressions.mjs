import assert from 'node:assert/strict';
import worker from './backend.js';
import {isTransitJourneyRequest} from './transit_intent.mjs';

// A personal-assistant transport request must not be downgraded to free chat.
for(const phrase of [
 'Ce mijloace de transport pot lua până la Victoria?',
 'Ce mijloace de transport folosesc ca să ajung la Victoria?',
 'Cum ajung cu transportul public la Victoria?',
 'Vreau să ajung până la Victoria cu transportul'
]){
 const result=isTransitJourneyRequest(phrase);
 assert.equal(result.is_journey,true,phrase+': '+result.reason);
}
for(const phrase of ['Ce este transportul public?', 'Cum funcționează transportul în Londra?']){
 assert.equal(isTransitJourneyRequest(phrase).is_journey,false,
  'Informational transport topic must not trigger planning: '+phrase);
}

const original=globalThis.fetch;
const origin={latitude:51.4775,longitude:0.3007,accuracy:20};
let scenario='parking',calls=[];
globalThis.fetch=async input=>{
 const u=new URL(typeof input==='string'?input:input.url||String(input));calls.push(u);
 if(u.hostname==='api.geoapify.com'){
  if(scenario==='parking'){
   assert.equal(u.searchParams.get('categories'),'parking');
   return Response.json({features:[{type:'Feature',
    geometry:{type:'Point',coordinates:[0.301,51.477]},
    properties:{name:'',address_line1:'Dock Road',categories:['parking.cars.surface'],
     datasource:{raw:{amenity:'parking'}}}}]});
  }
  if(scenario==='zoo'){
   assert.equal(u.searchParams.get('categories'),'entertainment.zoo',
    'Zoo query must not ask for hundreds of unrelated tourist attractions');
   return Response.json({features:[
    {type:'Feature',geometry:{type:'Point',coordinates:[0.301,51.477]},
     properties:{name:'Wildlife Zoo',categories:['entertainment.zoo'],datasource:{raw:{tourism:'zoo'}}}},
    {type:'Feature',geometry:{type:'Point',coordinates:[0.302,51.478]},
     properties:{name:'Unrelated Attraction',categories:['tourism.attraction'],datasource:{raw:{tourism:'attraction'}}}},
    {type:'Feature',geometry:{type:'Point',coordinates:[0.303,51.478]},
     properties:{name:'M25',categories:['entertainment.zoo'],datasource:{raw:{highway:'motorway'}}}}
   ]});
  }
  return Response.json({features:[]});
 }
 if(u.hostname==='photon.komoot.io'){
  if(scenario==='zero')return new Response('Provider unavailable',{status:503});
  if(scenario==='parking')return Response.json({features:[{
   type:'Feature',geometry:{type:'Point',coordinates:[0.303,51.479]},
   properties:{name:'',street:'Essex Road',osm_key:'amenity',osm_value:'parking'}
  }]});
  return Response.json({features:[]});
 }
 throw Error('Unexpected source '+u.hostname);
};
const query=async cat=>{
 const request=new Request('https://unit.test/api/chat',{
  method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({
   message:cat==='zoo'?'Găsește grădini zoologice în apropierea mea.':'Găsește parcări în apropierea mea.',
   quick_place_search:true,place_category:cat,module:'maps',language:'ro',
   history:[],location:origin
  })
 });
 const response=await worker.fetch(request,{
  GEOAPIFY_API_KEY:'mock',
  AI:{run:async()=>{throw Error('POI search must not call the language model')}}
 });
 const result=await response.json();
 assert.equal(response.status,200,JSON.stringify(result).slice(0,600));
 return result;
};
try{
 const parking=await query('parking');
 assert.equal(parking.search_ok,true,parking.reply);
 assert.ok(parking.places.some(x=>x.name.includes('Parcare')),
  'Unnamed mapped parking sites should not disappear from the results');
 assert.ok(parking.places.every(x=>Number.isFinite(x.latitude)&&Number.isFinite(x.longitude)));
 scenario='zoo';const zoo=await query('zoo');
 assert.equal(zoo.search_ok,true,zoo.reply);
 assert.ok(zoo.places.some(x=>x.name==='Wildlife Zoo'));
 assert.ok(!zoo.places.some(x=>x.name==='Unrelated Attraction'),
  'Do not mislabel ordinary attractions as zoos');
 assert.ok(!zoo.places.some(x=>x.name==='M25'),
  'Do not mislabel the motorway as a zoological garden');
 assert.equal(zoo.search_radius_meters,5000);
 scenario='zero';const empty=await query('parking');
 assert.notEqual(empty.search_error_code,'LOCAL_SEARCH_FAILED',
  'One valid empty geo provider + failed Photon is not a total provider outage');
 assert.equal(empty.results_count,0);
 console.log('PASS: assistant transport phrases, mapped parking and zoo lookup');
}finally{globalThis.fetch=original}
