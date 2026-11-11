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
  const reserveRelevant=!isTfl && legs.some(l=>reservationMode.test(
    [l?.mode,l?.operator,...(Array.isArray(l?.lineNames)?l.lineNames:[])].join(' ')
  ));
  const fareGBP=number(j.fareGBP)?j.fareGBP:null;
  const fareLocal=j.fareLocal && typeof j.fareLocal==='object' && number(j.fareLocal.amount) &&
    /^[A-Z]{3}$/.test(j.fareLocal.currency||'') ? j.fareLocal:null;
  const hasFare=fareGBP!==null || !!fareLocal;
  // A leg fare is not necessarily the complete ticket price.
  const partialFare=hasFare && j.fareComplete===false;
  const fareStatus=!hasFare?'unavailable':partialFare?'partial':'published_unverified';
  const seatStatus=reserveRelevant?'unverified':'not_applicable';
  const fareMessage= !hasFare
    ? RO(language)?'Preț indisponibil în Eva. Verifică tariful la operator.':'Fare unavailable in Eva. Check the operator fare.'
    : partialFare
    ? RO(language)?'Tarif parțial/indicativ; prețul total nu este confirmat.':'Partial/indicative fare; total price is not confirmed.'
    : RO(language)?'Tarif publicat de sursă; verifică înainte de cumpărare.':'Provider-published fare; verify before purchase.';
  const seatMessage=reserveRelevant
    ?RO(language)?'Disponibilitatea locurilor nu poate fi confirmată; verifică rezervarea la operator.':'Seat availability cannot be confirmed; check reservations with the operator.'
    :null;
  return {fare_status:fareStatus,seat_status:seatStatus,fare_message:fareMessage,seat_message:seatMessage};
}

export function annotateTransportJourneys(journeys, language='ro'){
  return (Array.isArray(journeys)?journeys:[]).map(j=>({
    ...j,availability_disclosure:transportAvailabilityDisclosure(j,language)
  }));
}

export function transportNoticeLine(journey,language='ro'){
  const d=transportAvailabilityDisclosure(journey,language);
  return [d.fare_message,d.seat_message].filter(Boolean).join(' ');
}
