// Cross-provider stop identity safety. Stop names and nearby coordinates are
// discovery hints, NEVER proof of a walkable or timed transfer.
import {mixedGreatCircleKm,mixedPoint} from './mixed_route_quality.mjs';
const valid=x=>typeof x==='string'&&x.length>0&&x.length<=120&&!/[\x00-\x1f]/.test(x);
const norm=x=>typeof x==='string'?x.trim():'';
const samePoint=(a,b,metres)=> {
 const km=mixedGreatCircleKm(a,b);
 return km!==null&&km*1000<=metres;
};
const one=(v,max)=>Number.isFinite(v)&&v>=0&&v<=max;

/**
 * crosswalk: maintainer-controlled records with documented station codes.
 * {provider,providerStopId,canonicalId,verified:true,
 *  evidenceSource,latitude,longitude}
 * A feed's own identityVerified/canonicalId flags are NOT sufficient.
 */
export function canonicalizeMixedProviderStop(raw,provider,queryPair,options={}){
 const source=norm(provider);
 if(!raw||!valid(source)||!valid(raw.id))return null;
 const id=norm(raw.id),label=norm(raw.label)||id;
 const point=mixedPoint(raw);
 const matched=[queryPair?.from,queryPair?.to].find(s=>s?.id===id);
 const endpointTolerance=one(options.endpointToleranceMeters,250)?
   options.endpointToleranceMeters:100;
 // Do not let an 8km-away terminal masquerade as the user's door.
 if(matched&&samePoint(raw,matched,endpointTolerance))
  return {...raw,id:matched.id,label,identityKind:'query_endpoint_verified'};
 // If both points exist but disagree, this is not even a safe endpoint
 // candidate; reject rather than silently renaming it to a local ID.
 if(matched&&point&&mixedPoint(matched))
  return null;
 for(const entry of Array.isArray(options.crosswalk)?options.crosswalk:[]){
  if(entry?.verified!==true||entry.provider!==source||entry.providerStopId!==id||
     !valid(entry.canonicalId)||!valid(entry.evidenceSource)||!mixedPoint(entry))
    continue;
  if(point&&!samePoint(raw,entry,150))continue;
  // Source-proven stop code and a geographically grounded registry entry.
  return {...raw,id:entry.canonicalId,label,
   ...(point||mixedPoint(entry)||{}),identityKind:'documented_crosswalk',
   identityEvidence:entry.evidenceSource};
 }
 // Do not treat a self-proclaimed "identityVerified" flag as a crosswalk.
 // Prefix provider-local IDs to avoid accidental cross-supplier joins.
 const sourceId=source+':'+id;
 return {...raw,id:sourceId.slice(0,140),label,
  identityKind:'provider_local_unlinked'};
}
export function resolveMixedTransferProvenance(a,b,{walkLeg}={}){
 if(!a||!b)return {allowed:false,reason:'stop_missing'};
 // Only exactly matched canonical IDs may connect directly.
 if(a.id===b.id&&valid(a.id))return {allowed:true,reason:'same_verified_stop'};
 // A provider-verified, timestamped WALKING segment can bridge distinct IDs.
 // It must physically start at a and end at b, not merely be near either.
 if(walkLeg?.verified===true&&walkLeg.mode==='walking'&&
    walkLeg.from?.id===a.id&&walkLeg.to?.id===b.id&&
    typeof walkLeg.departureTime==='string'&&typeof walkLeg.arrivalTime==='string'){
  const start=Date.parse(walkLeg.departureTime),end=Date.parse(walkLeg.arrivalTime);
  if(Number.isFinite(start)&&Number.isFinite(end)&&end>start)
   return {allowed:true,reason:'verified_timed_walking_leg'};
 }
 return {allowed:false,reason:'transfer_leg_required'};
}
