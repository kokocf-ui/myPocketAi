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
 'Baruri, ceainării și cafenele','Alte puncte de interes',
 'Shopping și modă','Saloane de înfrumusețare','Articole pentru casă',
 'Electrocasnice','Mobilier','Bricolaj și grădinărit'
]);
const categories=['hotel','pharmacy','corner_shop','supermarket','confectionery',
 'fast_food','restaurant','lounge','poi',
 'shopping_fashion','beauty_services','home_goods','appliances','furniture','diy_garden'];
assert.deepEqual(list.map(x=>x.placeCategory),categories);
assert.deepEqual(Array.from(menu.maps,x=>x.title),[
 'Deplasare spre…','Traseu pietonal','Transport public','Benzinării',
 'Spălătorii auto','Parcări','Muzee','Parcuri','Grădini zoologice','Parcuri auto și dealeri',
 'Spitale','ATM-uri','Bănci','Case de schimb valutar',
 'Cabinete medicale și stomatologice'
]);
assert.deepEqual(Array.from(menu.maps.slice(-5),x=>x.placeCategory),[
 'hospital_only','atm','bank','currency_exchange','medical_dental'
]);
for(const choice of menu.maps.slice(-5)){
 assert.equal(choice.kind,'places');
 assert.ok(choice.prompt.includes('în apropierea mea'));
}
assert.equal(list.find(x=>x.placeCategory==='restaurant').prompt,'Caută restaurante în apropierea mea.');
assert.ok(!list.find(x=>x.placeCategory==='restaurant').prompt.includes('fast-food'));
assert.ok(ui.includes("place_category:choice.kind==='places'?(choice.placeCategory||undefined):undefined"));
assert.ok(ui.includes('function openModuleLandingAction(choice)'));
assert.ok(ui.includes('function returnToModuleLanding()'));
assert.match(ui,/state\.moduleSearchScrollTop=list\.scrollTop/,'Capture results scroll');
assert.match(ui,/list\.scrollTop=Number\(state\.moduleSearchScrollTop/,'Restore results scroll');
assert.match(ui,/state\.moduleSearchScrollTop=0/,'Reset scroll at new search');
assert.match(ui,/const special=\{shopping_fashion:/,'Use correct category icons');
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
 {name:'Grays Museum',cat:'entertainment.museum',kind:'museum'},
 {name:'Lakeside Shopping Centre',cat:'commercial.shopping_mall',kind:'mall',shop:'mall'},
 {name:'Style Clothing',cat:'commercial.clothing.clothes',kind:'clothing',shop:'clothes'},
 {name:'Eva Hair Studio',cat:'service.beauty.hairdresser',kind:'salon',shop:'hairdresser'},
 {name:'Homewares Direct',cat:'commercial.houseware_and_hardware',kind:'houseware',shop:'houseware'},
 {name:'Kitchen Appliances',cat:'commercial.elektronics',kind:'appliance',shop:'appliance'},
 {name:'Sofa Gallery',cat:'commercial.furniture_and_interior',kind:'furniture',shop:'furniture'},
 {name:'DIY Hardware',cat:'commercial.houseware_and_hardware',kind:'hardware',shop:'hardware'},
 {name:'Garden Plant Centre',cat:'commercial.garden',kind:'garden',shop:'garden_centre'},
 {name:'Costco',cat:'commercial.department_store',kind:'department_store',shop:'department_store'},
 {name:'Vodafone',cat:'commercial.elektronics',kind:'telephony',shop:'mobile_phone'},
 {name:'EE',cat:'commercial.elektronics',kind:'telephony',shop:'electronics'},
 {name:'New Car Dealership',cat:'commercial.vehicle',kind:'dealer',shop:'car'},
 {name:'Motorbike Shop',cat:'commercial.vehicle',kind:'bikes',shop:'motorcycle'},
 {name:'District General Hospital',cat:'healthcare.hospital',kind:'hospital',amenity:'hospital'},
 {name:'Family GP Clinic',cat:'healthcare.clinic',kind:'clinic',amenity:'clinic'},
 {name:'High Street Dental Practice',cat:'healthcare.dentist',kind:'dentist',amenity:'dentist'},
 {name:'Chemist Pharmacy',cat:'healthcare.pharmacy',kind:'pharmacy',amenity:'pharmacy'},
 {name:'Central ATM',cat:'service.financial.atm',kind:'atm',amenity:'atm'},
 {name:'City Bank',cat:'service.financial.bank',kind:'bank',amenity:'bank'},
 {name:'Money Exchange Office',cat:'service.financial.bureau_de_change',kind:'exchange',amenity:'bureau_de_change'},
 {name:'Money Transfer Only',cat:'service.financial.money_transfer',kind:'transfer',amenity:'money_transfer'}
];
const features=rows.map((r,i)=>({type:'Feature',geometry:{type:'Point',coordinates:[0.301+i/10000,51.477+i/10000]},
 properties:{name:r.name,categories:[r.cat],datasource:{raw:{
 amenity:r.amenity||(['restaurant','fast_food'].includes(r.kind)?r.kind:''),
 tourism:r.kind==='hotel'?'hotel':'',shop:r.shop||'',cuisine:r.cuisine||'',highway:r.kind==='highway'?'residential':''
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
    module:category==='car_dealers'?'maps':'travel',language:'ro',history:[],location:{latitude:51.4775,longitude:0.3007,accuracy:20}})
  }),{GEOAPIFY_API_KEY:'test',AI:{run:async()=>{throw Error('No LLM')}}});
  assert.equal(response.status,200);
  const data=await response.json();
  assert.equal(data.search_ok,true,data.reply);
  if(['shopping_fashion','beauty_services','home_goods','appliances','furniture','diy_garden','car_dealers'].includes(category)){
   for(const place of data.places)assert.equal(place.type,category,'Wrong category identity for '+place.name);
  }
  return new Set(data.places.map(p=>p.name));
 };
 const rest=await quick('restaurant','Caută restaurante, shaormerii, pizza și fast-food în apropierea mea.');
 const fast=await quick('fast_food','Caută fast-food-uri în apropierea mea.');
 const poi=await quick('poi','Găsește alte puncte de interes în apropierea mea.');
 assert.ok(rest.has('Family Bistro'));assert.ok(!rest.has('Super Chicken')&&!rest.has('Grays King Kebab'));
 assert.ok(fast.has('Super Chicken')&&fast.has('Grays King Kebab'));assert.ok(!fast.has('Family Bistro'));
 assert.deepEqual([...rest].filter(x=>fast.has(x)),[]);
 assert.ok(poi.has('Upside Down House'));

 const shopping=await quick('shopping_fashion','Găsește shopping și modă în apropierea mea.');
 const beauty=await quick('beauty_services','Găsește saloane de înfrumusețare în apropierea mea.');
 const home=await quick('home_goods','Găsește articole pentru casă în apropierea mea.');
 const appliances=await quick('appliances','Găsește electrocasnice în apropierea mea.');
 const furniture=await quick('furniture','Găsește mobilier în apropierea mea.');
 const diy=await quick('diy_garden','Găsește bricolaj și grădinărit în apropierea mea.');
 for(const n of ['Lakeside Shopping Centre','Style Clothing'])assert.ok(shopping.has(n),'Shopping missing '+n);
 assert.ok(beauty.has('Eva Hair Studio'));
 assert.ok(home.has('Homewares Direct'));
 assert.ok(appliances.has('Kitchen Appliances'));
 assert.ok(appliances.has('Costco'));
 assert.ok(!appliances.has('Vodafone')&&!appliances.has('EE'),'Phone operators must not appear as appliances');
 assert.ok(furniture.has('Sofa Gallery'));
 for(const n of ['DIY Hardware','Garden Plant Centre'])assert.ok(diy.has(n),'DIY missing '+n);
 const carDealers=await quick('car_dealers','Găsește parcuri auto și dealeri auto în apropierea mea.');
 assert.ok(carDealers.has('New Car Dealership'));
 assert.ok(!carDealers.has('Motorbike Shop'));
 const hospitals=await quick('hospital_only','Găsește spitale în apropierea mea.');
 const medicalDental=await quick('medical_dental','Găsește cabinete medicale și stomatologice în apropierea mea.');
 const atms=await quick('atm','Găsește bancomate ATM în apropierea mea.');
 const banks=await quick('bank','Găsește bănci în apropierea mea.');
 const exchange=await quick('currency_exchange','Găsește case de schimb valutar în apropierea mea.');
 assert.ok(hospitals.has('District General Hospital'));
 assert.ok(!hospitals.has('Family GP Clinic')&&!hospitals.has('High Street Dental Practice'),'Hospitals should not include clinics');
 assert.ok(medicalDental.has('Family GP Clinic')&&medicalDental.has('High Street Dental Practice'),'Both kinds of practice belong to one button');
 assert.ok(!medicalDental.has('District General Hospital')&&!medicalDental.has('Chemist Pharmacy'),'Practices must not include hospitals or pharmacies');
 assert.ok(atms.has('Central ATM')&&!atms.has('City Bank'));
 assert.ok(banks.has('City Bank')&&!banks.has('Central ATM'));
 assert.ok(exchange.has('Money Exchange Office'));
 assert.ok(!exchange.has('Money Transfer Only')&&!exchange.has('City Bank')&&!exchange.has('Central ATM'));
 for(const result of [hospitals,medicalDental,atms,banks,exchange]){
  for(const other of [hospitals,medicalDental,atms,banks,exchange]){
   if(result!==other)assert.deepEqual([...result].filter(n=>other.has(n)),[],'Overlapping hospital/finance categories');
  }
 }
 const selected=[shopping,beauty,home,appliances,furniture,diy,carDealers];
 for(const [i,group] of selected.entries()){
  for(const [j,other] of selected.entries()){
   if(i!==j)assert.deepEqual([...group].filter(n=>other.has(n)),[],'Overlapping categories '+i+'/'+j);
  }
 }
 for(const n of ['Travelodge','Bexhill Drive','Grays Museum','Family Bistro','Super Chicken'])
  assert.ok(!poi.has(n),'Other POI contains dedicated category '+n);
}finally{globalThis.fetch=original}
console.log('PASS travel options ordered, strict quick categories, restaurants separated, POI excludes existing categories');
