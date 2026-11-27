// Shared input tools in a real mobile Chromium. Run against the production dry-run
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
 outsideLearning(){state.currentModule='organize';const f=document.createElement('textarea');f.id='outsideLearning';document.body.append(f)},
 genericComputing(){const t=COMPUTING_TOPICS_DATA[0];Object.assign(computingJourney,{level:'beginner',grade:'5',path:t.path,topic:t.id});$('moduleContent').replaceChildren();computingWorkspace($('moduleContent'))},
 foreignPlacement(){languageJourney.language='en';languageFullPlacement()},
 genericMath(){document.querySelectorAll('dialog[open]').forEach(d=>d.close());Object.assign(mathJourney,{stage:'workspace',topic:'algebra',level:'intermediate',schoolStage:'upper',grade:'9',chapter:null});openLearningSubjectAfterCountry('math',true)},
 genericScience(subject){activeLearningSubject=LEARNING_SUBJECTS.find(x=>x[0]==='science');Object.assign(scienceJourney,{stage:'workspace',subject,level:'beginner',schoolStage:'lower',grade:'6',topic:subject==='physics'?'kinematics':'solutions'});$('moduleContent').replaceChildren();scienceOpenWorkspace()},

 init(){state.language='ro';educationCountrySelection.code='RO';educationCountrySelection.label='România';state.currentModule='learning';showView('module');pocketRevealMainApp();$('view-module').classList.add('learning-active')},
 async pack(subject,grade='9'){
  const {catalog}=await literatureLoadAuthoredCatalog({subject});
  const entry=catalog.years.find(y=>y.country==='RO'&&y.grade===grade);
  const pack=await literatureLoadNationalYear(entry,'ro',{subject});const key=Object.keys(pack.chapters)[0];
  document.querySelectorAll('dialog[open]').forEach(d=>d.close());const host=$('moduleContent');host.replaceChildren();
  if(subject==='math'){Object.assign(mathJourney,{schoolStage:'intermediate',grade,stage:'national-lesson'});Object.assign(MATH_NATIONAL,{id:mathNationalKey().id,pack,lesson:key});mathJourneyShowChoices('national-lesson')}
  else if(['physics','chemistry','biology'].includes(subject)){Object.assign(scienceJourney,{subject,schoolStage:'upper',grade,stage:'national-lesson'});Object.assign(SCIENCE_NATIONAL,{id:scienceNationalKey().id,pack,lesson:key});scienceJourneyShowChoices('national-lesson')}
  else if(['history','geography'].includes(subject)){Object.assign(hgJourney,{subject,country:'RO',level:pack.stage,grade,topic:key});HG_NATIONAL_YEAR.pack={...pack,subject};hgOpen('lesson')}
  else if(subject==='computing'){COMPUTING_NATIONAL.pack=pack;computingJourney.topic=key;computingOpen('national-lesson')}
  else{LIT_NATIONAL_YEAR.pack=pack;Object.assign(litJourney,{country:'RO',level:pack.stage,grade,branch:'program',topic:key+'-0'});litOpen('workspace')}
  host.querySelector('.edu-workspace-open')?.click();
  return {question:pack.chapters[key].ro.test[0],answer:pack.chapters[key].ro.answers[0]};
 },
 exams(exam='bac',subject='math',grade='12'){Object.assign(examJourney,{country:'RO',exam,subject,grade,topic:null,track:'',practiceVersion:0});examOpen('workspace')},
 grades(){examJourney.country='RO';examOpen('grades')},
 supplements(subject,grade,stage='advanced'){document.querySelectorAll('dialog[open]').forEach(d=>d.close());const host=$('moduleContent');host.replaceChildren();Object.assign(scienceJourney,{subject,grade,schoolStage:stage});scienceReviewSupplements(host)},
};
`;
assert.ok(html.includes('function examOpen(stage){'));
html=html.replace('function examOpen(stage){',hook+'\nfunction examOpen(stage){');
const apiCalls=[],inkCalls=[];
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
   if(req.url().endsWith('/api/education-ink')){
    inkCalls.push(data);return route.fulfill({status:503,contentType:'application/json',body:'{}'});
   }
   if(data.module){apiCalls.push(data);if(failAPI)return route.fulfill({status:503,contentType:'application/json',body:'{}'});return route.fulfill({contentType:'application/json',body:JSON.stringify({status:'success',reply:'Incorect. Metodă: identificăm datele. 1. Scriem relația. 2. Înlocuim datele. 3. Verificăm rezultatul.'})})}
  }
  if(!req.url().startsWith('http://127.0.0.1:'))return route.abort();
  return route.continue();
 });
 await page.goto('http://127.0.0.1:'+server.address().port+'/');
 await page.waitForFunction(()=>!!window.__eduTest);
 await page.evaluate(()=>window.__eduTest.init());

 for(const subject of ['math','physics','chemistry','biology','history','geography','computing','literature']){
  await page.evaluate(s=>window.__eduTest.pack(s),subject);
  const field=page.locator('.edu-lesson-workspace').getByRole('textbox',{name:'Rezolvarea ta',exact:true});
  await field.fill('abc');
  const tools=page.locator('.edu-compact-tools .edu-compact-tools-active').or(field.locator('xpath=following-sibling::*[1]').filter({has:page.getByRole('button',{name:'∑ Simboluri și șabloane',exact:true})}));await tools.getByRole('button',{name:'∑ Simboluri și șabloane',exact:true}).waitFor();assert.equal(await page.locator('[data-ink-open],[data-education-ink]').count(),0,'Handwriting removed');
  await tools.getByRole('button',{name:'∑ Simboluri și șabloane',exact:true}).click();
  await field.evaluate(f=>{f.blur();f.setSelectionRange(1,2)});
  await tools.getByRole('button',{name:'√',exact:true}).click();
  assert.equal(await field.inputValue(),'a√c',subject+' inserts at selection');
  assert.equal(await field.evaluate(f=>document.activeElement===f),false,'Does not summon keyboard');
  await field.fill('');await tools.getByRole('button',{name:'Funcție pe cazuri',exact:true}).click();
  assert.match(await field.inputValue(),/f\(x\) = \{/);
  const brace=tools.locator('.edu-brace-preview svg');await brace.waitFor({state:'visible'});
  await field.fill('{\nx=1');const h1=Number(await brace.getAttribute('height'));
  await field.focus();await field.press('End');await field.press('Enter');
  assert.ok(Number(await brace.getAttribute('height'))>h1,'Enter grows the brace');
  const rect=await tools.boundingBox();assert.ok(rect.x>=0&&rect.x+rect.width<=391,'Tools fit mobile viewport');
 }
 await page.evaluate(()=>window.__eduTest.pack('math'));
 const national=page.locator('.edu-lesson-workspace');
 await national.locator('select').selectOption({label:'Cerință proprie'});
 await national.locator('.edu-compact-tools-active').getByRole('button',{name:'∑ Simboluri și șabloane',exact:true}).waitFor();
 await national.locator('select').selectOption('0');
 assert.equal(await national.getByRole('textbox',{name:'Enunțul problemei',exact:true}).isEditable(),false,'Readonly question cannot be edited by the palette');
 assert.equal(await national.locator('.edu-compact-tools .edu-input-tools[hidden]').count(),1,'Readonly prompt tools are hidden; only answer tools remain');
 await page.evaluate(()=>window.__eduTest.genericMath());
 const field=page.locator('#mathEducationText');await field.waitFor();
 assert.equal(await page.locator('[data-ink-open],[data-education-ink]').count(),0);
 assert.equal(await page.evaluate(()=>typeof educationOpenInk),'undefined','No callable handwriting dialog remains');
 assert.equal(inkCalls.length,0,'No handwriting uploads');
 // Existing science palettes and shared templates remain.
 for(const subject of ['physics','chemistry']){
  await page.evaluate(s=>window.__eduTest.genericScience(s),subject);
  await page.locator('#scienceEducationText + .edu-input-tools').getByRole('button',{name:'∑ Simboluri și șabloane',exact:true}).waitFor();
  assert.equal(await page.locator('[data-ink-open],[data-education-ink]').count(),0);
  assert.equal(await page.locator('.science-symbol-toggle').count(),1);
 }
 await page.evaluate(()=>window.__eduTest.exams());await page.locator('#examProblemText + .edu-input-tools').waitFor();await page.locator('#examAnswerText + .edu-input-tools').waitFor();
 await page.evaluate(()=>window.__eduTest.genericComputing());await page.locator('#computingInput + .edu-input-tools').waitFor({state:'attached'});
 await page.evaluate(()=>window.__eduTest.foreignPlacement());
 const foreign=page.locator('dialog[open]').last();await foreign.locator('textarea + .edu-input-tools').waitFor();await foreign.getByRole('button',{name:'← Revenire',exact:true}).click();
 await page.evaluate(()=>window.__eduTest.outsideLearning());
 assert.equal(await page.locator('#outsideLearning').getAttribute('data-education-input-tools'),null,'No toolbar leaks into non-education inputs');
 assert.deepEqual(errors,[],'No mobile browser errors');
 console.log('PASS production mobile input tools: 8 subjects, cursor insertion, Enter-growing brace, templates, handwriting removed everywhere, no OCR calls, science/exams/languages tools preserved');
}finally{await browser?.close();await new Promise(r=>server.close(r))}
