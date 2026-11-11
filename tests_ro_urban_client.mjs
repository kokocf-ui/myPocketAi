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