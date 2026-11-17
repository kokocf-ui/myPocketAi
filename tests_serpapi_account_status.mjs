import assert from 'node:assert/strict';
import {summarizeSerpApiFreeAccount,checkSerpApiSecretStatus} from './serpapi_account_status.mjs';
import {readFileSync} from 'node:fs';
assert.deepEqual(summarizeSerpApiFreeAccount({plan_monthly_price:0,
 total_searches_left:250,account_status:'Active'}),{
 status:'free_active',freePlan:true,hasQuota:true});
assert.equal(summarizeSerpApiFreeAccount({plan_monthly_price:0,total_searches_left:0}).status,'free_exhausted');
assert.equal(summarizeSerpApiFreeAccount({plan_monthly_price:12,total_searches_left:100}).status,'free_plan_not_verified');
assert.equal(summarizeSerpApiFreeAccount({plan_monthly_price:0}).status,'quota_not_verified');
assert.equal(summarizeSerpApiFreeAccount({plan_monthly_price:0,total_searches_left:2,account_status:'Suspended'}).status,'account_not_active');
let seen=[],times=1000;
const provider=async url=>{
 const u=new URL(url);seen.push(u);
 assert.equal(u.origin,'https://serpapi.com');
 assert.equal(u.pathname,'/account.json');
 assert.equal(u.searchParams.get('api_key'),'test-key-of-realistic-length');
 return {ok:true,json:async()=>({
  account_email:'private@example.com',
  account_id:'private-account',
  api_key:'test-key-of-realistic-length',
  plan_name:'Free Plan',
  plan_monthly_price:0,
  searches_per_month:250,
  total_searches_left:249,
  account_status:'Active'
 })};
};
const env={SERPAPI_API_KEY:'test-key-of-realistic-length'};
const basic=await checkSerpApiSecretStatus(env,{fetcher:provider});
assert.equal(basic.status,'configured_not_probed');
assert.equal(seen.length,0,'A plain readiness request never makes any outbound network call');
const response=await checkSerpApiSecretStatus(env,{fetcher:provider,clock:()=>times,probe:true});
assert.equal(response.status,'free_active');
assert.equal(response.freePlan,true);
assert.equal(response.hasQuota,true);
assert.equal(response.flightSearchActive,false);
assert.equal(response.consumesSearchCredits,false);
assert.equal(seen.length,1);
const repeated=await checkSerpApiSecretStatus(env,{fetcher:provider,clock:()=>times+900,probe:true});
assert.equal(repeated.source,'short_cache');
assert.equal(seen.length,1,'Avoid repeated network probes inside a live Worker isolate');
for(const value of ['private@example.com','private-account','test-key-of-realistic-length','249']){
 assert.ok(!JSON.stringify(response).includes(value),'Never leak secret or account identifier or exact quota');
}
assert.equal((await checkSerpApiSecretStatus({},{fetcher:provider,probe:true})).status,'secret_missing');
assert.equal(seen.length,1,'Missing secret must not reach the network');
const backend=readFileSync('backend.js','utf8');
assert.match(backend,/import \{checkSerpApiSecretStatus\} from "\.\/serpapi_account_status\.mjs"/);
assert.match(backend,/url\.pathname==="\/api\/flight-source-status"/);
assert.match(backend,/probe:url\.searchParams\.get\("probe"\)==="1"/);
assert.match(backend,/searchCandidatesShown:false,completeJourneyAvailable:false/,
 'A healthy key is not a live, end-to-end itinerary');
console.log('PASS SerpApi secret probe: free account, zero search credits, no sensitive disclosure, no auto-search');
