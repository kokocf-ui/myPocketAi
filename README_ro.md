## Pocket AI — backend v174 / frontend 1.0.129 — 2026-11-03

- **Cazări: eliminarea dublurilor și a adreselor false.** Pentru căutările de hoteluri/hosteluri/moteluri/pensiuni/apartamente, Geoapify nu mai folosește `address_line1` drept numele unui hotel. Sunt excluse înregistrările ce conțin doar numele unei străzi (ex. „Strada Dunării”), fără a exclude locațiile reale cu „Apartament”, „Hotel”, „Hostel” etc. Filtrul există în backend și ca verificare suplimentară în modalul frontend.
- **Deduplicare:** același nume și aceeași adresă sunt prezentate o singură dată, chiar dacă furnizorii returnează coordonate puțin diferite; două hoteluri cu același nume, dar aflate la adrese sau poziții diferite, rămân distincte.
- **Păstrăm căutarea restabilită:** motorul de cazare Geoapify + Photon/OpenStreetMap, tipurile de cazare și ancorarea la atracția aleasă nu se schimbă. Notificarea de 2 secunde apare doar la zero rezultate mapate după filtrare; o eroare tehnică nu se afișează ca lipsă de cazare.
- **Verificare:** sintaxa backendului și a scriptului generat din frontend este validă; testele simulate ale filtrului au trecut. Testul automat `tests_accommodation_recovery.mjs` acoperă și strada falsă, dubluri, cazări reale și continuitatea traseului. Publicarea versiunii finale și CI complet rămân de confirmat; alte verificări generale Actions pot eșua independent.

## Pocket AI — backend v174 / frontend 1.0.128 — 2026-11-02

- **Reparare cazare:** atracțiile turistice folosesc din nou motorul comun de căutare Geoapify + Photon/OpenStreetMap, cu aceleași categorii păstrate pentru hotel, motel, hostel, pensiune, apartament de vacanță și chalet. Nu mai folosesc `__nearby_accommodation__` din fluxul nou de atracții.
- **Ancorare geografică:** către motorul existent se trimit coordonatele atracției selectate ca centru de căutare, nu GPS-ul fizic al utilizatorului și nici o căutare nouă după numele atracției; raza standard a căutării comune rămâne 5 km.
- **Continuitate:** dacă furnizorul are o problemă tehnică, se continuă la alegerea transportului fără afirmația falsă că nu există cazări. Când căutarea funcționează dar nu găsește locații cartografiate, notificarea este plutitoare, neblocantă, timp de 2 secunde. După lista de cazări există opțiunea „Continuă fără cazare”.
- **QA:** JavaScript-ul browserului generat a fost validat. Testele simulate au confirmat liste mixte hotel/apartament/hostel/motel, centrare pe Sagrada Família, lipsa notificării la succes, notificarea temporară la zero și continuarea traseului la eroare. `tests_accommodation_recovery.mjs` a fost adăugat la `npm test` și poate fi rulat separat cu `npm run test:accommodation`. Rezultatele live și testele GitHub Actions nu sunt încă confirmate.

## Pocket AI — backend v173 / frontend 1.0.127 — 2026-11-02

- **Obiective turistice pentru întreaga țară:** noua cercetare Geoapify caută în limita națională verificată prin `place_id`, nu doar într-un cerc în jurul capitalei. Rezultatele nominale, cu coordonate și țara verificată, sunt combinate cu obiectivele Wikidata și diversificate pe orașe/regiuni, fără a promite o listă exhaustivă. Când lipsesc surse naționale, obiectivele din zona capitalei sunt etichetate explicit drept atare. Interogările Wikidata, Geoapify și datele generale ale țării sunt executate în paralel acolo unde sunt independente.
- **Localități:** Geoapify returnează coordonatele exacte ale obiectivelor găsite în zona localității (nu doar numele și adresa). Lista poate oferi „Traseu” pentru fiecare obiectiv; dacă nu există date validate, secțiunea afișează explicit indisponibilitatea.
- **Flux de călătorie:** de la fișa unei țări, după identificarea orașului/destinației se solicită mai întâi alegerea cazării, apoi mijlocul de transport; contextul țării nu mai este șters prematur când backendul returnează mai multe locații. Fluxul existent din fișa unui oraș rămâne compatibil.
- **Revenire contextuală:** utilizatorul poate reveni la fișa țării/localității din dialogul de destinație, selecția cazării sau din navigare, fără a repeta interogarea. Acțiunea „Creează traseu” se găsește atât deasupra imaginii cât și la finalul fișei.
- **Durate în hartă:** eticheta de durată folosește funcția existentă de formatare a zilelor, orelor și minutelor; exemplu `1773 min → 1 zi 5 ore 33 de minute`.
- **Regresii:** validarea sintaxei fișierelor backend și frontend, precum și a scriptului generat, a trecut. Simulările în JavaScript au confirmat distribuția obiectivelor în patru orașe distincte, filtrarea altor țări, ambele butoane de traseu, întoarcerea la prezentare și durata localizată. `tests_country_profile_regression.mjs` a fost extins și inclus în scriptul `npm test`. Rularea completă Node în CI, publicarea Cloudflare și testele live pe telefon rămân neconfirmate.
- **Fără modificări deliberate:** barei inferioare fixe, modurilor de traseu existente, filtrului de rețete și calendarului de evenimente.

