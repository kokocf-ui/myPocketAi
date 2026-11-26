# Corecții mobile — ferestre, atingeri și paletă Educație, 26.11.2026

## Raportarea utilizatorului

După instalarea APK-ului semnat de test `education-test-45815458856` (501878), utilizatorul a trimis trei capturi reale:
- resursele de Limbi străine au fundal vișiniu, iar butoanele par să nu reacționeze;
- în Profesorul AI, câmpul de răspuns și butoanele/uneltele sunt comprimate/suprapuse;
- în lecția Matematică RO VIII „Intervale de numere reale; reprezentare pe axă”, activitățile și fereastra de lucru se suprapun.

Nu este o confirmare că browserul anterior reflecta corect APK-ul. Testele anterioare verificau funcționalitate și existența nodurilor, nu suficient geometria, atingerile reale și vizibilitatea conținutului după schimbarea unui tab.

## Cauze și corecții

### Resurse Limbi străine
- Fundalul avea explicit fallback `#24151e`, în afara paletei generale. Înlocuit cu gradientul general `#12374a → #081c2d`, border cyan și text deschis. Stilul este emis după regulile globale, nu înaintea lor.
- Titlul, butonul de închidere, traducerea, statusul și cele patru secțiuni consumau multă înălțime. Explicațiile generale repetate precedau conținutul fiecărui tab; o apăsare schimba conținutul, dar acesta rămânea mult sub meniul vizibil.
- Dialogul este acum limitat la viewport, cu antet compact, taburi 2×2 și **un singur corp derulabil**. Conținutul activ are titlu vizibil, scroll resetat la schimbarea secțiunii, iar notele despre sursă/transcriere/acoperire rămân accesibile într-un `details` pliabil. Nu au fost eliminate informații editoriale sau avertismente.
- Taburile erau active înainte de finalizarea fetch-ului, când `pack` era încă null. Acum sunt dezactivate până la validarea pachetului și handlerul are și gardă explicită; nu mai poate dereferenția o resursă neîncărcată.

### Profesor AI
- Dialogul flex conținea direct transcriptul, textarea și uneltele injectate. Sub constrângerea înălțimii, câmpul de text se comprima, în timp ce butoanele/uneltele ocupau în continuare spațiu.
- Antet separat, corp unic derulabil, textarea de minimum 104 px și elemente care nu se comprimă; acțiunile sunt pe rânduri distincte. Uneltele de intrare rămân după câmp, în flux normal, nu deasupra lui.
- Starea cererii este acum locală dialogului. Butonul Trimitere este dezactivat pe durata cererii și reactivat la succes/eșec; închiderea anulează cererea. Un răspuns/anulare dintr-un dialog vechi nu mai poate modifica blocarea dialogului următor.

### Matematică
- Panoul național moștenea regulile de selector cu overflow ascuns. Lista de activități și workspace-ul erau elemente flex care se puteau comprima; conținutul lor depășea dreptunghiurile, producând suprapunerea din captură.
- Lecția națională cu workspace folosește acum **panoul drept unic proprietar al derulării**; lista de acțiuni și fereastra de lucru nu se comprimă. Acțiunile sunt grilă 2×2, dimensiune naturală, iar workspace-ul urmează după listă în flux normal.
- Contractul comun al workspace-ului și al uneltelor de intrare păstrează înălțimea lor reală. Nu s-au schimbat motorul de rezolvare, datele lecțiilor sau dock-ul global.

### Android Back

Închiderea prin Back consumă stratul custom aflat efectiv deasupra (resurse, profesor, atelier sau scriere de mână), fără a naviga modulul ascuns de sub el. Cititorul paginat și celelalte ferestre își păstrează comportamentul existent.

Implementare principală: `education_mobile_containment.mjs`, `foreign_language_resources_ui.mjs`, `education_lesson_workspace.mjs`, zona tutor/back din `index.js`. Stilurile finale sunt restrânse la componentele afectate.

## Verificare executată

- Nou: `npm run test:education-mobile:browser` pe **bundle-ul de producție**, Chromium cu touch: **393×817 și 360×640**, plus viewport redus la **430 px înălțime** pentru constrângerea tastaturii.
- Testează `tap()` și `elementFromPoint`, nu doar `.click()`/existența nodurilor. Verifică paleta albastră, încărcare lentă cu taburi dezactivate, toate cele patru taburi și conținut imediat accesibil, căutare/TTS simulat, câmp–unelte–acțiuni fără intersecții, inserare din paletă, AI lung/eșec/anulare/retry (răspunsuri simulate), Android Back și exact lecția RO VIII cu intervale.
- La Matematică sunt comparate dreptunghiurile tuturor copiilor vizibili ai panoului, ordinea listă→workspace, accesul la teorie și revenirea, completarea răspunsului, reperul local și verificarea cu API simulat. Controalele trebuie să poată fi atinse fără un element suprapus.
- Capturi Chromium inspectate vizual, în `.bundle-check/mobile-containment/` (scratch ignorat, nu livrabile/versionate).
- PASS: `npm run check`, `test:foreign-resources`, `test:practical-workshops`, `test:education-input`, `test:education-study`, `test:science-source`, `tests_education_android`, traducere source/container, snapshot Android, dry-run frontend/gărzi nume și dimensiune.
- PASS pe bundle: noul test de containment, browser Limbi toate19variante, workspace toate8materii/12traseeuniversitare, input toate8materii, cele36ateliere practice. Vechiul test de Limbi folosește acum selectorul explicit al răspunsului audio și al secțiunilor de ghid, deoarece a fost adăugat `details` informativ și titlul tabului.
- Toate102comenzi UI executate separat: **100 PASS, aceleași2eșecuri istorice** (`tests_education_ui_locales.mjs:88`, cheia EN de examene; `tests_extra_tools_workspace.mjs:23`, catalog25vs24).
- YAML și shell pentru workflow-urile modificate validate. Nu există test pe dispozitivul fizic al utilizatorului în această etapă; imaginile inițiale sunt dovada lui, capturile noi sunt din Chromium.

Dimensiuni fără hook-uri de test: HTML brut/snapshot **6.871.477 B**, HTML producție **6.944.852 B**, Worker **7.280.175 B**. Sub limita de 8MB; pachetele editoriale nu au fost recuplate/modificate.

## APK corectiv

Se construiește release semnat de test pe aceeași ramură, cu aceeași cheie permanentă, snapshotul nou și pachetele corespunzătoare. Fără merge/deployproducție. Joburile de semnare pentru aceste teste sunt serializate; versiunea se calculează acum peste maximul dintre stabil și APK-urile noastre de test publicate (nu repetă automat 501878). Rezultatul și linkul se completează după terminarea run-ului.

**Rămân deschise:** verificarea pe telefon după instalare, traducerea APK raportată anterior, vocile/permisiunile fizice și calitatea răspunsurilor AI live. Corecția de layout nu este declarată reparare a acestor probleme.
