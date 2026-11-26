# myPocketAI — test Android în România

> **ATENȚIE — feedback fizic ulterior:** APK501885 are probleme raportate la
> accesul pietonal/hartă și transport mixt. Nu îl recomandăm încă pentru
> distribuirea testului în România. Corecțiile din PR draft #558 nu sunt în
> acest APK și nu sunt publicate pe backend. Vezi
> `TRANSIT_PHYSICAL_REPORT_FIXES_2026-11-26.md`. Nu dezinstala aplicația.


**APK 501885 — 26 noiembrie 2026**

[Descarcă APK-ul semnat](https://github.com/kokocf-ui/myPocketAi/releases/download/education-test-45879014303/myPocketAI-signed-education-test.apk)

Build verificat de workflowul semnat: aceeași semnătură ca versiunea publicată,
versionCode mai mare decât APK-urile de referință. Verificarea fizică în România
nu a fost încă efectuată.

## Instalare și scop

APK semnat de test, cu interfața și conținutul Education din ramura curentă.
Nu este o publicare în producție. Folosește serviciile backend existente prin internet.

- Instalează ca actualizare peste aplicația existentă; **nu dezinstala** pentru test.
- Dacă Android refuză actualizarea, păstrează mesajul exact și versiunea instalată.
  Nu șterge datele aplicației pentru a forța instalarea.
- Permite locația precisă pentru testarea transportului și a hărții.
- Nu este nevoie de cont HERE sau cheie API pe telefon.

## Test scurt, dacă ai 5–10 minute

1. **Transport național din România:** Hărți → Transport public, din poziția GPS
   reală spre o destinație cunoscută din România. Verifică dacă ruta, linia sau
   operatorul și stațiile sunt inteligibile. Serviciile și orașele disponibile
   depind de furnizorii deja configurați; lipsa unui rezultat nu dovedește lipsa
   transportului. Transportul urban nu este conectat automat în fiecare oraș.
2. **O călătorie pentru mâine:** alege data și o destinație între orașe cunoscute.
   Verifică data afișată, sensul traseului și întoarcerea la listă. Dacă sunt
   oferite ore, compară-le cu operatorul înainte de a călători. Un test pe telefon
   nu garantează validitatea tuturor orarelor.
3. **Detalii traseu:** selectează o opțiune și verifică îmbarcarea/coborârea,
   schimbările, linia și numărul opririlor când sunt disponibile. Un orar lipsă
   sau estimativ trebuie avertizat clar, fără ore ori opriri inventate.
4. **Înapoi și interfață:** revino din detalii și hartă. Verifică să nu rămână
   fereastra blocată și să nu fie tăiate butoane sau texte lateral.
5. **Opțional:** deschide o lecție Education și un curs practic pentru a verifica
   atingerea, derularea și revenirea. Problema de traducere în APK menționată
   anterior nu este declarată rezolvată numai pe baza testelor de browser.

## Ce să trimiți dacă apare o problemă

- localitatea, destinația și data/ora călătoriei cerute;
- pașii exacți, ce te așteptai să apară și ce a apărut;
- o captură sau o înregistrare scurtă, plus modelul telefonului și versiunea Android;
- ascunde adresele private, conversațiile personale și orice date sensibile.

## Limitări importante

APK-ul nu publică și nu activează servere. Modificările backend HERE pentru
Germania sunt pregătite separat, încă neactivate și neverificate live.
România folosește furnizorii ei existenți, **nu cota HERE pentru Germania**.
Buildul și verificările locale nu trimit cereri HERE. Limita convenită pentru
viitoarea verificare live HERE rămâne maximum două încercări în total, fără retry;
până la această etapă nu a fost folosită niciuna.
