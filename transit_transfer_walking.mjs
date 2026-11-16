// Verify between-vehicle pedestrian links using the SAME street router as access/egress.
// Never infer a 5–10 minute walk from a direct-line distance or from wait time.
import {verifiedPedestrianRoute} from './ro_urban_walking.mjs';

const isWalk=leg=>/^(walk|walking|foot|pedestrian)$/i.test(String(leg?.mode||''));
const valid=p=>p&&p.latitude!=null&&p.longitude!=null&&
 Number.isFinite(+p.latitude)&&Number.isFinite(+p.longitude)&&
 Math.abs(+p.latitude)<=90&&Math.abs(+p.longitude)<=180;
const point=raw=>{
 if(!raw)return null;
 const latitude=raw.latitude??raw.lat,longitude=raw.longitude??raw.lon;
 return valid({latitude,longitude})?{latitude:+latitude,longitude:+longitude}:null;
};
const endPoint=leg=>point(leg?.arrivalLatLon)||point(leg?.arrivalPoint)||null;
const startPoint=leg=>point(leg?.departurePoint)||point(leg?.fromPoint)||null;
const stopId=(leg,side)=>String(
 side==='end'?(leg?.toStopId||leg?.arrivalPoint?.naptanId||leg?.arrivalPoint?.stop_id||''):
 (leg?.fromStopId||leg?.departureStopId||leg?.departurePoint?.naptanId||leg?.departurePoint?.stop_id||'')
);
const timed=t=>{const n=Date.parse(t||'');return Number.isFinite(n)?n:null;};
const distance=(a,b)=>{
 if(!valid(a)||!valid(b))return Infinity;
 const r=Math.PI/180,lat1=a.latitude*r,lat2=b.latitude*r;
 const h=Math.sin((lat2-lat1)/2)**2+Math.cos(lat1)*Math.cos(lat2)*
  Math.sin((b.longitude-a.longitude)*r/2)**2;
 return 6371000*2*Math.atan2(Math.sqrt(h),Math.sqrt(Math.max(0,1-h)));
};
const validGeometry=walk=>{
 if(!walk?.geometryAvailable||!Array.isArray(walk?.coordinates)||walk.coordinates.length<2)return false;
 return walk.coordinates.every(c=>Array.isArray(c)&&c.length>=2&&
  Number.isFinite(+c[0])&&Number.isFinite(+c[1]));
};
const endpointMatch=(leg,a,b)=>{
 if(!validGeometry(leg)||!valid(a)||!valid(b))return false;
 const start=leg.coordinates[0],last=leg.coordinates.at(-1);
 return distance(a,{latitude:+start[1],longitude:+start[0]})<=150&&
  distance(b,{latitude:+last[1],longitude:+last[0]})<=150;
};
const safeMinutes=(ms)=>Math.max(0,Math.round(ms/60000*10)/10);

/**
 * Annotates platform changes and inserts a real Geoapify walking leg only
 * when origin AND next boarding stop coordinates are confirmed.
 * Existing operator WALK legs and their scheduled times are preserved.
 *
 * status: same_stop | verified | provider_timing_only | unverified | impossible
 * transferFeasible: false only for verified impossibility; null for unknown.
 */
