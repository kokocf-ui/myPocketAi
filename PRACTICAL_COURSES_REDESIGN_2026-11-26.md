# Cursuri practice — parcurs orientat pe lucrări, 26.11.2026

## Cerere și diagnostic

Utilizatorul consideră cursurile practice insuficient gândite și cere, după îmbunătățire, un APK. Au fost inspectate toate cele șase domenii și 36 de capitole: Finanțe, Meserii/abilități, Antreprenoriat, Digital, Carieră, Viață practică.

Materialul existent are deja explicații, modele și surse, dar atelierul se baza în mare parte pe text liber și AI. Testul grilă seta `completed:true`; acesta nu dovedea realizarea unei lucrări. Nu era un caiet structurat pe livrabile și nici un portofoliu final editabil.

## Schimbări funcționale

- **36 de ateliere ghidate distincte**, câte unul per capitol. Fiecare are scenariu fictiv concret, livrabilă, timp orientativ 25–50 min, materiale, limită de siguranță, greșeală frecventă, structură de lucru, întrebare locală cu explicație/răspuns, sarcină de transfer și patru criterii de autoevaluare.
- Exemple: buget cu factură anuală repartizată, totaluri pentru două credite, plan de rezervă; cote/scară/toleranță/deviz fără execuție periculoasă; experiment comercial, contribuție și numerar; restaurare backup, formule și acces minim; dovezi de competențe, CV/STAR/portofoliu; orar, preț pe kg, igienă, documente și plan pentru situații neprevăzute.
- **Caiet editabil local** cu salvare separată pe țară/curs/capitol. Structura se inserează numai într-o ciornă goală; nu se suprascrie munca. Ștergere explicit confirmată. Ciornele nu se trimit automat la AI și nu se sincronizează. Fără date sensibile în exercițiu. Salvarea blocată/quota este raportată explicit.
- **Verificare locală** numerică (virgulă sau punct zecimal) sau cu opțiuni, strict pentru datele scenariului. Explicație separată și răspuns consultabil. Nu este evaluare semantică a întregii lucrări.
- **Stări separate**: citire declarată, rezultat grilă și lucrare autoevaluată. Grila nu mai marchează automat lecția drept parcursă. Un șablon necompletat nu poate fi autoevaluat drept lucrare: sunt necesare text modificat, minimum de conținut, răspunsul local corect și criteriile bifate. Acestea verifică **completitudinea declarată**, nu calitatea profesională/competența reală. Modificarea lucrării/răspunsului/criteriilor invalidează autoevaluarea.
- **Parcurs al cursului** cu lista celor șase livrabile, prerechizite, principiu pedagogic, siguranță și progres pe lucrări (fără selector suplimentar obligatoriu de dificultate).
- **Proiect final editabil și portofoliu PDF** prin mecanismul comun `eduOpenPrint`: textul final + cele șase lucrări proprii și stările lor, nu o copie a întregii teorii. Se poate lucra/exporta și ca ciornă; autoevaluarea finală cere cele șase autoevaluări de capitol și criteriile proiectului. Schimbarea unei lucrări invalidează starea anterioară la redeschiderea proiectului, prin reviziile salvate. Nu se acordă diplome/certificări.
- Lectura, testul grilă, CV-ul și exportul CV, dictarea Android, sursele oficiale și întrebările AI rămân disponibile. Atelierul ghidat este acțiune principală; AI este etichetat opțional, nu condiție pentru lucrul local.
- Instrucțiunile sursă RO trec prin **motorul comun de traducere**, pe fragmente și cu reîncercare/fallback. Ciornele personale nu fac parte din proiecția de traducere. Nicio fișă RO/EN pretradusă suplimentară. Nu se pretinde repararea traducerii APK prin simulările browserului.

## Decuplare și compatibilitate

Șase surse canonice JSON în `public/education/practical/course-v1/`, în total **271.439 B**, conțin materialul vechi și atelierele/parcursurile noi. Nu sunt regenerate din JS la build și nu intră în HTML/Worker. Modulele vechi de date sunt adaptoare Node la aceleași pachete, păstrând exact cele cinci exporturi de date vechi (comparate în această etapă). Sunt păstrate textele, ID-urile, ordinea, întrebările și modelele vechi; numai comportamentul de progres este corectat.

`practical_course_pack_loader.mjs`: validare identitate/schemă/structură/ID/întrebări/evidențe; no-store rețea → cache validat per curs, storage blocat/quota fără pierderea răspunsului online, lipsă offline cu retry explicit. Navigarea concurentă nu hidratează cursul greșit. Încărcare numai după alegerea cursului. Digeste SHA-256 verificate la teste/staging, formatul la runtime; nu autentificare criptografică remote.

Editare editorială: modificați JSON-ul canonic și rulați `node tests_practical_workshops.mjs --refresh-hashes`, apoi `npm run test:practical-workshops` și browserul de producție. Comanda actualizează numai hash-urile, nu reconstruiește lecții. Nu rulați scripturile scratch de extragere/autorare peste adaptoare sau material revizuit.

Ruta serviciului și staging-ul au fost extinse aditiv pentru toate șase pachetele. La o publicare viitoare autorizată se păstrează planul legacy din decuplare și se publică asset-urile înaintea frontendului. În această etapă **nu se publică frontend/backend/serviciul de conținut în producție**.

