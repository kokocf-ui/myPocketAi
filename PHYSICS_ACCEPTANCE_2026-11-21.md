# Fizică — criterii reale de acceptare pentru toate țările (21.11.2026)
**Stare: dezvoltare și audit parțial verificate; NU modul certificat/finalizat și NU aprobarea unui APK.**

## Ce este implementat în PR #503, dependent de PR #502

- **Structura claselor:** opțiunile de țară din Educație păstrează 50 de jurisdicții europene (incluzând separat cele patru națiuni UK). Pentru 49 sunt disponibile nume / numere de ani școlari mapate pe structură cunoscută sau orientativă; Vatican păstrează explicit un parcurs generic, fiindcă un curriculum național civil comparabil nu este documentat. În unele state (Andorra, Bosnia, Germania, Elveția, Belgia etc.) lipsește identificarea obligatorie a filierei/regiunii. Afișarea unui an nu certifică **programa anuală de Fizică**.
- **Anularea subiectelor false:** în România, Fizica separată nu apare în clasa a V-a. Franța 6e, Letonia 7, Ungaria 5–6, Portugalia 5–6 au statut integrat, unde sunt relevante. Danemarca Fizică+Chimie este comună la clasele 7–9, Finlanda separă Fizica la 7–9 după Științele mediului la 1–6, Norvegia predă Naturfag integrat. Anii XI–XIII și universitățile rămân dependenți de traseu și programa locală. Nu se pretinde că aceste scheme reprezintă manuale naționale.
- **Ani reali corectați:** Irlanda include Junior/Senior Infants, clasele First–Sixth, Junior Cycle și Transition Year (în funcție de școală), Fifth Year, Sixth Year; Danemarca nu mai confundă clasa 0 pregătitoare cu primul an primar. Pentru 22 de țări au fost adăugate grupări de clase orientative din structura Eurydice 2026/27; Monaco, Liechtenstein, Bosnia și Andorra au note explicite de sistem.
- **Științe integrate versus Fizică separată:** sursele/regulile se află în `physics_europe_frameworks.mjs`, iar când programa națională anuală nu e disponibilă, `verifiedAnnual` este `false` și cursul e numit orientativ.
- **Primar:** `physicsPrimaryYearLessons` oferă lecții și întrebări de investigație cu grad de dificultate progresiv, nu curs universitar sau o Fizică separată obligatorie.
- **Gimnaziu:** `physicsAdvisoryTopicLessons` oferă 8 lecții explicative distincte în engleză pe capitol pentru sistemele în care conținutul național anual nu este verificat; România păstrează lecțiile speciale VI=38, VII=33, VIII=36 din PR #502.
- **Liceu:** 42 studii de caz originale în română și **42 în engleză**, distribuite în 14 domenii, cu calcule, unități, enunț, răspuns de referință și explicația metodei. Recapitulările sunt marcate, nu prezentate ca lecții noi dintr-o programă națională.
- **Universitate:** toate cele 7 specializări de Fizică au câte 4 studii de caz originale în română și engleză (28 cazuri, 56 texte bilingve), adăugate cursurilor specializate existente. În cititorul Android elevul poate selecta **care dintre cele 4 exerciții** să fie verificat, cu criteriile acelui exercițiu. **Patru cazuri nu sunt un program de an universitar acreditat**; trebuie păstrată această avertizare.

## Verificări executate direct asupra funcțiilor sursă (V8), nu teste pe dispozitiv
- Liceu: **50 jurisdicții, 173 combinații țară–an, minimum 35 și maximum 40 de fișe originale în engleză + recapitulări**, 0 ani fără conținut, 0 lecții duplicate după ID. 
- Primar și gimnaziu, fără cele trei clase românești deja validate separat: **447 combinații țară–an**, minimum 18 fișe/primar și 32 fișe/gimnaziu, 0 ani cu liste goale, 0 ID-uri duplicate.
- Nivel universitar: **14 documente de probă bilingve**, fiecare cu 4 exerciții explicate, **56 verificări individuale** de conținut, toate cu texte reale și cazuri distincte.
- Au fost introduse în CI testele `tests_physics_all_europe_year_depth.mjs`, `tests_physics_upper_bilingual.mjs` și `tests_physics_university_studies.mjs`. **Ultimele revizii nu au încă un rezultat confirmat GitHub Actions**. Execuția directă a funcțiilor nu le poate înlocui.
- Nu s-au rulat teste Android fizice, nu s-a testat AI-ul live pentru toate limbile și nu s-a construit APK.

## Blocaje reale înainte de declarația „Fizică terminată”
1. Confirmarea CI după ultimele modificări (PR #503 apare ca draft și încă nemergeabil cu baza curentă); rezolvarea conflictelor cu PR #502, fără rescrierea funcțiilor stabile.
2. Verificare de curriculum oficial **pe anul de studiu și cohortă**, pentru țările care au filiere/regiuni și programă anuală verificabilă; generic orientativ doar unde nu se găsește o sursă clară. Nu certifica un an de studiu pe baza unei diagrame ISCED.
3. Traducere didactică corectă în limbile aplicației; doar româna și engleza au material original complet pentru cazurile nou introduse. Pentru alte limbi, fallback în engleză marcat ca atare, nu o falsă traducere.
4. Test UI/Android real al fluxului selecție țară→clasă→capitol→lecție→exercițiu→feedback→Înapoi, inclusiv offline / API indisponibil, și verificarea PDF/imprimării.
5. Un singur APK numai după finalizarea **întregului capitol Științe**, inclusiv celelalte trei discipline și acceptarea utilizatorului.

## Repere publice pentru verificare
- Eurydice, structuri școlare 2026/2027: https://op.europa.eu/en/publication-detail/-/publication/b82d1d07-abf4-11f1-b9e5-01aa75ed71a1/language-en
- România, programe de gimnaziu 2017: https://www.edu.ro/Ordin_ministru_3393_2017
- Anglia KS3 Science: https://www.gov.uk/government/publications/national-curriculum-in-england-science-programmes-of-study
- Danemarca Physics and Chemistry grades 7–9: https://eng.uvm.dk/primary-and-lower-secondary-education/the-folkeskole/subjects-and-curriculum
- Finlanda curriculum de bază: https://www.oph.fi/en/education-and-qualifications/national-core-curriculum-primary-and-lower-secondary-basic-education
- Norvegia Naturfag: https://www.udir.no/lk20/nat01-05/gyldighet-og-innfoering?lang=eng
- Letonia Fizika 8–9: https://skola2030.lv/lv/skolotajiem/macibu-prieksmeti/fizika
- Irlanda senior Physics: https://curriculumonline.ie/senior-cycle/senior-cycle-subjects/physics/
- Suedia Lgr22: https://www.skolverket.se/sok-publikationer/publikationsserier/styrdokument/2024/curriculum-for-compulsory-school-preschool-class-and-school-age-educare---lgr22
- Cehia RVP ZV: https://msmt.gov.cz/vzdelavani/zakladni-vzdelavani/ramcovy-vzdelavaci-program-pro-zakladni-vzdelavani
- OpenStax Physics, material educațional deschis: https://openstax.org/subjects/science
