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
