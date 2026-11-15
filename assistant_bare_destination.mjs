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
 const parts=text.match(/^(.+?)(?:\s*,\s*|\s+(?:din|în|in)\s+)([^,]{2,80})$/iu);
 if(!parts)return null;
 const head=fold(parts[1]),locality=fold(parts[2]);
 if(!/[a-zа-я]{2}/iu.test(locality)||!/[a-zа-я]{2}/iu.test(head))return null;
 if(/^(?:toate|un|o|niste|cele|lista|preturi|recenzii)\b/u.test(head))return null;
 const namedStreet=/^(?:strada|str\.?|soseaua|sos\.?|bulevardul|bd\.?|aleea|calea|street|road|avenue|lane|close|drive|boulevard|via|calle|rue)\s+\S/iu.test(head)||
   /\b(?:street|road|avenue|lane|crescent|boulevard|square)\b/u.test(head);
 const namedLandmark=/^(?:muzeul?|museum|hotel(?:ul)?|hostel(?:ul)?|spital(?:ul)?|hospital|stadion(?:ul)?|stadium|gara|station|aeroport(?:ul)?|airport|castel(?:ul)?|castle|parc(?:ul)?|park|universitatea|university)\s+\S/iu.test(head);
 return namedStreet||namedLandmark?text:null;
}
