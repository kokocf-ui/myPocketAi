import assert from "node:assert/strict";
import {publicTelegramPostUrl,discoverTelegramPublicLinks,telegramPublicLinkSearchIntent} from "./telegram_public_web_links.mjs";
assert.equal(publicTelegramPostUrl("https://t.me/examplechannel/123"),"https://t.me/examplechannel/123");
assert.equal(publicTelegramPostUrl("https://t.me/s/examplechannel/123"),"https://t.me/examplechannel/123");
for(const u of ["https://t.me/c/1234/56","https://t.me/+invite","https://evil.example/post","https://t.me/examplechannel","https://t.me/examplechannel/123/extra"])
 assert.equal(publicTelegramPostUrl(u),null);
assert.equal(telegramPublicLinkSearchIntent("Caută pe Telegram știri despre Ucraina"),"ucraina");
assert.equal(telegramPublicLinkSearchIntent("search Telegram news about Romania"),"romania");
assert.equal(telegramPublicLinkSearchIntent("Știri despre România"),null);
assert.equal((await discoverTelegramPublicLinks({},"x")).status,"invalid_query");
assert.equal((await discoverTelegramPublicLinks({},"Ukraine")).status,"not_configured");
const fetchBefore=globalThis.fetch;let searches=0;
try{
 globalThis.fetch=async(url,init)=>{
  searches++;
  assert.equal(url,"https://api.exa.ai/search");
  const body=JSON.parse(init.body);
  assert.deepEqual(body.includeDomains,["t.me"]);
  assert.ok(!body.contents && !body.autoprompt);
  assert.match(body.query,/site:t\.me/);
  return {ok:true,json:async()=>({results:[
   {url:"https://t.me/examplechannel/12",title:"Indexed title about Ukraine",publishedDate:"2026-11-05T08:00:00Z"},
   {url:"https://t.me/examplechannel/12"},
   {url:"https://t.me/c/123/45"},
   {url:"https://t.me/anotherchannel/34"},
   {url:"https://example.com/article"}]})};
 };
 const out=await discoverTelegramPublicLinks({EXA_API_KEY:"test"},"Ukraine",10);
 assert.equal(out.status,"success");assert.equal(out.links.length,2);
 assert.equal(out.links[0].content_retrieved,false);
 assert.equal(out.links[0].url,"https://t.me/examplechannel/12");
 assert.equal(out.links[0].title,"Indexed title about Ukraine");
 assert.equal(out.links[0].published_at,"2026-11-05T08:00:00Z");
 assert.match(out.links[1].title,/Telegram @anotherchannel/);
 assert.equal(searches,1);
}finally{globalThis.fetch=fetchBefore;}
console.log("Telegram public link discovery tests passed");
