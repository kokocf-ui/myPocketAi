// Production-generated page, mobile Chromium. No live AI or physical APK test.
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createServer} from 'node:http';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import path from 'node:path';
import {chromium} from 'playwright-core';
const {default:app}=await import(process.env.POCKET_BUNDLE?pathToFileURL(path.resolve(process.env.POCKET_BUNDLE)).href:'./index.js');
let html=await(await app.fetch(new Request('https://study.test/'))).text();
const hook=String.raw`
window.__study={
 init(){state.language='ro';educationCountrySelection.code='RO';educationCountrySelection.label='România';state.currentModule='learning';showView('module');pocketRevealMainApp();$('view-module').classList.add('learning-active')},
 data(){return {ro5:RO5_MATH_LESSONS.length,ro678:Object.values(RO678_MATH_LESSONS).flat().length,
  physics:(SCIENCE_RO_LESSON_EXTRAS.physics?Object.values(SCIENCE_RO_LESSON_EXTRAS.physics).flat():[]).length,
  chemistry:(SCIENCE_RO_LESSON_EXTRAS.chemistry?Object.values(SCIENCE_RO_LESSON_EXTRAS.chemistry).flat():[]).length,
  biology:(SCIENCE_RO_LESSON_EXTRAS.biology?Object.values(SCIENCE_RO_LESSON_EXTRAS.biology).flat():[]).length,
  english:Object.values(PHYSICS_LOWER_ENGLISH_LESSONS).flat().length,upper:BIOLOGY_UPPER_YEAR_BANK.flatMap(x=>x.lessons).length,
  stage:scienceJourney.stage}},
 mathStatement(){return RO5_MATH_LESSONS[0]?.statement||''},
 math(country){educationCountrySelection.code=country;mathJourney.stage='stages';mathStartCountrySupplement(country)},
 science(subject){educationCountrySelection.code='RO';scienceJourney.subject=subject;scienceStartSubject(subject)},
 openMath(grade){const entry=mathCountryCourseEntries({country:'RO',stage:'lower',grade,topic:'algebra',phase:Number(grade)-4})[0];educationOpenPagedLesson(entry.title,mathInDepthMaterial(entry),{sourceLanguage:'ro'});return entry},
 openBiology(){const entry=biologyUpperYearLessons({country:'RO',grade:'9',topic:'cells',years:[{id:'9'},{id:'10'},{id:'11'},{id:'12'}]})[0];educationOpenPagedLesson(entry.title,[entry.statement,entry.workedExample,entry.exercise,entry.answer].join('\n\n'),{sourceLanguage:'ro'});return entry},
 close(){document.getElementById('educationPagedLessonDialog')?.close()}
};
`;
html=html.replace('function scienceStartSubject(subject){',hook+'\nfunction scienceStartSubject(subject){');
const requests=[],published={};
for(const subject of ['math','physics','chemistry','biology'])published[subject]=JSON.parse(await readFile('public/education/study-v1/'+subject+'.json','utf8'));
let holdBiology=false,receivedBiology,releaseBiology;
const server=createServer(async(req,res)=>{
 try{
  const study=req.url.match(/^\/education\/study-v1\/(math|physics|chemistry|biology)\.json$/);
  if(study){
   const subject=study[1];requests.push(subject);
   if(subject==='biology'&&holdBiology){receivedBiology();await new Promise(ok=>releaseBiology=ok)}
   res.setHeader('Content-Type','application/json');res.end(JSON.stringify(published[subject]));return;
  }
  if(/^\/education\/(?:science\/shared-v2\/(?:physics|chemistry|biology|astronomy)|math\/supplements\/[A-Z-]+)\.json$/.test(req.url)){
   res.setHeader('Content-Type','application/json');res.end(await readFile('public'+req.url));return;
  }
  if(req.url==='/'||req.url.startsWith('/?')){res.setHeader('Content-Type','text/html');res.end(html);return}
  res.writeHead(404);res.end('Not found');
 }catch(error){res.writeHead(500);res.end(String(error))}
});
await new Promise(ok=>server.listen(0,'127.0.0.1',ok));
const browser=await chromium.launch({headless:true,args:['--no-sandbox'],...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{})});
const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(String(e)));
const snapshot=()=>page.evaluate(()=>window.__study.data());
const ready=()=>page.waitForFunction(()=>window.__study.data().stage==='years');
try{
 await page.goto('http://127.0.0.1:'+server.address().port+'/?nativeLaunch=1',{waitUntil:'domcontentloaded'});
 await page.evaluate(()=>window.__study.init());
 assert.equal(requests.length,0);
 const data=await snapshot();for(const [key,value] of Object.entries(data))if(key!=='stage')assert.equal(value,0,'Initially no '+key+' bank in HTML');
 await page.evaluate(()=>window.__study.math('NO'));
 await page.locator('#view-module .math-choice-row').first().waitFor({state:'attached'});
 assert.equal(requests.length,0,'Non-Romanian mathematics must not fetch the RO bank');
 await page.evaluate(()=>window.__study.math('RO'));
 await page.waitForFunction(()=>window.__study.data().ro5===71);
 assert.equal((await snapshot()).ro678,111);
 assert.deepEqual(requests,['math']);
 for(const grade of ['5','6','7','8']){
  const row=await page.evaluate(g=>window.__study.openMath(g),grade);
  assert.ok(row?.statement&&row?.answers);
  const dialog=page.locator('#educationPagedLessonDialog');await dialog.waitFor({state:'visible'});
  assert.ok((await dialog.innerText()).includes(row.title));
  await page.evaluate(()=>window.__study.close());
 }
 // Content-only update, no page reload / frontend rebuild.
 published.math=structuredClone(published.math);
 published.math.banks.ro5.content[0].statement+=' Actualizare editorială independentă.';
 {const {schema,subject,version,...payload}=published.math;published.math.version=createHash('sha256').update(JSON.stringify(payload)).digest('hex')}
 await page.evaluate(()=>window.__study.math('RO'));
 await page.waitForFunction(()=>window.__study.mathStatement().includes('Actualizare editorială independentă.'));
 const revised=await page.evaluate(()=>window.__study.openMath('5'));
 assert.ok(revised.statement.includes('Actualizare editorială independentă.'));
 await page.evaluate(()=>window.__study.close());
 // Delay an old subject's response: it must not hydrate the new subject UI.
 holdBiology=true;const received=new Promise(ok=>receivedBiology=ok);
 await page.evaluate(()=>window.__study.science('biology'));await received;
 await page.evaluate(()=>window.__study.science('physics'));await ready();
 assert.equal((await snapshot()).physics,107);assert.equal((await snapshot()).english,104);
 const lateResponse=page.waitForResponse(r=>r.url().endsWith('/study-v1/biology.json'));
 releaseBiology();await lateResponse;
 await page.waitForFunction(()=>Boolean(localStorage.getItem('pocketai.education.study.v1.biology')));
 assert.equal((await snapshot()).upper,0,'Late biology response must not mutate active Physics banks');
 assert.equal((await snapshot()).stage,'years');holdBiology=false;
 await page.evaluate(()=>window.__study.science('biology'));await ready();
 assert.equal((await snapshot()).biology,134);assert.equal((await snapshot()).upper,90);
 const lesson=await page.evaluate(()=>window.__study.openBiology());
 assert.ok(lesson?.statement);
 assert.ok((await page.locator('#educationPagedLessonDialog').innerText()).includes(lesson.statement));
 await page.evaluate(()=>window.__study.close());
 await page.evaluate(()=>window.__study.science('chemistry'));await ready();assert.equal((await snapshot()).chemistry,14);
 const beforeAstro=requests.length;
 await page.evaluate(()=>window.__study.science('astronomy'));await ready();assert.equal(requests.length,beforeAstro,'Astronomy does not need an unrelated study bank');
 await context.setOffline(true);
 await page.evaluate(()=>window.__study.science('physics'));await ready();assert.equal((await snapshot()).english,104);
 // Shared references are cached but the newly required study bank is absent.
 await page.evaluate(()=>{localStorage.removeItem('pocketai.education.study.v1.physics');window.__study.science('physics')});
 await page.locator('.science-shared-retry').waitFor({state:'visible'});
 assert.equal((await snapshot()).stage,'loading-shared','Do not open an empty/partial curriculum');
 await context.setOffline(false);
 await page.locator('.science-shared-retry').evaluate(el=>el.click());await ready();
 assert.equal((await snapshot()).physics,107);
 assert.deepEqual(errors,[]);
 console.log('PASS production mobile study packs: lazy/RO-only loading, math V–VIII readers, biology reader, 631 original cards, content-only update, stale-response guard, cached offline, missing-study failure and retry');
}finally{releaseBiology?.();await browser.close();await new Promise(ok=>server.close(ok))}
