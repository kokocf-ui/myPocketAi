import assert from 'node:assert/strict';
import {webcrypto} from 'node:crypto';
import worker from './backend.js';
globalThis.crypto ??= webcrypto;

// Regression for the exact on-device T1 request: news search AND translate.
const prompt='Caută ultimele 5 știri despre Orientul Mijlociu din surse în limba arabă, inclusiv Al Jazeera Arabic și BBC Arabic. Tradu în română titlul și conținutul disponibil, respectând contextul, fără traduceri literale. Afișează data, sursa și linkul original.';
const freshDate=new Date(Date.now()-86400000).toISOString();
const oldDate='2023-10-28T12:00:00.000Z';
const freshUrl='https://www.aljazeera.net/news/2026/11/7/arabic-news-test-article';
const staleUrl='https://www.bbc.com/news/world-middle-east-2023-old';
const searches=[];
globalThis.fetch=async input=>{
 const u=new URL(typeof input==='string'?input:input.url);
 if(u.hostname==='api.gdeltproject.org')return Response.json({articles:[]});
 if(u.hostname==='api.search.brave.com'){
  searches.push(u);
  return Response.json({web:{results:[
   {title:'أعلنت الوزارة مقتل 12 شخصاً وفق مصادر محلية',url:freshUrl,page_age:freshDate,
    description:'وقالت الجهات الرسمية إن التقارير الأولية لم تؤكد سبب الحادث. وأوضحت أن التحقيقات لا تزال مستمرة.'},
   {title:'Middle East historical report from October 2023',url:staleUrl,page_age:oldDate,
    description:'An old archived article from 2023, not a recent article despite the current news request.'}
  ]}});
 }
 if(u.hostname==='www.aljazeera.net'||u.hostname==='www.bbc.com')
  return new Response('<html lang="ar"><body>وقالت الجهات الرسمية إن التقارير الأولية لم تؤكد سبب الحادث.</body></html>',
   {headers:{'content-type':'text/html; charset=utf-8'}});
 throw new Error('Unexpected research host '+u.hostname);
};
const env={BRAVE_API_KEY:'mock-search',
 AI:{run:async()=>({response:JSON.stringify([{id:0,
  title:'Ministerul a anunțat moartea a 12 persoane, potrivit surselor locale',
  summary:'Autoritățile au declarat că rapoartele preliminare nu au confirmat cauza incidentului.'}])})}};
const originalInfo=console.info;console.info=()=>{};
let output;
try{
 const reply=await worker.fetch(new Request('https://unit.test/api/chat',{method:'POST',
  headers:{'content-type':'application/json'},
  body:JSON.stringify({message:prompt,language:'ro',
   location:{latitude:51.5,longitude:-0.12},history:[]})}),env);
 output=await reply.json();
}finally{console.info=originalInfo;}
assert.equal(output.status,'success',JSON.stringify(output).slice(0,800));
assert.equal(output.structured_list?.type,'news','news must be source-backed, never generated narrative');
assert.equal(output.structured_list?.displayed_result_limit,5,'respect requested five articles');
assert.equal(output.structured_list?.rows?.length,1,'only recent, source-backed articles survive the strict test fixture');
assert.equal(output.structured_list.rows[0].url,freshUrl,'preserve the actual discovered article URL');
assert.ok(!JSON.stringify(output).includes(staleUrl),'2023 article must not be presented as latest');
assert.ok(!output.reply.includes('nu pot să caut'),'never substitute an AI apology for search');
assert.ok(searches.some(u=>u.searchParams.get('search_lang')==='ar'),
 'Arabic-language sources must not be searched using the Romanian UI language');
console.log('PASS source-backed Arabic news+translate: current dated result, no 2023 fallback, 5-item limit');
