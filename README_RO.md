# MyPocketAI — pachet corectat frontend v1.0.33 + backend v89

## Corecții aplicate
- `index.js`: `APP.version` este acum `1.0.33`, în acord cu antetul și `CLIENT_CONFIG.version`.
- Adresa API a fost păstrată la `https://lifewise-ai-api.kokocf.workers.dev/api/chat`, deoarece acesta este backendul existent indicat de sursa originală. Nu s-a schimbat către un Worker nou/neconfirmat.
- Configurațiile Wrangler folosesc numele Worker-elor existente menționate în proiect: `lifewise-ai-v2` și `lifewise-ai-api`.
- Backendul v89 este păstrat din sursa furnizată, fără modificări funcționale.

## Publicare
Fișierele sunt surse Cloudflare Workers, chiar dacă sursa frontend originală a fost numită `index.html`. În acest pachet, frontendul este `index.js` pentru a fi clar identificat ca intrare Worker.

Din directorul extras, frontend:
`npx wrangler deploy --config wrangler-frontend.toml`

Backend:
`npx wrangler deploy --config wrangler-backend.toml`

Publicarea necesită autentificare Wrangler în contul Cloudflare corect. Nu publica backendul dacă nu dorești să-l actualizezi acum. Verifică întâi existența binding-urilor/secrets folosite de backend (inclusiv `AI`, `GEOAPIFY_API_KEY` și cheile transportului folosite în cod). Nu include cheile secrete în GitHub.

## Limitări verificate
- Verificarea sintaxei nu confirmă că deploy-ul a reușit sau că endpointul API răspunde corect.
- Nu am modificat și nu am putut publica direct în contul Cloudflare.
