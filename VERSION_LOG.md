# Version log

## 2026-10-28 — Frontend v1.0.33 + backend v89
- Corrected frontend `APP.version` from 1.0.32 to 1.0.33.
- Kept `CLIENT_CONFIG.version` at 1.0.33.
- Kept the known existing backend endpoint `https://lifewise-ai-api.kokocf.workers.dev/api/chat`; no speculative endpoint change.
- Preserved backend v89 source unchanged.
- Added explicit Wrangler configurations for the existing frontend and backend Worker names.


## 2026-10-28 — Frontend v1.0.34 + backend v90 (prepared replacement)
- Frontend: results panel fills the available mobile sheet; result list scrolls independently; added layered gradients, inset highlights, and depth/pressed states to the results surface and controls.
- Backend: added a distinct `pub` search category ahead of the general restaurant category; separated Geoapify category classification and Photon filtering so pub/bar/biergarten results are not intentionally mixed into restaurant searches.
- Preserved API endpoint, GPS payload handling, 5 km radius, routing, and existing provider architecture.
- Validation: syntax checks and static checks performed before packaging. Live provider result quality and Cloudflare deployment still require runtime testing.

## 2026-10-30 — Backend v96 + Frontend 1.0.48
- Rebuilt from the latest `main` branch snapshot fetched directly from GitHub; version numbers in previous README files were not used as source-of-truth.
- Backend: parallel Exa, Brave Search and Tavily adapters using `EXA_API_KEY`, `BRAVE_API_KEY`, and `TAVILY_API_KEY`.
- Provider failures are isolated; successful providers continue to contribute results.
- Canonical URL deduplication removes common tracking parameters; excerpts and provider provenance are merged.
- Added per-provider diagnostics to `web_search_diagnostics.providers`.
- Strengthened grounding instructions for jurisdiction, official primary sources, publication dates and limitations of search snippets.
- Frontend: version identifiers only updated to 1.0.48; no UI or behavior changes.
- README_RO.md, README_ROMANA.txt and VALIDATION.txt rewritten to match the actual delivered code and exact upload list.
- Automated mock tests and syntax checks pass; live Cloudflare API validation remains pending deployment.

## 2026-10-31 — Backend v108 + frontend 1.0.77
- Dedicated Open-Meteo forecasts; replace city on follow-ups and preserve day, never infer temperatures with the language model.
- Weather context survives client history truncation, clears with new conversations/topics and is restored with archived chats.
- Validate dates, timezones, units, missing/null values and provider failures. Source attribution and retrieval time included.
- Merge repeated Paris settlement labels with equivalent administrative tokens while retaining geographically distinct towns.
- Add missing tests_reader.mjs and new tests_weather.mjs to match npm test; include README.md and synchronized Romanian documentation.
- Validation: automated mocked backend/client regression tests and syntax checks pass. Live Open-Meteo HTTP 200 verified. Physical phone QA remains pending.

## 2026-10-31 — Backend v109 + frontend 1.0.78
- Based on GitHub main 3531b287807da5f0b5bdef136c2f740f98048e1f, matching v108/1.0.77 source hashes.
- Unified pedestrian quick/chat intent; GPS confirmation resumes a pending route. Recover route intent from user history without assistant geography.
- Local name/category search for unqualified shopping centres before constrained geocoding; explicit country retains worldwide lookup.
- Provider street instructions with map, exact selected hotel coordinates, and user-activated Google Maps navigation links.
- Backend module recommendation and frontend handoff preserve conversation, GPS and generation without reset/archive.
- Preserve v108 weather behavior. Add missing client/weather tests plus route regressions; update documentation.
- Validation: mocked backend/DOM regression suites and generated client syntax pass. Real Geoapify responses and phone navigation still require post-deployment verification.

## 2026-10-31 — Backend v110 + frontend 1.0.79
- Based on GitHub main e718d609971995e7393661eaf8d8dd661eb31da5, matching uploaded v109 source hashes.
- Normalize metric unit casing instead of rejecting valid provider-style distance_units: meters.
- Preserve retry context after route errors; full destination clarifications replace repeated names and do not fall through to the LLM.
- Separate trailing town qualifiers from shopping-centre name validation. Handle legacy pending:null route contexts.
- Add controlled route diagnostics and regression fixtures for lowercase/uppercase metric units, incompatible units, and failure -> destination clarification -> retry.
- Existing weather, place, GPS, client, navigation-link and module-handoff regression suites pass; syntax checks pass. Live post-deployment route check pending publication.


## 2026-10-31 — Backend v111 + frontend 1.0.80
- Based on GitHub main b3880eb61a8c56b3bc2ad036497edde143cc8a63, deployed v110/1.0.79.
- Compute supported balanced/short pedestrian choices plus an explicitly requested waypoint route; deduplicate identical geometry and isolate individual failures.
- Preserve destination/profile during waypoint name, numbered-choice and precise-address clarifications. Form sends structured waypoint intent in all ten UI languages.
- Compact selector synchronizes selected geometry, street directions and navigation; Google Maps URLs retain the chosen waypoint.
- No walking traffic/safety/quietness claims or motor-vehicle-only avoidance settings; disclose a single distinct result or failed waypoint calculation.
- Normalize known English stairs/crosswalk phrases in Romanian; retain floor numbers and street names.
- Backend/client tests and generated-script/syntax checks pass; live deployment validation recorded after publication. Physical phone QA remains necessary.


## 2026-10-31 — Backend v112 + frontend 1.0.81
- Replace the waypoint form with automatic pedestrian access discovery and a simple repeat-search action; retain same endpoints and clear old waypoint constraints.
- Discover mapped footpaths/railway entrances, calculate bounded walking alternatives, reject detours/private access/ignored waypoints and collapse substantially overlapping corridors.
- Require OSM bridge geometry matching before labeling a route as using a footbridge; isolate optional provider failures.
- Show selected blue / alternative grey geometries; choosing a path synchronizes directions and Google Maps navigation.
- Keep all ten UI languages and existing weather/GPS/hotel/shared-chat regressions. New automatic-alternative regressions and generated client syntax pass.
- Live public-place route validation follows deployment; physical phone QA remains necessary.


## 2026-10-31 — Backend v113 + frontend 1.0.81
- Label automatic routes by their number and differing provider street names instead of common approach roads or generic footbridge labels.
- Live v112 validation between public Grays Station and Lakeside found automatic Mill Lane/Mayflower Road walking geometry; discovery and both Worker deployments succeeded. Device-origin quality still requires phone QA.


## 2026-10-31 — Frontend 1.0.82 (backend v113 unchanged)
- Primary route-follow action stays in Pocket AI, with explicit GPS start/stop, one live marker, map following/recenter and approximate remaining distance.
- Report low accuracy/stale GPS/off-route states; clean watches/timers/markers on stop, close, view/route change and reset; ignore late callbacks.
- Keep Google Maps as a separately labeled optional external link. No new tabs or app handoff from the primary action.
- Foreground visual following only: no voice, automatic maneuver selection, arrival confirmation or automatic rerouting.
- Mocked actual-client GPS/Leaflet lifecycle tests and all existing backend/client suites pass; generated-script/syntax checks pass. Physical phone GPS QA remains necessary.