## Pocket AI — backend v172 / frontend 1.0.126 — 2026-11-02

- **Prezentări geografice pe telefon:** fereastra de informații folosește secțiuni/carduri separate, paragrafe scurte, imagini mai mici, date rapide, orașe, obiective și surse la final. Se înlătură marcajul editorial „(d)” din extrasele Wikipedia. Navigația de jos rămâne fixă.
- **Țări:** datele rapide afișează capitala, moneda, limbile, suprafața și fusurile UTC din baza de date pentru țări, atunci când sursa este disponibilă. Nu se pretinde că populația are o valoare actualizată dacă nu există an de referință.
- **Orașe și obiective:** se caută puncte cu coordonate în Wikidata, legate explicit de țara cerută (P17), și se afișează sursa fiecărui obiectiv. În caz de lipsă a datelor Wikidata, Geoapify poate furniza obiective verificate din jurul capitalei, etichetate separat drept „zona capitalei”, fără a pretinde o listă reprezentativă pentru întreaga țară. Dacă nici acestea nu pot fi verificate, utilizatorul este informat, fără inventarea unor obiective.
- **Trasee:** obiectivele și orașele cu coordonate oferă acțiunea de traseu aferentă. Pentru țară ca întreg, butonul cere o destinație concretă, fără a naviga spre centrul geografic al țării. Orașele nu sunt confundate cu țările.
- **Internaționalizare:** noile titluri și etichete sunt disponibile în cele 10 limbi existente. Designul celorlalte module, cronologia variantelor de transport și corecțiile culinare nu au fost modificate.
- **Verificări efectuate:** sintaxa ambelor fișiere JavaScript și sintaxa scriptului generat al interfeței au fost validate. Este adăugat `tests_country_profile_regression.mjs` pentru verificări simulate; rularea efectivă a testului Node și comportamentul live al furnizorilor nu au fost confirmate.
- **De verificat pe telefon:** deploy Cloudflare, prezentare „Spania” (inclusiv obiective și surse), prezentare oraș (nu țară), deschiderea traseului unui obiectiv și aspectul la derulare.

## Pocket AI — backend v171 / frontend 1.0.125 — 2026-11-02

- **Regresie rețete tradiționale:** în teste reale de pe telefon, modelul rapid a confundat „ficat de vită (burtă)” cu burtă de vită și a propus cantități neverosimile (de ex. o cană de sare). Filtrul culinar v171 respinge confuzia ficat/burtă, burta de porc și cantitățile evident improprii de sare/piper/muștar, pentru ciorba de burtă tradițională; în caz de eroare, folosește rețeta sigură existentă fără al doilea apel AI. Variantele vegetariene ori reinterpretate rămân distincte și nu sunt înlocuite automat.
- **Transport – sortare cronologică:** variantele TfL se ordonează după **data și ora începutului întregii călătorii** (inclusiv mersul către prima stație), nu după plecarea primului vehicul. La ore de plecare egale, se preferă **sosirea mai devreme**; se folosesc timestampuri complete, inclusiv la trecerea peste miezul nopții. Același criteriu se aplică rezultatelor MOTIS și, defensiv, listei afișate în frontend. Sunt păstrate până la patru opțiuni, iar accesul către prima stație este verificat în continuare.
- **Teste de regresie:** `tests_route_count_recipe_network_regression.mjs` acoperă cronologia efectivă observată 22:04 / 22:34 / 22:26 / 22:56, egalitatea plecărilor cu sosiri diferite, trecerea de miezul nopții și reacția la „ficat de vită (burtă)” într-o rețetă tradițională. Verificări simulate ale Workerului: un singur apel AI, corecție locală, fără ficat; JavaScriptul generat a trecut testul sintactic.
- **Nu s-au schimbat:** modelul rapid, căutarea evenimentelor, logica de rezolvare a stațiilor, poziția navigației inferioare sau numărul de variante de transport.
- **Neconfirmat:** publicarea efectivă în Cloudflare și testul live TfL pe dispozitiv după v171/1.0.125. Nu se pretinde verificare live a orarelor din capturi.

## Pocket AI — backend v170 / frontend 1.0.124 — 2026-11-02

