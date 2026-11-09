# Învățare și educație — regulă de lucru și criterii de finalizare

## Închiderea etapei curente — decizia utilizatorului, 9 noiembrie 2026

**Stare: EDUCAȚIE–EUROPA ÎNCHEIATĂ CA ETAPĂ DE DEZVOLTARE ÎN VERSIUNEA CURENTĂ; NU SE MAI EXTINDE ACUM.**

- Utilizatorul a decis oprirea dezvoltării suplimentare a bibliotecilor europene în această etapă și trecerea la restul proiectului. Nu mai iniția automat alte sprinturi pentru Educație și nu cere aprobări fragmentate.
- Se păstrează toate clasele, materiile, referințele, lecțiile și celelalte țări deja implementate. Lipsurile de acoperire rămân îmbunătățiri opționale viitoare, nu blocaje pentru schimbarea priorității.
- Testele GitHub Actions ale commitului `d4dfe489ae119abd76b2d9d8d9d5af7d020a150a` au trecut: verificări minime de cod, validarea pilotului Math Whisper Android și regresia transport UK.
- Această închidere **nu atestă** importarea manualelor integrale, verificarea fiecărei programe naționale, testarea vizuală Android sau publicarea unui APK. Nu afișa utilizatorilor finali etichete neadevărate precum „toate bibliotecile verificate”.
- Publicarea și integrarea în `main` rămân pași separați; un merge în `main` pornește automat workflow-ul de deploy Cloudflare, deci nu se execută doar pentru a consemna decizia de închidere.
- Precedentele cerințe de exhaustivitate rămân documentate ca ținte viitoare, dar decizia de a închide acum etapa prevalează asupra interdicției anterioare de a o considera încheiată în planificarea curentă.


## Decizie actuală — 9 noiembrie 2026: EUROPA (prioritate obligatorie)
- Utilizatorul a cerut explicit **Europa**, nu extindere mondială. Extinderea la restul lumii fusese inițiativa asistentului și nu este o cerință pentru închiderea etapei actuale.
- **Păstrăm integral** codul și informațiile pentru țările deja implementate din afara Europei, fără ștergere și fără dezvoltări suplimentare în această etapă. Se reiau doar la cererea ulterioară a utilizatorului.
- Continuitate obligatorie: pornim de la România și Anglia și integrăm Europa: țara / jurisdicția → etapa școlară → clasa / anul → disciplina → capitol → lecția/biblioteca indexată. Regatul Unit are sisteme distincte pentru Anglia, Scoția, Țara Galilor și Irlanda de Nord.
- O listă de ministere, Eurydice sau titluri de capitole este **bibliografie/sursă**, nu o bibliotecă didactică completă. Pentru a declara o materie terminată sunt necesare lecțiile efective, proveniența, nivelul și anul aplicării, accesul din UI, verificarea drepturilor de reutilizare și testarea integrată.
- AI-ul poate oferi explicații opționale, dar nu înlocuiește, nu suprascrie și nu certifică programele ori bibliotecile școlare europene.
- Catalogul european include țările membre ale Consiliului Europei, cele patru jurisdicții școlare britanice și alte coduri europene selectabile (BY/RU/VA/XK), fără a presupune statutul politic sau existența unui curriculum autonom pentru toate.
- Ramura `feat/international-all-subjects-curriculum-20261109` conține progresul de integrare, însă nu trebuie declarată finalizată și nu trebuie publicat APK-ul înainte de validarea bibliotecilor reale.
- Nu solicita teste manuale după fiecare materie, nu fragmenta implementarea în confirmări. Verificările interne și CI au loc între timp, iar testarea manuală se face la finalul opțiunii Educație.

Actualizat: 2026-11-07

## Principiu stabilit
- Implementăm fiecare materie de la A la Z, în loturi interne de dezvoltare și verificare, fără a cere utilizatorului teste după fiecare modificare.
- Utilizatorul poate începe o conversație nouă pentru fiecare materie. Acest fișier și starea verificată a codului sunt sursele de continuitate între conversații.
- **Testarea manuală pe telefon se face numai după încheierea întregii opțiuni „Învățare și educație”**, cu un set integrat de scenarii. Verificările automate, testele unitare, CI și compilările de control se efectuează pe parcurs de către dezvoltare.
- Nu afirmăm că o categorie este completă numai fiindcă există opțiunea în meniu; trebuie să fie operațională. Nu presupunem că toate temele universitare au un solver simbolic exact. Pentru cazuri nesuportate, sistemul declară limitele și nu inventează rezultate.
- Nu alterăm secțiuni deja funcționale din afara materiei curente. Lucrăm pe ramuri, cu teste automate și integrare controlată.
- Nu introducem obligații de plată sau API-uri cu cost fără aprobare explicită.

