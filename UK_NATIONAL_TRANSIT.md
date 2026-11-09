# UK nationwide mixed transport — integration (draft)

The existing TfL journey planner handles London corridors. The nationwide planner handles door-to-door journeys within Great Britain when at least one endpoint is outside the London corridor.

## Activation

1. Create a free account at https://www.transcapi.com/ and generate an API key. Free tier: 100 calls/day, no card, subject to provider policy.
2. Add the key to the Cloudflare backend Worker as a secret named TRANSCAPI_API_KEY (for example: wrangler secret put TRANSCAPI_API_KEY in the correct Worker environment). Never paste it into GitHub, the APK, or a public chat.
3. Deploy the backend only after CI passes and an actual Manchester route has been tested. The frontend already supports the transit itinerary response structure; check it on Android before rollout.
4. Test Grays → Vale Lane, Manchester and at least one other UK city; check alternatives, chronological ordering, transfer times, stop names, final-mile walking and attribution. Recheck London to avoid regressions.

## Safety and limitations

- No API key: preserves previous behaviour. The solution is not live until the secret is configured.
- API failure, provider 429, no journeys: does not manufacture timetables. Existing fallback explains that national live service is not verified.
- Only Great Britain is handled; this integration is not yet a UK-to-Europe transport or flight planner.
- No map polyline is fabricated: route_geometry_available=false until a decoder is verified against real responses.
- Scheduled departures and live estimates are distinct; never label all times live.
- Incomplete fares are labelled as lower bounds.
- Verify rail trips, intermediate transfers, and final-mile walk against a real API response before production.
- No paid subscription is enabled.

References: https://www.transcapi.com/docs/journey and https://www.transcapi.com/pricing .
