import assert from 'node:assert/strict';
import {walkingRouteConnection} from './mixed_walking_connection.mjs';
import {createMixedLocalPlanner} from './mixed_local_planner.mjs';
import worker from './backend.js';
const from={latitude:47.043072,longitude:21.958487,label:'Public synthetic arrival stop',country_code:'RO'};
const to={latitude:47.0612,longitude:21.9473,label:'Public synthetic final point',country_code:'RO'};
const departureAt=new Date(Date.now()+2*86400000).toISOString();
const route={profile:'walk',distanceMeters:2500,durationSeconds:2100,coordinates:[[from.longitude,from.latitude],[21.95,47.05],[to.longitude,to.latitude]],steps:[{text:'Fixture instruction'}]};
const data={route_available:true,route};
let j=walkingRouteConnection(data,from,to,departureAt);
assert.equal(j.legs[0].timingEstimated,true);
assert.equal(j.legs[0].coordinates.length,3);
assert.equal(j.legs[0].steps[0].text,'Fixture instruction');
assert.equal(Date.parse(j.arrivalDateTime)-Date.parse(j.startDateTime),2100000);
for(const change of [r=>r.durationSeconds=null,r=>r.coordinates.at(-1)[0]+=.1,r=>r.coordinates[0][1]+=1,r=>r.access_kind='nearby_pedestrian_path',r=>r.profile='drive',r=>r.durationSeconds=1]){
 const bad=structuredClone(data);change(bad.route);assert.equal(walkingRouteConnection(bad,from,to,departureAt),null);
}
let dispatches=0;
const planner=createMixedLocalPlanner({env:{},dispatch:async request=>{
 const p=await request.json();dispatches++;
 assert.equal(p.mixed_journey,false);assert.equal(p.national_public_transport,false);
 if(p.route_profile){assert.equal(p.route_profile,'walk');assert.deepEqual(p.route_destination,to);assert.equal(p.transit_query,undefined);return Response.json(data)}
 return Response.json({reason:'ro_urban_feed_unavailable',transit:[]});
}});
assert.equal((await planner({},from,to,1,{departureAt})).journeys.length,0,'No walking without caller consent');
assert.equal((await planner({},from,to,1,{departureAt,allowWalking:true})).journeys.length,1);
assert.equal(dispatches,3);
const later=new Date(Date.parse(departureAt)+60000).toISOString();
assert.equal((await planner({},from,to,1,{departureAt:later,allowWalking:true})).journeys[0].startDateTime,later);
assert.equal(dispatches,4,'Reuse actual walking geometry for the next dated sample');
let blocked=0;
const quota=createMixedLocalPlanner({env:{},dispatch:async()=>{blocked++;return Response.json({reason:'quota_exhausted',transit:[]})}});
assert.equal((await quota({},from,to,1,{departureAt,allowWalking:true})).journeys.length,0);assert.equal(blocked,1,'Exhaustion must not start another provider');
let budget=0;
const limited=createMixedLocalPlanner({env:{},maxCalls:1,dispatch:async()=>{budget++;return Response.json({reason:'ro_urban_feed_unavailable'})}});
assert.equal((await limited({},from,to,1,{departureAt,allowWalking:true})).journeys.length,0);assert.equal(budget,1,'Walking dispatch shares the same cap');
// Exercise actual ordinary Worker selected-destination walking path too.
const original=globalThis.fetch;let routing=0;
globalThis.fetch=async input=>{
 const u=new URL(typeof input==='string'?input:input.url||String(input));
 if(u.hostname==='api.geoapify.com'&&u.pathname==='/v1/routing'){
  routing++;assert.equal(u.searchParams.get('mode'),'walk');
  return Response.json({features:[{geometry:{type:'LineString',coordinates:route.coordinates},properties:{distance:2500,time:2100,distance_units:'meters',legs:[{steps:[{instruction:{text:'Fixture walk instruction'}}]}]}}]});
 }
 if(u.hostname==='api.geoapify.com')return Response.json({features:[]});
 if(u.hostname.includes('overpass'))return Response.json({elements:[]});
 throw Error('No unrelated provider '+u.hostname);
};
try{
 const actual=createMixedLocalPlanner({dispatch:worker.fetch,env:{GEOAPIFY_API_KEY:'fixture',AI:{run:async()=>{throw Error('No LLM')}}}});
 const result=await actual({},from,to,1,{departureAt,allowWalking:true});
 assert.equal(result.status,'success',JSON.stringify(result));
 assert.equal(result.journeys[0].schedule_status,'walking_duration_estimate');
 assert.ok(routing>0);assert.deepEqual(result.journeys[0].legs[0].coordinates,route.coordinates);
}finally{globalThis.fetch=original}
console.log('PASS existing standalone pedestrian router reused through real Worker; exact endpoints, provider duration/geometry, estimates labelled, shared budget/cache, no fallback after quota exhaustion');
