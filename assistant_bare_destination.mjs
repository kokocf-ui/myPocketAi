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
