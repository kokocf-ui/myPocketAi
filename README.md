## Backend v152 — 2026-11-02: ordonare liste și verificare West Dulwich

- Ordonarea cronologică nu mai depinde de cererea explicită „în ordine cronologică”: listele numerotate și cu marcatori sunt sortate după datele calendaristice detectate, inclusiv când data este în interiorul descrierii. Intrările identice cu aceeași dată sunt eliminate. Instrucțiunile secvențiale din rețete și navigație nu sunt reordonate.
- Selecțiile generale respectă în continuare ordonarea proprie domeniului: plecări după oră, localuri în apropiere după distanță, răspunsuri generale după relevanță; fără un criteriu sigur nu impunem ordine artificială.
- Pentru cereri de transport către locuri precum „West Dulwich, London”, backendul caută mai întâi stația prin TfL, inclusiv când utilizatorul omite cuvântul „station”. Căutarea secundară cere o potrivire exactă a numelui și nu poate înlocui destinația cu creșe/magazine.
- Rețetele cu blocuri de ingrediente identice repetate sunt curățate înainte de afișare, fără să fie deduplicați pașii de gătire.
- Teste adăugate în `tests_response_lists_station_regression.mjs` și workflowul `test-generalist-mixed.yml` extins.
- Verificări izolate ale sintaxei și formatării: trecute. Încă necesare: rezultatul GitHub Actions, publicarea în Cloudflare, test live TfL West Dulwich, audit surse legislative și confirmarea pe Android. Nu considera traseul West Dulwich rezolvat înaintea testului cu orare reale.

## Work in progress — backend v151 / frontend 1.0.116 (2026-11-02)

- Fixed 34 under-escaped regular-expression tokens in the frontend Worker HTML template, affecting Wikipedia text and speech transcript normalization. This specifically addresses the missing letter “s” (e.g. “cunoscută”).
- Generalist research no longer depends only on a question mark or a fixed subject category; explicit searches work across subjects. International legal queries use the multi-language country table. Source-aware rules added for political news and detailed culinary recipes.
- Journey durations are displayed in minutes, hours/minutes, and days/hours/minutes across ten languages without changing internal route timings. International mixed itinerary legs retain departure and arrival time zones.
- Optional adapter for a licensed/authorized MOTIS v6 route provider (`MOTIS_API_BASE_URL`) accepts verified walking + train/subway/bus/coach/ferry legs, validates times/cancelled services and maps to existing transit UI. No provider configured by default. Transitous public API is explicitly not used because its usage policy prohibits commercial use. This is not a complete international flight itinerary planner.
- Added focused tests: `tests_generalist_mixed_regression.mjs` and `.github/workflows/test-generalist-mixed.yml`. CI outcome and Android validation still require confirmation; do not mark production deployment or international end-to-end routing verified.
- Local TfL and existing driving route calculation is preserved. International itineraries remain unavailable until a suitable permitted routing service is connected and tested.

## Work in progress — backend v150 / frontend 1.0.115 (2026-11-02)

- Wikipedia summaries for explicit factual questions and known destinations, displayed in a dedicated assistant overlay with source attribution and optional photo.
- Plan route action uses verified article coordinates when available; country-only selections ask for a specific destination.
- Accommodation category discovery expanded to hotels, guesthouses, motels, hostels and mapped holiday units, with tourist-centre preference for city searches unless another area is specified.
- Optional accommodation search is offered after a route result originating from the encyclopedia flow.
- Availability, rates and Airbnb inventories are **not** verified; international mixed-mode live itinerary coverage is **not** complete. Never invent departures or accommodation offers.
- Keep previously phone-validated navigation intact. Existing unit test failures still need investigation.

## Backend v147 — verify destinations before transport choices (2026-11-01)

