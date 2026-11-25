// National Year 1 Literature packs in the *actual built frontend* (headless
// Chromium, 390x844 mobile): language-of-instruction choice, the lesson flow,
// offline reuse of the cached pack and the original-language fallback.
import assert from 'node:assert/strict';
import frontend from './index.js';
import {createServer} from 'node:http';
import {spawn,spawnSync} from 'node:child_process';
import {mkdtemp,rm,readFile} from 'node:fs/promises';
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
const served=[];
const server=createServer(async(req,res)=>{
 if(req.url==='/favicon.ico'){res.writeHead(204);res.end();return}
 const asset=req.url.match(/^\/education\/literature\/profiles\/([A-Z-]+)\.json$/);
 if(asset){
  try{const data=await readFile(new URL('./public/education/literature/profiles/'+asset[1]+'.json',import.meta.url));res.writeHead(200,{'Content-Type':'application/json'});res.end(data)}
  catch{res.writeHead(404);res.end()}
  return;
 }
 const national=req.url.match(/^\/education\/literature\/authored\/(catalog\.json|[A-Z]{2}(?:-[A-Z]{3})?\/[a-z]{2,3}-[a-z0-9-]+\.json)$/);
 if(national){
  served.push(national[1]);
  try{const data=await readFile(new URL('./public/education/literature/authored/'+national[1],import.meta.url));res.writeHead(200,{'Content-Type':'application/json'});res.end(data)}
  catch{res.writeHead(404);res.end()}
  return;
 }
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
 await cmd('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
 await sleep(800);
 const visible=async()=>await js("Array.from(document.querySelectorAll('button,[role=button]')).map(x=>x.textContent?.trim().replace(/\\s+/g,' ').slice(0,85)).filter(Boolean).slice(0,65)");
 const tap=async(terms)=>{
  const expr="(()=>{const terms="+JSON.stringify(terms.map(x=>x.toLowerCase()))+";const buttons=Array.from(document.querySelectorAll('button,[role=button]'));const found=buttons.find(x=>terms.some(t=>(x.textContent||'').toLowerCase().includes(t)));if(found){found.click();return found.textContent.trim()}return null})()";
  const clicked=await js(expr);
  assert.ok(clicked,'Button not found for '+JSON.stringify(terms)+': '+JSON.stringify({buttons:await visible(),exceptions,logs}));
  await sleep(150);
  return clicked;
 };
 const litStage=async()=>await js("window.__literatureAcceptance.snapshot()");
 const cards=async()=>await js("[...document.querySelectorAll('#moduleContent .lit-choice-card')].map(x=>x.textContent.trim())");
 async function choice(regex){
  const result=await js("(()=>{const r=new RegExp("+JSON.stringify(regex)+",'i');const cards=[...document.querySelectorAll('#moduleContent .lit-choice-card')];const b=cards.find(x=>r.test(x.textContent.trim()));if(!b)return {ok:false,cards:cards.map(x=>x.textContent)};const text=b.textContent;b.click();return {ok:true,text}})()");
  assert.ok(result.ok,'Choice '+regex+' absent: '+JSON.stringify({result,journey:await litStage(),exceptions,logs}));
  await sleep(150);
  return result.text;
 }
 async function waitFor(expr,label,ms=6000){
  for(let t=0;t<ms;t+=100){const v=await js(expr);if(v)return v;await sleep(100)}
  assert.fail(label+': '+JSON.stringify({journey:await litStage(),content:await js("document.querySelector('#moduleContent')?.innerText.slice(0,600)"),exceptions,logs}));
 }
 await js("window.__literatureAcceptance.setLanguage('ro')");
 await tap(['education','educație','learning and education']);
 await tap(['language and literature','limbă și literatură']);
 const picked=await js("(()=>{const i=document.getElementById('eduCountryInput');if(!i)return false;i.value='Belgium';i.dispatchEvent(new Event('input',{bubbles:true}));const m=[...document.querySelectorAll('.edu-country-matches button')].find(x=>/belg/i.test(x.textContent));if(!m)return false;m.click();return true})()");
 assert.ok(picked,'Belgium is not selectable');
 await tap(['Continuă','Continue']);
 await waitFor("window.__literatureAcceptance.snapshot().stage==='levels'",'Belgium profile did not load');
 await choice('^Primar|^Primary');
 await choice('^1$');
 const chooser=await waitFor("(()=>{const b=[...document.querySelectorAll('#moduleContent .lit-instruction-language')];if(!b.length)return null;return {labels:b.map(x=>x.textContent.trim()),boxes:b.map(x=>{const r=x.getBoundingClientRect();return {w:r.width,h:r.height,right:r.right}}),text:document.querySelector('#moduleContent .lit-national-year')?.textContent||''}})()",'No language-of-instruction choice for Belgium 1');
 assert.deepEqual([...chooser.labels].sort(),['Deutsch','Français','Nederlands']);
 assert.match(chooser.text,/Alege limba de școlarizare/);
 for(const box of chooser.boxes)assert.ok(box.w>0&&box.h>=40&&box.right<=390,'Language buttons must be tappable inside a 390px screen: '+JSON.stringify(chooser.boxes));
 assert.deepEqual(served,['catalog.json'],'Only the catalog may be fetched before a language is chosen');
 const openTheory=async lang=>{
  await js("window.__literatureAcceptance.setLanguage("+JSON.stringify(lang)+");[...document.querySelectorAll('#moduleContent .lit-activity-button')].find(b=>/^(Teorie|Theory)$/.test(b.textContent.trim())).click()");
  await sleep(400);
  return await js("({reader:document.querySelector('.lit-reader-overlay')?.innerText||'',status:document.querySelector('.lit-activity-status')?.textContent||''})");
 };
 const closeReader=async()=>{await js("window.__literatureAcceptance.setLanguage('ro');[...document.querySelectorAll('.lit-reader-overlay button')].find(b=>/Înapoi|Back|Terug|Retour|Zurück/.test(b.textContent))?.click()");await sleep(150)};
 const backToGrades=async()=>{
  for(let i=0;i<6&&(await litStage()).stage!=='grades';i++){await js("document.querySelector('#view-module .lit-back')?.click()");await sleep(150)}
  assert.equal((await litStage()).stage,'grades');
 };
 // 1. Dutch: real learner path, original lesson and exercises in Dutch.
 await js("[...document.querySelectorAll('#moduleContent .lit-instruction-language')].find(x=>/Nederlands/.test(x.textContent)).click()");
 await waitFor("window.__literatureAcceptance.snapshot().stage==='branches'",'Dutch pack did not open');
 assert.equal((await litStage()).instructionLanguage,'nl');
 assert.deepEqual(served,['catalog.json','BE/nl-1.json']);
 await choice('Programa clasei|Grade syllabus');
 const beCards=await cards();
 assert.equal(beCards.length,10,'Year 1 must list the ten national chapters');
 assert.equal(beCards[0],'1. Klanken, letters en klankgroepen','Cards use the pack titles in the language of instruction');
 await choice('^1\\.');
 let view=await openTheory('nl');
 assert.match(view.reader,/Klanken, letters en klankgroepen/);
 assert.match(view.reader,/m-aa-n wordt maan/);
 assert.match(view.reader,/België \(Vlaanderen\)/);
 assert.ok(!/NU lecția completă specifică/.test(view.reader),'A national pack lesson must not use the general fallback');
 await closeReader();
 await js("window.__literatureAcceptance.setLanguage('nl');[...document.querySelectorAll('#moduleContent .lit-activity-button')].find(b=>/^(Exerciții|Exercises)$/.test(b.textContent.trim())).click()");await sleep(400);
 assert.match(await js("document.querySelector('.lit-reader-overlay')?.innerText||''"),/Hak het woord maan in klanken/);
 await closeReader();
 // 2. Offline: the remembered language is offered first and opens from cache.
 await js("window.__literatureOnlineFetch=window.fetch.bind(window);window.fetch=async()=>{throw new TypeError('Failed to fetch')}");
 const fetchedOnline=served.length;
 await backToGrades();await choice('^1$');
 const remembered=await waitFor("(()=>{const b=[...document.querySelectorAll('#moduleContent .lit-instruction-language')];return b.length?b.map(x=>x.textContent.trim()):null})()",'Offline language choice missing (catalog must be cached)');
 assert.equal(remembered[0],'Nederlands ✓','The last language of instruction must be offered first');
 await js("document.querySelector('#moduleContent .lit-instruction-language').click()");
 await waitFor("window.__literatureAcceptance.snapshot().stage==='branches'",'Cached Dutch pack did not open offline');
 assert.equal(served.length,fetchedOnline,'Offline reuse must not reach the network');
 await choice('Programa clasei|Grade syllabus');await choice('^4\\.');
 // 3. Translation unavailable offline: the original stays readable, labelled.
 view=await openTheory('ro');
 assert.match(view.status,/lecția este afișată în limba originală/,JSON.stringify(view.status));
 assert.ok(view.reader.length>80&&!/translated/i.test(view.reader),'Original Dutch lesson must stay readable: '+view.reader.slice(0,300));
 await closeReader();
 // 4. An uncached language offline: honest message, retry and general option.
 await backToGrades();await choice('^1$');
 await waitFor("document.querySelector('#moduleContent .lit-instruction-language')",'Language choice missing');
 await js("[...document.querySelectorAll('#moduleContent .lit-instruction-language')].find(x=>/Français/.test(x.textContent)).click()");
 const offline=await waitFor("(()=>{const r=document.querySelector('#moduleContent .lit-national-retry'),g=document.querySelector('#moduleContent .lit-national-general');if(!r||!g)return null;const rr=r.getBoundingClientRect(),gr=g.getBoundingClientRect();return {text:document.querySelector('#moduleContent .lit-national-year').textContent,retry:rr.width>0&&rr.height>0,general:gr.width>0&&gr.height>0}})()",'Offline failure controls missing');
 assert.match(offline.text,/nu sunt disponibile offline/);
 assert.ok(offline.retry&&offline.general,JSON.stringify(offline));
 await js("window.fetch=window.__literatureOnlineFetch;document.querySelector('#moduleContent .lit-national-retry').click()");
 await waitFor("window.__literatureAcceptance.snapshot().stage==='branches'",'Retry did not load the French pack');
 assert.equal((await litStage()).instructionLanguage,'fr');
 assert.equal(served.at(-1),'BE/fr-1.json');
 await choice('Programa clasei|Grade syllabus');await choice('^1\\.');
 view=await openTheory('fr');
 assert.match(view.reader,/Belgique|Fédération Wallonie-Bruxelles/);
 assert.ok(!/Klanken/.test(view.reader),'Switching language must not reuse the Dutch pack');
 await closeReader();
 // 5. A country without a national pack for the year keeps the normal path.
 await backToGrades();await choice('^2$');
 await waitFor("window.__literatureAcceptance.snapshot().stage==='branches'",'Year without pack must open directly');
 assert.equal(await js("!!document.querySelector('#moduleContent .lit-instruction-language')"),false);
 // 6. Vatican City is not part of Education (no school system of its own).
 for(let i=0;i<8&&(await litStage()).stage!=='levels';i++){await js("document.querySelector('#view-module .lit-back')?.click()");await sleep(150)}
 assert.equal((await litStage()).stage,'levels');
 await js("document.querySelector('#view-module .lit-back').click()");await sleep(150);
 const vatican=await js("(()=>{const i=document.getElementById('eduCountryInput');if(!i)return null;const found=[];for(const q of ['Vatican','Vatic','Holy See','Santa Sede']){i.value=q;i.dispatchEvent(new Event('input',{bubbles:true}));found.push(...[...document.querySelectorAll('.edu-country-matches button')].map(x=>x.textContent))}i.value='Ital';i.dispatchEvent(new Event('input',{bubbles:true}));return {found,italy:[...document.querySelectorAll('.edu-country-matches button')].map(x=>x.textContent)}})()");
 assert.ok(vatican,'Country picker missing');
 assert.deepEqual(vatican.found.filter(x=>/vatic|holy see|santa sede/i.test(x)),[],'Vatican City must not be offered in Education');
 assert.ok(vatican.italy.some(x=>/ital/i.test(x)),'Picker must still work (Italy)');
 // 7. Dedicated profiles (TR): year 1 uses the national pack (official
 // programme + textbook sequence), not the generic sixteen-row sequence.
 const turkey=await js("(()=>{const i=document.getElementById('eduCountryInput');i.value='Tur';i.dispatchEvent(new Event('input',{bubbles:true}));const m=[...document.querySelectorAll('.edu-country-matches button')].find(x=>/turc|türk|turk/i.test(x.textContent));if(!m)return false;m.click();return true})()");
 assert.ok(turkey,'Türkiye is not selectable');
 await tap(['Continuă','Continue']);
 await waitFor("window.__literatureAcceptance.snapshot().stage==='levels'",'Türkiye profile did not load');
 await choice('^Primar|^Primary');await choice('^1$');
 await waitFor("window.__literatureAcceptance.snapshot().stage==='branches'",'Türkiye year 1 pack did not open');
 assert.equal(served.at(-1),'TR/tr-1.json');
 await choice('Programa clasei|Grade syllabus');
 const trCards=await cards();
 // Textbook sequence: one lesson per textbook unit/week, titles in Turkish,
 // grouped under the eight official themes of the TYMM programme.
 const trPack=JSON.parse(await readFile(new URL('./public/education/literature/authored/TR/tr-1.json',import.meta.url),'utf8'));
 const trTitles=trPack.units.flatMap(u=>u.keys).map(k=>trPack.chapters[k].tr.title);
 assert.ok(trTitles.length>=30,'TR year 1 follows the textbook sequence');
 assert.deepEqual(trCards,trTitles.map((t,i)=>(i+1)+'. '+t),'TR year 1 cards must be the pack lessons in order');
 assert.ok(!trCards.some(x=>/Yunus Emre|Namık Kemal|Tartışmacı|Primele texte/.test(x)),'No generic themes in TR year 1: '+JSON.stringify(trCards));
 const headings=await js("[...document.querySelectorAll('#moduleContent .lit-unit-heading')].map(x=>({t:x.textContent,w:x.getBoundingClientRect().width}))");
 assert.deepEqual(headings.map(h=>h.t),trPack.units.map(u=>u.title),'Unit headings follow the official themes');
 assert.ok(headings.every(h=>h.w>300),'Unit headings span the list width: '+JSON.stringify(headings));
 await choice('^2\\. ');
 view=await openTheory('tr');
 assert.match(view.reader,/a ve n sesleri/);
 assert.match(view.reader,/Türkiye/);
 await closeReader();
 assert.deepEqual(exceptions,[],'No uncaught browser exceptions');
 console.log('PASS real Chromium mobile 390x844: BE year 1 language of instruction (nl/fr/de), national lesson flow, offline cache reuse, original-language fallback, uncached-language retry, no Vatican City in Education, TR year 1 national pack replaces the generic sequence');
}finally{
 try{ws?.close()}catch{}
 // Wait for Chromium to exit before removing its profile (avoids ENOTEMPTY).
 const exited=child.exitCode!==null?Promise.resolve():new Promise(r=>child.once('exit',r));
 child.kill('SIGKILL');
 await Promise.race([exited,sleep(5000)]);
 server.close();
 await rm(dir,{recursive:true,force:true,maxRetries:5,retryDelay:200}).catch(()=>{});
}
