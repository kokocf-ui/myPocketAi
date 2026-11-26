# APK501887 physical retest failed — 2026-11-26

## Physical evidence (user report, not fixture results)

Seven screenshots at 21:07–21:08, files `Screenshot_20261126_210706`, `210708`, `210723`, `210818`, `210823`, `210833`, `210836` in `/tmp/arena-coding-uploads/`.

- Public transport: list from 12 Mill Lane, Grays to Liverpool Street, City of London EC2M 3TL. First option 21:18→22:35. Detail heading ends at 4–6 Devonshire Row; bus 73 boarding South Stifford, Mill Lane 21:20; initial walk 2 minutes/103 m; later c2c/Fenchurch Street, final walk 22:18→22:35. User clarified that the public-transport failure is the interaction: selecting an option opens a long information-only screen; the map/navigation action requires scrolling and another tap. Required: options → directly map + details, everything within the phone viewport, no up/down scrolling. This report does not establish a routing defect; do NOT infer full functional success from a populated list either.
- Mixed transport: GPS→Piața Unirii 1, 410640 Oradea; selected departure 3 December 2026 03:07. Early progress has no usable cards. Final flight-source failure plus ground incomplete and an airport list, still no routes. User says mixed is worse. Airport list includes RAF Northolt and other geographical facilities that do not establish passenger-service eligibility.

**APK501887/v187 did not solve the user's real transport problem.** Stop presenting release gates or warning messages as evidence of functional completeness. The release CI's invalid-message streaming probe checked forwarding/version only; it deliberately never exercised multimodal providers.

## Executed live diagnosis, without transport/search-credit consumption

Source `19dea1c`, existing manual `mixed-live-diagnostic.yml`, `run_live=false`:
- Run **45896433916**, job/check **140171374773**, SUCCESS.
- Cloudflare settings/aggregate analytics and no-search-credit flight account health only. No Exa/Brave searches, flight searches, journey probes or HERE calls.
- Binding-presence check: Geoapify, Exa, Brave, SerpApi, TfL, TransCAPI and Romanian urban VPC/token present; **MOTIS_API_BASE_URL absent**. A configured international scheduled MOTIS feed therefore cannot be supplying our graph. Search-engine operator pages are not a substitute for such a timetable feed. This does NOT prove there are no other road/rail possibilities.
- Flight health: `free_active`, key/flags/terms configured, `freePlan=true`, `hasQuota=true`, `consumesSearchCredits=false`. **Do not diagnose flight failure as exhausted free quota.** This account health does not verify a Google Flights request or a route.
- Hourly aggregate worker outcomes: success 50 requests/384 subrequests/0 uncaught errors; clientDisconnected 33 requests/71 subrequests/0 uncaught errors. These are aggregate across traffic, NOT attribution to these screenshots. They neither prove a per-request subrequest-limit failure nor exclude caught internal failures/timeouts.
- Runtime usage_model `standard`, cpu_ms null, observability_enabled null. Do not interpret missing settings as an authoritative free/paid-account classification.
- Exact sanitized annotations retrieved via GitHub API; scratch `.bundle-check/apk501887-no-search-diagnostic.json`. No secrets printed. Logs/artifact redirect host restriction remains; check annotations work.

A separate new workflow was initially not dispatchable (404, not on default branch); it was removed and the read-only inspection put into the existing dispatchable workflow. No branch switch/main merge.

## Concrete source fixes, BRANCH ONLY, not a claimed live cure

1. Geographic airport normalization now rejects explicit military/name evidence (including RAF), private access and provider `scheduled_service=no`; missing passenger-service tags are NOT treated as proof of no service. No static London airport list. Missing/blank coordinates rejected.
2. Flight supplier errors explicitly identifying an invalid/unsupported airport are classified separately, with existing secret/URL redaction and HTTP400 payload handling. Such a query no longer suppresses independently planned later airport queries. No repeat of the same parameters and no query-budget increase. Quota/401/403/429/unknown errors still stop immediately; every call still uses the existing free-plan/quota guard. If any airport query was rejected, the overall search remains explicitly incomplete even if another returns candidates.

