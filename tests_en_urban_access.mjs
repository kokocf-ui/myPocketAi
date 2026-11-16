import assert from 'node:assert/strict';
import {test} from 'node:test';
import {planEnglandLocalGtfs} from './en_urban_client.mjs';
const origin={latitude:51.500,longitude:-0.120},destination={latitude:51.505,longitude:-0.125};
const token='0123456789abcdef0123456789abcdef';
test('England Oracle adapter sends isolated Access credentials over HTTPS only',async()=>{
 const env={
  EN_URBAN_API_URL:'https://england.example/',
  EN_URBAN_API_TOKEN:token,
  EN_URBAN_ACCESS_CLIENT_ID:'id.access',
  EN_URBAN_ACCESS_CLIENT_SECRET:'secret.access'
 };
 let seen=false;
 const ans=await planEnglandLocalGtfs(env,{from:origin,to:destination},{
  fetchImpl:async(url,init)=>{
   seen=true;
   assert.equal(url,'https://england.example/v1/plan');
   assert.equal(init.headers.Authorization,'Bearer '+token);
   assert.equal(init.headers['CF-Access-Client-Id'],'id.access');
   assert.equal(init.headers['CF-Access-Client-Secret'],'secret.access');
   const body=JSON.parse(init.body);
   assert.equal(body.region,'england');
   assert.equal(body.from.latitude,origin.latitude);
   return Response.json({status:'no_verified_itinerary',journeys:[]});
  }
 });
 assert.equal(seen,true);
 assert.equal(ans.status,'no_verified_itinerary');
 const missing=await planEnglandLocalGtfs({...env,EN_URBAN_ACCESS_CLIENT_SECRET:''},
  {from:origin,to:destination},{fetchImpl:()=>{throw Error('unexpected fetch')}});
 assert.equal(missing.status,'invalid_access_config');
 const insecure=await planEnglandLocalGtfs({...env,EN_URBAN_API_URL:'http://england.example/'},
  {from:origin,to:destination});
 assert.equal(insecure.status,'invalid_endpoint_config');
});

test('England Workers VPC Service connects to internal HTTP without a public domain',async()=>{
 let called=0;
 const bound={fetch:async(url,init)=>{
   called++;
   assert.equal(url,'http://england.pocketai.internal/v1/plan');
   assert.equal(init.headers.Authorization,'Bearer '+token);
   assert.equal(init.headers['CF-Access-Client-Secret'],undefined);
   return Response.json({status:'no_verified_itinerary',journeys:[]});
 }};
 const env={EN_URBAN_VPC:bound,EN_URBAN_API_TOKEN:token,
   EN_URBAN_API_URL:'https://old-host.example/'};
 const answer=await planEnglandLocalGtfs(env,{from:origin,to:destination},{fetchImpl:()=>{
   throw Error('public HTTP must not be used');
 }});
 assert.equal(called,1);
 assert.equal(answer.status,'no_verified_itinerary');
 const invalid=await planEnglandLocalGtfs({EN_URBAN_VPC:{} ,EN_URBAN_API_TOKEN:token},
   {from:origin,to:destination});
 assert.equal(invalid.status,'invalid_vpc_binding');
});
