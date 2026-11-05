// Telegram channel-post references for EXPLICITLY CONSENTING public publishers.
// Telegram TOS prohibit AI-oriented bulk harvesting. This bridge uses only bot
// updates from allowlisted channels whose publishers opted in. No group/private
// messages, no cross-channel search, no training, no automatic AI ingestion.
// Bot API getUpdates holds updates for at most 24 hours and is unavailable if
// another app configured a Telegram webhook for this bot.
const allowedNames=raw=>new Set(String(raw||"").split(/[,;\s]+/).map(s=>s.replace(/^@/,"").toLowerCase().trim())
 .filter(s=>/^[a-z][a-z0-9_]{4,31}$/i.test(s)));
const localize=(ro,en,language)=>language==="en"?en:ro;
export function telegramConfigured(env={}){
 const approved=allowedNames(env.TELEGRAM_APPROVED_CHANNELS);
 return Boolean(env.TELEGRAM_BOT_TOKEN&&approved.size&&env.TELEGRAM_PUBLISHER_CONSENT==="confirmed");
}
export function isTelegramNewsRequest(message){
 const text=String(message||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
 return /\btelegram\b/.test(text)&&/\b(?:stir\w*|noutat\w*|news|postar\w*|publicati\w*|actualitat\w*|canal\w*|channel\w*|updates?)\b/.test(text);
}
export function telegramPublicPost(update,approved){
 // Never process a bot conversation, member details, private or group chat.
 const p=update?.channel_post||update?.edited_channel_post;
 if(!p||typeof p!=="object"||p.chat?.type!=="channel"||!Number.isInteger(p.message_id)||p.message_id<=0)return null;
 const username=String(p.chat.username||"").replace(/^@/,"");
 const selected=approved instanceof Set?approved:allowedNames(approved);
 if(!/^[a-z][a-z0-9_]{4,31}$/i.test(username)||!selected.has(username.toLowerCase()))return null;
 const date=Number(p.edit_date||p.date);
 if(!Number.isInteger(date)||date<=0)return null;
 const raw=String(p.text||p.caption||"").replace(/\s+/g," ").trim();
 const name=String(p.chat.title||username).replace(/\s+/g," ").trim().slice(0,80);
 const url="https://t.me/"+username+"/"+p.message_id;
 return {
  title:(raw.slice(0,155)||"Postare de la "+name).trim(),
  original_title:(raw.slice(0,155)||"Postare de la "+name).trim(),
  url,source_name:"Telegram @"+username,source_domain:"t.me",
  published_at:new Date(date*1000).toISOString(),
  summary:raw.length>155?raw.slice(155,315):"",
  detail:raw.slice(0,315),
  platform:"Telegram",channel:"@"+username,
  verification:"source_identified_claims_unverified",
  consent_scope:"publisher_authorized_public_channel",
  recency_status:"publisher_post_timestamp"
 };
}
export async function readConsentedTelegramPosts(env={},options={}){
 const language=String(options.language||"ro").slice(0,2);
 const approved=allowedNames(env.TELEGRAM_APPROVED_CHANNELS);
 if(!telegramConfigured(env)){
  return {status:"not_configured",rows:[],reason:"bot_token_channel_allowlist_and_consent_required",
    reply:localize("Telegram nu este configurat. Este necesar un bot, canale aprobate și consimțământul explicit al editorilor.","Telegram is not configured. A bot, approved channels and explicit publisher consent are required.",language)};
 }
 const token=String(env.TELEGRAM_BOT_TOKEN||"");
 // Avoid accidental upstream requests with malformed or placeholder tokens.
 if(!/^\d{5,15}:[A-Za-z0-9_-]{25,}$/.test(token))
  return {status:"not_configured",rows:[],reason:"bot_token_invalid_format",reply:localize("Tokenul botului nu este configurat corect.","Bot token is not configured correctly.",language)};
 try{
  const response=await fetch("https://api.telegram.org/bot"+token+"/getUpdates",{
   method:"POST",headers:{"Content-Type":"application/json"},
   body:JSON.stringify({limit:100,timeout:0,allowed_updates:["channel_post","edited_channel_post"]}),
   signal:AbortSignal.timeout(4500),redirect:"error"
  });
  if(!response.ok){
   return {status:"unavailable",rows:[],reason:response.status===409?"existing_webhook_or_polling_consumer":"telegram_api_unavailable",
    reply:localize("Nu pot citi actualizările Telegram ale botului configurat. Verifică dacă botul folosește deja un webhook și dacă are acces la canalele aprobate.","Unable to read the configured bot's Telegram updates. Check whether another webhook is active and whether the bot has access to approved channels.",language)};
  }
  const data=await response.json();
  if(!data||data.ok!==true||!Array.isArray(data.result))return {status:"unavailable",rows:[],reason:"invalid_bot_api_response",
   reply:localize("Telegram nu a returnat actualizări valide.","Telegram did not return valid updates.",language)};
  const unique=new Map(),max=Math.max(1,Math.min(20,Number(options.limit)||12));
  for(const update of data.result){
   const post=telegramPublicPost(update,approved);
   if(!post)continue;
   if(options.publicationDay&&post.published_at.slice(0,10)!==options.publicationDay)continue;
   unique.set(post.url,post);
  }
  const rows=[...unique.values()].sort((a,b)=>b.published_at.localeCompare(a.published_at)).slice(0,max);
  return {status:"success",rows,source:"Telegram Bot API (opt-in channels)",
   historical_limit_hours:24,full_channel_archive_available:false,private_chats_accessed:false,
   ai_ingestion_enabled:false,claims_independently_verified:false,
   reply:rows.length
    ?localize("Postări din canale Telegram autorizate. Afirmațiile nu sunt verificate independent.", "Posts from authorized Telegram channels. Claims have not been independently verified.",language)
    :localize("Nu sunt postări recente accesibile din canalele Telegram autorizate. Telegram păstrează actualizările botului cel mult 24 de ore; un webhook activ poate împiedica citirea lor.", "No recent updates from approved Telegram channels. Bot updates are retained for up to 24 hours, and an active webhook may prevent reading them.",language)};
 }catch{
  return {status:"unavailable",rows:[],reason:"bot_api_timeout_or_network_error",
   reply:localize("Serviciul Telegram nu este disponibil momentan.","Telegram is temporarily unavailable.",language)};
 }
}
