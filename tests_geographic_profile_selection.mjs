import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import worker from './backend.js';
const ui=readFileSync(new URL('./index.js',import.meta.url),'utf8');
const backend=readFileSync(new URL('./backend.js',import.meta.url),'utf8');
assert(ui.includes('state.pendingSelectedGeoOption={...option}'),'geographic choice preserves selected identity');
assert(ui.includes('selected_geographic_entity:selectedGeographicEntity'),'selected geographic identity sent to encyclopedia endpoint');
assert(ui.includes('selected_geo_option:selectedGeographicEntity'),'same selected place attached to displayed encyclopedia');
assert(ui.includes('offerAssistantLocalityTravelMode(article.selected_geo_option)'),'journey resumes from encyclopedia presentation');
assert(backend.includes('const geographicTitles=geographicSelection'),'wiki lookup must use the geographical selection');
assert(backend.includes('source_unavailable:true'),'missing Wikipedia must not silently show a different homonym');
const originalFetch=globalThis.fetch;
const calls=[];
globalThis.fetch=async url=>{
 const address=String(url);calls.push(address);
 if(address.includes('wikipedia.org/api/rest_v1/page/summary/')){
  const title=decodeURIComponent(address.split('/').at(-1));
  if(title==='Alba, Tulcea')return Response.json({
   title:'Alba, Tulcea',description:'sat în județul Tulcea, România',
   extract:'Alba este un sat din comuna Izvoarele, județul Tulcea, România.',
   content_urls:{desktop:{page:'https://ro.wikipedia.org/wiki/Alba,_Tulcea'}}
  });
  return new Response('',{status:404});
 }
 if(address.includes('geoapify.com'))return Response.json({features:[]});
 return Response.json({});
};
try{
 const req=new Request('https://test.local/api/chat',{method:'POST',headers:{'content-type':'application/json'},
  body:JSON.stringify({message:'Informații despre Alba, Tulcea',language:'ro',
   selected_geographic_entity:{entity_type:'city',entity_title:'Alba',entity_region:'Tulcea',
    entity_commune:'Izvoarele',entity_country_code:'RO'}})});
 const response=await worker.fetch(req,{AI:{run:async()=>({response:'Test'})}});
 assert.equal(response.status,200);
 const data=await response.json();
 assert.equal(data.encyclopedia?.title,'Alba, Tulcea');
 assert.match(data.encyclopedia.extract,/Izvoarele/);
 assert.equal(data.encyclopedia.can_route,true);
 assert(calls.some(u=>u.includes('Alba%2C%20Tulcea')),'selected county-specific Wikipedia page searched');
}finally{globalThis.fetch=originalFetch}
console.log('Geographic selection shows Wikipedia first and preserves journey identity — PASS');
