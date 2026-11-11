# România — integrare transport public (11 noiembrie 2026)

## Surse verificabile
- Transport UK: TransCAPI și TfL nu acoperă România.
- București–Ilfov: TPBI GTFS / GTFS-Realtime — https://gtfs.tpbi.ro/regional/
- Cluj-Napoca: GTFS oficial CTP Cluj — https://external.gtfs.ro/cluj/CLUJ.zip
- Iași: CTP/Tranzy Open Data — https://tranzy.ai/opendata
- Național trenuri și autocare: Bilo, https://bilo.ro/en/api și https://developers.bilo.ro; pentru aplicații proprii este necesară o cheie de integrare, potrivit documentației furnizorului. Datele sunt orare publicate, nu disponibilitate de locuri confirmată.
- Pentru orice feed trebuie verificate licența, actualizarea și atribuirea.

## Implementat în sursa proiectului
1. Adaptor separat: ro_national_transit.mjs; cererile românești nu sunt trimise la TfL/TransCAPI.
2. Cheia BILO_API_KEY este citită exclusiv din secretele Cloudflare Workers; interfața Android/JS nu primește cheia.
3. POST https://mcp.bilo.ro/api/v1/search cu origin, destination, date Europe/Bucharest, passengers, mode, railClass, sort și limit.
4. Răspunsul este acceptat doar dacă are etape, operator/linie când este prezent, stații, tip de transport și ore verificabile. Datele lipsă nu sunt inventate.
5. Fără provider sau fără rezultate valide, răspunsul este neconfirmat și explică motivul.
6. Testele unitare pentru JSON, UTC, România/UK și secret/eroare API sunt în tests_ro_national_transit.mjs.

## Neactivat încă
- Nicio cheie BILO_API_KEY nu a fost instalată în cadrul modificării.
- Schema reală a rezultatelor trebuie confirmată în baza răspunsurilor serverului după conectarea cheii.
- Transportul urban nu este acoperit doar de furnizorul de trenuri/autocare. Pentru București, Cluj, Iași și Oradea, avem nevoie de surse GTFS/RT aprobate și un planner MOTIS sau OTP propriu/licențiat; nu folosim API-ul comunitar Transitous pentru planul comercial.
- Nu presupunem acoperire integrală pentru microbuze, sate, mijloace de transport fără feed verificabil ori plecări în timp real.

## Ce trebuie să facă titularul proiectului
1. Să verifice la https://developers.bilo.ro condițiile/costul și să creeze cheia API.
2. Să configureze secretul BILO_API_KEY în Cloudflare Worker lifewise-ai-api, niciodată în repo, conversații sau aplicația instalată.
3. Să ruleze manual în aplicație, la o dată viitoare: București → Brașov, Oradea → Cluj-Napoca, Iași → Suceava și un traseu cu schimbare.
4. Să compare rezultatele cu operatorii: tren/autocar, stații, ore, durată, preț și data orarului; apoi se activează testarea publică beta România.

Modulele Asistent AI, Hărți și Transport mixt vor refolosi același motor. Lipsa cheii nu echivalează cu motor activ.
