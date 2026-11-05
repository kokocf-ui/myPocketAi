import assert from "node:assert/strict";
import vm from "node:vm";
import {sanitizeNewsContext,resolveNewsFollowup,formatNewsFollowup,publicationDayWindow,isWithinPublicationDay} from "./news_context.mjs";
import backend from "./backend.js";
import frontend from "./index.js";

const news={type:"news",rows:[
 {title:"First original attributed article",url:"https://example.com/world/first",source_name:"Example News",published_at:"2026-11-04T15:00:00Z",summary:"Original publisher description"},
 {title:"Second original attributed article",url:"https://example.org/world/second",source_name:"Another News",published_at:"2026-11-04T13:00:00Z"}
]};
assert.equal(sanitizeNewsContext(news).rows.length,2);
assert.equal(sanitizeNewsContext({type:"news",rows:[{title:"Bad",url:"http://localhost/"}]}),null);
const first=resolveNewsFollowup("Arată-mi sursele pentru prima știre.",news);
assert.equal(first.kind,"sources");assert.equal(first.index,0);
assert.match(formatNewsFollowup(first,"ro"),/https:\/\/example\.com\/world\/first/);
assert.match(formatNewsFollowup(first,"ro"),/nu o confirmare independentă/);
const second=resolveNewsFollowup("Show sources for the second article.",news);
assert.equal(second.index,1);
const previous=[{role:"user",content:"Arată-mi sursele pentru prima știre."}];
const confirmed=resolveNewsFollowup("Ce este confirmat și ce este încă neclar?",news,previous);
assert.equal(confirmed.kind,"verification");assert.equal(confirmed.index,0);
assert.match(formatNewsFollowup(confirmed,"ro"),/nu au fost verificate independent/);
assert.equal(resolveNewsFollowup("Care este capitala Franței?",news),null);

const window=publicationDayWindow("Ce evenimente importante s-au întâmplat ieri în lume?","2026-11-05");
assert.equal(window.day,"2026-11-04");
assert.equal(isWithinPublicationDay("20261104T150000Z",window),true);
assert.equal(isWithinPublicationDay("2026-11-05T09:00:00Z",window),false);
assert.equal(isWithinPublicationDay("2026-05-08T09:00:00Z",window),false);
assert.equal(isWithinPublicationDay("",window),false);

const fakeAI={run:async()=>({response:"[]"})};
const originalFetch=globalThis.fetch;
let calls=0;
globalThis.fetch=async input=>{
 calls++;
 const url=String(input);
 if(url.includes("gdeltproject.org")){
  return new Response(JSON.stringify({articles:[
   {title:"Relevant international diplomatic meeting reported on November fourth",url:"https://example.com/world/meeting-nov4",seendate:"20261104T150000Z"},
   {title:"Today current affairs global headline to exclude from yesterday",url:"https://example.org/world/today",seendate:"20261105T090000Z"},
   {title:"Very old story falsely included by broad results",url:"https://example.net/world/old",seendate:"20260508T090000Z"}
  ]}),{headers:{"content-type":"application/json"}});
 }
 if(url.startsWith("https://example."))return new Response("<html><body>Unverified publisher article.</body></html>",{headers:{"content-type":"text/html"}});
 throw new Error("Unexpected research fetch "+url);
};
const ask=async(message,extra={})=>{
 const resp=await backend.fetch(new Request("https://test.local/api/chat",{method:"POST",headers:{"content-type":"application/json"},
 body:JSON.stringify({message,language:"ro",module:"assistant",history:[],...extra})}),{AI:fakeAI});
 assert.equal(resp.status,200,message);
 return resp.json();
};
try{
 const source=await ask("Arată-mi sursele pentru prima știre.",{news_context:news});
 assert.equal(source.news_followup?.kind,"sources");
 assert.equal(source.sources.length,1);
 assert.equal(source.sources[0].url,news.rows[0].url);
 assert.equal(source.web_search_status,"not_needed");
 const verified=await ask("Ce este confirmat și ce este încă neclar?",{
  news_context:news,history:previous
 });
 assert.equal(verified.news_followup?.kind,"verification");
 assert.match(verified.reply,/prima|știrea 1/i);
 assert.equal(calls,0,"News followups must not search unrelated historical verification pages");

 const dated=await ask("Ce evenimente importante s-au întâmplat ieri în lume?",{client_local_day:"2026-11-05"});
 assert.equal(dated.structured_list?.type,"news");
 assert.equal(dated.structured_list.requested_publication_day,"2026-11-04");
 assert.ok(dated.structured_list.rows.length>=1,"Expected relevant yesterday listing");
 assert.ok(dated.structured_list.rows.every(row=>isWithinPublicationDay(row.published_at,window)),"Older/today sources leaked into yesterday");
 assert.match(dated.reply,/publicate pe 2026-11-04/);
}finally{globalThis.fetch=originalFetch}

const html=await(await frontend.fetch(new Request("https://test.local/"))).text();
const script=[...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)][0]?.[1];
assert.ok(script,"Generated mobile script missing");
new vm.Script(script);
assert.match(script,/news_context:newsContextRequested\?state\.newsConversationContext/);
assert.match(script,/state\.newsConversationContext=\{type:'news'/);
assert.match(script,/function resetChat\(\)\{state\.newsConversationContext=null;/);
assert.match(script,/state\.newsConversationContext\.selected_index=idx/);
console.log("PASS T6 attributed followups, date filter, mobile news context, no unrelated searches");
