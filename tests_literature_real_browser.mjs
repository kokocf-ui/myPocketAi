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
const html=await response.text();
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
   const page=pages.find(x=>x.type==='page');
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
 for(let i=0;i<120;i++){
  if(await js("document.readyState === 'complete' && typeof litOpen === 'function'"))break;
  await sleep(250);
 }
 const screen=await js("(()=>{litJourney.country='RO';litJourney.language='ro';state.language='ro';litJourney.level='beginner';litOpen('levels');return {stage:litJourney.stage,buttons:[...document.querySelectorAll('[data-lit-quick-entry] button')].map(x=>x.textContent),errors:document.body.textContent.slice(0,70)}})()");
 assert.equal(screen.stage,'levels','Cannot open first Literature level window');
 assert.equal(screen.buttons.length,2,'Two quick-reference controls must render');
 const dict=await js("(()=>{document.querySelectorAll('[data-lit-quick-entry] button')[0].click();const i=document.querySelector('.lit-quick-input');i.value='cop';i.dispatchEvent(new Event('input',{bubbles:true}));return {items:[...document.querySelectorAll('.lit-quick-option,.lit-quick-chip')].map(x=>x.textContent),results:document.querySelector('.lit-quick-results')?.innerText,pinned:document.querySelector('.lit-quick-pinned')?.innerText}})()");
 assert.ok(dict.items.some(x=>x.toLowerCase().includes('copac')),'Android dictionary typed prefix cop yielded no clickable copac: '+JSON.stringify({dict,exceptions,logs}));
 const grammar=await js("(()=>{document.querySelector('[data-lit-quick-overlay] .lit-quick-head button').click();document.querySelectorAll('[data-lit-quick-entry] button')[1].click();return {initial:document.querySelector('.lit-quick-results')?.innerText,pinned:document.querySelector('.lit-quick-pinned')?.innerText,options:[...document.querySelectorAll('.lit-quick-option')].map(x=>x.textContent).slice(0,10)}})()");
 assert.ok(grammar.initial?.includes('Predicat')||grammar.pinned?.includes('Predicat'),'Android grammar initially blank: '+JSON.stringify({grammar,exceptions,logs}));
 const typed=await js("(()=>{const i=document.querySelector('.lit-quick-input');i.value='predicat';i.dispatchEvent(new Event('input',{bubbles:true}));return {text:document.querySelector('.lit-quick-results')?.innerText,options:[...document.querySelectorAll('.lit-quick-option,.lit-quick-chip')].map(x=>x.textContent)}})()");
 assert.ok(typed.options.some(x=>x.includes('Predicat')),'Predicat filter returned no options: '+JSON.stringify({typed,exceptions,logs}));
 const grammarMeaning=await js("(()=>{const o=[...document.querySelectorAll('.lit-quick-option')].find(x=>x.textContent.includes('Predicat'));o.click();return document.querySelector('.lit-quick-detail')?.innerText})()");
 assert.match(grammarMeaning,/subiect/i,'Predicat must show a meaningful definition and example');
 const abbreviation=await js("(()=>{const t=[...document.querySelectorAll('.lit-quick-tab')].find(x=>x.textContent.includes('Prescurtări'));t.click();const a=[...document.querySelectorAll('.lit-quick-option')].find(x=>x.textContent.startsWith('etc.'));a.click();return {shown:document.querySelector('.lit-quick-detail')?.innerText,groups:[...document.querySelectorAll('.lit-quick-group')].length}})()");
 assert.match(abbreviation.shown,/celelalte/,'Abbreviation etc. definition must be selectable');
 assert.ok(abbreviation.groups>=3,'Abbreviation groups must be browseable');
 const unit=await js("(()=>{const t=[...document.querySelectorAll('.lit-quick-tab')].find(x=>x.textContent.includes('Unități'));t.click();const u=[...document.querySelectorAll('.lit-quick-option')].find(x=>x.textContent.startsWith('km ·'));u.click();return document.querySelector('.lit-quick-detail')?.innerText})()");
 assert.match(unit,/Kilometru/,'Selecting km should display its unit definition');
 const school=await js("(()=>{const c=document.querySelector('[data-lit-quick-overlay] .lit-quick-back');c.click();litJourney.country='RO';litJourney.level='medium';litJourney.grade='9';litJourney.branch='program';const p=litProgram();litJourney.topic=p.units[0].id;return {selected:litCurrentTopic()?.[0],title:litCurrentTopic()?.[1],offlineSource:romanianExpandedMaterial({topicKey:litCurrentTopic()?.[0],title:litCurrentTopic()?.[1],focus:litCurrentTopic()?.[3],grade:'9',mode:'lesson'})?.origin}})()");
 assert.equal(school.offlineSource,'authored_ro_year_specific','Actual grade-IX selected topic must have an authored lesson');
 assert.match(school.selected,/^ro-elev-9-/);

 console.log('PASS real Chromium: first screen, dictionary live prefix, grammar visible without typing and filtered predicate');
}finally{
 try{ws?.close()}catch{}
 child.kill('SIGKILL');
 server.close();
 await rm(dir,{recursive:true,force:true});
}
