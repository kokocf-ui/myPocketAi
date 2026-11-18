import assert from 'node:assert/strict';
import {discoverGroundTransferCandidates,normalizeGroundTransferCandidates} from './mixed_ground_transfer_discovery.mjs';

const uk={latitude:51.48,longitude:0.30};
const makeFeature=(kind,name,id,lat,lon,raw={})=>({
 type:'Feature',properties:{place_id:id,name,lat,lon,country_code:'gb',
  categories:['public_transport.'+kind],datasource:{raw}},
 geometry:{type:'Point',coordinates:[lon,lat]}
});
const train=makeFeature('train','Dynamic train station','rail-1',51.49,0.29);
const stop=makeFeature('bus','Local stop','bus-1',51.4801,0.3001);
const station=makeFeature('bus','Actual coach terminal','coach-2',51.57,0.24,{amenity:'bus_station'});
const ferry=makeFeature('ferry','Mapped ferry terminal','ferry-3',51.50,0.32);
const found=[];
const fetcher=async url=>{
 const u=new URL(String(url)),category=u.searchParams.get('categories');
 found.push(category);
 assert.equal(u.hostname,'api.geoapify.com');
 assert.ok(u.searchParams.get('filter').startsWith('circle:'));
 assert.equal(u.searchParams.get('bias'),'proximity:0.3,51.48');
 const features=category==='public_transport.train'?[train]:
  category==='public_transport.bus'?[stop,station]:
  category==='public_transport.ferry'?[ferry]:[];
 return {ok:true,json:async()=>({features})};
};
const outcome=await discoverGroundTransferCandidates({GEOAPIFY_API_KEY:'test'},uk,
 {fetcher,limit:3});
assert.equal(outcome.status,'candidates_only');
assert.deepEqual(found.sort(),['public_transport.bus','public_transport.ferry','public_transport.train']);
assert.deepEqual(outcome.candidates.map(c=>c.hubType),['train','bus','ferry']);
assert.equal(outcome.candidates[1].label,'Actual coach terminal',
 'Major bus stations should not be crowded out by nearest curb stops');
assert.ok(outcome.candidates.every(c=>c.serviceScheduleVerified===false));
assert.ok(outcome.candidates.every(c=>c.transferVerified===false));
assert.ok(!outcome.candidates.some(c=>c.hubType==='flight'));
assert.deepEqual(normalizeGroundTransferCandidates({features:[train]},uk,'public_transport.bus'),[],
 'A rail station is not silently a bus terminal');
const noKey=await discoverGroundTransferCandidates({},uk,{fetcher});
assert.equal(noKey.status,'geoapify_not_configured');
const noGps=await discoverGroundTransferCandidates({GEOAPIFY_API_KEY:'test'},null,{fetcher});
assert.equal(noGps.status,'location_unverified');
const unavailable=await discoverGroundTransferCandidates({GEOAPIFY_API_KEY:'test'},uk,
 {fetcher:async()=>{throw Error('simulated outage')}});
assert.equal(unavailable.status,'provider_unavailable');
console.log('PASS independent train, coach/bus and ferry geographic discovery (not timetable claims)');
