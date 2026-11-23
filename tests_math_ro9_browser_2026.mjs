import assert from 'node:assert/strict';
import http from 'node:http';
import frontend from './index.js';
import {chromium} from 'playwright';

const origin='http://127.0.0.1:4391';
const server=http.createServer(async(req,res)=>{
 try{
  const result=await frontend.fetch(new Request(origin+req.url),{
   COMMUNICATION_ORACLE_ORIGIN:''
  });
  res.writeHead(result.status,Object.fromEntries(result.headers));
  res.end(Buffer.from(await result.arrayBuffer()));
 }catch(error){res.writeHead(500);res.end(String(error))}
});
await new Promise(ok=>server.listen(4391,'127.0.0.1',ok));
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,
 hasTouch:true,locale:'ro-RO'});
const errors=[];
page.on('pageerror',e=>errors.push(String(e)));
const click=async locator=>{
 await locator.waitFor({state:'attached',timeout:15000});
 await locator.evaluate(el=>el.click());
};
try{
 await page.goto(origin+'/?nativeLaunch=1&mathQa=1',{waitUntil:'domcontentloaded',timeout:30000});
 await click(page.locator('[data-module="learning"]').first());
 const notice=page.locator('#education-first-use-notice');
 if(await notice.count()){
  await notice.locator('button').first().click();
  await notice.waitFor({state:'detached',timeout:5000});
 }
 await click(page.locator('#view-module .education-card').filter({hasText:'Matematică'}).first());
 const input=page.locator('#eduCountryInput');
 await input.fill('România');
 await click(page.locator('#view-module .edu-country-matches button').filter({hasText:'România'}).first());
 await click(page.locator('#view-module button').filter({hasText:'Continuă'}).first());
 await click(page.locator('#view-module .math-choice-row').filter({hasText:'Liceu'}).first());
 const search=page.locator('#view-module .edu-grade-panel input');
 await search.fill('Științe ale naturii');
 await click(page.locator('#view-module .edu-grade-choice-grid button').first());
 const branches=await page.locator('#view-module .math-choice-list .math-choice-row').allTextContents();
 assert.ok(branches.some(x=>x.includes('Numere reale')),
  'Romanian IX 2026 curriculum branches must be the actual seven-unit track, not a generic algebra menu');
 assert.ok(branches.some(x=>x.includes('Trigonometrie')));
 assert.ok(!branches.some(x=>x.includes('Statistică')),
  'The 2026 science-track textbook does not contain a separate statistics unit');
 await click(page.locator('#view-module .math-choice-row').filter({hasText:'Numere reale'}).first());
 const chapters=await page.locator('#view-module .math-choice-row strong').allTextContents();
 assert.equal(chapters.length,20,'The four algebraic 2026 textbook units contain 20 authored chapters; actual '+JSON.stringify(chapters));
 for(const required of ['Mulțimi numerice și incluziuni','Negația și conectorii logici',
  'Rădăcinile unui polinom și teorema factorului','Suma progresiei geometrice finite']){
  assert.ok(chapters.some(x=>x.includes(required)),'Missing 2026 textbook chapter on screen: '+required);
 }
 await click(page.locator('#view-module .math-choice-row').filter({hasText:'Negația și conectorii logici'}).first());
 const reader=page.locator('#educationPagedLessonDialog');
 await reader.waitFor({state:'visible',timeout:10000});
 const lesson=await reader.innerText();
 assert.ok(lesson.includes('Definiție și explicație')&&lesson.includes('Exersează singur'));
 assert.ok(lesson.includes('Conjuncția')||lesson.includes('conjuncția'),'Reader must show selected authored logical connective lesson');
 assert.equal(errors.length,0,'Mobile maths browser JavaScript errors '+errors.join(' | '));
 console.log('PASS real Android-size Grade IX RO 2026 science-track algebra picker: 20 source units and opened authored theory');
}finally{
 await page.close();await browser.close();
 await new Promise(ok=>server.close(ok));
}
