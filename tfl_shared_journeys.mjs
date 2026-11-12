// One provider-facing TfL journey API adapter shared by all backend entry paths.
// No fabricated journeys; callers remain responsible for destination, walking
// feasibility and transfer validation before showing a confirmed itinerary.
export async function requestTfLJourneys({
 from,to,appKey,appId='',departureAt=null,requestedCount=3,
 auxiliary=false,modes='',fetcher=fetch
}={}){
 if(!from||!to)return {journeys:[],responses:[],status:'not_configured',attempts:[]};
 const base=new URL('https://api.tfl.gov.uk/Journey/JourneyResults/'+from+'/to/'+to);
 if(appKey)base.searchParams.set('app_key',appKey);
 if(appKey&&appId)base.searchParams.set('app_id',appId);
 if(auxiliary){
  if(modes)base.searchParams.set('mode',modes);
 }else{
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
 const desired=Math.max(1,Math.min(4,Number(requestedCount)||3));
 const execute=async (preference='',relaxed=false,publicAccess=false)=>{
  const u=new URL(base.toString());
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
   const response=await fetcher(u.toString(),{
    headers:{Accept:'application/json'},signal:AbortSignal.timeout(relaxed?8000:10000)
   });
   if(!response.ok){
    attempts.push({preference:preference||'default',public:publicAccess||!appKey,status:'http_'+response.status});
    return null;
   }
   const data=await response.json();
   if(!Array.isArray(data?.journeys)){
    attempts.push({preference:preference||'default',public:publicAccess||!appKey,status:'invalid_response'});
    return null;
   }
   attempts.push({preference:preference||'default',public:publicAccess||!appKey,status:'ok',count:data.journeys.length});
   responses.push(data);
   return data;
  }catch(error){
   attempts.push({preference:preference||'default',public:publicAccess||!appKey,status:String(error?.name||'network_error').slice(0,50)});
   return null;
  }
 };
 const primary=await execute(auxiliary?'':'leasttime');
 const authDenied=Boolean(appKey)&&['http_401','http_403'].includes(attempts.at(-1)?.status);
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
 const journeys=responses.flatMap(r=>r.journeys);
 return {journeys,responses,attempts,status:journeys.length
  ?(attempts.some(a=>a.public&&a.count>0)?'ok_public':'ok'):
   attempts.some(a=>a.status==='ok')?'no_journeys_returned':
   attempts.at(-1)?.status||'request_failed'};

}
