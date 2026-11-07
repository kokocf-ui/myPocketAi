import assert from "node:assert/strict";
import worker from "./backend.js";
import {webcrypto} from "node:crypto";
globalThis.crypto??=webcrypto;

const originalFetch=globalThis.fetch,originalInfo=console.info,originalWarn=console.warn;
const calls=[];
const fixedOrigin={latitude:51.478,longitude:0.283,updatedAt:Date.now()};
const uk={latitude:51.493,longitude:-0.13,country_code:"GB",label:"London Victoria"};
const abroad={latitude:48.8566,longitude:2.3522,country_code:"FR",label:"Paris, France"};
let internationalFixture=false,provideTfLJourney=false;
globalThis.fetch=async input=>{
 const url=new URL(typeof input==="string"?input:input.url);calls.push(url);
 if(url.hostname==="api.tfl.gov.uk"){
  if(url.pathname.startsWith("/StopPoint/Search"))return Response.json({matches:[]});
  if(provideTfLJourney){
   const at=m=>new Date(Date.now()+m*60000).toISOString();
   return Response.json({journeys:[{
    duration:48,startDateTime:at(5),arrivalDateTime:at(53),
    legs:[
     {mode:{name:"walking"},duration:8,departureTime:at(5),arrivalTime:at(13),
      departurePoint:{commonName:"Grays origin",lat:51.478,lon:0.283},
      arrivalPoint:{commonName:"Grays station",lat:51.476,lon:0.321}},
     {mode:{name:"national-rail"},duration:33,departureTime:at(20),arrivalTime:at(53),
      departurePoint:{commonName:"Grays station",lat:51.476,lon:0.321},
      arrivalPoint:{commonName:"London Victoria",lat:51.493,lon:-0.13},
      routeOptions:[{name:"Verified test rail"}]}
    ]
   }]});
  }
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
 }),{AI:{run:async()=>({response:"mock"})},...env});
 return res.json();
};
try{
 const local=await ask(uk,{TFL_APP_KEY:"mock-tfl"});
 assert.equal(local.status,"success",JSON.stringify({local,hosts:calls.map(u=>u.hostname+u.pathname)}).slice(0,1200));
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

 // Verify the fallback returns actual operator legs when a TfL journey exists,
 // instead of merely checking that TfL was called. No map geometry is invented.
 provideTfLJourney=true;
 const verifiedLocal=await ask(uk,{TFL_APP_KEY:"mock-tfl"});
 assert.equal(verifiedLocal.transit_available,true,
  "A confirmed TfL response should survive the UK mixed-mode fallback");
 assert.equal(verifiedLocal.transit_provider,"TfL");
 assert.ok(verifiedLocal.transit.length>=1);
 assert.ok(verifiedLocal.transit[0].legs.some(l=>l.mode==="national-rail"));
 assert.equal(verifiedLocal.route_geometry_available,false,
  "Missing TfL polylines must not be replaced with invented geometry");
 provideTfLJourney=false;

 internationalFixture=true;
 const city=await ask({label:"Berlin"},{
  GEOAPIFY_API_KEY:"mock",TFL_APP_KEY:"mock-tfl"
 },{transit_destination:null});
 assert.equal(city.international_journey,true);
 assert.equal(city.reason,"international_provider_not_connected");
 assert.equal(calls.filter(u=>u.hostname==="api.geoapify.com"&&u.pathname.endsWith("geocode/search")).length,1,
  "Don't repeat the same geocode after a city was resolved");
 assert.ok(!calls.some(u=>u.hostname==="api.tfl.gov.uk"));

 // Even with no country in the message, an explicit mixed-journey request to
 // an independently resolved overseas city must never fall through to TfL.
 const overseasWithoutCountry=await ask({label:"Berlin"},{
  GEOAPIFY_API_KEY:"mock",TFL_APP_KEY:"mock-tfl"
 },{transit_destination:null,message:"Cum ajung la Berlin?"});
 assert.equal(overseasWithoutCountry.international_journey,true);
 assert.equal(overseasWithoutCountry.reason,"international_provider_not_connected");
 assert.equal(overseasWithoutCountry.transit_available,false);
 assert.equal(calls.filter(u=>u.hostname==="api.geoapify.com"&&u.pathname.endsWith("geocode/search")).length,1,
  "Explicit mixed journey should geocode a city-only destination once");
 assert.ok(!calls.some(u=>u.hostname==="api.tfl.gov.uk"),
  "International destination resolved after city geocode must never enter TfL");
 console.log("PASS mixed transport: UK TfL fallback, licensed-provider failure, overseas city-only refusal and single city geocode");
}finally{globalThis.fetch=originalFetch;console.info=originalInfo;console.warn=originalWarn}
