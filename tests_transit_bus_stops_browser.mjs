import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {pathToFileURL} from 'node:url';
import path from 'node:path';
import {chromium} from 'playwright-core';
const {default:app}=await import(process.env.POCKET_BUNDLE?pathToFileURL(path.resolve(process.env.POCKET_BUNDLE)).href:'./index.js');
let html=await(await app.fetch(new Request('https://test.local/'))).text();
const hook=String.raw`
window.__transitTest={
 init(){state.language='ro';pocketRevealMainApp();openModule('maps')},
 stops(){const host=$('moduleContent');host.replaceChildren();appendTransitLegs(host,{time_zone:'Europe/London',legs:[
 {mode:'bus',from:'A',to:'Schimb B',stopCount:4},
 {mode:'walking',from:'Schimb B',to:'Peron C'},
 {mode:'tube',from:'Peron C',to:'Destinație D',stopCount:2},
 {mode:'bus',from:'D',to:'Hotel'}]})}
};`;
html=html.replace('function extraFunGames(){',hook+'\nfunction extraFunGames(){');
assert.ok(Buffer.byteLength(html)<8000000);
const server=createServer((req,res)=>{res.setHeader('content-type','text/html;charset=utf-8');res.end(html)});
await new Promise(ok=>server.listen(0,'127.0.0.1',ok));
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH,headless:true,args:['--no-sandbox']});
try{
 for(const viewport of [{width:360,height:640},{width:393,height:817},{width:430,height:900}]){
  const page=await browser.newPage({viewport,isMobile:true,hasTouch:true}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',route=>route.request().url().startsWith('http://127.0.0.1:')?route.continue():route.abort());
  await page.goto('http://127.0.0.1:'+server.address().port+'/?nativeLaunch=1');
  await page.evaluate(()=>window.__transitTest.init());
  const cards=page.locator('.module-landing-choice');assert.match(await cards.first().innerText(),/Transport public național/);
  assert.match(await cards.nth(1).innerText(),/Transport mixt.*Mașină/s);
  await cards.nth(1).tap();assert.equal(await page.locator('.journey-one-field-input').count(),1);
  await page.evaluate(()=>{document.querySelector('#moduleQuickLayer').classList.remove('open');window.__transitTest.stops()});
  const counts=page.locator('.transit-stop-count');assert.equal(await counts.count(),3);
  assert.match(await counts.nth(0).innerText(),/4 opriri până la coborâre · Schimb B/);
  assert.match(await counts.nth(1).innerText(),/2 opriri până la coborâre · Destinație D/);
  assert.match(await counts.nth(2).innerText(),/neprecizat de furnizor/);
  assert.deepEqual(errors,[],'No bundle/runtime errors at '+viewport.width);
  await page.close();
 }
 console.log('PASS production mobile bundle 360/393/430: Maps order, car description and per-leg stop counts');
}finally{await browser.close();await new Promise(ok=>server.close(ok))}
