// Independent surface source + the SAME ordinary local planner at both ends.
// Missing local legs keep the actual intercity schedule visible, never complete.
import {loadOpenSurfaceIndex,planOpenSurfaceCandidates} from './open_surface_timetable.mjs';
import {planFixedPointBoardingAccess} from './mixed_fixed_point_access.mjs';
import {compactJourney,journeyAnchoredToPoints} from './mixed_flight_ground_connections.mjs';
import {convertTransCAPIToMixedLegs} from './mixed_existing_provider_adapters.mjs';
import {composeVerifiedMixedItineraries} from './verified_multimodal_itineraries.mjs';
import {beforeTransitAbort} from './transit_deadline.mjs';
const iso=ms=>new Date(ms).toISOString();
const verifiedLocal=(journey,from,to)=>journeyAnchoredToPoints(journey,from,to,{fromRadius:120,toRadius:120})&&
 convertTransCAPIToMixedLegs(journey,{from,to},{provider:journey.provider||'Ordinary local planner',scopeId:from.id+'>'+to.id}).length>0;
export async function searchOpenSurfaceOptions(env,{
 origin,destination,departureAt=null,signal:parentSignal=null,onProgress=null,now=Date.now(),budgetMs=16000,limit=2
}={},{planner,loadIndex=loadOpenSurfaceIndex}={}){
 const controller=new AbortController(),signal=controller.signal,cancel=()=>controller.abort();
 parentSignal?.addEventListener('abort',cancel,{once:true});if(parentSignal?.aborted)cancel();
 const timer=setTimeout(cancel,Math.max(1,Math.min(18000,budgetMs)));
 const fields=(status,options=[],extra={})=>({open_surface_status:status,scheduled_surface_options:options,...extra});
 try{
  const loaded=await beforeTransitAbort(()=>loadIndex(env,{now}),signal,{status:'search_timeout',index:null});
  if(!loaded.index)return fields(loaded.status);
  const index=loaded.index,requested=departureAt||iso(now);
  const result=planOpenSurfaceCandidates(index,{origin,destination,departureAt:requested,now,signal});
  const source={attribution:index.attribution,sourceUrl:index.source,sourceSha256:index.sourceSha256,generatedAt:index.generatedAt,
   publisherUrl:index.publisherUrl,licenseUrl:index.licenseUrl,validFrom:index.validFrom,validTo:index.validTo};
  const options=result.candidates.slice(0,Math.max(1,Math.min(2,limit))).map((c,i)=>({...c,id:'open-surface:'+i,source,
   accessStatus:'checking',egressStatus:'checking',accessJourney:null,egressJourney:null,journey:null}));
  if(!options.length)return fields(result.status,[],{open_surface_source:source});
  const publish=()=>{if(!signal.aborted)onProgress?.(fields(result.status,options.map(o=>({...o}))));};
  publish();
  await Promise.all(options.map(async(option,i)=>{
   const first=option.legs[0],last=option.legs.at(-1);
   const start={...origin,id:'surface:origin'},end={...destination,id:'surface:destination'};
   const boarding={...first.departurePoint,label:first.from,id:'flix:'+first.fromStopId};
   const alighting={...last.arrivalPoint,label:last.to,id:'flix:'+last.toStopId};
   if(typeof planner!=='function'){
    option.accessStatus=option.egressStatus='local_transport_not_configured';publish();return;
   }
   const egressAt=iso(Date.parse(last.arrivalTime)+10*60000);
   const endpointPlanner=(e,from,to,count,options)=>planner(e,from,to,count,{...options,allowWalking:true});
   const [access,egress]=await Promise.all([
    planFixedPointBoardingAccess(env,{origin:start,boardingPoint:boarding,earliestDeparture:requested,
     latestArrival:iso(Date.parse(first.departureTime)-15*60000)}, {planner:endpointPlanner,now,signal}),
    beforeTransitAbort(()=>endpointPlanner(env,alighting,end,4,{departureAt:egressAt,signal}),signal,{status:'search_timeout',journeys:[]})
   ]);
   option.accessStatus=access.status;option.egressStatus=egress.status;
   if(access.journey&&verifiedLocal(access.journey,start,boarding)){
    option.accessJourney=compactJourney(access.journey);option.accessVerified=true;
   }else if(access.journey)option.accessStatus='local_endpoint_or_schedule_unverified';
   const egressJourney=(egress.journeys||[]).filter(j=>Date.parse(j.startDateTime)>=Date.parse(egressAt)&&
    Date.parse(j.arrivalDateTime)<=Date.parse(result.horizon)&&verifiedLocal(j,alighting,end))
    .sort((a,b)=>Date.parse(a.arrivalDateTime)-Date.parse(b.arrivalDateTime))[0];
   if(egressJourney){option.egressJourney=compactJourney(egressJourney);option.egressVerified=true;option.egressStatus='scheduled_connection_found'}
   else if(egress.journeys?.length)option.egressStatus='local_endpoint_or_schedule_unverified';
   if(option.accessVerified&&option.egressVerified){
    const composed=composeOpenSurfaceOption(option,{origin,destination,departureAt:requested,
     accessJourney:access.journey,egressJourney,candidateIndex:i});
    option.compositionStatus=composed.status;
    if(composed.journey){option.completeDoorToDoor=true;option.journey=composed.journey}
   }
   publish();
  }));
  if(signal.aborted)for(const o of options){if(o.accessStatus==='checking')o.accessStatus='search_timeout';if(o.egressStatus==='checking')o.egressStatus='search_timeout'}
  return fields(signal.aborted?'search_timeout':result.status,options,{open_surface_source:source,open_surface_search_incomplete:signal.aborted});
 }catch{return fields(signal.aborted?'search_timeout':'source_unavailable')}
 finally{clearTimeout(timer);parentSignal?.removeEventListener('abort',cancel)}
}

