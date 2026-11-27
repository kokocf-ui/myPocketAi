// Real UI and real Leaflet/rotation renderer, local synthetic tiles + controlled GPS/native.
// Not a physical background GPS test.
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {chromium} from 'playwright-core';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
import {readFileSync} from 'node:fs';
const {default:app}=await import(process.env.POCKET_BUNDLE?pathToFileURL(resolve(process.env.POCKET_BUNDLE)).href:'./index.js');
let html=await(await app.fetch(new Request('https://test/'))).text();
html=html.replace('</head>','<link rel="stylesheet" href="/__leaflet.css"><script src="/__leaflet.js"></script><script src="/__rotate.js"></script></head>');
html=html.replace('function extraFunGames(){',String.raw`
let __fix,__error;const __commands=[];
Object.defineProperty(navigator,'geolocation',{value:{watchPosition(ok,err){__fix=ok;__error=err;return 1},clearWatch(){__fix=null}}});
let __actualMap;
loadRouteMapLibrary=async()=>({...window.L,map:(...args)=>{__actualMap=window.L.map(...args);return __actualMap}});
loadRouteRotationLibrary=async()=>true;
window.PocketAndroidRouteGuidance={postMessage:message=>__commands.push(JSON.parse(message))};
window.__nav={async open(route){state.language='ro';pocketRevealMainApp();openModule('maps');state.lastRoute=route;state.lastRouteOptions=[route];await openRouteMap(route,null,[route])},
 fix(lon,accuracy=6,lat=51.48,age=0){__fix?.({timestamp:Date.now()-age,coords:{latitude:lat,longitude:lon,accuracy,heading:90,speed:1}})},
 size(){const el=__actualMap.getContainer(),size=__actualMap.getSize();return {width:el.clientWidth,height:el.clientHeight,cachedWidth:size.x,cachedHeight:size.y,tiles:el.querySelectorAll('.leaflet-tile-loaded').length}},
 fail(){__error?.({code:2})},commands(){return __commands},close(){closeRouteMap(false)},
 async transit(journey,route){state.lastTransitChoice={kind:'transit',nationalPublicTransport:true};state.lastTransitResponse={transit_destination_point:journey.legs.at(-1).arrivalPoint};
 const selected={journey,options:[journey],loading:false,error:'',timeUnverified:false,accessRoute:route};state.selectedTransitJourney=selected;await openTransitJourneyMap(selected)}
};
function extraFunGames(){`);
const route={profile:'walk',coordinates:[[.3,51.48],[.31,51.48]],distanceMeters:700,durationSeconds:600,destination:{latitude:51.48,longitude:.31,label:'Test destination'},steps:[{text:'Mergi înainte.',distanceMeters:100},{text:'Virează la dreapta.',distanceMeters:200},{text:'Virează la stânga.',distanceMeters:400},{text:'Ai ajuns.',distanceMeters:0}]};
const assets={
 '/__leaflet.js':['application/javascript',readFileSync('node_modules/leaflet/dist/leaflet.js')],
 '/__leaflet.css':['text/css',readFileSync('node_modules/leaflet/dist/leaflet.css')],
 '/__rotate.js':['application/javascript',readFileSync('node_modules/@tomickigrzegorz/leaflet-rotate/dist/leaflet-rotate.umd.min.js')]
};
const server=createServer((req,res)=>{const asset=assets[req.url];res.setHeader('content-type',asset?.[0]||'text/html;charset=utf-8');res.end(asset?.[1]||html)});await new Promise(ok=>server.listen(0,'127.0.0.1',ok));
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH,headless:true,args:['--no-sandbox']});
try{
 for(const [width,height] of [[360,640],[393,817],[430,932],[640,360]]){
  const page=await browser.newPage({viewport:{width,height},isMobile:true,hasTouch:true}),errors=[];let searches=0;
  page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',r=>{if(r.request().url().includes('tile.openstreetmap.org'))return r.fulfill({contentType:'image/svg+xml',body:'<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256"><rect width="256" height="256" fill="#aacdde"/></svg>'});if(r.request().method()==='POST'){searches++;return r.fulfill({status:503,body:'{}'})}return r.request().url().startsWith('http://127.0.0.1:')?r.continue():r.abort()});
  await page.goto('http://127.0.0.1:'+server.address().port+'/?nativeLaunch=1');
  const navigationGeometry=async()=>{
   const viewportHeight=page.viewportSize().height;
   await page.waitForTimeout(100);
   const layer=page.locator('.route-unified-preview');
   const map=await layer.locator('.route-map-canvas').boundingBox();
   const cue=await layer.locator('.route-next-maneuver').boundingBox();
   const head=await layer.locator('.route-map-header').boundingBox();
   const buttons=await layer.locator('.transit-fixed-controls button,.route-map-open').evaluateAll(nodes=>nodes.filter(n=>getComputedStyle(n).display!=='none'&&!n.hidden&&n.getBoundingClientRect().height>0).map(n=>n.getBoundingClientRect().toJSON()));
   const headerBottom=Math.max(head.y+head.height,...buttons.map(b=>b.bottom));
   assert.ok(map.y>=headerBottom-1,'All command buttons stay above, not over the map');
   assert.ok(Math.abs(map.y-headerBottom)<=12,'Map begins directly below commands');
   assert.ok(Math.abs(map.y+map.height-cue.y)<=2,'Map reaches the maneuver panel without empty space');
   assert.ok(cue.height<=80&&cue.y+cue.height<=viewportHeight+1,'Two distinct maneuver rows fit the screen');
   assert.ok(map.height>=viewportHeight-map.y-cue.height-2,'First start uses all remaining map space '+JSON.stringify({map,cue,head,buttons,height,headerBottom}));
   const size=await page.evaluate(()=>window.__nav.size());
   assert.equal(size.cachedWidth,size.width,'Real Leaflet width matches its container');
   assert.equal(size.cachedHeight,size.height,'Real Leaflet height is refreshed on first start');
   await page.waitForFunction(()=>window.__nav.size().tiles>0);
   return map;
  };
  for(const profile of ['walk','drive']){
   await page.evaluate(r=>window.__nav.open(r),{...route,profile});
   const layer=page.locator('.route-unified-preview');const list=layer.locator('.route-directions');
   assert.ok((await list.boundingBox()).height>=45,'Preview leaves readable space for directions');assert.equal(await list.locator('li').count(),4);assert.equal(await list.locator('[aria-current]').count(),0,'Preview list is static');
   const preview=await layer.locator('.route-map-canvas').boundingBox();assert.ok(preview.height<=height*.29,'Compact preview map');
   await layer.locator('.route-eva-tracking').click();
   assert.ok(await list.isHidden(),'Full list gives way to two-line maneuver only during navigation');
   await navigationGeometry();
   if(width===360&&profile==='walk'){await page.setViewportSize({width:640,height:360});await navigationGeometry();await page.setViewportSize({width,height});await navigationGeometry()}
   const cue=layer.locator('.route-next-maneuver');
   await page.evaluate(()=>window.__nav.fix(.3));assert.match(await cue.locator('.route-next-maneuver-text').innerText(),/100 m.*dreapta/);
   assert.match(await cue.locator('.route-following-maneuver').innerText(),/Apoi:.*stânga/);
   assert.notEqual(await cue.locator('.route-next-maneuver-text').evaluate(n=>getComputedStyle(n).backgroundColor),await cue.locator('.route-following-maneuver').evaluate(n=>getComputedStyle(n).backgroundColor),'First maneuver is highlighted');
   await page.evaluate(()=>window.__nav.fix(.303));assert.match(await cue.locator('.route-next-maneuver-text').innerText(),/90 m.*stânga/);
   assert.match(await cue.locator('.route-following-maneuver').innerText(),/Apoi:.*Ai ajuns/);
   assert.equal(await list.locator('[aria-current="step"]').textContent(),'Virează la stânga. · 400 m');
   await page.evaluate(()=>window.__nav.fix(.303,50));assert.match(await cue.innerText(),/GPS/,'Poor accuracy clears the previous turn');
   await page.evaluate(()=>window.__nav.fix(.303,6,51.49));assert.match(await cue.innerText(),/afara traseului/);
   await page.evaluate(()=>window.__nav.fix(.303,6,51.48,40000));assert.match(await cue.innerText(),/GPS/,'Stale fixes do not advance instructions');
   await page.evaluate(()=>window.__nav.fix(.3099));assert.match(await cue.innerText(),/Ai ajuns la Test destination/);
   await page.evaluate(()=>window.__nav.fail());assert.match(await cue.innerText(),/GPS/);
   await layer.locator('.route-eva-tracking').click();assert.ok(await list.isVisible());assert.equal(await list.locator('[aria-current]').count(),0,'Stopping restores static preview');
   assert.ok((await layer.locator('.route-map-canvas').boundingBox()).height<=height*.29);
   // Resume the saved native snapshot without a new search or a second Start.
   await layer.locator('.route-eva-tracking').click();const before=await page.evaluate(()=>window.__nav.commands().length);
   const snapshot=await page.evaluate(()=>window.__nav.commands().filter(c=>c.action==='start').at(-1));
   await page.evaluate(()=>window.__nav.close());
   await page.evaluate(raw=>window.pocketRestoreNavigationSession(raw),JSON.stringify(snapshot));
   await page.waitForSelector('.route-unified-preview.navigating');await navigationGeometry();
   assert.equal(await page.evaluate(()=>window.__nav.commands().length),before,'Resume does not restart native navigation');
   await page.evaluate(()=>window.__nav.fix(.303));assert.match(await page.locator('.route-next-maneuver').innerText(),/stânga/);
   await page.evaluate(()=>window.__nav.close());
  }
  const at=m=>new Date(Date.now()+m*60000).toISOString();
  const journey={firstVehicleDepartureTime:at(60),startDateTime:at(0),arrivalDateTime:at(80),time_zone:'Europe/London',boarding_stop:{latitude:51.48,longitude:.31,label:'Test stop',departure_time:at(60)},legs:[{mode:'walking',from:'Home',to:'Test stop',departurePoint:{latitude:51.48,longitude:.3},arrivalPoint:{latitude:51.48,longitude:.31},departureTime:at(0),arrivalTime:at(10)}]};
  await page.evaluate(({j,r})=>window.__nav.transit(j,r),{j:journey,r:route});
  assert.equal(await page.locator('.transit-full-journey-map .transit-screen-pager').count(),0);
  assert.equal(await page.locator('.transit-walking-instructions li').count(),4,'Walking instructions remain in the continuous preview');
  // Optional fault injection proves this test catches APK501892's inline
  // preview-height defect, not just CSS frame dimensions.
  if(process.env.POCKET_LEGACY_TRANSIT_HEIGHT==='1')await page.evaluate(()=>document.querySelector('.transit-full-journey-map .route-map-canvas').style.setProperty('height','clamp(165px,28dvh,300px)','important'));
  await page.getByRole('button',{name:'Pornește navigarea cu Eva',exact:true}).click();await navigationGeometry();
  await page.evaluate(()=>window.__nav.fix(.303));assert.match(await page.locator('.route-next-maneuver').innerText(),/stânga/,'Transit walking shares GPS maneuver progression');
  const native=await page.evaluate(()=>window.__nav.commands().at(-1));assert.equal(native.walkingLegs.length,1,'Do not send the initial walking path twice');
  await page.getByRole('button',{name:'Oprește',exact:true}).click();assert.ok(await page.locator('.transit-full-journey-details').isVisible());
  assert.equal(searches,0,'Saved paths, GPS and resume do not search again');
  assert.deepEqual(errors,[]);await page.close();
 }
 console.log('PASS mobile navigation: compact static walk/drive/transit previews, continuous itinerary, first-start real Leaflet sizing, fixed header/map separation and current+following GPS maneuvers, progress, poor/stale/off-route GPS, stop/resume/native snapshots without search at 4 phone/landscape viewports (real Leaflet/rotation, synthetic tiles, GPS/native mocked)');
}finally{await browser.close();await new Promise(ok=>server.close(ok))}