- **Observații din testele Android:** backend v169 / frontend 1.0.123 a răspuns la sarmale în **3,5 secunde** (Worker 3,2 s, AI 3,2 s, fără cercetare web); cererea de evenimente Oradea în decembrie 2026 a durat **7,0 secunde** (cercetare 4,2 s, AI 2,3 s), dar a inclus rânduri cu perioade necoroborate. Întrebarea cu „anul curent” era uneori interpretată ca obiectiv geografic.
- **Clasificare:** cererile de calendar de evenimente sunt excluse din căutarea GPS a unui obiectiv cu nume și din identificarea unei adrese. Expresia „anul curent” este transformată în anul calendaristic curent în interogarea web. Întrebările despre un eveniment singular continuă să folosească asistentul generalist.
- **Sursă pentru fiecare eveniment:** tabelul de evenimente este construit din titluri/pasaje ale surselor externe cu dată, an și localitate corespunzătoare; modelul AI nu mai poate adăuga rânduri inventate în calendar. Se extrag mai multe evenimente din pasaje de tip calendar, se elimină duplicatele și se sortează cronologic. Fiecare rând include un link către sursa sa, afișat de frontendul v1.0.124.
- **Viteză:** pentru listele de evenimente cu căutare web, construcția rândurilor este deterministă și nu necesită un apel suplimentar de generare AI. Cele trei motoare de căutare rămân opționale și paralele; limita comună de așteptare nu a crescut. Rezultatele sunt etichetate ca *neexhaustive*, iar datele din căutări trebuie confirmate de organizator.
- **Teste:** `tests_events_source_grounding.mjs` acoperă două formulări ale întrebării, sursele individuale, două evenimente găsite pe o pagină de calendar, deduplicarea și respingerea unei locații nerelevante. În simulări V8: 3 rânduri distincte din 4 rezultate, 0 apeluri AI și 0 interogări greșite de geocodare; codul HTML generat a trecut verificarea sintactică.
- **Neconfirmat:** publicarea efectivă în Cloudflare, comportamentul furnizorilor reali pentru o căutare amplă și numărul total de evenimente documentate din Oradea. Nu se poate promite exhaustivitate sau confirmare independentă doar din rezultate indexate.

## Pocket AI — backend v169 / frontend 1.0.123 — 2026-11-02

- **Cauză confirmată cu cronometrul de pe telefon:** cererile de 32,5 s și 59,6 s au petrecut 32,2 s și 54,9 s în apelul principal Workers AI; web/GPS nu explică latența.
- **Optimizare model:** generarea principală și traducerile din răspunsurile non-AI folosesc implicit modelul Cloudflare `@cf/meta/llama-3.1-8b-instruct-fast`, în loc de `@cf/meta/llama-3.1-8b-instruct-fp8`. Acest model este documentat ca variantă rapidă, dar viteza și calitatea trebuie confirmate în mediul live; nu presupunem automat o țintă de 3–5 s.
- **Revenire controlată:** se poate seta variabila Worker `POCKET_AI_TEXT_MODEL=@cf/meta/llama-3.1-8b-instruct-fp8` pentru întoarcere la modelul anterior; sunt acceptate exclusiv valori din lista explicită de modele. Nu se folosește o valoare furnizată de utilizator în prompt.
- **Diagnostic:** backendul include în `latency_breakdown.ai_model` modelul efectiv ales; frontend v1.0.123 îl arată la detaliile timpului de răspuns.
- **Testări:** sintaxa surselor și a JavaScriptului generat este validă. Simulările apelurilor reale prin Worker cu AI substituit confirmă modelul nou implicit, configurarea de rollback și un singur apel pentru o rețetă obișnuită.
- **Neschimbate:** logica traseelor, listele și componentele de interfață, limitele de evenimente și regulile de selecție a preparatelor. Workflowul `deploy-cloudflare.yml` lansează deploy la push pe main, dar nu am confirmat finalizarea și nici timpii live după deploy.

## Pocket AI — backend v168 / frontend 1.0.122 — 2026-11-02

- **Diagnosticul telefonului:** 79,5 s pentru sarmale tradiționale: GPS 0,0 s, cercetare web 0,0 s, primul apel AI 36,8 s, al doilea apel AI pentru corectarea rețetei 42,5 s. Corectarea a eșuat și a produs un mesaj de imposibilitate a verificării.
- **Rezolvare v167–v168:** la rețete nu se mai lansează al doilea apel AI pentru validarea ingredientelor. Dacă sunt detectate materiale neverosimile, pentru sarmale sau ciorbă de burtă uzuală în română este disponibilă o rețetă de rezervă convențională; pentru alte cazuri nesigure nu se inventează. O variantă vegană, vegetariană, de post sau reinterpretată nu este suprascrisă cu rețeta tradițională. Primul apel AI rămâne dinamic și acum are plafon de 620 tokenuri pentru rețetele obișnuite.
- **Testare fără furnizori live:** simulările pentru ambele rețete au returnat răspuns corect într-un singur apel AI și fără cercetare web. Testele de regresie existente au fost actualizate și includ verificări pentru variante culinare explicite.
- **Limitare:** primul apel AI poate dura încă zeci de secunde. Îmbunătățirea totală trebuie măsurată în Cloudflare după publicare. Nu s-a schimbat modelul AI fără test comparativ, iar frontendul rămâne v1.0.122.

