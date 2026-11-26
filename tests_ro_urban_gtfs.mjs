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
});test('stop counts use ordered calls, not gaps in GTFS sequence numbers',()=>{
 const irregular={...feed,stop_times:feed.stop_times.map(x=>({...x,stop_sequence:String(Number(x.stop_sequence)*10)}))};
 const r=plan(irregular,a,c,{date:'2026-11-12',afterHHMM:'10:00',maxStraightLineMeters:150});
 const journey=r.journeys.find(x=>x.legs.length===2);
 assert.deepEqual(journey.legs.map(l=>l.stopCount),[1,1]);
});
test('local GTFS retains a bus-only alternative alongside faster trams',()=>{
 const extra={...feed,trips:[...feed.trips,{trip_id:'directBus',route_id:'B12',service_id:'WEEK'}],stop_times:[...feed.stop_times,
  {trip_id:'directBus',stop_id:'A',stop_sequence:10,arrival_time:'10:40:00',departure_time:'10:40:00'},
  {trip_id:'directBus',stop_id:'C',stop_sequence:30,arrival_time:'11:00:00',departure_time:'11:00:00'}]};
 const journeys=plan(extra,a,c,{date:'2026-11-12',afterHHMM:'10:00',maxStraightLineMeters:150,maxResults:2}).journeys;
 assert.equal(journeys.length,2);
 assert.ok(journeys.some(j=>j.legs.every(l=>l.mode==='bus')));
 assert.ok(journeys.some(j=>j.legs.some(l=>l.mode==='tram')));
});
