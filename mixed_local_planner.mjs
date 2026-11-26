// Reuse the normal deterministic public-transport request pipeline IN PROCESS.
// This is not another HTTP call to the Worker and never starts mixed discovery.
// Memoization is request-scoped: no user's address/GPS is stored globally.
import {beforeTransitAbort} from './transit_deadline.mjs';
const point=p=>p&&p.latitude!=null&&p.longitude!=null&&p.latitude!==''&&p.longitude!==''&&Number.isFinite(+p.latitude)&&
 Number.isFinite(+p.longitude)&&Math.abs(+p.latitude)<=90&&Math.abs(+p.longitude)<=180;
export function createMixedLocalPlanner({env,dispatch,language='ro',maxCalls=12}={}){
 const cache=new Map();let calls=0;
 return async (unused,from,to,limit=4,{departureAt=null,signal=null}={})=>{
  if(!point(from)||!point(to))return {status:'missing_coordinates',journeys:[]};
  if(signal?.aborted)return {status:'search_timeout',journeys:[]};
  const key=[+from.latitude,+from.longitude,+to.latitude,+to.longitude,departureAt||'now'].join('|');
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
     const journeys=Array.isArray(data.transit)?data.transit:[];
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