// Pure composition of already-observed evidence; also permits offline replay
// of saved public diagnostic responses without another live provider request.
export function composeOpenSurfaceOption(option,{
 origin,destination,departureAt,accessJourney=option?.accessJourney,
 egressJourney=option?.egressJourney,candidateIndex=0
}={}){
 const first=option?.legs?.[0],last=option?.legs?.at(-1);
 if(!first||!last||option.scheduleVerified!==true||!option.accessVerified||!option.egressVerified||!accessJourney||!egressJourney)
  return {status:'missing_connection_evidence',journey:null};
 const start={...origin,id:'surface:origin'},end={...destination,id:'surface:destination'};
 const boarding={...first.departurePoint,label:first.from,id:'flix:'+first.fromStopId};
 const alighting={...last.arrivalPoint,label:last.to,id:'flix:'+last.toStopId};
 if(!verifiedLocal(accessJourney,start,boarding)||!verifiedLocal(egressJourney,alighting,end)||
  !(Date.parse(accessJourney.startDateTime)>=Date.parse(departureAt)-120000&&
  Date.parse(accessJourney.arrivalDateTime)<=Date.parse(first.departureTime)-15*60000&&
  Date.parse(egressJourney.startDateTime)>=Date.parse(last.arrivalTime)+10*60000)||
  option.legs.some((l,i)=>i>0&&(option.legs[i-1].toStopId!==l.fromStopId||
   Date.parse(l.departureTime)-Date.parse(option.legs[i-1].arrivalTime)<45*60000)))return {status:'connection_evidence_mismatch',journey:null};
 const localLegs=[
  ...convertTransCAPIToMixedLegs(accessJourney,{from:start,to:boarding},{provider:accessJourney.provider||'Ordinary local planner',scopeId:'surface-access-'+candidateIndex}),
  ...convertTransCAPIToMixedLegs(egressJourney,{from:alighting,to:end},{provider:egressJourney.provider||'Ordinary local planner',scopeId:'surface-egress-'+candidateIndex})];
 const legs=option.legs.map(l=>({mode:l.mode,provider:'FlixBus / FlixTrain open GTFS',verified:true,
  from:{...l.departurePoint,id:'flix:'+l.fromStopId,label:l.from},to:{...l.arrivalPoint,id:'flix:'+l.toStopId,label:l.to},
  departureTime:l.departureTime,arrivalTime:l.arrivalTime,operator:l.operator,lineNames:[l.line],
  departureZone:'UTC',arrivalZone:'UTC',verificationSource:option.source?.sourceUrl,fareVerified:false}));
 const composed=composeVerifiedMixedItineraries({origin:start,destination:end,departureAt,
  legs:[...localLegs,...legs],maxLegs:10,horizonHours:72,maxResults:1});
 if(!composed.journeys?.length)return {status:composed.status,journey:null};
 const originals=[...accessJourney.legs,...option.legs,...egressJourney.legs];
 const legsWithGeometry=composed.journeys[0].legs.map(leg=>{
  const raw=originals.find(l=>Date.parse(l.departureTime)===Date.parse(leg.departureTime)&&Date.parse(l.arrivalTime)===Date.parse(leg.arrivalTime));
  if(!raw)return leg;
  return {...leg,...(Array.isArray(raw.coordinates)?{coordinates:raw.coordinates,geometryAvailable:raw.geometryAvailable===true}:{}),
   ...(Array.isArray(raw.steps)?{steps:raw.steps}:{}),...(raw.distanceMeters!=null?{distanceMeters:raw.distanceMeters}:{}),
   ...(raw.stopCount!=null?{stopCount:raw.stopCount}:{}),...(Array.isArray(raw.stops)?{stops:raw.stops}:{}),timingEstimated:raw.timingEstimated===true};
 });
 return {status:'verified',journey:{...composed.journeys[0],legs:legsWithGeometry,openSurfaceCandidateId:option.id,
  schedule_status:'scheduled',time_zone:'UTC',sourceAttribution:option.source?.attribution,
  transferProtectionVerified:false,seatOrFareVerified:false}};
}
