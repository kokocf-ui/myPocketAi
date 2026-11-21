# Științe — contractul unei singure livrări Android
**20.11.2026 · Capitolul 1 din Educație**

Nu se livrează APK-uri separate pentru Fizică, Chimie, Biologie sau Astronomie. La final se livrează un singur APK semnat; utilizatorul testează cele patru discipline și aprobă închiderea capitolului. Nu se declară „închis” înainte de acest test.

## Aria obligatorie
- **Toate cele 50 de jurisdicții din selectorul aplicației** (Regatul Unit are patru sisteme) și toate clasele/anotimpurile școlare realmente mapate.
- **Primar:** științe integrate, parcurs tematic original pentru toate cele patru domenii; nu sugera că fiecare domeniu este materie obligatorie distinctă la primar.
- **Gimnaziu, liceu:** module diferențiate după anul real și etapa fiecărei țări; noțiunile comune pot avea o progresie, nu un catalog identic la fiecare clasă.
- **Universitate:** păstrarea specializărilor existente, exerciții și formule adecvate nivelului; nu eticheta programele generice ca acreditate național.
- **Fallback aprobat:** dacă nu există programă națională verificată, afișează curs general în baza unor surse pedagogice, cu lecții, explicații, exemple, activități, evaluare și eticheta **„program general orientativ”**. Nu pretinde că este manual oficial.
- **Întreg fluxul**: Țară → Materie → Etapă/clasă → Capitol → Teme de studiu / Probleme / Laborator-model → citire → paginare → PDF/print → Înapoi. Navigarea, măririle și tastatura nu pot ascunde ultimele acțiuni; camera și dictarea nu inventează rezultate.
- **Limbi:** textele locale și etichetele trebuie verificabile, cu fallback explicit dacă traducerea unei lecții nu este disponibilă.

## Probe de dezvoltare
- CI pentru clase/țări/materii: `node tests_science_grade_progression.mjs`, `node tests_education_all_country_subject_matrix.mjs`, `node tests_science_year_cards.mjs`, `node tests_science_navigation.mjs`.
- CI pentru discipline: `tests_physics_complete.mjs`, `tests_chemistry_complete.mjs`, `tests_biology_complete.mjs`, `tests_astronomy_complete.mjs`, plus `npm run test:ui`, `npm run test:android` și compilarea Gradle.
- CI reușită **nu este echivalentă** cu validarea telefonului: trebuie verificat Android efectiv, în special Citire/Stop, Înapoi, fereastra centrată, figuri/laborator, suportul PDF complet.
- **Atenție majoră la livrare:** WebView-ul Android deschide `https://lifewise-ai-v2.kokocf.workers.dev/` (frontend la distanță). Un APK construit dintr-o ramură, fără actualizarea frontend-ului Cloudflare, nu demonstrează că modificările la Științe sunt în aplicația instalată. Înainte de APK-ul final trebuie confirmată versiunea efectiv disponibilă pe Cloudflare, apoi versiunea semnată Android.

## Stadiu și regula de închidere
Lucrul la capitol nu se declară finalizat prin testele de integrare ale matricei, nici printr-un APK care se compilează. Criteriile necesită o livrare coerentă și acceptarea utilizatorului pe telefon. Alte capitole nu se deschid pentru un raport intermediar.

## Continuare internă — gimnaziu pentru toate cele 50 de sisteme (PR #501)
- Baza este versiunea curentă din `main`, care avea deja trasee pe clase și lecții originale la primar; nu se reintroduce structura mai veche din PR #499.
- Modulul `science_lower_secondary_lessons.mjs` adaugă **26 de teme unice** distribuite în Fizică (7), Chimie (8), Biologie (6), Astronomie (5), cu explicație proprie, exemplu rezolvat, exercițiu și răspuns de verificare în română și engleză.
- `science_grade_progression.mjs` construiește acum o fișă completă pentru gimnaziu, cu activitate de investigație diferențiată, nu un șablon repetat pentru fiecare capitol.
- `index.js` utilizează aceeași fișă la deschiderea lecției și **nu mai dublează peste ea explicația avansată**. Pentru liceu păstrează teoria de specialitate și leagă cerința de capitolul selectat.
- Regresia `tests_science_grade_progression.mjs` verifică explicațiile, exemplele rezolvate, exercițiile, răspunsurile și legătura dintre tema selectată și material în toate cele 50 de jurisdicții școlare.
- CI pentru modificările PR #501: `Education 50-country curriculum coverage` și `Pocket AI minimal code checks` au trecut; `Build myPocket AI Android APK` a trecut ca verificare de diagnostic. **Nu s-a publicat un APK semnat nou.**
- Rămân până la acceptarea Științelor: verificarea programelor oficiale de țară/clasă/profil, acoperirea tuturor lecțiilor efective la liceu și universitate, funcționarea audio/figuri/PDF/Înapoi și proba pe un dispozitiv Android. Lecțiile în altă limbă decât română/engleză indică fallbackul în engleză; traducerile nu sunt certificate.
- **Nu marca Științele ca terminate** și nu livra un APK pentru acest lot intermediar. 