## Pocket AI — backend v167 / frontend 1.0.122 — 2026-11-02

- **Confirmed phone latency root cause:** 79.5 s for traditional Romanian sarmale: 0.0 s GPS, 0.0 s web, 36.8 s primary Workers AI generation, 42.5 s second recipe correction. The second inference still returned a recipe validation failure. These values came from the user's live frontend timing panel.
- **Backend v167:** removes the second AI correction call on culinary quality failure. For the repeatedly problematic traditional sarmale and beef tripe soup, a deterministic conventional recipe fallback is used when the model's output is rejected. This is a limited safety fallback, not a global rule for world cuisines. Other unverified recipe ingredients are not blindly delivered.
- **Primary generation:** first AI call remains necessary for dynamic recipes. It has a smaller 620-token ceiling for ordinary recipe questions, a more focused sampling temperature, and excludes a duplicated last user message in history. This may help, but no real latency improvement is claimed without measurements.
- **Diagnostics:** the expandable timing panel remains in frontend 1.0.122; `recipe_fallback_used`, `recipe_correction_ms=0` and estimated AI calls in backend response explain when a deterministic safety fallback was used.
- **Regression tests:** existing `tests_route_count_recipe_network_regression.mjs` now simulates incorrect ingredients in both sarmale and beef-tripe soup and asserts one model call per request; other tests were adjusted to the v167 generation parameters.
- **Still unresolved:** the first AI model call alone took 36.8 s in the supplied live measurement. Reducing duplicate inference is not enough to reach the 3–5 second goal. Next investigate/model-benchmark inference speed and output length on live Cloudflare; avoid claiming the Worker or UI can fix intrinsic model latency without evidence. Cloudflare deployment and GitHub Actions outcome have not yet been confirmed.

## Pocket AI — backend v163 / frontend 1.0.119 — 2026-11-02

- **Cercetare web:** un singur buget de colectare a furnizorilor (6 s general / 7 s evenimente), cu răspuns anticipat când există suficientă evidență de la furnizori independenți. Apelurile de căutare rămân paralele; pagina originală și generarea AI au timpi separați. Sursele care nu sosesc la timp pot lipsi: lista nu este garantat exhaustivă.
- **Rețete:** întrebările culinare independente nu mai așteaptă GPS în frontend și nu mai trec prin verificarea generalistă redundantă a răspunsului; rămâne verificarea țintită a ingredientelor. Istoricul transmis modelului pentru rețete uzuale este redus la ultimele patru mesaje.
- **Diagnostic:** API raportează `version: v163`, `research_elapsed_ms`, `ai_execution_ms` și `latency_breakdown`, inclusiv corecția propozițiilor. Frontend 1.0.119 înregistrează în consolă `total_ms`, `gps_ms` și `backend_round_trip_ms`, fără să înregistreze textul întrebării.
- **Teste:** `tests_request_pipeline_regression.mjs` verifică identificarea rețetelor, codul JavaScript generat, măsurătorile și cazul în care doi furnizori au rezultate, iar al treilea este blocat. Testele rulează automat în workflowul generalist.
- **Neconfirmat:** publicarea în Cloudflare, timpii reali de răspuns și completitudinea evenimentelor. Acestea necesită teste live; modificarea codului nu reprezintă dovada unei îmbunătățiri măsurate.

## Actualizare în dezvoltare — backend v150 / frontend 1.0.115 (2026-11-02)

- Prezentări de tip enciclopedie din rezumate Wikipedia, cu sursă și imagini când există, în fereastră separată în AI.
- Butonul „Creează traseu” folosește coordonatele oferite de sursă când sunt disponibile; pentru țări fără destinație exactă întreabă orașul.
- Cazarea include categorii geografice pentru hoteluri, hosteluri, pensiuni, moteluri și unele apartamente; zona centrală turistică este implicită pentru căutările cu destinație, dacă nu se solicită alt cartier.
- După răspunsuri de traseu venite din fluxul enciclopedic apare opțiunea de căutare a cazării.
- Rezultatele comerciale nu garantează disponibilitate, tarif sau inventar Airbnb; transportul mixt internațional în timp real nu este complet conectat și nu trebuie prezentat drept verificat.
- Navigarea intermodulară confirmată pe mobil trebuie păstrată; suitele automate vechi au încă eșecuri neinvestigate.

