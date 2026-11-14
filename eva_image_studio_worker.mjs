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
export class ImageQuota{
  constructor(state,env){this.state=state;this.env=env;}
  async fetch(request){
    if(new URL(request.url).pathname!=='/reserve'||request.method!=='POST')return new Response('Not found',{status:404});
    const limit=int(this.env.DAILY_IMAGE_LIMIT,DEFAULT_DAILY_LIMIT,1,20),today=new Date().toISOString().slice(0,10);
    const allowed=await this.state.storage.transaction(async t=>{
      const used=Number(await t.get(today)||0);
      if(used>=limit)return false;
      await t.put(today,used+1);return true;
    });
    return json({allowed,limit});
  }
}
export default {async fetch(request,env){
  const path=new URL(request.url).pathname;
  if(request.method==='OPTIONS')return json({},204);
  if(path==='/health'&&request.method==='GET')return json({ok:true,service:'eva_image_studio',model:IMAGE_MODEL,mode:'capped_preview',dailyGlobalLimit:int(env.DAILY_IMAGE_LIMIT,DEFAULT_DAILY_LIMIT,1,20)});
  if(!['/edit','/generate'].includes(path)||request.method!=='POST')return json({error:'not_found'},404);
  if(!env.AI||!env.IMAGE_QUOTA)return json({error:'service_unconfigured'},503);
  if(request.headers.get('content-type')?.split(';')[0]!=='application/json')return json({error:'content_type_required'},415);
  if(Number(request.headers.get('content-length')||0)>MAX_POST_BYTES)return json({error:'payload_too_large'},413);
  let data;
  try{
    const raw=await request.text();
    if(new TextEncoder().encode(raw).length>MAX_POST_BYTES)throw Error('payload_too_large');
    data=JSON.parse(raw);
    if(!data||typeof data!=='object'||Array.isArray(data))throw Error('invalid_request');
    const prompt=String(data.prompt??'').trim();
    if(prompt.length<8||prompt.length>1400)throw Error('invalid_prompt');
    if(!['square','portrait','wide','original'].includes(data.format))throw Error('invalid_format');
    if(path==='/edit')decodeImage(data.image);
  }catch(e){
    const message=String(e.message||'');
    return json({error:['payload_too_large','invalid_prompt','invalid_format','image_too_large','invalid_image'].includes(message)?message:'invalid_request'},message==='payload_too_large'?413:400);
  }
  try{
    const id=env.IMAGE_QUOTA.idFromName('global-preview');
    const check=await env.IMAGE_QUOTA.get(id).fetch('https://quota.internal/reserve',{method:'POST'});
    const budget=await check.json();
    if(!budget.allowed)return json({error:'preview_limit_reached',dailyLimit:budget.limit},429);
    return json(await forwardToModel(env.AI,data,path==='/edit'?'edit':'generate'));
  }catch(e){
    const message=String(e?.message||'');
    if(/quota|limit|billing|neuron|resource.exhausted/i.test(message))return json({error:'workers_ai_limit'},503);
    if(['invalid_prompt','image_required','invalid_format','invalid_image','image_too_large'].includes(message))return json({error:message},400);
    return json({error:'image_service_unavailable'},502);
  }
}};