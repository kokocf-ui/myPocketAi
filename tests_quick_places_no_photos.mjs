import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {reconcileNearbyPlaces} from './food_location_quality.mjs';
import worker from './backend.js';

const ui=readFileSync('index.js','utf8');
const backend=readFileSync('backend.js','utf8');
const w=ui.slice(ui.indexOf('function mountPlaceThumbnail(host,place){'),ui.indexOf('function renderModulePlaceDetails(place){'));
const detail=ui.slice(ui.indexOf('function renderModulePlaceDetails(place){'),ui.indexOf('const QUICK_SEARCH_ENGLISH='));
assert.match(w,/mountPlaceLogo\(host,place\)/,'Business identity retained');
assert.match(detail,/mountPlaceLogo\(logo,place\)/,'Detail keeps company logo');
assert.doesNotMatch(ui,/resolveVerifiedPlacePhoto|showVerifiedPlacePhoto|showPlacePhoto\(|place-detail-photo|verifiedPhotoRequests/);
assert.doesNotMatch(backend,/api\/place-photo-v2|place_photo_public/);
assert.doesNotMatch(detail,/photo\.style|setVerifiedPhoto|photoHint/);
assert.ok(ui.includes('placeResultIcon(place)'),'Fallback icon when no brand logo exists');
const logo=ui.slice(ui.indexOf('function mountPlaceLogo(host,place){'),ui.indexOf('async function enrichPlaceWebsite('));
assert.match(logo,/favicon\(place\.website\)/);
assert.match(logo,/if\(\[place\.logo_url,place\.brand_logo,place\.website\]\.some\(Boolean\)\)return/,'Known logos do not cause per-row enrichment calls');
assert.match(backend,/\(placesData\.elements\|\|\[\]\)\.length<6/,'Sparse OSM fallback only');

const first=ui.indexOf('function quickPlaceDisplayName(place,allPlaces){');
const last=ui.indexOf('function renderModulePlaces(places){',first);
assert.ok(first>0&&last>first);
const fn=vm.runInNewContext('('+ui.slice(first,last).trim()+')');
const asda=[
 {name:'Asda',city:'Dartford',postcode:'DA9 9BT',address:'Crossways Boulevard, Dartford, DA9 9BT'},
 {name:'Asda',city:'Tilbury',postcode:'RM18 7HJ',address:'Thurrock Park Way, Tilbury, RM18 7HJ'}
];
assert.equal(fn(asda[0],asda),'Asda (Dartford)');
assert.equal(fn(asda[1],asda),'Asda (Tilbury)');
assert.equal(fn(asda[0],[asda[0]]),'Asda');
const locations=[
 {name:'Asda',lat:51.45,lon:0.28,distanceMeters:3200,city:'Dartford',
  postcode:'DA9 9BT',street:'Crossways Boulevard',address:'Crossways Boulevard, Dartford, DA9 9BT'},
 {name:'Asda',lat:51.46,lon:0.36,distanceMeters:3400,city:'Tilbury',
  postcode:'RM18 7HJ',street:'Thurrock Park Way',address:'Thurrock Park Way, Tilbury, RM18 7HJ'}
];
assert.equal(reconcileNearbyPlaces(locations).length,2,'Real ASDA Greenhithe and Tilbury must remain separate');

// Verify only existing providers are used, without photo/research requests.
const original=globalThis.fetch,hosts=[];
globalThis.fetch=async input=>{
 const u=new URL(typeof input==='string'?input:input.url||String(input));
 hosts.push(u.hostname);
 if(u.hostname==='api.geoapify.com')return Response.json({features:Array.from({length:9},(_,i)=>({
  type:'Feature',geometry:{type:'Point',coordinates:[0.28+i/10000,51.45+i/10000]},
  properties:{name:'Shop '+(i+1),categories:['commercial.supermarket'],
  datasource:{raw:{shop:'supermarket'}},address_line1:'Sample '+(i+1)}
 }))});
 if(u.hostname==='photon.komoot.io')return Response.json({features:[]});
 if(u.hostname==='api.ratings.food.gov.uk')return Response.json({establishments:[],meta:{totalPages:1}});
 throw Error('Unexpected external provider '+u.hostname);
};
try{
 const response=await worker.fetch(new Request('https://unit.test/api/chat',{
  method:'POST',headers:{'content-type':'application/json'},
  body:JSON.stringify({
   message:'Caută supermarketuri în apropierea mea',quick_place_search:true,
   place_category:'supermarket',language:'ro',module:'travel',history:[],
   location:{latitude:51.45,longitude:0.28,accuracy:20}
  })
 }),{GEOAPIFY_API_KEY:'mock',OSM_WORLD_FOOD_ENABLED:'true',AI:{run:async()=>{throw Error('No LLM expected')}}});
 assert.equal(response.status,200);
 const result=await response.json();
 assert.equal(result.search_ok,true,result.reply);
 assert.ok(result.places.length>=6,'Sufficient Geoapify results');
 assert.ok(!hosts.includes('overpass-api.de'),'Overpass unnecessary when sufficient mapped locations');
 assert.ok(!hosts.includes('commons.wikimedia.org'));
 assert.ok(!hosts.includes('www.wikidata.org'));
 assert.ok(!hosts.includes('api.exa.ai'));
}finally{globalThis.fetch=original}
console.log('PASS no photo pipeline, logos preserved, fast sparse fallback, distinct Asda stores labelled');
