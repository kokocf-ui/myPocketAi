// Dated search over an offline-compiled official FlixBus/FlixTrain UTC index.
// No feed download, paid fallback, city hardcode or invented interchange.
import {mixedGreatCircleKm} from './mixed_route_quality.mjs';
export const OPEN_SURFACE_SOURCE='https://gtfs.gis.flix.tech/gtfs_generic_eu.zip';
const stamp=s=>typeof s==='string'&&/(Z|[+-]\d\d:\d\d)$/.test(s)&&Number.isFinite(Date.parse(s))?Date.parse(s):null;
const dayKey=ms=>new Date(ms).toISOString().slice(0,10).replaceAll('-','');
const iso=ms=>new Date(ms).toISOString();
const point=p=>p&&typeof p.latitude==='number'&&typeof p.longitude==='number'&&Number.isFinite(p.latitude)&&Number.isFinite(p.longitude)&&Math.abs(p.latitude)<=90&&Math.abs(p.longitude)<=180;
const validDay=s=>typeof s==='string'&&/^\d{8}$/.test(s)&&new Date(Date.parse(s.slice(0,4)+'-'+s.slice(4,6)+'-'+s.slice(6)+'T00:00:00Z')).toISOString().slice(0,10).replaceAll('-','')===s;
export function validateOpenSurfaceIndex(index,{now=Date.now()}={}){
 try{
  if(index?.schema!==1||index.source!==OPEN_SURFACE_SOURCE||index.timezone!=='UTC'||!/^[a-f0-9]{64}$/.test(index.sourceSha256||'')||
   !validDay(index.validFrom)||!validDay(index.validTo)||index.validTo<index.validFrom||
   !index.attribution||!index.licenseUrl)return 'invalid_index';
  const generated=stamp(index.generatedAt);
  if(generated===null||generated>now+300000||now-generated>7*86400000)return 'stale_index';
  if(!Array.isArray(index.stops)||!index.stops.length||index.stops.length>10000||
   !Array.isArray(index.routes)||index.routes.length>10000||!Array.isArray(index.services)||index.services.length>60000||
   !Array.isArray(index.trips)||index.trips.length>60000)return 'invalid_index';
  if(index.stops.some(s=>!Array.isArray(s)||typeof s[0]!=='string'||s[0].length>100||!s[1]||!point({latitude:s[2],longitude:s[3]}))||
   new Set(index.stops.map(s=>s[0])).size!==index.stops.length)return 'invalid_index';
  if(index.routes.some(r=>!Array.isArray(r)||!r[0]||!r[1]||!['train','coach'].includes(r[3])))return 'invalid_index';
  if(index.services.some(s=>!Array.isArray(s)||!Number.isInteger(s[2])||s[2]<0||s[2]>127||
   !(s[0]===''&&s[1]===''||validDay(s[0])&&validDay(s[1])&&s[1]>=s[0])||
   !s[3]||typeof s[3]!=='object'||Object.entries(s[3]).some(([day,t])=>!validDay(day)||![1,2].includes(t))))return 'invalid_index';
  let count=0;
  for(const t of index.trips){
   if(!Array.isArray(t)||typeof t[0]!=='string'||!Number.isInteger(t[1])||!index.routes[t[1]]||!Number.isInteger(t[2])||!index.services[t[2]]||!Array.isArray(t[3])||t[3].length<2)return 'invalid_index';
   let previous=-1;
   for(const c of t[3]){
    if(++count>600000||!Array.isArray(c)||!Number.isInteger(c[0])||!index.stops[c[0]]||
     !Number.isInteger(c[1])||!Number.isInteger(c[2])||c[1]<previous||c[2]<c[1]||c[2]>=72*3600||![0,1].includes(c[3])||![0,1].includes(c[4]))return 'invalid_index';
    previous=c[2];
   }
  }
  return 'valid';
 }catch{return 'invalid_index'}
}
export function nearbySurfaceStops(index,query,{radiusKm=80,limit=6}={}){
 if(!point(query))return [];
 return index.stops.map((s,i)=>({index:i,id:s[0],label:s[1],latitude:s[2],longitude:s[3],distanceKm:mixedGreatCircleKm(query,{latitude:s[2],longitude:s[3]})}))
  .filter(s=>s.distanceKm!==null&&s.distanceKm<=radiusKm).sort((a,b)=>a.distanceKm-b.distanceKm).slice(0,Math.max(1,Math.min(12,limit)));
}
function active(service,day,weekday){
 const exception=service[3][day];
 return exception===1||exception!==2&&service[0]<=day&&service[1]>=day&&Boolean(service[2]&(1<<weekday));
}
function visibleLeg(index,ride,board,alight){
 const trip=ride.trip,route=index.routes[trip[1]],calls=trip[3],a=calls[board],b=calls[alight];
 const sourcePoint=c=>{const s=index.stops[c[0]];return {latitude:s[2],longitude:s[3]}};
 return {tripId:trip[0],serviceDate:new Date(ride.base).toISOString().slice(0,10),routeId:route[0],operator:route[1],line:route[2],mode:route[3],
  fromStopId:index.stops[a[0]][0],toStopId:index.stops[b[0]][0],from:index.stops[a[0]][1],to:index.stops[b[0]][1],
  departurePoint:sourcePoint(a),arrivalPoint:sourcePoint(b),departureTime:iso(ride.base+a[2]*1000),arrivalTime:iso(ride.base+b[1]*1000),
  stopCount:alight-board,stops:calls.slice(board,alight+1).map(c=>({id:index.stops[c[0]][0],name:index.stops[c[0]][1],
   ...sourcePoint(c),arrivalTime:iso(ride.base+c[1]*1000),departureTime:iso(ride.base+c[2]*1000)}))};
}
// Loaded index is validated ONCE by the asset loader, not on every query.
export function planOpenSurfaceCandidates(index,{
 origin,destination,departureAt,days=3,maxRides=3,transferMinutes=45,now=Date.now(),signal=null,budgetMs=1500
}={}){
 const requested=stamp(departureAt),begun=performance.now();
 if(requested===null||requested<now-120000||requested>now+60*86400000||
  !Number.isInteger(days)||days<1||days>7||!Number.isInteger(maxRides)||maxRides<1||maxRides>4||
  !Number.isInteger(transferMinutes)||transferMinutes<45||transferMinutes>240||!point(origin)||!point(destination))return {status:'invalid_request',candidates:[]};
 const horizon=requested+days*86400000;
 if(dayKey(requested)<index.validFrom||dayKey(horizon)>index.validTo)return {status:'outside_feed_validity',candidates:[]};
 const starts=nearbySurfaceStops(index,origin),ends=nearbySurfaceStops(index,destination,{radiusKm:40});
 const deadline=()=>signal?.aborted||performance.now()-begun>Math.max(1,Math.min(3000,budgetMs));
 const rides=[],midnight=Date.parse(iso(requested).slice(0,10)+'T00:00:00Z');
 for(let delta=-2;delta<=days;delta++){
  if(deadline())return {status:'search_timeout',candidates:[]};
  const base=midnight+delta*86400000,day=dayKey(base),weekday=(new Date(base).getUTCDay()+6)%7;
  const enabled=index.services.map(s=>active(s,day,weekday));
  for(const trip of index.trips){
   const calls=trip[3];
   if(enabled[trip[2]]&&base+calls.at(-1)[1]*1000>=requested&&base+calls[0][2]*1000<=horizon)rides.push({trip,base});
  }
 }
 let labels=new Map(starts.map(s=>[s.index,{time:requested,path:[]}]));
 const found=new Map();
 for(let round=1;round<=maxRides;round++){
  const previous=labels,improved=new Map(labels);
  for(const ride of rides){
   if(deadline())return {status:'search_timeout',candidates:[],searchIncomplete:true};
   const calls=ride.trip[3];let boarded=null;
   for(let i=0;i<calls.length;i++){
    const c=calls[i],arr=ride.base+c[1]*1000,dep=ride.base+c[2]*1000;
    if(boarded&&c[4]&&arr>=requested&&arr<=horizon&&(!improved.has(c[0])||arr<improved.get(c[0]).time)){
     improved.set(c[0],{time:arr,path:[...boarded.path,{ride,board:boarded.index,alight:i}]});
    }
    const prior=previous.get(c[0]);
    if(c[3]&&prior&&dep>=requested&&dep<=horizon&&prior.time+(prior.path.length?transferMinutes*60000:0)<=dep&&
     !prior.path.some(p=>p.ride.trip[0]===ride.trip[0]&&p.ride.base===ride.base)&&(!boarded||prior.path.length<boarded.path.length))boarded={index:i,path:prior.path};
   }
  }
  labels=improved;
  for(const end of ends){
   const value=labels.get(end.index);
   if(value?.path.length===round){
    const key=value.path.map(p=>p.ride.trip[0]+':'+p.ride.base+':'+p.board+':'+p.alight).join('|');
    found.set(key,value);
   }
  }
 }
 const candidates=[...found.values()].sort((a,b)=>a.time-b.time||a.path.length-b.path.length).slice(0,3).map(v=>({
  legs:v.path.map(p=>visibleLeg(index,p.ride,p.board,p.alight)),arrivalTime:iso(v.time),scheduleVerified:true,
  completeDoorToDoor:false,accessVerified:false,egressVerified:false,transferBufferMinutes:transferMinutes,
  transferProtectionVerified:false,seatOrFareVerified:false}));
 return {status:candidates.length?'scheduled_intercity_candidates':'no_candidate_in_loaded_feed_window',
  requestedAt:iso(requested),horizon:iso(horizon),activeTripInstances:rides.length,candidates,
  nearbyOriginCount:starts.length,nearbyDestinationCount:ends.length,searchMs:performance.now()-begun};
}
const loaded=new WeakMap();
export async function loadOpenSurfaceIndex(env,{now=Date.now()}={}){
 if(String(env.OPEN_SURFACE_ENABLED||'')!=='true')return {status:'disabled',index:null};
 const binding=env.OPEN_SURFACE_ASSETS;
 if(!binding?.fetch)return {status:'index_not_configured',index:null};
 if(!loaded.has(binding))loaded.set(binding,(async()=>{
  try{
   const r=await binding.fetch(new Request('https://surface-assets.internal/index.json'));
   if(!r.ok||!r.body)return {status:'index_unavailable',index:null};
   const reader=r.body.getReader(),chunks=[];let bytes=0;
   try{while(true){const {done,value}=await reader.read();if(done)break;bytes+=value.byteLength;if(bytes>20*1024*1024){await reader.cancel();return {status:'index_too_large',index:null}}chunks.push(value)}}finally{reader.releaseLock()}
   const buffer=new Uint8Array(bytes);let at=0;for(const chunk of chunks){buffer.set(chunk,at);at+=chunk.length}
   const index=JSON.parse(new TextDecoder().decode(buffer)),status=validateOpenSurfaceIndex(index,{now});
   return {status:status==='valid'?'ready':status,index:status==='valid'?index:null};
  }catch{return {status:'index_unavailable',index:null}}
 })());
 const result=await loaded.get(binding);
 // Recheck freshness after a warm isolate has lived past the seven-day limit.
 if(result.index&&now-Date.parse(result.index.generatedAt)>7*86400000)return {status:'stale_index',index:null};
 return result;
}
