import assert from 'node:assert/strict';
import {searchMixedIndicativeOptions} from './mixed_indicative_search.mjs';
import {transportTicketLink,transportTicketUrl} from './transport_ticket_links.mjs';
import {resolveMixedOriginLocality} from './mixed_ground_operator_discovery.mjs';
import {compactJourney} from './mixed_flight_ground_connections.mjs';
import worker from './backend.js';
const origin={latitude:53.48,longitude:-2.24,city:'Manchester',label:'GPS',country_code:'GB'};
const destination={latitude:54.04,longitude:-2.80,city:'Lancaster',label:'Lancaster',country_code:'GB'};
let airCalls=0,groundCalls=0;
const operator={mode:'coach',from:'Manchester',to:'Lancaster',operator:'FlixBus',url:'https://www.flixbus.co.uk/bus-routes/manchester-lancaster',timetable_verified:false,door_to_door_complete:false};
const flight={legs:[{mode:'flight',from:'AAA',to:'BBB',airline:'Ryanair'}],bookingVerified:false};
const data=await searchMixedIndicativeOptions({}, {origin,destination:{...destination,latitude:56},international:false},{
 discoverAir:async()=>{airCalls++;return {status:'candidate_results_only',candidates:[flight]};},
 discoverGround:async()=>{groundCalls++;return {status:'official_operator_options',operators:[operator]};},
 prepare:async()=>{throw Error('No complete airport transfer')}
});
assert.equal(airCalls,1,'Domestic long-distance mixed transport also searches flights');
assert.equal(groundCalls,1);assert.equal(data.seat_confirmation_required,false);
assert.deepEqual(data.flight_candidates,[flight],'A failed transfer must not hide a flight option');
assert.deepEqual(data.operator_options,[operator],'Missing schedules/seats do not hide official route evidence');
const offline=await searchMixedIndicativeOptions({}, {origin,destination,international:true},{
 discoverAir:async()=>{throw Error('offline')},discoverGround:async()=>({operators:[operator]}),prepare:async()=>[]
});
assert.equal(offline.flight_search_status,'provider_unavailable');assert.equal(offline.operator_options.length,1);
for(const bad of ['javascript:alert(1)','https://user:password@site.com/','http://site.com','https://127.0.0.1/','https://app.internal/'])assert.equal(transportTicketUrl(bad),null);
assert.equal(transportTicketLink({mode:'train',bookingUrl:'https://tickets.operator.com/find'}).kind,'provider_link');
assert.equal(transportTicketLink({mode:'coach',operator:'FlixBus'}).kind,'operator_site');
assert.equal(transportTicketLink({mode:'flight',airline:'Ryanair'}).url,'https://www.ryanair.com/');
assert.equal(transportTicketLink({mode:'train',operator:'Unknown railway'}).kind,'external_search');
assert.equal(transportTicketLink({mode:'walking'}),null);
assert.equal(compactJourney({legs:[{mode:'train',bookingUrl:'https://tickets.operator.com/find'}]}).legs[0].bookingUrl,'https://tickets.operator.com/find');
const gpsCity=await resolveMixedOriginLocality({GEOAPIFY_API_KEY:'mock'}, {latitude:origin.latitude,longitude:origin.longitude,label:'GPS'}, {fetcher:async()=>Response.json({results:[{city:'Manchester',country_code:'gb'}]})});
assert.equal(gpsCity.city,'Manchester');assert.equal(gpsCity.country_code,'GB');
const original=globalThis.fetch,at=m=>new Date(Date.now()+m*60000).toISOString();let searches=0;
globalThis.fetch=async input=>{
 const u=new URL(typeof input==='string'?input:input.url||String(input));
 if(u.hostname==='api.exa.ai'){searches++;return Response.json({results:[{url:operator.url,title:'Manchester to Lancaster Coach Travel | Bus tickets'}]});}
 if(u.hostname==='api.transcapi.com')return Response.json({timezone:'Europe/London',itineraries:[{
  start_time:at(30),end_time:at(105),legs:[{mode:'RAIL',from:{name:'Manchester',...origin},to:{name:'Lancaster',...destination},route:{line:'R1',operator:'Example Rail'},start_time:{scheduled:at(30)},end_time:{scheduled:at(105)}}]
 }]});
 throw Error('Unexpected provider '+u.hostname);
};
try{
 const response=await worker.fetch(new Request('https://test.example/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:'Transport mixt spre Lancaster',module:'maps',language:'ro',location:origin,journey_origin:origin,transit_destination:destination,transit_query:'Lancaster',mixed_journey:true,history:[]})}),{TRANSCAPI_API_KEY:'test',EXA_API_KEY:'test',AI:{run:async()=>{throw Error('No AI')}}});
 const result=await response.json();assert.equal(response.status,200);assert.equal(result.transit_available,true,JSON.stringify(result).slice(0,500));
 assert.equal(result.transit.length,1);assert.equal(result.operator_options?.length,1,'Successful rail result must retain independent coach evidence');
 assert.equal(result.seat_confirmation_required,false);assert.ok(searches>0);
 assert.equal(result.transit[0].availability_disclosure.seat_status,'unverified','Seat uncertainty is disclosure, not rejection');
}finally{globalThis.fetch=original}
console.log('PASS indicative mixed planning: domestic sources, independent failures, GPS city, no stock gate, preserved coach+rail, per-leg safe ticket links');
