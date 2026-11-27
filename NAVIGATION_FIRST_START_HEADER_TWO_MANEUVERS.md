# Phone follow-up: first-start map height, fixed commands, two maneuvers

## Physical feedback

APK501892 appearance was received positively ("arată mult mai bine"), but the user supplied three phone screenshots showing that navigation first opens with only a short map and a large empty area. Stopping/restarting gives the expected large map. They requested commands in a fixed header above the map, not over it, and two distinct bottom rows: first upcoming maneuver highlighted and the following itinerary maneuver.

This is partial appearance acceptance, NOT acceptance of uninterrupted background GPS or complete transit phase tracking.

## Confirmed source cause and correction

`openTransitJourneyMap` set an inline `height:clamp(165px,28dvh,300px)!important` on the map host. That defeats even the navigation stylesheet's `height:100%!important`. The Stop handler removed the inline height, explaining why a second start appeared to fix the map. Removed this conflicting inline sizing; shared CSS owns both preview and navigation sizes.

Leaflet also caches its viewport independently of CSS. Added post-layout requestAnimationFrame synchronization and a ResizeObserver on the actual map host. They invalidate Leaflet's size after mode/control/viewport changes and preserve GPS following. Closing the map disconnects the observer and cancels outstanding frames. This does not start navigation twice or trigger a search.

## Requested presentation

- Navigation uses a fixed, non-scrolling grid: header, commands, map taking all remaining space, bottom maneuver panel. Navigation/recenter/stop commands are above the map, no overlap. Preview retains its smaller map and full static directions.
- First bottom row shows the upcoming maneuver with distance, bold text, a contrasting background and cyan leading border. Second row shows `Apoi:` plus the following instruction from the same verified leg. Each is a single visible row, with ellipsis for unusually long text and full text retained in DOM/title/accessibility. No invented next instruction when none exists.
- Both rows update from the same GPS projection. Poor/stale/off-route GPS clears both old instructions in favor of status text. Arrival and end-of-leg states do not claim another maneuver.
- Existing native Android service/snapshot protocol and route providers are unchanged. No claim of complete chronological boarding/alighting detection or physically verified background survival.

## Verification

- Upgraded `tests_route_navigation_browser.mjs` from mocked maps to **real Leaflet1.9.4 and the real rotation plugin0.3.0**, served locally. Tiles are synthetic SVGs and GPS/native service are controlled adapters; no live provider traffic.
- At 360x640,393x817,430x932,640x360: first-start walk/drive/transit map fills exactly the space between commands and bottom panel; no empty gap, no header/control overlap; Leaflet's cached pixel size equals the actual container; real tiles load. Includes live rotation to landscape and back, stop/preview reset, saved-session restoration without native restart/search, GPS progress/warnings and both maneuvers/highlight.
- Negative control against the previous compiled APK501892 UI fails the new header/no-overlap assertion.
- Fault injection restoring the old important inline map height fails the new no-empty-space assertion on the FIRST transit start. This directly reproduces the reported source defect.
- Model tests cover following maneuver, no-next-step, and no leaked following instruction with poor GPS.
- Source and Wrangler-compiled navigation suite PASS; serialized-browser-name guard PASS6,892,447chars. Compiled continuous-transit viewport and >8s walking parity suites PASS. Boot, native resume/full-journey, heading, syntax, Android UI preview and diff checks PASS.
- Signed APK workflow installs Leaflet/rotation as test-only packages and runs the real-renderer suite before signing. These are not application runtime dependencies or a production deployment.

## Delivery

**Signed APK501893 published.**

- Source `245ee23d27e28de56330e2513eab22220a7cd0ba`.
- Run `45977801782`, signed job `140433827291`: SUCCESS; debug skipped. New model and compiled real-Leaflet navigation suite, walking/input/viewport gates, permanent certificate, package identity, versionCode and UI snapshot gates PASS in CI.
- Download: https://github.com/kokocf-ui/myPocketAi/releases/download/education-test-45977801782/myPocketAI-signed-education-test.apk
- Release `460421031`, asset `799923741`, 77,662,548 bytes.
- SHA256 from GitHub asset metadata: `2cfeb98b71fca6f9e6c722b6381b95cbaffd480ef362bfdd016adbe14f799675`. No independent local APK inspection claimed.
- Install over the existing app without uninstalling or deleting data. Phone first-start appearance/GPS acceptance is pending.
- Final transit audit and reported-failure browser regressions PASS; compiled Education input/handwriting-removal regression PASS.

No backend or production frontend deploy, main merge, HERE/paid activation or Oracle changes.
