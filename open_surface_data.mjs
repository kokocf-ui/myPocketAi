// Public derivative database access if the feature is explicitly configured.
// Only one constant asset path: no URLs/user GPS/keys are forwarded or stored.
export async function openSurfaceDataResponse(request,env){
 if(String(env.OPEN_SURFACE_ENABLED||'')!=='true'||!env.OPEN_SURFACE_ASSETS?.fetch)return new Response('Not configured',{status:404});
 if(!['GET','HEAD'].includes(request.method))return new Response('Method not allowed',{status:405,headers:{Allow:'GET, HEAD'}});
 try{
  const r=await env.OPEN_SURFACE_ASSETS.fetch(new Request('https://surface-assets.internal/index.json',{method:request.method}));
  if(!r.ok)return new Response('Index unavailable',{status:503});
  return new Response(r.body,{headers:{'Content-Type':'application/json; charset=utf-8','Access-Control-Allow-Origin':'*',
   'X-Content-Type-Options':'nosniff','Content-Disposition':'inline; filename="open-surface-index.json"',
   'Cache-Control':'public, max-age=3600',
   Link:'<https://opendatacommons.org/licenses/odbl/1-0/>; rel="license"'}});
 }catch{return new Response('Index unavailable',{status:503})}
}
