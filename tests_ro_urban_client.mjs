import assert from 'node:assert/strict';
import {test} from 'node:test';
import {romanianUrbanRegion,planRomanianUrbanViaOracle} from './ro_urban_client.mjs';
import worker from './backend.js';
import {webcrypto} from 'node:crypto';
globalThis.crypto??=webcrypto;
const o={latitude:47.05,longitude:21.92},d={latitude:47.054,longitude:21.925};
const token='0123456789abcdef0123456789abcdef0123456789abcdef';
const trip={provider:'Romania GTFS static',scheduled:true,real_time:false,
 legs:[{mode:'tram',from:'Piața Unirii',to:'Gara Oradea',departureTime:'2026-11-12T08:15:00Z',arrivalTime:'2026-11-12T08:25:00Z',lineNames:['1']}],
 startDateTime:'2026-11-12T08:15:00Z',arrivalDateTime:'2026-11-12T08:25:00Z',
 fareLocal:null,geometryAvailable:false,walkingAccessVerified:false,walkingEgressVerified:false};
test('region matching never sends UK/Germany coordinates to Romanian planner',()=>{
 assert.equal(romanianUrbanRegion(o,d),'oradea');
 assert.equal(romanianUrbanRegion({latitude:51.5,longitude:-0.12},d),null);
 assert.equal(romanianUrbanRegion(o,{latitude:46.77,longitude:23.62}),null);
 assert.equal(romanianUrbanRegion({latitude:null,longitude:21},d),null);
});
test('Cloudflare adapter uses HTTPS, bearer token and Bucharest date',async()=>{
 let url,options;
 const answer=await planRomanianUrbanViaOracle({RO_URBAN_API_URL:'https://private.example/',
  RO_URBAN_API_TOKEN:token},{from:o,to:d,departureAt:'2026-11-12T08:00:00Z'},
 {fetchImpl:async(u,opts)=>{url=u;options=opts;return Response.json({status:'success',journeys:[trip]})}});
 assert.equal(answer.status,'ok');
 assert.equal(answer.journeys.length,1);
 assert.equal(url,'https://private.example/v1/plan');
 assert.equal(options.headers.Authorization,'Bearer '+token);
 const payload=JSON.parse(options.body);
 assert.equal(payload.region,'oradea');
 assert.equal(payload.date,'2026-11-12');
 assert.equal(payload.afterHHMM,'10:00');
 assert.equal(payload.from.latitude,47.05);
});
test('missing tunnel/token and HTTP endpoint fail safely',async()=>{
 assert.equal((await planRomanianUrbanViaOracle({}, {from:o,to:d})).status,'not_configured');
 assert.equal((await planRomanianUrbanViaOracle({RO_URBAN_API_URL:'http://unsafe.example',RO_URBAN_API_TOKEN:token},{from:o,to:d})).status,'invalid_endpoint_config');
});
test('reject malformed schedules, no made-up result on server outage',async()=>{
 const env={RO_URBAN_API_URL:'https://private.example/',RO_URBAN_API_TOKEN:token};
 const ans=await planRomanianUrbanViaOracle(env,{from:o,to:d},{
  fetchImpl:async()=>Response.json({status:'success',journeys:[{...trip,legs:[{...trip.legs[0],departureTime:'invalid'}]}]})});
 assert.equal(ans.status,'success');
 assert.deepEqual(ans.journeys,[]);
 const down=await planRomanianUrbanViaOracle(env,{from:o,to:d},{
  fetchImpl:async()=>{throw Error('network down')}});
 assert.equal(down.status,'network_error');
});
test('Worker selects Romanian urban rather than Bilo or TfL for explicit A-to-B coordinates',async()=>{
 const originalFetch=globalThis.fetch;
 const calls=[];
 globalThis.fetch=async(url,opts)=>{
  calls.push(String(url));
  assert.equal(new URL(url).hostname,'private.example');
  return Response.json({status:'success',journeys:[trip]});
 };
 const body={
  message:'Transport mixt din Piața Unirii spre Gara Oradea',
  language:'ro',history:[],module:'maps',mixed_journey:true,
  journey_origin:{...o,city:'Oradea',country_code:'RO'},
  transit_destination:{...d,city:'Oradea',country_code:'RO'},
  location:{latitude:51.50,longitude:-0.11,updatedAt:Date.now()},
  transit_departure_at:new Date(Date.now()+86400000).toISOString()
 };
 try{
  const response=await worker.fetch(new Request('https://unit.test/api/chat',{
   method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)
  }),{RO_URBAN_API_URL:'https://private.example/',RO_URBAN_API_TOKEN:token,
    AI:{run:async()=>({response:'mock'})}});
  const data=await response.json();
  assert.equal(data.transit_provider,'Romania GTFS static',JSON.stringify(data).slice(0,500));
  assert.equal(data.romanian_urban_journey,true);
  assert.equal(data.transit_available,true);
  assert.equal(data.transit[0].legs[0].mode,'tram');
  assert.deepEqual(calls,['https://private.example/v1/plan']);
 }finally{globalThis.fetch=originalFetch}
});
test('Secure adapter accepts documented lines only, never fabricates departures',async()=>{
 const line={provider:'GTFS operator route topology',source:'GTFS route and stop sequence',
  source_type:'licensed_gtfs_topology',route_only:true,scheduled:false,
  schedule_status:'unavailable',startDateTime:null,arrivalDateTime:null,
  legs:[{mode:'tram',lineNames:['1'],from:'Centru',to:'Gară',fromStopId:'A',toStopId:'B',
    departureTime:null,arrivalTime:null}]};
 const env={RO_URBAN_API_URL:'https://private.example/',RO_URBAN_API_TOKEN:token};
 const get=j=>planRomanianUrbanViaOracle(env,{from:o,to:d},{
  fetchImpl:async()=>Response.json({status:'route_only',journeys:[j]})});
 assert.equal((await get(line)).status,'route_only');
 const invalid=await get({...line,legs:[{...line.legs[0],lineNames:[]}]});
 assert.equal(invalid.status,'invalid_route_only');
 assert.deepEqual(invalid.journeys,[]);
});

