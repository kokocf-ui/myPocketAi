import assert from "node:assert/strict";
import worker from "./backend.js";
import {webcrypto} from "node:crypto";
globalThis.crypto??=webcrypto;

const originalFetch=globalThis.fetch,originalInfo=console.info,originalWarn=console.warn;
const calls=[];
const fixedOrigin={latitude:51.478,longitude:0.283,updatedAt:Date.now()};
const uk={latitude:51.493,longitude:-0.13,country_code:"GB",label:"London Victoria"};
const abroad={latitude:48.8566,longitude:2.3522,country_code:"FR",label:"Paris, France"};
let internationalFixture=false;
globalThis.fetch=async input=>{
 const url=new URL(typeof input==="string"?input:input.url);calls.push(url);
 if(url.hostname==="api.tfl.gov.uk"){
  if(url.pathname.startsWith("/StopPoint/Search"))return Response.json({matches:[]});
  return Response.json({journeys:[]});
 }
 if(url.hostname==="motis.example")return Response.json({itineraries:[]});
 if(url.hostname==="api.geoapify.com"){
  const query=url.searchParams.get("text");
  if(internationalFixture&&query==="Berlin"){
   return Response.json({features:[{properties:{name:"Berlin",city:"Berlin",lat:52.5200,lon:13.4050,country_code:"de",formatted:"Berlin, Germany"}}]});
  }
  return Response.json({features:[]});
 }
 if(url.hostname==="photon.komoot.io")return Response.json({features:[]});
 if(url.hostname==="nominatim.openstreetmap.org")return Response.json([]);
 throw new Error("Unexpected request: "+url.hostname+url.pathname);
};
console.info=()=>{};console.warn=()=>{};
const ask=async (target,env,overrides={})=>{
 calls.length=0;
 const res=await worker.fetch(new Request("https://unit.test/api/chat",{
  method:"POST",headers:{"content-type":"application/json"},
  body:JSON.stringify({
   message:"Caută variante de transport mixt către "+target.label,
   language:"ro",history:[],module:"maps",location:fixedOrigin,coordinates:fixedOrigin,
   mixed_journey:true,transit_query:target.label,transit_destination:target,...overrides
  })
 }),env);
 return res.json();
};
try{
 const local=await ask(uk,{TFL_APP_KEY:"mock-tfl"});
 assert.equal(local.status,"success");
 assert.ok(calls.some(u=>u.hostname==="api.tfl.gov.uk"&&u.pathname.includes("JourneyResults")),
  "UK mixed mode without an international provider must still query TfL");
 assert.notEqual(local.reason,"international_provider_not_connected",
  "UK does not require international routing permission");
 assert.notEqual(local.international_journey,true);

 const notLicensed=await ask(abroad,{TFL_APP_KEY:"mock-tfl"});
 assert.equal(notLicensed.international_journey,true);
 assert.equal(notLicensed.reason,"international_provider_not_connected");
 assert.equal(notLicensed.transit_available,false);
 assert.ok(!calls.some(u=>u.hostname==="api.tfl.gov.uk"),
  "International destination must not fall back to London-only TfL guesses");

 const outage=await ask(uk,{TFL_APP_KEY:"mock-tfl",MOTIS_API_BASE_URL:"https://motis.example"});
 assert.ok(calls.some(u=>u.hostname==="motis.example"),"Try the optional licensed provider");
 assert.ok(calls.some(u=>u.hostname==="api.tfl.gov.uk"&&u.pathname.includes("JourneyResults")),
  "A failed authorized provider must allow the UK TfL fallback");
 assert.equal(outage.transit_available,false,"Never invent results");

 internationalFixture=true;
 const city=await ask({label:"Berlin"},{
  GEOAPIFY_API_KEY:"mock",TFL_APP_KEY:"mock-tfl"
 },{transit_destination:null});
 assert.equal(city.international_journey,true);
 assert.equal(city.reason,"international_provider_not_connected");
 assert.equal(calls.filter(u=>u.hostname==="api.geoapify.com"&&u.pathname.endsWith("geocode/search")).length,1,
  "Don't repeat the same geocode after a city was resolved");
 assert.ok(!calls.some(u=>u.hostname==="api.tfl.gov.uk"));
 console.log("PASS mixed transport: UK TfL fallback, licensed-provider failure, international refusal and single city geocode");
}finally{globalThis.fetch=originalFetch;console.info=originalInfo;console.warn=originalWarn}
