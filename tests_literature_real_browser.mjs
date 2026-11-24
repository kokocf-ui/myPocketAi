// Runs the *actual built frontend* in headless Chromium, not a simulated DOM.
import assert from 'node:assert/strict';
import frontend from './index.js';
import {createServer} from 'node:http';
import {spawn,spawnSync} from 'node:child_process';
import {mkdtemp,rm} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const paths=['google-chrome','google-chrome-stable','chromium','chromium-browser'];
let executable='';
for(const candidate of paths){const p=spawnSync('which',[candidate],{encoding:'utf8'});if(p.status===0){executable=p.stdout.trim();break}}
assert.ok(executable,'Chromium/Chrome is required: cannot replace an actual browser test with mocks');
const response=await frontend.fetch(new Request('https://pocket.example/'));
assert.equal(response.status,200);
let html=await response.text();
// Test-only hook inside the existing app closure: set the same language a
// Romanian user selected in Settings, without exposing production globals.
assert.ok(html.includes('function litOpen(stage){'));
html=html.replace('function litOpen(stage){',
 "window.__literatureAcceptance={setLanguage(value){state.language=value},snapshot(){return {...litJourney}}};function litOpen(stage){");
const server=createServer((req,res)=>{
 if(req.url==='/favicon.ico'){res.writeHead(204);res.end();return}
 res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Access-Control-Allow-Origin':'*'});res.end(html)
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const browserPort=0;
const dir=await mkdtemp(path.join(os.tmpdir(),'pocket-browser-'));
const child=spawn(executable,[
 '--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage',
 '--no-first-run','--no-default-browser-check','--disable-background-networking',
 '--remote-allow-origins=*','--remote-debugging-port=0',
 '--user-data-dir='+dir,
 'http://127.0.0.1:'+server.address().port+'/'
],{stdio:'ignore'});
let ws=null;
const pending=new Map(),exceptions=[],logs=[];
let id=0;
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function connect(){
 for(let count=0;count<120;count++){
  try{
   const {readFile}=await import('node:fs/promises');
   const port=Number((await readFile(path.join(dir,'DevToolsActivePort'),'utf8')).split('\n')[0]);
   if(!port){await sleep(200);continue}
   const pages=await (await fetch('http://127.0.0.1:'+port+'/json/list')).json();
   // Chrome may spawn a background new-tab page before the requested app.
   const page=pages.find(x=>x.type==='page'&&x.url.includes('127.0.0.1'));

   if(!page){await sleep(200);continue}
   ws=new WebSocket(page.webSocketDebuggerUrl);
   await new Promise((ok,bad)=>{ws.onopen=ok;ws.onerror=bad});
   ws.onmessage=e=>{
    const msg=JSON.parse(e.data);
    if(msg.method==='Runtime.exceptionThrown')exceptions.push(msg.params.exceptionDetails?.text+' / '+msg.params.exceptionDetails?.exception?.description);
    if(msg.method==='Runtime.consoleAPICalled'&&['error','warning'].includes(msg.params.type))logs.push(msg.params.args?.map(x=>x.value||x.description).join(' '));
    if(msg.id&&pending.has(msg.id)){const {resolve,reject}=pending.get(msg.id);pending.delete(msg.id);msg.error?reject(Error(JSON.stringify(msg.error))):resolve(msg.result)}
   };
   return;
  }catch(err){await sleep(250)}
 }
 throw Error('Chrome did not become available');
}
async function cmd(method,params={}){const call=++id;return await new Promise((resolve,reject)=>{pending.set(call,{resolve,reject});ws.send(JSON.stringify({id:call,method,params}))})}
async function js(expr){
 const r=await cmd('Runtime.evaluate',{expression:expr,returnByValue:true,awaitPromise:true});
 if(r.exceptionDetails)throw Error('BROWSER EXCEPTION: '+(r.exceptionDetails.exception?.description||r.exceptionDetails.text));
 return r.result.value;
}
try{
 await connect();
 await cmd('Runtime.enable');
 await cmd('Page.enable');
 await cmd('Log.enable');
 await cmd('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
 await sleep(800);
 const visible=async()=>await js("Array.from(document.querySelectorAll('button,[role=button]')).map(x=>x.textContent?.trim().replace(/\\s+/g,' ').slice(0,85)).filter(Boolean).slice(0,65)");
 const tap=async(terms)=>{
  const expr="(()=>{const terms="+JSON.stringify(terms.map(x=>x.toLowerCase()))+";const buttons=Array.from(document.querySelectorAll('button,[role=button]'));const found=buttons.find(x=>terms.some(t=>(x.textContent||'').toLowerCase().includes(t)));if(found){found.click();return found.textContent.trim()}return null})()";
  const clicked=await js(expr);
  assert.ok(clicked,'Button not found for '+JSON.stringify(terms)+': '+JSON.stringify({url:await js('location.href'),buttons:await visible(),exceptions,logs}));
  await sleep(120);
  return clicked;
 };
 await tap(['education','educație','learning and education']);
 await tap(['language and literature','limbă și literatură']);
 const country=await js("(()=>{const i=document.getElementById('eduCountryInput');if(!i)return false;i.value='Romania';i.dispatchEvent(new Event('input',{bubbles:true}));const match=Array.from(document.querySelectorAll('.edu-country-matches button')).find(x=>/rom[aâ]n/i.test(x.textContent));if(match)match.click();return true})()");
 assert.ok(country,'Country selector was not opened for Literature: '+JSON.stringify({buttons:await visible(),exceptions,logs}));
 await tap(['Continue','Continuă']);
 const screen=await js("(()=>({buttons:[...document.querySelectorAll('[data-lit-quick-entry] button')].map(x=>x.textContent),title:document.querySelector('#moduleContent h2')?.textContent}))()");
 assert.equal(screen.buttons.length,2,'Two quick-reference buttons must appear before school level selection: '+JSON.stringify({screen,buttons:await visible()}));
 await js("document.querySelectorAll('[data-lit-quick-entry] button')[0].click()");
 const dict=await js("(()=>{const i=document.querySelector('.lit-quick-input');i.value='cop';i.dispatchEvent(new Event('input',{bubbles:true}));return {items:[...document.querySelectorAll('.lit-quick-option,.lit-quick-chip')].map(x=>x.textContent),results:document.querySelector('.lit-quick-results')?.innerText}})()");
 assert.ok(dict.items.some(x=>x.toLowerCase().includes('copac')),'Real WebView-style dictionary typed prefix cop has no clickable copac: '+JSON.stringify({dict,exceptions,logs}));

 const wordExample=await js("(()=>{const option=[...document.querySelectorAll('.lit-quick-option')].find(x=>x.textContent.trim()==='copac');option.click();const text=document.querySelector('.lit-quick-definition-text');const example=document.querySelector('.lit-quick-example-text');const article=document.querySelector('.lit-quick-detail');const list=document.querySelector('.lit-quick-results');return {definition:text?.textContent,example:example?.textContent,fontsize:parseFloat(getComputedStyle(text).fontSize),lineHeight:parseFloat(getComputedStyle(text).lineHeight),articleHeight:Math.round(article?.getBoundingClientRect().height||0),listDisplay:getComputedStyle(list).display,source:!!article.querySelector('a[href*=\"dexonline.ro\"]'),return:!!article.querySelector('.lit-quick-detail-back')}})()");
 assert.match(wordExample.definition,/Plantă lemnoasă|trunchi/);
 assert.ok(wordExample.example?.length>15,'The example is missing after selecting a dictionary word');
 assert.ok(wordExample.fontsize>=16&&wordExample.lineHeight>=27,'Dictionary definition is visually cramped on 390px phone: '+JSON.stringify(wordExample));
 assert.ok(wordExample.articleHeight>=240,'Dictionary detail is too small: '+JSON.stringify(wordExample));
 assert.equal(wordExample.listDisplay,'none','Dictionary must not squeeze detail and suggestions into the same panel');
 assert.ok(wordExample.source,'The full Romanian dictionary must be accessible as a named external source');
 const otherWord=await js("(()=>{document.querySelector('.lit-quick-detail-back').click();const i=document.querySelector('.lit-quick-input');i.value='găi';i.dispatchEvent(new Event('input',{bubbles:true}));const a=[...document.querySelectorAll('.lit-quick-option')].map(x=>x.textContent);return {results:a,body:document.querySelector('.lit-quick-results')?.innerText}})()");
 assert.ok(otherWord.results.some(x=>x==='găină'),'User test case găină should have an immediate offline suggestion');

 const grammar=await js("(()=>{document.querySelector('[data-lit-quick-overlay] .lit-quick-back').click();document.querySelectorAll('[data-lit-quick-entry] button')[1].click();return {initial:document.querySelector('.lit-quick-results')?.innerText,pinned:document.querySelector('.lit-quick-pinned')?.innerText,options:[...document.querySelectorAll('.lit-quick-option')].map(x=>x.textContent).slice(0,10)}})()");
 assert.ok(grammar.initial?.includes('Predicat')||grammar.pinned?.includes('Predicat'),'Actual browser grammar initially blank: '+JSON.stringify({grammar,exceptions,logs}));
 const typed=await js("(()=>{const i=document.querySelector('.lit-quick-input');i.value='predicat';i.dispatchEvent(new Event('input',{bubbles:true}));return {text:document.querySelector('.lit-quick-results')?.innerText,options:[...document.querySelectorAll('.lit-quick-option,.lit-quick-chip')].map(x=>x.textContent)}})()");
 assert.ok(typed.options.some(x=>x.includes('Predicat')),'Actual browser predicat typed has no options: '+JSON.stringify({typed,exceptions,logs}));
 const grammarMeaning=await js("(()=>{const o=[...document.querySelectorAll('.lit-quick-option')].find(x=>x.textContent.includes('Predicat'));o.click();return document.querySelector('.lit-quick-detail')?.innerText})()");
 assert.match(grammarMeaning,/subiect/i);

 const readableGrammar=await js("(()=>{const d=document.querySelector('.lit-quick-detail'),p=d.querySelector('.lit-quick-definition-text'),e=d.querySelector('.lit-quick-example-text');return {fontsize:parseFloat(getComputedStyle(p).fontSize),lineHeight:parseFloat(getComputedStyle(p).lineHeight),height:Math.round(d.getBoundingClientRect().height),exampleHeight:e?Math.round(e.getBoundingClientRect().height):0,returnVisible:getComputedStyle(d.querySelector('.lit-quick-detail-back')).display!=='none',list:getComputedStyle(document.querySelector('.lit-quick-results')).display}})()");
 assert.ok(readableGrammar.fontsize>=16&&readableGrammar.lineHeight>=27&&readableGrammar.height>=240,
  'Grammar definition must be spacious and readable on phone: '+JSON.stringify(readableGrammar));
 assert.equal(readableGrammar.list,'none');
 assert.ok(readableGrammar.returnVisible,'Selected terms need a visible return-to-list action');

 const abbreviation=await js("(()=>{document.querySelector('.lit-quick-detail-back').click();const t=[...document.querySelectorAll('.lit-quick-tab')].find(x=>/Abbrev|Prescurt/i.test(x.textContent));t.click();const a=[...document.querySelectorAll('.lit-quick-option')].find(x=>x.textContent.startsWith('etc.'));a.click();return {shown:document.querySelector('.lit-quick-detail')?.innerText,groups:[...document.querySelectorAll('.lit-quick-group')].length}})()");
 assert.match(abbreviation.shown,/celelalte/);
 assert.ok(abbreviation.groups>=3);
 const unit=await js("(()=>{document.querySelector('.lit-quick-detail-back').click();const t=[...document.querySelectorAll('.lit-quick-tab')].find(x=>/Unit/i.test(x.textContent));t.click();const u=[...document.querySelectorAll('.lit-quick-option')].find(x=>x.textContent.startsWith('km ·'));u.click();return document.querySelector('.lit-quick-detail')?.innerText})()");
 assert.match(unit,/Kilometru/);
 // Match the user's Romanian interface before asking for authored local theory.
 await js("window.__literatureAcceptance.setLanguage('ro')");
 // Navigate as a real learner: RO > liceu > clasa IX > lecție > teorie.
 const nine=await js("(()=>{document.querySelector('[data-lit-quick-overlay] .lit-quick-back').click();const cards=[...document.querySelectorAll('#moduleContent .lit-choice-card')];const b=cards.find(x=>/Liceu|Intermediate|upper secondary/i.test(x.textContent));if(!b)return {ok:false,cards:cards.map(x=>x.textContent)};b.click();return {ok:true}})()");
 assert.ok(nine.ok,'Upper-secondary selection is absent: '+JSON.stringify(nine));
 const grade=await js("(()=>{const cards=[...document.querySelectorAll('#moduleContent .lit-choice-card')];const b=cards.find(x=>x.textContent.trim()==='9');if(!b)return {ok:false,cards:cards.map(x=>x.textContent)};b.click();return {ok:true}})()");
 assert.ok(grade.ok,'Class IX is absent: '+JSON.stringify(grade));
 const branch=await js("(()=>{const cards=[...document.querySelectorAll('#moduleContent .lit-choice-card')];const b=cards.find(x=>/Grade 9 lessons|Lecțiile clasei 9/i.test(x.textContent));if(!b)return {ok:false,cards:cards.map(x=>x.textContent)};b.click();return {ok:true}})()");
 assert.ok(branch.ok,'Grade IX authored chapters absent: '+JSON.stringify(branch));
 const chapter=await js("(()=>{const cards=[...document.querySelectorAll('#moduleContent .lit-choice-card')];const b=cards[0];if(!b)return {ok:false,cards:[]};b.click();return {ok:true,choice:b.textContent}})()");
 assert.ok(chapter.ok,'Class IX has no first chapter');
 const theory=await js("(()=>{const buttons=[...document.querySelectorAll('#moduleContent button')];const t=buttons.find(x=>/Teorie|Theory/.test(x.textContent));if(!t)return {ok:false,buttons:buttons.map(x=>x.textContent)};t.click();return {ok:true}})()");
 assert.ok(theory.ok,'Actual Grade IX workspace has no theory action: '+JSON.stringify(theory));
 await sleep(350);
 const reader=await js("(()=>{const r=document.querySelector('.lit-reader-overlay,[data-literature-reader]');return {text:r?.innerText?.slice(0,7000)||'',visible:!!r,status:document.querySelector('#moduleContent')?.innerText?.slice(0,500),detail:window.__pocketLiteratureReaderDetail||''}})()");
 assert.ok(reader.visible,'Theory reader did not open: '+JSON.stringify({reader,exceptions,logs}));
 assert.ok(!/Războiul stelelor|George Lucas|Star Wars/i.test(reader.text),'Grade IX automatically inserted unrelated Star Wars example');
 // Exercise real navigation, stage choice, reader and Back on other systems.
 await js("[...document.querySelectorAll('.lit-reader-overlay button')].find(b=>/Înapoi|Back/.test(b.textContent)).click()");
 const litStage=()=>js('window.__literatureAcceptance.snapshot()');
 async function backToLevels(){
  for(let i=0;i<8;i++){
   const state=await litStage();if(state.stage==='levels')return;
   assert.ok(await js("(()=>{const b=document.querySelector('#view-module .lit-back');if(!b)return false;b.click();return true})()"),
    'No Literature back control from '+JSON.stringify({state,buttons:await visible(),backButtons:await js("[...document.querySelectorAll('button')].filter(x=>/Înapoi/.test(x.textContent)).map(x=>[x.className,x.closest('[id]')?.id])")}));
   await sleep(100);
  }
  assert.fail('Could not return to Literature levels: '+JSON.stringify(await litStage()));
 }
 async function chooseCountry(name,matcher){
  await backToLevels();
  await js("document.querySelector('#view-module .lit-back').click()");
  const selected=await js("(()=>{const input=document.getElementById('eduCountryInput');if(!input)return false;input.value="+JSON.stringify(name)+";input.dispatchEvent(new Event('input',{bubbles:true}));const button=[...document.querySelectorAll('.edu-country-matches button')].find(x=>new RegExp("+JSON.stringify(matcher)+",'i').test(x.textContent));if(!button)return false;button.click();return true})()");
  assert.ok(selected,'Could not select '+name+': '+JSON.stringify({buttons:await visible(),exceptions,logs}));
  await tap(['Continuă','Continue']);
 }
 async function choice(regex){
  const result=await js("(()=>{const r=new RegExp("+JSON.stringify(regex)+",'i');const cards=[...document.querySelectorAll('#moduleContent .lit-choice-card')];const b=cards.find(x=>r.test(x.textContent.trim()));if(!b)return {ok:false,cards:cards.map(x=>x.textContent)};const text=b.textContent;b.click();return {ok:true,text}})()");
  assert.ok(result.ok,'Choice '+regex+' absent: '+JSON.stringify({result,journey:await litStage(),exceptions,logs}));
  await sleep(100);
 }
 await chooseCountry('France','Fran|France');
 await choice('Gimnaziu|lower secondary');await choice('^6e$');
 await choice('Programa clasei|Grade syllabus');
 const france=await litStage();assert.equal(france.level,'lower');assert.equal(france.grade,'6e');
 await choice('Poezie|Poetry');await js("[...document.querySelectorAll('#moduleContent .lit-activity-button')].find(b=>/^(Exerciții|Exercises)$/.test(b.textContent.trim())).click()");await sleep(250);
 const poem=await js("document.querySelector('.lit-reader-overlay')?.innerText||''");
 assert.match(poem,/dansează ploaia|Rain dances/,'Poetry exercise must include its relevant original poem: '+JSON.stringify({journey:await litStage(),text:await js("document.querySelector('#view-module')?.innerText"),exceptions,logs}));
 assert.ok(!/Unde s-a găsit cartea|Where was the book found/.test(poem),'Unrelated book question in poetry');
 await js("[...document.querySelectorAll('.lit-reader-overlay button')].find(b=>/Înapoi|Back/.test(b.textContent)).click()");
 await chooseCountry('Hungary','Ungar|Hungary');
 await choice('Primar|Primary');await choice('^1$');await choice('Programa clasei|Grade syllabus');
 // The three year-focused HU lessons must work without any network request.
 await choice('Betűk');await js("window.fetch=async()=>{throw new TypeError('Failed to fetch')}");
 await js("[...document.querySelectorAll('#moduleContent .lit-activity-button')].find(b=>/^(Teorie|Theory)$/.test(b.textContent.trim())).click()");await sleep(200);
 const hungarian=await js("document.querySelector('.lit-reader-overlay')?.innerText||''");
 assert.match(hungarian,/szem/,'Grade 1 Hungary lesson must contain actual Hungarian examples');
 assert.ok(!/NU lecția completă specifică/.test(hungarian),'A dedicated chapter must not use the general fallback');
 await js("[...document.querySelectorAll('.lit-reader-overlay button')].find(b=>/Înapoi|Back/.test(b.textContent)).click()");
 await js("document.querySelector('#view-module .lit-back').click()");await sleep(100);
 await choice('Hangtan');
 // Simulate an unavailable online service, not a successful invented lesson.
 await js("[...document.querySelectorAll('#moduleContent .lit-activity-button')].find(b=>/^(Teorie|Theory)$/.test(b.textContent.trim())).click()");await sleep(250);
 const fallback=await js("({reader:document.querySelector('.lit-reader-overlay')?.innerText||'',status:document.querySelector('.lit-activity-status')?.textContent||''})");
 assert.match(fallback.reader,/NU lecția completă specifică/,'National chapter must disclose limited offline support');
 assert.match(fallback.status,/doar sprijin general offline/);
 await js("[...document.querySelectorAll('.lit-reader-overlay button')].find(b=>/Înapoi|Back/.test(b.textContent)).click()");
 await backToLevels();await choice('Primar|Primary');await choice('^2$');
 await choice('Programa clasei|Grade syllabus');await choice('Szövegértés és eseményrend');
 await js("[...document.querySelectorAll('#moduleContent .lit-activity-button')].find(b=>/^(Teorie|Theory)$/.test(b.textContent.trim())).click()");await sleep(200);
 const secondGrade=await js("document.querySelector('.lit-reader-overlay')?.innerText||''");
 assert.match(secondGrade,/Bence/,'Hungary grade 2 must use its own offline passage');
 assert.ok(!/NU lecția completă specifică/.test(secondGrade),'Grade 2 authored chapter must not show generic fallback');
 await js("[...document.querySelectorAll('.lit-reader-overlay button')].find(b=>/Înapoi|Back/.test(b.textContent)).click()");
 await backToLevels();await choice('Universitate|University');await choice('Licență.*anul I$|Bachelor.*Year 1$');
 await choice('Programa clasei|Grade syllabus');await choice('Introducere în studiile literare');
 await js("[...document.querySelectorAll('#moduleContent .lit-activity-button')].find(b=>/^(Teorie|Theory)$/.test(b.textContent.trim())).click()");await sleep(200);
 const university=await js("document.querySelector('.lit-reader-overlay')?.innerText||''");
 assert.match(university,/Obiectul studiului/,'University lesson must use its own offline material');
 await js("[...document.querySelectorAll('.lit-reader-overlay button')].find(b=>/Următoarea/.test(b.textContent)&&!b.disabled)?.click()");
 const universityNext=await js("document.querySelector('.lit-reader-overlay')?.innerText||''");
 assert.match(universityNext,/Metodă de lucru/,'University reader pagination must reach the method');
 console.log('PASS real Chromium mobile 390x844: quick reference, RO grade IX, FR year 6 poetry, HU honest offline fallback and university reader/navigation');
}finally{
 try{ws?.close()}catch{}
 child.kill('SIGKILL');
 server.close();
 await rm(dir,{recursive:true,force:true});
}
