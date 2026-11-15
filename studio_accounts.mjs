import {SESSION_MILLIS,normalizeEmail,validEmail,validPassword,entitlement,passwordHash,sha256,rand,constantTimeEqual,json,bodyJson} from './studio_security.mjs';
// One identity DO, separate from production. Only the Site Studio Worker can invoke this binding.
export class StudioAccounts{
 constructor(state,env){this.state=state;this.env=env;}
 async store(key){return this.state.storage.get(key);}
 async fetch(request){
  if(request.method!=='POST')return json({error:'method'},405);
  let data;try{data=await bodyJson(request,18000)}catch(e){return json({error:e.message},400)}
  const now=Date.now(),action=data.action;
  try{
   if(action==='bootstrap'){
    if(await this.store('initialized'))return json({error:'already_initialized'},409);
    if(!validEmail(data.email)||!validPassword(data.password))return json({error:'invalid_credentials'},400);
    const email=normalizeEmail(data.email),id=rand(16),salt=rand(16);
    const secret=await passwordHash(data.password,salt);
    const account={id,email,salt,secret,created:now,plan:'premium',premiumUntil:null,createdSites:0};
    await this.state.storage.transaction(async tx=>{
     if(await tx.get('initialized')||await tx.get('email:'+email))throw Error('already_initialized');
     await tx.put('email:'+email,account);await tx.put('user:'+id,email);await tx.put('initialized',true);
    });
    return json({ok:true,id,email});
   }
   if(action==='register'){
    if(!validEmail(data.email)||!validPassword(data.password))return json({error:'invalid_credentials'},400);
    const email=normalizeEmail(data.email),id=rand(16),salt=rand(16);
    const secret=await passwordHash(data.password,salt);
    const account={id,email,salt,secret,created:now,plan:'trial',premiumUntil:null,createdSites:0};
    await this.state.storage.transaction(async tx=>{
     if(await tx.get('email:'+email))throw Error('account_exists');
     await tx.put('email:'+email,account);await tx.put('user:'+id,email);
    });
    return json({ok:true,id,email});
   }
   if(action==='login'){
    const email=normalizeEmail(data.email),account=await this.store('email:'+email);
    // Rate-limit both real and unknown emails. Never return whether an account exists.
    const key='failed:'+await sha256(email),failed=(await this.store(key))||{count:0,until:now+900000};
    if(failed.until<now){failed.count=0;failed.until=now+900000}
    if(failed.count>=8)return json({error:'too_many_attempts'},429);
    const salt=account?.salt||'0'.repeat(32),expected=account?.secret||'0'.repeat(64);
    const guess=await passwordHash(String(data.password||''),salt);
    if(!account||!constantTimeEqual(guess,expected)){
     failed.count++;await this.state.storage.put(key,failed);
     return json({error:'invalid_credentials'},401);
    }
    await this.state.storage.delete(key);
    const token=rand(32),digest=await sha256(token);
    await this.state.storage.put('session:'+digest,{id:account.id,expires:now+SESSION_MILLIS});
    return json({ok:true,token,user:{id:account.id,email:account.email,...entitlement(account,now)}});
   }
   if(action==='auth'){
    const token=String(data.token||'');
    if(!/^[a-f0-9]{64}$/.test(token))return json({error:'unauthorized'},401);
    const key='session:'+await sha256(token),session=await this.store(key);
    if(!session||session.expires<=now){if(session)await this.state.storage.delete(key);return json({error:'unauthorized'},401)}
    const email=await this.store('user:'+session.id),account=email?await this.store('email:'+email):null;
    if(!account)return json({error:'unauthorized'},401);
    return json({ok:true,user:{id:account.id,email:account.email,...entitlement(account,now)}});
   }
   if(action==='logout'){
    const token=String(data.token||'');
    if(/^[a-f0-9]{64}$/.test(token))await this.state.storage.delete('session:'+await sha256(token));
    return json({ok:true});
   }
   if(action==='memberAdd'){
    if(!/^[a-f0-9]{32}$/.test(data.id)||!/^[a-f0-9]{32}$/.test(data.siteId))return json({error:'invalid_id'},400);
    const email=await this.store('user:'+data.id);
    if(!email)return json({error:'unknown_user'},404);
    const key='sites:'+data.id,list=(await this.store(key))||[];
    if(!list.some(x=>x.id===data.siteId)){
     if(list.length>=80)return json({error:'too_many_sites'},429);
     list.push({id:data.siteId,name:String(data.name||'Site').slice(0,105)});
     await this.state.storage.put(key,list);
    }
    return json({ok:true});
   }
   if(action==='memberRemove'){
    const key='sites:'+data.id,list=(await this.store(key))||[];
    await this.state.storage.put(key,list.filter(x=>x.id!==data.siteId));
    return json({ok:true});
   }
   if(action==='sites'){
    const list=(await this.store('sites:'+data.id))||[];
    return json({ok:true,sites:list});
   }
   if(action==='canCreate'){
    const email=await this.store('user:'+data.id),account=email?await this.store('email:'+email):null;
    if(!account)return json({error:'unauthorized'},401);
    const permission=entitlement(account,now);
    const limit=permission.plan==='premium'?50:1;
    if(!permission.canCreate||account.createdSites>=limit)return json({error:'trial_or_site_limit',plan:permission.plan},403);
    // Daily creation limit also protects storage. This counter is consumed only by confirmed site creations.
    return json({ok:true,plan:permission.plan});
   }
   if(action==='siteCreated'){
    const email=await this.store('user:'+data.id),account=email?await this.store('email:'+email):null;
    if(!account)return json({error:'unauthorized'},401);
    account.createdSites=Number(account.createdSites||0)+1;
    await this.state.storage.put('email:'+email,account);
    return json({ok:true});
   }
   if(action==='claimAI'){
    const email=await this.store('user:'+data.id),account=email?await this.store('email:'+email):null;
    const kind=data.kind==='image'?'image':'site';
    if(!account)return json({error:'unauthorized'},401);
    const permission=entitlement(account,now);
    if(!permission.canGenerate)return json({error:'trial_expired'},403);
    const today=new Date(now).toISOString().slice(0,10),prefix='ai:'+kind;
    const globalDailyMax=kind==='image'?6:12,globalLifetimeMax=kind==='image'?100:240;
    const userDailyMax=permission.plan==='premium'?(kind==='image'?8:20):(kind==='image'?1:2);
    const userLifetimeMax=permission.plan==='premium'?(kind==='image'?100:240):(kind==='image'?2:3);
    let answer={error:'quota_exhausted'};
    await this.state.storage.transaction(async tx=>{
     const limits=[
      [prefix+':day:'+today,globalDailyMax],[prefix+':lifetime',globalLifetimeMax],
      [prefix+':user:'+account.id+':day:'+today,userDailyMax],
      [prefix+':user:'+account.id+':lifetime',userLifetimeMax]
     ];
     const values=await Promise.all(limits.map(async([key])=>Number(await tx.get(key)||0)));
     if(values.some((value,i)=>value>=limits[i][1]))return;
     for(let i=0;i<limits.length;i++)await tx.put(limits[i][0],values[i]+1);
     answer={ok:true,remaining:userDailyMax-values[2]-1};
    });
    return json(answer,answer.ok?200:429);
   }
   // Operator-only action; caller must validate a separately configured server-side secret.
   if(action==='manualPremium'){
    const email=normalizeEmail(data.email),account=await this.store('email:'+email);
    if(!account)return json({error:'not_found'},404);
    const until=Number(data.until);
    if(!Number.isSafeInteger(until)||until<now||until>now+366*86400000)return json({error:'invalid_expiry'},400);
    account.plan='premium';account.premiumUntil=until;
    await this.state.storage.put('email:'+email,account);
    return json({ok:true,email,until});
   }
   return json({error:'unsupported_action'},404);
  }catch(error){
   const code=String(error?.message||'internal');
   return json({error:['already_initialized','account_exists'].includes(code)?code:'operation_failed'},
    code==='already_initialized'||code==='account_exists'?409:500);
  }
 }
}
