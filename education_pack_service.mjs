// A separately deployable, read-only Education asset service. The frontend
// accesses it through a service binding so Android keeps same-origin URLs.
// Asset publication must never deploy the frontend or the backend.
const allowedPath=/^(?:\/education\/practical\/course-v1\/(?:finance|trades|business|digital|career|daily)\.json|\/education\/languages\/resources-v1\/[a-z]{2}(?:-[A-Za-z]+)?\.json|\/education\/study-v1\/(?:math|physics|chemistry|biology)\.json|\/packs\/p-[0-9a-f]{24}\.json|\/education\/literature\/profiles\/[A-Z-]+\.json|\/education\/(?:literature|history|geography|computing|math|physics|chemistry|biology)\/authored\/catalog\.json|\/education\/(?:literature|history|geography|computing|math|physics|chemistry|biology)\/authored\/[A-Z-]+\/[A-Za-z0-9_-]+\.json|\/education\/math\/supplements\/[A-Z-]+\.json|\/education\/science\/review\/RO\.json|\/education\/science\/shared-v2\/(?:physics|chemistry|biology|astronomy)\.json)$/;
export default {
 async fetch(request,env){
  if(request.method!=='GET'&&request.method!=='HEAD')return new Response('Method not allowed',{status:405,headers:{Allow:'GET, HEAD'}});
  const url=new URL(request.url);
  if(!allowedPath.test(url.pathname))return new Response('Not found',{status:404});
  if(!env?.ASSETS)return new Response('Education asset binding unavailable',{status:503});
  const asset=await env.ASSETS.fetch(new Request(url,{method:request.method}));
  if(asset.status===404)return new Response('Education pack not found',{status:404});
  if(asset.status!==200)return new Response('Education asset binding unavailable',{status:503});
  const headers=new Headers(asset.headers);
  headers.set('Content-Type','application/json; charset=utf-8');
  headers.set('Cache-Control','no-store');
  headers.set('X-Content-Type-Options','nosniff');
  return new Response(request.method==='HEAD'?null:asset.body,{status:200,headers});
 }
};
