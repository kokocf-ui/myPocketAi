# Revizie Educație — 26 noiembrie 2026

## Cererea și limitele acestei etape

Continuarea lucrului pentru România, după pachetele naționale: fereastra de lucru dispărută, verificarea științelor universitare și astronomiei, teste rezolvate de elev/student cu îndrumare la greșeli, simplificarea Bac XII/XIII. Nu s-a reluat extinderea tuturor țărilor, traducerea APK sau construirea unui APK. Nu s-a făcut deploy/PR/merge în această etapă.

## 1. Cauza ferestrei lipsă și remedierea

Noile ecrane naționale înlocuiau ecranul vechi cu butoane Teorie/Exemple/Exerciții/Test, însă nu montau editorul de răspuns. Cititorul separat nu înlocuiește un spațiu de lucru.

`education_lesson_workspace.mjs`, emis cu nume explicit `var` prin cititorul comun, este acum montat în lecțiile naționale de Literatură, Matematică, Istorie, Geografie, Informatică, Fizică, Chimie, Biologie. Include:

- alegerea cerinței din test, exercițiilor sau un enunț propriu;
- enunț separat de rezolvare, fără a arăta inițial răspunsul de referință;
- ciorne per materie/țară/etapă/an/lecție/limbă/cerință, în localStorage când este disponibil;
- verificare online `education_study/correction` cu cerința exactă, răspunsul elevului și reperul testului;
- instrucțiune de verdict argumentat, primul pas greșit, metodă, rezolvare numerotată și verificare;
- reper local și exemplul lecției, disponibile după o încercare, **fără a pretinde că un răspuns deschis a fost evaluat offline**;
- anulare, termen-limită 45 s, gardă contra răspunsurilor întârziate și text randat sigur.

Pentru exercițiile fără răspuns local și enunțurile proprii, exemplul lecției este etichetat explicit ca exemplu, nu prezentat drept rezolvarea acelei cerințe.

## 2. Științe universitare și astronomie

Auditul codului și testele existente arată că motorul anterior are deja cursuri universitare: testul comun verifică 30 de specializări, 189 de capitole și 612 subteme. Aceste cifre descriu conținutul navigabil și structura, **nu certifică acoperirea programelor naționale sau facultăților**. Noul motor național RO nu avea încă pachete universitare de Fizică/Chimie/Biologie. Cursurile universitare vechi au fost păstrate, nu înlocuite prin două lecții suplimentare.

La Astronomie, testele verifică traseele școlare existente, progresia activităților, calculele, diagramele și 7 specializări. Pentru RO există deja teme diferite IX–XII; astronomia poate fi integrată în alte discipline și nu este declarată materie obligatorie separată în fiecare clasă.

S-a adăugat `public/education/science/review/RO.json`: **singura sursă a textului nou**, 28 de aplicații originale, cu teorie, enunț, rezolvare detaliată, răspuns și greșeală frecventă:

| Materie | An I | An II | An III |
|---|---|---|---|
| Fizică | incertitudinea vitezei; oscilator armonic | normalizarea stării cuantice; entropie | Bragg; dezintegrare radioactivă |
| Chimie | diluare; reactant limitant | tampon; cinetică | spectrofotometrie; Nernst |
| Biologie | scară microscopică; pseudoreplicare | Hardy–Weinberg; Michaelis–Menten | valori predictive ale testelor; valoarea p |
| Astronomie | paralaxă/incertitudine; rezoluție | modul de distanță/extincție; mase orbitale | tranzite; Hubble la z mic |

În plus, Astronomie IX–XII: faze versus eclipse, Kepler, Wien, magnitudini/fluxuri (câte o aplicație/an).

Acces: Științe → materia → anul și specializarea existente → capitole → **Aplicații suplimentare · metodă și rezolvare**. Încărcare la deschiderea secțiunii; rezervă locală după o încărcare reușită, dacă stocarea permite. Fiecare aplicație are cititor și fereastră de lucru.

Statutul materialelor noi: `partial-original-material-independent-review-pending`. Sunt suplimente orientative, nu ani cu 30–36 de lecții, nu cursuri acreditate și nu corelare verificată capitol-cu-capitol cu manuale sau fișe de disciplină. Adăugarea lor nu schimbă statutul de verificare al cursurilor vechi.

## 3. Pregătirea examenelor

### Teste scrise din aceeași sursă

`exam_lesson_practice.mjs` încarcă prin motorul comun testele lecțiilor naționale existente, fără a copia acele întrebări într-o a doua bancă:

