# Maps / transport public — 26 noiembrie 2026

## Cerere și limite
Transport public primul în Maps; descrierea Deplasare spre… include mașina; audit transport public local și intrări Hoteluri/Maps; alternative numai cu autobuzul; opriri pentru fiecare vehicul; păstrarea mersului pietonal și navigării între schimburi. Incidentul Eva nou nu poate fi reprodus fără întrebarea și răspunsul/captura nouă: nu au fost primite atașamente noi identificabile. Nu este declarat reparat.

## Implementare
- `index.js`: ordinea Maps este Transport public național, Deplasare spre…, Traseu pietonal, celelalte carduri. Descrierea Directions folosește etichetele deja traduse ale selectorului separat (transport mixt + mașină). Motorul acestuia nu este înlocuit cu cel național.
- `tfl_shared_journeys.mjs`: opțiune explicită pentru o interogare bus-only concomitentă cu cea normală; backendul o activează pentru transport public, nu `mixed_journey`. Respectă aceeași dată/oră, filtrează răspunsurile neconforme bus-only, elimină duplicatele exacte. Eșecul unei alternative nu elimină ruta verificată a celuilalt mod. Diagnosticul include modul solicitat. Există un apel suplimentar limitat; nu este promis timp de răspuns identic cu o singură cerere.
- Backend TfL: se păstrează o alternativă numai cu autobuz/autocar când este verificată și limita permite cel puțin două rezultate; validările de destinație, coridor local, acces/departură și transferuri rămân active. Rezultatele rămân ordonate după sosire. Cererile bus_only nu pot afișa tren/metrou.
- Backend TransCAPI: pentru transport public local (maximum 80 km, nu Directions/mixed_journey), cere concomitent și varianta bus_only prin adaptorul existent; păstrează o alternativă verificată fără a inventa un serviciu dacă furnizorul nu returnează nimic.
- `ro_urban_gtfs.mjs`: păstrează o alternativă rutieră locală disponibilă lângă tramvaiele mai rapide. Numără apelurile ordonate din GTFS, nu diferența valorilor stop_sequence (acestea pot avea goluri). Dacă unele apeluri au fost eliminate la validare, numărul rămâne necunoscut.
- `transit_stop_counts.mjs`: contract stopCount întreg pozitiv; definiție: opriri după îmbarcare, inclusiv oprirea unde cobori. TfL: calcul numai când lista operatorului conține ambele capete identificabile, în ordine. Nu deduce numere din timp/distanță; o listă parțială nu dovedește numărul.
- UI comun: numărul și stația de coborâre în fiecare etapă auto/feroviară cunoscută, inclusiv detaliile românești și harta completă. În lipsa informației: „Număr de opriri: neprecizat de furnizor.” Mersul pietonal nu primește număr de opriri. Adaptoarele care nu furnizează un număr verificabil (inclusiv unele răspunsuri Bilo/TransCAPI) rămân explicit necunoscute.
- Hoteluri/Travel și Maps folosesc în continuare backendul și detaliile comune; selectorul Directions, țara GPS, restricția națională, navigarea pietonală, salvarea și reluarea nativă nu sunt înlocuite.

## Verificări executate
- `npm run test:transit-audit`: **19 comenzi PASS**, incluzând scenarii Worker simulate Maps+Travel, TfL cu trei rute pe șine mai rapide și alternativă bus, TransCAPI local în afara Londrei, GTFS cu numere de secvență neconsecutive, cele 7 cazuri GTFS, acces/ultimul segment, navigare completă/relansare, calendar, RO/GB/internațional și regresii UI.
- `npm run check`: PASS.
- Frontend + backend Wrangler **dry-run** PASS; NU publicare.
- `tests_transit_bus_stops_browser.mjs` pe bundle frontend de producție: PASS **360/393/430 px**, ordinea cardurilor, descriere mașină, deschiderea selectorului separat, număr per vehicul și mesaj necunoscut, fără erori runtime.
- Snapshot Android regenerat/verificat: **6,982,621 B < 8,000,000 B**. Este fișier generat ignorat, nu APK semnat livrat.
- Corecție harness în `tests_national_public_transport.mjs`: regex-ul vechi cerea două argumente pentru `rankJourneySuggestions`, deși implementarea HEAD are deja al treilea argument de context; testul verifică acum semnătura reală, fără modificarea algoritmului de geocodare.

## Ce NU dovedește etapa
Nu s-au interogat furnizori reali din sandbox și nu s-au activat țări, chei, fluxuri GTFS sau conexiuni noi. Testele folosesc răspunsuri furnizor controlate și browser real; nu certifică toate rutele naționale și nici navigarea fizică Android. Actualizarea GTFS necesită publicarea separată a routerului său, nu numai backend Cloudflare. Numărul de opriri nu poate fi garantat pentru fiecare furnizor fără date complete.

**Nu s-au făcut deploy, build APK semnat, PR sau merge.** Ultimul APK livrat rămâne 501884, backend live v183. Pentru activarea noilor schimbări este necesară autorizarea publicării și apoi un APK nou >501884, cu aceeași cheie permanentă. Incidentul Eva așteaptă dovezile utilizatorului.
