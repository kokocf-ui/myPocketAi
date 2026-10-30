POCKET AI — PACHET DE ACTUALIZARE
BACKEND v96 + FRONTEND 1.0.48
Data construirii: 30.10.2026

REGULA VERSIUNILOR
Această livrare stabilește versiunile din cod și documentație. Nu folosim numerele vechi din README ca punct de plecare. Sursa de bază este ultimul commit preluat din ramura main a repository-ului GitHub; detaliile exacte sunt în BUILD_INFO.txt.

CE SE ÎNLOCUIEȘTE ÎN GITHUB
Repository: kokocf-ui/myPocketAi
Ramură: main
Înlocuiește următoarele 8 fișiere:
1. backend.js
2. index.js
3. README_RO.md
4. README_ROMANA.txt
5. VERSION_LOG.md
6. VALIDATION.txt
7. package.json
8. tests_v96.mjs

Nu încărca folderul backup/. Acesta conține copii de siguranță pentru revenire. Nu modifica wrangler-backend.toml sau wrangler-frontend.toml.

CE ADUCE BACKEND v96
- Exa, Brave Search și Tavily sunt apelate în paralel.
- Numele secretelor sunt exact EXA_API_KEY, BRAVE_API_KEY și TAVILY_API_KEY.
- Dacă un motor eșuează, rezultatele celorlalte sunt păstrate.
- URL-urile duplicate sunt reunite, inclusiv cele care diferă doar prin parametri uzuali de tracking.
- Fragmentele și proveniența fiecărui rezultat sunt reunite; diagnosticele arată starea fiecărui motor.
- AI-ul primește instrucțiuni să verifice jurisdicția, să prefere sursele oficiale pentru legislație și să nu confunde fragmentele cu verificarea independentă a paginii.
- Sunt păstrate GPS-ul, transportul, căutarea locală, istoricul, calculele și cele 10 limbi existente.

CE ADUCE FRONTEND 1.0.48
Se actualizează numai APP.version și CLIENT_CONFIG.version. Nu se modifică interfața, avatarul, vocea, GPS-ul sau comportamentul aplicației.

SECRETE CLOUDFLARE
În Worker-ul lifewise-ai-api trebuie să existe EXA_API_KEY, BRAVE_API_KEY și TAVILY_API_KEY, pe lângă BODS_API_KEY, GEOAPIFY_API_KEY, RTT_API_TOKEN și TFL_APP_KEY. Nu pune valorile cheilor în GitHub și nu le trimite în conversație.

PAȘII DE INSTALARE
1. Salvează separat versiunile actuale backend.js și index.js.
2. În GitHub, înlocuiește exact cele 8 fișiere enumerate mai sus.
3. Publică Worker-ul lifewise-ai-api.
4. Publică Worker-ul lifewise-ai-v2.
5. Deschide endpointul rădăcină al API-ului și verifică version = v96.
6. În aplicație, la Setări → Despre aplicație, verifică Frontend 1.0.48.
7. Testează o întrebare juridică din UK și una din altă țară. Verifică sursele și web_search_diagnostics.providers.

TESTE LOCALE
- node --check backend.js: trecut.
- node --check index.js: trecut.
- npm test: trecut cu răspunsuri simulate pentru toate cele trei motoare.
- S-a confirmat deduplicarea URL-urilor și reunirea fragmentelor.
- Nu s-a făcut test live cu cheile Cloudflare; verificarea live se face după deploy.

ROLLBACK
Folderul backup/ conține backend.js și index.js exacte din repository înainte de această modificare. Dacă apare o problemă, restaurează copiile și republică Worker-ul corespunzător.
