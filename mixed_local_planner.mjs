// Reuse the normal deterministic public-transport request pipeline IN PROCESS.
// This is not another HTTP call to the Worker and never starts mixed discovery.
// Memoization is request-scoped: no user's address/GPS is stored globally.
import {beforeTransitAbort} from './transit_deadline.mjs';
import {mixedGreatCircleKm} from './mixed_route_quality.mjs';
import {walkingRouteConnection} from './mixed_walking_connection.mjs';
import {planRomanianAirportOrUrbanConnection} from './ro_door_to_door.mjs';
const point=p=>p&&p.latitude!=null&&p.longitude!=null&&p.latitude!==''&&p.longitude!==''&&Number.isFinite(+p.latitude)&&
 Number.isFinite(+p.longitude)&&Math.abs(+p.latitude)<=90&&Math.abs(+p.longitude)<=180;
const inRoBounds=p=>point(p)&&+p.latitude>=43.55&&+p.latitude<=48.35&&+p.longitude>=20.15&&+p.longitude<=29.95;
const anchorLocalJourneyEndpoints=(journey,from,to)=>{
 if(!journey||typeof journey!=='object'||!Array.isArray(journey.legs)||!journey.legs.length)return journey;
 const legs=journey.legs.map(l=>({
  ...l,
  ...(l?.arrivalLatLon&&!l?.arrivalPoint?{arrivalPoint:l.arrivalLatLon}:{})
 }));
 const first=legs[0];
 const firstIsWalk=/^(?:walk|walking|foot|pedestrian)$/i.test(String(first?.mode||''));
 const w=journey.walkToFirstStop;
 if(!firstIsWalk&&w?.verified&&Array.isArray(w.coordinates)&&w.coordinates.length>=2){
  const a=journey.access||journey.boarding_stop||first?.departurePoint;
  const aLat=Number(a?.latitude??a?.lat),aLon=Number(a?.longitude??a?.lon);
  const fDepMs=Date.parse(first?.departureTime||journey.startDateTime||'');
  const wMin=Math.max(1,Math.ceil(Number(w.durationMinutes)||1));
  if(Number.isFinite(aLat)&&Number.isFinite(aLon)&&Number.isFinite(fDepMs)){
   const wStartIso=new Date(fDepMs-wMin*60000).toISOString();
   const fStopLabel=String(first?.from||journey.access?.stop_name||journey.boarding_stop?.label||'Stație');
   legs.unshift({
    mode:'walking',
    from:String(from?.label||from?.name||'Plecarea'),
    to:fStopLabel,
    departurePoint:{lat:+from.latitude,lon:+from.longitude,latitude:+from.latitude,longitude:+from.longitude},
    arrivalPoint:{lat:aLat,lon:aLon,latitude:aLat,longitude:aLon},
    arrivalLatLon:{lat:aLat,lon:aLon},
    departureTime:wStartIso,
    arrivalTime:first.departureTime,
    durationMinutes:wMin,
    distanceMeters:w.distanceMeters??null,
    coordinates:w.coordinates,
    geometryAvailable:true,
    lineNames:[]
   });
  }
 }
 const startDateTime=legs[0]?.departureTime||journey.startDateTime;
 const arrivalDateTime=legs.at(-1)?.arrivalTime||journey.arrivalDateTime;
 const dur=Math.round((Date.parse(arrivalDateTime)-Date.parse(startDateTime))/60000);
 const resolvedFirst=legs[0];
 const resolvedLast=legs.at(-1);
 const fPt=resolvedFirst?.departurePoint||resolvedFirst?.departureLatLon||null;
 const sPt=/^(?:walk|walking|foot|pedestrian)$/i.test(String(resolvedFirst?.mode||''))
  ?(resolvedFirst?.arrivalPoint||resolvedFirst?.arrivalLatLon)
  :(resolvedFirst?.departurePoint||resolvedFirst?.departureLatLon);
 const sLat=Number(sPt?.latitude??sPt?.lat),sLon=Number(sPt?.longitude??sPt?.lon);
 const walkToFirstStop=journey.walkToFirstStop||(/^(?:walk|walking|foot|pedestrian)$/i.test(String(resolvedFirst?.mode||''))
  ?{verified:true,distanceMeters:resolvedFirst.distanceMeters??0,durationMinutes:resolvedFirst.durationMinutes??1,coordinates:resolvedFirst.coordinates||[]}
  :(point(from)&&Number.isFinite(sLat)&&Number.isFinite(sLon)
    ?{verified:true,distanceMeters:Math.round((mixedGreatCircleKm(from,{latitude:sLat,longitude:sLon})||0)*1000),durationMinutes:1,coordinates:[[+from.longitude,+from.latitude],[sLon,sLat]]}
    :undefined));
 const lastPt=resolvedLast?.arrivalPoint||resolvedLast?.arrivalLatLon||null;
 const arrivalPoint=journey.arrivalPoint||(lastPt
  ?{latitude:Number(lastPt.latitude??lastPt.lat),longitude:Number(lastPt.longitude??lastPt.lon),lat:Number(lastPt.latitude??lastPt.lat),lon:Number(lastPt.longitude??lastPt.lon),label:String(to?.label||to?.name||resolvedLast?.to||'Destination')}
  :(point(to)?{latitude:+to.latitude,longitude:+to.longitude,lat:+to.latitude,lon:+to.longitude,label:String(to.label||to.name||'Destination')}:undefined));
 return {
  ...journey,
  legs,
  startDateTime,
  arrivalDateTime,
  ...(walkToFirstStop?{walkToFirstStop}:{}),
  ...(arrivalPoint?{arrivalPoint}:{}),
  ...(fPt&&!journey.departurePoint?{departurePoint:fPt}:{}),
  ...(Number.isFinite(dur)&&dur>0?{durationMinutes:dur}:{})
 };
};
export function createMixedLocalPlanner({env,dispatch,language='ro',maxCalls=24}={}){
 const cache=new Map(),walkingCache=new Map();let calls=0;
 return async (unused,from,to,limit=4,{departureAt=null,signal=null,allowWalking=false}={})=>{
  if(!point(from)||!point(to))return {status:'missing_coordinates',journeys:[]};
  if(signal?.aborted)return {status:'search_timeout',journeys:[]};
  const key=[+from.latitude,+from.longitude,+to.latitude,+to.longitude,departureAt||'now',allowWalking?'walk-fallback':'transit'].join('|');
  if(!cache.has(key)){
   if(calls>=maxCalls)return {status:'local_query_budget_exhausted',journeys:[]};
   calls++;
   const work=async()=>{
    if(signal?.aborted)return {status:'search_timeout',journeys:[]};
    // Do not pass the outer international prompt/history/flags. The local
    // pipeline must treat an airport, station or address as an ordinary point.
    const destination={...to,label:String(to.label||to.name||'Destination').slice(0,160)};
    const a=String(from.country_code||'').toUpperCase(),b=String(to.country_code||'').toUpperCase();
    // Other domestic territories use the existing GPS-country registry gate,
    // including its disabled-provider rules. Never enable a new country here.
    const national=Boolean(a&&a===b&&!['GB','RO'].includes(a));
    const request=new Request('https://mixed-local.internal/api/chat',{
     method:'POST',headers:{'Content-Type':'application/json'},...(signal?{signal}:{}),
     body:JSON.stringify({message:'Transport public',module:'maps',language,
      history:[],location:from,coordinates:from,location_requested:true,
      journey_origin:from,transit_destination:destination,transit_query:destination.label,
      transit_departure_at:departureAt,transit_count:Math.max(1,Math.min(4,limit)),
      mixed_journey:false,mixed_composition:false,national_public_transport:national})
    });
    try{
     const response=await dispatch(request,env),data=await response.json();
     const journeys=(Array.isArray(data.transit)?data.transit:[]).map(j=>anchorLocalJourneyEndpoints(j,from,destination));
     const distance=mixedGreatCircleKm(from,to);
     // For a short local gap, reuse standalone "Traseu pietonal" exactly as
     // the passenger can already use it. Never bypass an exhausted/denied
     // provider and never estimate a line/duration from geographic distance.
     const blocked=JSON.stringify([data.reason,data.error_code,data.provider_status]).match(/quota|exhausted|http[_ ]?(?:401|402|403|429)|access_denied|budget_exceeded/i);
     const bothRo=((a==='RO'||(!a&&inRoBounds(from)))&&(b==='RO'||(!b&&inRoBounds(destination))));
     const airportOrUrbanConfigured=Boolean(from?.iata||destination?.iata||
      /\b(?:aeroport\w*|airport)\b/i.test(String(from?.name||from?.label||'')+' '+String(destination?.name||destination?.label||''))||
      typeof env?.RO_URBAN_VPC?.fetch==='function'||env?.RO_URBAN_API_URL);
     if(!journeys.length&&bothRo&&airportOrUrbanConfigured&&!blocked&&distance!==null&&distance>=0.5&&distance<=48&&!signal?.aborted&&env?.GEOAPIFY_API_KEY){
      const roConn=await (signal
       ?beforeTransitAbort(()=>planRomanianAirportOrUrbanConnection(env,from,destination,{departureAt,lang:language}),signal,null)
       :planRomanianAirportOrUrbanConnection(env,from,destination,{departureAt,lang:language}));
      if(roConn){
       const anchored=anchorLocalJourneyEndpoints(roConn,from,destination);
       return {status:'success',journeys:[anchored],provider:anchored.provider,provider_status:{ro_urban:'multimodal_verified'}};
      }
     }
     if(!journeys.length&&allowWalking&&response.ok&&!blocked&&distance!==null&&distance>0&&distance<=4&&!signal?.aborted){
      const walkingKey=[+from.latitude,+from.longitude,+to.latitude,+to.longitude].join('|');
      if(!walkingCache.has(walkingKey)&&calls<maxCalls){
       calls++;
       walkingCache.set(walkingKey,(async()=>{
        const req=new Request('https://mixed-local.internal/api/chat',{
         method:'POST',headers:{'Content-Type':'application/json'},...(signal?{signal}:{}),
         body:JSON.stringify({message:language==='en'?'Walking':'Traseu pietonal',module:'maps',language,history:[],
          location:from,coordinates:from,location_requested:true,route_profile:'walk',route_destination:destination,
          mixed_journey:false,mixed_composition:false,national_public_transport:false})});
        try{return await (await dispatch(req,env)).json()}catch{return null}
       })());
      }
      const walked=walkingCache.has(walkingKey)?await (signal?beforeTransitAbort(()=>walkingCache.get(walkingKey),signal,null):walkingCache.get(walkingKey)):null;
      const walking=walkingRouteConnection(walked,from,destination,departureAt||new Date().toISOString());
      if(walking)return {status:'success',journeys:[walking],provider:walking.provider,provider_status:{walking:'existing_standalone_router'},transit_status:data.reason||'no_local_timetable'};
     }
     return {status:journeys.length?'success':data.transport_lines_available===true?'route_only':!response.ok?'local_provider_http_'+response.status:String(data.reason||data.error_code||'no_local_journey_returned'),
      journeys,provider:data.transit_provider||null,provider_status:data.provider_status||{},
      route_options_without_schedule:data.route_options_without_schedule||[]};
    }catch{return {status:signal?.aborted?'search_timeout':'local_provider_unavailable',journeys:[]};}
   };
   cache.set(key,signal?beforeTransitAbort(work,signal,{status:'search_timeout',journeys:[]}):work());
  }
  return cache.get(key);
 };
}
