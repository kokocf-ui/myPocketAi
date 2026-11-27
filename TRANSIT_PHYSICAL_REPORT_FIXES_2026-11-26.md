# Corecții după testul fizic al APK-ului 501885

> **Actualizare de livrare:** la aprobarea ulterioară a utilizatorului, corecțiile
> au fost publicate în backend **v186** și APK-ul semnat **501886**. Ambele
> workflowuri au reușit. Raport: `TRANSIT_V186_APK501886_DELIVERY_2026-11-26.json`.
> Starea „doar pe ramură” de mai jos este istoricul dinaintea publicării.
> Retestarea fizică și căutarea live Grays–Oradea nu sunt încă confirmate.


## Raportul utilizatorului

Capturile de pe telefon arată o căutare Grays–Victoria cu opțiuni disponibile,
dar selectarea unei opțiuni revine la listă cu eroare de traseu pietonal.
Utilizatorul nu găsește toate etapele pe jos pe hartă și semnalează lipsa
numărului opririlor până la coborâre. La transport mixt către Oradea, pentru
28 noiembrie, furnizorul aerian nu returnează date utilizabile și nu sunt
prezentate alternative prin aeroporturi apropiate și legături terestre.

**APK-ul 501885 nu este declarat validat pentru trimiterea la prietenul din
România. Nu este necesară dezinstalarea lui.**

## Defecte identificate în cod și corecții locale

1. **Accesul pe jos era o condiție de acces la detalii.** La orice eșec, funcția
   revenea la întreaga listă și afișa eroarea generică. Acum păstrează itinerarul
   selectat, stațiile, liniile și avertismentul. Nu declară accesul verificat și
   nu păstrează o recomandare de plecare bazată pe o verificare anterioară.
2. **Accesibilitatea hărții:** detaliile oferă explicit „Hartă: toate etapele și
   deplasările pe jos”, inclusiv dacă accesul inițial sau orarul este neverificat.
   Harta este o vedere de ansamblu, nu o garanție că o plecare poate fi prinsă.
3. **Formate de coordonate incompatibile:** harta și ultimul tronson pietonal
   acceptă atât `arrivalPoint` (adaptoarele naționale), cât și `arrivalLatLon`
   (TfL). Coordonatele lipsă nu mai pot deveni accidental 0 prin conversia null.
   Toate etapele pe jos contribuie la încadrarea hărții. Geometriile neverificate
   rămân punctate și fiecare etapă pe jos are stare explicită. Segmentele
   neprocesate la timeout/plafon nu sunt declarate verificate. Un traseu de acces
   deja verificat poate fi reutilizat numai dacă are aceleași capete.
4. **Identificatori TfL:** calculul opririlor verifică toate câmpurile de
   identitate `naptanId`/`id`/`icsId`, nu numai primul câmp prezent. Listele
   parțiale, capetele lipsă și repetările ambigue nu produc un număr inventat.
   Nu afirmăm că această corecție rezolvă toate datele TfL din teren; pentru o
   listă incompletă rămâne necesară sursa corectă de secvență a stațiilor.
5. **Timeoutul zborurilor:** în codul anterior, ecranul abandona căutarea după
   25 secunde, dar descoperirea putea executa până la 9 interogări secvențiale,
   fiecare cu propriile timeouturi de cotă și căutare. Astfel putea pierde
   variante deja primite și putea continua interogările după returnarea ecranului.
   Acum descoperirea are deadline comun de maximum 22 secunde, propagat la
   descoperirea aeroporturilor, verificarea cotei și căutarea zborurilor;
   întoarce rezultatele parțiale și oprește cererile rămase. Numărul maxim de
   interogări per căutare nu a fost mărit.
6. **Aeroporturi apropiate omise:** în cazul unei porți peste graniță, al doilea
   grup de aeroporturi de destinație putea să nu mai fie interogat. Acum este
   programat înaintea scanărilor individuale repetitive. Limita totală rămâne
   respectată; nu promitem verificare exhaustivă a tuturor aeroporturilor.
7. **Răspuns gol confundat cu avarie:** mesajul exact Google Flights „hasn't
   returned any results for this query” nu mai oprește întregul set de aeroporturi
   ca eroare de autentificare/provider. Erorile de cotă/autentificare nu sunt
   tratate ca rezultate goale și nu declanșează fallback cu plată.
8. **Diagnostic vizibil:** UI păstrează rezultatele parțiale, distinge timeoutul
   și plafonul de interogări și arată aeroporturile geografice identificate,
   inclusiv cele apropiate de destinație peste graniță. Aceste puncte NU sunt
   afișate ca zboruri sau legături confirmate. Variantele aeriene deja primite
   rămân păstrate dacă îmbogățirea cu transferuri terestre eșuează.

## Verificare

- `npm run test:transit-reported-failures`: 7 cazuri de regresie noi și suita
  existentă de descoperire aeriană progresivă; toate cu furnizori simulați.
- Browser mobil 360/393/430: eroare pietonală păstrează detaliile și stațiile;
  harta arată toate cele trei segmente pe jos simulate, cu starea neverificată;
  aeroporturile apropiate și mesajul de timeout rămân vizibile.
- `test:transit-audit`, `test:national-transport`, `test:mixed-orientation`,
  `check`, cele cinci suite browser naționale și browser mixed — PASS.
- Bundle frontend/backend `wrangler deploy --dry-run` și verificarea numelor
  funcțiilor browser — PASS. Aceste comenzi NU publică Workerul.

## Limite și stare de livrare

Corecțiile sunt pe ramura de lucru, nu în APK-ul deja instalat și nu în backendul
live v185. Nu a fost construit alt APK în această etapă. Nu a fost schimbată
configurația live, nu s-a făcut merge și nu au fost trimise cereri HERE ori alte
căutări live de zboruri. Limita HERE de două încercări în total rămâne neconsumată.

Aceste teste reproduc defecte din cod, nu răspunsul exact dat de furnizor la
căutarea reală a utilizatorului. Nu declarăm că ruta Grays–Oradea este reparată
sau verificată live și nici că există un anumit zbor la data cerută. Pentru
confirmarea în teren trebuie publicate controlat corecțiile relevante și
verificate răspunsurile reale, fără a inventa zboruri, orare sau transferuri.
