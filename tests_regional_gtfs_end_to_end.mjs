import assert from 'node:assert/strict';
import {test} from 'node:test';
import {mkdtempSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {ROMANIA_REGION_CODES,ROMANIA_GTFS_REGIONS,ENGLAND_GTFS_REGIONS} from './regional_gtfs_registry.mjs';
import {createGtfsFeedIndex,openGtfsFeedCatalog} from './regional_gtfs_catalog.mjs';
import {createRomanianUrbanServer} from './ro_urban_server.mjs';
import {romanianUrbanRegion,planRomanianUrbanViaOracle} from './ro_urban_client.mjs';
import {englandLocalGtfsRegion,planEnglandLocalGtfs} from './en_urban_client.mjs';
const key='a'.repeat(48);
const roA={latitude:45.748,longitude:21.227},roB={latitude:45.755,longitude:21.235};
const enA={latitude:52.487,longitude:-1.891},enB={latitude:52.493,longitude:-1.884};
const sample=(a,b,date,routeType='3')=>({
 stops:[
  {stop_id:'S1',stop_name:'First Stop',stop_lat:String(a.latitude),stop_lon:String(a.longitude)},
  {stop_id:'S2',stop_name:'Second Stop',stop_lat:String(b.latitude),stop_lon:String(b.longitude)}],
 routes:[{route_id:'L1',route_short_name:'10',route_type:routeType}],
 trips:[{trip_id:'T1',route_id:'L1',service_id:'D1'}],
 stop_times:[
  {trip_id:'T1',stop_id:'S1',stop_sequence:'1',arrival_time:'10:00:00',departure_time:'10:00:00'},
  {trip_id:'T1',stop_id:'S2',stop_sequence:'2',arrival_time:'10:12:00',departure_time:'10:12:00'}],
 calendar:[],calendar_dates:[{service_id:'D1',date:date.replaceAll('-',''),exception_type:'1'}]
});
const ask=async(server,body,token=key)=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 try{
  const response=await fetch('http://127.0.0.1:'+server.address().port+'/v1/plan',{
   method:'POST',headers:{'content-type':'application/json',Authorization:'Bearer '+token},
   body:JSON.stringify(body)});
  return {http:response.status,...await response.json()};
 }finally{await new Promise(resolve=>server.close(resolve));}
};
test('Registry contains 41 Romanian counties plus Bucharest, nine English regional slots',()=>{
 assert.equal(ROMANIA_REGION_CODES.length,42);
 assert.equal(new Set(ROMANIA_REGION_CODES).size,42);
 assert.ok(ROMANIA_REGION_CODES.includes('BH'));
 assert.ok(ROMANIA_REGION_CODES.includes('AB'));
 assert.ok(ROMANIA_REGION_CODES.includes('B'));
 assert.ok(ROMANIA_GTFS_REGIONS.includes('ro-vs'));
 assert.equal(ENGLAND_GTFS_REGIONS.length,9);
});
test('RO beyond initial four cities chooses country-backed regional GTFS query',()=>{
 assert.equal(romanianUrbanRegion(roA,roB),'romania');
 assert.equal(romanianUrbanRegion({latitude:51.5,longitude:-0.1},roB),null);
 assert.equal(englandLocalGtfsRegion(enA,enB),'england');
 assert.equal(englandLocalGtfsRegion(roA,roB),null);
});
test('Private server serves new Romanian county feed only when local stops exist',async()=>{
 const feeds={'ro-tm':sample(roA,roB,'2026-11-17')};
 const result=await ask(createRomanianUrbanServer({token:key,feeds}),{
  region:'romania',from:roA,to:roB,date:'2026-11-17',afterHHMM:'09:40'});
 assert.equal(result.http,200,JSON.stringify(result));
 assert.equal(result.status,'success');
 assert.equal(result.journeys[0].time_zone,'Europe/Bucharest');
 assert.equal(result.journeys[0].legs[0].mode,'bus');
 const missing=await ask(createRomanianUrbanServer({token:key,feeds}),{
  region:'romania',from:{latitude:46.77,longitude:23.62},to:{latitude:46.79,longitude:23.66},
  date:'2026-11-17',afterHHMM:'09:40'});
 assert.equal(missing.http,503);
 assert.equal(missing.status,'no_nearby_gtfs_stop');
});
test('England regional feed operates in Europe/London and accepts winter GMT',async()=>{
 const result=await ask(createRomanianUrbanServer({
  token:key,country:'GB',feeds:{'en-wm':sample(enA,enB,'2026-11-17')}
 }),{region:'england',from:enA,to:enB,date:'2026-11-17',afterHHMM:'09:40'});
 assert.equal(result.http,200,JSON.stringify(result));
 assert.equal(result.status,'success');
 assert.equal(result.journeys[0].time_zone,'Europe/London');
 assert.equal(result.journeys[0].legs[0].departureTime,'2026-11-17T10:00:00.000Z');
});
test('A private snapshot must have a current matching coordinate index',()=>{
 const dir=mkdtempSync(join(tmpdir(),'pocket-gtfs-'));
 try{
  const file=join(dir,'ro-tm.json');
  writeFileSync(file,JSON.stringify(sample(roA,roB,'2026-11-17')));
  assert.equal(openGtfsFeedCatalog(dir).count,0);
  assert.equal(createGtfsFeedIndex(dir,'ro-tm','RO').region,'ro-tm');
  const catalog=openGtfsFeedCatalog(dir);
  assert.equal(catalog.count,1);
  assert.equal(catalog.match(roA,roB).length,1);
  assert.equal(catalog.match(enA,enB).length,0);
  assert.ok(catalog.match(roA,roB)[0].load().trips.length>0);
  writeFileSync(file,JSON.stringify(sample(roA,roB,'2026-11-18')));
  assert.equal(openGtfsFeedCatalog(dir).count,0,'Updating data requires explicit reindex');
 }finally{rmSync(dir,{recursive:true,force:true});}
});
test('English adapter sends authenticated, localised departure request only',async()=>{
 let target,body,headers;
 const reply={status:'success',journeys:[{
  provider:'England GTFS static',scheduled:true,real_time:false,legs:[
    {mode:'bus',from:'First Stop',to:'Second Stop',departureTime:'2026-11-17T10:00:00Z',
     arrivalTime:'2026-11-17T10:12:00Z'}]
 }]};
 const result=await planEnglandLocalGtfs({
  EN_URBAN_API_URL:'https://private.example/',EN_URBAN_API_TOKEN:key
 },{from:enA,to:enB,departureAt:'2026-11-17T09:45:00Z'},{
  fetchImpl:async(url,opts)=>{target=url;body=JSON.parse(opts.body);
   headers=opts.headers;return Response.json(reply);}
 });
 assert.equal(result.status,'ok');
 assert.equal(target,'https://private.example/v1/plan');
 assert.equal(headers.Authorization,'Bearer '+key);
 assert.equal(body.region,'england');
 assert.equal(body.date,'2026-11-17');
 assert.equal(body.afterHHMM,'09:45');
 assert.equal((await planEnglandLocalGtfs({}, {from:enA,to:enB})).status,'not_configured');
});
