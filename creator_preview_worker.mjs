// Isolated, explicitly low-volume creator image preview.
// Never deploy on production lifewise-ai-api. 3 images/day and 30 images lifetime.
const ORIGIN='https://lifewise-ai-v2.kokocf.workers.dev';
const DAILY_MAX=3, LIFETIME_MAX=30;
const json=(body,status=200,extra={})=>new Response(JSON.stringify(body),{status,headers:{
 'content-type':'application/json; charset=utf-8','cache-control':'no-store',
 'Access-Control-Allow-Origin':ORIGIN,
 'Access-Control-Allow-Methods':'OPTIONS, POST',
 'Access-Control-Allow-Headers':'Content-Type, X-Pocket-Preview',
 'Vary':'Origin',
 'X-Content-Type-Options':'nosniff',...extra}});
export class CreatorPreviewQuota {
 constructor(state,env){this.state=state;this.env=env}
 async fetch(request){
  if(request.method!=='POST')return json({error:'method_not_allowed'},405);
  const day=new Date().toISOString().slice(0,10);
  let result={ok:false,remaining:0,reason:'quota_exhausted'};
  await this.state.storage.transaction(async tx=>{
   const lifetime=Number(await tx.get('lifetime')||0);
   const today=Number(await tx.get('day:'+day)||0);
   if(lifetime>=LIFETIME_MAX||today>=DAILY_MAX)return;
   await tx.put('lifetime',lifetime+1);
   await tx.put('day:'+day,today+1);
   result={ok:true,remaining:DAILY_MAX-today-1,lifetimeRemaining:LIFETIME_MAX-lifetime-1};
  });
  return json(result,result.ok?200:429);
 }
}
export default {
 async fetch(request,env){
  const url=new URL(request.url);
  const origin=request.headers.get('Origin');
  if(url.pathname!=='/image')return json({error:'not_found'},404);
  if(origin!==ORIGIN)return json({error:'origin_not_allowed'},403);
  if(request.method==='OPTIONS')return new Response(null,{status:204,headers:{
   'Access-Control-Allow-Origin':ORIGIN,'Access-Control-Allow-Methods':'POST, OPTIONS',
   'Access-Control-Allow-Headers':'Content-Type, X-Pocket-Preview','Access-Control-Max-Age':'600'
  }});
  if(request.method!=='POST')return json({error:'method_not_allowed'},405);
  if(request.headers.get('X-Pocket-Preview')!=='1')return json({error:'preview_only'},403);
  if(!env.AI||typeof env.AI.run!=='function')return json({error:'ai_unavailable'},503);
  if(Number(request.headers.get('content-length')||0)>2048)return json({error:'too_large'},413);
  const payload=await request.json().catch(()=>null);
  const prompt=String(payload?.prompt||'').trim();
  if(prompt.length<8||prompt.length>500)return json({error:'invalid_prompt'},400);
  const quota=await env.CREATOR_PREVIEW_QUOTA.get(env.CREATOR_PREVIEW_QUOTA.idFromName('global')).fetch('https://quota.internal/claim',{method:'POST'});
  const q=await quota.json();
  if(!q.ok)return json({error:'preview_limit_reached',remaining:0},429);
  try{
   const result=await env.AI.run('@cf/black-forest-labs/flux-1-schnell',{prompt,steps:4});
   const image=String(result?.image||'');
   if(image.length<500||image.length>7500000||!/^[A-Za-z0-9+/]+={0,2}$/.test(image))throw Error('invalid_model_image');
   return json({status:'success',image:'data:image/jpeg;base64,'+image,remaining:q.remaining,engine:'flux-1-schnell',preview:true},200);
  }catch(error){
   const quotaExceeded=/4006|daily free allocation|neuron/i.test(String(error?.message||''));
   return json({status:'unavailable',error:quotaExceeded?'workers_ai_free_limit':'image_generation_unavailable'},quotaExceeded?429:503);
  }
 }
};
