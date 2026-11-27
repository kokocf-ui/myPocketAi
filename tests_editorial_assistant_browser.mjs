import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {mkdir} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import path from 'node:path';
import {chromium} from 'playwright-core';
import {FUN_QUOTE_COLLECTION} from './fun_editorial_content.mjs';
const {default:app}=await import(process.env.POCKET_BUNDLE?pathToFileURL(path.resolve(process.env.POCKET_BUNDLE)).href:'./index.js');
let html=await(await app.fetch(new Request('https://editorial.test/'))).text();
const hook=String.raw`
window.__editorial={
 init(){state.language='ro';showView('module');pocketRevealMainApp();extraFunMaxims()},
 open(id){const q=FUN_QUOTES.find(q=>q.id===id);extraFunMaximMeaning(q.text,'2026-11-26')},
 day(){return funDailyMaximEntry(funLocalDateKey(new Date()))},back(){window.pocketAndroidBack()},
 assistant(){showView('assistant');state.messages=[];state.pendingTravelMode='drive';state.pendingRouteStart=true;state.pendingRouteCompare=true;state.pendingRouteViaQuery='Old via';state.routeSearchContext={destination:{label:'Victoria Station',latitude:51.49,longitude:-.14}};state.placeSearchContext={query:'Londra',category:'restaurant'};state.weatherSearchContext={query:'Londra'};state.distanceSearchContext={destination:'Londra'}},
 async send(text){inputEl.value=text;await submitMessage();return state.currentView},
 classify(text){return {understood:assistantUnderstandRequest(text),gps:requestUsesLocation(text),handoff:assistantJourneyHandoff(text)}}
};`;
html=html.replace('function extraFunGames(){',hook+'\nfunction extraFunGames(){');
const server=createServer((req,res)=>{res.setHeader('content-type','text/html; charset=utf-8');res.end(html)});await new Promise(ok=>server.listen(0,'127.0.0.1',ok));
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH,headless:true,args:['--no-sandbox']});
await mkdir('.bundle-check/editorial',{recursive:true});
try{
 for(const viewport of [{width:393,height:817},{width:360,height:640}]){
  const page=await browser.newPage({viewport,isMobile:true,hasTouch:true}),errors=[],requests=[];page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>{window.__gpsCalls=0;Object.defineProperty(navigator,'geolocation',{value:{getCurrentPosition(_ok,bad){window.__gpsCalls++;bad({message:'GPS should not be requested here'})},watchPosition(){window.__gpsCalls++;return 1},clearWatch(){}}})});
  await page.route('**/*',route=>{const req=route.request(),url=req.url();if(req.method()==='POST'&&req.postData()?.includes('"message"')){requests.push(req.postDataJSON());return route.fulfill({contentType:'application/json',body:JSON.stringify({status:'success',reply:'Putem porni de la ideea ta, fără o căutare de adrese. Ce rezultat ai vrea să obții?'})})}if(url.startsWith('http://127.0.0.1:'))return route.continue();return route.abort()});
  await page.goto('http://127.0.0.1:'+server.address().port+'/?nativeLaunch=1');await page.evaluate(()=>window.__editorial.init());
  const daily=await page.evaluate(()=>window.__editorial.day()),card=page.locator('.extra-fun-library-layout>.extra-fun-panel').first();
  assert.equal(await card.locator('cite').count(),daily.author?1:0);if(daily.author)assert.equal(await card.locator('cite').innerText(),daily.author);
  for(const q of FUN_QUOTE_COLLECTION){
   await page.evaluate(id=>window.__editorial.open(id),q.id);const pop=page.locator('.extra-fun-modal');
   assert.equal(await pop.locator('blockquote').innerText(),q.text);
   assert.equal(await pop.locator('cite').count(),q.author?1:0);if(q.author)assert.equal(await pop.locator('cite').innerText(),q.author);
   assert.equal(await pop.locator('.extra-fun-quote-source').getAttribute('open'),null);assert.doesNotMatch(await pop.innerText(),/autorul este|de \(autor\)/i);
   await pop.locator('summary').tap();assert.match(await pop.innerText(),new RegExp(q.source.work.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
   if(q.source.url)assert.equal(await pop.getByRole('link').getAttribute('href'),q.source.url);else assert.equal(await pop.getByRole('link').count(),0);
   if(q.id==='rochefoucauld-3')await page.screenshot({path:'.bundle-check/editorial/quote-'+viewport.width+'.png'});
   await page.evaluate(()=>window.__editorial.back());
  }
  await page.evaluate(()=>{window.__editorial.assistant();window.__gpsCalls=0});
  for(const text of ['Am o idee','Haz de necaz','Neuroplasticitate','Nu caut un restaurant lângă mine, vorbeam despre o glumă','De la teorie la practică']){
   const c=await page.evaluate(t=>window.__editorial.classify(t),text);assert.equal(c.gps,false);assert.equal(c.handoff,null);
   assert.equal(await page.evaluate(t=>window.__editorial.send(t),text),'assistant');
   const body=requests.at(-1);assert.equal(body.message,text);assert.equal(body.module,'assistant');assert.equal(body.location_requested,false);assert.equal(body.location,null);assert.equal(body.coordinates,null);assert.equal(body.route_context,null);assert.equal(body.place_context,null);assert.equal(body.weather_context,null);assert.equal(body.distance_context,null);assert.equal(body.route_destination,null);assert.equal(body.route_start,false);assert.ok(!body.travel_mode);assert.ok(!body.route_profile);assert.ok(!body.route_via_query);assert.equal(body.route_compare,false);
  }
  assert.equal(await page.evaluate(()=>window.__gpsCalls),0,'No GPS permission prompt for unclear/conceptual input despite stale route controls');
  const positive=await page.evaluate(()=>window.__editorial.classify('Unde este Lidl?'));assert.equal(positive.gps,true);
  await page.screenshot({path:'.bundle-check/editorial/assistant-'+viewport.width+'.png'});assert.deepEqual(errors,[]);await page.close();
 }
 console.log('PASS production mobile: all 36 quote texts/authors/source details including anonymous entries, 5 non-location turns per viewport keep Assistant and send no GPS/stale route/place fields; explicit location intent preserved. AI transport mocked.');
}finally{await browser.close();server.close();server.closeAllConnections?.()}
