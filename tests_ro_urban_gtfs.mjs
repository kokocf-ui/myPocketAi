import assert from 'node:assert/strict';
import {test} from 'node:test';
import {planRomanianUrbanGtfs as plan} from './ro_urban_gtfs.mjs';
import {parseGtfsCsv} from './ro_urban_gtfs_import.mjs';
const pt=(latitude,longitude)=>({latitude,longitude});
const feed={
 stops:[
  {stop_id:'A',stop_name:'Piața Unirii',stop_lat:'47.0500',stop_lon:'21.9200'},
  {stop_id:'B',stop_name:'Gara Oradea',stop_lat:'47.0540',stop_lon:'21.9200'},
  {stop_id:'C',stop_name:'Universitate',stop_lat:'47.0590',stop_lon:'21.9200'}],
 routes:[{route_id:'T1',route_short_name:'1',route_type:'0',agency_id:'OTL'},{route_id:'B12',route_short_name:'12',route_type:'3',agency_id:'OTL'}],
 trips:[{trip_id:'tram1',route_id:'T1',service_id:'WEEK'},{trip_id:'bus12',route_id:'B12',service_id:'WEEK'},{trip_id:'night',route_id:'T1',service_id:'NIGHT'}],
 stop_times:[
  {trip_id:'tram1',stop_id:'A',stop_sequence:'1',arrival_time:'10:10:00',departure_time:'10:10:00'},
  {trip_id:'tram1',stop_id:'B',stop_sequence:'2',arrival_time:'10:18:00',departure_time:'10:19:00'},
  {trip_id:'bus12',stop_id:'B',stop_sequence:'1',arrival_time:'10:24:00',departure_time:'10:24:00'},
  {trip_id:'bus12',stop_id:'C',stop_sequence:'2',arrival_time:'10:37:00',departure_time:'10:37:00'},
  {trip_id:'night',stop_id:'A',stop_sequence:'1',arrival_time:'25:10:00',departure_time:'25:10:00'},
  {trip_id:'night',stop_id:'C',stop_sequence:'2',arrival_time:'25:35:00',departure_time:'25:35:00'}],
 calendar:[{service_id:'WEEK',monday:'1',tuesday:'1',wednesday:'1',thursday:'1',friday:'1',saturday:'0',sunday:'0',start_date:'20261101',end_date:'20261231'}],
 calendar_dates:[{service_id:'NIGHT',date:'20261112',exception_type:'1'}]
};
const a=pt(47.05,21.92),b=pt(47.054,21.92),c=pt(47.059,21.92);
test('direct tram: exact operator timetable; no fabricated fare, route or pedestrian walk',()=>{
 const r=plan(feed,a,b,{date:'2026-11-12',afterHHMM:'10:00',maxStraightLineMeters:150});
 assert.equal(r.status,'success');
 assert.equal(r.journeys[0].legs[0].mode,'tram');
 assert.equal(r.journeys[0].legs[0].departureTime,'2026-11-12T08:10:00.000Z');
 assert.equal(r.journeys[0].fareLocal,null);
 assert.equal(r.journeys[0].walkingAccessVerified,false);
 assert.equal(r.journeys[0].legs[0].lineNames[0],'1');
});
test('transfer: only via identical stop and adequate scheduled connection',()=>{
 const r=plan(feed,a,c,{date:'2026-11-12',afterHHMM:'10:00',maxStraightLineMeters:150});
 assert.equal(r.status,'success');
 const j=r.journeys.find(x=>x.legs.length===2);
 assert.ok(j);
 assert.equal(j.legs[0].to,'Gara Oradea');
 assert.equal(j.legs[1].from,'Gara Oradea');
 assert.equal(j.legs[1].mode,'bus');
 assert.equal(j.arrivalDateTime,'2026-11-12T08:37:00.000Z');
});
test('GTFS supports after-midnight times on day of service',()=>{
 const r=plan(feed,a,c,{date:'2026-11-12',afterHHMM:'23:55',maxStraightLineMeters:150});
 assert.equal(r.status,'success');
 assert.equal(r.journeys[0].legs[0].departureTime,'2026-11-12T23:10:00.000Z');
});
test('weekday calendar, empty coverage, validation',()=>{
 assert.equal(plan(feed,a,c,{date:'2026-11-14',afterHHMM:'10:00',maxStraightLineMeters:150}).status,'no_service_on_date');
 assert.equal(plan(feed,pt(44.4,26.1),c,{date:'2026-11-12'}).status,'no_nearby_gtfs_stop');
 assert.equal(plan(null,a,c).status,'feed_not_loaded');
 assert.equal(plan(feed,pt(NaN,20),c).status,'invalid_coordinates');
 assert.equal(plan(feed,a,c,{date:'2026-02-30'}).status,'invalid_date');
 assert.equal(plan(feed,a,c,{date:'2026-11-12',afterHHMM:'25:59'}).status,'invalid_departure');
});
test('CSV parser handles BOM, escaped quotations and commas',()=>{
 const rows=parseGtfsCsv('\uFEFFstop_id,stop_name\r\nA,"Piața, Unirii"\r\nB,"Gara ""Centru"""\n');
 assert.deepEqual(rows,[{stop_id:'A',stop_name:'Piața, Unirii'},{stop_id:'B',stop_name:'Gara "Centru"'}]);
});
test('reject a zero-minute ride between different stops instead of inventing a transfer',()=>{
 const stops=[
  {stop_id:'A',stop_name:'Start',stop_lat:'47.0500',stop_lon:'21.9200'},
  {stop_id:'B',stop_name:'Middle',stop_lat:'47.0540',stop_lon:'21.9200'},
  {stop_id:'C',stop_name:'End',stop_lat:'47.0590',stop_lon:'21.9200'}];
 const entries=(trip,ids,hours)=>ids.map((id,i)=>({trip_id:trip,stop_id:id,stop_sequence:String(i+1),arrival_time:hours[i],departure_time:hours[i]}));
 const f={stops,routes:[
  {route_id:'r0',route_short_name:'ZERO',route_type:'3'},
  {route_id:'r1',route_short_name:'TRANSFER',route_type:'3'},
  {route_id:'r2',route_short_name:'DIRECT',route_type:'3'}],
  trips:[{trip_id:'t0',route_id:'r0',service_id:'W'},
         {trip_id:'t1',route_id:'r1',service_id:'W'},
         {trip_id:'t2',route_id:'r2',service_id:'W'}],
  stop_times:[
   ...entries('t0',['A','B'],['10:10:00','10:10:00']),
   ...entries('t1',['B','C'],['10:14:00','10:25:00']),
   ...entries('t2',['A','C'],['10:11:00','10:26:00'])],
  calendar:[{service_id:'W',monday:'1',tuesday:'1',wednesday:'1',thursday:'1',friday:'1',saturday:'0',sunday:'0',start_date:'20261101',end_date:'20261231'}],calendar_dates:[]};
 const r=plan(f,pt(47.05,21.92),pt(47.059,21.92),{
  date:'2026-11-17',afterHHMM:'10:00',maxStraightLineMeters:150});
 assert.equal(r.status,'success');
 assert.ok(r.journeys.length);
 assert.ok(r.journeys.every(j=>j.legs.length===1));
 assert.equal(r.journeys[0].legs[0].lineNames[0],'DIRECT');
});

