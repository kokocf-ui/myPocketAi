# myPocket AI — backend v107 + frontend v1.0.76

31 octombrie 2026. Pachet cumulativ: include corecțiile din v106/v1.0.75 încă neîncărcate. Instalează direct acest pachet, fără instalarea intermediară a v106. Baza verificată este codul GitHub v105/v1.0.74, peste care sunt păstrate toate modificările pregătite pentru v106.

## Instalare

Înlocuiește în rădăcina repository-ului `backend.js`, `index.js`, `README.md`, `README_ro.md`, `package.json`, `tests.mjs`, `tests_reader.mjs`. Păstrează configurațiile Wrangler, numele Workers, domeniile, secretele și binding-ul AI. Publică backend-ul apoi frontend-ul și reîncarcă aplicația. Asistentul nu a modificat GitHub și nu a publicat aplicația.

## Cauzele corectate

Mesajele tastate în modulul Hărți nu transmiteau identificatorul modulului. Unele cereri plecau înainte de obținerea primei poziții GPS. În plus, căutarea localităților putea prelua destinația unui traseu pietonal și respinge un punct de interes precum un shopping centre. Completarea „Grays UK” nu era legată în mod fiabil de destinația cerută anterior.

## GPS

- Cererile care au nevoie de locație așteaptă până la 4 secunde pentru prima poziție disponibilă; actualizarea poate continua ulterior în fundal.
- Actualizările GPS simultane reutilizează aceeași cerere. Timeout-ul sau indisponibilitatea temporară nu șterg o poziție recentă.
- Pozițiile memorate până la 10 minute pot fi folosite ca rezervă, cu actualizare în fundal. Cele mai vechi de 2 minute sunt descrise de backend ca ultima poziție GPS disponibilă; după 10 minute se cere actualizare/plecare.
- Refuzul permisiunii șterge locația memorată. Resetarea conversației nu șterge GPS-ul.
- Backend-ul acceptă câmpul location sau coordinates și tolerează o diferență mică între ceasul telefonului și al serverului.
- Un eșec de identificare a destinației este raportat separat de lipsa GPS-ului.

## Trasee și completări

- Traseele pietonale/auto explicit cerute sunt procesate în asistent și în Hărți prin aceeași cale de rutare. Modulul este transmis și pentru mesajele tastate.
- Destinațiile de traseu pot fi puncte de interes sau adrese, nu doar localități. Se folosește Geoapify Geocoding, cu apropiere de GPS și filtru de țară când țara este explicită.
- La „Arată-mi un traseu pietonal până la grays shopping center”, dacă destinația nu este identificată, „Grays UK” completează aceeași cerere. Nu se cere un alt oraș din jurul Grays doar pentru că mesajul este scurt.
- Contextul traseului păstrează destinația, modul și clarificările. Este transmis între frontend/backend și salvat cu conversația. Nu se păstrează geometria completă în istoricul local; ea rămâne în memoria conversației curente.
- „Afișează pe hartă traseul sau traseele pe care trebuie să le urmez” reutilizează geometria traseului disponibil. Dacă există doar contextul, backend-ul încearcă să recalculeze ruta. Fără un mod cunoscut se cere pietonal/auto; fără destinație se cere destinația.
- Nu se desenează o linie dreaptă prezentată ca traseu rutier. Harta folosește geometria efectiv returnată de serviciul de rutare. Un răspuns de distanță rutieră păstrează geometria dacă furnizorul o include.

## Harta

Răspunsurile cu geometrie validă au buton „Vezi traseul pe hartă”. Fereastra se deschide deasupra barei de navigare, care rămâne în poziția existentă. Harta folosește Leaflet 1.9.4 încărcat la cerere de pe unpkg.com și hărți de bază OpenStreetMap. Nu sunt necesare chei noi. Controalele sunt traduse în cele 10 limbi existente.

Dacă biblioteca/harta nu se încarcă, rămâne un link către Google Maps. Acest serviciu extern poate recalcula ruta; nu se promite că ruta sa este identică cu geometria Geoapify afișată în aplicație.

Se păstrează fereastra de lectură, previzualizarea de 4 rânduri, linkurile, siglele și notificările care nu acoperă tastarea. Fotografiile rămân eliminate. Corecțiile de țară, localități ambigue, stele și distanță din v105/v106 sunt incluse.

## Verificări

`npm test` și `npm run check` trec. Sunt teste cu servicii/browser simulate, inclusiv:

- cererea exactă pentru Grays Shopping Centre și completarea „Grays UK”;
- păstrarea GPS-ului când destinația nu este găsită;
- traseu pietonal vs auto, cererea ulterioară de afișare pe hartă și lipsa geometriei;
- așteptarea primei poziții, păstrarea la timeout, ștergerea la refuzul permisiunii, actualizări comune, poziție sosită târziu și expirare;
- desenarea coordonatelor reale ale furnizorului pe o suprafață Leaflet simulată, eliberarea hărții și redeschiderea fără un nou apel GPS/API;
- transmiterea modulului/contextului de traseu prin handlerul real de chat;
- toate regresiile anterioare de localități, hoteluri, distanțe, citire și notificări.

Scriptul client extras din HTML-ul generat este compilat în teste. Nu s-a efectuat test vizual pe telefon/browser sau apel live cu cheile Cloudflare. Testul Leaflet este simulat, deci disponibilitatea CDN-ului, a hărților și aspectul final trebuie verificate pe telefon.

Test după publicare: solicită traseul pietonal către Grays Shopping Centre; completează Grays UK dacă este cerut; apoi cere afișarea pe hartă. Testează și distanța rutieră din locația mea până în Amsterdam, cu alegerea țării dacă este necesar.
