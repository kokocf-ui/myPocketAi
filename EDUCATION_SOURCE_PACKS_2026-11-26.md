# Decuplare și eliminarea variantelor traduse — 26 noiembrie 2026

## Rezultat: increment implementat, NU migrare generală finalizată

Cererea utilizatorului: pachete independente de aplicație; o singură fișă în limba originală, fără copii RO/EN pretraduse; traducerea aparține motorului comun. Au fost păstrate traducerile interfeței și materialele distincte ale țărilor.

Au fost migrate **153 de elemente** în patru pachete cu sursă română explicită:

| Materie | Fișe comune gimnaziale | Legi / referințe | Cursuri universitare de bază |
|---|---:|---:|---:|
| Fizică | 13 | 32 | — |
| Chimie | 8 | 16 | 28 |
| Biologie | 7 | 20 | — |
| Astronomie | 5 | 24 | — |
| **Total** | **33** | **92** | **28** |

Pachetele sunt în `public/education/science/shared-v2/{physics,chemistry,biology,astronomy}.json` (92.591 octeți în total). Datele editoriale sunt numai aici. Modulele vechi exportă adaptoare Node către aceleași JSON-uri, nu alte copii ale fișelor. Modulul de aprofundări gimnaziale și asset-urile bilingve v1 au fost retrase din repository. Toate cele 153 de surse românești au fost comparate exact cu `d3fa0b8`: textele, formulele, identificatorii, metadatele și proveniența existente sunt păstrate. Nu s-au adăugat lecții sau pretenții de acreditare.

**Notă:** româna este sursa acestor materiale generale, nu limba dedusă din țara selectată. Un material original englezesc nu trebuie șters doar pentru că este englezesc; nici două programe naționale distincte nu sunt duplicate doar pentru că au aceeași limbă.

## Contract editorial și încărcare

- Schema `mypocket-science-shared/v2`: `sourceLanguage`, `topics`, `references`, `universityCore`, `version` SHA-256 al payloadului. Fișa comună are `content` cu cele cinci componente originale, nu variante `ro/en`.
- Cheile istorice `ro`, `explainRo` etc. din referințe/cursuri sunt păstrate pentru compatibilitatea consumatorilor; nu există câmpul paralel `en`/`…En` în pachetele v2.
- La alegerea materiei se descarcă numai pachetul ei. Browserul pornește cu băncile de referințe și Chimie universitară goale și le hidratează din răspuns. Testul demonstrează și actualizarea prin serviciul separat de conținut fără reconstruirea frontendului.
- Cititorul referințelor și al cursurilor de bază primește explicit sursa `ro`; chiar și interfața engleză apelează motorul comun. Titlurile generice și comenzile interfeței își păstrează dicționarele UI. Căutarea acceptă titlul original și titlul afișat după traducere, plus formula.
- Schema respinge variantele EN reintroduse, identitatea greșită, câmpurile obligatorii lipsă și identificatorii dubli. Staging verifică și hash-ul. Browserul validează schema și formatul hash-ului; nu verifică criptografic autenticitatea conținutului remote.
- Cache separat `pocketai.science.shared.v2.<materie>`. Cache-ul bilingv v1 al aceleiași materii este eliminat numai după salvarea reușită a v2; cache-ul traducerilor produse de motor nu este șters. O eroare de rețea/date nu suprascrie copia v2 validă.
- Fără cache al pachetului: mesaj și reîncercare. Cu pachet descărcat: originalul poate fi reutilizat offline. Traducerea într-o altă limbă cere rețea la prima utilizare; ulterior depinde de cache-ul motorului, care poate fi evacuat. Nu există garanție de pornire complet offline sau traduceri offline inițiale.
- `scripts/build_science_shared_packs.mjs` păstrează comanda istorică, dar **nu mai generează conținut din bănci bilingve JS**. Modul normal recalculează hash-urile JSON-urilor; `--verify` doar validează, fără scriere. Publicarea de conținut trece separat prin staging.

## Compatibilitate / publicare viitoare

Rutele și cache-urile v2 sunt distincte de v1, astfel încât un frontend v1 nu poate interpreta accidental noua schemă. **Aceasta nu rezolvă retragerea clienților vechi.** Serviciul/staging curent livrează numai v2 pentru aceste patru asset-uri; un client vechi care mai cere v1 ar primi 404 după înlocuirea integrală a serviciului.

Prin urmare nu publica automat acest staging peste serviciul vechi. Pentru publicare va trebui: păstrarea separată a rutelor/artifactelor legacy deja publicate cât timp sunt necesare, disponibilizarea v2 înaintea frontendului compatibil, testarea clienților instalați și a rollback-ului, apoi retragerea explicită a v1. Nu se regenerează traduceri pre-scrise în pachetele noi pentru a simula compatibilitatea. Nu s-a executat deploy, build APK, PR sau merge. Bindingul independent nu este activat live prin această etapă.

## Ce a mai găsit auditul și rămâne de migrat

`node scripts/audit_education_coupling.mjs` inventariază JSON-urile și constantele mari din HTML. Nu șterge nimic și nu clasifică automat perechile de etichete drept fișe duplicate. A găsit 64 de constante JSON de minimum 10.000 octeți în HTML; unele sunt metadate/UI, deci **nu înseamnă 64 de pachete didactice**.

