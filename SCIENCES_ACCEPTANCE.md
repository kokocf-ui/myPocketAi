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