For an explicit journey request, resolve and verify destination coordinates before showing travel modes. Official TfL records confirm rail/tube stations; named landmarks use map provider evidence and popular-name aliases such as Arsenal Stadium → Emirates Stadium, London (no hardcoded coordinates). Reject unrelated long-distance names and unverified landmarks rather than routing blindly. Return straight-line distance so the existing frontend hides the walking mode on journeys over 3 km. The existing frontend 1.0.114 remains unchanged. Added mocked location regression and live Arsenal probes. The unrelated legacy Brave Search assertion remains known; phone validation is still required.

## Frontend 1.0.114 — refresh departures without restarting the conversation (2026-11-01)

The selected public transport destination is retained as verified coordinates when refreshing departure options. Refresh obtains a current GPS origin and sends both as structured fields to the existing transit endpoint; it no longer restarts the destination prompt. Journeys whose boarding departure cannot be reached using the provider's walk-to-stop estimate plus the safety margin are filtered before display. The selected journey panel no longer offers a generic walking retry when the departure is too late: a map-based walking route action is visible only for a verified access route. Frontend-only change; existing 1.0.113 selection dialog remains. Added targeted transit refresh regression tests to GitHub Actions. Android Chrome verification remains outstanding.

## Frontend 1.0.113 — native selection dialog (2026-11-01)

The frontend now uses a native HTML dialog for long transport-mode and destination-choice lists. Each response renders one direct first-tap trigger; option rows are created inside the dialog, not moved from the chat after a MutationObserver callback. Up to eight mapped named-place choices are visible within a scrollable modal. The legacy table observer remains only for other long panels. The modal closes via X, Escape or selecting a choice, with preserved chat context, ten languages and fixed bottom navigation. Backend unchanged. New isolated modal test and travel-mode handler regressions run before the pre-existing general test suite (whose Brave/news assertion is a separate known issue). Physical Android Chrome verification remains necessary.


## Frontend 1.0.112 — dialoguri generale pentru opțiuni și liste

Listele de opțiuni care nu încap confortabil în conversație sunt mutate într-un dialog suprapus cu închidere și revenire. Se păstrează elementele interactive originale și bara inferioară. Stilurile roșii din 1.0.111 rămân incluse. Testare vizuală pe telefon necesară.

## v1.0.111 — matching red action buttons (2026-11-01)

Home buttons across views and the expandable Selected transport summary now use the exact red gradient, border and shadow from the Quick selections button. Home and Quick selections share equal-width layout and aligned heights. No backend or route logic changes.

## UI styling update — frontend 1.0.110 (2026-11-01)
Home buttons in all views match Quick Selections gradient, equal-width paired actions sized to longest label; selected transport details in the route map use the same visible gradient. No route or backend logic changed.

# myPocket AI — backend v146 + frontend v1.0.109

## Named geographic places and stations — v145 (2026-11-01)

- A bare geographical district ("West Dulwich") is resolved as an exact mapped area before generic business lookup. Never return an unrelated nearby hotel merely because its name contains "West".
- An explicit station query ("Victoria station" or "London Victoria station") consults TfL's verified station records rather than categorizing a station as a hotel or business. Verified TfL station short names receive their operator-backed rail/underground station label.
- The v144 live diagnostics correctly resolved West Dulwich. TfL provided the short name "Victoria"; v145 fixes the display label. Full v145 live verification is separate from source and fixture testing.
- Regression test `tests_geographic_station_intent.mjs` checks these three inputs, a Decathlon control and no invented results when a district cannot be verified.

## Update — 2026-11-01 (v143 / 1.0.108)

- Chain-name searches such as "Decathlon" return up to eight distinct mapped nearby branches when multiple locations are available. The first four are visible; "Show more locations" reveals the rest, with straight-line GPS distances where available. A specific location qualifier such as "Lakeside" is still prioritized.
- Public-transport journeys retain the original POI and expose a final-mile walking action from the **last vehicle's alighting stop** to that POI, using verified stop and destination coordinates. This is an on-demand map route, not automatic transit detection or voice navigation.
- Restaurant, café/tea-room and local grocery searches use distinct provider categories; convenience shops are included alongside supermarkets.
- Verified in live GitHub Actions (backend v143): 7 distinct Decathlon candidates for a generic name, no restaurant/café duplicates in the West Thurrock public-area fixture, grocery sample included Londis and Longdan, and a verified 596-metre final walking route to the Decathlon POI.
- Dedicated destination, final-mile and food-category fixture tests pass. The broader legacy `npm test` still fails on an unrelated Brave/news test assertion; that issue has not been disguised or changed.
- GitHub Actions: `.github/workflows/test-destinations.yml`; focused tests: `npm run test:destinations` and `npm run test:local-categories`.


