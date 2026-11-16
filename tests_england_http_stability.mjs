import assert from 'node:assert/strict';
import {test} from 'node:test';
import {checkStableResults} from './oracle-transport-bridge/check-england-http-stability.mjs';
const good={region:'en-se',status:'REAL_HTTP_JOURNEYS_IDENTICAL',http:200,
 date:'2026-11-16',journeys:4,journey_digest:'01234abc',same_journeys:true,
 original_http_ms:200,compact_http_ms:180};
test('repeatable dated journeys pass without averaging away failures',()=>{
 const x=checkStableResults([good,{...good,original_http_ms:230},{...good,compact_http_ms:150}]);
 assert.equal(x.status,'REPEATED_REAL_HTTP_JOURNEYS_IDENTICAL');
 assert.equal(x.repeats,3);
 assert.equal(x.journey_digest,'01234abc');
});
test('hash or journey changes are rejected',()=>{
 assert.throws(()=>checkStableResults([good,{...good,journey_digest:'different'}]),/different_http/);
 assert.throws(()=>checkStableResults([good,{...good,http:500}]),/different_http/);
 assert.throws(()=>checkStableResults([good]),/not_enough/);
 assert.throws(()=>checkStableResults([good,{...good,status:'route_only'}]),/different_http/);
});
