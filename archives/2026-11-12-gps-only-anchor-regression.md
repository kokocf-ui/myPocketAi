# QA — Geopoziție ca unic reper implicit (12.11.2026)

## Regulă aprobată
- Fără destinație explicită: **numai coordonatele GPS valide din cererea curentă** constituie reperul de căutare.
- Cu destinație explicită: destinația cerută are prioritate și se geocodifică independent; dacă este ambiguă se cer clarificări.
- Fără destinație și fără GPS valid: se solicită locație sau localitate, fără presupunere de țară.
- Țara rezultată din geocodificare poate alege furnizorii, dar nu este niciodată reper implicit.
- Nu se deduce țara din naționalitate, limba interfeței, loc de naștere, IP sau loc de înregistrare.

## Fișiere implementare pe ramura feature/smart-country-registry
- `country_search_anchor.mjs` — unicul contract de ancorare implicită.
- `country_gps_resolution.mjs` — reverse geocoding pentru cod țară, numai dacă registrul este activat și API Geoapify este configurat.
- `country_frontend_request.mjs` — selecție furnizori pe țara verificată și categorie.
- `backend.js` — legătura reală în `/api/chat` pentru căutările de locuri; fluxurile de transport sunt păstrate.
- `tests_country_search_anchor.mjs`, `tests_country_gps_resolution.mjs`, `tests_country_frontend_request.mjs`, `tests_country_backend_live_path.mjs` — validare unitară și integrare cu răspunsuri simulate.

## Dovezi CI
Commit verificat: `2bc51d4a729acce20077dacf766e3330f5c47aef`.

- Workflow „Smart Country Registry — isolated verification”, run **43327125365**, job **131562300813**: **SUCCESS**.
- Pașii Syntax check, Country and mixed stage routing, Frontend to backend request routing, Real Worker request contract (mock providers), Adapter scoping, Existing parking and zoo regression, Existing UK/worldwide place and transit regressions: **SUCCESS**.
- „UK nationwide transport regression”, „Romania urban GTFS route tests”, „Romania and UK transport screenshot regressions”, „Transport price and seats uncertainty”: **SUCCESS** la verificare.
- Rezultatele confirmă codul și regresiile simulate, **NU** că serviciile externe sunt accesibile pe telefon.

## Limitări / decizie de publicare
- `SMART_COUNTRY_REGISTRY_ENABLED` rămâne **dezactivat implicit**. Nu s-a modificat versiunea de producție.
- Reverse geocoding GPS este o cerere externă suplimentară, cu timeout în cod de 1,8 secunde; verifică performanța și consumul de credit înainte de activare.
- Transportul mixt A→B și alte module ce nu intră în fluxul POI nu au fost mutate la noua regulă; au teste de regresie, dar necesită audit/integrări distincte.
- Urmează teste **live** în Grays și Oradea cu flag-ul activ într-un mediu de test, inclusiv erori, raze, dubluri și latență.
- Nu se execută merge/deploy fără verificarea mediului de test și aprobarea proprietarului.
