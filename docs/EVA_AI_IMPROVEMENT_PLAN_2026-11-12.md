# Eva — îmbunătățiri AI și sincronizare avatar (2026-11-12)

## Principii
- Un singur orchestrator pentru Asistent, Educație, Transport și restul modulelor; păstrează modulele existente, fără rutare duplicată.
- Contextul conversațional nu este dovadă factuală. Pentru prețuri, orare, știri, locuri disponibile și date actuale, folosește surse și date actualizate.
- Când sensul este incert, pune o singură întrebare despre informația lipsă. Nu inventa răspunsul.
- Preferințele permanente și memoria inter-conversații cer opt-in, editare/export/ștergere, izolarea pe utilizatori, minimizarea datelor și protecția informațiilor sensibile.
- Fără bucle de teste persistente și fără testare automată în fundal. O singură versiune APK integrată după verificările codului.

## Priorități / criterii de acceptare
### P0 — sincronizarea buzelor
- Android: animația nu pornește în `onBeginSynthesis`; pornește în `onStart`.
- Fiecare propoziție este rostită ca segment TTS separat, în aceeași limbă/voce. La finalul fiecărui segment se închide imediat gura; între propoziții rămâne închisă.
- La terminarea ultimei propoziții închiderea este instantanee; nu se reciclează ultimele cuvinte. Erori, întreruperi și ieșire forțată opresc animația.
- Teste pe APK Android, inclusiv: începutul salutului; pauza după „myPocket AI”; sfârșitul întrebării; prima instalare și lansări repetate; română și engleză; întrerupere la mijloc.
- Note: delimitarea pe propoziții rezolvă pauzele mari, dar NU este încă sincronizare fonetică/audio pe fiecare silabă. Dacă teste vizuale detectează decalaje, măsurăm start/stop cu timestampuri și trecem la marcaje bazate pe audio.

### P1 — context și clarificări
- Identificarea subiectului, destinației, datei, actorului, limbii și a corecțiilor de tip „nu acela, celălalt”.
- Context temporar păstrat în modulul activ și după revenire; noua solicitare înlocuiește numai câmpurile numite.
- Clarificări numai când lipsesc date obligatorii, nu comenzi ghicite sau răspunsuri inventate.
- Test: „Mâine la Manchester” → „Dar vineri?” modifică doar data.

### P2 — recuperare din istoric
- Istoric indexat per utilizator, pe conversații, cu `conversation_id`, `turn_id`, data și modulul.
- Căutare hibridă: text literal, normalizare diacritice + căutare semantică după sens, cu filtre de dată/modul.
- Oferă rezumat și trimitere la conversația sursă; indică atunci când nu găsește sau când informația este învechită.
- Ștergerea conversației trebuie să șteargă și intrările indexate/cachurile. Nu amesteca istoricul utilizatorilor din Comunicare.
- Nu prezenta rezultate din contextul scurt trimis modelului ca dovadă că toate conversațiile au fost căutate.
- Test: „Ce am stabilit despre Oradea–Cluj acum câteva zile?” -> răspuns doar pe istoricul real.

### P3 — dialecte / slang / dictare
- Normalizare sigură română (ardelenesc, moldovenesc, regionalisme), engleză UK (Cockney etc.), abrevieri, cuvinte omise.
- Distinge expresiile colocviale de comenzi; când ambiguitatea afectează execuția, cere clarificare.
- Nu modifica citate, nume proprii, adrese sau conținutul documentelor.
- Test: „no ni mă la el că be!” trebuie tratat ca vorbire colocvială, nu o rută sau comandă.

### P4 — ton natural și răspunsuri corectabile
- Ton feminin, spontan, umor doar când este potrivit; evită șabloanele.
- Corecțiile utilizatorului actualizează contextul curent, nu retrain automat.
- Răspunsurile ample rămân ample când cererea le necesită; răspunsurile sociale rămân concise.

### P5 — execuție multi-modul și memorie persistentă
- Planificator cu permisiuni și confirmare înainte de acțiuni externe: transport + hotel + buget, agendă, liste partajate.
- Memorie de preferințe explicit aprobată, organizată și reversibilă; datele de acces sensibile nu se stochează în memorie.
- Erori de servicii raportate în limbaj natural; nu inventa disponibilitate, preț sau rezervare.

### P6 — verificare / cost / performanță
- Măsoară latență p50/p95, consum de tokens, rata clarificărilor, erori de context, răspunsuri inventate, apeluri API și succes real.
- Modelele mici rămân pentru intenții simple; ruta către model performant doar pentru raționament greu, cu buget explicit.
- Teste cu întrebări ambigue, multi-limbă, istorice, reale, negative și cross-module; comparație înainte/după.
- Nu pretinde integrare finalizată fără cod legat la frontend, backend, autentificare și teste pe APK.

## Stare la 2026-11-12
- P0: modificare Android pentru start la `onStart` și oprire între propoziții, commituri în repository. Testare pe dispozitiv necesară.
- P1: componente existente (`conversation_context.mjs`, `eva_dialogue.mjs`) de auditat înainte de modificare.
- P2–P6: obiective de implementat; existența unor utilitare de istoric nu demonstrează că recuperarea globală este activă.
