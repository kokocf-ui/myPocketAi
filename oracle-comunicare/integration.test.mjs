import assert from 'node:assert/strict';
import {test,after,before} from 'node:test';
import {randomBytes,randomUUID,webcrypto as crypto} from 'node:crypto';
import pg from 'pg';
import {makeServer} from './server.mjs';

const enabled=process.env.POCKET_COMM_TEST_DB==='1';
const testIt=enabled?test:test.skip;
const db=new pg.Pool({host:process.env.PGHOST||'127.0.0.1',port:Number(process.env.PGPORT||5432),
 database:process.env.PGDATABASE||'pocket_comm',user:process.env.PGUSER||'pocket_comm',
 password:process.env.PGPASSWORD});
const server=makeServer();let origin;
before(async()=>{if(!enabled)return;await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));origin='http://127.0.0.1:'+server.address().port});
after(async()=>{if(enabled){await new Promise(resolve=>server.close(resolve));await db.end()}});
const enc=new TextEncoder();
const b64=b=>Buffer.from(b).toString('base64url');
const call=async(body,identity)=>{
 const data=JSON.stringify(body),headers={'content-type':'application/json'};
 if(identity){
  const ts=Date.now(),nonce=b64(randomBytes(24));
  const sig=await crypto.subtle.sign({name:'ECDSA',hash:'SHA-256'},identity.sign.privateKey,enc.encode(ts+'\n'+nonce+'\n'+data));
  Object.assign(headers,{'X-Pocket-Id':identity.id,'X-Pocket-Timestamp':String(ts),'X-Pocket-Nonce':nonce,'X-Pocket-Signature':b64(sig)});
 }
 const r=await fetch(origin+'/api/communication',{method:'POST',headers,body:data});
 return {status:r.status,...await r.json()};
};
async function register(name){
 const sign=await crypto.subtle.generateKey({name:'ECDSA',namedCurve:'P-256'},false,['sign','verify']);
 const exchange=await crypto.subtle.generateKey({name:'ECDH',namedCurve:'P-256'},false,['deriveKey']);
 const signPublic=await crypto.subtle.exportKey('jwk',sign.publicKey);
 const exchangePublic=await crypto.subtle.exportKey('jwk',exchange.publicKey);
 const ts=Date.now(),nonce=b64(randomBytes(24));
 const proof='register\n'+ts+'\n'+nonce+'\n'+JSON.stringify({name,signPublic,exchangePublic});
 const signature=b64(await crypto.subtle.sign({name:'ECDSA',hash:'SHA-256'},sign.privateKey,enc.encode(proof)));
 const created=await call({action:'register',timestamp:ts,nonce,name,signPublic,exchangePublic,proof:signature});
 assert.equal(created.ok,true,JSON.stringify(created));return {id:created.id,name,sign,exchange,exchangePublic};
}
async function encrypt(from,to,data){
 const publicKey=await crypto.subtle.importKey('jwk',to.exchangePublic,{name:'ECDH',namedCurve:'P-256'},false,[]);
 const key=await crypto.subtle.deriveKey({name:'ECDH',public:publicKey},from.exchange.privateKey,{name:'AES-GCM',length:256},false,['encrypt','decrypt']);
 const iv=crypto.getRandomValues(new Uint8Array(12));
 const cipher=await crypto.subtle.encrypt({name:'AES-GCM',iv,additionalData:enc.encode(from.id+'|'+to.id)},key,data);
 return {iv:b64(iv),cipher:b64(cipher)};
}
async function decrypt(from,to,iv,cipher){
 const publicKey=await crypto.subtle.importKey('jwk',from.exchangePublic,{name:'ECDH',namedCurve:'P-256'},false,[]);
 const key=await crypto.subtle.deriveKey({name:'ECDH',public:publicKey},to.exchange.privateKey,{name:'AES-GCM',length:256},false,['encrypt','decrypt']);
 return crypto.subtle.decrypt({name:'AES-GCM',iv:Buffer.from(iv,'base64url'),additionalData:enc.encode(from.id+'|'+to.id)},key,Buffer.from(cipher,'base64url'));
}
testIt('2 users: authenticated invite -> accept -> ciphertext -> media -> list with ACL',async()=>{
 const a=await register('Invitator'),b=await register('Prieten'),stranger=await register('Străin');
 const unauth=await call({action:'contacts'});assert.notEqual(unauth.ok,true);
 const code=b64(randomBytes(48));
 const invite=await call({action:'invite',token:code},a);assert.equal(invite.ok,true);
 const landing=await fetch(origin+'/i/'+code);assert.equal(landing.status,200);assert.match(await landing.text(),/Invitator/);
 const accept=await call({action:'accept',token:code},b);assert.equal(accept.ok,true);
 assert.equal((await call({action:'accept',token:code},stranger)).ok,false);
 const aContacts=await call({action:'contacts'},a),bContacts=await call({action:'contacts'},b);
 assert.ok(aContacts.contacts.some(x=>x.id===b.id));assert.ok(bContacts.contacts.some(x=>x.id===a.id));
 const plain='Salut din Londra!';const sealed=await encrypt(a,b,enc.encode(plain));
 const sent=await call({action:'send',friend:b.id,messageId:randomUUID(),...sealed},a);
 assert.equal(sent.ok,true);
 const pulled=await call({action:'messages',friend:a.id},b);assert.equal(pulled.ok,true);
 const m=pulled.messages.find(x=>x.id===sent.messageId);
 assert.ok(m);assert.notEqual(m.cipher,plain);
 assert.equal(new TextDecoder().decode(await decrypt(a,b,m.iv,m.cipher)),plain);
 assert.equal((await call({action:'messages',friend:a.id},stranger)).ok,false);
 const bytes=enc.encode('encrypted media test payload'),media=await encrypt(a,b,bytes);
 const upload=await call({action:'upload',friend:b.id,messageId:randomUUID(),kind:'file',mime:'application/pdf',encryptedName:b64(randomBytes(24)),...media},a);
 assert.equal(upload.ok,true,JSON.stringify(upload));
 const downloaded=await call({action:'attachment',friend:a.id,attachmentId:upload.attachmentId},b);
 assert.equal(downloaded.ok,true);
 assert.equal(new TextDecoder().decode(await decrypt(a,b,downloaded.attachment.iv,downloaded.attachment.cipher)),'encrypted media test payload');
 assert.equal((await call({action:'attachment',friend:a.id,attachmentId:upload.attachmentId},stranger)).ok,false);
 const list=await call({action:'list_create',title:'Cumpărături'},a);assert.equal(list.ok,true);
 assert.equal((await call({action:'list',listId:list.listId},b)).ok,false);
 assert.equal((await call({action:'list_share',listId:list.listId,friend:b.id,role:'editor'},a)).ok,true);
 const item=randomUUID();
 const added=await call({action:'list_op',listId:list.listId,opId:randomUUID(),itemId:item,kind:'add',detail:{name:'Lapte',quantity:'2 l'},expectedRevision:0},b);
 assert.equal(added.revision,1);
 const old=await call({action:'list_op',listId:list.listId,opId:randomUUID(),itemId:item,kind:'check',detail:{},expectedRevision:0},a);
 assert.equal(old.status,409);
 assert.equal((await call({action:'list',listId:list.listId},a)).operations.length,1);
 const blocked=await call({action:'block',friend:b.id},a);assert.equal(blocked.ok,true);
 assert.equal((await call({action:'messages',friend:a.id},b)).ok,false);
 assert.equal((await call({action:'list',listId:list.listId},b)).ok,false);
});
