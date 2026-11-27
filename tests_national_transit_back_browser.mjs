import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
import {chromium} from 'playwright-core';
const {default:app}=await import(process.env.POCKET_BUNDLE?pathToFileURL(resolve(process.env.POCKET_BUNDLE)).href:'./index.js');
let html=await(await app.fetch(new Request('https://test.local/'))).text();
html=html.replace('function extraFunGames(){',String.raw`
const __savedNational={kind:'transit',nationalPublicTransport:true,transitDirect:true,
 transitDestination:{label:'Mill Lane, Test town',latitude:51.48,longitude:.3,country_code:'GB'},
 transitQuery:'Mill Lane, Test town',transitDepartureAt:new Date(Date.now()+3600000).toISOString()};
window.__nationalBack={
 init(){state.language='ro';pocketRevealMainApp();openModule('maps');getCurrentCoordinates=async()=>({latitude:51.48,longitude:.29});
 $('moduleQuickLayer').classList.add('open');$('moduleQuickLayer').setAttribute('aria-hidden','false');
 showNationalTransitSearch({...__savedNational})},
 results(){nationalTransitSession?.stop();state.lastTransitChoice={...__savedNational};state.lastTransitResponse={transit:[]};
 state.pendingRouteDestination=__savedNational.transitDestination;state.routeSearchContext={old:true};renderTransitChoices([])},
 back(){return window.pocketAndroidBack()},
 clean(){return !state.lastTransitChoice?.transitDestination&&!state.lastTransitChoice?.transitDepartureAt&&
 !state.lastTransitResponse&&!state.pendingRouteDestination&&!state.routeSearchContext&&!state.moduleSearchBusy}
};
function extraFunGames(){`);
const server=createServer((req,res)=>{res.setHeader('content-type','text/html;charset=utf-8');res.end(html)});
await new Promise(ok=>server.listen(0,'127.0.0.1',ok));
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH,headless:true,args:['--no-sandbox']});
try{
 const page=await browser.newPage({viewport:{width:393,height:817},isMobile:true,hasTouch:true}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/*',route=>{
  if(route.request().method()==='POST'){
   assert.ok(route.request().postDataJSON().national_transit_country,'Back must not rerun the old itinerary or destination query');
   return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({country_code:'GB',supported:true})});
  }
  return route.request().url().startsWith('http://127.0.0.1:')?route.continue():route.abort();
 });
 await page.goto('http://127.0.0.1:'+server.address().port+'/?nativeLaunch=1');
 await page.evaluate(()=>window.__nationalBack.init());
 const field=page.locator('.journey-one-field-input');
 await page.waitForFunction(()=>document.querySelector('.journey-one-field-input')?.value==='Mill Lane, Test town');
 await page.locator('.journey-suggestion').click();await page.locator('.transport-departure-step').waitFor();
 await page.locator('#moduleLayerBack').click();assert.equal(await field.inputValue(),'Mill Lane, Test town','Calendar Back preserves selected destination');
 assert.equal(await page.locator('.journey-suggestion').count(),1);
 for(const physical of [false,true]){
  await page.evaluate(()=>window.__nationalBack.results());
  if(physical)await page.evaluate(()=>window.__nationalBack.back());
  else await page.locator('.quick-navigation-toolbar > button').first().click();
  await field.waitFor();await page.waitForFunction(()=>!document.querySelector('.journey-one-field-input')?.disabled);
  assert.equal(await field.inputValue(),'','Results Back opens a fresh search');
  assert.equal(await page.locator('.journey-suggestion').count(),0,'No resident confirmed suggestion');
  assert.equal(await page.evaluate(()=>window.__nationalBack.clean()),true,'Clear old destination, departure, response and route context');
  assert.equal(await page.locator('#moduleLayerBack').isVisible(),true);
 }
 assert.deepEqual(errors,[]);await page.close();
 console.log('PASS national Back: results toolbar and Android Back clear destination/date/results; calendar Back preserves destination; no old itinerary/geocoder requests (controlled GPS/country)');
}finally{await browser.close();await new Promise(ok=>server.close(ok))}
