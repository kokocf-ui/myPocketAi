// One request, one search. Streaming never polls or replays a transport query.
export function mixedProgressResponse(request,run,ctx){
 const controller=new AbortController(),encoder=new TextEncoder();
 let ended=false,streamController,timer;
 const stop=()=>controller.abort();
 const cleanup=()=>{clearTimeout(timer);request.signal?.removeEventListener('abort',stop)};
 const send=(type,data,status)=>{
  if(ended)return;
  try{streamController.enqueue(encoder.encode(JSON.stringify({type,data,...(status?{status}:{})})+'\n'))}catch{ended=true;stop();cleanup()}
 };
 const body=new ReadableStream({
  start(c){
   streamController=c;
   request.signal?.addEventListener('abort',stop,{once:true});
   if(request.signal?.aborted)stop();
   send('started',{});
   timer=setTimeout(()=>{send('error',{error:'mixed_search_timeout'});stop();if(!ended){ended=true;c.close()}cleanup()},64000);
   const work=(async()=>{
    try{
     const response=await run(data=>{if(!controller.signal.aborted)send('progress',data)},controller.signal);
     if(!controller.signal.aborted)send('result',await response.json(),response.status);
    }catch{if(!controller.signal.aborted)send('error',{error:'mixed_search_interrupted'})}
    finally{cleanup();if(!ended){ended=true;c.close()}}
   })();
   ctx?.waitUntil?.(work);
  },
  cancel(){ended=true;stop();cleanup()}
 });
 return new Response(body,{headers:{'Content-Type':'application/x-ndjson; charset=utf-8',
  'Cache-Control':'no-store, no-transform','X-Content-Type-Options':'nosniff',
  'Access-Control-Allow-Origin':'*'}});
}

// Self-contained: also embedded unchanged into the generated Android HTML.
export async function readMixedProgressResponse(response,onProgress,signal){
 if(!response.headers.get('content-type')?.includes('application/x-ndjson'))return response.json();
 const reader=response.body.getReader(),decoder=new TextDecoder();
 let pending='',last=null,final=null,finished=false;
 const abort=()=>{reader.cancel().catch(()=>{})};
 signal?.addEventListener('abort',abort,{once:true});
 const consume=line=>{
  if(!line.trim())return;
  const event=JSON.parse(line);
  if(event.type==='progress'){
   last={...(last||{}),...event.data};onProgress?.(last);
  }else if(event.type==='result'){
   if(event.status>=400)throw Error(event.data?.error||'HTTP '+event.status);
   final=event.data;finished=true;
  }else if(event.type==='error')throw Error(event.data?.error||'mixed_search_interrupted');
 };
 try{
  if(signal?.aborted)throw Error('mixed_search_cancelled');
  while(true){
   const {value,done}=await reader.read();
   if(signal?.aborted)throw Error('mixed_search_cancelled');
   pending+=decoder.decode(value||new Uint8Array(),{stream:!done});
   if(pending.length>4000000)throw Error('mixed_stream_too_large');
   let end;
   while((end=pending.indexOf('\n'))>=0){consume(pending.slice(0,end));pending=pending.slice(end+1)}
   if(done){if(pending.trim())consume(pending);break}
  }
  if(!finished)throw Error('mixed_search_interrupted');
  return final;
 }catch(error){
  // Preserve source-backed progress on transport interruption, not on explicit
  // user cancellation. Do not silently present an interrupted search as final.
  if(!signal?.aborted&&last&&['transit','operator_options','ground_connections','flight_candidates'].some(k=>last[k]?.length))
   return {...last,status:'success',reply:last.reply||'Partial mixed transport results',mixed_search_incomplete:true};
  throw error;
 }finally{signal?.removeEventListener('abort',abort);await reader.cancel().catch(()=>{});reader.releaseLock()}
}
export const MIXED_PROGRESS_CLIENT_SCRIPT=readMixedProgressResponse.toString();
