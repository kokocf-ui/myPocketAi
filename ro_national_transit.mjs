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
 .replace(/\s+(?:cu\s+(?:trenul|autocarul|autobuzul)|pentru\s+\d+\s+(?:persoane|adulti)|maine|azi|poimaine|la\s+ora\s+\d.*)$/i,'').trim().slice(0,100);
const isRoGPS=pt=>Number.isFinite(Number(pt?.latitude))&&Number.isFinite(Number(pt?.longitude))
 && Number(pt.latitude)>=43.55&&Number(pt.latitude)<=48.35
 && Number(pt.longitude)>=20.15&&Number(pt.longitude)<=29.95;
const isDate=value=>/^\d{4}-\d{2}-\d{2}$/.test(String(value||''))&&!Number.isNaN(Date.parse(String(value)+'T12:00:00Z'));
const placeName=value=>{
 if(typeof value==='string')return value.trim().slice(0,140);
 if(value&&typeof value==='object')return String(value.name||value.station||value.label||value.city||'').trim().slice(0,140);
 return '';
};
const normalizeMode=raw=>{
 const mode=normalize(raw);
 if(/walk|foot|pieton/.test(mode))return 'walking';
 if(/tren|train|rail|interregio|regio/.test(mode))return 'train';
 if(/autocar|coach/.test(mode))return 'coach';
 if(/autobuz|bus/.test(mode))return 'bus';
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
 const raw=String(value??'').trim();
 if(!raw)return null;
 const plain=raw.match(/^(?:(\d{4}-\d{2}-\d{2})[T\s])?(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
 if(plain){
  const day=plain[1]||date;
  const offset=bucharestOffset(day);
  if(offset===null||Number(plain[2])>23||Number(plain[3])>59||Number(plain[4]||0)>59)return null;
  let ts=Date.parse(day+'T'+plain[2].padStart(2,'0')+':'+plain[3]+':'+(plain[4]||'00')+'Z')-offset*60000;
  // A stated arrival clock earlier than departure may be a next-day train.
  if(previous!==null&&ts<previous&&previous-ts<24*3600000)ts+=86400000;
  return Number.isFinite(ts)?ts:null;
 }
 const parsed=Date.parse(raw);
 return Number.isFinite(parsed)?parsed:null;
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
 // Some API responses wrap search in data, results, or structuredContent.
 let node=payload;
 for(let i=0;i<5;i++){
  if(Array.isArray(node))return {items:node,mode:''};
  if(!node||typeof node!=='object')break;
  for(const key of ['trips','journeys','results','items']){
   if(Array.isArray(node[key]))return {items:node[key],mode:String(node.mode||'')};
  }
  node=node.structuredContent||node.data||node.result;
 }
 return {items:[],mode:''};
}
export function normalizeBiloTrips(payload,limit=5,date=''){
 const {items,mode:rootMode}=biloRecords(payload);
 const seen=new Set(),out=[];
 for(const item of items){
  if(out.length>=Math.min(10,Math.max(1,limit)))break;
  if(!item||typeof item!=='object')continue;
  const segments=Array.isArray(item.legs)?item.legs:
    Array.isArray(item.segments)?item.segments:
    Array.isArray(item.connections)?item.connections:
    [item]; // Bilo search API v2 exposes flat result records.
  if(!segments.length||segments.length>8)continue;
  const legs=[];
  for(const seg of segments){
   if(!seg||typeof seg!=='object'){legs.length=0;break;}
   const from=placeName(seg.from||seg.origin||seg.fromStation||seg.departureStation||
     seg.departure_station||seg.origin_station||((segments.length===1)?item.origin:null));
   const to=placeName(seg.to||seg.destination||seg.toStation||seg.arrivalStation||
     seg.arrival_station||seg.destination_station||((segments.length===1)?item.destination:null));
   const mode=normalizeMode(seg.mode||seg.type||seg.transportMode||seg.transport_mode||
     seg.category||item.mode||item.transport_mode||rootMode||
     (seg.train_number||seg.trainNumber||item.train_number?'rail':''));
   const dep=providerTimestamp(seg.departureTime||seg.departure_time||seg.departure||
     seg.departure_at||seg.startDateTime||seg.startTime||seg.start_time,date);
   const arr=providerTimestamp(seg.arrivalTime||seg.arrival_time||seg.arrival||
     seg.arrival_at||seg.endDateTime||seg.endTime||seg.end_time,date,dep);
   if(!from||!to||!mode||dep===null||arr===null||arr<=dep||
      (legs.length&&dep<Date.parse(legs[legs.length-1].arrivalTime))){legs.length=0;break;}
   const line=String(seg.line||seg.lineName||seg.line_name||seg.trainNumber||
      seg.train_number||seg.routeShortName||seg.number||item.train_number||'').slice(0,36);
   const operator=seg.operator||seg.operatorName||seg.operator_name||item.operator||'';
   legs.push({mode,from,to,departureTime:new Date(dep).toISOString(),
      arrivalTime:new Date(arr).toISOString(),lineNames:line?[line]:[],
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
    time_zone:'Europe/Bucharest',fareLocal:biloFare(item),
    scheduled:true,real_time:false,source:'Bilo: operator schedule'});
 }
 return out;
}
export async function planRomanianNationalJourney(env,query,opts={}){
 const key=String(env?.BILO_API_KEY||'').trim();
 if(!query?.origin||!query?.destination)return {status:'origin_or_destination_required',journeys:[]};
 if(!key)return {status:'not_configured',journeys:[]};
 const date=opts.date;
 if(!isDate(date))return {status:'date_invalid',journeys:[]};
 const limit=Math.min(8,Math.max(1,Number(opts.limit)||5));
 const url='https://bilo.ro/api/integrations/v1/search';
 try{
  const response=await (opts.fetchImpl||fetch)(url,{
   method:'POST',
   headers:{'Authorization':'Bearer '+key,'Content-Type':'application/json','Accept':'application/json'},
   body:JSON.stringify({origin:query.origin,destination:query.destination,date,
    passengers:1,mode:'all',railClass:'2',sort:'duration',limit}),
   signal:AbortSignal.timeout(9500)
  });
  if(response.status===401||response.status===403)return {status:'authentication_failed',journeys:[]};
  if(response.status===429)return {status:'quota_exceeded',journeys:[]};
  if(!response.ok)return {status:'provider_http_'+response.status,journeys:[]};
  const payload=await response.json();
  const journeys=normalizeBiloTrips(payload,limit,date);
  return {status:journeys.length?'ok':'no_verified_itineraries',journeys};
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