**Current source versions (2026-11-01):** backend v142; frontend APP.version 1.0.105. The Cloudflare deployment must be checked separately against the live service.

**Destination resolution:** User-entered names are treated as names, even without a business category or town. Geoapify name search is followed by GPS-biased Photon/other map-provider validation; results must have confirmed coordinates. Do not infer that the word "Street" alone makes a station name a street address. For UK public-transport destinations such as "London Liverpool Street", the TfL operator station record is preferred when verified. Frontend mode choices reuse retained destination context.

**Live QA:** GitHub Actions workflow `.github/workflows/test-destinations.yml` checks Decathlon, name-only/area/category variants, and Liverpool Street public-transport continuation against Cloudflare. The 2026-11-01 run 41320428179 confirmed Decathlon via Photon on backend v141 but failed Liverpool Street. The latter caused the v142 TfL `SearchMatch.name` fix; its live effectiveness is not yet confirmed in that earlier run. Use `npm run check`, `npm test` and `npm run test:destinations` for code/fixture validation.

**Repository cleanup:** `SHA256SUMS.txt` was removed because it contained obsolete hashes and was not generated by the current build. Tests, Wrangler configurations, deployment workflow and `VERSION_LOG.md` remain in use. Historical version entries below are retained for reference.

v137 / 1.0.101: explicit named venues with a town are resolved before broad category searches; unrelated business lists are not substituted for an unverified address. Destination candidate choices render as independent in-conversation tables. End-to-end live verification remains pending.

v135: rank town and address candidates instead of requiring one town or matching addresses from two domains. Request address-bearing page text when map POIs are absent; confirm provider coordinates against the selected address. Keep lightweight stage counts for failed lookup diagnosis.

v134: distinguish street/postcode addresses, named points of interest and geographic places. Separate business category from name and locality; support a name plus town without requiring an explicit category. Reject same-name streets for a business request, verify street/house number for an address, and keep the explicit town during named-POI fallback.

v133 / 1.0.99: choose walking, public transport or driving through a three-button table. The selected mode is sent as structured data with the retained destination and a GPS request. Named venues missing from geocoding are checked by simplified name, POIs in the explicit town, then (when Exa is configured) agreeing web addresses verified by map house/street/locality data.

v132: preserve named venues and explicit towns in either wording order, remove conversational option clauses from geocoder queries, retain the destination after walking/public-transport mode replies, and reject unrelated venue/locality matches. Mode clarification now includes public transport.

v131 / 1.0.98: compact step tables and local clock times in the first transport answer; direct map-to-options return; no provider diagnostics in itinerary prose. Keep distinct travel corridors and preserve the returned option with the shortest boarding walk. GPS and provider feasibility checks still apply.

v130 recognizes first-boarding-stop requests as public transport and retains the final destination across a walking-to-stop follow-up. No generic stop name is geocoded globally.

1 November 2026. v129 fixes conversational transit destination parsing: transport mode and comparison instructions cannot replace the requested station; Londra/Londrei is normalized to London while retaining Victoria Station. Official station guards use corrected regex boundaries.

Based on GitHub main 9fca0a7f1e32284250c57322ba4d4cac1b78e778 (backend v127; frontend header v1.0.96). APP and CLIENT_CONFIG version identifiers are synchronized to 1.0.97. Existing station ambiguity handling and Londra→London clarification are retained.

## Destination → transport choice → walk to boarding stop