test('Worker adapter distinguishes planner overload from missing transit coverage',async()=>{
 const env={RO_URBAN_API_URL:'https://private.example/',RO_URBAN_API_TOKEN:token};
 for(const status of ['planner_busy','planner_unavailable']){
  const answer=await planRomanianUrbanViaOracle(env,{from:o,to:d},{
   fetchImpl:async()=>Response.json({status,journeys:[]},{status:503})});
  assert.equal(answer.status,status);
  assert.deepEqual(answer.journeys,[]);
 }
 const noFeed=await planRomanianUrbanViaOracle(env,{from:o,to:d},{
  fetchImpl:async()=>Response.json({status:'feed_not_loaded',journeys:[]},{status:503})});
 assert.equal(noFeed.status,'feed_not_loaded');
});

test('Cloudflare Access machine identity is included only as a complete pair',async()=>{
 const env={RO_URBAN_API_URL:'https://private.example/',RO_URBAN_API_TOKEN:token,
   RO_URBAN_ACCESS_CLIENT_ID:'id.cf-access',
   RO_URBAN_ACCESS_CLIENT_SECRET:'a-service-secret'};
 let headers=null;
 const ans=await planRomanianUrbanViaOracle(env,{from:o,to:d},{
   fetchImpl:async(url,opts)=>{headers=opts.headers;return Response.json({status:'success',journeys:[trip]})}});
 assert.equal(ans.status,'ok');
 assert.equal(headers['CF-Access-Client-Id'],env.RO_URBAN_ACCESS_CLIENT_ID);
 assert.equal(headers['CF-Access-Client-Secret'],env.RO_URBAN_ACCESS_CLIENT_SECRET);
 const invalid=await planRomanianUrbanViaOracle({...env,RO_URBAN_ACCESS_CLIENT_SECRET:''},
   {from:o,to:d},{fetchImpl:async()=>{throw Error('must not fetch')}});
 assert.equal(invalid.status,'invalid_access_config');
 const basic=await planRomanianUrbanViaOracle({
   RO_URBAN_API_URL:'https://private.example/',RO_URBAN_API_TOKEN:token},
   {from:o,to:d},{fetchImpl:async(url,opts)=>{
     assert.equal('CF-Access-Client-Secret' in opts.headers,false);
     return Response.json({status:'success',journeys:[trip]});}});
 assert.equal(basic.status,'ok');
});