## Backend v147 — destinația confirmată înainte de alegerea transportului (2026-11-01)

În întrebările „Vreau să ajung la…”, backendul verifică mai întâi obiectivul și coordonatele, abia apoi oferă mijloacele de transport. Gările și stațiile sunt verificate în TfL, iar obiectivele turistice în date de hartă. Pentru „Stadionul Arsenal”, caută numele oficial „Emirates Stadium, London”, fără coordonate inventate. O locație îndepărtată cu un nume asemănător (de exemplu Reșița) nu poate fi înlocuitor automat. Distanța este trimisă frontendului pentru eliminarea opțiunii integral pietonale peste 3 km. Frontendul rămâne 1.0.114. Sunt incluse teste automate și verificare live în GitHub Actions; rămâne de verificat în Chrome pe telefon.

## Frontend 1.0.114 — actualizare plecări fără întrebări repetate (2026-11-01)

„Actualizează plecările” utilizează direct coordonatele destinației identificate și GPS-ul actual, fără reluarea întrebării despre locul de plecare. Rezultatele care nu mai pot fi prinse conform estimării de mers până la stație + marja de 5 minute sunt eliminate din lista de opțiuni. Într-un itinerar selectat, un traseu pietonal este oferit numai dacă a fost verificat și poate fi vizualizat pe hartă; butonul generic „Reîncearcă traseul pietonal” nu mai apare la plecările ratate. Funcționează atât în Asistent cât și în selecțiile rapide, păstrând destinația originală. Codul backend nu a fost modificat. Test de regresie separat inclus în GitHub Actions; verificarea pe telefon rămâne necesară.


## Frontend 1.0.112 — dialoguri generale pentru opțiuni și liste

Listele de opțiuni care nu încap confortabil în conversație sunt mutate într-un dialog suprapus cu închidere și revenire. Se păstrează elementele interactive originale și bara inferioară. Stilurile roșii din 1.0.111 rămân incluse. Testare vizuală pe telefon necesară.

## v1.0.111 — butoane roșii uniforme (2026-11-01)

Butonul Acasă, în toate secțiunile, și panoul extensibil Transport ales folosesc acum același gradient roșu, chenar și umbră ca Selecții rapide. Butoanele Acasă și Selecții rapide au lățimi egale și înălțimi coordonate. Nu se modifică backend-ul sau logica traseelor.

## Actualizare stil — frontend 1.0.110 (2026-11-01)
Butoanele Acasă din toate ecranele au gradientul Selecții rapide, iar acțiunile pereche au lățimi egale dimensionate după textul mai lung. Panoul Transport ales de pe hartă primește același gradient. Fără modificări de logică pentru trasee sau backend.

# myPocket AI — backend v146 + frontend v1.0.109

## Denumiri geografice și stații — v145 (01.11.2026)

- „West Dulwich” este verificat ca zonă geografică, înaintea căutării după denumiri de hoteluri sau magazine. O potrivire doar pe cuvântul „West” nu mai poate fi prezentată ca destinație sigură.
- „Victoria station” și „London Victoria station” sunt căutate în registrul oficial TfL. Un rezultat verificat cu numele scurt „Victoria” este etichetat conform tipului de stație, feroviară sau Underground.
- Testul live v144 a identificat corect West Dulwich; v145 repară eticheta scurtă primită de la TfL. Confirmarea live a versiunii v145 trebuie tratată separat.
- Test nou: `tests_geographic_station_intent.mjs`, care păstrează și verificarea de regresie pentru Decathlon.

## Actualizare — 01.11.2026 (v143 / 1.0.108)

- Pentru un nume de lanț precum „Decathlon”, aplicația oferă până la opt filiale distincte găsite în zona căutată. Primele patru apar direct, restul prin „Vezi mai multe locații”, cu distanță GPS în linie dreaptă unde este disponibilă. Un calificativ precis, ca „Lakeside”, are în continuare prioritate.
- Transportul public păstrează POI-ul final și oferă un buton pentru calculul traseului pietonal de la **ultima stație reală de coborâre** până la destinație. Traseul se deschide la cerere, fără să pretindă detectarea automată a coborârii sau ghidare vocală.
- Filtre distincte pentru restaurante și cafenele/ceainării; marketurile includ și magazine alimentare de proximitate, nu doar supermarketuri mari.
- Teste live GitHub Actions pentru v143: șapte variante Decathlon după numele simplu, zero rezultate duplicate între restaurante și cafenele în zona publică de test West Thurrock, magazine precum Londis și Longdan în categoria marketuri și un traseu final pietonal confirmat de 596 metri până la Decathlon.
- Testele specifice pentru destinații, final de traseu și categorii locale au trecut. Suita veche generală `npm test` încă eșuează la o verificare distinctă Brave/știri; acest rezultat nu a fost ascuns.
- Workflow: `.github/workflows/test-destinations.yml`; teste specifice: `npm run test:destinations` și `npm run test:local-categories`.


