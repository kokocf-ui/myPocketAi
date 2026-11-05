import assert from "node:assert/strict";
import {publicTelegramPostUrl,discoverTelegramPublicLinks,telegramPublicLinkSearchIntent} from "./telegram_public_web_links.mjs";
assert.equal(publicTelegramPostUrl("https://t.me/examplechannel/123"),"https://t.me/examplechannel/123");
assert.equal(publicTelegramPostUrl("https://t.me/s/examplechannel/123"),"https://t.me/examplechannel/123");
for(const u of ["https://t.me/c/1234/56","https://t.me/+invite","https://evil.example/post","https://t.me/examplechannel","https://t.me/examplechannel/123/extra"])
 assert.equal(publicTelegramPostUrl(u),null);
assert.equal(telegramPublicLinkSearchIntent("Caută pe Telegram știri despre Ucraina"),"ucraina");
assert.equal(telegramPublicLinkSearchIntent("search Telegram news about Romania"),"romania");
assert.equal(telegramPublicLinkSearchIntent("Știri despre România"),null);
assert.equal(telegramPublicLinkSearchIntent("Caută pe Telegram știri publice despre situația din Iran din ultimele 24 de ore."),"iran");
assert.equal(telegramPublicLinkSearchIntent("Caută pe Telegram știri publice despre războiul din Ucraina din ultimele 24 de ore."),"razboiul ucraina");
assert.equal((await discoverTelegramPublicLinks({},"x")).status,"invalid_query");
assert.equal((await discoverTelegramPublicLinks({},"Ukraine")).status,"not_configured");
const fetchBefore=globalThis.fetch;let searches=0;
try{
 globalThis.fetch=async(url,init)=>{
  searches++;
  assert.equal(url,"https://api.exa.ai/search");
  const body=JSON.parse(init.body);
  assert.deepEqual(body.includeDomains,["t.me"]);
  assert.equal(body.contents.highlights.maxCharacters,420);
  assert.ok(!body.autoprompt);
  assert.match(body.query,/site:t\.me/);
  return {ok:true,json:async()=>({results:[
   {url:"https://t.me/examplechannel/12",title:"Indexed title about Ukraine",highlights:["Public excerpt about Ukraine."],publishedDate:"2026-11-05T08:00:00Z"},
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
 assert.equal(out.links[0].excerpt,"Public excerpt about Ukraine.");
 assert.equal(out.links[0].published_at,"2026-11-05T08:00:00Z");
 assert.match(out.links[1].title,/Telegram @anotherchannel/);
 assert.equal(searches,1);
}finally{globalThis.fetch=fetchBefore;}

const previousFetch2=globalThis.fetch;
try{
 globalThis.fetch=async()=>({ok:true,json:async()=>({results:[
  {url:"https://t.me/recentchannel/101",title:"Iran current report",publishedDate:"2026-11-05T09:10:00Z",highlights:["Public indexed report about developments in Iran."]},
  {url:"https://t.me/recentchannel/102",title:"Iran embed boilerplate",publishedDate:"2026-11-05T09:11:00Z",highlights:["[Context](/s/recentchannel/102) Embed <script async src=\\\"https://telegram.org/js/telegram-widget.js\\\"></script>"]},
  {url:"https://t.me/recentchannel/103",title:"Old Iran report",publishedDate:"2026-06-11T08:00:00Z",highlights:["Old report outside the requested period."]},
  {url:"https://t.me/recentchannel/104",title:"Undated Iran report",highlights:["No trustworthy index publication date found."]},
  {url:"https://t.me/recentchannel/105",title:"Repeated Iran report",publishedDate:"2026-11-05T09:11:00Z",highlights:["Public indexed report about developments in Iran."]}
 ]})});
 const result=await discoverTelegramPublicLinks({EXA_API_KEY:"fixture"},"Iran",10,{
  sinceMs:Date.parse("2026-11-04T10:00:00Z"),nowMs:Date.parse("2026-11-05T10:00:00Z")
 });
 assert.equal(result.publication_filter,"indexed_date_after_requested_cutoff");
 assert.deepEqual(result.links.map(x=>x.url),["https://t.me/recentchannel/101","https://t.me/recentchannel/102"]);
 assert.equal(result.links[1].excerpt,"");
 assert.equal(result.undated_excluded,1);
 assert.equal(result.stale_excluded,1);
}finally{globalThis.fetch=previousFetch2;}
console.log("Telegram public link discovery tests passed");
