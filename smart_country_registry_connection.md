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

## Europe-wide source catalog (2026-11-12)
- `europe_country_sources.mjs`: 49 country/territory profiles, each with transport and general-search branches.
- National sources are curated where identified (Romania: rail, Bilo attribution, Infofer, CNADNR/NAP, Ministry of Health pharmacy register, licensed tourism accommodation reports; France NAP; Germany DELFI; Italy multimodal NAP; Ireland NTA; Belgium SNCB; Czechia Prague PID; Norway Entur; Sweden Trafiklab; Finland Digitransit; Switzerland Swiss open transport; Austria transport association data; Netherlands NDOV; Spain Hermes; UK bus data/TfL; France open data).
- Global Geoapify/Photon and opt-in TomTom remain category-based, spatially bounded. European Commission NAP listing is **metadata/discovery**, not a journey planner or API.
- No API key, paid query, scraping permission, or commercial license is implied by a source's presence in the catalog.
- Zero dedicated entries for a country means global mapped POIs and the European NAP discovery link only, **not** verified national transport coverage.
- `smart_country_registry.mjs` exports `europeanCountrySources(countryCode)` to query the metadata without network calls.

### Next integration gates
1. Validate release and commercial-use permissions for country datasets and new local registries.
2. Integrate provider adapters one at a time, ensuring no regression to existing routes.
3. Add source-level health statuses, timestamps, coverage regions, and diagnostics.
4. Add explicit source selection by validated request destination for GPS-only and international trips.
5. Verify itinerary connections, actual times, flight/coach schedules, and local airport legs; catalog alone does not supply them.

## 12.11.2026 — UK și paritate internațională
- Regatul Unit este în registrul comun, **nu** un motor separat și nici un caz preferențial.
- Transport UK: TfL pentru zona Londrei și adaptorul existent `uk_national_transit`; catalogul include acum explicit ambele surse și datele feroviare/bus de referință.
- Căutări generale UK: Geoapify/Photon ca oricare altă țară; sursa locală `uk_food_retailers` doar pentru categorii și țară compatibile; catalogată și Food Standards Agency.
- `tests_smart_country_registry.mjs` compară aceeași solicitare RO/GB/IT/FR și verifică izolarea furnizorilor locali.
- Locul nașterii, naționalitatea, limba interfeței și țara în care a fost creat contul **nu decid** furnizorii. Contează țara/locul cerut explicit, sau țara verificată a locului relevant.
- Nu s-a schimbat codul live de transport, nu s-a făcut merge sau deploy. Rulează CI și teste pe dispozitiv înainte de activare.
