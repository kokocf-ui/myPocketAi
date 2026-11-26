import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFileSync} from 'node:fs';
import {mkdtemp,rm} from 'node:fs/promises';
import {HereTransitBudget} from './here_transit_budget.mjs';
import {Miniflare,convertV4MiniflareOptions} from 'miniflare';

test('real Workers DO transactions: 60 concurrent requests, exact cap, persistence after restart',async()=>{
 const dir=await mkdtemp('/tmp/pocket-here-budget-');
 const script=readFileSync(new URL('./here_transit_budget.mjs',import.meta.url),'utf8')+'\nexport default {fetch(){return new Response("test only")}};';
 const config={modules:true,script,compatibilityDate:'2026-11-26',durableObjects:{HERE_TRANSIT_BUDGET:{className:'HereTransitBudget',useSQLite:true}},resourcePersistencePath:dir,bindings:{HERE_TRANSIT_MONTHLY_LIMIT:'7'}};
 let mf;
 try{
  mf=new Miniflare(convertV4MiniflareOptions(config));
  const reserve=async()=>{const ns=await mf.getDurableObjectNamespace('HERE_TRANSIT_BUDGET');return ns.get(ns.idFromName('here-public-transit-account-budget-v1')).fetch('https://budget.internal/reserve',{method:'POST'});};
  const results=await Promise.all(Array.from({length:60},async()=>{const r=await reserve();return {status:r.status,...await r.json()};}));
  assert.equal(results.filter(r=>r.allowed).length,7);assert.equal(results.filter(r=>r.status===429).length,53);
  assert.deepEqual(results.filter(r=>r.allowed).map(r=>r.used).sort((a,b)=>a-b),[1,2,3,4,5,6,7]);
  await mf.dispose();mf=new Miniflare(convertV4MiniflareOptions(config));
  assert.equal((await reserve()).status,429);
 }finally{if(mf)await mf.dispose();await rm(dir,{recursive:true,force:true});}
});

test('month rollover, corrupt counters, backwards clock, write errors and invalid limit fail safely',async()=>{
 let record;const storage={transaction:fn=>fn({get:async()=>record,put:async(k,v)=>{record=v;}})};
 const budget=new HereTransitBudget({storage},{HERE_TRANSIT_MONTHLY_LIMIT:'2'});
 const req=()=>new Request('https://budget.internal/reserve',{method:'POST'});
 record={month:'2020-01',used:2};assert.equal((await budget.fetch(req())).status,200);
 assert.equal((await budget.fetch(req())).status,200);assert.equal((await budget.fetch(req())).status,429);
 for(const broken of [{month:'invalid',used:0},{month:'9999-12',used:0},{month:new Date().toISOString().slice(0,7),used:NaN}]){
  record=broken;assert.equal((await budget.fetch(req())).status,503);
 }
 const fail=new HereTransitBudget({storage:{transaction:()=>{throw Error('storage down');}}},{});
 assert.equal((await fail.fetch(req())).status,503);
 assert.equal((await new HereTransitBudget({storage},{HERE_TRANSIT_MONTHLY_LIMIT:5000}).fetch(req())).status,503);
 assert.equal((await budget.fetch(new Request('https://budget.internal/reserve'))).status,404);
});
