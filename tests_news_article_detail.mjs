import assert from "node:assert/strict";
import backend from "./backend.js";
import {safeNewsArticleUrl,extractArticleEvidence,readNewsArticleDetail} from "./news_article_detail.mjs";
assert.equal(safeNewsArticleUrl("http://publisher.example/article"),null);
assert.equal(safeNewsArticleUrl("https://127.0.0.1/article"),null);
assert.equal(safeNewsArticleUrl("https://localhost/article"),null);
assert.equal(safeNewsArticleUrl("https://t.me/channel/123"),null);
assert.equal(safeNewsArticleUrl("https://publisher.example/article"),"https://publisher.example/article");
const source="Research published following the sample return shows that the spacecraft collected grains during its mission, which analysts later examined in a laboratory. Investigators reported several measurable compounds, but cautioned that detecting these substances does not prove the presence of living organisms. Their examination covered several independent samples and future research will compare the findings with earlier observations.";
const html='<html lang="en"><head><script>window.doNotUse=true</script></head><body><article><p>'+source+'</p><p>Further reporting describes the samples and scientific follow-up without making claims beyond the published evidence, including the difference between chemical building blocks and evidence of life.</p></article></body></html>';
assert.ok(extractArticleEvidence(html).includes("spacecraft collected grains"));
assert.ok(!extractArticleEvidence(html).includes("window.doNotUse"));
const before=globalThis.fetch;
let requests=0;
try{
 globalThis.fetch=async (url,opts)=>{
  requests++;
  assert.equal(url,"https://publisher.example/article");
  assert.equal(opts.redirect,"manual");
  return new Response(html,{status:200,headers:{"content-type":"text/html"}});
 };
 const env={AI:{run:async (_model,request)=>{
  assert.match(request.messages[0].content,/Summarize only/);
  assert.match(request.messages[1].content,/spacecraft collected grains/);
  return {response:"Cercetătorii au examinat probe colectate de o sondă spațială și au identificat mai mulți compuși măsurabili. Descoperirea nu demonstrează existența vieții. Analiza continuă cu verificări și comparații pentru a stabili semnificația materialului."};
 }}};
 const result=await readNewsArticleDetail(env,"https://publisher.example/article","ro");
 assert.equal(result.status,"success");
 assert.equal(result.content_status,"source_based_summary");
 assert.equal(result.translated_to,"ro");
 assert.match(result.summary,/Cercetătorii/);
 const endpoint=await backend.fetch(new Request("https://example.invalid/api/news-article-detail",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({url:"https://publisher.example/article",language:"ro"})}),env);
 assert.equal(endpoint.status,200);
 const payload=await endpoint.json();
 assert.equal(payload.kind,"news_article_detail");
 assert.equal(payload.content_status,"source_based_summary");
 assert.equal(payload.status,"success");
 assert.equal(requests,2);
 globalThis.fetch=async()=>new Response("<html><body><p>Very short.</p></body></html>",{headers:{"content-type":"text/html"}});
 const unavailable=await readNewsArticleDetail(env,"https://publisher.example/article","ro");
 assert.equal(unavailable.content_status,"unavailable");
 assert.equal(unavailable.summary,"");
}finally{globalThis.fetch=before;}
console.log("PASS source-backed news article reader, language, unavailable fallback, safe URLs and POST endpoint");
