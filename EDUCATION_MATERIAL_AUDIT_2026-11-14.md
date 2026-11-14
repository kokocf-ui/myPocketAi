# Audit Educație — 14 noiembrie 2026

## Domeniu
Revizie statică a datelor locale și a interfețelor din `kokocf-ui/myPocketAi`. Nu este o certificare a programei școlare, a conținutului AI sau o testare vizuală pe dispozitiv. Versiunea principală rămâne nemodificată până la verificarea ramurii.

## Probleme observate și intervenții în această ramură
- **Informatică:** testul cu variante ocupa spațiul de lucru, împreună cu editorul și toate instrumentele. Testul se lansează acum în fereastră dedicată; scrierea/analiza codului este într-o secțiune extensibilă. Lecția rămâne în fereastră paginată.
- **Pregătire examene:** clasele și materiile erau listate pe verticală, implicit cu maximum patru alegeri pe pagină și căutare peste patru. Sunt acum casete pe două coloane, cu iconițe. Căutarea rămâne pentru cataloage mari (>20), iar paginarea doar peste 24 de selecții. Sesiunea este compactă; testul se deschide separat.
- **Limbi străine:** `#languageAnswer` ieșea vizual din cartonaș. Răspunsul, microfonul și verificarea sunt într-un panou expansibil cu lățime și poziție limitate la cartonaș.

## Inventar verificat în sursele locale
| Domeniu | Conținut local identificat | Limite |
|---|---|---|
| Matematică | Motoare de calcul, formule și exerciții; teste automatizate pentru algebră, geometrie, probabilități, derivate etc. | Nu s-a demonstrat că fiecare clasă și subtemă are lecție explicativă completă |
| Chimie | 14 teme de bază, 165 fișe locale directe; catalog suplimentar avansat | Necesită control manual al profunzimii pe fiecare clasă |
| Fizică | 21 teme, 83 fișe directe; completări în registre de teorie | Echivalarea cu programa oficială nu este demonstrată |
| Biologie | 60 fișe de bază + 108 fișe specializate (168 total), potrivit testelor din repo | Necesită control al gradării și corelării pe clasă |
| Astronomie | 16 teme, 82 fișe locale | Conținut general; nu pretinde disciplină obligatorie în toate țările |
| Istorie/Geografie | Testul de acoperire enumeră 512 capitole școlare și 497 ghiduri locale extinse | Ghidurile generale nu sunt toate programe naționale certificate |
| Limbă și literatură | Catalog, căi școlare și bibliotecă explicativă; verificări automate ale lecturii și paginării | Nu este confirmată calitatea fiecărei lecții și opere |
| Informatică | 17 ramuri, 65 fișe de bază explicative complete (teorie, exemplu, exercițiu, întrebare), plus extensii pentru ani | Gradarea specifică fiecărei clase are nevoie de testare manuală |
| Limbi străine | 14 limbi, 8 tipuri de temă, 6 expresii introductive de bază/limbă, plus exemple suplimentare | Lecțiile de nivel superior sunt în mare măsură generate la cerere prin AI; nu există garanție de lecție offline pentru fiecare combinație limbă–nivel–temă |
| Cursuri practice | 6 cursuri × 6 lecții = 36 lecții locale cu explicații și sarcini | Nu reprezintă certificări profesionale |
| Pregătire examene | 39 definiții de examen, 24 materii posibile; 97 întrebări locale originale în 12 categorii | 12 materii din catalog fără bancă proprie de teste locale (detalii mai jos) |

## Lipsuri concrete
Categorii de examen fără întrebări proprii în `EXAM_LOCAL_BANK`: `native`, `foreign`, `french`, `german`, `polish`, `portuguese`, `italian`, `spanish`, `dutch`, `art`, `music`, `oral`. Aceasta nu înseamnă că lipsesc în mod necesar toate materialele de recapitulare: există opțiuni de instruire generală și AI. În lipsa întrebărilor locale, utilizatorul trebuie informat că practica originală locală nu este disponibilă, fără a afișa un test gol.

**Neconfirmate:** alinierea completă la fiecare programă școlară națională, conținut offline avansat pentru fiecare limbă/nivel, completitudinea fiecărui an din literatură/matematică și compatibilitatea vizuală pe Android după modificări.

## Criterii pentru închiderea auditului
1. Pentru fiecare selecție țară → clasă → materie → temă, test de navigare și conținut local semnificativ: definiții, explicație, exemplu și activitate; consemnarea distinctă a traseelor care necesită AI.
2. Verificare specifică a celor 12 categorii fără test local: fie bancă originală cu barem, fie indisponibilitate explicată, fără panou gol.
3. Regresii `tests_education_content_navigation.mjs`, `tests_computing_curriculum.mjs`, `tests_exam_curriculum_europe.mjs`, `tests_foreign_languages.mjs`, `tests_education_responsive_layout.mjs`.
4. Capturi pe Android: antet și dock fixe, casete încadrate, ultimul element accesibil, input fără depășire laterală, dialoguri paginate.
5. Abia după verificări, integrare în `main` și generarea APK-ului semnat de test.

Nicio altă funcționalitate a aplicației nu este autorizată pentru modificare de acest audit.

---

## Actualizare finală — 14 noiembrie 2026, după completările locale

**Cele 12 categorii de examen fără bancă proprie au fost populate cu câte cinci întrebări originale**, în `exam_bank_remaining.mjs`, importate în `exam_practice_bank.mjs`. Sunt 60 de întrebări noi; toate cele 24 de materii din catalog au acum cel puțin un set local de întrebări.

Aceste seturi verifică noțiuni introductive; **nu certifică programe naționale, nivel CEFR, probe oficiale sau pronunția vocală reală**. Ele nu înlocuiesc lecțiile complete de nivel avansat. Materialele locale din disciplinele generale rămân înregistrate mai sus și au verificări automatizate; exhaustivitatea și nivelarea pedagogică a fiecărei combinații țară–clasă–disciplină nu sunt garantate.

Educația poate fi **suspendată ca etapă activă de dezvoltare** după regresiile de integrare, fără să fie declarată în mod fals completă din punct de vedere academic. Eventualele lacune pedagogice care apar la utilizare se reiau separat, doar la solicitarea utilizatorului.

Următoarea etapă: `Mai multe instrumente`, cu funcții dedicate în locul invitațiilor generice către conversație.
