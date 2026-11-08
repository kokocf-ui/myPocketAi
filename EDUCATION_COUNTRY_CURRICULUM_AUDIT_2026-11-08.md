# Audit transversal Educație — myPocketAI
**Data:** 8 noiembrie 2026 · **Bază:** `main`, commit verificat `00ec28353e28aec07e3f7ac68936decc64603a88`
**Scop:** conformarea structurii de studiu cu țara, etapa școlară, clasa, programa în vigoare și, pentru admitere, cerințele programului și instituției.
**Statut:** AUDIT și specificație de implementare; acest document nu pretinde că funcționalitățile propuse sunt deja implementate sau testate pe Android.

## Concluzia auditului
Interfața curentă amestecă uneori „nivel de dificultate” cu „etapă educațională”. Nivelul minim al unei teme (`minLevel`) nu este echivalent cu o încadrare exclusivă într-o programă. Pot exista teme comune studiate diferit la gimnaziu, liceu și universitate, dar trebuie să aibă **lecții/obiective/cerințe distincte** pe nivel, nu aceeași fișă reutilizată fără diferențiere. Unele module nu au țară înainte de materie; unele au țară, dar nu o propagă până la lecția efectivă.

## Flux comun obligatoriu (materiile școlare)
1. **Țara de studiu** — primul ecran după intrarea într-un modul; câmp de căutare completat cu țara determinată prin serviciul deja existent de țară (`/api/finance-country`, dacă sunt disponibile date adecvate), altfel cu ultima țară confirmată sau o valoare clar „neconfirmată”. La focus, textul câmpului este selectat pentru înlocuire; primele 4 opțiuni relevante se actualizează la tastare. Niciun limbaj al interfeței nu este probă de țară. Utilizatorul confirmă, poate schimba țara și are întotdeauna ultimul cuvânt.
2. **Etapa școlară**, cu echivalări specifice jurisdicției: România primar I–IV, gimnaziu V–VIII, liceu IX–XII (XIII unde se aplică), universitate; Anglia KS1/KS2, KS3 (Years 7–9), KS4 (Years 10–11), post-16, higher education; Scoția, Țara Galilor și Irlanda de Nord au sisteme proprii. NU echivala automat „Începător” cu toată perioada primar+gimnaziu.
3. **Clasa/anul + profilul/filiera**, când programa se diferențiază: matematică-informatică / științele naturii / filologie etc. pentru România; alte categorii numai dacă sunt documentate. Anul școlar este obligatoriu în metadatele programei deoarece apar tranziții de curriculum.
4. **Disciplina** (unde modulul agregă discipline) → **capitole/competențe proprii pentru etapa și anul selectate** → lecția, exercițiile și evaluarea. O temă comună poate apărea în mai multe etape doar cu o versiune explicită de curriculum pentru fiecare.
5. **Eticheta sursei** pentru fiecare parcurs: `programa oficială verificată`, `cadru oficial general — succesiune orientativă` sau `învățare generală — programă neconfirmată`. Nu prezenta temele create de AI drept programă ministerială, subiecte oficiale ori probe confirmate.
6. Schimbarea țării invalidează selecția precedentă de clasă, profil, examen, facultate și capitol, păstrând documentele și rezultatele salvate asociate cu țara lor inițială. Nu împinge utilizatorul spre localizarea GPS dacă vrea să studieze o altă țară.

