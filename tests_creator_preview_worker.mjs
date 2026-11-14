import assert from 'node:assert/strict';
import {CreatorPreviewQuota} from './creator_preview_worker.mjs';
import app from './creator_preview_worker.mjs';
let aiCalls=0,siteCalls=0;
const kv=new Map();
const storage={
 async get(key){return kv.get(key)},
 async put(key,value){kv.set(key,value)},
 async transaction(cb){return cb(this)}
};
const quota=new CreatorPreviewQuota({storage},{});
const env={AI:{async run(model,opts){if(model==='@cf/meta/llama-3.1-8b-instruct-fast'){siteCalls++;return {response:JSON.stringify({ro:{headline:'Aramis',intro:'Cazare',about:'Pensiune cu mic dejun',services:[]}})}}};aiCalls++;assert.equal(model,'@cf/black-forest-labs/flux-1-schnell');assert.ok(opts.prompt.length<=500);return {image:'A'.repeat(700)}}},
 CREATOR_PREVIEW_QUOTA:{idFromName:()=> 'global',get:()=>({fetch:(url,init)=>quota.fetch(new Request(url,init))})}
};
const request=(headers={},prompt='A mountainside house at dawn in autumn')=>new Request('https://lifewise-ai-creator-preview.kokocf.workers.dev/image',
 {method:'POST',headers:{'Content-Type':'application/json',Origin:'https://lifewise-ai-v2.kokocf.workers.dev','X-Pocket-Preview':'1',...headers},body:JSON.stringify({prompt})});
const noOrigin=await app.fetch(request({Origin:'https://example.com'}),env);
assert.equal(noOrigin.status,403);assert.equal(aiCalls,0);
assert.equal((await app.fetch(request({},'short'),env)).status,400);
for(let i=0;i<3;i++){const result=await app.fetch(request(),env);assert.equal(result.status,200);const body=await result.json();assert.equal(body.status,'success');assert.equal(body.remaining,2-i);}
const max=await app.fetch(request(),env);assert.equal(max.status,429);
assert.equal((await max.json()).error,'preview_limit_reached');
assert.equal(aiCalls,3,'Daily 3 image quota must apply before AI is called');
assert.equal(kv.get('lifetime'),3);
assert.equal(kv.get('day:'+new Date().toISOString().slice(0,10)),3);
assert.equal((await app.fetch(new Request('https://lifewise-ai-creator-preview.kokocf.workers.dev/image'),env)).status,403);
const makeSite=()=>new Request('https://lifewise-ai-creator-preview.kokocf.workers.dev/site',{
 method:'POST',headers:{'Content-Type':'application/json',Origin:'https://lifewise-ai-v2.kokocf.workers.dev','X-Pocket-Preview':'1'},
 body:JSON.stringify({name:'Aramis',description:'Pensiune cu 5 camere single si mic dejun inclus',kind:'hotel',lang:'ro',style:'Clasic'})
});
for(let i=0;i<6;i++){const response=await app.fetch(makeSite(),env);assert.equal(response.status,200);const data=await response.json();assert.equal(data.status,'success');}
assert.equal((await app.fetch(makeSite(),env)).status,429);
assert.equal(siteCalls,6);assert.equal(aiCalls,3,'Site quota must not reduce the image allowance');
assert.equal(kv.get('site:lifetime'),6);
console.log('PASS: isolated owner-preview image provider, strict CORS and separate site (6/day) and image (3/day) hard stops');
