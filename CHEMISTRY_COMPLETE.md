# Chimie — integrare educațională pe specializări

## Domeniu și criteriu de finalizare
Fluxul este **Științe → Chimie → Începător / Mediu / Avansat**. La Avansat apare **specializarea**, apoi **capitolele**, apoi **spațiul de lucru**. La Începător și Mediu rămâne fluxul anterior (nivel → capitol → spațiu de lucru).

Catalogul cuprinde 184 fișe din materia de bază, 14 capitole generale și **84 de fișe universitare suplimentare** în **28 de capitole distincte** repartizate în **7 specializări**:

1. Chimie generală avansată: structură cuantică, termodinamică, cinetică, coordinație.
2. Chimie farmaceutică: proiectarea moleculelor, ADME, calitate, stabilitate.
3. Chimie medicinală și biochimie clinică: enzime/metabolism, tamponare biologică, biomarkeri, redox.
4. Chimie analitică instrumentală: spectroscopie, cromatografie, titrări, metrologie.
5. Chimie industrială și materiale: reactoare, cataliză, polimeri, materiale.
6. Chimia mediului: apă, aer, soluri, monitorizare/expunere.
7. Chimie computațională: structură electronică, mecanică moleculară, docking, validare.

Fiecare specializare combină capitole proprii cu capitole de bază relevante, fără duplicarea fișelor. Nivelul și specializarea sunt menținute și la navigarea Înapoi. Drafturile de exerciții sunt izolate pe materie, specializare și capitol.

## Spațiu de lucru
- **Teorie:** enunț, formulă, căutare de la prima literă (maximum 4 sugestii), citire prin fluxul existent, revenire în aceeași materie. Pentru Avansat, teoria poate fi accesată din capitolul ales.
- **Exerciții:** introducere manuală, dictare Android, fotografie/album cu confirmare înainte de utilizare, simboluri chimice, Rezolvă pas cu pas și Explică metoda.
- **Motor local verificabil:** ecuații chimice neutre cu formule valide și coeficienți întregi minimi, conservarea atomilor, formule explicite pentru n=m/M, c=n/V și diluție C1V1=C2V2. Calculele sunt etichetate ca verificate *numai* când reușește validarea deterministă. Ecuațiile ionice, formulele necunoscute, problemele subdeterminate și enunțurile ambigue nu primesc rezultate fabricate.
- **AI fallback:** celelalte exerciții sunt contextualizate prin specializare, nivel și capitol, cu precizarea că răspunsul AI necesită verificare. Nu se prescriu medicamente sau tratamente și nu se inventează condiții de laborator.
- **Molecule 3D:** vizualizare locală interactivă cu zoom și rotire în fereastră delimitată, pentru 4 geometrii didactice bine definite: H₂O, CO₂, CH₄, NH₃. Nu se inventează geometrii pentru orice formulă.
- **Responsive:** editorul crește progresiv până la spațiul permis de dispozitiv, apoi își derulează intern conținutul și urmărește cursorul; dialogurile se adaptează conținutului până la înălțimea maximă, după care derulează intern. Tastatura Android nu trebuie să acopere acțiunile. Orice figură 3D rămâne în cadrul său.

## Siguranță și limita domeniului
Acoperirea universitară este un traseu educațional organizat, nu o promisiune că sunt reprezentate toate disciplinele de cercetare din chimie sau că aplicația certifică un program universitar. Conținutul biomedical și farmaceutic este teoretic, nu diagnostic sau recomandare clinică. Simularea 3D este idealizată și limitată la modelele validate.

Structura de bază și specializările reflectă un echilibru între fundament și aprofundare, compatibil ca principiu cu ghidurile ACS privind cursurile introductive, fundamentale și aprofundate: https://www.acs.org/education/policies/acs-approval-program/guidelines/coursework.html

## Verificare automată
`npm run check` validează modulele JavaScript. `npm run test:ui` execută inclusiv `tests_chemistry_curriculum.mjs`, `tests_science_navigation.mjs` și `tests_chemistry_complete.mjs`; ultimul verifică toate specializările, integritatea fișelor, ecuațiile (inclusiv paranteze), cazurile nevalidate, reprezentările și contractele UI.

**Testele automate nu înlocuiesc verificarea ulterioară pe telefon**, în special în WebView/Android: tastatură, OCR pentru indici/sarcini, dictare, modelul 3D, derulare și animațiile dialogurilor. La finalul modulului Educație se face testarea practică împreună cu utilizatorul.
