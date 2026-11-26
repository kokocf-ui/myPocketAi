import {beforeTransitAbort} from './transit_deadline.mjs';
// Provider-neutral *search strategy* for myPocketAI's mixed transport.
//
// A supplier must explicitly be enabled + licensed, and return dated,
// source-backed legs. No geographic or operator name is a timetable.
// Stops shared across suppliers must have canonical, evidence-backed IDs;
// similarity of names or nearby coordinates NEVER creates a connection.
import {composeVerifiedMixedItineraries,normalizeVerifiedMixedLeg} from './verified_multimodal_itineraries.mjs';
import {mixedPoint,mixedGreatCircleKm} from './mixed_route_quality.mjs';
import {canonicalizeMixedProviderStop} from './mixed_stop_identity.mjs';

const isId=s=>typeof s==='string'&&s.length>0&&s.length<=140;
const asDate=s=>typeof s==='string'&&/^\d{4}-\d\d-\d\dT\d\d:\d\d/.test(s)&&
  /(Z|[+-]\d\d:\d\d)$/.test(s)&&Number.isFinite(Date.parse(s));
const fromNode=(v)=>v&&isId(v.id)?{...v,id:v.id}:null;
const distance=(a,b)=>mixedGreatCircleKm(a,b);
const pairKey=(a,b)=>a.id+'>'+b.id;
const rangeValue=(v,min,max,fallback)=>Number.isInteger(v)?Math.min(max,Math.max(min,v)):fallback;

function candidatePairs(origin,destination,rawNodes,maxHubs){
 const present=new Map([[origin.id,origin],[destination.id,destination]]);
 for(const raw of Array.isArray(rawNodes)?rawNodes.slice(0,100):[]){
  const node=fromNode(raw);
  if(!node||present.has(node.id))continue;
  present.set(node.id,node);
 }
 const km=distance(origin,destination);
 const nodes=[...present.values()].filter(n=>n.id!==origin.id&&n.id!==destination.id);
 // An unknown-location stop can still be useful if its provider can serve it;
 // it is never deemed "nearby" based on text similarity.
 const sorted=nodes.map(node=>{
  const a=distance(origin,node),b=distance(node,destination);
  return {node,score:a===null||b===null||km===null?Infinity:a+b-km};
 }).sort((a,b)=>a.score-b.score);
 const hubs=sorted.slice(0,maxHubs).map(x=>x.node);
 const pairs=[],seen=new Set();
 const add=(a,b)=>{
  if(a.id===b.id||seen.has(pairKey(a,b)))return;
  seen.add(pairKey(a,b));pairs.push({from:a,to:b});
 };
 // Prioritise complete A→B coverage. For geography-discovered hubs we
 // know which search supplied each node: origin access, destination egress.
 // Search those three proven transfer segments before optional detours so a
 // modest provider budget does not miss the essential airport-to-airport leg.
 add(origin,destination);
 const access=hubs.filter(n=>n.mixedHubRole==='origin_access');
 const egress=hubs.filter(n=>n.mixedHubRole==='destination_egress');
 if(access.length&&egress.length){
  for(const hub of access)add(origin,hub);
  for(const hub of egress)add(hub,destination);
  for(const first of access)for(const last of egress)add(first,last);
 }
 for(const hub of hubs){add(origin,hub);add(hub,destination)}
 // One-hop transfers between intermediate hubs can reveal train/flight/coach
 // combinations. Never add impossible teleport edges; suppliers must confirm.
 for(const a of hubs)for(const b of hubs)if(a.id!==b.id)add(a,b);
 return pairs;
}

/**
 * sources: [{id,licensed:true,enabled:true,searchLegs(query),canServe?(a,b)}]
 * Each source.searchLegs must return {status:'success',legs:[...]} with fully
 * timestamped verified legs; failures are recorded, not filled with guesses.
 * Caller is responsible for discovering candidate stops through permitted data.
 */
