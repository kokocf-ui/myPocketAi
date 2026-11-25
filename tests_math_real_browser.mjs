import assert from 'node:assert/strict';
import http from 'node:http';
import fs from 'node:fs';
import app from './index.js';
import {chromium} from 'playwright';

const origin='http://127.0.0.1:3992';
fs.mkdirSync('math-browser-audit',{recursive:true});
const server=http.createServer(async(req,res)=>{
 try{
  const asset=req.url.match(/^\/education\/math\/supplements\/([A-Z-]+)\.json$/);
  if(asset){res.writeHead(200,{'Content-Type':'application/json'});res.end(fs.readFileSync(new URL('./public/education/math/supplements/'+asset[1]+'.json',import.meta.url)));return}
  const response=await app.fetch(new Request(origin+req.url),{COMMUNICATION_ORACLE_ORIGIN:''});
  res.writeHead(response.status,Object.fromEntries(response.headers));
  res.end(Buffer.from(await response.arrayBuffer()));
 }catch(error){res.writeHead(500);res.end(String(error))}
});
await new Promise(resolve=>server.listen(3992,'127.0.0.1',resolve));
const browser=await chromium.launch({headless:true,args:['--no-sandbox'],...(process.env.CHROMIUM_EXECUTABLE_PATH?{executablePath:process.env.CHROMIUM_EXECUTABLE_PATH}:{})});
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
// The branch list renders asynchronously after a grade is chosen (the RO/MD
// cohort rules and supplements load first). Wait until the grade panel has
// closed and branch rows exist instead of reading a still-empty list.
async function readBranches(){
 await page.waitForFunction(()=>!document.querySelector('#view-module .edu-grade-panel')&&
  document.querySelectorAll('#view-module .math-choice-list .math-choice-row').length>0,null,{timeout:15000});
 return page.locator('#view-module .math-choice-list .math-choice-row').allTextContents();
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
 await page.locator('#view-module .math-choice-row').first().waitFor({state:'attached',timeout:15000});
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
 // Selecting a theorem opens its own full-screen study window (regression fix).
 const paged=page.locator('#educationPagedLessonDialog');
 await paged.waitFor({state:'visible',timeout:10000});
 assert.ok((await paged.innerText()).includes('triunghi'),'The Pitagora study window must contain the theorem text');
 await click(paged.locator('.education-theory-head button').first());
 await paged.waitFor({state:'detached',timeout:5000});
 // Return from the theory reference panel to the stage picker.
 await click(page.locator('#moduleContent > button').first());
 await pickMathStage('Primar');
 await pickGrade('1');
 let branches=await readBranches();
 assert.ok(branches.some(x=>x.includes('Aritmetică')),'Primary arithmetic missing');
 assert.ok(branches.some(x=>x.includes('Forme geometrice')),'Primary shapes missing');
 assert.ok(!branches.some(x=>x.includes('Algebră')),'Algebra branch must not appear in first primary year');
 await click(page.locator('#view-module .math-choice-row').filter({hasText:'Aritmetică'}).first());
 let chapters=await page.locator('#view-module .math-choice-row').count();
 assert.ok(chapters>=10&&chapters<=12,'Primary year one must expose at least ten distinct age-appropriate arithmetic lessons; found '+chapters+
  '; titles='+JSON.stringify(await page.locator('#view-module .math-choice-row strong').allTextContents())+
  '; errors='+JSON.stringify(errors.slice(0,3)));
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
 branches=await readBranches();
 assert.ok(branches.some(x=>x.includes('Algebră')),'Romanian class V must show algebra');
 assert.ok(!branches.some(x=>x.includes('Aritmetică')),'Romanian class V must not show standalone arithmetic');
 await click(page.locator('#view-module .math-choice-row').filter({hasText:'Algebră'}).first());
 const algebraChapterTitles=await page.locator('#view-module .math-choice-row strong').allTextContents();
 assert.ok(algebraChapterTitles.length>=40,'Romanian class V must expose its full authored annual algebra curriculum, not five placeholders');
 assert.equal(new Set(algebraChapterTitles).size,algebraChapterTitles.length,'Algebra school-year chapter titles duplicated');
 assert.ok(algebraChapterTitles.some(x=>x.includes('Metoda falsei ipoteze')),'Romanian class V missing the false-assumption method');
 assert.ok(algebraChapterTitles.some(x=>x.includes('Reguli de calcul cu puteri')),'Romanian class V missing power laws');
 assert.ok(!algebraChapterTitles.some(x=>x.includes('Ecuații cu o necunoscută')),'Romanian class V must not teach formal algebraic equations');
 assert.ok(await page.locator('.math-lesson-unit-heading').count()>=5,'The theory must be grouped by curricular units');
 await page.screenshot({path:'math-browser-audit/romanian-lower.png'});
 await click(page.locator('#view-module .math-choice-row').filter({hasText:'Scrierea și citirea numerelor naturale'}).first());
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
 branches=await readBranches();
 assert.ok(branches.some(x=>x.includes('Aritmetică')),'England Y1 has no primary arithmetic');
 assert.ok(!branches.some(x=>x.includes('Algebră')),'England Y1 shows formal algebra');
 await page.screenshot({path:'math-browser-audit/england-year1.png'});
 await click(page.locator('#view-module .math-stage-back').first());
 await pickGrade('Year 3');
 branches=await readBranches();
 assert.ok(branches.some(x=>x.includes('Statistică')||x.includes('Date')),
  'DfE England Year 3 must include its statutory data/statistics branch');
 await click(page.locator('#view-module .math-choice-row').filter({hasText:'Aritmetică'}).first());
 const y3Titles=await page.locator('#view-module .math-choice-row strong').allTextContents();
 assert.ok(y3Titles.length>=16,'England Year 3 must expose original source-mapped numerical content');
 assert.ok(y3Titles.some(x=>x.includes('Sute, zeci și unități')),
  'England Year 3 must expose a DfE place-value worked lesson');
 await click(page.locator('#view-module .math-choice-row').filter({hasText:'Sute, zeci și unități'}).first());
 const y3Reader=page.locator('#educationPagedLessonDialog');
 await y3Reader.waitFor({state:'visible'});
 assert.ok((await y3Reader.innerText()).includes('476 = 400 + 70 + 6'),
  'Year 3 reader must open the new original lesson rather than shared generic phase');
 await click(y3Reader.locator('.education-theory-head button').first());
 await page.screenshot({path:'math-browser-audit/england-year3-source.png'});
 await click(page.locator('#view-module .math-stage-back').first());
 await click(page.locator('#view-module .math-stage-back').first());
 await pickGrade('Year 4');
 await click(page.locator('#view-module .math-choice-row').filter({hasText:'Aritmetică'}).first());
 const y4Titles=await page.locator('#view-module .math-choice-row strong').allTextContents();
 assert.ok(y4Titles.length>=17,'England Year 4 must expose its own DfE-authored numeric lessons');
 assert.ok(y4Titles.some(x=>x.includes('Numere negative și trecerea prin zero')));
 await page.screenshot({path:'math-browser-audit/england-year4-source.png'});
 await click(page.locator('#view-module .math-stage-back').first());
 await click(page.locator('#view-module .math-stage-back').first());
 await pickGrade('Year 6');
 branches=await readBranches();
 assert.ok(branches.some(x=>x.includes('Algebră')),'England Year 6 must show its DfE algebra branch');
 assert.ok(branches.some(x=>x.includes('Măsurători')),'England Year 6 must show its distinct measurement branch');
 assert.equal(branches.length,5,'England Year 6 must expose five substantial educational strands');
 await click(page.locator('#view-module .math-choice-row').filter({hasText:'Algebră'}).first());
 const englandAlgebra=await page.locator('#view-module .math-choice-row strong').allTextContents();
 assert.ok(englandAlgebra.length>=6,'England Year 6 Algebra must contain separate theory lessons');
 assert.ok(englandAlgebra.some(x=>x.includes('Simboluri pentru numere necunoscute')),
  'English sixth-year Algebra must teach letters as variables');
 await page.screenshot({path:'math-browser-audit/england-year6-algebra.png'});
 await click(page.locator('#view-module .math-choice-row').filter({hasText:'Simboluri pentru numere necunoscute'}).first());
 await page.locator('#educationPagedLessonDialog').waitFor({state:'visible',timeout:10000});
 assert.ok((await page.locator('#educationPagedLessonDialog').innerText()).includes('n+7'),
  'England Year 6 theory must open its own worked example');
 await click(page.locator('#educationPagedLessonDialog .education-theory-head button').first());
 await click(page.locator('#view-module .math-stage-back').first());
 // University years must have their own advanced material, not reuse the
 // same primary-school pictures or a single empty "university" placeholder.
 await click(page.locator('#view-module .math-stage-back').first());
 const gradeBack=page.locator('#view-module .module-actions-row .pocket-inline-back, #view-module .education-toolbar button').first();
 await click(gradeBack);
 await pickMathStage('Liceu');
 await pickGrade('Year 10');
 assert.equal(await page.locator('#view-module .math-curriculum-status').count(),1,
  'Country/year curriculum status must be visible on the phone');
 assert.match(await page.locator('#view-module .math-curriculum-status').innerText(),/GCSE|Key Stage 4/i,
  'England Year 10 must be labelled as a GCSE-stage advisory sequence');
 const upperBranches=await page.locator('#view-module .math-choice-list .math-choice-row strong').allTextContents();
 assert.ok(upperBranches.some(x=>x.includes('Algebră')),'Upper secondary must show an algebra branch');
 await click(page.locator('#view-module .math-choice-row').filter({hasText:'Algebră'}).first());
 const upperLessons=await page.locator('#view-module .math-choice-list .math-choice-row strong').allTextContents();
 assert.ok(upperLessons.some(x=>x.includes('Forma standard a numerelor')),
  'Upper-secondary new material must be reachable in the real Android-sized chapter list');
 await click(page.locator('#view-module .math-choice-row').filter({hasText:'Forma standard a numerelor'}).first());
 await page.locator('#educationPagedLessonDialog').waitFor({state:'visible',timeout:10000});
 const upperText=await page.locator('#educationPagedLessonDialog').innerText();
 assert.ok(upperText.includes('putere întreagă')&&upperText.includes('Exersează singur'),
  'Upper-secondary chapter must open its full offline theory and practice');
 await page.screenshot({path:'math-browser-audit/england-upper-secondary.png'});
 await click(page.locator('#educationPagedLessonDialog .education-theory-head button').first());
 await click(page.locator('#view-module .math-stage-back').first());
 await click(page.locator('#view-module .math-stage-back').first());
 await pickGrade('Year 11');
 const tier=page.locator('#view-module #math-gcse-tier');
 assert.equal(await tier.inputValue(),'foundation','Foundation must be the first-choice exam tier');
 await click(page.locator('#view-module .math-choice-row').filter({hasText:'Algebră'}).first());
 const foundationLessons=await page.locator('#view-module .math-choice-list .math-choice-row strong').allTextContents();
 assert.ok(!foundationLessons.some(x=>x.includes('Ecuații pătratice cu formula generală')),
  'Foundation GCSE must exclude Higher-only quadratic-formula material');
 await page.locator('#view-module #math-gcse-tier').selectOption('higher');
 const higherLessons=await page.locator('#view-module .math-choice-list .math-choice-row strong').allTextContents();
 assert.ok(higherLessons.some(x=>x.includes('Ecuații pătratice cu formula generală')),
  'Higher GCSE must include differentiated algebra lessons and Foundation topics');
 assert.ok(await page.locator('#view-module .math-choice-row').filter({hasText:'Exclusiv nivelului Higher'}).count()>=1,
  'Higher-only lessons must be visibly identified in the lesson list');
 await page.screenshot({path:'math-browser-audit/england-gcse-tiers.png'});
 await click(page.locator('#view-module .math-stage-back').first());
 await click(page.locator('#view-module .math-stage-back').first());
 await click(page.locator('#view-module .module-actions-row .pocket-inline-back, #view-module .education-toolbar button').first());
 await pickMathStage('Universitate');
 await pickGrade('1');
 await readBranches();
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
 await click(page.locator('#educationPagedLessonDialog .education-theory-head button').first());
 const newUniversity=page.locator('#view-module .math-choice-row').filter({hasText:'Definiția epsilon-delta a limitei'});
 assert.equal(await newUniversity.count(),1,'New university analysis lesson must be selectable');
 await click(newUniversity);
 await page.locator('#educationPagedLessonDialog').waitFor({state:'visible',timeout:10000});
 const newUniversityText=await page.locator('#educationPagedLessonDialog').innerText();
 assert.ok(newUniversityText.includes('epsilon-delta')&&newUniversityText.includes('Exersează singur'),
  'New university theory must open a complete original worked explanation');
 assert.equal(errors.length,0,'Unexpected JavaScript errors: '+errors.slice(0,5).join('; '));
 console.log('PASS mobile Chromium maths: Romania primary + lower, theorem reference, England Y1/Y6, upper-secondary and university original lessons, Back and branches');
}finally{
 await browser.close();await new Promise(resolve=>server.close(resolve));
}
