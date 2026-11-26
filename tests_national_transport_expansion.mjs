import assert from 'node:assert/strict';
import {test} from 'node:test';
import {mkdtempSync,writeFileSync,rmSync,mkdirSync,readFileSync} from 'node:fs';
import {join} from 'node:path';
import {EUROPE_COUNTRIES} from './europe_country_sources.mjs';
import {NATIONAL_TRANSPORT_COUNTRIES,configuredNationalTransportProviders,nationalTransportCoverage} from './national_transport_registry.mjs';
import {romanianUrbanRegion,planRomanianUrbanViaOracle} from './ro_urban_client.mjs';
import {createRomanianGtfsDispatcher} from './romanian_gtfs_dispatch.mjs';
import {ROMANIA_REGION_CODES} from './regional_gtfs_registry.mjs';
import {loadRomanianFeeds,REGIONS,createRomanianUrbanServer} from './ro_urban_server.mjs';
import worker from './backend.js';
const token='0123456789abcdef0123456789abcdef0123456789abcdef';
const from={latitude:45.75,longitude:21.23},to={latitude:45.78,longitude:21.25};
const sample=(a=from,b=to,line='1',type='3')=>({
 stops:[{stop_id:'A',stop_name:'Start',stop_lat:String(a.latitude),stop_lon:String(a.longitude)},
  {stop_id:'B',stop_name:'Final',stop_lat:String(b.latitude),stop_lon:String(b.longitude)}],
 routes:[{route_id:'1',route_short_name:line,route_type:type}],
 trips:[{trip_id:'1',route_id:'1',service_id:'S'}],
 stop_times:[{trip_id:'1',stop_id:'A',stop_sequence:'1',arrival_time:'10:00:00',departure_time:'10:00:00'},
  {trip_id:'1',stop_id:'B',stop_sequence:'2',arrival_time:'10:10:00',departure_time:'10:10:00'}],
 calendar_dates:[{service_id:'S',date:'20261127',exception_type:'1'}]
});
const body={region:'romania',from,to,date:'2026-11-27',afterHHMM:'09:50',maxStraightLineMeters:150};

