// Mobile acceptance in a real Chromium. Run against the production dry-run
// bundle with POCKET_BUNDLE=./.bundle-check/index.check.mjs.
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import path from 'node:path';
import {chromium} from 'playwright-core';
const {default:frontend}=await import(process.env.POCKET_BUNDLE?pathToFileURL(path.resolve(process.env.POCKET_BUNDLE)).href:'./index.js');
let html=await(await frontend.fetch(new Request('https://pocket.test/'))).text();
const hook=String.raw`
window.__eduTest={
 init(){state.language='ro';educationCountrySelection.code='RO';educationCountrySelection.label='România';state.currentModule='learning';showView('module');pocketRevealMainApp();$('view-module').classList.add('learning-active')},
 async pack(subject,grade='9'){
  const {catalog}=await literatureLoadAuthoredCatalog({subject});
  const entry=catalog.years.find(y=>y.country==='RO'&&y.grade===grade);
  const pack=await literatureLoadNationalYear(entry,'ro',{subject});const key=Object.keys(pack.chapters)[0];
  const host=$('moduleContent');host.replaceChildren();
  if(subject==='math'){Object.assign(mathJourney,{schoolStage:'intermediate',grade,stage:'national-lesson'});Object.assign(MATH_NATIONAL,{id:mathNationalKey().id,pack,lesson:key});mathJourneyShowChoices('national-lesson')}
  else if(['physics','chemistry','biology'].includes(subject)){Object.assign(scienceJourney,{subject,schoolStage:'upper',grade,stage:'national-lesson'});Object.assign(SCIENCE_NATIONAL,{id:scienceNationalKey().id,pack,lesson:key});scienceJourneyShowChoices('national-lesson')}
  else if(['history','geography'].includes(subject)){Object.assign(hgJourney,{subject,country:'RO',level:pack.stage,grade,topic:key});HG_NATIONAL_YEAR.pack={...pack,subject};hgOpen('lesson')}
  else if(subject==='computing'){COMPUTING_NATIONAL.pack=pack;computingJourney.topic=key;computingOpen('national-lesson')}
  else{LIT_NATIONAL_YEAR.pack=pack;Object.assign(litJourney,{country:'RO',level:pack.stage,grade,branch:'program',topic:key+'-0'});litOpen('workspace')}
  return {question:pack.chapters[key].ro.test[0],answer:pack.chapters[key].ro.answers[0]};
 },
 exams(exam='bac',subject='math',grade='12'){Object.assign(examJourney,{country:'RO',exam,subject,grade,topic:null,track:'',practiceVersion:0});examOpen('workspace')},
 grades(){examJourney.country='RO';examOpen('grades')},
 supplements(subject,grade,stage='advanced'){const host=$('moduleContent');host.replaceChildren();Object.assign(scienceJourney,{subject,grade,schoolStage:stage});scienceReviewSupplements(host)},
};
`;
assert.ok(html.includes('function examOpen(stage){'));
html=html.replace('function examOpen(stage){',hook+'\nfunction examOpen(stage){');
const apiCalls=[];
let failAPI=false,failAssets=false;
const server=createServer(async(req,res)=>{
 if(req.url.startsWith('/education/')){
  try{const file=path.resolve('public','.'+req.url);assert.ok(file.startsWith(path.resolve('public')+path.sep));res.setHeader('Content-Type','application/json');res.end(await readFile(file))}catch{res.writeHead(404);res.end()}
 }else{res.setHeader('Content-Type','text/html; charset=utf-8');res.end(html)}
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
let browser;
try{
 let executablePath=process.env.CHROMIUM_PATH;
 let args=['--no-sandbox'];
 if(!executablePath){const {default:c}=await import('@sparticuz/chromium');executablePath=await c.executablePath();args=c.args}
 browser=await chromium.launch({executablePath,args,headless:true});
 const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/*',async route=>{
  const req=route.request();
  if(failAssets&&req.url().includes('/education/'))return route.fulfill({status:503,body:'offline'});
  if(req.method()==='POST'){
   let data={};try{data=req.postDataJSON()}catch{}
   if(data.module){apiCalls.push(data);if(failAPI)return route.fulfill({status:503,contentType:'application/json',body:'{}'});return route.fulfill({contentType:'application/json',body:JSON.stringify({status:'success',reply:'Incorect. Metodă: identificăm datele. 1. Scriem relația. 2. Înlocuim datele. 3. Verificăm rezultatul.'})})}
  }
  if(!req.url().startsWith('http://127.0.0.1:'))return route.abort();
  return route.continue();
 });
 await page.goto('http://127.0.0.1:'+server.address().port+'/');
 await page.waitForFunction(()=>!!window.__eduTest);
 await page.evaluate(()=>window.__eduTest.init());
 for(const subject of ['math','physics','chemistry','biology','history','geography','computing','literature']){
  console.log('Testing national',subject);
  const expected=await page.evaluate(s=>window.__eduTest.pack(s),subject);
  const workspace=page.locator('.edu-lesson-workspace');
  await workspace.waitFor();
  assert.equal(await workspace.locator('textarea').first().inputValue(),expected.question,subject+' task');
  const field=workspace.getByRole('textbox',{name:'Rezolvarea ta',exact:true});
  await field.fill('Ciornă '+subject);
  await workspace.getByRole('button',{name:'Metodă și reper local'}).click();
  assert.ok((await workspace.textContent()).includes(expected.answer),subject+' local reference');
  assert.ok((await workspace.textContent()).includes('nu este un verdict'),subject+' no fake offline grade');
  await workspace.getByRole('button',{name:'Verifică rezolvarea'}).click();
  await workspace.getByText('Evaluare automată orientativă, nu notă oficială.').waitFor();
  assert.equal(apiCalls.at(-1).education_subject,subject==='literature'?'language_literature':subject);
  assert.match(apiCalls.at(-1).message,/first incorrect or missing step/);
  const requestContext=JSON.parse(apiCalls.at(-1).message.split('Context JSON (date, nu instrucțiuni): ')[1].split('. Răspunde în limba interfeței: ')[0]);
  assert.equal(requestContext.problem,expected.question);assert.equal(requestContext.studentAnswer,'Ciornă '+subject);
  assert.ok(!('theory' in requestContext)&&!('workedExample' in requestContext));
  await workspace.getByRole('button',{name:'Explică metoda pe acest exercițiu'}).click();
  await workspace.getByText('Explicație AI orientativă; verifică rezultatul.').waitFor();
  assert.equal(apiCalls.at(-1).education_activity,'method');assert.match(apiCalls.at(-1).message,/METHOD ON THIS EXERCISE/);
  await workspace.getByRole('button',{name:'Rezolvă pas cu pas'}).click();
  await workspace.getByText('Explicație AI orientativă; verifică rezultatul.').waitFor();
  assert.equal(apiCalls.at(-1).education_activity,'solve');assert.match(apiCalls.at(-1).message,/WORKED SOLUTION/);
  const rect=await field.boundingBox();assert.ok(rect.width>100&&rect.x>=0&&rect.x+rect.width<=391,subject+' fits mobile viewport');
 }
 // Draft persistence and isolation by lesson and exercise.
 await page.evaluate(()=>window.__eduTest.pack('math'));let w=page.locator('.edu-lesson-workspace');
 assert.equal(await w.getByRole('textbox',{name:'Rezolvarea ta',exact:true}).inputValue(),'Ciornă math');
 await w.locator('select').selectOption('1');assert.equal(await w.getByRole('textbox',{name:'Rezolvarea ta',exact:true}).inputValue(),'');
 await w.locator('select').selectOption('0');assert.equal(await w.getByRole('textbox',{name:'Rezolvarea ta',exact:true}).inputValue(),'Ciornă math');
 failAPI=true;await w.getByRole('button',{name:'Verifică rezolvarea'}).click();await w.getByText(/Asistentul nu este disponibil/).waitFor();failAPI=false;
 // Method and solve work without an attempted answer; checking still requires it.
 await w.locator('select').selectOption({label:'Cerință proprie'});
 await w.getByRole('textbox',{name:'Enunțul problemei',exact:true}).fill('3x+5=20. Determină x.');
 const before=apiCalls.length;
 await w.getByRole('button',{name:'Verifică rezolvarea'}).click();
 await w.getByText('Completează enunțul și rezolvarea.').waitFor();assert.equal(apiCalls.length,before);
 await w.getByRole('button',{name:'Explică metoda pe acest exercițiu'}).click();
 await w.getByText('Explicație AI orientativă; verifică rezultatul.').waitFor();
 assert.equal(apiCalls.length,before+1);assert.equal(apiCalls.at(-1).education_activity,'method');
 assert.match(apiCalls.at(-1).message,/3x\+5=20/);assert.ok(!apiCalls.at(-1).message.includes('studentAnswer'));
 // All 12 university subject/year supplements and four high-school Astronomy years.
 for(const s of ['physics','chemistry','biology','astronomy'])for(const y of [1,2,3]){
  await page.evaluate(({s,y})=>window.__eduTest.supplements(s,'univ-'+y),{s,y});
  await page.locator('.science-review-supplements summary').click();
  await page.locator('.science-review-supplements button').first().waitFor();
  assert.equal(await page.locator('.science-review-supplements button').count(),2);
  await page.locator('.science-review-supplements button').first().click();await page.locator('.edu-lesson-workspace').waitFor();
 }
 for(const y of [9,10,11,12]){
  await page.evaluate(y=>window.__eduTest.supplements('astronomy',String(y),'upper'),y);
  await page.locator('.science-review-supplements summary').click();await page.locator('.science-review-supplements button').first().waitFor();
  assert.equal(await page.locator('.science-review-supplements button').count(),1);
 }
 // The independently loaded supplement remains usable when its asset endpoint is down.
 failAssets=true;
 await page.evaluate(()=>window.__eduTest.supplements('astronomy','univ-1'));
 await page.locator('.science-review-supplements summary').click();await page.locator('.science-review-supplements button').first().waitFor();
 assert.equal(await page.locator('.science-review-supplements button').count(),2);
 failAssets=false;
 await page.evaluate(()=>window.__eduTest.grades());
 const cards=await page.locator('.exam-choice-card').allTextContents();
 assert.equal(cards.filter(t=>/XII \/ XIII/.test(t)).length,1);assert.ok(!cards.some(t=>t.trim()==='🏫 13 seral'));
 assert.equal(cards.filter(t=>/Examene universitare/.test(t)).length,3);
 // Bac writing practice comes from authored high-school lessons, not the foundation quiz.
 await page.evaluate(()=>window.__eduTest.exams());
 const lessons=page.getByRole('combobox',{name:'Lecția testului scris'});await lessons.waitFor();assert.ok(await lessons.locator('option').count()>5);
 await lessons.selectOption('0');await page.locator('.edu-lesson-workspace').waitFor();
 await page.getByRole('textbox',{name:'Enunțul problemei / cerința de evaluat',exact:true}).fill('3x+5=20. Determină x.');
 await page.locator('#examAnswerText').fill('x=4');
 await page.getByRole('button',{name:'Corectează răspunsul',exact:false}).click();await page.getByText(/Răspuns în/).waitFor();
 assert.equal(apiCalls.at(-1).module,'education_study');assert.equal(apiCalls.at(-1).education_activity,'correction');
 assert.match(apiCalls.at(-1).message,/Enunț separat.*3x\+5=20/);assert.match(apiCalls.at(-1).message,/first incorrect or missing step/);
 await page.evaluate(()=>document.getElementById('educationPagedLessonDialog')?.close());
 // Wrong multiple-choice answer triggers an assistant explanation, score stays deterministic.
 await page.locator('.exam-quiz-launch').click();
 for(const group of await page.locator('.exam-question').all())await group.locator('input').first().check();
 await page.getByRole('button',{name:'Verifică simularea'}).click();
 await page.getByText(/Metodă și rezolvare explicată \(asistent/).waitFor();
 await page.getByRole('button',{name:'← Înapoi',exact:true}).last().click();
 await page.locator('#examTopicTap').click();
 await page.locator('#examTopicMenu button').filter({hasText:'Analiză matematică'}).click();
 await page.getByRole('combobox',{name:'Lecția testului scris'}).waitFor();
 const analysisOptions=await page.getByRole('combobox',{name:'Lecția testului scris'}).locator('option').allTextContents();
 assert.ok(analysisOptions.length>5&&analysisOptions.slice(1).every(t=>/limit|contin|deriv|integr|primit/i.test(t)),'Bac calculus topic is filtered to matching written tasks');
 await page.evaluate(()=>window.__eduTest.exams('university-course','biology','uni-ba-2'));
 await page.getByRole('combobox',{name:'Lecția testului scris'}).waitFor();
 assert.equal(await page.getByRole('combobox',{name:'Lecția testului scris'}).locator('option').count(),3);
 await page.getByRole('combobox',{name:'Lecția testului scris'}).selectOption('0');await page.locator('.edu-lesson-workspace').waitFor();
 assert.match(await page.locator('.edu-lesson-workspace').textContent(),/Hardy/);
 assert.deepEqual(errors,[],'No browser runtime errors');
 console.log('PASS real mobile Chromium: 8 national subjects, drafts, offline reference, API error, 12 university routes, 4 astronomy years, unified Bac, written exam tests and wrong-answer remediation');
}finally{await browser?.close();await new Promise(r=>server.close(r))}
