// Regression for the user's phone report: standalone walking works but transit
// boarding aborted at 8s, and a missed vehicle discarded valid walking geometry.
// Actual app/map flow with synthetic HTTP responses, not live route coverage.
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {chromium} from 'playwright-core';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
const {default:app}=await import(process.env.POCKET_BUNDLE?pathToFileURL(resolve(process.env.POCKET_BUNDLE)).href:'./index.js');
let html=await(await app.fetch(new Request('https://test/'))).text();
html=html.replace('function extraFunGames(){',String.raw`
const __draws=[];
loadRouteMapLibrary=async()=>({map(){return {invalidateSize(){},fitBounds(){},setView(){},remove(){},on(){},off(){}}},
 tileLayer(){return {addTo(){return this}}},marker(){return {addTo(){return this},bindPopup(){return this}}},
 polyline(points,style){__draws.push({points,style});return {addTo(){return this},remove(){}}}});
loadRouteRotationLibrary=async()=>false;
window.__walkingParity={
 init(journey){state.language='ro';pocketRevealMainApp();openModule('maps');
 state.lastTransitChoice={kind:'transit',nationalPublicTransport:true,journeyOrigin:journey.legs[0].departurePoint};
 state.lastTransitResponse={transit:[journey],transit_destination_point:journey.legs.at(-1).arrivalPoint};
 return selectTransitJourney([journey],0)},
 selected(){return state.selectedTransitJourney},draws(){return __draws},close(){cancelTransitAccess();closeRouteMap(false)}
};
function extraFunGames(){`);
const point=i=>({latitude:51.48+i*.002,longitude:.3+i*.002,label:'Stop '+i});
const at=n=>new Date(Date.now()+n*60000).toISOString();
const journey=minutes=>({time_zone:'Europe/London',schedule_status:'scheduled',firstVehicleDepartureTime:at(minutes),startDateTime:at(0),arrivalDateTime:at(80),
 boarding_stop:{...point(1),departure_time:at(minutes)},legs:['walking','train','walking'].map((mode,i)=>({mode,from:'Stop '+i,to:'Stop '+(i+1),departurePoint:point(i),arrivalPoint:point(i+1),departureTime:at(i*20),arrivalTime:at((i+1)*20)}))});
const server=createServer((req,res)=>{res.setHeader('content-type','text/html;charset=utf-8');res.end(html)});
await new Promise(ok=>server.listen(0,'127.0.0.1',ok));
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH,headless:true,args:['--no-sandbox']});
try{
 for(const [width,height,delay,minutes] of [[360,640,8500,60],[393,817,35,2],[430,932,35,60]]){
  const page=await browser.newPage({viewport:{width,height},isMobile:true,hasTouch:true}),errors=[],requests=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',async r=>{
   if(r.request().method()!=='POST')return r.request().url().startsWith('http://127.0.0.1:')?r.continue():r.abort();
   const body=r.request().postDataJSON();requests.push(body);
   assert.equal(body.route_profile,'walk');assert.equal(body.history.length,0);
   assert.deepEqual(body.route_context.origin,body.coordinates,'Explicit origin like standalone walking');
   assert.deepEqual(body.route_context.destination,body.route_destination);
   assert.equal(body.national_public_transport,undefined,'Do not reenter the transit provider');
   await new Promise(ok=>setTimeout(ok,requests.length===1?delay:35));
   const start=body.coordinates,end=body.route_destination;
   const base={profile:'walk',coordinates:[[start.longitude,start.latitude],[end.longitude,end.latitude]],origin:start,destination:end,durationSeconds:600,distanceMeters:700,steps:[{text:'Mergi pe strada verificată.',distanceMeters:700}]};
   // Real walking router may prefer a mapped entrance. A distant entrance
   // is not a boarding stop: select the matching base alternative instead.
   const entrance={...base,coordinates:[[start.longitude,start.latitude],[end.longitude+.02,end.latitude]],destination:{...end,longitude:end.longitude+.02}};
   try{await r.fulfill({contentType:'application/json',body:JSON.stringify({status:'success',reply:'Walking route',route_available:true,route:entrance,routes:[entrance,base]})})}catch{}
  });
  await page.goto('http://127.0.0.1:'+server.address().port+'/?nativeLaunch=1');
  await page.evaluate(j=>{window.__selection=window.__walkingParity.init(j)},journey(minutes));
  const layer=page.locator('.transit-full-journey-map');await layer.waitFor();
  assert.ok(await layer.locator('.route-map-canvas').isVisible(),'Map appears before the walking response');
  await page.evaluate(()=>window.__selection);
  await page.waitForFunction(()=>document.querySelectorAll('.transit-full-journey-details .transit-walk-stage-status').length===2&&[...document.querySelectorAll('.transit-full-journey-details .transit-walk-stage-status')].every(el=>el.textContent==='Traseu pietonal verificat.'));
  const selected=await page.evaluate(()=>window.__walkingParity.selected());
  assert.ok(selected.accessRoute,'Retain the verified boarding route even when vehicle cannot be caught');
  assert.equal(selected.accessRoute.destination.label,'Stop 1','Choose matching walking alternative');
  assert.equal(selected.journey.accessWalkVerified,true);
  assert.equal(requests.length,2,'One boarding calculation reused for initial map leg; one final transfer, no retry');
  const navigation=layer.getByRole('button',{name:'Pornește navigarea cu Eva',exact:true});
  if(minutes===2){assert.match(selected.error,/Nu mai este timp/);assert.ok(await navigation.isDisabled(),'Missed departure stays blocked without erasing walking geometry')}
  else{assert.equal(selected.error,'');assert.ok(await navigation.isEnabled(),'8.5-second walking response is accepted')}
  assert.ok((await page.evaluate(()=>window.__walkingParity.draws())).filter(d=>d.style.color==='#0f91e2'&&!d.style.dashArray).length>=2);
  await page.evaluate(()=>window.__walkingParity.close());assert.equal(await layer.count(),0);
  assert.deepEqual(errors,[]);await page.close();
 }
 // Cancellation while a request is pending must not reopen or mutate the map.
 const page=await browser.newPage({viewport:{width:393,height:817}});let calls=0;
 await page.route('**/*',async r=>{
  if(r.request().method()!=='POST')return r.request().url().startsWith('http://127.0.0.1:')?r.continue():r.abort();
  calls++;await new Promise(ok=>setTimeout(ok,250));try{await r.fulfill({status:503,body:'{}'})}catch{}
 });
 await page.goto('http://127.0.0.1:'+server.address().port+'/?nativeLaunch=1');
 await page.evaluate(j=>{window.__selection=window.__walkingParity.init(j)},journey(60));
 await page.waitForFunction(()=>document.querySelector('.transit-full-journey-map'));
 await page.evaluate(()=>window.__walkingParity.close());const callsAtClose=calls;
 await page.evaluate(()=>window.__selection);await page.waitForTimeout(300);
 assert.equal(await page.locator('.transit-full-journey-map').count(),0);assert.equal(calls,callsAtClose,'No detached transfer requests after closing');assert.ok(calls<=2,'Bounded boarding plus transfer request');
 await page.close();
 console.log('PASS walking parity: >8s response, shared request/context, alternate endpoint selection, initial path reuse, missed departure retains geometry, all transfers and cancellation at 3 phone sizes (synthetic HTTP)');
}finally{await browser.close();await new Promise(ok=>server.close(ok))}
