import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {prepareMixedFlightOptions} from './mixed_prefetched_details.mjs';

const origin={latitude:51.49,longitude:0.32,label:'Home, England'};
const destination={latitude:47.07,longitude:21.96,label:'Destination, Romania'};
const direct=(from,to,number)=>({legs:[{from,to,flightNumber:number,
 startLocal:'2026-11-20 06:05',endLocal:'2026-11-20 09:45',airline:'Test Air'}]});
const candidates=[direct('LTN','DEB','X1'),direct('LTN','DEB','X2'),
 {legs:[{from:'STN',to:'FRA'},{from:'FRA',to:'CLJ'}]}];
let airportQueries=0,zoneQueries=0,connected=0;
const mockDiscover=async()=>{airportQueries++;return {status:'ok',airports:[]}};
const mockZone=async()=>{zoneQueries++;return {name:'Europe/London',offsetSeconds:0}};
const mockConnect=async(_env,args,deps)=>{
 connected++;
 await Promise.all([
  deps.discover({},origin,{radiusKm:240,limit:40}),
  deps.discover({},destination,{radiusKm:240,limit:40}),
  deps.resolveZone({}, {iata:'LTN'},'2026-11-20T12:00:00Z'),
  deps.resolveZone({}, {iata:'DEB'},'2026-11-20T12:00:00Z')
 ]);
 return {status:'ground_transfer_incomplete',completeDoorToDoor:false,
  accessJourney:{legs:[{mode:'walking',from:'Home',to:'Station',distanceMeters:510,durationMinutes:6}]},
  egressJourney:null,flight:{from:args.flight.legs[0].from,to:args.flight.legs[0].to}};
};
const out=await prepareMixedFlightOptions({},{
 candidates,origin,destination,requestedAt:'2026-11-20T00:00:00Z'
},{now:Date.parse('2026-11-18T00:00:00Z'),connect:mockConnect,
 discover:mockDiscover,resolveZone:mockZone});
assert.equal(out.length,3,'Every visible option is enriched before response');
assert.equal(connected,2,'Only direct flights call the connector');
assert.equal(airportQueries,2,'All flights share airport discovery');
assert.equal(zoneQueries,2,'All flights share timezone discovery');
assert.equal(out[0].itinerary.accessJourney.legs[0].distanceMeters,510);
assert.equal(out[1].itinerary.accessJourney.legs[0].distanceMeters,510);
assert.equal(out[2].itinerary.status,'air_transfer_unverified');
assert.equal(out[2].itinerary.completeDoorToDoor,false);
assert.equal(out[2].itinerary.flight.from,'STN');
const broken=await prepareMixedFlightOptions({},{
 candidates:[direct('STN','CLJ','X3')],origin,destination
},{connect:async()=>{throw Error('provider offline')}});
assert.equal(broken[0].itinerary.status,'ground_provider_unavailable');
assert.equal(broken[0].itinerary.flight.from,'STN');
const backend=readFileSync(new URL('./backend.js',import.meta.url),'utf8');
assert.ok(backend.includes('prepareMixedFlightOptions(env,'));
assert.ok(backend.includes('flight_details_prepared:true'));
const frontend=readFileSync(new URL('./index.js',import.meta.url),'utf8');
const selection=frontend.slice(frontend.indexOf('function appendMixedAirCandidateCards('),
 frontend.indexOf('function renderTransitChoices(',frontend.indexOf('function appendMixedAirCandidateCards(')));
assert.ok(selection.includes('resolveMixedFlightGroundOptions(choice,flight,details)'));
assert.ok(!selection.includes('fetch('));
assert.ok(!selection.includes('Actualizează legăturile terestre'));
console.log('PASS precomputed flight itineraries, independent fallbacks, cached shared airport lookups');
