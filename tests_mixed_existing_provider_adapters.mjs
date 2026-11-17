import assert from 'node:assert/strict';
import {canonicalizeMixedProviderStop,resolveMixedTransferProvenance} from './mixed_stop_identity.mjs';
import {convertTransCAPIToMixedLegs,convertMOTISToMixedLegs,convertBiloToMixedLegs,
 makeTransCAPIMixedSource,makeMOTISMixedSource,makeBiloMixedSource} from './mixed_existing_provider_adapters.mjs';
import {searchMixedRouteProviders} from './mixed_route_provider_search.mjs';

const t0=Date.parse('2026-12-08T06:00:00Z'),at=n=>new Date(t0+n*60000).toISOString();
const loc=(id,latitude,longitude,extra={})=>({id,label:id,latitude,longitude,...extra});
const A=loc('door-A',51.5,-0.12),B=loc('door-B',51.52,-0.13);
const first=loc('rail-A',51.5001,-0.1201),last=loc('rail-B',51.5199,-0.1299);
const query={from:A,to:B,departureAt:at(0)};
const part=(mode,from,to,fromPoint,toPoint,start,end)=>({
 mode,from,to,departurePoint:{lat:fromPoint.latitude,lon:fromPoint.longitude,
  commonName:from,naptanId:'test-provider-stop'},
 arrivalLatLon:{lat:toPoint.latitude,lon:toPoint.longitude},
 departureTime:at(start),arrivalTime:at(end),
 lineNames:mode==='national-rail'?['Example Rail']:[],operator:'example operator'
});
const j={startDateTime:at(20),arrivalDateTime:at(105),departureFeasible:true,
 legs:[
  part('walking','Origin door','Rail A',A,first,20,30),
  part('national-rail','Rail A','Rail B',first,last,45,90),
  part('walking','Rail B','Destination door',last,B,90,105)
 ]};
const raw=convertTransCAPIToMixedLegs(j,query);
assert.equal(raw.length,3);
assert.deepEqual(raw.map(x=>x.mode),['walking','train','walking']);
assert.equal(raw[0].from.id,A.id);
assert.equal(raw[2].to.id,B.id);
assert.equal(raw[0].to.id,raw[1].from.id);
assert.equal(raw[1].to.id,raw[2].from.id);
assert.equal(raw[1].fareVerified,false);
assert.equal(convertTransCAPIToMixedLegs({
 ...j,legs:[...j.legs.slice(0,2),{...j.legs[2],from:'Another station'}]
},query).length,0,'An undocumented station change is not a free teleport');
assert.equal(convertTransCAPIToMixedLegs({
 ...j,legs:[{...j.legs[0],departurePoint:{lat:50.1,lon:-0.12}},...j.legs.slice(1)]
},query).length,0,'Wrong starting door is rejected');
let called=0;
const tc=makeTransCAPIMixedSource({TRANSCAPI_API_KEY:'present'},{
 licensed:true,planner:async(env,from,to,limit,opts)=>{
  called++;assert.equal(opts.departureAt,at(0));return {status:'success',journeys:[j]};
 }});
assert.equal(tc.enabled,true);
assert.equal(tc.canServe(A,B),true);
const routes=await searchMixedRouteProviders({origin:A,destination:B,departureAt:at(0),now:t0,sources:[tc]});
assert.equal(called,1);
assert.equal(routes.status,'verified');
assert.deepEqual(routes.journeys.map(x=>x.modeSignature),['train']);
assert.equal(routes.journeys[0].legs.at(-1).to,'Destination door');
assert.equal(routes.journeys[0].finalTransferVerified,true);
assert.equal(routes.journeys[0].fareComplete,false,'No invented all-in ticket price');
assert.equal(makeTransCAPIMixedSource({TRANSCAPI_API_KEY:'present'},{licensed:false}).licensed,false);
assert.equal(makeTransCAPIMixedSource({},{licensed:true}).enabled,false);
// MOTIS keeps its own source namespace and only accepts an authorized URL.
// No public Transitous volunteer API may be silently used.
const motisPayload={...j,legs:j.legs.map(l=>({
 ...l,mode:l.mode==='national-rail'?'highspeed_rail':l.mode
}))};
const motisLegs=convertMOTISToMixedLegs(motisPayload,query);
assert.equal(motisLegs.length,3);
assert.equal(motisLegs[1].mode,'train');
assert.equal(motisLegs[1].provider,'MOTIS');
assert.notEqual(motisLegs[1].from.id,raw[1].from.id,
 'Two providers cannot merge a station solely because it has the same name');
const volunteer=makeMOTISMixedSource({MOTIS_API_BASE_URL:'https://api.transitous.org'},{
 licensed:true,planner:async()=>{throw Error('never reach volunteer API')}
});
assert.equal(volunteer.enabled,false);
let motisRequests=0;
const motis=makeMOTISMixedSource({MOTIS_API_BASE_URL:'https://licensed-motis.example'},{
 licensed:true,planner:async(env,from,to,when)=>{
  motisRequests++;assert.equal(when,at(0));return {status:'success',journeys:[motisPayload]};
 }});
const motisGraph=await searchMixedRouteProviders({origin:A,destination:B,
 departureAt:at(0),now:t0,sources:[motis]});
