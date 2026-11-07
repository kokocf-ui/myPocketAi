# Educație — Biologie integrată (gimnaziu, liceu, specializări universitare)

## Navigare și acoperire
Științe → Biologie → Începător / Mediu / Avansat. La Avansat apare o selecție obligatorie de **specializare**, apoi capitolul și spațiul de lucru. La Începător/Mediu, alegerea trece direct la capitole.

**Biblioteca locală:** 10 capitole fundamentale cu 60 fișe, 9 specializări cu 36 capitole proprii și 108 fișe specializate; **168 fișe** în total. Fiecare fișă include titlu, definiție/corelare conceptuală, formulă sau notație, nivel și termeni de căutare. Căutarea incrementală afișează maximum 4 rezultate, fără a obliga introducerea termenului întreg.

**Specializări la nivel Avansat:**
1. Biologie celulară — imagistică, ciclul celular, transport membranar, semnalizare.
2. Biologie moleculară și genetică — replicare, exprimare, variație genetică, genetica populațiilor.
3. Anatomie și fiziologie — țesuturi, cardiovascular, respirator, renal.
4. Microbiologie și virusologie — genetică procariotă, virusuri, ecologie microbiană, rezistență.
5. Biologie medicală — imunologie, patologie celulară, metode de laborator, bioetică.
6. Biotehnologie — bioprocesare, biologie recombinantă, editare genomică, biomateriale.
7. Ecologie și conservare — populații, rețele trofice, conservare, schimbări globale.
8. Bioinformatică — aliniere, secvențiere, omică, reproducibilitate.
9. Neurobiologie — electrofiziologie, sinapse, circuite, sisteme senzoriale.

Fiecare specializare combină capitolele proprii cu trei baze fundamentale pertinente, fără duplicarea conținutului.

## Spațiu educațional
- Teorie structurată, navigare Înapoi pas cu pas.
- Exerciții prin tastare, dictare Android, fotografie și album cu confirmarea textului OCR.
- Rezolvă pas cu pas și Explică metoda; rezultatele locale verificate sunt separate explicit de răspunsurile AI.
- Editorul se redimensionează progresiv în limita suprafeței vizibile; dacă enunțul crește mai mult, derularea internă urmărește cursorul.
- Modele vizuale educative: celulă eucariotă 2D și ADN dublu helix 3D simplificat, rotire și zoom în fereastră, fără depășirea cadrului.

## Modele biologice local verificate
Sunt suportate intrări explicite, bine delimitate:
- `ADN:ATGC` — catena complementară antiparalelă.
- `ARN:ATGC` — transcrierea catenei codante ADN.
- `GC%:GCGCAT` — procent GC.
- `Hardy-Weinberg:q2=0.09` — model ideal diploid cu două alele.
- `Aa x Aa` — tabel Punnett monogenic; fenotipul se interpretează doar dacă sunt furnizate ipotezele de dominanță.
- `Populație: N0=100; r=0.1; t=5` — creștere exponențială continuă idealizată.

Secvențele invalide, modelele insuficient specificate, extrapolările nerealiste și problemele clinice nu sunt declarate verificate. În rest, AI oferă explicații cu verificare explicit recomandată, fără să furnizeze diagnostic sau tratament.

## Repere pedagogice
Structura este compatibilă la nivel conceptual cu recomandările privind cunoștințele de bază, metodologia experimentală, analiza datelor, etica și interdisciplinaritatea:
- Quality Assurance Agency, Subject Benchmark Statement: Biosciences (2023): https://www.qaa.ac.uk/the-quality-code/subject-benchmark-statements/subject-benchmark-statement-biosciences
- Royal Society of Biology, Degree Accreditation: https://www.rsb.org.uk/accreditation-uk.html

Aceste repere nu certifică sau acreditează aplicația. Cele 168 de fișe reprezintă un nucleu educațional selectat, nu o bibliotecă exhaustivă a tuturor disciplinelor universitare.

## Validare
`npm run check` include noul modul, iar `npm run test:ui` include `tests_biology_complete.mjs`, pe lângă testele existente de navigare, teorie, matematică și chimie. CI rulează testele în PR. Verificarea practică pe dispozitiv (model vizual, dictare, OCR, scroll și WebView) rămâne separată și se face la testarea completă a Educației.
