import {beforeTransitAbort} from './transit_deadline.mjs';
// Reuse the SAME coordinate-to-coordinate public transport planner used for
// ordinary street addresses. A dated flight changes the ARRIVAL DEADLINE;
// it does not require a different, airport-specific route search engine.
const point=p=>p&&p.latitude!=null&&p.longitude!=null&&
 Number.isFinite(Number(p.latitude))&&Number.isFinite(Number(p.longitude))&&
 Math.abs(Number(p.latitude))<=90&&Math.abs(Number(p.longitude))<=180;
const stamp=s=>typeof s==='string'&&Number.isFinite(Date.parse(s))?Date.parse(s):null;

export function selectFixedPointConnection(journeys,{
 earliestDeparture,latestArrival
}={}){
 const early=stamp(earliestDeparture),late=stamp(latestArrival);
 if(early===null||late===null||late<=early)return null;
 return (Array.isArray(journeys)?journeys:[]).filter(j=>{
  const a=stamp(j?.startDateTime),b=stamp(j?.arrivalDateTime);
  return a!==null&&b!==null&&a>=early-120000&&b<=late&&b>=a&&
   Array.isArray(j.legs)&&j.legs.length>0;
 }).sort((a,b)=>Date.parse(b.arrivalDateTime)-Date.parse(a.arrivalDateTime)||
   Date.parse(b.startDateTime)-Date.parse(a.startDateTime))[0]||null;
}

/** A local transport journey to an exact coordinate (airport, station, terminal).
 * Search near the boarding deadline, not 6 hours before the flight where a
 * provider's first four results are too early to make the connection.
 *
 * The operator/terminal identity must already be known; the coordinates are
 * not guessed from a city name. Searches run at initial offer generation,
 * never when the user opens the selected card.
 */
export async function planFixedPointBoardingAccess(env,{
 origin,boardingPoint,earliestDeparture,latestArrival,limit=4
}={},{
 planner,now=Date.now(),signal=null
}={}){
 if(!point(origin)||!point(boardingPoint))return {
  status:'fixed_point_unverified',journey:null,attemptedAt:[]
 };
 const earliest=stamp(earliestDeparture),deadline=stamp(latestArrival);
 if(earliest===null||deadline===null||deadline<=earliest+300000||
    deadline<now-120000)return {status:'boarding_deadline_infeasible',
      journey:null,attemptedAt:[]};
 if(typeof planner!=='function')return {
  status:'local_transport_not_configured',journey:null,attemptedAt:[]
 };
 // Near-by provider searches are more useful than a midnight search for a
 // 06:00 flight. Each one remains bounded to four source-backed options.
 const candidates=[deadline-4*3600000,deadline-2*3600000]
  .map(v=>Math.max(earliest,now-120000,v))
  .filter((v,i,all)=>v<deadline-300000&&all.indexOf(v)===i);
 if(!candidates.length)return {status:'boarding_deadline_infeasible',
  journey:null,attemptedAt:[]};
 const attemptedAt=candidates.map(ms=>new Date(ms).toISOString());
 const samples=await Promise.allSettled(attemptedAt.map(departureAt=>
  signal?beforeTransitAbort(()=>planner(env,origin,boardingPoint,limit,{departureAt,signal}),signal,
   {status:'search_timeout',journeys:[]},{status:'provider_unavailable',journeys:[]}):planner(env,origin,boardingPoint,limit,{departureAt})));
 const journeys=samples.flatMap(r=>r.status==='fulfilled'&&Array.isArray(r.value?.journeys)?
  r.value.journeys:[]);
 const chosen=selectFixedPointConnection(journeys,{
  earliestDeparture:new Date(earliest).toISOString(),
  latestArrival:new Date(deadline).toISOString()
 });
 return {status:chosen?'scheduled_connection_found':signal?.aborted?'search_timeout':samples.some(r=>
   r.status==='fulfilled'&&r.value?.status==='not_configured')?
   'local_transport_not_configured':'no_connection_before_boarding',
  journey:chosen,attemptedAt};
}
