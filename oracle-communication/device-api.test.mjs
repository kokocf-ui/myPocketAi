import test from 'node:test';
import assert from 'node:assert/strict';
import {webcrypto} from 'node:crypto';
import {Readable} from 'node:stream';
import {createDeviceCommunicationHandler} from './device-api.mjs';

const {subtle}=webcrypto;
const encoded=x=>Buffer.from(x).toString('base64url');
async function keys(){
 const s=await subtle.generateKey({name:'ECDSA',namedCurve:'P-256'},false,['sign','verify']);
 const e=await subtle.generateKey({name:'ECDH',namedCurve:'P-256'},false,['deriveKey']);
 return {privateKey:s.privateKey,signPublic:await subtle.exportKey('jwk',s.publicKey),exchangePublic:await subtle.exportKey('jwk',e.publicKey)}
}
async function signature(key,plain){return encoded(await subtle.sign({name:'ECDSA',hash:'SHA-256'},key,new TextEncoder().encode(plain)))}
function mockPool(){
 const users=new Map(),nonceSet=new Set();
 const query=async(sql,args=[])=>{
  if(sql.includes('FROM device_users WHERE key_hash'))return {rowCount:0,rows:[]};
  if(sql.includes('INSERT INTO device_users')){users.set(args[0],JSON.parse(args[3]));return {rowCount:1,rows:[]}}
  if(sql.includes('SELECT sign_public FROM device_users')){const k=users.get(args[0]);return {rowCount:k?1:0,rows:k?[{sign_public:k}]:[]}}
  if(sql.includes('DELETE FROM device_nonces'))return {rowCount:0,rows:[]};
  if(sql.includes('INSERT INTO device_nonces')){
   const id=args.join(':');if(nonceSet.has(id))return {rowCount:0,rows:[]};
   nonceSet.add(id);return {rowCount:1,rows:[{nonce:args[1]}]}
  }
  if(sql.includes('SELECT EXISTS(SELECT 1 FROM device_contacts'))return {rows:[{outgoing:false,incoming:false,blocked:false}],rowCount:1};
  throw Error('Unexpected SQL in mock: '+sql);
 };
 return {query,connect:async()=>({query:async(sql,args)=>/^(BEGIN|COMMIT|ROLLBACK)$/.test(sql)?{rows:[]}:query(sql,args),release(){}})};
}
async function request(handle,body,headers={},path='/api/communication',method='POST'){
 const req=Readable.from([Buffer.from(JSON.stringify(body))]);
 req.method=method;req.headers=headers;req.socket={remoteAddress:'127.0.0.1'};
 const response={headers:{},status:0,body:'',writeHead(n,h){this.status=n;Object.assign(this.headers,h)},setHeader(k,v){this.headers[k]=v},end(data){this.body=String(data??'')}};
 await handle(req,response,path);
 return {status:response.status||response.statusCode,payload:JSON.parse(response.body)};
}
test('device registration needs no email, telephone or SMTP; proof signature required',async()=>{
 const pool=mockPool(),handle=createDeviceCommunicationHandler(pool),k=await keys(),stamp=Date.now();
 const nonce=encoded(webcrypto.getRandomValues(new Uint8Array(24)));
 const register={action:'register',timestamp:stamp,nonce,name:'Ana',signPublic:k.signPublic,exchangePublic:k.exchangePublic};
 register.proof=await signature(k.privateKey,'register\n'+stamp+'\n'+nonce+'\n'+JSON.stringify({name:register.name,signPublic:k.signPublic,exchangePublic:k.exchangePublic}));
 const ok=await request(handle,register);
 assert.equal(ok.status,200);assert.match(ok.payload.id,/^[a-f0-9-]{36}$/);
 assert.equal(ok.payload.ok,true);
 const bad=await request(handle,{...register,proof:'a'.repeat(86)});
 assert.equal(bad.status,401);
 const signedPayload={action:'messages',friend:'11111111-1111-4111-8111-111111111111'};
 const clock=Date.now(),idNonce=encoded(webcrypto.getRandomValues(new Uint8Array(24)));
 const auth={'x-pocket-id':ok.payload.id,'x-pocket-timestamp':String(clock),'x-pocket-nonce':idNonce,
 'x-pocket-signature':await signature(k.privateKey,clock+'\n'+idNonce+'\n'+JSON.stringify(signedPayload))};
 const blocked=await request(handle,signedPayload,auth);
 assert.equal(blocked.status,403);
 assert.equal((await request(handle,signedPayload,auth)).status,409,'replayed nonce rejected');
});
