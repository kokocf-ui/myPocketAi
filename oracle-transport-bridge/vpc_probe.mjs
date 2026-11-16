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
export async function checkPrivateTransport(env,region){
 const entry=SOURCES[region];
 if(!entry)return {region,status:'invalid_region'};
 const service=env?.[entry.binding];
 if(typeof service?.fetch!=='function')return {region,status:'binding_missing'};
 const origin='http://'+entry.host+':'+entry.port;
 // Health is deliberately unauthenticated on the ORACLE server, but the VPC
 // binding restricts access to the pre-registered target.
 try{
  const res=await service.fetch(origin+'/healthz',{
   method:'GET',signal:AbortSignal.timeout(9000),redirect:'error'});
  if(res.status!==200)return {region,status:'health_http_error',http_status:res.status};
  const data=await res.json();
  if(data?.status!=='ok'||data?.country!==entry.country)
   return {region,status:'wrong_origin'};
 }catch{return {region,status:'health_unavailable'}}
 // Explicitly invalid Authorization tests that the real transport planner
 // rejects unauthenticated calls; it does not execute route planning.
 try{
  const res=await service.fetch(origin+'/v1/plan',{
   method:'POST',
   headers:{Authorization:'Bearer intentionally-invalid-diagnostic-only',
     'Content-Type':'application/json'},
   body:'{}',signal:AbortSignal.timeout(9000),redirect:'error'});
  if(res.status!==401)return {region,status:'unexpected_auth_response',http_status:res.status};
 }catch{return {region,status:'auth_probe_unavailable'}}
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
