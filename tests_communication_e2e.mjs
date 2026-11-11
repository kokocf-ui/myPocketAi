import assert from 'node:assert/strict';
import {webcrypto} from 'node:crypto';
import {DatabaseSync} from 'node:sqlite';
import {PocketCommunicationHub} from './pocket_communication_hub.mjs';
if(!globalThis.crypto)globalThis.crypto=webcrypto;
const sqlite=new DatabaseSync(':memory:');
const sql={exec(query,...args){const stmt=sqlite.prepare(query);if(/^\s*SELECT\b/i.test(query)||/\bRETURNING\b/i.test(query))return stmt.all(...args);stmt.run(...args);return []}};
const hub=new PocketCommunicationHub({storage:{sql}},{});
const bytes=x=>new TextEncoder().encode(x),b64=x=>Buffer.from(x).toString('base64url'),random=()=>b64(crypto.getRandomValues(new Uint8Array(24)));
const sign=async(user,text)=>b64(await crypto.subtle.sign({name:'ECDSA',hash:'SHA-256'},user.signPrivate,bytes(text)));
async function device(name){
 const a=await crypto.subtle.generateKey({name:'ECDSA',namedCurve:'P-256'},false,['sign','verify']);
 const b=await crypto.subtle.generateKey({name:'ECDH',namedCurve:'P-256'},false,['deriveKey']);
 return {name,signPrivate:a.privateKey,exchangePrivate:b.privateKey,signPublic:await crypto.subtle.exportKey('jwk',a.publicKey),exchangePublic:await crypto.subtle.exportKey('jwk',b.publicKey)};
}
async function rpc(user,payload){
 const body=JSON.stringify(payload),headers={'Content-Type':'application/json'};
 if(user?.id){const ts=Date.now(),n=random();Object.assign(headers,{'X-Pocket-Id':user.id,'X-Pocket-Timestamp':String(ts),'X-Pocket-Nonce':n,'X-Pocket-Signature':await sign(user,ts+'\n'+n+'\n'+body)})}
 const result=await hub.fetch(new Request('https://test.local/api/communication',{method:'POST',headers,body}));return {status:result.status,data:await result.json(),headers,body};
}
async function register(user){
 const timestamp=Date.now(),nonce=random(),{name,signPublic,exchangePublic}=user;
 const proof=await sign(user,'register\n'+timestamp+'\n'+nonce+'\n'+JSON.stringify({name,signPublic,exchangePublic}));
 const response=await rpc(null,{action:'register',timestamp,nonce,name,signPublic,exchangePublic,proof});
 assert.equal(response.status,200);user.id=response.data.id;
}
const a=await device('Ana'),b=await device('Bogdan'),c=await device('Strain');
await register(a);await register(b);await register(c);
const token=random()+random();
assert.equal((await rpc(a,{action:'invite',token})).status,200);
assert.equal((await rpc(b,{action:'accept',token})).status,200);
assert.equal((await rpc(c,{action:'accept',token})).status,404,'invite is one-use');
assert.deepEqual((await rpc(a,{action:'contacts'})).data.contacts.map(x=>x.id),[b.id]);
assert.deepEqual((await rpc(b,{action:'contacts'})).data.contacts.map(x=>x.id),[a.id]);
const publicB=await crypto.subtle.importKey('jwk',b.exchangePublic,{name:'ECDH',namedCurve:'P-256'},false,[]);
const aKey=await crypto.subtle.deriveKey({name:'ECDH',public:publicB},a.exchangePrivate,{name:'AES-GCM',length:256},false,['encrypt']);
const iv=crypto.getRandomValues(new Uint8Array(12)),text='Salut! Acesta este un mesaj criptat.';
const cipher=await crypto.subtle.encrypt({name:'AES-GCM',iv,additionalData:bytes(a.id+'|'+b.id)},aKey,bytes(text));
const sent={action:'send',friend:b.id,messageId:crypto.randomUUID(),iv:b64(iv),cipher:b64(cipher)};
assert.equal((await rpc(a,sent)).status,200);
assert.equal((await rpc(c,{...sent,friend:b.id,messageId:crypto.randomUUID()})).status,403,'no anonymous sender');
const received=(await rpc(b,{action:'messages',friend:a.id})).data.messages;
assert.equal(received.length,1);
const publicA=await crypto.subtle.importKey('jwk',a.exchangePublic,{name:'ECDH',namedCurve:'P-256'},false,[]);
const bKey=await crypto.subtle.deriveKey({name:'ECDH',public:publicA},b.exchangePrivate,{name:'AES-GCM',length:256},false,['decrypt']);
const plaintext=await crypto.subtle.decrypt({name:'AES-GCM',iv:Buffer.from(received[0].iv,'base64url'),additionalData:bytes(a.id+'|'+b.id)},bKey,Buffer.from(received[0].cipher,'base64url'));
assert.equal(new TextDecoder().decode(plaintext),text);
const first=await rpc(a,{action:'me'}),replay=await hub.fetch(new Request('https://test.local/api/communication',{method:'POST',headers:first.headers,body:first.body}));
assert.equal(replay.status,409,'signed replay must fail');
assert.equal((await rpc(a,{action:'remove',friend:b.id})).status,200);
assert.equal((await rpc(b,{action:'messages',friend:a.id})).status,403,'revoked contact access must fail');
sqlite.close();
console.log('PASS two-device registration, one-time invite, ECDH/AES-GCM text, replay prevention and revoke');