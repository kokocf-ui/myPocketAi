# Regulă obligatorie: prezentarea temelor în Educație

Aprobată la 13 noiembrie 2026, după testarea APK pe Android.

1. În orice spațiu de lucru al modulului **Educație**, temele se afișează numai prin titluri/casete/butoane selectabile. Nu se introduc sub acestea blocuri de text cu lecții, definiții, explicații, sinteze sau rezultate AI.
2. La atingerea unei teme sau la obținerea unei explicații/rezolvări/material AI, textul complet se deschide **în fereastră separată**, folosind cititorul comun cu **paginare** pentru conținut lung. Butoanele `Anterior` și `Următor` navighează paginile; `Înapoi` închide doar fereastra, păstrând tema selectată.
3. Antetul ferestrei rămâne fix, cu titlul materialului. **Salvare** și **Imprimare** se folosesc numai în fereastra de lucru/lecție, niciodată în meniul cu teme. Exportul include textul integral, nu doar pagina curentă.
4. Regula acoperă **Matematică, Fizică, Chimie, Biologie, Astronomie, Istorie, Geografie, Limbă și literatură, Informatică, limbi străine, cursuri practice și pregătire pentru examene**, precum și materialele create de asistentul AI în aceste module.
5. Se pot păstra în spațiul de lucru **comenzile, câmpurile de introdus date, numele temelor, mesajele scurte de stare și controalele interactive ale exercițiilor/testelor**. Acestea nu reprezintă afișarea lecției.
6. Nu se modifică funcțiile independente (navigație, evaluare, camera, dictare, hărți, traducere) doar pentru a aplica regula de prezentare. Verifică regresiile și obține un APK de test după fiecare schimbare vizuală aprobată.

Implementare: `educationOpenPagedLesson` din `index.js`. Verificările automate se află în `tests_education_content_navigation.mjs` și `tests_literature_offline_theory.mjs`.
