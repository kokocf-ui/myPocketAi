# No-spend experimental flight discovery for Eva

Purpose: provide a possible **zero-subscription-cost technical pilot**, NOT a
production-ready licensed flight inventory or complete A-to-B journey planner.

## Provider research (17 November 2026)

- SerpApi offers 250 successful searches per month on its $0 Free plan.
  Google Flights results can include flights, airline, local airport clocks,
  price snapshots, airport codes and total flight durations.
  API reference: https://serpapi.com/google-flights-api
  Pricing: https://serpapi.com/pricing
- One SerpApi query accepts multiple comma-separated IATA departure and arrival
  airport codes. Feed codes that the *generic geographical airport discoverer*
  found, not any user-example airport constants.
- SerpApi parses Google results; it is not the Google Flights official partner
  API. Review legal, reliability, permitted downstream display and attribution.
  As of 13 November 2026 SerpApi reported intermittent missing booking options:
  https://status.serpapi.com/
- Alternative: FlightAPI.io offers 30 trial credits (not a permanent free tier).
  Skyscanner flights API is free only for commercially approved partners; its
  current criteria include 100K MAU. Kiwi/Aviasales flight search currently
  requires 50K MAU. Do not treat those feeds as available by default.

## Safe pilot contract

`serpapi_flight_pilot.mjs` is an isolated module with no production import,
scheduled task, Cloudflare binding or automatic HTTP call.

To evaluate later, an authorized maintainer must intentionally provide:

1. Cloudflare Worker secret `SERPAPI_API_KEY` belonging to the **Free** plan.
2. `SERPAPI_FLIGHTS_PILOT_ENABLED=true` only for a controlled tester.
3. `SERPAPI_FLIGHTS_TERMS_REVIEWED=true` only after approval of commercial and
   downstream data usage terms.
4. Explicit user-initiated one-way flight search with selected date and
   geographically discovered IATA airport candidates.

The module checks SerpApi's free `account.json` endpoint before every actual
search. If price is nonzero, remaining quota is unknown or depleted, or the
account check fails, it does **not** send a Google Flights API query.
The module submits at most **one** multi-airport search for one call.
The current free limit is not enough for unbounded public app usage.
Use a server-side per-user rate limiter and persistent quota cache if adding
any public HTTP route later.

The provider returns flight-departure and arrival LOCAL times without
unambiguous time-zone offsets. This adapter deliberately reports results as
`candidate_only`, `verified:false`, `completeDoorToDoor:false`,
`bookingVerified:false` and `timezoneVerified:false`; no output is eligible
as a verified timetable leg for `composeVerifiedMixedItineraries`.
Only after reliable IANA airport time-zone resolution (with DST handling),
supplier permissions, revalidation, airport access/egress verification and
proper connection timings may a flight form part of a complete itinerary.

Price snapshots are indicative; the pilot does not book tickets or assert a
final buyable fare.

## Tests

```sh
node tests_serpapi_flight_pilot.mjs
node tests_verified_multimodal_itineraries.mjs
node tests_mixed_airport_discovery.mjs
```

No API key or live call is needed to run these tests.
