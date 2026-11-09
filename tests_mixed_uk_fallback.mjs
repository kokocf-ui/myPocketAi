import assert from "node:assert/strict";
import worker from "./backend.js";
import {webcrypto} from "node:crypto";
globalThis.crypto??=webcrypto;

const originalFetch=globalThis.fetch,originalInfo=console.info,originalWarn=console.warn;
const calls=[];
const fixedOrigin={latitude:51.478,longitude:0.283,updatedAt:Date.now()};
const uk={latitude:51.493,longitude:-0.13,country_code:"GB",label:"London Victoria"};
const abroad={latitude:48.8566,longitude:2.3522,country_code:"FR",label:"Paris, France"};
let internationalFixture=false,provideTfLJourney=false,provideMotisJourney=false;
globalThis.fetch=async input=>{
 const url=new URL(typeof input==="string"?input:input.url);calls.push(url);
 if(url.hostname==="api.transcapi.com"){
  const requested=Date.parse(url.searchParams.get('datetime')||'');
  const at=m=>new Date((Number.isFinite(requested)?requested:Date.now())+m*60000).toISOString();
  if(url.searchParams.get('from_lon')==='4.9041'||url.searchParams.get('from_lon')==='-5.9301'){
   const ireland=url.searchParams.get('from_lon')==='-5.9301';
   const origin=ireland?'Belfast':'Amsterdam',dest=ireland?'Dublin':'Brussels';
   return Response.json({timezone:ireland?'Europe/Dublin':'Europe/Amsterdam',itineraries:[{
    start_time:at(12),end_time:at(237),fare:null,
    legs:[
     {mode:"WALK",duration_s:600,from:{name:origin},to:{name:origin+" station"}},
     {mode:ireland?"TRAM":"RAIL",from:{name:origin+" station"},to:{name:dest+" station"},
      route:{line:"R2",operator:"Mock regional"},start_time:{scheduled:at(27)},end_time:{scheduled:at(222)},
      fare_local:ireland?{currency:"EUR",amount:2}:null},
     {mode:"WALK",duration_s:900,from:{name:dest+" station"},to:{name:dest}}
    ]}]});
  }
  if(url.searchParams.get('transit_modes')===''){
   return Response.json({itineraries:[{
    start_time:at(12),end_time:at(237),fare:null,
    legs:[
     {mode:"WALK",from:{name:"Start"},to:{name:"Bus stop"},duration_s:600},
     {mode:"COACH",route:{line:"Coach X",operator:"Mock coach"},from:{name:"Bus stop"},to:{name:"Manchester"},start_time:{scheduled:at(27)},end_time:{scheduled:at(222)}},
     {mode:"WALK",from:{name:"Manchester"},to:{name:"Destination"},duration_s:900}
    ]}]});
  }
  return Response.json({itineraries:[{
   start_time:at(12),end_time:at(237),fare:{amount_gbp:65.4,complete:false},
   legs:[
    {mode:"WALK",duration_s:600,from:{name:"Grays departure",latitude:51.478,longitude:0.283},to:{name:"Grays station",latitude:51.476,longitude:0.321}},
    {mode:"RAIL",route:{line:"R1",operator:"Mock railway"},from:{name:"Grays station"},to:{name:"Manchester Piccadilly"},start_time:{scheduled:at(27)},end_time:{scheduled:at(222)}},
    {mode:"WALK",duration_s:900,from:{name:"Manchester Piccadilly"},to:{name:"Vale Lane"}}
   ]
  }]});
 }
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
 if(url.hostname==="motis.example"){
  if(!provideMotisJourney)return Response.json({itineraries:[]});
  const at=m=>new Date(Date.now()+m*60000).toISOString();
  return Response.json({itineraries:[{
   duration:240*60,startTime:at(20),endTime:at(260),transfers:0,
   legs:[
    {mode:"FOOT",duration:8*60,startTime:at(20),endTime:at(28),
     from:{name:"UK origin",lat:51.478,lon:0.283,tz:"Europe/London"},
     to:{name:"Rail boarding",lat:51.476,lon:0.321,tz:"Europe/London"}},
    {mode:"HIGHSPEED_RAIL",duration:205*60,startTime:at(35),endTime:at(240),
     from:{name:"Rail boarding",lat:51.476,lon:0.321,tz:"Europe/London",stopId:"gb:rail"},
     to:{name:"Paris Nord",lat:48.8809,lon:2.3553,tz:"Europe/Paris",stopId:"fr:rail"},
     displayName:"Verified test international rail",agencyName:"Mock rail operator"},
    {mode:"FOOT",duration:20*60,startTime:at(240),endTime:at(260),
     from:{name:"Paris Nord",lat:48.8809,lon:2.3553,tz:"Europe/Paris"},
     to:{name:"Paris destination",lat:48.8566,lon:2.3522,tz:"Europe/Paris"}}
   ]
  }]});
 }
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
  "UK mixed mode without an international provider must still query TfL: "+JSON.stringify({hosts:calls.map(u=>u.hostname+u.pathname),reply:local.reply,provider_status:local.provider_status,reason:local.reason,transit_available:local.transit_available}).slice(0,1400));
 assert.notEqual(local.reason,"international_provider_not_connected",
  "UK does not require international routing permission");
 assert.notEqual(local.international_journey,true);


 const manchester={latitude:53.478,longitude:-2.233,country_code:"GB",label:"Manchester Piccadilly, Manchester"};
 const cityOutsideLondon={latitude:52.4862,longitude:-1.8904,country_code:"GB",label:"Birmingham New Street, Birmingham"};
 const manchesterResult=await ask(manchester,{TFL_APP_KEY:"mock-tfl"});
 assert.equal(manchesterResult.uk_national_journey,true,"Manchester should use UK-wide routing");
 assert.equal(manchesterResult.transit_available,false,"No fabricated Manchester times without authorized provider");
 assert.equal(manchesterResult.provider_status?.tfl,"outside_london_corridor");
 assert.ok(!calls.some(url=>url.hostname==="api.tfl.gov.uk"),
  "Manchester must never be sent to the TfL journey planner");
 assert.ok(!manchesterResult.planning_links?.length,
  'Mixed journeys must remain in the app instead of forcing official outbound sites');
 assert.equal(manchesterResult.provider_status?.transcapi,'not_configured',
  'Report when the national planner is not configured on this Worker');

 const connectedNationwide=await ask(manchester,{TFL_APP_KEY:"mock-tfl",TRANSCAPI_API_KEY:"test-key"});
 assert.equal(connectedNationwide.transit_available,true,"A configured UK planner must return the itinerary in the app");
 assert.equal(connectedNationwide.transit_provider,"TransCAPI");
 assert.equal(connectedNationwide.uk_national_journey,true);
 assert.equal(connectedNationwide.transit[0].legs.length,3);
 assert.equal(connectedNationwide.transit[0].boarding_stop?.label,"Grays station");
 assert.equal(connectedNationwide.transit[0].boarding_stop?.latitude,51.476);
 assert.equal(connectedNationwide.transit[0].boarding_stop?.longitude,0.321);
 assert.ok(!connectedNationwide.planning_links?.length,"Success must not redirect to external planning websites");
 assert.ok(calls.some(u=>u.hostname==="api.transcapi.com"&&u.pathname==="/v1/journey.json"));
 assert.ok(!calls.some(u=>u.hostname==="api.tfl.gov.uk"),"Manchester must never be requested through TfL");

 const busOnly=await ask(manchester,{TRANSCAPI_API_KEY:"test-key"},{transit_preference:"bus_only",transit_departure_offset:60});
 assert.equal(busOnly.transit_available,true,"Requested coach-only itinerary must display in app");
 assert.equal(busOnly.transit_preference,"bus_only");
 assert.equal(busOnly.transit_departure_offset,60);
 assert.ok(busOnly.transit[0].legs.some(l=>l.mode==='coach'));
 assert.ok(busOnly.transit[0].legs.every(l=>['coach','bus','walking'].includes(l.mode)),"No rail in bus-only option");
 assert.ok(calls.some(u=>u.hostname==="api.transcapi.com"&&u.searchParams.get('transit_modes')===''));
 assert.ok(calls.some(u=>u.hostname==="api.transcapi.com"&&u.searchParams.has('datetime')));

 const amsterdamOrigin={latitude:52.3676,longitude:4.9041,updatedAt:Date.now()};
 const belfastOrigin={latitude:54.5973,longitude:-5.9301,updatedAt:Date.now()};
 const brussels={latitude:50.8503,longitude:4.3517,country_code:"BE",label:"Brussels, Belgium"};
 const dublin={latitude:53.3498,longitude:-6.2603,country_code:"IE",label:"Dublin, Ireland"};
 const beneluxResult=await ask(brussels,{TRANSCAPI_API_KEY:"mock-key"},{
  location:amsterdamOrigin,coordinates:amsterdamOrigin
 });
 assert.equal(beneluxResult.transit_available,true,"Amsterdam→Brussels can be planned inside the Benelux zone");
 assert.equal(beneluxResult.international_journey,true);
 assert.equal(beneluxResult.transit_provider,"TransCAPI");
 assert.equal(beneluxResult.transit[0].time_zone,"Europe/Amsterdam");
 assert.equal(beneluxResult.provider_status.region,"benelux");
 assert.ok(!beneluxResult.reply.includes('£'),"Do not label unpriced Belgian routes as pounds");
 assert.ok(!calls.some(u=>u.hostname==="api.tfl.gov.uk"),"Never call TfL outside London");
 const irelandResult=await ask(dublin,{TRANSCAPI_API_KEY:"mock-key"},{
  location:belfastOrigin,coordinates:belfastOrigin
 });
 assert.equal(irelandResult.transit_available,true,"Belfast→Dublin is within the Ireland planning zone");
 assert.equal(irelandResult.provider_status.region,"ireland");
 assert.ok(irelandResult.reply.includes('EUR'),"Keep known Luas fare in its currency");
 const crossZone=await ask(dublin,{TRANSCAPI_API_KEY:"mock-key"});
 assert.equal(crossZone.transit_available,false,"TransCAPI must not invent Great Britain→Ireland crossings");
 assert.equal(crossZone.reason,'international_provider_not_connected');
 assert.ok(!calls.some(u=>u.hostname==='api.transcapi.com'),"Do not spend quota for unsupported cross-zone journeys");

 const birminghamResult=await ask(cityOutsideLondon,{TFL_APP_KEY:"mock-tfl"});
 assert.equal(birminghamResult.uk_national_journey,true);
 assert.ok(!calls.some(url=>url.hostname==="api.tfl.gov.uk"),
  "Outside-London cities must not use the London-only planner");
 assert.ok(!birminghamResult.planning_links?.length,
  'Missing national results in mixed mode should not become external links');

 const regularJourney=await ask(manchester,{TFL_APP_KEY:"mock-tfl"},{mixed_journey:false,message:"Transport public spre Manchester Piccadilly"});
 assert.equal(regularJourney.uk_national_journey,true,"Non-mixed UK public transit should also avoid TfL");
 assert.ok(!calls.some(url=>url.hostname==="api.tfl.gov.uk"),
  "Regular Manchester public-transport planning must not rely on TfL");
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

 // Authorized international MOTIS: exercise the positive routing path as well
 // as the refusal when an authorized provider is absent.
 provideMotisJourney=true;
 const internationalVerified=await ask(abroad,{MOTIS_API_BASE_URL:"https://motis.example",TFL_APP_KEY:"mock-tfl"});
 assert.equal(internationalVerified.transit_available,true,
  "An authorized provider must return its validated real-format journey rather than a refusal");
 assert.equal(internationalVerified.international_journey,true);
 assert.equal(internationalVerified.transit_provider,"MOTIS");
 assert.ok(internationalVerified.transit[0].legs.some(l=>l.mode==="highspeed_rail"),
  "Keep the verified international rail leg");
 assert.ok(internationalVerified.transit[0].legs.some(l=>l.mode==="walking"),
  "Keep first and final walking legs");
 assert.ok(!calls.some(u=>u.hostname==="api.tfl.gov.uk"),
  "The international itinerary must not be replaced by TfL");
 assert.ok(calls.some(u=>u.hostname==="motis.example"&&u.pathname.endsWith("/api/v6/plan")),
  "Only the explicitly configured MOTIS v6 endpoint may be used");
 provideMotisJourney=false;

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
