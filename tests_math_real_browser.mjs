import assert from 'node:assert/strict';
import http from 'node:http';
import fs from 'node:fs';
import app from './index.js';
import {chromium} from 'playwright';

const origin='http://127.0.0.1:3992';
fs.mkdirSync('math-browser-audit',{recursive:true});
const server=http.createServer(async(req,res)=>{
 try{
  const response=await app.fetch(new Request(origin+req.url),{COMMUNICATION_ORACLE_ORIGIN:''});
  res.writeHead(response.status,Object.fromEntries(response.headers));
  res.end(Buffer.from(await response.arrayBuffer()));
 }catch(error){res.writeHead(500);res.end(String(error))}
});
await new Promise(resolve=>server.listen(3992,'127.0.0.1',resolve));
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1,isMobile:true,hasTouch:true,locale:'ro-RO'});
const errors=[];
page.on('pageerror',err=>errors.push(String(err)));
async function click(locator){
 await locator.waitFor({state:'attached',timeout:10000});
 await locator.evaluate(el=>el.click());
}
async function chooseCountry(name){
 const input=page.locator('#eduCountryInput');
 await input.waitFor({state:'visible',timeout:10000});
 await input.fill(name);
 await click(page.locator('#view-module .edu-country-matches button').filter({hasText:name}).first());
 await click(page.locator('#view-module button').filter({hasText:'Continuă'}).first());
}
async function pickMathStage(stage){
 await click(page.locator('#view-module .math-choice-row').filter({hasText:stage}).first());
}
async function pickGrade(label){
 const search=page.locator('#view-module .edu-grade-panel input');
 await search.waitFor({state:'attached',timeout:10000});
 await search.fill(label);
 const buttons=page.locator('#view-module .edu-grade-choice-grid button');
 await click(buttons.first());
}
try{
 await page.goto(origin+'/?nativeLaunch=1&mathQa=1',{waitUntil:'domcontentloaded',timeout:30000});
 await click(page.locator('[data-module="learning"]').first());
 // The first-use disclosure is a real modal: dismiss it through its visible
 // acknowledgement button before assessing screen content or navigation.
 const firstNotice=page.locator('#education-first-use-notice');
 if(await firstNotice.count()){
  await firstNotice.locator('button').first().click();
  await firstNotice.waitFor({state:'detached',timeout:5000});
 }
 await click(page.locator('#view-module .education-card').filter({hasText:'Matematică'}).first());
 await chooseCountry('România');
 const stageButtons=await page.locator('#view-module .math-choice-row').allTextContents();
 for(const stage of ['Primar','Gimnaziu','Liceu','Universitate'])
  assert.ok(stageButtons.some(x=>x.includes(stage)),'Missing Maths school stage: '+stage);
 await page.locator('#math-theory-quick-reference').waitFor({state:'visible',timeout:10000});
 await click(page.locator('#math-theory-quick-reference'));
 const theoremList=page.locator('#moduleContent .math-theory-scroll-list');
 await theoremList.waitFor({state:'visible'});
 // Regression for Android's global picker: a branch selector must allow
 // swiping through ALL mathematical branches, not just the first four.
 const branchPicker=page.locator('#moduleContent .math-theory-reference-panel select');
 assert.equal(await branchPicker.getAttribute('data-pocket-picker-mode'),'scroll',
  'Theorem branch picker must request the swipeable Android modal');
 await branchPicker.evaluate(el=>el.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true,button:0})));
 await page.locator('#pocketSelectDialog').waitFor({state:'visible'});
 assert.ok(await page.locator('#pocketSelectDialog').evaluate(el=>el.classList.contains('pocket-select-scroll-mode')),
  'Theorem branch picker must use the scroll modal, not a four-item-only modal');
 const pickerItems=await page.locator('#pocketSelectList .pocket-select-option').count();
 assert.ok(pickerItems>=8,'More than four theorem branches must be rendered before typing');
 const pickerScroll=await page.locator('#pocketSelectList').evaluate(el=>{
  el.scrollTop=el.scrollHeight;return {top:el.scrollTop,scrollHeight:el.scrollHeight,clientHeight:el.clientHeight}
 });
 assert.ok(pickerScroll.scrollHeight>pickerScroll.clientHeight&&pickerScroll.top>0,
  'Android theorem branch picker must physically scroll');
 await click(page.locator('#pocketSelectClose'));
 const scroll=await theoremList.evaluate(el=>{el.scrollTop=el.scrollHeight;return {top:el.scrollTop,height:el.scrollHeight,client:el.clientHeight}});
 assert.ok(scroll.height>scroll.client&&scroll.top>0,'Mathematics reference list must scroll by touch');
 await page.locator('#moduleContent input[type="search"]').fill('Pitagora');
 await click(theoremList.locator('button').filter({hasText:'Pitagora'}).first());
 assert.ok((await page.locator('#moduleContent article').innerText()).includes('triunghi'));
 await click(page.locator('#moduleContent > button').first());
 await pickMathStage('Primar');
 await pickGrade('1');
 let branches=await page.locator('#view-module .math-choice-list .math-choice-row').allTextContents();
 assert.ok(branches.some(x=>x.includes('Aritmetică')),'Primary arithmetic missing');
 assert.ok(branches.some(x=>x.includes('Forme geometrice')),'Primary shapes missing');
 assert.ok(!branches.some(x=>x.includes('Algebră')),'Algebra branch must not appear in first primary year');
 await click(page.locator('#view-module .math-choice-row').filter({hasText:'Aritmetică'}).first());
 let chapters=await page.locator('#view-module .math-choice-row').count();
 assert.ok(chapters>=6&&chapters<=9,'Primary year one must expose its expanded set of distinct age-appropriate lessons');
 assert.equal(await page.locator('#view-module .math-choice-row').filter({hasText:'Teorie'}).count(),0,
  'No duplicate Theory tile beside real chapters');
 assert.equal(await page.locator('#view-module .math-practice-entry').count(),1,
  'Exactly one exercise workspace entry per branch');
 assert.equal(await page.locator('#education-first-use-notice').count(),0,'First-use disclosure must not cover lesson tiles');
 await page.screenshot({path:'math-browser-audit/romanian-primary.png'});
 // Back via the actual Android-sized controls: chapter → branches → grades → stages.
 await click(page.locator('#view-module .math-stage-back').first());
 const firstBackState=await page.locator('#view-module').evaluate(el=>({stage:el.dataset.mathStage,text:el.innerText.slice(0,180)}));
 await click(page.locator('#view-module .math-stage-back').first());
 const secondBackState=await page.locator('#view-module').evaluate(el=>({stage:el.dataset.mathStage,text:el.innerText.slice(0,180)}));
 {const gradePanel=page.locator('#view-module .edu-grade-panel');
 if(!await gradePanel.count()){
  const snapshot=await page.locator('#moduleContent').evaluate(node=>({text:node.innerText.slice(0,1200),html:node.innerHTML.slice(0,1600)}));
  throw Error('Grade picker missing after branch Back: '+JSON.stringify({firstBackState,secondBackState,snapshot}));
 }
 await click(page.locator('#view-module .module-actions-row .pocket-inline-back, #view-module .education-toolbar button').first());}
 await pickMathStage('Gimnaziu');
 await pickGrade('5');
 branches=await page.locator('#view-module .math-choice-list .math-choice-row').allTextContents();
 assert.ok(branches.some(x=>x.includes('Algebră')),'Romanian class V must show algebra');
 assert.ok(!branches.some(x=>x.includes('Aritmetică')),'Romanian class V must not show standalone arithmetic');
 await click(page.locator('#view-module .math-choice-row').filter({hasText:'Algebră'}).first());
 const algebraChapterTitles=await page.locator('#view-module .math-choice-row strong').allTextContents();
 assert.ok(algebraChapterTitles.length>=5,'Class V Algebra must have at least five distinct detailed lessons, not one repeated chapter');
 assert.equal(new Set(algebraChapterTitles).size,algebraChapterTitles.length,'Algebra school-year chapter titles duplicated');
 await page.screenshot({path:'math-browser-audit/romanian-lower.png'});
 await click(page.locator('#view-module .math-choice-row').filter({hasText:'Numere naturale și valoarea pozițională'}).first());
 assert.equal(await page.locator('#mathEducationWorkspace').count(),0,
  'Chapter must open its own lesson rather than the shared editor');
 const reader=page.locator('#educationPagedLessonDialog');
 await reader.waitFor({state:'visible',timeout:10000});
 const lessonText=await reader.innerText();
 assert.ok(lessonText.includes('Definiție și explicație')&&lessonText.includes('Exersează singur'),
  'Opening a chapter must show its full explanation, worked example and practice');
 assert.ok(lessonText.length>400,'Class V maths lesson is too short');
 await click(reader.locator('.education-theory-head button').first());
 await click(page.locator('#view-module .math-practice-entry'));
 await page.locator('#mathEducationWorkspace').waitFor({state:'attached',timeout:10000});
 await click(page.locator('#view-module .math-workspace-back').first());
 await click(page.locator('#view-module .math-stage-back').first());
 await click(page.locator('#view-module .math-stage-back').first());
 {const gradePanel=page.locator('#view-module .edu-grade-panel');
 if(!await gradePanel.count()){
  const snapshot=await page.locator('#moduleContent').evaluate(node=>({text:node.innerText.slice(0,1200),html:node.innerHTML.slice(0,1600)}));
  throw Error('Grade picker missing after branch Back: '+JSON.stringify(snapshot));
 }
 await click(page.locator('#view-module .module-actions-row .pocket-inline-back, #view-module .education-toolbar button').first());}
 await click(page.locator('#view-module .math-stage-back').first()); // country picker
 await chooseCountry('Anglia');
 await pickMathStage('Primar');
 await pickGrade('Year 1');
 branches=await page.locator('#view-module .math-choice-list .math-choice-row').allTextContents();
 assert.ok(branches.some(x=>x.includes('Aritmetică')),'England Y1 has no primary arithmetic');
 assert.ok(!branches.some(x=>x.includes('Algebră')),'England Y1 shows formal algebra');
 await page.screenshot({path:'math-browser-audit/england-year1.png'});
 // University years must have their own advanced material, not reuse the
 // same primary-school pictures or a single empty "university" placeholder.
 await click(page.locator('#view-module .math-stage-back').first());
 const gradeBack=page.locator('#view-module .module-actions-row .pocket-inline-back, #view-module .education-toolbar button').first();
 await click(gradeBack);
 await pickMathStage('Universitate');
 await pickGrade('1');
 const universityBranches=await page.locator('#view-module .math-choice-list .math-choice-row strong').allTextContents();
 assert.ok(universityBranches.some(x=>x.includes('Analiză matematică')),'University analysis branch unavailable');
 assert.ok(universityBranches.some(x=>x.includes('Algebră liniară')),'University linear algebra branch unavailable');
 await click(page.locator('#view-module .math-choice-row').filter({hasText:'Analiză matematică'}).first());
 const universityLessons=await page.locator('#view-module .math-choice-list .math-choice-row strong').allTextContents();
 assert.ok(universityLessons.length>=3,'University analysis needs multiple distinct complete lessons');
 await page.screenshot({path:'math-browser-audit/england-university.png'});
 await click(page.locator('#view-module .math-choice-row').filter({hasText:'Secvențe numerice și limita lor'}).first());
 assert.equal(await page.locator('#mathEducationWorkspace').count(),0,
  'University chapters must open lessons, not a generic problem workspace');
 await page.locator('#educationPagedLessonDialog').waitFor({state:'visible',timeout:10000});
 assert.match(await page.locator('#educationPagedLessonDialog').innerText(),/convergență|Convergență|limita/i,
  'University Year 1 analysis must contain the actual lesson, not a placeholder');
 assert.equal(errors.length,0,'Unexpected JavaScript errors: '+errors.slice(0,5).join('; '));
 console.log('PASS mobile Chromium maths: Romania primary + lower secondary, theorem reference, England Y1, Back and branches');
}finally{
 await browser.close();await new Promise(resolve=>server.close(resolve));
}
