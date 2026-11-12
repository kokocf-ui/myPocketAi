import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import worker from './backend.js';
import {otherPoiAccepts} from './other_poi_quality.mjs';

const ui=readFileSync('index.js','utf8');
const start=ui.indexOf('const MODULE_QUICK_CHOICES=');
const end=ui.indexOf('\n/* Maps and hotels regain',start);
assert.ok(start>0&&end>start);
const menu=vm.runInNewContext(ui.slice(start,end)+'\nMODULE_QUICK_CHOICES');
const list=Array.from(menu.travel);
assert.deepEqual(list.map(x=>x.title),[
 'Hoteluri','Farmacii','Băcănii și magazine mici','Marketuri și brutării',
 'Cofetării','Fast-food și mâncare la pachet','Restaurante și localuri cu mâncare',
 'Baruri, ceainării și cafenele','Alte puncte de interes'
]);
const categories=['hotel','pharmacy','corner_shop','supermarket','confectionery',
 'fast_food','restaurant','lounge','poi'];
assert.deepEqual(list.map(x=>x.placeCategory),categories);
assert.deepEqual(Array.from(menu.maps,x=>x.title),[
 'Deplasare spre…','Traseu pietonal','Transport public','Benzinării',
 'Spălătorii auto','Parcări','Muzee','Parcuri','Grădini zoologice'
]);
assert.equal(list.find(x=>x.placeCategory==='restaurant').prompt,'Caută restaurante în apropierea mea.');
assert.ok(!list.find(x=>x.placeCategory==='restaurant').prompt.includes('fast-food'));
assert.ok(ui.includes("place_category:choice.kind==='places'?(choice.placeCategory||undefined):undefined"));
assert.ok(ui.includes('function openModuleLandingAction(choice)'));
assert.ok(ui.includes('function returnToModuleLanding()'));
const routeEntry=ui.slice(ui.indexOf('function openModuleLandingAction(choice)'),
 ui.indexOf('function quickUiText(){'));
assert.match(routeEntry,/kind==='walking'\)showWalkingQuickDestination\(choice\)/);
const walk=ui.slice(ui.indexOf('function showWalkingQuickDestination(choice){'),ui.indexOf('function showTransitDestination(choice){'));
assert.match(walk,/Unde vrei să ajungi\?/);
assert.match(walk,/pendingTravelMode='walk'/);
assert.match(walk,/routeActionsText\(\)\.prompt\+destination/);
assert.match(walk,/pocket-walk-route-submit/,'Walking action has its own scoped styling');
assert.match(ui,/#moduleQuickLayer\.open \.module-quick-body > button\.pocket-walk-route-submit\{/);
assert.match(ui,/margin:22px 0 0!important/,'Walking action is separated from its input');
assert.match(ui,/#913653,#63213c/,'Walking action is burgundy');
assert.match(routeEntry,/kind==='transit'\)showPreciseJourney\(\{\.\.\.choice,journeyMode:'transit'\}\)/);
const modes=ui.slice(ui.indexOf('function showJourneyMode(choice){'),
 ui.indexOf('// Shared UI dialog translations.',ui.indexOf('function showJourneyMode(choice){')));
for(const mode of ["'walk'","'transit'","'drive'"])
 assert.ok(modes.includes(mode),'Missing shared journey mode '+mode);
const precise=ui.slice(ui.indexOf('function showPreciseJourney(choice){'),
 ui.indexOf('function showTransitDestination(choice){'));
assert.match(precise,/selectedMode=choice\.journeyMode==='walk'\?'walk':'drive'/);
assert.match(precise,/transitDirect:true/,'Keep the existing mixed transit engine');

for(const title of ['Travelodge','Premier Inn','Ibis Hotel','Bexhill Drive','Grifon Road'])
 assert.equal(otherPoiAccepts({name:title}),false,title);
assert.equal(otherPoiAccepts({name:'Upside Down House',categories:['tourism.attraction']}),true);
assert.equal(otherPoiAccepts({name:'Museum in Grays',categories:['entertainment.museum']}),false);
assert.equal(otherPoiAccepts({name:'Hotel from OSM',osmKey:'tourism',osmValue:'hotel'}),false);
assert.equal(otherPoiAccepts({name:'Bexhill Drive',osmKey:'highway',osmValue:'residential'}),false);

const rows=[
 {name:'Family Bistro',cat:'catering.restaurant',kind:'restaurant'},
 {name:'Super Chicken',cat:'catering.restaurant',kind:'restaurant',cuisine:'chicken'},
 {name:'Grays King Kebab',cat:'catering.fast_food',kind:'fast_food'},
 {name:'Upside Down House',cat:'tourism.attraction',kind:'attraction'},
 {name:'Travelodge',cat:'accommodation.hotel',kind:'hotel'},
 {name:'Bexhill Drive',cat:'highway.residential',kind:'highway'},
 {name:'Grays Museum',cat:'entertainment.museum',kind:'museum'}
];
const features=rows.map((r,i)=>({type:'Feature',geometry:{type:'Point',coordinates:[0.301+i/10000,51.477+i/10000]},
 properties:{name:r.name,categories:[r.cat],datasource:{raw:{
 amenity:['restaurant','fast_food'].includes(r.kind)?r.kind:'',
 tourism:r.kind==='hotel'?'hotel':'',cuisine:r.cuisine||'',highway:r.kind==='highway'?'residential':''
 }}}}));
const original=globalThis.fetch;
globalThis.fetch=async input=>{
 const u=new URL(typeof input==='string'?input:input.url||String(input));
 if(u.hostname==='api.geoapify.com')return Response.json({features});
 if(u.hostname==='photon.komoot.io')return Response.json({features:[]});
 if(u.hostname==='api.ratings.food.gov.uk')return Response.json({establishments:[],meta:{totalPages:1}});
 throw Error('Unexpected host '+u.hostname);
};
try {
 const quick=async(category,message)=> {
  const response=await worker.fetch(new Request('https://test.local/api/chat',{
   method:'POST',headers:{'content-type':'application/json'},
   body:JSON.stringify({message,quick_place_search:true,place_category:category,
    module:'travel',language:'ro',history:[],location:{latitude:51.4775,longitude:0.3007,accuracy:20}})
  }),{GEOAPIFY_API_KEY:'test',AI:{run:async()=>{throw Error('No LLM')}}});
  assert.equal(response.status,200);
  const data=await response.json();
  assert.equal(data.search_ok,true,data.reply);
  return new Set(data.places.map(p=>p.name));
 };
 const rest=await quick('restaurant','Caută restaurante, shaormerii, pizza și fast-food în apropierea mea.');
 const fast=await quick('fast_food','Caută fast-food-uri în apropierea mea.');
 const poi=await quick('poi','Găsește alte puncte de interes în apropierea mea.');
 assert.ok(rest.has('Family Bistro'));assert.ok(!rest.has('Super Chicken')&&!rest.has('Grays King Kebab'));
 assert.ok(fast.has('Super Chicken')&&fast.has('Grays King Kebab'));assert.ok(!fast.has('Family Bistro'));
 assert.deepEqual([...rest].filter(x=>fast.has(x)),[]);
 assert.ok(poi.has('Upside Down House'));
 for(const n of ['Travelodge','Bexhill Drive','Grays Museum','Family Bistro','Super Chicken'])
  assert.ok(!poi.has(n),'Other POI contains dedicated category '+n);
}finally{globalThis.fetch=original}
console.log('PASS travel options ordered, strict quick categories, restaurants separated, POI excludes existing categories');