## Audit pe module
| Modul | Observație verificată în cod | Corecție necesară |
|---|---|---|
| **Matematică** — `index.js`, `MATH_LEVELS`, `mathSubjectsForLevel` | Nivelul Începător combină clasele I–VIII; subramurile sunt filtrate prin `levels`, nu printr-o planificare oficială de clasă. | Separare primar/gimnaziu, liceu (profil și an), universitate; conținut și tipuri de exerciții ale clasei, nu doar ton adaptat. |
| **Fizică** — `physics_curriculum.mjs` | Capitolele au `minLevel`; nu sunt catalogate pe clase/țări. | România VI–VIII separat de IX–XII, nivel universitar pe specializare; pentru alte țări trasee distincte cu sursă. |
| **Chimie** — `chemistry_curriculum.mjs`, `chemistry_advanced.mjs` | Etapele sunt denumite VII–VIII, IX–XII, universitar, dar capitolele sunt marcate `minLevel`, nu programă anuală. | Catalog pe clase VII–VIII și IX–XII, cu versiune de curriculum și specializări; exclude teme fără lecții valabile la etapa selectată. |
| **Biologie** — `biology_curriculum.mjs` | Material extins, capitole cu `minLevel` și specializări universitare; lipsesc țara/clasa ca chei normative. | Alocare competențe și teme pe V–VIII, IX–XII și universitar, conform sursei, nu pe simpla accesibilitate. |
| **Astronomie** — `astronomy_curriculum.mjs` | Lecții generale plus specializări; curriculum național neasociat. | Învățare generală când nu există disciplină autonomă în programa țării; punte justificată spre Fizică/Geografie, nu poziționare fictivă ca materie obligatorie. |
| **Istorie și geografie** — `history_geography_curriculum.mjs`, `index.js` | „Mediu” amestecă gimnaziu și liceu; ordinea actuală include materie → scop → țară. | Țară prima; apoi primar/gimnaziu/liceu/universitate, clase și conținut național/istorie universală după programa selectată. Menține hărțile doar când există surse autentice. |
| **Limbă și literatură** — secțiunea `litOpen` din `index.js` | Are țară, clasă și profil; acesta este traseul cel mai apropiat de cerință. | Prefill cu țara verificată; validare efectivă a capitolelor pe an, profil și sistem; distinge oficial vs general. |
| **Limbi străine** — `foreign_languages_curriculum.mjs`, `foreign_languages_learning.mjs` | Nivelurile CEFR (A1–C2) sunt niveluri de competență lingvistică, nu clase școlare. | Păstrează CEFR ca subnivel separat; oferă **Mod școlar (țară → clasă → limbă)** și **Învățare liberă (A1–C2)**. Pentru latina/greaca clasică, tradițiile nu trebuie convertite fictiv în CEFR. |
| **Informatică** — `computing_curriculum.mjs`, `computing_ui.mjs` | „Mediu” este explicit „gimnaziu și liceu”, cu aceleași căi generale. | Separă digital primar, gimnaziu, liceu (inclusiv profil), universitar; algoritmi, programare și structuri de date la gradul specific clasei. |
| **Pregătire examene** — `exam_curriculum_europe.mjs`, `exam_ui.mjs` | Țară prima; profiluri europene și domenii universitare; universitate oferă domeniu → materii generale, NU instituție/specializare și metodologie exactă. | Țară → nivel/examen → **domeniu → specializare/program → universitate/facultate → sesiune/an → probe obligatorii/opționale + bibliografie + modalitate selecție**. Dacă cerințele nu sunt verificate, nu produce simulare „conform facultății”. |
| **Cursuri practice** — `practical_curriculum.mjs`, `practical_ui.mjs` | Șase cursuri, 36 de lecții, fără selector de dificultate, conform deciziei de produs. | Păstrează **excepția**: cursuri independente, fără separare gimnaziu/liceu/universitate; țara prima pentru resurse și legislație. |

## Admitere universitară: cerință de date, nu doar butoane
Flux: **țară → domeniu → specializare/program → instituții care oferă programul (căutare, rezultate indexate) → anul admiterii → condiții verificabile → pregătire și simulare**.
- Pentru fiecare instituție/program, stochează: denumire oficială, identificator de program, sediu, jurisdicție, limbă de predare, anul/sesiunea, sursa oficială, data verificării, tipul selecției, probe obligatorii, probe la alegere, ponderi și bibliografie, cu statut `verified`/`advisory`/`unknown`. Nu atribui aceeași listă de discipline întregului domeniu.
- **Exemple verificate 2026 România**: UMF Iași — Medicină și Medicină Dentară: Anatomia și fiziologia omului obligatoriu + Chimie organică **sau** Fizică la alegere. UMF Cluj — pentru Medicină în iulie 2026 sunt prezentate grile Biologie și Chimie. Aceste două instituții **nu au structură identică**; trebuie selectată facultatea.
- **Regatul Unit**: Medical Schools Council publică liste pe **curs și tipul admiterii** pentru 2027; cerințele sunt oferite de facultăți, dar sunt supuse modificărilor și trebuie confirmate pe site-ul fiecăreia. Nu proiecta concursul scris românesc asupra universităților britanice.
- **Alte domenii**: folosește registrul instituțiilor și pagini oficiale de admitere; până la confirmare afișează instituția ca opțiune de explorare și oferă **pregătire generală**, nu „probe oficiale”.
- Domeniul (ex. „Medicină”) nu este același lucru cu specializarea/programul (Medicină generală, Medicină Dentară, Farmacie, Asistență Medicală etc.), nici cu facultatea. Programul selectat trebuie să conducă filtrarea instituțiilor.
- Indexarea trebuie să poată arăta până la **patru rezultate simultan**, actualizate la fiecare caracter; nu limita întregul catalog la patru instituții.

