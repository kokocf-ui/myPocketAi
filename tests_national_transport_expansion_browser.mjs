import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {pathToFileURL} from 'node:url';
import path from 'node:path';
import {chromium} from 'playwright-core';
const {default:app}=await import(process.env.POCKET_BUNDLE?pathToFileURL(path.resolve(process.env.POCKET_BUNDLE)).href:'./index.js');
let html=await(await app.fetch(new Request('https://test.local/'))).text();
html=html.replace('function extraFunGames(){',String.raw`
window.__national={init(){
 state.language='ro';pocketRevealMainApp();openModule('maps');
 getCurrentCoordinates=async()=>({latitude:45.75,longitude:21.23,updatedAt:Date.now()});
 document.getElementById('moduleQuickLayer').classList.add('open');
 document.getElementById('moduleQuickLayer').setAttribute('aria-hidden','false');
 showNationalTransitSearch({kind:'transit',nationalPublicTransport:true});
}};
function extraFunGames(){`);
const server=createServer((req,res)=>{res.setHeader('content-type','text/html;charset=utf-8');res.end(html)});
await new Promise(ok=>server.listen(0,'127.0.0.1',ok));
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH,headless:true,args:['--no-sandbox']});
try{
 for(const width of [360,393,430]){
  const page=await browser.newPage({viewport:{width,height:817},isMobile:true,hasTouch:true}),errors=[];
  let country='RO',lookups=0;
  page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',async route=>{
   const req=route.request();
   if(req.method()==='POST'){
    const body=req.postDataJSON();assert.ok(body.national_transit_country);lookups++;
    return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({country_code:country,supported:country!=='DE',
     provider_coverage:{country,urban_configured:true,intercity_configured:false,countrywide_coverage_verified:false}})});
   }
   if(req.url().startsWith('http://127.0.0.1:'))return route.continue();
   return route.abort();
  });
  await page.goto('http://127.0.0.1:'+server.address().port+'/?nativeLaunch=1');
  const body=page.locator('#moduleLayerBody'),field=body.locator('.journey-one-field-input');
  for(const code of ['RO','GB']){
   country=code;await page.evaluate(()=>window.__national.init());
   await field.waitFor();await page.waitForFunction(()=>!document.querySelector('.journey-one-field-input')?.disabled);
   assert.match(await body.innerText(),/Acoperirea locală se verifică la căutare/);
   assert.match(await body.innerText(),/configurat nu înseamnă disponibil în orice localitate/);
   assert.equal(await field.isEnabled(),true);
   const box=await field.boundingBox();assert.ok(box.x>=0&&box.x+box.width<=width+1);
   assert.ok(box.y>=0&&box.y+box.height<=817,'Destination input remains in the first screen');
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);
   assert.equal(overflow,false);
  }
  await page.setViewportSize({width,height:460});
  await field.tap();
  assert.ok(await field.isVisible(),'Destination stays usable with reduced keyboard viewport');
  country='DE';await page.evaluate(()=>window.__national.init());
  await body.getByText('Nu este conectat încă un motor verificat de transport public pentru această țară.',{exact:true}).waitFor();
  assert.equal(await field.isDisabled(),true,'Catalog-only countries cannot pretend to plan routes');
  assert.equal(lookups,3);assert.deepEqual(errors,[]);await page.close();
 }
 console.log('PASS national transport production browser 360/393/430: RO/GB coverage notice, GPS lookup, no horizontal overflow, DE fails honestly, reduced viewport');
}finally{await browser.close();await new Promise(ok=>server.close(ok));}
