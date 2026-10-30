POCKET AI — BACKEND v94
Data: 30.10.2026

CE SE ÎNLOCUIEȘTE
- În repository-ul GitHub kokocf-ui/myPocketAi, în ramura main, înlocuiește DOAR fișierul backend.js cu backend.js din acest ZIP.
- Nu înlocui index.js și nu modifica alte fișiere.
- Păstrează o copie separată a backend.js actual înainte de înlocuire.

CE ADUCE v94
1. Versiunea API devine v94.
2. Backend-ul recunoaște codurile: ro, en, fr, de, it, es, pt, nl, ru, pl.
3. Calculatorul folosește formatarea numerică locală și răspunsuri traduse pentru toate cele 10 limbi.
4. Răspunsurile fixe din modulele existente pot fi traduse în limba selectată prin modelul AI. Dacă traducerea eșuează, răspunsul include translation_status pentru diagnostic.
5. Adaugă cercetare web generală prin Exa Search API, cu extrase de pagină, titlu, data publicării și URL-uri.
6. Răspunsul include sursele și linkurile în textul reply, plus câmpul JSON sources și web_search_status.
7. Când căutarea nu este configurată, nu reușește sau nu găsește rezultate, backend-ul nu pretinde că a verificat internetul.
8. Păstrează ramurile existente pentru transport public, rute pietonale, GPS, căutare locală și calcule.

CONFIGURARE NECESARĂ PENTRU CĂUTAREA WEB LIVE
- În Cloudflare Dashboard, deschide Worker-ul API Pocket AI.
- La Settings / Variables and Secrets, adaugă un secret cu numele exact EXA_API_KEY.
- Valoarea trebuie să fie cheia API Exa creată în contul Exa. Nu o introduce în cod și nu o trimite în conversație.
- Salvează/deploy după adăugarea secretului.
- Fără acest secret, backend-ul funcționează, dar web_search_status va fi not_configured și răspunsul va preciza că sursele actuale nu au putut fi verificate.

IMPORTANT DESPRE LIMBI
- Backend-ul acceptă acum 10 coduri de limbă.
- Interfața frontend curentă nu a fost modificată în acest pachet; selectorul ei trebuie actualizat separat pentru a permite alegerea limbilor rusă și poloneză.
- Nu am modificat avatarul, vocea, animația, index.js sau comportamentul de afișare/ascundere.

VERIFICĂRI EFECTUATE
- node --check backend.js: trecut.
- Test API root: v94 și lista de 10 limbi.
- Test calculator cu language=pl: trecut.
- Test căutare web cu răspuns Exa simulat: sursă returnată și link adăugat în răspuns.
- Test traducere răspuns fix în franceză: trecut.
- Testele folosesc răspunsuri simulate; nu reprezintă o verificare live a contului Exa sau a secretelor Cloudflare.

FIȘIER DE REVENIRE
- backup/backend_v94.js este copia completă a fișierului livrat.
- Înainte de înlocuire, păstrează și backend.js anterior (v93) din repository pentru rollback.
