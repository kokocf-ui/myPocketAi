import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {pathToFileURL} from 'node:url';
import path from 'node:path';
import {chromium} from 'playwright-core';
import {normalizeDigitransitPattern} from './digitransit_national_transit.mjs';
import {nationalTransportResponse} from './national_transport_response.mjs';
import {to,at,receivedAt,options,pattern,leg} from './test_fixtures/digitransit_national.mjs';
const {default:app}=await import(process.env.POCKET_BUNDLE?pathToFileURL(path.resolve(process.env.POCKET_BUNDLE)).href:'./index.js');
let html=await(await app.fetch(new Request('https://test.local/'))).text();
html=html.replace('function extraFunGames(){',String.raw`
window.__finlandUI={init(data){
 state.language='ro';pocketRevealMainApp();openModule('maps');
 state.lastTransitChoice={kind:'transit',nationalPublicTransport:true,mixedJourney:false,transitDestination:data.transit_destination_point};
 state.lastTransitResponse=data;
 document.getElementById('moduleQuickLayer').classList.add('open');
 document.getElementById('moduleQuickLayer').setAttribute('aria-hidden','false');
 renderTransitChoices(data.transit,0);
}};
function extraFunGames(){`);
const {_countryCheckPoints,...journey}=normalizeDigitransitPattern(pattern('RAIL'),{...options,receivedAt});
const data=nationalTransportResponse({status:'ok',journeys:[{...journey,stop_countries_verified:true}]},{country:'FI',provider:'Digitransit',language:'ro',destination:{...to,label:'Synthetic arrival'},departureAt:at});
const eeFrom={latitude:59.439,longitude:24.737},eeTo={latitude:59.437,longitude:24.755};
const {_countryCheckPoints:eePrivate,...eeJourney}=normalizeDigitransitPattern({legs:[leg('RAIL',eeFrom,eeTo)]},{...options,from:eeFrom,to:eeTo,receivedAt,country:'EE'});
const eeData=nationalTransportResponse({status:'ok',journeys:[{...eeJourney,stop_countries_verified:true}]},{country:'EE',provider:'Digitransit',language:'ro',destination:{...eeTo,label:'Synthetic Tallinn'},departureAt:at});
const server=createServer((req,res)=>{res.setHeader('content-type','text/html;charset=utf-8');res.end(html)});
await new Promise(ok=>server.listen(0,'127.0.0.1',ok));
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH,headless:true,args:['--no-sandbox']});
try{
 for(const width of [360,393,430]){
  const page=await browser.newPage({viewport:{width,height:817},isMobile:true,hasTouch:true}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',r=>r.request().url().startsWith('http://127.0.0.1:')?r.continue():r.abort());
  await page.goto('http://127.0.0.1:'+server.address().port+'/?nativeLaunch=1');
  for(const sample of [data,eeData]){
  await page.evaluate(d=>window.__finlandUI.init(d),sample);
  const body=page.locator('#moduleLayerBody');assert.match(await body.innerText(),/TEST-FI-42/);
  assert.match(await body.locator('.transit-stop-count').innerText(),/2 opriri până la coborâre/);
  const attribution=body.locator('.transit-source-attribution');assert.equal(await attribution.count(),1);
  assert.match(await attribution.innerText(),/© Digitransit 2026/);assert.match(await attribution.innerText(),/2026-11-26T10:00:00Z/);
  assert.match(await attribution.innerText(),/CC BY 4\.0.*OpenStreetMap.*ODbL/);
  assert.equal(await body.locator('.transit-ticket-link').getAttribute('href'),'https://example.com/');
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
  assert.deepEqual(errors,[]);}
  await page.close();
 }
 console.log('PASS Finland/Estonia synthetic responses in production UI 360/393/430: attribution/time/licenses, stops, operator ticket link, no horizontal overflow');
}finally{await browser.close();await new Promise(ok=>server.close(ok));}