export async function searchMixedRouteProviders({
 origin,destination,departureAt,candidateNodes=[],sources=[],
 maxProviderCalls=20,maxHubs=6,maxResults=8,horizonHours=72,
 allowedModes=null,identityCrosswalk=[],parallelDirect=false,now=Date.now(),budgetMs=18000
}={}){
 const from=fromNode(origin),to=fromNode(destination);
 if(!from||!to||from.id===to.id||!asDate(departureAt)||
    Date.parse(departureAt)<now-120000)
  return {status:'invalid_request',journeys:[],providerChecks:[],searchCalls:0};
 const budget=rangeValue(maxProviderCalls,1,60,20);
 const timeHorizon=rangeValue(horizonHours,6,168,72);
 const candidates=candidatePairs(from,to,candidateNodes,rangeValue(maxHubs,0,12,6));
 const providers=(Array.isArray(sources)?sources:[]).filter(s=>
  s&&s.licensed===true&&s.enabled===true&&isId(s.id)&&typeof s.searchLegs==='function');
 if(!providers.length)return {status:'sources_unavailable',journeys:[],
  providerChecks:[],searchCalls:0,completeJourneyVerified:false};
 const controller=new AbortController(),signal=controller.signal;
 const timer=setTimeout(()=>controller.abort(),Math.max(1,Math.min(18000,Number(budgetMs)||18000)));
 let calls=0;
 const search=(source,query)=>beforeTransitAbort(()=>{calls++;return source.searchLegs({...query,signal});},signal,{status:'search_timeout',legs:[]},{status:'provider_unavailable',legs:[]});
 try{
 const observed=new Map(),checks=[];
 let failures=0;
 const requestedEnd=new Date(Date.parse(departureAt)+timeHorizon*3600000).toISOString();
 // On direct A→B comparisons, fetch independent providers concurrently.
 // Only the already authorized, budgeted suppliers are included.
 const prefetched=new Map();
 // Direct providers can be fetched concurrently even when a hub shortlist
 // follows; keeping this first preserves the A→B priority within the budget.
 if(parallelDirect===true){
  const pair=candidates[0];
  const active=providers.filter(s=>typeof s.canServe!=='function'||s.canServe(pair.from,pair.to))
   .slice(0,budget);
  await Promise.all(active.map(async source=>{
   try{prefetched.set(source.id+':'+pairKey(pair.from,pair.to),{result:await search(source,{
    from:pair.from,to:pair.to,departureAt,untilAt:requestedEnd,
    modes:allowedModes,readOnly:true
   })});}
   catch{prefetched.set(source.id+':'+pairKey(pair.from,pair.to),{failed:true});}
  }));
 }
 // The budget is per source/pair, not per supplier. Query different hub
 // pairs independently; process results in planned order for stable rankings.
 const tasks=[];
 outer: for(const pair of candidates){
  for(const source of providers){
   if(tasks.length>=budget)break outer;
   if(typeof source.canServe==='function'&&!source.canServe(pair.from,pair.to))continue;
   tasks.push({pair,source,key:source.id+':'+pairKey(pair.from,pair.to)});
  }
 }

 // Real suppliers have nontrivial latency. A small concurrency cap allows
 // ground-only alternatives to be explored inside the Android search timeout
 // without flooding any individual licensed API.
 let cursor=0;
 const responses=new Array(tasks.length);
 const worker=async()=>{
  while(cursor<tasks.length&&!signal.aborted){
   const index=cursor++;
   const {pair,source,key}=tasks[index];
   try{
    const earlier=prefetched.get(key);
    if(earlier?.failed)throw Error('provider_unreachable');
    responses[index]={result:earlier?earlier.result:await search(source,{
     from:pair.from,to:pair.to,departureAt,untilAt:requestedEnd,
     modes:allowedModes,readOnly:true
    })};
   }catch{responses[index]={failed:true};}
  }
 };
 await Promise.all(Array.from({length:Math.min(3,tasks.length)},()=>worker()));
 for(const [index,{pair,source}] of tasks.entries()){
  const response=responses[index]||prefetched.get(source.id+':'+pairKey(pair.from,pair.to));
  if(response?.failed){
   failures++;checks.push({source:source.id,status:'provider_unreachable'});continue;
  }
  const result=response?.result;
  if(result?.status!=='success'||!Array.isArray(result.legs)){
   checks.push({source:source.id,status:result?.status||(signal.aborted?'search_timeout':'unavailable')});
   failures++;continue;
  }
  let accepted=0;
  for(const raw of result.legs.slice(0,1000)){
   // The schedule source alone can assert verified=true.
   const first=canonicalizeMixedProviderStop(raw.from,source.id,pair,{
    crosswalk:identityCrosswalk});
   const last=canonicalizeMixedProviderStop(raw.to,source.id,pair,{
    crosswalk:identityCrosswalk});
   if(!first||!last)continue;
   const candidate={...raw,from:first,to:last,provider:source.id};
   const leg=normalizeVerifiedMixedLeg(candidate);
   if(!leg)continue;
   const identity=leg.id+'|'+leg.departureTime+'|'+leg.arrivalTime;
   if(observed.has(identity))continue;
   observed.set(identity,candidate);accepted++;
  }
  checks.push({source:source.id,status:accepted?'legs_received':'no_verified_legs',
   legCount:accepted});
 }
 const graph=composeVerifiedMixedItineraries({
  origin:from,destination:to,departureAt,legs:[...observed.values()],
  maxResults,horizonHours:timeHorizon,
  ...(Array.isArray(allowedModes)&&allowedModes.length?{modes:allowedModes}:{})
 });
 return {...graph,providerChecks:checks,searchCalls:calls,providerFailures:failures,
   completeJourneyVerified:graph.status==='verified',
   // Missing supplier feeds or partial graphs must never be called a usable
   // A-to-B journey, even if a nearby airport produced an isolated result.
   missingConnections:graph.status!=='verified',
   budgetExhausted:calls>=budget,searchIncomplete:signal.aborted};
 }finally{clearTimeout(timer);controller.abort();}
}
