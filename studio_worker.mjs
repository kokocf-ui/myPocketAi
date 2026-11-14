// Cloudflare Worker: independent customer site administration. Never route production /api/chat here.
import {StudioAccounts} from './studio_accounts.mjs';
import {StudioSites} from './studio_sites.mjs';
import {renderStudioSite,validateStudioDraft,STUDIO_THEMES} from './studio_site_renderer.mjs';
import {STUDIO_ADMIN_HTML} from './studio_admin_portal.mjs';
import {SITE_GALLERY_PRESETS} from './creator_guesthouse_gallery.mjs';
import {SITE_HOSTING_GUIDES} from './creator_hosting_guide.mjs';
import {studioBusinessFeatures} from './studio_business_flows.mjs';
import {json,bodyJson,normalizeEmail,validEmail,constantTimeEqual,sha256,normalizeStudioPrompt,publicSafeHtmlHeaders} from './studio_security.mjs';
export {StudioAccounts,StudioSites};
const COOKIE='__Host-pocket_studio';
const siteIdPattern=/^[a-f0-9]{32}$/;
const MAX_BODY=3600000;
const cookieHeader=token=>COOKIE+'='+token+'; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=604800';
const expiredCookie=()=>COOKIE+'=; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=0';
const getCookie=req=>{
 const raw=req.headers.get('Cookie')||'';
 const item=raw.split(';').map(x=>x.trim()).find(x=>x.startsWith(COOKIE+'='));
 return item?item.slice(COOKIE.length+1):'';
};
const internal=async(binding,name,action,args={})=>{
 const stub=binding.get(binding.idFromName(name));
 const r=await stub.fetch('https://private.studio.internal/api',{method:'POST',
  headers:{'Content-Type':'application/json'},body:JSON.stringify({action,...args})});
 const data=await r.json().catch(()=>({error:'invalid_internal_response'}));
 return {status:r.status,...data};
};
const account=(env,action,args)=>internal(env.STUDIO_ACCOUNTS,'registry',action,args);
const site=(env,id,action,args)=>internal(env.STUDIO_SITES,id,action,args);
const privateHost=(request,url)=>{
 const origin=request.headers.get('Origin');
 return origin===url.origin&&(!request.headers.get('Sec-Fetch-Site')||
 ['same-origin','none'].includes(request.headers.get('Sec-Fetch-Site')));
};
const reply=r=>json(r,r.status>=400?r.status:200);
const locked=()=>json({error:'configuration_not_ready'},503);
const html=(content,preview=false,allowForms=false)=>new Response(content,{status:200,headers:publicSafeHtmlHeaders(preview,allowForms)});
async function validLogin(request,env){
 const token=getCookie(request);
 if(!/^[a-f0-9]{64}$/.test(token))return {error:'unauthorized',status:401};
 const r=await account(env,'auth',{token});
 return r.ok?{token,user:r.user}:{error:'unauthorized',status:401};
}
const parseInvitation=invite=>{
 const value=String(invite||'').trim();
 const m=/^([a-f0-9]{32})\.([a-f0-9]{64})$/.exec(value);
 return m?{id:m[1],token:m[2]}:null;
};
const protectAI=env=>env.STUDIO_AI_ENABLED==='true'&&env.AI&&typeof env.AI.run==='function';
const extractedAIResponse=reply=>{
 const options=[reply?.response,reply?.result?.response,reply?.text,reply?.output_text,
  reply?.choices?.[0]?.message?.content];
 return String(options.find(x=>typeof x==='string'&&x.trim())||'').trim();
};
function parseWebsiteCopy(reply,lang){
 const raw=extractedAIResponse(reply),start=raw.indexOf('{'),end=raw.lastIndexOf('}');
 let parsed=null;
 if(start>=0&&end>start&&end-start<16000)try{parsed=JSON.parse(raw.slice(start,end+1))}catch{}
 const normalize=x=>{
  if(!x||typeof x!=='object')return null;
  const bound=(k,max)=>typeof x[k]==='string'?x[k].trim().slice(0,max):'';
  const headline=bound('headline',120),intro=bound('intro',400),about=bound('about',1100);
  const services=(Array.isArray(x.services)?x.services:[]).slice(0,8).map(v=>({
   title:String(v?.title||'').slice(0,80),detail:String(v?.detail||'').slice(0,320)
  })).filter(v=>v.title.trim());
  return headline&&intro&&about?{headline,intro,about,services}:null;
 };
 const ro=normalize(parsed?.ro),en=normalize(parsed?.en);
 if(lang==='ro'&&!ro||lang==='en'&&!en||lang==='both'&&(!ro||!en))return null;
 return {ro,en};
}
function webPrompt(data){
 const lang=['ro','en','both'].includes(data.lang)?data.lang:'ro';
 const input={
  name:String(data.name||'').slice(0,110),category:String(data.kind||'').slice(0,40),
  description:String(data.description||'').slice(0,2400),
  style:String(data.style||'').slice(0,120),lang
 };
 return {lang,text:[
  'Professional, original small-business website copy. Return ONLY strict JSON with language keys.',
  'Schema: {"ro":{"headline":"","intro":"","about":"","services":[{"title":"","detail":""}]},"en":{"headline":"","intro":"","about":"","services":[{"title":"","detail":""}]}}.',
  'Produce '+(lang==='both'?'BOTH ro and en':lang)+' only. For English, translate and adapt Romanian facts automatically.',
  'Do not invent prices, photos, room counts, contact details, location or certification.',
  'Use precise concise headings and 2-6 distinct relevant service descriptions, based only on known facts.',
  'Business facts: '+JSON.stringify(input)
 ].join('\n').slice(0,3300)};
}
async function aiRequest(request,env,user,kind){
 if(!protectAI(env))return json({error:'ai_paused_for_cost_safety'},503);
 let args;try{args=await bodyJson(request,4500)}catch(e){return json({error:e.message},400)}
 if(kind==='site'){
  if(String(args.name||'').trim().length<2||String(args.description||'').trim().length<15)
   return json({error:'business_details_required'},400);
 }else if(!String(args.prompt||'').trim())return json({error:'prompt_required'},400);
 const quota=await account(env,'claimAI',{id:user.id,kind});
 if(!quota.ok)return reply(quota);
 try{
  if(kind==='site'){
   const prompt=webPrompt(args);
   const result=await env.AI.run('@cf/meta/llama-3.1-8b-instruct-fast',{
    messages:[{role:'system',content:'You write factual website copy. Respond as a single JSON object, no markdown, no invented facts.'},
     {role:'user',content:prompt.text}],temperature:.2,max_tokens:1900
   });
   const copy=parseWebsiteCopy(result,prompt.lang);
   if(!copy)return json({error:'ai_format_invalid',remaining:quota.remaining},502);
   return json({ok:true,copy,remaining:quota.remaining});
  }
  const prompt=normalizeStudioPrompt(args.prompt,args.composition);
  const result=await env.AI.run('@cf/black-forest-labs/flux-1-schnell',{prompt,steps:4});
  const image=String(result?.image||'');
  if(image.length<500||image.length>7500000||!/^[A-Za-z0-9+/]+={0,2}$/.test(image))
   return json({error:'image_result_invalid'},502);
  return json({ok:true,image:'data:image/jpeg;base64,'+image,remaining:quota.remaining,
   notice:'Model outputs vary; essential subjects should be checked before saving.'});
 }catch(e){
  const exhausted=/4006|daily free allocation|neuron/i.test(String(e?.message||''));
  return json({error:exhausted?'cloudflare_ai_free_limit':'ai_provider_unavailable'},exhausted?429:503);
 }
}
export default{
 async fetch(request,env){
  const url=new URL(request.url),path=url.pathname,method=request.method;
  try{
   if(!env.STUDIO_ACCOUNTS||!env.STUDIO_SITES)return locked();
   if(path==='/health'&&method==='GET')return json({ok:true,status:'studio_independent',aiEnabled:protectAI(env),billingEnabled:false},200,{'Access-Control-Allow-Origin':'*'});
   if(path==='/'&&method==='GET'){
    const nonce=crypto.randomUUID().replaceAll('-','');
    const header={
     'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff',
     'Referrer-Policy':'no-referrer',
     'Content-Security-Policy':"default-src 'none'; connect-src 'self'; img-src data:; style-src 'unsafe-inline'; script-src 'nonce-"+nonce+"'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'"
    };
    return new Response(STUDIO_ADMIN_HTML.replaceAll('__STUDIO_NONCE__',nonce).replace('__SITE_GALLERY_CATALOG__',JSON.stringify(SITE_GALLERY_PRESETS)).replace('__SITE_HOSTING_CATALOG__',JSON.stringify(SITE_HOSTING_GUIDES)),{headers:header});
   }
   const published=/^\/s\/([a-f0-9]{32})\/?$/.exec(path);
   if(published&&method==='GET'){
    const r=await site(env,published[1],'published');
    if(!r.ok)return json({error:'site_not_published'},404);
    const features=studioBusinessFeatures(r.draft.features);
    return html(renderStudioSite(r.draft,{publicId:published[1]}),false,features.contact||features.booking);
   }
   const visitor=/^\/s\/([a-f0-9]{32})\/(contact|booking)$/.exec(path);
   if(visitor&&method==='POST'){
    const origin=request.headers.get('Origin');
    if(origin!==url.origin||!['same-origin','none'].includes(request.headers.get('Sec-Fetch-Site')||'none'))
     return json({error:'bad_origin'},403);
    if(!/^application\/x-www-form-urlencoded(?:;|$)/i.test(request.headers.get('Content-Type')||''))
     return json({error:'unsupported_media'},415);
    if(Number(request.headers.get('Content-Length')||0)>6000)return json({error:'body_too_large'},413);
    const raw=await request.text();
    if(raw.length>6000)return json({error:'body_too_large'},413);
    const fields=Object.fromEntries(new URLSearchParams(raw));
    const cfIp=request.headers.get('CF-Connecting-IP')||'unknown';
    const fingerprint=await sha256(visitor[1]+'|'+cfIp+'|'+String(request.headers.get('User-Agent')||'').slice(0,120));
    const stored=await site(env,visitor[1],'visitorSubmit',{fingerprint,type:visitor[2],payload:fields});
    const isSuccess=!!stored.ok,status=isSuccess?200:stored.status===429?429:400;
    const message=isSuccess?'Solicitarea a fost primită. Nu este încă o rezervare confirmată. Afacerea vă va contacta.':
     status===429?'Sunt prea multe solicitări. Încercați din nou mai târziu.':
     'Solicitarea nu a fost înregistrată. Verificați datele introduse și încercați din nou.';
    const receipt='<!doctype html><html lang="ro"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Solicitare Eva</title></head>'+
     '<body style="font:16px/1.5 system-ui;padding:28px;max-width:650px;margin:auto"><h1>'+(isSuccess?'Solicitare primită':'Solicitare neînregistrată')+
     '</h1><p>'+message+'</p><a href="/s/'+visitor[1]+'">Înapoi la site</a></body></html>';
    return new Response(receipt,{status,headers:{...publicSafeHtmlHeaders(false),'Cache-Control':'no-store'}});
   }
   const isApi=path.startsWith('/api/');
   if(!isApi)return json({error:'not_found'},404);
   if(method!=='GET'&&!privateHost(request,url))return json({error:'bad_origin'},403);
   if(method!=='GET'&&Number(request.headers.get('Content-Length')||0)>MAX_BODY)
    return json({error:'body_too_large'},413);
   if(path==='/api/setup'&&method==='POST'){
    const secret=env.STUDIO_BOOTSTRAP_SECRET;
    if(!secret||secret.length<20)return locked();
    const supplied=String(request.headers.get('X-Studio-Setup')||'');
    if(!constantTimeEqual(await sha256(supplied),await sha256(secret)))return json({error:'forbidden'},403);
    const data=await bodyJson(request,1400);
    return reply(await account(env,'bootstrap',{email:data.email,password:data.password}));
   }
   if(path==='/api/register'&&method==='POST'){
    const data=await bodyJson(request,1800),inv=parseInvitation(data.invite);
    if(!inv)return json({error:'invitation_required'},403);
    const check=await site(env,inv.id,'verifyInvite',{token:inv.token});
    if(!check.ok||normalizeEmail(data.email)!==check.email)return json({error:'invalid_invitation'},403);
    const created=await account(env,'register',{email:data.email,password:data.password});
    if(!created.ok)return reply(created);
    const accepted=await site(env,inv.id,'redeem',{token:inv.token,actor:created.id,email:created.email});
    if(!accepted.ok)return reply(accepted);
    await account(env,'memberAdd',{id:created.id,siteId:inv.id,name:check.name});
    return json({ok:true,registration:'completed',loginRequired:true});
   }
   if(path==='/api/login'&&method==='POST'){
    const data=await bodyJson(request,1100),r=await account(env,'login',{email:data.email,password:data.password});
    if(!r.ok)return reply(r);
    return json({ok:true,user:r.user},200,{'Set-Cookie':cookieHeader(r.token)});
   }
   if(path==='/api/logout'&&method==='POST'){
    const token=getCookie(request);
    await account(env,'logout',{token});
    return json({ok:true},200,{'Set-Cookie':expiredCookie()});
   }
   const auth=await validLogin(request,env);
   if(!auth.user)return json({error:'unauthorized'},401);
   if(path==='/api/session'&&method==='GET')return json({ok:true,user:auth.user});
   if(path==='/api/sites'&&method==='GET')return reply(await account(env,'sites',{id:auth.user.id}));
   if(path==='/api/sites'&&method==='POST'){
    const can=await account(env,'canCreate',{id:auth.user.id});
    if(!can.ok)return reply(can);
    const data=await bodyJson(request,MAX_BODY);
    const id=crypto.randomUUID().replaceAll('-','');
    const built=await site(env,id,'create',{id,actor:auth.user.id,draft:data.draft,management:data.management});
    if(!built.ok)return reply(built);
    await account(env,'siteCreated',{id:auth.user.id});
    await account(env,'memberAdd',{id:auth.user.id,siteId:id,name:String(data.draft?.name||'Site').slice(0,105)});
    return json({ok:true,id,version:built.version,publicUrl:url.origin+'/s/'+id});
   }
   if(path==='/api/ai/site'&&method==='POST')return aiRequest(request,env,auth.user,'site');
   if(path==='/api/ai/image'&&method==='POST')return aiRequest(request,env,auth.user,'image');
   if(path==='/api/entitlement/grant'&&method==='POST'){
    const secret=env.STUDIO_OPERATOR_SECRET;
    if(!secret||secret.length<20)return locked();
    const supplied=String(request.headers.get('X-Studio-Operator')||'');
    if(!constantTimeEqual(await sha256(supplied),await sha256(secret)))return json({error:'forbidden'},403);
    const data=await bodyJson(request,900);
    return reply(await account(env,'manualPremium',{email:data.email,until:data.until}));
   }
   const inbox=/^\/api\/sites\/([a-f0-9]{32})\/inbox(?:\/([a-f0-9]{16})(?:\/status)?)?$/.exec(path);
   if(inbox){
    const id=inbox[1],itemId=inbox[2],statusPath=path.endsWith('/status');
    if(method==='GET'&&!itemId)return reply(await site(env,id,'visitorInbox',{actor:auth.user.id}));
    if(method==='POST'&&itemId&&statusPath){
     const data=await bodyJson(request,300);
     return reply(await site(env,id,'visitorStatus',{actor:auth.user.id,itemId,status:data.status}));
    }
    if(method==='DELETE'&&itemId&&!statusPath)
     return reply(await site(env,id,'visitorDelete',{actor:auth.user.id,itemId}));
    return json({error:'method_not_allowed'},405);
   }
   const match=/^\/api\/sites\/([a-f0-9]{32})(?:\/(preview|publish|export|invite|redeem|request|complete-request|end-maintenance))?$/.exec(path);
   if(!match)return json({error:'not_found'},404);
   const id=match[1],act=match[2]||'',actor=auth.user.id;
   if(!act&&method==='GET')return reply(await site(env,id,'read',{actor}));
   if(!act&&method==='PUT'){
    const data=await bodyJson(request,MAX_BODY);
    return reply(await site(env,id,'save',{actor,draft:data.draft,version:data.version}));
   }
   if(act==='preview'&&method==='GET'){
    const r=await site(env,id,'preview',{actor});if(!r.ok)return reply(r);
    return html(r.html,true);
   }
   if(act==='export'&&method==='GET'){
    const r=await site(env,id,'export',{actor});if(!r.ok)return reply(r);
    return new Response(r.html,{headers:{
     ...publicSafeHtmlHeaders(true),'Content-Disposition':'attachment; filename="site-'+id+'.html"'
    }});
   }
   const actions={publish:'publish',invite:'invite',redeem:'redeem',request:'requestChange',
    'complete-request':'completeRequest','end-maintenance':'endMaintenance'};
   if(method==='POST'&&actions[act]){
    const data=await bodyJson(request,15000);
    // Server-authenticated identity MUST override all attacker-controlled JSON fields.
    const args={...data,actor};
    if(act==='redeem')args.email=auth.user.email;
    const response=await site(env,id,actions[act],args);
    if(!response.ok)return reply(response);
    if(act==='redeem')await account(env,'memberAdd',{id:actor,siteId:id,name:response.name||'Site'});
    if(act==='end-maintenance'&&response.revokedCreatorId&&response.revokedCreatorId!==actor)
     await account(env,'memberRemove',{id:response.revokedCreatorId,siteId:id});
    if(act==='invite')return json({...response,invitation:id+'.'+response.token});
    return reply(response);
   }
   return json({error:'method_not_allowed'},405);
  }catch(err){
   const code=String(err?.message||'');
   return json({error:['body_too_large','invalid_json','prompt_too_short','name_or_description_required',
    'invalid_draft','invalid_email_contact','too_many_photo_bytes','maintenance_terms_incomplete'
   ].includes(code)?code:'studio_internal_error'},400===(
    ['body_too_large','invalid_json','prompt_too_short','name_or_description_required',
    'invalid_draft','invalid_email_contact','too_many_photo_bytes','maintenance_terms_incomplete'
   ].includes(code)?400:500)?400:500);
  }
 }
};
