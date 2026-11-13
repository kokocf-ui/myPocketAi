# QA localități ambigue și continuare cerere — 12.11.2026

## Obiectiv
Utilizatorul poate specifica o localitate fără țară. Dacă geocodificarea produce mai multe rezultate credibile, Eva oferă **tabelul existent** de variante și, după alegere, reia automat **job-ul deja început**, fără să folosească țara sau GPS-ul drept presupunere de destinație.

## Implementare existentă verificată
- Backend `backend.js`: `geocodePlace(query)` păstrează până la cinci localități candidate cu etichete, cod de țară și coordonate. Respingere străzi/POI pentru căutarea de localitate.
- Răspunsul ambiguu include `needs_location_clarification`, `destination_candidates` și `place_context` cu categoria/filtrele job-ului.
- Frontend `index.js`: `appendConversationChoices` afișează deja un tabel într-o fereastră nativă. Butonul unei opțiuni retrimite `option.query` (sau valoarea/eticheta) prin `submitMessage`, iar `state.placeSearchContext` este retransmis ca `place_context`.
- Backend recunoaște selecția din `pending_candidates` și continuă job-ul cu țara și coordonatele opțiunii alese.
- Nu s-a rescris frontend-ul; doar testul de regresie `tests_country_city_choice_resume.mjs` a fost adăugat pe ramura separată.

## Dovadă automatizată
Commit: `1b45d6096d71afea9b0255e49dd11896c5dc660b`. Workflow **Smart Country Registry — isolated verification**: **success**.
- `Caută restaurante în Paris` => Paris Franța + Paris Texas, fără căutare comercială prematură.
- Alegere Franța => rezultate restaurant Franța, categoria restaurant păstrată, fără re-geocodificare.
- Alegere Texas => rezultate separate pentru Texas, fără fallback la GPS.
- Sintaxa frontend, parcare/zoo și regresiile transport UK/RO: **success**.
- APK debug CI build: **success**, dar este doar build de validare, nu pachet release semnat pentru actualizare.

## Test manual propus astăzi pe APK actual (mecanism existent)
1. `Caută hoteluri de 4 stele în Paris, în zona centrală` → trebuie să apară tabelul de orașe; alege **Paris, Franța**. Eva trebuie să returneze hoteluri de **4 stele** în Paris, fără repetarea cererii.
2. `Caută restaurante în Paris` → tabelul cu Paris, Franța / Paris, SUA, unde datele disponibile le găsesc; alege o variantă, apoi verifică orașul din rezultate.
3. `Caută farmacii în Oradea, România` → căutare în Oradea, chiar dacă GPS-ul este în UK.

## Limite clare
- Pentru multe localități, unicul rezultat geografic verificat poate fi acceptat automat; tabelul apare la **ambiguitate**, nu pentru un singur rezultat.
- Nu toate celelalte module (transport, meteo, conversație liberă) au încă un contract unic de selecție și reluare verificat aici.
- Noul registru este pe `feature/smart-country-registry`, în PR draft #385, cu `SMART_COUNTRY_REGISTRY_ENABLED` oprit implicit; actualul APK NU testează registrul nou.
- Pentru trimitere în România mâine (13.11.2026): necesare activare controlată/staging și verificări reale, apoi build **release semnat**; nu distribui un APK debug ca actualizare.
