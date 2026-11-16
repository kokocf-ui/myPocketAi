import assert from 'node:assert/strict';
import {test} from 'node:test';
import {verifyHttpResult,REGIONS} from './oracle-transport-bridge/test-england-candidate-all-http.mjs';
test('one dated scheduled journey passes only when the matching region is selected',()=>{
 const result=verifyHttpResult('en-se',[{region:'en-se'}],{status:200},
  {status:'success',journeys:[{legs:[{mode:'bus'}]}]});
 assert.equal(result.region,'en-se');
 assert.equal(result.journeys,1);
 assert.equal(REGIONS.length,9);
});
test('a wrong selected region cannot silently produce success',()=>{
 assert.throws(()=>verifyHttpResult('en-se',[{region:'en-sw'}],
   {status:200},{status:'success',journeys:[{}]}),/region_not_selected/);
});
test('no service, 503 or an unapproved region fails',()=>{
 assert.throws(()=>verifyHttpResult('en-se',[{region:'en-se'}],
  {status:200},{status:'no_service_on_date',journeys:[]}),/no_verified_journeys/);
 assert.throws(()=>verifyHttpResult('en-se',[{region:'en-se'}],
  {status:503},{status:'success',journeys:[{}]}),/no_verified_journeys/);
 assert.throws(()=>verifyHttpResult('en-unknown',[],
  {status:200},{status:'success',journeys:[{}]}),/invalid_region/);
});
