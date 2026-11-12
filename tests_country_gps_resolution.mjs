import assert from 'node:assert/strict';
import {verifiedGpsCountry} from './country_gps_resolution.mjs';
import {planFrontendPlaceProviders} from './country_frontend_request.mjs';
const args={geoapifyKey:'mock',timeoutMs:1500};
const cases=[['Grays',51.4775,0.3007,'gb'],['Oradea',47.0594,21.9349,'ro']];
for(const [city,latitude,longitude,code] of cases){
 let invoked=0;
 const selected=await verifiedGpsCountry({...args,latitude,longitude,fetcher:async (input,options)=>{
  invoked++;
  const u=new URL(input);
  assert.equal(u.hostname,'api.geoapify.com');
  assert.equal(u.pathname,'/v1/geocode/reverse');
  assert.equal(u.searchParams.get('lat'),String(latitude));
  assert.equal(u.searchParams.get('lon'),String(longitude));
  assert.equal(u.searchParams.get('type'),'country');
  assert.ok(options.signal,city);
  return Response.json({features:[{properties:{country_code:code}}]});
 }});
 assert.equal(invoked,1);
 assert.equal(selected,code.toUpperCase());
 const routing=planFrontendPlaceProviders({
  category:'corner_shop',verifiedCountryCode:selected,
  enabled:true,geoapifyConfigured:true
 });
 assert.equal(routing.country,code.toUpperCase());
 assert.equal(routing.ukRetailAllowed,city==='Grays');
 assert.ok(routing.providers.includes('geoapify'));
 assert.ok(routing.providers.includes('photon'));
}
let called=false;
const noGps=await verifiedGpsCountry({...args,latitude:120,longitude:22,fetcher:async()=>{called=true}});
assert.equal(noGps,null);assert.equal(called,false);
assert.equal(await verifiedGpsCountry({latitude:47.06,longitude:21.93}),null);
assert.equal(await verifiedGpsCountry({...args,latitude:47.06,longitude:21.93,fetcher:async()=>new Response('',{status:429})}),null);
assert.equal(await verifiedGpsCountry({...args,latitude:47.06,longitude:21.93,fetcher:async()=>{throw Error('offline')}}),null);
console.log('Current GPS destination defaults: Grays UK, Oradea RO, invalid/unavailable location');
