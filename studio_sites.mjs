import {rand,sha256,json,bodyJson,validateManagement,validEmail,normalizeEmail} from './studio_security.mjs';
import {validateStudioDraft,renderStudioSite} from './studio_site_renderer.mjs';
import {validateVisitorSubmission,studioBusinessFeatures} from './studio_business_flows.mjs';
import {bookingAvailability,validateOrderDraft,orderAvailability} from './studio_commerce.mjs';
const sameId=id=>/^[a-f0-9]{32}$/.test(String(id||''));
function roleFor(site,id){
 if(!id)return null;
 if(site.creatorId===id&&site.ownerId===site.creatorId&&!site.creatorRevoked)return 'creator';
 if(site.ownerId===id)return 'owner';
 if(site.creatorId===id&&!site.creatorRevoked)return 'creator';
 return null;
}
const canEdit=(site,id)=>roleFor(site,id)==='creator'||
 (roleFor(site,id)==='owner'&&site.management.mode!=='managed');
const canPublish=canEdit;
const history=(site,message,actor)=>{site.audit=[...(site.audit||[]),{at:Date.now(),message,actor}].slice(-65)};
export class StudioSites{
 constructor(state,env){this.state=state;this.env=env}
 async get(){return this.state.storage.get('site')}
 async save(data){return this.state.storage.put('site',data)}
 async snapshot(){
  const bucket=this.env.SITE_BACKUPS;
  if(!bucket||typeof bucket.put!=='function')throw Error('backup_not_configured');
  const site=await this.get();if(!site)throw Error('site_missing');
  const inbox=await this.state.storage.get('visitorInbox')||[];
  const stripeEvents=await this.state.storage.get('stripeEvents')||[];
  const timestamp=new Date().toISOString().replaceAll(':','-');
  const key='sites/'+site.id+'/'+timestamp+'.json';
  const data=JSON.stringify({schema:'eva-studio-backup-v1',site,inbox,stripeEvents,createdAt:Date.now()});
  await bucket.put(key,data,{httpMetadata:{contentType:'application/json'},
   customMetadata:{kind:'eva-studio-private-backup',siteId:site.id}});
  // Keep at most 30 daily snapshots; this bucket stays private and belongs to the site owner.
  if(typeof bucket.list==='function'&&typeof bucket.delete==='function'){
   const list=await bucket.list({prefix:'sites/'+site.id+'/',limit:100});
   const keys=(list.objects||[]).map(o=>o.key).sort();
   if(keys.length>30)await bucket.delete(keys.slice(0,-30));
  }
  return {ok:true,key,createdAt:Date.now()};
 }
 async alarm(){
  try{if(this.env.SITE_BACKUPS)await this.snapshot()}
  finally{if(this.env.SITE_BACKUPS&&this.state.storage.setAlarm)
   await this.state.storage.setAlarm(Date.now()+24*3600000)}
 }
 async scheduleBackups(){
  if(this.env.SITE_BACKUPS&&this.state.storage.setAlarm){
   const active=await this.state.storage.getAlarm?.();
   if(active==null)await this.state.storage.setAlarm(Date.now()+24*3600000);
  }
 }
 async fetch(request){
  if(request.method!=='POST')return json({error:'method_not_allowed'},405);
  let x;try{x=await bodyJson(request,3600000)}catch(e){return json({error:e.message},400)}
  const op=x.action,now=Date.now(),actor=String(x.actor||'');
  try{
   if(op==='create'){
    if(await this.get())return json({error:'site_exists'},409);
    if(!sameId(x.id)||!sameId(actor))return json({error:'invalid_id'},400);
    const draft=validateStudioDraft(x.draft);
    const management=validateManagement(x.management||{mode:'owner'});
    const data={id:x.id,createdAt:now,updatedAt:now,version:1,publishedVersion:0,creatorId:actor,
     ownerId:actor,creatorRevoked:false,management,draft,published:null,invites:[],requests:[],audit:[]};
    history(data,'site_created',actor);await this.save(data);
    await this.scheduleBackups();
    return json({ok:true,id:x.id,version:1});
   }
   const site=await this.get();if(!site)return json({error:'site_missing'},404);
   if(op==='published'){
    if(!site.published)return json({error:'not_published'},404);
    return json({ok:true,draft:site.published,version:site.publishedVersion});
   }
   if(op==='availability'){
    if(!site.published||!site.published.features?.booking)return json({error:'feature_disabled'},404);
    const type=site.published.kind==='hotel'?'stay':site.published.kind==='restaurant'?'table':
     site.published.kind==='salon'?'appointment':'request';
    const entry={type:'booking',bookingType:type,roomLabel:String(x.roomLabel||'').slice(0,100),
     start:String(x.start||'').slice(0,10),end:String(x.end||'').slice(0,10),
     date:String(x.date||'').slice(0,10),time:String(x.time||'').slice(0,5),
     partySize:Math.max(1,Math.min(30,Number(x.partySize)||1))};
    const items=await this.state.storage.get('visitorInbox')||[];
    const result=bookingAvailability(site.published,items,entry);
    return json({ok:true,...result,notice:'Indicativ; disponibilitatea poate fi modificată înainte de confirmare.'});
   }
   if(op==='mediaAccess'){
    const media=String(x.path||'');
    if(!/^\/media\/[a-f0-9]{32}\/[a-f0-9]{32}\.(webp|png|jpg)$/.test(media))
     return json({error:'invalid_media'},404);
    const published=(site.published?.photos||[]).some(p=>p.data===media);
    if(published)return json({ok:true,public:true});
    const owner=roleFor(site,String(x.actor||''));
    if(owner&&(site.draft?.photos||[]).some(p=>p.data===media))
     return json({ok:true,public:false});
    return json({error:'media_not_available'},404);
   }
   if(op==='visitorSubmit'){
    if(!site.published)return json({error:'not_published'},404);
    const fingerprint=String(x.fingerprint||'');
    if(!/^[a-f0-9]{64}$/.test(fingerprint))return json({error:'invalid_visitor'},403);
    let submitted;
    try{
     submitted=x.type==='order'?validateOrderDraft(x.payload,site.published):
      validateVisitorSubmission(x.payload,x.type,site.published,now);
    }catch(e){
     const err=String(e.message||'invalid_request');
     if(err==='spam')return json({ok:true,received:true});
     return json({error:['feature_disabled','invalid_contact','privacy_ack_required','message_too_short',
      'invalid_party','invalid_dates','invalid_room','invalid_slot','invalid_product','out_of_stock'].includes(err)?err:'invalid_request'},400);
    }
    const response=await this.state.storage.transaction(async tx=>{
     const key='visitorRate:'+fingerprint;
     let rate=await tx.get(key)||{count:0,window:now};
     if(now-rate.window>600000)rate={count:0,window:now};
     if(rate.count>=3)return {error:'too_many_requests',status:429};
     const entries=await tx.get('visitorInbox')||[];
     if(entries.length>=400)return {error:'inbox_full',status:429};
     if(submitted.type==='order'&&!orderAvailability(entries,site.published,submitted).available)
      return {error:'out_of_stock',status:409};
     rate.count++;
     let status='new';
     if(submitted.type==='booking'&&site.published.commerce?.automaticConfirmation===true&&
      bookingAvailability(site.published,entries,submitted).available)status='confirmed';
     const item={id:rand(8),at:now,status,...submitted};
     entries.push(item);
     await tx.put('visitorInbox',entries);
     await tx.put(key,rate);
     return {ok:true,received:true,itemId:item.id,itemStatus:item.status,
      ...(item.type==='order'?{order:{...submitted,id:item.id}}:{})};
    });
    return json(response,response.status||200);
   }
   if(op==='paymentSession'){
    // Internal route used immediately after an accepted order form; never accessible directly to browsers.
    const inbox=await this.state.storage.get('visitorInbox')||[];
    const item=inbox.find(v=>v.id===x.itemId&&v.type==='order');
    if(!item||!['new','checkout'].includes(item.status))return json({error:'order_not_found'},404);
    if(!orderAvailability(inbox.filter(v=>v.id!==item.id),site.published,item).available)
     return json({error:'out_of_stock'},409);
    return json({ok:true,order:{id:item.id,email:item.email,productTitle:item.productTitle,
     unitPriceMinor:item.unitPriceMinor,quantity:item.quantity,currency:item.currency}});
   }
   if(op==='paymentAttach'){
    const changed=await this.state.storage.transaction(async tx=>{
     const inbox=await tx.get('visitorInbox')||[];
     const item=inbox.find(v=>v.id===x.itemId&&v.type==='order'&&v.status==='new');
     if(!item||!/^cs_(?:test_|live_)[A-Za-z0-9]+$/.test(x.sessionId||''))return false;
     item.status='checkout';item.paymentSessionId=x.sessionId;
     item.checkoutExpiresAt=now+3600000;
     await tx.put('visitorInbox',inbox);return true;
    });
    return changed?json({ok:true}):json({error:'checkout_conflict'},409);
   }
   if(op==='paymentEvent'){
    const update=await this.state.storage.transaction(async tx=>{
     const processed=await tx.get('stripeEvents')||[];
     if(processed.includes(x.eventId))return {ok:true,duplicate:true};
     const entries=await tx.get('visitorInbox')||[];
     const item=entries.find(v=>v.type==='order'&&v.id===x.itemId&&
      v.paymentSessionId===x.sessionId);
     if(!item)return {error:'order_not_found',status:404};
     if(x.type==='paid'&&x.amount===item.totalMinor&&x.currency===item.currency.toLowerCase()){
      const stocked=orderAvailability(entries.filter(v=>v.id!==item.id),site.published,item);
      item.status=stocked.available?'paid':'paid_needs_review';
      item.paymentStatus='paid';item.paidAt=now;
     }else if(x.type==='expired'){if(item.status==='checkout')item.status='closed'}
     else return {error:'event_mismatch',status:400};
     processed.push(x.eventId);
     await tx.put('stripeEvents',processed.slice(-500));
     await tx.put('visitorInbox',entries);
     return {ok:true,status:item.status,item:{type:item.type,email:item.email,status:item.status,at:item.at}};
    });
    return json(update,update.status>=400?update.status:200);
   }
   if(op==='verifyInvite'){
    const token=String(x.token||'');
    if(!/^[a-f0-9]{64}$/.test(token))return json({error:'bad_invitation'},403);
    const hash=await sha256(token);
    const invite=site.invites.find(a=>a.hash===hash&&a.expires>now);
    return invite?json({ok:true,email:invite.email,siteId:site.id,name:site.draft.name,mode:site.management.mode})
     :json({error:'bad_invitation'},403);
   }
   if(op==='redeem'){
    if(!sameId(actor)||!validEmail(x.email))return json({error:'invalid_account'},400);
    const token=String(x.token||'');
    if(!/^[a-f0-9]{64}$/.test(token))return json({error:'bad_invitation'},403);
    const hash=await sha256(token);
    let granted=false;
    await this.state.storage.transaction(async tx=>{
     const data=await tx.get('site');if(!data)return;
     const invite=data.invites.find(a=>a.hash===hash&&a.expires>now&&a.email===normalizeEmail(x.email));
     if(!invite)return;
     data.ownerId=actor;
     data.invites=[];data.updatedAt=now;
     history(data,'owner_accepted_invitation',actor);
     await tx.put('site',data);granted=true;
    });
    return granted?json({ok:true,role:'owner',mode:site.management.mode}):json({error:'bad_invitation'},403);
   }
   const role=roleFor(site,actor);
   if(!role)return json({error:'not_authorized'},403);
   if(op==='mediaUploadPermission'){
    return canEdit(site,actor)?json({ok:true}):json({error:'read_only_contract'},403);
   }
   if(op==='visitorInbox'){
    if(!role)return json({error:'not_authorized'},403);
    const items=await this.state.storage.get('visitorInbox')||[];
    return json({ok:true,items:items.slice(-200).reverse(),total:items.length});
   }
   if(op==='visitorStatus'||op==='visitorDelete'){
    const id=String(x.itemId||'');
    if(!/^[a-f0-9]{16}$/.test(id))return json({error:'invalid_item'},400);
    const statuses=['new','contacted','closed','declined','confirmed','fulfilled'];
    if(op==='visitorStatus'&&!statuses.includes(x.status))
     return json({error:'invalid_status'},400);
    const changed=await this.state.storage.transaction(async tx=>{
     const items=await tx.get('visitorInbox')||[];
     const n=items.findIndex(item=>item.id===id);
     if(n<0)return {error:'item_not_found',status:404};
     const entry=items[n];
     if(op==='visitorDelete'){
      if(entry.type==='order'&&entry.paymentStatus==='paid')
       return {error:'paid_order_requires_retention_review',status:409};
      items.splice(n,1);
     }else{
      const next=x.status;
      if(['confirmed','fulfilled'].includes(next)){
       if(entry.type==='booking'){
        if(!bookingAvailability(site.published||site.draft,items,entry,id).available)
         return {error:'no_availability',status:409};
       }else if(entry.type==='order'){
        if(!orderAvailability(items.filter(i=>i.id!==id),site.published||site.draft,entry).available)
         return {error:'out_of_stock',status:409};
        if(next==='fulfilled'&&!['paid','confirmed'].includes(entry.status))
         return {error:'order_not_confirmed',status:409};
       }else return {error:'unsupported_status',status:400};
      }
      if(entry.type==='order'&&entry.paymentStatus==='paid'&&['declined','closed'].includes(next))
       return {error:'paid_order_requires_refund_review',status:409};
      entry.status=next;entry.updatedAt=now;
     }
     await tx.put('visitorInbox',items);
     return {ok:true,status:entry.status,item:{type:entry.type,email:entry.email,status:entry.status,at:entry.at}};
    });
    return json(changed,changed.status>=400?changed.status:200);
   }
   if(op==='backupCreate'){
    if(role!=='owner')return json({error:'owner_only'},403);
    return json(await this.snapshot());
   }
   if(op==='backupList'){
    if(role!=='owner')return json({error:'owner_only'},403);
    const bucket=this.env.SITE_BACKUPS;
    if(!bucket)return json({error:'backup_not_configured'},503);
    const list=await bucket.list({prefix:'sites/'+site.id+'/',limit:100});
    return json({ok:true,objects:(list.objects||[]).map(o=>({key:o.key,size:o.size,uploaded:o.uploaded}))});
   }
   if(op==='backupRestore'){
    if(role!=='owner')return json({error:'owner_only'},403);
    if(!this.env.SITE_BACKUPS)return json({error:'backup_not_configured'},503);
    if(x.confirm!=='RESTAUREAZA '+site.id)return json({error:'confirmation_required'},400);
    if(x.version!==site.version)return json({error:'revision_conflict'},409);
    const key=String(x.key||'');
    if(!/^sites\/[a-f0-9]{32}\/[0-9TZ.-]+\.json$/.test(key)||!key.startsWith('sites/'+site.id+'/'))
     return json({error:'invalid_backup'},400);
    const object=await this.env.SITE_BACKUPS.get(key);
    if(!object)return json({error:'backup_missing'},404);
    const data=await object.json();
    if(data?.schema!=='eva-studio-backup-v1'||data?.site?.id!==site.id||
       !Array.isArray(data.inbox))return json({error:'invalid_backup'},400);
    const restoredDraft=validateStudioDraft(data.site.draft);
    const restoredPublished=data.site.published?validateStudioDraft(data.site.published):null;
    const outcome=await this.state.storage.transaction(async tx=>{
     const current=await tx.get('site');
     if(!current||current.version!==x.version)return null;
     const items=await tx.get('visitorInbox')||[];
     const paid=items.filter(i=>i.type==='order'&&i.paymentStatus==='paid');
     const archived=data.inbox.filter(i=>i&&/^[a-f0-9]{16}$/.test(i.id||'')&&
      !(i.type==='order'&&i.paymentStatus==='paid'));
     const merged=new Map(archived.map(i=>[i.id,i]));
     for(const item of paid)merged.set(item.id,item);
     current.draft=restoredDraft;current.published=restoredPublished;
     current.version++;current.publishedVersion=restoredPublished?current.version:0;
     current.updatedAt=now;history(current,'backup_restored',actor);
     await tx.put('site',current);
     await tx.put('visitorInbox',[...merged.values()].slice(-400));
     // NEVER roll back Stripe event idempotency or paid-order evidence.
     return current.version;
    });
    return outcome?json({ok:true,version:outcome,notice:'Plățile deja încasate au fost păstrate.'}):
     json({error:'revision_conflict'},409);
   }
   if(op==='read'){await this.scheduleBackups();return json({ok:true,site:{id:site.id,version:site.version,publishedVersion:site.publishedVersion,
    updatedAt:site.updatedAt,createdAt:site.createdAt,management:site.management,draft:site.draft,
    role,creatorRevoked:site.creatorRevoked,ownerAssigned:site.ownerId!==site.creatorId,
    requests:role==='creator'?site.requests:site.requests.filter(r=>r.actor===actor),audit:site.audit.slice(-12)}});}
   if(op==='preview')return json({ok:true,html:renderStudioSite(site.draft)});
   if(op==='export')return json({ok:true,html:renderStudioSite(site.published||site.draft)});
   if(op==='save'){
    if(!canEdit(site,actor))return json({error:'read_only_contract'},403);
    if(!Number.isInteger(x.version)||x.version!==site.version)return json({error:'revision_conflict',version:site.version},409);
    const next=validateStudioDraft(x.draft);
    if(role==='owner'&&site.management.mode==='shared'){
     // Owner is allowed to maintain business information and images, not change visual architecture.
     for(const key of ['kind','styleId','lang']){
      if(next[key]!==site.draft[key])return json({error:'design_changes_restricted',field:key},403);
     }
    }
    const transaction=await this.state.storage.transaction(async tx=>{
     const current=await tx.get('site');
     if(!current||current.version!==x.version)return null;
     current.draft=next;current.version++;current.updatedAt=now;
     history(current,'draft_updated',actor);await tx.put('site',current);
     return current.version;
    });
    return transaction?json({ok:true,version:transaction}):json({error:'revision_conflict'},409);
   }
   if(op==='publish'){
    if(!canPublish(site,actor))return json({error:'publish_forbidden'},403);
    if(x.version!==site.version)return json({error:'revision_conflict',version:site.version},409);
    // Personal data must not be collected until a published HTTPS privacy policy exists.
    const flowFeatures=studioBusinessFeatures(site.draft.features);
    if((flowFeatures.contact||flowFeatures.booking)&&!flowFeatures.privacyUrl)
     return json({error:'privacy_notice_required'},400);
    // Rendering validates and escapes content before publishing.
    renderStudioSite(site.draft);
    const updated=await this.state.storage.transaction(async tx=>{
     const current=await tx.get('site');
     if(!current||current.version!==x.version)return null;
     current.published=structuredClone(current.draft);
     current.publishedVersion=current.version;current.updatedAt=now;
     history(current,'published',actor);await tx.put('site',current);return current.publishedVersion;
    });
    return updated?json({ok:true,publishedVersion:updated}):json({error:'revision_conflict'},409);
   }
   if(op==='invite'){
    if(role!=='owner'&&!(role==='creator'&&site.ownerId===site.creatorId))return json({error:'owner_only'},403);
    const email=normalizeEmail(x.email);if(!validEmail(email))return json({error:'invalid_email'},400);
    const token=rand(32),hash=await sha256(token);
    const expires=now+72*60*60*1000;
    site.invites=[{hash,email,expires}];site.updatedAt=now;
    history(site,'handover_invitation_created',actor);await this.save(site);
    return json({ok:true,token,expires,siteId:site.id,email});
   }
   if(op==='requestChange'){
    if(role!=='owner'||site.management.mode==='owner')return json({error:'not_available'},403);
    const message=String(x.message||'').trim().slice(0,900);
    if(message.length<8)return json({error:'message_too_short'},400);
    const note={id:rand(8),actor,at:now,message,status:'open'};
    site.requests=[...site.requests,note].slice(-50);site.updatedAt=now;
    history(site,'change_requested',actor);await this.save(site);return json({ok:true,requestId:note.id});
   }
   if(op==='completeRequest'){
    if(role!=='creator')return json({error:'creator_only'},403);
    const item=site.requests.find(r=>r.id===x.requestId);
    if(!item)return json({error:'request_missing'},404);
    item.status='closed';site.updatedAt=now;history(site,'change_request_closed',actor);await this.save(site);
    return json({ok:true});
   }
   if(op==='endMaintenance'){
    if(role!=='owner')return json({error:'owner_only'},403);
    site.management={...site.management,mode:'owner'};
    site.creatorRevoked=true;site.invites=[];
    site.updatedAt=now;history(site,'owner_terminated_maintenance_access',actor);await this.save(site);
    return json({ok:true,mode:'owner',creatorRevoked:true,revokedCreatorId:site.creatorId});
   }
   return json({error:'unknown_action'},404);
  }catch(error){
   const code=String(error?.message||'failed');
   return json({error:[
    'invalid_draft','name_or_description_required','invalid_email_contact','too_many_photo_bytes',
    'maintenance_terms_incomplete'
   ].includes(code)?code:'site_operation_failed'},[
    'invalid_draft','name_or_description_required','invalid_email_contact','too_many_photo_bytes',
    'maintenance_terms_incomplete'
   ].includes(code)?400:500);
  }
 }
}