export async function annotateTransitTransfers(env,journey,options={}){
 if(!journey||!Array.isArray(journey.legs))return journey;
 const legs=journey.legs.map(l=>({...l}));
 const positions=legs.map((l,i)=>isWalk(l)?-1:i).filter(i=>i>=0);
 if(positions.length<2)return {...journey,legs,transferWalks:[],transferWalkingVerified:true,
  transferFeasible:true,transferCount:0};
 const checks=[],extra=new Map();
 const fetchImpl=options.fetchImpl||fetch;
 const cache=options.cache instanceof Map?options.cache:new Map();
 const safety=Math.max(0,Math.min(10,Number(options.safetyMarginMinutes??3)));
 for(let i=0;i<positions.length-1;i++){
  const at=positions[i],nextAt=positions[i+1],previous=legs[at],next=legs[nextAt];
  const fromStop=String(previous.to||''),toStop=String(next.from||'');
  const start=timed(previous.arrivalTime),depart=timed(next.departureTime);
  const gap=start!==null&&depart!==null?(depart-start)/60000:null;
  const walkingLegs=legs.slice(at+1,nextAt).filter(isWalk);
  const origin=endPoint(previous),destination=startPoint(next);
  const fromId=stopId(previous,'end'),toId=stopId(next,'start');
  const sameStop=Boolean(fromId&&toId&&fromId===toId&&
    (!origin||!destination||distance(origin,destination)<=100));
  const matchingGeometry=walkingLegs.find(w=>endpointMatch(w,origin,destination));
  let route=null;
  if(!sameStop&&matchingGeometry){
   route={verified:true,distanceMeters:matchingGeometry.distanceMeters??null,
    durationMinutes:matchingGeometry.durationMinutes??null,
    coordinates:matchingGeometry.coordinates,source:'operator'};
  }else if(!sameStop&&valid(origin)&&valid(destination)&&
    (distance(origin,destination)>25||walkingLegs.length>0)){
   const key=[origin.latitude.toFixed(5),origin.longitude.toFixed(5),
    destination.latitude.toFixed(5),destination.longitude.toFixed(5)].join(':');
   if(!cache.has(key))cache.set(key,verifiedPedestrianRoute(env,origin,destination,fetchImpl));
   route=await cache.get(key);
  }
  const providerWalkMinutes=walkingLegs.length?walkingLegs.reduce((n,l)=>{
   const a=timed(l.departureTime),b=timed(l.arrivalTime);
   const value=Number.isFinite(+l.durationMinutes)&&l.durationMinutes!==null?+l.durationMinutes:
    a!==null&&b!==null&&b>=a?(b-a)/60000:NaN;
   return Number.isFinite(n)&&Number.isFinite(value)?n+value:NaN;
  },0):null;
  const verifiedWalkMinutes=route&&Number.isFinite(+route.durationMinutes)&&route.durationMinutes!==null?
   +route.durationMinutes:null;
  const effectiveWalk=sameStop?0:verifiedWalkMinutes===null?
   (providerWalkMinutes!==null&&Number.isFinite(providerWalkMinutes)?providerWalkMinutes:null):verifiedWalkMinutes;
  let status=sameStop?'same_stop':route?'verified':
   walkingLegs.length?'provider_timing_only':'unverified';
  if(gap!==null&&(gap<0||(effectiveWalk!==null&&gap+0.01<effectiveWalk+safety)))
   status='impossible';
  const remaining=gap===null||effectiveWalk===null?null:safeMinutes((gap-effectiveWalk)*60000);
  const info={from:fromStop,to:toStop,
   fromStopId:fromId||null,toStopId:toId||null,
   status,availableTransferMinutes:gap===null?null:safeMinutes(gap*60000),
   walkingMinutes:effectiveWalk,walkingDistanceMeters:route?.distanceMeters??null,
   waitingMinutes:remaining,minimumBoardingBufferMinutes:safety,
   pedestrianRouteVerified:Boolean(route),geometryAvailable:Boolean(route?.coordinates?.length>=2),
   coordinates:route?.coordinates||[],
   platformChangeUnverified:true,
   source:route?.source|| (route?'Geoapify pedestrian':walkingLegs.length?'operator walking timetable':'unverified')};
  checks.push(info);
  if(status==='verified'&&walkingLegs.length&&route){
   // Keep provider's scheduled walking leg; supply only verified geometry/distance.
   const firstWalk=legs.findIndex((l,n)=>n>at&&n<nextAt&&isWalk(l));
   if(firstWalk>=0)legs[firstWalk]={...legs[firstWalk],
    coordinates:route.coordinates,geometryAvailable:Boolean(route.coordinates?.length>=2),
    verifiedStreetRoute:true,verifiedWalkingMinutes:verifiedWalkMinutes,
    distanceMeters:route.distanceMeters??legs[firstWalk].distanceMeters,
    transferWalk:true};
  }
  if(status==='verified'&&!walkingLegs.length&&route&&start!==null&&
    verifiedWalkMinutes!==null&&gap>=verifiedWalkMinutes+safety){
   const arrival=start+verifiedWalkMinutes*60000;
   extra.set(at,{mode:'walking',transferWalk:true,verifiedStreetRoute:true,
    from:fromStop,to:toStop,fromStopId:fromId||'',toStopId:toId||'',
    departureTime:new Date(start).toISOString(),arrivalTime:new Date(arrival).toISOString(),
    durationMinutes:verifiedWalkMinutes,distanceMeters:route.distanceMeters,
    coordinates:route.coordinates,geometryAvailable:Boolean(route.coordinates?.length>=2),
    lineNames:[],instruction:'Walking transfer between services'});
  }
 }
 const expanded=[];
 for(let i=0;i<legs.length;i++){
  expanded.push(legs[i]);
  if(extra.has(i))expanded.push(extra.get(i));
 }
 const feasible=checks.some(c=>c.status==='impossible')?false:
  checks.every(c=>c.status==='verified'||c.status==='same_stop')?true:null;
 const pedestrianTransferSegments=expanded.filter(l=>
  l.transferWalk===true&&l.geometryAvailable===true&&Array.isArray(l.coordinates)&&l.coordinates.length>=2)
  .map(l=>({mode:'walking',transferWalk:true,from:l.from,to:l.to,
   distanceMeters:l.distanceMeters??null,durationMinutes:l.verifiedWalkingMinutes??l.durationMinutes??null,
   coordinates:l.coordinates}));
 return {...journey,legs:expanded,transferWalks:checks,
  transferWalkingVerified:feasible===true,transferFeasible:feasible,
  transferCount:positions.length-1,pedestrianTransferSegments,
  transferPedestrianGeometryAvailable:checks.some(c=>c.geometryAvailable)};
}

