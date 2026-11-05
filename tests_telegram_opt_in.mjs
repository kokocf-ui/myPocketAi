import assert from "node:assert/strict";
import backend from "./backend.js";
import {telegramConfigured,isTelegramNewsRequest,telegramPublicPost,readConsentedTelegramPosts} from "./telegram_consented_channels.mjs";
const originalFetch=globalThis.fetch;
const goodToken="1234567890:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
const today=Math.floor(Date.UTC(2026,10,5,8,15,0)/1000);
const yesterday=Math.floor(Date.UTC(2026,10,4,19,0,0)/1000);
const message=(chat,id,date,text)=>({channel_post:{chat,message_id:id,date,text}});
const approved={type:"channel",username:"PublisherA",title:"Publisher consented"};
const approvedB={type:"channel",username:"PublisherB",title:"Also approved"};
const update=[
 message(approved,12,today,"Publisher update about a local press conference with link"),
 message(approvedB,7,yesterday,"International news agency report, not independently verified"),
 message({type:"channel",username:"UNAUTHORIZED",title:"Not approved"},99,today,"Private-looking content"),
 {message:{chat:{type:"private",id:123},message_id:22,text:"Sensitive private message",date:today}},
 message({type:"supergroup",username:"PublisherA"},34,today,"Secret group message"),
 message({type:"channel",username:"PrivateChannel",title:"No username provided"},45,today,"Not approved"),
];
const env={AI:{run:async()=>{throw Error("Telegram posts may not be automatically sent to AI")}},
 TELEGRAM_BOT_TOKEN:goodToken,TELEGRAM_APPROVED_CHANNELS:"@PublisherA,@PublisherB",
 TELEGRAM_PUBLISHER_CONSENT:"confirmed"};
let networkCalls=0;
globalThis.fetch=async(input,init)=>{
 networkCalls++;
 const url=String(input);
 assert.ok(url.startsWith("https://api.telegram.org/bot"+goodToken+"/getUpdates"));
 assert.equal(init.method,"POST");
 const body=JSON.parse(init.body);
 assert.deepEqual(body.allowed_updates,["channel_post","edited_channel_post"]);
 assert.equal(body.timeout,0);
 return new Response(JSON.stringify({ok:true,result:update}),{headers:{"content-type":"application/json"}});
};
try{
 assert.equal(telegramConfigured(env),true);
 assert.equal(telegramConfigured({...env,TELEGRAM_PUBLISHER_CONSENT:""}),false);
 assert.equal(telegramConfigured({...env,TELEGRAM_APPROVED_CHANNELS:""}),false);
 assert.equal(isTelegramNewsRequest("Știri din Telegram"),true);
 assert.equal(isTelegramNewsRequest("Canale Telegram autorizate"),true);
 assert.equal(isTelegramNewsRequest("Telegram"),false);
 assert.equal(isTelegramNewsRequest("Vreau o rețetă tradițională"),false);
 const p=telegramPublicPost(update[0],new Set(["publishera"]));
 assert.equal(p.url,"https://t.me/PublisherA/12");
 assert.equal(telegramPublicPost(update[2],new Set(["publishera"])),null);
 assert.equal(telegramPublicPost(update[3],new Set(["publishera"])),null);
 assert.equal(telegramPublicPost(update[4],new Set(["publishera"])),null);
 let noAuth=await readConsentedTelegramPosts({...env,TELEGRAM_PUBLISHER_CONSENT:""});
 assert.equal(noAuth.status,"not_configured");
 assert.equal(networkCalls,0,"No network call is allowed before opt-in/credentials");
 let feed=await readConsentedTelegramPosts(env,{language:"ro"});
 assert.equal(feed.status,"success");
 assert.equal(feed.rows.length,2);
 assert.ok(feed.rows.every(x=>x.verification==="source_identified_claims_unverified"));
 assert.ok(feed.rows.every(x=>x.url.startsWith("https://t.me/")));
 assert.equal(feed.private_chats_accessed,false);
 assert.equal(feed.ai_ingestion_enabled,false);
 assert.equal(feed.rows.some(x=>x.title.includes("Sensitive private")),false);
 const dated=await readConsentedTelegramPosts(env,{language:"ro",publicationDay:"2026-11-04"});
 assert.equal(dated.rows.length,1);
 assert.equal(dated.rows[0].channel,"@PublisherB");
 const get=await backend.fetch(new Request("https://pocket.test/api/public-intel?kind=telegram&lang=ro"),env);
 assert.equal(get.status,200);
 const listed=await get.json();
 assert.equal(listed.kind,"telegram");assert.equal(listed.status,"success");assert.equal(listed.items.length,2);
 assert.equal(listed.ai_ingestion_enabled,false);
 const chat=await backend.fetch(new Request("https://pocket.test/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},
 body:JSON.stringify({message:"Arată-mi știrile de pe Telegram",language:"ro",history:[]})}),env);
 assert.equal(chat.status,200);
 const response=await chat.json();
 assert.equal(response.structured_list?.type,"news");
 assert.equal(response.structured_list?.source_platform,"Telegram");
 assert.equal(response.structured_list?.rows.length,2);
 assert.equal(response.telegram_status,"success");
 assert.equal(response.ai_ingestion_enabled,false);
 assert.equal(response.sources.length,2);
 const denied=await backend.fetch(new Request("https://pocket.test/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},
  body:JSON.stringify({message:"Știri de pe Telegram",language:"ro"})}),{AI:env.AI});
 const denyBody=await denied.json();
 assert.equal(denyBody.telegram_status,"not_configured");
 assert.equal(denyBody.structured_list,undefined);
 const originalCount=networkCalls;
 globalThis.fetch=async()=>{networkCalls++;return new Response(JSON.stringify({ok:false,error_code:409,description:"Conflict"}),{status:409,headers:{"content-type":"application/json"}})};
 const conflict=await readConsentedTelegramPosts(env);
 assert.equal(conflict.status,"unavailable");
 assert.equal(conflict.reason,"existing_webhook_or_polling_consumer");
 assert.equal(networkCalls,originalCount+1);
 console.log("PASS explicit Telegram publisher consent, no private/group data, news table and public-intel integration");
}finally{globalThis.fetch=originalFetch}
