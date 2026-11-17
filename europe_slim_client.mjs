// One authenticated Cloudflare Worker -> Oracle Europe Slim bridge.
// No public Oracle ports, no stored GTFS, and no assumed country coverage.
// Rollout is opt-in: EUROPE_SLIM_VPC + TOKEN or an owned HTTPS endpoint + TOKEN.
const isPoint = p => p && p.latitude != null && p.longitude != null &&
 Number.isFinite(Number(p.latitude)) && Number.isFinite(Number(p.longitude)) &&
 Math.abs(Number(p.latitude)) <= 90 && Math.abs(Number(p.longitude)) <= 180;
const isIso = value => typeof value === 'string' &&
 /^\d{4}-\d{2}-\d{2}T\d\d:\d\d(?::\d\d(?:\.\d{1,3})?)?(?:Z|[+-]\d\d:\d\d)$/.test(value) &&
 Number.isFinite(Date.parse(value));

function connection(env, opts={}) {
 const token=String(env?.EUROPE_SLIM_API_TOKEN||'').trim();
 if(token.length<24)return {status:'not_configured'};
 const vpc=env?.EUROPE_SLIM_VPC;
 if(vpc!=null && typeof vpc.fetch!=='function')return {status:'invalid_vpc_binding'};
 const viaVpc=typeof vpc?.fetch==='function';
 const base=viaVpc?'http://europe.pocketai.internal/':String(env?.EUROPE_SLIM_API_URL||'').trim();
 let url;
 try {
  url=new URL(base);
  const secure=viaVpc
   ?url.protocol==='http:'&&url.hostname==='europe.pocketai.internal'
   :url.protocol==='https:'&&(!url.port||url.port==='443') &&
     !/^(?:localhost|127\.|10\.|192\.168\.|169\.254\.|172\.(?:1[6-9]|2\d|3[01])\.)/i.test(url.hostname) &&
     !/^\d+\.\d+\.\d+\.\d+$/.test(url.hostname) &&
     !['api.transitous.org','staging.api.transitous.org'].includes(url.hostname);
  if(!secure||url.username||url.password||url.hash||url.search||url.pathname!=='/')throw Error('endpoint');
 }catch{return {status:'invalid_endpoint'};}
 return {status:'ready',token,base:url,fetchImpl:opts.fetchImpl||
  (viaVpc?vpc.fetch.bind(vpc):fetch)};
}
export function europeSlimConfigured(env) {
 return connection(env).status==='ready';
}
export function europeSlimCountryEnabled(env,country) {
 return europeSlimConfigured(env)&&/^[A-Z]{2}$/.test(country)&&
  String(env?.EUROPE_SLIM_NATIONAL_COUNTRIES||'').split(/[\s,;]+/).includes(country);
}
async function readJsonBounded(res,cap=950000) {
 if(!res.ok)return null;
 const len=Number(res.headers?.get?.('content-length')||0);
 if(len>cap)return null;
 if(!res.body?.getReader){const value=await res.text();return value.length<=cap?JSON.parse(value):null;}
 const rd=res.body.getReader(),pieces=[];let n=0;
 while(true){
  const {value,done}=await rd.read();if(done)break;
  n+=value.byteLength;if(n>cap){await rd.cancel();return null;}pieces.push(value);
 }
 const bytes=new Uint8Array(n);let offset=0;
 for(const part of pieces){bytes.set(part,offset);offset+=part.byteLength;}
 return JSON.parse(new TextDecoder().decode(bytes));
}
async function request(env,path,{method='GET',query=null,payload=null,timeout=11000,fetchImpl=null}={}) {
 const c=connection(env,{fetchImpl});if(c.status!=='ready')return {status:c.status};
 const url=new URL(path,c.base);
 if(query)for(const [k,v] of query.entries())url.searchParams.set(k,v);
 const headers={Authorization:'Bearer '+c.token,Accept:'application/json'};
 if(payload)headers['Content-Type']='application/json';
 try {
  const res=await c.fetchImpl(url.toString(),{method,headers,
   ...(payload?{body:JSON.stringify(payload)}:{}),redirect:'error',
   signal:AbortSignal.timeout(timeout)});
  if(res.status===401||res.status===403)return {status:'authentication_failed'};
  if(res.status===503)return {status:'upstream_unavailable'};
  if(!res.ok)return {status:'upstream_http_error'};
  const data=await readJsonBounded(res);
  return data?{status:'ok',data}:{status:'invalid_response'};
 }catch{return {status:'network_error'};}
}
function verifiedNational(j,startMs){
 if(!j||j.scheduled!==true||j.real_time!==false||
    !isIso(j.startDateTime)||!isIso(j.arrivalDateTime)||
    Date.parse(j.arrivalDateTime)<=Date.parse(j.startDateTime)||
    Date.parse(j.startDateTime)<startMs-120000||
    !Array.isArray(j.legs)||j.legs.length<1||j.legs.length>12)return false;
 let prior=0;
 for(const l of j.legs) {
  if(!l||!isIso(l.departureTime)||!isIso(l.arrivalTime)||
     Date.parse(l.arrivalTime)<=Date.parse(l.departureTime)||
     (prior&&Date.parse(l.departureTime)<prior-60000)||!l.from||!l.to)return false;
  prior=Date.parse(l.arrivalTime);
 }
 return true;
}
/** National source routes are not guaranteed door-to-door until walking access is verified. */
export async function planEuropeSlimNational(env,{country,from,to,departureAt=null,limit=4}={},opts={}) {
 if(!/^[A-Z]{2}$/.test(String(country||''))||!isPoint(from)||!isPoint(to))
  return {status:'invalid_request',journeys:[]};
 if(departureAt&&!isIso(departureAt))return {status:'invalid_departure',journeys:[]};
 const when=departureAt||new Date(opts.now||Date.now()).toISOString();
 const result=await request(env,'/v1/national-plan',{method:'POST',payload:{
  country,from:{latitude:+from.latitude,longitude:+from.longitude},
  to:{latitude:+to.latitude,longitude:+to.longitude},departureAt:when,
  limit:Math.max(1,Math.min(6,Math.floor(limit)||4))
 },timeout:12000,fetchImpl:opts.fetchImpl});
 if(result.status!=='ok')return {status:result.status,journeys:[]};
 if(result.data?.country!==country)return {status:'invalid_country_response',journeys:[]};
 if(result.data?.status!=='success')return {status:String(result.data?.status||'no_verified_journey').slice(0,60),journeys:[]};
 const nowMs=Date.parse(when);
 const journeys=[],sources=[];
 for(const p of Array.isArray(result.data.providers)?result.data.providers.slice(0,8):[]){
  if(p?.status!=='success'||typeof p.source!=='string')continue;
  for(const j of (Array.isArray(p.journeys)?p.journeys:[]).slice(0,8))
   if(verifiedNational(j,nowMs)){journeys.push(j);sources.push(p.source);}
 }
 journeys.sort((a,b)=>Date.parse(a.arrivalDateTime)-Date.parse(b.arrivalDateTime));
 return {status:journeys.length?'success':'no_verified_journey',
  journeys:journeys.slice(0,6),sources:[...new Set(sources)]};
}
/** Only complete, supplier-backed MOTIS v6 itineraries may be returned. */
export async function fetchEuropeSlimMotis(env,params,opts={}) {
 const result=await request(env,'/api/v6/plan',{query:params,fetchImpl:opts.fetchImpl,timeout:14000});
 if(result.status!=='ok')return {status:result.status,data:null};
 if(!Array.isArray(result.data?.itineraries))return {status:'invalid_response',data:null};
 return {status:'success',data:result.data};
}
