import assert from "node:assert/strict";
import backend from "./backend.js";
import {
 telegramDirectReady,telegramOwnerAuthorized,telegramDirectQuery,
 telegramPublicResults,searchTelegramDirect
} from "./telegram_mtproto_direct.mjs";
const env={
 TELEGRAM_API_ID:"1234567",TELEGRAM_API_HASH:"a".repeat(32),
 TELEGRAM_SESSION:"S".repeat(80),TELEGRAM_DIRECT_ACCESS_TOKEN:"z".repeat(42)
};
assert.equal(telegramDirectReady({}).ready,false);
assert.equal(telegramDirectReady(env).ready,true);
assert.equal(telegramDirectReady({...env,TELEGRAM_SESSION:""}).ready,false);
assert.equal(telegramDirectReady({...env,TELEGRAM_API_HASH:"incorrect"}).ready,false);
assert.equal(await telegramOwnerAuthorized("Bearer "+env.TELEGRAM_DIRECT_ACCESS_TOKEN,env.TELEGRAM_DIRECT_ACCESS_TOKEN),true);
assert.equal(await telegramOwnerAuthorized("Bearer "+"y".repeat(42),env.TELEGRAM_DIRECT_ACCESS_TOKEN),false);
assert.equal(await telegramOwnerAuthorized(null,env.TELEGRAM_DIRECT_ACCESS_TOKEN),false);
assert.equal(telegramDirectQuery("x"),null);
assert.equal(telegramDirectQuery("Ukraine",500).limit,10);
assert.equal(telegramDirectQuery("Ukraine",0).limit,1);
assert.equal(telegramDirectQuery(" Ukraine  war ",3).q,"Ukraine war");
const raw={
 chats:[
  {id:123n,broadcast:true,username:"officialnews",title:"Public News"},
  {id:124n,broadcast:false,username:"privategroup",title:"Private Group"},
  {id:125n,broadcast:true,title:"Without Public Username"},
  {id:126n,broadcast:true,usernames:[{username:"publicalternative",active:true}]}
 ],
 messages:[
  {id:1,peerId:{channelId:123n},message:"Public first news item about Ukraine",
   date:Date.UTC(2026,10,5,10)/1000},
  {id:1,peerId:{channelId:123n},message:"Duplicate public",date:1},
  {id:2,peerId:{channelId:124n},message:"Do NOT expose private group",date:1},
  {id:3,peerId:{channelId:125n},message:"Do NOT expose unlisted channel",date:1},
  {id:4,peerId:{channelId:126n},message:"Another public post",date:Date.UTC(2026,10,5,9)/1000}
 ]};
const rows=telegramPublicResults(raw,8);
assert.equal(rows.length,2);
assert.equal(rows[0].url,"https://t.me/officialnews/1");
assert.equal(rows[1].url,"https://t.me/publicalternative/4");
assert.equal(rows.every(x=>x.ai_ingestion_enabled===false),true);
assert.equal(rows.every(x=>x.translation_status==="original_untranslated"),true);
let opens=0,closes=0,lookups=0;
const fake=()=>({
 connect:async()=>{opens++;return true},
 search:async(q,n)=>{lookups++;assert.equal(q,"Ukraine");assert.equal(n,3);return raw},
 close:async()=>{closes++}
});
const out=await searchTelegramDirect(env,"Ukraine",3,fake);
assert.equal(out.status,"success");
assert.equal(out.rows.length,2);
assert.equal(out.auto_collection,false);
assert.equal(out.paid_stars_used,false);
assert.equal(opens,1);
assert.equal(lookups,1);
assert.equal(closes,1);
const disabled=await searchTelegramDirect({...env,TELEGRAM_SESSION:""},"Ukraine",3,
 ()=>{throw Error("must never create socket")});
assert.equal(disabled.status,"not_configured");
assert.equal((await searchTelegramDirect(env,"a",3,()=>{throw Error("must never create socket")})).status,"invalid_query");
const notAuthorized=await searchTelegramDirect(env,"Ukraine",3,
 ()=>({connect:async()=>false,close:async()=>{closes++}}));
assert.equal(notAuthorized.status,"authorization_required");
assert.equal(closes,2);
// HTTP endpoints must not permit untrusted users to query the owner's session.
const status=await backend.fetch(new Request("https://test.example/api/telegram-direct-status"),env);
const statusBody=await status.json();
assert.equal(status.status,200);
assert.equal(statusBody.status,"configured_pending_live_verification");
assert.equal(JSON.stringify(statusBody).includes(env.TELEGRAM_API_HASH),false);
assert.equal(JSON.stringify(statusBody).includes(env.TELEGRAM_SESSION),false);
const unauthorized=await backend.fetch(new Request("https://test.example/api/telegram-direct-search",{
 method:"POST",headers:{"Content-Type":"application/json"},
 body:JSON.stringify({query:"Ukraine"})
}),env);
assert.equal(unauthorized.status,401);
const pending=await backend.fetch(new Request("https://test.example/api/telegram-direct-search",{
 method:"POST",headers:{"Authorization":"Bearer "+env.TELEGRAM_DIRECT_ACCESS_TOKEN,
 "Content-Type":"application/json"},
 body:JSON.stringify({query:"Ukraine"})
}),{...env,TELEGRAM_SESSION:""});
assert.equal(pending.status,409);
assert.equal((await pending.json()).status,"authorization_pending");
console.log("PASS Telegram MTProto optional private search, sanitization, consent gate and zero live network");