These repair demonstrable code behaviors and the unsuitable military-gateway symptom. We have NOT captured the provider error for the user's request, so we do NOT claim invalid-airport rejection was its actual root cause. No new flight/provider search was made to test that hypothesis.

Offline normalization/classification/recovery/budget/no-retry/stop-on-quota tests PASS; full mixed, transit audit and syntax checks PASS. They remain offline evidence only. No new backend/APK publication for these changes.

## Unfinished

- Public-transport UX symptom is clarified above. The branch fix below still needs physical APK validation; no new APK was published in this phase.
- Exact empty ground result cause (HTTP source failures vs normalization/geography vs cancellation/deadline) is not established by the images/configuration check.
- Free quota/budget verification for additional live Exa/Brave searches is not established; do not spend blindly or buy a paid provider to hide missing coverage.
- No licensed international timetable provider was configured/activated here; no FlixBus dated inventory access was obtained. Do not activate commercial Transitous or HERE/paid services as a fallback.
- A useful full Grays→Oradea journey still has to be demonstrated with real source/stop/transfer evidence before another APK is described as fixing it.

Released code remains `f7ab634`, backend v187/APK501887. HERE OFF, 0 of maximum 2 attempts used; Oracle and production frontend unchanged. PR558 stays draft.

## Public-transport viewport correction — branch only

The clarified request is now implemented in source, not deployed:
- One public option tap opens the map/details shell synchronously, before map-library, GPS or walking-provider results. No intermediate long info page and no second map button below the fold.
- Phone-height map + measured, bounded detail pages + fixed Back/page/navigation controls. Every leg, long stop/address text, stop count, tickets, operators, attribution and warnings remains reachable through page arrows, without vertical/horizontal detail scrolling. The last-walk shortcut selects that leg within the same screen instead of opening the older scrolling road-detail view.
- Public options also use measured pages. The speculative all-walking comparison no longer starts a background provider call simply for showing public options. Romanian national category tabs remain live (not detached/cloned with stale handlers), with category preserved on Back; fares, localities, actual vehicle/replacement labels and fare/unknown-train notices are retained.
- Boarding access verification still runs with bounded GPS/provider waits, departure feasibility/safety margin and cancellation generations. Initial walking geometry reuses that request, not a duplicate. A failure enriches the same screen, disables unverified navigation and does not hide the itinerary. Explicit Start rechecks elapsed departure feasibility; selection never starts native navigation. Schematic geometry is still dashed; no invented street path.
- Native Back cancels pending access/map enrichment and restores options. Native Start/Stop/GPS controls retain the bounded screen; rotation triggers measured repagination. Closing the map still does not implicitly stop an already-running Android service.
- Generated HTML exposed a pre-existing Romanian source-identification escape bug: template `\b` became a backspace in browser regexes. Escaping is corrected, and the rail unit harness now executes generated HTML rather than raw template source.

Executed locally, with synthetic providers/maps (NOT live journeys or an Android device):
- `npm run check`, `npm run test:transit-audit`, `npm run test:mixed-orientation`, frontend boot syntax, Android startup/branch-preview guards, Romanian rail UI: PASS.
- `npm run test:transit-reported-failures:browser`: PASS. Pending access, success/failure/cancellation/late reply, all three walking stages and mixed sticky/Android Back regressions retained under the new direct-map contract.
- `tests_transit_viewport_browser.mjs`: PASS at 360×640, 360×794, 393×817, 430×932; actual option taps, map shell while map library is deliberately pending, no detail/option scroll overflow, every long-text stage/ticket accessible, opt-in Start/Stop, map reflow at 640×360, Romanian categories/fares/localities/operators and Back. Also PASS against the Wrangler-built frontend bundle.
- Wrangler frontend `--dry-run`: PASS. No deployment. Browser fixtures intercept all remote requests; no transport/search credits, HERE attempts or paid activation.

Physical validation of this UI and the separate unresolved mixed-provider failure remain outstanding. APK501887/v187 is unchanged and remains a negative physical retest. PR558 stays draft; no production frontend/backend/Oracle publication in this phase.