Restanțe reprezentative, măsurate local în HTML:

| Bancă | Octeți | Observație |
|---|---:|---|
| `EDU_MATH_GRADE_AREAS` | 336.707 | multe etichete RO/EN; nu șterge ca fișe fără analiză |
| `MATH_DEPTH_STAGES` | 265.540 | materiale încă încorporate |
| `EDUCATION_THEORY_DATA` | 238.550 | catalog/conținut folosit în mai multe trasee |
| `SCIENCE_RO_LESSON_EXTRAS` | 139.657 | sursă RO distinctă, încă în HTML |
| `HG_SCHOOL_PLANS_DATA` | 129.377 | planuri/materiale Istorie–Geografie |
| `RO678_MATH_LESSONS` | 101.981 | surse matematice românești |
| `COMPUTING_TOPICS_DATA` | 91.301 | include date și perechi de etichete/conținut |
| `PHYSICS_LOWER_ENGLISH_LESSONS` | 74.977 | verifică originalitatea curriculară, NU ștergere automată |
| `BIOLOGY_UPPER_YEAR_BANK` | 74.189 | bancă distinctă, încă încorporată |
| `PHYSICS_UNIVERSITY_STUDIES` | 59.027 | perechi RO/EN rămase |
| `PHYSICS_UPPER_CASES` / `_EN` | 50.461 / 49.216 | bănci paralele de analizat și migrat împreună |
| `PHYSICS_UNIVERSITY_CORE_UNITS` | 43.084 | perechi RO/EN rămase |
| `PHYSICS_UNIVERSITY_ALL_COURSES` | 40.966 | perechi de date rămase |
| `SCIENCE_UNIVERSITY_TRACK_GUIDES` | 28.616 | alte ghiduri bilingve rămase |

După migrare, scanarea celor **3.762 JSON-uri** din `public/packs` + `public/education` nu mai găsește obiecte cu ambele chei exacte `ro` și `en`. **Acesta este un rezultat structural, nu dovada eliminării tuturor duplicatelor semantice**, a textelor traduse din alte structuri sau a duplicatelor din modulele JS. Câmpurile `labelRo/labelEn` ale navigării nu au fost eliminate.

HTML neîmpachetat: **7.420.048 octeți UTF-8**, față de 7.590.375 înaintea etapei (−170.327). HTML generat de bundle-ul Wrangler: **7.491.346 octeți**, sub limita 8.000.000. Worker dry-run: **7.789,38 KiB / gzip 2.164,21 KiB**. Sunt încă dependențe server-side de conținut și multe alte bănci încorporate; nu pretinde că întregul Worker sau APK este decuplat.

Următoarea migrare sigură: cazurile paralele de Fizică liceală și băncile universitare, urmărind consumatorii de teorie, testare și grafice; apoi celelalte bănci, cu delimitare pe materie/țară/an. Nu înlocui surse englezești naționale distincte cu RO generic și nu elimina un exercițiu unic ca presupusă traducere.

## Validări executate

- `npm run check`, `npm run test:science-source`, `npm run test:education-input` — PASS.
- Paritate exactă a celor 153 de surse față de `d3fa0b8` — PASS.
- Staging: 3.762 asset-uri validate, 91.796.170 octeți; fără publicare.
- Suitele de progresie, universitar comun, pachete europene/legi, legi Fizică/Chimie, profunzime Biologie și Chimie, decuplare anuală și revizia Educației — PASS.
- Chromium mobil real: cele patru pachete, selecție lazy, cache offline, pachet necached indisponibil și retry — PASS.
- Noul `tests_science_source_browser.mjs` pe **bundle-ul de producție**: bănci inițial goale, 92 referințe + 28 cursuri hidratate, delegare RO→EN cu sursa explicită, eșec de traducere cu original/avertizare, cache offline — PASS.
- Chromium Fizică: VI–XII; Chimie: 49 trasee țară–capitol și lecții/practice RO; Astronomie: 12 ani, 12 lecții/practice și 8 grafice — PASS.
- Browserele de producție pentru uneltele de scriere și ferestrele de lucru la cele 8 materii — PASS. Dry-run frontend și garda numelor funcțiilor serializate — PASS.
- Cele 102 comenzi `test:ui` executate individual: **100 PASS / 2 eșecuri istorice** neschimbate: `tests_education_ui_locales.mjs:88` (cheie examene EN) și `tests_extra_tools_workspace.mjs:23` (25 materii vs 24 așteptate).
- `tests_science_ro_course_quality.mjs` ajunge la aserțiunea finală de HTML și eșuează pentru un predicat vechi absent și din `d3fa0b8`: `scienceJourney.schoolStage==='primary'&&scienceJourney.subject!=='physics'`. Predicatul real este diferit; nu a fost modificată aplicația ca să ascundă această restanță. Importul nefolosit al modulului de aprofundări retras a fost eliminat din test.

Răspunsurile motorului de traducere și ale recunoașterii scrisului sunt **simulate în teste**. Nu s-a verificat calitatea AI live, APK-ul instalat, stylusul fizic sau serviciul Cloudflare publicat. Problema traducerii raportată pe APK rămâne deschisă și amânată conform utilizatorului.
