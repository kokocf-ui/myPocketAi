import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {romanianNationalQuery,normalizeBiloTrips,planRomanianNationalJourney,
  romanianJourneySummary,bucharestTravelDate,reverseRomanianOriginCity} from './ro_national_transit.mjs';

const p=s=>romanianNationalQuery(s,{mixed_journey:false});
assert.deepEqual(p('Cu trenul din Oradea la Cluj-Napoca?'),
 {origin:'Oradea',destination:'Cluj-Napoca',hasOrigin:true,hasDestination:true});
assert.deepEqual(p('Transport public din București până la Brașov'),
 {origin:'București',destination:'Brașov',hasOrigin:true,hasDestination:true});
assert.equal(p('Din Grays la Manchester cu trenul'),null,'Do not hijack UK journeys');
assert.equal(p('Cum merg cu mașina din Oradea la Cluj?'),null,'Do not route cars to rail adapter');
assert.equal(p('Ce mai faci?'),null);
assert.equal(p('Transport public din Oltenița la Călărași, România')?.destination,'Călărași, România','Explicit country permits arbitrary town names');
assert.equal(bucharestTravelDate('2026-11-11T23:30:00Z'),'2026-11-12','Romania has a different timezone');
const from={from:'Oradea',to:'Cluj-Napoca',mode:'train',departureTime:'2026-11-12T08:00:00+02:00',arrivalTime:'2026-11-12T10:15:00+02:00',trainNumber:'IR 1602',operator:'CFR Călători'};
const payload={data:{trips:[{legs:[from],price:{amount:34.5,currency:'RON'}}]}};
const routes=normalizeBiloTrips(payload,5);
assert.equal(routes.length,1);
assert.equal(routes[0].durationMinutes,135);
assert.equal(routes[0].legs[0].mode,'train');
assert.equal(routes[0].fareLocal.currency,'RON');
assert.match(romanianJourneySummary(routes,'Oradea','Cluj-Napoca','ro'),/08:00/);
assert.equal(normalizeBiloTrips({data:{trips:[{legs:[{...from,arrivalTime:''}]}]}}).length,0,'Missing times must not be invented');
assert.equal(normalizeBiloTrips({data:{trips:[{legs:[{...from,mode:'unknown'}]}]}}).length,0,'Unknown transport means fail closed');
assert.equal(normalizeBiloTrips({data:{trips:[{legs:[{...from,arrivalTime:'2026-11-12T06:00:00+02:00'}]}]}}).length,0,'Negative duration impossible');
assert.equal((await planRomanianNationalJourney({}, {origin:'Oradea',destination:'Cluj'}, {date:'2026-11-12'})).status,'not_configured');
let headers,body,url;
const mock=async(u,options)=>{url=u;headers=options.headers;body=JSON.parse(options.body);return {ok:true,status:200,json:async()=>payload};};
const answer=await planRomanianNationalJourney({BILO_API_KEY:'server-secret'},{origin:'Oradea',destination:'Cluj-Napoca'},{date:'2026-11-12',limit:4,fetchImpl:mock});
assert.equal(answer.status,'ok');
assert.equal(answer.journeys.length,1);
assert.equal(url,'https://mcp.bilo.ro/api/v1/search');
assert.equal(headers.Authorization,'Bearer server-secret');
assert.deepEqual(Object.keys(body).sort(),['origin','destination','date','passengers','mode','railClass','sort','limit'].sort());
assert.equal((await planRomanianNationalJourney({BILO_API_KEY:'x'},{origin:'Oradea',destination:'Cluj'},{date:'2026-11-12',fetchImpl:async()=>({status:401,ok:false})})).status,'authentication_failed');
assert.equal((await planRomanianNationalJourney({BILO_API_KEY:'x'},{origin:'Oradea',destination:'Cluj'},{date:'2026-11-12',fetchImpl:async()=>({status:429,ok:false})})).status,'quota_exceeded');
assert.equal((await reverseRomanianOriginCity({GEOAPIFY_API_KEY:'x'},{latitude:51.5,longitude:-0.1},()=>{throw Error('must not geocode UK')})),'');
const backend=readFileSync('backend.js','utf8');
assert.match(backend,/romanianNationalQuery\(message/,'Romanian intent enters unified backend');
assert.match(backend,/roTransitQuery \|\| explicitMixedJourney/,'Romanian queries reach transit branch');
assert.match(backend,/transit_provider:'Bilo'/,'Response identifies the provider');
assert.match(backend,/transit_available:false/,'Unsupported timetable remains unverified');
assert.match(backend,/transit_available:true/,'Verified schedules retain the transit results');
assert.match(backend,/const explicitCarRoute/,'Existing driving route guard remains');
console.log('PASS Romania Bilo keyed national rail/coach intent, ISO dates, schema fail-closed, guard UK/car routes');