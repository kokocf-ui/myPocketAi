# myPocketAI — test Android în România

> **Retest fizic 501887: NEGATIV (26 noiembrie, 21:07–21:08).** User raportează
> transport public nefuncțional și mixt mai rău, fără variante. Nu recomanda încă
> APK501887 drept corecție validată și nu cere repetarea identică a testului.
> Investigație: `TRANSIT_APK501887_PHYSICAL_FAILURE_2026-11-26.md`.


## Cel mai nou APK — 501893: prima pornire, antet fix, două manevre

[**Descarcă APK-ul semnat 501893**](https://github.com/kokocf-ui/myPocketAi/releases/download/education-test-45977801782/myPocketAI-signed-education-test.apk)

Instalează peste versiunea existentă, **fără dezinstalare sau ștergerea datelor**.
Run45977801782/job140433827291 SUCCESS; sursă245ee23. Model, compiled real
Leaflet navigation/walking/input/viewport, certificat, identity/version/snapshot PASS CI.

- Pornește navigația o singură dată: harta trebuie să umple spațiul dintre
  comenzi și panoul de jos, fără zona goală mare.
- Antetul și comenzile navigare/recentrare/oprire stau deasupra hărții.
- Jos: prima manevră evidențiată cu distanță și al doilea rând „Apoi: …”.
  Textul foarte lung este prescurtat vizual pe rând; nu se inventează alt pas.
- Oprirea revine la previzualizarea compactă și lista completă statică.

Testele folosesc Leaflet+rotație reale, dar hărți locale sintetice și GPS/native
controlate. Defectul vechi reinjectat este detectat pe PRIMA pornire a navigației.
**Verificarea fizică rămâne în așteptare.** Nu privi telefonul în timpul
traversării sau conducerii. Raport: `NAVIGATION_FIRST_START_HEADER_TWO_MANEUVERS.md`.

## APK anterior — 501892: hartă compactă și manevră GPS

[**Descarcă APK-ul semnat 501892**](https://github.com/kokocf-ui/myPocketAi/releases/download/education-test-45975242408/myPocketAI-signed-education-test.apk)

Instalează peste versiunea existentă, **fără dezinstalare sau ștergerea datelor**.
Run45975242408/job140425232055 SUCCESS; sursă26030c9. Compiled navigation,
walking/input/viewport, certificat permanent, identity/version/snapshot PASS CI.

1. În previzualizarea traseului: harta mică, toți pașii dedesubt; transportul
   public nu mai are pagini separate pentru etape. Lista se derulează intern.
2. La pornirea navigației: hartă pe tot ecranul, controale suprapuse și o bandă
   de maximum două rânduri pentru următoarea manevră, actualizată după GPS.
3. La oprire: revine harta mică și lista completă statică.
4. GPS slab/vechi sau poziție în afara traseului: avertizare în loc de o manevră
   rămasă afișată eronat. Pentru verificarea în deplasare, folosește telefonul
   numai când este sigur, fără a privi ecranul în timpul traversării/conducerii.
5. Revenirea la traseul salvat nu trebuie să pornească o căutare nouă.

Retest fizic: utilizatorul apreciază aspectul, dar raportează prima hartă mică
și nevoia de a porni de două ori; corecția este în501893. Fundalul GPS nu este
validat fizic prin această apreciere. Testele501892 aveau GPS/hartă/native simulate.
Serviciul Android de fundal nu este schimbat și nu se declară rezolvată toată
succesiunea îmbarcare/coborâre/transfer. Niciun deploy de producție sau serviciu
plătit/HERE activat. Raport: `MAP_PREVIEW_LIVE_NAVIGATION_DELIVERY.md`.

## APK anterior — 501891: fără stylus, corecții pietonale la transport

[**Descarcă APK-ul semnat 501891**](https://github.com/kokocf-ui/myPocketAi/releases/download/education-test-45971650296/myPocketAI-signed-education-test.apk)

Instalează peste versiunea existentă, **fără dezinstalare sau ștergerea datelor**.
Run45971650296/job140413269742 SUCCESS, sursăecce8eb. Certificatul permanent,
identitatea, versionCode501891 și snapshotul sursei au fost verificate în CI.

- Educație: opțiunea de scriere de mână/stylus nu mai trebuie să existe în niciun
  editor. Tastatura, simbolurile, șabloanele, acolada în previzualizare și
  încadrarea rândurilor lungi rămân disponibile.
- Transport public: verifică dacă accesul la prima stație și transferurile
  pietonale se încarcă. Răspunsurile nu mai sunt întrerupte după numai 8 secunde.
  Un drum verificat trebuie păstrat pe hartă și când plecarea nu mai poate fi
  prinsă; în acest caz navigarea pentru plecarea respectivă rămâne blocată.
- Paginarea etapelor NU a fost redesenată. Nu este declarată acceptată fizic.
- Testele de răspuns întârziat/alternative/plecare infezabilă/anulare au trecut,
  inclusiv în bundle-ul compilat, cu furnizori simulați. **Verificarea pe telefon
  rămâne în așteptare**, nu se declară transportul rezolvat integral.
- Niciun deploy backend/frontend de producție, serviciu plătit sau HERE activat.

Raport: `STYLUS_REMOVAL_TRANSIT_WALKING_PHONE_FEEDBACK.md`.

## APK anterior — 501890: rânduri lungi în câmpurile compacte

Încadrare automată și urmărirea tastării la sfârșit în ambele câmpuri, fără
modificarea textului trimis. Inclus și în501891. Stylusul încă exista în501890.

## APK anterior — 501889: fereastra de lucru compactă

[**Descarcă APK-ul semnat 501889**](https://github.com/kokocf-ui/myPocketAi/releases/download/education-test-45965463970/myPocketAI-signed-education-test.apk)

Instalează peste aplicația existentă, **fără dezinstalare sau ștergerea datelor**,
apoi închide și redeschide aplicația. CI a verificat același certificat permanent,
identitatea aplicației, versionCode501889 și snapshotul sursei92e844b.
Run45965463970/job140392969235 SUCCESS; utilizatorul a apreciat aspectul compact
(„arată mult mai bine”), dar a raportat transcrierea nefuncțională.

Verifică fereastra de lucru la matematică, istorie, geografie, informatică,
literatură și biologie: un titlu, Enunț + Rezolvarea mea, un rând activ de
instrumente, Verifică/Rezolvă/Metoda la vedere și secundare la Alte opțiuni.
Fizica, chimia și astronomia nu primesc noul aspect. Transportul rămâne
nerezolvat și nu a fost modificat suplimentar în această corecție. Niciun deploy
backend/frontend de producție.

## APK anterior — 501888: retest transport public negativ

[**Descarcă APK-ul semnat 501888**](https://github.com/kokocf-ui/myPocketAi/releases/download/education-test-45900192177/myPocketAI-signed-education-test.apk)

Publicat la cererea utilizatorului din sursa `9966a43`, run45900192177,
job140183808611 SUCCESS. Certificatul permanent, identitatea aplicației,
versionCode501888 și snapshotul de branch au fost verificate în CI.
**Instalează peste versiunea existentă, fără dezinstalare sau ștergerea datelor**, apoi închide și redeschide aplicația.

Verifică acum numai transportul public:
1. Caută o călătorie și apasă o variantă.
2. Harta și detaliile trebuie să apară direct în același ecran, fără încă o apăsare pe „Hartă”.
3. Folosește săgețile de pagină pentru restul informațiilor/etapelor: nu trebuie să derulezi vertical pentru detalii sau comenzi.
4. Verifică Back → variante. Navigarea rămâne o acțiune explicită, nu pornește prin simpla selectare.

**Validarea fizică a acestui APK este încă în așteptare. Mixtul este amânat
pentru mâine, nu este declarat reparat și nu trebuie retestat acum.**
Backendul v187 și frontendul de producție sunt neschimbate; a fost publicat
numai APK-ul semnat de test cu snapshotul interfeței acestui branch.

## Clarificare ulterioară și corecție încă nepublicată

Problema raportată la transport public este fluxul de afișare: după alegerea
variantei apare o pagină lungă fără hartă, iar harta/navigarea cere scroll și
încă o apăsare. Nu avem prin această clarificare dovada unui defect de rutare.
Cerința este **variantă → direct hartă + detalii în același ecran, fără scroll
vertical; informațiile suplimentare se parcurg prin pagini/etape**.

Corecția există acum pe branch și a trecut verificări automate cu hărți și
furnizori simulați, inclusiv la 360×640, cu Back, Start/Stop explicit și păstrarea
categoriilor/tarifelor/localităților din România. **Nu este în APK501887 istoric de mai
jos; este inclusă acum în APK501888 de mai sus.** Necesită încă validare fizică
în acest build înainte să o declarăm rezolvată. Mixtul rămâne separat, nerezolvat.

## Retest istoric — APK501887 + backend v187 (negativ)

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