Enter a public-transport destination. Choose one of the provider's journeys. The app extracts the first vehicle's exact departure stop, stop id, line, indicator and direction where the operator supplies them. If coordinates are missing, it looks up that operator StopPoint id; it never substitutes a geocoded street or a similarly named stop. Missing verified coordinates leave the itinerary visible with an explanation, without invented navigation.

Selection automatically requests a real walking route from fresh device GPS to that boarding point. A validated result opens the existing in-app walking map; use its Follow route in Pocket AI button to start GPS tracking. Google Maps stays optional. The selected transport itinerary is retained in a collapsible section above the walking instructions, including the destination, vehicle legs, line and departure information. Closing the map returns to the selected journey. The same selection action is available for public-transport answers in the personal assistant and full-answer reader. The current module is preserved.

A response to an old selection cannot overwrite a newer choice. Leaving the view, new chat or returning to the list cancels a pending walking request. The returned walking route must be walking-only, retain the exact requested stop coordinates and finish within 120m of them. Fresh walking duration plus the existing five-minute safety margin is checked against the first vehicle departure. An uncatchable departure prompts refreshing the choices; unknown times/durations are disclosed. These are estimates, not a guarantee of catching a service or a continuous live-departure monitor.

The UI/boarding schema is not tied to a city or named station. This update uses the existing configured TfL journey provider and Geoapify pedestrian routing. It does not add worldwide transit timetable coverage, independent disruption/closure verification, spoken turn-by-turn navigation or automatic off-route recalculation. International transit requires an appropriate provider's verified journeys and stop coordinates. Existing GPS following works with the app open.

## Installation and verification

The archive contains complete backend.js and index.js files, documentation and tests. Upload its root files to the same GitHub repository. Keep the existing Wrangler configs, secrets, AI binding, Worker names and deployment workflow. Install backend and frontend together: the new frontend relies on the new boarding_stop metadata. No provider key values are included and no new key is required for this extension.

Run npm test and npm run check. All suites pass, including new tests for exact/duplicate-name boarding stops, operator-id fallback, absent coordinates, selection→walking/map integration, feasible departures, stale response cancellation, GPS/provider failures, preserving the current section, multilingual walking intent and all ten interface languages. Previous repository tests contained an obsolete backend-version expectation and an obsolete automatic module-transfer expectation; these now reflect the current version and the agreed stay-in-section behavior. Validation uses provider and browser/GPS mocks plus generated client JavaScript compilation. There was no live validation of the new release or physical-phone test because these files are prepared for manual upload.

After deployment: search a destination → choose a transport option → verify the boarding stop/line → inspect the walking map → start in-app GPS following → close the map and review the selected itinerary. Test a second option and confirm the stop changes accordingly. If you can no longer catch the departure, refresh the options.

## In-app map following

The primary action is now “Follow route in Pocket AI”, a button that opens the existing route map and starts GPS watching only after an explicit tap. It does not open a new browser tab or the Google Maps application. “Google Maps (external)” remains a separate optional link.

A single live-position marker moves on the map. The map follows fresh GPS fixes; dragging pauses following and Recenter restores it. Approximate remaining distance is projected along the selected route geometry. Poor accuracy, stale GPS and off-route positions are reported instead of displaying precise guidance. Stop, closing the map, switching routes/views or resetting chat clears the GPS watch, timer and marker; late callbacks are ignored. GPS updates are processed locally and may refresh the existing session location cache; they do not issue periodic backend routing requests.

This is foreground visual route following with a direction list. It does not add spoken turn-by-turn instructions, automatic maneuver selection, arrival confirmation, background/screen-off guarantees or automatic rerouting. Browser location permission and a working GPS signal are required. Keep the app open. All new controls and status messages cover all ten UI languages.

## Automatic walking alternatives

Visitors no longer need to know a waypoint. The walking handler calculates balanced/short routes while discovering mapped footways, paths, pedestrian ways and railway/subway access near the destination through Geoapify Places. It considers up to four geographically separated access points and calculates all candidate routes with mode=walk and type=short. This is a bounded search, not an exhaustive alternative-path engine.

