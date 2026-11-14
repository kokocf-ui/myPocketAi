import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import worker from './backend.js';

// Regression: a short Grays pharmacy trip must not start at a far-off bus
// stop, terminate far from the destination, or travel via central London.
const now=Date.now(),at=min=>new Date(now+min*60000).toISOString();
const origin={latitude:51.479,longitude:0.291,accuracy:12,updatedAt:now};
const destination={latitude:51.490,longitude:0.315,label:'Pharmacy, Grays',country_code:'GB'};
const stop=(name,lat,lon)=>({commonName:name,lat,lon,naptanId:'test-'+name.replace(/\s/g,'-')});
const leg=(line,departure,arrival,from,to)=>({
 mode:{name:'bus'},duration:arrival-departure,departureTime:at(departure),arrivalTime:at(arrival),
 departurePoint:from,arrivalPoint:to,routeOptions:[{lineIdentifier:{name:line}}]
});
const trip=(legs,start,end)=>({duration:end-start,startDateTime:at(start),arrivalDateTime:at(end),legs});
const near=stop('South Stifford',51.4793,.2912),pharmacy=stop('Pharmacy Grays',51.490,.315);
const london=stop('Central London',51.510,-.128);
const fixtures=[
 trip([leg('22',6,43,near,pharmacy)],6,43),
 trip([leg('44',15,31,near,pharmacy)],15,31),
 trip([leg('83',10,37,near,pharmacy)],10,37),
 trip([leg('88',30,42,stop('Distant Bus Stop',51.488,.256),pharmacy)],30,42),
 trip([leg('L1',12,43,near,london),leg('L2',45,70,london,pharmacy)],12,70),
 trip([leg('269',20,32,near,stop('Not at pharmacy',51.500,.332))],20,32)
];
const fetchOriginal=globalThis.fetch;
globalThis.fetch=async u=>{
 const url=new URL(typeof u==='string'?u:u.url);
 assert.equal(url.host,'api.tfl.gov.uk','Only the existing provider should be used');
 assert.match(url.pathname,/\/Journey\/JourneyResults\//);
 return Response.json({journeys:fixtures});
};
try{
 const response=await worker.fetch(new Request('https://local-test.invalid/api/chat',{
  method:'POST',headers:{'content-type':'application/json'},
  body:JSON.stringify({message:'Transport public la farmacia din Grays',
    module:'maps',language:'ro',history:[],location:origin,
    transit_destination:destination,transit_query:'Pharmacy, Grays'})
 }),{TFL_APP_KEY:'test-key',AI:{run:async()=>{throw Error('No AI needed')}}});
 assert.equal(response.status,200);
 const data=await response.json();
 assert.equal(data.transit_available,true,JSON.stringify(data).slice(0,700));
 assert.equal(data.transit.length,3,'Keep local routes, drop distant starts, endpoints and London detours');
 assert.deepEqual(data.transit.map(x=>x.legs[0].lineNames[0]),['44','83','22'],
  'Order by actual arrival, not by earliest departure or shortest bus ride');
 assert.equal(data.diagnostics.tflChecks.endpointAccepted,3);
 assert.equal(data.fastest_transit?.arrivalDateTime,at(31),
  'Fastest transit summary must mean earliest actual arrival');
 console.log('PASS short local Grays journeys: no distant boarding, no London detour, no far endpoint, earliest arrival first');
}finally{globalThis.fetch=fetchOriginal}

// Frontend uses the same arrival-first policy for EVERY supported country.
const ui=readFileSync(new URL('./index.js',import.meta.url),'utf8');
const first=ui.indexOf('function transitArrivalMs(j)'),last=ui.indexOf('function feasibleTransitChoices(',first);
assert.ok(first>0&&last>first,'Shared transit UI comparison functions exist');
const src=ui.slice(first,last);
const transitDistance=(a,b)=>6371000*2*Math.asin(Math.min(1,Math.sqrt(
 Math.sin((b.latitude-a.latitude)*Math.PI/360)**2+
 Math.cos(a.latitude*Math.PI/180)*Math.cos(b.latitude*Math.PI/180)*
 Math.sin((b.longitude-a.longitude)*Math.PI/360)**2)));
const validMapRoute=route=>route&&['walk','foot'].includes(route.profile)&&Array.isArray(route.coordinates)&&route.coordinates.length>1;
const f=new Function('state','validMapRoute','transitDistance',src+
 ';return {compareTransitDisplayTimes,transitVerifiedWalkingMinutes};');
const {compareTransitDisplayTimes,transitVerifiedWalkingMinutes}=f({},validMapRoute,transitDistance);
assert.ok(compareTransitDisplayTimes(
 {startDateTime:at(2),arrivalDateTime:at(65)},
 {startDateTime:at(15),arrivalDateTime:at(32)})>0,
 'A bus in 12 minutes of riding but 65 minutes away is not the best arrival');
assert.equal(transitVerifiedWalkingMinutes({
 profile:'walk',durationSeconds:28*60,coordinates:[[origin.longitude,origin.latitude],[destination.longitude,destination.latitude]]
},origin,destination),28);
assert.equal(transitVerifiedWalkingMinutes({
 profile:'walk',durationSeconds:28*60,coordinates:[[origin.longitude,origin.latitude],[0.100,51.55]]
},origin,destination),null,'Do not compare a walking route to the wrong destination');
assert.match(ui,/transit-arrival-eta/,'Arrival from now is shown next to ride duration');
assert.match(ui,/Pe jos, dacă pleci acum:/,'Walking is explicitly measured from now');
assert.match(ui,/este durata itinerariului/,'Transit minutes describe the scheduled itinerary, not a comparison of speed');
assert.match(ui,/Comparând sosirile/,'Text compares arrival time rather than ride minutes');
assert.match(ui,/const now=Date\.now\(\);[\s\S]*?const walkingArrival=now\+minutes\*60000,transitArrival=transitArrivalMs\(best\)/,
 'Walk and transport comparison use the same reference time');
assert.match(ui,/const difference=untilTransit-minutes/,'Arrival gap is consistent with displayed wait from now');
assert.doesNotMatch(ui,/Pe jos ajungi mai devreme: /,'Ambiguous claim removed');

assert.match(ui,/showTransitWalkingComparison\(comparison,options\)/,'Local walking comparison is reused by all public-transport entry screens');
console.log('PASS worldwide transit arrival-first display and strictly verified walking comparison');
