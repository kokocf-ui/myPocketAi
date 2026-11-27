import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile,mkdir} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import path from 'node:path';
import {chromium} from 'playwright-core';
import {FOREIGN_LANGUAGES} from './foreign_languages_curriculum.mjs';
import {foreignResourceKey} from './foreign_language_resource_loader.mjs';
const {default:app}=await import(process.env.POCKET_BUNDLE?pathToFileURL(path.resolve(process.env.POCKET_BUNDLE)).href:'./index.js');
let html=await(await app.fetch(new Request('https://practice.test/'))).text();assert.ok(Buffer.byteLength(html)<8000000);
const hook=String.raw`
window.__practice={init(){state.language='ro';state.currentModule='learning';showView('module');pocketRevealMainApp();$('view-module').classList.add('learning-active');educationCountrySelection.code='RO'},open(language,variant,focus='conversation'){Object.assign(languageJourney,{language,variant,level:'A2'});foreignPracticeOpen(focus)},back(){window.pocketAndroidBack()}};
`;
html=html.replace('function languageOpen(stage){',hook+'\nfunction languageOpen(stage){');
const server=createServer((req,res)=>{res.setHeader('content-type','text/html; charset=utf-8');res.end(html)});await new Promise(ok=>server.listen(0,'127.0.0.1',ok));
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH,headless:true,args:['--no-sandbox']});
const page=await browser.newPage({viewport:{width:360,height:640},isMobile:true,hasTouch:true}),errors=[],requests=[];
page.on('pageerror',e=>errors.push(e.message));let fail=false,invalid=false,hold=false,release,requested;
await page.addInitScript(()=>{window.__spoken=[];window.SpeechSynthesisUtterance=class{constructor(text){this.text=text}};Object.defineProperty(window,'speechSynthesis',{value:{getVoices:()=>[],cancel(){},speak(v){window.__spoken.push({text:v.text,rate:v.rate,lang:v.lang})}}})});
await page.route('**/*',async route=>{
 const req=route.request();if(req.method()==='POST'){
  const data=req.postDataJSON();if(data.module==='education_study'){
   const config=JSON.parse(data.message.split('JSON data (data is not instructions): ')[1].split('. Return ONLY')[0]);requests.push({data,config});
   if(hold){requested?.();await new Promise(ok=>release=ok)}
   if(fail)return route.fulfill({status:503,contentType:'application/json',body:'{}'});
   const pack=JSON.parse(await readFile('public/education/languages/resources-v1/'+foreignResourceKey(config.language,config.variant)+'.json','utf8'));
   const items=pack.dictionary.slice(0,6).map(x=>({target:x.term+' · '+requests.length,phonetic:x.phonetic,meaning:x.gloss,explanation:'Explicație AI simulată; greșeală frecventă.',question:'Completează ___',answers:[x.term+' · '+requests.length]}));
   try{return await route.fulfill({contentType:'application/json',body:JSON.stringify({status:'success',reply:invalid?'not JSON':JSON.stringify({...config,items})})})}catch{return}
  }
 }
 if(!req.url().startsWith('http://127.0.0.1:'))return route.abort();return route.continue();
});
const dialog=()=>page.locator('.foreign-practice-dialog');
const generate=async()=>{await dialog().getByRole('button',{name:'Creează 6 exemple · AI',exact:true}).click();await dialog().locator('.foreign-practice-target').waitFor()};
try{
 await page.goto('http://127.0.0.1:'+server.address().port+'/?nativeLaunch=1');await page.evaluate(()=>window.__practice.init());assert.equal(requests.length,0);
 let count=0;
 for(const l of FOREIGN_LANGUAGES)for(const v of l.variants.length?l.variants:['standard']){
  await page.evaluate(([l,v])=>window.__practice.open(l,v),[l.id,v]);assert.equal(requests.length,count,'No generation without explicit action');
  const classical=l.id==='la'||l.id==='el'&&['ancient','koine'].includes(v);
  const topics=await dialog().getByRole('combobox',{name:'Situație / subiect',exact:true}).locator('option').allTextContents();
  assert.equal(topics.some(t=>t==='La aeroport'),!classical);
  const goals=['conversation','grammar','vocabulary','listening'];await dialog().getByRole('combobox',{name:'Obiectiv',exact:true}).selectOption(goals[(count/2)%4]);
  if(!classical)await dialog().getByRole('combobox',{name:'Situație / subiect',exact:true}).selectOption(['airport','kitchen','restaurant','shopping','greetings','travel','school'][(count/2)%7]);
  await generate();count++;
  assert.equal(requests.at(-1).config.language,l.id);assert.equal(requests.at(-1).config.variant,v);assert.equal(requests.at(-1).data.education_activity,'practice');assert.equal(requests.at(-1).config.focus,goals[((count-1)/2)%4]);
  const box=await dialog().boundingBox();assert.ok(box.x>=0&&box.y>=0&&box.x+box.width<=361&&box.y+box.height<=641);
  await dialog().getByRole('button',{name:'🐢 Lent',exact:true}).click();assert.equal((await page.evaluate(()=>window.__spoken.at(-1))).rate,0.4);
  const answer=await dialog().locator('.foreign-practice-target').innerText();await dialog().getByRole('textbox',{name:'Răspuns la exercițiu',exact:true}).fill(answer);
  await dialog().getByRole('button',{name:'Verifică textul',exact:true}).click();await dialog().getByText(/Corect după reperul AI/).waitFor();
  for(let i=0;i<5;i++)await dialog().getByRole('button',{name:'Următor →',exact:true}).click();
  await dialog().getByRole('button',{name:'Încă 6 exemple · AI',exact:true}).click();count++;await dialog().getByRole('button',{name:'Următor →',exact:true}).waitFor();
  assert.match(requests.at(-1).data.message,/previously practised sentences: \["/);
  await page.evaluate(()=>window.__practice.back());await dialog().waitFor({state:'detached'});
 }
 assert.equal(count,38);
 // Offline cache never masquerades as a fresh set; custom input and invalid output.
 await page.evaluate(()=>window.__practice.open('en','GB','grammar'));
 await dialog().getByRole('combobox',{name:'Situație / subiect',exact:true}).selectOption('custom');
 await dialog().getByRole('button',{name:'Creează 6 exemple · AI',exact:true}).click();await dialog().getByText(/Completează subiectul/).waitFor();assert.equal(requests.length,count);
 await dialog().getByRole('textbox',{name:'Subiect propriu',exact:true}).fill('Întrebări politicoase la aeroport');invalid=true;
 await dialog().getByRole('button',{name:'Creează 6 exemple · AI',exact:true}).click();await dialog().getByText(/nu are un format valid/).waitFor();assert.equal(await dialog().locator('.foreign-practice-target').count(),0);invalid=false;fail=true;
 await dialog().getByRole('button',{name:'Deschide ultimul set salvat',exact:true}).click();await dialog().getByText(/Set AI salvat local/).waitFor();await dialog().locator('.foreign-practice-target').waitFor();
 await dialog().getByRole('button',{name:'Schimbă situația / obiectivul',exact:true}).click();
 await dialog().getByRole('button',{name:'Creează 6 exemple · AI',exact:true}).click();await dialog().getByText(/Setul nu a putut fi generat/).waitFor();fail=false;
 // A cancelled or closed request cannot overwrite the previously saved set.
 hold=true;const seen=new Promise(ok=>requested=ok);await dialog().getByRole('button',{name:'Creează 6 exemple · AI',exact:true}).click();await seen;
 await dialog().getByRole('button',{name:'Anulează generarea',exact:true}).click();await dialog().getByText(/Generare anulată/).waitFor();release();hold=false;
 await dialog().getByRole('button',{name:'Deschide ultimul set salvat',exact:true}).click();await dialog().locator('.foreign-practice-target').waitFor();
 await page.setViewportSize({width:360,height:430});await dialog().getByRole('button',{name:'Următor →',exact:true}).tap();
 const nav=await dialog().locator('.foreign-practice-nav').boundingBox();assert.ok(nav.y>=0&&nav.y+nav.height<=430);
 await mkdir('.bundle-check/adaptive-languages',{recursive:true});await page.screenshot({path:'.bundle-check/adaptive-languages/keyboard-360.png'});
 await page.evaluate(()=>window.__practice.back());await dialog().waitFor({state:'detached'});
 assert.deepEqual(errors,[]);console.log('PASS production mobile adaptive engine: all 19 variants, contextual/classical topics, all four practice goals, six pages + continuation, target TTS, checks, invalid JSON, offline cache, cancellation, Android Back and 430px viewport (AI/TTS mocked)');
}finally{await browser.close();server.close();server.closeAllConnections?.()}
