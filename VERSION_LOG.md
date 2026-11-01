## 2026-11-01 — Backend v147 / frontend 1.0.114

Validare a obiectivului înainte de alegerea transportului; TfL pentru stații, Geoapify pentru alte obiective; numele uzuale de stadion sunt căutate cu denumirea oficială, fără coordonate introduse manual. Nu se acceptă un rezultat îndepărtat și fără legătură cu cererea. Distanta verificată controlează afișarea modului pietonal. Adăugate teste dedicate pentru Arsenal și păstrarea căilor TfL. Problema preexistentă Brave Search din testul general rămâne separată.


## Frontend 1.0.112 — dialoguri generale pentru opțiuni și liste

Listele de opțiuni care nu încap confortabil în conversație sunt mutate într-un dialog suprapus cu închidere și revenire. Se păstrează elementele interactive originale și bara inferioară. Stilurile roșii din 1.0.111 rămân incluse. Testare vizuală pe telefon necesară.

## v1.0.111 — butoane roșii uniforme (2026-11-01)

Butonul Acasă, în toate secțiunile, și panoul extensibil Transport ales folosesc acum același gradient roșu, chenar și umbră ca Selecții rapide. Butoanele Acasă și Selecții rapide au lățimi egale și înălțimi coordonate. Nu se modifică backend-ul sau logica traseelor.

## UI styling update — frontend 1.0.110 (2026-11-01)
Home buttons in all views match Quick Selections gradient, equal-width paired actions sized to longest label; selected transport details in the route map use the same visible gradient. No route or backend logic changed.

v146 / frontend 1.0.109 — new museum/park/zoo quick searches, combined bars/cafes/pubs, button styling and persistent walking directions. GPS-backed 5km searches; no invented results. Live QA pending.

# Version log

## 2026-11-01 — Backend v143 / Frontend 1.0.108

- Generic chain name ("Decathlon") presents up to eight verified nearby branches when multiple locations are available, with the first four shown immediately. Qualifiers (e.g. "Lakeside") still narrow the result; no location is invented.
- TfL itineraries retain the final destination POI and support a separate on-demand pedestrian map route from the last non-walking vehicle alighting stop to that POI. The live backend verified a 596 m final walk to Decathlon.
- Restaurants no longer automatically absorb cafés/tea rooms, fast food, pubs or bars. Café query is kept separate; grocery search includes convenience shops as well as supermarkets.
- In live public-area fixture around West Thurrock: 40 restaurant and 40 café results with no identical place in both; grocery sample included Lidl, Longdan, Londis, Tesco Express and other markets.
- Dedicated destination, last-mile and category fixture tests pass; full legacy suite still reports a separate Brave/news test failure. Do not claim comprehensive green CI until that separate discrepancy is investigated.
- Frontend 1.0.108 preserves fixed bottom navigation; new final-mile button uses verified stop and POI geometry. Live in-app visual validation remains to be performed.


## 2026-11-01 — Source audit, backend v142 + frontend 1.0.105

- Verified the exact file tree on `main`. Every `tests*.mjs` is used by `npm test`; the two Wrangler configs and GitHub Actions workflows are active configuration and must not be deleted.
- Removed the obsolete `SHA256SUMS.txt` file: its digests described earlier code and documentation, not the current release. Updated both README files; the history remains intact.
- Live GitHub Actions run 41320428179: Cloudflare v141 resolved all three Decathlon name forms by Photon and retained a working transit route; `London Liverpool Street` still failed during station resolution.
- Backend v142 reads TfL `StopPoint/Search` results using `SearchMatch.name`, validates the operator station and uses the matched ID for public-transport routing. The historical v141 run is **not** proof of v142 live success.
- `tests.mjs` no longer pins obsolete backend v136; the Liverpool Street fixture now uses the actual TfL `name` field. The named-venue and transit regression tests remain part of the test suite.
- Rule for routing: the place name entered by the user is the primary lookup key. Terms like "Street" inside an official station name must not be used alone to force a street-address category. Provider-verified coordinates or a clarification are required before navigating.


## 2026-10-31 — backend v114 + frontend 1.0.83
2026-10-31 — backend v114 / frontend 1.0.83: expanded Romanian local food, market and pharmacy intent; nearby 'în jurul meu'; removed automatic chat-module handoff; exposed New conversation in module conversation header. Static inspection only; automated/live regression tests pending.


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


## 2026-11-01 — Backend v128 + frontend 1.0.97 (manual-update package)
- Based on main 9fca0a7f1e32284250c57322ba4d4cac1b78e778; preserve v127 transit destination validation and the final Londra/London UI clarification.
- Retain exact first boarding stop ids, coordinates, line, indicator and supplied direction; resolve missing coordinates only by an operator stop id.
- Selecting a journey requests a verified pedestrian route to its boarding stop and opens the existing in-app map/navigation controls. Keep the selected itinerary on the map and remain in the current section.
- Validate endpoint/mode, check walking time plus the five-minute departure margin, reject stale selection responses and disclose missing stops/times.
- Support both quick-selection and chat/reader entry points, all ten UI languages, and structured walking intent even when international stop names contain bus/rail terms.
- Synchronize APP and CLIENT_CONFIG to 1.0.97. All automated suites and syntax checks pass. Live deployment/phone QA pending manual upload; no new global timetable or closure provider added.


## 2026-11-01 — Backend v129, frontend 1.0.97 unchanged