test('Every European country has a separate honest domestic profile, not a fake adapter',()=>{
 assert.equal(Object.keys(NATIONAL_TRANSPORT_COUNTRIES).length,49);
 for(const country of EUROPE_COUNTRIES){
  const profile=NATIONAL_TRANSPORT_COUNTRIES[country],coverage=nationalTransportCoverage(country,['ro_urban_gtfs','tfl']);
  assert.equal(profile.country,country);assert.equal(profile.domesticOnly,true);assert.equal(profile.gpsCountryRequired,true);
  assert.equal(coverage.countrywide_coverage_verified,false);
  if(!['RO','GB'].includes(country)){
   assert.deepEqual(coverage.configured_adapters,[]);assert.equal(coverage.coverage_status,'not_connected');
  }
 }
 assert.equal(nationalTransportCoverage('US'),null);
 assert.equal(nationalTransportCoverage('DE').integration_status,'implemented_adapters');
 assert.ok(nationalTransportCoverage('DE').source_catalog.length);
});
test('Configured readiness validates private endpoint, token and binding; country coverage stays separate',()=>{
 assert.deepEqual(configuredNationalTransportProviders({TFL_PUBLIC_FALLBACK:'false'}),[]);
 for(const url of ['http://unsafe.example','https://user:pass@private.example/','https://private.example/?key=x','not a URL']){
  assert.ok(!configuredNationalTransportProviders({RO_URBAN_API_URL:url,RO_URBAN_API_TOKEN:token}).includes('ro_urban_gtfs'));
 }
 assert.ok(!configuredNationalTransportProviders({RO_URBAN_VPC:{},RO_URBAN_API_URL:'https://private.example/',RO_URBAN_API_TOKEN:token}).includes('ro_urban_gtfs'));
 const enabled=configuredNationalTransportProviders({RO_URBAN_VPC:{fetch(){}},RO_URBAN_API_TOKEN:token,BILO_API_KEY:'test'});
 const c=nationalTransportCoverage('ro',enabled);
 assert.equal(c.urban_configured,true);assert.equal(c.intercity_configured,true);assert.equal(c.countrywide_coverage_verified,false);
});
test('Country-verified local trips dispatch beyond four cities without a county picker',()=>{
 for(const a of [from,{latitude:45.65,longitude:25.60},{latitude:44.18,longitude:28.64},{latitude:47.65,longitude:26.25}]){
  const b={latitude:a.latitude+.02,longitude:a.longitude+.02};
  assert.equal(romanianUrbanRegion(a,b),null);
  assert.equal(romanianUrbanRegion(a,b,{verifiedCountry:'RO'}),'romania');
  assert.equal(romanianUrbanRegion({...a,country_code:'RO'},{...b,country_code:'RO'}),'romania');
 }
 assert.equal(romanianUrbanRegion({latitude:47.05,longitude:21.92},{latitude:47.06,longitude:21.93},{verifiedCountry:'RO'}),'romania');
 assert.equal(romanianUrbanRegion(from,{latitude:44.43,longitude:26.1},{verifiedCountry:'RO'}),null,'Intercity remains intercity');
 assert.equal(romanianUrbanRegion({...from,country_code:'HU'},to,{verifiedCountry:'RO'}),null);
 assert.equal(romanianUrbanRegion(from,to,{verifiedCountry:'HU'}),null);
});
test('County and aggregate feed slots load with a cumulative memory budget; unsafe filenames ignored',()=>{
 mkdirSync('.bundle-check',{recursive:true});const dir=mkdtempSync('.bundle-check/ro-feeds-');
 try{
  const json=JSON.stringify(sample());
  for(const name of ['ro-tm','romania','unrecognized'])writeFileSync(join(dir,name+'.json'),json);
  assert.equal(ROMANIA_REGION_CODES.length,42);assert.equal(REGIONS.length,47);
  assert.deepEqual(Object.keys(loadRomanianFeeds(dir)).sort(),['ro-tm','romania']);
  assert.equal(Object.keys(loadRomanianFeeds(dir,{maxTotalBytes:Buffer.byteLength(json)})).length,1);
  assert.deepEqual(loadRomanianFeeds(dir,{maxTotalBytes:0}),{});
  writeFileSync(join(dir,'ro-tm.json'),'{invalid');
  assert.deepEqual(Object.keys(loadRomanianFeeds(dir)),['romania']);
 }finally{rmSync(dir,{recursive:true,force:true});}
});
test('Automatic dispatch selects nearby actual stops, retains schedules and bus options, never claims countrywide coverage',()=>{
 const dispatch=createRomanianGtfsDispatcher({'ro-tm':sample(),bucharest:sample({latitude:44.43,longitude:26.1},{latitude:44.46,longitude:26.1})});
 const result=dispatch(body);
 assert.equal(result.status,'success');assert.equal(result.journeys.length,1);
 assert.equal(result.journeys[0].feed_region,'ro-tm');assert.deepEqual(result.selected_regions,['ro-tm']);
 assert.equal(result.journeys[0].legs[0].mode,'bus');assert.equal(result.journeys[0].real_time,false);
 assert.equal(result.journeys[0].walkingAccessVerified,false);assert.equal(result.coverage_verified,false);
 assert.equal(dispatch({...body,region:'ro-tm'}).status,'success');
 assert.equal(dispatch({...body,from:{latitude:45.5,longitude:21.2}}).status,'no_nearby_gtfs_stop');
 assert.equal(dispatch({...body,region:'../secrets'}).httpStatus,400);
 assert.equal(dispatch({...body,from:{latitude:null,longitude:21}}).httpStatus,400);
 assert.equal(dispatch({...body,date:'invalid'}).status,'invalid_date');
 const many=createRomanianGtfsDispatcher({oradea:sample(from,to,'T1','0'),cluj:sample(from,to,'T2','0'),'ro-tm':sample()})({...body,maxResults:2});
 assert.equal(many.journeys.length,2);assert.ok(many.journeys.some(j=>j.legs.every(l=>l.mode==='bus')));
});
test('No imported feed, no near stops or disconnected feeds never becomes a fabricated route',()=>{
 assert.equal(createRomanianGtfsDispatcher() (body).httpStatus,503);
 const mid={latitude:45.765,longitude:21.24};
 const split=createRomanianGtfsDispatcher({'ro-tm':sample(from,mid),'ro-ar':sample(mid,to)})(body);
 assert.deepEqual(split.journeys,[]);assert.equal(split.coverage_reason,'no_single_imported_feed_covers_endpoints');
 const untimed={...sample(),calendar_dates:[],stop_times:sample().stop_times.map(({arrival_time,departure_time,...r})=>r)};
 const line=createRomanianGtfsDispatcher({'ro-tm':untimed})(body);
 assert.equal(line.status,'route_only');assert.equal(line.service_today_verified,false);
 assert.equal(line.journeys[0].legs[0].departureTime,null);
});
test('Secure client and HTTP server handle automatic Romania dispatch end to end',async()=>{
 const server=createRomanianUrbanServer({token,feeds:{'ro-tm':sample()}});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 try{
  const answer=await planRomanianUrbanViaOracle({RO_URBAN_API_TOKEN:token,RO_URBAN_VPC:{fetch:async(_,opts)=>{
   const request=JSON.parse(opts.body);assert.equal(request.region,'romania');
   return fetch('http://127.0.0.1:'+server.address().port+'/v1/plan',opts);
  }}},{from,to,verifiedCountry:'RO',departureAt:'2026-11-27T07:50:00Z'});
  assert.equal(answer.status,'ok');assert.equal(answer.journeys[0].legs[0].mode,'bus');
 }finally{await new Promise(resolve=>server.close(resolve));}
});
test('Worker uses verified GPS country, blocks transborder and never falls back to Bilo for unserved local trips',async()=>{
 const original=globalThis.fetch;let country='ro',destinationCountry='ro',urbanCalls=0,planned;
 globalThis.fetch=async input=>{
  const u=new URL(input);assert.equal(u.hostname,'api.geoapify.com','No unrelated supplier/AI requests');
  return Response.json({features:[{properties:{country_code:u.searchParams.get('lat')===String(to.latitude)?destinationCountry:country}}]});
 };
 const env={AI:{run:async()=>{throw Error('AI must not plan transport');}},GEOAPIFY_API_KEY:'test',BILO_API_KEY:'test',RO_URBAN_API_TOKEN:token,
  RO_URBAN_VPC:{fetch:async(_,opts)=>{urbanCalls++;planned=JSON.parse(opts.body);return Response.json({status:'no_nearby_gtfs_stop',journeys:[]});}}};
 const call=async data=>(await worker.fetch(new Request('https://unit.test/api/chat',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(data)}),env)).json();
 const query={message:'Transport public spre Final',module:'maps',language:'ro',national_public_transport:true,mixed_journey:true,
  location:{...from,updatedAt:Date.now()},journey_origin:{latitude:44.43,longitude:26.1},transit_destination:{...to,label:'Final',country_code:'GB'},
  transit_departure_at:'2026-11-27T07:50:00Z'};
 try{
  const coverage=await call({national_transit_country:{location:from}});
  assert.equal(coverage.country_code,'RO');assert.equal(coverage.supported,true);
  assert.equal(coverage.provider_coverage.countrywide_coverage_verified,false);
  const result=await call(query);
  assert.equal(urbanCalls,1,JSON.stringify(result));assert.equal(planned.region,'romania');assert.deepEqual(planned.from,from,'GPS overrides any stale mixed-route origin');
  assert.equal(result.transit_available,false);assert.equal(result.provider_status.ro_urban,'no_nearby_gtfs_stop');
  destinationCountry='hu';const blocked=await call(query);
  assert.equal(blocked.reason,'international_destination');assert.equal(urbanCalls,1);
  country='de';const de=await call({national_transit_country:{location:from}});
  assert.equal(de.country_code,'DE');assert.equal(de.supported,false);assert.equal(de.provider_coverage.coverage_status,'not_connected');
  let intercitySearch;
  globalThis.fetch=async(input,opts)=>{
   const u=new URL(input);
   if(u.hostname==='api.geoapify.com')return Response.json({features:[{properties:{country_code:'ro',city:'Timișoara'}}]});
   assert.equal(u.hostname,'mcp.bilo.ro');assert.equal(u.pathname,'/api/v1/search');
   intercitySearch=JSON.parse(opts.body);return Response.json({error:'synthetic unauthorized'},{status:401});
  };
  const intercity=await call({...query,message:'Transport public din București spre Brașov',
   transit_destination:{latitude:46.77,longitude:23.62,city:'Cluj-Napoca',label:'Gara Cluj-Napoca',country_code:'RO'}});
  assert.equal(urbanCalls,1,'Domestic intercity must not use the local router');
  assert.equal(intercitySearch.origin,'Timișoara','National intercity starts at GPS locality, not a text/stale mixed origin');
  assert.equal(intercitySearch.destination,'Cluj-Napoca','Verified selected destination wins over contradictory free text');
  assert.equal(intercity.transit_available,false);

 }finally{globalThis.fetch=original;}
});
test('Oracle image packages the full local import closure',()=>{
 const docker=readFileSync('oracle-romania-transport/Dockerfile','utf8');
 const copy=docker.split('\n').find(l=>l.startsWith('COPY '));
 const pending=['ro_urban_server.mjs'],seen=new Set();
 while(pending.length){const f=pending.pop();if(seen.has(f))continue;seen.add(f);assert.ok(copy.includes(f),f+' missing from image');
  for(const m of readFileSync(f,'utf8').matchAll(/from ['"]\.\/([^'"]+)['"]/g))pending.push(m[1]);
 }
});