assert.equal(motisRequests,1);
assert.equal(motisGraph.status,'verified');
assert.deepEqual(motisGraph.journeys[0].modes,['train']);
// Official stop crosswalk requires maintained evidence, not a raw feed flag.
const passenger=loc('query-origin',51.5,-.12);
const registry=[{provider:'Bilo',providerStopId:'station-42',
 canonicalId:'canonical:official:42',verified:true,evidenceSource:'operator-code-registry',
 latitude:51.51,longitude:-.13}];
const fake={id:'station-42',label:'Same stop',latitude:51.51,longitude:-.13,
 identityVerified:true,canonicalId:'fake:self-certified'};
assert.equal(canonicalizeMixedProviderStop(fake,'Bilo',{from:passenger,to:B}).id,'Bilo:station-42',
 'Self asserted canonical ID is not trusted');
assert.equal(canonicalizeMixedProviderStop(fake,'Bilo',{from:passenger,to:B},{
 crosswalk:registry}).id,'canonical:official:42');
assert.equal(canonicalizeMixedProviderStop({...fake,longitude:0},'Bilo',{from:passenger,to:B},{
 crosswalk:registry}).id,'Bilo:station-42',
 'Crosswalk must match stop geometry');
assert.equal(canonicalizeMixedProviderStop({id:passenger.id,label:'Nearby but not the door',
 latitude:51.53,longitude:-.12},'Bilo',{from:passenger,to:B}),null,
 'Wrong-geometry origin IDs are rejected');
assert.equal(resolveMixedTransferProvenance(
 {id:'one'}, {id:'two'}).allowed,false);
assert.equal(resolveMixedTransferProvenance(
 {id:'one'},{id:'two'},{walkLeg:{
 verified:true,mode:'walking',from:{id:'one'},to:{id:'two'},departureTime:at(10),arrivalTime:at(25)
 }}).allowed,true);

const bilo={scheduled:true,startDateTime:at(20),arrivalDateTime:at(200),legs:[
 {mode:'train',from:'Station One',to:'Station Two',fromLocality:'City One',toLocality:'City Two',
  departureTime:at(20),arrivalTime:at(110),operator:'Operator A'},
 {mode:'coach',from:'Station Two',to:'Station Three',fromLocality:'City Two',toLocality:'City Three',
  departureTime:at(130),arrivalTime:at(200),operator:'Operator B'}
]};
assert.equal(convertBiloToMixedLegs(bilo).status,'station_identity_unavailable',
 'City names alone are insufficient to join Bilo stops');
const registryBilo={
 'Station One':{id:'bilo-1',latitude:47.07,longitude:21.92},
 'Station Two':{id:'bilo-2',latitude:47.08,longitude:21.94},
 'Station Three':{id:'bilo-3',latitude:47.12,longitude:21.97}
};
const resolveStop=({rawName})=>{
 const s=registryBilo[rawName];
 return s?{providerStopId:s.id,verified:true,rawName,evidenceSource:'official Bilo stop-ID mapping',
   latitude:s.latitude,longitude:s.longitude}:null;
};
const converted=convertBiloToMixedLegs(bilo,{resolveStop});
assert.equal(converted.status,'verified_station_records');
assert.equal(converted.legs.length,2);
assert.equal(converted.legs[0].to.id,converted.legs[1].from.id);
assert.ok(converted.legs.every(x=>x.fareVerified===false));
const bad=convertBiloToMixedLegs(bilo,{
 resolveStop:payload=>payload.legIndex===1&&payload.side==='from'?
  {...resolveStop(payload),providerStopId:'wrong-station'}:resolveStop(payload)
});
assert.equal(bad.status,'transfer_leg_missing');

const RO1=loc('RO:origin',47.07,21.92,{country_code:'RO',city:'City One',cityVerified:true});
const RO2=loc('RO:destination',47.12,21.97,{country_code:'RO',city:'City Three',cityVerified:true});
let billedCalls=0,day=null;
const mockBilo=async(env,query,opts)=>{
 billedCalls++;day=opts.date;assert.deepEqual(query,{origin:'City One',destination:'City Three'});
 return {status:'ok',journeys:[bilo]};
};
const gated=makeBiloMixedSource({BILO_API_KEY:'present'},{licensed:true,planner:mockBilo});
assert.equal(gated.enabled,false,'Do not spend quota before station proof is available');
assert.equal(gated.canServe(RO1,RO2),false);
const withRegistry=makeBiloMixedSource({BILO_API_KEY:'present'},{licensed:true,
 planner:mockBilo,resolveStop});
assert.equal(withRegistry.canServe(RO1,RO2),true);
const picked=await withRegistry.searchLegs({from:RO1,to:RO2,departureAt:at(0)});
assert.equal(picked.status,'success');
assert.equal(picked.legs.length,2);
assert.equal(day,'2026-12-08');
assert.equal(billedCalls,1);
assert.equal(withRegistry.canServe(RO1,A),false,
 'Do not call Romanian Bilo for an international query');
const incomplete=await searchMixedRouteProviders({origin:RO1,destination:RO2,
 departureAt:at(0),now:t0,sources:[withRegistry],maxProviderCalls:2});
assert.equal(incomplete.journeys.length,0,
 'Station-only Bilo journeys are not automatically home-to-home');
console.log('PASS existing providers: TransCAPI door-to-door, Bilo documented stops, crosswalk evidence, no fake transfers');
