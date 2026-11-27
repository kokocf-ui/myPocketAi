// Observational mobile input audit, NOT an acceptance certificate for ink/OCR.
// Reports current controls and piecewise handling without asserting missing features.
// Run after a frontend dry-run with POCKET_BUNDLE=./.bundle-check/index.check.mjs.
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import path from 'node:path';
import {chromium} from 'playwright-core';
const {default:frontend}=await import(process.env.POCKET_BUNDLE?pathToFileURL(path.resolve(process.env.POCKET_BUNDLE)).href:'../index.js');
let html=await(await frontend.fetch(new Request('https://pocket.test/'))).text();
const hook=String.raw`
window.__eduTest={
 genericMath(){Object.assign(mathJourney,{stage:'workspace',topic:'algebra',level:'intermediate',schoolStage:'upper',grade:'9',chapter:null});openLearningSubjectAfterCountry('math',true)},
 genericScience(subject){activeLearningSubject=LEARNING_SUBJECTS.find(x=>x[0]==='science');Object.assign(scienceJourney,{stage:'workspace',subject,level:'beginner',schoolStage:'lower',grade:'6',topic:subject==='physics'?'kinematics':'solutions'});$('moduleContent').replaceChildren();scienceOpenWorkspace()},
 parse(text){return {split:mathSplitExercises(text),graph:mathGraphModel(text)}},

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

 const observations={};
 await page.evaluate(()=>window.__eduTest.genericMath());
 await page.locator('#mathEducationText').waitFor();
 observations.genericMath={buttons:await page.locator('#mathEducationWorkspace button').allTextContents(),canvasCount:await page.locator('#mathEducationWorkspace canvas').count()};
 const piecewise='f(x) = {\n x^2, dacă x < 0\n 2x+1, dacă x ≥ 0\n}';
 await page.locator('#mathEducationText').fill(piecewise);
 observations.piecewise=await page.evaluate(t=>window.__eduTest.parse(t),piecewise);
 observations.piecewise.textPreserved=(await page.locator('#mathEducationText').inputValue())===piecewise;
 for(const subject of ['physics','chemistry']){
  await page.evaluate(s=>window.__eduTest.genericScience(s),subject);
  const toggle=page.locator('.science-symbol-toggle');await toggle.waitFor();await toggle.click();
  const tray=page.locator('.science-symbol-tray');await tray.waitFor({state:'visible'});
  await tray.getByRole('button',{name:'Matematică: √',exact:true}).click();
  observations[subject]={paletteVisible:await tray.isVisible(),inserted:await page.locator('#scienceEducationText').inputValue()};
  assert.ok(observations[subject].inserted.includes('√'));
 }
 await page.evaluate(()=>window.__eduTest.pack('math'));
 const work=page.locator('.edu-lesson-workspace');await work.waitFor();
 observations.nationalMath={buttons:await work.getByRole('button').allTextContents(),canvasCount:await work.locator('canvas').count(),textareas:await work.locator('textarea').count()};
 assert.deepEqual(errors,[]);
 console.log(JSON.stringify(observations,null,2));
}finally{await browser?.close();await new Promise(r=>server.close(r))}
