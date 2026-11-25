import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {chromium} from 'playwright';
import app from './index.js';
const requests=[];
const server=createServer(async(req,res)=>{
 try{
  const match=req.url.match(/^\/education\/math\/supplements\/([A-Z-]+)\.json$/);
  if(match){requests.push(match[1]);res.writeHead(200,{'Content-Type':'application/json'});res.end(await readFile(new URL('./public/education/math/supplements/'+match[1]+'.json',import.meta.url)));return}
  const response=await app.fetch(new Request('http://127.0.0.1:'+server.address().port+req.url,{headers:req.headers}));
  res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));
 }catch(error){res.writeHead(500);res.end(String(error))}
});
await new Promise(ok=>server.listen(0,'127.0.0.1',ok));
const browser=await chromium.launch({headless:true,args:['--no-sandbox'],...(process.env.CHROMIUM_EXECUTABLE_PATH?{executablePath:process.env.CHROMIUM_EXECUTABLE_PATH}:{})});
const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,locale:'ro-RO'});
const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(String(e)));
const click=async locator=>{await locator.first().waitFor({state:'attached',timeout:15000});await locator.first().evaluate(x=>x.click())};
const choose=async name=>{
 const country=page.locator('#eduCountryInput');await country.fill(name);
 await click(page.locator('.edu-country-matches button').filter({hasText:name}));
 await click(page.locator('#view-module button').filter({hasText:'Continuă'}));
};
const start=async name=>{
 await click(page.locator('[data-module="learning"]'));
 const notice=page.locator('#education-first-use-notice');
 if(await notice.count()){await click(notice.locator('button'));await notice.waitFor({state:'detached'})}
 await click(page.locator('#view-module .education-card').filter({hasText:'Matematică'}));
 await choose(name);
};
try{
 await page.goto('http://127.0.0.1:'+server.address().port+'/?nativeLaunch=1&mathQa=1',{waitUntil:'domcontentloaded',timeout:30000});
 await start('Norvegia');
 await page.locator('#view-module .math-choice-row').first().waitFor({state:'attached',timeout:15000});
 await click(page.locator('#view-module .math-choice-row').nth(1));
 const grade=page.locator('#view-module .edu-grade-panel input');await grade.waitFor();await grade.fill('8');
 await click(page.locator('#view-module .edu-grade-choice-grid button'));
 await click(page.locator('#view-module .math-choice-row').filter({hasText:'Algebră'}));
 const titles=await page.locator('#view-module .math-choice-row strong').allTextContents();
 assert.ok(titles.includes('Regnerekkefølge'),JSON.stringify(titles));
 assert.deepEqual(requests,['NO'],'Only selected country supplement is loaded');
 await context.setOffline(true);
 await start('Norvegia');
 await page.locator('#view-module .math-choice-row').first().waitFor({state:'attached',timeout:15000});
 // A different country has no cached supplement and must show a retry.
 await start('Finlanda');
 const retry=page.locator('.math-supplement-retry');await retry.waitFor({state:'visible',timeout:15000});
 assert.match(await page.locator('#moduleContent').innerText(),/nu sunt disponibile offline|not available offline/i);
 await context.setOffline(false);await click(retry);
 await page.locator('#view-module .math-choice-row').first().waitFor({state:'attached',timeout:15000});
 assert.deepEqual(requests,['NO','FI']);assert.deepEqual(errors,[]);
 console.log('PASS mobile Chromium Maths: Norwegian starter from pack, cached offline, missing country and retry');
}finally{await browser.close();await new Promise(ok=>server.close(ok))}
