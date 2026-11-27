import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {pathToFileURL} from 'node:url';
import path from 'node:path';
import {chromium} from 'playwright-core';
import {normalizeGermanyItinerary} from './germany_national_transit.mjs';
import {nationalTransportResponse} from './national_transport_response.mjs';
import {to,at,receivedAt,options,itinerary,env} from './test_fixtures/germany_national.mjs';
const {default:app}=await import(process.env.POCKET_BUNDLE?pathToFileURL(path.resolve(process.env.POCKET_BUNDLE)).href:'./index.js');
let html=await(await app.fetch(new Request('https://test.local/'))).text();
html=html.replace('function extraFunGames(){',String.raw`
window.__germanyUI={init(data){
 state.language='ro';pocketRevealMainApp();openModule('maps');
 state.lastTransitChoice={kind:'transit',nationalPublicTransport:true,mixedJourney:false,transitDestination:data.transit_destination_point};
 state.lastTransitResponse=data;
 document.getElementById('moduleQuickLayer').classList.add('open');
 document.getElementById('moduleQuickLayer').setAttribute('aria-hidden','false');
 renderTransitChoices(data.transit,0);
}};
function extraFunGames(){`);
const {_countryCheckPoints,...journey}=normalizeGermanyItinerary(itinerary('REGIONAL_RAIL'),{...options,receivedAt,attribution:env.GERMANY_MOTIS_ATTRIBUTION});
const data=nationalTransportResponse({status:'ok',journeys:[{...journey,stop_countries_verified:true}]},{country:'DE',provider:'MOTIS Germany',language:'ro',destination:{...to,label:'Synthetic Frankfurt'},departureAt:at});
const server=createServer((req,res)=>{res.setHeader('content-type','text/html;charset=utf-8');res.end(html)});
await new Promise(ok=>server.listen(0,'127.0.0.1',ok));
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH,headless:true,args:['--no-sandbox']});
try{
 for(const width of [360,393,430]){
  const page=await browser.newPage({viewport:{width,height:817},isMobile:true,hasTouch:true}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',r=>r.request().url().startsWith('http://127.0.0.1:')?r.continue():r.abort());
  await page.goto('http://127.0.0.1:'+server.address().port+'/?nativeLaunch=1');
  for(const sample of [data]){
  await page.evaluate(d=>window.__germanyUI.init(d),sample);
  const body=page.locator('#moduleLayerBody');assert.match(await body.innerText(),/TEST/);
  assert.match(await body.locator('.transit-stop-count').innerText(),/2 opriri până la coborâre/);
  const attribution=body.locator('.transit-source-attribution');assert.equal(await attribution.count(),1);
  assert.match(await attribution.innerText(),/Synthetic fixture only/);assert.match(await attribution.innerText(),/2026-11-26T12:00:01Z/);
  assert.match(await attribution.innerText(),/OpenStreetMap.*ODbL/);
  assert.equal(await body.locator('.transit-ticket-link').getAttribute('href'),'https://operator.example/');
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
  assert.deepEqual(errors,[]);}
  await page.close();
 }
 console.log('PASS Germany synthetic response in production UI 360/393/430: source attribution/time, stops, operator ticket link, no horizontal overflow');
}finally{await browser.close();await new Promise(ok=>server.close(ok));}
