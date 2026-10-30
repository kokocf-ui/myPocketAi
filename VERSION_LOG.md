# Version log

## 2026-10-28 — Frontend v1.0.33 + backend v89
- Corrected frontend `APP.version` from 1.0.32 to 1.0.33.
- Kept `CLIENT_CONFIG.version` at 1.0.33.
- Kept the known existing backend endpoint `https://lifewise-ai-api.kokocf.workers.dev/api/chat`; no speculative endpoint change.
- Preserved backend v89 source unchanged.
- Added explicit Wrangler configurations for the existing frontend and backend Worker names.


## 2026-10-28 — Frontend v1.0.34 + backend v90 (prepared replacement)
- Frontend: results panel fills the available mobile sheet; result list scrolls independently; added layered gradients, inset highlights, and depth/pressed states to the results surface and controls.
- Backend: added a distinct `pub` search category ahead of the general restaurant category; separated Geoapify category classification and Photon filtering so pub/bar/biergarten results are not intentionally mixed into restaurant searches.
- Preserved API endpoint, GPS payload handling, 5 km radius, routing, and existing provider architecture.
- Validation: syntax checks and static checks performed before packaging. Live provider result quality and Cloudflare deployment still require runtime testing.

## 2026-10-30 — Backend v96 + Frontend 1.0.48
- Rebuilt from the latest `main` branch snapshot fetched directly from GitHub; version numbers in previous README files were not used as source-of-truth.
- Backend: parallel Exa, Brave Search and Tavily adapters using `EXA_API_KEY`, `BRAVE_API_KEY`, and `TAVILY_API_KEY`.
- Provider failures are isolated; successful providers continue to contribute results.
- Canonical URL deduplication removes common tracking parameters; excerpts and provider provenance are merged.
- Added per-provider diagnostics to `web_search_diagnostics.providers`.
- Strengthened grounding instructions for jurisdiction, official primary sources, publication dates and limitations of search snippets.
- Frontend: version identifiers only updated to 1.0.48; no UI or behavior changes.
- README_RO.md, README_ROMANA.txt and VALIDATION.txt rewritten to match the actual delivered code and exact upload list.
- Automated mock tests and syntax checks pass; live Cloudflare API validation remains pending deployment.
