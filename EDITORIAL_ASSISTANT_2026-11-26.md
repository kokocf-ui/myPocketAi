# Maxime, bancuri și înțelegerea cererii — 26 noiembrie 2026

## Cerința și limitele

Capturile utilizatorului sunt exemple vizuale, nu autoritate pentru atribuiri. Autorul apare numai ca nume, nu „autorul este…” / „De…”. Prioritate autenticității în locul a 365 de combinații artificiale. Bancuri coerente, haz de necaz, nu fragmente amestecate. Asistentul nu trebuie să interpreteze neînțelegerea sau un GPS memorat ca solicitare de adresă.

## Conținut offline

`fun_editorial_content.mjs` este sursa unică pentru 36 de intrări: 25 cu autor (Eminescu 4, Seneca 6, La Rochefoucauld 6, Marcus Aurelius 6, Epictet 2, Alecsandri 1) și 11 proverbe tradiționale fără nume individual. „Unde-s doi, puterea crește” păstrează autorul cunoscut, chiar dacă circulă popular. Pasajele românești sunt originale din operele indicate; redările în română din texte străine sunt traduceri proprii după sursele public-domain, marcate în detaliile pliabile. Nu se atribuie traducerea unui traducător român terț.

Fiecare intrare are operă, localizator, original, limbă, regim și explicație editorială. La Rochefoucauld: numărul este poziția în selecția citată, NU pretins număr canonic al maximei. Linkurile și pasajele au fost consultate în implementare; testele automate verifică schema/coerența, nu dovedesc autenticitatea din simpla existență a URL-ului.

Rotația este finită, deterministă, la 36 de zile; arhiva cuprinde celelalte 35. Nu există promisiune de 365 de citate distincte. Numele este separat de text, fără etichetă de autor; la proverbe lipsește. Explicația nu este prezentată ca parte a citatului. Sursele și traducerea sunt în panou pliabil; poezia păstrează versurile.

Bancuri: 30 de situații/dialoguri editoriale complete despre facturi, muncă, casă, tehnologie și viața cotidiană. Nu autor inventat, nu combinarea automată de începuturi și poante. Selecția fixată și lista derulabilă separat rămân intacte. Reacția de umor este subiectivă; nu poate fi certificată de un test.

## Asistent: cod client și Worker

`assistant_understanding.mjs` este comun și serializat în frontendul mobil. Corecțiile, metaforele, cererile de explicație/compoziție și căutările de idei preced dovada spațială. Necunoscut/scurt nu înseamnă automat localitate sau afacere. Dovezile pozitive includ cereri locale explicite, străzi, categorii de locuri, comenzi de deplasare și vreme. Se păstrează handoff-ul explicit la Deplasare.

Clientul nu solicită GPS și nu atașează coordonate memorate, destinație/profil/traseu vechi sau contexte de locuri/vreme/distanță unei cereri generale/neclare. Workerul aplică aceeași separare pentru clienți mai vechi, păstrând selecțiile structurate explicite și căutările dedicate. Eliminată sondarea geografică pentru orice cuvânt necunoscut; selecția entităților geografice recunoscute rămâne.

Instrucțiuni comune: ultimul mesaj are prioritate față de subiecte vechi; o singură clarificare specifică atunci când ambiguitatea schimbă răspunsul. Pentru „alt exemplu”, un exemplu/perspectivă nouă, nu schimbarea cifrelor/faptelor. Comparație euristică cu ultimele 3 răspunsuri, un singur retry dacă repetă aproape identic o cerere de variație. Nu schimbă răspunsurile factuale foarte scurte și respectă cererile de repetare exactă. Retry păstrează istoricul și contextul de verificare; nu apelează recursiv. Nu este o garanție semantică și nu presupune că temperatură mai mare înseamnă automat înțelegere mai bună.

**Niciun backend deploy în această etapă.** Corecțiile Worker/prompt/retry vor avea efect în API numai după publicare autorizată separat. APK-ul semnat include clientul/conținutul offline, dar folosește API-ul remote existent.

## Verificări executate

- `npm run check` PASS.
- `tests_fun_editorial_content.mjs`: toate 36, 25 nume/6 autori +11 fără nume, traduceri/surse, toate30bancuri, rotație72zile PASS.
- `tests_assistant_understanding.mjs`: 30cereri negativenonspațiale și16pozitive, handoff-uri/variație/fapte PASS.
- `tests_assistant_understanding_backend.mjs`: Worker real cu AI/provideri simulați, 10cereri cu GPS/contextvechi fără geocodare; retryconversație1dată cu subiectpăstrat PASS.
- `npm run test:conversation` PASS; quick-route/location-precision/live-location/map/conversation-intent/response-intent/parking-zoo/extra-fun/generator, remote-street/local-multisource-shops/FSA/retail/global-places/sparse-POI/first-install PASS.
- Wrangler frontend + backend **dry-run**, bundled-browser-name guard PASS. Nicio publicare.
- Browser pe bundle de producție: 393×817 și360×640, toate36citate/surse/nume/text, lipsănumeproverbe, detaliipliabile, 5cereri nonspațiale fărăGPSșifieldsvechi, cereriexplicitepăstrate PASS. GPS contorizat numai după inițializarea ecranului, nu pretindem că pornirea întregii aplicații nu are alte apeluri GPS.
- Regresie Divertisment pe393/360/430: bancuri/arhivă/selecpăstrată/Sudoku/integrame/astro PASS. Geocoder simulat.
- `scripts/build_android_ui_preview.mjs` PASS, HTML offline **6,960,616B**, sub8,000,000B. APK build verifică din nou snapshot/certificat/identitate/versionCode.
- `tests.mjs` se oprește la27: hoteluri2000m în loc de5000m. Reprodus identic cu backendul din HEAD1866535 înainte de modificări; nu declaratverde și nu modificatcolateral. ErorileUIlocale/tools/shopping anterioare rămân în rapoartele precedente.

Nu s-a verificat model live sau înțelegere perfectă în toate limbile. Nu s-au retestat fizic SAF/chat/oldvoice și nu se declară traducerea APK reparată. Nu PR/merge/latest/deploy.

### Verificare suplimentară / build intermediar

Întregul `test:ui`: 99/102 inițial; testul culinar izolat nu furniza noua dependență `state` și aștepta vechea expresie `locationIntent`. Actualizat harnessul VM cu starea/helperul reale și aserțiunea gate-ului; rerun PASS. Total **100/102**, numai cele două erori istorice locales/tools. Nicio modificare runtime necesară pentru acest test.

Run45841006585 a construit/semnat/verificat/publicat cu succes c83cc83, dar a rezultat **versionCode501882 duplicat**, nu versiunea nouă cerută. Nu a fost livrat utilizatorului. Cauză: notele release501882 editate anterior nu mai conțineau markerul literal `versionCode`, iar allocatorul căuta numai acel marker. Markerul a fost restaurat pe release anterior și allocatorul acceptă și formularea `APK 501882`/`APK501882` ca fallback. Un nou build din commitul de remediere trebuie să producă >501882; nu declara prima versiune adecvată actualizării noi.
