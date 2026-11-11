// Geoapify verified walking first/last mile for a Romanian urban GTFS trip.
// Never derive walking minutes from straight-line distance and claim verification.
function validPoint(v){
 return v&&v.latitude!==null&&v.longitude!==null &&
 Number.isFinite(Number(v.latitude))&&Number.isFinite(Number(v.longitude)) &&
 Math.abs(+v.latitude)<=90&&Math.abs(+v.longitude)<=180;
}
async function walk(env,from,to,fetchImpl){
 if(!validPoint(from)||!validPoint(to))return null;
 const key=String(env?.GEOAPIFY_API_KEY||'');
 if(!key)return null;
 const endpoint=new URL('https://api.geoapify.com/v1/routing');
 endpoint.searchParams.set('waypoints',from.latitude+','+from.longitude+'|'+to.latitude+','+to.longitude);
 endpoint.searchParams.set('mode','walk');
 endpoint.searchParams.set('type','short');
 endpoint.searchParams.set('apiKey',key);
 try{
  const res=await fetchImpl(endpoint.toString(),{signal:AbortSignal.timeout(6000)});
  if(!res.ok)return null;
  const route=(await res.json())?.features?.[0],p=route?.properties||{};
  if(!Number.isFinite(Number(p.distance))||!Number.isFinite(Number(p.time))||
    Number(p.distance)<0||Number(p.time)<0)return null;
  const coordinates=route?.geometry?.type==='LineString'?route.geometry.coordinates:
    route?.geometry?.type==='MultiLineString'?route.geometry.coordinates.flat():null;
  if(!Array.isArray(coordinates)||coordinates.length<2)return null;
  const trimmed=coordinates.slice(0,2500).filter(c=>Array.isArray(c)&&
    Number.isFinite(c[0])&&Number.isFinite(c[1]));
  if(trimmed.length<2)return null;
  const metersBetween=(a,b)=>{
   const rad=Math.PI/180,lat1=a.latitude*rad,lat2=b.latitude*rad;
   const dLat=lat2-lat1,dLon=(b.longitude-a.longitude)*rad;
   const h=Math.sin(dLat/2)**2+Math.cos(lat1)*Math.cos(lat2)*Math.sin(dLon/2)**2;
   return 6371000*2*Math.atan2(Math.sqrt(h),Math.sqrt(Math.max(0,1-h)));
  };
  const start={latitude:trimmed[0][1],longitude:trimmed[0][0]};
  const end={latitude:trimmed.at(-1)[1],longitude:trimmed.at(-1)[0]};
  if(metersBetween(start,from)>150||metersBetween(end,to)>150)return null;
  const direct=metersBetween(from,to);
  if(+p.distance+100<direct)return null;
  return {verified:true,distanceMeters:Math.round(+p.distance),
   durationMinutes:Math.max(1,Math.ceil(+p.time/60)),coordinates:trimmed};
 }catch{return null}
}
export async function addRomanianWalkingAccess(env,journey,origin,destination,options={}){
 const j=journey&&typeof journey==='object'?{...journey}:null;
 if(!j)return null;
 const get=options.fetchImpl||fetch;
 const a=j.access,e=j.egress;
 const [access,egress]=await Promise.all([walk(env,origin,a,get),walk(env,e,destination,get)]);
 j.walkToFirstStop=access;
 j.walkFromLastStop=egress;
 j.boarding_stop={label:String(a?.stop_name||''),latitude:Number(a?.latitude),longitude:Number(a?.longitude),departure_time:j.legs?.[0]?.departureTime};
 j.firstVehicleDepartureTime=j.legs?.[0]?.departureTime;
 j.transferCount=Math.max(0,(j.legs?.length||1)-1);
 j.accessWalkVerified=Boolean(access);
 j.accessWalkDistanceMeters=access?.distanceMeters??null;
 j.safetyMarginMinutes=5;
 if(j.legs?.length&&e?.latitude!=null&&e?.longitude!=null){
  j.legs=j.legs.map(l=>({...l}));
  j.legs[j.legs.length-1].arrivalLatLon={lat:Number(e.latitude),lon:Number(e.longitude)};
 }
 j.walkingAccessVerified=Boolean(access);
 j.walkingEgressVerified=Boolean(egress);
 j.walkToFirstStopMinutes=access?.durationMinutes??null;
 j.walkFromLastStopMinutes=egress?.durationMinutes??null;
 if(access&&egress){
  j.arrivalAtDestinationTime=new Date(Date.parse(j.arrivalDateTime)+egress.durationMinutes*60000).toISOString();
  const firstLegDeparture=Date.parse(j.legs?.[0]?.departureTime);
  if(Number.isFinite(firstLegDeparture))j.durationToDestinationMinutes=
    Math.ceil((Date.parse(j.arrivalDateTime)-firstLegDeparture)/60000)+
    access.durationMinutes+egress.durationMinutes;
  if(validPoint(destination)&&j.legs?.length){
   const originalArrival=j.arrivalDateTime;
   const finalArrival=j.arrivalAtDestinationTime;
   j.legs.push({mode:'walking',from:String(e.stop_name||'Stație'),to:'Destinație',
    departureTime:originalArrival,arrivalTime:finalArrival,
    distanceMeters:egress.distanceMeters,durationMinutes:egress.durationMinutes,
    coordinates:egress.coordinates,geometryAvailable:true,lineNames:[]});
   j.arrivalDateTime=finalArrival;
   if(Number.isFinite(firstLegDeparture)){
    j.startDateTime=new Date(firstLegDeparture-access.durationMinutes*60000).toISOString();
    j.durationMinutes=j.durationToDestinationMinutes;
   }
  }
 }
 return j;
}