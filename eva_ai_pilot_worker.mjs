// Temporary Cloudflare Wrangler preview worker for synthetic model evaluation.
// Not deployed as an application service. Authenticate every inference request.
const MODELS=new Set([
 '@cf/meta/llama-3.1-8b-instruct-fast',
 '@cf/meta/llama-3.3-70b-instruct-fp8-fast',
 '@cf/openai/gpt-oss-120b'
]);
const json=(data,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
export default {
 async fetch(request,env){
  const url=new URL(request.url);
  if(url.pathname==='/health'&&request.method==='GET')
   return json({ok:true,ai_binding:Boolean(env.AI&&typeof env.AI.run==='function')});
  if(url.pathname!=='/infer'||request.method!=='POST')return json({error:'not_found'},404);
  const auth=request.headers.get('X-Eva-Pilot');
  if(!env.PILOT_SECRET||!auth||auth!==env.PILOT_SECRET)return json({error:'forbidden'},403);
  if(Number(request.headers.get('content-length')||0)>5000)return json({error:'too_large'},413);
  const data=await request.json().catch(()=>null);
  if(!data||!MODELS.has(data.model)||
    typeof data.system!=='string'||typeof data.user!=='string'||
    data.system.length>1300||data.user.length>1600||
    !Number.isInteger(data.max_tokens)||data.max_tokens>440||data.max_tokens<50||
    typeof data.temperature!=='number'||data.temperature<0||data.temperature>1)
   return json({error:'invalid_request'},400);
  if(!env.AI||typeof env.AI.run!=='function')return json({error:'ai_binding_missing'},503);
  try{
   const output=await env.AI.run(data.model,{
    messages:[{role:'system',content:data.system},{role:'user',content:data.user}],
    max_tokens:data.max_tokens,temperature:data.temperature
   });
   return json({success:true,result:output});
  }catch(e){
   const error=String(e?.message||'').toLowerCase();
   const status=/quota|daily.limit|rate limit|429|4006/.test(error)?429:
    /permission|not allowed|unauthoriz|forbidden|403|5035/.test(error)?403:
    /model not found|unknown model|404/.test(error)?404:503;
   return json({error:status===429?'quota':status===403?'permission':status===404?'model_not_found':'inference_failed'},status);
  }
 }
};
