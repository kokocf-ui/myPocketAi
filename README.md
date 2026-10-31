# myPocket AI — backend v110 + frontend v1.0.79

31 October 2026. Verified base: GitHub main commit `e718d609971995e7393661eaf8d8dd661eb31da5` (v109 / 1.0.78). Existing weather, hotels, GPS and answer-reader behavior is retained.

## v110 correction

Metric route units are validated case-insensitively (`meters`, `Meters`, `METERS`); miles remain rejected. v109 incorrectly compared strictly with `Meters`, while the provider's real-response example uses lowercase `meters`. Regression fixtures now use lowercase provider-style units.

Route failures retain a retry state. A full destination clarification such as “Lakeside shopping center Grays” replaces the repeated name instead of concatenating it or reaching the general LLM. A town after “shopping center” is treated as a geographic qualifier rather than a required mall-name token. Legacy v109 contexts with pending:null are handled too.

Failure diagnostics expose only controlled codes and optional HTTP status, never provider URLs/keys. Tests assert that destination follow-ups after provider failures never call the language model or fabricate directions and estimates.

This update is prepared for direct GitHub publication after connector installation was authorized. Post-deployment phone QA remains necessary. Start a new conversation for retesting so previously generated unverified directions are not confused with the corrected route.

## Walking routes

The pedestrian quick action now enters the shared chat with explicit walking intent. GPS confirmation resumes the pending route instead of merely reverse-geocoding the phone. Destination and profile survive clarifications; user history can recover a missing route context without using assistant guesses as location evidence.

For an unqualified shopping-centre destination, Places searches the mapped name/category within 25 km of GPS, followed by geographically constrained forward geocoding. Failure asks for town/country rather than substituting overseas names. Explicit destinations remain worldwide; explicit country overrides GPS bias. Local results are not guaranteed exhaustive.

Street instructions, metric distance/time and geometry come from Geoapify with the selected language. Invalid distances, coordinates or incompatible units are rejected. Missing instructions are reported, never generated. At most 500 supplied steps are returned.

The route map shows the provider geometry and a separately scrollable instruction list above the fixed bottom navigation. Chat and the answer reader provide map/navigation actions. Google Maps navigation uses the chosen destination coordinates and walking/driving mode. GPS-origin navigation uses the current device position; an explicit origin is retained. Google Maps may recalculate the route, show a preview or require a final start action depending on platform and location availability. Pocket AI does not yet provide its own continuous turn-by-turn navigation, voice guidance or off-route recalculation.

## Conversation handoff

The backend recommends maps/travel/assistant according to the handler that actually answered. The frontend moves the existing chat without archiving it, clearing GPS or changing conversation generation. Hotel discovery moves to Travel, routing moves to Maps, and explanatory/general questions return to Assistant. Weather remains in Assistant. Some utility POIs, such as fuel/parking, belong to Maps.

Place results are retained and archived for exact selections. Romanian/English ordinal references such as “Du-mă la al doilea hotel” and “Walking route to hotel 2” use the chosen result's coordinates. Place details also have a walking-route action. New controls and route summaries cover all 10 interface languages; free-text intent phrasing is primarily tested in Romanian and English.

## Installation and tests

Upload all package files to the repository root: backend.js, index.js, package.json, tests.mjs, tests_reader.mjs, tests_weather.mjs, tests_routes.mjs, README.md, README_ro.md, VERSION_LOG.md, SHA256SUMS.txt. Keep Wrangler configs, secrets, AI binding and the existing deployment workflow. Updating main triggers the configured Worker deployments.

The GitHub snapshot lacked tests_reader.mjs and tests_weather.mjs despite referencing them in npm test; both are supplied. Run npm test and npm run check. Mocked backend/DOM regressions execute the actual chat submission, module switching, route map, place-detail selection, quick action and navigation-link functions; generated browser JavaScript is compiled. Local tests cannot access the Cloudflare Geoapify key. New real POI/route quality, phone layout and Google Maps launching require post-deployment phone QA. Weather was confirmed by the user on the previous release; its regression tests remain included.

Phone checks: Lakeside walking route → GPS confirmation → street list/map → Google Maps walking navigation. Then nearby hotels → second hotel route → general star-classification question. Verify the same conversation persists across modules. Recheck Oradea/Grays/Barcelona weather follow-ups.

Primary documentation: https://apidocs.geoapify.com/docs/routing/ , https://apidocs.geoapify.com/docs/places/ , https://developers.google.com/maps/documentation/urls/get-started .

Weather retains Open-Meteo and optional OPEN_METEO_API_KEY. Public API use is noncommercial; commercial use requires the appropriate provider plan: https://open-meteo.com/en/terms . Data attribution: Open-Meteo, CC BY 4.0. Hotel photos and live room prices are not implemented.
