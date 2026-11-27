# Follow-up: remove handwriting everywhere; investigate transit walking

## User's physical evidence and scope

The user supplied phone screenshots showing that ink can be drawn but transcription returns unavailable/cancelled. They explicitly requested removal of handwriting/stylus everywhere. They also reported that the standalone walking tool finds routes whereas public-transport walking access reports failure, even with other walking geometry visible on the map. Stage-by-stage pagination was questioned, not accepted as a resolved UX.

No claim of physical acceptance is made for this correction. The screenshot alone does not establish which server response/timeout happened on that phone.

## Implemented

- Removed the shared handwriting button, dialog, drawing/upload/transcription code, exported browser initializer and native Back selector. This removes it from all Education editors, including Science, exams and language practice. No layout redesign for Physics/Chemistry/Astronomy. Keyboard, symbols/templates, growing brace preview and the previous long-line wrapping remain.
- The legacy backend handwriting endpoint is retained for compatibility with older APKs; it is not called by the new interface. No backend deployment or activation.
- Unified boarding access and transfer street-path requests through `transitWalkingRequest`: same existing `/api/chat` coordinate-backed walking road router used by standalone walking, explicit origin/destination and clean history/context, no transit lookup reentry.
- Confirmed source defect: boarding client previously aborted after 8 seconds, while backend routing allows 12 seconds per provider calculation and performs subsequent access/entrance/address checks. Each walking request now has a 45-second bounded deadline covering response reading, linked cancellation, no automatic retry.
- Confirmed source defect: the map used a single 35-second cutoff across sequential walking jobs. Replaced with independent request deadlines and at most two concurrent transfer workers, still at most 12 transfer jobs. Existing initial boarding request is reused, not duplicated.
- Match returned walking alternatives to both requested geometry endpoints (150m maximum), not only the preferred route; do not require destination metadata within 2m when verified address/entrance corrections can move it. Distant/unrelated alternative endpoints remain rejected.
- Separate route geometry from timetable feasibility. A verified walk remains drawable/reusable even if its duration + boarding margin makes the selected vehicle impossible to catch. Navigation stays disabled for an infeasible departure. Null/missing duration does not silently become zero.
- Walking-access errors are labelled as access to the **first stop**, not a claim that every walking stage failed.

## Pagination decision

The previous viewport implementation divided the itinerary into measured pages to respect the user's no-whole-screen-vertical-scroll requirement. This was an implementation choice, not a routing requirement. Pagination has NOT been redesigned in this correction. Do not claim that the new APK resolves the user's layout objection or overall public/mixed transport issues.

## Verification

PASS:
- New `tests_transit_walking_parity_browser.mjs`: actual app selection/map flow at 360x640, 393x817, 430x932, synthetic HTTP; real 8.5-second boarding response; preferred distant entrance rejected in favour of matching alternative; explicit shared walking context; initial request reused; final walk mapped; missed departure preserves geometry while navigation stays disabled; cancellation and no detached/repeated searches.
- New actual-backend-dispatcher context regression in `tests_walking_address_arrival.mjs`, provider mocked; existing address-arrival safety checks retained.
- `tests_education_input_browser.mjs`: 8 national subjects, generic Math/Science/Computing, exams and language practice; no handwriting entrypoint or callable dialog/upload; cursor insertion, templates, brace growth and read-only fields retained.
- `tests_education_input_tools.mjs`: generated script has no handwriting code; legacy API tests retained for old-client compatibility, not proof of working transcription.
- `npm run test:transit-audit`, viewport browser, reported-failure browser (held-request fixture adjusted for bounded concurrency), native/full-journey contracts, walking entrances.
- Compact Education browser, frontend boot, exercise tutoring/review, Android UI snapshot build/gate, syntax and diff checks.
- Wrangler frontend dry-run, serialized-browser-name guard (6,881,089 chars), compiled-browser walking parity/input/viewport/compact tests (final rerun recorded in delivery notes).

These are source/compiled-browser tests with synthetic providers, NOT live UK route proof or physical phone acceptance. No paid-provider requests, HERE calls, backend/prod frontend deployment, main merge, or Oracle changes.

## Delivery

Signed branch test APK pending at source checkpoint. Source commit, CI run/version/download and final compiled reruns are recorded below once completed.