test('Workers VPC preferred: no domain or public hostname, private bound fetch and existing origin bearer',async()=>{
 let called=0;
 const bound={fetch:async(url,opts)=>{
   called++;
   assert.equal(url,'http://localhost/v1/plan');
   assert.equal(opts.headers.Authorization,'Bearer '+token);
   assert.equal(opts.headers['CF-Access-Client-Id'],undefined);
   assert.equal(JSON.parse(opts.body).region,'oradea');
   return Response.json({status:'success',journeys:[trip]});
 }};
 const answer=await planRomanianUrbanViaOracle({
   RO_URBAN_VPC:bound,RO_URBAN_API_TOKEN:token,
   // Even a stale public URL must NOT override private routing.
   RO_URBAN_API_URL:'https://obsolete.example/'
 },{from:o,to:d,departureAt:'2026-11-12T08:00:00Z'},
 {fetchImpl:()=>{throw Error('public fetch must never run')}});
 assert.equal(answer.status,'ok');
 assert.equal(answer.journeys.length,1);
 assert.equal(called,1);
 const missing=await planRomanianUrbanViaOracle({RO_URBAN_VPC:{},RO_URBAN_API_TOKEN:token},
   {from:o,to:d});
 assert.equal(missing.status,'invalid_vpc_binding');
 const missingToken=await planRomanianUrbanViaOracle({RO_URBAN_VPC:bound},{from:o,to:d});
 assert.equal(missingToken.status,'not_configured');
 assert.equal(called,1);
});

test('Eva /api/chat uses Romania VPC-only transport without a public API URL',async()=>{
 let calls=0;
 const vpc={fetch:async(url,opts)=>{
   calls++;
   assert.equal(url,'http://localhost/v1/plan');
   assert.equal(opts.headers.Authorization,'Bearer '+token);
   assert.equal(JSON.parse(opts.body).region,'oradea');
   return Response.json({status:'success',journeys:[trip]});
 }};
 const body={
   message:'Transport mixt din Piața Unirii spre Gara Oradea',
   language:'ro',history:[],module:'maps',mixed_journey:true,
   journey_origin:{...o,city:'Oradea',country_code:'RO'},
   transit_destination:{...d,city:'Oradea',country_code:'RO'},
   location:{latitude:51.50,longitude:-0.11,updatedAt:Date.now()},
   transit_departure_at:new Date(Date.now()+86400000).toISOString()
 };
 const response=await worker.fetch(new Request('https://unit.test/api/chat',{
   method:'POST',headers:{'content-type':'application/json'},
   body:JSON.stringify(body)
 }),{RO_URBAN_VPC:vpc,RO_URBAN_API_TOKEN:token,AI:{run:async()=>({response:'test'})}});
 const result=await response.json();
 assert.equal(response.status,200);
 assert.equal(calls,1,'The VPC Service must be called, not public fetch or Bilo');
 assert.equal(result.romanian_urban_journey,true,JSON.stringify(result).slice(0,400));
 assert.equal(result.transit_available,true);
 assert.equal(result.transit[0].legs[0].mode,'tram');
 assert.ok(!JSON.stringify(result).includes(token),'Never send credential to app');
});
