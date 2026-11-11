import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {romanianNationalQuery,normalizeBiloTrips,planRomanianNationalJourney,
  romanianJourneySummary,bucharestTravelDate,romanianDepartureDate,reverseRomanianOriginCity,inspectBiloSearchResponse} from './ro_national_transit.mjs';

const p=s=>romanianNationalQuery(s,{mixed_journey:false});
assert.deepEqual(p('Cu trenul din Oradea la Cluj-Napoca?'),
 {origin:'Oradea',destination:'Cluj-Napoca',hasOrigin:true,hasDestination:true});
assert.deepEqual(p('Transport public din București până la Brașov'),
 {origin:'București',destination:'Brașov',hasOrigin:true,hasDestination:true});

assert.deepEqual(p('Cu trenul din București la Brașov mâine?'),
 {origin:'București',destination:'Brașov',hasOrigin:true,hasDestination:true},
 'Accented mâine must not trigger address resolution');
assert.deepEqual(p('Cu trenul din București la Brașov maine?'),
 {origin:'București',destination:'Brașov',hasOrigin:true,hasDestination:true},
 'Unaccented maine works too');
assert.deepEqual(p('Cu autocarul din Oradea la Cluj-Napoca poimâine?'),
 {origin:'Oradea',destination:'Cluj-Napoca',hasOrigin:true,hasDestination:true});
assert.deepEqual(p('Transport public din București până la Brașov pe 15 noiembrie 2026'),
 {origin:'București',destination:'Brașov',hasOrigin:true,hasDestination:true});
assert.deepEqual(p('Cu trenul din Oradea la Cluj-Napoca pe 15.11.2026'),
 {origin:'Oradea',destination:'Cluj-Napoca',hasOrigin:true,hasDestination:true});
const now=new Date('2026-11-11T10:15:00Z');
assert.equal(romanianDepartureDate('Cu trenul din București la Brașov mâine?',null,now),'2026-11-12');
assert.equal(romanianDepartureDate('Cu trenul din București la Brașov poimâine?',null,now),'2026-11-13');
assert.equal(romanianDepartureDate('Cu trenul din București la Brașov azi?',null,now),'2026-11-11');
assert.equal(romanianDepartureDate('Cu trenul din București la Brașov pe 15 noiembrie 2026',null,now),'2026-11-15');
assert.equal(romanianDepartureDate('Cu trenul din București la Brașov pe 16.11.2026',null,now),'2026-11-16');
assert.equal(romanianDepartureDate('Cu trenul din București la Brașov mâine?','2026-11-20T12:00:00+02:00',now),'2026-11-20','Explicit selected UI date takes priority');
assert.equal(romanianDepartureDate('Cu trenul din București la Brașov mâine?',null,new Date('2026-11-11T23:30:00Z')),'2026-11-13','Romania local day matters near midnight UK');
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
const flat=normalizeBiloTrips({schema_version:2,mode:'rail',results:[{
 origin:'București Nord',destination:'Brașov',departure_time:'08:30',arrival_time:'11:05',
 operator:'CFR Călători',train_number:'IR 1535',
 pricing:{fares:[{amount_bani:6500,currency:'RON',class:'2'}]}
}]},5,'2026-11-12');
assert.equal(flat.length,1,'Bilo v2 flat results must produce one journey');
assert.equal(flat[0].durationMinutes,155);
assert.equal(flat[0].legs[0].from,'București Nord');
assert.equal(flat[0].legs[0].mode,'train');
assert.equal(flat[0].legs[0].departureTime,'2026-11-12T06:30:00.000Z');
assert.deepEqual(flat[0].fareLocal,{amount:65,currency:'RON'});
assert.equal(normalizeBiloTrips({schema_version:2,mode:'rail',results:[{
 origin:'Oradea',destination:'Cluj',departure_time:'23:50',arrival_time:'01:10'
}]},5,'2026-11-12')[0].durationMinutes,80,'Overnight connection');
assert.equal(normalizeBiloTrips({results:[{
 origin:'București',destination:'Brașov',departure_time:'08:30',arrival_time:'11:05'
}]},5,'2026-11-12').length,0,'Missing transport mode cannot be guessed');

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
const unauth=await planRomanianNationalJourney({BILO_API_KEY:'test-only'},{origin:'Oradea',destination:'Cluj'},{date:'2026-11-12',fetchImpl:async()=>({status:401,ok:false})});
assert.equal(unauth.status,'authentication_failed');
assert.equal(unauth.http_status,401);
const forbidden=await planRomanianNationalJourney({BILO_API_KEY:'test-only'},{origin:'Oradea',destination:'Cluj'},{date:'2026-11-12',fetchImpl:async()=>({status:403,ok:false})});
assert.equal(forbidden.status,'access_forbidden');
assert.equal(forbidden.http_status,403);

const diagnosisCases=[
 [{results:[]},'no_results_returned',0],
 [{data:{trips:[]}},'no_results_returned',0],
 [{results:[{origin:'București',destination:'Brașov',unexpected_format:true}]},'results_unparsable',1],
 [{error:{code:'UPSTREAM_ERR',message:'safe to ignore'}},'provider_reported_error',0],
 [{message:'success',count:1},'response_format_unrecognized',0]
];
for(const [response,expected,records] of diagnosisCases){
 const got=inspectBiloSearchResponse(response);
 assert.equal(got.status,expected);
 assert.equal(got.records_returned,records);
 const api=await planRomanianNationalJourney({BILO_API_KEY:'test-only'},{origin:'București',destination:'Brașov'},{date:'2026-11-12',
  fetchImpl:async()=>({ok:true,status:200,json:async()=>response})});
 assert.equal(api.status,expected);
 assert.equal(api.records_returned,records);
 assert.deepEqual(api.journeys,[]);
}


assert.equal((await reverseRomanianOriginCity({GEOAPIFY_API_KEY:'x'},{latitude:51.5,longitude:-0.1},()=>{throw Error('must not geocode UK')})),'');
const backend=readFileSync('backend.js','utf8');
assert.match(backend,/romanianNationalQuery\(message/,'Romanian intent enters unified backend');
assert.match(backend,/romanianDepartureDate\(message,selectedAt\|\|null\)/,'Backend uses text date, not always today');
assert.match(backend,/roTransitQuery \|\| explicitMixedJourney/,'Romanian queries reach transit branch');
assert.match(backend,/transit_provider:'Bilo'/,'Response identifies the provider');
assert.match(backend,/ro_provider_access_forbidden/,'403 has distinct safe diagnostic');
for(const marker of ['ro_provider_no_results','ro_provider_unparsable_results','ro_provider_unknown_format','ro_provider_error_envelope'])
 assert.ok(backend.includes(marker),'Backend exposes diagnostic: '+marker);
assert.ok(backend.includes('records_returned:result.records_returned??null'),'Safe record counts exposed to UI');

assert.ok(backend.includes('http_status:result.http_status||null'),'Provider HTTP status is returned without token');

assert.match(backend,/transit_available:false/,'Unsupported timetable remains unverified');
assert.match(backend,/transit_available:true/,'Verified schedules retain the transit results');
assert.match(backend,/const explicitCarRoute/,'Existing driving route guard remains');
console.log('PASS Romania Bilo keyed national rail/coach intent, ISO dates, schema fail-closed, guard UK/car routes');