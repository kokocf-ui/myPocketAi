// Keyed, optional public-transport routing for TransCAPI's separate planning areas.
// Important: GB, island of Ireland, and NL+BE are NOT one connected graph.
// TransCAPI documents https://www.transcapi.com/docs/journey and /docs/reference.
// Keep the key on the Worker, never in browser/APK. Missing data is never guessed.
const isPoint=p=>p&&Number.isFinite(Number(p.latitude))&&Number.isFinite(Number(p.longitude))&&Math.abs(Number(p.latitude))<=90&&Math.abs(Number(p.longitude))<=180;
const safeText=(x,n=120)=>typeof x==='string'?x.slice(0,n):'';
const timeValue=x=>typeof x==='string'?x:typeof x?.estimated==='string'?x.estimated:typeof x?.scheduled==='string'?x.scheduled:'';
const parseTime=x=>{const t=Date.parse(timeValue(x));return Number.isFinite(t)?t:null;};
const inRange=(p,latMin,latMax,lonMin,lonMax)=>Number(p.latitude)>=latMin&&Number(p.latitude)<=latMax&&Number(p.longitude)>=lonMin&&Number(p.longitude)<=lonMax;

// Conservative coordinate routing zones, *not* country boundary databases.
// Geographic edges can be imprecise; the provider's 422 outside_coverage is authoritative.
export function transCAPIPlanningZone(p){
 if(!isPoint(p))return null;
 const lat=Number(p.latitude),lon=Number(p.longitude);
 // Ireland, including Northern Ireland. Prioritise this over the overlapping GB bbox.
 if(inRange(p,51.2,55.6,-11,-5.35)&&(lat<55.1||lon<=-6.0))return 'ireland';
 // Netherlands and Belgium share a planning graph.
 if(inRange(p,49.4,53.7,2.3,7.4))return 'benelux';
 if(inRange(p,49.8,61.0,-8.7,2.0))return 'gb';
 return null;
}
export function transCAPISharedZone(from,to){
 const zone=transCAPIPlanningZone(from);
 return zone&&zone===transCAPIPlanningZone(to)?zone:null;
}
const defaultZone={gb:'Europe/London',ireland:'Europe/Dublin',benelux:'Europe/Amsterdam'};
const acceptedZones=new Set(['Europe/London','Europe/Dublin','Europe/Amsterdam','Europe/Brussels']);
const mapMode=x=>{
 const mode=String(x||'').toUpperCase();
 if(['WALK','FOOT','PEDESTRIAN'].includes(mode))return 'walking';
 if(['RAIL','TRAIN','HIGHSPEED_RAIL'].includes(mode))return 'national-rail';
 if(['SUBWAY','UNDERGROUND','TUBE','METRO'].includes(mode))return 'tube';
 if(['BUS','COACH','TRAM','FERRY'].includes(mode))return mode.toLowerCase();
 return '';
};
const location=p=>{
 const lat=Number(p?.latitude),lon=Number(p?.longitude);
 return {commonName:safeText(p?.name),naptanId:safeText(p?.atcocode,48),
  ...(p?.latitude!=null&&p?.longitude!=null&&Number.isFinite(lat)&&Number.isFinite(lon)&&Math.abs(lat)<=90&&Math.abs(lon)<=180?{lat,lon}:{})};
};
const clockString=ms=>new Date(ms).toISOString();
function mapItinerary(it,now,timeZone,zone){
 const first=parseTime(it?.start_time),last=parseTime(it?.end_time);
 if(first===null||last===null||last<=first||first<now-120000||last-first>4*86400000||!Array.isArray(it.legs)||!it.legs.length||it.legs.length>30)return null;
 let cursor=first,walkToFirstStopMinutes=0,hasTransit=false,invalid=false;
 const legs=[];
 for(const raw of it.legs){
  const mode=mapMode(raw?.mode);
  const walk=mode==='walking';
  const durationSeconds=Number(raw?.duration_s);
  if(!mode||!raw?.from?.name||!raw?.to?.name){invalid=true;break;}
  const start=walk?(parseTime(raw.start_time)??cursor):parseTime(raw.start_time);
  const end=walk?(parseTime(raw.end_time)??(Number.isFinite(durationSeconds)&&durationSeconds>=0?start+Math.round(durationSeconds*1000):null)):parseTime(raw.end_time);
  // For any vehicle, both departure and arrival must be provided and valid.
  // Walking times may be derived only from that walking leg's provider duration.
  if(start===null||end===null||start<cursor-90000||end<start||end>last+120000){invalid=true;break;}
  if(!walk)hasTransit=true;
  else if(!hasTransit)walkToFirstStopMinutes+=(end-start)/60000;
  const from=location(raw.from),to=location(raw.to);
  const line=safeText(raw.route?.line||raw.route?.name,65);
  legs.push({
   mode,from:from.commonName,to:to.commonName,
   departurePoint:from,arrivalLatLon:Number.isFinite(to.lat)&&Number.isFinite(to.lon)?{lat:to.lat,lon:to.lon}:null,
   departureTime:clockString(start),arrivalTime:clockString(end),
   scheduledDepartureTime:!walk?safeText(raw.start_time?.scheduled,42):null,
   scheduledArrivalTime:!walk?safeText(raw.end_time?.scheduled,42):null,
   durationMinutes:(end-start)/60000,
   distanceMeters:raw.distance_m!==null&&raw.distance_m!==undefined&&Number.isFinite(Number(raw.distance_m))?Number(raw.distance_m):null,
   lineNames:line?[line]:[],
   towards:safeText(raw.headsign),operator:safeText(raw.route?.operator),
   platform:safeText(raw.platform,20),tripId:safeText(raw.trip_id,90),
   cancelled:/^(cancelled|partly_cancelled)$/i.test(String(raw.status||'')),
   realtime:!walk&&raw.real_time===true,
   schedule_only:walk||raw.real_time!==true,
   fareGBP:zone==='gb'&&typeof raw.fare==='number'&&Number.isFinite(raw.fare)?raw.fare:null,
   fareLocal:raw.fare_local?.currency==='EUR'&&Number.isFinite(Number(raw.fare_local.amount))?{currency:'EUR',amount:Number(raw.fare_local.amount)}:null,
   coordinates:[],geometryAvailable:false // never fabricate a map polyline
  });
  cursor=end;
 }
 if(invalid||!hasTransit||!legs.length||Math.abs(last-cursor)>300000||legs.some(l=>l.cancelled))return null;
 const moving=legs.filter(l=>l.mode!=='walking'),firstBoard=moving[0];
 const boardIndex=legs.indexOf(firstBoard),beforeBoard=legs[boardIndex-1];
 const departure=firstBoard.departurePoint;
 // Prefer the vehicle stop's own coordinates. If absent, the provider's
 // final walking waypoint can identify it ONLY when its name matches.
 const matchingWalk=beforeBoard?.mode==='walking'&&beforeBoard.to===firstBoard.from?beforeBoard:null;
 const boardingCoordinates=Number.isFinite(departure?.lat)&&Number.isFinite(departure?.lon)?
   {latitude:departure.lat,longitude:departure.lon}:
   matchingWalk?.arrivalLatLon&&Number.isFinite(matchingWalk.arrivalLatLon.lat)&&Number.isFinite(matchingWalk.arrivalLatLon.lon)?
   {latitude:matchingWalk.arrivalLatLon.lat,longitude:matchingWalk.arrivalLatLon.lon}:null;
 const boarding_stop=boardingCoordinates?{
   ...boardingCoordinates,label:firstBoard.from,
   stop_id:departure.naptanId||matchingWalk?.departurePoint?.naptanId||'',
   line_names:firstBoard.lineNames,departure_time:firstBoard.departureTime,
   towards:firstBoard.towards,indicator:firstBoard.platform||''
 }:null;
 const fare=zone==='gb'&&it.fare?.amount_gbp!==null&&it.fare?.amount_gbp!==undefined&&Number.isFinite(Number(it.fare.amount_gbp))?Number(it.fare.amount_gbp):null;
 return {
  provider:'TransCAPI',region:zone,time_zone:timeZone,durationMinutes:(last-first)/60000,
  startDateTime:clockString(first),arrivalDateTime:clockString(last),
  legs,routeSegments:[],geometryAvailable:false,
  firstVehicleDepartureTime:firstBoard.departureTime,walkToFirstStopMinutes,
  boarding_stop,safetyMarginMinutes:5,
  transferCount:Math.max(0,moving.length-1),
  departureFeasible:Date.parse(firstBoard.departureTime)>=now+(walkToFirstStopMinutes+5)*60000,
  fareGBP:fare,fareComplete:fare!==null&&it.fare?.complete===true,
  nextAvailable:false
 };
}
export async function planTransCAPIJourney(env,from,to,limit=4,options={}){
 const preference=options?.preference==='bus_only'?'bus_only':'all';
 const departureOffsetMinutes=[0,60,120].includes(Number(options?.departureOffsetMinutes))?Number(options.departureOffsetMinutes):0;
 const key=String(env?.TRANSCAPI_API_KEY||'').trim();
 if(!key)return {status:'not_configured',journeys:[]};
 const zone=transCAPISharedZone(from,to);
 if(!zone)return {status:'outside_coverage',journeys:[]};
 const url=new URL('https://api.transcapi.com/v1/journey.json');
 url.searchParams.set('from_lat',String(from.latitude));url.searchParams.set('from_lon',String(from.longitude));
 url.searchParams.set('to_lat',String(to.latitude));url.searchParams.set('to_lon',String(to.longitude));
 // TransCAPI always searches bus and coach; empty transit_modes means ONLY bus/coach.
 url.searchParams.set('transit_modes',preference==='bus_only'?'':'tram,rail');
 if(departureOffsetMinutes)url.searchParams.set('datetime',new Date(Date.now()+departureOffsetMinutes*60000).toISOString());
 url.searchParams.set('modes','');url.searchParams.set('include_steps','true');
 url.searchParams.set('include_fares','true');url.searchParams.set('include_live','true');
 url.searchParams.set('limit',String(Math.min(4,Math.max(1,Number(limit)||4))));
 let response,payload;
 try{
  response=await fetch(url.toString(),{headers:{'X-Api-Key':key,'Accept':'application/json'},signal:AbortSignal.timeout(14000)});
  if(!response.ok)return {status:response.status===429?'quota_exceeded':response.status===422?'outside_coverage':response.status===503?'provider_unavailable':'http_'+response.status,journeys:[]};
  payload=await response.json();
 }catch{return {status:'unavailable',journeys:[]};}
 if(!Array.isArray(payload?.itineraries))return {status:'invalid_response',journeys:[]};
 const timeZone=acceptedZones.has(payload.timezone)?payload.timezone:defaultZone[zone];
 const now=Date.now(),seen=new Set(),journeys=[];
 for(const candidate of payload.itineraries.slice(0,20)){
  const j=mapItinerary(candidate,now,timeZone,zone);
  if(!j||!j.departureFeasible)continue;
  if(preference==='bus_only'&&j.legs.some(l=>l.mode!=='walking'&&l.mode!=='bus'&&l.mode!=='coach'))continue;
  const signature=j.legs.filter(l=>l.mode!=='walking').map(l=>[l.mode,l.from,l.to,l.departureTime,...l.lineNames].join('|')).join('~');
  if(seen.has(signature))continue;
  seen.add(signature);j.nextAvailable=payload.next_available===true;journeys.push(j);
 }
 journeys.sort((a,b)=>Date.parse(a.startDateTime)-Date.parse(b.startDateTime)||Date.parse(a.arrivalDateTime)-Date.parse(b.arrivalDateTime));
 return {status:journeys.length?'success':'no_usable_journeys',region:zone,preference,departureOffsetMinutes,journeys:journeys.slice(0,Math.min(4,Math.max(1,Number(limit)||4)))};
}
// Preserve the existing UK adapter API for previous tests and integrations.
export const planUKNationalJourney=planTransCAPIJourney;
