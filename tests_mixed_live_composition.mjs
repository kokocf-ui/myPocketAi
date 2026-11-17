import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {searchMixedRouteProviders} from './mixed_route_provider_search.mjs';
import {makeTransCAPIMixedSource,makeMOTISMixedSource} from './mixed_existing_provider_adapters.mjs';
const backend=readFileSync(new URL('./backend.js',import.meta.url),'utf8');
const frontend=readFileSync(new URL('./index.js',import.meta.url),'utf8');
const form=readFileSync(new URL('./one_field_journey_ui.mjs',import.meta.url),'utf8');
for(const token of ['data.mixed_composition===true','sources.length>=2','const mixedOrigin=explicitOrigin?',
 'planTransCAPIJourney(env,mixedOrigin,','planMOTISMixedJourney(env,mixedOrigin,'])
 assert.ok(backend.includes(token),token);
assert.ok(frontend.includes('mixed_composition:choice.mixedComposition||undefined'));
assert.ok(form.includes('mixedJourney:true,transitDirect:true,mixedComposition:true'));
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
assert.ok(index.includes("state.lastTransitChoice?.mixedJourney===true"),'Mixed results can open details without faking a boarding stop');
assert.deepEqual(new Set(seen),new Set(['TransCAPI','MOTIS']));
console.log('PASS mixed search: both licensed planners, selected origin and honest fares');
