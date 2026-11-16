import assert from 'node:assert/strict';
import {test} from 'node:test';
import {annotateTransitTransfers} from './transit_transfer_walking.mjs';
const time=m=>new Date(Date.parse('2026-11-17T09:00:00Z')+m*60000).toISOString();
const A={latitude:51.500,longitude:-0.120};
const B={latitude:51.502,longitude:-0.120};
const vehicle=(line,from,to,dep,arr,departurePoint,arrivalPoint,fromStopId,toStopId)=>({
 mode:line==='R'?'national-rail':'bus',from,to,lineNames:[line],
 fromStopId,toStopId,departurePoint,
 arrivalLatLon:{lat:arrivalPoint.latitude,lon:arrivalPoint.longitude},
 departureTime:time(dep),arrivalTime:time(arr)
});
const make=(transferDep=35)=>({provider:'Test UK',startDateTime:time(0),arrivalDateTime:time(60),
 legs:[vehicle('B','Start','Bus platform',0,20,A,A,'A','B'),
       vehicle('R','Rail platform','End',transferDep,60,B,B,'C','D')],
 routeSegments:[],geometryAvailable:false});
const fetchImpl=async(url)=>{
 const u=new URL(url);
 assert.equal(u.hostname,'api.geoapify.com');
 assert.equal(u.searchParams.get('mode'),'walk');
 const coords=u.searchParams.get('waypoints').split('|').map(v=>v.split(',').map(Number))
  .map(([lat,lon])=>[lon,lat]);
 return Response.json({features:[{geometry:{type:'LineString',coordinates:coords},
  properties:{distance:550,time:600}}]});
};
test('Ten-minute verified walking transfer becomes visible leg with geometry and five-minute wait',async()=>{
 const original=make();
 const out=await annotateTransitTransfers({GEOAPIFY_API_KEY:'test-key'},original,{fetchImpl});
 assert.equal(out.transferFeasible,true);
 assert.equal(out.transferWalkingVerified,true);
 assert.equal(out.transferWalks.length,1);
 assert.equal(out.transferWalks[0].walkingMinutes,10);
 assert.equal(out.transferWalks[0].waitingMinutes,5);
 assert.equal(out.transferWalks[0].walkingDistanceMeters,550);
 assert.equal(out.legs.length,3);
 assert.equal(out.legs[1].mode,'walking');
 assert.equal(out.legs[1].transferWalk,true);
 assert.equal(out.legs[1].geometryAvailable,true);
 assert.equal(out.legs[1].departureTime,time(20));
 assert.equal(out.legs[1].arrivalTime,time(30));
 assert.equal(original.legs.length,2,'Do not alter provider legs');
});
test('Uncatchable transfer is rejected and not presented as walkable',async()=>{
 const out=await annotateTransitTransfers({GEOAPIFY_API_KEY:'test-key'},make(27),{fetchImpl});
 assert.equal(out.transferFeasible,false);
 assert.equal(out.transferWalks[0].status,'impossible');
 assert.equal(out.legs.length,2,'Do not insert a timed walking step that misses the next service');
});
test('Unknown walking geometry fails closed without fabricated metres or minutes',async()=>{
 const out=await annotateTransitTransfers({},make());
 assert.equal(out.transferFeasible,null);
 assert.equal(out.transferWalks[0].status,'unverified');
 assert.equal(out.transferWalks[0].walkingMinutes,null);
 assert.equal(out.transferWalks[0].walkingDistanceMeters,null);
 assert.equal(out.transferWalks[0].geometryAvailable,false);
 assert.equal(out.legs.length,2);
});
test('Identical verified stop ID needs transfer time but not invented outdoor footpath',async()=>{
 const j=make();j.legs[0].toStopId='B';j.legs[1].fromStopId='B';j.legs[1].departurePoint=A;
 const out=await annotateTransitTransfers({},j);
 assert.equal(out.transferFeasible,true);
 assert.equal(out.transferWalks[0].status,'same_stop');
 assert.equal(out.transferWalks[0].platformChangeUnverified,true);
 assert.equal(out.legs.length,2);
});
test('Existing provider WALK leg with confirmed hours remains visible when street geometry missing',async()=>{
 const j=make();
 j.legs.splice(1,0,{mode:'walking',from:'Bus platform',to:'Rail platform',
  departureTime:time(21),arrivalTime:time(31),durationMinutes:10,coordinates:[],geometryAvailable:false});
 const out=await annotateTransitTransfers({},j);
 assert.equal(out.transferFeasible,null);
 assert.equal(out.transferWalks[0].status,'provider_timing_only');
 assert.equal(out.transferWalks[0].walkingMinutes,10);
 assert.equal(out.legs.length,3);
 assert.equal(out.legs[1].departureTime,time(21));
});
test('Provider walking geometry with matching endpoints can be reused without Geoapify quota',async()=>{
 const j=make();j.legs.splice(1,0,{mode:'walking',from:'Bus platform',to:'Rail platform',
  departureTime:time(21),arrivalTime:time(31),durationMinutes:10,distanceMeters:400,
  coordinates:[[-0.120,51.500],[-0.120,51.502]],geometryAvailable:true});
 const out=await annotateTransitTransfers({},j,{fetchImpl:()=>{throw Error('should not fetch')}});
 assert.equal(out.transferFeasible,true);
 assert.equal(out.transferWalks[0].status,'verified');
 assert.equal(out.transferWalks[0].waitingMinutes,5);
 assert.equal(out.legs.length,3);
});
