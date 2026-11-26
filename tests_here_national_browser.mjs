import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {chromium} from 'playwright-core';
import app from './index.js';
import {normalizeHereRoute} from './here_national_transit.mjs';
import {nationalTransportResponse} from './national_transport_response.mjs';
import {route,options,to} from './test_fixtures/here_national.mjs';
let html=await(await app.fetch(new Request('https://test.local/'))).text();
html=html.replace('function extraFunGames(){',String.raw`
window.__hereUI={init(data){
 state.language='ro';pocketRevealMainApp();openModule('maps');
 state.lastTransitChoice={kind:'transit',nationalPublicTransport:true,mixedJourney:false,transitDestination:data.transit_destination_point};
 state.lastTransitResponse=data;
 document.getElementById('moduleQuickLayer').classList.add('open');
 renderTransitChoices(data.transit);
},probe(j){return {buffer:transitBoardingBuffer(j),count:feasibleTransitChoices([j]).length};},
select(){return selectTransitJourneyWithNavigation(state.lastTransitResponse.transit,0,true);}};
function extraFunGames(){`);
const samples=[];
for(const missing of [true,false]){
 const raw=route();if(missing){delete raw.sections[0].departure.time;delete raw.sections[0].arrival.time;}else raw.sections[0].notices=[{code:'noSchedule'}];
 const {_countryCheckPoints,...j}=normalizeHereRoute(raw,options);
 samples.push(nationalTransportResponse({status:'ok',journeys:[{...j,stop_countries_verified:true}]},{country:'DE',provider:'HERE Public Transit',destination:{...to,label:'Synthetic destination'}}));
}
const server=createServer((req,res)=>{res.setHeader('content-type','text/html;charset=utf-8');res.end(html);});
await new Promise(ok=>server.listen(0,'127.0.0.1',ok));
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH,headless:true,args:['--no-sandbox']});
try{
 for(const width of [360,393,430]){
  const page=await browser.newPage({viewport:{width,height:817},isMobile:true,hasTouch:true}),errors=[];let external=0;
  page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',r=>{if(r.request().url().startsWith('http://127.0.0.1:'))return r.continue();external++;return r.abort();});
  await page.goto('http://127.0.0.1:'+server.address().port+'/?nativeLaunch=1');
  for(const sample of samples){
   await page.evaluate(d=>window.__hereUI.init(d),sample);
   const body=page.locator('#moduleLayerBody');assert.match(await body.innerText(),/Orientativ/);
   assert.match(await body.locator('.transit-source-attribution').innerText(),/END.*https:\/\/operator.example\/license/s);
   const probe=await page.evaluate(j=>window.__hereUI.probe({...j,accessWalkVerified:true,walkToFirstStopMinutes:5,firstVehicleDepartureTime:'2020-01-01T00:00:00Z'}),sample.transit[0]);
   assert.deepEqual(probe,{buffer:null,count:1});
   const before=external;await page.evaluate(()=>window.__hereUI.select());assert.equal(external,before,'No catchability/navigation API for indicative schedule');
   assert.match(await body.innerText(),/TEST 42/);assert.match(await body.locator('.transit-stop-count').innerText(),/2 opriri/);
   assert.match(await body.locator('.transit-source-attribution').innerText(),/END/);
   assert.equal(await body.locator('.transit-boarding-buffer-notice').count(),0);
   assert.ok(!/1970|Invalid Date|NaN/.test(await body.innerText()));
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
  }
  assert.deepEqual(errors,[]);await page.close();
 }
 console.log('PASS HERE synthetic UI 360/393/430: no timetable + estimated, full attribution, stops, no catchability or horizontal overflow');
}finally{await browser.close();await new Promise(ok=>server.close(ok));}
