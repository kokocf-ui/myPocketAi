# Progressive mixed transport — authorized test release, 2026-11-26

## Authorization and scope

User: “Hai sa rezolvăm ce mai avem de făcut și să eliberăm un apk pentru testare”. This authorizes the matching controlled backend update and signed branch-test APK needed to test these changes. No main merge, production frontend deployment, Oracle deployment, subscription or HERE activation. Draft PR558 remains draft.

## Changes prepared for backend v187 and new test APK

Includes the earlier unreleased physical-report fixes, shared ordinary local routing at both ends, surface graph and independent rail/coach/corridor branches from commits 45e357e/fad871c/64bbd9a.

New in this release:
- Opt-in `mixed_progressive: true` on the existing `/api/chat` request produces NDJSON `started`, `progress`, `result` (or `error`) events. Exactly one request/search, no polling or replay. Legacy callers retain JSON.
- Protocol is negotiated in the JSON request body, so the existing production frontend API proxy forwards it without requiring a frontend deployment. APK bundles this branch HTML as before; APIs stay same-origin online.
- Ground operator/corridor progress arrives while other branches run. Scheduled graph results can be published before waiting for remaining indicative sources. Air enrichment remains independent.
- Early options are selectable. Later progress/final response updates the saved list but does not replace an open detail. Back returns to the latest alternatives. Back to calendar invalidates the search generation and cancels the client request; late events cannot replace the calendar.
- Interrupted stream keeps already-received evidence with an explicit incomplete-search message, not a false “no routes”. Explicit cancellation does not produce results.
- Parent cancellation propagates into air discovery, flight ground-enrichment, ground hub discovery and the scheduled graph. Existing adapters that ignore cancellation may still finish their current request, but graph/branch dispatch checks prevent subsequent work after cancellation.
- Existing six displayed operator options retain mode diversity. FlixBus advertising title variants such as “Cheap bus tickets from London to Oradea” normalize the city correctly instead of treating “Cheap bus tickets from London” as an origin.
- `mixed_ground_only: true` is a diagnostic opt-out from flight discovery; no new source is enabled by it.
- API version v187; CI live smoke version assertions and APK prerelease notes updated.

## Proof and boundaries

Offline actual frontend-proxy → actual Worker → NDJSON client test proves early ground delivery while a timetable provider is held, with exactly the existing two discovery calls and no AI/flight/HERE. Additional stream tests cover fragmented UTF-8, final validation failures, interruption and cancellation.

Real streamed HTTP browser tests at 360/393/430 prove early selectable cards, detail preservation, newest-list Back, calendar Back/cancel and late-chunk suppression, without polling. Both existing mobile browser suites also pass. Full mixed, transit audit, national transport, syntax, generated boot script, Android preview validation, frontend/backend dry runs and bundled-browser-name checks pass. These are mocked/offline tests, NOT physical APK validation or proof of timetable coverage.

A post-deployment smoke through the existing public frontend is added to CI. It sends an empty invalid message, verifying NDJSON forwarding/version/validation WITHOUT requesting AI, geography, search or transport providers. Existing authorized Eva/weather/location and FI/EE checks remain in the deployment workflow.

## FlixBus public research (not runtime integration)

Search found the official London–Oradea route. The UK URL redirected to a generic network page during fetch; `https://global.flixbus.com/bus-routes/bus-london-oradea` did return an actual route page. Fetched chunks 0/1 list London stop possibilities and two Oradea possibilities, with provider-published map coordinates (Autogara Intrans and OMV). The page explicitly says the ticket contains the current address. This does NOT identify which boarding stop/intermediate changes apply to a dated itinerary. No copied station catalog, preset London–Oradea path, invented dates or coordinates were inserted into the application. It is public route evidence, not a verified 4 December booking or a successful live query by our backend.

## Remaining provider-dependent limits

This release is for TESTING, not a claim that every requested journey is complete. Official city-pair pages can include changes but do not, alone, verify dates, transfer stations, through tickets or total fares. Exact local access/egress is composed only where provider stop/time evidence is available. Existing scheduled composer validates chronological connections, canonical stop identity and evidenced cross-provider changes; geographic proximity alone does not create a transfer. No new FlixBus inventory/API access was obtained. The physical Grays-address → Oradea-address result remains to test.

No new paid provider or paid fallback was enabled. Existing query ceilings do not prove account-wide free balance. HERE OFF, zero of two maximum attempts used. No repeated live mixed provider probes to consume unconfirmed search/flight quota.

## Release execution

Completed, in order, from source **f7ab634b276c3486e50ba6979993a77d78dad67b**:

1. Backend-only workflow **45894584636**, job **140165222413**: SUCCESS. Frontend deployment skipped. CI confirms actual deployment, progressive protocol through the existing frontend (no-provider invalid-input check), legacy communication 410, Eva/weather/location and FI/EE live smoke steps all succeeded. Independent GET of the public backend root also reports **v187 online**.
2. Signed APK workflow **45894780817**, job **140165885178**: SUCCESS. Debug job skipped. CI confirms certificate equality with the published APK, package identity, incremented versionCode, bundled snapshots and prerelease publication.
3. Published test **APK501887**, release **459896683**, asset **797677062**, size **77,654,992 bytes**. GitHub asset metadata reports SHA-256 **8be969d1e8d6d7d27fa29eb5986215e5ad06b06975d95979d04d90dc6cd794ad**.

[Download signed APK501887](https://github.com/kokocf-ui/myPocketAi/releases/download/education-test-45894780817/myPocketAI-signed-education-test.apk)

[Backend workflow](https://github.com/kokocf-ui/myPocketAi/actions/runs/45894584636) · [APK workflow](https://github.com/kokocf-ui/myPocketAi/actions/runs/45894780817) · [Test release](https://github.com/kokocf-ui/myPocketAi/releases/tag/education-test-45894780817)

Install as an update, without uninstalling or clearing data. Then close and reopen the application. Retest checklist: `ROMANIA_APK_TEST_CHECKLIST_2026-11-26.md` (new top section).

Evidence limitation: CI logs/artifact downloads redirect to hosts blocked by this sandbox; direct downloads of those reports failed. Successful step statuses were independently retrieved via GitHub run/job APIs. The hash above is GitHub asset metadata, not a local APK rehash; certificate verification is the successful CI step, not independent local signature inspection. No physical device test has yet been performed. No repeated live mixed-provider search was run after release.