- Fix the exact assistant test request: retain Victoria Station in central London, rather than geocoding “comun” or London alone.
- Parse the destination independently of transport mode, city qualifiers and comparison instructions; ask for a destination when only an origin is supplied.
- Correct overescaped regex boundaries in operator station lookup and name validation.
- Add end-to-end mocked provider tests for Romanian/English chat requests, verified station id routing and missing destination.
- Publish directly to GitHub under the user's confirmed update workflow.


## 2026-11-01 — Backend v130, frontend 1.0.97 unchanged

- Recognize “primul mijloc de transport” and “prima stație de autobuz” as boarding access within a transit trip, ahead of walking/driving dispatch.
- Preserve Lakeside from the immediately relevant user history; reject stale trip recovery after another topic.
- Keep the final destination distinct from the first boarding stop. Missing destination asks for clarification without global stop geocoding.
- Extend mocked integration tests with both exact screenshot turns, actual itinerary boarding-stop selection, missing GPS and topic boundaries. All suites and syntax checks pass.


## 2026-11-01 — Backend v131 + frontend 1.0.98

- Replace the long first transport reader with an accessible three-column journey step table (step, action, local time), preserving station and line names. All ten UI languages have table and return controls.
- Keep compact alternatives with departure/arrival, boarding station, access walk and transfer count. Repeated departures along one corridor no longer hide a distinct route; retain the shortest boarding walk among returned feasible options. No Grays service is fabricated or forced.
- Add a visible back-to-options button to boarding-access maps. Closing the map also returns to cached journey options without repeating GPS/provider calls.
- Remove BODS/RTT checks and unrelated vehicle lists from the itinerary text, retaining structured diagnostic metadata. Fix literal newline escapes and show short clock times.
- Synchronize frontend identifiers to 1.0.98. Tests cover semantic tables, automatic first-reader data readiness, cached return, corridor diversity, short-access retention and existing routing/navigation.


## 2026-11-01 — Backend v132, frontend 1.0.98 unchanged

- Preserve venue and city in “în Tilbury la restaurant Zani” and “la restaurantul Zani din Tilbury”, without treating “ce opțiuni am” as part of the destination.
- Walking/driving and public-transport geocoders now reject named venue matches that do not also match the explicitly requested town. Missing matches ask for details; no unrelated restaurants are substituted.
- Include public transport in the mode clarification and retain the final destination across short mode replies, using structured route context or the immediately relevant user history.
- Extend natural travel-intent wording and recognize inflected transportul public/metroul forms.
- Add mocked integration tests for both screenshot word orders, sequential walking and transit replies, fresh/history-based context, rejected wrong-country same-name restaurants, and an explicit foreign-city destination. All eight suites and syntax checks pass.


## 2026-11-01 — Backend v133 + frontend 1.0.99

- Add a three-button walking/public transport/driving mode table in chat and answer reader, localized in all ten UI languages. Send the selected mode as structured data, retain the final destination, request GPS and reject obsolete controls. Typed mode answers remain supported.
- Resolve named places missing from geocoding by simplified name, then a named Places search inside the explicitly resolved town. Do not substitute the phone's town for an explicit foreign destination.
- When EXA_API_KEY is configured and map POIs are missing, require address agreement from two distinct domains and map confirmation of house number, street and locality before using returned coordinates. No coordinates are inferred from prose and origin GPS is not sent to web search.
- Use the same resolver for pedestrian/driving and public transport. If a named town is already known, ask for street/postcode rather than requesting the same town again.
- Tests cover click-to-backend flow in multiple languages, actual chat payload and GPS intent, missing-map-POI fallbacks, address agreement/conflicts, inadequate geocodes and shared transit resolution. All ten suites and syntax checks pass. The live restaurant route still requires phone/provider validation after deployment.


## 2026-11-01 — Backend v134, frontend 1.0.99 unchanged

- Classify travel destinations into street/postcode addresses, named POIs and geographic places. Keep category, business name and explicit locality separate.
- Support store, restaurant, cafe, accommodation, pharmacy, museum, park, healthcare, education and entertainment prefixes; names with explicit towns also work without a category.
- Reject generic “Magazin” matches and same-name streets for a named-store request. Verify street, house number and locality for an explicit address, including common street abbreviations.
- Route named fallback searches to the appropriate provider category, or a broad named-POI search when category is unknown, inside the explicit town. Preserve station-specific and shopping-mall handling.
- Tests reproduce both Europa/Grays screenshot formulations, city-first phrasing, typed walking continuation, rejected foreign results, rejected same-name streets, town-bound fallback, exact addresses and transit. All eleven suites and syntax checks pass. Real provider/store validation remains separate.


## 2026-11-01 — Backend v135 + frontend 1.0.100

- Reproduce the missing Zani destination in the live UI using a public origin.
- Replace the single-town gate with ranked town candidates; broaden restaurant POI search to catering and rely on the verified spatial search area when town labels vary.
- Replace the two-domain address consensus gate with ranked address evidence, map house/street/locality verification and normal ambiguity choices.
- Request bounded page text as well as highlights to retrieve addresses that snippets omit. Add count/status diagnostics without query, origin, keys or page contents.
- Automated suites pass; live post-deployment validation is pending.


## 2026-11-01 — Backend v136, frontend 1.0.100 unchanged

- Live v135 tracing confirmed: the web request succeeded and supplied address candidates, but no house-level map match was usable.
- For towns explicitly resolved to Great Britain, query the public FSA establishment directory by business name and town to obtain the named business address and recorded coordinates when the general geocoder omits it. No business/location names are hardcoded.
- Do not expose ratings or other unrelated fields. Directory failures remain isolated and existing named-POI/web resolution continues. This directory covers UK food establishments; it is not worldwide coverage.
- Add fixture coverage for a directory result and its coordinate/source mapping. Live validation pending deployment.
