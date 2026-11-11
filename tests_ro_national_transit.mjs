import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {romanianNationalQuery,normalizeBiloTrips,planRomanianNationalJourney,
  romanianJourneySummary,bucharestTravelDate,romanianDepartureDate,reverseRomanianOriginCity,romanianHistoryJourney,inspectBiloSearchResponse} from './ro_national_transit.mjs';

const p=s=>romanianNationalQuery(s,{mixed_journey:false});
assert.deepEqual(p('Cu trenul din Oradea la Cluj-Napoca?'),
 {origin:'Oradea',destination:'Cluj-Napoca',hasOrigin:true,hasDestination:true});
assert.deepEqual(p('Transport public din București până la Brașov'),
 {origin:'București',destination:'Brașov',hasOrigin:true,hasDestination:true});
assert.deepEqual(p('Vreau să ajung de la Cluj-Napoca la Brașov, ce variante am?'),
 {origin:'Cluj-Napoca',destination:'Brașov',hasOrigin:true,hasDestination:true},
 'A natural A-to-B question must route directly to intercity search');
assert.deepEqual(p('Cum ajung din Oradea la Cluj-Napoca?'),
 {origin:'Oradea',destination:'Cluj-Napoca',hasOrigin:true,hasDestination:true},
 'How do I get there is generic intercity journey intent');
const oldPair=[
 {role:'user',content:'Vreau să ajung de la Cluj-Napoca la Brașov, ce variante am?'},
 {role:'assistant',content:'Am identificat Brașov, România. Cum dorești să ajungi?'}
];
assert.equal(romanianHistoryJourney(oldPair,{city:'Brașov'})?.origin,'Cluj-Napoca');
assert.equal(romanianHistoryJourney(oldPair,{city:'Oradea'}),null,
 'Do not silently resurrect a previous origin for an unrelated destination');
assert.equal(romanianHistoryJourney(oldPair,{city:'Brașov'})?.destination,'Brașov');
assert.deepEqual(p('Transport de la Oradea la Cluj'),
 {origin:'Oradea',destination:'Cluj',hasOrigin:true,hasDestination:true},
 'Generic transport requests must open the national train and coach planner');
assert.deepEqual(p('Transport de la Oradea la Cluj-Napoca mâine'),
 {origin:'Oradea',destination:'Cluj-Napoca',hasOrigin:true,hasDestination:true});
assert.deepEqual(p('Deplasare de la Oradea la Cluj'),
 {origin:'Oradea',destination:'Cluj',hasOrigin:true,hasDestination:true});
assert.equal(p('Transport cu mașina de la Oradea la Cluj'),null,
 'Do not hijack explicit driving requests');
assert.equal(p('Transport de marfă de la Oradea la Cluj'),null,
 'Goods traffic is not passenger transit');


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
const replacementBus=normalizeBiloTrips({results:[{
 origin:'Oradea',destination:'Cluj-Napoca',mode:'rail_replacement_bus',
 departure_time:'04:00',arrival_time:'08:25',operator:'Transferoviar Călători'
}]},5,'2026-11-12');
assert.equal(replacementBus.length,1);
assert.equal(replacementBus[0].legs[0].mode,'coach','Do not call a rail replacement bus a train');
assert.equal(replacementBus[0].durationMinutes,265);


const nestedBilo={data:{mode:'rail',results:[{itinerary:{route:{legs:[{
 departure:{station:{name:'București Nord'},time:'2026-11-12T08:30:00+02:00'},
 arrival:{station:{name:'Ploiești Vest'},time:'2026-11-12T09:15:00+02:00'},
 transport:{mode:'rail'},service:{number:'R 3001'},operator:{name:'CFR Călători'}
},{
 departure:{station:{name:'Ploiești Vest'},time:'2026-11-12T09:25:00+02:00'},
 arrival:{station:{name:'Brașov'},time:'2026-11-12T11:05:00+02:00'},
 transport:{mode:'rail'},service:{number:'R 3002'}
}]}}}]}};
const multi=normalizeBiloTrips(nestedBilo,5,'2026-11-12');
assert.equal(multi.length,1,'Nested itinerary should be read');
assert.equal(multi[0].durationMinutes,155,'Elapsed includes connection time');
assert.equal(multi[0].legs.length,2,'Real route has two legs');
assert.equal(multi[0].legs[0].to,'Ploiești Vest');
assert.equal(multi[0].legs[1].to,'Brașov');
assert.equal(multi[0].legs[1].mode,'train');

const implicitRail={mode:'all',results:[{
 origin:{station_name:'București Nord'},destination:{station_name:'Brașov'},
 departure_time:'08:30',arrival_time:'11:05',train_number:'IR 3001'
}]};
assert.equal(normalizeBiloTrips(implicitRail,5,'2026-11-12').length,1,
 'Train number in Bilo record is evidence of rail mode, even when search mode is all');

