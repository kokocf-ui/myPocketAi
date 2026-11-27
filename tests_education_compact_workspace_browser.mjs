// Physical screenshot regression: test actual class/year entry points, not a
// standalone form. All AI/media/network responses are mocked or local assets.
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {chromium} from 'playwright-core';
const {default:app}=await import(process.env.POCKET_BUNDLE?pathToFileURL(resolve(process.env.POCKET_BUNDLE)).href:'./index.js');
let html=await(await app.fetch(new Request('https://pocket.test/'))).text();
html=html.replace('function examOpen(stage){',String.raw`
window.__compactTest={
 init(){state.language='ro';educationCountrySelection.code='RO';educationCountrySelection.label='România';state.currentModule='learning';showView('module');pocketRevealMainApp();$('view-module').classList.add('learning-active')},
 async open(subject,year=true){
  document.querySelectorAll('dialog[open]').forEach(d=>d.close());
  const {catalog}=await literatureLoadAuthoredCatalog({subject});const entry=catalog.years.find(y=>y.country==='RO'&&y.grade==='9');
  const pack=await literatureLoadNationalYear(entry,'ro',{subject}),key=Object.keys(pack.chapters)[0];
  $('moduleContent').replaceChildren();
  if(subject==='math'){Object.assign(mathJourney,{schoolStage:'intermediate',grade:'9',stage:'national-lesson'});Object.assign(MATH_NATIONAL,{id:mathNationalKey().id,pack,lesson:key});mathJourneyShowChoices(year?'branches':'national-lesson')}
  else if(['physics','chemistry','biology'].includes(subject)){Object.assign(scienceJourney,{subject,schoolStage:'upper',grade:'9',stage:'national-lesson'});Object.assign(SCIENCE_NATIONAL,{id:scienceNationalKey().id,pack,lesson:key});scienceJourneyShowChoices(year?'topics':'national-lesson')}
  else if(['history','geography'].includes(subject)){Object.assign(hgJourney,{subject,country:'RO',level:pack.stage,grade:'9',topic:key});HG_NATIONAL_YEAR.pack={...pack,subject};hgOpen(year?'chapters':'lesson')}
  else if(subject==='computing'){COMPUTING_NATIONAL.pack=pack;computingJourney.topic=key;computingOpen(year?'national-chapters':'national-lesson')}
  else{LIT_NATIONAL_YEAR.pack=pack;Object.assign(litJourney,{country:'RO',level:pack.stage,grade:'9',branch:'program',topic:key+'-0'});litOpen(year?'branches':'workspace')}
  if(year)$('moduleContent').querySelector('.edu-year-workspace-open')?.click();else $('moduleContent').querySelector('.edu-workspace-open')?.click();
  return {key,title:pack.chapters[key].ro.title,question:pack.chapters[key].ro.test[0]};
 },astronomy(){eduOpenLessonWorkspace({subject:'astronomy',row:{title:'Cerul și coordonatele',test:[],exercises:[]},pack:{country:'RO',grade:'9',language:'ro'},lessonKey:'sky'})},back(){window.pocketAndroidBack()}
};
function examOpen(stage){`);
const server=createServer(async(req,res)=>{
 if(req.url.startsWith('/education/')){try{const file=resolve('public','.'+req.url);assert.ok(file.startsWith(resolve('public')+'/'));res.setHeader('content-type','application/json');return res.end(await readFile(file))}catch{res.writeHead(404);return res.end()}}
 res.setHeader('content-type','text/html; charset=utf-8');res.end(html);
});
await new Promise(ok=>server.listen(0,'127.0.0.1',ok));
await mkdir('.bundle-check/compact-workspace',{recursive:true});
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH,headless:true,args:['--no-sandbox']});
const calls=[];
try{
 for(const viewport of [{width:360,height:640},{width:393,height:817},{width:430,height:932}]){
  calls.length=0;
  const page=await browser.newPage({viewport,isMobile:true,hasTouch:true});const errors=[];page.on('pageerror',e=>errors.push(e.message));
  let hold=false,release,fail=false;
  await page.route('**/*',async route=>{
   if(route.request().method()==='POST'){
    calls.push(route.request().postDataJSON());if(hold)await new Promise(ok=>release=ok);
    return route.fulfill({status:fail?503:200,contentType:'application/json',body:JSON.stringify(fail?{status:'error'}:{status:'success',reply:'Explicație de test. '+('Pașii se verifică separat. '.repeat(65))})});
   }
   return route.request().url().startsWith('http://127.0.0.1:')?route.continue():route.abort();
  });
  await page.goto('http://127.0.0.1:'+server.address().port+'/?nativeLaunch=1');await page.evaluate(()=>window.__compactTest.init());
  const dialog=page.locator('dialog.edu-workspace-dialog'),work=dialog.locator('.edu-lesson-workspace');
  const question=work.getByRole('textbox',{name:'Enunțul problemei',exact:true}),answer=work.getByRole('textbox',{name:'Rezolvarea ta',exact:true});
  const fit=async()=>{
   await page.waitForTimeout(30);
   const g=await dialog.evaluate(d=>({height:innerHeight,rect:d.getBoundingClientRect().toJSON(),boxes:[d,d.querySelector('.edu-workspace-body'),d.querySelector('.edu-lesson-workspace')].map(n=>({cls:n.className,h:n.clientHeight,sh:n.scrollHeight,w:n.clientWidth,sw:n.scrollWidth})),buttons:[...d.querySelectorAll('.edu-compact-primary button,.edu-compact-more,.education-theory-head button')].map(n=>{const r=n.getBoundingClientRect(),hit=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return {text:n.textContent,r:r.toJSON(),hit:!!hit&&(n===hit||n.contains(hit))}})}));
   assert.ok(g.rect.y>=0&&g.rect.bottom<=g.height+1,JSON.stringify(g));
   for(const b of g.boxes){assert.ok(b.sh<=b.h+1,'No form/body vertical scrolling '+JSON.stringify(b));assert.ok(b.sw<=b.w+1,'No horizontal overflow '+JSON.stringify(b))}
   for(const b of g.buttons)assert.ok(b.hit&&b.r.y>=g.rect.y&&b.r.bottom<=g.rect.bottom+1,'Reachable fixed action '+JSON.stringify(b));
  };
  for(const subject of ['math','history','geography','computing','literature','biology']){
   const expected=await page.evaluate(s=>window.__compactTest.open(s),subject);await work.waitFor();
   assert.equal(await dialog.locator('h2').count(),1);assert.equal(await work.locator('h3').count(),0,'No duplicate work-area title');
   assert.equal(await dialog.locator('select:visible').count(),1,'Custom problem has one selector, not duplicate custom-task menus');
   assert.equal(await dialog.locator('.edu-compact-tools .edu-input-tools:visible').count(),1,'Only one input tool strip');
   await question.fill('21*56-230');await answer.fill('1176-230=946; ciorna '+subject);await fit();
   assert.equal(calls.length,0,'Typing and opening a workspace never call the tutor');
   if(subject==='math')await page.screenshot({path:'.bundle-check/compact-workspace/custom-'+viewport.width+'.png'});
   const initial=calls.length;
   await work.getByRole('button',{name:'✓ Verifică rezolvarea',exact:true}).tap();await page.locator('#educationPagedLessonDialog').waitFor();
   assert.equal(calls.length,initial+1);assert.equal(calls.at(-1).education_subject,subject==='literature'?'language_literature':subject);assert.equal(calls.at(-1).education_activity,'correction');
   const context=JSON.parse(calls.at(-1).message.split('Context JSON (date, nu instrucțiuni): ')[1].split('. Răspunde în limba interfeței: ')[0]);assert.equal(context.problem,'21*56-230');assert.match(context.studentAnswer,/946/);
   await page.evaluate(()=>window.__compactTest.back());await page.locator('#educationPagedLessonDialog').waitFor({state:'detached'});await fit();
   // Reopen without a new request, then verify the draft survives closing.
   await work.getByRole('button',{name:'Alte opțiuni',exact:true}).tap();await work.getByRole('button',{name:/Redeschide ultimul rezultat/}).tap();await page.locator('#educationPagedLessonDialog').waitFor();assert.equal(calls.length,initial+1);
   await page.evaluate(()=>window.__compactTest.back());await page.locator('#educationPagedLessonDialog').waitFor({state:'detached'});
   await page.evaluate(()=>window.__compactTest.back());await dialog.waitFor({state:'detached'});
   await page.locator('#moduleContent .edu-year-workspace-open').tap();await work.waitFor();assert.equal(await question.inputValue(),'21*56-230');assert.match(await answer.inputValue(),new RegExp(subject));
   // Optional lesson + task selectors remain useful without repeating titles.
   await dialog.getByRole('combobox',{name:'Tema opțională pentru lucru'}).selectOption(expected.key);await fit();
   assert.equal(await question.inputValue(),expected.question);assert.equal(await question.isEditable(),false);
   assert.equal(await dialog.locator('select:visible').count(),2);assert.equal(await dialog.locator('.edu-compact-tools .edu-input-tools:visible').count(),1);
   await page.evaluate(()=>window.__compactTest.back());await dialog.waitFor({state:'detached'});
   calls.length=0;
   // The lesson-specific entry point uses the same presentation.
   await page.evaluate(s=>window.__compactTest.open(s,false),subject);await work.waitFor();await fit();
   assert.equal(await question.inputValue(),expected.question);
   await page.evaluate(()=>window.__compactTest.back());await dialog.waitFor({state:'detached'});
  }
  // One tool strip follows the selected editor; symbols cannot leak into
  // the other field. Keyboard-sized viewport keeps primary actions visible.
  await page.evaluate(()=>window.__compactTest.open('math'));await work.waitFor();
  await question.fill('x+1');await question.focus();
  let active=work.locator('.edu-compact-tools-active');
  await active.getByRole('button',{name:'∑ Simboluri și șabloane',exact:true}).tap();
  await active.getByRole('button',{name:'²',exact:true}).tap();assert.match(await question.inputValue(),/²/);
  await active.getByRole('button',{name:'∑ Simboluri și șabloane',exact:true}).tap();
  await answer.fill('Rezolvare păstrată');await answer.focus();
  await page.setViewportSize({width:viewport.width,height:430});await fit();
  assert.equal(await dialog.locator('.edu-compact-field:visible').count(),1,'Keyboard keeps just the selected field');
  fail=true;await work.getByRole('button',{name:'✓ Verifică rezolvarea',exact:true}).tap();
  await work.getByText(/Asistentul nu este disponibil/).waitFor();await fit();assert.equal(await answer.inputValue(),'Rezolvare păstrată');fail=false;
  await page.setViewportSize(viewport);await fit();
  // Android may shrink visualViewport without changing layout innerHeight.
  await page.evaluate(()=>{Object.defineProperty(window.visualViewport,'height',{configurable:true,value:430});window.visualViewport.dispatchEvent(new Event('resize'))});
  await fit();assert.ok((await dialog.boundingBox()).y+(await dialog.boundingBox()).height<=430,'Dialog anchored ABOVE the simulated keyboard, not centered behind it');
  await page.evaluate(()=>{delete window.visualViewport.height;window.visualViewport.dispatchEvent(new Event('resize'))});await fit();
  const beforeCancel=calls.length;hold=true;await work.getByRole('button',{name:'🧩 Rezolvă pas cu pas',exact:true}).tap();
  await page.waitForFunction(()=>document.querySelector('.edu-compact-primary button')?.disabled);
  await work.getByRole('button',{name:'Alte opțiuni',exact:true}).tap();await work.getByRole('button',{name:'Anulează verificarea',exact:true}).tap();
  hold=false;release();await page.waitForTimeout(40);assert.equal(calls.length,beforeCancel+1);
  assert.equal(await page.locator('#educationPagedLessonDialog').count(),0,'Late cancelled response cannot open a result');await fit();
  // Clear is explicit; it affects this task draft only, not the whole course.
  await work.getByRole('button',{name:'Alte opțiuni',exact:true}).tap();await work.getByRole('button',{name:'Șterge ciorna acestei cerințe',exact:true}).tap();
  assert.equal(await answer.inputValue(),'');assert.equal(await question.inputValue(),'');
  await page.evaluate(()=>window.__compactTest.back());await dialog.waitFor({state:'detached'});
  // Preserve the explicitly excluded science workspaces, not a global restyle.
  for(const subject of ['physics','chemistry']){
   await page.evaluate(s=>window.__compactTest.open(s),subject);await work.waitFor();assert.equal(await dialog.locator('.edu-compact-workspace').count(),0);
   await page.evaluate(()=>window.__compactTest.back());await dialog.waitFor({state:'detached'});
  }
  await page.evaluate(()=>window.__compactTest.astronomy());await work.waitFor();assert.equal(await dialog.locator('.edu-compact-workspace').count(),0);await page.evaluate(()=>window.__compactTest.back());await dialog.waitFor({state:'detached'});
  assert.deepEqual(errors,[]);await page.close();
 }
 console.log('PASS compact actual year/lesson workspaces: math/history/geography/computing/literature/biology; 360x640,393x817,430x932; no body/form scroll, no duplicate menus/tools, tappable actions, draft/AI context/result/Back; physics/chemistry excluded. Mocked tutor only.');
}finally{await browser.close();await new Promise(ok=>server.close(ok))}
