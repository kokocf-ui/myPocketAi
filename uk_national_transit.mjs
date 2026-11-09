// Optional national door-to-door public transport routing for Great Britain.
// TransCAPI: https://www.transcapi.com/docs/journey
// The API key belongs to the Cloudflare Worker secret TRANSCAPI_API_KEY,
// never to the browser/APK. Do not synthesize timetables or map geometry.
const isPoint=p=>p&&Number.isFinite(Number(p.latitude))&&Number.isFinite(Number(p.longitude))&&Math.abs(Number(p.latitude))<=90&&Math.abs(Number(p.longitude))<=180;
const inGreatBritain=p=>isPoint(p)&&Number(p.latitude)>=49.8&&Number(p.latitude)<=61.0&&Number(p.longitude)>=-8.7&&Number(p.longitude)<=2.0;
const timeValue=x=>typeof x==='string'?x:typeof x?.estimated==='string'?x.estimated:typeof x?.scheduled==='string'?x.scheduled:'';
const parseTime=x=>{const t=Date.parse(timeValue(x));return Number.isFinite(t)?t:null;};
const safeText=(x,n=120)=>typeof x==='string'?x.slice(0,n):'';
const mapMode=x=>{
 const mode=String(x||'').toUpperCase();
 if(['WALK','FOOT','PEDESTRIAN'].includes(mode))return 'walking';
 if(['RAIL','TRAIN','HIGHSPEED_RAIL'].includes(mode))return 'national-rail';
 if(['SUBWAY','UNDERGROUND','TUBE','METRO'].includes(mode))return 'tube';
 if(['BUS','COACH','TRAM','FERRY'].includes(mode))return mode.toLowerCase();
 return '';
};
const location=p=>{
 const lat=p?.latitude,lon=p?.longitude;
 return {commonName:safeText(p?.name),naptanId:safeText(p?.atcocode,48),
  ...(Number.isFinite(lat)&&Number.isFinite(lon)&&Math.abs(lat)<=90&&Math.abs(lon)<=180?{lat,lon}:{})};
};
const clockString=ms=>new Date(ms).toISOString();
function mapItinerary(it,now){
 const first=parseTime(it?.start_time),last=parseTime(it?.end_time);
 if(first===null||last===null||last<=first||first<now-120000||last-first>4*86400000||!Array.isArray(it.legs)||!it.legs.length||it.legs.length>30)return null;
 let cursor=first,walkToFirstStopMinutes=0,hasTransit=false,invalid=false;
 const legs=[];
 for(const raw of it.legs){
  const mode=mapMode(raw?.mode);
  const walk=mode==='walking',durationSeconds=Number(raw?.duration_s);
  if(!mode||!raw?.from?.name||!raw?.to?.name){invalid=true;break;}
  let start=walk?cursor:parseTime(raw.start_time),end=walk?(Number.isFinite(durationSeconds)&&durationSeconds>=0?cursor+Math.round(durationSeconds*1000):null):parseTime(raw.end_time);
  // All public-transport times must come from the provider; walking leg
  // times may be inferred from the provider's own duration and itinerary.
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
   distanceMeters:Number.isFinite(Number(raw.distance_m))?Number(raw.distance_m):null,
   lineNames:line?[line]:[],
   towards:safeText(raw.headsign),
   operator:safeText(raw.route?.operator),
   platform:safeText(raw.platform,20),
   cancelled:/cancelled/i.test(String(raw.status||'')),
   realtime:!walk&&raw.real_time===true,
   schedule_only:walk||raw.real_time!==true,
   fareGBP:!walk&&Number.isFinite(raw.fare)?raw.fare:null,
   coordinates:[],geometryAvailable:false
  });
  cursor=end;
 }
 if(invalid||!hasTransit||!legs.length||Math.abs(last-cursor)>300000||legs.some(l=>l.cancelled))return null;
 const moving=legs.filter(l=>l.mode!=='walking');
 const firstBoard=moving[0];
 const durationMinutes=(last-first)/60000;
 const fare=it.fare&&Number.isFinite(Number(it.fare.amount_gbp))?Number(it.fare.amount_gbp):null;
 return {
  provider:'TransCAPI',
  time_zone:'Europe/London',durationMinutes,
  startDateTime:clockString(first),arrivalDateTime:clockString(last),
  legs,routeSegments:[],geometryAvailable:false,
  firstVehicleDepartureTime:firstBoard.departureTime,walkToFirstStopMinutes,
  transferCount:Math.max(0,moving.length-1),
  departureFeasible:Date.parse(firstBoard.departureTime)>=now+walkToFirstStopMinutes*60000-120000,
  fareGBP:fare,fareComplete:it.fare?.complete===true,
  nextAvailable:false
 };
}
export async function planUKNationalJourney(env,from,to,limit=4){
 const key=String(env?.TRANSCAPI_API_KEY||'').trim();
 if(!key)return {status:'not_configured',journeys:[]};
 if(!inGreatBritain(from)||!inGreatBritain(to))return {status:'outside_coverage',journeys:[]};
 const url=new URL('https://api.transcapi.com/v1/journey.json');
 url.searchParams.set('from_lat',String(from.latitude));url.searchParams.set('from_lon',String(from.longitude));
 url.searchParams.set('to_lat',String(to.latitude));url.searchParams.set('to_lon',String(to.longitude));
 url.searchParams.set('transit_modes','tram,rail');
 url.searchParams.set('modes','');url.searchParams.set('include_steps','true');
 url.searchParams.set('include_fares','true');url.searchParams.set('include_live','true');
 url.searchParams.set('limit',String(Math.min(4,Math.max(1,Number(limit)||4))));
 let response,payload;
 try{
  response=await fetch(url.toString(),{headers:{'X-Api-Key':key,'Accept':'application/json'},signal:AbortSignal.timeout(14000)});
  if(!response.ok)return {status:response.status===429?'quota_exceeded':response.status===422?'outside_coverage':'http_'+response.status,journeys:[]};
  payload=await response.json();
 }catch{return {status:'unavailable',journeys:[]};}
 if(!Array.isArray(payload?.itineraries))return {status:'invalid_response',journeys:[]};
 const now=Date.now(),seen=new Set(),journeys=[];
 for(const candidate of payload.itineraries.slice(0,20)){
  const j=mapItinerary(candidate,now);
  if(!j||!j.departureFeasible)continue;
  const signature=j.legs.filter(l=>l.mode!=='walking').map(l=>[l.mode,l.from,l.to,l.departureTime,...l.lineNames].join('|')).join('~');
  if(seen.has(signature))continue;
  seen.add(signature);j.nextAvailable=payload.next_available===true;journeys.push(j);
 }
 journeys.sort((a,b)=>Date.parse(a.startDateTime)-Date.parse(b.startDateTime)||Date.parse(a.arrivalDateTime)-Date.parse(b.arrivalDateTime));
 return {status:journeys.length?'success':'no_usable_journeys',journeys:journeys.slice(0,Math.min(4,Math.max(1,Number(limit)||4)))};
}
