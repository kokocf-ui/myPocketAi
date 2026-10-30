import assert from 'node:assert/strict';
import worker from './backend.js';

const calls=[];
globalThis.fetch=async (input,init={})=>{
  const url=String(input); calls.push({url,init});
  if(url.includes('api.exa.ai/search')) return new Response(JSON.stringify({results:[{title:'Official shared source',url:'https://example.gov.uk/rules?utm_source=exa',publishedDate:'2026-10-20',highlights:['Official rule excerpt from Exa.']},{title:'Exa only',url:'https://example.org/exa',highlights:['Separate Exa evidence.']}]}),{status:200,headers:{'Content-Type':'application/json'}});
  if(url.includes('api.search.brave.com/res/v1/web/search')) return new Response(JSON.stringify({web:{results:[{title:'Official shared source',url:'https://example.gov.uk/rules',page_age:'2 days ago',description:'Official rule excerpt from Brave.'},{title:'Brave only',url:'https://example.net/brave',description:'Separate Brave evidence.'}]}}),{status:200,headers:{'Content-Type':'application/json'}});
  if(url.includes('api.tavily.com/search')) return new Response(JSON.stringify({results:[{title:'Official shared source',url:'https://example.gov.uk/rules?utm_campaign=test',published_date:'2026-10-21',content:'Official rule excerpt from Tavily.',raw_content:'Official primary page text.'},{title:'Tavily only',url:'https://example.edu/tavily',content:'Separate Tavily evidence.'}]}),{status:200,headers:{'Content-Type':'application/json'}});
  throw new Error('Unexpected fetch URL '+url);
};
const env={EXA_API_KEY:'test-exa',BRAVE_API_KEY:'test-brave',TAVILY_API_KEY:'test-tavily',AI:{run:async()=>({response:'Answer grounded in retrieved sources.'})}};
const root=await worker.fetch(new Request('https://unit.test/'),env);
const rootJson=await root.json(); assert.equal(rootJson.version,'v96');
const response=await worker.fetch(new Request('https://unit.test/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:'What are the current UK legal rules?',language:'en',search_web:true,history:[]})}),env);
const data=await response.json();
assert.equal(response.status,200); assert.equal(data.version,'v96'); assert.equal(data.web_search_status,'success');
assert.equal(calls.length,3,'all three search engines should be called');
assert.equal(data.web_search_diagnostics.resultCount,4,'same canonical URL should be deduplicated');
const merged=data.sources.find(x=>x.url.includes('example.gov.uk/rules'));
assert.ok(merged); assert.deepEqual(merged.providers.sort(),['brave','exa','tavily']);
assert.ok(merged.highlights.length>=3); assert.ok(data.reply.includes('Sources checked'));
console.log('PASS: root version v96');
console.log('PASS: Exa + Brave + Tavily called in one request');
console.log('PASS: URL tracking variants deduplicated and provider provenance merged');
console.log('PASS: source excerpts merged and returned to AI context');
