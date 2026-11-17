import assert from 'node:assert/strict';
import {searchMixedRouteProviders} from './mixed_route_provider_search.mjs';
const zero=Date.parse('2026-12-08T06:00:00Z');
const at=n=>new Date(zero+n*60000).toISOString();
const place=(id,longitude)=>({id,label:id,latitude:0,longitude});
const start=place('door-origin',0),finish=place('door-destination',15);
const airportA=place('dynamic-airport-first',.03);
const airportB=place('dynamic-airport-last',14.8);
const leg=(from,to,mode,dep,arr,extra={})=>({
 from,to,mode,departureTime:at(dep),arrivalTime:at(arr),
 verified:true,verificationSource:'licensed timetable example',...extra
});
const called=[];
const ground={id:'authorized-ground',licensed:true,enabled:true,
 canServe:(from,to)=>['door-origin>door-destination','door-origin>dynamic-airport-first',
 'dynamic-airport-last>door-destination'].includes(from.id+'>'+to.id),
 async searchLegs({from,to,departureAt}){
  called.push({supplier:'ground',from:from.id,to:to.id,departureAt});
  if(from.id==='door-origin'&&to.id==='door-destination')return {
   status:'success',legs:[leg(start,finish,'coach',15,900),
    leg(start,finish,'train',30,360)]};
  if(to.id===airportA.id)return {status:'success',legs:[
   leg(start,airportA,'walking',0,50)]};
  return {status:'success',legs:[leg(airportB,finish,'coach',400,510)]};
 }};
const flight={id:'authorized-flights',licensed:true,enabled:true,
 canServe:(from,to)=>from.id===airportA.id&&to.id===airportB.id,
 async searchLegs({from,to,departureAt}){
  called.push({supplier:'flight',from:from.id,to:to.id,departureAt});
  return {status:'success',legs:[leg(airportA,airportB,'flight',180,340,{
   fareLocal:{amount:48,currency:'EUR'},fareVerified:false})]};
 }};
const forbidden={id:'not-authorized',licensed:false,enabled:true,
 async searchLegs(){throw Error('Never call non-licensed provider')}};
const planned=await searchMixedRouteProviders({
 origin:start,destination:finish,departureAt:at(0),now:zero,
 candidateNodes:[airportA,airportB],sources:[ground,flight,forbidden],
 maxProviderCalls:10,maxResults:8
});
assert.equal(planned.status,'verified');
assert.equal(planned.completeJourneyVerified,true);
assert.equal(planned.searchCalls,4,'Only useful source-pairs were checked');
assert.ok(called.every(x=>x.departureAt===at(0)));
assert.deepEqual(planned.journeys.map(x=>x.modeSignature),
 ['train','flight → coach','coach']);
assert.ok(planned.journeys.every(x=>x.legs.at(-1).to===finish.label));
assert.equal(planned.journeys[1].fareLocal,null,'Partial fare is not the full itinerary fare');
assert.equal(planned.missingConnections,false);
assert.ok(!called.some(x=>x.supplier==='not-authorized'));
const noLastMile={...ground,async searchLegs(query){
 const result=await ground.searchLegs(query);
 return {...result,legs:result.legs.filter(l=>l.to.id!=='door-destination')};
}};
const cannotFinish=await searchMixedRouteProviders({
 origin:start,destination:finish,departureAt:at(0),now:zero,
 candidateNodes:[airportA,airportB],sources:[noLastMile,flight],maxProviderCalls:10
});
assert.equal(cannotFinish.status,'no_complete_verified_itinerary');
assert.equal(cannotFinish.missingConnections,true,'A nearby airport is not the actual destination');
const disabled=await searchMixedRouteProviders({
 origin:start,destination:finish,departureAt:at(0),now:zero,sources:[forbidden]
});
assert.equal(disabled.status,'sources_unavailable');
assert.equal(disabled.searchCalls,0);
const quota=await searchMixedRouteProviders({
 origin:start,destination:finish,departureAt:at(0),now:zero,
 candidateNodes:[airportA,airportB],sources:[ground,flight],maxProviderCalls:1
});
assert.equal(quota.budgetExhausted,true);
assert.equal(quota.searchCalls,1);
assert.ok(quota.journeys.length>=1,'Direct alternatives are checked before hub expansions');
const unknown=await searchMixedRouteProviders({
 origin:start,destination:finish,departureAt:'not-a-date',now:zero,sources:[ground]
});
assert.equal(unknown.status,'invalid_request');
assert.equal(unknown.searchCalls,0);
const noGuarantee={id:'unsourced',licensed:true,enabled:true,
 async searchLegs(){return {status:'success',legs:[{
  ...leg(start,finish,'train',30,360),verified:false}]}}};
const noResult=await searchMixedRouteProviders({
 origin:start,destination:finish,departureAt:at(0),now:zero,sources:[noGuarantee]
});
assert.equal(noResult.journeys.length,0,'A provider adapter cannot silently assert verification');
assert.equal(noResult.missingConnections,true);
// Same provider-local stop token cannot make two unrelated operators meet.
// Absent verified canonical identity or agreeing stop coordinates, keep them
// isolated rather than making an invented multi-provider transfer.
const ambiguous={id:'local-stop',label:'Unconfirmed stop'};
const sourceA={id:'ground-A',licensed:true,enabled:true,
 canServe:(a,b)=>a.id===start.id&&b.id===ambiguous.id,
 async searchLegs(){return {status:'success',legs:[
  leg(start,ambiguous,'coach',20,100)]}}};
const sourceB={id:'ground-B',licensed:true,enabled:true,
 canServe:(a,b)=>a.id===ambiguous.id&&b.id===finish.id,
 async searchLegs(){return {status:'success',legs:[
  leg(ambiguous,finish,'train',120,310)]}}};
const coincidental=await searchMixedRouteProviders({
 origin:start,destination:finish,departureAt:at(0),now:zero,
 candidateNodes:[ambiguous],sources:[sourceA,sourceB]
});
assert.equal(coincidental.journeys.length,0,
 'Shared raw stop strings without coordinate or canonical proof cannot join providers');
const badOffset={...ground,id:'bad-identity',canServe:(a,b)=>a.id===start.id&&b.id===finish.id,
 async searchLegs(){return {status:'success',legs:[leg(
  place(start.id,100),finish,'train',30,360)]}}};
const falsePosition=await searchMixedRouteProviders({
 origin:start,destination:finish,departureAt:at(0),now:zero,sources:[badOffset]
});
assert.equal(falsePosition.journeys.length,0,
 'Source-provided start point 100 degrees away is not the requested door');
console.log('PASS source-driven mixed routing: dynamic hubs, verified stop identity, complete routes and licensed-only budgets');
