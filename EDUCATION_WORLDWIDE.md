# Educație — acces mondial pe țări, clase, materii și capitole

## Ce este implementat

Aceasta este infrastructura comună pentru toate țările selectabile în Educație, nu o afirmație că am transcris integral programele legale din toate țările.

1. Alegerea țării rămâne o singură casetă, cu sugestii de la prima literă, fără tabel imens. Identificarea locației doar sugerează țara; alegerea utilizatorului prevalează.
2. Modulul `education_worldwide_paths.mjs` oferă câte patru etape în meniul Educație (primar, secundar inferior, secundar superior, universitar). Denumirile locale sunt configurate pentru peste 35 de sisteme/referințe de țară, inclusiv cele patru jurisdicții UK, Franța, Germania, Italia, Spania, Portugalia, SUA, Canada, Australia, Japonia, China, India, Brazilia, Republica Coreea ș.a. Sunt trasee **orientative**, nu reproduceri certificate ale programei.
3. Pentru celelalte țări ISO selectabile există o alegere reală de clasă/an pe nivel ISCED (1–6 primar, 1–3 inferior, 1–3 superior) cu etichetare explicită drept orientare. Nu înseamnă că sistemul național are obligatoriu aceste cicluri; utilizatorul poate introduce clasa locală.
4. Istorie și Geografie oferă pe fiecare nivel un cuprins internațional și cinci capitole suplimentare de studiu local. Aceste capitole sunt metode de investigare și învățare, nu afirmații istorice sau statistici inventate despre țară. Profesorul AI poate dezvolta detalii, dar sursele și afirmațiile trebuie verificate.
5. Explicațiile locale și capitolele internaționale se construiesc la deschiderea lecției, evitând încărcarea tuturor țărilor în memoria UI la pornire.
6. Matematică, Științe, Informatică, Limbă și literatură folosesc același pas de țară/clasă; modulele păstrează motoarele lor de exerciții și teoria existentă. Limbă și literatură, examene și cursuri practice nu mai afișează «România» ca implicit când utilizatorul a ales o țară neacoperită de un catalog european.
7. Pregătirea pentru examene folosește proba oficială numai dacă există o intrare verificată în catalog; altfel oferă exerciții de pregătire **orientative** și anunță clar că nu reprezintă subiecte naționale.
8. Butoanele comune de navigație, PDF și imprimare rămân neschimbate.

## Ce NU este încă acoperit exhaustiv

- **Programe naționale complete** pentru toate țările, toate clasele, disciplinele, specializările sau examenele. Un catalog mondial cu mii de programe cere cercetare și validare națională/regională periodică.
- Nu există deocamdată mapare verificată pentru toate statele, cantoanele, provinciile, comunitățile lingvistice și board-urile de examen. Modulele afișează în acest caz caracterul orientativ.
- Conținutul nu este garantat în toate limbile de predare ale lumii; limba interfeței și limba școlii pot fi diferite.
- Compilarea CI confirmă sintaxa, testele și build-ul; comportamentul tactil, microfonul și imprimarea trebuie testate efectiv pe APK.

## Surse metodologice

- UNESCO Institute for Statistics, ISCED: https://www.uis.unesco.org/en/methods-and-tools/isced
- UNESCO Institute for Statistics, country mappings: https://www.uis.unesco.org/en/methods-and-tools/isced/mapping-and-diagrams
- Eurydice, structure of European education systems: https://doi.org/10.2797/7270983

ISCED clasifică nivelurile comparativ. Nu definește lista oficială de capitole a fiecărei țări.

## Verificare

```sh
npm run check
node tests_education_worldwide.mjs
npm run test:ui
npm run test:android
```

Testul mondial verifică toate codurile de țară oferite de selector, grupe de ani, etichetarea neoficială, minimum 15 capitole orientative pentru Istorie și Geografie pe nivel și integrarea țării în Pregătire examene/Cursuri practice.