**Versiunile actuale din cod (01.11.2026):** backend v142, frontend APP.version 1.0.105. Publicarea în Cloudflare se verifică separat, prin testele live.

**Căutarea destinațiilor:** Aplicația trebuie să caute numele introdus de utilizator, fără a impune categoria afacerii sau localitatea. Căutarea Geoapify după nume are variante de rezervă prin Photon și alți furnizori de hartă, cu verificarea coordonatelor. Cuvântul „Street” din „London Liverpool Street” nu trebuie confundat automat cu o cerere de adresă stradală. Pentru transportul public se preferă stația verificată în TfL. Alegerea mijlocului de transport reutilizează destinația păstrată în conversație.

**Teste reale:** Workflow-ul `.github/workflows/test-destinations.yml` verifică în Cloudflare numele Decathlon în trei formulări și continuarea către „London Liverpool Street” prin transportul public. Execuția 41320428179 din 01.11.2026 a confirmat Decathlon prin Photon în v141, dar a eșuat la Liverpool Street. În v142 a fost corectată citirea câmpului TfL `SearchMatch.name`; rezultatul live al acestei modificări nu este încă confirmat de execuția anterioară. Pentru verificări locale: `npm run check`, `npm test`, `npm run test:destinations`.

**Curățarea repository-ului:** Fișierul `SHA256SUMS.txt` a fost eliminat deoarece conținea amprente învechite. Testele, configurațiile Wrangler, workflow-urile și `VERSION_LOG.md` au rămas. Mențiunile vechi de mai jos sunt păstrate ca istoric.

v137 / 1.0.101: căutările explicite după nume și localitate (de exemplu Magazin Europa din Grays, Restaurant Zani din Tilbury) sunt tratate înaintea căutărilor generale pe categorii. Dacă adresa nu este confirmată, nu se returnează afaceri fără legătură. Clarificările cu candidați sunt afișate în tabele interactive în conversație. Verificarea completă a răspunsurilor live rămâne necesară.

v135: ordonează candidații de localitate și adresă, fără a cere o singură localitate sau două domenii cu aceeași adresă. Caută și textul paginilor pentru adrese lipsă din hartă; confirmă coordonatele furnizorului pentru adresă. Păstrează contoare tehnice pentru diagnosticarea căutărilor eșuate.

v134: diferențiază adresele stradale/codurile poștale, punctele de interes numite și localitățile. Separă tipul afacerii de nume și localitate; acceptă nume plus localitate fără categorie explicită. Respinge străzile cu același nume pentru o cerere de magazin și verifică strada/numărul pentru adrese.

v133 / 1.0.99: alegerea pietonal/transport public/mașină se face dintr-un tabel cu butoane. Modul ales se trimite ca date structurate, păstrând destinația și cerând GPS. Pentru un local negăsit sunt încercate numele simplificat, locuri din localitatea explicită și, dacă EXA este configurat, adrese publice concordante verificate în hartă prin număr, stradă și localitate.

v132: păstrează numele locului și localitatea în ambele ordini de formulare, elimină „ce opțiuni am” din căutare și reține destinația după „Pietonal” sau „Cu transportul public”. Respinge locurile care nu corespund numelui și localității. Întrebarea despre deplasare include și transportul public.

v131 / 1.0.98: primul răspuns de transport are pași în tabel și ore scurte; întoarcere directă de la hartă la variante; fără diagnostice ale furnizorilor în descriere. Sunt păstrate trasee distincte și varianta returnată cu cel mai scurt mers până la îmbarcare. Verificările GPS și ale orei de plecare rămân active.

v130 recunoaște cererile către primul mijloc de transport și păstrează destinația finală la continuarea pietonală către stație. Nu caută global o stație generică.

1 noiembrie 2026. v129 corectează extragerea destinației pentru transportul în comun: modul de transport și cererea de variante nu mai înlocuiesc stația. Londra/Londrei devine London, păstrând Victoria Station. Sunt corectate expresiile pentru identificarea stațiilor oficiale.

Bază: GitHub main 9fca0a7f1e32284250c57322ba4d4cac1b78e778 (backend v127, antet frontend v1.0.96). APP și CLIENT_CONFIG sunt sincronizate la 1.0.97. Se păstrează clarificarea stațiilor ambigue și corecția Londra→London.

## Destinație → alegerea variantei → traseu până la stație

