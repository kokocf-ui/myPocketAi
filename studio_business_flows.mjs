// Shared business form model: visitor submissions require no AI calls.
// These are REQUESTS, not guaranteed reservations. Owners manually respond.
export const STUDIO_BUSINESS_FEATURES=Object.freeze({
 contact:'Mesaje de la vizitatori',
 booking:'Solicitări de rezervare / programare'
});
const text=(v,max)=>typeof v==='string'?v.trim().slice(0,max):'';
const escapeHtml=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','"':'&quot;',"'":'&#39;'}[c]));
const MAIL=/^[^\s@<>]{1,90}@[^\s@<>]{1,90}\.[^\s@<>]{2,24}$/;
export function studioBusinessFeatures(input){
 const candidate=text(input?.privacyUrl,300);
 let privacyUrl='';
 if(candidate)try{
  const u=new URL(candidate);
  if(u.protocol==='https:'&&!u.username&&!u.password&&u.hostname.includes('.'))
   privacyUrl=u.href;
 }catch{}
 return {contact:input?.contact===true,booking:input?.booking===true,privacyUrl};
}
export function studioBookingType(kind){
 return kind==='hotel'?'stay':kind==='restaurant'?'table':kind==='salon'?'appointment':'request';
}
const isoDate=d=>/^\d{4}-\d{2}-\d{2}$/.test(d)&&!Number.isNaN(Date.parse(d+'T12:00:00Z'))&&
 new Date(d+'T12:00:00Z').toISOString().slice(0,10)===d;
