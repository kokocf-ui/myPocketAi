// Read-only Cloudflare Workers VPC diagnostic for the Oracle transport bridge.
// Used only by a loopback-bound Wrangler development server in GitHub Actions.
// NO production Worker is deployed and NO Oracle authentication secret is used.
const SOURCES=Object.freeze({
 RO:{binding:'RO_URBAN_VPC',host:'127.0.0.1',port:8766,country:'RO'},
 GB:{binding:'EN_URBAN_VPC',host:'127.0.0.1',port:8768,country:'GB'}
});
const json=(body,status=200)=>new Response(JSON.stringify(body),{
 status,
 headers:{'Content-Type':'application/json; charset=utf-8',
  'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}
});
// Do not emit raw remote exception messages (which may contain private data).
// Return only documented Cloudflare connection error identifiers.
const VPC_ERRORS=new Set(['connection_refused','connection_terminated','connection_timeout',
 'connection_limit_reached','destination_unavailable','destination_not_found',
 'destination_ip_prohibited','destination_ip_unroutable','proxy_loop_detected',
 'dns_error','dns_timeout','tls_protocol_error','tls_certificate_error',
 'connection_read_timeout','connection_write_timeout','rate_limited']);
function safeVPCError(e){
 const raw=String(e?.code||'')+' '+String(e?.message||'');
 const value=raw.match(/(?:^|[^a-z_])(connection_refused|connection_terminated|connection_timeout|connection_limit_reached|destination_unavailable|destination_not_found|destination_ip_prohibited|destination_ip_unroutable|proxy_loop_detected|dns_error|dns_timeout|tls_protocol_error|tls_certificate_error|connection_read_timeout|connection_write_timeout|rate_limited)(?=$|[^a-z_])/i)?.[1]?.toLowerCase();
 return VPC_ERRORS.has(value)?value:'unclassified';
}
function safeErrorClass(e){
 const name=String(e?.name||'');
 // The class name is an allowlisted primitive, not the exception message.
 return ['TypeError','Error','DOMException','TimeoutError','AbortError','NetworkError','ReferenceError'].includes(name)?name:'Other';
}
function safeDiagnosticMessage(e){
 const raw=String(e?.message||'');
 // Strip any hostname, URL, IPv4/IPv6 literals, high-entropy values,
 // JWTs, and quoted strings before outputting a bounded diagnostic.
 return raw
  .replace(/https?:\/\/[^\s'"]+/gi,'[URL]')
  .replace(/(?:\d{1,3}\.){3}\d{1,3}/g,'[IP]')
  .replace(/eyJ[A-Za-z0-9._-]+/g,'[REDACTED]')
  .replace(/Bearer\s+[^\s'"]+/gi,'Bearer [REDACTED]')
  .replace(/[a-f0-9]{8}-[a-f0-9-]{20,}/gi,'[ID]')
  .replace(/['"][^'"]{8,}['"]/g,'[QUOTED]')
  .replace(/[A-Za-z0-9_=-]{24,}/g,'[REDACTED]')
  .slice(0,180);
}
function safeMessageCategory(e){
 const m=String(e?.message||'').toLowerCase();
 if(m.includes('proxyerror'))return 'proxy_error';
 if(m.includes('fetch failed'))return 'fetch_failed';
 if(m.includes('failed to fetch'))return 'failed_to_fetch';
 if(m.includes('invalid url'))return 'invalid_url';
 if(m.includes('internal error'))return 'internal_error';
 if(m.includes('vpc'))return 'vpc_related';
 if(m.includes('not supported'))return 'not_supported';
 if(m.includes('connection'))return 'connection_related';
 if(m.includes('network'))return 'network_related';
 if(m.includes('timed out'))return 'timed_out';
 if(m.includes('host'))return 'host_related';
 if(m.includes('request'))return 'request_related';
 return 'other';
}
function safeCauseCode(e){
 const code=String(e?.cause?.code||e?.code||'');
 return /^[a-z_0-9-]{1,48}$/i.test(code)?code:'none';
}
export async function checkPrivateTransport(env,region){
 const entry=SOURCES[region];
 if(!entry)return {region,status:'invalid_region'};
 const service=env?.[entry.binding];
 if(typeof service?.fetch!=='function')return {region,status:'binding_missing'};
 // The registered VPC Service overrides host/port. Avoid loopback URL special handling
 // in the local Wrangler runtime, while preserving the destination's HTTP port.
 const origin='http://'+(region==='RO'?'romania.pocketai.internal':'england.pocketai.internal')+':'+entry.port;
 // Health is deliberately unauthenticated on the ORACLE server, but the VPC
 // binding restricts access to the pre-registered target.
 try{
  const res=await service.fetch(origin+'/healthz',{
   method:'GET',signal:AbortSignal.timeout(9000),redirect:'error'});
  if(res.status!==200)return {region,status:'health_http_error',http_status:res.status};
  const data=await res.json();
  if(data?.status!=='ok'||data?.country!==entry.country)
   return {region,status:'wrong_origin'};
 }catch(e){return {region,status:'health_unavailable',vpc_error:safeVPCError(e),error_class:safeErrorClass(e),cause_code:safeCauseCode(e),message_category:safeMessageCategory(e),safe_message:safeDiagnosticMessage(e)}}
 // Explicitly invalid Authorization tests that the real transport planner
 // rejects unauthenticated calls; it does not execute route planning.
 try{
  const res=await service.fetch(origin+'/v1/plan',{
   method:'POST',
   headers:{Authorization:'Bearer intentionally-invalid-diagnostic-only',
     'Content-Type':'application/json'},
   body:'{}',signal:AbortSignal.timeout(9000),redirect:'error'});
  if(res.status!==401)return {region,status:'unexpected_auth_response',http_status:res.status};
 }catch(e){return {region,status:'auth_probe_unavailable',vpc_error:safeVPCError(e)}}
 return {region,status:'ok',vpc_reachable:true,oracle_health:true,
  bearer_auth_enforced:true,token_values_verified:false,
  real_journey_verified:false};
}
export default {
 async fetch(request,env){
  const url=new URL(request.url);
  if(request.method!=='GET'||url.pathname!=='/probe')
   return json({status:'not_found'},404);
  const region=url.searchParams.get('region')||'';
  if(!Object.hasOwn(SOURCES,region))return json({status:'invalid_region'},400);
  const result=await checkPrivateTransport(env,region);
  return json(result,result.status==='ok'?200:503);
 }
};
