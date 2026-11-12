# Smart Country Registry — integration contract (draft PR #385)

## Design
- One country resolver and one registry, each country has **transport** and **general** branches.
- Country is chosen from an explicit request or verified geocoding, not UI language.
- General search uses existing geo providers restricted spatially to the selected location.
- The registry includes UK-only commercial directories for the UK, not for Romanian or Italian destinations.
- Backend opt-in: `SMART_COUNTRY_REGISTRY_ENABLED=true`; currently filters UK business-directory calls **only for geocoded destinations with verified country codes**. Unknown GPS-only countries preserve legacy behavior.

## Mixed transport
`planMixedTransportSources({stages, enabledProviders})` selects authorized adapters for validated legs, including airport access and destination local transit.
It **does not** fetch flight data, compose an itinerary, verify timetables, or insert invented airport services.
- Each stage is independently country-scoped; intermediate countries are included **only if a verified route actually uses them**.
- A missing flight provider returns `partial_coverage` instead of fake options.
- Existing train, bus and mixed-travel components continue operating unchanged until explicitly integrated and tested.

## Safety
- No new external paid API calls are automatically enabled.
- New country entries without a specialized operator fall back to configured global geographic sources for POIs, not unrelated country operators.
- Credentials remain outside the registry.
- Do not merge or deploy until focused CI, existing POI/transport regressions and manual Romania tests pass.

## Remaining steps before release
1. Verify CI on draft PR #385; inspect failures.
2. Integrate the verified leg-stage selector into the current mixed-journey composer (not done).
3. Confirm the backend's country choice for GPS-only searches through verified reverse geocoding, without a UK network-country fallback.
4. Add/verify country-specific news, events and transport providers; many countries currently have only global map coverage.
5. Turn on the flag in staging and test RO/GB/IT (parking, zoo, shops, hotels, cross-border transfer).
6. Merge/deploy only after regressions are green.
