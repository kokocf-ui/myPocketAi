import assert from 'node:assert/strict';
import {dispatchCountrySources,distanceMeters} from './country_provider_bridge.mjs';
let called=[];
const adapters={
  geoapify:async()=>{called.push('geoapify');return [{name:'A'}]},
  photon:async()=>{called.push('photon');return [{name:'B'}]},
  tfl:async()=>{called.push('tfl');return []}
};
const result=await dispatchCountrySources(
  {country:'România',category:'restaurant'},
  {adapters,enabledProviders:Object.keys(adapters)}
);
assert.deepEqual(called,['geoapify','photon']);
assert.equal(result.results.length,2);
assert.deepEqual(result.countries,['RO']);
called=[];
const missing=await dispatchCountrySources(
  {category:'restaurant'}, {adapters,enabledProviders:Object.keys(adapters)});
assert.equal(missing.status,'country_unresolved');
assert.deepEqual(called,[]);

// Oradea reference: Calea Republicii 12, 5 km geodesic radius.
// Fixtures test routing and spatial filtering; they are NOT real provider results.
const oradea={country:'Romania',category:'restaurant',latitude:47.0594,longitude:21.9349,radius:5000};
const queried=[];
const report=await dispatchCountrySources(oradea,{
 enabledProviders:['geoapify','photon','uk_food_retailers','tfl'],
 adapters:{
  geoapify:async()=>{queried.push('geoapify');return [
   {name:'Centru Oradea (simulat)',latitude:47.0596,longitude:21.9352},
   {name:'În afara razei (simulat)',latitude:47.16,longitude:22.03}
  ]},
  photon:async()=>{queried.push('photon');return [
   {name:'Aproape (simulat)',lat:47.06,lon:21.936},
   {name:'Fără coordonate (simulat)'}]},
  uk_food_retailers:async()=>{throw Error('UK-only source called for Romania')},
  tfl:async()=>{throw Error('London source called for Romania')}
 }
});
assert.deepEqual(queried,['geoapify','photon']);
assert.deepEqual(report.countries,['RO']);
assert.equal(report.results.length,2);
assert.ok(report.results.every(p=>distanceMeters(oradea,p)<=5000));
assert.equal(report.diagnostics.reduce((n,p)=>n+p.discarded,0),2);
assert.equal(Math.round(distanceMeters(oradea,oradea)),0);
assert.equal(distanceMeters(oradea,{latitude:NaN,longitude:21.9}),null);
assert.ok(distanceMeters(oradea,{latitude:47.16,longitude:22.03})>5000);
console.log('Country provider bridge and Oradea 5km simulations passed');
