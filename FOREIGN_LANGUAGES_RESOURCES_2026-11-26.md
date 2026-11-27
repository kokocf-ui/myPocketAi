# Limbi străine — resurse introductive, 26.11.2026

## Cererea și accesul în aplicație

Dicționare, teme de învățare inclusiv conjugări, transcriere fonetică, ascultare/redare audio și ghid de conversație.

Traseu: **Educație → Limbi străine → limba/varianta → nivel → „Dicționar · conjugări · ghid · audio”**. Același buton este disponibil în lecție; deschide direct gramatica, ghidul sau laboratorul dacă lecția selectată este din categoria corespunzătoare. Cursul existent, cele opt capitole, evaluarea inițială, progresul, cititorul paginat, conversația cu Eva și dictarea Android rămân existente.

## Implementat

- **Lexic introductiv căutabil** după cuvânt, transcriere, sens original sau sens tradus. Căutarea ignoră diacriticele pentru filtrare. Formele țintă nu sunt modificate. Fiecare intrare are sens contextual și ascultare normală/lentă. Căutarea fără rezultate spune explicit că banca locală este introductivă.
- **Teme gramaticale reale**, nu doar solicitări către AI: explicație, forme în tabel, ascultarea formelor, exercițiu de completare, feedback și răspuns ascuns. Sunt incluse „a fi”/echivalentele sale și, unde există în această tranșă, modele de verbe de învățare/vorbire. Exemple de distincții: ser/estar, être/parler, sein/lernen, be/learn, alternanțele românești, omiterea copulei rusești la prezent, copula japoneză și lipsa conjugării după persoană în mandarină. Nu se inventează paradigme europene pentru chineză/japoneză. Verificarea păstrează diacriticele și compară textul, nu sunetul.
- **Ghid practic** pentru limbile moderne: bilet/transport, apă/la masă, ajutor și cererea de repetare lentă. Formulele sunt ascultabile și au transcriere/sens. Nu este încă un ghid extins pentru hotel, medic, cumpărături etc. Pentru latină și greaca veche/Koine: **lexic de lectură istorică**, nu ghid de călătorie contemporan.
- **Transcrieri etichetate distinct**: IPA, Pinyin tonal, Rōmaji sau transliterare. Pinyin/Rōmaji nu sunt prezentate drept IPA; limitele lor sunt explicate. Variantele EN GB/US, ZH simplificată/tradițională, LA clasică/ecleziastică și EL modernă/veche/Koine au resurse/chei/cache distincte.
- **Laborator de ascultare**: exemplu numerotat fără text inițial, redare normală/lentă, completarea textului auzit, verificare textuală, dezvăluirea textului/transcrierii/sensului. Sunt folosite vocile TTS ale dispozitivului, nu fișiere cu vorbitori umani.
- **Înregistrare și redare proprie, opționale** prin `getUserMedia` + `MediaRecorder`, maximum 45 secunde și 4 MiB. Necesită suport și permisiune; indisponibilitatea microfonului nu blochează TTS. Audio este numai în memoria dialogului, fără upload/stocare persistentă. Stop/delete, schimbarea secțiunii/exemplului, închiderea dialogului și `pagehide` eliberează microfonul și URL-ul Blob. O permisiune întârziată după navigare oprește imediat track-urile. Nu se oferă scor fonetic sau analiză acustică.
- **TTS**: alegere explicită a vocii regionale exacte din lista instalată, apoi aceeași limbă dacă lipsește regiunea; avertisment în laborator dacă nu există voce regională exactă. Navigarea oprește TTS/dictarea. Latina este aproximată cu voce italiană, greaca veche cu voce greacă modernă, cu avertisment explicit, fără garanție de pronunție istorică.

## Acoperire și limite editoriale

14 limbi existente: RO, EN, FR, DE, IT, ES, PT, NL, RU, PL, LA, ZH, JA, EL; **19 pachete** cu variantele lor. Totalurile de mai jos sunt însumări **pe pachete**, nu elemente distincte după deduplicarea variantelor:

| Conținut nou | Total |
|---|---:|
| Intrări lexicale/expresii | 212 |
| Teme gramaticale | 27 |
| Rânduri de forme | 154 |
| Grupuri de ghid/lectură | 49 |

Fiecare pachet modern are 12 intrări (8 cuvinte și 4 expresii), fiecare pachet clasic 8 cuvinte. Sunt **resurse introductive**, nu dicționare exhaustive, cursuri complete A1–C2 sau certificări CEFR. Nivelul ales din curs nu schimbă eticheta introductivă a resursei. Linkul CEFR din proveniență este cadru general, nu validare lexicală/gramaticală externă; nu se pretinde revizie de către un specialist pentru toate limbile.

Nu s-au copiat dicționare/manuale publicate. Nu s-au duplicat în aceste pachete vechile cartonașe de salut/vocabular din JS; ele continuă să funcționeze separat. Variantele regionale/istorice sunt explicit identificate, nu deduse din țară.

