import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {mkdir} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import path from 'node:path';
import {chromium} from 'playwright-core';
import {CREATOR_BUSINESS_PROFILES as profiles} from './creator_business_profiles.mjs';
const {default:app}=await import(process.env.POCKET_BUNDLE?pathToFileURL(path.resolve(process.env.POCKET_BUNDLE)).href:'./index.js');
let html=await(await app.fetch(new Request('https://test.local/'))).text();
const hook=String.raw`
window.__feedback={
 init(){state.language='ro';pocketRevealMainApp();openModule('tools');extraToolsOpenWorkspace('creator');extraCreatorWorkingWebsite(extraToolsSession)},
 kind(kind){const f=extraToolsSession.creatorForm;f.type.value=kind;f.type.dispatchEvent(new Event('change'));f.name.value='Atelier Test';f.desc.value='Descriere reală introdusă de proprietar, fără informații inventate.';f.contact.value='contact@example.org +40 721 111 222';return Array.from(f.type.options).map(o=>o.value)},
 make(){extraToolsSession.creatorForm.generate();return extraToolsSession.siteHtml},
 details(){return extraToolsSession.creatorForm.getBusinessDetails()},
 beginVoice(){state.voiceMode=true;state.speaking=true;showAvatar({message:'Îți citesc locația…',speaking:true})},
 status(){return {speaking:state.speaking,voiceMode:state.voiceMode,visible:avatarOverlay.classList.contains('visible')}}
};`;
html=html.replace('function extraFunGames(){',hook+'\nfunction extraFunGames(){');
const server=createServer((req,res)=>{res.setHeader('content-type','text/html;charset=utf-8');res.end(html)});await new Promise(ok=>server.listen(0,'127.0.0.1',ok));
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH,headless:true,args:['--no-sandbox']});await mkdir('.bundle-check/feedback',{recursive:true});
try{
 for(const viewport of [{width:393,height:817},{width:360,height:640},{width:430,height:900}]){
  const page=await browser.newPage({viewport,isMobile:true,hasTouch:true}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>{window.__native=[];window.PocketAndroidVoice={postMessage(value){window.__native.push(JSON.parse(value))}}});
  await page.route('**/*',route=>route.request().url().startsWith('http://127.0.0.1:')?route.continue():route.abort());
  await page.goto('http://127.0.0.1:'+server.address().port+'/?nativeLaunch=1');await page.evaluate(()=>window.__feedback.init());
  const available=await page.evaluate(()=>window.__feedback.kind('guesthouse'));for(const kind of Object.keys(profiles))assert.ok(available.includes(kind));
  for(const kind of ['guesthouse','hotel','restaurant','cafe','bar','services','salon','shop','personal','other']){
   await page.evaluate(k=>window.__feedback.kind(k),kind);await page.locator('.creator-business-open').tap();
   const modal=page.locator('.creator-business-dialog');assert.equal(await modal.locator('textarea').count(),4);
   const field=modal.locator('[data-business-field]').first(),id=await field.getAttribute('data-business-field');await field.fill('Detalii '+kind+' confirmate');
   const save=modal.getByRole('button',{name:'Salvează detaliile'}),r=await save.boundingBox();assert.ok(r.y>=0&&r.y+r.height<=viewport.height,'Save action stays in viewport, scroll is internal');
   await save.tap();const built=await page.evaluate(()=>window.__feedback.make());assert.ok(built.includes('Detalii '+kind+' confirmate'));assert.ok(built.includes('data-business-kind="'+kind+'"'));
   assert.ok(built.includes('mailto:contact@example.org'));assert.ok(built.includes(profiles[kind].offer[0]));
   const frame=page.frameLocator('.extra-creator-preview');await frame.locator('.business-fact').first().waitFor();
   const overflow=await page.locator('.extra-creator-preview').evaluate(el=>({width:el.clientWidth,parent:el.parentElement.clientWidth}));assert.ok(overflow.width<=overflow.parent+2);
   if(kind==='cafe')await page.screenshot({path:'.bundle-check/feedback/cafe-form-'+viewport.width+'.png'});
   // Detail values remain scoped to their business category and persist when revisiting it.
   const details=await page.evaluate(()=>window.__feedback.details());assert.equal(details[id],'Detalii '+kind+' confirmate');
  }
  await page.evaluate(()=>window.__feedback.kind('guesthouse'));assert.equal((await page.evaluate(()=>window.__feedback.details())).rooms,'Detalii guesthouse confirmate');
  await page.locator('.creator-business-open').tap();await page.setViewportSize({width:viewport.width,height:400});
  let box=await page.getByRole('button',{name:'Salvează detaliile'}).boundingBox();assert.ok(box.y+box.height<=400);await page.getByRole('button',{name:'Anulează',exact:true}).tap();await page.setViewportSize(viewport);
  // Existing content modal remains behind Eva, then becomes usable after touch interruption.
  await page.evaluate(()=>{const under=document.createElement('div');under.id='location-test-window';under.style.cssText='position:fixed;inset:60px 10px;z-index:999999;background:#12344b;color:white';under.textContent='Fereastra cu locația rămâne deschisă';document.body.append(under);window.__feedback.beginVoice()});
  await page.locator('#avatarOverlay .avatar-stage').tap({position:{x:viewport.width/2,y:viewport.height/2}});
  assert.deepEqual(await page.evaluate(()=>window.__feedback.status()),{speaking:false,voiceMode:false,visible:false});assert.ok((await page.evaluate(()=>window.__native)).some(x=>x.action==='stop'));assert.equal(await page.locator('#location-test-window').isVisible(),true);
  await page.evaluate(()=>window.__feedback.beginVoice());await page.locator('#avatarClose').tap();assert.equal((await page.evaluate(()=>window.__feedback.status())).speaking,false);assert.equal((await page.evaluate(()=>window.__feedback.status())).visible,false);
  await page.evaluate(()=>document.getElementById('location-test-window').remove());assert.deepEqual(errors,[]);await page.close();
 }
 console.log('PASS production mobile 360/393/430: 10 business-specific forms, category-scoped drafts, real generated sections/contact actions, internal scroll and 400px keyboard viewport; avatar touch/close stop native speech and continuous mode without closing underlying location window. Native bridge simulated.');
}finally{await browser.close();server.close();server.closeAllConnections?.()}
