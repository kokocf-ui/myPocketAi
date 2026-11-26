import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {pathToFileURL} from 'node:url';
import path from 'node:path';
import {chromium} from 'playwright-core';
const {default:app}=await import(process.env.POCKET_BUNDLE?pathToFileURL(path.resolve(process.env.POCKET_BUNDLE)).href:'./index.js');
let html=await(await app.fetch(new Request('https://test.local/'))).text();
const hook=String.raw`
window.__mixed={
 init(data){state.language='ro';pocketRevealMainApp();openModule('maps');state.lastTransitChoice={kind:'transit',mixedJourney:true,transitDirect:true,journeyOrigin:{latitude:51.48,longitude:.29,label:'Locația mea GPS'},transitDestination:{latitude:47.05,longitude:21.92,label:'Adresa finală Oradea'}};document.getElementById('moduleQuickLayer').classList.add('open');document.getElementById('moduleQuickLayer').setAttribute('aria-hidden','false');renderMixedUnifiedResults(data,state.lastTransitChoice)},
 async select(){await selectTransitJourney(state.lastTransitResponse.transit,0)}
};`;
html=html.replace('function extraFunGames(){',hook+'\nfunction extraFunGames(){');
const at=m=>new Date(Date.now()+m*60000).toISOString();
const data={international_journey:true,flight_search_status:'candidate_results_only',transit_available:true,transit:[{
 provider:'Example schedule',time_zone:'Europe/London',startDateTime:at(60),arrivalDateTime:at(600),durationMinutes:540,
 fareComplete:false,seatAvailability:'unverified',boarding_stop:{latitude:51.48,longitude:.29,label:'London departure',departure_time:at(60)},
 legs:[{mode:'train',from:'London',to:'Paris',operator:'Eurostar',departureTime:at(60),arrivalTime:at(200),bookingUrl:'https://www.eurostar.com/'},
 {mode:'coach',from:'Paris',to:'Oradea',operator:'FlixBus',departureTime:at(260),arrivalTime:at(600)}]
 }],operator_options:[{mode:'coach',from:'London',to:'Oradea',operator:'FlixBus',url:'https://www.flixbus.co.uk/bus-routes/london-oradea',timetable_verified:false,door_to_door_complete:false}],
 flight_candidates:[{legs:[{mode:'flight',from:'STN',to:'CLJ',airline:'Ryanair',startLocal:'2026-12-08 06:00',endLocal:'2026-12-08 10:30'}],bookingVerified:false,completeDoorToDoor:false}]
};
const server=createServer((req,res)=>{res.setHeader('content-type','text/html;charset=utf-8');res.end(html)});await new Promise(ok=>server.listen(0,'127.0.0.1',ok));
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH,headless:true,args:['--no-sandbox']});
try{
 for(const width of [360,393,430]){
  const page=await browser.newPage({viewport:{width,height:817},isMobile:true,hasTouch:true}),errors=[];let external=0;
  page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',route=>{if(route.request().url().startsWith('http://127.0.0.1:'))return route.continue();external++;return route.abort()});
  await page.goto('http://127.0.0.1:'+server.address().port+'/?nativeLaunch=1');await page.evaluate(d=>window.__mixed.init(d),data);
  const body=page.locator('#moduleLayerBody');
  assert.match(await body.innerText(),/Nu este necesară confirmarea locurilor/);
  assert.equal(await body.locator('.mixed-unverified-candidate').count(),2,'Coach and flight remain alongside a timed train/coach option');
  const before=external;await page.evaluate(()=>window.__mixed.select());
  assert.equal(external,before,'Selecting an itinerary must not depend on another network call or walk-to-station validation');
  const links=body.locator('.transit-ticket-link');assert.equal(await links.count(),2);
  assert.equal(await links.nth(0).getAttribute('href'),'https://www.eurostar.com/');
  assert.equal(await links.nth(1).getAttribute('href'),'https://www.flixbus.com/');
  assert.match(await body.innerText(),/nu este o rezervare confirmată/);
  await body.locator('.quick-navigation-toolbar button').first().tap();
  assert.equal(await body.locator('.mixed-unverified-candidate').count(),2,'Back restores ALL independent alternatives');
  await body.locator('.mixed-unverified-candidate').last().tap();
  assert.equal(await body.locator('.transit-ticket-link').getAttribute('href'),'https://www.ryanair.com/');
  assert.ok(await body.locator('.mixed-stage-gap').count()>=2,'Missing airport access/egress is explicit, not an invented connection');
  await body.getByRole('button',{name:'← Înapoi la variante',exact:true}).tap();
  await body.locator('.mixed-unverified-candidate').first().tap();
  assert.equal(await body.getByRole('link',{name:'Bilete și rezervare · FlixBus'}).getAttribute('href'),'https://www.flixbus.co.uk/bus-routes/london-oradea');
  // Surface-only results must survive an empty/disabled flight source, with
  // ordinary local access/egress gaps disclosed rather than an airport screen.
  const train={from:'London',to:'Brussels',mode:'train',operator:'Eurostar',url:'https://www.eurostar.com/uk-en/train/london-to-brussels'};
  const coach={from:'Brussels',to:'Oradea',mode:'coach',operator:'FlixBus',url:'https://www.flixbus.com/bus-routes/brussels-oradea'};
  await page.evaluate(d=>window.__mixed.init(d),{...data,transit:[],flight_candidates:[],flight_search_status:'disabled',
   ground_connections:[{from:'London',to:'Oradea',transferCity:'Brussels',segments:[train,coach]}]});
  assert.equal(await body.locator('.mixed-unverified-candidate').count(),2,'Rail+coach chain and direct coach exist without a single flight');
  assert.equal(await body.locator('.mixed-airport-coverage').count(),0);
  const beforeSurface=external;
  await body.locator('.mixed-unverified-candidate').first().tap();
  assert.equal(await body.getByRole('link',{name:'Bilete și rezervare · Eurostar'}).count(),1);
  assert.equal(await body.getByRole('link',{name:'Bilete și rezervare · FlixBus'}).count(),1);
  assert.match(await body.innerText(),/Adresa finală Oradea/);
  assert.match(await body.innerText(),/Nu avem încă dovada/,'Route pages are not promoted to a timed transfer');
  await body.locator('.transit-detail-toolbar button').tap();
  assert.equal(await body.locator('.mixed-unverified-candidate').count(),2);
  assert.equal(external,beforeSurface,'Selecting surface details only reads initial evidence');
  assert.deepEqual(errors,[]);await page.close();
 }
 console.log('PASS production mobile 360/393/430: indicative train+coach+flight coexist, details without network, per-leg tickets, explicit gaps, Back retains all modes');
}finally{await browser.close();await new Promise(ok=>server.close(ok))}