## Sursa unică, traducerea și distribuția

- Sursele editoriale sunt cele 19 JSON-uri din `public/education/languages/resources-v1/`, **100.524 B** în total. Nu sunt importate static în Worker și nu sunt serializate în HTML. Modulele JS noi conțin numai protocolul/validatorul/încărcătorul și UI.
- Explicațiile sunt în română. Sensurile din dicționar sunt în română; pentru cuvintele românești, sensul de referință este englezesc. Aceasta este perechea inerentă unui dicționar, nu o fișă tradusă duplicată. Nu există lecții RO/EN paralele în pachete.
- Butonul **„Tradu / reîncearcă explicațiile”** folosește exclusiv `eduTranslateMaterial` comun, cu limba sursă declarată și proiecție strictă: explicații, feedback, titluri/note de ghid, sensuri și note de domeniu. **Cuvintele, IPA, paradigmele, enunțurile și răspunsurile țintă nu se trimit la traducere.** Traducerea este cerută explicit; până atunci se afișează originalul și nota vizibilă despre limbile sursă. Eșecul păstrează originalul și permite reîncercarea. Nu este un motor de traducere nou.
- Încărcare la deschiderea resurselor, same-origin, `cache: no-store`, rețea apoi cache local validat. Cache pe limbă/variantă/schemă, independent de frontend. Quota/blocked storage nu invalidează conținutul online. Prima vizită offline fără pachet valid arată eroare și reîncercare, nu dicționar gol. O copie cache nu este o garanție de păstrare pe dispozitiv.
- Validare schemă/identitate/variante/câmpuri/ID/referințe și format hash la runtime; verificare digest SHA-256 la staging/teste. Nu este autentificare criptografică a sursei remote.
- Ruta nouă este aditivă în `education_pack_service.mjs`; GET/HEAD, JSON, no-store. Staging validează toate variantele obligatorii.
- Pentru editare: modificați JSON-ul canonic, apoi `node scripts/check_foreign_language_resources.mjs --refresh-hashes` (actualizează **numai hash-uri**, nu regenerează conținut), revizie editorială, `npm run test:foreign-resources`, staging și browserul de producție. Nu rulați scripturile scratch de autorare din `.bundle-check` peste conținutul revizuit.
- La o publicare autorizată ulterior: asset-uri înaintea frontendului; păstrați compatibilitatea/rollback-ul pachetelor vechi documentate în rapoartele de decuplare. **Nu s-a publicat nimic în această etapă.**

## Verificări executate

- `npm run check`, `npm run test:foreign-resources`: PASS. Validator/hash pentru toate 19 pachetele; date invalide, variante, cache invalid, retry, quota/storage blocat, update fără frontend nou, GET/HEAD/POST și rute respinse; vechiul test de curs cu 14 limbi PASS.
- Dry-run frontend de producție + `check_bundled_browser_names.mjs` + `check_education_study_bundle.mjs`: PASS. Verificată și absența payloadului editorial de limbi din Worker.
- `tests_foreign_language_resources_browser.mjs` pe bundle, Chromium mobil 390×844: PASS. Toate 19 variantele; căutare/zero rezultate, tabel/exercițiu/răspuns, ghid, text audio ascuns, rată TTS și alegerea vocii, traducere prin proiecție și fallback, `MediaRecorder` real cu microfonul simulat al Chromium, refuz și răspuns întârziat al permisiunii, stop/delete/schimbare exemplu/închidere în timpul capturii, cache offline/lipsă/retry și răspuns de rețea sosit după închidere.
- Regresii `test:education-study`, `test:science-source`, `test:education-input`: PASS. Browserele producție `tests_education_study_browser`, `tests_science_source_browser`, `tests_education_input_browser`: PASS.
- Cele 102 comenzi `test:ui` executate individual: **100 PASS / 2 eșecuri istorice**, aceleași ca înainte: `tests_education_ui_locales.mjs:88` cheia EN pentru teste scrise; `tests_extra_tools_workspace.mjs:23` catalogul 25 vs 24. Nu sunt declarate reparate.
- Staging final: **3.785 asset-uri / 92.353.722 B**.

### Buget de dimensiune

| Indicator | După modificări |
|---|---:|
| HTML brut | 6.992.354 B |
| HTML producție, fără hook de test | **7.065.132 B** |
| Marjă până la 8.000.000 B | **934.868 B** |
| Worker producție | 7.449.864 B / 7.275,26 KiB |

HTML producție crește cu 23.770 B față de `85e2b2b`; datele noi rămân în afara sa. Nu este o măsurare a spațiului liber pe telefon/APK.

**Fără AI/TTS live verificat, dispozitiv Android/stylus fizic, PR, merge, deploy sau APK nou.** Traducerea din APK-ul semnat rămâne problema separată amânată; simularea motorului comun nu o declară reparată. Pentru unele WebView-uri, înregistrarea poate necesita suport/permisiuni native suplimentare; UI raportează explicit indisponibilitatea, nu pretinde suport universal.
