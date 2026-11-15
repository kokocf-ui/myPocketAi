import assert from 'node:assert/strict';
import {test} from 'node:test';
import {routeTopologyFromGtfs,verifiedRouteOnlyOptions,routeOnlyMessage} from './transport_route_topology.mjs';
import {transportAvailabilityDisclosure} from './transport_availability_disclosure.mjs';
const from={latitude:47.05,longitude:21.92},to={latitude:47.055,longitude:21.92};
const feed={stops:[
 {stop_id:'A',stop_name:'Piața Unirii',stop_lat:47.05,stop_lon:21.92},
 {stop_id:'B',stop_name:'Gara',stop_lat:47.055,stop_lon:21.92}],
 routes:[{route_id:'R',route_short_name:'1',route_type:'0'}],
 trips:[{trip_id:'T',route_id:'R',service_id:'OLD'}],
 stop_times:[{trip_id:'T',stop_id:'A',stop_sequence:1},{trip_id:'T',stop_id:'B',stop_sequence:2}]};
test('all countries use the same route-only contract when sourced lines are provided',()=>{
 for(const country of ['RO','GB','FR','DE','IT']){
  const rows=routeTopologyFromGtfs(feed,from,to,{country});
  const options=verifiedRouteOnlyOptions(rows,country);
  assert.equal(options.length,1);
  assert.equal(options[0].line,'1');
  assert.equal(options[0].departure_time,null);
  assert.equal(options[0].service_today_verified,false);
  assert.equal(transportAvailabilityDisclosure(rows[0]).timetable_status,'unavailable');
  assert.match(routeOnlyMessage(options),/orar indisponibil/i);
 }
});
test('no feed, missing stop or missing line evidence gives no suggestions',()=>{
 assert.deepEqual(routeTopologyFromGtfs(null,from,to),[]);
 assert.deepEqual(routeTopologyFromGtfs(feed,from,{latitude:44.5,longitude:26}),[]);
 assert.deepEqual(routeTopologyFromGtfs({...feed,stop_times:[{trip_id:'T',stop_id:'A',stop_sequence:1}]},from,to),[]);
 const rows=routeTopologyFromGtfs(feed,from,to);
 assert.deepEqual(verifiedRouteOnlyOptions([{...rows[0],legs:[{...rows[0].legs[0],lineNames:[]}]}],'RO'),[]);
 assert.deepEqual(verifiedRouteOnlyOptions([{...rows[0],legs:[{...rows[0].legs[0],departureTime:'2030-01-01T10:00:00Z'}]}],'RO'),[]);
});