/** Human-readable detail follows the exact transfer leg; never converts waiting to walking. */
export function describeTransitTransferWalks(journey,language='ro'){
 const english=language==='en';
 const rows=Array.isArray(journey?.transferWalks)?journey.transferWalks:[];
 const text=x=>String(x||'').trim().slice(0,80);
 return rows.map((t,i)=>{
  const from=text(t.from),to=text(t.to);
  const title=english?'Change '+(i+1)+': ':'Schimbare '+(i+1)+': ';
  if(t.status==='same_stop')return title+(english?
   'same stop; check the platform and signs.':'aceeași stație; verifică peronul și indicatoarele.');
  if(t.status==='verified'){
   const dist=t.walkingDistanceMeters===null?'':t.walkingDistanceMeters+' m, ';
   const minutes=t.walkingMinutes===null?'':(english?'about ':'aprox. ')+
    t.walkingMinutes+(english?' min on foot':' min pe jos');
   const wait=t.waitingMinutes===null?'':(english?
    '; then '+t.waitingMinutes+' min to board':' ; apoi '+t.waitingMinutes+' min până la îmbarcare');
   return title+(english?'walk ':'mergi pe jos ')+dist+minutes+
    (english?' from ':' de la ')+from+(english?' to ':' până la ')+to+wait+'.';
  }
  if(t.status==='provider_timing_only')return title+(english?
   'provider indicates a walking transfer, but its street-level map is not verified.':
   'furnizorul indică un transfer pietonal, dar traseul pe străzi nu este verificat.');
  if(t.status==='impossible')return title+(english?
   'insufficient time for the checked pedestrian connection.':
   'nu este timp suficient pentru legătura pietonală verificată.');
  return title+(english?
   'walking transfer not verified; check the platform and route.':
   'traseul pietonal între stații nu este verificat; verifică legătura și peronul.');
 }).join('\n');
}
