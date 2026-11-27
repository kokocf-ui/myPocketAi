import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {chromium} from 'playwright-core';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
const {default:app}=await import(process.env.POCKET_BUNDLE?pathToFileURL(resolve(process.env.POCKET_BUNDLE)).href:'./index.js');
let html=await(await app.fetch(new Request('https://test.local/'))).text();
html=html.replace('function extraFunGames(){',String.raw`
let __releaseMap;const __nativeCommands=[];
loadRouteMapLibrary=()=>new Promise(resolve=>{__releaseMap=()=>resolve({
 map(host){host.dataset.mapReady='true';host.style.background='#20465b';return {invalidateSize(){},fitBounds(){},setView(){},remove(){},on(){},off(){}}},
 tileLayer(){return {addTo(){return this}}},marker(){return {addTo(){return this},bindPopup(){return this}}},
 polyline(){return {addTo(){return this},remove(){}}}
})});
loadRouteRotationLibrary=async()=>false;
window.PocketAndroidRouteGuidance={postMessage:message=>__nativeCommands.push(message)};
window.__viewport={
 init(options){state.language='ro';pocketRevealMainApp();openModule('maps');
 state.lastTransitChoice={kind:'transit',nationalPublicTransport:true,transitDirect:true,journeyOrigin:options[0].legs[0].departurePoint};
 state.lastTransitResponse={transit:options,transit_destination_point:{...options[0].legs.at(-1).arrivalPoint,label:'Destinația confirmată '+('adresă lungă '.repeat(12))}};
 document.getElementById('moduleQuickLayer').classList.add('open');document.getElementById('moduleQuickLayer').setAttribute('aria-hidden','false');renderTransitChoices(options)},
 release(){__releaseMap()},commands(){return __nativeCommands}
};
function extraFunGames(){`);
const at=n=>new Date(Date.now()+n*60000).toISOString();
const point=i=>({latitude:51.48+i*.002,longitude:.3+i*.002});
const legs=Array.from({length:13},(_,i)=>({mode:i%3===0?'walking':'train',
 from:'Stația plecare '+i+' '+('nume lung '.repeat(10)),to:'Stația sosire '+i+' '+('adresă completă '.repeat(9)),
 departurePoint:point(i),arrivalPoint:point(i+1),departureTime:at(60+i*10),arrivalTime:at(70+i*10),
 lineNames:['LINIA-'+i],stopCount:i%3?i+1:null,operator:'Fixture Rail',bookingUrl:'https://www.eurostar.com/'}));
const journey={legs,time_zone:'Europe/London',startDateTime:at(60),arrivalDateTime:at(190),durationMinutes:130,
 schedule_status:'estimated',attribution:{text:'Sursa oficială '+('informație completă '.repeat(12))}};
