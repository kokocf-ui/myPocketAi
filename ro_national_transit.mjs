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
const cleanTown=v=>String(v||'').replace(/[!?.,;:]+$/g,'')
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
const normalizeMode=raw=>{
 const mode=normalize(raw);
 if(/walk|foot|pieton/.test(mode))return 'walking';
 if(/tren|train|rail|interregio|regio/.test(mode))return 'train';
 if(/autocar|coach/.test(mode))return 'coach';
 if(/autobuz|bus/.test(mode))return 'bus';
 if(/feroviar|feroviara|feroviara/.test(mode))return 'train';
 if(/microbuz|minibus/.test(mode))return 'bus';
 return '';
};
function localClock(iso){
 const date=new Date(iso);
 return Number.isFinite(date.getTime())
  ?date.toLocaleString('ro-RO',{timeZone:'Europe/Bucharest',day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'})
  :'';
}
export function romanianNationalQuery(message,opts={}){
 const text=String(message||'');
 const normalized=normalize(text);
 const explicitTransit=/\b(?:transport(?:ul)? (?:public|in comun)|transport mixt|tren(?:ul)?|autocar(?:ul)?|autobuz(?:ul)?|rail|train|coach|bus)\b/i.test(normalized)
   ||opts.mixed_journey===true||opts.travel_mode==='transit';
 if(!explicitTransit)return null;
 const matched=text.match(/(?:^|\s)(?:din|de\s+la)\s+(.+?)\s+(?:p[aâ]n[aă]\s+la|către|catre|spre|la)\s+(.+?)(?:[?!]|$)/iu);
 const origin=matched?cleanTown(matched[1]):cleanTown(opts.origin?.city||opts.origin?.label||'');
 const destination=matched?cleanTown(matched[2]):cleanTown(opts.destination?.city||opts.destination?.label||opts.transit_query||'');
 const explicitRomania=/\b(?:romania|romaniei|romanesti|romanian)\b/.test(normalized)
    ||String(opts.origin?.country_code||'').toUpperCase()==='RO'
    ||String(opts.destination?.country_code||'').toUpperCase()==='RO';
 const majorPair=ROMANIA_CITIES.has(normalize(origin))&&ROMANIA_CITIES.has(normalize(destination));
 if(!majorPair&&!explicitRomania&&!isRoGPS(opts.location))return null;
 return {origin,destination,hasOrigin:Boolean(origin),hasDestination:Boolean(destination)};
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
  node=node.structuredContent||node.data||node.result;
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
     if(['trips','journeys','results','items'].some(key=>Array.isArray(v[key])))return true;
     v=v.structuredContent||v.data||v.result;
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
 const modes=[seg.mode,seg.type,seg.transport_mode,seg.transportMode,
  seg.transport_type,seg.vehicle_type,seg.vehicleType,seg.category,
  seg.transport?.mode,seg.transport?.type,seg.vehicle?.type,
  seg.service?.type,seg.service?.category,item.mode,item.transport_mode,
  item.transport_type,rootMode];
 let mode=modes.map(normalizeMode).find(Boolean)||'';
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
 return {from,to,mode,dep,arr,
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
  if(out.length>=Math.min(10,Math.max(1,limit)))break;
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
    seg.train_number||seg.routeShortName||seg.service?.number||
    seg.number||record.train_number||'').slice(0,36);
   const operator=seg.operator||seg.operatorName||seg.operator_name||
     seg.service?.operator||record.operator||'';
   legs.push({mode:fields.mode,from:fields.from,to:fields.to,
     departureTime:new Date(fields.dep).toISOString(),arrivalTime:new Date(fields.arr).toISOString(),
     lineNames:line?[line]:[],
     operator:String(typeof operator==='object'?operator.name||'':operator).slice(0,100)});
  }
  if(!legs.length)continue;
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
export async function planRomanianNationalJourney(env,query,opts={}){
 const key=String(env?.BILO_API_KEY||'').trim();
 if(!query?.origin||!query?.destination)return {status:'origin_or_destination_required',journeys:[]};
 if(!key)return {status:'not_configured',journeys:[]};
 const date=opts.date;
 if(!isDate(date))return {status:'date_invalid',journeys:[]};
 const limit=Math.min(8,Math.max(1,Number(opts.limit)||5));
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
  const journeys=normalizeBiloTrips(payload,limit,date);
  if(journeys.length)return {status:'ok',journeys};
  const diagnosis=inspectBiloSearchResponse(payload);
  const candidateIds=[];
  const seen=new Set();
  // Fetch details only for returned search records that carry an actual tripId.
  // Never issue a second /search, and never request details for synthetic IDs.
  const {items}=biloRecords(payload);
  for(const record of items){
   const id=biloTripId(record);
   if(!id||seen.has(id))continue;
   seen.add(id);candidateIds.push({id,record});
   if(candidateIds.length>=Math.min(limit,5))break;
  }
  const completed=[];
  let detailRequests=0,detailSuccesses=0;
  for(const candidate of candidateIds){
   detailRequests++;
   try{
    const detailResponse=await fetchImpl('https://mcp.bilo.ro/api/v1/trip-details',{
     method:'POST',headers,
     body:JSON.stringify({tripId:candidate.id}),
     signal:AbortSignal.timeout(6500)
    });
    if(!detailResponse.ok)continue;
    const detailPayload=await detailResponse.json();
    const detailed=detailTrips(detailPayload,1,date);
    if(!detailed.length)continue;
    detailSuccesses++;
    for(const trip of detailed){
     // An optional published fare can remain on the search summary.
     if(!trip.fareLocal)trip.fareLocal=biloFare(candidate.record);
     completed.push(trip);
    }
   }catch{
    // Fail closed: one malformed detail must not discard other valid trips.
   }
  }
  if(completed.length){
   completed.sort((a,b)=>Date.parse(a.startDateTime)-Date.parse(b.startDateTime));
   return {status:'ok',journeys:completed.slice(0,limit),
    detail_requests:detailRequests,detail_successes:detailSuccesses};
  }
  return {status:diagnosis.status,records_returned:diagnosis.records_returned,
   parse_hint:diagnosis.status==='results_unparsable'
    ?(detailRequests?'trip_details_not_usable':biloParseHint(payload,date)):null,
   detail_requests:detailRequests,detail_successes:detailSuccesses,journeys:[]};
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
 const clock=localClock;
 const main=journeys.slice(0,8).map((j,i)=>{
  const modes=j.legs.filter(l=>l.mode!=='walking').map(l=>[l.mode,...l.lineNames].filter(Boolean).join(' ')).join(' → ');
  const fare=j.fareLocal?' · '+j.fareLocal.amount.toFixed(2)+' '+j.fareLocal.currency:'';
  return (i+1)+'. '+clock(j.startDateTime)+' – '+clock(j.arrivalDateTime)+' · '+
    j.durationMinutes+' min · '+modes+fare;
 }).join('\n');
 const detail=journeys[0].legs.map((l,i)=>(i+1)+'. '+clock(l.departureTime)+' – '+clock(l.arrivalTime)+
  ' · '+l.from+' → '+l.to+' · '+[l.mode,...l.lineNames,l.operator].filter(Boolean).join(' ')).join('\n');
 return (language==='en'?'Public transport options':'Variante de transport public')+
  ': '+origin+' → '+destination+'\n'+main+'\n\n'+
  (language==='en'?'First itinerary, step by step:':'Prima variantă, pas cu pas:')+'\n'+detail+'\n'+
  (language==='en'?'Scheduled services; confirm with the operator.':'Orar publicat; verifică actualizările la operator.');
}
