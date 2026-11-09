# Door-to-door public transport: GB, Ireland, Netherlands and Belgium (draft)

## What the existing key can do
- Great Britain: England, Scotland and Wales — rail, bus, coach, underground, metro, tram and ferry.
- Whole island of Ireland: Republic of Ireland and Northern Ireland, including Belfast to Dublin.
- Netherlands and Belgium: a shared planning area; Amsterdam to Brussels is possible.
- All three ARE SEPARATE ROUTING GRAPHS. Great Britain to Ireland or Great Britain to Belgium cannot be returned as one TransCAPI itinerary. For cross-graph and onward European journeys use a separate authorized international planner such as the existing optional MOTIS v6 adapter.
- The Worker tries the provider only when both verified points are in one area; London-only TfL journeys retain their own existing route path. Bad or missing timetable responses are not fabricated.

## Activation and cost safety
- The user reports that the API key is already saved in Cloudflare. Verify the backend Worker lifewise-ai-api has a secret named TRANSCAPI_API_KEY; do not disclose the value, duplicate it into GitHub or enter it in an APK.
- No paid service/subscription is enabled by this PR. Free request limits still apply. API key presence in Cloudflare does not itself deploy this code.
- Do not merge or deploy until dedicated CI, live provider results, on-device UX and route verification are complete.

## Validation checklist
1. Manchester: Grays to Vale Lane; verify 1–4 actual available alternatives, named rail/bus/tram stops, chronological ordering, walking from the last stop to the final address and official service times.
2. Verify the local-only route in London still uses TfL rather than national routing.
3. Verify Belfast to Dublin, Amsterdam to Brussels; display the local origin timezone (Europe/Dublin, Europe/Amsterdam), don't invent fares or convert unpriced journeys to GBP.
4. Verify Grays to Dublin and London to Brussels do NOT present fictitious through-services or waste free-tier TransCAPI calls; the authorized MOTIS provider, if configured, can be attempted separately.
5. Validate date, cancelled/partly cancelled legs, real vs scheduled, fare completeness, 429 quota, 422 coverage, 503 outages, and walking buffer.
6. Check route line geometry with real provider responses before claiming an interactive full route. Currently the app intentionally returns geometry unavailable for this adapter.
7. Check licensing and attribution in the Android interface (see TransCAPI data-sources page); real timetable data is source-attributed.
8. Validate the selected A-to-B origin field is sent as an explicit transit origin rather than silently using GPS in all cases; this is a separate pending frontend/backend audit.

## International routes beyond regional coverage
- Existing MOTIS v6 adapter is optional: MOTIS_API_BASE_URL must point to a legitimately permitted/owned server with international data. Transitous's volunteer public API explicitly disallows commercial use.
- Train, flight, bus/coach and ferry legs must be combined using independent licensed suppliers and validated connection time, date/timezone and last-mile walking. Never fabricate connections.
- Grays to Oradea (including air options) is NOT functional in the current PR.

Sources: https://www.transcapi.com/docs/journey ; https://www.transcapi.com/docs/data-sources ; https://transitous.org/api/ .
