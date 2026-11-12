import assert from 'node:assert/strict';
import {foodVenueKind} from './food_location_quality.mjs';
import {retailKind,retailCategoryAccepts} from './retail_category.mjs';
import {globalNearbyPlaces,globalPoiTypesFor} from './global_poi_sources.mjs';
import {nearbyOpenStreetMapFood} from './osm_food_places.mjs';

for(const name of ['Shaormerie Oradea','Rosticceria Roma','Paninoteca Milano',
 'Bocadilleria Madrid','Dönerladen Berlin','Kebabownia Kraków',
 'Πίτσα Αθήνα','Пиццерия Киев','شاورما بيروت','Simigerie Alba']){
 assert.equal(foodVenueKind({name,amenity:'restaurant'}),'fast_food',name);
}
for(const name of ['Restaurant Tradițional','Ristorante Bella','Εστιατόριο Αθηνά',
 'Ресторан Москва','La Maison']){
 assert.equal(foodVenueKind({name,amenity:'restaurant'}),'restaurant',name);
}
assert.equal(foodVenueKind({name:'Restaurant',amenity:'restaurant',takeaway:'yes'}),'restaurant');
assert.equal(foodVenueKind({name:'Restaurant',amenity:'restaurant',takeaway:'only'}),'fast_food');
assert.equal(foodVenueKind({name:'Name',amenity:'restaurant',cuisine:'pizza;italian'}),'fast_food');
assert.equal(retailKind({name:'Μαγαζί Αθήνα',shop:'convenience'}),'corner_shop');
assert.equal(retailKind({name:'Магазин Киев',shop:'supermarket'}),'supermarket');
assert.equal(retailKind({name:'Carrefour City',shop:'supermarket'}),'corner_shop');
assert.equal(retailCategoryAccepts('supermarket',{name:'Carrefour City',shop:'supermarket'}),false);
assert.ok(globalPoiTypesFor('restaurant').includes('fast_food'));
assert.ok(globalPoiTypesFor('fast_food').includes('restaurant'));

const provider=[
 {type:'poi',title:'Rosticceria Roma',id:'x1',
  position:{type:'Point',coordinates:[9.1902,45.4642]},
  address:{municipality:'Milano',street:'Via Roma'},
  poiTypes:[{id:'restaurant'}]},
 {type:'poi',title:'Ristorante Centrale',id:'x2',
  position:{type:'Point',coordinates:[9.1903,45.4643]},
  address:{municipality:'Milano',street:'Via Roma'},
  poiTypes:[{id:'restaurant'}]}
];
for(const category of ['restaurant','fast_food']){
 const result=await globalNearbyPlaces({latitude:45.464,longitude:9.19,radius:1500,
  category,apiKey:'mock',enabled:true,fetcher:async()=>Response.json({results:provider})});
 assert.equal(result.length,1,category);
 assert.equal(result[0].tags.name,category==='restaurant'?'Ristorante Centrale':'Rosticceria Roma');
}
const osm=await nearbyOpenStreetMapFood({latitude:47.03,longitude:21.96,
 radius:1500,category:'fast_food',fetcher:async()=>Response.json({elements:[
  {type:'node',id:1,lat:47.0302,lon:21.9602,
   tags:{'name:ro':'Shaormerie Fără Nume',amenity:'restaurant',takeaway:'only'}}
 ]})});
assert.equal(osm[0]?.tags.name,'Shaormerie Fără Nume');
console.log('PASS native European and non-Latin food names, Unicode retail and TomTom categories');
