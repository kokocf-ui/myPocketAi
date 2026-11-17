import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import frontend from './index.js';
const source=readFileSync(new URL('./index.js',import.meta.url),'utf8');
const config=readFileSync(new URL('./wrangler-frontend.toml',import.meta.url),'utf8');
assert.ok(source.includes("apiUrl:'/api/chat'"),'Android API uses its own origin');
assert.ok(config.includes('binding = "POCKET_API"')&&config.includes('service = "lifewise-ai-api"'));
assert.ok(!source.includes("retry.textContent=dialogText('Reîncearcă căutarea'"),'No POI retry button');
const payload={module:'travel',quick_place_search:true,place_category:'fast_food',location:{latitude:51.4775,longitude:0.3007}};
const req=()=>new Request('https://lifewise-ai-v2.kokocf.workers.dev/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
let calls=0;
const first=await frontend.fetch(req(),{POCKET_API:{fetch:async r=>{
 calls++;assert.equal(r.url,'https://lifewise-ai-api.kokocf.workers.dev/api/chat');
 assert.deepEqual(await r.json(),payload);
 return Response.json({status:'success',search_ok:true,places:[{name:'Cafe'}]});
}}});
assert.equal(first.status,200);
assert.equal((await first.json()).places[0].name,'Cafe');
assert.equal(calls,1);
let attempts=0;
const recovered=await frontend.fetch(req(),{POCKET_API:{fetch:async ()=>{
 attempts++;
 if(attempts===1)throw new Error('Temporary Cloudflare binding failure');
 return Response.json({status:'success',places:[{name:'Recovered'}]});
}}});
assert.equal((await recovered.json()).places[0].name,'Recovered');
assert.equal(attempts,2,'One invisible binding retry');
const originalFetch=globalThis.fetch;
let direct=0,failed=0;
globalThis.fetch=async request=>{
 direct++;assert.equal(request.url,'https://lifewise-ai-api.kokocf.workers.dev/api/chat');
 return Response.json({status:'success',places:[{name:'Server fallback'}]});
};
try{
 const result=await frontend.fetch(req(),{POCKET_API:{fetch:async()=>{failed++;throw new Error('binding failed')}}});
 assert.equal((await result.json()).places[0].name,'Server fallback');
 assert.equal(failed,2);
 assert.equal(direct,1);
}finally{globalThis.fetch=originalFetch}
globalThis.fetch=async()=>{throw new Error('Connection not available')};
try{
 const result=await frontend.fetch(req(),{});
 assert.equal(result.status,502,'Controlled response when even public backend is unreachable');
}finally{globalThis.fetch=originalFetch}
const method=await frontend.fetch(new Request('https://lifewise-ai-v2.kokocf.workers.dev/api/chat'),{});
assert.equal(method.status,405);
console.log('PASS first-party API proxy, invisible Cloudflare binding recovery, server-side fallback and no retry UI');
