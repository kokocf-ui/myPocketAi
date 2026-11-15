// Fast, explicit destinations entered as a single line in Personal Assistant.
// Never turn an ordinary question or a generic hotel search into navigation.
export function assistantBareDestinationQuery(raw){
 const text=String(raw??'').trim().replace(/[.!]+$/u,'').trim();
 if(text.length<6||text.length>200||/[?\r\n]/u.test(text))return null;
 const fold=value=>String(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
 const query=fold(text);
 if(/^(?:ce|care|cat|cati|cate|cum|cand|unde|de ce|what|where|why|how|find|cauta|gaseste|arata|spune|explica|descrie|vreau|am nevoie|recomanda)\b/u.test(query))return null;
 // Require a locality explicitly: "Strada Libertății, Oradea" or
 // "Muzeul Țării Crișurilor din Oradea". A street alone isn't enough.
 const comma=text.split(',').map(p=>p.trim()).filter(Boolean);
 const parts=comma.length>=2?[comma[0],comma.slice(1).join(', ')]:text.match(/^(.+?)\s+(?:din|în|in)\s+(.+)$/iu)?.slice(1);
 if(!parts||parts.length<2)return null;
 let head=fold(parts[0]),locality=fold(parts[1]);
 // "Nufărului, nr. 12, Oradea" is an address, not a bare street name.
 if(comma.length>=3&&/^(?:(?:nr\.?|numar(?:ul)?|no\.?|number|#)\s*)?\d+[a-z]?(?:[-/]\d+)?$/iu.test(fold(comma[1]))){
  head=fold(comma[0]+' '+comma[1]);locality=fold(comma.slice(2).join(', '));
 }
 if(!/\p{L}{2}/u.test(locality)||!/\p{L}{2}/u.test(head))return null;
 if(/^(?:toate|un|o|niste|cele|lista|preturi|recenzii)\b/u.test(head))return null;
 const namedStreet=/^(?:strada|str\.?|soseaua|sos\.?|bulevardul|bd\.?|aleea|calea|street|road|avenue|lane|close|drive|boulevard|via|calle|rue)\s+\S/iu.test(head)||
   /\b(?:street|road|avenue|lane|crescent|boulevard|square)\b/u.test(head);
 const namedLandmark=/^(?:muzeul?|museum|hotel(?:ul)?|hostel(?:ul)?|spital(?:ul)?|hospital|stadion(?:ul)?|stadium|gara|station|aeroport(?:ul)?|airport|castel(?:ul)?|castle|parc(?:ul)?|park|universitatea|university)\s+\S/iu.test(head);
 // A full numbered address does not need a street-type prefix, whatever the
 // local writing convention (e.g. 12 Oxford Street or Nufărului 12).
 const numberFirst=/^\d+[a-z]?(?:[-/]\d+)?\s+\p{L}[\p{L}\p{M}\p{N}' .-]{1,100}$/iu.test(head);
 const numberLast=/^\p{L}[\p{L}\p{M}\p{N}' .-]{1,100}\s+(?:(?:nr\.?|numar(?:ul)?|no\.?|number|#)\s*)?\d+[a-z]?(?:[-/]\d+)?$/iu.test(head);
 // Avoid treating ordinary shopping quantities and category searches as houses.
 const categoryQuery=/^(?:hoteluri|muzee|restaurante|cafenele|magazine|produse|bilete|camere)\b/u.test(head);
 const units=/^\d+\s+(?:cartuse?|pachete?|baxuri?|sticle?|bucati|kg|g|litri?|bottles?|packs?|eggs?|boxes?|pieces?|items?)\b/u.test(head);
 const numberedAddress=!namedLandmark&&!categoryQuery&&!units&&(numberFirst||numberLast);
 return namedStreet||namedLandmark||numberedAddress?text:null;
}


// A shared classifier for the assistant and the single-field journey page.
// A request to learn about a route is NOT itself an instruction to navigate.
export function parseJourneyExpression(raw){
 const original=String(raw||'').trim().replace(/[.!?]+$/u,'').trim();
 const norm=original.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 const preferred_mode=/(?:cu masina|by car|driving|drive to|with car|auto route)/u.test(norm)?'drive':
  /(?:transport(?:ul)? public|transport mixt|mixed transport|by train|by bus|train route|bus route|metro route)/u.test(norm)?'transit':
  /(?:pe jos|pietonal|walking|walk to|on foot)/u.test(norm)?'walk':null;
 const cleanSuffix=value=>String(value||'').trim().replace(/\s+(?:cu\s+(?:mașina|masina|transportul\s+public|autobuzul|trenul|metroul)|by\s+(?:car|train|bus)|pe\s+jos|on\s+foot|walking|driving)$/iu,'').trim();
 // Pick an explicit A→B pair anywhere inside a navigation request.
 const pair=original.match(/(?:^|\s)(?:de\s+la|din|from|von|desde|da|от)\s+(.+?)\s+(?:până\s+la|pana\s+la|spre|către|catre|la|to|nach|hasta|a|до)\s+(.+)$/iu)
   ||original.match(/^(.+?)\s*(?:→|->|➜)\s*(.+)$/u);
 if(pair)return {raw:original,origin_query:pair[1].trim(),destination_query:cleanSuffix(pair[2]),preferred_mode};
 const first=original.match(/^(?:du[- ]?mă(?:\s+te\s+rog)?(?:\s+la)?|du[- ]?ma(?:\s+te\s+rog)?(?:\s+la)?|vreau\s+să\s+(?:ajung|merg)\s+(?:la|spre)|vreau\s+sa\s+(?:ajung|merg)\s+(?:la|spre)|cum\s+(?:pot\s+)?ajung\s+(?:la|spre)|navighează\s+(?:la|spre)|navigheaza\s+(?:la|spre)|arată[- ]?mi\s+(?:drumul|traseul)\s+(?:la|spre)|arata[- ]?mi\s+(?:drumul|traseul)\s+(?:la|spre)|traseu\s+(?:la|spre|către|catre|până\s+la|pana\s+la)|deplasare\s+spre|take\s+me\s+to|how\s+(?:do|can)\s+i\s+get\s+to|directions\s+to|route\s+to|navigate\s+to|drive\s+to|walk\s+to|go\s+to|bring\s+me\s+to|itinéraire\s+vers|route\s+nach|ruta\s+a|percorso\s+per)\s+(.+)$/iu);
 const destination=cleanSuffix(first?first[1]:original);
 return {raw:original,origin_query:'',destination_query:destination,preferred_mode};
}
export function assistantJourneyHandoff(raw){
 const text=String(raw||'').trim();
 if(!text||text.length>240)return null;
 if(assistantBareDestinationQuery(text))return parseJourneyExpression(text);
 const fold=text.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 if(/^(?:ce este|ce inseamna|ce reprezinta|de ce|explica|explica-mi|descrie|what is|what does|explain|define|why|que es|qu est|was ist)\b/u.test(fold))return null;
 const intent=/\b(?:traseu(?:l|ri|e)?|ruta|rute|route\s+to|directions\s+to|navigate\s+to|navigatie|navigheaza|deplasare\s+spre|transport\s+mixt|itineraire\s+vers|percorso\s+per)\b/u.test(fold)
   ||/^(?:du[- ]?ma|vreau sa (?:ajung|merg)|cum (?:pot )?ajung|arata[- ]?mi drumul|take me to|how (?:do|can) i get to|drive to|walk to|go to|from .+ to |de la .+ (?:la|spre|pana la) |din .+ spre )\b/u.test(fold)
   ||/^\S.+\s*(?:→|->|➜)\s*\S/u.test(text);
 return intent?parseJourneyExpression(text):null;
}