- Evaluare Națională VIII: pachetele clasei VIII unde există (Română, Matematică);
- Bac: lecții IX–XII pentru materiile care au pachete; la Matematică, M1; la Științe, profil real; selecția exactă de examen rămâne de verificat pe profil/probă;
- Examene universitare I–III: testele pachetelor de Literatură, Matematică, Istorie, Geografie, Informatică; pentru cele patru științe, aplicațiile universitare suplimentare (două pe an și materie). Nu sunt prezentate ca întreaga materie a examenului facultății.

La matematică, titlurile și unitățile filtrează testele după capitolul selectat; recapitularea permite toate temele. La celelalte materii se alege explicit lecția, fără a pretinde o corelare automată neverificată cu capitolul generic de examen.

### Ce se întâmplă la răspuns greșit

- Testul scris folosește fereastra comună: asistentul primește enunțul, încercarea și reperul; explică primul pas greșit și rezolvarea pas cu pas. Verdictul este orientativ.
- Grila existentă păstrează scorul determinist și explicația locală; după verificare, asistentul primește automat numai întrebările greșite și dezvoltă metoda și rezolvarea. AI nu modifică scorul calculat local.
- Dacă AI nu este disponibil, nu se inventează o evaluare. Rămân reperele locale și mesajul de indisponibilitate.
- Grila veche este marcată ca diagnostic al noțiunilor de bază, nu simulare completă calibrată pe Bac sau examen universitar.
- Pentru o problemă proprie există câmp separat pentru enunț, obligatoriu împreună cu rezolvarea la corectare. Ciornele sunt separate după contextul examenului. S-a reparat și variabila `refreshRomanian` nedeclarată în spațiul de Română.

### Bac și universitate

O singură intrare **Bacalaureat · XII / XIII (seral)**. Profilul și proba rămân relevante; nu s-a presupus că toate variantele de Matematică sau Științe au aceeași programă. Compatibilitate la căutare pentru vechiul ID `13 seral`, fără un al doilea card.

Admiterea la universitate rămâne separată de **Examene universitare · Licență I/II/III**. Pentru acestea din urmă se precizează că tematica reală depinde de facultate și fișa disciplinei. Astronomia/astrofizica apare numai ca opțiune universitară orientativă, nu ca probă de Bac inventată.

## 4. Publicarea conținutului

S-au extins rutele permise și staging-ul serviciului separat la pachetele naționale din toate cele opt discipline și la noul supliment de Științe. Catalogul și versiunile fișierelor sunt validate, inclusiv formatele vechi HU/FR. Staging local: **3.762 de fișiere / 91.754.843 bytes**. Serviciul separat nu a fost activat sau publicat prin aceste verificări.

## 5. Verificări și ce NU demonstrează ele

- `npm run check`, testele naționale ale materiilor afectate, cititorul comun, admitere, examene, navigare și viewport Științe, plafonul HTML și suita de localizare existente — trecute.
- `tests_education_review_2026.mjs`: schema/hash, distribuția celor 28 de lecții, calcule numerice reprezentative independente, Bac unic, separarea universitate/admitere, rutele serviciului.
- Testele universitare și de Astronomie existente: conținut, progresie, dovezi de țară și lecții de Fizică universitară — trecute. Nu sunt revizie academică independentă a tuturor lecțiilor.
- `wrangler deploy --dry-run` + verificarea numelor browser: nicio funcție redenumită incompatibil; conținutul nou nu este încorporat în HTML.
- `tests_education_workspace_browser.mjs` în Chromium real, viewport 390×844, inclusiv pe **bundle-ul de producție**: 8 materii naționale, ciorne și izolarea cerințelor, referințe locale, indisponibilitate API, 12 perechi materie/an universitar, 4 ani de astronomie școlară, rezervă locală a suplimentului, Bac unic, filtrare analiză, test scris și îndrumare după grilă greșită.
- În testul browser, răspunsurile AI sunt **simulate controlat**: verifică transportul/contextul, tratarea erorilor și afișarea, nu calitatea pedagogică a unui răspuns generat live. Nu s-a instalat un APK pe telefonul utilizatorului.

Workflow nou: `.github/workflows/education-workspace-review.yml`, fără deploy, pentru aceste verificări la PR sau la pornire manuală.

## Rămâne

Revizie academică independentă și comparare efectivă cu programele/fișele de disciplină; extinderea pachetelor universitare naționale complete de Științe dacă se dorește trecerea lor pe noul motor; simulări complete calibrate după toate probele/profilurile de Bac și bibliografia fiecărei facultăți; țările din afara RO; traducerea APK, amânată anterior. Nicio certificare integrală nu a fost adăugată.
