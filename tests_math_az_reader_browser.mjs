// Runs the *actual built frontend* in headless Chromium, not a simulated DOM.
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
// Test-only entry point; the normal theorem component and reader remain unchanged.
assert.ok(html.includes('function mathTheoryQuickReference(){'));
html=html.replace('function mathTheoryQuickReference(){',
 "window.__mathTranslationTest={open(lang){state.language=lang;applyUiLanguage();educationCountrySelection.code='RO';document.getElementById('view-module').style.display='block';mathTheoryQuickReference()},setLanguage(lang){state.language=lang},openFrench(){state.language='ro';educationOpenPagedLesson('Bonjour','Une phrase française pour apprendre.',{sourceLanguage:'fr'})},clear(){for(const item of MATH_THEOREM_ITEMS)delete item.__locTitles;for(const key of Object.keys(EDU_MEMORY_STR_CACHE))delete EDU_MEMORY_STR_CACHE[key];for(const key of Object.keys(localStorage))if(key.startsWith('pocket-education-translations-')||key.startsWith('pocket-edu-str-'))localStorage.removeItem(key)}};function mathTheoryQuickReference(){");
const server=createServer(async(req,res)=>{
 if(req.url==='/favicon.ico'){res.writeHead(204);res.end();return}
 const asset=req.url.match(/^\/education\/literature\/profiles\/([A-Z-]+)\.json$/);
 if(asset){
  try{const data=await readFile(new URL('./public/education/literature/profiles/'+asset[1]+'.json',import.meta.url));res.writeHead(200,{'Content-Type':'application/json'});res.end(data)}
  catch{res.writeHead(404);res.end()}
  return;
 }
 const authored=req.url.match(/^\/education\/literature\/authored\/(HU|FR)\/([A-Z0-9]+)\.json$/);
 if(authored){
  try{const data=await readFile(new URL('./public/education/literature/authored/'+authored[1]+'/'+authored[2]+'.json',import.meta.url));res.writeHead(200,{'Content-Type':'application/json'});res.end(data)}
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
 await connect();await cmd('Runtime.enable');await cmd('Page.enable');await cmd('Log.enable');
 await cmd('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});await sleep(800);
 // Deterministic transport mock. The test checks routing and preservation,
 // not the quality or availability of a real AI translation provider.
 await js(`(()=>{
  window.__realMathFetch=window.fetch.bind(window);window.__mathOffline=false;window.__targets=[];
  window.fetch=async(u,o)=>{
   let d;try{d=JSON.parse(o?.body||'{}')}catch{}
   if(!d?.education_translate)return window.__realMathFetch(u,o);
   window.__targets.push(d.language);
   if(window.__mathOffline)throw new TypeError('offline');
   const input=JSON.parse(d.message.split('Input JSON: ')[1]);
   const tr=x=>x==='Abaterea standard'?'Standart kənarlaşma':
    x==='Abaterea standard este rădăcina pătrată a varianței.'?'Standart kənarlaşma dispersiyanın kvadrat köküdür.':
    x==='Bonjour'?'Bună ziua':x==='Une phrase française pour apprendre.'?'O propoziție franceză pentru învățare.':
    'AZ '+x;
   const out=Object.fromEntries(Object.entries(input).map(([k,v])=>[k,Array.isArray(v)?v.map(tr):tr(v)]));
   return new Response(JSON.stringify({status:'success',reply:JSON.stringify(out)}),{headers:{'Content-Type':'application/json'}});
  };window.__mathTranslationTest.open('az');
  const q=document.querySelector('.math-theory-reference-panel input');q.value='Abaterea standard';q.dispatchEvent(new Event('input',{bubbles:true}));
 })()`);
 await sleep(600);
 assert.match(await js("document.querySelector('.bottom-nav [data-nav=communication]')?.textContent||''"),/Ünsiyyət/,'The navigation label in the screenshot should also use Azerbaijani');
 let result=await js(`(()=>({items:[...document.querySelectorAll('.math-theory-scroll-list button')].map(b=>b.textContent),notice:document.querySelector('.math-reference-translation-notice')?.hidden,targets:window.__targets}))()`);
 assert.ok(result.items.includes('Standart kənarlaşma'),'Azerbaijani title must be visible: '+JSON.stringify({result,exceptions,logs}));
 assert.ok(result.targets.length&&result.targets.every(x=>x==='az'));
 await js("[...document.querySelectorAll('.math-theory-scroll-list button')].find(b=>b.textContent==='Standart kənarlaşma').click()");await sleep(700);
 result=await js(`(()=>({title:document.querySelector('.education-paged-title')?.innerText,text:document.querySelector('.education-paged-text')?.innerText,status:document.querySelector('.education-paged-translate-status')?.textContent}))()`);
 assert.equal(result.title,'Standart kənarlaşma');
 assert.match(result.text,/Standart kənarlaşma dispersiyanın kvadrat köküdür/);
 assert.match(result.text,/σ=√σ²/,'Original formula must remain unchanged');
 assert.doesNotMatch(result.text,/Abaterea standard este rădăcina pătrată/);
 // A different item with no cached translation: the original is labelled,
 // instead of presenting Romanian as a successful Azerbaijani translation.
 await js(`(()=>{document.querySelector('#educationPagedLessonDialog').close();window.__mathTranslationTest.clear();window.__mathOffline=true;
  const q=document.querySelector('.math-theory-reference-panel input');q.value='Adunarea fracțiilor';q.dispatchEvent(new Event('input',{bubbles:true}));})()`);await sleep(700);
 result=await js(`(()=>({notice:document.querySelector('.math-reference-translation-notice')?.innerText,hidden:document.querySelector('.math-reference-translation-notice')?.hidden,items:[...document.querySelectorAll('.math-theory-scroll-list button')].map(b=>b.textContent)}))()`);
 assert.equal(result.hidden,false);assert.match(result.notice,/Tərcümə əlçatan deyil/);assert.match(result.notice,/Yenidən cəhd et/);
 assert.ok(result.items.includes('Adunarea fracțiilor'));
 await js("document.querySelector('.math-theory-scroll-list button').click()");await sleep(600);
 result=await js(`(()=>({text:document.querySelector('.education-paged-text')?.innerText,status:document.querySelector('.education-paged-translate-status')?.innerText,marked:!!document.querySelector('.education-paged-text [data-edu-translated]')}))()`);
 assert.match(result.status,/Tərcümə əlçatan deyil/);assert.match(result.status,/Yenidən cəhd et/);assert.equal(result.marked,false);
 await js(`(()=>{window.__mathOffline=false;[...document.querySelectorAll('.education-paged-translate-status button')][0].click()})()`);await sleep(700);
 result=await js("document.querySelector('.education-paged-translate-status')?.hidden");assert.equal(result,true,'Retry must translate once the service is available');
 // A previously translated Azerbaijani label must not leak into another language.
 await js(`(()=>{document.querySelector('#educationPagedLessonDialog').close();window.__mathOffline=true;window.__mathTranslationTest.setLanguage('en');
  const q=document.querySelector('.math-theory-reference-panel input');q.value='Abaterea standard';q.dispatchEvent(new Event('input',{bubbles:true}));})()`);await sleep(600);
 result=await js("[...document.querySelectorAll('.math-theory-scroll-list button')].map(b=>b.textContent)");assert.ok(!result.includes('Standart kənarlaşma'));
 // Romanian is a target language too: the legacy string cache used to return
 // its input unchanged and could suppress translation of non-RO source text.
 await js("window.__mathOffline=false;window.__mathTranslationTest.openFrench()");await sleep(600);
 result=await js(`(()=>({title:document.querySelector('.education-paged-title')?.innerText,text:document.querySelector('.education-paged-text')?.innerText,targets:window.__targets}))()`);
 assert.equal(result.title,'Bună ziua');assert.match(result.text,/O propoziție franceză pentru învățare/);assert.ok(result.targets.includes('ro'));
 console.log('PASS real Chromium Azerbaijani UI / Romanian curriculum and FR-to-RO reader: formula, failure, retry and language isolation (mock translator)');
}finally{
 try{ws?.close()}catch{}child.kill('SIGKILL');server.close();await rm(dir,{recursive:true,force:true});
}
