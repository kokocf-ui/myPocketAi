import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {searchMixedRouteProviders} from './mixed_route_provider_search.mjs';
import {makeTransCAPIMixedSource,makeMOTISMixedSource} from './mixed_existing_provider_adapters.mjs';
const backend=readFileSync(new URL('./backend.js',import.meta.url),'utf8');
const frontend=readFileSync(new URL('./index.js',import.meta.url),'utf8');
const form=readFileSync(new URL('./one_field_journey_ui.mjs',import.meta.url),'utf8');
for(const token of ['data.mixed_composition===true','if(sources.length){','const mixedOrigin=explicitOrigin?',
 'planTransCAPIJourney(env,mixedOrigin,','planMOTISMixedJourney(env,mixedOrigin,'])
 assert.ok(backend.includes(token),token);
assert.ok(frontend.includes('mixed_composition:choice.mixedComposition||undefined'));
assert.ok(form.includes('mixedJourney:true,transitDirect:true,mixedComposition:true'));
// Rail, coach and ferry transfer nodes must be discovered independently
// of flight providers, even when a direct public-transport route exists.
assert.ok(backend.includes('discoverGroundTransferCandidates(env,start,{radiusKm:140,limit:3,signal:request.signal})'));
assert.ok(backend.includes('discoverGroundTransferCandidates(env,end,{radiusKm:140,limit:3,signal:request.signal})'));
assert.ok(!backend.includes('discoverAirportCandidates(env,start,{radiusKm:240,limit:12})'),'Surface graph does not spend hub slots on airports');
assert.ok(backend.includes('makeLocalMixedSource({planner:localPointPlanner'),'Graph uses the ordinary local journey pipeline for terminal links');
assert.ok(backend.includes('originGround.candidates||[]'));
assert.ok(backend.includes('destinationGround.candidates||[]'));
assert.ok(backend.includes("mixedHubRole:'origin_access'"));
assert.ok(backend.includes("mixedHubRole:'destination_egress'"));
assert.ok(backend.includes('maxProviderCalls:hubCandidates.length?18:2'));
assert.ok(backend.includes('maxHubs:hubCandidates.length?6:0'));
assert.ok(!backend.includes("if(combined.status!=='verified'&&internationalTarget&&env.GEOAPIFY_API_KEY)"),
 'No air-only fallback: always search land and ferry candidates independently');
assert.ok(!backend.includes('const sources=[tc,mt].filter(s=>s.enabled&&s.licensed&&s.canServe(start,end))'),
 'A provider which only serves a verified transfer must not be prematurely excluded');
const zero=Date.parse('2026-12-08T06:00:00Z'),at=n=>new Date(zero+n*60000).toISOString();
const a={id:'mixed:departure',label:'Door A',latitude:51.5,longitude:-.12};
const z={id:'mixed:arrival',label:'Door B',latitude:51.52,longitude:-.13};
const leg=(mode,mins)=>({mode,from:'Door A',to:'Door B',
 departurePoint:{lat:a.latitude,lon:a.longitude},
 arrivalLatLon:{lat:z.latitude,lon:z.longitude},
 departureTime:at(10),arrivalTime:at(mins)});
const seen=[];
const tc=makeTransCAPIMixedSource({TRANSCAPI_API_KEY:'configured'},{licensed:true,
 planner:async()=>{seen.push('TransCAPI');return {status:'success',journeys:[{
 startDateTime:at(10),arrivalDateTime:at(130),legs:[leg('national-rail',130)]}]}}});
const motis=makeMOTISMixedSource({MOTIS_API_BASE_URL:'https://licensed-motis.example'},{licensed:true,
 planner:async()=>{seen.push('MOTIS');return {status:'success',journeys:[{
 startDateTime:at(10),arrivalDateTime:at(90),legs:[leg('coach',90)]}]}}});
const result=await searchMixedRouteProviders({origin:a,destination:z,departureAt:at(0),now:zero,
 sources:[tc,motis],maxProviderCalls:2,maxHubs:0});
assert.equal(result.status,'verified');
assert.deepEqual(result.journeys.map(j=>j.modeSignature),['coach','train']);
assert.ok(result.journeys.every(j=>j.fareComplete===false));
assert.ok(result.journeys.every(j=>j.boarding_stop?.label==='Door A'));
assert.ok(result.journeys.every(j=>j.firstVehicleDepartureTime===at(10)));
assert.ok(result.journeys.every(j=>j.legs[0].departurePoint?.lat===a.latitude));
assert.ok(result.journeys.every(j=>j.legs.at(-1).arrivalLatLon?.lon===z.longitude));
assert.ok(frontend.includes("state.lastTransitChoice?.mixedJourney===true"),'Mixed results can open details without faking a boarding stop');
assert.deepEqual(new Set(seen),new Set(['TransCAPI','MOTIS']));
const motisOnly=await searchMixedRouteProviders({origin:a,destination:z,
 departureAt:at(0),now:zero,sources:[motis],maxProviderCalls:2,maxHubs:0});
assert.equal(motisOnly.status,'verified','One licensed provider must be sufficient');
assert.deepEqual(motisOnly.journeys.map(j=>j.modeSignature),['coach']);
assert.equal(motisOnly.completeJourneyVerified,true);
console.log('PASS mixed search: both licensed planners, selected origin and honest fares');
