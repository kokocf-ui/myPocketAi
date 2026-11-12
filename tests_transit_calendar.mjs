import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planTransCAPIJourney} from './uk_national_transit.mjs';

const frontend=readFileSync(new URL('./index.js',import.meta.url),'utf8');
const backend=readFileSync(new URL('./backend.js',import.meta.url),'utf8');
const from={latitude:51.478,longitude:0.283},to={latitude:53.478,longitude:-2.233};
const selector=frontend.slice(frontend.indexOf('function transitSearchSelectors(){'),frontend.indexOf('function showPreciseJourney('));
assert.ok(selector.includes("calendar.type='datetime-local'"),'One-tap Android calendar uses a date/time input');
assert.ok(selector.includes("const quick=[[0,"),'Quick departure choices begin with now');
assert.ok(selector.includes("[15,")&&selector.includes("[30,")&&selector.includes("[60,"),'Nearby departures are available');
assert.ok(!selector.includes('const departure=select('),'No long-press native select for departure time');
assert.ok(selector.includes('departure.onclick=()=>'),'A short tap opens the quick choice panel');
assert.ok(frontend.includes('transit_departure_at:choice.transitDepartureAt||null'),'Calendar reaches the backend');
assert.ok(frontend.includes('transit_departure_at:state.lastTransitChoice?.transitDepartureAt'),'Refresh keeps scheduled day');
assert.ok(frontend.includes('function showTransitRetrySelector(choice)'),'Unverified mixed routes offer an in-app retry');
assert.ok(backend.includes('transit_departure_at:departureAt'),'Backend reports selected date');
// Verify that rail operator codes are readable and do not affect bus line CC.
const labelFunctions=frontend.slice(frontend.indexOf('function transitDateLabel('),frontend.indexOf('function validTransitBoardingStop('));
const helpers=new Function('state',labelFunctions+'\nreturn {transitDateLabel,transitLineLabel,transitBoardingLineLabel};')({language:'ro'});
assert.equal(helpers.transitLineLabel({mode:'national-rail',lineNames:['CC']}),'c2c');
assert.equal(helpers.transitLineLabel({mode:'bus',lineNames:['CC']}),'CC');
assert.equal(helpers.transitBoardingLineLabel({mode:'national-rail',line_names:['CC']},{mode:'national-rail'}),'c2c');
assert.ok(/11.+11.+2026/.test(helpers.transitDateLabel('2026-11-11T13:00:00Z','Europe/London')),'The requested date must be presented in the travel date line');
assert.ok(frontend.includes("dateLine.className='transit-result-date'"),'Cards must display the actual travel date');
assert.ok(frontend.includes("request.className='transit-selected-departure'"),'Show the calendar date the user requested');
assert.ok(backend.includes('startsAt>=earliestRequested-120000'),'Reject TfL routes earlier than calendar selection');
const boardingSource=frontend.slice(frontend.indexOf('function transitBoardingBuffer('),frontend.indexOf('function appendTransitCards('));
const boarding=new Function('dialogText','transitClock','transitDateLabel','formatTravelDurationMinutes',boardingSource+
 '\nreturn {transitBoardingBuffer,transitBoardingAdvice};')(
 (ro,en)=>ro,
 (iso)=>new Date(iso).toISOString().slice(11,16),
 (iso)=>new Date(iso).toISOString().slice(0,10),
 minutes=>minutes+' minute');
const requestedDate=new Date(Date.now()+24*3600000);
requestedDate.setMinutes(0,0,0);
const requestMs=requestedDate.getTime();
const later=minutes=>new Date(requestMs+minutes*60000).toISOString();
const makeJourney=(startMin,boardMin,walkMin)=>({
 startDateTime:later(startMin),arrivalDateTime:later(240),
 firstVehicleDepartureTime:later(boardMin),walkToFirstStopMinutes:walkMin,accessWalkVerified:true,
 safetyMarginMinutes:5,time_zone:'Europe/London',
 boarding_stop:{departure_time:later(boardMin)},
 legs:[{mode:'walking',departureTime:later(startMin)},{mode:'national-rail',departureTime:later(boardMin)}]
});
const safe=makeJourney(8,11,3);
const unverified={...safe,accessWalkVerified:false};
assert.equal(boarding.transitBoardingBuffer(unverified),null,
 'No departure advice before GPS-to-stop walking route is verified');
