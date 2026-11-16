import assert from 'node:assert/strict';
import worker from './backend.js';
import frontend from './index.js';
import {readFileSync} from 'node:fs';
const originalFetch=globalThis.fetch;
let fetched=[];
globalThis.fetch=async(input)=>{
 const u=new URL(typeof input==='string'?input:input.url||String(input));
 fetched.push(u.pathname);
 if(u.pathname==='/v1/geocode/reverse'){
  return Response.json({features:[{properties:{country_code:'ro'}}]});
 }
 throw Error('Unexpected external fetch '+u.href);
};
const roFrom={latitude:44.4268,longitude:26.1025};
const roNear={latitude:44.4368,longitude:26.1125,label:'Piața Romană, București',country_code:'RO'};
const roFar={latitude:45.658,longitude:25.601,label:'Brașov, România',country_code:'RO'};
const env=(bilo,urban)=>({
 GEOAPIFY_API_KEY:'test-only',
 ...(bilo?{BILO_API_KEY:'configured-test-key'}:{}),
 ...(urban?{RO_URBAN_API_URL:'https://urban.example.test',RO_URBAN_API_TOKEN:'1234567890'.repeat(4)}:{}),
 AI:{run:async()=>({response:'unit test'})}
});
const request=async(body,bindings)=>{
 const response=await worker.fetch(new Request('https://fixture.test/api/chat',{
  method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)
 }),bindings);
 assert.equal(response.status,200);
 return response.json();
};
try{
 const askCountry=bindings=>request({national_transit_country:{location:roFrom}},bindings);
 let out=await askCountry(env(false,false));
 assert.equal(out.country_code,'RO');
 assert.equal(out.supported,false,'No Romanian connector is not a working country');
 assert.deepEqual(out.provider_coverage,{intercity_configured:false,urban_configured:false});
 out=await askCountry({...env(false,false),RO_URBAN_API_URL:'https://urban.example.test',RO_URBAN_API_TOKEN:'too-short'});
 assert.equal(out.supported,false,'A placeholder/short urban token cannot imply a working router');
 out=await askCountry(env(true,false));
 assert.equal(out.supported,true);
 assert.deepEqual(out.provider_coverage,{intercity_configured:true,urban_configured:false});
 out=await askCountry(env(false,true));
 assert.equal(out.supported,true);
 assert.deepEqual(out.provider_coverage,{intercity_configured:false,urban_configured:true});
 const vpcOnly={...env(false,false),RO_URBAN_VPC:{fetch:async()=>{throw Error('readiness must never call GTFS API')}},RO_URBAN_API_TOKEN:'1234567890'.repeat(4)};
 out=await askCountry(vpcOnly);
 assert.equal(out.supported,true,'Real binding should count without a public URL');
 assert.deepEqual(out.provider_coverage,{intercity_configured:false,urban_configured:true});
 assert.ok(!JSON.stringify(out).includes(vpcOnly.RO_URBAN_API_TOKEN));
 assert.ok(!JSON.stringify(out).includes('1234567890'),'Never send private auth credentials to mobile');
 const askRoute=(destination,bindings)=>request({
  national_public_transport:true,message:'Transport public către '+destination.label,
  language:'ro',module:'maps',history:[],location:roFrom,transit_destination:destination,
  travel_mode:'transit'
 },bindings);
 out=await askRoute(roFar,env(false,true));
 assert.equal(out.reason,'national_provider_not_connected');
 assert.match(out.reply,/Bilo.*trenuri.*autocare/,'Intercity error must name missing Bilo planner');
 out=await askRoute(roNear,env(true,false));
 assert.equal(out.reason,'national_provider_not_connected');
 assert.match(out.reply,/transport urban/,'City error must name the missing urban planner');
 const html=(await frontend.fetch(new Request('https://app.test/'))).text();
 const rendered=await html;
 assert.match(rendered,/id="pocket-mobile-chrome-fit"/,'Narrow phone chrome has a dedicated layout');
 assert.match(rendered,/\.bottom-nav \.nav-btn\{[^}]*white-space:nowrap/,'Four fixed nav labels remain unbroken');
 assert.match(rendered,/\.app-header \.brand-name\{[^}]*white-space:nowrap/,'App brand remains on one line');
 const publicUI=readFileSync('national_public_transport_ui.mjs','utf8');
 assert.match(publicUI,/coverage\.intercity_configured/);
 assert.match(publicUI,/coverage\.urban_configured/);
}finally{globalThis.fetch=originalFetch}
console.log('PASS Romanian provider truth, short token rejection, specific missing-provider messages and narrow Android chrome');