A destination-centred 1,100-metre Places search uses two category queries; no neighbourhood centroid or named city is inserted automatically. Explicit no/private access is rejected. Candidates too close to the endpoints, outside the search radius or requiring a large straight-line detour are discarded. Each automatic route must pass within 45 metres of its mapped access point. Large routed detours beyond shortest + max(400m, min(1200m, 45% of shortest)) are removed. A 40-metre corridor comparison suppresses routes sharing at least 88% of both paths; at most three distinct choices are returned, shortest verified first. Map data and provider availability can still yield just one choice; that is reported without inventing another.

Footbridge metadata requires a mapped footway/path/steps/pedestrian bridge and matching bridge geometry from the public OpenStreetMap way API. Its geometry must lie within 20 metres of the returned walking route. OSM bridge geometry is cached for five minutes with a 24-item bound. Route labels use route numbers and differing provider street names. This is geometric evidence, not a live accessibility/closure or traffic guarantee. The app does not claim that an alternative is quieter or safer without such data.

## Choosing a route

The chat reader and map have a compact selector with route distance and duration. The map displays selected geometry in blue, other choices in grey; either the selector or a grey path switches geometry, instructions and navigation together. The old waypoint form is removed. A localized “Find other walking routes” button repeats automatic discovery with the same endpoints and clears old v111 waypoint constraints. Controls support ro/en/fr/de/it/es/pt/nl/ru/pl.

Google Maps URLs retain automatically selected access points and mode=walking. Google Maps can recalculate the route and may show a preview or require a final Start action. Pocket AI supports foreground visual GPS following as described above. Explicit typed via requests remain supported for users who already know a place, but are not required in the walking flow.

## Existing behavior

Preserves shared chat/module handoff, exact hotel-result selection, GPS handling, Open-Meteo weather, four-line answer previews, clickable safe links, reader controls and fixed bottom navigation. Geoapify supplies route geometry, metric distances/times and street instructions; none are generated by the language model. Invalid geometry/units fail safely. Provider failures retain the destination and a retry context.

## Validation and deployment

Run npm test and npm run check. Tests execute the backend, generated client submission and map controls with mocked providers/DOM. New tests cover automatic access discovery, geometric duplicate suppression, same endpoints, private/centroid/snap/detour rejection, bridge geometry verification and partial-provider failure. There is no local physical-phone visual test. Live public-place route validation is performed after deployment; exact device-origin route quality still needs phone QA.

Publish repository-root backend.js, index.js, package.json, tests.mjs, tests_reader.mjs, tests_weather.mjs, tests_routes.mjs, tests_alternatives.mjs, README.md, README_ro.md, VERSION_LOG.md. Keep existing Wrangler configs, secrets, AI binding and deployment workflow. main push deploys both existing Workers.

Primary references: https://apidocs.geoapify.com/docs/routing/ ; https://apidocs.geoapify.com/docs/places/ ; https://wiki.openstreetmap.org/wiki/API_v0.6 ; https://developers.google.com/maps/documentation/urls/get-started . Chafford Hundred's pedestrian connection is documented by its operator: https://www.c2c-online.co.uk/stations/chafford-hundred-station/ . No Lakeside/Mill Lane/Mayflower coordinates or route are hardcoded in the product.


## v146 / 1.0.109 — categorii și afișarea traseelor (2026-11-01)
- Selecții rapide Hărți: Muzee, Parcuri, Grădini zoologice; căutare pe GPS cu raza implicită 5 km.
- Categorie combinată Baruri, ceainării și cafenele, incluzând puburi. Restaurantele rămân separate.
- În lipsa rezultatelor confirmate, nu se inventează obiective. Nu se confundă un furnizor indisponibil cu absența obiectivelor.
- Butoanele Acasă și Selecții rapide sunt uniformizate, iar acțiunile de hartă primesc contrast mai bun; indicațiile pe străzi rămân vizibile în fereastra hărții.
- Validarea pe telefon și căutările live în Cloudflare rămân necesare după publicare.
