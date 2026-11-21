import app from './index.js';
import http from 'node:http';
import {chromium} from 'playwright';
import fs from 'node:fs';
fs.mkdirSync('ui-browser-audit',{recursive:true});
const server=http.createServer(async(req,res)=>{
 try{
  const response=await app.fetch(new Request('http://localhost:3778'+req.url),{COMMUNICATION_ORACLE_ORIGIN:''});
  res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));
 }catch(error){res.writeHead(500);res.end(String(error))}
});
await new Promise(resolve=>server.listen(3778,'127.0.0.1',resolve));
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const page=await browser.newPage({viewport:{width:360,height:780},deviceScaleFactor:1,isMobile:true,hasTouch:true,locale:'ro-RO'});
const logs=[],issues=[];
page.on('pageerror',e=>logs.push('PAGEERROR '+String(e)));
page.on('console',m=>{if(m.type()==='error')logs.push('CONSOLE '+m.text())});
await page.addInitScript(()=>{
 window.PocketAndroidDocuments={postMessage:msg=>{}};
});
const metrics=async(name,sel)=>page.evaluate(({name,sel})=>{
 const root=document.querySelector('#view-module'),scroller=document.querySelector(sel);
 const pageEl=document.querySelector('main.page');
 const rect=el=>{if(!el)return null;const r=el.getBoundingClientRect();const c=getComputedStyle(el);return {top:+r.top.toFixed(1),bottom:+r.bottom.toFixed(1),height:+r.height.toFixed(1),overflowY:c.overflowY,display:c.display,position:c.position,scrollHeight:el.scrollHeight,clientHeight:el.clientHeight,scrollTop:el.scrollTop,paddingBottom:c.paddingBottom,paddingTop:c.paddingTop,marginBottom:c.marginBottom,heightCss:c.height,gridTemplateRows:c.gridTemplateRows,gridAutoRows:c.gridAutoRows,flex:c.flex}};
 return {name,rootClass:root?.className,body:rect(document.body),page:rect(pageEl),root:rect(root),
  panel:rect(root?.querySelector('.science-choice-panel,.my-documents-panel')),
  content:rect(root?.querySelector('#moduleContent')),
  toolbar:rect(root?.querySelector('.science-stage-toolbar')),
  lead:rect(root?.querySelector('#moduleLead')),
  chat:rect(root?.querySelector('#moduleChatHost')),
  scroller:rect(scroller),buttons:[...root?.querySelectorAll('.module-actions-row button')||[]].map(b=>({text:b.textContent,cls:b.className,visible:b.getBoundingClientRect().height>0})),
  dock:rect(document.querySelector('.bottom-nav')),
  docCount:root?.querySelectorAll('.my-documents-row').length,
  visibleButtons:[...root?.querySelectorAll('button')||[]].filter(b=>b.getBoundingClientRect().height>0).slice(0,18).map(x=>x.textContent.trim().slice(0,55))};
},{name,sel});
const dump=async name=>{await page.waitForTimeout(450);await page.screenshot({path:'ui-browser-audit/'+name+'.png'});console.log('STAGE '+name,JSON.stringify(await metrics(name,'.science-choice-list, .my-documents-list')))};
async function tryClick(selector,name){
 const target=page.locator(selector).first();
 const count=await target.count();
 if(!count){console.log('MISSING '+name+' '+selector);return false}
 try{await target.click({timeout:3000});await dump(name);return true}catch(e){console.log('CLICKERR '+name+' '+String(e).slice(0,200));return false}
}
try{
 await page.goto('http://127.0.0.1:3778/?nativeLaunch=1',{waitUntil:'domcontentloaded',timeout:30000});
 await dump('home');
 await tryClick('[data-module="tools"]','tools');
 await tryClick('#view-module button:has-text("Documente și fișiere")','docs-category');
 await tryClick('#view-module button:has-text("Biblioteca PDF")','documents');
 await page.evaluate(()=>{const l=document.querySelector('.my-documents-list');if(!l)return;for(let i=0;i<20;i++){const el=document.createElement('div');el.className='my-documents-row';el.style.minHeight='65px';el.textContent='Document de probă '+i;l.append(el)}});
 await dump('documents-loaded');
 const docBefore=await metrics('docbefore','.my-documents-list');
 const docLoc=page.locator('.my-documents-list');
 if(await docLoc.count()){await docLoc.hover();await page.mouse.wheel(0,410);await page.waitForTimeout(250)}
 const docAfter=await metrics('docafter','.my-documents-list');
 console.log('DOC_SCROLL_DELTA',JSON.stringify({page:docAfter.page?.scrollTop-docBefore.page?.scrollTop,list:docAfter.scroller?.scrollTop-docBefore.scroller?.scrollTop,
  panelY:docAfter.panel?.top-docBefore.panel?.top,headButtons:docAfter.buttons}));
 await page.screenshot({path:'ui-browser-audit/documents-after-scroll.png'});
 await tryClick('.bottom-nav [data-nav="home"]','back-home');
 await tryClick('[data-module="learning"]','learning');
 const stage=await page.locator('#view-module').innerText();console.log('LEARNING_TEXT',stage.slice(0,1200));
 await tryClick('#view-module .education-card:has-text("Științe")','sciences');
 let state=await page.locator('#view-module').innerText();console.log('SCIENCE_STEP',state.slice(0,1200));
 if(!state.includes('Chimie')){
  await page.locator('#eduCountryInput').fill('România');
  await tryClick('#view-module .edu-country-matches button:has-text("România")','country-select-romania');
  await tryClick('#view-module button:has-text("Continuă")','country-continue');
  state=await page.locator('#view-module').innerText();console.log('COUNTRY_STEP',state.slice(0,1200));
 }
 if(!state.includes('Chimie')) await tryClick('#view-module button:has-text("Științe")','science-subjects');
 await tryClick('#view-module button:has-text("Chimie")','chemistry');
 const sciBefore=await metrics('sciencebefore','.science-choice-list');
 const yearLoc=page.locator('.science-choice-list').first();
 if(await yearLoc.count()){await yearLoc.hover();await page.mouse.wheel(0,300);await page.waitForTimeout(250)}
 const sciAfter=await metrics('scienceafter','.science-choice-list');
 console.log('SCI_SCROLL_DELTA',JSON.stringify({page:sciAfter.page?.scrollTop-sciBefore.page?.scrollTop,list:sciAfter.scroller?.scrollTop-sciBefore.scroller?.scrollTop,panelY:sciAfter.panel?.top-sciBefore.panel?.top,root:sciAfter.root,content:sciAfter.content,toolbar:sciAfter.toolbar,lead:sciAfter.lead,chat:sciAfter.chat}));
 if(await yearLoc.count()){
  await page.evaluate(()=>document.querySelector('.science-choice-list').scrollTop=0);
  const beforeTouch=await metrics('before-touch','.science-choice-list');
  const session=await page.context().newCDPSession(page);
  await session.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:150,y:520}]});
  for(let y=500;y>=340;y-=20) await session.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:150,y}]});
  await session.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  await page.waitForTimeout(400);
  const afterTouch=await metrics('after-touch','.science-choice-list');
  console.log('SCI_TOUCH_DELTA',JSON.stringify({page:afterTouch.page?.scrollTop-beforeTouch.page?.scrollTop,list:afterTouch.scroller?.scrollTop-beforeTouch.scroller?.scrollTop,panelY:afterTouch.panel?.top-beforeTouch.panel?.top}));
  await page.screenshot({path:'ui-browser-audit/science-after-touch.png'});
 }
 await page.screenshot({path:'ui-browser-audit/science-after-scroll.png'});
}catch(e){console.log('FATAL',String(e).slice(0,1900))}
finally{fs.writeFileSync('ui-browser-audit/log.json',JSON.stringify({logs,issues},null,2));await browser.close();server.close();}
