// Cloudflare Worker -> private Romanian urban GTFS router adapter.
// Never send precise coordinates unless routed within a verified Romanian region.
// The endpoint MUST be HTTPS and protected by a private bearer token.
const CITIES=[
 {region:'oradea',lat:47.0465,lon:21.9189,radius:25000},
 {region:'cluj',lat:46.7712,lon:23.6236,radius:30000},
 {region:'iasi',lat:47.1585,lon:27.6014,radius:27000},
 {region:'bucharest',lat:44.4268,lon:26.1025,radius:48000}
];
function valid(point){
 const lat=Number(point?.latitude),lon=Number(point?.longitude);
 return point&&point.latitude!==null&&point.longitude!==null&&
   Number.isFinite(lat)&&Number.isFinite(lon)&&Math.abs(lat)<=90&&Math.abs(lon)<=180;
}
function distance(lat1,lon1,lat2,lon2){
 const rad=Math.PI/180,p1=lat1*rad,p2=lat2*rad;
 const h=Math.sin((p2-p1)/2)**2+Math.cos(p1)*Math.cos(p2)*Math.sin(((lon2-lon1)*rad)/2)**2;
 return 6371000*2*Math.atan2(Math.sqrt(h),Math.sqrt(Math.max(0,1-h)));
}
export function romanianUrbanRegion(from,to){
 if(!valid(from)||!valid(to))return null;
 for(const city of CITIES){
  const nearby=[from,to].every(p=>distance(+p.latitude,+p.longitude,city.lat,city.lon)<=city.radius);
  if(nearby)return city.region;
 }
 return null;
}
export async function planRomanianUrbanViaOracle(env,{from,to,departureAt=null,limit=4}={},opts={}){
 const region=romanianUrbanRegion(from,to);
 if(!region)return {status:'outside_supported_urban_regions',journeys:[]};
 const base=String(env?.RO_URBAN_API_URL||'').trim();
 const token=String(env?.RO_URBAN_API_TOKEN||'').trim();
 if(!base||token.length<32)return {status:'not_configured',journeys:[],region};
 let url;
 try{
  url=new URL(base);
  if(url.protocol!=='https:'||url.username||url.password||url.search||url.hash||
     !url.hostname||url.pathname!=='/'&&url.pathname!=='')throw Error('bad_endpoint');
  url.pathname='/v1/plan';
 }catch{return {status:'invalid_endpoint_config',journeys:[],region}}
 const requested=departureAt?new Date(departureAt):new Date();
 if(Number.isNaN(requested.getTime()))return {status:'invalid_departure',journeys:[],region};
 const parts=Object.fromEntries(new Intl.DateTimeFormat('en-GB',{
  timeZone:'Europe/Bucharest',year:'numeric',month:'2-digit',day:'2-digit',
  hour:'2-digit',minute:'2-digit',hourCycle:'h23'
 }).formatToParts(requested).map(p=>[p.type,p.value]));
 const date=parts.year+'-'+parts.month+'-'+parts.day;
 const afterHHMM=parts.hour+':'+parts.minute;
 try{
  const fetchImpl=opts.fetchImpl||fetch;
  const res=await fetchImpl(url.toString(),{
   method:'POST',headers:{Authorization:'Bearer '+token,'Content-Type':'application/json','Accept':'application/json'},
   body:JSON.stringify({region,from:{latitude:+from.latitude,longitude:+from.longitude},
    to:{latitude:+to.latitude,longitude:+to.longitude},date,afterHHMM,
    maxResults:Math.max(1,Math.min(6,Math.floor(limit)||4))}),
   signal:AbortSignal.timeout(6500)
  });
  if(res.status===401||res.status===403)return {status:'auth_failed',journeys:[],region};
  if(res.status===503)return {status:'feed_not_loaded',journeys:[],region};
  if(!res.ok)return {status:'provider_http_error',journeys:[],region};
  const data=await res.json();
  if(!['success','no_verified_itinerary','no_nearby_gtfs_stop','no_service_on_date'].includes(data?.status))
   return {status:'invalid_response',journeys:[],region};
  const journeys=(Array.isArray(data.journeys)?data.journeys:[]).filter(j=>{
   if(!Array.isArray(j.legs)||j.legs.length<1||j.legs.length>2||!j.scheduled||j.real_time!==false)return false;
   if(j.legs.some(l=>!l.from||!l.to||!l.departureTime||!l.arrivalTime||
     !Number.isFinite(Date.parse(l.departureTime))||!Number.isFinite(Date.parse(l.arrivalTime))))return false;
   return j.legs.every(l=>Date.parse(l.arrivalTime)>Date.parse(l.departureTime));
  }).slice(0,6);
  return {status:journeys.length?'ok':data.status,journeys,region};
 }catch{return {status:'network_error',journeys:[],region}}
}