## Validarea integrată a Științelor, același lot (20.11.2026)
- Gimnaziu: un singur cititor complet per capitol și an, nu carduri redundante care deschid același text; funcționează chiar dacă registrul de sublecții vechi nu are intrări.
- Ghiduri englezești originale pentru 47 de capitole de bază (14 fizică, 14 chimie, 10 biologie, 9 astronomie), cu explicație, exemplu, capcană conceptuală și întrebare de verificare. Fallbackul englez în alte limbi este etichetat explicit.
- La liceu în engleză se deschide un singur capitol coerent, nu sublecții cu titluri identice. Lecțiile românești detaliate se păstrează.
- tests_science_grade_progression.mjs verifică și cititorul într-un DOM simulat: clase diferite, lipsă sublecții vechi, interfața în engleză și conținut real.
- CI: Sciences — full four-subject acceptance checks, matricea de 50 de sisteme, smoke și compilarea unui APK debug exclusiv diagnostic au trecut la commit aaa0b0ff. APK-ul debug NU se livrează ca actualizare.
- NU închide capitolul: sunt încă obligatorii verificarea pe Android real, deploymentul sincronizat Cloudflare, verificarea tuturor nivelurilor (inclusiv specializări universitare și fallbackuri de limbă), APK final semnat și acceptarea utilizatorului.
- PR #501 rămâne draft. Nu confunda un build automat reușit cu finalizarea Științelor.

## Cursurile universitare incluse în lotul Științe
- 30 specializări cu ghiduri originale bilingve, exemple conceptuale specifice domeniului și verificări: 7 Fizică, 7 Chimie, 9 Biologie, 7 Astronomie. Se folosesc toate capitolele și subcapitolele academice existente în sursele offline; capitolele comune își marchează explicit materialele fundamentale de recapitulare, nu se prezintă drept curs acreditat.
- Fiecare capitol deschide un cititor complet, cu subcapitolele reale, formule și considerații asupra limitelor, în fereastra existentă care permite PDF/imprimare. Pentru limbi fără traducere validată, referința originală în română rămâne etichetată ca atare.
- Testul exhaustiv tests_science_university_complete.mjs confirmă prezența tuturor specializărilor, capitolelor, notelor originale, formularelor și a fluxului WebView în DOM simulat; workflow-ul test-sciences-acceptance.yml rulează împreună toate cele patru Științe și testele de documente/navigație.
- Livrarea pentru acceptare nu se declară încheiere permanentă până când versiunea semnată Android și frontendul Cloudflare sunt sincronizate și utilizatorul verifică efectiv cele patru discipline pe telefon.

## Revizie de profunzime 21.11.2026 — PR #502 (nepublicată)
- Situația inițială: meniul «Teme de studiu» din gimnaziu deschidea aceeași singură fișă de capitol; un an real de fizică, chimie sau biologie nu poate fi reprezentat prin 1–4 materiale repetate.
- Pentru **România, gimnaziu** sunt acum lecții de studiu individuale, originale, organizate în domeniile programei 2017: Fizică VI **38**, VII **33**, VIII **36**; Chimie VII **40**, VIII **43**; Biologie V **33**, VI **34**, VII **33**, VIII **34**. Cifrele reprezintă fișe existente și unice, NU ore săptămânale sau un cuprins oficial de manual. Din activitatea «Teme de studiu» elevul vede lista reală, nu prima fișă deschisă automat.
- La Fizică și Biologie, lecțiile selectate sunt explicit adaptate clasei, fără alipirea automată a cardurilor generice care ar introduce materia din ani superiori. Pentru celelalte sisteme, programele nedocumentate continuă să poarte eticheta de **parcurs general orientativ**, nu o acreditare națională.
- Evaluarea este conectată cu fiecare fișă: întrebarea proprie, criterii de răspuns, validare deterministă doar când există date numerice exacte și recurs la evaluare contextuală pentru răspunsuri deschise. Răspunsurile neverificate nu se declară corecte.
- Lecțiile de referință în română sunt explicit marcate ca **RO source** dacă interfața nu este în română; aceasta nu înlocuiește o traducere didactică validată.
- Garduri automate: `tests_science_ro_course_quality.mjs`, `tests_science_grade_progression.mjs`, `tests_science_navigation.mjs` și `tests_science_exercise_verification.mjs`, în workflow-ul comun pentru 4 Științe. Acestea verifică și liste unice de lecții, anualitatea, butonul de verificare, lipsa topicurilor avansate inadecvate la clasa VI și întoarcerea în meniuri.
- **Stadiu: încă în curs, nu merge/deploy/APK final.** CI trecând nu înseamnă că există cursuri naționale verificate pentru toate cele 50 jurisdicții, teorii complete la toate nivelurile liceal și universitar, limbile pedagogic verificate ori test fizic Android. Nu livra APK până la acestea și acceptarea de către utilizator. Evită rapoartele și APK-urile fragmentare.
