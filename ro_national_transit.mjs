import {transportNoticeLine} from "./transport_availability_disclosure.mjs";
/**
 * Romania inter-city rail/coach provider (Bilo HTTP integration).
 * No inferred timetable or undocumented public scraping.
 * Requires BILO_API_KEY only in the Cloudflare Worker secrets.
 * API: https://mcp.bilo.ro/api/v1  (developer dashboard / commercial terms).
 */
const ROMANIA_CITIES=new Set([
 'bucuresti','brasov','cluj napoca','cluj','oradea','timisoara','iasi','sibiu',
 'constanta','craiova','arad','pitesti','ploiesti','targu mures','baia mare','satu mare',
 'suceava','bacau','botosani','galati','braila','alba iulia','deva','hunedoara',
 'zalau','bistrita','resita','giurgiu','tulcea','focsani','ramnicu valcea',
 'targoviste','calarasi','slatina','drobeta turnu severin','buzau','vaslui',
 'sfantu gheorghe','miercurea ciuc','pietra neamt','piatra neamt','beius','salonta'
]);
const normalize=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'')
 .toLowerCase().replace(/[\s_-]+/g,' ').trim();
const cleanTown=v=>String(v||'')
 // The passenger may append a question after the arrival town.
 // "la Brașov, ce variante am?" must resolve to Brașov, not a fake town.
 .replace(/[,;]\s*(?:ce\s+(?:variante|opțiuni|optiuni|posibilități|posibilitati)\s+(?:am|există|exista)|cum\s+(?:pot\s+)?(?:ajung|merge)|cu\s+ce\s+(?:pot\s+)?(?:merge|ajunge))\s*\??$/iu,'')
 .replace(/[!?.,;:]+$/g,'')
 // Remove the date/time modifier from the destination without changing the town.
 // Previous matcher missed Romanian accents (mâine/poimâine), causing transit
 // requests to fall through to the unrelated address-search flow.
 .replace(/\s+(?:(?:pe|în|in)\s+)?(?:poim[aâ]ine|m[aâ]ine|ast[aă]zi|azi)(?:\s+(?:dimineaț[aă]|dimineata|seara|dup[aă][-\s]?amiaza))?(?:\s+la\s+ora\s+\d{1,2}(?::\d{2})?)?$/iu,'')
 .replace(/\s+(?:pe\s+|la\s+data\s+de\s+)?\d{1,2}[./-]\d{1,2}(?:[./-]\d{4})?(?:\s+la\s+ora\s+\d{1,2}(?::\d{2})?)?$/iu,'')
 .replace(/\s+(?:pe\s+|la\s+data\s+de\s+)?\d{1,2}\s+(?:ianuarie|februarie|martie|aprilie|mai|iunie|iulie|august|septembrie|octombrie|noiembrie|decembrie)(?:\s+\d{4})?(?:\s+la\s+ora\s+\d{1,2}(?::\d{2})?)?$/iu,'')
 .replace(/\s+(?:cu\s+(?:trenul|autocarul|autobuzul)|pentru\s+\d+\s+(?:persoane|adulți|adulti)|la\s+ora\s+\d{1,2}(?::\d{2})?)$/iu,'')
 .trim().slice(0,100);
const isRoGPS=pt=>Number.isFinite(Number(pt?.latitude))&&Number.isFinite(Number(pt?.longitude))
 && Number(pt.latitude)>=43.55&&Number(pt.latitude)<=48.35
 && Number(pt.longitude)>=20.15&&Number(pt.longitude)<=29.95;
