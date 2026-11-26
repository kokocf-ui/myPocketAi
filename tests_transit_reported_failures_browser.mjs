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
 mixed(extra={}){closeRouteMap(false);state.lastTransitChoice={kind:'transit',mixedJourney:true,journeyOrigin:{label:'Synthetic home'},transitDestination:{label:'Synthetic destination'}};
 renderMixedUnifiedResults({international_journey:true,transit:[],flight_search_status:'search_timeout',flight_search_termination:'search_timeout',flight_search_incomplete:true,
 flight_airport_candidates:{origin:[{iata:'AAA',name:'Synthetic origin airport'}],destination:[{iata:'BBB',name:'Synthetic nearby airport'}]},...extra},
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
  let releaseWalk=null,holdWalk=true,walkSuccess=false;
  await page.route('**/*',async r=>r.request().method()==='POST'?
   (holdWalk?await new Promise(resolve=>{releaseWalk=resolve}):null,r.fulfill({status:walkSuccess?200:503,contentType:'application/json',body:JSON.stringify(walkSuccess?{status:'success',route_available:true,route:{profile:'walk',coordinates:[[.3,51.48],[.302,51.482]],destination:{latitude:51.482,longitude:.302},durationSeconds:180,distanceMeters:300}}:{status:'error',route_available:false})})):
   r.request().url().startsWith('http://127.0.0.1:')?r.continue():r.abort());
  await page.goto('http://127.0.0.1:'+server.address().port+'/?nativeLaunch=1');
  await page.evaluate(j=>window.__reportedTransit.init(j),journey);
  await page.evaluate(()=>{window.__walkSelection=window.__reportedTransit.select()});
  const body=page.locator('#moduleLayerBody');
  const map=page.locator('.transit-full-journey-map');await map.waitFor();
  await map.locator('.transit-screen-page').waitFor();
  assert.ok(await map.locator('.route-map-canvas').isVisible(),'Map opens directly while initial access is pending');
  assert.match(await map.locator('.transit-template-store .transit-access-status').textContent(),/Se calculează/);
  await page.waitForFunction(()=>document.querySelector('.transit-template-store .transit-access-status')?.textContent.includes('Se calculează'));
  await page.waitForTimeout(40);assert.ok(releaseWalk);holdWalk=false;releaseWalk();
  await page.evaluate(()=>window.__walkSelection);
  await page.waitForFunction(()=>document.querySelector('.route-map-status')?.textContent.includes('pietonal'));
  assert.match(await map.locator('.transit-template-store .transit-access-status').textContent(),/pietonal/);
  assert.equal(await map.locator('.transit-all-legs > div').count(),5);
  assert.equal(await map.locator('.transit-walk-stage-status').count(),3);
  assert.ok((await map.locator('.transit-walk-stage-status').allTextContents()).every(s=>s.includes('neverificat')));
  const draws=await page.evaluate(()=>window.__reportedTransit.draws());
  assert.equal(draws.filter(d=>d.style?.color==='#0f91e2'&&d.style.dashArray).length,3,'All three walking segments are mapped as unverified');
  assert.ok(draws.some(d=>d.bounds?.length>=10),'Overview includes every walking and vehicle endpoint');
  assert.deepEqual(errors,[]);
  await page.evaluate(()=>window.__reportedTransit.mixed());
  assert.match(await body.locator('.mixed-flight-search-disclosure').innerText(),/limita de timp/);
  assert.match(await body.locator('.mixed-airport-coverage').innerText(),/AAA.*BBB/s);
  assert.match(await body.locator('.mixed-airport-coverage').innerText(),/nu zboruri sau transferuri confirmate/);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
  // Reproduce selecting a flight from a deeply scrolled list. The header
  // must reset to the top and remain visible at the bottom of its details.
  const flight={legs:[{mode:'flight',from:'LTN',to:'DEB',startLocal:'2026-12-04 06:05',endLocal:'2026-12-04 09:45'}],
   itinerary:{accessStatus:'no_connection_before_boarding',egressStatus:'not_configured',accessJourney:null,egressJourney:null}};
  await page.evaluate(f=>window.__reportedTransit.mixed({flight_candidates:[f,f,f]}),flight);
  await body.evaluate(el=>{el.scrollTop=el.scrollHeight});
  await body.locator('.mixed-unverified-candidate').last().click();
  const back=body.locator('.transit-detail-toolbar button');
  assert.equal(await body.evaluate(el=>el.scrollTop),0,'Opening flight resets inherited list scroll');
  assert.match(await body.innerText(),/90 min/,'Explain the selected departure/boarding constraint');
  assert.match(await body.innerText(),/Nu avem acum date/,'Distinguish missing provider from an empty timetable');
  await body.evaluate(el=>{el.scrollTop=el.scrollHeight});
  const pinned=await back.boundingBox(),area=await body.boundingBox();
  assert.ok(pinned.y>=area.y&&pinned.y+pinned.height<=area.y+area.height,'Back remains visible after details scroll');
  await back.click();assert.equal(await body.locator('.mixed-unverified-candidate').count(),3);
  await body.locator('.mixed-unverified-candidate').first().click();
  await page.evaluate(()=>window.pocketAndroidBack());
  assert.equal(await body.locator('.mixed-unverified-candidate').count(),3,'Android Back also restores mixed results');
  // Cancel a pending pedestrian lookup: its late failure must not reopen details.
  await page.evaluate(j=>window.__reportedTransit.init(j),journey);
  releaseWalk=null;holdWalk=true;
  await page.evaluate(()=>{window.__walkSelection=window.__reportedTransit.select()});
  await page.waitForTimeout(40);assert.ok(releaseWalk);
  await page.locator('.transit-full-journey-map .route-map-header button').first().click();
  releaseWalk();await page.evaluate(()=>window.__walkSelection);
  await body.locator('.transit-screen-page .transit-journey-choice').waitFor();
  assert.equal(await body.locator('.transit-screen-page .transit-journey-choice').count(),1,'Late pedestrian reply cannot replace the options after Back');
  // Verified access enriches the same map instead of replacing it with a
  // second detail screen or requiring an additional map click.
  await page.evaluate(j=>window.__reportedTransit.init(j),journey);
  walkSuccess=true;holdWalk=false;
  await page.evaluate(()=>window.__reportedTransit.select());
  assert.equal(await page.locator('.transit-full-journey-map').count(),1,'Success preserves the direct map');
  assert.match(await page.locator('.transit-template-store .transit-access-status').textContent(),/verificat/);
  // A returned walk which cannot reach boarding with its safety margin must
  // never enable navigation, even though details/map stay available.
  const urgent={...journey,firstVehicleDepartureTime:new Date(Date.now()+120000).toISOString()};
  await page.evaluate(j=>window.__reportedTransit.init(j),urgent);
  await page.evaluate(()=>window.__reportedTransit.select());
  assert.match(await page.locator('.transit-template-store .transit-access-status').textContent(),/Nu mai este timp/);
  assert.equal(await page.locator('.transit-fixed-controls .route-map-open').first().isDisabled(),true);
  assert.equal(await page.locator('.transit-full-journey-map').count(),1,'Infeasible boarding must not erase the itinerary');
  assert.deepEqual(errors,[]);await page.close();
 }
 console.log('PASS physical-report regressions 360/393/430: direct map+details during pending walk; success/failure/cancel; all 3 walks; sticky mixed Back and Android Back; boarding/provider diagnostics');
}finally{await browser.close();await new Promise(ok=>server.close(ok));}