const missingArrivalStation={mode:'rail',results:[{
 origin:'București Nord',departure_time:'08:30',arrival_time:'11:05',train_number:'IR 100'
}]};
const unparseable=await planRomanianNationalJourney(
 {BILO_API_KEY:'test-only'},{origin:'București',destination:'Brașov'},
 {date:'2026-11-12',fetchImpl:async()=>({ok:true,status:200,json:async()=>missingArrivalStation})}
);
assert.equal(unparseable.status,'results_unparsable');
assert.equal(unparseable.parse_hint,'missing_destination');
assert.equal(unparseable.records_returned,1);
assert.equal(normalizeBiloTrips({results:[{origin:'București',destination:'Brașov',
 departure_time:'08:30',arrival_time:'11:05',mode:'unknown'}]},5,'2026-11-12').length,0,
 'Unknown transport type without provider train/bus evidence must be rejected');
const brokenConnection={results:[{legs:[{
 from:'București',to:'Ploiești',mode:'train',departure_time:'08:30',arrival_time:'09:30'
},{
 from:'Ploiești',to:'Brașov',mode:'train',departure_time:'09:00',arrival_time:'10:45'
}]}]};
assert.equal(normalizeBiloTrips(brokenConnection,5,'2026-11-12').length,0,
 'Overlapping timetable legs must never be shown as a valid connection');

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
assert.deepEqual(Object.keys(body).sort(),['origin','destination','date','mode','limit'].sort());
assert.ok(typeof headers['Idempotency-Key']==='string'&&headers['Idempotency-Key'].length>15,'Search sends a unique idempotency key');

const searchSummary={results:[{tripId:'bilo:rail/11-12|IR-100',title:'Rail service',price:{amount:48,currency:'RON'}},
 {tripId:'trip-second',title:'Other train'}]};
const detailCalls=[];
const detailFetch=async (url,request)=>{
 detailCalls.push({url,request});
 if(url.endsWith('/search'))return {ok:true,status:200,json:async()=>searchSummary};
 if(url.endsWith('/trip-details')){
  assert.equal(request.method,'POST');
  assert.deepEqual(Object.keys(JSON.parse(request.body)),['tripId']);
  assert.equal(request.headers.Authorization,'Bearer test-server-key');
  const id=JSON.parse(request.body).tripId;
  if(id==='trip-second')return {ok:true,status:200,json:async()=>({error:'details unavailable'})};
  return {ok:true,status:200,json:async()=>({data:{tripId:id,legs:[{
   from:'București Nord',to:'Brașov',mode:'train',
   departure_time:'2026-11-12T08:30:00+02:00',
   arrival_time:'2026-11-12T11:05:00+02:00',
   train_number:'IR 100'}]}})};
 }
 throw new Error('Unexpected request '+url);
};
const fullResult=await planRomanianNationalJourney(
 {BILO_API_KEY:'test-server-key'},{origin:'București',destination:'Brașov'},
 {date:'2026-11-12',limit:5,fetchImpl:detailFetch,idempotencyKey:'fixed-test-request-uuid'});
assert.equal(fullResult.status,'ok','Trip summary must be enriched through details');
assert.equal(fullResult.journeys.length,1);
assert.equal(fullResult.journeys[0].durationMinutes,155);
assert.deepEqual(fullResult.journeys[0].fareLocal,{amount:48,currency:'RON'});
assert.deepEqual(detailCalls.map(x=>new URL(x.url).pathname),[
 '/api/v1/search','/api/v1/trip-details','/api/v1/trip-details'
]);
assert.equal(detailCalls[0].request.headers['Idempotency-Key'],'fixed-test-request-uuid');
assert.deepEqual(JSON.parse(detailCalls[0].request.body),{
 origin:'București',destination:'Brașov',date:'2026-11-12',mode:'all',limit:5});
assert.equal(detailCalls[1].request.headers['Idempotency-Key'],undefined,
 'Detail requests do not consume search idempotency keys');
assert.deepEqual(JSON.parse(detailCalls[1].request.body),{tripId:'bilo:rail/11-12|IR-100'},
 'Opaque trip identifiers must not be modified');

