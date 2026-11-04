import assert from 'node:assert/strict';
import worker from './backend.js';
const originalFetch=globalThis.fetch;
const fetched=[];
const calls=[];
globalThis.fetch=async (input)=>{
 const u=String(input);fetched.push(u);
 if(u.includes('api.first.org'))return new Response(JSON.stringify({data:[{cve:'CVE-2026-12345',epss:'0.45',date:'2026-11-04'}]}),{headers:{'content-type':'application/json'}});
 if(u.includes('kev-data'))return new Response(JSON.stringify({vulnerabilities:[{cveID:'CVE-2026-12345',vulnerabilityName:'Demonstration vulnerability',dateAdded:'2026-11-01'}]}),{headers:{'content-type':'application/json'}});
 if(u.includes('gdeltproject.org'))return new Response(JSON.stringify({articles:[{title:'News from a publisher',url:'https://example.com/news',seendate:'20261104T130000Z'}]}),{headers:{'content-type':'application/json'}});
 if(u==='https://example.com/news')return new Response('<html><body>News event detail</body></html>',{headers:{'content-type':'text/html'}});
 throw new Error('Unexpected upstream '+u);
};
const ai={run:async(...args)=>{calls.push(args);return {response:'Source-backed response.'}}};
try{
 const ask=async (message,extras={})=>{
   const r=await worker.fetch(new Request('https://worker.test/api/chat',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({message,language:'en',...extras})}),{AI:ai});
   assert.equal(r.status,200);
   return await r.json();
 };
 const cve=await ask('What is the EPSS security risk for CVE-2026-12345?');
 assert.equal(cve.public_intel?.cve,'CVE-2026-12345');
 assert.equal(cve.public_intel.kev_listed,true);
 assert.equal(cve.public_intel.score,0.45);
 assert.match(cve.reply,/45.00%/);
 assert.equal(calls.length,0,'CVE report should not call language model');
 const news=await ask('Latest news about global diplomacy');
 assert.ok(fetched.some(u=>u.includes('gdeltproject.org')),'News must consult GDELT');
 assert.ok(news.sources?.some(x=>x.providers?.includes('GDELT')),'News must preserve GDELT attribution');
 assert.equal(calls.length,1);
 console.log('Assistant public intelligence integration regressions passed');
}finally{globalThis.fetch=originalFetch;}
