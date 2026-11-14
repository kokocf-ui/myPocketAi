// Shared security and business rules for the isolated Cloudflare Site Studio.
export const TRIAL_MILLIS=3*24*60*60*1000;
export const SESSION_MILLIS=7*24*60*60*1000;
const encoder=new TextEncoder();
export const hex=bytes=>Array.from(bytes,b=>b.toString(16).padStart(2,'0')).join('');
export const bytes=hexstr=>new Uint8Array((String(hexstr).match(/../g)||[]).map(b=>parseInt(b,16)));
export const rand=(n=32)=>hex(crypto.getRandomValues(new Uint8Array(n)));
export const sha256=async value=>hex(new Uint8Array(await crypto.subtle.digest('SHA-256',encoder.encode(String(value)))));
export const normalizeEmail=value=>String(value||'').trim().toLowerCase().slice(0,220);
export const validEmail=value=>/^[^\s@<>]{1,100}@[^\s@<>]{1,100}\.[^\s@<>]{2,24}$/.test(normalizeEmail(value));
export const validPassword=value=>typeof value==='string'&&value.length>=12&&value.length<=128&&
  /[a-z]/i.test(value)&&/[0-9!@#$%^&*?_+\-=]/.test(value);
export async function passwordHash(password,salt){
 const key=await crypto.subtle.importKey('raw',encoder.encode(password),'PBKDF2',false,['deriveBits']);
 const bits=await crypto.subtle.deriveBits({name:'PBKDF2',salt:bytes(salt),iterations:135000,hash:'SHA-256'},key,256);
 return hex(new Uint8Array(bits));
}
export function constantTimeEqual(a,b){
 const x=String(a||''),y=String(b||'');let diff=x.length^y.length;
 for(let i=0;i<Math.max(x.length,y.length);i++)diff|=(x.charCodeAt(i)||0)^(y.charCodeAt(i)||0);
 return diff===0;
}
export function entitlement(account,now=Date.now()){
 if(!account)return {plan:'none',canCreate:false,canGenerate:false,expiresAt:null};
 const premium=account.plan==='premium'&&(!account.premiumUntil||account.premiumUntil>now);
 const trialEnd=account.created+TRIAL_MILLIS;
 const trial=!premium&&now<trialEnd;
 return {plan:premium?'premium':trial?'trial':'expired',
   canCreate:premium||trial,canGenerate:premium||trial,
   expiresAt:premium?account.premiumUntil||null:trialEnd};
}
export const json=(payload,status=200,headers={})=>new Response(JSON.stringify(payload),{
 status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store',
 'X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer',...headers}
});
export async function bodyJson(request,max=1048576){
 const len=Number(request.headers.get('Content-Length')||0);
 if(len>max)throw Error('body_too_large');
 const raw=await request.text();
 if(raw.length>max)throw Error('body_too_large');
 let obj;try{obj=JSON.parse(raw)}catch{throw Error('invalid_json')}
 if(!obj||typeof obj!=='object'||Array.isArray(obj))throw Error('invalid_json');
 return obj;
}
export function validateManagement(input){
 const mode=['owner','managed','shared'].includes(input?.mode)?input.mode:'owner';
 if(mode==='owner')return {mode,monthly:null,currency:null,edits:null,turnaround:null,extraCost:null,notice:null,hosting:'owner',backups:'none'};
 const amount=value=>{
  if(typeof value==='string'&&/^\d+(?:[.,]\d{1,2})?$/.test(value))value=Number(value.replace(',','.'));
  if(!Number.isFinite(value)||value<0||value>100000)return null;
  return Math.round(value*100)/100;
 };
 const integer=(value,max)=>{
  const v=typeof value==='string'&&/^\d+$/.test(value)?Number(value):value;
  return Number.isInteger(v)&&v>0&&v<=max?v:null;
 };
 const monthly=amount(input.monthly),extraCost=amount(input.extraCost??input.extras);
 const edits=integer(input.edits,999),turnaround=integer(input.turnaround??input.response,180);
 const notice=integer(input.notice,365);
 const currency=['GBP','EUR','RON'].includes(input.currency)?input.currency:null;
 const hosting=['owner','creator'].includes(input.hosting)?input.hosting:null;
 const backups=['none','weekly','monthly'].includes(input.backups)?input.backups:null;
 const client=String(input.client||'').trim().slice(0,150),creator=String(input.creator||'').trim().slice(0,150);
 if([monthly,extraCost,edits,turnaround,notice,currency,hosting,backups].some(x=>x===null)||
  client.length<2||creator.length<2)throw Error('maintenance_terms_incomplete');
 return {mode,client,creator,monthly,currency,edits,turnaround,extraCost,notice,hosting,backups};
}
export function normalizeStudioPrompt(prompt,composition='wide'){
 const text=String(prompt||'').trim().replace(/\s+/g,' ').slice(0,330);
 if(text.length<8)throw Error('prompt_too_short');
 const framing={
  wide:'Wide establishing shot, full scene composition, all named subjects visible with environmental context.',
  full:'Full-body view of every subject, full objects and animals entirely inside the frame, camera far enough to show interaction.',
  medium:'Medium-wide shot with every essential named subject clearly included.',
  portrait:'Portrait-style composition, include all requested subjects; do not crop a named animal or object.'
 }[composition]||'Wide view with all essential named subjects visible.';
 // Preserve user language and named objects; no invented people, brands or services.
 return ('Professional high-quality photographic illustration. '+framing+
 ' Respect each object, animal, pose and interaction explicitly described in: '+text+
 '. Avoid unintended headshots or cropping essential objects.').slice(0,500);
}
export function publicSafeHtmlHeaders(preview=false,allowForms=false){
 return {
 'Content-Type':'text/html; charset=utf-8','Cache-Control':preview?'no-store':'public, max-age=60',
 'Content-Security-Policy':"default-src 'none'; script-src 'none'; img-src data: 'self'; style-src 'unsafe-inline'; base-uri 'none'; form-action "+(allowForms?"'self'":"'none'")+"; object-src 'none'; frame-ancestors "+(preview?"'self'":"'none'")+"; sandbox"+(allowForms?' allow-forms allow-same-origin':''),
 'X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer',
 'X-Frame-Options':preview?'SAMEORIGIN':'DENY'
 };
}
