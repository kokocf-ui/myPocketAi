# myPocketAI — test Android în România

> **Retest fizic 501887: NEGATIV (26 noiembrie, 21:07–21:08).** User raportează
> transport public nefuncțional și mixt mai rău, fără variante. Nu recomanda încă
> APK501887 drept corecție validată și nu cere repetarea identică a testului.
> Investigație: `TRANSIT_APK501887_PHYSICAL_FAILURE_2026-11-26.md`.


## Clarificare ulterioară și corecție încă nepublicată

Problema raportată la transport public este fluxul de afișare: după alegerea
variantei apare o pagină lungă fără hartă, iar harta/navigarea cere scroll și
încă o apăsare. Nu avem prin această clarificare dovada unui defect de rutare.
Cerința este **variantă → direct hartă + detalii în același ecran, fără scroll
vertical; informațiile suplimentare se parcurg prin pagini/etape**.

Corecția există acum pe branch și a trecut verificări automate cu hărți și
furnizori simulați, inclusiv la 360×640, cu Back, Start/Stop explicit și păstrarea
categoriilor/tarifelor/localităților din România. **Nu este în APK501887 de mai
jos; nu a fost publicat alt APK în această etapă.** Va necesita validare fizică
în noul build înainte să o declarăm rezolvată. Mixtul rămâne separat, nerezolvat.

## Retest ACTUAL — APK501887 + backend v187

[**Descarcă APK-ul semnat 501887**](https://github.com/kokocf-ui/myPocketAi/releases/download/education-test-45894780817/myPocketAI-signed-education-test.apk)

Publicat la 26 noiembrie 2026 din `f7ab634`. Buildul, certificatul de semnare
(în CI) și backendul au trecut verificările. **Retestul fizic ulterior a eșuat; vezi avertismentul de mai sus.**
Instalează peste aplicația existentă, **fără dezinstalare/ștergerea datelor**,
apoi închide și redeschide aplicația. Dacă actualizarea e refuzată, păstrează
mesajul exact; nu dezinstala pentru a o forța.

### Ce să verifici pe telefon

1. **Grays → Victoria, transport local:** cronometrează până la prima variantă;
   deschide-o imediat. Detaliile trebuie să apară fără să aștepte verificarea
   mersului pe jos. Un eșec al mersului pe jos nu trebuie să șteargă itinerarul.
2. **Transport mixt → adresa din Oradea, 4 decembrie, ora 04:00** (ora locală
   afișată în selector): cronometrează prima variantă și încheierea căutării.
   Dacă primești variante înainte de final, trebuie să poată fi deschise.
3. Deschide prima variantă cât scrie **„Căutarea continuă…”**. Rezultatele noi
   nu trebuie să te scoată din detalii. Revino: trebuie să găsești lista actualizată.
4. Din listă, apasă Înapoi către calendar înainte să se termine căutarea.
   Un răspuns întârziat nu trebuie să te readucă singur în rezultate. Verifică
   atât butonul din aplicație, cât și Back al telefonului.
5. Pentru o opțiune terestră, verifică operatorul/linkul, etapele locale și
   eventualele schimburi. Ruta de pe pagina operatorului poate include schimburi;
   nu trebuie numită „directă” sau legătură garantată fără dovadă. **Lipsa
   accesului/continuării rămâne o lipsă funcțională de raportat**, nu un succes
   doar fiindcă există avertisment. Păstrează captura și numele furnizorului.
6. Pentru un zbor, verifică ambele legături terestre, nu numai aeroporturile.
   Notează ce segment a fost primit și care lipsește; două zboruri fără legături
   nu înseamnă că întregul drum este rezolvat.

Pentru prietenul din România: aceeași versiune, un traseu local cunoscut și unul
interurban, pe care le poate compara cu realitatea. Nu presupunem acoperire
uniformă în toate orașele. Trimite versiunea, traseul/data/ora selectate, timpul
până la prima variantă și capturi ale listei/detaliilor când ceva nu merge.

HERE Germania rămâne OFF (0 cereri agent). Nu s-au activat servicii plătite.
Raport: `MIXED_PROGRESSIVE_APK_TEST_RELEASE_2026-11-26.md`.

---

## Istoric — APK501886 (înlocuit pentru retest cu 501887)

> **Rezultat retest APK 501886:** utilizatorul a confirmat probleme de latență,
> verificare pietonală intermitentă și lipsa revenirii/legăturilor terestre în mixt.
> Nu considera acest APK validat pentru trimitere în România. Corecțiile sunt acum
> incluse în 501887 de mai sus; istoricul lor este în `TRANSIT_APK501886_RETEST_FIXES_2026-11-26.md`.
> Instrucțiunile de mai jos descriu livrarea istorică 501886, nu un APK nou.


## Actualizare pentru retest — APK 501886 + backend v186

[Descarcă noul APK semnat 501886](https://github.com/kokocf-ui/myPocketAi/releases/download/education-test-45882296441/myPocketAI-signed-education-test.apk)

Instalează peste versiunea existentă, fără dezinstalare, apoi închide și redeschide
aplicația. Înainte să-l trimiți în România, repetă pe telefon:

1. **Grays → Victoria:** selectează o opțiune. Dacă accesul pietonal eșuează,
   trebuie să rămână vizibile detaliile, liniile și stațiile traseului.
2. În detalii, deschide **„Hartă: toate etapele și deplasările pe jos”**. Verifică
   accesul inițial, transferurile și ultimul segment. Segmentele neverificate
   trebuie să fie marcate, nu prezentate ca navigare verificată.
3. **Transport mixt către Oradea**, cu data aleasă: verifică dacă sunt afișate
   aeroporturi apropiate, eventuale variante primite și o explicație corectă la
   timeout/plafon. Nu presupunem că există un zbor sau un transfer dacă sursa
   nu l-a furnizat. Numărul opririlor rămâne necunoscut pentru liste incomplete.

Buildul și publicarea au trecut verificările, dar aceste trei cazuri nu sunt
încă validate fizic după corecții. HERE Germania rămâne OFF, consum agent 0.

---

## Istoric — APK 501885 (nu folosi acest link pentru retestul corecțiilor)

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
