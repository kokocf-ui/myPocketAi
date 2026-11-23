import assert from 'node:assert/strict';
import http from 'node:http';
import fs from 'node:fs';
import app from './index.js';
import {chromium} from 'playwright';

// Regression tests for two UI regressions reported on 2026-11-23:
//  1. The Education header "← Acasă" (Home) button was hidden by a
//     navigation-contract rule that set `.module-home-btn{display:none!important}`.
//  2. In Mathematics, opening "📚 Legi și teoreme" and selecting a law/theorem
//     no longer opened its own study window; the inline details were clipped
//     inside the branch panel.
const origin='http://127.0.0.1:3987';
fs.mkdirSync('regression-browser-audit',{recursive:true});
const server=http.createServer(async(req,res)=>{
 try{
  const response=await app.fetch(new Request(origin+req.url),{COMMUNICATION_ORACLE_ORIGIN:''});
  res.writeHead(response.status,Object.fromEntries(response.headers));
  res.end(Buffer.from(await response.arrayBuffer()));
 }catch(error){res.writeHead(500);res.end(String(error))}
});
await new Promise(resolve=>server.listen(3987,'127.0.0.1',resolve));
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1,isMobile:true,hasTouch:true,locale:'ro-RO'});
const errors=[];
page.on('pageerror',err=>errors.push(String(err)));
async function click(locator){
 await locator.waitFor({state:'attached',timeout:10000});
 await locator.evaluate(el=>el.click());
}
try{
 await page.goto(origin+'/?nativeLaunch=1&mathQa=1',{waitUntil:'domcontentloaded',timeout:30000});
 await click(page.locator('[data-module="learning"]').first());
 const firstNotice=page.locator('#education-first-use-notice');
 if(await firstNotice.count()){
  await firstNotice.locator('button').first().click();
  await firstNotice.waitFor({state:'detached',timeout:5000});
 }
 // 1) Header Home button must be visible on the Education home screen.
 const home=page.locator('#view-module .module-actions-row > .module-home-btn');
 await home.waitFor({state:'attached',timeout:10000});
 assert.equal(await home.isVisible(),true,'The header Acasă button must be visible on the Education home screen');
 const homeText=await home.innerText();
 assert.ok(/Acasă/i.test(homeText),'Header Home button must read Acasă; got '+JSON.stringify(homeText));

 // Open Mathematics.
 await click(page.locator('#view-module .education-card').filter({hasText:'Matematică'}).first());
 const input=page.locator('#eduCountryInput');
 await input.waitFor({state:'visible',timeout:10000});
 await input.fill('România');
 await click(page.locator('#view-module .edu-country-matches button').filter({hasText:'România'}).first());
 await click(page.locator('#view-module button').filter({hasText:'Continuă'}).first());
 await page.waitForTimeout(600);

 // Home must remain visible inside the active Mathematics screen.
 assert.equal(await home.isVisible(),true,'The header Acasă button must stay visible in the active Mathematics screen');

 // 2) Opening "Legi și teoreme" and selecting an item must open a full study window.
 await click(page.locator('#math-theory-quick-reference'));
 const theoremList=page.locator('#moduleContent .math-theory-scroll-list');
 await theoremList.waitFor({state:'visible'});
 await click(theoremList.locator('button').nth(1));
 const reader=page.locator('#educationPagedLessonDialog');
 await reader.waitFor({state:'visible',timeout:10000});
 const box=await reader.boundingBox();
 assert.ok(box&&box.width>=300&&box.height>=600,'The theorem must open a full-screen study window, not a clipped inline box');
 const lessonText=await reader.innerText();
 assert.ok(/Definiție|Formula|Exemplu/i.test(lessonText),'The study window must contain definition/formula/example content; got '+JSON.stringify(lessonText.slice(0,120)));
 assert.equal(await page.locator('#moduleContent .math-theory-detail[hidden]').count(),0,'No clipped inline details box should be shown instead of the window');
 // Closing returns to the theorem list.
 await click(reader.locator('.education-theory-head button').first());
 await reader.waitFor({state:'detached',timeout:5000});
 assert.equal(await theoremList.isVisible(),true,'Closing the study window must return to the theorem list');
 assert.equal(errors.length,0,'No uncaught page errors while exercising Home + theorem window; got '+JSON.stringify(errors.slice(0,3)));
 console.log('PASS header Acasă visible; Math theorem opens its own full study window');
 await browser.close();server.close();
}catch(error){
 console.error('FAIL',error);
 try{await browser.close()}catch{}
 try{server.close()}catch{}
 process.exit(1);
}
