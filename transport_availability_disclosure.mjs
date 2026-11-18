// Surface itinerary pricing and seat uncertainty without inventing a fare or a booking.
// Provider-specific fare fields are populated only by existing validated adapters.
const RO = lang => lang !== 'en';
const number = v => typeof v === 'number' && Number.isFinite(v) && v >= 0;
const reservationMode = /(?:train|rail|coach|flixbus|airplane|flight|plane|ferry|autocar|tren|avion|feribot)/i;

export function transportAvailabilityDisclosure(journey, language='ro') {
  const j=journey && typeof journey === 'object' ? journey : {};
  const provider=String(j.provider||j.source||'').trim();
  const isTfl=/^tfl$|transport for london/i.test(provider);
  const legs=Array.isArray(j.legs)?j.legs:[];
  // A documented route can still help the passenger when its timetable is
  // unavailable or only indicative. Never turn such a route into a confirmed
  // dated connection, but do not silently discard it from a route overview.
  const scheduleStatus=String(j.schedule_status||'').toLowerCase();
  const routeOnly=j.route_only===true||scheduleStatus==='unavailable';
  const indicative=routeOnly||['indicative','estimated','unconfirmed'].includes(scheduleStatus);
  const timetableMessage=indicative?(RO(language)
    ?'Traseu orientativ. Orarul nu este confirmat; verifică zilele și orele direct la operator.'
    :'Indicative route. Timetable not confirmed; check operating days and times with the operator.'):null;
  const reserveRelevant=!isTfl && legs.some(l=>reservationMode.test(
    [l?.mode,l?.operator,...(Array.isArray(l?.lineNames)?l.lineNames:[])].join(' ')
  ));
  const fareGBP=number(j.fareGBP)?j.fareGBP:null;
  const fareLocal=j.fareLocal && typeof j.fareLocal==='object' && number(j.fareLocal.amount) &&
    /^[A-Z]{3}$/.test(j.fareLocal.currency||'') ? j.fareLocal:null;
  const hasFare=fareGBP!==null || !!fareLocal;
  // Source-attributed ranges are useful even without a confirmed departure.
  // An unsourced number is not a price estimate and must not be surfaced.
  const estimate=j.fareRange||j.fareEstimateRange||null;
  const minimum=Number(estimate?.min??estimate?.minimum);
  const maximum=Number(estimate?.max??estimate?.maximum);
  const range=estimate?.source&&(estimate.min??estimate.minimum)!=null&&
    (estimate.max??estimate.maximum)!=null&&Number.isFinite(minimum)&&
    Number.isFinite(maximum)&&minimum>=0&&maximum>=minimum&&maximum<=100000&&
    /^[A-Z]{3}$/.test(String(estimate.currency||'').toUpperCase())
    ?{min:minimum,max:maximum,currency:String(estimate.currency).toUpperCase(),
      source:String(estimate.source).slice(0,100)}:null;
  // A leg fare is not necessarily the complete ticket price.
  const partialFare=hasFare && j.fareComplete===false;
  const fareStatus=range?'indicative_range':!hasFare?'unavailable':partialFare?'partial':'published_unverified';
  const seatStatus=reserveRelevant?'unverified':'not_applicable';
  const fareMessage=range
    ?(RO(language)?'Cost estimativ: ':'Estimated cost: ')+
      range.min+'–'+range.max+' '+range.currency+
      (RO(language)?'. Verifică tariful la operator.':'. Check the fare with the operator.')
    :!hasFare
    ? RO(language)?'Preț indisponibil în Eva. Verifică tariful la operator.':'Fare unavailable in Eva. Check the operator fare.'
    : partialFare
    ? RO(language)?'Tarif parțial/indicativ; prețul total nu este confirmat.':'Partial/indicative fare; total price is not confirmed.'
    : RO(language)?'Tarif publicat de sursă; verifică înainte de cumpărare.':'Provider-published fare; verify before purchase.';
  const seatMessage=reserveRelevant
    ?RO(language)?'Pentru locuri și bilete, consultă operatorul. Eva nu efectuează rezervări.':
      'For seats and tickets, consult the operator. Eva does not take bookings.'
    :null;
  return {fare_status:fareStatus,seat_status:seatStatus,fare_message:fareMessage,seat_message:seatMessage,
    timetable_status:indicative?'indicative':'provider_timetable',timetable_message:timetableMessage};
}

export function annotateTransportJourneys(journeys, language='ro'){
  return (Array.isArray(journeys)?journeys:[]).map(j=>({
    ...j,availability_disclosure:transportAvailabilityDisclosure(j,language)
  }));
}

export function transportNoticeLine(journey,language='ro'){
  const d=transportAvailabilityDisclosure(journey,language);
  return [d.timetable_message,d.fare_message,d.seat_message].filter(Boolean).join(' ');
}
