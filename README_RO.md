# Pocket AI — Backend v96 / Frontend 1.0.48

**Pachet construit din fișierele reale ale ramurii `main` din GitHub, la commitul indicat în `BUILD_INFO.txt`.** Numerele de versiune sunt stabilite de această livrare și nu sunt deduse din README-urile existente.

## Ce aduce actualizarea

### Backend v96
- Caută în paralel prin Exa, Brave Search și Tavily, dacă secretele respective sunt configurate.
- Folosește exact numele secretelor Cloudflare: `EXA_API_KEY`, `BRAVE_API_KEY`, `TAVILY_API_KEY`.
- O eroare a unui motor nu anulează rezultatele celorlalte motoare.
- Normalizează URL-urile și elimină duplicatele, inclusiv variantele cu parametri uzuali de tracking.
- Unește fragmentele și proveniența surselor; preferă rezultatele returnate de mai multe motoare și cele cu fragmente informative.
- Include starea fiecărui furnizor în `web_search_diagnostics.providers`.
- Instrucțiunile AI cer să distingă data publicării de data verificării, să țină cont de jurisdicție și să prefere sursele oficiale pentru legislație, guvern, sănătate și siguranță.
- Nu declară că o pagină a fost verificată live doar pentru că URL-ul apare în rezultate. Fragmentele sunt dovezi de căutare, nu verificare independentă a întregii pagini.
- Păstrează fluxurile existente pentru GPS, transport, căutare locală, istoric, calcule și cele 10 limbi.

### Frontend 1.0.48
- Actualizează numai identificatorul versiunii în `APP.version` și `CLIENT_CONFIG.version`.
- Nu schimbă interfața, avatarul, vocea, GPS-ul, navigarea sau comportamentul aplicației.

## Secrete Cloudflare

În Worker-ul `lifewise-ai-api`, la Settings → Variables and Secrets, trebuie să existe:
- `EXA_API_KEY`
- `BRAVE_API_KEY`
- `TAVILY_API_KEY`
- `GEOAPIFY_API_KEY`
- `BODS_API_KEY`
- `RTT_API_TOKEN`
- `TFL_APP_KEY`

Nu introduce cheile în GitHub și nu le include în fișierele proiectului. Cele trei chei de căutare sunt opționale individual; backendul folosește motoarele care sunt configurate.

## Fișiere de înlocuit în GitHub

În repository-ul `kokocf-ui/myPocketAi`, ramura `main`, înlocuiește exact:
1. `backend.js`
2. `index.js`
3. `README_RO.md`
4. `README_ROMANA.txt`
5. `VERSION_LOG.md`
6. `VALIDATION.txt`
7. `package.json`
8. `tests_v96.mjs`

Nu încărca folderul `backup/`; copiile sunt doar pentru revenire locală. Nu modifica fișierele `wrangler-*.toml`.

## Publicare și verificare

1. Înainte de înlocuire, descarcă și păstrează copiile curente ale `backend.js` și `index.js`.
2. Încarcă fișierele enumerate mai sus în GitHub.
3. Publică Worker-ul `lifewise-ai-api` și Worker-ul `lifewise-ai-v2` din Cloudflare.
4. Verifică endpointul rădăcină al API-ului: trebuie să raporteze `version: "v96"`.
5. În frontend, secțiunea „Despre aplicație” trebuie să raporteze `1.0.48`.
6. Testează întrebări factuale și juridice în două jurisdicții diferite; verifică sursele, datele, linkurile și `web_search_diagnostics.providers`.

## Teste efectuate înainte de livrare

- `node --check backend.js` — trecut.
- `node --check index.js` — trecut.
- `npm test` — trecut cu răspunsuri simulate pentru Exa, Brave și Tavily.
- Testul confirmă apelarea simultană a celor trei motoare, deduplicarea URL-urilor cu tracking și reunirea fragmentelor/provenienței.
- Nu s-a făcut încă un test live cu cheile private Cloudflare; acesta trebuie făcut după publicare.

## Revenire

Folderul `backup/` din arhivă conține exact fișierele anterioare extrase din commitul GitHub de bază. Pentru rollback, restaurează fișierele corespunzătoare și republică Workers.
