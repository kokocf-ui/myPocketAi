import assert from 'node:assert/strict';
import {dispatchCountrySources} from './country_provider_bridge.mjs';
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
console.log('country provider bridge checks passed');
