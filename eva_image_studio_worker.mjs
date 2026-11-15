/** Eva Image Studio preview (standalone Cloudflare Worker).
 * Zero photo persistence. Do not use as paid quota until auth is server verified.
 */
export const IMAGE_MODEL = '@cf/black-forest-labs/flux-2-klein-4b';
export const MAX_POST_BYTES = 1250000;
export const DEFAULT_DAILY_LIMIT = 3;
function json(data,status=200) {
  return new Response(status===204?null:JSON.stringify(data),{status,headers:{
    'content-type':'application/json; charset=utf-8','cache-control':'no-store',
    'access-control-allow-origin':'*','access-control-allow-methods':'GET, POST, OPTIONS',
    'access-control-allow-headers':'content-type','x-content-type-options':'nosniff'}});
}
function int(v,fallback,min,max) {
  const n=Number(v);return Number.isInteger(n)&&n>=min&&n<=max?n:fallback;
}
function size(data) {
  if(data.format==='portrait')return [720,1280];
  if(data.format==='wide')return [1280,720];
  if(data.format==='original'){
    const w=int(data.width,480,1,4096),h=int(data.height,480,1,4096),scale=Math.min(1280/w,1280/h);
    return [Math.max(256,Math.round(w*scale/32)*32),Math.max(256,Math.round(h*scale/32)*32)];
  }
  return [1024,1024];
}
function decodeImage(value) {
  if(typeof value!=='string'||value.length>950000)throw Error('image_too_large');
  const m=/^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/]+={0,2})$/.exec(value);
  if(!m||m[2].length<100)throw Error('invalid_image');
  let data;try {data=Uint8Array.from(atob(m[2]),c=>c.charCodeAt(0));}catch{throw Error('invalid_image');}
  if(data.length>720000)throw Error('image_too_large');
  const jpeg=data[0]===255&&data[1]===216,png=data[0]===137&&data[1]===80&&data[2]===78&&data[3]===71;
  const webp=new TextDecoder().decode(data.slice(0,4))==='RIFF'&&new TextDecoder().decode(data.slice(8,12))==='WEBP';
  if(!jpeg&&!png&&!webp)throw Error('invalid_image');
  return new Blob([data],{type:jpeg?'image/jpeg':png?'image/png':'image/webp'});
}
function outputMime(value){
  let raw;try{raw=atob(value.slice(0,80));}catch{throw Error('model_no_image');}
  if(raw.charCodeAt(0)===255&&raw.charCodeAt(1)===216)return 'image/jpeg';
  if(raw.charCodeAt(0)===137&&raw.slice(1,4)==='PNG')return 'image/png';
  if(raw.slice(0,4)==='RIFF'&&raw.slice(8,12)==='WEBP')return 'image/webp';
  throw Error('model_no_image');
}
export async function forwardToModel(ai,data,mode){
  const prompt=String(data.prompt??'').trim();
  if(prompt.length<8||prompt.length>1400)throw Error('invalid_prompt');
  if(!['square','portrait','wide','original'].includes(data.format)||mode==='generate'&&data.format==='original')throw Error('invalid_format');
  if(mode==='edit'&&!data.image)throw Error('image_required');
  const form=new FormData();
  form.append('prompt',mode==='edit'?'Edit the reference photo according to this request: '+prompt+'. Preserve details not requested for modification.':prompt);
  const [width,height]=size(data);
  form.append('width',String(width));form.append('height',String(height));
  if(mode==='edit')form.append('input_image_0',decodeImage(data.image),'reference.jpg');
  const payload=new Response(form);
  const result=await ai.run(IMAGE_MODEL,{multipart:{body:payload.body,contentType:payload.headers.get('content-type')}});
  const encoded=result?.image??result?.result?.image;
  if(typeof encoded!=='string'||encoded.length<100||encoded.length>7000000)throw Error('model_no_image');
  return {status:'success',image:'data:'+outputMime(encoded)+';base64,'+encoded,mode,model:IMAGE_MODEL};
}
export const CLIENT_DAILY_LIMIT_DEFAULT=3;
export const GLOBAL_DAILY_LIMIT_DEFAULT=300;
export const PENDING_TTL_MS=180000;
const clientValid=value=>typeof value==='string'&&/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
const quotaDate=()=>new Date().toISOString().slice(0,10);
const resetTime=day=>new Date(Date.parse(day+'T00:00:00Z')+86400000).toISOString();
const stateClean=(value,now)=>{
 const used=Number.isInteger(value?.used)&&value.used>=0?value.used:0;
 const pending=Array.isArray(value?.pending)?value.pending.filter(x=>typeof x.id==='string'&&Number.isFinite(x.t)&&now-x.t<PENDING_TTL_MS&&x.t<=now+60000):[];
 return {used,pending};
};
export class ImageQuota{
 constructor(state,env){this.state=state;this.env=env;}
 async fetch(request){
  const path=new URL(request.url).pathname;
  if(request.method!=='POST'||!['/snapshot','/reserve','/complete','/cancel','/legacy-reserve'].includes(path))return json({error:'not_found'},404);
  let payload;try{payload=await request.json()}catch{return json({error:'invalid_request'},400)}
  const day=quotaDate();
  if(path==='/legacy-reserve'){
   const limit=int(this.env.DAILY_IMAGE_LIMIT,3,1,20);
   const allowed=await this.state.storage.transaction(async t=>{
    const used=Number(await t.get(day)||0);
    if(used>=limit)return false;
    await t.put(day,used+1);return true;
   });
   return json({allowed,limit,scope:'legacy_shared_preview'});
  }
  const installationId=payload?.installationId;
  if(!clientValid(installationId))return json({error:'invalid_installation_id'},400);
  const userKey=day+':installation:'+installationId;
  const globalKey=day+':global';
  const individualLimit=int(this.env.PER_INSTALL_DAILY_LIMIT,CLIENT_DAILY_LIMIT_DEFAULT,1,30);
  const globalLimit=int(this.env.PREVIEW_GLOBAL_DAILY_MAX,GLOBAL_DAILY_LIMIT_DEFAULT,1,10000);
  const result=await this.state.storage.transaction(async t=>{
   const now=Date.now();
   const usr=stateClean(await t.get(userKey),now);
   const all=stateClean(await t.get(globalKey),now);
   const ownAvailable=Math.max(0,individualLimit-usr.used-usr.pending.length);
   const poolAvailable=Math.max(0,globalLimit-all.used-all.pending.length);
   let error=null, ticket=null;
   if(path==='/reserve'){
    if(!ownAvailable)error='installation_limit_reached';
    else if(!poolAvailable)error='preview_capacity_reached';
    else{
     ticket=crypto.randomUUID();
     usr.pending.push({id:ticket,t:now});
     all.pending.push({id:ticket,t:now});
     await t.put(userKey,usr);await t.put(globalKey,all);
    }
   }else if(path==='/complete'||path==='/cancel'){
    const token=payload?.ticket;
    if(typeof token!=='string'||token.length>64)return {error:'invalid_ticket'};
    const ui=usr.pending.findIndex(p=>p.id===token),gi=all.pending.findIndex(p=>p.id===token);
    if(ui<0||gi<0)return {error:'reservation_expired'};
    usr.pending.splice(ui,1);all.pending.splice(gi,1);
    if(path==='/complete'){usr.used++;all.used++;}
    await t.put(userKey,usr);await t.put(globalKey,all);
   }
   const available=Math.min(Math.max(0,individualLimit-usr.used-usr.pending.length),
     Math.max(0,globalLimit-all.used-all.pending.length));
   return {error,ticket,quota:{
    scope:'installation_preview',dailyLimit:individualLimit,used:usr.used,remaining:available,
    personalRemaining:Math.max(0,individualLimit-usr.used-usr.pending.length),resetAt:resetTime(day),
    capacityLimited:globalLimit-all.used-all.pending.length<=0
   }};
  });
  return json(result,result.error?['installation_limit_reached','preview_capacity_reached'].includes(result.error)?429:409:200);
 }
}
async function quotaRequest(env,path,data){
 const stub=env.IMAGE_QUOTA.get(env.IMAGE_QUOTA.idFromName('global-preview'));
 const response=await stub.fetch('https://quota.internal/'+path,{
  method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(data)
 });
 const result=await response.json();
 if(!response.ok&&path!=='reserve')throw Error('quota_unavailable');
 return result;
}
async function parseInput(request,path){
 if(request.headers.get('content-type')?.split(';')[0]!=='application/json')throw Error('content_type_required');
 if(Number(request.headers.get('content-length')||0)>MAX_POST_BYTES)throw Error('payload_too_large');
 const raw=await request.text();
 if(new TextEncoder().encode(raw).length>MAX_POST_BYTES)throw Error('payload_too_large');
 let data;try{data=JSON.parse(raw)}catch{throw Error('invalid_request')}
 if(!data||typeof data!=='object'||Array.isArray(data))throw Error('invalid_request');
 if(path==='/quota'){
  if(!clientValid(data.installationId))throw Error('invalid_installation_id');
  return data;
 }
 const prompt=String(data.prompt??'').trim();
 if(prompt.length<8||prompt.length>1400)throw Error('invalid_prompt');
 if(!['square','portrait','wide','original'].includes(data.format)||path==='/generate'&&data.format==='original')throw Error('invalid_format');
 if(path==='/edit')decodeImage(data.image);
 if(data.installationId!==undefined&&!clientValid(data.installationId))throw Error('invalid_installation_id');
 return data;
}
export default {async fetch(request,env){
 const path=new URL(request.url).pathname;
 if(request.method==='OPTIONS')return json({},204);
 if(path==='/health'&&request.method==='GET')return json({ok:true,service:'eva_image_studio',model:IMAGE_MODEL,
  mode:'per_installation_preview',perInstallationDailyLimit:int(env.PER_INSTALL_DAILY_LIMIT,3,1,30),
  dailyGlobalSafetyMax:int(env.PREVIEW_GLOBAL_DAILY_MAX,300,1,10000),legacyDailyGlobalLimit:int(env.DAILY_IMAGE_LIMIT,3,1,20)});
 if(!['/quota','/generate','/edit'].includes(path)||request.method!=='POST')return json({error:'not_found'},404);
 if(!env.IMAGE_QUOTA||path!=='/quota'&&!env.AI)return json({error:'service_unconfigured'},503);
 let data;try{data=await parseInput(request,path)}catch(e){
  const err=String(e?.message||'invalid_request');
  return json({error:err},err==='payload_too_large'||err==='image_too_large'?413:err==='content_type_required'?415:400);
 }
 if(path==='/quota'){
  try{
   const current=await quotaRequest(env,'snapshot',data);
   if(current.error)return json({error:current.error},409);
   return json(current.quota);
  }catch{return json({error:'quota_unavailable'},503)}
 }
 let ticket=null,quota=null;
 try{
  // Backward compatibility: already-installed old versions retain their existing
  // three globally shared preview requests until they update to the new APK.
  if(data.installationId){
   const reserved=await quotaRequest(env,'reserve',{installationId:data.installationId});
   if(reserved.error)return json({error:reserved.error,quota:reserved.quota},429);
   ticket=reserved.ticket;
  }else{
   const legacy=await quotaRequest(env,'legacy-reserve',{});
   if(!legacy.allowed)return json({error:'preview_limit_reached',dailyLimit:legacy.limit},429);
  }
  const output=await forwardToModel(env.AI,data,path==='/edit'?'edit':'generate');
  if(ticket){
   const counted=await quotaRequest(env,'complete',{installationId:data.installationId,ticket});
   if(counted.error)throw Error('quota_commit_failed');
   quota=counted.quota;ticket=null;
  }
  return json({...output,...(quota?{quota}:{})});
 }catch(e){
  if(ticket)try{await quotaRequest(env,'cancel',{installationId:data.installationId,ticket})}catch{}
  const message=String(e?.message||'');
  if(/quota|limit|billing|neuron|resource.exhausted/i.test(message))return json({error:message==='quota_commit_failed'?'quota_unavailable':'workers_ai_limit'},503);
  if(['invalid_prompt','image_required','invalid_format','invalid_image','image_too_large'].includes(message))return json({error:message},400);
  return json({error:'image_service_unavailable'},502);
 }
}};
