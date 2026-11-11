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
3. POST https://mcp.bilo.ro/api/v1/search, calea compusă din baza HTTP API publicată pe pagina oficială Bilo Developers (`https://mcp.bilo.ro/api/v1`) și ruta de căutare `/search`, cu origin, destination, date Europe/Bucharest, passengers, mode, railClass, sort și limit.
4. Răspunsul acceptă atât `legs`/`segments`, cât și înregistrări Bilo plate `results` cu `departure_time`, `arrival_time`, `origin`, `destination`, `mode`; ora HH:mm e ancorată strict la data cerută în fusul Europe/Bucharest. Nu inventează transportul, orele ori tarifele.
5. Erorile autentificării, limitei, rețelei/HTTP și răspunsului fără itinerarii verificabile au motive diferite, expuse prin `provider_status.bilo`, fără a expune cheia.
6. Testele unitare pentru JSON, UTC, România/UK și secret/eroare API sunt în tests_ro_national_transit.mjs.

## Neactivat încă
- Nicio cheie BILO_API_KEY nu a fost instalată în cadrul modificării.
- Schema reală a rezultatelor trebuie confirmată în baza răspunsurilor LIVE ale serverului după publicarea codului corectat; testele folosesc doar exemple și simulări, nu demonstrează succesul în producție.
- Condițiile Bilo interzic stocarea persistentă / cache-ul rezultatelor fără acord scris; afișare temporară numai. Înainte de lansare trebuie auditată păstrarea istoricului de rute și a mesajelor Evei pentru a nu arhiva răspunsurile Bilo.
- Transportul urban nu este acoperit doar de furnizorul de trenuri/autocare. Pentru București, Cluj, Iași și Oradea, avem nevoie de surse GTFS/RT aprobate și un planner MOTIS sau OTP propriu/licențiat; nu folosim API-ul comunitar Transitous pentru planul comercial.
- Nu presupunem acoperire integrală pentru microbuze, sate, mijloace de transport fără feed verificabil ori plecări în timp real.

## Ce trebuie să facă titularul proiectului
1. Să verifice la https://developers.bilo.ro condițiile/costul și să creeze cheia API.
2. Să configureze secretul BILO_API_KEY în Cloudflare Worker lifewise-ai-api, niciodată în repo, conversații sau aplicația instalată.
3. Să ruleze manual în aplicație, la o dată viitoare: București → Brașov, Oradea → Cluj-Napoca, Iași → Suceava și un traseu cu schimbare.
4. Să compare rezultatele cu operatorii: tren/autocar, stații, ore, durată, preț și data orarului; apoi se activează testarea publică beta România.

Modulele Asistent AI, Hărți și Transport mixt vor refolosi același motor. Lipsa cheii nu echivalează cu motor activ.

## Remediere 11 noiembrie 2026

- Baza HTTP API publicată la 11.11.2026 pe `https://bilo.ro/en/api` este `https://mcp.bilo.ro/api/v1` (separată de MCP root `https://mcp.bilo.ro`). Adaptorul folosește `POST /search` + Bearer; ruta exactă/cererea trebuie confirmate prin documentația dashboardului sau test cu codul HTTP. Într-o etapă anterioară am folosit hostul eronat `bilo.ro/api/integrations/v1/search`.
- Referință oficială actuală: https://bilo.ro/en/api (secțiunea «Choose how to connect»).
- `BILO_API_KEY` rămâne doar în Cloudflare Worker. **Un APK nou nu este necesar doar pentru acest adaptor backend**; este necesar deploy de backend și test real cu 2 orașe.

## Actualizare conform capturilor Bilo Developers — 11 noiembrie 2026

- Conector HTTP: `POST https://mcp.bilo.ro/api/v1/search`, Bearer `BILO_API_KEY`, antet `Idempotency-Key` (UUID nou pentru fiecare căutare, refolosit numai dacă exact acea căutare trebuie reîncercată).
- Cererea de căutare trimite doar câmpurile exemplificate în documentația furnizorului: `origin`, `destination`, `date`, `mode`, `limit`. Sunt eliminate `railClass`, `sort`, `passengers` din această cerere implicită, pentru că API-ul poate respinge câmpuri necunoscute.
- Când `/search` întoarce înregistrări cu `tripId` fără orar interpretabil, se cere `POST https://mcp.bilo.ro/api/v1/trip-details` cu exact `{ "tripId": "..." }`; maximum 5 detalii pentru o căutare, fără o nouă căutare contorizată. Etapele incomplete nu sunt inventate.
- `tripId` este păstrat identic în corpul JSON, fără includere în URL, loguri, GitHub sau date de diagnostic.
- Documentația arată și o operațiune separată pentru opțiuni de cumpărare; aceasta nu este integrată încă, fiind în afara scopului verificării itinerariilor.
- Captură 11.11: contul Bilo afișa 993/1.000 căutări gratuite rămase (7 contabilizate). Testele automate simulate nu consumă credite; testele reale pot consuma din cotă.
- Nu considerăm această modificare validată end-to-end până când un răspuns real Bilo furnizează etape și ore acceptate; schema completă JSON nu se vede în capturile trimise.
