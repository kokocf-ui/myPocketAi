# Pocket AI — Backend v98

Arhivă de actualizare completă, construită pe backend-ul v97 din Biblioteca utilizatorului. Aceasta este o actualizare exclusiv pentru backend.

## Fișiere
- `backend.js` — fișier complet pentru înlocuirea backend-ului existent.
- `tests_v98.mjs` — teste automate cu răspunsuri și servicii externe simulate.
- `package.json` — comenzile de verificare.
- `CHANGELOG.txt` — istoricul modificărilor.
- `TEST_REPORT.txt` — rezultatele testelor locale.
- `SHA256SUMS.txt` — amprentele SHA-256 ale fișierelor livrate.

## Modificări v98
- Întrebările generale despre ce poate face asistentul sunt tratate conversațional și nu mai declanșează automat căutarea web.
- Căutarea explicit solicitată (`search_web: true`) continuă să funcționeze.
- Sursele recuperate rămân disponibile în câmpul structurat `sources` al răspunsului API, pentru verificare și utilizare internă.
- Backend-ul nu mai adaugă automat în textul conversației o listă „Surse consultate”, URL-uri și titluri de pagini.
- Instrucțiunile modelului precizează că sursele se afișează în text numai dacă utilizatorul le cere explicit.
- Sunt păstrate logica GPS, geocodarea, transportul, căutarea locală, calculele, cele 10 limbi și furnizorii Exa/Brave/Tavily.

## Secrete Cloudflare
Sunt folosite aceleași secrete, fără valori incluse în arhivă:
- `EXA_API_KEY`
- `BRAVE_API_KEY`
- `TAVILY_API_KEY`

## Instalare
1. Păstrează arhiva ca backup.
2. În Cloudflare Workers, deschide worker-ul backend Pocket AI.
3. Înlocuiește integral codul worker-ului cu `backend.js` din arhivă.
4. Salvează și publică worker-ul.
5. Verifică endpoint-ul rădăcină: versiunea trebuie să fie `v98`.
6. Testează o întrebare generală („Ce poți face pentru mine?”) și una care cere informații actuale.

Nu este necesară modificarea frontend-ului pentru acest update backend. Gestionarea butonului Înapoi al telefonului va fi o actualizare separată de frontend.

## Verificare locală
```bash
node --check backend.js
node tests_v98.mjs
```

Testele folosesc servicii externe simulate. Ele nu garantează funcționarea cheilor, cotelor sau serviciilor live din Cloudflare. Publicarea și testarea pe telefon trebuie făcute după încărcarea arhivei.
