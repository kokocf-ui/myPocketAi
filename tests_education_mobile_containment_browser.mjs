// Regression for the three physical-phone screenshots reported 2026-11-26.
// Real touch input and hit testing, not only DOM presence or desktop click().
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile,mkdir} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import path from 'node:path';
import {chromium} from 'playwright-core';
const {default:app}=await import(process.env.POCKET_BUNDLE?pathToFileURL(path.resolve(process.env.POCKET_BUNDLE)).href:'./index.js');
let html=await(await app.fetch(new Request('https://mobile.test/'))).text();
const hook=String.raw`
window.__mobile={
 init(){state.language='ro';state.currentModule='learning';educationCountrySelection.code='RO';educationCountrySelection.label='România';showView('module');pocketRevealMainApp();$('view-module').classList.add('learning-active');Object.assign(languageJourney,{language:'en',variant:'GB',level:'A1',topic:'conversation'});languageOpen('topics')},
 lesson(){languageJourney.cardIndex=0;languageOpen('lesson')},resources(){languageResourcesOpen()},tutor(){languageConversationStart('conversation')},back(){window.pocketAndroidBack()},
 async math(){const {catalog}=await literatureLoadAuthoredCatalog({subject:'math'});const entry=catalog.years.find(y=>y.country==='RO'&&y.grade==='8');const pack=await literatureLoadNationalYear(entry,'ro',{subject:'math'});const key=Object.keys(pack.chapters).find(k=>pack.chapters[k].ro.title.startsWith('Intervale de numere reale'));Object.assign(mathJourney,{stage:'national-lesson',schoolStage:'lower',grade:'8'});Object.assign(MATH_NATIONAL,{id:mathNationalKey().id,pack,lesson:key});mathJourneyShowChoices('national-lesson')},mathTopics(){mathJourneyShowChoices('branches')}
};
`;
html=html.replace('function languageOpen(stage){',hook+'\nfunction languageOpen(stage){');
let holdPack=false,releasePack,seenPack,holdAI=false,releaseAI,seenAI,failAI=false;
let tutorCalls=0;const errors=[];
const server=createServer(async(req,res)=>{
 if(req.url.startsWith('/education/')){
  if(holdPack&&req.url.includes('/languages/')){seenPack?.();await new Promise(ok=>releasePack=ok)}
  try{const file=path.resolve('public','.'+req.url);assert.ok(file.startsWith(path.resolve('public')+path.sep));res.setHeader('Content-Type','application/json');res.end(await readFile(file))}catch{res.writeHead(404);res.end()}return;
 }
 res.setHeader('Content-Type','text/html; charset=utf-8');res.end(html);
});
await new Promise(ok=>server.listen(0,'127.0.0.1',ok));
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH,args:['--no-sandbox']});
await mkdir('.bundle-check/mobile-containment',{recursive:true});
try{
 for(const viewport of [{width:393,height:817},{width:360,height:640}]){
  const context=await browser.newContext({viewport,isMobile:true,hasTouch:true});
  const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>{
   window.__spoken=[];window.SpeechSynthesisUtterance=class{constructor(text){this.text=text}};
   Object.defineProperty(window,'speechSynthesis',{value:{getVoices:()=>[{lang:'en-GB'}],cancel(){},speak(v){window.__spoken.push(v.text)}}});
  });
  await page.route('**/*',async route=>{
   const req=route.request();
   if(req.method()==='POST'){
    let data={};try{data=req.postDataJSON()}catch{}
    if(data.module==='assistant'){
     tutorCalls++;if(holdAI){seenAI?.();await new Promise(ok=>releaseAI=ok)}
     try{return await route.fulfill({status:failAI?503:200,contentType:'application/json',body:JSON.stringify({status:'success',reply:'Hello! /həˈləʊ/ — Salut. Context: o întâlnire informală. '+('Exemplu și explicație pentru conversație. '.repeat(35))})})}catch{return}
    }
    return route.fulfill({contentType:'application/json',body:JSON.stringify({status:'success',reply:'**Rezolvare orientativă**: 5 este inclus în interval deoarece capătul este închis. '+('Pas explicat și verificat. '.repeat(90))})});
   }
   if(!req.url().startsWith('http://127.0.0.1:'))return route.abort();return route.continue();
  });
  const tap=async locator=>{
   await locator.scrollIntoViewIfNeeded();
   const info=await locator.evaluate(el=>{const r=el.getBoundingClientRect(),x=r.left+r.width/2,y=r.top+r.height/2,hit=document.elementFromPoint(x,y);return{width:r.width,height:r.height,hit:!!hit&&(el===hit||el.contains(hit)),x,y}});
   assert.ok(info.hit&&info.height>=32,'Unobstructed touch target: '+JSON.stringify(info));
   await locator.tap();
  };
  await page.goto('http://127.0.0.1:'+server.address().port+'/?nativeLaunch=1',{waitUntil:'domcontentloaded'});await page.evaluate(()=>window.__mobile.init());
  // A slow local asset must not expose active tabs whose handler dereferences null.
  holdPack=true;const received=new Promise(ok=>seenPack=ok);await page.evaluate(()=>window.__mobile.resources());await received;
  let resource=page.locator('.foreign-resource-dialog');assert.equal(await resource.locator('.foreign-resource-tabs button:disabled').count(),4);releasePack();holdPack=false;
  await resource.locator('.foreign-resource-entry').first().waitFor();
  const bg=await resource.evaluate(el=>getComputedStyle(el).backgroundImage);assert.ok(bg.includes('18, 55, 74')&&bg.includes('8, 28, 45'),'General blue app palette');
  const content=resource.locator('.foreign-resource-content'),tabs=resource.locator('.foreign-resource-tabs');
  assert.ok(await content.getByRole('searchbox').isVisible());assert.equal(await content.locator('.foreign-resource-info').getAttribute('open'),null);
  for(const [name,title,selector] of [[/Teme/,'Teme și conjugări','table'],[/Ghid/,'Ghid de conversație','section'],[/Laborator/,'Laborator audio','select'],[/Dicționar/,'Dicționar','input[type=search]']]){
   await tap(tabs.getByRole('button',{name}));assert.equal(await content.locator(':scope>h3').innerText(),title);assert.equal(await content.evaluate(el=>el.scrollTop),0);
   const target=content.locator(selector).first();await target.waitFor();const r=await target.boundingBox(),cr=await content.boundingBox();assert.ok(r.y<cr.y+cr.height,'Tab content appears inside current viewport '+JSON.stringify({title,viewport,r,cr}));
  }
  await content.getByRole('searchbox').fill('book');await tap(content.getByRole('button',{name:'🔊 Ascultă',exact:true}));assert.equal((await page.evaluate(()=>window.__spoken)).at(-1),'book');
  await page.screenshot({path:'.bundle-check/mobile-containment/resources-'+viewport.width+'.png'});
  await tap(resource.getByRole('button',{name:'Închide',exact:true}));await resource.waitFor({state:'detached'});
  await page.evaluate(()=>window.__mobile.resources());await page.locator('.foreign-resource-entry').first().waitFor();await page.evaluate(()=>window.__mobile.back());await resource.waitFor({state:'detached'});assert.equal(await page.locator('#view-module.learning-languages').count(),1);
  // Long AI text + injected tools + keyboard-sized viewport must remain in normal flow.
  await page.evaluate(()=>window.__mobile.tutor());const tutor=page.locator('.language-tutor-dialog');await tutor.getByText(/Răspuns generat de AI/).waitFor();await tutor.locator('.edu-input-tools').waitFor();
  const field=tutor.locator('#languageTutorInput');
  const geometry=()=>tutor.evaluate(d=>{const f=d.querySelector('textarea').getBoundingClientRect(),tools=d.querySelector('.edu-input-tools').getBoundingClientRect(),actions=d.querySelector('.language-tutor-actions').getBoundingClientRect();return{fieldHeight:f.height,fieldBottom:f.bottom,toolsTop:tools.top,toolsBottom:tools.bottom,actionsTop:actions.top}});
  let g=await geometry();assert.ok(g.fieldHeight>=100&&g.toolsTop>=g.fieldBottom&&g.actionsTop>=g.toolsBottom,JSON.stringify(g));
  await field.fill('Hello, I am learning English.');await tap(tutor.getByRole('button',{name:'Trimite / Continuă',exact:true}));await tutor.getByText(/Răspuns generat de AI/).waitFor();assert.ok(tutorCalls>=2);
  await tap(tutor.getByRole('button',{name:'🔊 Citește ultimul răspuns',exact:true}));assert.match((await page.evaluate(()=>window.__spoken)).at(-1),/Hello!/);
  await page.setViewportSize({width:viewport.width,height:430});await field.fill('A short question.');g=await geometry();assert.ok(g.fieldHeight>=100&&g.toolsTop>=g.fieldBottom&&g.actionsTop>=g.toolsBottom);
  await tap(tutor.getByRole('button',{name:'∑ Simboluri și șabloane',exact:true}));await tap(tutor.getByRole('button',{name:'Fracție',exact:true}));assert.match(await field.inputValue(),/\(a\)\/\(b\)/);
  await tap(tutor.getByRole('button',{name:'∑ Simboluri și șabloane',exact:true}));await page.setViewportSize(viewport);
  await field.scrollIntoViewIfNeeded();await page.screenshot({path:'.bundle-check/mobile-containment/tutor-'+viewport.width+'.png'});
  await tap(tutor.getByRole('button',{name:'← Revenire',exact:true}));await tutor.waitFor({state:'detached'});
  // Closing an in-flight tutor cannot leave the next dialog's Send disabled.
  holdAI=true;const requestedAI=new Promise(ok=>seenAI=ok);await page.evaluate(()=>window.__mobile.tutor());await requestedAI;await page.evaluate(()=>window.__mobile.back());await tutor.waitFor({state:'detached'});holdAI=false;releaseAI();
  failAI=true;await page.evaluate(()=>window.__mobile.tutor());await tutor.getByText(/Răspuns indisponibil/).waitFor();assert.equal(await tutor.getByRole('button',{name:'Trimite / Continuă',exact:true}).isEnabled(),true);failAI=false;await page.evaluate(()=>window.__mobile.back());await tutor.waitFor({state:'detached'});
  // The actual language lesson card: inherited flex-basis must not form columns.
  await page.evaluate(()=>window.__mobile.lesson());
  const wordCard=page.locator('.foreign-stage-lesson .foreign-word-card');await wordCard.waitFor();
  await tap(wordCard.locator('summary'));
  const cardLayout=await wordCard.evaluate(c=>{const r=c.getBoundingClientRect();return{left:r.left,right:r.right,scroll:c.scrollWidth,width:c.clientWidth,rows:[...c.children].filter(n=>!n.hidden).map(n=>{const b=n.getBoundingClientRect();return{left:b.left,right:b.right,top:b.top,bottom:b.bottom}})}});
  assert.ok(cardLayout.scroll<=cardLayout.width+1,JSON.stringify(cardLayout));
  for(let i=0;i<cardLayout.rows.length;i++){const r=cardLayout.rows[i];assert.ok(r.left>=cardLayout.left&&r.right<=cardLayout.right+1,JSON.stringify(cardLayout));if(i)assert.ok(r.top>=cardLayout.rows[i-1].bottom-1,JSON.stringify(cardLayout))}
  await wordCard.scrollIntoViewIfNeeded();await page.screenshot({path:'.bundle-check/mobile-containment/language-card-'+viewport.width+'.png'});
  // Reproduce RO VIII intervals. Topics, workspace and results are separate.
  await page.evaluate(()=>window.__mobile.math());
  const panel=page.locator('.math-national-panel'),list=panel.locator('.math-national-actions');
  assert.equal(await panel.locator('.edu-lesson-workspace').count(),0,'No inline workspace in topic/activity menu');
  await tap(list.getByRole('button',{name:'📘 Teorie pas cu pas',exact:true}));await page.locator('#educationPagedLessonDialog').waitFor();await page.evaluate(()=>window.__mobile.back());await page.locator('#educationPagedLessonDialog').waitFor({state:'detached'});
  await tap(panel.locator('.edu-workspace-open'));
  const modal=page.locator('.edu-workspace-dialog'),work=modal.locator('.edu-lesson-workspace');await work.waitFor();
  assert.equal(await work.evaluate(w=>w.closest('#moduleContent')),null);
  const answer=work.getByRole('textbox',{name:'Rezolvarea ta',exact:true});await answer.fill('Da, deoarece capătul 5 este inclus în [2,5].');
  await tap(work.getByRole('button',{name:'Alte opțiuni',exact:true}));await tap(work.getByRole('button',{name:'📖 Metodă și reper local',exact:true}));const reader=page.locator('#educationPagedLessonDialog');await reader.getByText(/Compară singur/).waitFor();
  await page.evaluate(()=>window.__mobile.back());await reader.waitFor({state:'detached'});assert.ok(await modal.isVisible());
  await tap(work.getByRole('button',{name:'🧩 Rezolvă pas cu pas',exact:true}));await reader.waitFor();
  assert.equal(await work.locator('[data-workspace-result]').isVisible(),false,'No inline result');
  await page.screenshot({path:'.bundle-check/mobile-containment/math-result-'+viewport.width+'.png'});
  const nextPage=reader.getByRole('button',{name:/Următor|Next/});await tap(nextPage);await page.evaluate(()=>window.__mobile.back());await reader.waitFor({state:'detached'});
  await answer.scrollIntoViewIfNeeded();await page.screenshot({path:'.bundle-check/mobile-containment/math-'+viewport.width+'.png'});
  await page.setViewportSize({width:viewport.width,height:430});await answer.fill('Rezolvare păstrată cu tastatura deschisă.');await tap(work.getByRole('button',{name:'Alte opțiuni',exact:true}));await tap(work.getByRole('button',{name:'📖 Metodă și reper local',exact:true}));await page.evaluate(()=>window.__mobile.back());await page.setViewportSize(viewport);
  await page.evaluate(()=>window.__mobile.back());await modal.waitFor({state:'detached'});
  await tap(panel.locator('.edu-workspace-open'));await work.waitFor();assert.equal(await answer.inputValue(),'Rezolvare păstrată cu tastatura deschisă.');await page.evaluate(()=>window.__mobile.back());await modal.waitFor({state:'detached'});
  await page.evaluate(()=>window.__mobile.mathTopics());
  const yearLaunch=page.locator('.edu-year-workspace-open');await yearLaunch.waitFor();
  const first=await page.locator('.math-national-panel button').first().getAttribute('class');assert.ok(first.includes('edu-year-workspace-open'),'Work area is the first class action');
  await tap(yearLaunch);await modal.waitFor();await modal.getByRole('textbox',{name:'Enunțul problemei',exact:true}).fill('2x + 3 = 9');await page.evaluate(()=>window.__mobile.back());await modal.waitFor({state:'detached'});
  await context.close();
 }
 assert.deepEqual(errors,[]);console.log('PASS touch/geometry regressions: 393×817 and 360×640, keyboard 430px, resource palette/tabs visible and responsive, TTS, AI tutor input/tools/actions non-overlap, cancelled/error AI retry, Android Back, nonoverlapping language cards, exact RO VIII interval lesson, first class workspace entry, separate modal, paginated results and draft return');
}finally{await browser.close();server.close();server.closeAllConnections?.()}