const isDate=value=>/^\d{4}-\d{2}-\d{2}$/.test(String(value||''))&&!Number.isNaN(Date.parse(String(value)+'T12:00:00Z'));
const placeName=value=>{
 if(typeof value==='string')return value.trim().slice(0,140);
 if(value&&typeof value==='object'){
  const text=value.name||value.station_name||value.stop_name||value.stationName||
   value.stopName||value.display_name||value.label||value.city||value.locality;
  if(typeof text==='string')return text.trim().slice(0,140);
  if(value.station&&value.station!==value)return placeName(value.station);
  if(value.stop&&value.stop!==value)return placeName(value.stop);
 }
 return '';
};
// A transport stop may have a different official name from its associated town.
// Keep both fields instead of guessing the town from a station name.
const placeLocality=value=>{
 if(!value||typeof value!=='object')return '';
 for(const name of [value.locality,value.locality_name,value.localityName,
   value.city,value.city_name,value.cityName,value.town,value.town_name,
   value.municipality,value.settlement,value.location?.locality,
   value.location?.city,value.station?.locality,value.station?.city,
   value.stop?.locality,value.stop?.city]){
  if(typeof name==='string'&&name.trim())return name.trim().slice(0,140);
 }
 return '';
};
const pickLocality=(...sources)=>sources.map(placeLocality).find(Boolean)||'';
const normalizeMode=raw=>{
 const mode=normalize(raw);
 if(/walk|foot|pieton/.test(mode))return 'walking';
 // Replacement rail services are operated by road vehicles. Check the
 // provider's explicit transport type before the generic 'rail' token.
 if(/(?:rail|train|tren|feroviar).*(?:replacement|inlocui|substitu).*(?:bus|coach|autobuz|autocar)|(?:bus|coach|autobuz|autocar).*(?:replacement|inlocui|substitu)|(?:replacement|inlocui|substitu).*(?:bus|coach|autobuz|autocar)/.test(mode))return 'coach';
 if(/autocar|coach/.test(mode))return 'coach';
 if(/autobuz|bus|microbuz|minibus/.test(mode))return 'bus';
 if(/tren|train|rail|interregio|regio|feroviar/.test(mode))return 'train';
 return '';
};
// CFR Călători confirms rail-replacement buses between Oradea and Cluj
// while the section is modernized. The 2025/26 replacement contract runs
// through 2026-12-12. Do NOT present an unverified single-leg rail service
// on the closed corridor as a direct train.
export function isUnverifiedClosedCorridorRail(journey,date=''){
 const day=String(date||journey?.startDateTime||'').slice(0,10);
 if(day<'2024-01-08'||day>'2026-12-12')return false;
 const legs=(Array.isArray(journey?.legs)?journey.legs:[])
  .filter(l=>!['walk','walking','foot'].includes(String(l.mode||'').toLowerCase()));
 if(legs.length!==1||!['train','rail'].includes(String(legs[0].mode||'').toLowerCase()))return false;
 const station=v=>normalize(v).replace(/[^a-z0-9 ]+/g,' ').trim();
 const a=station(legs[0].from),b=station(legs[0].to);
 const oradea=s=>/\boradea\b/.test(s),cluj=s=>/\bcluj(?: napoca)?\b/.test(s);
 return oradea(a)&&cluj(b)||cluj(a)&&oradea(b);
}
function localClock(iso){
 const date=new Date(iso);
 return Number.isFinite(date.getTime())
  ?date.toLocaleString('ro-RO',{timeZone:'Europe/Bucharest',day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'})
  :'';
}
export function romanianNationalQuery(message,opts={}){
 const text=String(message||'');
 const normalized=normalize(text);
 const explicitCar=/(?:^|\s)(?:cu|prin)\s+(?:masina|automobilul|autoturismul|taxiul|taxi)(?:\s|$)/.test(normalized)
   ||/\b(?:driving|drive|by car|car route)\b/.test(normalized)
   ||opts.travel_mode==='car'||opts.route_profile==='drive';
 const genericTransport=/(?:^|\s)(?:transport(?:ul)?|deplasare)(?:\s|$)/.test(normalized)
   &&!/(?:^|\s)(?:de\s+marfa|marfuri)(?:\s|$)/.test(normalized);
 const explicitTransit=(!explicitCar&&genericTransport)
   ||/\b(?:transport(?:ul)? (?:public|in comun)|transport mixt|tren(?:ul)?|autocar(?:ul)?|autobuz(?:ul)?|rail|train|coach|bus)\b/i.test(normalized)
   ||opts.mixed_journey===true||opts.travel_mode==='transit';
 if(explicitCar)return null;
 const naturalIntercity=/\b(?:vreau sa ajung|cum (?:pot sa |pot )?ajung|ce variante (?:am|exista)|cum (?:pot sa )?merg|cum ma deplasez|cum pot calatori)\b/.test(normalized);
 const matched=text.match(/(?:^|\s)(?:din|de\s+la)\s+(.+?)\s+(?:p[aâ]n[aă]\s+la|către|catre|spre|la)\s+(.+?)(?:[?!]|$)/iu);
 const origin=matched?cleanTown(matched[1]):cleanTown(opts.origin?.city||opts.origin?.label||'');
 const destination=matched?cleanTown(matched[2]):cleanTown(opts.destination?.city||opts.destination?.label||opts.transit_query||'');
 const explicitRomania=/\b(?:romania|romaniei|romanesti|romanian)\b/.test(normalized)
    ||String(opts.origin?.country_code||'').toUpperCase()==='RO'
    ||String(opts.destination?.country_code||'').toUpperCase()==='RO';
 const majorPair=ROMANIA_CITIES.has(normalize(origin))&&ROMANIA_CITIES.has(normalize(destination));
 // A named two-town journey is transport intent even before the passenger
 // selects train/coach. Do not turn a valid intercity route into a POI lookup.
 if(!explicitTransit&&!(naturalIntercity&&majorPair))return null;
 // An explicit UK route takes priority over an old Romanian GPS fix or stale
 // destination selected earlier in a conversation. Do not send it to Bilo.
 const countryOf=value=>String(value?.country_code||value?.countryCode||'').toUpperCase();
 const selectedCountries=[countryOf(opts.origin),countryOf(opts.destination)].filter(Boolean);
 if(selectedCountries.some(c=>c!=='RO'))return null;
 const ukStops=/\b(?:grays|liverpool street|fenchurch street|tower hill|upminster|chafford hundred|west dulwich|victoria station|manchester|london|londra|essex|brixton|south ockendon|lakeside|dartford)\b/;
 if(ukStops.test(normalize(origin))||ukStops.test(normalize(destination)))return null;
 // A named overseas origin is never replaced by the phone's location.
 if(!majorPair&&!explicitRomania&&!isRoGPS(opts.location))return null;
 return {origin,destination,hasOrigin:Boolean(origin),hasDestination:Boolean(destination)};
}
// Restore a recent explicit intercity pair after "Transport public". The
// selected destination must match; never resurrect an unrelated old route.
export function romanianHistoryJourney(history,selectedDestination=''){
 if(!Array.isArray(history))return null;
 const target=normalize(
  typeof selectedDestination==='string'?selectedDestination:
   selectedDestination?.city||selectedDestination?.label||selectedDestination?.name||''
 ).replace(/,?\s*romania$/,'').trim();
 for(const item of history.slice(-8).reverse()){
  if(item?.role!=='user')continue;
  const query=romanianNationalQuery(item.content||item.text||'');
  if(!query?.hasOrigin||!query?.hasDestination)continue;
  const candidate=normalize(query.destination).replace(/,?\s*romania$/,'').trim();
  if(target&&target!==candidate&&
     !target.startsWith(candidate+',')&&!target.startsWith(candidate+' '))continue;
  return query;
 }
 return null;
}
// The Bilo integration API uses the same search input as its MCP tool, but
// responses can contain full legs OR flat rail/bus records with HH:mm times.
// Accept only explicitly sourced modes, stops and times; never fabricate a trip.
function bucharestOffset(date){
 const base=new Date(date+'T12:00:00Z');
 if(!Number.isFinite(base.getTime()))return null;
 const name=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Bucharest',timeZoneName:'shortOffset'})
  .formatToParts(base).find(p=>p.type==='timeZoneName')?.value||'';
 const m=name.match(/^GMT([+-])(\d{1,2})(?::(\d{2}))?$/);
 if(!m)return name==='GMT'?0:null;
 return (m[1]==='-'?-1:1)*(Number(m[2])*60+Number(m[3]||0));
}
function providerTimestamp(value,date,previous=null){
 if(value&&typeof value==='object'){
  value=value.iso||value.datetime||value.dateTime||value.timestamp||
   value.local_datetime||value.local_time||value.time||value.value||'';
 }
 if(typeof value==='number'&&Number.isFinite(value)){
  const n=Math.abs(value)<1e11?value*1000:value;
  return n>=946684800000&&n<=4102444800000?n:null;
 }
 const raw=String(value??'').trim();
 if(!raw)return null;
 // Provider clock-only HH:mm[:ss] requires the requested travel date.
 const plain=raw.match(/^(?:(\d{4}-\d{2}-\d{2})[T\s])?(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
 if(plain){
  const day=plain[1]||date;
  const offset=bucharestOffset(day);
  if(offset===null||Number(plain[2])>23||Number(plain[3])>59||Number(plain[4]||0)>59)return null;
  let ts=Date.parse(day+'T'+plain[2].padStart(2,'0')+':'+plain[3]+':'+(plain[4]||'00')+'Z')-offset*60000;
  if(previous!==null&&ts<previous&&previous-ts<24*3600000)ts+=86400000;
  return Number.isFinite(ts)?ts:null;
 }
 const iso=raw.replace(/^(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2})\s*([+-]\d{2}:\d{2})$/,'$1T$2$3');
 const parsed=Date.parse(iso);
 return Number.isFinite(parsed)&&parsed>=946684800000&&parsed<=4102444800000?parsed:null;
}
function biloFare(item){
 const pricing=item?.pricing?.fares;
 const candidates=[...(Array.isArray(pricing)?pricing:[]),item?.fare,item?.price].filter(Boolean);
 for(const p of candidates){
  const value=typeof p==='object'?p:{amount:p,currency:item?.currency||'RON'};
  const bani=Number(value?.amount_bani);
  const raw=Number(value?.amount??value?.value);
  const amount=Number.isFinite(bani)&&value?.amount_bani!=null?bani/100:raw;
  const currency=String(value?.currency||item?.currency||'').toUpperCase();
  if(Number.isFinite(amount)&&amount>=0&&/^[A-Z]{3}$/.test(currency))
   return {amount,currency};
 }
 return null;
}
function biloRecords(payload){
 // Preserve transport type found on a parent envelope when results are nested.
 let node=payload,parentMode='';
 for(let i=0;i<5;i++){
  if(Array.isArray(node))return {items:node,mode:parentMode};
  if(!node||typeof node!=='object')break;
  parentMode=String(node.mode||node.transport_mode||parentMode||'').slice(0,30);
  for(const key of ['trips','journeys','results','items']){
   if(Array.isArray(node[key]))return {items:node[key],mode:parentMode};
  }
  // Some provider envelopes divide services into rail and road collections.
  // The collection name is explicit provider evidence of the vehicle type.
  // Never infer a missing coach journey merely from a city pair.
  const typed=[['trains','train'],['rail','train'],['coaches','coach'],
   ['buses','bus'],['bus','bus'],['train','train']];
  const typedItems=typed.flatMap(([key,kind])=>Array.isArray(node[key])
   ?node[key].filter(v=>v&&typeof v==='object').map(v=>({
      ...v,mode:v.mode||v.transport_mode||kind
    })):[]);
  if(typed.some(([key])=>Array.isArray(node[key])))
   return {items:typedItems,mode:parentMode};
  node=node.structuredContent||node.data||node.result||
    (node.results&&typeof node.results==='object'?node.results:null);
 }
 return {items:[],mode:parentMode};
}
// Only aggregate, non-sensitive response metadata. Never store or return raw
// provider bodies, station queries, messages, tokens, or passenger data.
export function inspectBiloSearchResponse(payload){
 const isObject=payload!==null&&typeof payload==='object'&&!Array.isArray(payload);
 const errorPresent=isObject&&(
   payload.success===false||payload.ok===false||payload.isError===true||
   Boolean(payload.error)||String(payload.status||'').toLowerCase()==='error'
 );
 const data=biloRecords(payload);
 const records=data.items.length;
 const hasList=Array.isArray(payload) || (()=>{
   let v=payload;
   for(let i=0;i<5;i++){
     if(Array.isArray(v))return true;
     if(!v||typeof v!=='object')break;
     if(['trips','journeys','results','items','trains','rail',
       'coaches','buses','bus','train'].some(key=>Array.isArray(v[key])))return true;
     v=v.structuredContent||v.data||v.result||
       (v.results&&typeof v.results==='object'?v.results:null);
   }
   return false;
 })();
 return {
  // These values are safe to expose to the UI and have fixed schemas.
  status:errorPresent?'provider_reported_error':
    !hasList?'response_format_unrecognized':
    records===0?'no_results_returned':'results_unparsable',
  records_returned:Math.min(10000,records)
 };
}
function biloLegs(item){
 const record=item.trip&&typeof item.trip==='object'?item.trip:
  item.journey&&typeof item.journey==='object'?item.journey:
  item.itinerary&&typeof item.itinerary==='object'?item.itinerary:item;
 const candidates=[record.legs,record.segments,record.stages,record.steps,
  record.route?.legs,record.route?.segments,record.route?.stages];
 return {record,segments:candidates.find(Array.isArray)||[record]};
}
function biloLegFields(seg,item,rootMode,date){
 const from=placeName(seg.from||seg.origin||seg.fromStation||seg.departureStation||
  seg.departure_station||seg.origin_station||seg.originStation||
  seg.from_stop||seg.fromStop||seg.departure_stop||seg.departureStop||
  seg.departure?.station||seg.departure?.stop||seg.departure?.location||
  seg.start?.station||seg.start?.stop||
  item.from||item.origin||item.departure_station||item.departure?.station);
 const to=placeName(seg.to||seg.destination||seg.toStation||seg.arrivalStation||
  seg.arrival_station||seg.destination_station||seg.destinationStation||
  seg.to_stop||seg.toStop||seg.arrival_stop||seg.arrivalStop||
  seg.arrival?.station||seg.arrival?.stop||seg.arrival?.location||
  seg.end?.station||seg.end?.stop||
  item.to||item.destination||item.arrival_station||item.arrival?.station);
 const fromLocality=pickLocality(seg.from,seg.origin,seg.fromStation,seg.departureStation,
  seg.departure_station,seg.origin_station,seg.from_stop,seg.departure_stop,
  seg.departure?.station,seg.departure?.stop,seg.departure?.location,
  seg.departure,seg.start,item.from,item.origin,item.departure_station,item.departure);
 const toLocality=pickLocality(seg.to,seg.destination,seg.toStation,seg.arrivalStation,
  seg.arrival_station,seg.destination_station,seg.to_stop,seg.arrival_stop,
  seg.arrival?.station,seg.arrival?.stop,seg.arrival?.location,
  seg.arrival,seg.end,item.to,item.destination,item.arrival_station,item.arrival);
 // Physical vehicle is more reliable than the booking category: rail tickets
 // may be served by CFR/other train-replacement coaches.
 const physical=[seg.vehicle_type,seg.vehicleType,seg.vehicle?.type,
  seg.vehicle?.mode,seg.transport?.vehicle_type,seg.transport?.vehicleType,
  item.vehicle_type,item.vehicleType];
 const category=[seg.mode,seg.type,seg.transport_mode,seg.transportMode,
  seg.transport_type,seg.category,seg.transport?.mode,seg.transport?.type,
  seg.service?.type,seg.service?.category,item.mode,item.transport_mode,
  item.transport_type,rootMode];
 const replacement=seg.rail_replacement===true||seg.railReplacement===true||
  seg.replacement_bus===true||seg.replacementBus===true||
  seg.is_replacement_bus===true||seg.isRailReplacement===true||
  [seg.replacement_type,seg.replacement_reason,seg.service?.category,
   seg.service?.type,seg.vehicle?.description,seg.description]
   .some(v=>/\b(?:rail|train|tren|feroviar).*(?:replacement|inlocui|substitu)|(?:replacement|inlocui|substitu).*(?:rail|train|tren|feroviar)/.test(normalize(v)));
 let mode=physical.map(normalizeMode).find(Boolean)||
   category.map(normalizeMode).find(Boolean)||'';
 if(replacement&&(!mode||mode==='train'))mode='coach';
 const railReplacement=replacement&&['coach','bus'].includes(mode)||
   ['coach','bus'].includes(mode)&&
   category.some(v=>normalizeMode(v)==='train')&&physical.some(v=>['coach','bus'].includes(normalizeMode(v)));
 // Source explicitly marks this as a train/coach, even when the
 // broad search mode is "all"; never infer mode from the requested route.
 if(!mode&&[seg.train_number,seg.trainNumber,seg.train?.number,item.train_number,
   item.train?.number,seg.service?.train_number].some(Boolean))mode='train';
 if(!mode&&[seg.bus_number,seg.bus?.number,seg.coach_number,item.bus_number].some(Boolean))mode='bus';
 // Explicitly unknown provider mode is not overridden by a train-number hint.
 if([seg.mode,seg.transport_mode,seg.transportMode,seg.transport_type,item.mode].some(v=>normalize(v)==='unknown'))mode='';
 const departValue=seg.departureTime??seg.departure_time??seg.departure_at??
  seg.startDateTime??seg.start_time??seg.startTime??seg.dep_time??
  seg.departure?.time??seg.departure?.datetime??seg.departure?.date_time??
  seg.start?.time??seg.departure??item.departure_time??item.departure?.time;
 const arriveValue=seg.arrivalTime??seg.arrival_time??seg.arrival_at??
  seg.endDateTime??seg.end_time??seg.endTime??seg.arr_time??
  seg.arrival?.time??seg.arrival?.datetime??seg.arrival?.date_time??
  seg.end?.time??seg.arrival??item.arrival_time??item.arrival?.time;
 const dep=providerTimestamp(departValue,date);
 const arr=providerTimestamp(arriveValue,date,dep);
 return {from,to,fromLocality,toLocality,mode,railReplacement,dep,arr,
  reason:!from?'missing_origin':!to?'missing_destination':!mode?'missing_transport_mode':
    dep===null?'missing_departure_time':arr===null?'missing_arrival_time':
    arr<=dep?'invalid_time_order':null};
}
function biloParseHint(payload,date=''){
 const {items,mode}=biloRecords(payload);
 const counts=new Map();
 for(const item of items.slice(0,12)){
  if(!item||typeof item!=='object')continue;
  const {record,segments}=biloLegs(item);
  if(!segments.length){counts.set('missing_legs',(counts.get('missing_legs')||0)+1);continue;}
  for(const leg of segments.slice(0,8)){
   if(!leg||typeof leg!=='object')continue;
   const reason=biloLegFields(leg,record,mode,date).reason;
   if(reason)counts.set(reason,(counts.get(reason)||0)+1);
  }
 }
 const allowed=['missing_origin','missing_destination','missing_transport_mode',
   'missing_departure_time','missing_arrival_time','invalid_time_order','missing_legs'];
 return allowed.sort((a,b)=>(counts.get(b)||0)-(counts.get(a)||0))
   .find(x=>counts.has(x))||'unsupported_structure';
}
export function normalizeBiloTrips(payload,limit=5,date=''){
 const {items,mode:rootMode}=biloRecords(payload);
 const seen=new Set(),out=[];
 for(const item of items.slice(0,100)){
  if(out.length>=Math.min(20,Math.max(1,limit)))break;
  if(!item||typeof item!=='object')continue;
  const {record,segments}=biloLegs(item);
  if(!segments.length||segments.length>8)continue;
  const legs=[];
  for(const seg of segments){
   if(!seg||typeof seg!=='object'){legs.length=0;break;}
   const fields=biloLegFields(seg,segments.length===1?record:{mode:record.mode,transport_mode:record.transport_mode,train_number:record.train_number},rootMode,date);
   if(fields.reason || (legs.length&&fields.dep<Date.parse(legs[legs.length-1].arrivalTime))){
    legs.length=0;break;
   }
   const line=String(seg.line||seg.lineName||seg.line_name||seg.trainNumber||
    seg.train_number||seg.train?.number||seg.serviceNumber||
    seg.service_number||seg.routeShortName||seg.service?.number||
    seg.service?.code||seg.number||record.train_number||
    record.trainNumber||record.train?.number||record.service?.number||'').slice(0,36);
   const operator=seg.operator||seg.operatorName||seg.operator_name||
     seg.service?.operator||record.operator||'';
   legs.push({mode:fields.mode,from:fields.from,to:fields.to,
     ...(fields.railReplacement?{railReplacement:true}:{}),
     ...(fields.fromLocality?{fromLocality:fields.fromLocality}:{}),
     ...(fields.toLocality?{toLocality:fields.toLocality}:{}),
     departureTime:new Date(fields.dep).toISOString(),arrivalTime:new Date(fields.arr).toISOString(),
     lineNames:line?[line]:[],
     operator:String(typeof operator==='object'?operator.name||'':operator).slice(0,100)});
  }
  if(!legs.length)continue;
  if(isUnverifiedClosedCorridorRail({legs},date))continue;
  const start=legs[0].departureTime,end=legs[legs.length-1].arrivalTime;
  const durationMinutes=Math.round((Date.parse(end)-Date.parse(start))/60000);
  if(durationMinutes<1||durationMinutes>48*60)continue;
  const id=legs.map(x=>[x.from,x.to,x.departureTime,x.mode].join('|')).join(',');
  if(seen.has(id))continue;
  seen.add(id);
  out.push({startDateTime:start,arrivalDateTime:end,durationMinutes,legs,
    time_zone:'Europe/Bucharest',fareLocal:biloFare(record)||biloFare(item),
    scheduled:true,real_time:false,source:'Bilo: operator schedule'});
 }
 return out;
}
// Bilo search records may contain only an opaque tripId and summary.
// The documented /trip-details endpoint supplies the full timetable without
// another billed search. Never infer a timetable from the identifier alone.
function biloTripId(record){
 if(!record||typeof record!=='object')return '';
 const value=record.tripId??record.trip_id??record.trip?.tripId??
  record.journey?.tripId??record.itinerary?.tripId??record.id;
 // Preserve the provider identifier exactly; never put it into a URL path.
 if(typeof value!=='string'&&typeof value!=='number')return '';
 const id=String(value);
 return id.length>0&&id.length<=256&&!/[\u0000-\u001f\u007f]/.test(id)?id:'';
}
function detailTrips(payload,limit,date){
 let value=payload;
 for(let depth=0;depth<6;depth++){
  if(!value||typeof value!=='object')break;
  if(Array.isArray(value))return normalizeBiloTrips({results:value},limit,date);
  if(['results','trips','journeys','items'].some(k=>Array.isArray(value[k])))
   return normalizeBiloTrips(value,limit,date);
  if(Array.isArray(value.legs)||Array.isArray(value.segments)||
     Array.isArray(value.stages)||Array.isArray(value.steps)||
     Array.isArray(value.route?.legs)||Array.isArray(value.route?.segments)||
     Array.isArray(value.itinerary?.legs)||Array.isArray(value.trip?.legs))
   return normalizeBiloTrips({results:[value]},limit,date);
  value=value.data||value.result||value.details||value.structuredContent||
   value.trip||value.journey||value.itinerary;
 }
 return [];
}
// Official documented Bilo search, distinct from the private keyed
// all-mode endpoint. The Bilo developer documentation explicitly specifies
// mode=bus on https://bilo.ro/search-api/v2/search. Call only when the all-mode
// response has no road services; passenger does not need to select a mode.
async function officialBiloBusJourneys(query,date,limit,fetchImpl){
 try{
  const endpoint=new URL('https://bilo.ro/search-api/v2/search');
  endpoint.searchParams.set('origin',query.origin);
  endpoint.searchParams.set('destination',query.destination);
  endpoint.searchParams.set('date',date);
  endpoint.searchParams.set('mode','bus');
  const response=await fetchImpl(endpoint.toString(),{
   method:'GET',headers:{'Accept':'application/json'},
   signal:AbortSignal.timeout(6500)
  });
  if(!response.ok)return {status:'http_'+response.status,journeys:[],records:0};
  const payload=await response.json();
  const data=biloRecords(payload);
  const journeys=normalizeBiloTrips(payload,limit,date).filter(j=>
   j.legs.some(l=>['coach','bus','minibus'].includes(String(l.mode||'').toLowerCase()))&&
   j.legs.every(l=>['coach','bus','minibus','walking'].includes(String(l.mode||'').toLowerCase())));
  return {status:journeys.length?'ok':data.items.length?'unparsable':'no_results',
   journeys,records:data.items.length};
 }catch(e){return {status:e?.name==='TimeoutError'?'timeout':'network_error',
   journeys:[],records:0};}
}
export async function planRomanianNationalJourney(env,query,opts={}){
 const key=String(env?.BILO_API_KEY||'').trim();
 if(!query?.origin||!query?.destination)return {status:'origin_or_destination_required',journeys:[]};
 if(!key)return {status:'not_configured',journeys:[]};
 const date=opts.date;
 if(!isDate(date))return {status:'date_invalid',journeys:[]};
 const limit=Math.min(20,Math.max(1,Number(opts.limit)||10));
 const url='https://mcp.bilo.ro/api/v1/search';
 const requestId=opts.idempotencyKey||crypto.randomUUID();
 const fetchImpl=opts.fetchImpl||fetch;
 const headers={'Authorization':'Bearer '+key,'Content-Type':'application/json',
  'Accept':'application/json'};
 try{
  // Exact documented search fields; Bilo rejects unknown request properties.
  const response=await fetchImpl(url,{
   method:'POST',
   headers:{...headers,'Idempotency-Key':requestId},
   body:JSON.stringify({origin:query.origin,destination:query.destination,date,
    mode:'all',limit}),
   signal:AbortSignal.timeout(9500)
  });
  if(response.status===401)return {status:'authentication_failed',http_status:401,journeys:[]};
  if(response.status===403)return {status:'access_forbidden',http_status:403,journeys:[]};
  if(response.status===429)return {status:'quota_exceeded',journeys:[]};
  if(!response.ok)return {status:'provider_http_'+response.status,journeys:[]};
  const payload=await response.json();
  const diagnosis=inspectBiloSearchResponse(payload);
  const {items,mode:rootMode}=biloRecords(payload);
  // Enrich every returned record with a documented tripId, even when other
  // search records are already usable. Previously the first parseable record
  // caused all remaining details to be skipped.
  const candidates=[];
  const seenIds=new Set();
  for(const record of items){
   const id=biloTripId(record);
   if(!id||seenIds.has(id))continue;
   seenIds.add(id);candidates.push({id,record});
   if(candidates.length>=Math.min(limit,8))break;
  }
  const fetched=await Promise.all(candidates.map(async candidate=>{
   try{
    const detailResponse=await fetchImpl('https://mcp.bilo.ro/api/v1/trip-details',{
     method:'POST',headers,body:JSON.stringify({tripId:candidate.id}),
     signal:AbortSignal.timeout(6500)
    });
    if(!detailResponse.ok)return null;
    const detailPayload=await detailResponse.json();
    const detailed=detailTrips(detailPayload,1,date);
    if(!detailed.length)return null;
    const trip=detailed[0];
    if(!trip.fareLocal)trip.fareLocal=biloFare(candidate.record);
    return {id:candidate.id,trip};
   }catch{return null;}
  }));
  const details=new Map(fetched.filter(Boolean).map(x=>[x.id,x.trip]));
  const completed=[],seenJourneys=new Set();
  for(const record of items){
   const id=biloTripId(record);
   const trip=details.get(id)||normalizeBiloTrips({mode:rootMode,results:[record]},1,date)[0];
   if(!trip)continue;
   const key=trip.legs.map(l=>[l.mode,l.from,l.to,l.departureTime].join('|')).join(';');
   if(seenJourneys.has(key))continue;
   seenJourneys.add(key);completed.push(trip);
  }
  const primaryRoad=completed.some(j=>j.legs.some(l=>
   ['coach','bus','minibus'].includes(String(l.mode||'').toLowerCase())));
  const checkOfficial=!primaryRoad&&(opts.tryOfficialBusSearch===true||
   (!opts.fetchImpl&&opts.tryOfficialBusSearch!==false));
  const busLookup=checkOfficial?await officialBiloBusJourneys(query,date,limit,fetchImpl)
    :{status:primaryRoad?'included_in_all':'not_checked',journeys:[],records:0};
  for(const coach of busLookup.journeys){
   const key=coach.legs.map(l=>[l.mode,l.from,l.to,l.departureTime].join('|')).join(';');
   if(!seenJourneys.has(key)){seenJourneys.add(key);completed.push(coach);}
  }
  if(completed.length){
   // Safe aggregate statistics help distinguish missing provider coverage
   // from lost parsed services, without exposing trip IDs or personal data.
   const modes={rail:0,road:0,mixed:0};
   for(const trip of completed){
    const travel=(trip.legs||[]).map(x=>x.mode)
      .filter(mode=>!['walking','walk','foot'].includes(mode));
    const category=travel.every(mode=>['train','rail'].includes(mode))?'rail':
      travel.every(mode=>['coach','bus','minibus'].includes(mode))?'road':'mixed';
    modes[category]++;
   }
   return {status:'ok',journeys:completed.slice(0,limit),
    records_returned:items.length,parsed_modes:modes,
    coach_lookup:busLookup.status,coach_records_returned:busLookup.records,
    detail_requests:candidates.length,detail_successes:details.size};
  }
  return {status:diagnosis.status,records_returned:diagnosis.records_returned,
   coach_lookup:busLookup.status,coach_records_returned:busLookup.records,
   parse_hint:diagnosis.status==='results_unparsable'
    ?(candidates.length?'trip_details_not_usable':biloParseHint(payload,date)):null,
   detail_requests:candidates.length,detail_successes:details.size,journeys:[]};
 }catch(e){return {status:e?.name==='TimeoutError'?'timeout':'provider_network_error',journeys:[]};}
}
export async function reverseRomanianOriginCity(env,pt,fetchImpl=fetch){
 if(!isRoGPS(pt)||!env?.GEOAPIFY_API_KEY)return '';
 try{
  const u=new URL('https://api.geoapify.com/v1/geocode/reverse');
  u.searchParams.set('lat',String(pt.latitude));u.searchParams.set('lon',String(pt.longitude));
  u.searchParams.set('type','city');u.searchParams.set('apiKey',String(env.GEOAPIFY_API_KEY));
  const r=await fetchImpl(u.toString(),{signal:AbortSignal.timeout(5500)});
  if(!r.ok)return '';
  const result=await r.json();
  const props=(result.features||[])[0]?.properties||{};
  if(String(props.country_code||'').toUpperCase()!=='RO')return '';
  return cleanTown(props.city||props.town||props.village||'');
 }catch{return ''}
}
export function bucharestTravelDate(value,now=new Date()){
 const timestamp=value?new Date(value):now;
 const dt=Number.isFinite(timestamp.getTime())?timestamp:now;
 const parts=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Bucharest',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(dt);
 const fields=Object.fromEntries(parts.map(p=>[p.type,p.value]));
 return fields.year+'-'+fields.month+'-'+fields.day;
}
const ROMANIAN_MONTHS=new Map([
 ['ianuarie',1],['februarie',2],['martie',3],['aprilie',4],['mai',5],
 ['iunie',6],['iulie',7],['august',8],['septembrie',9],['octombrie',10],
 ['noiembrie',11],['decembrie',12]
]);
function validRomanianDate(year,month,day){
 const utc=new Date(Date.UTC(year,month-1,day));
 return utc.getUTCFullYear()===year && utc.getUTCMonth()===month-1 && utc.getUTCDate()===day
  ?utc.toISOString().slice(0,10):null;
}
// Separate the date requested in free-form text from the geolocated phone's
// timezone: both the default and "mâine" use the destination timezone.
export function romanianDepartureDate(message,selectedAt='',now=new Date()){
 if(selectedAt)return bucharestTravelDate(selectedAt,now);
 const base=bucharestTravelDate(null,now);
 const plain=normalize(message);
 const numeric=plain.match(/(?:^|\s)(?:pe\s+|la\s+data\s+de\s+)?([0-3]?\d)[./-]([01]?\d)[./-](20\d{2})(?=\s|$|[?!,.])/);
 if(numeric){
  const date=validRomanianDate(+numeric[3],+numeric[2],+numeric[1]);
  return date||base;
 }
 const textual=plain.match(/(?:^|\s)(?:pe\s+|la\s+data\s+de\s+)?([0-3]?\d)\s+(ianuarie|februarie|martie|aprilie|mai|iunie|iulie|august|septembrie|octombrie|noiembrie|decembrie)(?:\s+(20\d{2}))?(?=\s|$|[?!,.])/);
 if(textual){
  const month=ROMANIAN_MONTHS.get(textual[2]);
  let year=textual[3]?+textual[3]:Number(base.slice(0,4));
  let date=validRomanianDate(year,month,+textual[1]);
  if(date&&!textual[3]&&date<base)date=validRomanianDate(year+1,month,+textual[1]);
  return date||base;
 }
 const increment=/\bpoimaine\b/.test(plain)?2:/\bmaine\b/.test(plain)?1:0;
 return new Date(Date.parse(base+'T12:00:00Z')+increment*86400000).toISOString().slice(0,10);
}
export function romanianJourneySummary(journeys,origin,destination,language='ro'){
 const english=language==='en',clock=localClock;
 const duration=minutes=>{
  const hours=Math.floor(minutes/60),mins=Math.round(minutes%60);
  return [hours?hours+(english?' h':' h'):'',mins?mins+' min':''].filter(Boolean).join(' ')||'0 min';
 };
 const modeName=mode=>{
  const m=String(mode||'').toLowerCase();
  if(m==='train'||m==='rail')return english?'Train':'Tren';
  if(m==='coach')return english?'Coach':'Autocar';
  if(m==='bus'||m==='minibus')return english?'Bus':'Autobuz';
  return english?'Public transport':'Transport public';
 };
 const lines=journeys.slice(0,8).map((j,i)=>{
  const legs=j.legs.filter(l=>l.mode!=='walking');
  const kinds=[...new Set(legs.map(l=>modeName(l.mode)))].join(' + ');
  const transfers=Math.max(0,legs.length-1);
  const fare=j.fareLocal?' · '+j.fareLocal.amount.toFixed(2)+' '+j.fareLocal.currency:'';
  return (i+1)+'. '+clock(j.startDateTime)+' – '+clock(j.arrivalDateTime)+
   ' · '+duration(j.durationMinutes)+' · '+kinds+
   (transfers?' · '+transfers+(english?' transfers':' schimbări'):'')+fare;
 }).join('\n');
 const first=journeys[0];
 const steps=first.legs.map((l,i)=>(i+1)+'. '+clock(l.departureTime)+' – '+clock(l.arrivalTime)+
  ' · '+l.from+' → '+l.to+' · '+[modeName(l.mode),...l.lineNames,l.operator].filter(Boolean).join(' ')).join('\n');
 const caution=english
  ?'Scheduled times, not live. Fares and seat availability must be confirmed with the operator.'
  :'Ore programate, nu în timp real. Prețurile și locurile se confirmă la operator.';
 return (english?'Public transport':'Transport public')+': '+origin+' → '+destination+
   '\n'+lines+'\n\n'+(english?'First route, step by step:':'Prima variantă, pas cu pas:')+
   '\n'+steps+'\n'+caution;
}
