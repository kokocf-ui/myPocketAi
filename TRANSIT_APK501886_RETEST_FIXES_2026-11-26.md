# Physical APK 501886 retest — latency, readable details and mixed Back

## Status

Changes in this report are **branch-only**, not deployed and not in APK 501886.
Production remains backend v186 / signed test APK 501886. No new APK has been
published in this correction pass; PR 558 remains draft/unmerged.

The owner's nine screenshots (19:20–19:26 UTC on 2026-11-26) are physical
observations, not fixtures. They show:

- Grays → Victoria alternatives with departure/arrival times. Opening option 1
  sometimes succeeds and sometimes shows a failed pedestrian check; option 3
  also shows the pedestrian failure. The screenshot does not establish that
  the leg table is absent from the DOM: it is below the visible actions.
- Mixed GPS → Oradea, requested 2026-12-04 04:00: two candidate flight cards,
  LTN → DEB (61 GBP observed) and STN → CLJ (81 GBP observed), plus a search
  query-budget warning. These are not confirmed bookings or proof that all
  nearby airport pairs were checked.
- The first candidate's details show 06:05 → 09:45 local flight times and
  missing access/egress. The owner could not exit the details screen.

Attachment names: Screenshot_20261126_{192052,192243,192247,192328,192412,
192542,192559,192604,192610}_ai_mypocket_mobile_MainActivity.jpg. Originals
remain in the private attachment directory; no screenshot copies were added.

## Root causes found in code

1. Local selection waited for a second walking API call (up to 25 seconds),
   then automatically opened the entire map, adding further enrichment work.
   The previously supplied timetable was not rendered at click time.
2. The TfL adapter could spend sequential timeout windows on preferences and
   wait for a slow optional bus query despite already having usable routes.
3. After TfL, the quick search could wait on unrelated BODS live-vehicle
   context (12 seconds) and RTT capability/location lookups (10 + 10 seconds).
   These are not necessary to display a returned itinerary. These numbers are
   configured worst-case waits, **not measured device latency**.
4. Mixed details did not reset list scroll, did not pin Back, and did not use
   the toolbar selector that Android Back dispatches through. Flex children
   could shrink in the shared place-results container. A daily quote banner
   could additionally intercept Back taps; a browser regression exposed it.
5. Initial flight detail enrichment rediscovered airports. Its outer 8.5s
   Promise.race could discard successful ground evidence because the other
   side or one access-time sample was still waiting. UI showed generic gaps
   despite more specific source diagnostics.

## Corrections

- Render source-backed local details synchronously, before the pedestrian
  request. Walking is background enrichment, bounded to 8 seconds. Success
  updates details without opening a map automatically; explicit map/navigation
  controls remain available. Failure cannot remove timetable details.
- Preserve reader scroll on background completion. Back cancels/stales the
  pedestrian operation; a late reply cannot reopen a selected itinerary.
- Put leg details before the error/refresh area; final-walk action stays ahead
  of the long leg table. Use non-shrinking transit document children.
- Mixed details reset scroll and use a sticky Back toolbar recognized by native
  Android Back. Hide the unrelated daily-quote overlay while transit is open.
- Share one total TfL adapter deadline (12 seconds). Once primary routes exist,
  optional preferences/bus diversity have at most another 1.8 seconds within
  that total. Keep results already received and abort pending adapter requests.
  Destination resolution and missing stop-coordinate lookup are separate:
  this is **not a promise of an end-to-end 12-second app search**.
- Quick itinerary requests skip BODS/RTT checks even if keys exist. Legacy
  conversational context and explicit live-feed opt-in remain; skipped sources
  are disclosed as `not_requested_for_itinerary`, not claimed as checked.
- Reuse the initial geographic airport evidence. Ground enrichment has a
  7.5-second shared per-candidate deadline inside the existing 8.5-second outer
  safety bound. Access and egress are retained independently; a successful
  access sample survives another sample timing out. Propagate cancellation
  into UK access, timezone, geographic discovery and MOTIS requests. Regional
  provider calls are deadline-guarded; an adapter ignoring the passed signal
  can still finish its already-started request under its own timeout.
- Explain `no_connection_before_boarding`, missing provider configuration and
  timeout separately. A requested 04:00 start and 06:05 Luton flight leave
  until 04:35 under the current 90-minute boarding buffer. This arithmetic
  **does not prove no suitable connection exists**. The planner must supply
  the evidence; no earlier departure or fabricated transfer is inserted.

## Verification performed (all offline/synthetic)

PASS:

- `npm run test:transit-audit`, including `tests_transit_latency_partial.mjs`.
- `npm run test:national-transport` and `npm run test:mixed-orientation`.
- `node tests_mixed_flight_ground_connections.mjs` and
  `node tests_mixed_fixed_point_access.mjs`.
- `npm run check`, `tests_frontend_boot_syntax.mjs`,
  `tests_victoria_underground_and_colors.mjs`.
- Browser regressions at 360, 393 and 430 pixels: pending walking request
  does not delay details; failure/success/cancellation paths; all three walking
  legs on map; flight selected from the bottom of a scrolled list; sticky Back
  reachable at bottom; native Back restores all flight cards; diagnostic text.
- Existing mixed-orientation browser suite at 360/393/430.
- Frontend/backend Wrangler **dry runs only**, plus bundled browser-name check.

The regression now intercepts same-origin POSTs as well as external POSTs:
previous browser routing could return the local HTML fixture to a relative API
request, accidentally testing a JSON parse failure instead of a real HTTP 503.
New tests hold the POST pending, then release an actual mocked 503 or 200.

No live provider searches, flights, HERE requests, paid services, frontend
production publication, main merge or Oracle changes in this pass. HERE stays
explicitly OFF; cumulative agent HERE usage remains 0 / maximum 2 total.

## Still unverified / not solved by these changes

- Physical APK retest after these corrections (requires another signed build).
- Actual live latency, pedestrian route availability and local option 3.
- Whether a provider can supply a valid Grays → Luton connection for the
  selected 04:00 start, or Debrecen → the exact Oradea house on that date.
- Complete end-to-end mixed transport. Better diagnostics and preserved partial
  evidence must not be reported as newly verified ground connections.
- All nearby airport/date combinations, actual fares/availability at booking,
  and provider coverage outside the already enabled geographical scope.
