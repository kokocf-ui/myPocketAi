import assert from 'node:assert/strict';
import {test} from 'node:test';
import {sameHttpJourneys} from './oracle-transport-bridge/probe-east-anglia-http.mjs';

const row={status:'success',time_zone:'Europe/London',schedule_only:true,
 real_time:false,journeys:[{legs:[{mode:'bus',from:'A',to:'B',
 departureTime:'2026-11-16T09:00:00Z',arrivalTime:'2026-11-16T09:20:00Z'}]}]};
test('HTTP parity accepts equal real scheduled journey structures',()=>{
 assert.deepEqual(sameHttpJourneys({http:200,data:row},{http:200,data:structuredClone(row)}),
  {equal:true,http:200,status:'success',journeyCount:1});
});
test('HTTP parity detects unequal times, statuses, and HTTP failures',()=>{
 const different=structuredClone(row);
 different.journeys[0].legs[0].arrivalTime='2026-11-16T09:22:00Z';
 assert.throws(()=>sameHttpJourneys({http:200,data:row},{http:200,data:different}),/PLANNED_JOURNEYS_DIFFER/);
 assert.throws(()=>sameHttpJourneys({http:200,data:row},{http:503,data:row}),/HTTP_STATUS_DIFFERENCE/);
 assert.throws(()=>sameHttpJourneys({http:200,data:row},{http:200,data:{...row,status:'route_only'}}),/PLANNED_JOURNEYS_DIFFER/);
});
