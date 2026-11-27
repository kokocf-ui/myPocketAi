// Real mobile browser: lazy science subject assets, offline cache, and retry.
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {chromium} from 'playwright';
import app from './index.js';
let requests=[];
const server=createServer(async(req,res)=>{
 try{
  if(/^\/education\/study-v1\/(math|physics|chemistry|biology)\.json$/.test(req.url)){res.writeHead(200,{'Content-Type':'application/json'});res.end(await readFile(new URL('./public'+req.url,import.meta.url)));return}
  const m=req.url.match(/^\/education\/science\/shared-v2\/(physics|chemistry|biology|astronomy)\.json$/);
  if(m){requests.push(m[1]);res.writeHead(200,{'Content-Type':'application/json'});res.end(await readFile(new URL('./public/education/science/shared-v2/'+m[1]+'.json',import.meta.url)));return}
  const origin='http://127.0.0.1:'+server.address().port;
  const response=await app.fetch(new Request(origin+req.url,{headers:req.headers}));
  res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));
 }catch(error){res.writeHead(500);res.end(String(error))}
});
await new Promise(ok=>server.listen(0,'127.0.0.1',ok));
const browser=await chromium.launch({headless:true,args:['--no-sandbox'],...(process.env.CHROMIUM_EXECUTABLE_PATH?{executablePath:process.env.CHROMIUM_EXECUTABLE_PATH}:{})});
const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,locale:'ro-RO'});
const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(String(e)));
const click=async locator=>{await locator.first().waitFor({state:'attached',timeout:15000});await locator.first().evaluate(x=>x.click())};
const years=()=>page.locator('#view-module .science-year-tile').first();
const tile=label=>page.locator('#view-module .science-subject-tile').filter({hasText:label});
const back=()=>click(page.locator('#view-module .science-stage-back'));
try{
 await page.goto('http://127.0.0.1:'+server.address().port+'/?nativeLaunch=1',{waitUntil:'domcontentloaded',timeout:30000});
 await click(page.locator('[data-module="learning"]'));
 const notice=page.locator('#education-first-use-notice');
 if(await notice.count()){await click(notice.locator('button'));await notice.waitFor({state:'detached'})}
 await click(page.locator('#view-module .education-card').filter({hasText:'Științe'}));
 const country=page.locator('#eduCountryInput');
 if(await country.count()&&await country.isVisible()){
  await country.fill('România');await click(page.locator('.edu-country-matches button').filter({hasText:'România'}));
  await click(page.locator('#view-module button').filter({hasText:'Continuă'}));
 }
 await click(tile('Fizică'));await years().waitFor({state:'attached',timeout:15000});
 assert.deepEqual(requests,['physics'],'Only selected subject should be fetched');
 await back();await context.setOffline(true);
 await click(tile('Fizică'));await years().waitFor({state:'attached',timeout:15000});
 await back();await click(tile('Biologie'));
 const retry=page.locator('.science-shared-retry');await retry.waitFor({state:'visible',timeout:15000});
 assert.match(await page.locator('#moduleContent').innerText(),/nu sunt disponibile offline|not available offline/i);
 await context.setOffline(false);await click(retry);await years().waitFor({state:'attached',timeout:15000});
 await back();await click(tile('Chimie'));await years().waitFor({state:'attached',timeout:15000});
 await back();await click(tile('Astronomie'));await years().waitFor({state:'attached',timeout:15000});
 assert.deepEqual(requests,['physics','biology','chemistry','astronomy']);
 assert.deepEqual(errors,[]);
 console.log('PASS mobile Chromium: all science assets, cached offline subject, unavailable uncached subject and retry');
}finally{await browser.close();await new Promise(ok=>server.close(ok))}
