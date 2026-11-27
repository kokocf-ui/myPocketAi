// Manual Actions proof: actual downloaded feed + actual JS runtime, optionally
// bounded ordinary local checks. No deployment, flight or paid search provider.
import {readFileSync,writeFileSync} from 'node:fs';
import {performance} from 'node:perf_hooks';
import {validateOpenSurfaceIndex,planOpenSurfaceCandidates} from '../open_surface_timetable.mjs';
import {searchOpenSurfaceOptions} from '../mixed_open_surface.mjs';
import {createMixedLocalPlanner} from '../mixed_local_planner.mjs';
import worker from '../backend.js';
const [path,output]=process.argv.slice(2);
const before=performance.now(),index=JSON.parse(readFileSync(path,'utf8'));
const status=validateOpenSurfaceIndex(index);
if(status!=='valid')throw Error(status);
const query={origin:{latitude:51.475,longitude:.325,label:'Public synthetic origin near Grays',country_code:'GB'},
 destination:{latitude:47.0612,longitude:21.9473,label:'Public synthetic final point in Oradea',country_code:'RO'},
 departureAt:'2026-12-03T06:00:00Z',limit:1,budgetMs:18000};
const planned=planOpenSurfaceCandidates(index,query);
if(!planned.candidates.length)throw Error('No actual dated source candidate: '+planned.status);
const report={status:planned.status,indexBytes:readFileSync(path).byteLength,prepareAndSearchMs:performance.now()-before,
 searchMs:planned.searchMs,heapMiB:process.memoryUsage().heapUsed/1048576,rssMiB:process.memoryUsage().rss/1048576,
 counts:Object.fromEntries(['stops','routes','services','trips'].map(k=>[k,index[k].length])),
 sourceSha256:index.sourceSha256,generatedAt:index.generatedAt,source:index.source,planned};
if(process.env.PROBE_LOCAL==='true'){
 let domesticCalls=0,tflHttpCalls=0,egressHttpCalls=0;
 const realFetch=globalThis.fetch;
 // The branch Worker runs in process with no secrets. Only public TfL and
 // exactly one domestic deployed egress request are allowed to leave it.
 globalThis.fetch=async(input,options)=>{
  const u=new URL(typeof input==='string'?input:input.url||String(input));
  if(u.hostname==='api.tfl.gov.uk'){
   if(++tflHttpCalls>10)throw Error('TfL HTTP budget exhausted');
  }else if(u.hostname==='lifewise-ai-v2.kokocf.workers.dev'&&u.pathname==='/api/chat'){
   if(++egressHttpCalls>1)throw Error('Egress HTTP budget exhausted');
  }else throw Error('Forbidden provider '+u.hostname);
  return realFetch(input,options);
 };
 try{
  const domestic=createMixedLocalPlanner({dispatch:worker.fetch,env:{AI:{run:async()=>{throw Error('No LLM allowed')}}}});
  const planner=async(env,from,to,limit,options)=>{
   if(++domesticCalls>3)throw Error('Local query budget exhausted');
   if(to.id!=='surface:destination')return domestic(env,from,to,1,options);
   const response=await fetch('https://lifewise-ai-v2.kokocf.workers.dev/api/chat',{
    method:'POST',signal:options.signal,headers:{'Content-Type':'application/json','Accept':'application/json'},
    body:JSON.stringify({message:'Transport public',module:'maps',language:'ro',history:[],
     location:from,coordinates:from,location_requested:true,journey_origin:from,
     transit_destination:to,transit_query:to.label,transit_departure_at:options.departureAt,transit_count:1,
     mixed_journey:false,mixed_composition:false,national_public_transport:false})
   });
   const data=await response.json();
   report.egressResponse={http:response.status,reason:data.reason,provider:data.transit_provider,providerStatus:data.provider_status,
    routeOnlyCount:data.route_options_without_schedule?.length||0,transportLinesAvailable:data.transport_lines_available,
    reply:String(data.reply||'').slice(0,700)};
   return {status:data.reason||data.status||'unknown',journeys:data.transit||[]};
  };
  const result=await searchOpenSurfaceOptions({},query,{planner,loadIndex:async()=>({status:'ready',index})});
  // Don't lose details in the full artifact, but check annotations stay tiny.
  report.result=result;
  report.localSummary={domesticCalls,tflHttpCalls,egressHttpCalls,status:result.open_surface_status,
   options:(result.scheduled_surface_options||[]).map(o=>({complete:o.completeDoorToDoor,access:o.accessStatus,egress:o.egressStatus,
    accessVerified:o.accessVerified,egressVerified:o.egressVerified,
    requestedAt:query.departureAt,accessDeparture:o.accessJourney?.startDateTime,accessArrival:o.accessJourney?.arrivalDateTime,
    boarding:o.legs[0].departureTime,alighting:o.legs.at(-1).arrivalTime,
    egressDeparture:o.egressJourney?.startDateTime,egressArrival:o.egressJourney?.arrivalDateTime}))};
 }finally{globalThis.fetch=realFetch}
}
writeFileSync(output,JSON.stringify(report,null,2));
const notice=(title,value)=>console.log('::notice title='+title+'::'+JSON.stringify(value).replace(/%/g,'%25').replace(/\r/g,'%0D').replace(/\n/g,'%0A'));
notice('open-surface-runtime',{...report,planned:undefined,result:undefined,egressResponse:undefined});
if(report.egressResponse)notice('open-surface-egress',report.egressResponse);
