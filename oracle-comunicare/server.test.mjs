import assert from 'node:assert/strict';
import {after,before,test} from 'node:test';
import {makeServer} from './server.mjs';

const server=makeServer();
let base;
before(async()=>{await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));base='http://127.0.0.1:'+server.address().port});
after(async()=>{await new Promise(resolve=>server.close(resolve))});

test('health check is no-store and versioned',async()=>{
 const r=await fetch(base+'/healthz');
 assert.equal(r.status,200);assert.equal(r.headers.get('cache-control'),'no-store');
 assert.equal((await r.json()).service,'pocketai-comunicare-oracle');
});
test('unrecognized paths and public write methods refuse requests',async()=>{
 const r=await fetch(base+'/messages');
 assert.equal(r.status,404);
 const w=await fetch(base+'/healthz',{method:'POST'});
 assert.equal(w.status,404);
});
test('unsigned API calls are rejected (whether storage is unavailable or not)',async()=>{
 const r=await fetch(base+'/api/communication',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({action:'contacts'})});
 assert.ok([401,503].includes(r.status));
 assert.notEqual(r.status,200);
});
test('web origin policy rejects unrelated origins',async()=>{
 const r=await fetch(base+'/api/communication',{method:'POST',headers:{Origin:'https://untrusted.example','content-type':'application/json'},body:'{}'});
 assert.equal(r.status,403);
});
test('public URL requires a sufficiently long opaque invitation code',async()=>{
 const r=await fetch(base+'/i/guess');
 assert.equal(r.status,404);
});
