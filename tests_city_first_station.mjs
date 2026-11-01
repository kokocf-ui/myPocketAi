import assert from 'node:assert/strict';
import {webcrypto} from 'node:crypto';
import worker from './backend.js';
globalThis.crypto??=webcrypto;
const saved={info:console.info,warn:console.warn,error:console.error};
console.info=console.warn=console.error=()=>{};
const gps={latitude:51.49,longitude:.28,updatedAt:Date.now()};
let calls=[],stationFound=true;
const station={id:'fixture-liverpool-street-rail',name:'London Liverpool Street Rail Station',
  lat:51.5183,lon:-.0818,motType:'NaptanRailStation',network:'national-rail'};
const time=minutes=>new Date(Date.now()+minutes*60000).toISOString();
globalThis.fetch=async input=>{
 const u=new URL(input);calls.push(u);
 if(u.pathname.startsWith('/StopPoint/Search/')){
  assert.match(decodeURIComponent(u.pathname),/Liverpool Street/i);
  return Response.json({matches:stationFound?[station]:[]});
 }
 if(u.pathname.includes('/JourneyResults/')){
  assert.ok(stationFound,'unresolved station must not be sent to Journey Planner');
  assert.match(decodeURIComponent(u.pathname),/to\/fixture-liverpool-street-rail/);
  return Response.json({journeys:[{
    duration:30,startDateTime:time(45),arrivalDateTime:time(75),
    legs:[{
      mode:{name:'national-rail'},duration:30,
      departureTime:time(45),arrivalTime:time(75),
      departurePoint:{lat:51.49,lon:.28,commonName:'Public test origin'},
      arrivalPoint:{lat:station.lat,lon:station.lon,commonName:station.name},
      routeOptions:[{lineIdentifier:{name:'Fixture train'}}]
    }]
  }]});
 }
 if(u.pathname==='/v1/geocode/search')return Response.json({features:[]});
 if(u.pathname==='/v2/places')return Response.json({features:[]});
 throw Error('Unexpected external request: '+u.pathname);
};
const env={GEOAPIFY_API_KEY:'fixture',TFL_APP_KEY:'fixture',
  AI:{run:async()=>({response:'Unverified AI reply'})}};
async function ask(message,extra={}){
 const req=new Request('https://fixture/api/chat',{method:'POST',
   body:JSON.stringify({message,language:'ro',module:'assistant',
     location:gps,history:[],...extra})});
 return(await worker.fetch(req,env)).json();
}
try{
 // Reproduce the TfL SearchMatch schema: NAME rather than commonName.
 assert.equal(station.commonName,undefined);
 const first=await ask('Vreau sa ajung in London Liverpool Street');
 assert.equal(first.needs_travel_mode,true);
 assert.equal(first.route_context?.destination_query,'London Liverpool Street');
 assert.equal(first.route_context?.pending,'profile');
 assert.ok(first.reply.includes('transportul public'));
 calls=[];
 const journey=await ask('Transport public',{route_context:first.route_context,travel_mode:'transit'});
 assert.equal(journey.needs_destination_clarification,undefined,
   'city already supplied; do not request it again');
 assert.equal(journey.transit_available,true,
   'verified TfL station must reach Journey Planner');
 assert.ok(journey.transit.length>=1);
 assert.ok(calls.some(u=>decodeURIComponent(u.pathname)==='/StopPoint/Search/Liverpool Street'),
   'must query TfL operator station records by name without Station suffix');
 assert.ok(calls.some(u=>u.pathname.includes('/to/fixture-liverpool-street-rail')));
 assert.ok(!calls.some(u=>u.pathname==='/v1/geocode/search'),
   'do not geocode the station again after official verification');
 console.info=saved.info;console.warn=saved.warn;console.error=saved.error;
 console.log('PASS: London Liverpool Street -> Transport public -> exact TfL station -> journey.');
 // Failure should not be converted into invented route to a different station.
 stationFound=false;calls=[];
 const second=await ask('Vreau sa ajung in London Liverpool Street');
 const missing=await ask('Transport public',{route_context:second.route_context,travel_mode:'transit'});
 assert.equal(missing.transit_available,false);
 assert.equal(missing.needs_destination_clarification,true);
 assert.ok(!calls.some(u=>u.pathname.includes('/JourneyResults/')));
 console.log('PASS: missing station and geocode match -> no invented journey.');
}finally{console.info=saved.info;console.warn=saved.warn;console.error=saved.error}
