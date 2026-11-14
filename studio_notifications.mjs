// Optional transactional mail through Cloudflare Email Sending.
// No notifications are claimed as delivered unless the provider returns success.
// Owner configures verified sender and Email binding in their own account.
const validEmail=v=>typeof v==='string'&&/^[^\s@<>]{1,90}@[^\s@<>]{1,90}\.[^\s@<>]{2,24}$/.test(v);
const bound=(s,n)=>String(s||'').trim().slice(0,n);
export function mailConfigured(env){
 return !!env.EMAIL&&typeof env.EMAIL.send==='function'&&validEmail(env.STUDIO_MAIL_FROM);
}
export async function notifyBusiness(env,{to,subject,body}){
 if(!mailConfigured(env)||!validEmail(to))return {sent:false,reason:'not_configured'};
 try{
  const result=await env.EMAIL.send({
   from:env.STUDIO_MAIL_FROM,to,subject:bound(subject,140),text:bound(body,3000)
  });
  return {sent:result?.success!==false,providerId:typeof result?.messageId==='string'?result.messageId:''};
 }catch{return {sent:false,reason:'provider_unavailable'}}
}
export function notificationForOwner(draft,item){
 const business=bound(draft?.name,110);
 const type=item.type==='booking'?'rezervare / programare':item.type==='order'?'comandă':'mesaj';
 return {
  to:draft?.contact?.email||'',
  subject:'Eva Site Studio — '+type+' nouă ('+business+')',
  body:[
   'A sosit o nouă solicitare pentru '+business+'.',
   'Tip: '+type,
   'Data înregistrării: '+new Date(item.at).toISOString(),
   'Deschide panoul de administrare Eva pentru detaliile complete.',
   'Nu este o confirmare de rezervare sau plată.'
  ].join('\n')
 };
}
export function notificationForCustomer(draft,item,action){
 if(!validEmail(item.email))return null;
 const business=bound(draft?.name,110);
 const message=item.type==='booking'&&action==='confirmed'?
  'Rezervarea / programarea a fost confirmată de '+business+'.':
  item.type==='order'&&action==='paid'?
  'Plata pentru comandă a fost confirmată de furnizorul de plăți. '+business+' va pregăti comanda.':
  item.type==='booking'&&action==='declined'?
  'Solicitarea ta de rezervare / programare nu a putut fi acceptată de '+business+'.':
  'Solicitarea ta a fost actualizată de '+business+'. Verifică direct cu afacerea dacă ai întrebări.';
 return {to:item.email,subject:'Actualizare '+business,
  body:message+'\nAcest mesaj este generat automat în numele afacerii. Pentru întrebări, contactează afacerea.'};
}
