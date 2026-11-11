import assert from 'node:assert/strict';
import {test} from 'node:test';
import {createRomanianUrbanServer} from './ro_urban_server.mjs';
const token='0123456789abcdef0123456789abcdef0123456789abcdef';
const sample={
 stops:[
  {stop_id:'A',stop_name:'Start',stop_lat:'47.050',stop_lon:'21.92'},
  {stop_id:'B',stop_name:'Final',stop_lat:'47.055',stop_lon:'21.92'}],
 routes:[{route_id:'1',route_short_name:'1',route_type:'0'}],
 trips:[{trip_id:'1',route_id:'1',service_id:'S'}],
 stop_times:[
  {trip_id:'1',stop_id:'A',stop_sequence:'1',arrival_time:'10:00:00',departure_time:'10:00:00'},
  {trip_id:'1',stop_id:'B',stop_sequence:'2',arrival_time:'10:10:00',departure_time:'10:10:00'}],
 calendar_dates:[{service_id:'S',date:'20261112',exception_type:'1'}]
};
test('Internal endpoint requires service bearer token and returns sourced routes only',async()=>{
 const server=createRomanianUrbanServer({token,feeds:{oradea:sample}});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const base='http://127.0.0.1:'+server.address().port;
 const payload={region:'oradea',from:{latitude:47.05,longitude:21.92},to:{latitude:47.055,longitude:21.92},date:'2026-11-12',afterHHMM:'09:50',maxStraightLineMeters:150};
 const send=async(headers,body=payload)=>fetch(base+'/v1/plan',{method:'POST',headers:{'content-type':'application/json',...headers},body:JSON.stringify(body)});
 try{
  assert.equal((await fetch(base+'/healthz')).status,200);
  assert.equal((await send({})).status,401);
  assert.equal((await send({Authorization:'Bearer wrong'})).status,401);
  assert.equal((await send({Authorization:'Bearer '+token},{...payload,region:'unknown'})).status,400);
  const r=await send({Authorization:'Bearer '+token});
  assert.equal(r.status,200);
  assert.equal(r.headers.get('cache-control'),'no-store');
  const data=await r.json();
  assert.equal(data.status,'success');
  assert.equal(data.journeys[0].legs[0].from,'Start');
  assert.equal(data.journeys[0].fareLocal,null);
  assert.equal((await fetch(base+'/v1/plan')).status,404);
 }finally{await new Promise(resolve=>server.close(resolve));}
});
test('Internal endpoint fails closed if no verified feed mounted',async()=>{
 const server=createRomanianUrbanServer({token});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 try{
  const r=await fetch('http://127.0.0.1:'+server.address().port+'/v1/plan',{method:'POST',
   headers:{Authorization:'Bearer '+token,'content-type':'application/json'},
   body:JSON.stringify({region:'oradea',from:{latitude:47,longitude:21},to:{latitude:47.1,longitude:21}})});
  assert.equal(r.status,503);
  assert.equal((await r.json()).status,'feed_not_loaded');
 }finally{await new Promise(resolve=>server.close(resolve));}
});