const tight=boarding.transitBoardingBuffer(safe);
assert.equal(tight.slack,0,'Provider walk reaches the vehicle with zero spare minutes');
assert.equal(tight.recommended,requestMs+3*60000,'Leave by 10:03 for a 10:11 departure and 3 minutes walking');
assert.ok(boarding.transitBoardingAdvice(safe).includes('5 min rezervă'),
 'Show a clear five-minute safety buffer recommendation in the card');
const impossible=makeJourney(2,5,3);
const filterSource=frontend.slice(frontend.indexOf('function feasibleTransitChoices('),frontend.indexOf('const TRANSIT_REFRESH_TEXT='));
const feasible=new Function('state','transitBoardingBuffer','compareTransitDisplayTimes',
 filterSource+'\nreturn feasibleTransitChoices;')(
 {lastTransitChoice:{transitDepartureAt:later(0)}},boarding.transitBoardingBuffer,()=>0);
assert.deepEqual(feasible([safe,impossible]),[safe],
 'Do not offer future itinerary requiring the user to leave before their chosen time');
assert.ok(frontend.includes("bufferNotice.className='transit-boarding-buffer-notice'"),
 'Show the buffer recommendation on the itinerary card');

const tflAdapter=readFileSync(new URL('./tfl_shared_journeys.mjs',import.meta.url),'utf8');
assert.ok(tflAdapter.includes("base.searchParams.set('date'"),'Shared TfL provider gets a local date for scheduled departures');
assert.ok(backend.includes("departureAt:effectiveDepartureAt"),'Backend forwards calendar selection to shared TfL provider');

const oldFetch=globalThis.fetch;
const iso=ms=>new Date(ms).toISOString();
let requestedTimestamp=null;
const fixture=(anchor,extra=0,detour=false)=>{
 const start=anchor+(10+extra)*60000;
 const stop1={name:'Bus Stop',latitude:51.476,longitude:0.280};
 const middle={name:'Transfer',latitude:52.4,longitude:-1.4};
 const end={name:'Manchester',latitude:53.478,longitude:-2.233};
 const leg=(mode,route,at,until,a,b)=>({mode,route:{line:route},from:a,to:b,
  start_time:{scheduled:iso(anchor+at*60000)},end_time:{scheduled:iso(anchor+until*60000)}});
 const rides=detour?[
  leg('BUS','B7',16+extra,55+extra,stop1,middle),
  leg('COACH','C2',60+extra,120+extra,middle,end)
 ]:[leg('COACH','C1',15+extra,115+extra,stop1,end)];
 return {start_time:iso(start),end_time:iso(anchor+(detour?130:125+extra)*60000),legs:[
  {mode:'WALK',from:{name:'Start',latitude:from.latitude,longitude:from.longitude},to:stop1,duration_s:180},
  ...rides,
  {mode:'WALK',from:end,to:{name:'Destination',latitude:to.latitude,longitude:to.longitude},duration_s:detour?600:600}
 ]};
};
globalThis.fetch=async input=>{
 const url=new URL(input);
 requestedTimestamp=url.searchParams.get('datetime');
 const anchor=requestedTimestamp?Date.parse(requestedTimestamp):Date.now();
 return Response.json({itineraries:[fixture(anchor,0,false),fixture(anchor,3,false),fixture(anchor,4,true)]});
};
try{
 const env={TRANSCAPI_API_KEY:'mock-key'};
 const now=await planTransCAPIJourney(env,from,to);
 assert.equal(now.status,'success');
 assert.equal(now.journeys.length,1,'Equivalent routes and slower detours are removed');
 const future=new Date(Date.now()+24*3600000).toISOString();
 const planned=await planTransCAPIJourney(env,from,to,4,{departureAt:future});
 assert.equal(requestedTimestamp,future,'Provider receives exact chosen date/time');
 assert.equal(planned.status,'success');
 assert.equal(planned.journeys.length,1);
 assert.ok(Date.parse(planned.journeys[0].startDateTime)>=Date.parse(future));
 console.log('PASS transport calendar: quick taps, scheduled provider search, duplicate suppression, in-app retry');
}finally{globalThis.fetch=oldFetch;}
