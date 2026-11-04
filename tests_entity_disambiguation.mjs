// Regression: a bare ambiguous name must not become the first encyclopaedia result.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const source=readFileSync(new URL('./backend.js',import.meta.url),'utf8');
const frontend=readFileSync(new URL('./index.js',import.meta.url),'utf8');
const start=source.indexOf('// Resolve short ambiguous names');
const end=source.indexOf('    let verifiedCity=null;',start);
assert(start>=0&&end>start,'entity resolver exists');
const resolver=source.slice(start,end);
const norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^\p{L}\p{N} ]/gu,' ').replace(/\s+/g,' ').trim();
let calls=[];
const mockFetch=async address=>{
 const u=String(address);calls.push(u);
 const body=u.includes('tomtom.com')?{results:[
  {type:'area',areaType:'countrySubdivision',address:{countryCodeIso2:'RO',countrySubdivision:'Alba'},position:{coordinates:[23.5,46.1]}},
  {type:'area',areaType:'municipality',address:{countryCodeIso2:'IT',municipality:'Alba',countrySubdivision:'Piemonte'},position:{coordinates:[8.03,44.7]}}
 ]}:u.includes('geoapify.com')?{features:[
  {properties:{result_type:'state',state:'Alba',country_code:'ro',lat:46.1,lon:23.5}}
 ]}:{query:{search:[{title:'Alba'},{title:'Județul Alba'},{title:'Alba Iulia'}]}};
 return {ok:true,json:async()=>body};
};
const base={API_VERSION:'v-test',message:'Alba',bareTopic:'Alba',parts:['Alba'],seekingRoute:false,explicitKnowledge:false,knownTopic:undefined,topicKey:'alba',lang:'ro',data:{},
 env:{TOMTOM_API_KEY:'TEST_ONLY',GEOAPIFY_API_KEY:'TEST_ONLY'},countryNameCodes:new Map([['romania','RO']]),normalizeGeoName:norm,json:async x=>x,fetch:mockFetch};
const run=new Function(...Object.keys(base),'return (async()=>{' + resolver + ';return null;})()');
const answer=await run(...Object.values(base));
assert.equal(answer?.entity_disambiguation,true,'bare name offers choices');
assert(answer.choice_options.some(x=>x.entity_kind==='place'&&x.entity_type==='region'&&x.label.includes('România')),'county present');
assert(answer.choice_options.some(x=>x.entity_kind==='place'&&x.label.includes('Italia')),'Italian town present');
assert(answer.choice_options.some(x=>x.entity_kind==='article'&&norm(x.entity_title)==='alba'),'encyclopaedia meaning present');
assert(answer.choice_options.filter(x=>x.entity_kind==='place'&&x.entity_type==='region'&&x.label.includes('România')).length===1,'providers deduplicated');
assert(calls.some(x=>x.includes('tomtom.com')),'TomTom consulted for geographic meaning');
const followUp=await run(...Object.values({...base,explicitKnowledge:true,message:'Informații despre Alba'}));
assert.equal(followUp,null,'encyclopaedia selection does not reprompt');
const known=await run(...Object.values({...base,knownTopic:'Oradea',topicKey:'oradea',bareTopic:'Oradea',parts:['Oradea'],message:'Oradea'}));
assert.equal(known,null,'unambiguous known city stays on existing flow');
assert(frontend.includes("if(data.entity_disambiguation){"),'frontend handles choice kinds');
assert(frontend.includes("if(article.can_route===true){"),'article route CTA restricted to geographical subjects');
assert(source.includes("article.can_route=Boolean("),'backend classifies route eligibility');
console.log('Entity disambiguation tests passed');
