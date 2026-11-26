import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {chromium} from 'playwright-core';
import app from './index.js';
let html=await(await app.fetch(new Request('https://test.example/'))).text();
const hook=String.raw`
window.__progress={
 start(){
  state.language='ro';pocketRevealMainApp();openModule('maps');
  const choice={kind:'transit',title:'Transport mixt',prompt:'Transport mixt spre Oradea',mixedJourney:true,mixedComposition:true,transitDirect:true,
   journeyOrigin:{latitude:51.475,longitude:.325,label:'Grays'},transitDestination:{latitude:47.0612,longitude:21.9473,label:'Oradea'},transitQuery:'Oradea'};
  document.getElementById('moduleQuickLayer').classList.add('open');document.getElementById('moduleQuickLayer').setAttribute('aria-hidden','false');
  this.task=runModuleSearch(choice);
 },
 back(){return returnFromMixedJourneyResults()}
};`;
html=html.replace('function extraFunGames(){',hook+'\nfunction extraFunGames(){');
const coach={operator:'FlixBus',mode:'coach',from:'London',to:'Oradea',url:'https://www.flixbus.co.uk/bus-routes/london-oradea'};
const rail={operator:'Fixture Rail',mode:'train',from:'London',to:'Oradea',url:'https://www.bahn.de/fixture'};
const pending=[];let requests=0;
const server=createServer((req,res)=>{
 if(req.method!=='POST'){res.setHeader('Content-Type','text/html;charset=utf-8');res.end(html);return}
 requests++;let text='';req.on('data',chunk=>text+=chunk);req.on('end',()=>{
  const data=JSON.parse(text);assert.equal(data.mixed_progressive,true);
  res.writeHead(200,{'Content-Type':'application/x-ndjson; charset=utf-8','Cache-Control':'no-store'});
  res.flushHeaders();
  const first={status:'success',reply:'Partial',operator_options:[coach],flight_search_status:'disabled'};
  res.write(JSON.stringify({type:'progress',data:first})+'\n');
  pending.push(()=>res.end(JSON.stringify({type:'result',status:200,data:{...first,reply:'Complete',operator_options:[coach,rail]}})+'\n'));
 });
});
await new Promise(ok=>server.listen(0,'127.0.0.1',ok));
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH,headless:true,args:['--no-sandbox']});
try{
 for(const width of [360,393,430]){
  const page=await browser.newPage({viewport:{width,height:817},isMobile:true,hasTouch:true});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',route=>route.request().url().startsWith('http://127.0.0.1:')?route.continue():route.abort());
  await page.goto('http://127.0.0.1:'+server.address().port+'/?nativeLaunch=1');
  await page.evaluate(()=>window.__progress.start());
  const body=page.locator('#moduleLayerBody');
  await body.locator('.mixed-unverified-candidate').waitFor();
  assert.match(await body.locator('.mixed-search-progress').innerText(),/Căutarea continuă/);
  assert.equal(await body.locator('.mixed-unverified-candidate').count(),1,'First card is usable while the HTTP response is unfinished');
  await body.locator('.mixed-unverified-candidate').tap();
  assert.equal(await body.locator('.mixed-operator-changes-disclosure').count(),1);
  pending.shift()();
  await page.evaluate(()=>window.__progress.task);
  assert.equal(await body.locator('.mixed-operator-changes-disclosure').count(),1,'Final response must not close a selected detail');
  await body.getByRole('button',{name:'← Înapoi la variante',exact:true}).tap();
  assert.equal(await body.locator('.mixed-unverified-candidate').count(),2,'Back opens the newest complete alternatives');
  assert.equal(await body.locator('.mixed-search-progress').count(),0);

  await page.evaluate(()=>window.__progress.start());
  await body.locator('.mixed-unverified-candidate').waitFor();
  await page.evaluate(()=>window.__progress.back());
  await body.locator('.transport-departure-datetime').waitFor();
  pending.shift()();await page.evaluate(()=>window.__progress.task);
  assert.equal(await body.locator('.transport-departure-datetime').count(),1,'Late final chunks cannot replace the calendar after Back');
  assert.equal(await body.locator('.mixed-unverified-candidate').count(),0);
  assert.deepEqual(errors,[]);await page.close();
 }
 assert.equal(requests,6,'Exactly one POST per search; no polling/retries');
 console.log('PASS real streamed HTTP browser 360/393/430: early selectable options, detail preserved, Back gets new options, cancellation ignores late chunks, no query replay');
}finally{for(const end of pending)end();await browser.close();await new Promise(ok=>server.close(ok))}
