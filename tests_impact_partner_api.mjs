import assert from 'node:assert/strict';
import {impactPartnerApiConfigured,verifyImpactPartnerPrograms} from './impact_partner_api.mjs';
const env={IMPACT_ACCOUNT_SID:'IRtest123',IMPACT_API_TOKEN:'mock-only-do-not-use'};
assert.equal(impactPartnerApiConfigured({}),false);
assert.equal(impactPartnerApiConfigured(env),true);
assert.deepEqual(await verifyImpactPartnerPrograms({}),{state:'not_configured'});
assert.deepEqual(await verifyImpactPartnerPrograms({...env,IMPACT_ACCOUNT_SID:'foo/other'}),{state:'not_configured'});
let called=0;
const good=await verifyImpactPartnerPrograms(env,{fetcher:async (url,request)=>{
  called++;
  assert.equal(url,'https://api.impact.com/Mediapartners/IRtest123/Campaigns');
  assert.equal(request.method,'GET');
  assert.equal(request.redirect,'error');
  assert.equal(request.cache,'no-store');
  assert.equal(request.headers.Accept,'application/json');
  assert.equal(request.headers.Authorization,'Basic '+btoa('IRtest123:mock-only-do-not-use'));
  return {ok:true,status:200,json:async()=>({Campaigns:[{Name:'Omio Travel Partner Program'},{Name:'Other'}]})};
}});
assert.equal(called,1);
assert.deepEqual(good,{state:'connected',listed_programs_on_page:2,omio_listed_on_page:true});
for(const [http,state] of [[401,'authentication_failed'],[403,'insufficient_permissions'],[429,'rate_limited'],[500,'upstream_unavailable']]){
  const result=await verifyImpactPartnerPrograms(env,{fetcher:async()=>({ok:false,status:http})});
  assert.equal(result.state,state);
  assert.ok(!JSON.stringify(result).includes(env.IMPACT_API_TOKEN));
  assert.ok(!JSON.stringify(result).includes(env.IMPACT_ACCOUNT_SID));
}
assert.deepEqual(await verifyImpactPartnerPrograms(env,{fetcher:async()=>{throw Error('request failure')}}),{state:'request_failed'});
assert.deepEqual(await verifyImpactPartnerPrograms(env,{fetcher:async()=>({ok:true,status:200,json:async()=>{throw Error('not JSON')}})}),{state:'invalid_response'});
assert.deepEqual(await verifyImpactPartnerPrograms(env,{fetcher:async()=>({ok:true,status:200,json:async()=>({Campaigns:{Campaign:[{CampaignName:'Another Programme'}]}})})}),{state:'connected',listed_programs_on_page:1,omio_listed_on_page:false});
console.log('PASS Impact Partner API: GET-only, Basic auth, non-disclosure, failure handling');
