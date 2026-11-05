import assert from "node:assert/strict";
import backend from "./backend.js";
const goodToken="1234567890:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
const publication=Date.UTC(2026,10,4,12,0,0)/1000;
const wrongDay=Date.UTC(2026,10,5,12,0,0)/1000;
let telegramNetworkCalls=0,gdeltCalls=0,modelCalls=0;
const privateText="A PRIVATE CHAT MESSAGE THAT MUST NOT LEAK";
const permittedText="Publisher-approved public channel briefing on international health research";
const deniedText="Unauthorized channel post that must not appear";
const updates=[
 {update_id:100,channel_post:{chat:{type:"channel",username:"PublisherA",title:"Authorized Publisher"},message_id:12,date:publication,text:permittedText}},
 {update_id:101,channel_post:{chat:{type:"channel",username:"PublisherA"},message_id:13,date:wrongDay,text:"Tomorrow's report is outside the yesterday window"}},
 {update_id:102,channel_post:{chat:{type:"channel",username:"Unauthorized"},message_id:19,date:publication,text:deniedText}},
 {update_id:103,message:{chat:{type:"private",id:111},message_id:24,date:publication,text:privateText}}
];
const articles=[
 {title:"Global diplomacy advances at international assembly",url:"https://apnews.com/article/global-diplomacy",seendate:"20261104T100000Z"},
 {title:"Climate financing discussed by international leaders",url:"https://bbc.com/news/world-climate",seendate:"20261104T130000Z"},
 {title:"Global research alliance announces international project",url:"https://dw.com/en/world-research/a-111",seendate:"20261104T140000Z"}
];
const originalFetch=globalThis.fetch;
globalThis.fetch=async(input,options)=>{
 const url=String(input);
 if(url.startsWith("https://api.telegram.org/")){
  telegramNetworkCalls++;
  assert.equal(url,"https://api.telegram.org/bot"+goodToken+"/getUpdates");
  const body=JSON.parse(options.body);
  assert.deepEqual(body.allowed_updates,["channel_post","edited_channel_post"]);
  return new Response(JSON.stringify({ok:true,result:updates}),{headers:{"content-type":"application/json"}});
 }
 if(url.startsWith("https://api.gdeltproject.org/")){
  gdeltCalls++;
  return new Response(JSON.stringify({articles}),{headers:{"content-type":"application/json"}});
 }
 if(url.startsWith("https://"))return new Response("<html><body>Publisher page.</body></html>",{headers:{"content-type":"text/html"}});
 throw new Error("Unexpected remote fetch "+url);
};
const ask=async(extra={})=>{
 const resp=await backend.fetch(new Request("https://test.local/api/chat",{
  method:"POST",headers:{"content-type":"application/json"},
  body:JSON.stringify({message:"Ce evenimente importante s-au întâmplat ieri în lume?",client_local_day:"2026-11-05",language:"en"})
 }),{AI:{run:async(m,p)=>{modelCalls++;const serialized=JSON.stringify(p);
  assert.ok(!serialized.includes(permittedText)&&!serialized.includes(privateText)&&!serialized.includes(deniedText),"Telegram content passed to AI");
  return {response:"[]"};}},...extra});
 assert.equal(resp.status,200);
 return resp.json();
};
try{
 const off=await ask({TELEGRAM_BOT_TOKEN:goodToken});
 assert.equal(off.structured_list.type,"news");
 assert.equal(off.structured_list.telegram_access_mode,"publisher_opt_in_only");
 assert.equal(off.structured_list.telegram_status,"publisher_opt_in_required");
 assert.equal(off.structured_list.telegram_result_count,0);
 assert.equal(telegramNetworkCalls,0,"Token alone must NOT trigger data collection");
 const enabled=await ask({TELEGRAM_BOT_TOKEN:goodToken,TELEGRAM_APPROVED_CHANNELS:"@PublisherA",TELEGRAM_PUBLISHER_CONSENT:"confirmed"});
 assert.equal(enabled.structured_list.type,"news");
 assert.equal(enabled.structured_list.telegram_status,"success");
 assert.equal(enabled.structured_list.telegram_result_count,1);
 const rows=enabled.structured_list.rows;
 const telegramPosts=rows.filter(x=>x.source_platform==="Telegram");
 assert.equal(telegramPosts.length,1);
 assert.equal(telegramPosts[0].url,"https://t.me/PublisherA/12");
 assert.equal(telegramPosts[0].verification,"source_identified_claims_unverified");
 assert.equal(telegramPosts[0].consent_scope,"publisher_authorized_public_channel");
 assert.ok(rows.some(x=>x.source_domain!=="t.me"),"Retain independent web news providers");
 assert.ok(!JSON.stringify(rows).includes(privateText),"Private chat leaked");
 assert.ok(!JSON.stringify(rows).includes(deniedText),"Unapproved channel leaked");
 assert.ok(!JSON.stringify(rows).includes("Tomorrow's report"),"Wrong date leaked");
 assert.equal(enabled.structured_list.telegram_ai_ingestion_enabled,false);
 assert.equal(telegramNetworkCalls,1);
 assert.ok(gdeltCalls>=4);
 console.log("PASS parallel opt-in Telegram and web news, privacy, day filter, token-only deny");
}finally{globalThis.fetch=originalFetch}
