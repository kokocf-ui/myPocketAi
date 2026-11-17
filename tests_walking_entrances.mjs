import assert from 'node:assert/strict';
import {mappedWalkingEntranceCandidates,discoverMappedWalkingEntrances} from './walking_entrance_access.mjs';
const dest={latitude:51.475,longitude:0.326,label:'Shopping Centre, Grays, UK'};
const origin={latitude:51.47,longitude:0.32};
const entrance=(id,lat,lon,kind='main',tags={})=>({type:'node',id,lat,lon,tags:{entrance:kind,...tags}});
const points=[entrance(1,51.4757,.3255),entrance(2,51.475,.327),entrance(3,51.4752,.3262,'service'),
entrance(4,51.4751,.326,'yes',{access:'private'}),entrance(5,51.482,.33)];
const result=mappedWalkingEntranceCandidates(points,dest,origin);
assert.equal(result.length,2);
assert.ok(result.every(p=>p.access_kind==='mapped_entrance'));
assert.ok(result.every(p=>p.entrance_distance_m<=180));
assert.equal(mappedWalkingEntranceCandidates(points,{...dest,label:'Library'},origin).length,1);
let called=0;
const fetcher=async (url,opts)=>{called++;assert.match(url,/overpass/);assert.match(decodeURIComponent(opts.body),/node\["entrance"\]/);return Response.json({elements:points})};
const selected=await discoverMappedWalkingEntrances({destination:dest,origin,fetcher});
assert.equal(selected.length,2);
assert.equal(called,1);
assert.deepEqual(await discoverMappedWalkingEntrances({destination:{...dest,label:'Grays, UK'},origin,fetcher}),[]);
assert.equal(called,1,'city destinations never query entrance API');
const backend=await import('node:fs').then(fs=>fs.readFileSync(new URL('./backend.js',import.meta.url),'utf8'));
assert.match(backend,/rc\.profile==='walk'&&!via\?discoverMappedWalkingEntrances/);
assert.match(backend,/entrance_distance_m/);
assert.match(backend,/verifiedEntrances/);
console.log('Walking entrance selection tests passed');


import {nearbyPedestrianApproachRoute,preferMappedWalkingEntrance} from './walking_entrance_access.mjs';
const approachDestination={latitude:51.475,longitude:0.326,label:'West Mall shop'};
const publicFootway={latitude:51.4755,longitude:0.3257,access_kind:'footpath'};
const plausible={profile:'walk',coordinates:[[.32,51.47],[.3257,51.4755]],
 distanceMeters:1450,durationSeconds:1200,steps:[{text:'Go along pedestrian street',number:1}]};
const accepted=nearbyPedestrianApproachRoute(plausible,publicFootway,approachDestination,2200);
assert.ok(accepted,'provider-verifiable pedestrian approach may replace large building detour');
assert.equal(accepted.access_kind,'nearby_pedestrian_path');
assert.equal(accepted.original_destination.label,'West Mall shop');
assert.match(accepted.steps.at(-1).text,/nu este verificat/);
assert.equal(nearbyPedestrianApproachRoute({...plausible,distanceMeters:2070},publicFootway,approachDestination,2200),null,'no cosmetic shortcut');
assert.equal(nearbyPedestrianApproachRoute({...plausible,coordinates:[[.32,51.47],[.333,51.478]]},publicFootway,approachDestination,2200),null,'no off-street snap');
assert.equal(nearbyPedestrianApproachRoute({...plausible,profile:'drive'},publicFootway,approachDestination,2200),null,'car navigation excluded');
assert.equal(preferMappedWalkingEntrance({distanceMeters:2200},{distanceMeters:2600,access_kind:'mapped_entrance'}),false,'39-minute route must not replace shorter overlap');
assert.equal(preferMappedWalkingEntrance({distanceMeters:2200},{distanceMeters:2210,access_kind:'mapped_entrance'}),true,'near-equal mapped door can be labeled');
assert.match(backend,/nearbyPedestrianApproachRoute\(result\.value,nearPaths\[i\],destination,baselineMeters,lang\)/);
assert.match(backend,/preferMappedWalkingEntrance\(routes\[same\],candidate\)/);