test('Large GTFS snapshot with dense departures returns bounded scheduled results promptly',()=>{
 const point=(i)=>({latitude:44.42+i*0.001,longitude:26.1});
 const stations=Array.from({length:20},(_,i)=>({stop_id:'S'+i,stop_name:'Station '+i,
  stop_lat:String(point(i).latitude),stop_lon:'26.1'}));
 const routes=[{route_id:'DENSE',route_short_name:'X',route_type:'3'}];
 const trips=[],stop_times=[];
 const hhmmss=seconds=>[Math.floor(seconds/3600),Math.floor(seconds/60)%60,seconds%60]
  .map(x=>String(x).padStart(2,'0')).join(':');
 for(let i=0;i<1800;i++){
  const tid='t'+i;
  trips.push({trip_id:tid,route_id:'DENSE',service_id:'DAY'});
  const initial=8*3600+(i%240)*10;
  for(let j=0;j<20;j++){
   const at=hhmmss(initial+120*j);
   stop_times.push({trip_id:tid,stop_id:'S'+j,stop_sequence:String(j+1),
    arrival_time:at,departure_time:at});
  }
 }
 const feed={stops:stations,routes,trips,stop_times,
  calendar:[{service_id:'DAY',monday:'1',tuesday:'1',wednesday:'1',thursday:'1',
   friday:'1',saturday:'1',sunday:'1',start_date:'20261101',end_date:'20270105'}],
  calendar_dates:[]};
 const started=Date.now();
 const result=plan(feed,point(0),point(19),{
  date:'2026-11-17',afterHHMM:'08:00',maxStraightLineMeters:150,maxResults:4});
 const elapsed=Date.now()-started;
 assert.equal(result.status,'success',JSON.stringify({status:result.status,elapsed}));
 assert.ok(result.journeys.length>0 && result.journeys.length<=4);
 assert.ok(result.journeys.every(j=>j.legs.every(l=>Date.parse(l.arrivalTime)>Date.parse(l.departureTime))));
 assert.ok(elapsed<8000,'Dense 36k stop-times should finish under 8 seconds, measured '+elapsed+'ms');
});