Cauți o destinație cu transportul public și alegi varianta dorită. Aplicația preia prima stație de îmbarcare a acelei variante, cu identificatorul, coordonatele, linia, indicatorul și direcția furnizate de operator. Dacă lipsesc coordonatele, consultă identificatorul stației la operator; nu o înlocuiește cu centrul străzii ori o stație cu nume asemănător. Fără coordonate verificate păstrează itinerarul și explică lipsa navigării.

După selecție se calculează automat mersul pe jos, de la GPS-ul actual la stația exactă. Rezultatul verificat deschide harta pietonală existentă. „Urmărește traseul în Pocket AI” pornește urmărirea GPS în aplicație; Google Maps rămâne opțional. Itinerarul ales rămâne într-o secțiune extensibilă deasupra indicațiilor pietonale, cu destinația, liniile, plecările și schimbările. Închiderea hărții revine la varianta aleasă. Butonul de alegere apare și pentru răspunsurile de transport din asistent și din cititor. Utilizatorul rămâne în secțiunea curentă.

Schimbarea variantei anulează calculul precedent. Răspunsurile întârziate nu pot înlocui stația nou aleasă. Navigarea într-un alt ecran, conversația nouă și revenirea la listă anulează o cerere pietonală încă în curs. Traseul verificat trebuie să fie pietonal, să păstreze coordonatele stației solicitate și să se termine la cel mult 120m de aceasta. Durata reală furnizată pentru mersul pe jos plus marja existentă de cinci minute este comparată cu plecarea primului vehicul. Dacă nu mai ajungi, trebuie actualizate variantele. Orele/duratele necunoscute sunt semnalate. Estimarea nu garantează prinderea mijlocului de transport și nu reprezintă monitorizarea continuă a plecării.

## Ce include această etapă

Logica nu conține orașe sau stații fixe. Folosește plannerul TfL și rutarea pietonală Geoapify deja configurate. Nu adaugă acoperire mondială pentru orare, verificare independentă a întreruperilor/închiderilor, ghidare vocală la fiecare viraj ori recalculare automată. Pentru transport în alte regiuni este necesară o sursă locală cu itinerare și stații verificate. Urmărirea GPS existentă necesită aplicația deschisă.

## Instalare și verificare

Arhiva conține backend.js și index.js COMPLETE, documentația și testele. Încarcă fișierele din rădăcina arhivei în același repository GitHub. Păstrează configurațiile Wrangler, secretele, AI binding, numele Worker-elor și workflow-ul existente. Backendul și frontendul trebuie actualizate împreună. Pachetul nu conține valori de chei și nu necesită o cheie nouă pentru această extindere.

npm test și npm run check trec. Sunt verificate stațiile exacte/cu nume identice, recuperarea coordonatelor după identificator, lipsa coordonatelor, alegere→mers pe jos→hartă, timpul până la plecare, anularea răspunsurilor vechi, GPS indisponibil, erorile furnizorilor, păstrarea secțiunii, intenția pietonală în altă limbă și toate cele zece limbi. Testele vechi aveau o versiune backend depășită și așteptau transferul automat între module; așteptările reflectă acum versiunea și regula acceptată de păstrare a secțiunii. Validarea folosește furnizori/GPS/browser simulate și compilarea codului JavaScript generat. Versiunea nouă nu este încă verificată live sau pe telefon: fișierele sunt pregătite pentru încărcare manuală.

După publicare: destinație → alegerea variantei → verificarea stației/liniei → harta pietonală → pornirea GPS → închiderea hărții și consultarea itinerarului. Alege și altă variantă pentru a verifica schimbarea stației. Dacă plecarea nu mai poate fi prinsă, actualizează variantele.

## Urmărirea traseului în Pocket AI

Acțiunea principală este „Urmărește traseul în Pocket AI”. Butonul deschide harta existentă și pornește urmărirea GPS numai după apăsare; nu deschide alt tab sau aplicația Google Maps. „Google Maps (extern)” rămâne un link opțional, separat.

Un singur marcaj urmărește poziția telefonului. Harta urmărește pozițiile GPS noi; deplasarea manuală a hărții suspendă centrarea, iar „Recentrează” o reactivează. Distanța rămasă este aproximată prin proiecție pe geometria traseului ales. Poziția imprecisă, semnalul neactualizat și ieșirea din traseu sunt semnalate. Oprirea, închiderea hărții, schimbarea traseului/ecranului și resetarea conversației eliberează urmărirea GPS, temporizatorul și marcajul; actualizările întârziate sunt ignorate. Actualizările sunt prelucrate local și pot actualiza cache-ul de locație al sesiunii; nu trimit periodic cereri de rutare către backend.

Aceasta este urmărire vizuală GPS cu lista de indicații, cu aplicația deschisă. Nu adaugă ghidare vocală la fiecare viraj, selectarea automată a manevrei, confirmarea sosirii, garanții în fundal/cu ecranul stins sau recalculare automată. Necesită permisiune de localizare și semnal GPS. Toate controalele și mesajele noi sunt traduse în cele zece limbi.

