// "Public transport in London" is a topic. "Take me to Victoria by
// public transport" is a journey. Route only on the latter or on explicit UI
// mode/boarding selections; never guess an arrival point from "in London".
const n=v=>String(v||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/\s+/g," ").trim();
const transport=/\b(?:transport(?:ul)?\s+(?:public|in comun|options)|public transport|by public transport|autobuz\w*|bus(?:es)?|tren\w*|train\w*|metrou\w*|metro|subway|underground|tube|railway|tram\w*|tramvai\w*|dlr|elizabeth line)\b/;
const trip=/\b(?:cum ajung|cum (?:pot|sa) ajunge|cum merg|vreau sa ajung|as vrea sa ajung|trebuie sa ajung|du-ma|du ma|merg pana|calculeaza(?:-mi)?\s+(?:un\s+)?(?:traseu|ruta)|planifica(?:-mi)?\s+(?:un\s+)?(?:traseu|itinerar|drum)|traseu\w*|itinerar\w*|ruta de transport|rute de transport|how (?:do|can) i (?:get|go)|i (?:want|need|would like) to (?:get|go|travel)|get me to|take me to|directions to|route to|journey to|plan (?:a|my) (?:journey|route)|trip to)\b/;
const arrival=/\b(?:pana\s+(?:la|in)|catre|spre|towards|hasta|to|vers)\s+[\p{L}\p{N}]/u;
const topic=/\b(?:ma refeream|m-am referit|i meant|i was referring|nu eu|i mean|tell me about|spune-mi despre|povesteste-mi|descrie-mi|explica-mi|explain|what is|what are|how does|cum functioneaza|cum este organizat|cum se plateste|ce este|ce inseamna|care sunt|ce tipuri|ce stii|informatii despre|informatii cu privire la|detalii despre)\b/;
const mode=/^(?:(?:cu\s+)?(?:transport(?:ul)?\s+(?:public|in comun)|public transport|by public transport|cu\s+(?:autobuz(?:ul)?|tren(?:ul)?|metrou(?:l)?)|by (?:bus|train|tube|metro)))[.!?]*$/;
const choices=/^(?:ce variante|care (?:sunt )?(?:variantele|optiunile)|what (?:public )?transport options)\b/;
export function isTransitJourneyRequest(message,options={}){
 const q=n(message);
 if(options.explicitTransitMode===true||options.boardingAccessRequested===true||options.explicitTransitDestination===true)
  return {is_journey:true,reason:"explicit_route_selection"};
 if(!transport.test(q))return {is_journey:false,reason:"not_transport"};
 if(choices.test(q)&&arrival.test(q))return {is_journey:true,reason:"options_to_destination"};
 if(topic.test(q)&&!(trip.test(q)&&arrival.test(q)))
  return {is_journey:false,reason:"informational_or_correction"};
 if(mode.test(q)){
  if(options.pendingRouteProfile===true)return {is_journey:true,reason:"mode_selected_for_pending_trip"};
  const turns=(Array.isArray(options.history)?options.history:[]).filter(x=>x?.role==="user"&&typeof x.content==="string").map(x=>n(x.content)).filter(Boolean);
  while(turns.length&&turns.at(-1)===q)turns.pop();
  return trip.test(turns.at(-1)||"")?{is_journey:true,reason:"mode_after_explicit_route"}:{is_journey:false,reason:"mode_without_trip"};
 }
 if(trip.test(q))return {is_journey:true,reason:"explicit_journey_language"};
 if(arrival.test(q))return {is_journey:true,reason:"transport_to_destination"};
 return {is_journey:false,reason:"transport_topic_only"};
}
export function correctedResearchTopic(message){
 const match=String(message||"").trim().match(/^(?:(?:nu[,!. ]+\s*)?(?:eu\s+)?m[aă]\s+refeream\s+la|(?:nu[,!. ]+\s*)?(?:eu\s+)?m-am\s+referit\s+la|(?:no[,!. ]+\s*)?i\s+meant|i\s+was\s+referring\s+to)\s+(.+)$/iu);
 if(!match)return null;
 const subject=match[1].replace(/[!.?]+$/,"").trim();
 return subject.length>=4&&subject.length<=220?subject:null;
}
