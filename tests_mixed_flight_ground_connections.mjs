import assert from 'node:assert/strict';
import {connectCandidateFlightToGround,localAirportInstant} from './mixed_flight_ground_connections.mjs';
const now=Date.parse('2026-11-18T00:10:00Z');
const origin={latitude:51.48,longitude:0.30,label:'Mill Lane, Grays'};
const destination={latitude:47.06,longitude:21.95,label:'Strada Nufărului 1, Oradea'};
const flight={legs:[{from:'LTN',to:'DEB',startLocal:'2026-11-20 06:05',
 endLocal:'2026-11-20 09:45',airline:'Example airline',flightNumber:'XY 123'}],
 fareObserved:{amount:88,currency:'GBP'}};
const make=(iata,latitude,longitude)=>({iata,name:iata+' airport',latitude,longitude});
const airportSearch=async (_env,place)=>({
 status:'candidates_only',airports:place===origin?[make('LTN',51.875,-0.368)]:[make('DEB',47.48,21.61)]
});
const zone=async (_env,place)=>place.iata==='LTN'?{
 name:'Europe/London',offsetSeconds:0}:{name:'Europe/Budapest',offsetSeconds:3600};
const access={
 status:'success',journeys:[{provider:'TransCAPI',
 startDateTime:'2026-11-20T02:00:00.000Z',
 arrivalDateTime:'2026-11-20T04:00:00.000Z',durationMinutes:120,
 legs:[{mode:'train',from:'Mill Lane',to:'Luton Airport',
 departureTime:'2026-11-20T02:00:00.000Z',arrivalTime:'2026-11-20T04:00:00.000Z'}]}]};
const egress={
 status:'success',journeys:[{provider:'MOTIS',
 startDateTime:'2026-11-20T09:45:00.000Z',
 arrivalDateTime:'2026-11-20T12:30:00.000Z',durationMinutes:165,
 legs:[{mode:'coach',from:'Debrecen Airport',to:'Oradea, Nufărului 1',
 departureTime:'2026-11-20T09:45:00.000Z',arrivalTime:'2026-11-20T12:30:00.000Z'}]}]};
const args=[{}, {origin,destination,flight,
 requestedAt:'2026-11-20T00:00:00.000Z'}];
const mocks={now,discover:airportSearch,resolveZone:zone,
 planAccess:async ()=>access,planEgress:async()=>egress};
assert.equal(localAirportInstant('2026-11-20 06:05','Europe/London',0),
 '2026-11-20T06:05:00.000Z');
assert.equal(localAirportInstant('2026-11-20 09:45','Europe/Budapest',3600),
 '2026-11-20T08:45:00.000Z');
assert.equal(localAirportInstant('2026-07-01 09:45','Europe/Budapest',3600),null,
 'Reject a stale winter timezone offset in summer');
const full=await connectCandidateFlightToGround(...args,mocks);
assert.equal(full.status,'provisional_air_ground_itinerary');
assert.equal(full.completeDoorToDoor,true);
assert.equal(full.flight.departureTime,'2026-11-20T06:05:00.000Z');
assert.equal(full.flight.arrivalTime,'2026-11-20T08:45:00.000Z');
assert.equal(full.accessJourney.legs[0].mode,'train');
assert.equal(full.egressJourney.legs[0].mode,'coach');
assert.equal(full.fareComplete,false,'Only the flight fare is observed');
assert.equal(full.bookingVerified,false,'A proposal is not a paid/confirmed booking');
const noEgress=await connectCandidateFlightToGround(...args,
 {...mocks,planEgress:async()=>({status:'not_configured',journeys:[]})});
assert.equal(noEgress.completeDoorToDoor,false);
assert.equal(noEgress.accessJourney.legs.length,1);
assert.equal(noEgress.egressStatus,'not_configured');
const tooLate=await connectCandidateFlightToGround(...args,{
 ...mocks,planAccess:async()=>({status:'success',journeys:[{
  ...access.journeys[0],arrivalDateTime:'2026-11-20T05:45:00.000Z'}]})
});
assert.equal(tooLate.accessJourney,null,'Reject ground access that leaves insufficient boarding time');
assert.equal((await connectCandidateFlightToGround({}, {origin,destination,
 flight:{legs:[{from:'LTN',to:'DEB'},{from:'DEB',to:'CLJ'}]}},mocks)).status,
 'invalid_or_unconnected_flight','Do not splice multi-leg flights without transfer evidence');

const flightRomania={legs:[{from:'STN',to:'CLJ',
 startLocal:'2026-11-20 06:15',endLocal:'2026-11-20 10:55',
 airline:'Example direct airline'}]};
const airportRomania=(env,pt)=>({
 airports:pt===origin?[{...make('STN',51.885,0.235),country_code:'GB'}]:
  [{...make('CLJ',46.786,23.684),country_code:'RO'}]
});
let regionalRequested=null;
const regionalResult=await connectCandidateFlightToGround({},{
 origin,destination:{...destination,country_code:'RO'},
 flight:flightRomania,requestedAt:'2026-11-20T02:00:00.000Z'
},{
 now,discover:airportRomania,
 resolveZone:async(_env,airport)=>airport.iata==='STN'?
  {name:'Europe/London',offsetSeconds:0}:
  {name:'Europe/Bucharest',offsetSeconds:7200},
 planAccess:async()=>({status:'success',journeys:[]}),
 planEgress:async()=>({status:'not_configured',journeys:[]}),
 planRegional:async(_env,query)=>{
  regionalRequested=query;
  return {status:'intercity_part_only',fromCity:'Cluj-Napoca',toCity:'Oradea',
   journey:{startDateTime:'2026-11-20T11:00:00Z',
    arrivalDateTime:'2026-11-20T15:00:00Z',durationMinutes:240,
    legs:[{mode:'coach',from:'Cluj-Napoca',to:'Oradea',
     departureTime:'2026-11-20T11:00:00Z',
     arrivalTime:'2026-11-20T15:00:00Z',operator:'Mock operator'}]}}
 }
});
assert.equal(regionalResult.completeDoorToDoor,false,
 'Even a national bus does not fill the missing airport and street transfer legs');
assert.equal(regionalResult.regionalOnwardStatus,'intercity_part_only');
assert.equal(regionalResult.regionalOnwardJourney.legs[0].mode,'coach');
assert.equal(regionalRequested.airport.iata,'CLJ');
assert.equal(regionalRequested.destination.country_code,'RO');
assert.equal(regionalRequested.after,'2026-11-20T09:40:00.000Z',
 'National onward search starts at a safe post-landing buffer');

console.log('PASS source-backed air+ground: timezone/DST, transfer safety, missing legs and no invented total fares');
