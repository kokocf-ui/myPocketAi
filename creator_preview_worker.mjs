// Isolated creator test service. No production API changes.
// Hard caps: images 3/day, 30 lifetime; AI sites 6/day, 40 lifetime.
const ORIGIN='https://lifewise-ai-v2.kokocf.workers.dev';
const DAILY_MAX=3, LIFETIME_MAX=30, SITE_DAILY_MAX=6, SITE_LIFETIME_MAX=40;
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
  const kind=String((await request.json().catch(()=>({})))?.kind||'image')==='site'?'site':'image';
  const dailyMax=kind==='site'?SITE_DAILY_MAX:DAILY_MAX;
  const lifetimeMax=kind==='site'?SITE_LIFETIME_MAX:LIFETIME_MAX;
  const prefix=kind==='site'?'site:':'';
  const day=new Date().toISOString().slice(0,10);
  let result={ok:false,remaining:0,reason:'quota_exhausted'};
  await this.state.storage.transaction(async tx=>{
   const lifetime=Number(await tx.get(prefix+'lifetime')||0);
   const today=Number(await tx.get(prefix+'day:'+day)||0);
   if(lifetime>=lifetimeMax||today>=dailyMax)return;
   await tx.put(prefix+'lifetime',lifetime+1);
   await tx.put(prefix+'day:'+day,today+1);
   result={ok:true,remaining:dailyMax-today-1,lifetimeRemaining:lifetimeMax-lifetime-1};
  });
  return json(result,result.ok?200:429);
 }
}
export default {
 async fetch(request,env){
  const url=new URL(request.url);
  const origin=request.headers.get('Origin');
  if(url.pathname!=='/image'&&url.pathname!=='/site')return json({error:'not_found'},404);
  const site=url.pathname==='/site';
  if(origin!==ORIGIN)return json({error:'origin_not_allowed'},403);
  if(request.method==='OPTIONS')return new Response(null,{status:204,headers:{
   'Access-Control-Allow-Origin':ORIGIN,'Access-Control-Allow-Methods':'POST, OPTIONS',
   'Access-Control-Allow-Headers':'Content-Type, X-Pocket-Preview','Access-Control-Max-Age':'600'
  }});
  if(request.method!=='POST')return json({error:'method_not_allowed'},405);
  if(request.headers.get('X-Pocket-Preview')!=='1')return json({error:'preview_only'},403);
  if(!env.AI||typeof env.AI.run!=='function')return json({error:'ai_unavailable'},503);
  if(Number(request.headers.get('content-length')||0)>(site?4096:2048))return json({error:'too_large'},413);
  const payload=await request.json().catch(()=>null);
  const prompt=String(payload?.prompt||'').trim();
  if(!site&&(prompt.length<8||prompt.length>500))return json({error:'invalid_prompt'},400);
  const name=String(payload?.name||'').trim().slice(0,120),description=String(payload?.description||'').trim().slice(0,1700),style=String(payload?.style||'').trim().slice(0,180);
  const kind=String(payload?.kind||'other').slice(0,35);
  const lang=['ro','en','both'].includes(payload?.lang)?payload.lang:'ro';
  if(site&&(name.length<2||description.length<15))return json({error:'invalid_business_details'},400);
  const quota=await env.CREATOR_PREVIEW_QUOTA.get(env.CREATOR_PREVIEW_QUOTA.idFromName('global')).fetch('https://quota.internal/claim',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({kind:site?'site':'image'})});
  const q=await quota.json();
  if(!q.ok)return json({error:'preview_limit_reached',remaining:0},429);
  if(site){
   try{
    const reply=await env.AI.run('@cf/meta/llama-3.1-8b-instruct-fast',{
     messages:[
      {role:'system',content:'You are Eva, a professional website copywriter. Produce only ONE valid JSON object, no markdown. Required structure: {"ro":{"headline":"...","intro":"...","about":"...","services":[{"title":"...","detail":"..."}]},"en":{"headline":"...","intro":"...","about":"...","services":[{"title":"...","detail":"..."}]}}. Only include language(s) requested. Reorganize owner facts into distinct attractive sections; NEVER invent locations, prices, room counts, photos, reviews or certifications. Headline under 80 chars; intro under 250; about under 400; at most 4 services.'},
      {role:'user',content:JSON.stringify({business:name,category:kind,language:lang,visual_style:style,verified_facts:description,english_facts:String(payload?.english||'').slice(0,1000)})}
     ],temperature:0.2,max_tokens:1600
    });
    const text=String(reply?.response||reply?.result?.response||'').trim().slice(0,14500);
    if(text.length<30)return json({error:'site_ai_empty'},502);
    return json({status:'success',reply:text,preview:true,remaining:q.remaining});
   }catch(error){
    const quotaExceeded=/4006|daily free allocation|neuron/i.test(String(error?.message||''));
    return json({error:quotaExceeded?'workers_ai_free_limit':'site_ai_unavailable'},quotaExceeded?429:503);
   }
  }
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