export function validateVisitorSubmission(raw,action,draft,now=Date.now()){
 const features=studioBusinessFeatures(draft?.features),kind=draft?.kind||'other';
 if(!['contact','booking'].includes(action)||!features[action])throw Error('feature_disabled');
 if(raw?.website)throw Error('spam');
 if(raw?.privacy_ack!=='yes')throw Error('privacy_ack_required');
 const name=text(raw?.name,100),email=text(raw?.email,180).toLowerCase(),phone=text(raw?.phone,45);
 if(name.length<2||!MAIL.test(email))throw Error('invalid_contact');
 if(action==='contact'){
  const message=text(raw?.message,1400);
  if(message.length<12)throw Error('message_too_short');
  return {type:'contact',name,email,phone,message};
 }
 const bookingType=studioBookingType(kind);
 const note=text(raw?.message,500);
 const party=Number(raw?.partySize);
 if(!Number.isInteger(party)||party<1||party>30)throw Error('invalid_party');
 const max=new Date(now+370*86400000).toISOString().slice(0,10);
 const today=new Date(now).toISOString().slice(0,10);
 if(bookingType==='stay'){
  const start=text(raw?.start,10),end=text(raw?.end,10),roomLabel=text(raw?.roomLabel,100);
  if(!isoDate(start)||!isoDate(end)||start<today||start>max||end<=start||end>max)
   throw Error('invalid_dates');
  if(!Array.isArray(draft.rooms)||!draft.rooms.some(r=>r.label===roomLabel))
   throw Error('invalid_room');
  return {type:'booking',bookingType,name,email,phone,partySize:party,start,end,roomLabel,message:note};
 }
 const date=text(raw?.date,10),time=text(raw?.time,5);
 if(!isoDate(date)||date<today||date>max||!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(time))
  throw Error('invalid_slot');
 return {type:'booking',bookingType,name,email,phone,partySize:party,date,time,message:note};
}
export function businessPublicFormHtml(draft,siteId='',lang='ro'){
 const features=studioBusinessFeatures(draft?.features);
 if(!features.contact&&!features.booking)return '';
 const en=lang==='en',esc=escapeHtml,isPublic=/^[a-f0-9]{32}$/.test(siteId);
 const note=en?'This is a request, not an automatically confirmed reservation. The business must contact you.':
  'Aceasta este o solicitare, nu o rezervare confirmată automat. Afacerea trebuie să vă contacteze.';
 const tip=en?'Your information is sent to the business owner to respond. A privacy notice is required before going live.':
  'Datele ajung la proprietarul afacerii pentru a răspunde. Înainte de publicare este necesară informarea privind confidențialitatea.';
 const form=(mode,body)=>{
  const action=isPublic?'/s/'+siteId+'/'+mode:'#';
  return '<form method="post" accept-charset="UTF-8" action="'+action+'" class="studio-visitor-form">'+
   '<label>'+(en?'Name':'Nume')+'<input name="name" maxlength="100" required minlength="2" autocomplete="name"'+(isPublic?'':' disabled')+'></label>'+
   '<label>Email<input name="email" type="email" required maxlength="180" autocomplete="email"'+(isPublic?'':' disabled')+'></label>'+
   '<label>'+(en?'Telephone (optional)':'Telefon (opțional)')+'<input name="phone" type="tel" maxlength="45"'+(isPublic?'':' disabled')+'></label>'+
   '<div class="studio-trap" aria-hidden="true"><label>Website<input name="website" tabindex="-1" autocomplete="off"></label></div>'+
   body+'<label class="studio-form-consent"><input name="privacy_ack" type="checkbox" value="yes" required'+(isPublic?'':' disabled')+'>'+
   (en?'I understand the business will use these details to respond.':'Înțeleg că afacerea va utiliza aceste date pentru a-mi răspunde.')+'</label>'+
   '<p class="studio-form-note">'+tip+'</p>'+
   (features.privacyUrl?'<p class="studio-form-note"><a href="'+esc(features.privacyUrl)+'" rel="noopener noreferrer" target="_blank">'+
   (en?'Privacy policy':'Politica de confidențialitate')+'</a></p>':'')+
   '<button type="submit"'+(isPublic?'':' disabled')+'>'+
   (mode==='contact'?(en?'Send message':'Trimite mesaj'):(en?'Send booking request':'Trimite solicitarea'))+'</button>'+
   (!isPublic?'<p class="studio-form-note">'+(en?'Preview only. Publish with the backend to activate submissions.':
    'Doar demonstrație. Publică site-ul împreună cu backendul pentru activare.')+'</p>':'')+
   '</form>';
 };
 const sections=[];
 if(features.contact){
  sections.push('<div class="studio-visitor-panel"><h3>'+(en?'Contact the business':'Scrie afacerii')+'</h3>'+
   form('contact','<label>'+(en?'Message':'Mesaj')+'<textarea name="message" rows="4" maxlength="1400" required minlength="12"'+(isPublic?'':' disabled')+'></textarea></label>')+'</div>');
 }
 if(features.booking){
  const category=studioBookingType(draft.kind);
  let fields='';
  if(category==='stay'){
   const options=(Array.isArray(draft.rooms)?draft.rooms:[]).filter(x=>x.label).map(x=>
    '<option value="'+esc(x.label)+'">'+esc(x.label)+'</option>').join('');
   fields='<label>'+(en?'Room category':'Categoria camerei')+'<select name="roomLabel" required'+(isPublic?'':' disabled')+'>'+options+'</select></label>'+
    '<label>'+(en?'Arrival':'Sosire')+'<input name="start" type="date" required'+(isPublic?'':' disabled')+'></label>'+
    '<label>'+(en?'Departure':'Plecare')+'<input name="end" type="date" required'+(isPublic?'':' disabled')+'></label>';
  }else{
   fields='<label>'+(en?'Requested date':'Data dorită')+'<input name="date" type="date" required'+(isPublic?'':' disabled')+'></label>'+
    '<label>'+(en?'Requested time':'Ora dorită')+'<input name="time" type="time" required'+(isPublic?'':' disabled')+'></label>';
  }
  fields+='<label>'+(en?(category==='stay'?'Guests':'People'):(category==='stay'?'Oaspeți':'Persoane'))+
   '<input name="partySize" type="number" min="1" max="30" value="2" required'+(isPublic?'':' disabled')+'></label>'+
   '<label>'+(en?'Details (optional)':'Detalii (opțional)')+
   '<textarea name="message" rows="2" maxlength="500"'+(isPublic?'':' disabled')+'></textarea></label>';
  sections.push('<div class="studio-visitor-panel"><h3>'+(en?'Request a booking':'Solicită o rezervare / programare')+
   '</h3><p class="studio-form-note">'+note+'</p>'+form('booking',fields)+'</div>');
 }
 return '<section class="studio-visitor-forms" id="visitor-forms-'+lang+'">'+sections.join('')+'</section>';
}
export const STUDIO_VISITOR_CSS=String.raw`
.studio-visitor-forms{padding:32px clamp(18px,6vw,84px);display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr));gap:20px;background:var(--paper);color:var(--ink)}
.studio-visitor-panel{border:1px solid #7774;border-radius:14px;padding:20px;background:#ffffffbb}
.studio-visitor-panel h3{font-size:clamp(22px,3vw,31px);line-height:1.2;margin:0 0 16px}
.studio-visitor-form{display:grid;gap:10px}
.studio-visitor-form label{font:600 13px/1.45 system-ui,sans-serif;display:grid;gap:4px}
.studio-visitor-form input:not([type=checkbox]),.studio-visitor-form select,.studio-visitor-form textarea{box-sizing:border-box;width:100%;max-width:100%;padding:10px;border:1px solid #6b7a8399;border-radius:7px;font:400 14px/1.4 system-ui,sans-serif;background:#fff;color:#17212c}
.studio-visitor-form .studio-form-consent{display:flex;gap:8px;font-weight:400;align-items:flex-start}
.studio-form-note{font:400 12px/1.5 system-ui,sans-serif;opacity:.8}
.studio-visitor-form button{background:var(--ink);color:var(--paper);padding:12px;border-radius:9px;border:0;cursor:pointer;font:700 14px/1.3 system-ui,sans-serif}
.studio-trap{position:absolute;left:-10000px;top:auto;height:1px;overflow:hidden}
`;
