import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {execFileSync} from 'node:child_process';
import puppeteer from 'puppeteer-core';
import frontend from './index.js';

const response=await frontend.fetch(new Request('https://lifewise-ai-v2.kokocf.workers.dev/?nativeLaunch=1'));
const html=await response.text();
const server=createServer((req,res)=>{res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});res.end(html)});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const host='http://127.0.0.1:'+server.address().port+'/?nativeLaunch=1';
let browser;
try{
 let chrome=process.env.CHROME_BINARY||'';
 if(!chrome){for(const path of ['/usr/bin/google-chrome','/usr/bin/google-chrome-stable','/usr/bin/chromium','/usr/bin/chromium-browser']){
  try{execFileSync(path,['--version'],{stdio:'ignore'});chrome=path;break}catch{}
 }}
 assert.ok(chrome,'Chrome/Chromium is required for this real interaction test');
 browser=await puppeteer.launch({headless:true,executablePath:chrome,args:['--no-sandbox','--disable-setuid-sandbox','--disable-gpu']});
 const page=await browser.newPage();await page.setViewport({width:390,height:844,isMobile:true,hasTouch:true,deviceScaleFactor:1});
 const errors=[];
 page.on('pageerror',error=>{errors.push(String(error));console.log('PAGE_ERROR',String(error))});
 page.on('console',msg=>{if(msg.type()==='error')console.log('CONSOLE_ERROR',msg.text().slice(0,250))});
 await page.goto(host,{waitUntil:'domcontentloaded',timeout:30000});
 await new Promise(resolve=>setTimeout(resolve,1200));
 console.log('BOOT',JSON.stringify(await page.evaluate(()=>({
   home:document.querySelector('#view-home')?.className,
   cards:document.querySelectorAll('.feature-card').length,
   visible:document.querySelectorAll('.view.active').length,
   overlay:document.querySelector('.module-quick-layer')?.className,
   ui:document.documentElement.dataset.pocketUiVersion
 }))));
 assert.equal(errors.length,0,'Startup threw a browser exception');
 const cases=[['travel','travel'],['maps','maps'],['organize','organize'],['learning','learning'],['tools','tools'],['assistant','assistant']];
 for(const [key,expected] of cases){
  const button=await page.$('[data-module="'+key+'"]');
  assert.ok(button,'Missing home card '+key);
  const geom=await button.evaluate(el=>{
   const r=el.getBoundingClientRect(),mid=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);
   return {x:r.x,y:r.y,width:r.width,height:r.height,top:mid?.outerHTML?.slice(0,150)}
  });
  console.log('BEFORE_CLICK',key,JSON.stringify(geom));
  try{await button.click({delay:70})}catch(error){console.log('CLICK_ERROR',key,String(error));throw error}
  await new Promise(resolve=>setTimeout(resolve,250));
  const snap=await page.evaluate(()=>({
   active:[...document.querySelectorAll('.view.active')].map(x=>x.id),
   title:document.querySelector('#moduleTitle')?.textContent,
   moduleCards:document.querySelectorAll('#view-module .module-landing-choice').length,
   educationCards:document.querySelectorAll('#view-module .education-card').length,
   busy:document.querySelector('.module-quick-layer')?.className
  }));
  console.log('CLICK_RESULT',key,JSON.stringify(snap));
  assert.ok(snap.active.includes(expected==='assistant'?'view-assistant':'view-module'),key+' did not navigate');
  if(key==='maps'||key==='travel')assert.ok(snap.moduleCards>=8,key+' has no options');
  if(key==='learning'||key==='organize'||key==='tools')assert.ok(snap.educationCards>=6,key+' has no subject/choice cards');
  const back=expected==='assistant'?'#view-assistant [data-back]':'#view-module [data-back]';
  await page.click(back,{timeout:5000});
  await new Promise(resolve=>setTimeout(resolve,150));
  const now=await page.$eval('#view-home',el=>el.classList.contains('active'));
  console.log('BACK',key,now);
  assert.equal(now,true,key+' cannot return home');
  assert.equal(errors.length,0,key+' generated a browser exception');
 }
 console.log('PASS browser tap-through: maps/hotels/education/organisation/tools/assistant and back');
}finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve))}