const options=Array.from({length:6},(_,i)=>({...journey,startDateTime:at(60+i*10)}));
const server=createServer((req,res)=>{res.setHeader('content-type','text/html;charset=utf-8');res.end(html)});
await new Promise(ok=>server.listen(0,'127.0.0.1',ok));
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH,headless:true,args:['--no-sandbox']});
try{
 for(const [width,height] of [[360,640],[360,794],[393,817],[430,932]]){
  const page=await browser.newPage({viewport:{width,height},isMobile:true,hasTouch:true});const errors=[];
  page.on('pageerror',e=>errors.push(e.message));let walkingRequests=0,walkingSuccess=false;
  await page.route('**/*',route=>{
   if(route.request().method()==='POST'){walkingRequests++;return route.fulfill({status:walkingSuccess?200:503,contentType:'application/json',body:JSON.stringify(walkingSuccess?{status:'success',route_available:true,route:{profile:'walk',coordinates:[[.3,51.48],[.302,51.482]],destination:{latitude:51.482,longitude:.302},durationSeconds:180,distanceMeters:300}}:{})})}
   return route.request().url().startsWith('http://127.0.0.1:')?route.continue():route.abort();
  });
  await page.goto('http://127.0.0.1:'+server.address().port+'/?nativeLaunch=1');
  await page.evaluate(o=>window.__viewport.init(o),options);
  const body=page.locator('#moduleLayerBody');
  await body.locator('.transit-screen-page .transit-journey-choice').first().waitFor();
  assert.ok(await body.locator('.transit-screen-pager').isVisible());
  assert.ok(await body.evaluate(el=>el.scrollHeight<=el.clientHeight+1),'Options must fit without vertical scrolling');
  await body.locator('.transit-screen-page .transit-journey-choice').first().tap();
  const layer=page.locator('.transit-full-journey-map');await layer.waitFor();
  await layer.locator('.transit-full-journey-details').waitFor();
  assert.equal(walkingRequests,0,'The map/details shell must open BEFORE map-library/walking lookups');
  assert.equal(await layer.locator('.route-map-canvas').isVisible(),true);
  assert.equal(await layer.locator('.transit-fixed-controls').isVisible(),true);
  assert.equal(await page.evaluate(()=>window.__viewport.commands().length),0,'Selection must not start native navigation');
  const bounds=async()=>{
   const result=await layer.evaluate(el=>({height:innerHeight,rect:el.getBoundingClientRect().toJSON(),
    boxes:[el].map(n=>({cls:n.className,h:n.clientHeight,s:n.scrollHeight,w:n.clientWidth,sw:n.scrollWidth})),
    tools:[...el.querySelectorAll('.transit-screen-pager button,.transit-fixed-controls button')].filter(n=>!n.hidden&&getComputedStyle(n).display!=='none').map(n=>n.getBoundingClientRect().toJSON())}));
   assert.ok(result.rect.y>=0&&result.rect.bottom<=result.height+1,JSON.stringify(result));
   for(const box of result.boxes){assert.ok(box.s<=box.h+1,'Vertical overflow '+JSON.stringify(box));assert.ok(box.sw<=box.w+1,'Horizontal overflow '+JSON.stringify(box))}
   for(const box of result.tools)assert.ok(box.y>=result.rect.y&&box.bottom<=result.rect.bottom+1,'Fixed controls are reachable without scrolling');
  };
  await bounds();
  if(width===360&&height===640&&process.env.TRANSIT_SCREENSHOT)await page.screenshot({path:process.env.TRANSIT_SCREENSHOT});
  assert.equal(await layer.locator('.transit-screen-pager').count(),0,'No itinerary stage pages');
  const details=layer.locator('.transit-full-journey-details');
  const fullText=await details.innerText();
  assert.match(fullText,/Destinația confirmată/);assert.match(fullText,/Sursa oficială/);
  assert.equal(await details.locator('.transit-all-legs > div').count(),13,'All stages in one list');
  for(let i=0;i<13;i++){
   const row=details.locator('.transit-all-legs > div').nth(i);
   assert.ok((await row.innerText()).includes(legs[i].from.trim()));
   assert.ok((await row.innerText()).includes(legs[i].to.trim()));
   if(i%3)assert.match(await row.innerText(),/Bilete și rezervare/);
  }
  const previewMap=await layer.locator('.route-map-canvas').boundingBox();
  assert.ok(previewMap.height<=height*.29,'Compact preview map');
  await details.evaluate(el=>{el.scrollTop=el.scrollHeight});
  assert.ok(await details.evaluate(el=>el.scrollTop>0),'Only the directions list scrolls');
  await page.evaluate(()=>window.__viewport.release());
  await page.waitForFunction(()=>document.querySelector('.route-map-canvas')?.dataset.mapReady==='true');
  await bounds();
  await layer.getByRole('button',{name:'Traseu',exact:true}).tap();await bounds();
  await page.evaluate(()=>window.pocketAndroidBack());
  assert.equal(await layer.count(),0,'Native Back returns directly to options');
  await body.locator('.transit-screen-page .transit-journey-choice').first().waitFor();
  assert.ok(await body.evaluate(el=>el.scrollHeight<=el.clientHeight+1));
  // Real opt-in controls keep the same viewport contract; no selection starts
  // native navigation, and Stop remains reachable beside the map.
  walkingSuccess=true;
  const verified={...journey,schedule_status:'scheduled',boarding_stop:{...point(1),label:'Stația confirmată',departure_time:at(70)},firstVehicleDepartureTime:at(70)};
  await page.evaluate(o=>window.__viewport.init(o),[verified]);
  await body.locator('.transit-screen-page .transit-journey-choice').first().tap();
  await page.evaluate(()=>window.__viewport.release());
  await page.waitForFunction(()=>document.querySelector('.route-map-canvas')?.dataset.mapReady==='true');
  const start=layer.getByRole('button',{name:'Pornește navigarea cu Eva',exact:true});await start.waitFor();
  await page.waitForFunction(()=>!document.querySelector('.transit-fixed-controls .route-map-open')?.disabled);
  await page.waitForFunction(()=>document.querySelector('.transit-full-journey-details .transit-walk-stage-status')?.textContent.includes('verificat.')&&!document.querySelector('.transit-full-journey-details .transit-walk-stage-status')?.textContent.includes('neverificat'));
  await start.tap();await page.waitForTimeout(60);
  assert.equal(await page.evaluate(()=>JSON.parse(window.__viewport.commands()[0]).action),'start');
  await bounds();
  await layer.getByRole('button',{name:'Oprește',exact:true}).tap();await page.waitForTimeout(60);await bounds();
  assert.ok((await page.evaluate(()=>window.__viewport.commands())).some(s=>JSON.parse(s).action==='stop'));
  // Reflow after rotation/viewport shrink, not a hidden scrollable fallback.
  await page.setViewportSize({width:640,height:360});await page.waitForTimeout(80);await bounds();
  await page.evaluate(()=>window.pocketAndroidBack());
  await page.setViewportSize({width,height});
  const romanian={...verified,source:'Bilo: operator schedule',fareLocal:{amount:48.5,currency:'RON'},
   legs:[{...legs[1],from:'Episcopia Bihor',fromLocality:'Oradea',to:'Cluj-Napoca Est',toLocality:'Cluj-Napoca',operator:'CFR Călători'}]};
  const coach={...romanian,legs:[{...romanian.legs[0],mode:'coach',operator:'Operator autocar'}]};
  await page.evaluate(o=>window.__viewport.init(o),[romanian,coach]);
  const road=body.getByRole('tab',{name:/Autobuze/});await road.waitFor();await road.tap();
  await page.waitForFunction(()=>document.querySelector('#moduleLayerBody .transit-screen-page')?.textContent.includes('Operator autocar'));
  assert.ok(await body.evaluate(el=>el.scrollHeight<=el.clientHeight+1),'Romanian categories fit the phone');
  await body.locator('.transit-screen-page .transit-journey-choice').first().tap();await layer.waitFor();
  await layer.locator('.transit-full-journey-details').waitFor();await bounds();
  const railText=await layer.locator('.transit-full-journey-details').innerText();
  assert.match(railText,/48,5 RON/);assert.match(railText,/verificat la operator/);
  assert.match(railText,/Episcopia Bihor \(Oradea\)/);assert.match(railText,/Operator autocar/);
  await page.evaluate(()=>window.pocketAndroidBack());
  await page.waitForFunction(()=>document.querySelector('#moduleLayerBody .transit-screen-page')?.textContent.includes('Operator autocar'));
  assert.equal(await road.getAttribute('aria-selected'),'true','Romanian category survives map Back');
  await body.getByRole('tab',{name:/Trenuri/}).tap();
  await page.waitForFunction(()=>document.querySelector('#moduleLayerBody .transit-screen-page')?.textContent.includes('CFR Călători'));
  assert.deepEqual(errors,[]);await page.close();
 }
 console.log('PASS direct public option -> compact map+continuous itinerary (no stage pages); no whole-screen overflow, full long text/13 stages/tickets, fixed controls, opt-in Start/Stop, landscape reflow, Romanian categories/fares/localities/operators and native Back at 360x640/794,393x817,430x932; mocked map/provider');
}finally{await browser.close();await new Promise(ok=>server.close(ok))}
