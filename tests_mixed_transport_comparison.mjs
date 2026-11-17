import assert from 'node:assert/strict';
import {compareMixedTransportOptions,quotedTotalFare,MIXED_TRANSPORT_COMPARISON_SCRIPT} from './mixed_transport_comparison.mjs';
const journey=(arrival,amount,opts={})=>({
 startDateTime:'2026-12-01T10:00:00Z',arrivalDateTime:arrival,
 legs:[{mode:'train'}],fareLocal:amount===null?null:{amount,currency:'GBP'},...opts
});
const a=journey('2026-12-01T12:00:00Z',30);
const b=journey('2026-12-01T11:00:00Z',50);
const c=journey('2026-12-01T13:00:00Z',15);
assert.deepEqual(compareMixedTransportOptions([a,b,c]),{
 fastestIndex:1,cheapestIndex:2,priceStatus:'comparable',pricedCount:3,cheapestFare:{amount:15,currency:'GBP'}
});
assert.equal(compareMixedTransportOptions([a,b,c]).fastestIndex,1);
assert.equal(compareMixedTransportOptions([a,journey('2026-12-01T11:00:00Z',null)]).priceStatus,'missing_or_incomplete');
const partialFares=compareMixedTransportOptions([a,b,journey('2026-12-01T11:00:00Z',null)]);
assert.equal(partialFares.cheapestIndex,null,'Do not claim a global cheapest with missing prices');
assert.equal(partialFares.cheapestKnownIndex,0,'Compare only complete published prices');
assert.deepEqual(partialFares.cheapestKnownFare,{amount:30,currency:'GBP'});
assert.equal(compareMixedTransportOptions([a,journey('2026-12-01T11:00:00Z',null)]).cheapestKnownIndex,undefined,
 'No partial cheapest badge when only one route has a quote');
assert.equal(compareMixedTransportOptions([a,b,journey('2026-12-01T12:30:00Z',null,{fareLocal:{amount:10,currency:'EUR'},fareComplete:true})]).cheapestKnownIndex,undefined,
 'Do not compare quoted totals across currencies');
assert.equal(compareMixedTransportOptions([a,journey('2026-12-01T11:00:00Z',10,{fareComplete:false})]).cheapestIndex,null);
assert.equal(compareMixedTransportOptions([a,journey('2026-12-01T11:00:00Z',10,{availability_disclosure:{fare_status:'partial'}})]).cheapestIndex,null);
assert.equal(compareMixedTransportOptions([a,journey('2026-12-01T11:00:00Z',10,{fareLocal:{amount:10,currency:'EUR'}})]).priceStatus,'different_currencies');
assert.equal(quotedTotalFare({fareGBP:0,legs:[{mode:'bus'}]}).amount,0);
assert.equal(quotedTotalFare({fareLocal:{amount:12,currency:'GBP'},legs:[{mode:'train'},{mode:'coach'}]}),null);
assert.deepEqual(quotedTotalFare({fareComplete:true,fareLocal:{amount:12,currency:'GBP'},legs:[{mode:'train'},{mode:'coach'}]}),{amount:12,currency:'GBP'});
assert.equal(compareMixedTransportOptions([journey('not a time',20),a]).fastestIndex,1);
assert.equal(compareMixedTransportOptions([a]).cheapestIndex,null);
assert.equal(compareMixedTransportOptions([]).fastestIndex,null);
assert.equal(compareMixedTransportOptions([journey('2026-12-01T09:00:00Z',2),a]).fastestIndex,1);
const inWebView=new Function(MIXED_TRANSPORT_COMPARISON_SCRIPT+';return compareMixedTransportOptions')();
assert.equal(inWebView([a,b,c]).fastestIndex,1);
assert.equal(inWebView([a,b,c]).cheapestIndex,2);
console.log('PASS mixed transport fastest arrival, comparable cheapest fare, WebView injection');
