import assert from 'node:assert/strict';
import {searchRomanianAirportOnward} from './mixed_romanian_airport_onward.mjs';
const airport={latitude:46.785,longitude:23.686,country_code:'RO',label:'Arrival airport'};
const destination={latitude:47.0612,longitude:21.9473,country_code:'RO',
 label:'Strada Nufărului 1, Oradea'};
const after='2026-11-20T09:45:00.000Z';
const sample=(date,start,end)=>({
 startDateTime:date+'T'+start+':00.000Z',
 arrivalDateTime:date+'T'+end+':00.000Z',durationMinutes:160,provider:'Bilo',
 legs:[{mode:'coach',from:'Cluj-Napoca',to:'Oradea',
 departureTime:date+'T'+start+':00.000Z',
 arrivalTime:date+'T'+end+':00.000Z',operator:'Recorded operator'}]
});
const calls=[];
const planner=async(_env,trip,opts)=>{
 calls.push({trip,opts});
 return {status:'ok',journeys:opts.date==='2026-11-20'?
 [sample('2026-11-20','08:30','11:30'),
  sample('2026-11-20','10:45','13:45')]:[]};
};
const findCity=async(_env,p)=>p===airport?'Cluj-Napoca':'Oradea';
const route=await searchRomanianAirportOnward({BILO_API_KEY:'mock'},{
 airport,destination,after,findCity,planner
});
assert.equal(route.status,'intercity_part_only');
assert.equal(route.journey.legs[0].mode,'coach');
assert.equal(route.journey.startDateTime,'2026-11-20T10:45:00.000Z',
 'Do not return a bus that leaves before the flight has landed');
assert.equal(route.airportTransferVerified,false);
assert.equal(route.lastMileVerified,false);
assert.equal(calls.length,1);
assert.deepEqual(calls[0].trip,{origin:'Cluj-Napoca',destination:'Oradea'});
assert.equal(calls[0].opts.date,'2026-11-20');
const nextDay=await searchRomanianAirportOnward({BILO_API_KEY:'mock'},{
 airport,destination,after,findCity,planner:async(_env,trip,opts)=>{
  return {status:'ok',journeys:opts.date==='2026-11-21'?
   [sample('2026-11-21','08:00','11:00')]:[]};
 }
});
assert.equal(nextDay.status,'intercity_part_only');
assert.equal(nextDay.journey.startDateTime.slice(0,10),'2026-11-21');
assert.equal((await searchRomanianAirportOnward({}, {
 airport,destination,after,findCity,planner})).status,'bilo_not_connected');
assert.equal((await searchRomanianAirportOnward({BILO_API_KEY:'mock'}, {
 airport:{...airport,country_code:'HU'},destination,after,findCity,planner
})).status,'outside_romanian_intercity_scope');
assert.equal((await searchRomanianAirportOnward({BILO_API_KEY:'mock'}, {
 airport,destination,after,findCity:async()=> 'Oradea',planner
})).status,'same_city_urban_transfer_needed');
console.log('PASS Romanian airport-to-city onward Bilo: actual dated bus/train, next day, no invented station or full last mile');
