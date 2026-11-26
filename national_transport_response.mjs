import {annotateTransportJourneys,transportNoticeLine} from './transport_availability_disclosure.mjs';
// Shared, domestic-only response contract for newly connected country planners.
// Existing RO/GB and Directions response paths are intentionally independent.
export function nationalTransportResponse(result,{country,provider,language='ro',destination,departureAt}={}){
 const en=language==='en',journeys=annotateTransportJourneys(result?.journeys||[],language);
 const clock=(value,zone)=>!value||!Number.isFinite(Date.parse(value))?'—':new Date(value).toLocaleString(en?'en-GB':'ro-RO',{
  timeZone:zone,day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'});
 const indicative=j=>j.route_only===true||['indicative','estimated','unavailable','unconfirmed'].includes(j.schedule_status);
 const description=journeys.map((j,i)=>(i+1)+'. '+(indicative(j)?(en?'Indicative · ':'Orientativ · '):'')+clock(j.startDateTime,j.time_zone)+'–'+clock(j.arrivalDateTime,j.time_zone)+
  ' · '+j.legs.filter(l=>l.mode!=='walking').map(l=>[l.mode,...l.lineNames].join(' ')+' · '+l.from+' → '+l.to).join(' / ')).join('\n');
 const unavailable=result?.status==='invalid_departure'
  ?(en?'Choose a valid departure within the next 60 days.':'Alege o plecare validă în următoarele 60 de zile.')
  :result?.status==='free_quota_exhausted'
  ?(en?'The free monthly transit allowance is exhausted. Requests are stopped; no paid fallback is used.':'Cota lunară gratuită pentru transport s-a epuizat. Cererile sunt oprite; nu folosesc o alternativă cu plată.')
  :result?.status==='budget_unavailable'
  ?(en?'The free allowance could not be checked. Requests are stopped to avoid charges.':'Cota gratuită nu poate fi verificată. Cererile sunt oprite pentru a evita costurile.')
  :result?.status==='quota_exceeded'||result?.status==='access_denied'
  ?(en?'The national provider is temporarily unavailable or has restricted access. This does not mean there is no transport.':'Furnizorul național este momentan indisponibil sau a limitat accesul. Asta nu înseamnă că nu există transport.')
  :result?.status==='domestic_route_unverified'
  ?(en?'Could not verify that every returned stop is in your GPS country. Itineraries with foreign or unverified stops are not shown.':'Nu am putut verifica dacă toate stațiile traseului sunt în țara GPS. Nu afișez varianta cu stații din afara țării sau neverificate.')
  :(en?'Could not verify an itinerary for this place and departure time. This does not prove that no service exists.':'Nu am putut verifica un itinerar pentru acest loc și moment de plecare. Asta nu dovedește că nu există curse.');
 const reply=journeys.length
  ?(en?'Domestic public transport · ':'Transport public național · ')+country+' → '+destination.label+'\n'+description+'\n\n'+
   (en?'Source: ':'Sursa: ')+provider+'. '+
   (journeys.some(indicative)?(en?'Indicative route; the timetable cannot be guaranteed. Confirm with the operator.':'Traseu orientativ; orarul nu poate fi garantat. Verifică la operator.')+' ':'')+
   (en?'Times only where supplied by the provider; live updates only where explicitly supplied. Walking access and transfers need separate navigation checks.':
    'Ore numai unde sunt furnizate de operator; actualizări în timp real numai unde sunt furnizate explicit. Accesul pietonal și transferurile necesită verificare separată pentru navigare.')+
   '\n'+[...new Set(journeys.map(j=>transportNoticeLine(j,language)))].join('\n')+'\n'+[...new Set(journeys.map(j=>j.attribution?.text).filter(Boolean))].join('\n')
  :unavailable;
 return {reply,national_public_transport:true,country_code:country,mixed_journey:false,international_journey:false,
  transit_available:journeys.length>0,route_available:false,route_geometry_available:false,transit_geometry_available:false,
  transit:journeys,fastest_transit:journeys[0]||null,transit_provider:provider,source:provider,
  reason:journeys.length?'national_itineraries_found':result?.status||'provider_unavailable',
  transit_destination_point:{latitude:destination.latitude,longitude:destination.longitude,label:destination.label},
  transit_departure_at:departureAt||null,provider_status:{national:result?.status||'provider_unavailable',...(result?.source_status||{})}};
}
