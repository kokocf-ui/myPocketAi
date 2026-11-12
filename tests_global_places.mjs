import assert from 'node:assert/strict';
import worker from './backend.js';
import {globalPoiTypesFor,globalNamedBusiness,globalNearbyPlaces} from './global_poi_sources.mjs';

assert.ok(globalPoiTypesFor('corner_shop').includes('convenience_store'));
assert.ok(globalPoiTypesFor('supermarket').includes('supermarket'));
assert.ok(globalPoiTypesFor('park').includes('park_and_recreation_area'));
assert.ok(globalPoiTypesFor('hotel').includes('hotel_or_motel'));
assert.deepEqual(globalPoiTypesFor('not_a_category'),[]);
const point=(name,lat,lon,city,country,code,street='Strada Morii',type='convenience_store')=>({
 id:'poi-'+name,type:'poi',title:name,
 position:{type:'Point',coordinates:[lon,lat]},
 address:{municipality:city,street,country,countryCodeIso2:code,
  houseNumber:'12',postalCode:code==='GB'?'RM20 4AB':''},
 poiTypes:[{id:type}]
});
const cases=[
 {city:'Oradea',country:'Romania',code:'RO',lat:47.03,lon:21.96,name:'Magazinul Mic'},
 {city:'Milano',country:'Italy',code:'IT',lat:45.464,lon:9.19,name:'Alimentari Rossi'},
 {city:'Grays',country:'United Kingdom',code:'GB',lat:51.476,lon:0.3,name:'Sunny Local'}
];
let calls=0;
for(const p of cases){
 const fetcher=async(url,opts)=>{
  calls++;
  assert.equal(url,'https://api.tomtom.com/maps/orbis/places/discover');
  assert.equal(opts.headers['TomTom-Api-Version'],'3');
  assert.equal(opts.headers['TomTom-Api-Key'],'mock');
  assert.ok(!opts.headers.Attributes.includes('openingHours'),'Avoid extra paid fields');
  const req=JSON.parse(opts.body);
  assert.deepEqual(req.filters.poiTypes,globalPoiTypesFor('corner_shop'));
  assert.deepEqual(req.filters.geometry.center,[p.lon,p.lat]);
  assert.equal(req.filters.geometry.radiusInMeters,1500);
  return Response.json({results:[
   point(p.name,p.lat+.001,p.lon+.001,p.city,p.country,p.code),
   point('Outside scope',p.lat+.2,p.lon+.2,p.city,p.country,p.code),
   {...point('Not POI',p.lat,p.lon,p.city,p.country,p.code),type:'address'}
  ]});
 };
 const rows=await globalNearbyPlaces({latitude:p.lat,longitude:p.lon,
  category:'corner_shop',radius:1500,apiKey:'mock',enabled:true,fetcher});
 assert.equal(rows.length,1,p.country);
 assert.equal(rows[0].tags.name,p.name);
 assert.equal(rows[0].tags.shop,'convenience');
 assert.equal(rows[0].tags.poi_source,'TomTom Places');
}
assert.equal(calls,3);
const noCall=async()=>{throw Error('Off switch must prevent network calls')};
assert.deepEqual(await globalNearbyPlaces({latitude:47.03,longitude:21.96,
 category:'corner_shop',apiKey:'mock',enabled:false,fetcher:noCall}),[]);
assert.deepEqual(await globalNearbyPlaces({latitude:47.03,longitude:21.96,
 category:'corner_shop',apiKey:'',enabled:true,fetcher:noCall}),[]);
assert.equal((await globalNamedBusiness({name:'Alimentari Rossi',city:'Milano'},
 {apiKey:'mock',enabled:false,fetcher:noCall})).verified,false);

const infoTarget={name:'Alimentari Rossi',street:'Via Roma',city:'Milano',country:'Italia',countryCode:'IT'};
const namedFetcher=async(url,opts)=>{
 const req=JSON.parse(opts.body);
 assert.equal(req.query,'Alimentari Rossi, Via Roma, Milano, Italia');
 assert.equal(req.filters.types[0],'poi');
 assert.equal(req.origin,undefined,'Do not borrow the phone GPS for explicitly named cities');
 return Response.json({results:[
  point('Alimentari Rossi',45.464,9.19,'Milano','Italy','IT','Via Roma'),
  point('Alimentari Rossi',46.062,13.23,'Udine','Italy','IT','Via Roma')
 ]});
};
const matched=await globalNamedBusiness(infoTarget,{apiKey:'mock',enabled:true,fetcher:namedFetcher});
assert.equal(matched.verified,true);
assert.match(matched.details.address,/Via Roma/);
assert.equal(matched.reason,'tomtom_address_matched_poi');
const wrongCountry=await globalNamedBusiness(infoTarget,{
 apiKey:'mock',enabled:true,
 fetcher:async()=>Response.json({results:[point('Alimentari Rossi',45.464,9.19,'Milano','United Kingdom','GB','Via Roma')]}),
});
assert.equal(wrongCountry.verified,false);
const wrongStreet=await globalNamedBusiness(infoTarget,{
 apiKey:'mock',enabled:true,
 fetcher:async()=>Response.json({results:[point('Alimentari Rossi',45.464,9.19,'Milano','Italy','IT','Via Torino')]}),
});
assert.equal(wrongStreet.verified,false);

const original=globalThis.fetch,observed=[];
globalThis.fetch=async(url,opts)=>{
 const u=new URL(typeof url==='string'?url:url.url||url.toString());observed.push(u.hostname);
 if(u.hostname==='api.tomtom.com')return Response.json({results:[
  point('Magazin local Oradea',47.031,21.961,'Oradea','Romania','RO')
 ]});
 if(u.hostname==='api.geoapify.com'&&u.pathname==='/v2/places')return Response.json({features:[]});
 if(u.hostname==='photon.komoot.io')return Response.json({features:[]});
 if(u.hostname==='api.ratings.food.gov.uk')throw Error('UK FSA must not query outside UK');
 throw Error('Unexpected public provider '+u.toString());
};
try{
 const payload={message:'Ce băcănii sunt în jurul meu?',language:'ro',module:'travel',
  place_category:'corner_shop',quick_place_search:true,history:[],
  location:{latitude:47.03,longitude:21.96,accuracy:20}};
 const req=()=>new Request('https://unit.test/api/chat',{method:'POST',
  headers:{'content-type':'application/json'},body:JSON.stringify(payload)});
 const env={AI:{run:async()=>{throw Error('not required')}},GEOAPIFY_API_KEY:'mock',TOMTOM_API_KEY:'mock',TOMTOM_PLACES_ENABLED:'true'};
 const response=await worker.fetch(req(),env);
 assert.equal(response.status,200);
 const output=await response.json();
 assert.equal(output.search_ok,true,output.reply);
 assert.ok(output.places.some(x=>x.name==='Magazin local Oradea'));
 assert.match(output.source,/TomTom Places/);
 assert.ok(observed.includes('api.tomtom.com'));
 assert.ok(!observed.includes('api.ratings.food.gov.uk'));
 observed.length=0;
 const disabled=await worker.fetch(req(),{...env,TOMTOM_PLACES_ENABLED:'false'});
 assert.equal(disabled.status,200);
 assert.ok(!observed.includes('api.tomtom.com'),'No TomTom Places requests without explicit activation');
}finally{globalThis.fetch=original}
console.log('PASS worldwide place adapter RO/IT/GB, strict country, GPS and cost opt-in');
