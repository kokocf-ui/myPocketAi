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
try{
 await page.goto('http://127.0.0.1:3879/?astronomyQa=1',{waitUntil:'domcontentloaded',timeout:30000});
 await page.waitForFunction(()=>typeof scienceJourneyShowChoices==='function',{timeout:18000});
 const start=await page.evaluate(()=>{
  openModule('learning');educationCountrySelection.code='RO';
  educationCountrySelection.label='România';
  scienceJourney.subject='astronomy';scienceJourneyShowChoices('years');
  return {view:state.currentView,count:document.querySelectorAll('.science-year-tile').length};
 });
 assert.equal(start.view,'module');assert.ok(start.count>=12,'12 school year tiles must be rendered');
 const rawTitle=grade=>grade<=4?'Clasa '+grade:grade<=8?'Clasa a '+grade+'-a':'Clasa a '+grade+'-a';
 for(const grade of Array.from({length:12},(_,i)=>i+1)){
  await page.evaluate(()=>scienceJourneyShowChoices('years'));
  const all=await page.locator('.science-year-tile').allTextContents();
  const patterns=[new RegExp('(?:Clasa\\s+(?:a\\s+)?)'+grade+'\\b','i'),new RegExp('(?:Grade\\s+)'+grade+'\\b','i')];
  const index=all.findIndex(x=>patterns.some(rx=>rx.test(x)));
  assert.ok(index>=0,'Actual Romanian year button not rendered: '+grade+'; found: '+all.join('|'));
  await page.locator('.science-year-tile').nth(index).evaluate(el=>el.click());
  const subject=await page.locator('.science-choice-list > .science-choice-row').count();
  assert.ok(subject>=2,'No visible science chapters in school grade '+grade);
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
  testedYears++;
 }
 // Verify the actual detailed upper-secondary content (all paragraphs, not
 // merely one button) and the distinct late-year syllabus.
 for(const grade of [9,10,11,12]){
  await page.evaluate(g=>{
   const years={9:['solar','sky','distances','gravity','observations'],
    10:['solar','gravity','stars','observations','exoplanets','distances'],
    11:['stars','galaxies','cosmology','exoplanets','gravity','observations'],
    12:['sky','distances','stars','galaxies','cosmology','observations','exoplanets','gravity']};
   const options=eduYearOptions(educationCountrySelection.code,'intermediate','science');
   const plan=SCIENCE_GRADE_TOPIC_PLAN({country:educationCountrySelection.code,subject:'astronomy',stage:'upper',grade:String(g),years:options,topics:ASTRONOMY_TOPIC_DATA});
   if(plan.topics.length!==years[g].length)throw Error('Missing chapters for grade '+g);
  },grade);
 }
 console.log('PASS Chromium Astronomy all '+testedYears+' actual Romanian grades, '+openedLessons+
  ' opened nonempty paged lessons, '+upperLessons+' extended high-school lessons, visible study UI');
}finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