// A valid train summary must not prevent a second coach's tripId from being
// enriched. Confirm that both station name AND official locality survive.
const twoModeCalls=[];
const twoMode=await planRomanianNationalJourney(
 {BILO_API_KEY:'test-only'},{origin:'Oradea',destination:'Cluj-Napoca'},
 {date:'2026-11-12',limit:10,fetchImpl:async(url,request)=>{
  twoModeCalls.push(url);
  if(url.endsWith('/search'))return {ok:true,status:200,json:async()=>({mode:'all',results:[
   {origin:'Oradea',destination:'Cluj-Napoca',mode:'train',
    departure_time:'08:00',arrival_time:'10:30'},
   {tripId:'coach-with-stations'}
  ]})};
  assert.deepEqual(JSON.parse(request.body),{tripId:'coach-with-stations'});
  return {ok:true,status:200,json:async()=>({data:{legs:[{
   from:{name:'Autogara Oradea Vest',locality:'Oradea'},
   to:{name:'Autogara Cluj Est',city:'Cluj-Napoca'},
   mode:'coach',departure_time:'2026-11-12T09:00:00+02:00',
   arrival_time:'2026-11-12T11:30:00+02:00'
  }]}})};
 }});
assert.equal(twoMode.status,'ok');
assert.equal(twoMode.journeys.length,2,'Both rail and coach must survive the same search');
assert.deepEqual(twoModeCalls.map(x=>new URL(x).pathname),
 ['/api/v1/search','/api/v1/trip-details']);
assert.equal(twoMode.journeys[0].legs[0].mode,'train');
assert.equal(twoMode.journeys[1].legs[0].mode,'coach');
assert.equal(twoMode.journeys[1].legs[0].from,'Autogara Oradea Vest');
assert.equal(twoMode.journeys[1].legs[0].fromLocality,'Oradea');
assert.equal(twoMode.journeys[1].legs[0].toLocality,'Cluj-Napoca');
const twoModeStation=normalizeBiloTrips({results:[{
 from:{station_name:'Episcopia Bihor',city:'Oradea'},
 to:{station_name:'Cluj-Napoca Est',locality:'Cluj-Napoca'},
 mode:'train',departure_time:'08:00',arrival_time:'11:00'
}]},5,'2026-11-12')[0];
assert.equal(twoModeStation.legs[0].from,'Episcopia Bihor');
assert.equal(twoModeStation.legs[0].fromLocality,'Oradea');

const noIds=await planRomanianNationalJourney(
 {BILO_API_KEY:'test-only'},{origin:'București',destination:'Brașov'},
 {date:'2026-11-12',fetchImpl:async()=>({ok:true,status:200,json:async()=>({results:[{
 origin:'București',destination:'Brașov',unknown:'shape'}]})})}
);
assert.equal(noIds.status,'results_unparsable');
assert.equal(noIds.detail_requests,0,'Do not call details when no tripId provided');
const failedDetails=await planRomanianNationalJourney(
 {BILO_API_KEY:'test-only'},{origin:'București',destination:'Brașov'},
 {date:'2026-11-12',limit:1,fetchImpl:async(url)=>{
   if(url.endsWith('/search'))return {ok:true,status:200,json:async()=>({results:[{tripId:'valid-id'}]})};
   return {status:500,ok:false};
 }}
);
assert.equal(failedDetails.status,'results_unparsable');
assert.equal(failedDetails.parse_hint,'trip_details_not_usable');
assert.equal(failedDetails.detail_requests,1);
assert.deepEqual(failedDetails.journeys,[]);

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
assert.match(backend,/romanianHistoryJourney\(data\.history\|\|\[\]/,
 'Transport-public follow-ups must reuse the latest verified city pair');
assert.match(backend,/romanianDepartureDate\(message,selectedAt\|\|null\)/,'Backend uses text date, not always today');
assert.match(backend,/roTransitQuery \|\| explicitMixedJourney/,'Romanian queries reach transit branch');
assert.match(backend,/transit_provider:'Bilo'/,'Response identifies the provider');
assert.match(backend,/ro_provider_access_forbidden/,'403 has distinct safe diagnostic');
for(const marker of ['ro_provider_no_results','ro_provider_unparsable_results','ro_provider_unknown_format','ro_provider_error_envelope'])
 assert.ok(backend.includes(marker),'Backend exposes diagnostic: '+marker);
assert.ok(backend.includes('records_returned:result.records_returned??null'),'Safe record counts exposed to UI');
assert.ok(backend.includes('parse_hint:result.parse_hint||null'),'Safe Bilo parse failure category exposed to UI');

assert.ok(backend.includes('http_status:result.http_status||null'),'Provider HTTP status is returned without token');

assert.match(backend,/transit_available:false/,'Unsupported timetable remains unverified');
assert.match(backend,/transit_available:true/,'Verified schedules retain the transit results');
assert.match(backend,/const explicitCarRoute/,'Existing driving route guard remains');
console.log('PASS Romania Bilo keyed national rail/coach intent, ISO dates, schema fail-closed, guard UK/car routes');