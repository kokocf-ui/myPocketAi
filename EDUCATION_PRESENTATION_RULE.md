# Regulă obligatorie: prezentarea temelor în Educație

Aprobată la 13 noiembrie 2026, după testarea APK pe Android.

1. În orice spațiu de lucru al modulului **Educație**, temele se afișează numai prin titluri/casete/butoane selectabile. Nu se introduc sub acestea blocuri de text cu lecții, definiții, explicații, sinteze sau rezultate AI.
2. La atingerea unei teme sau la obținerea unei explicații/rezolvări/material AI, textul complet se deschide **în fereastră separată**, folosind cititorul comun cu **paginare** pentru conținut lung. Butoanele `Anterior` și `Următor` navighează paginile; `Înapoi` închide doar fereastra, păstrând tema selectată.
3. Antetul ferestrei rămâne fix, cu titlul materialului. **Salvare** și **Imprimare** se folosesc numai în fereastra de lucru/lecție, niciodată în meniul cu teme. Exportul include textul integral, nu doar pagina curentă.
4. Regula acoperă **Matematică, Fizică, Chimie, Biologie, Astronomie, Istorie, Geografie, Limbă și literatură, Informatică, limbi străine, cursuri practice și pregătire pentru examene**, precum și materialele create de asistentul AI în aceste module.
5. Se pot păstra în spațiul de lucru **comenzile, câmpurile de introdus date, numele temelor, mesajele scurte de stare și controalele interactive ale exercițiilor/testelor**. Acestea nu reprezintă afișarea lecției.
6. Nu se modifică funcțiile independente (navigație, evaluare, camera, dictare, hărți, traducere) doar pentru a aplica regula de prezentare. Verifică regresiile și obține un APK de test după fiecare schimbare vizuală aprobată.

Implementare: `educationOpenPagedLesson` din `index.js`. Verificările automate se află în `tests_education_content_navigation.mjs` și `tests_literature_offline_theory.mjs`.

## Reguli de prezentare și accesibilitate – test Android 13.11.2026

7. **Tipografie profesională**: nu afișa surse Markdown brute în materialul predat. Titlurile, listele și alineatele se formatează vizual; marcajele de sintaxă (`**`, `#`, `- `, `* ` și delimitatori de cod) nu rămân pe ecran și nu se includ ca atare în PDF. Păstrează numai punctuația cu sens.
8. **Nicio temă goală**: după selectarea unei teme, aceasta trebuie să aibă subiecte și explicații locale reale, inclusiv în lipsa răspunsului AI. O eroare de generare nu poate lăsa numai titlul și un panou gol. Pentru Istorie/Geografie se folosește `hgGuaranteedSections`, care preferă datele existente și are un material didactic de rezervă.
9. **Limbi străine**: meniurile de limbi, variante, niveluri și capitole folosesc aceleași casete compacte în două coloane, cu iconițe orientative. Se păstrează nivelurile CEFR și funcțiile de testare, dictare și conversație. Lecțiile AI se citesc în aceeași fereastră paginată.
10. **Derulare simplă pe mobil**: tragerea în sus/jos trebuie să funcționeze și din spațiile libere dintre casete și din zonele goale ale ferestrei de lectură. Antetul și navigarea rămân accesibile; ultimul element se poate aduce complet deasupra barei fixe de navigare.
11. **Titlu lizibil**: în fereastra materialului, butoanele Înapoi/Salvare/Imprimare se află pe un rând distinct, iar titlul pe un rând complet, fără suprapunere sau forțare la o coloană îngustă.

La fiecare modificare, verifică vizual pe Android și livrează APK-ul semnat pentru testare. Nu extinde schimbări în alte module fără acord.
