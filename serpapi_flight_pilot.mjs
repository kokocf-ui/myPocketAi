// Optional, no-spend flight DISCOVERY pilot for myPocketAI.
// SerpApi Google Flights is a third-party Google results parser, not a direct
// airline schedule or Omio Meta Search feed. Never present its local clock
// values as offset-aware, bookable, or complete door-to-door itinerary legs.
// This module is deliberately unconnected to production routing until terms,
// provider reliability and the licensed end-to-end integration are reviewed.
const iata = value => /^[A-Z]{3}$/.test(String(value || '').trim().toUpperCase());
const codes = values => [...new Set((Array.isArray(values) ? values : [])
  .map(v => String(v || '').trim().toUpperCase()).filter(iata))].slice(0, 6);
const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const localTime = value => {
  const v = String(value || '').trim();
  if (!/^\d{4}-\d{2}-\d{2} [0-2]\d:[0-5]\d$/.test(v)) return null;
  const [d, t] = v.split(' ');
  const h = Number(t.slice(0,2));
  const stamp = Date.parse(`${d}T00:00:00Z`);
  if (h > 23 || !Number.isFinite(stamp) || new Date(stamp).toISOString().slice(0,10) !== d) return null;
  return v;
};
const safeText = (v, cap = 100) => String(v ?? '').trim().slice(0, cap);

export function normalizeFlightSearchResults(payload, {currency = 'GBP', date, max = 20} = {}) {
  if (!payload || typeof payload !== 'object' || !datePattern.test(String(date || '')))
    return [];
  const items = [
    ...(Array.isArray(payload.best_flights) ? payload.best_flights : []),
    ...(Array.isArray(payload.other_flights) ? payload.other_flights : [])
  ];
  const normalized = [], seen = new Set();
  for (const group of items.slice(0, 100)) {
    const segments = Array.isArray(group?.flights) ? group.flights : [];
    if (!segments.length || segments.length > 5) continue;
    const legs = [];
    let usable = true;
    for (const flight of segments) {
      const from = safeText(flight?.departure_airport?.id).toUpperCase();
      const to = safeText(flight?.arrival_airport?.id).toUpperCase();
      const startLocal = localTime(flight?.departure_airport?.time);
      const endLocal = localTime(flight?.arrival_airport?.time);
      if (!iata(from) || !iata(to) || from === to || !startLocal || !endLocal ||
          (legs.length && legs.at(-1).to !== from)) {usable = false; break;}
      legs.push({mode:'flight',from,to,startLocal,endLocal,
        airline:safeText(flight?.airline),flightNumber:safeText(flight?.flight_number,30),
        // Local airport clocks are NOT ISO instants; we must resolve each
        // airport's IANA timezone and DST before graph composition.
        timezoneVerified:false,absoluteTimeVerified:false});
    }
    if (!usable || legs[0].startLocal.slice(0,10) !== date) continue;
    const signature = legs.map(l => [l.from,l.to,l.startLocal,l.flightNumber].join(':')).join('|');
    if (seen.has(signature)) continue;
    seen.add(signature);
    const price = Number(group.price);
    const fareObserved = group.price !== null && group.price !== undefined &&
      Number.isFinite(price) && price > 0 && /^[A-Z]{3}$/.test(currency)
      ? {amount:price,currency,indicative:true,bookable:false,confirmed:false} : null;
    normalized.push({source:'SerpApi / Google Flights',sourceType:'third_party_search_results',
      status:'candidate_only',verified:false,completeDoorToDoor:false,
      legs,from:legs[0].from,to:legs.at(-1).to,
      fareObserved,totalFlightDurationMinutes:Number.isFinite(Number(group.total_duration))
        ? Math.max(0,Math.round(Number(group.total_duration))):null,
      checkedDate:date,checkedAt:null,bookingVerified:false});
    if (normalized.length >= Math.max(1,Math.min(40,Number(max)||20))) break;
  }
  return normalized;
}

export function prepareSerpApiFlightSearch({departureAirports,arrivalAirports,outboundDate,currency='GBP'}={}) {
  const origin = codes(departureAirports),dest = codes(arrivalAirports);
  if (!origin.length || !dest.length || !datePattern.test(String(outboundDate||'')) ||
      !Number.isFinite(Date.parse(`${outboundDate}T00:00:00Z`)) ||
      !/^[A-Z]{3}$/.test(currency)) return null;
  const u = new URL('https://serpapi.com/search.json');
  // SerpApi supports multiple IATA origins and destinations in a SINGLE search.
  u.searchParams.set('engine','google_flights');u.searchParams.set('type','2');
  u.searchParams.set('departure_id',origin.join(','));
  u.searchParams.set('arrival_id',dest.join(','));
  u.searchParams.set('outbound_date',outboundDate);
  u.searchParams.set('currency',currency);u.searchParams.set('hl','en');
  return u;
}

// Do not auto-spend anything: only run with explicit flags and a FREE SerpApi
// account verified on each request via the no-cost account endpoint.
export async function searchSerpApiFreeFlights(env,params,{fetcher=fetch}={}) {
  if (env?.SERPAPI_FLIGHTS_PILOT_ENABLED !== 'true' ||
      env?.SERPAPI_FLIGHTS_TERMS_REVIEWED !== 'true' || params?.userInitiated !== true)
    return {status:'disabled',candidates:[]};
  const key = String(env?.SERPAPI_API_KEY || '').trim();
  if (!key) return {status:'no_free_key',candidates:[]};
  const url = prepareSerpApiFlightSearch(params);
  if (!url) return {status:'invalid_request',candidates:[]};
  try {
    const quotaUrl = new URL('https://serpapi.com/account.json');
    quotaUrl.searchParams.set('api_key',key);
    const quotaResponse = await fetcher(quotaUrl,{signal:AbortSignal.timeout(7000)});
    if (!quotaResponse.ok) return {status:'quota_check_failed',candidates:[]};
    const quota = await quotaResponse.json();
    // A paid subscription or insufficient quota must never be silently used.
    if ((typeof quota?.plan_monthly_price !== 'number' && typeof quota?.plan_monthly_price !== 'string') ||
        Number(quota?.plan_monthly_price) !== 0 ||
        Number(quota?.total_searches_left ?? quota?.plan_searches_left) < 1 ||
        !Number.isFinite(Number(quota?.total_searches_left ?? quota?.plan_searches_left)))
      return {status:'free_quota_not_confirmed',candidates:[]};
    url.searchParams.set('api_key',key);
    const response = await fetcher(url,{signal:AbortSignal.timeout(20000)});
    if (!response.ok) return {status:'search_http_'+response.status,candidates:[]};
    const payload = await response.json();
    if (payload.error || payload.search_metadata?.status==='Error')
      return {status:'provider_error',candidates:[]};
    return {status:'candidate_results_only',
      candidates:normalizeFlightSearchResults(payload,{currency:params.currency||'GBP',date:params.outboundDate}),
      searchedAirports:{departure:codes(params.departureAirports),arrival:codes(params.arrivalAirports)},
      // The provider has not given unambiguous airport-local UTC offsets.
      requiresTimezoneAndTransferVerification:true,
      directBookingAvailable:false,
      freeQuotaChecked:true,
      searchCostEstimate:0};
  } catch {return {status:'provider_unavailable',candidates:[]};}
}
