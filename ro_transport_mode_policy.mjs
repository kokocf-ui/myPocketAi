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

// The initial Bilo order may place a lengthy 3-change journey ahead of a
// significantly quicker direct service. Prefer shortest verified duration,
// then fewer transfers; do not invent better times.
export function rankRomanianJourneys(journeys){
 return [...(Array.isArray(journeys)?journeys:[])].sort((a,b)=>{
  const dur=j=>Number.isFinite(Number(j?.durationMinutes))?+j.durationMinutes:Infinity;
  const changes=j=>Math.max(0,(Array.isArray(j?.legs)?j.legs:[]).filter(l=>!['walking','walk','foot'].includes(l.mode)).length-1);
  return dur(a)-dur(b)||changes(a)-changes(b)||
   Date.parse(a?.startDateTime||0)-Date.parse(b?.startDateTime||0);
 });
}


// Bilo can return a train whose named first stop is a different locality
// (e.g. Episcopia Bihor instead of Oradea). Without verified station
// coordinates/access we must not silently call that an Oradea departure.
const place=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'')
 .toLowerCase().replace(/[^a-z0-9]+/g,' ').replace(/\s+/g,' ').trim();
function containsCity(stop,city){
 const target=place(city).replace(/\bromania\b/g,'').trim();
 const named=place(stop);
 if(!target||!named)return false;
 return (' '+named+' ').includes(' '+target+' ');
}
export function filterRomanianCityEndpoints(journeys,origin,destination){
 return (Array.isArray(journeys)?journeys:[]).filter(j=>{
  const legs=(Array.isArray(j?.legs)?j.legs:[]).filter(l=>!['walk','walking','foot'].includes(String(l.mode||'').toLowerCase()));
  if(!legs.length)return false;
  return (containsCity(legs[0].fromLocality,origin)||containsCity(legs[0].from,origin))&&
   (containsCity(legs.at(-1).toLocality,destination)||containsCity(legs.at(-1).to,destination));
 });
}

// Search once in all modes; split verified results into UI pages AFTER retrieval.
// Mixed connections remain visible in a third section instead of masquerading
// as a direct train or coach. Order within each section is by travel time.
export function groupRomanianJourneys(journeys,perGroup=4){
 const groups={rail:[],road:[],mixed:[]};
 const max=Math.min(10,Math.max(1,Number(perGroup)||4));
 for(const journey of rankRomanianJourneys(journeys)){
  const modes=(Array.isArray(journey?.legs)?journey.legs:[])
   .map(l=>String(l.mode||'').toLowerCase())
   .filter(m=>!['walking','walk','foot','pedestrian'].includes(m));
  if(!modes.length)continue;
  const section=modes.every(m=>['train','rail'].includes(m))?'rail':
   modes.every(m=>['bus','coach','minibus','trolleybus'].includes(m))?'road':'mixed';
  if(groups[section].length<max)groups[section].push(journey);
 }
 return groups;
}
