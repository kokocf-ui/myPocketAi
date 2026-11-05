import assert from "node:assert/strict";
import backend from "./backend.js";
import {buildWorldNewsDiscoveryPlan,selectNewsPublisherDiverseSources,describeNewsPublishers} from "./news_discovery.mjs";

const originalFetch=globalThis.fetch;
const requests={gdelt:[],exa:[],brave:[],tavily:[],pages:[]};
const item=(host,path,title,date="20261104T130000Z")=>({title,url:"https://"+host+"/"+path,seendate:date});
const gdeltPolitics=[
 item("apnews.com","article/ukraine-talks","European leaders debate international peace talks following summit"),
 item("bbc.com","news/world-europe-111","Major international summit on global diplomacy and sanctions"),
 item("reuters.com","world/asia-pacific/meeting-111","Reuters world leaders meet for international diplomacy"),
 item("apnews.com","article/todays-news","Breaking elections update today","20261105T090000Z")
];
const gdeltOther=[
 item("dw.com","en/weather-event/a-111","Storm and extreme weather issues challenge international response"),
 item("france24.com","en/20261104-economy-news","International markets and economy face a new week"),
 item("nhk.or.jp","news/global/article-20261104","Science and technology ministers announce international agreement"),
 item("apnews.com","article/old-month","Outdated months old general world item","20260508T150000Z")
];
const exaResult=(host,path,title,date="2026-11-04T11:00:00.000Z")=>({
 title,url:"https://"+host+"/"+path,publishedDate:date,highlights:["Original publisher summary of events attributed to the named news source."]
});
globalThis.fetch=async input=>{
 const url=String(input);
 if(url.startsWith("https://api.gdeltproject.org")){
  const u=new URL(url),query=u.searchParams.get("query")||"";requests.gdelt.push(u);
  assert.equal(u.searchParams.get("startdatetime"),"20261104000000");
  assert.equal(u.searchParams.get("enddatetime"),"20261104235959");
  assert.equal(u.searchParams.get("sort"),"DateDesc");
  return new Response(JSON.stringify({articles:query.includes("economy OR")?gdeltOther:gdeltPolitics}),{headers:{"content-type":"application/json"}});
 }
 if(url==="https://api.exa.ai/search"){
  const options=arguments; // intentionally unused; request body supplies search filters
  throw Error("Exa should provide a Request init; handled by the invocation-specific mock below");
 }
 throw new Error("Unexpected network call "+url);
};
const apiFetch=globalThis.fetch;
globalThis.fetch=async (input,init)=>{
 const url=String(input);
 if(url==="https://api.exa.ai/search"){
  const body=JSON.parse(init.body);requests.exa.push(body);
  const targeted=Array.isArray(body.includeDomains)&&body.includeDomains.includes("reuters.com");
  const results=targeted
   ?[exaResult("www.reuters.com","world/europe/reuters-report-2026-11-04","Reuters original reporting about diplomatic developments")]
   :[
    exaResult("theguardian.com","world/2026/nov/04/guardian-report","Guardian world news report from the previous day"),
    exaResult("aljazeera.com","news/2026/11/4/world-report","Al Jazeera global regional analysis"),
    exaResult("apnews.com","article/new-science","Associated Press world science reporting")
   ];
  return new Response(JSON.stringify({results}),{headers:{"content-type":"application/json"}});
 }
 if(url.startsWith("https://api.search.brave.com/")){
  const u=new URL(url);requests.brave.push(u);
  return new Response(JSON.stringify({web:{results:[
   {title:"Deutsche Welle international report covering world economic developments",url:"https://dw.com/en/business-world-coverage/a-999",page_age:"2026-11-04T16:00:00Z",description:"World market reporting by the outlet."},
   {title:"BBC independent international world coverage and global event timeline",url:"https://bbc.com/news/world-222",page_age:"2026-11-04T10:00:00Z",description:"International news reporting."}
  ]}}),{headers:{"content-type":"application/json"}});
 }
 if(url==="https://api.tavily.com/search"){
  const body=JSON.parse(init.body);requests.tavily.push(body);
  return new Response(JSON.stringify({results:[
    {title:"France 24 analysis of major international political events",url:"https://france24.com/en/diplomacy-20261104",published_date:"2026-11-04T12:00:00Z",content:"Political and economic reporting."},
    {title:"United Nations official world affairs updates",url:"https://news.un.org/en/story/2026/11/1111",published_date:"2026-11-04T08:00:00Z",content:"Official statement text."}
   ]}),{headers:{"content-type":"application/json"}});
 }
 if(url.startsWith("https://api.gdeltproject.org"))return apiFetch(input,init);
 if(url.startsWith("https://")){requests.pages.push(url);return new Response("<html><body>Publisher page; article claims not verified in this test.</body></html>",{headers:{"content-type":"text/html"}});}
 throw Error("Unexpected fetch "+url);
};
const call=async(env)=>{
 const response=await backend.fetch(new Request("https://test.local/api/chat",{
  method:"POST",headers:{"content-type":"application/json"},
  body:JSON.stringify({message:"Ce evenimente importante s-au întâmplat ieri în lume?",language:"en",client_local_day:"2026-11-05"})
 }),env);
 assert.equal(response.status,200);
 return response.json();
};
try{
 const data=await call({EXA_API_KEY:"test_exa",BRAVE_API_KEY:"test_brave",TAVILY_API_KEY:"test_tavily"});
 assert.equal(data.structured_list?.type,"news");
 assert.ok(data.structured_list.rows.length>=5,"Need several original world news articles, not one");
 assert.ok(data.structured_list.unique_publisher_count>=4,"Need diverse original publishers");
 assert.ok(data.structured_list.reuters_article_found,"A returned public Reuters source should remain visible");
 assert.ok(data.structured_list.rows.some(x=>x.url.includes("reuters.com/")),"Reuters URL should be attributed to Reuters");
 assert.ok(data.structured_list.rows.every(x=>x.published_at?.startsWith("2026-11-04")||x.published_at?.startsWith("20261104")));
 assert.ok(data.structured_list.rows.every(x=>x.verification==="source_identified_claims_unverified"));
 assert.equal(data.web_search_diagnostics.licensed_wire_access,false);
 assert.ok(requests.gdelt.length>=2,"Must explore multiple worldwide news topics");
 assert.ok(new Set(requests.gdelt.map(x=>x.searchParams.get("query"))).size>=2,"GDELT queries should be different");
 assert.ok(requests.exa.some(x=>x.includeDomains?.includes("reuters.com")),"Must search public Reuters links with configured Exa");
 assert.ok(requests.exa.some(x=>x.category==="news"&&!x.includeDomains),"Must also use broad news discovery");
 assert.ok(requests.brave.length>=1);assert.ok(requests.tavily.length>=1);
 const sourceDomains=describeNewsPublishers(data.structured_list.rows);
 assert.ok(sourceDomains.unique_publisher_count>=4);

 // With no private keys there is still broad public GDELT discovery.
 requests.gdelt.length=0;
 const publicOnly=await call({});
 assert.equal(publicOnly.structured_list.type,"news");
 assert.ok(publicOnly.structured_list.rows.length>=4);
 assert.equal(requests.gdelt.length,2);
 assert.ok(publicOnly.structured_list.rows.every(x=>x.verification==="source_identified_claims_unverified"));
 console.log("PASS world news topic fanout, multiple publishers, optional Reuters discovery, strict dates and key-free fallback");
}finally{globalThis.fetch=originalFetch;}
