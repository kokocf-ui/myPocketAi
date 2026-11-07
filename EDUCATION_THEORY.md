# Educație — bibliotecă de teorie, revizia Matematică

## Matematică
Catalogul offline conține **211 fișe matematice** cu enunț și formulă, în toate cele 11 ramuri selectabile din aplicație: Aritmetică, Algebră, Geometrie, Trigonometrie, Funcții și grafice, Măsurători și unități, Statistică și probabilități, Algebră liniară, Analiză matematică, Ecuații diferențiale, Matematică discretă.

Nivelurile sunt Începător (primar–gimnaziu), Mediu (liceu) și Avansat (universitate și mai departe); ele filtrează materia, teoria disponibilă și indicațiile pedagogice către AI. Întrebările mai grele nu sunt rescrise automat în alt exercițiu.

## Căutare indexată
Dialogul Teorie pornește gol. La **prima literă tastată** sau la transcrierea vocală, listează până la **patru** rezultate filtrate progresiv după început de titlu, sinonim sau cuvânt. Nu afișează teoreme aleatorii înainte de interogare. Fișa selectată arată enunțul și formula, nu o rezolvare inventată. Căutarea funcționează fără diacritice. Datele sunt ținute numai în `education_theory.mjs` și serializate în UI la construirea paginii.

## Fizică și Chimie
Sunt disponibile câte 19 fișe introductive. Aceste materii **nu sunt declarate complete** prin această revizie și vor fi extinse separat după Matematică.

## Matematică — moduri de lucru
Rezolvă pas cu pas / Explică metoda / Reprezentare grafică folosesc motoare deterministe pentru cazurile recunoscute, cu verificări și constrângeri de domeniu; în rest pot folosi explicația AI **marcată nevalidată**, niciodată prezentată drept calcul local verificat. `math_advanced_verified.mjs` completează peste motoarele existente: teoria numerelor, procente, vectori 2D/3D, determinanți, varianța eșantionului, probabilități binomiale, funcții, derivate și primitive elementare și ecuații diferențiale elementare.

Figurile 2D/3D și diagramele susțin rezultatele într-un colț: numai valori calculate din enunțul / figura actuală, fără explicații suplimentare suprapuse, fără presupuneri de dimensiuni. Când nu există un grafic verificat, interfața explică limitarea și nu inventează o imagine.

OCR-ul păstrează transcrierea ca **neconfirmată** până la selecția explicită a unui exercițiu. Corecțiile pentru V/√ și x2/x² sunt oferite manual, nu aplicate pe ascuns. Se pot parcurge liste lungi de exerciții, nu doar primele trei; dictarea folosește puntea vocală Android cu verificarea semnelor negative, a parantezelor și avertisment la transcriere necertă. Modul pilot AI pentru foto rămâne opțional, nu pornește servicii cu cost fără consimțământ.

## Validare tehnică
- `npm run check` — sintaxa Worker/Frontend.
- `npm run test:ui` — include toate testele existente plus `tests_education_theory.mjs`, `tests_education_theory_ui.mjs`, `tests_math_advanced_verified.mjs`, `tests_math_graph_complete.mjs`, `tests_math_input_integrity.mjs`.
- `npm run test:android` — puntea Android și regresiile ei.
- Gradle APK debug în GitHub Actions și verificarea deploy-ului separat.

**Criteriul tehnic de închidere:** toate testele automate sunt verzi, modificările sunt integrate în `main`, iar versiunea live reflectă commitul. **Criteriul practic separat:** utilizatorul verifică pe dispozitiv rezolvările, dictarea, fotografiile, graficele, nivelurile și Back.

**Limită a domeniului:** implementarea asigură acoperirea funcțională a celor 11 ramuri și biblioteca de 211 concepte; acest lucru nu este echivalent cu o bază exhaustivă a tuturor teoremelor, cercetării și problemelor matematice universitare posibile.
