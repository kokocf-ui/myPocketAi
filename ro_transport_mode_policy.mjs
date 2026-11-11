// Transport-mode intent is a hard filter, not a merely preferred display label.
// Bilo's supported search currently uses mode:'all'; apply strict post-filtering
// to actual timetable legs, and state when requested modes aren't verified.
export function requestedRomanianVehicle(message, explicitPreference=''){
 const text=String(message||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 const preference=String(explicitPreference||'').toLowerCase();
 if(/\b(?:autocar(?:ul|ele|e)?|coach(?:es)?|flixbus|microbuz(?:ul|ele|e)?)\b/.test(text)||
   preference==='coach_only')return 'coach';
 if(/\b(?:autobuz(?:ul|ele|e)?|bus(?:es)?)\b/.test(text)||
   preference==='bus_only')return 'road_public';
 if(/\b(?:tren(?:ul|uri|urile)?|train(?:s)?|rail(?:way)?)\b/.test(text)||
   preference==='rail_only')return 'rail';
 return 'all';
}
export function filterRomanianVehicleJourneys(journeys,requested){
 if(!Array.isArray(journeys))return [];
 if(!['rail','coach','road_public'].includes(requested))return journeys;
 return journeys.filter(j=>{
  const nonWalking=(Array.isArray(j?.legs)?j.legs:[]).filter(l=>!['walk','walking','foot','pedestrian'].includes(String(l.mode||'').toLowerCase()));
  if(!nonWalking.length)return false;
  return nonWalking.every(l=>{
   const mode=String(l.mode||'').toLowerCase();
   return requested==='rail'?mode==='train'||mode==='rail':
    requested==='coach'?mode==='coach'||mode==='minibus':
    ['coach','bus','minibus','trolleybus'].includes(mode);
  });
 });
}
export function romanianModeNoResultsMessage(requested,lang='ro'){
 const ro=lang!=='en';
 if(requested==='coach')return ro
  ?'Nu am putut confirma nicio cursă cu autocarul pentru această dată. Sursa a returnat alte tipuri de transport sau nu a confirmat curse; nu le voi prezenta drept autocare. Verifică disponibilitatea și prețul la operator.'
  :'No coach service was verified for this date. Other vehicle types are not being relabeled as coaches. Check the operator for prices and availability.';
 if(requested==='rail')return ro
  ?'Nu am putut confirma un itinerar cu trenul pentru această dată. Verifică orarul la operator.'
  :'No rail itinerary was verified for this date. Check the operator timetable.';
 return ro?'Nu am putut confirma curse pentru mijlocul de transport solicitat.':'No confirmed itinerary for the requested vehicle type.';
}