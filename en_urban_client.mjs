// Optional English local bus/urban GTFS source (BODS / licensed operator feed).
// Complements TfL and TransCAPI; does NOT replace nationwide rail itinerary planning.
import {verifiedRouteOnlyOptions} from './transport_route_topology.mjs';
import {inEnglandApprox,pointDistanceMeters} from './regional_gtfs_registry.mjs';
export function englandLocalGtfsRegion(from,to){
 if(!inEnglandApprox(from)||!inEnglandApprox(to))return null;
 return pointDistanceMeters(from,to)<=80000?'england':null;
}
export async function planEnglandLocalGtfs(env,{from,to,departureAt=null,limit=4}={},opts={}){
 const region=englandLocalGtfsRegion(from,to);
 if(!region)return {status:'outside_supported_english_regions',journeys:[]};
 // Preferred: private Workers VPC Service -> Cloudflare Tunnel -> Oracle loopback.
 // No owned domain, public hostname or Cloudflare Access token is required.
 // The VPC Service binding itself restricts the internal host and port.
 const vpc=env?.EN_URBAN_VPC;
 const useVPC=Boolean(vpc);
 if(useVPC&&typeof vpc.fetch!=='function')
  return {status:'invalid_vpc_binding',journeys:[],region};
 const base=useVPC?'http://england.pocketai.internal/':String(env?.EN_URBAN_API_URL||'').trim();
 const token=String(env?.EN_URBAN_API_TOKEN||'').trim();
 if(!base||token.length<32)return {status:'not_configured',journeys:[],region};
 const accessId=useVPC?'':String(env?.EN_URBAN_ACCESS_CLIENT_ID||'').trim();
 const accessSecret=useVPC?'':String(env?.EN_URBAN_ACCESS_CLIENT_SECRET||'').trim();
 if(Boolean(accessId)!==Boolean(accessSecret))
  return {status:'invalid_access_config',journeys:[],region};
 const authHeaders={Authorization:'Bearer '+token,'Content-Type':'application/json','Accept':'application/json'};
 if(accessId){authHeaders['CF-Access-Client-Id']=accessId;authHeaders['CF-Access-Client-Secret']=accessSecret;}
 let url;
 try{
  url=new URL(base);
  if((useVPC?(url.protocol!=='http:'||url.hostname!=='england.pocketai.internal'):url.protocol!=='https:')||url.username||url.password||url.search||url.hash||
     !url.hostname||(url.pathname!=='/'&&url.pathname!==''))throw Error('bad_endpoint');
  url.pathname='/v1/plan';
 }catch{return {status:'invalid_endpoint_config',journeys:[],region};}
 const when=departureAt?new Date(departureAt):new Date();
 if(Number.isNaN(when.getTime()))return {status:'invalid_departure',journeys:[],region};
 const p=Object.fromEntries(new Intl.DateTimeFormat('en-GB',{
  timeZone:'Europe/London',year:'numeric',month:'2-digit',day:'2-digit',
  hour:'2-digit',minute:'2-digit',hourCycle:'h23'
 }).formatToParts(when).map(x=>[x.type,x.value]));
 try{
  const requestFetch=useVPC?vpc.fetch.bind(vpc):(opts.fetchImpl||fetch);
  const res=await requestFetch(url.toString(),{
   method:'POST',
   headers:authHeaders,
   body:JSON.stringify({region,from:{latitude:+from.latitude,longitude:+from.longitude},
    to:{latitude:+to.latitude,longitude:+to.longitude},date:p.year+'-'+p.month+'-'+p.day,
    afterHHMM:p.hour+':'+p.minute,maxResults:Math.max(1,Math.min(6,Math.floor(limit)||4))}),
   signal:AbortSignal.timeout(6500)
  });
  if(res.status===401||res.status===403)return {status:'auth_failed',journeys:[],region};
  if(res.status===503)return {status:'feed_not_loaded',journeys:[],region};
  if(!res.ok)return {status:'provider_http_error',journeys:[],region};
  const data=await res.json();
  if(!['success','route_only','no_verified_itinerary','no_nearby_gtfs_stop','no_service_on_date'].includes(data?.status))
   return {status:'invalid_response',journeys:[],region};
  if(data.status==='route_only'){
   const rows=Array.isArray(data.journeys)?data.journeys:[];
   const keys=new Set(verifiedRouteOnlyOptions(rows,'GB').map(x=>
     [x.mode,x.line,x.boarding_stop_id,x.alighting_stop_id].join('|')));
   const journeys=rows.filter(j=>{
    const l=j?.legs?.[0];return l&&keys.has([l.mode,l.lineNames?.[0],l.fromStopId,l.toStopId].join('|'));
   }).slice(0,6);
   return {status:journeys.length?'route_only':'invalid_route_only',journeys,region};
  }
  const journeys=(Array.isArray(data.journeys)?data.journeys:[]).filter(j=>
   Array.isArray(j.legs)&&j.legs.length>0&&j.legs.length<=2&&
   j.scheduled===true&&j.real_time===false&&
   j.legs.every(l=>l.from&&l.to&&Number.isFinite(Date.parse(l.departureTime))&&
    Number.isFinite(Date.parse(l.arrivalTime))&&Date.parse(l.arrivalTime)>Date.parse(l.departureTime))
  ).slice(0,6);
  return {status:journeys.length?'ok':data.status,journeys,region};
 }catch{return {status:'network_error',journeys:[],region};}
}