## Alternative pietonale automate

Utilizatorul nu mai trebuie să cunoască un punct intermediar. Aplicația calculează variante pietonale și caută automat alei, căi pietonale și acces la gări/metrou în apropierea destinației prin Geoapify Places. Verifică cel mult patru accese separate geografic, calculând rute mode=walk/type=short. Căutarea este limitată, nu garantează toate variantele posibile.

Două cereri Places caută la 1.100 m în jurul destinației. Nu introducem automat centrul unui cartier. Excludem accesele explicit private/interzise și punctele prea apropiate de plecare/destinație ori care presupun ocoluri mari. Geometria calculată trebuie să treacă la maximum 45 m de accesul ales. Se elimină ocolurile mai mari decât traseul minim + max(400m, min(1200m, 45% din minim)). Variantele care împart cel puțin 88% din ambele coridoare, într-o toleranță de 40m, se unifică. Afișăm cel mult trei trasee distincte, începând cu cel mai scurt verificat. Uneori datele/furnizorul oferă o singură variantă; acest lucru este spus explicit.

Metadatele despre pasarelă necesită o cale pietonală marcată ca pod și geometria corespunzătoare din API-ul public OpenStreetMap. Geometria pasarelei trebuie să se regăsească la maximum 20 m de traseul calculat. Cache: cinci minute, cel mult 24 de poduri. Denumirile variantelor folosesc numărul traseului și străzile diferite furnizate de serviciu. Verificarea geometrică nu reprezintă confirmarea în timp real a accesibilității, închiderilor, traficului sau siguranței traversărilor.

## Alegerea simplă

Selectorul afișează distanța și durata fiecărei variante. Pe hartă, traseul ales este albastru, celelalte gri. Selectorul sau atingerea unei linii gri schimbă împreună geometria, indicațiile și navigația. Formularul de punct intermediar a fost eliminat. „Caută alte trasee pietonale” repetă căutarea automată cu aceeași plecare/destinație și șterge constrângerile intermediare rămase din v111. Controalele sunt traduse în toate cele zece limbi.

Linkul Google Maps păstrează accesele alese automat și modul pietonal. Google Maps poate recalcula; poate afișa previzualizarea sau cere pornirea finală. Urmărirea GPS vizuală internă este descrisă mai sus; ghidarea vocală și recalcularea automată nu sunt implementate. Cererile tastate explicit „prin...” rămân disponibile pentru utilizatorii care cunosc zona, dar nu sunt necesare în fluxul pietonal.

## Păstrat și verificat

Se păstrează conversația comună între module, alegerea exactă a hotelurilor, GPS-ul, prognozele Open-Meteo, previzualizarea pe patru rânduri, linkurile sigure, cititorul și navigația inferioară fixă. Geometria, străzile, distanțele și duratele provin din Geoapify, fără generare de trasee de către modelul lingvistic. Erorile păstrează destinația pentru reîncercare.

npm test și npm run check verifică backendul și codul clientului cu furnizori/DOM simulate, inclusiv descoperirea automată, suprapunerea traseelor, aceleași capete, respingerea acceselor private/centrelor de cartier/ocolurilor, verificarea pasarelei și eșecurile parțiale. Nu există test vizual pe telefon în mediul local. Verificarea reală între locuri publice urmează publicării; traseul de la poziția dispozitivului necesită testarea pe telefon.

Fișierele se publică în rădăcina repository-ului; se păstrează configurațiile Wrangler, secretele și workflow-ul existent. Nu există coordonate sau trasee Lakeside/Mill Lane/Mayflower codificate în produs.

Documentație: https://apidocs.geoapify.com/docs/routing/ ; https://apidocs.geoapify.com/docs/places/ ; https://wiki.openstreetmap.org/wiki/API_v0.6 ; https://developers.google.com/maps/documentation/urls/get-started . Legătura pietonală a gării Chafford Hundred este documentată de operator: https://www.c2c-online.co.uk/stations/chafford-hundred-station/ .


## v146 / 1.0.109 — categorii și afișarea traseelor (2026-11-01)
- Selecții rapide Hărți: Muzee, Parcuri, Grădini zoologice; căutare pe GPS cu raza implicită 5 km.
- Categorie combinată Baruri, ceainării și cafenele, incluzând puburi. Restaurantele rămân separate.
- În lipsa rezultatelor confirmate, nu se inventează obiective. Nu se confundă un furnizor indisponibil cu absența obiectivelor.
- Butoanele Acasă și Selecții rapide sunt uniformizate, iar acțiunile de hartă primesc contrast mai bun; indicațiile pe străzi rămân vizibile în fereastra hărții.
- Validarea pe telefon și căutările live în Cloudflare rămân necesare după publicare.