## Validare executată

- `npm run check`, `test:practical-workshops`, testele vechi `tests_practical_courses`: PASS. Toate cele 36 scenarii sunt distincte; schema, hash, numeric/opțiuni, respingerea șabloanelor, cache/quota/offline/rute validate.
- Paritate exactă a datelor exportate anterior din curriculum, guides, syllabi, depth și depth-extra: PASS.
- Producție dry-run, garda numelor browser și garda payloadului study/shared: PASS.
- Browser Chromium mobil pe bundle: **toate 36 atelierele și toate șase cursurile PASS**; ciorne persistente/izolate, date numerice cu virgulă, checklist, invalidarea autoevaluării, portofoliu și payload PDF, traducere doar a instrucțiunilor, cache/offline/lipsă/retry/răspuns întârziat, nicio cerere AI în ateliere. Fișierul PDF fizic Android nu este produs de acest test: se verifică payloadul mecanismului de export comun.
- Regresii source/input/study/science/limbi și browserele mobile limbi/input/study: PASS.
- 102 comenzi UI executate separat: **100 PASS / aceleași două eșecuri istorice** (`tests_education_ui_locales.mjs:88`, cheia EN de examene; `tests_extra_tools_workspace.mjs:23`, 25 vs 24).
- `tests_science_container_translation.mjs` avea un delimitator de extragere rămas la semnătura veche fără `sourceLanguage`. Corectat numai delimitatorul; testul verifică din nou payload/cache/țintă/răspuns întârziat/fallback/retry și trece. Nu este modificare a traducerii live.
- Snapshot Android validat cu pachetele proprii și prezența Divertisment/Limbi/Cursuri, schema și hash-urile; toate shell-urile workflow-urilor modificate trec `bash -n`, YAML parsează.

Dimensiuni finale fără hook-uri de test:

| Indicator | Valoare |
|---|---:|
| HTML brut / snapshot APK | 6.864.388 B |
| HTML producție | **6.937.763 B** |
| Worker | 7.272.957 B / 7.102,50 KiB |
| Staging | 3.791 asset-uri / 92.625.161 B |

HTML producție scade cu **127.369 B** față de etapa de limbi; marjă 1.062.237 B până la 8 MB. Nu reprezintă o măsurare de spațiu liber pe telefon; APK-ul cu snapshot include și asset-urile educaționale.

## APK cerut

Se folosește jobul manual existent `signed-branch-preview` din `build-android-apk.yml` pe ramura activă, **`assembleRelease` cu cheia permanentă**, nu debug și nu schimbare/merge pe main. Snapshotul UI și JSON-urile corespunzătoare sunt în APK; API-urile live rămân remote. Workflow-ul verifică identitatea `ai.mypocket.mobile`, versiunea și egalitatea certificatului cu APK-ul publicat stabil înainte de livrare.

Adăugat input manual `publish_signed_apk` (implicit false): numai la solicitare publică artefactul semnat într-un **prerelease de test**, cu link direct `.apk`, fără a marca prerelease-ul drept latest și fără deploy de producție. Cheia nu este expusă sau păstrată în repo; credențialele rămân în GitHub Actions. Starea și linkul buildului efectiv se consemnează după terminarea lui.

Limitări: scenarii orientative, nu cursuri acreditate sau calificări de meserie. Meseriile sunt simulări nepericuloase, fără instrucțiuni de electricitate/gaze/structuri portante. Fără AI sau dispozitiv Android fizic verificat. Defectul raportat al traducerii din APK rămâne deschis; suportul audio/microfon WebView nu este garantat de testele Chromium.


### APK livrat efectiv

- Commit aplicație: **`24c2db8c23eeb2d01275f7e3e581d8811415cb16`** pe `arena/8ae2700b-mypocketai`.
- Run **45815458856**: **success**; job `signed-branch-preview` success, `apk-debug` skipped. Verificarea certificatului/identității/versiunii/snapshoturilor și publicarea sunt confirmate success de API-ul Actions. Niciun deploy sau merge.
- Release: **`education-test-45815458856`**, **prerelease**, nu latest, țintește exact commitul de mai sus.
- **versionCode 501878** (release stabil de referință 501877); build tip **release**, semnătură permanentă comparată de CI cu APK-ul stabil. Se livrează pentru actualizare, fără dezinstalare.
- Asset: `myPocketAI-signed-education-test.apk`, stare **uploaded**, **77.608.928 B** (~77,6 MB / 74,0 MiB).
- Link direct verificat din metadata GitHub: https://github.com/kokocf-ui/myPocketAi/releases/download/education-test-45815458856/myPocketAI-signed-education-test.apk
- Digest raportat de GitHub pentru asset: `sha256:32b879b1eb22cab1b5cc21e52e039d0cefd199856e01b7460050d125c3050026` (metadata API, nu recalcul local al fișierului).
- Run: https://github.com/kokocf-ui/myPocketAi/actions/runs/45815458856

Descărcarea logului integral Actions a fost blocată de accesul sandbox la hostul de rezultate; nu s-a pretins o inspecție locală a certificatului din binar. Confirmările de verificare provin din pașii CI încheiați cu succes și metadata release/asset. Instalarea și comportamentul pe telefonul utilizatorului rămân de verificat, în special traducerea și permisiunile audio.
