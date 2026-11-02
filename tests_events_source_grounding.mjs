import assert from 'node:assert/strict';
import frontend from './index.js';
import backend from './backend.js';

const savedFetch=globalThis.fetch;
const html=await (await frontend.fetch(new Request('https://pocket.test/'))).text();
const inline=html.match(/<script[^>]*>([\s\S]*?)<\/script>/i)?.[1];
assert.ok(inline&&inline.includes('Sursa evenimentului'),'source link missing from frontend');
const {Script}=await import('node:vm');
new Script(inline);

const year=new Date().getUTCFullYear();
const samples=[
 {title:'Corul Madrigal – concert Oradea 10 decembrie '+year,url:'https://events.example/arad/madrigal-oradea',highlights:['Corul Madrigal, Oradea Arena, 10 decembrie '+year+', ora 19:00.'],publishedDate:year+'-09-04'},
 {title:'EMABISZ concert – Oradea December 12, '+year,url:'https://tickets.example/emabisz',highlights:['Oradea: December 12, '+year+', 18:00. Tickets available.'],publishedDate:year+'-10-03'},
 {title:'Calendar evenimente Oradea '+year,url:'https://events.example/calendar',highlights:['Calendarul zilelor lunii decembrie '+year+', spectacole și festivaluri.'],publishedDate:year+'-10-03'},
 {title:'Campionatul European de Ponei Oradea',url:'https://events.example/ponies',highlights:['O știre veche din '+(year-1)+' fără date pentru decembrie '+year+'.'],publishedDate:(year-1)+'-03-08'},
 {title:'Festival din Cluj 19 decembrie '+year,url:'https://events.example/cluj',highlights:['Festival la Cluj 19 decembrie '+year+'.'],publishedDate:year+'-10-01'}
];
let apiCount=0,geocodeCount=0,searchQueries=[];
globalThis.fetch=async(input,opts={})=>{
 const u=new URL(typeof input==='string'?input:input.url);
 if(u.hostname==='api.exa.ai'){
  apiCount++;
  const body=JSON.parse(opts.body);
  searchQueries.push(body.query);
  return Response.json({results:samples});
 }
 if(u.hostname==='api.search.brave.com'||u.hostname==='api.tavily.com')throw Error('Unexpected optional provider');
 if(u.hostname==='api.geoapify.com'){geocodeCount++;throw Error('Event query routed incorrectly to geocoding');}
 if(u.hostname.endsWith('.example'))return new Response('Not found',{status:404,headers:{'content-type':'text/plain'}});
 throw Error('Unexpected outbound request: '+u.hostname+u.pathname);
};
try{
 const env={GEOAPIFY_API_KEY:'test',EXA_API_KEY:'test',AI:{run:async()=>{throw Error('Event research must not create AI-invented dated rows')}}};
 for(const message of [
  'Ce evenimente sunt în Oradea în decembrie '+year+'?',
  'Evenimente din Oradea în decembrie anul curent'
 ]){
  const r=await backend.fetch(new Request('https://fixture/api/chat',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({
    message,language:'ro',module:'assistant',history:[],location:{latitude:51.5,longitude:.28}
  })}),env);
  assert.equal(r.status,200);
  const data=await r.json();
  assert.equal(data.status,'success');
  assert.equal(data.version,'v170');
  assert.equal(data.latency_breakdown?.model_calls_estimate,0);
  assert.equal(data.structured_list?.type,'events');
  assert.equal(data.structured_list.rows.length,2);
  assert.ok(data.structured_list.rows.every(x=>x.source_url?.startsWith('https://')));
  assert.ok(data.structured_list.rows.some(x=>/Madrigal/.test(x.description)));
  assert.ok(data.structured_list.rows.some(x=>/EMABISZ/.test(x.description)));
  assert.ok(!data.reply.includes('Ponei'));
  assert.ok(!data.reply.includes('Cluj'));
  assert.equal(data.event_pipeline_diagnostics.source_events,2);
 }
 assert.equal(geocodeCount,0,'event intent was mistaken for a local business');
 assert.equal(apiCount,2);
 assert.ok(searchQueries.some(q=>q.includes(String(year))&&!q.includes('anul curent')),'relative year not resolved');
 console.log('PASS: source-grounded event rows, current-year intent, no AI hallucinations, no GPS business lookup, source links');
}finally{globalThis.fetch=savedFetch}
