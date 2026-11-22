// Exercises the actual generated frontend in mobile Chromium (rather than a
// synthetic DOM), including all school years and high-school page contents.
import app from './index.js';
import assert from 'node:assert/strict';
import http from 'node:http';
import fs from 'node:fs';
import {chromium} from 'playwright';
fs.mkdirSync('astronomy-browser-audit',{recursive:true});
const server=http.createServer(async(req,res)=>{
 try{
  const response=await app.fetch(new Request('http://localhost:3879'+req.url),{COMMUNICATION_ORACLE_ORIGIN:''});
  res.writeHead(response.status,Object.fromEntries(response.headers));
  res.end(Buffer.from(await response.arrayBuffer()));
 }catch(error){res.writeHead(500);res.end(String(error));}
});
await new Promise(resolve=>server.listen(3879,'127.0.0.1',resolve));
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1,isMobile:true,hasTouch:true,locale:'ro-RO'});
let testedYears=0,openedLessons=0,upperLessons=0;
const browserErrors=[];
page.on('pageerror',e=>browserErrors.push('page error: '+String(e)));
page.on('console',m=>{if(m.type()==='error')browserErrors.push('console: '+m.text())});
try{
 await page.goto('http://127.0.0.1:3879/?nativeLaunch=1&astronomyQa=1',{waitUntil:'domcontentloaded',timeout:30000});
 await page.locator('[data-module="learning"]').first().waitFor({state:'attached',timeout:15000});
 await page.locator('[data-module="learning"]').first().evaluate(el=>el.click());
 await page.locator('#view-module .education-card:has-text("Științe")').first().waitFor({state:'attached',timeout:10000});
 await page.locator('#view-module .education-card:has-text("Științe")').first().evaluate(el=>el.click());
 let intro=await page.locator('#view-module').innerText();
 if(!intro.includes('Astronomie')){
  const country=page.locator('#eduCountryInput');
  if(await country.count()&&await country.isVisible()){
   await country.fill('România');
   const pick=page.locator('#view-module .edu-country-matches button:has-text("România")').first();
   await pick.waitFor({state:'attached',timeout:8000});
   await pick.evaluate(el=>el.click());
   const cont=page.locator('#view-module button:has-text("Continuă")').first();
   if(await cont.count())await cont.evaluate(el=>el.click());
  }
  intro=await page.locator('#view-module').innerText();
 }
 if(!intro.includes('Astronomie')){
  const science=page.locator('#view-module button:has-text("Științe")').first();
  if(await science.count())await science.evaluate(el=>el.click());
 }
 const astro=page.locator('#view-module .science-subject-tile:has-text("Astronomie")').first();
 await astro.waitFor({state:'attached',timeout:10000});
 await astro.evaluate(el=>el.click());
 assert.ok(await page.locator('#view-module .science-year-tile').count()>=12,
  'All 12 Romanian school-year buttons must appear in actual UI');

 for(const grade of Array.from({length:12},(_,i)=>i+1)){
  // The preceding grade returns via the visible Back control, not a hidden test hook.
  const all=await page.locator('.science-year-tile').allTextContents();
  const patterns=[new RegExp('(?:Clasa\\s+(?:a\\s+)?)'+grade+'\\b','i'),new RegExp('(?:Grade\\s+)'+grade+'\\b','i')];
  const index=all.findIndex(x=>patterns.some(rx=>rx.test(x)));
  assert.ok(index>=0,'Actual Romanian year button not rendered: '+grade+'; found: '+all.join('|'));
  await page.locator('.science-year-tile').nth(index).evaluate(el=>el.click());
  const subject=await page.locator('.science-choice-list > .science-choice-row').count();
  assert.ok(subject>=2,'No visible science chapters in school grade '+grade);
  if(grade>=9)assert.equal(subject,({9:5,10:6,11:6,12:8})[grade],
   'The grade '+grade+' upper-secondary chapter plan is incomplete');
  const visible=await page.locator('.science-choice-list > .science-choice-row').first().isVisible();
  assert.ok(visible,'Chapter buttons visually hidden in grade '+grade);
  const headings=await page.locator('.science-choice-list > .science-choice-row strong').allTextContents();
  assert.ok(headings.length>=2,'Lesson chapter titles missing grade '+grade);
  await page.locator('.science-choice-list > .science-choice-row').first().evaluate(el=>el.click());
  const actions=await page.locator('.chemistry-section-tile').count();
  assert.equal(actions,3,'Grade '+grade+' chapter has no study/exercises/practical menu');
  await page.locator('.chemistry-section-tile').first().evaluate(el=>el.click());
  const studyCards=page.locator('.science-inline-theory-item');
  const lessons=await studyCards.count();
  assert.ok(lessons>=2,'Real browser grade '+grade+' has an empty study chapter');
  if(grade>=9){
   assert.ok(lessons>=5,'High-school grade '+grade+' needs detailed age-linked study cards');
   const advanced=await studyCards.last().innerText();
   assert.ok(advanced.includes(' · '),'No age-progressive in-depth school lesson in grade '+grade);
  }
  await studyCards.last().evaluate(el=>el.click());
  const dialog=page.locator('#educationPagedLessonDialog');
  await dialog.waitFor({state:'visible',timeout:8000});
  const startText=await dialog.locator('.education-paged-text').innerText();
  assert.ok(startText.length>160,'Real Android-like browser empty lesson grade '+grade);
  const pageCount=await dialog.locator('.education-paged-controls').innerText();
  assert.match(pageCount,/Pagina\s*1\s*\/\s*\d+/,'Paged reader must show navigation');
  if(grade>=9){
   const title=await dialog.locator('.education-paged-title').innerText();
   assert.ok(title.length>=15,'High-school lesson lacks title');
   upperLessons++;
  }
  openedLessons++;
  await dialog.screenshot({path:'astronomy-browser-audit/grade-'+grade+'.png'});
  await dialog.locator('.education-theory-head button').first().evaluate(el=>el.click());
  // Reader → chapter activities → chapter list → grade selection.
  for(let back=0;back<3;back++){
   const btn=page.locator('#view-module .science-stage-back').first();
   assert.ok(await btn.count(),'Missing scoped Back at grade '+grade+' step '+back);
   await btn.evaluate(el=>el.click());
  }
  assert.ok(await page.locator('#view-module .science-year-tile').count()>=12,
   'Back does not return to all grade buttons from grade '+grade);
  testedYears++;
 }
 console.log('PASS Chromium Astronomy all '+testedYears+' actual Romanian grades, '+openedLessons+
  ' opened nonempty paged lessons, '+upperLessons+' extended high-school lessons, visible study UI');
}catch(error){
 try{
  await page.screenshot({path:'astronomy-browser-audit/browser-failure.png',fullPage:true});
  fs.writeFileSync('astronomy-browser-audit/browser-failure.txt',
   JSON.stringify({error:String(error),browserErrors,url:page.url(),
    stage:await page.locator('#view-module').innerText().catch(()=>null)},null,2));
 }catch{}
 throw error;
}finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