## Surse oficiale și exemple documentare
- România, gimnaziu, OMEN 3393/2017: https://www.edu.ro/Ordin_ministru_3393_2017
- România, programe noi liceu, aprobate 2025 și aplicate progresiv de la clasa IX în 2026–2027: https://www.edu.ro/press_rel_02_2026
- România, planuri-cadru pe profil: https://www.edu.ro/OMEC_4350_2025_planuri_cadru_liceu_frecventa_zi
- Anglia, Key Stages 3/4: https://www.gov.uk/national-curriculum/key-stage-3-and-4
- Anglia, cadrul național cu Years și Key Stages: https://www.gov.uk/government/publications/national-curriculum-in-england-framework-for-key-stages-1-to-4
- România, instituții universitare: https://www.edu.ro/institutii-invatamant-superior
- UMF Iași, admitere 2026–2027: https://news.umfiasi.ro/metodologia-concursului-de-admitere-pentru-anul-universitar-2026-2027/
- UMF Cluj, admitere iulie 2026: https://umfcluj.ro/programe-studii/admitere-licenta/admitere-iulie-2026/
- UK Medical Schools Council, admitere 2027: https://www.medschools.ac.uk/for-students/applying-to-medical-school/entry-requirements/
- Universitatea din București FMI, admitere 2026: https://fmi.unibuc.ro/admitere-licenta-iulie-2026/

## Criterii de acceptanță / regresie pentru IMPLEMENTARE
1. Deschiderea fiecărui modul didactic arată selectorul de țară primul; dacă locația a fost determinată, câmpul este precompletat, iar atingerea selectează integral textul, fără a deschide tastatura până când utilizatorul atinge câmpul.
2. Alegerea României și gimnaziului nu permite afișarea lecțiilor universitare în lista școlară; dacă o noțiune se repetă, fiecare ciclu afișează un **material propriu**.
3. Alegerea României, clasa IX, anul 2026–2027 aplică noul curriculum relevant; clasele X–XII nu sunt trecute artificial la acesta în aceeași sesiune.
4. Anglia KS3 și KS4 nu sunt etichetate drept clasele românești V–VIII/IX–XII.
5. O țară fără programă verificată afișează un curs general explicit etichetat, nu o programă inventată.
6. Selectarea Medicină → program → UMF Iași 2026–2027 afișează obligatoriu Anatomie și Fiziologie + alegere Chimie/Fizică; nu susține că UMF Cluj are aceleași probe.
7. Cursuri practice rămân fără niveluri școlare, dar păstrează țara și sursele relevante.
8. Verifică sursele instituțiilor periodic înainte de a declara admiterea anului următor drept confirmată; după expirarea sesiunii, etichetează „exemplu istoric”.
9. Teste UI pentru Android, navigare Înapoi, selector de 4 rezultate, lipsa tastaturii involuntare, resetarea contextuală și PDF; nu pretinde build reușit fără rezultat CI.

## Regula de lansare
Nu modifica automat toate modulele în același timp fără teste de regresie. Într-o livrare coerentă: introduceți catalogul jurisdicție/nivel/clasă cu statut sursă, apoi rutarea lecțiilor și facultăților, după care validați **toate modulele**, generarea scriptului, Android și APK semnat. Un audit și o specificație nu certifică implementarea.
