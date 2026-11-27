import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {pathToFileURL} from 'node:url';
import path from 'node:path';
import {chromium} from 'playwright-core';
const {default:app}=await import(process.env.POCKET_BUNDLE?pathToFileURL(path.resolve(process.env.POCKET_BUNDLE)).href:'./index.js');
let html=await(await app.fetch(new Request('https://test.local/'))).text();
const hook=String.raw`
window.__farewell={
 init(){state.language='ro';pocketRevealMainApp();showView('assistant');state.messages=[{role:'user',text:'Cum este vremea în Oradea, România?'},{role:'assistant',text:'În Oradea este frig.'}];state.weatherSearchContext={query:'Oradea'};state.routeSearchContext={destination:{label:'Victoria',latitude:51.49,longitude:-.14}}},
 async send(text){inputEl.value=text;await submitMessage();return {messages:state.messages,gps:requestUsesLocation(text)}}
};`;
html=html.replace('function extraFunGames(){',hook+'\nfunction extraFunGames(){');
const server=createServer((req,res)=>{res.setHeader('content-type','text/html;charset=utf-8');res.end(html)});
await new Promise(ok=>server.listen(0,'127.0.0.1',ok));
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH,headless:true,args:['--no-sandbox']});
try{
 for(const width of [360,393,430]){
  const page=await browser.newPage({viewport:{width,height:817},isMobile:true,hasTouch:true}),errors=[],requests=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>{window.__gps=0;Object.defineProperty(navigator,'geolocation',{value:{getCurrentPosition(ok,bad){window.__gps++;bad({message:'Unexpected GPS'})},watchPosition(){window.__gps++;return 1},clearWatch(){}}})});
  await page.route('**/*',route=>{
   const req=route.request();if(req.method()==='POST'&&req.postData()?.includes('"message"')){
    requests.push(req.postDataJSON());return route.fulfill({contentType:'application/json',body:JSON.stringify({status:'success',reply:'Sunt încântată să te ajut cu informația ta despre surse primare și secundare. În general, sursele primare sunt materiale care înregistrează un first-hand account.'})});
   }
   return req.url().startsWith('http://127.0.0.1:')?route.continue():route.abort();
  });
  await page.goto('http://127.0.0.1:'+server.address().port+'/?nativeLaunch=1');await page.evaluate(()=>window.__farewell.init());
  const gpsBefore=await page.evaluate(()=>window.__gps);
  const result=await page.evaluate(()=>window.__farewell.send('Bine, ne auzim mai târziu'));
  assert.equal(requests.length,1);assert.deepEqual(requests[0].history,[]);
  assert.equal(requests[0].location_requested,false);assert.equal(requests[0].route_context,null);assert.equal(requests[0].weather_context,null);
  assert.equal(result.gps,false);assert.equal(await page.evaluate(()=>window.__gps),gpsBefore);
  const last=result.messages.filter(m=>m.role==='assistant').at(-1);
  assert.equal(last.text,'Ne auzim mai târziu! Ai grijă de tine.');
  assert.doesNotMatch(await page.locator('body').innerText(),/surse primare|first-hand/);
  assert.deepEqual(errors,[]);await page.close();
 }
 console.log('PASS farewell production bundle 360/393/430: exact screenshot phrase, old-server off-topic response rejected, no history/GPS/stale route/weather');
}finally{await browser.close();await new Promise(ok=>server.close(ok))}
