// Actual generated frontend / production bundle, mobile Chromium. Translation
// is mocked deliberately: this verifies delegation and failure UI, not AI quality.
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import path from 'node:path';
import {chromium} from 'playwright-core';
const {default:app}=await import(process.env.POCKET_BUNDLE?pathToFileURL(path.resolve(process.env.POCKET_BUNDLE)).href:'./index.js');
let html=await(await app.fetch(new Request('https://science.test/'))).text();
const hook=String.raw`
window.__scienceSource={
 calls:[],
 init(){state.language='ro';educationCountrySelection.code='RO';educationCountrySelection.label='România';state.currentModule='learning';showView('module');pocketRevealMainApp();$('view-module').classList.add('learning-active')},
 start(subject){scienceJourney.subject=subject;scienceStartSubject(subject)},
 mock(fail=false){eduTranslateMaterial=async (payload,identity,sourceLanguage,options)=>{
  window.__scienceSource.calls.push({payload,identity,sourceLanguage,options});
  if(fail)return null;
  const map=x=>typeof x==='string'?'ENGINE: '+x:Array.isArray(x)?x.map(map):x&&typeof x==='object'?Object.fromEntries(Object.entries(x).map(([k,v])=>[k,map(v)])):x;
  return map(payload);
 }},
 reference(subject,language='en'){state.language=language;scienceJourneyShowChoices(subject==='biology'?'biology-reference':subject+'-laws')},
 data(){return {physics:PHYSICS_LAWS_DATA,chemistry:CHEMISTRY_LAWS_DATA,biology:BIOLOGY_REFERENCE,astronomy:ASTRONOMY_LAWS_DATA,core:CHEMISTRY_UNIVERSITY_CORE}},
 core(){state.language='en';const c=CHEMISTRY_UNIVERSITY_CORE[0];const body=chemistryUniversityStudyDocument({courseId:c.id,country:'RO',year:c.year,specialty:'general',lessons:EDUCATION_THEORY_DATA,language:'en'});educationOpenPagedLesson(c.ro,body,{sourceLanguage:c.sourceLanguage});return body},
 close(){document.getElementById('educationPagedLessonDialog')?.close()}
};
`;
assert.ok(html.includes('function scienceStartSubject(subject){'));
html=html.replace('function scienceStartSubject(subject){',hook+'\nfunction scienceStartSubject(subject){');
const requests=[];
const server=createServer(async(req,res)=>{
 if(/^\/education\/study-v1\/(math|physics|chemistry|biology)\.json$/.test(req.url)){res.setHeader('Content-Type','application/json');res.end(await readFile('public'+req.url));return}
 const m=req.url.match(/^\/education\/science\/shared-v2\/(physics|chemistry|biology|astronomy)\.json$/);
 if(m){requests.push(m[1]);res.setHeader('Content-Type','application/json');res.end(await readFile('public'+req.url));return}
 res.setHeader('Content-Type','text/html');res.end(html);
});
await new Promise(ok=>server.listen(0,'127.0.0.1',ok));
const browser=await chromium.launch({headless:true,args:['--no-sandbox'],...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{})});
const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
const page=await context.newPage(),errors=[];
page.on('pageerror',e=>errors.push(String(e)));
const click=async locator=>locator.first().evaluate(el=>el.click());
try{
 await page.goto('http://127.0.0.1:'+server.address().port+'/?nativeLaunch=1',{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>Boolean(window.__scienceSource));
 await page.evaluate(()=>{window.__scienceSource.init();window.__scienceSource.mock()});
 assert.deepEqual(await page.evaluate(()=>window.__scienceSource.data()),{physics:[],chemistry:[],biology:[],astronomy:[],core:[]},'No reference/course bank preloaded in the frontend');
 const counts={physics:32,chemistry:16,biology:20,astronomy:24};
 for(const subject of Object.keys(counts)){
  await page.evaluate(s=>window.__scienceSource.start(s),subject);
  await page.locator('.science-year-tile').first().waitFor({state:'attached'});
  const data=await page.evaluate(()=>window.__scienceSource.data());
  assert.equal(data[subject].length,counts[subject]);
  if(subject==='chemistry')assert.equal(data.core.length,28);
  await page.evaluate(s=>window.__scienceSource.reference(s),subject);
  await page.waitForFunction(()=>document.querySelector('.science-law-tile strong')?.textContent.startsWith('ENGINE:'));
  assert.equal(await page.locator('.science-law-tile').count(),counts[subject]);
  await click(page.locator('.science-law-tile'));
  const dialog=page.locator('#educationPagedLessonDialog');await dialog.waitFor({state:'visible'});
  await page.waitForFunction(()=>Array.from(document.querySelectorAll('#educationPagedLessonDialog p')).some(el=>el.textContent.startsWith('ENGINE:')));
  const calls=await page.evaluate(()=>window.__scienceSource.calls);
  assert.ok(calls.some(c=>c.identity==='science:container'&&c.sourceLanguage==='ro'&&c.options.targetLanguage==='en'),'English titles use shared engine');
  assert.ok(calls.some(c=>c.identity.startsWith('paged-v3:')&&c.sourceLanguage==='ro'&&c.options.targetLanguage==='en'),'Reader passes explicit original language');
  assert.ok(!(await dialog.innerText()).includes('undefined'));
  await page.evaluate(()=>window.__scienceSource.close());
 }
 assert.deepEqual(requests,['physics','chemistry','biology','astronomy']);
 const core=await page.evaluate(()=>window.__scienceSource.core());
 assert.ok(core.includes('Obiective ale cursului')&&!core.includes('undefined'),'Core document remains original Romanian even with English UI');
 await page.evaluate(()=>window.__scienceSource.close());
 // A failed translation keeps originals and offers retry; no prewritten EN bank.
 await page.evaluate(()=>{window.__scienceSource.mock(true);window.__scienceSource.reference('astronomy','de')});
 await page.locator('.science-translation-notice').waitFor({state:'visible'});
 assert.ok(!(await page.locator('.science-law-tile strong').first().innerText()).startsWith('ENGINE:'));
 await click(page.locator('.science-law-tile'));
 await page.locator('.education-paged-translate-status').waitFor({state:'visible'});
 assert.ok((await page.locator('#educationPagedLessonDialog').innerText()).includes('Prima lege a lui Kepler'));
 await page.evaluate(()=>window.__scienceSource.close());
 // The same v2 references/courses survive a previously cached offline revisit.
 await context.setOffline(true);
 await page.evaluate(()=>window.__scienceSource.start('chemistry'));
 await page.locator('.science-year-tile').first().waitFor({state:'attached'});
 assert.equal((await page.evaluate(()=>window.__scienceSource.data())).core.length,28);
 assert.deepEqual(errors,[]);
 console.log('PASS mobile source-only science: production lazy hydration, 92 references + 28 core courses, RO→EN shared-engine delegation, translation failure/original fallback and offline cache');
}finally{await browser.close();await new Promise(ok=>server.close(ok))}
