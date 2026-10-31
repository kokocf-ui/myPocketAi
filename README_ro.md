# myPocket AI — backend v102 + frontend v1.0.71

Actualizare: 31 octombrie 2026.
Bază citită din GitHub: backend.js SHA 9c18b8e6554570b1b74ece46301c8aa46a39f09b; index.js SHA 12de856f2619a5b1c76622239e3a441745018239 (v101 / v1.0.70).

## Instalare

În rădăcina repository-ului `kokocf-ui/myPocketAi`, înlocuiește `backend.js`, `index.js`, `README_ro.md`, `README.md` și `package.json`, apoi adaugă `tests.mjs`. Fișierele din ZIP sunt deja denumite conform configurației existente: backend.js și index.js. Nu modifica fișierele Wrangler, domeniile, secretele sau binding-ul AI.

Publică backend-ul, apoi frontend-ul și reîncarcă aplicația. Workflow-ul GitHub existent pornește publicarea celor două Workers la actualizarea ramurii main. Nu a fost efectuată nicio modificare în GitHub de către asistent.

`package.json` folosește acum `tests.mjs`, inclus în pachet, în locul referinței vechi la fișierul inexistent `tests_v98.mjs`. Fișierul vechi `tests_v96.mjs` nu mai este folosit de npm test; poate fi păstrat ca istoric sau eliminat.

## Problema corectată

Înainte, orașul din mesaj era geocodat numai când nu exista GPS. Astfel, cererea „Caută hoteluri de 5 stele în Berlin, zona centrală” putea întoarce hoteluri din UK.

Acum:

- Destinațiile explicite din formule precum „în Berlin”, „in Berlin”, „near Berlin” sau câmpul location_query au prioritate față de GPS.
- Dacă destinația nu poate fi identificată sau are rezultate ambigue cu importanță apropiată în țări diferite, se cere clarificare și nu se substituie zona GPS. Selecția geocodării rămâne dependentă de răspunsul serviciului; sunt acceptate rezultatele dominante după scorul furnizorului.
- Răspunsul indică zona căutată și raza. Distanțele sunt față de punctul de căutare, nu automat față de telefon.
- „Zona centrală” este o aproximare explicită de 2 km în jurul punctului de referință al destinației returnat de geocodare, nu o delimitare oficială a centrului. Cererea de centru fără oraș cere clarificare.
- Hotelurile pot fi filtrate după o clasificare între 1 și 5 stele, inclusiv 5S ca 5 stele. Sunt folosite metadatele stars din sursele de hartă/Geoapify, nu scorurile de recenzii și nu certificări verificate în timp real. Hotelurile fără clasificare sau cu altă clasificare sunt excluse când există filtru de stele.
- Dacă nu există hoteluri confirmabile pentru filtrul cerut, răspunsul spune acest lucru. Nu se afirmă că nu există asemenea hoteluri în oraș.
- Cererile cu intervale sau valori fracționare de stele cer o singură clasificare, în loc să aplice greșit un întreg.
- Căutările „în apropierea mea” păstrează căutarea GPS.
- Galeria și vizualizatorul de fotografii au fost eliminate din frontend. Siglele și linkurile website/hartă rămân. Sigla este păstrată în dreapta numelui.

Nu se adaugă tarife hoteliere, căutare de camere sau un furnizor de rezervări. Nu se garantează interpretarea tuturor formulărilor libere sau a tuturor limbilor pentru destinații și criterii; regulile noi sunt testate în română și engleză. Traducerea existentă a răspunsurilor în celelalte limbi este păstrată.

## Verificări

- `npm test`: trecut, cu răspunsuri de servicii simulate. Acoperă Berlin cu GPS UK, oraș fără GPS, rază centrală, hoteluri 5/5S/4/fără clasificare, rezultat din UK exclus, destinație lipsă/indisponibilă/ambiguă, căutări lângă utilizator, solicitare de centru fără oraș, fracții de stele și conversație generală.
- `npm run check`: trecut pentru ambele Workers.
- JavaScript-ul extras din HTML-ul generat: sintaxă validă; teste cu DOM simulat pentru antet, resetarea derulării și eliminarea galeriei: trecute.
- Nu s-a făcut test vizual pe telefon sau browser, test cu cheile reale Cloudflare ori verificarea ofertelor reale din Berlin. Acestea se verifică după publicare.

Test pe telefon: „Caută hoteluri de 5 stele în Berlin, zona centrală”. Verifică zona Berlin în răspuns. Este posibil un mesaj că nu pot fi confirmate clasificările din datele disponibile. Apoi testează „Caută benzinării în apropierea mea”.
