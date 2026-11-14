import {rand,sha256,json,bodyJson,validateManagement,validEmail,normalizeEmail} from './studio_security.mjs';
import {validateStudioDraft,renderStudioSite} from './studio_site_renderer.mjs';
import {validateVisitorSubmission,studioBusinessFeatures} from './studio_business_flows.mjs';
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
    return json({ok:true,id:x.id,version:1});
   }
   const site=await this.get();if(!site)return json({error:'site_missing'},404);
   if(op==='published'){
    if(!site.published)return json({error:'not_published'},404);
    return json({ok:true,draft:site.published,version:site.publishedVersion});
   }
   if(op==='visitorSubmit'){
    if(!site.published)return json({error:'not_published'},404);
    const fingerprint=String(x.fingerprint||'');
    if(!/^[a-f0-9]{64}$/.test(fingerprint))return json({error:'invalid_visitor'},403);
    let submitted;try{submitted=validateVisitorSubmission(x.payload,x.type,site.published,now)}
    catch(e){
     const err=String(e.message||'invalid_request');
     if(err==='spam')return json({ok:true,received:true});
     return json({error:['feature_disabled','invalid_contact','privacy_ack_required','message_too_short',
      'invalid_party','invalid_dates','invalid_room','invalid_slot'].includes(err)?err:'invalid_request'},400);
    }
    const response=await this.state.storage.transaction(async tx=>{
     const key='visitorRate:'+fingerprint;
     let rate=await tx.get(key)||{count:0,window:now};
     if(now-rate.window>600000)rate={count:0,window:now};
     if(rate.count>=3)return {error:'too_many_requests',status:429};
     const entries=await tx.get('visitorInbox')||[];
     if(entries.length>=200)return {error:'inbox_full',status:429};
     rate.count+=1;
     const item={id:rand(8),at:now,status:'new',...submitted};
     entries.push(item);
     await tx.put('visitorInbox',entries);
     await tx.put(key,rate);
     return {ok:true,received:true};
    });
    return json(response,response.status||200);
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
   if(op==='visitorInbox'){
    if(!role)return json({error:'not_authorized'},403);
    const items=await this.state.storage.get('visitorInbox')||[];
    return json({ok:true,items:items.slice(-200).reverse(),total:items.length});
   }
   if(op==='visitorStatus'||op==='visitorDelete'){
    if(!role)return json({error:'not_authorized'},403);
    const id=String(x.itemId||'');
    if(!/^[a-f0-9]{16}$/.test(id))return json({error:'invalid_item'},400);
    if(op==='visitorStatus'&&!['new','contacted','closed','declined'].includes(x.status))
     return json({error:'invalid_status'},400);
    const changed=await this.state.storage.transaction(async tx=>{
     const items=await tx.get('visitorInbox')||[];
     const n=items.findIndex(item=>item.id===id);
     if(n<0)return false;
     if(op==='visitorDelete')items.splice(n,1);
     else items[n].status=x.status;
     await tx.put('visitorInbox',items);
     return true;
    });
    return changed?json({ok:true}):json({error:'item_not_found'},404);
   }
   if(op==='read')return json({ok:true,site:{id:site.id,version:site.version,publishedVersion:site.publishedVersion,
    updatedAt:site.updatedAt,createdAt:site.createdAt,management:site.management,draft:site.draft,
    role,creatorRevoked:site.creatorRevoked,ownerAssigned:site.ownerId!==site.creatorId,
    requests:role==='creator'?site.requests:site.requests.filter(r=>r.actor===actor),audit:site.audit.slice(-12)}});
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
