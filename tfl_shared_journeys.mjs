import {beforeTransitAbort} from './transit_deadline.mjs';
// One provider-facing TfL journey API adapter shared by all backend entry paths.
// No fabricated journeys; callers remain responsible for destination, walking
// feasibility and transfer validation before showing a confirmed itinerary.
export async function requestTfLJourneys({
 from,to,appKey,appId='',departureAt=null,requestedCount=3,
 auxiliary=false,modes='',includeBusAlternative=false,fetcher=fetch,
 budgetMs=12000,supplementaryBudgetMs=1800,signal:parentSignal=null
}={}){
 if(!from||!to)return {journeys:[],responses:[],status:'not_configured',attempts:[]};
 const base=new URL('https://api.tfl.gov.uk/Journey/JourneyResults/'+from+'/to/'+to);
 if(appKey)base.searchParams.set('app_key',appKey);
 if(appKey&&appId)base.searchParams.set('app_id',appId);
 if(modes)base.searchParams.set('mode',modes);
 if(!auxiliary){
  base.searchParams.set('nationalSearch','true');
  base.searchParams.set('alternativeMetro','true');
  base.searchParams.set('alternativeRoute','true');
  // Many commuters start 20-35 minutes from a rail station. Never restrict
  // the only first attempt to a 20-minute walk.
  base.searchParams.set('maxWalkingMinutes','35');
  base.searchParams.set('maxWalkingMinutesTransfer','12');
  if(departureAt){
   const date=new Date(departureAt);
   if(Number.isFinite(date.getTime())){
    const parts=Object.fromEntries(new Intl.DateTimeFormat('en-GB',{
     timeZone:'Europe/London',year:'numeric',month:'2-digit',day:'2-digit',
     hour:'2-digit',minute:'2-digit',hourCycle:'h23'
    }).formatToParts(date).filter(p=>p.type!=='literal').map(p=>[p.type,p.value]));
    base.searchParams.set('date',parts.year+parts.month+parts.day);
    base.searchParams.set('time',parts.hour+parts.minute);
    base.searchParams.set('timeIs','Departing');
   }
  }
 }
 const attempts=[],responses=[];
 const controller=new AbortController(),signal=controller.signal;
 const cancel=()=>controller.abort();parentSignal?.addEventListener('abort',cancel,{once:true});
 if(parentSignal?.aborted)controller.abort();
 const deadline=Date.now()+Math.max(1,Math.min(12000,Number(budgetMs)||12000));
 let timer=setTimeout(()=>controller.abort(),Math.max(1,deadline-Date.now()));
 try{
 const desired=Math.max(1,Math.min(4,Number(requestedCount)||3));
 const execute=async (preference='',relaxed=false,publicAccess=false,modeOverride='')=>{
  if(signal.aborted)return null;
  const u=new URL(base.toString());
  if(modeOverride)u.searchParams.set('mode',modeOverride);
  if(publicAccess){u.searchParams.delete('app_key');u.searchParams.delete('app_id');}
  if(!auxiliary){
   u.searchParams.set('journeyPreference',preference||'leasttime');
   if(relaxed){
    u.searchParams.set('maxWalkingMinutes','40');
    u.searchParams.set('maxWalkingMinutesTransfer','20');
    u.searchParams.delete('alternativeRoute');
   }
  }
  try{
   const response=await beforeTransitAbort(()=>fetcher(u.toString(),{
    headers:{Accept:'application/json'},signal:AbortSignal.any([signal,AbortSignal.timeout(relaxed?8000:10000)])
   }),signal,null);
   if(!response){attempts.push({mode:modeOverride||modes||'all',status:'search_timeout'});return null;}
   if(!response.ok){
    attempts.push({mode:modeOverride||modes||'all',preference:preference||'default',public:publicAccess||!appKey,status:'http_'+response.status});
    return null;
   }
   const data=await beforeTransitAbort(()=>response.json(),signal,null);
   if(signal.aborted){attempts.push({mode:modeOverride||modes||'all',status:'search_timeout'});return null;}
   if(!Array.isArray(data?.journeys)){
    attempts.push({mode:modeOverride||modes||'all',preference:preference||'default',public:publicAccess||!appKey,status:'invalid_response'});
    return null;
   }
   if((modeOverride||modes)==='bus')data.journeys=data.journeys.filter(j=>
    Array.isArray(j.legs)&&j.legs.some(l=>l.mode?.name==='bus')&&
    j.legs.every(l=>['bus','walking','walk'].includes(l.mode?.name)));
   attempts.push({mode:modeOverride||modes||'all',preference:preference||'default',public:publicAccess||!appKey,status:'ok',count:data.journeys.length});
   responses.push(data);
   return data;
  }catch(error){
   attempts.push({mode:modeOverride||modes||'all',preference:preference||'default',public:publicAccess||!appKey,status:String(error?.name||'network_error').slice(0,50)});
   return null;
  }
 };
 // One bounded bus-only query runs alongside the normal search. It does not
 // relax validation or replace the fastest mixed-mode options.
 const primaryPromise=execute(auxiliary?'':'leasttime');
 const busPromise=includeBusAlternative&&!auxiliary&&!modes?execute('leasttime',false,false,'bus'):null;
 const primary=await primaryPromise;
 // Once useful routes exist, optional preferences/bus diversity must not hold
 // the whole response hostage. Keep anything already received at cancellation.
 if(responses.some(r=>r.journeys.length)){
  clearTimeout(timer);
  timer=setTimeout(()=>controller.abort(),Math.max(1,Math.min(deadline-Date.now(),Number(supplementaryBudgetMs)||1800)));
 }
 const authDenied=Boolean(appKey)&&attempts.some(a=>a.mode===(modes||'all')&&['http_401','http_403'].includes(a.status));
 if(authDenied){
  // TfL permits limited unauthenticated access. One bounded public attempt
  // can recover a deployment with a stale Worker API key; never bypass 429.
  await execute(auxiliary?'':'leasttime',false,true);
 }else if(appKey&&!auxiliary&&(primary?.journeys?.length||0)<desired){
  // Avoid 3 parallel requests on every normal search. The no-key public
  // fallback is deliberately limited to ONE request per user action.
  await Promise.allSettled([execute('leastinterchange'),execute('leastwalking')]);
 }
 if(appKey&&!auxiliary&&!authDenied&&!responses.some(r=>r.journeys.length)){
  await execute('leasttime',true);
 }
 if(busPromise)await busPromise;
 const seen=new Set();
 const journeys=responses.flatMap(r=>r.journeys).filter(j=>{
  const key=JSON.stringify(j);if(seen.has(key))return false;seen.add(key);return true;
 });
 return {journeys,responses,attempts,status:journeys.length
  ?(attempts.some(a=>a.public&&a.count>0)?'ok_public':'ok'):
   attempts.some(a=>a.status==='ok')?'no_journeys_returned':
   attempts.at(-1)?.status||'request_failed'};
 }finally{clearTimeout(timer);parentSignal?.removeEventListener('abort',cancel);controller.abort();}
}
