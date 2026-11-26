// Synthetic reproduction of the physical APK report; no live provider calls.
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {chromium} from 'playwright-core';
import app from './index.js';
let html=await(await app.fetch(new Request('https://test.local/'))).text();
html=html.replace('function extraFunGames(){',String.raw`
const __mapDraws=[];
loadRouteMapLibrary=async()=>({
 map(){return {invalidateSize(){},fitBounds(points){__mapDraws.push({bounds:points})},setView(){},remove(){},on(){},off(){}}},
 tileLayer(){return {addTo(){return this}}},
 marker(){return {addTo(){return this},bindPopup(){return this}}},
 polyline(points,style){__mapDraws.push({points,style});return {addTo(){return this},remove(){}}}
});
loadRouteRotationLibrary=async()=>false;
window.__reportedTransit={
 init(journey){state.language='ro';pocketRevealMainApp();openModule('maps');
 const origin=journey.legs[0].departurePoint;
 getCurrentCoordinates=async()=>origin;
 state.lastTransitChoice={kind:'transit',nationalPublicTransport:true,mixedJourney:false,journeyOrigin:origin};
 state.lastTransitResponse={transit:[journey],transit_destination_point:{...journey.legs.at(-1).arrivalPoint,label:'Synthetic destination'}};
 document.getElementById('moduleQuickLayer').classList.add('open');
 renderTransitChoices([journey]);
 },select(){return selectTransitJourneyWithNavigation(state.lastTransitResponse.transit,0)},
 draws(){return __mapDraws},
 mixed(){closeRouteMap(false);state.lastTransitChoice={kind:'transit',mixedJourney:true};
 renderMixedUnifiedResults({international_journey:true,transit:[],flight_search_status:'search_timeout',flight_search_termination:'search_timeout',flight_search_incomplete:true,
 flight_airport_candidates:{origin:[{iata:'AAA',name:'Synthetic origin airport'}],destination:[{iata:'BBB',name:'Synthetic nearby airport'}]}},
 {transitDestination:{label:'Synthetic destination'}})}
};
function extraFunGames(){`);
const point=i=>({latitude:51.48+i*.002,longitude:.3+i*.002,label:'Synthetic '+i});
const future=m=>new Date(Date.now()+m*60000).toISOString();
const legs=['walking','train','walking','bus','walking'].map((mode,i)=>({mode,from:'Synthetic '+i,to:'Synthetic '+(i+1),
 departurePoint:point(i),arrivalPoint:point(i+1),departureTime:future(120+i*10),arrivalTime:future(130+i*10),
 lineNames:mode==='walking'?[]:['TEST '+i],stopCount:mode==='walking'?null:3}));
const journey={legs,time_zone:'Europe/London',startDateTime:future(120),arrivalDateTime:future(170),durationMinutes:50,
 firstVehicleDepartureTime:future(130),boarding_stop:{...point(1),id:'synthetic',departure_time:future(130)}};
const server=createServer((req,res)=>{res.setHeader('content-type','text/html;charset=utf-8');res.end(html);});
await new Promise(ok=>server.listen(0,'127.0.0.1',ok));
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH,headless:true,args:['--no-sandbox']});
try{
 for(const width of [360,393,430]){
  const page=await browser.newPage({viewport:{width,height:817},isMobile:true,hasTouch:true});const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',r=>r.request().url().startsWith('http://127.0.0.1:')?r.continue():
   r.request().method()==='POST'?r.fulfill({status:503,contentType:'application/json',body:JSON.stringify({status:'error',route_available:false})}):r.abort());
  await page.goto('http://127.0.0.1:'+server.address().port+'/?nativeLaunch=1');
  await page.evaluate(j=>window.__reportedTransit.init(j),journey);
  await page.evaluate(()=>window.__reportedTransit.select());
  const body=page.locator('#moduleLayerBody');
  assert.match(await body.innerText(),/TEST 1/);assert.match(await body.innerText(),/3 opriri până la coborâre/);
  assert.match(await body.locator('.transit-access-status').innerText(),/pietonal/);
  assert.equal(await body.locator('.transit-journey-choice').count(),0,'No bounce back to option list');
  await body.locator('.transit-all-stages-map').click();
  await page.waitForFunction(()=>document.querySelector('.route-map-status')?.textContent.includes('punctate'));
  assert.equal(await page.locator('.transit-all-legs > div').count(),5);
  assert.equal(await page.locator('.transit-walk-stage-status').count(),3);
  assert.ok((await page.locator('.transit-walk-stage-status').allTextContents()).every(s=>s.includes('neverificat')));
  const draws=await page.evaluate(()=>window.__reportedTransit.draws());
  assert.equal(draws.filter(d=>d.style?.color==='#0f91e2'&&d.style.dashArray).length,3,'All three walking segments are mapped as unverified');
  assert.ok(draws.some(d=>d.bounds?.length>=10),'Overview includes every walking and vehicle endpoint');
  assert.deepEqual(errors,[]);
  await page.evaluate(()=>window.__reportedTransit.mixed());
  assert.match(await body.locator('.mixed-flight-search-disclosure').innerText(),/limita de timp/);
  assert.match(await body.locator('.mixed-airport-coverage').innerText(),/AAA.*BBB/s);
  assert.match(await body.locator('.mixed-airport-coverage').innerText(),/nu zboruri sau transferuri confirmate/);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
  assert.deepEqual(errors,[]);await page.close();
 }
 console.log('PASS reported failures mobile 360/393/430: walking failure retains details, all 3 walks mapped/unverified, nearby airport timeout disclosure');
}finally{await browser.close();await new Promise(ok=>server.close(ok));}
