# myPocket AI — backend v105 + frontend v1.0.74

31 octombrie 2026. Bază: fișierele curente din GitHub, backend SHA 073c05cea0e0eb6d9e8e246d5e2fd5664853ae76 și frontend SHA a452bb9feddf1539986e3bd6cdd30f0291ca0c50 (v104/v1.0.73).

## Instalare

Înlocuiește în rădăcina repository-ului `backend.js`, `index.js`, `README.md`, `README_ro.md`, `package.json`, `tests.mjs` și `tests_reader.mjs` cu fișierele din arhivă. Păstrează fișierele Wrangler, numele Workers, domeniile, secretele și binding-ul AI. Publică backend-ul apoi frontend-ul și reîncarcă aplicația. Asistentul nu a modificat GitHub și nu a publicat aplicația.

## Destinații și opțiuni

Problema reprodusă: „Caută hoteluri de 4 stele, în Paris, în zona centrală” putea lăsa „Paris, in” în cererea de geocodare. Textul rămas putea influența alegerea unui Paris din Indiana. Formularea centrală este acum eliminată integral din numele localității.

- Geocodarea este restrânsă la localități/zone locuite, nu străzi sau hoteluri. Străzile precum Avenue de Paris sunt excluse și numele localității trebuie să corespundă unei denumiri/aliasuri returnate de serviciu.
- Se cer până la 10 variante. Dublurile apropiate ale aceleiași localități sunt reunite. Dacă rămân localități distincte, se cere clarificare, fără alegerea automată a variantei cu scor mai mare. Aceasta se aplică și localităților omonime din aceeași țară.
- Opțiunile provin din rezultatul real al geocodării. Nu există o listă fixă Paris/alte orașe introdusă în cod. Acoperirea variantelor depinde de serviciu; dacă serviciul întoarce o singură localitate validă, ea poate fi folosită.
- Răspunde cu numărul sau cu țara. Dacă mai multe variante sunt în aceeași țară, alegerea țării restrânge opțiunile și cere o alegere mai precisă.
- La alegerea unei opțiuni se păstrează filtrul de stele și zona centrală. Alegerea rămâne disponibilă pentru întrebările de continuare.
- O țară scrisă explicit, inclusiv „Franța”, este recunoscută separat de limba interfeței și aplicată ca filtru de țară. Nu se asociază automat limba română cu România.

## Numărul hotelurilor

Nu există o limitare la un singur hotel. Sunt afișate până la 40 de rezultate confirmabile din datele primite; dacă există mai multe, răspunsul indică numărul afișat. Hotelurile fără clasificarea cerută nu sunt prezentate ca potriviri.

Pentru clasificările lipsă, backend-ul poate cere detalii Geoapify pentru maximum 8 hoteluri cu identificator de furnizor, în grupuri de 4, cu timeout de 2,5 secunde. Acest lucru poate recupera stelele care lipsesc din lista inițială și adaugă până la 8 cereri la serviciul existent. Nu se adaugă o cheie nouă. Datele indisponibile rămân necunoscute; nu se inventează clasificări. Răspunsul indică locațiile suplimentare excluse pentru clasificare lipsă când există rezultate confirmate.

## Notificări

- Nu se mai afișează notificarea pentru schimbarea limbii sau pornirea unei conversații noi.
- Alertele necesare apar în partea de sus, nu peste câmpul de scriere.
- Dispar după aproximativ 1,8 secunde și imediat când câmpul de scriere primește focus.
- Nu interceptează atingerile.

Se păstrează fereastra de lectură cu autoderulare, previzualizarea de 4 rânduri, linkurile apăsabile, siglele în dreapta numelui, contextul căutării și bara de jos fixă. Fotografiile rămân eliminate. Nu se adaugă camere, tarife sau rezervări.

## Verificări

`npm test` și `npm run check` trec. Testele cu servicii/DOM simulate acoperă formularea exactă Paris/zonă centrală, opțiuni din țări diferite și aceeași țară, dubluri, străzi respinse, alegerea prin număr sau „Franța”, continuarea după alegere, clasificări suplimentare pentru mai multe hoteluri, notificările, plus regresiile New York/Paris/GPS/context și fereastra de lectură. Scriptul client este compilat după extragerea din HTML-ul generat.

Nu s-a efectuat test vizual într-un browser/pe telefon sau test live cu cheile Cloudflare. Endpointul public de geocodare nu a fost accesibil prin mediul de verificare; testele de geocodare folosesc răspunsuri simulate. După publicare verifică aceeași întrebare din captură, selectează „Franța” dacă apar mai multe localități și verifică lista completă din fereastra de lectură. Nu se poate garanta numărul de hoteluri cu clasificări confirmabile din sursa reală.
