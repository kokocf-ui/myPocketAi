import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFileSync} from 'node:fs';
import {checkPrivateTransport} from './vpc_probe.mjs';
test('Real Oracle VPC probe health and denied authorization, without exposing secrets',async()=>{
 const calls=[];
 const oracle=(country,port)=>({
  fetch:async(url,opt)=>{
   calls.push({url,method:opt.method,auth:opt.headers?.Authorization});
   assert.ok(url.startsWith('http://127.0.0.1:'+port+'/'));
   if(url.endsWith('/healthz'))return Response.json({status:'ok',country});
   assert.equal(url,'http://127.0.0.1:'+port+'/v1/plan');
   assert.equal(opt.method,'POST');
   assert.equal(opt.headers.Authorization,'Bearer intentionally-invalid-diagnostic-only');
   assert.equal(opt.body,'{}');
   return Response.json({error:'unauthorized'},{status:401});
  }});
 const env={RO_URBAN_VPC:oracle('RO',8766),EN_URBAN_VPC:oracle('GB',8768)};
 const results=await Promise.all(['RO','GB'].map(x=>checkPrivateTransport(env,x)));
 assert.ok(results.every(x=>x.status==='ok'));
 assert.ok(results.every(x=>x.token_values_verified===false));
 assert.equal(calls.length,4);
});
test('Reject wrong destination and bypassed Bearer authenticator',async()=>{
 const wrong={fetch:async()=>Response.json({status:'ok',country:'GB'})};
 assert.equal((await checkPrivateTransport({RO_URBAN_VPC:wrong},'RO')).status,'wrong_origin');
 const accept={fetch:async(url)=>{
   if(url.endsWith('/healthz'))return Response.json({status:'ok',country:'RO'});
   return Response.json({status:'success',journeys:[]},{status:200});
 }};
 assert.equal((await checkPrivateTransport({RO_URBAN_VPC:accept},'RO')).status,'unexpected_auth_response');
 assert.equal((await checkPrivateTransport({},'RO')).status,'binding_missing');
 assert.equal((await checkPrivateTransport({},'OTHER')).status,'invalid_region');
});
test('Both Cloudflare service IDs match staged backend and probe configs',()=>{
 const toml=readFileSync('oracle-transport-bridge/wrangler-probe.toml','utf8');
 const prod=readFileSync('wrangler-backend.toml','utf8');
 for(const id of ['01a1e3ea-f6fa-7d11-8f85-21f267b1d833',
   '01a1e3e9-9c6b-7aa1-aefc-50a6824dbcd5']){
  assert.ok(toml.includes(id));assert.ok(prod.includes(id));
 }
 assert.ok(!toml.includes('POCKET_COMM_HUB'));
 assert.ok(!toml.includes('RO_URBAN_API_TOKEN'));
});
