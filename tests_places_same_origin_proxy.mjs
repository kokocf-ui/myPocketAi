import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import frontend from './index.js';
const source=readFileSync(new URL('./index.js',import.meta.url),'utf8');
const config=readFileSync(new URL('./wrangler-frontend.toml',import.meta.url),'utf8');
assert.match(source,/apiUrl:'\\/api\\/chat'/,'Client requests use same-origin API');
assert.match(config,/\\[\\[services\\]\\][\\s\\S]*binding = "POCKET_API"[\\s\\S]*service = "lifewise-ai-api"/,'Backend is bound to the frontend Worker');
assert.ok(!source.includes("retry.textContent=dialogText('Reîncearcă căutarea'"),'Remove manual retry button');
const payload={module:'travel',quick_place_search:true,place_category:'fast_food',location:{latitude:51.4775,longitude:0.3007}};
let intercepted=0;
const env={POCKET_API:{fetch:async req=>{
 intercepted++;
 assert.equal(req.url,'https://lifewise-ai-api.kokocf.workers.dev/api/chat');
 assert.equal(req.method,'POST');
 assert.deepEqual(await req.json(),payload);
 return Response.json({status:'success',search_ok:true,places:[{name:'Mapped cafe'}]});
}}};
const request=new Request('https://lifewise-ai-v2.kokocf.workers.dev/api/chat',{
 method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload)
});
const result=await frontend.fetch(request,env);
assert.equal(result.status,200);
assert.equal((await result.json()).places[0].name,'Mapped cafe');
assert.equal(intercepted,1,'Only one backend service request was made');
const missing=await frontend.fetch(new Request('https://lifewise-ai-v2.kokocf.workers.dev/api/chat',{method:'POST'}),{});
assert.equal(missing.status,503,'Missing binding is diagnosed');
const method=await frontend.fetch(new Request('https://lifewise-ai-v2.kokocf.workers.dev/api/chat',{method:'GET'}),env);
assert.equal(method.status,405,'Proxy accepts only POST');
assert.equal(intercepted,1);
console.log('PASS first-party Android POI proxy, no retry control and service binding');
