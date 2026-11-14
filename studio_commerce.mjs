// Pure, shared commercial rules. All prices/availability come from the owner's saved draft.
// No AI calls, no fabricated availability, no local timezone conversion guesses.
const clean=(x,n=120)=>typeof x==='string'?x.trim().slice(0,n):'';
const positiveInt=(n,maximum)=>Number.isInteger(Number(n))&&Number(n)>=0&&Number(n)<=maximum?Number(n):0;
export const COMMERCIAL_CURRENCIES=Object.freeze(['GBP','EUR','RON','USD']);
export function normalizeCommercial(input={},kind='other'){
 const currency=COMMERCIAL_CURRENCIES.includes(input.currency)?input.currency:'GBP';
 const products=(Array.isArray(input.products)?input.products:[]).slice(0,80).map((item,i)=>({
  id:/^[a-z0-9][a-z0-9-]{1,49}$/.test(item?.id||'')?item.id:'p-'+i,
  title:clean(item?.title,95),description:clean(item?.description,350),
  priceMinor:positiveInt(item?.priceMinor,100000000),
  inventory:positiveInt(item?.inventory,99999)
 })).filter(p=>p.title&&p.priceMinor>0);
 const seen=new Set();
 const unique=products.filter(p=>{if(seen.has(p.id))return false;seen.add(p.id);return true});
 return {
  currency,products:unique,
  slotCapacity:positiveInt(input.slotCapacity,999),
  slotMinutes:[15,30,45,60,90,120,180,240].includes(Number(input.slotMinutes))?Number(input.slotMinutes):60,
  emailNotifications:input.emailNotifications===true,
  automaticConfirmation:input.automaticConfirmation===true
 };
}
export function bookingCapacity(draft,entry){
 if(entry.bookingType==='stay'){
  const room=(draft.rooms||[]).find(r=>r.label===entry.roomLabel);
  return room?positiveInt(room.count,999):0;
 }
 return positiveInt(draft.commerce?.slotCapacity,999);
}
const overlaps=(a,b)=>a.start<b.end&&b.start<a.end;
function slotInterval(entry,draft){
 if(entry.bookingType==='stay')return {start:entry.start,end:entry.end};
 const duration=draft.commerce?.slotMinutes||60;
 const time=new Date(entry.date+'T'+entry.time+':00.000Z').getTime();
 return {start:time,end:time+duration*60000};
}
export function bookingAvailability(draft,inbox,entry,excludeId=''){
 const capacity=bookingCapacity(draft,entry);
 if(!capacity)return {available:false,remaining:0,capacity:0,reason:'capacity_not_configured'};
 const target=slotInterval(entry,draft);
 const active=(inbox||[]).filter(item=>item.type==='booking'&&item.status==='confirmed'&&item.id!==excludeId);
 let used=0;
 for(const old of active){
  if(old.bookingType!==entry.bookingType)continue;
  if(entry.bookingType==='stay'&&old.roomLabel!==entry.roomLabel)continue;
  const interval=slotInterval(old,draft);
  if(overlaps(target,interval))used+=entry.bookingType==='table'?Number(old.partySize)||1:1;
 }
 const requested=entry.bookingType==='table'?Number(entry.partySize)||1:1;
 return {available:capacity-used>=requested,remaining:Math.max(0,capacity-used),capacity,requested};
}
export function validateOrderDraft(raw,draft){
 if(!draft.features?.shop)throw Error('feature_disabled');
 const commerce=normalizeCommercial(draft.commerce,draft.kind);
 const code=clean(raw.productId,50),product=commerce.products.find(p=>p.id===code);
 const qty=Number(raw.quantity);
 if(!product||!Number.isInteger(qty)||qty<1||qty>20)throw Error('invalid_product');
 if(qty>product.inventory)throw Error('out_of_stock');
 if(raw.website)throw Error('spam');
 if(raw.privacy_ack!=='yes')throw Error('privacy_ack_required');
 const name=clean(raw.name,100),email=clean(raw.email,180).toLowerCase(),phone=clean(raw.phone,45);
 if(name.length<2||!/^[^\s@<>]{1,90}@[^\s@<>]{1,90}\.[^\s@<>]{2,24}$/.test(email))
  throw Error('invalid_contact');
 return {type:'order',name,email,phone,productId:product.id,productTitle:product.title,
  quantity:qty,unitPriceMinor:product.priceMinor,totalMinor:product.priceMinor*qty,
  currency:commerce.currency,message:clean(raw.message,500)};
}
export function orderAvailability(inbox,draft,order){
 const product=(draft.commerce?.products||[]).find(p=>p.id===order.productId);
 if(!product)return {available:false,reason:'product_removed'};
 const committed=(inbox||[]).filter(x=>x.type==='order'&&x.productId===order.productId&&
  ['confirmed','paid','fulfilled'].includes(x.status));
 const used=committed.reduce((sum,x)=>sum+(Number(x.quantity)||0),0);
 return {available:product.inventory-used>=order.quantity,remaining:Math.max(0,product.inventory-used)};
}
export function formatMoney(minor,currency){
 return new Intl.NumberFormat('ro-RO',{style:'currency',currency}).format(minor/100);
}
export async function stripeSignatureValid(body,header,secret,now=Date.now()){
 if(typeof header!=='string'||typeof secret!=='string'||!secret.startsWith('whsec_'))return false;
 const pairs=header.split(',').map(s=>s.trim().split('='));
 const timestamp=Number(pairs.find(([key])=>key==='t')?.[1]||0);
 const signatures=pairs.filter(([key])=>key==='v1').map(([,value])=>value);
 if(!Number.isSafeInteger(timestamp)||Math.abs(now-timestamp*1000)>5*60000||!signatures.length)return false;
 const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(secret),
  {name:'HMAC',hash:'SHA-256'},false,['sign']);
 const bytes=await crypto.subtle.sign('HMAC',key,new TextEncoder().encode(timestamp+'.'+body));
 const digest=[...new Uint8Array(bytes)].map(b=>b.toString(16).padStart(2,'0')).join('');
 let valid=0;
 for(const candidate of signatures){
  if(!/^[0-9a-f]{64}$/i.test(candidate))continue;
  let diff=0;for(let i=0;i<64;i++)diff|=digest.charCodeAt(i)^candidate.toLowerCase().charCodeAt(i);
  valid|=Number(diff===0);
 }
 return valid===1;
}
export async function createStripeCheckout(env,origin,siteId,order){
 if(!env.STRIPE_SECRET_KEY||!env.STRIPE_SECRET_KEY.startsWith('sk_'))throw Error('payment_not_configured');
 const params=new URLSearchParams({
  mode:'payment',
  'line_items[0][price_data][currency]':order.currency.toLowerCase(),
  'line_items[0][price_data][unit_amount]':String(order.unitPriceMinor),
  'line_items[0][price_data][product_data][name]':order.productTitle,
  'line_items[0][quantity]':String(order.quantity),
  client_reference_id:siteId+'.'+order.id,
  customer_email:order.email,
  success_url:origin+'/s/'+siteId+'?payment=returned',
  cancel_url:origin+'/s/'+siteId+'?payment=cancelled'
 });
 const response=await fetch('https://api.stripe.com/v1/checkout/sessions',{
  method:'POST',headers:{Authorization:'Bearer '+env.STRIPE_SECRET_KEY,
  'Content-Type':'application/x-www-form-urlencoded','Idempotency-Key':'eva-'+siteId+'-'+order.id},
  body:params.toString(),signal:AbortSignal.timeout(12000)});
 const result=await response.json().catch(()=>({}));
 if(!response.ok||typeof result.url!=='string'||!result.url.startsWith('https://checkout.stripe.com/'))
  throw Error('checkout_unavailable');
 return {sessionId:result.id,url:result.url};
}
