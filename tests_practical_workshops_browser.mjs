import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import path from 'node:path';
import {chromium} from 'playwright-core';
const {default:app}=await import(process.env.POCKET_BUNDLE?pathToFileURL(path.resolve(process.env.POCKET_BUNDLE)).href:'./index.js');
let html=await(await app.fetch(new Request('https://practical.test/'))).text();
assert.ok(Buffer.byteLength(html)<8000000);assert.ok(!html.includes('O gospodărie fictivă are venit net 2.400'));assert.ok(!html.includes('Exemplu: venit 1800, costuri fixe 1100'));
const hook=String.raw`
window.__practical={
 init(){state.language='ro';state.currentModule='learning';showView('module');pocketRevealMainApp();$('view-module').classList.add('learning-active');practicalJourney.country='RO';practicalOpen('courses');eduOpenPrint=(mode,doc)=>window.__export={mode,doc}},
 open(id,chapter){practicalJourney.course=id;practicalJourney.chapter=chapter||'';practicalOpen(chapter?'lesson':'chapters')},
 pack(id){return PRACTICAL_WORKSHOP_PACKS[id]},
 state(id){return practicalWorkbookRead(id)},
 project(){practicalWorkshopOpen(true)},
 clearLoaded(id){const course=PRACTICAL_COURSES_DATA.find(x=>x.id===id);course.chapters=[];delete PRACTICAL_WORKSHOP_PACKS[id]},
 country(code){practicalJourney.country=code},
 mockTranslation(language,fail=false){state.language=language;window.__translations=[];eduTranslateMaterial=async(payload,id,source,opts)=>{window.__translations.push({payload,id,source,opts});return fail?null:Object.fromEntries(Object.entries(payload).map(([k,v])=>[k,'TRANSLATED '+v]))}}
};
`;
html=html.replace('function practicalOpen(stage){',hook+'\nfunction practicalOpen(stage){');
const requests=[],posts=[];let failPacks=false,hold=null,received,release;
const server=createServer(async(req,res)=>{
 if(/^\/education\/practical\/course-v1\/[a-z]+\.json$/.test(req.url)){
  requests.push(req.url);if(failPacks){res.writeHead(503);res.end();return}
  if(hold&&req.url.includes('/'+hold+'.json')){received?.();await new Promise(ok=>release=ok)}
  try{res.setHeader('Content-Type','application/json');res.end(await readFile('public'+req.url))}catch{res.writeHead(404);res.end()}return;
 }
 if(req.url==='/'||req.url.startsWith('/?')){res.setHeader('Content-Type','text/html; charset=utf-8');res.end(html);return}
 if(req.method==='POST')posts.push(req.url);res.writeHead(404);res.end();
});
await new Promise(ok=>server.listen(0,'127.0.0.1',ok));
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH,args:['--no-sandbox']});
const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.route('**/*',route=>route.request().url().startsWith('http://127.0.0.1:')?route.continue():route.abort());
const dialog=()=>page.locator('.practical-activity-dialog');
const close=async()=>{await dialog().getByRole('button',{name:'← Înapoi',exact:true}).click();await dialog().waitFor({state:'detached'})};
const open=async(id,ch)=>{await page.evaluate(([id,ch])=>window.__practical.open(id,ch),[id,ch]);await page.locator(ch?'.practical-lesson-actions':'.practical-path').waitFor()};
const lab=async()=>{await page.getByRole('button',{name:'🛠️ Atelier ghidat și lucrarea mea',exact:true}).click();await dialog().locator('.practical-lab').waitFor()};
const myWork=()=>dialog().getByRole('textbox',{name:'Lucrarea mea',exact:true});
const review=()=>dialog().getByRole('button',{name:'Salvează autoevaluarea lucrării',exact:true});
try{
 await page.goto('http://127.0.0.1:'+server.address().port+'/?nativeLaunch=1',{waitUntil:'domcontentloaded'});await page.evaluate(()=>window.__practical.init());
 assert.equal(requests.length,0);assert.equal(await page.locator('.practical-choice-tile').count(),6);
 await page.getByRole('button',{name:'Finanțe personale',exact:true}).click();await page.locator('.practical-path').waitFor();assert.equal(requests.length,1);assert.equal(await page.locator('.practical-choice-tile').count(),6);
 assert.match(await page.locator('.practical-panel').innerText(),/Lucrări autoevaluate: 0\/6/);
 await open('finance','finance-1');await lab();
 await review().click();assert.match(await dialog().innerText(),/Lipsesc elemente/);
 await dialog().getByRole('button',{name:'Inserează structura într-o ciornă goală',exact:true}).click();const scaffold=await myWork().inputValue();assert.match(scaffold,/Sold:/);
 const answer=dialog().getByRole('textbox',{name:'Răspuns la scenariu',exact:true});await answer.fill('450');for(const cb of await dialog().locator('input[type=checkbox]').all())await cb.check();
 await review().click();assert.match(await dialog().innerText(),/Un șablon necompletat/);
 await myWork().fill(scaffold+'\nSold: 450. Am repartizat factura anuală în 12 luni și am verificat totalurile.');
 await dialog().getByRole('button',{name:'Inserează structura într-o ciornă goală',exact:true}).click();assert.match(await dialog().innerText(),/nu a fost suprascrisă/);
 await review().click();assert.equal((await page.evaluate(()=>window.__practical.state('finance-1'))).reviewed,true);
 await myWork().fill('Am revizuit bugetul: soldul rămâne 450 după costurile fixe, variabile și provizionul lunar.');assert.equal((await page.evaluate(()=>window.__practical.state('finance-1'))).reviewed,false,'Editing invalidates self-review');await review().click();
 await dialog().getByRole('button',{name:'💾 Exportă lucrarea PDF',exact:true}).click();assert.match((await page.evaluate(()=>window.__export.doc.text)),/soldul rămâne 450/);
 await close();await lab();assert.match(await myWork().inputValue(),/Am revizuit bugetul/);await close();
 // Keep the old lesson/quiz available, but no quiz awards a workshop review.
 const coursePack=await page.evaluate(()=>window.__practical.pack('finance'));assert.equal(coursePack.content.workshops.length,6);
 for(const id of ['finance','trades','business','digital','career','daily']){
  await open(id);const pack=await page.evaluate(id=>window.__practical.pack(id),id);
  for(const w of pack.content.workshops){
   await open(id,w.id);await lab();assert.ok((await dialog().innerText()).includes(w.scenario));
   const box=await dialog().boundingBox();assert.ok(box.x>=0&&box.x+box.width<=391,w.id+' mobile width');
   await myWork().fill('Lucrare didactică pentru '+w.id+': '+w.artifact+'. Am arătat pașii, verificarea, decizia și limitele scenariului.');
   const cp=w.checkpoint,control=dialog().getByRole(cp.type==='choice'?'combobox':'textbox',{name:'Răspuns la scenariu',exact:true});
   if(cp.type==='choice')await control.selectOption(String(cp.correct));else await control.fill(String(cp.answer).replace('.',','));
   for(const cb of await dialog().locator('input[type=checkbox]').all())await cb.check();
   await dialog().getByRole('button',{name:'Verifică răspunsul local',exact:true}).click();assert.match(await dialog().innerText(),/Corect pentru datele/);
   await review().click();assert.equal((await page.evaluate(id=>window.__practical.state(id),w.id)).reviewed,true,w.id);await close();
  }
 }
 // Final portfolio needs six self-reviews and separate, authored final text.
 await open('finance');await page.getByRole('button',{name:'📋 Proiect final',exact:true}).click();await review().click();assert.match(await dialog().innerText(),/Lipsesc elemente/);
 await myWork().fill('Dosarul meu financiar fictiv reunește bugetul, planul de rezervă, comparația creditelor, calendarul, obiectivul și protocolul antifraudă. Calculele și limitele sunt explicate în cele șase lucrări.');
 for(const cb of await dialog().locator('input[type=checkbox]').all())await cb.check();await review().click();assert.equal((await page.evaluate(()=>window.__practical.state('project'))).reviewed,true);
 await dialog().getByRole('button',{name:'💾 Exportă lucrarea PDF',exact:true}).click();const pdf=await page.evaluate(()=>window.__export.doc.text);assert.match(pdf,/## Buget lunar/);assert.match(pdf,/## Protecția datelor/);assert.match(pdf,/nu certificare/);await close();
 // A changed chapter invalidates a previously saved final review.
 await open('finance','finance-1');await lab();await myWork().fill('O revizie nouă, încă neautoevaluată, schimbă dosarul și invalidează starea proiectului final.');await close();await page.evaluate(()=>window.__practical.project());assert.match(await dialog().innerText(),/Ciornă\. Citirea/);await close();
 // Drafts are isolated by country. No automatic AI requests during workshops.
 await page.evaluate(()=>window.__practical.country('DE'));await open('finance','finance-1');await lab();assert.equal(await myWork().inputValue(),'');await close();await page.evaluate(()=>window.__practical.country('RO'));
 // Shared translator receives authored instructions only, never a user's draft.
 await page.evaluate(()=>window.__practical.mockTranslation('en'));await open('finance','finance-1');await page.getByRole('button',{name:'🛠️ Guided workshop and my work',exact:true}).click();
 await page.waitForFunction(()=>document.querySelector('.practical-lab h3')?.textContent.startsWith('TRANSLATED'));
 const sent=await page.evaluate(()=>window.__translations);assert.ok(sent.length);assert.ok(!JSON.stringify(sent).includes('O revizie nouă, încă neautoevaluată'));assert.match(await dialog().getByRole('textbox',{name:'My work',exact:true}).inputValue(),/O revizie nouă/);
 await dialog().getByRole('button',{name:'← Back',exact:true}).click();await dialog().waitFor({state:'detached'});await page.evaluate(()=>window.__practical.mockTranslation('ro'));
 // Cached course on a new selection, cold failure, retry and late-response isolation.
 failPacks=true;await page.evaluate(()=>window.__practical.clearLoaded('finance'));await open('finance');assert.match(await page.locator('.practical-panel').innerText(),/Material din cache/);
 await page.evaluate(()=>{window.__practical.clearLoaded('daily');localStorage.removeItem('pocketai.practical.course.v1.daily');window.__practical.open('daily')});await page.getByRole('button',{name:'Reîncearcă',exact:true}).waitFor();assert.equal(await page.locator('.practical-choice-tile').count(),0);failPacks=false;await page.getByRole('button',{name:'Reîncearcă',exact:true}).click();await page.locator('.practical-path').waitFor();
 hold='business';const pending=new Promise(ok=>received=ok);await page.evaluate(()=>{window.__practical.clearLoaded('business');window.__practical.open('business')});await pending;await open('digital');release();hold=null;await page.waitForFunction(()=>!!localStorage.getItem('pocketai.practical.course.v1.business'));assert.match(await page.locator('.practical-panel').innerText(),/Competențe digitale/);
 assert.deepEqual(posts,[]);assert.deepEqual(errors,[]);console.log('PASS production mobile practical: 6 lazy courses/36 guided labs, local scenario checks, isolated/persistent drafts, incomplete-template rejection, self-review invalidation, final portfolio/PDF payload, instruction-only translation, cold/offline/retry/race; no AI calls');
}finally{await browser.close();server.close();server.closeAllConnections?.()}
