import assert from 'node:assert/strict';
import {test} from 'node:test';
import {europeSlimConfigured,europeSlimCountryEnabled,planEuropeSlimNational,fetchEuropeSlimMotis} from './europe_slim_client.mjs';
const token='0123456789abcdef0123456789abcdef';
const point=(latitude,longitude)=>({latitude,longitude});
const from=point(51.475,0.32),to=point(51.485,0.33);
const date='2026-11-18T10:00:00Z';
const leg=(start,end)=>({from:'A',to:'B',departureTime:start,arrivalTime:end,mode:'bus',lineNames:['100']});
const scheduled={scheduled:true,real_time:false,startDateTime:'2026-11-18T10:05:00Z',
 arrivalDateTime:'2026-11-18T10:30:00Z',
 legs:[leg('2026-11-18T10:05:00Z','2026-11-18T10:30:00Z')]};
const wrapped={status:'success',country:'GB',
 providers:[{source:'gb-oracle-urban',status:'success',journeys:[scheduled]}]};
test('Europa Slim is disabled until an authorized binding and token are configured',()=>{
 assert.equal(europeSlimConfigured({}),false);
 assert.equal(europeSlimConfigured({EUROPE_SLIM_API_URL:'https://api.transitous.org/',EUROPE_SLIM_API_TOKEN:token}),false);
 assert.equal(europeSlimConfigured({EUROPE_SLIM_API_URL:'http://example.com/',EUROPE_SLIM_API_TOKEN:token}),false);
 assert.equal(europeSlimConfigured({EUROPE_SLIM_API_URL:'https://europe.example/',EUROPE_SLIM_API_TOKEN:token}),true);
 assert.equal(europeSlimCountryEnabled({EUROPE_SLIM_API_URL:'https://europe.example/',EUROPE_SLIM_API_TOKEN:token},'FR'),false);
 assert.equal(europeSlimCountryEnabled({EUROPE_SLIM_API_URL:'https://europe.example/',EUROPE_SLIM_API_TOKEN:token,
  EUROPE_SLIM_NATIONAL_COUNTRIES:'FR,DE'},'FR'),true);
});
test('VPC national route requests are authenticated and preserve exact calendar departure',async()=>{
 let checked=false;
 const env={EUROPE_SLIM_API_TOKEN:token,EUROPE_SLIM_VPC:{
  fetch:async(url,init)=>{
   assert.equal(url,'http://europe.pocketai.internal/v1/national-plan');
   assert.equal(init.headers.Authorization,'Bearer '+token);
   assert.equal(init.redirect,'error');
   const body=JSON.parse(init.body);
   assert.equal(body.departureAt,date);
   assert.equal(body.country,'GB');
   checked=true;
   return Response.json(wrapped);
  }
 }};
 const answer=await planEuropeSlimNational(env,{country:'GB',from,to,departureAt:date,limit:3});
 assert.equal(checked,true);
 assert.equal(answer.status,'success');
 assert.equal(answer.journeys.length,1);
 assert.deepEqual(answer.sources,['gb-oracle-urban']);
});
test('country mismatch and unverified GTFS routes are never presented as journeys',async()=>{
 const env={EUROPE_SLIM_API_URL:'https://licensed-europe.example/',EUROPE_SLIM_API_TOKEN:token};
 const options={country:'GB',from,to,departureAt:date};
 const lookup=async(_url,_options)=>Response.json({...wrapped,country:'RO'});
 assert.equal((await planEuropeSlimNational(env,options,{fetchImpl:lookup})).status,'invalid_country_response');
 const onlyLine=async()=>Response.json({status:'route_only',country:'GB',providers:[{
  status:'route_only',source:'gb-oracle-urban',lines:[{line:'100'}]}]});
 assert.equal((await planEuropeSlimNational(env,options,{fetchImpl:onlyLine})).journeys.length,0);
 const malformed=async()=>Response.json({...wrapped,providers:[{status:'success',source:'gb-oracle-urban',
  journeys:[{...scheduled,legs:[leg('2026-11-18T10:30:00Z','2026-11-18T10:05:00Z')]}]}]});
 assert.equal((await planEuropeSlimNational(env,options,{fetchImpl:malformed})).journeys.length,0);
 const inaccurate=async()=>Response.json({...wrapped,providers:[{status:'success',source:'gb-oracle-urban',
  journeys:[{...scheduled,scheduled:false}]}]});
 assert.equal((await planEuropeSlimNational(env,options,{fetchImpl:inaccurate})).journeys.length,0);
});
test('international MOTIS response refuses missing or unlicensed suppliers',async()=>{
 const env={EUROPE_SLIM_API_URL:'https://licensed-europe.example/',EUROPE_SLIM_API_TOKEN:token};
 const params=new URLSearchParams({fromPlace:'51.47,0.3',toPlace:'47.04,21.9',time:date});
 const none=await fetchEuropeSlimMotis(env,params,{fetchImpl:async()=>Response.json({error:'no_licensed_provider_for_corridor'}, {status:503})});
 assert.equal(none.status,'upstream_unavailable');
 const licensed=await fetchEuropeSlimMotis(env,params,{fetchImpl:async(url,init)=>{
  assert.equal(new URL(url).pathname,'/api/v6/plan');
  assert.equal(new URL(url).searchParams.get('time'),date);
  assert.equal(init.headers.Authorization,'Bearer '+token);
  return Response.json({itineraries:[]});
 }});
 assert.equal(licensed.status,'success');
 assert.deepEqual(licensed.data.itineraries,[]);
});
