import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {pathToFileURL} from 'node:url';
import path from 'node:path';
import {chromium} from 'playwright-core';
import {normalizeEnturPattern} from './entur_national_transit.mjs';
import {nationalTransportResponse} from './national_transport_response.mjs';
import {from,to,at,options,pattern} from './test_fixtures/entur_national.mjs';
const {default:app}=await import(process.env.POCKET_BUNDLE?pathToFileURL(path.resolve(process.env.POCKET_BUNDLE)).href:'./index.js');
let html=await(await app.fetch(new Request('https://test.local/'))).text();
html=html.replace('function extraFunGames(){',String.raw`
window.__enturUI={init(data){
 state.language='ro';pocketRevealMainApp();openModule('maps');
 state.lastTransitChoice={kind:'transit',nationalPublicTransport:true,mixedJourney:false,transitDestination:data.transit_destination_point};
 state.lastTransitResponse=data;
 document.getElementById('moduleQuickLayer').classList.add('open');
 document.getElementById('moduleQuickLayer').setAttribute('aria-hidden','false');
 renderTransitChoices(data.transit,0);
}};
function extraFunGames(){`);
const {_countryCheckPoints,...journey}=normalizeEnturPattern(pattern('rail'),options);
const data=nationalTransportResponse({status:'ok',journeys:[{...journey,stop_countries_verified:true}]},{country:'NO',provider:'Entur',language:'ro',destination:{...to,label:'Test end'},departureAt:at});
const server=createServer((req,res)=>{res.setHeader('content-type','text/html;charset=utf-8');res.end(html)});
await new Promise(ok=>server.listen(0,'127.0.0.1',ok));
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH,headless:true,args:['--no-sandbox']});
try{
 for(const width of [360,393,430]){
  const page=await browser.newPage({viewport:{width,height:817},isMobile:true,hasTouch:true}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',route=>route.request().url().startsWith('http://127.0.0.1:')?route.continue():route.abort());
  await page.goto('http://127.0.0.1:'+server.address().port+'/?nativeLaunch=1');await page.evaluate(d=>window.__enturUI.init(d),data);
  const body=page.locator('#moduleLayerBody');
  assert.match(await body.innerText(),/TEST-42/);assert.match(await body.innerText(),/Test start → Test end/);
  assert.match(await body.innerText(),/Synthetic Operator/);
  assert.match(await body.locator('.transit-stop-count').innerText(),/2 opriri până la coborâre/);
  assert.equal(await body.locator('.transit-ticket-link').getAttribute('href'),'https://example.com/');
  assert.equal(await body.locator('.transit-steps tbody tr').count(),1);
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);assert.equal(overflow,false);
  assert.deepEqual(errors,[]);await page.close();
 }
 console.log('PASS Entur synthetic response in production UI 360/393/430: generic national details, stops, operator, external ticket site, no horizontal overflow');
}finally{await browser.close();await new Promise(ok=>server.close(ok));}
