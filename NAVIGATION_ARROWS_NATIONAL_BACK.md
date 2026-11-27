# Phone follow-up to APK501893: clean search and maneuver arrows

## Request and implementation

The user reports a substantially improved layout, but returning from national
transit alternatives restores the old confirmed destination. They request arrows
beside the bottom instructions and in a semitransparent map-corner box.

- Results Back previously passed `state.lastTransitChoice` to the national form,
  which deliberately restores an explicitly provided destination. Now results
  Back starts a clean national choice, clears the previous destination/departure,
  response and route context, cancels access/refresh work and invalidates request
  generations. Android Back uses the same results toolbar handler.
- Calendar Back still preserves the destination: it is editing the same search,
  not starting another one. Country is verified again for a new national search.
- Both bottom maneuver rows show symbols from provider maneuver type or instruction
  text. Unknown instructions use a neutral bullet, not an invented straight arrow.
- Navigation adds a fixed bottom-right map badge (58% opaque dark background),
  displaying the imminent direction and distance in metres. It is independent of
  Leaflet map rotation, does not consume touches, and is hidden in static preview.
  Poor/stale GPS, off-route position and arrival remove the old arrow. Starting
  again clears it until a new GPS position is confirmed.
- Existing first-start full-height map, fixed commands above map, highlighted
  imminent row, following row, compact preview and continuous itinerary retained.
  Native service/provider protocol unchanged. No background or chronological
  boarding/alighting acceptance is inferred from these presentation changes.

## Verification

- Model symbols/next-step/distance/accuracy checks; generated browser boot syntax;
  national/mixed calendar entry points; native full-journey and saved-session tests PASS.
- Source and Wrangler-compiled real Leaflet1.9.4/rotation0.3.0 navigation suite PASS
  at four phone/landscape viewports: arrow text, badge position within map,
  semitransparency, GPS guards, first-start geometry, Stop/restart/snapshot resume.
  Local synthetic tiles and controlled GPS/native adapters, not live phone GPS.
- New `tests_national_transit_back_browser.mjs` PASS source and compiled: calendar
  Back retains selection; alternatives toolbar and real Android JS bridge Back
  clear destination/date/context/results and do not repeat the old route query.
  Country/GPS are controlled. Added compiled test to the signed APK workflow.
- Compiled country coverage, transit viewport, walking parity and Education input
  regressions PASS. Browser-name guard PASS (6,896,189 characters).
- Wrangler used in dry-run mode only, no deployment. No HERE or paid/provider calls.

## Delivery

Signed branch-test APK pending; last published is APK501893. Physical verification
of new arrows and clean search, as well as background GPS, remains required.
