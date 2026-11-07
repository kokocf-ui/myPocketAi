# Învățare și educație — regulă de lucru și criterii de finalizare
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

## Restanțe și riscuri care NU trebuie declarate terminate prematur
- OCR foto: caractere matematice incerte (√, semn minus, exponent), separarea tuturor exercițiilor și alegerea fără blocaj.
- Geometrie: potrivirea strictă dintre enunț, figură și rezultatele din colț pentru fiecare exercițiu.
- Dictare: paranteze și numere negative. Nu introducem servicii plătite obligatorii.
- Niveluri avansate: suport pe subdomenii; cazurile care nu pot fi evaluate exact nu sunt inventate.
- Performanță și actualizare APK: automatizarea CI nu substituie proba pe dispozitiv.

## Cum reluăm în conversația următoare
Citește acest fișier, examinează PR-ul / ramura ultimei materii, rezultatele GitHub Actions și continuă de la restanțele rămase fără a cere utilizatorului să repete regulile. Raportează separat: cod implementat, teste CI verificate, nerezolvat, și stare de integrare.
