import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import {OPEN_SURFACE_SOURCE,validateOpenSurfaceIndex,planOpenSurfaceCandidates,loadOpenSurfaceIndex} from './open_surface_timetable.mjs';
import {searchOpenSurfaceOptions} from './mixed_open_surface.mjs';
import {openSurfaceDataResponse} from './open_surface_data.mjs';
import {searchMixedIndicativeOptions} from './mixed_indicative_search.mjs';
const when='2026-12-03T06:00:00Z',now=Date.parse('2026-11-26T12:00:00Z');
const compiled=spawnSync('python3',['-c',`import sys,json
sys.path[:0]=['.','scripts']
from tests_open_surface_gtfs import OpenSurfaceTimetable
from build_open_surface_index import compile_feed
f=OpenSurfaceTimetable(); f.setUp()
f.feed['feed_info']=[{'feed_start_date':'20261123','feed_end_date':'20270523'}]
print(json.dumps(compile_feed(f.feed,'a'*64,'2026-11-26T12:00:00Z')))`],{encoding:'utf8'});
assert.equal(compiled.status,0,compiled.stderr);
const index=JSON.parse(compiled.stdout),copy=()=>structuredClone(index);
assert.equal(validateOpenSurfaceIndex(index,{now}),'valid');
assert.equal(validateOpenSurfaceIndex(index,{now:now+8*86400000}),'stale_index');
for(const mutate of [i=>i.stops[0][2]=100,i=>i.trips[0][3][0][1]=null,i=>i.trips[0][3][0][0]=999,i=>i.timezone='Europe/Bucharest',i=>i.source='https://evil.test/',i=>i.services[0][3]={'20261332':1}]){
 const bad=copy();mutate(bad);assert.equal(validateOpenSurfaceIndex(bad,{now}),'invalid_index');
}
const origin={latitude:51.001,longitude:0,label:'Synthetic address'},destination={latitude:49.001,longitude:0,label:'Synthetic final address'};
const query={origin,destination,departureAt:when,now};
let result=planOpenSurfaceCandidates(index,query);
assert.equal(result.status,'scheduled_intercity_candidates');
assert.equal(result.candidates[0].legs.length,2);
assert.equal(result.candidates[0].legs[0].departureTime,'2026-12-03T08:00:00.000Z');
assert.equal(result.candidates[0].legs[1].arrivalTime,'2026-12-03T12:00:00.000Z');
assert.equal(result.candidates[0].completeDoorToDoor,false);
assert.equal(result.candidates[0].seatOrFareVerified,false);
const removed=copy();removed.services[0][3]['20261203']=2;
assert.equal(planOpenSurfaceCandidates(removed,query).candidates.length,0);
const short=copy();short.trips[1][3][0][1]=short.trips[1][3][0][2]=10.5*3600;
assert.equal(planOpenSurfaceCandidates(short,query).candidates.length,0,'45-minute source-stop buffer');
const different=copy();different.stops.push(['different','B',50,0]);different.trips[1][3][0][0]=3;
assert.equal(planOpenSurfaceCandidates(different,query).candidates.length,0,'Same label/coordinate does not establish source stop identity');
const pickup=copy();pickup.trips[0][3][0][3]=0;
assert.equal(planOpenSurfaceCandidates(pickup,query).candidates.length,0);
const overnight=copy();overnight.trips[1][3][0][1]=overnight.trips[1][3][0][2]=25*3600;overnight.trips[1][3][1][1]=overnight.trips[1][3][1][2]=26*3600;
assert.match(planOpenSurfaceCandidates(overnight,query).candidates[0].arrivalTime,/2026-12-04T02:00/);
assert.equal(planOpenSurfaceCandidates(index,{...query,departureAt:'2026-12-03T06:00:00'}).status,'invalid_request');
const controller=new AbortController();controller.abort();assert.equal(planOpenSurfaceCandidates(index,{...query,signal:controller.signal}).status,'search_timeout');
const bounded=copy();bounded.validTo='20261203';assert.equal(planOpenSurfaceCandidates(bounded,query).status,'outside_feed_validity');
let fetches=0;
const assets={fetch:async r=>{fetches++;assert.equal(new URL(r.url).pathname,'/index.json');return Response.json(index)}};
assert.equal((await loadOpenSurfaceIndex({OPEN_SURFACE_ASSETS:assets},{now})).status,'disabled');assert.equal(fetches,0);
const env={OPEN_SURFACE_ENABLED:'true',OPEN_SURFACE_ASSETS:assets};
assert.equal((await loadOpenSurfaceIndex(env,{now})).status,'ready');
assert.equal((await loadOpenSurfaceIndex(env,{now})).status,'ready');assert.equal(fetches,1,'Source cache only; no query/address cache');
assert.equal((await loadOpenSurfaceIndex(env,{now:now+8*86400000})).status,'stale_index');
const publicData=await openSurfaceDataResponse(new Request('https://app.test/api/open-surface/index.json'),env);
assert.equal(publicData.status,200);assert.equal((await publicData.json()).source,OPEN_SURFACE_SOURCE);
assert.equal((await openSurfaceDataResponse(new Request('https://app.test/api/open-surface/index.json',{method:'POST'}),env)).status,405);
let calls=0;
const local=async(e,from,to,limit,{departureAt,signal})=>{
 calls++;assert.ok(departureAt);assert.ok(signal);
 const start=Date.parse(departureAt)+5*60000,end=start+15*60000;
 return {status:'success',journeys:[{provider:'Fixture local',startDateTime:new Date(start).toISOString(),arrivalDateTime:new Date(end).toISOString(),
  legs:[{mode:'walking',from:from.label,to:to.label,departurePoint:from,arrivalPoint:to,departureTime:new Date(start).toISOString(),arrivalTime:new Date(end).toISOString()}]}]};
};
const loadIndex=async()=>({status:'ready',index});
result=await searchOpenSurfaceOptions({},query,{planner:local,loadIndex});
assert.ok(calls>=2&&calls<=3,'At most two access samples and one egress for a candidate');
const option=result.scheduled_surface_options[0];
assert.equal(option.accessVerified,true,JSON.stringify(option));assert.equal(option.egressVerified,true);
assert.equal(option.completeDoorToDoor,true);
assert.equal(option.journey.legs.length,4);assert.equal(option.journey.fareComplete,false);
assert.equal(option.transferProtectionVerified,false);
const wrongDate=async()=>({status:'success',journeys:[{startDateTime:'2026-11-26T07:00:00Z',arrivalDateTime:'2026-11-26T08:00:00Z',legs:[{}]}]});
result=await searchOpenSurfaceOptions({},query,{planner:wrongDate,loadIndex});
assert.equal(result.scheduled_surface_options[0].completeDoorToDoor,false);
assert.equal(result.scheduled_surface_options[0].accessJourney,null);
const missing=await searchOpenSurfaceOptions({},query,{loadIndex});assert.equal(missing.scheduled_surface_options[0].accessStatus,'local_transport_not_configured');
const never=new Promise(()=>{});
const timeout=await searchOpenSurfaceOptions({}, {...query,budgetMs:20},{planner:()=>never,loadIndex});
assert.equal(timeout.open_surface_search_incomplete,true);assert.equal(timeout.scheduled_surface_options[0].completeDoorToDoor,false);
let air=0,ground=0,surface=0;
const independent=await searchMixedIndicativeOptions({}, {...query,international:true,includeFlights:false},{
 discoverAir:async()=>{air++;throw Error('No flights allowed')},
 discoverGround:async()=>{ground++;return {status:'provider_error',operators:[]}},
 searchSurface:async()=>{surface++;return {scheduled_surface_options:[option],open_surface_status:'scheduled_intercity_candidates'}}
});
assert.equal(air,0);assert.equal(ground,1);assert.equal(surface,1);assert.equal(independent.scheduled_surface_options.length,1);
assert.match(readFileSync('index.js','utf8'),/function appendMixedScheduledSurfaceCards/);
console.log('PASS Python-compiled → Worker UTC timetable, calendar/exceptions, >24h, pickup, source IDs, bounded loading/freshness, fixed-point local joins, wrong-date rejection, independent surface and explicit gaps');
