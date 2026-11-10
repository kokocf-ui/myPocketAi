import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {execFileSync} from 'node:child_process';
import puppeteer from 'puppeteer-core';
import frontend from './index.js';

const response=await frontend.fetch(new Request('https://lifewise-ai-v2.kokocf.workers.dev/'));
assert.equal(response.status,200);
const html=await response.text();
const uiVersion=html.match(/data-pocket-ui-version="([^"]+)"/)?.[1]||'test-version';
const server=createServer((req,res)=>{
 if(req.url?.startsWith('/__ui_version')){res.writeHead(200,{'Content-Type':'text/plain'});res.end(uiVersion);return}
 res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});res.end(html)
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
let browser;
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
try{
 let chrome=process.env.CHROME_BINARY||'';
 if(!chrome){for(const path of ['/usr/bin/google-chrome','/usr/bin/chromium','/usr/bin/google-chrome-stable']){
  try{execFileSync(path,['--version'],{stdio:'ignore'});chrome=path;break}catch{}
 }}
 assert.ok(chrome,'Chromium required');
 browser=await puppeteer.launch({executablePath:chrome,headless:true,args:['--no-sandbox','--disable-gpu']});
 const page=await browser.newPage();
 await page.setViewport({width:390,height:860,isMobile:true,deviceScaleFactor:1,hasTouch:true});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:'+server.address().port+'/?nativeLaunch=1',{waitUntil:'domcontentloaded'});
 await sleep(700);
 async function measure(module){
  await page.click('[data-module="'+module+'"]');await sleep(220);
  const info=await page.evaluate(()=>{
   const sel=['main.page','#view-module','#view-module #moduleContent','#view-module .module-landing-grid','#view-module .module-landing-choice','#view-module .education-grid','#view-module .education-card','.bottom-nav'];
   return Object.fromEntries(sel.map(q=>{
    const n=document.querySelector(q);if(!n)return [q,null];
    const r=n.getBoundingClientRect(),c=getComputedStyle(n);
    return [q,{x:Math.round(r.left),y:Math.round(r.top),w:Math.round(r.width),h:Math.round(r.height),bottom:Math.round(r.bottom),display:c.display,visibility:c.visibility,overflow:c.overflow,cssHeight:c.height,count:q.includes('choice')||q.includes('education-card')?document.querySelectorAll(q).length:undefined}]
   }))
  });
  console.log('MEASURE '+module+' '+JSON.stringify(info));
  await page.click('#view-module [data-back]');await sleep(150);
  return info;
 }
 for(const module of ['travel','maps']){
  const result=await measure(module),card=result['#view-module .module-landing-choice'];
  assert.ok(card&&card.w>30&&card.h>30&&card.display!=='none','Module '+module+' cards must have actual visible geometry');
  assert.ok(result['#view-module #moduleContent'].display!=='none','Module '+module+' content hidden');
  assert.equal(await page.$eval('#view-home',el=>el.classList.contains('active')),true);
 }
 const edu=await measure('learning');
 const eduGrid=edu['#view-module .education-grid'],dock=edu['.bottom-nav'],content=edu['#view-module #moduleContent'];
 assert.ok(eduGrid?.h>400&&content?.h>400,'Education screen too short');
 console.log('EDUCATION_GAP '+(dock.y-eduGrid.bottom));
 assert.ok(dock.y-eduGrid.bottom<75,'Education cards should fill nearly all space above bottom navigation');
 await page.click('[data-nav="settings"]');await sleep(130);
 await page.evaluate(()=>{const n=document.querySelector('#languageSelect');n.value='ca';n.dispatchEvent(new Event('change',{bubbles:true}))});await sleep(150);
 const catalan=await page.evaluate(()=>({lang:document.documentElement.lang,settings:[...document.querySelectorAll('#view-settings h2,#view-settings .module-panel h3,#view-settings .module-panel p')].map(x=>x.textContent),cards:[...document.querySelectorAll('#view-tools .tools-action-card strong')].map(x=>x.textContent)}));
 console.log('CATALAN '+JSON.stringify(catalan));
 assert.equal(catalan.lang,'ca');
 assert.ok(catalan.settings.includes('Idioma de la interfície i de la conversa'));
 assert.ok(catalan.settings.some(x=>x.includes('reconeixement de veu')));
 assert.ok(!catalan.settings.some(x=>x.includes('Speech recognition and available voices')));
 assert.equal(errors.length,0,'No page errors: '+errors.join('; '));
 console.log('PASS: physical card visibility, education viewport and Catalan Settings');
}finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve))}
