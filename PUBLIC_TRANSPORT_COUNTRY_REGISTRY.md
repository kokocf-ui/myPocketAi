# Public transport in the country registry

## Request

User: “Hai să băgăm și în registrul țărilor transportul public”.
This stage registers public transport and the new European surface source;
it does not authorize deployment, a paid service or countrywide coverage claims.

## Registry changes

- Smart Country Registry v3 recognizes `public_transport`, “public transport”
  and “transport public” as transport categories, not general/POI searches.
- All 49 existing European country profiles retain their original urban and
  domestic intercity adapters. New supplementary and international source lists
  register `open_surface_gtfs` separately from those domestic planners.
- `public_transport_sources.mjs` provides the shared FlixBus/FlixTrain source
  identity, coach/train modes, licence and release requirements, observed source
  evidence, default-OFF state and configuration predicate.
- The same predicate is used by the timetable asset loader and the registry's
  configured-provider inventory: the explicit flag AND callable asset binding
  are required. Merely adding the catalog record does not load a feed or call
  a provider. Configured still means pending feed validation, not active coverage.
- European source catalog v2 includes the implemented-but-gated source, while
  catalog entries remain metadata rather than authority to make requests.
- Country coverage exposes registered/configured supplementary sources,
  international candidate IDs and source-specific limits. Existing
  `urban_configured`, `intercity_configured`, `configured_adapters` and national
  `supported` semantics remain domestic and unchanged.

## Important boundaries

The operator's European dataset is a selected network, not every country's
public transport. Registration under a country means a source candidate to be
checked against actual loaded stops and service dates. It is not evidence that
that country has service. Source-stop observations are explicitly limited to
GB, FR, CZ, DE and RO from the earlier actual-source work; the complete synthetic
GB→RO path was verified through replay of real responses, not all domestic
routes in any of those countries. Other countries remain unverified.

The source is never offered for urban routes, flights, ferries, walking,
driving or airport-access stages. Cross-border public requests do not dispatch
to both countries' urban networks. Requests outside the registered European
scope do not select the source. The national GPS-country policy still blocks
cross-border destinations, selects its existing domestic planner once and does
not unlock an unsupported domestic search merely because Flix is registered.
Germany/HERE and all other existing activation/budget policies are unchanged.

## Validation

- `tests_public_transport_country_registry.mjs`: all 49 profiles; disabled,
  missing binding and configured states; source/mode/country separation; honest
  observed versus unverified coverage; real Worker country-metadata endpoint
  with simulated reverse geocoding. No index fetch or transport-provider call.
- `npm run test:national-transport`: PASS, including existing HERE, Germany,
  FI/EE, Norway, Romania, GB, GPS and country dispatch regressions.
- `npm run test:mixed-orientation`, `npm run check`, generated frontend boot,
  backend Wrangler **dry-run**: PASS.
- Existing scheduled fixture in `tests_national_transport_expansion.mjs` now
  freezes its clock through the test context; advancing real time must not make
  the fixed test departure stale. Production date validation was not weakened.

No live probes, deployment, new APK, feature flag/asset binding activation,
paid service, HERE use, Oracle change or main merge in this stage. The free
Worker resource and PAN/ODbL release gates in `OPEN_SURFACE_RUNTIME.md` remain.
