# Compact previews and live GPS maneuver view

## User-approved scope

The user chose the earlier simple arrangement: one map with all directions underneath, not one page per public-transport stage. The map must be compact outside navigation. Only navigation should fill the screen, except one/two lines for the next maneuver. Preview directions must remain static; GPS progression belongs only to active navigation.

This supersedes the previous no-vertical-scrolling interpretation for itinerary details. The application window remains contained; the directions panel scrolls internally to expose the complete list.

## Implementation

- `route_navigation_ui.mjs`: shared preview/navigation CSS and pure GPS maneuver model. Preview map is about 24dvh (capped at 220px and 28dvh); remaining panel shows complete directions. Walking, driving and public-transport maps use this presentation.
- Public transport now mounts the actual full itinerary in one continuous directions panel. Removed stage pager/template clones from the selected journey, retaining the existing alternative-options pager and Romanian categories, fares, operators, notices and ticket links. Verified walking legs include their street instructions under their stage.
- Active navigation maps cover the full application viewport. Small controls overlay the map; the full list/status paragraphs are hidden only while navigating. A bottom strip shows at most two lines for the next maneuver.
- GPS projection along verified route geometry is scaled to the provider's route distance; successive step distances locate the next maneuver. The strip updates its distance/instruction and the underlying standalone list tracks current/completed steps only while navigating. Stop clears progress markers and restores the compact static preview.
- Accuracy over 35m, stale/invalid fixes, location errors and off-route positions replace the previous turn with a warning. A 20-second no-fix timer prevents a stale instruction remaining on screen. Arrival requires both <=18m remaining and <=15m GPS accuracy. No invented turns, paid rerouting or automatic new route search.
- Existing native foreground service and saved route snapshots are unchanged. Resume restores the selected route/navigation, then computes the displayed maneuver from fresh GPS, without restarting the native service or searching again. This does NOT implement complete chronological transit boarding/alighting detection or guarantee uninterrupted physical background operation.
- The daily-quote banner is suppressed while a route map is open, so it cannot intercept navigation controls.

## Verification

PASS source and compiled bundle:
- `tests_route_navigation_ui.mjs`: next maneuver/progression/distances, arrival, poor GPS/off-route/invalid data.
- `tests_route_navigation_browser.mjs`: actual walking/driving/transit UI, controlled GPS/map/native adapters; 360x640, 393x817, 430x932 and landscape640x360. Compact preview and readable direction space, static preview list, full-viewport map, two-line strip, successive maneuvers, progress markers, bad/stale/off-route GPS, stop/reset, native snapshot restore without a second Start/search, saved transit walking instructions and no duplicate initial leg.
- Updated `tests_transit_viewport_browser.mjs`: complete 13-stage itinerary in one list, full long names/tickets, bounded root, scrollable details only, controls/Start/Stop/Back/rotation and Romanian categories/fares/localities/operators.
- Updated walking parity/reported-failure browser selectors for visible continuous details. >8s response, alternate-endpoint matching, missed-departure geometry preservation and cancellation remain covered.
- Existing transit audit, full-journey/native restore, heading/fullscreen, route choices, input-tools, frontend boot, Android preview and mixed-orientation regressions.
- Wrangler frontend dry-run + serialized browser-name guard: 6,888,889 chars. No renamed serialized browser functions.

The signed APK workflow now also runs the new model and compiled navigation browser suite before signing. This is automated/synthetic GPS evidence, not a physical moving-phone/background acceptance claim. No production frontend/backend deployment, main merge, HERE/paid activation or Oracle changes.

## Delivery

Signed branch-test APK pending at source checkpoint. Record run/source/version/asset here after publication.
