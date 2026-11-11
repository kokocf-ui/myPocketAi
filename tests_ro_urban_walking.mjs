import assert from 'node:assert/strict';
import {test} from 'node:test';
import {addRomanianWalkingAccess} from './ro_urban_walking.mjs';

const a={latitude:47.05,longitude:21.92},b={latitude:47.055,longitude:21.922};
const base={
 time_zone:'Europe/Bucharest',scheduled:true,real_time:false,durationMinutes:15,
 startDateTime:'2026-11-12T08:00:00Z',arrivalDateTime:'2026-11-12T08:15:00Z',
 legs:[{mode:'tram',from:'Start',to:'Gara',departureTime:'2026-11-12T08:00:00Z',arrivalTime:'2026-11-12T08:15:00Z'}],
 access:{stop_name:'Start',latitude:47.0502,longitude:21.9201},
 egress:{stop_name:'Gara',latitude:47.0548,longitude:21.922}
};
test('Verified street walk provides boarding stop and final mile, avoiding inferred routes',async()=>{
 let count=0;
 const out=await addRomanianWalkingAccess({GEOAPIFY_API_KEY:'test-key'},base,a,b,{
  fetchImpl:async(url)=>{
   const u=new URL(url);assert.equal(u.pathname,'/v1/routing');
   assert.equal(u.searchParams.get('mode'),'walk');
   count++;
   return Response.json({features:[{properties:{distance:330,time:350},geometry:{type:'LineString',coordinates:[[21.92,47.05],[21.9201,47.0502]]}}]});
  }
 });
 assert.equal(count,2);
 assert.equal(out.accessWalkVerified,true);
 assert.equal(out.walkingAccessVerified,true);
 assert.equal(out.walkingEgressVerified,true);
 assert.equal(out.walkToFirstStopMinutes,6);
 assert.equal(out.walkFromLastStopMinutes,6);
 assert.equal(out.legs.length,2);
 assert.equal(out.legs[1].mode,'walking');
 assert.equal(out.arrivalAtDestinationTime,'2026-11-12T08:21:00.000Z');
 assert.equal(out.durationToDestinationMinutes,27);
 assert.equal(out.boarding_stop.label,'Start');
 assert.equal(out.legs[0].arrivalLatLon.lat,47.0548);
 assert.equal(base.legs.length,1,'Never modify the provider result');
});
test('Missing walking provider never fakes access times',async()=>{
 const out=await addRomanianWalkingAccess({},base,a,b);
 assert.equal(out.accessWalkVerified,false);
 assert.equal(out.walkingAccessVerified,false);
 assert.equal(out.legs.length,1);
 assert.equal(out.boarding_stop.latitude,47.0502);
 assert.equal(out.walkToFirstStopMinutes,null);
});
test('Bad or geometry-free walking results are not considered verified',async()=>{
 const out=await addRomanianWalkingAccess({GEOAPIFY_API_KEY:'key'},base,a,b,{fetchImpl:async()=>Response.json({features:[{properties:{distance:100,time:90},geometry:{type:'LineString',coordinates:[]}}]})});
 assert.equal(out.walkingAccessVerified,false);
 assert.equal(out.walkingEgressVerified,false);
});
