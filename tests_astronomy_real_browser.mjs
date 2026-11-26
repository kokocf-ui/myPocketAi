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
  const asset=req.url.match(/^\/education\/science\/shared-v2\/(physics|chemistry|biology|astronomy)\.json$/);
  if(asset){res.writeHead(200,{'Content-Type':'application/json'});res.end(fs.readFileSync(new URL('./public/education/science/shared-v2/'+asset[1]+'.json',import.meta.url)));return}

  const response=await app.fetch(new Request('http://localhost:3879'+req.url,{headers:req.headers}),{COMMUNICATION_ORACLE_ORIGIN:''});
  res.writeHead(response.status,Object.fromEntries(response.headers));
  res.end(Buffer.from(await response.arrayBuffer()));
 }catch(error){res.writeHead(500);res.end(String(error));}
});
await new Promise(resolve=>server.listen(3879,'127.0.0.1',resolve));
const browser=await chromium.launch({headless:true,args:['--no-sandbox'],...(process.env.CHROMIUM_EXECUTABLE_PATH?{executablePath:process.env.CHROMIUM_EXECUTABLE_PATH}:{})});
const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1,isMobile:true,hasTouch:true,locale:'ro-RO'});
let testedYears=0,openedLessons=0,upperLessons=0;
let practicals=0,graphs=0;
const upperSvgBodies=[];
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
 await page.locator('#view-module .science-year-tile').first().waitFor({state:'attached',timeout:10000});
 assert.ok(await page.locator('#view-module .science-year-tile').count()>=12,
  'All 12 Romanian school-year buttons must appear in actual UI');

 for(const grade of Array.from({length:12},(_,i)=>i+1)){
  // The preceding grade returns via the visible Back control, not a hidden test hook.
  const all=await page.locator('.science-year-tile').allTextContents();
  const patterns=[new RegExp('(?:Clasa\\s+(?:a\\s+)?)'+grade+'\\b','i'),new RegExp('(?:Grade\\s+)'+grade+'\\b','i')];
  const index=all.findIndex(x=>patterns.some(rx=>rx.test(x)));
  assert.ok(index>=0,'Actual Romanian year button not rendered: '+grade+'; found: '+all.join('|'));
  await page.locator('.science-year-tile').nth(index).evaluate(el=>el.click());
  await page.locator('.science-choice-list > .science-choice-row').first().waitFor({state:'attached',timeout:15000});
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
  // The activity/representation path must be tested by clicks. Static JS
  // unit tests previously allowed empty or unrelated diagrams to ship.
  let backBtn=page.locator('#view-module .science-stage-back').first();
  await backBtn.evaluate(el=>el.click()); // lesson list -> chapter menu
  const labAction=page.locator('#view-module .chemistry-section-tile').nth(2);
  assert.ok((await labAction.innerText()).includes('Activități'),
   'Astronomy activities action missing in grade '+grade);
  await labAction.evaluate(el=>el.click());
  let activityRows=page.locator('#view-module .chemistry-section-tile');
  const activityCount=await activityRows.count();
  assert.equal(activityCount,grade<=4?2:3,
   'Activities not differentiated for grade '+grade);
  const labelTexts=await activityRows.allTextContents();
  assert.equal(new Set(labelTexts).size,activityCount,'Repeated activity cards in grade '+grade);
  await activityRows.first().evaluate(el=>el.click());
  await dialog.waitFor({state:'visible',timeout:8000});
  const practicalContent=await dialog.locator('.education-paged-text').innerText();
  assert.ok(practicalContent.length>160,'Empty practical lesson in grade '+grade);
  if(grade<=4)assert.ok(!practicalContent.includes('T²/a³'),
   'University-grade Kepler equation leaked into primary grade '+grade);
  practicals++;
  await dialog.locator('.education-theory-head button').first().evaluate(el=>el.click());
  if(grade>4){
   activityRows=page.locator('#view-module .chemistry-section-tile');
   await activityRows.nth(1).evaluate(el=>el.click());
   const graph=page.locator('#astronomyPracticalGraphDialog');
   await graph.waitFor({state:'visible',timeout:8000});
   const svg=graph.locator('svg');
   assert.ok(await svg.count(),'Numerical activity has no real SVG graph in grade '+grade);
   assert.ok(await svg.locator('text').count()>4,'Graph is unlabeled in grade '+grade);
   assert.ok(await graph.locator('table tr').count()>=4,'Missing numerical data table in grade '+grade);
   const data=await svg.evaluate(el=>el.outerHTML);
   if(grade>=9)upperSvgBodies.push(data);
   await graph.screenshot({path:'astronomy-browser-audit/practical-graph-'+grade+'.png'});
   await graph.locator('.education-theory-head button').first().evaluate(el=>el.click());
   graphs++;
  }
  activityRows=page.locator('#view-module .chemistry-section-tile');
  const modelIndex=grade<=4?1:2;
  await activityRows.nth(modelIndex).evaluate(el=>el.click());
  const model=page.locator('#astronomyDiagramDialog');
  await model.waitFor({state:'visible',timeout:8000});
  assert.ok(await model.locator('.astronomy-visual svg').count(),
   'No topic-related explanatory diagram in grade '+grade);
  assert.ok((await model.innerText()).includes('Clasa / anul '+grade),
   'Diagram is not explicitly attached to the grade '+grade);
  await model.screenshot({path:'astronomy-browser-audit/practical-diagram-'+grade+'.png'});
  await model.locator('.education-theory-head button').first().evaluate(el=>el.click());
  // Activity menu → chapter menu → chapter list → year selection.
  for(let back=0;back<3;back++){
   const btn=page.locator('#view-module .science-stage-back').first();
   assert.ok(await btn.count(),'Missing scoped Back at grade '+grade+' step '+back);
   await btn.evaluate(el=>el.click());
  }
  assert.ok(await page.locator('#view-module .science-year-tile').count()>=12,
   'Back does not return to all grade buttons from grade '+grade);
  testedYears++;
 }
 assert.equal(upperSvgBodies.length,4);
 assert.equal(new Set(upperSvgBodies).size,4,'Upper-secondary grades still repeat identical plotted datasets');
 // University practicals are not a two-cartoon gallery either.
 const universityButton=page.locator('#view-module .science-year-tile').filter({hasText:'Anul universitar 1'}).first();
 await universityButton.waitFor({state:'attached',timeout:8000});
 await universityButton.evaluate(el=>el.click());
 const specs=page.locator('#view-module .science-choice-row');
 await specs.first().waitFor({state:'attached',timeout:15000});
 assert.ok(await specs.count()>=5,'Missing university specialties');
 await specs.first().evaluate(el=>el.click());
 const course=page.locator('#view-module .science-choice-row').first();
 assert.ok(await course.count(),'University specialty courses missing');
 await course.evaluate(el=>el.click());
 const uniLab=page.locator('#view-module .chemistry-section-tile').nth(2);
 await uniLab.evaluate(el=>el.click());
 const universityTasks=page.locator('#view-module .chemistry-section-tile');
 assert.ok(await universityTasks.count()>=4,
  'University lab still only displays the same two graphics');
 await universityTasks.nth(1).evaluate(el=>el.click());
 const uniGraph=page.locator('#astronomyPracticalGraphDialog');
 await uniGraph.waitFor({state:'visible',timeout:8000});
 const firstPlot=await uniGraph.locator('svg').evaluate(el=>el.outerHTML);
 await uniGraph.screenshot({path:'astronomy-browser-audit/university-data-graph.png'});
 await uniGraph.locator('.education-theory-head button').first().evaluate(el=>el.click());
 await page.locator('#view-module .chemistry-section-tile').filter({hasText:'Analiza reziduurilor'}).first().evaluate(el=>el.click());
 await uniGraph.waitFor({state:'visible',timeout:8000});
 const residualPlot=await uniGraph.locator('svg').evaluate(el=>el.outerHTML);
 assert.notEqual(firstPlot,residualPlot,'University residual model duplicates the first graph');
 assert.ok((await uniGraph.innerText()).includes('Reziduu (%)'),
  'University uncertainty graph has no residual axes');
 await uniGraph.screenshot({path:'astronomy-browser-audit/university-residual-analysis.png'});
 console.log('PASS Chromium Astronomy '+testedYears+' Romanian grades, '+openedLessons+
  ' opened lessons, '+practicals+' grade-specific practicals, '+graphs+
  ' labelled and checked school graphs, distinct university model/residual plots');
}catch(error){
 console.error('::error::Astronomy browser: '+String(error).replace(/\r?\n/g,' '));
 try{
  await page.screenshot({path:'astronomy-browser-audit/browser-failure.png',fullPage:true});
  fs.writeFileSync('astronomy-browser-audit/browser-failure.txt',
   JSON.stringify({error:String(error),browserErrors,url:page.url(),
    stage:await page.locator('#view-module').innerText().catch(()=>null)},null,2));
 }catch{}
 throw error;
}finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