## Definiția „gata”, pentru fiecare materie
1. Toate nivelurile relevante și submateriile sunt navigabile, cu Înapoi și Acasă previzibile, fără părăsirea modulului.
2. Introducere manuală, fotografiere/album, revizuire OCR și dictare unde există suport; acțiunile nesuportate sunt explicate clar.
3. Rezolvarea și metoda nu se confundă: pașii sunt ancorați în enunțul curent; reprezentarea grafică afișează numai figura/graficul verificat, iar rezultatele sigure apar compact în colț, fără explicații.
4. Problemele multiple au file distincte. Schimbarea exercițiului nu păstrează reprezentarea sau răspunsul exercițiului anterior. Nu există plafon arbitrar de trei exerciții; gestionăm listele mai mari cu randare și execuție la cerere.
5. Geometrie: figurile se pot edita, muta și mări fără a ieși din zona alocată; câmpurile dimensionale pot rămâne necompletate. Nu se presupun dimensiuni din desen. Reprezentările 3D au controale încadrate în fereastră.
6. Verificarea rezultatului este deterministă acolo unde există algoritm exact; dacă se folosește un model lingvistic, răspunsul trebuie marcat ca explicație și nu trebuie să pretindă verificare numerică.
7. Limba și notația sunt corecte (virgulă zecimală în română, radical, semne minus, puteri, unități).
8. UI mobil responsive, fără bară de acțiuni inaccesibilă și fără procesare simultană inutilă; erorile și cererile lente pot fi anulate.
9. Teste automate de funcționalitate și regresie, plus compilare de control și verificarea statusului CI. Rezultatele testării manuale sunt rezervate verificării finale a modulului Educație.

## Ordinea de lucru
1. **Matematică:** Începător / Mediu / Avansat — aritmetică, algebră, geometrie, trigonometrie, funcții, măsurători, statistică/probabilități, algebră liniară, analiză, ecuații diferențiale, matematică discretă.
2. Limbi străine.
3. Științe.
4. Istorie și geografie.
5. Limbă și literatură.
6. Informatică.
7. Pregătire examene.
8. Cursuri practice.
9. Testare manuală integrată a opțiunii Educație.

## Regula de aliniere europeană a programelor (8 noiembrie 2026)
- Pentru **Limbă și literatură**, se verifică acum cadrul oficial țară/jurisdicție → clasă → specializare sau regiune → obiective și capitole. Programul de studiu se afișează ordonat și marchează sursa și anul de aplicare. O referință oficială generală nu înseamnă că toate operele sau clasele din acea țară au fost verificate.
- Programelor schimbate etapizat le păstrăm condiția de aplicare în timp; nu copiem aceleași liste în toate țările și nu prezentăm lucrări recomandate ca obligatorii.
- Pentru țările sau clasele fără document verificat, interfața menține un traseu educațional **orientativ**, cu avertisment explicit, fără să inventeze obligativitatea.
- Latina este limbă sau disciplină clasică, nu țară; China și Japonia rămân în afara acestei etape geografice.
- **Nu extindem acum reconstrucția curriculară a celorlalte materii.** Terminăm cele trei module rămase din Educație (Informatică, Pregătire examene, Cursuri practice), apoi discutăm împreună revenirea și alinierea europeană pentru disciplinele deja dezvoltate. Nu afirmăm că această etapă retrospectivă a fost implementată.

## Restanțe și riscuri care NU trebuie declarate terminate prematur
- OCR foto: caractere matematice incerte (√, semn minus, exponent), separarea tuturor exercițiilor și alegerea fără blocaj.
- Geometrie: potrivirea strictă dintre enunț, figură și rezultatele din colț pentru fiecare exercițiu.
- Dictare: paranteze și numere negative. Nu introducem servicii plătite obligatorii.
- Niveluri avansate: suport pe subdomenii; cazurile care nu pot fi evaluate exact nu sunt inventate.
- Performanță și actualizare APK: automatizarea CI nu substituie proba pe dispozitiv.

## Cum reluăm în conversația următoare
Citește acest fișier, examinează PR-ul / ramura ultimei materii, rezultatele GitHub Actions și continuă de la restanțele rămase fără a cere utilizatorului să repete regulile. Raportează separat: cod implementat, teste CI verificate, nerezolvat, și stare de integrare.
