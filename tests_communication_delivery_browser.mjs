// Production HTML + actual WebCrypto/audio/DOM. Oracle transport is simulated;
// this is NOT a live two-device delivery or latency benchmark.
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {mkdir} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import path from 'node:path';
import {chromium} from 'playwright-core';
const {default:app}=await import(process.env.POCKET_BUNDLE?pathToFileURL(path.resolve(process.env.POCKET_BUNDLE)).href:'./index.js');
let html=await(await app.fetch(new Request('https://chat.test/'))).text();
const hook=String.raw`
window.__chat={
 async init(){
  const signPair=await crypto.subtle.generateKey({name:'ECDSA',namedCurve:'P-256'},false,['sign','verify']);
  const exchange=await crypto.subtle.generateKey({name:'ECDH',namedCurve:'P-256'},false,['deriveKey']);
  identity={id:'11111111-1111-4111-8111-111111111111',signPrivate:signPair.privateKey,exchangePrivate:exchange.privateKey};
  const peer={id:'22222222-2222-4222-8222-222222222222',name:'Test contact',exchangePublic:await crypto.subtle.exportKey('jwk',exchange.publicKey)};contacts=[peer];
  window.__chatReveal();root.classList.add('active');enabled();openChat(peer);
 },
 async fixture(){
  const peer=contacts[0],wav=new Uint8Array(44+8000),v=new DataView(wav.buffer),write=(p,t)=>{for(let i=0;i<t.length;i++)wav[p+i]=t.charCodeAt(i)};
  write(0,'RIFF');v.setUint32(4,wav.length-8,true);write(8,'WAVEfmt ');v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,1,true);v.setUint32(24,8000,true);v.setUint32(28,16000,true);v.setUint16(32,2,true);v.setUint16(34,16,true);write(36,'data');v.setUint32(40,8000,true);
  const result={messages:[],attachments:{}};
  for(const [index,sender]of [identity.id,peer.id].entries()){
   const recipient=sender===identity.id?peer.id:identity.id,iv=crypto.getRandomValues(new Uint8Array(12));
   const cipher=await crypto.subtle.encrypt({name:'AES-GCM',iv,additionalData:bytes(sender+'|'+recipient)},await cryptoKey(peer),wav);
   const attachmentId=crypto.randomUUID();result.attachments[attachmentId]={iv:encode(iv),cipher:encode(cipher),kind:'audio',mime:'audio/wav'};
   result.messages.push({id:crypto.randomUUID(),sender,recipient,kind:'media',attachment_kind:'audio',attachment_id:attachmentId,created_ms:Date.now()-10000+index});
  }
  window.__fixtureFile=new File([wav],'voice.wav',{type:'audio/wav'});return result;
 },refresh(){return refreshMessages()},upload(){window.__uploadResult=null;void uploadChosenFile(window.__fixtureFile).then(x=>window.__uploadResult=x)}
};
`;
html=html.replace('function languageOpen(stage){',"window.__chatReveal=()=>{state.language='ro';document.documentElement.lang='ro';showView('communication');pocketRevealMainApp()};function languageOpen(stage){");
const marker='window.pocketCommunicationOpen=()=>{void open()};';assert.ok(html.includes(marker));html=html.replace(marker,hook+'\n'+marker);
const server=createServer((req,res)=>{res.setHeader('content-type','text/html; charset=utf-8');res.end(html)});await new Promise(ok=>server.listen(0,'127.0.0.1',ok));
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH,headless:true,args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
let envelopes=[],attachments={},requests=[],holdSend=false,release,requested,loseAck=false,failPlayedOnce=false,messageChecks=0;
const acceptedIds=new Set();
try{
 for(const viewport of [{width:393,height:817},{width:360,height:640}]){
  envelopes=[];attachments={};requests=[];acceptedIds.clear();messageChecks=0;
  const page=await browser.newPage({viewport,isMobile:true,hasTouch:true}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',async route=>{
   const req=route.request();if(req.url().includes('mypocketai.duckdns.org')){
    if(req.method()!=='POST')return route.fulfill({contentType:'application/json',body:'{"ok":true}'});
    const data=req.postDataJSON();requests.push(data);assert.ok(req.headers()['x-pocket-signature'],'All Oracle actions retain device signatures');
    let response={ok:true};
    if(data.action==='messages'){messageChecks++;response.messages=structuredClone(envelopes)}
    if(data.action==='contacts')response.contacts=[];
    if(data.action==='lists')response.lists=[];
    if(data.action==='pending_messages')response.messages=[];
    if(data.action==='attachment')response.attachment=attachments[data.attachmentId];
    if(data.action==='receipt'){
     if(data.receiptType==='played'&&failPlayedOnce){failPlayedOnce=false;return route.fulfill({status:503,contentType:'application/json',body:'{"ok":false,"error":"temporarily_unavailable"}'})}
     for(const e of envelopes)if(data.messageIds.includes(e.id))e[data.receiptType==='played'?'played_at':data.receiptType==='read'?'read_at':'delivered_at']=new Date().toISOString();
    }
    if(['send','upload'].includes(data.action)){
     if(holdSend){requested?.();await new Promise(ok=>release=ok)}
     if(!acceptedIds.has(data.messageId)){
      acceptedIds.add(data.messageId);const e={id:crypto.randomUUID(),sender:'11111111-1111-4111-8111-111111111111',recipient:data.friend,created_ms:Date.now(),kind:data.action==='send'?'text':'media',iv:data.iv,cipher:data.cipher};
      if(data.action==='upload'){e.attachment_kind=data.kind;e.attachment_id=crypto.randomUUID();attachments[e.attachment_id]={kind:data.kind,mime:data.mime,iv:data.iv,cipher:data.cipher}}
      envelopes.push(e);
     }else response.duplicate=true;
     if(loseAck){loseAck=false;return route.abort()}
    }
    return route.fulfill({contentType:'application/json',body:JSON.stringify(response)});
   }
   if(!req.url().startsWith('http://127.0.0.1:'))return route.abort();return route.continue();
  });
  await page.goto('http://127.0.0.1:'+server.address().port+'/?nativeLaunch=1');await page.evaluate(()=>window.__chat.init());
  const fixture=await page.evaluate(()=>window.__chat.fixture());envelopes=fixture.messages;attachments=fixture.attachments;await page.evaluate(()=>window.__chat.refresh());
  const voices=page.locator('.comm-message--voice');await voices.first().waitFor();assert.equal(await voices.count(),2);
  assert.match(await voices.first().innerText(),/Pe server/);assert.match(await voices.last().innerText(),/↓ Primit/);
  for(const field of ['delivered_at','read_at','played_at']){
   envelopes[0][field]=new Date().toISOString();await page.evaluate(()=>window.__chat.refresh());
   assert.match(await voices.first().innerText(),field==='delivered_at'?/Livrat/:field==='read_at'?/Citit/:/Redare confirmată/);
  }
  assert.match(await voices.first().locator('.comm-receipt').getAttribute('title'),/Nu confirmă ascultarea integrală/);
  // Metadata is a visible nonoverlapping line below each one-row player.
  for(const voice of await voices.all()){
   const bar=await voice.locator('.comm-voice-bar').boundingBox(),footer=await voice.locator('.comm-voice-receipt-footer').boundingBox();
   assert.ok(footer.height>=15&&footer.y>=bar.y+bar.height-1&&footer.x>=0&&footer.x+footer.width<=viewport.width);
   assert.match(await voice.locator('.comm-voice-receipt-footer').innerText(),/\d{2}:\d{2}/);
  }
  // Own playback does not claim that the recipient played it.
  await voices.first().locator('audio').evaluate(async a=>{a.muted=true;if(a.readyState<1)await new Promise(ok=>a.addEventListener('loadedmetadata',ok,{once:true}));await a.play()});
  assert.equal(requests.filter(x=>x.action==='receipt'&&x.receiptType==='played').length,0);
  failPlayedOnce=true;await voices.last().locator('audio').evaluate(async a=>{a.muted=true;if(a.readyState<1)await new Promise(ok=>a.addEventListener('loadedmetadata',ok,{once:true}));await a.play()});
  await page.waitForFunction(()=>document.querySelector('.comm-message.theirs .comm-receipt')?.textContent.includes('Redare pornită'));
  await page.waitForTimeout(3300);assert.ok(requests.filter(x=>x.action==='receipt'&&x.receiptType==='played').length>=2,'Failed playback receipt is retried');
  assert.ok(messageChecks>=5); // Explicit checks plus the three-second foreground poll.
  await page.locator('.comm-chat-menu').click();await page.getByRole('button',{name:'ⓘ Stările mesajelor',exact:true}).click();
  await page.locator('.comm-action-dialog').getByText(/nu înseamnă că vocalul a fost ascultat/).waitFor();await page.locator('.comm-action-dialog').getByRole('button',{name:'Înapoi',exact:true}).click();
  // Delayed POST: pending row/progress appears before server response.
  const entry=page.getByRole('textbox',{name:'Mesaj',exact:true});await entry.fill('Test de trimitere');holdSend=true;const seen=new Promise(ok=>requested=ok);
  await page.getByRole('button',{name:'Trimite mesajul',exact:true}).click();await seen;
  await page.locator('.comm-outgoing-pending').getByText(/Se trimite către server/).waitFor();
  await entry.fill('Ciornă nouă scrisă în timpul trimiterii');release();holdSend=false;
  await page.locator('.comm-message-body').getByText('Test de trimitere',{exact:true}).waitFor();await page.waitForFunction(()=>!document.querySelector('.comm-outgoing-pending'));
  assert.equal(await entry.inputValue(),'Ciornă nouă scrisă în timpul trimiterii');assert.match(await page.locator('#commChatSyncStatus').innerText(),/Ultima trimitere pe server: .* s/);
  // Lost acknowledgement: server accepted it, but UI must not fake success.
  await entry.fill('Confirmare pierdută');loseAck=true;const countBefore=envelopes.length;
  await page.getByRole('button',{name:'Trimite mesajul',exact:true}).click();await page.locator('.comm-transfer-state').getByText(/Fără confirmare/).waitFor();
  const firstAttempt=requests.filter(x=>x.action==='send').at(-1);assert.equal(envelopes.length,countBefore+1);
  // Main Send and the inline Retry reuse the same id, preventing duplicates.
  await page.getByRole('button',{name:'Trimite mesajul',exact:true}).click();await page.waitForFunction(()=>!document.querySelector('.comm-outgoing-pending'));
  const secondAttempt=requests.filter(x=>x.action==='send').at(-1);assert.equal(firstAttempt.messageId,secondAttempt.messageId);assert.equal(envelopes.length,countBefore+1);
  loseAck=true;await page.evaluate(()=>window.__chat.upload());await page.locator('.comm-transfer-state').getByText(/Fără confirmare/).waitFor();
  const mediaAttempt=requests.filter(x=>x.action==='upload').at(-1);await page.getByRole('button',{name:'Reîncearcă aceeași trimitere',exact:true}).click();await page.waitForFunction(()=>!document.querySelector('.comm-outgoing-pending'));
  assert.equal(requests.filter(x=>x.action==='upload').at(-1).messageId,mediaAttempt.messageId);
  // A normal file upload follows the same encrypted, acknowledged path.
  await page.evaluate(()=>{window.__fixtureFile=new File(['private test'],'note.txt',{type:'text/plain'});window.__chat.upload()});await page.waitForFunction(()=>window.__uploadResult===true);
  assert.equal(requests.filter(x=>x.action==='upload').at(-1).kind,'file');
  await page.setViewportSize({width:viewport.width,height:430});await entry.fill('Cu tastatura deschisă');const composer=await page.locator('.comm-compose').boundingBox();assert.ok(composer.y+composer.height<=431);
  await page.setViewportSize(viewport);await mkdir('.bundle-check/chat-delivery',{recursive:true});await page.screenshot({path:'.bundle-check/chat-delivery/chat-'+viewport.width+'.png'});
  assert.deepEqual(errors,[]);await page.close();
 }
 console.log('PASS production touch chat: voice time/direction/server/delivered/read/playback metadata, no full-listening claim, real audio playback, receipt retry, 3s foreground sync, visible send progress, measured server acknowledgement, lost-ack idempotent text/audio retry, encrypted files and 430px keyboard (Oracle simulated)');
}finally{await browser.close();server.close();server.closeAllConnections?.()}
