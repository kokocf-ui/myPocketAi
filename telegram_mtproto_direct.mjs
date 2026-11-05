// Optional, owner-authorized Telegram MTProto CLIENT lookup.
// No Telegram Bot API, no hidden channel, no scheduled collection,
// no LLM ingestion or automatic translation, no paid search or Stars.
// The owner must sign in once and store TELEGRAM_SESSION as a Worker secret.
// This is a PRIVATE diagnostic/on-demand client route, never a public shared
// Telegram account for users of the international application.
const digits=/^[1-9][0-9]{4,11}$/;
const hex=/^[a-f0-9]{32}$/i;
export function telegramDirectReady(env={}){
 const credentials=digits.test(String(env.TELEGRAM_API_ID||""))
  &&hex.test(String(env.TELEGRAM_API_HASH||""));
 const session=typeof env.TELEGRAM_SESSION==="string"&&env.TELEGRAM_SESSION.length>=50;
 const ownerAccess=typeof env.TELEGRAM_DIRECT_ACCESS_TOKEN==="string"
  &&env.TELEGRAM_DIRECT_ACCESS_TOKEN.length>=32;
 return {credentials,session,owner_access:ownerAccess,
  ready:Boolean(credentials&&session&&ownerAccess)};
}
export async function telegramOwnerAuthorized(header,stored){
 const token=String(header||"").match(/^Bearer ([A-Za-z0-9_\-]{32,256})$/)?.[1]||"";
 if(!token||typeof stored!=="string"||stored.length<32)return false;
 const encode=new TextEncoder(),hash=async value=>new Uint8Array(
  await crypto.subtle.digest("SHA-256",encode.encode(value)));
 const a=await hash(token),b=await hash(stored);
 let diff=0;
 for(let i=0;i<a.length;i++)diff|=a[i]^b[i];
 return diff===0;
}
export function telegramDirectQuery(query,limit=8){
 const q=String(query||"").replace(/\s+/g," ").trim();
 if(q.length<3||q.length>120||/[\u0000-\u001F<>]/.test(q))return null;
 return {q,limit:Math.min(10,Math.max(1,Number.isFinite(Number(limit))?
  Math.trunc(Number(limit)):8))};
}
function publicUsername(chat){
 const a=String(chat?.username||"").replace(/^@/,"");
 if(/^[a-z][a-z0-9_]{4,31}$/i.test(a))return a;
 const extra=Array.isArray(chat?.usernames)
  ?chat.usernames.find(x=>x?.active&&/^[a-z][a-z0-9_]{4,31}$/i.test(x.username||"")):null;
 return extra?.username||null;
}
export function telegramPublicResults(raw,limit=8){
 const channels=new Map();
 for(const chat of Array.isArray(raw?.chats)?raw.chats:[]){
  if(chat?.broadcast!==true)continue;
  const username=publicUsername(chat);
  if(username&&chat.id!=null)channels.set(String(chat.id),{
   username,title:String(chat.title||username).slice(0,85)});
 }
 const seen=new Set(),rows=[];
 for(const m of Array.isArray(raw?.messages)?raw.messages:[]){
  const id=Number(m?.id),channel=channels.get(String(m?.peerId?.channelId||""));
  if(!channel||!Number.isSafeInteger(id)||id<=0)continue;
  const url="https://t.me/"+channel.username+"/"+id;
  if(seen.has(url))continue;
  seen.add(url);
  const excerpt=String(m?.message||"").replace(/\s+/g," ").trim().slice(0,360);
  if(!excerpt)continue;
  const seconds=Number(m.date);
  rows.push({title:excerpt.slice(0,140),summary:excerpt,
   url,source_name:"Telegram @"+channel.username,
   channel_title:channel.title,
   published_at:Number.isFinite(seconds)&&seconds>0?new Date(seconds*1000).toISOString():null,
   verification:"unverified_public_channel_post",
   content_retrieved:true,source_platform:"Telegram",
   translation_status:"original_untranslated",
   ai_ingestion_enabled:false});
 }
 rows.sort((a,b)=>(b.published_at||"").localeCompare(a.published_at||""));
 return rows.slice(0,Math.max(1,Math.min(10,Number(limit)||8)));
}
export async function createTelegramDirectDriver(env){
 // Lazy import: no Telegram client, socket, or billed Workers AI call is
 // initialized for ordinary assistant, maps, news, or public-index queries.
 const [{TelegramClient,Api},{StringSession}]=await Promise.all([
  import("teleproto"),import("teleproto/sessions")]);
 const client=new TelegramClient(new StringSession(String(env.TELEGRAM_SESSION)),
  Number(env.TELEGRAM_API_ID),String(env.TELEGRAM_API_HASH),{
   connectionRetries:1,reconnectRetries:0,requestRetries:0,
   timeout:6,floodSleepThreshold:0,autoReconnect:false,catchUp:false});
 return {
  connect:async()=>{await client.connect();return client.isUserAuthorized()},
  search:async(q,limit)=>client.invoke(new Api.messages.SearchGlobal({
    q,filter:new Api.InputMessagesFilterEmpty(),
    minDate:0,maxDate:0,offsetRate:0,offsetPeer:new Api.InputPeerEmpty(),
    offsetId:0,limit:Math.min(40,limit*4),broadcastsOnly:true})),
  close:async()=>client.disconnect()
 };
}
export async function searchTelegramDirect(env={},query="",limit=8,driverFactory=createTelegramDirectDriver){
 const parsed=telegramDirectQuery(query,limit);
 if(!parsed)return {status:"invalid_query",rows:[],reason:"query_length_or_format"};
 if(!telegramDirectReady(env).ready)return {status:"not_configured",rows:[],
   reason:"mtproto_credentials_session_and_owner_token_required"};
 let driver;
 try{
  driver=await driverFactory(env);
  const authorized=await driver.connect();
  if(!authorized)return {status:"authorization_required",rows:[]};
  // messages.searchGlobal with broadcastsOnly is not paid channels.searchPosts.
  // This is NOT guaranteed to search all world public channel posts.
  const raw=await driver.search(parsed.q,parsed.limit);
  const rows=telegramPublicResults(raw,parsed.limit);
  return {status:"success",rows,source:"Telegram MTProto: user-visible public broadcasts",
    mode:"read_only_explicit_owner_search",search_scope:"limited_search_global",
    ai_ingestion_enabled:false,auto_collection:false,paid_stars_used:false,
    reply:rows.length?"Postări din canale publice accesibile clientului Telegram. Afirmațiile nu sunt verificate independent.":"Nu am găsit postări publice accesibile în căutarea limitată Telegram."};
 }catch(error){
  const msg=String(error?.message||"").toUpperCase();
  const reason=/AUTH_KEY|SESSION_REVOKED|SESSION_EXPIRED|USER_DEACTIVATED/.test(msg)?"authorization_required"
   :/FLOOD_WAIT|FLOOD_PREMIUM_WAIT/.test(msg)?"telegram_rate_limited"
   :"telegram_connection_unavailable";
  return {status:"unavailable",rows:[],reason};
 }finally{
  if(driver)try{await driver.close()}catch{}
 }
}
