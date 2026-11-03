## Pocket AI — backend v176 (ramură de test, nepublicată) / frontend 1.0.130 — 2026-11-03

- **Rețetele nu mai sunt fixe:** eliminat răspunsul local pentru balmoș și fallback-urile fixe pentru sarmale/ciorbă de burtă. Orice cerere recunoscută ca rețetă declanșează căutare în surse culinare accesibile, independent de țară.
- **Rețete din surse:** sunt căutate paginile editorilor culinari; se citesc secțiunile cu ingrediente și preparare și, când există, datele structurate schema.org `Recipe`. Răspunsul folosește dovezile găsite, include surse, iar dacă nu pot fi accesate suficiente instrucțiuni nu inventează rețeta.
- **Corectitudine:** bugetul de generare se adaptează numărului cerut, iar verificarea respinge ingrediente improbabile și metode majore de gătire neidentificate în surse (de exemplu prăjirea propusă fără prăjire în metoda publicată). Redactarea cere română naturală și păstrarea ordinii autentice de preparare.
- **Interfața rămâne neschimbată:** cititorul cu mai multe rețete, listele, navigația și funcțiile de transport/cazare nu sunt modificate.
- **Stadiu:** sintaxa backend și simularea unei cereri cu sursă Exa + pagină culinară au trecut. Testele complete CI, rezultatele reale de pe internet și publicarea Cloudflare sunt încă neconfirmate.

## Pocket AI — backend v175 / frontend 1.0.130 — 2026-11-03

- **Balmoș tradițional, nu desert:** rețeta standard folosește jintiță sau lapte gras, mălai, unt, smântână și brânză de oaie/burduf. Când sunt cerute 2–3 rețete tradiționale, sunt furnizate tot atâtea variante complete, fiecare cu propriile ingrediente și pași. Cererile explicite de adaptări (vegan, fără lactoză, traducere etc.) nu sunt înlocuite automat cu varianta clasică.
- **Calitate culinară generală:** instrucțiunile modelului includ natura sărată a balmoșului; verificarea respinge ingredientele de prăjitură pentru o rețetă tradițională. Pentru rețetele generate dinamic, bugetul de ieșire se scalează cu numărul de rețete cerute în loc de limita fixă de 620 de tokenuri.
- **Fereastra „Răspuns complet”:** rețetele sunt afișate în secțiuni distincte, cu titluri, ingrediente și pași, fără marcaje Markdown `**` vizibile. Textul complet rămâne derulabil în aceeași fereastră, cu navigația de jos fixă.
- **Regresie:** `tests_balmos_recipe_regression.mjs` inclus în `npm test`, rulabil separat prin `npm run test:balmos`; verifică exact trei rețete, ingredientele tradiționale, excluderea cacao/zahăr, bugetul generării și cele trei secțiuni în modal. Sintaxa backend și frontend (inclusiv JavaScript-ul generat) și testele pure ale rețetei/afișării au trecut. Testele complete CI și rezultatele live se confirmă separat.
- **Neschimbate:** motorul de cazare funcțional, filtrarea dublurilor, fluxul de transport, butoanele de navigație și bara de jos.

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

## Pocket AI — backend v154 / frontend 1.0.118 — 2026-11-02

Rezultatele Android au scos în evidență trei regresii: evenimentele din Oradea au eșuat uneori cu browser `Failed to fetch`; o cerere cu trei variante de transport a afișat patru; o rețetă de sarmale a recomandat „frunze de lemn sau țelină”.

- **Trasee**: backendul parsează acum numărul explicit cerut (1–4, numerale românești și engleze), folosind această limită la alegerea alternativelor. Frontendul păstrează numărul din întrebarea inițială prin dialogul Asistent → Transport public și prin „Actualizează plecările”. Nu sunt inventate alternative când furnizorul are mai puține. În HTML-ul generat de frontend, expresiile regulate sunt escapate corect și testate după generare (regresie observată și remediată înainte de lansare).
- **Rețete**: promptul de gătit cere ingrediente comestibile, tradiționale și o metodă compatibilă cu preparatul. Pentru răspunsuri evident neverosimile despre foile de sarmale, există o singură încercare suplimentară de reformulare și validare; dacă rămâne neverosimilă, nu se livrează instrucțiunea greșită. Rețetele obișnuite păstrează răspunsul rapid într-un singur apel AI. Aceasta este o verificare de calitate, nu un filtru care limitează categoriile de întrebări.
- **Evenimente / rețea**: etapa de cercetare pentru evenimente folosește limite mai scurte la apelurile paralele și context de surse mai concis, pentru a reduce probabilitatea întreruperii. Dacă browserul primește un eșec de conexiune, interfața afișează mesaj lizibil și controlul „Reîncearcă întrebarea” declanșat de utilizator, fără repetarea automată a unui POST costisitor. **Cauza exactă a mesajului `Failed to fetch` nu este confirmată** fără loguri live/Network DevTools: poate fi conexiune, CORS, expirarea unei execuții sau indisponibilitatea Workerului. Nu marca evenimentele ca funcționale până la test live.
- **Teste**: `tests_route_count_recipe_network_regression.mjs` introdus și workflowul `.github/workflows/test-generalist-mixed.yml` extins. Verificări izolate V8: cod sursă compilabil, HTML JavaScript generat compilabil, parsare 3/2/1 variante, păstrare prin UI, controlul ingredientelor, limitele de cercetare și reacția la eroare au trecut.
- **De verificat după deploy Cloudflare**: evenimente Oradea decembrie 2026 cu tabel datat, linkuri și fără eroare de conexiune; „Vreau trei variante cu transportul public până la West Dulwich, Londra” exact 3 (sau mai puține când există numai atâtea variante reale), inclusiv după Actualizează plecările; rețeta de sarmale fără frunze nepotrivite, cu timpi autentici și măsurarea latenței.
- **Neconfirmat**: publicarea în Cloudflare, starea GitHub Actions și calitatea rezultatelor furnizorilor live. Traseele mixte internaționale au în continuare nevoie de provider autorizat.

## Backend v153 / frontend 1.0.117 — 2026-11-02

- Evenimente: răspunsurile cu liste de spectacole, concerte și festivaluri sunt transformate în `structured_list.type=events` cu rânduri datate, sortate cronologic. O interogare pentru o lună anume exclude evenimentele strict din alte luni, dar păstrează evenimentele care traversează intervalul (ex.: târg 27 noiembrie–26 decembrie). Orele existente sunt preluate fără inventare. Evenimentele fără dată confirmabilă nu sunt prezentate drept program verificat.
- Frontend: afișare tabelară responsive în fereastra suprapusă de răspuns, coloane pentru dată/oră și denumire/loc; listele structurate vor putea folosi același renderer. Linkurile la sursele găsite sunt afișate ca piste de verificare, nu ca dovezi pentru fiecare eveniment. Alte tipuri de liste structurate au nevoie de adaptări separate.
- TfL: elimină alternativele care au aceeași plecare/sosire și aceeași semnătură vizibilă; variantele cu ore diferite sunt păstrate. În cărțile opțiunilor se văd și mijloacele/stațiile intermediare. Ora din antet reprezintă începutul întregii călătorii, incluzând accesul pietonal; îmbarcarea rămâne afișată separat.
- Rețete culinare: cererile obișnuite fără cercetare web folosesc un system prompt mult mai scurt, fără renunțarea la ingredientele, cantitățile, pașii și siguranța preparării. Câmpul de diagnostic `ai_execution_ms` permite comparații reale de latență. Nu se promite o anumită reducere înainte de măsurători.
- Prezentări geografice: după identificarea țării, adaugă monedele oficiale și limbile oficiale din setul deschis mledoze/countries, cu cache Worker pe 24h și afișare doar dacă furnizorul răspunde. Pentru orașe, codul țării se determină prin geocodificare, nu prin GPS-ul utilizatorului. Datele despre limbi nu reprezintă o listă exhaustivă a tuturor limbilor vorbite local. Set de date: https://github.com/mledoze/countries (ODbL / atribuire).
- Regresie: `tests_events_transport_facts_regression.mjs` și actualizarea workflowului `.github/workflows/test-generalist-mixed.yml`.
- Verificări efectuate separat: sintaxă backend/frontend, filtrare calendaristică și evenimente peste limita lunii, alternativa TfL duplicată, metadate ISO simulate (România: RON, română), integrare HTML. GitHub Actions, API-urile externe, performanța reală și publicarea Cloudflare rămân neconfirmate.

## Backend v152 — 2026-11-02: ordonare liste și verificare West Dulwich

- Ordonarea cronologică nu mai depinde de cererea explicită „în ordine cronologică”: listele numerotate și cu marcatori sunt sortate după datele calendaristice detectate, inclusiv când data este în interiorul descrierii. Intrările identice cu aceeași dată sunt eliminate. Instrucțiunile secvențiale din rețete și navigație nu sunt reordonate.
- Selecțiile generale respectă în continuare ordonarea proprie domeniului: plecări după oră, localuri în apropiere după distanță, răspunsuri generale după relevanță; fără un criteriu sigur nu impunem ordine artificială.
- Pentru cereri de transport către locuri precum „West Dulwich, London”, backendul caută mai întâi stația prin TfL, inclusiv când utilizatorul omite cuvântul „station”. Căutarea secundară cere o potrivire exactă a numelui și nu poate înlocui destinația cu creșe/magazine.
- Rețetele cu blocuri de ingrediente identice repetate sunt curățate înainte de afișare, fără să fie deduplicați pașii de gătire.
- Teste adăugate în `tests_response_lists_station_regression.mjs` și workflowul `test-generalist-mixed.yml` extins.
- Verificări izolate ale sintaxei și formatării: trecute. Încă necesare: rezultatul GitHub Actions, publicarea în Cloudflare, test live TfL West Dulwich, audit surse legislative și confirmarea pe Android. Nu considera traseul West Dulwich rezolvat înaintea testului cu orare reale.

## Work in progress — backend v151 / frontend 1.0.116 (2026-11-02)

- Fixed 34 under-escaped regular-expression tokens in the frontend Worker HTML template, affecting Wikipedia text and speech transcript normalization. This specifically addresses the missing letter “s” (e.g. “cunoscută”).
- Generalist research no longer depends only on a question mark or a fixed subject category; explicit searches work across subjects. International legal queries use the multi-language country table. Source-aware rules added for political news and detailed culinary recipes.
- Journey durations are displayed in minutes, hours/minutes, and days/hours/minutes across ten languages without changing internal route timings. International mixed itinerary legs retain departure and arrival time zones.
- Optional adapter for a licensed/authorized MOTIS v6 route provider (`MOTIS_API_BASE_URL`) accepts verified walking + train/subway/bus/coach/ferry legs, validates times/cancelled services and maps to existing transit UI. No provider configured by default. Transitous public API is explicitly not used because its usage policy prohibits commercial use. This is not a complete international flight itinerary planner.
- Added focused tests: `tests_generalist_mixed_regression.mjs` and `.github/workflows/test-generalist-mixed.yml`. CI outcome and Android validation still require confirmation; do not mark production deployment or international end-to-end routing verified.
- Local TfL and existing driving route calculation is preserved. International itineraries remain unavailable until a suitable permitted routing service is connected and tested.

## 2026-11-02 — Backend v150 / frontend 1.0.115 (partial feature update)

Wikipedia summary endpoint integration (no paid provider), assistant encyclopedia overlay, destination selection on route creation, accommodation categories and tourist-centre intent, optional accommodation prompt after route response. Existing local business category expansion retained. Live international air/rail/ferry itinerary verification, lodging availability and comprehensive small business coverage remain outstanding. Previous navigation accepted by user; deployment and test verification pending.

## 2026-11-01 — Backend v147 / frontend 1.0.114

Validare a obiectivului înainte de alegerea transportului; TfL pentru stații, Geoapify pentru alte obiective; numele uzuale de stadion sunt căutate cu denumirea oficială, fără coordonate introduse manual. Nu se acceptă un rezultat îndepărtat și fără legătură cu cererea. Distanta verificată controlează afișarea modului pietonal. Adăugate teste dedicate pentru Arsenal și păstrarea căilor TfL. Problema preexistentă Brave Search din testul general rămâne separată.


## Frontend 1.0.112 — dialoguri generale pentru opțiuni și liste

Listele de opțiuni care nu încap confortabil în conversație sunt mutate într-un dialog suprapus cu închidere și revenire. Se păstrează elementele interactive originale și bara inferioară. Stilurile roșii din 1.0.111 rămân incluse. Testare vizuală pe telefon necesară.

## v1.0.111 — butoane roșii uniforme (2026-11-01)

Butonul Acasă, în toate secțiunile, și panoul extensibil Transport ales folosesc acum același gradient roșu, chenar și umbră ca Selecții rapide. Butoanele Acasă și Selecții rapide au lățimi egale și înălțimi coordonate. Nu se modifică backend-ul sau logica traseelor.

## UI styling update — frontend 1.0.110 (2026-11-01)
Home buttons in all views match Quick Selections gradient, equal-width paired actions sized to longest label; selected transport details in the route map use the same visible gradient. No route or backend logic changed.

v146 / frontend 1.0.109 — new museum/park/zoo quick searches, combined bars/cafes/pubs, button styling and persistent walking directions. GPS-backed 5km searches; no invented results. Live QA pending.

# Version log

## 2026-11-01 — Backend v143 / Frontend 1.0.108

- Generic chain name ("Decathlon") presents up to eight verified nearby branches when multiple locations are available, with the first four shown immediately. Qualifiers (e.g. "Lakeside") still narrow the result; no location is invented.
- TfL itineraries retain the final destination POI and support a separate on-demand pedestrian map route from the last non-walking vehicle alighting stop to that POI. The live backend verified a 596 m final walk to Decathlon.
- Restaurants no longer automatically absorb cafés/tea rooms, fast food, pubs or bars. Café query is kept separate; grocery search includes convenience shops as well as supermarkets.
- In live public-area fixture around West Thurrock: 40 restaurant and 40 café results with no identical place in both; grocery sample included Lidl, Longdan, Londis, Tesco Express and other markets.
- Dedicated destination, last-mile and category fixture tests pass; full legacy suite still reports a separate Brave/news test failure. Do not claim comprehensive green CI until that separate discrepancy is investigated.
- Frontend 1.0.108 preserves fixed bottom navigation; new final-mile button uses verified stop and POI geometry. Live in-app visual validation remains to be performed.


## 2026-11-01 — Source audit, backend v142 + frontend 1.0.105

- Verified the exact file tree on `main`. Every `tests*.mjs` is used by `npm test`; the two Wrangler configs and GitHub Actions workflows are active configuration and must not be deleted.
- Removed the obsolete `SHA256SUMS.txt` file: its digests described earlier code and documentation, not the current release. Updated both README files; the history remains intact.
- Live GitHub Actions run 41320428179: Cloudflare v141 resolved all three Decathlon name forms by Photon and retained a working transit route; `London Liverpool Street` still failed during station resolution.
- Backend v142 reads TfL `StopPoint/Search` results using `SearchMatch.name`, validates the operator station and uses the matched ID for public-transport routing. The historical v141 run is **not** proof of v142 live success.
- `tests.mjs` no longer pins obsolete backend v136; the Liverpool Street fixture now uses the actual TfL `name` field. The named-venue and transit regression tests remain part of the test suite.
- Rule for routing: the place name entered by the user is the primary lookup key. Terms like "Street" inside an official station name must not be used alone to force a street-address category. Provider-verified coordinates or a clarification are required before navigating.


## 2026-10-31 — backend v114 + frontend 1.0.83
2026-10-31 — backend v114 / frontend 1.0.83: expanded Romanian local food, market and pharmacy intent; nearby 'în jurul meu'; removed automatic chat-module handoff; exposed New conversation in module conversation header. Static inspection only; automated/live regression tests pending.


## 2026-10-28 — Frontend v1.0.33 + backend v89
- Corrected frontend `APP.version` from 1.0.32 to 1.0.33.
- Kept `CLIENT_CONFIG.version` at 1.0.33.
- Kept the known existing backend endpoint `https://lifewise-ai-api.kokocf.workers.dev/api/chat`; no speculative endpoint change.
- Preserved backend v89 source unchanged.
- Added explicit Wrangler configurations for the existing frontend and backend Worker names.


## 2026-10-28 — Frontend v1.0.34 + backend v90 (prepared replacement)
- Frontend: results panel fills the available mobile sheet; result list scrolls independently; added layered gradients, inset highlights, and depth/pressed states to the results surface and controls.
- Backend: added a distinct `pub` search category ahead of the general restaurant category; separated Geoapify category classification and Photon filtering so pub/bar/biergarten results are not intentionally mixed into restaurant searches.
- Preserved API endpoint, GPS payload handling, 5 km radius, routing, and existing provider architecture.
- Validation: syntax checks and static checks performed before packaging. Live provider result quality and Cloudflare deployment still require runtime testing.

## 2026-10-30 — Backend v96 + Frontend 1.0.48
- Rebuilt from the latest `main` branch snapshot fetched directly from GitHub; version numbers in previous README files were not used as source-of-truth.
- Backend: parallel Exa, Brave Search and Tavily adapters using `EXA_API_KEY`, `BRAVE_API_KEY`, and `TAVILY_API_KEY`.
- Provider failures are isolated; successful providers continue to contribute results.
- Canonical URL deduplication removes common tracking parameters; excerpts and provider provenance are merged.
- Added per-provider diagnostics to `web_search_diagnostics.providers`.
- Strengthened grounding instructions for jurisdiction, official primary sources, publication dates and limitations of search snippets.
- Frontend: version identifiers only updated to 1.0.48; no UI or behavior changes.
- README_RO.md, README_ROMANA.txt and VALIDATION.txt rewritten to match the actual delivered code and exact upload list.
- Automated mock tests and syntax checks pass; live Cloudflare API validation remains pending deployment.

## 2026-10-31 — Backend v108 + frontend 1.0.77
- Dedicated Open-Meteo forecasts; replace city on follow-ups and preserve day, never infer temperatures with the language model.
- Weather context survives client history truncation, clears with new conversations/topics and is restored with archived chats.
- Validate dates, timezones, units, missing/null values and provider failures. Source attribution and retrieval time included.
- Merge repeated Paris settlement labels with equivalent administrative tokens while retaining geographically distinct towns.
- Add missing tests_reader.mjs and new tests_weather.mjs to match npm test; include README.md and synchronized Romanian documentation.
- Validation: automated mocked backend/client regression tests and syntax checks pass. Live Open-Meteo HTTP 200 verified. Physical phone QA remains pending.

## 2026-10-31 — Backend v109 + frontend 1.0.78
- Based on GitHub main 3531b287807da5f0b5bdef136c2f740f98048e1f, matching v108/1.0.77 source hashes.
- Unified pedestrian quick/chat intent; GPS confirmation resumes a pending route. Recover route intent from user history without assistant geography.
- Local name/category search for unqualified shopping centres before constrained geocoding; explicit country retains worldwide lookup.
- Provider street instructions with map, exact selected hotel coordinates, and user-activated Google Maps navigation links.
- Backend module recommendation and frontend handoff preserve conversation, GPS and generation without reset/archive.
- Preserve v108 weather behavior. Add missing client/weather tests plus route regressions; update documentation.
- Validation: mocked backend/DOM regression suites and generated client syntax pass. Real Geoapify responses and phone navigation still require post-deployment verification.

## 2026-10-31 — Backend v110 + frontend 1.0.79
- Based on GitHub main e718d609971995e7393661eaf8d8dd661eb31da5, matching uploaded v109 source hashes.
- Normalize metric unit casing instead of rejecting valid provider-style distance_units: meters.
- Preserve retry context after route errors; full destination clarifications replace repeated names and do not fall through to the LLM.
- Separate trailing town qualifiers from shopping-centre name validation. Handle legacy pending:null route contexts.
- Add controlled route diagnostics and regression fixtures for lowercase/uppercase metric units, incompatible units, and failure -> destination clarification -> retry.
- Existing weather, place, GPS, client, navigation-link and module-handoff regression suites pass; syntax checks pass. Live post-deployment route check pending publication.


## 2026-10-31 — Backend v111 + frontend 1.0.80
- Based on GitHub main b3880eb61a8c56b3bc2ad036497edde143cc8a63, deployed v110/1.0.79.
- Compute supported balanced/short pedestrian choices plus an explicitly requested waypoint route; deduplicate identical geometry and isolate individual failures.
- Preserve destination/profile during waypoint name, numbered-choice and precise-address clarifications. Form sends structured waypoint intent in all ten UI languages.
- Compact selector synchronizes selected geometry, street directions and navigation; Google Maps URLs retain the chosen waypoint.
- No walking traffic/safety/quietness claims or motor-vehicle-only avoidance settings; disclose a single distinct result or failed waypoint calculation.
- Normalize known English stairs/crosswalk phrases in Romanian; retain floor numbers and street names.
- Backend/client tests and generated-script/syntax checks pass; live deployment validation recorded after publication. Physical phone QA remains necessary.


## 2026-10-31 — Backend v112 + frontend 1.0.81
- Replace the waypoint form with automatic pedestrian access discovery and a simple repeat-search action; retain same endpoints and clear old waypoint constraints.
- Discover mapped footpaths/railway entrances, calculate bounded walking alternatives, reject detours/private access/ignored waypoints and collapse substantially overlapping corridors.
- Require OSM bridge geometry matching before labeling a route as using a footbridge; isolate optional provider failures.
- Show selected blue / alternative grey geometries; choosing a path synchronizes directions and Google Maps navigation.
- Keep all ten UI languages and existing weather/GPS/hotel/shared-chat regressions. New automatic-alternative regressions and generated client syntax pass.
- Live public-place route validation follows deployment; physical phone QA remains necessary.


## 2026-10-31 — Backend v113 + frontend 1.0.81
- Label automatic routes by their number and differing provider street names instead of common approach roads or generic footbridge labels.
- Live v112 validation between public Grays Station and Lakeside found automatic Mill Lane/Mayflower Road walking geometry; discovery and both Worker deployments succeeded. Device-origin quality still requires phone QA.


## 2026-10-31 — Frontend 1.0.82 (backend v113 unchanged)
- Primary route-follow action stays in Pocket AI, with explicit GPS start/stop, one live marker, map following/recenter and approximate remaining distance.
- Report low accuracy/stale GPS/off-route states; clean watches/timers/markers on stop, close, view/route change and reset; ignore late callbacks.
- Keep Google Maps as a separately labeled optional external link. No new tabs or app handoff from the primary action.
- Foreground visual following only: no voice, automatic maneuver selection, arrival confirmation or automatic rerouting.
- Mocked actual-client GPS/Leaflet lifecycle tests and all existing backend/client suites pass; generated-script/syntax checks pass. Physical phone GPS QA remains necessary.


## 2026-11-01 — Backend v128 + frontend 1.0.97 (manual-update package)
- Based on main 9fca0a7f1e32284250c57322ba4d4cac1b78e778; preserve v127 transit destination validation and the final Londra/London UI clarification.
- Retain exact first boarding stop ids, coordinates, line, indicator and supplied direction; resolve missing coordinates only by an operator stop id.
- Selecting a journey requests a verified pedestrian route to its boarding stop and opens the existing in-app map/navigation controls. Keep the selected itinerary on the map and remain in the current section.
- Validate endpoint/mode, check walking time plus the five-minute departure margin, reject stale selection responses and disclose missing stops/times.
- Support both quick-selection and chat/reader entry points, all ten UI languages, and structured walking intent even when international stop names contain bus/rail terms.
- Synchronize APP and CLIENT_CONFIG to 1.0.97. All automated suites and syntax checks pass. Live deployment/phone QA pending manual upload; no new global timetable or closure provider added.


## 2026-11-01 — Backend v129, frontend 1.0.97 unchanged

- Fix the exact assistant test request: retain Victoria Station in central London, rather than geocoding “comun” or London alone.
- Parse the destination independently of transport mode, city qualifiers and comparison instructions; ask for a destination when only an origin is supplied.
- Correct overescaped regex boundaries in operator station lookup and name validation.
- Add end-to-end mocked provider tests for Romanian/English chat requests, verified station id routing and missing destination.
- Publish directly to GitHub under the user's confirmed update workflow.


## 2026-11-01 — Backend v130, frontend 1.0.97 unchanged

- Recognize “primul mijloc de transport” and “prima stație de autobuz” as boarding access within a transit trip, ahead of walking/driving dispatch.
- Preserve Lakeside from the immediately relevant user history; reject stale trip recovery after another topic.
- Keep the final destination distinct from the first boarding stop. Missing destination asks for clarification without global stop geocoding.
- Extend mocked integration tests with both exact screenshot turns, actual itinerary boarding-stop selection, missing GPS and topic boundaries. All suites and syntax checks pass.


## 2026-11-01 — Backend v131 + frontend 1.0.98

- Replace the long first transport reader with an accessible three-column journey step table (step, action, local time), preserving station and line names. All ten UI languages have table and return controls.
- Keep compact alternatives with departure/arrival, boarding station, access walk and transfer count. Repeated departures along one corridor no longer hide a distinct route; retain the shortest boarding walk among returned feasible options. No Grays service is fabricated or forced.
- Add a visible back-to-options button to boarding-access maps. Closing the map also returns to cached journey options without repeating GPS/provider calls.
- Remove BODS/RTT checks and unrelated vehicle lists from the itinerary text, retaining structured diagnostic metadata. Fix literal newline escapes and show short clock times.
- Synchronize frontend identifiers to 1.0.98. Tests cover semantic tables, automatic first-reader data readiness, cached return, corridor diversity, short-access retention and existing routing/navigation.


## 2026-11-01 — Backend v132, frontend 1.0.98 unchanged

- Preserve venue and city in “în Tilbury la restaurant Zani” and “la restaurantul Zani din Tilbury”, without treating “ce opțiuni am” as part of the destination.
- Walking/driving and public-transport geocoders now reject named venue matches that do not also match the explicitly requested town. Missing matches ask for details; no unrelated restaurants are substituted.
- Include public transport in the mode clarification and retain the final destination across short mode replies, using structured route context or the immediately relevant user history.
- Extend natural travel-intent wording and recognize inflected transportul public/metroul forms.
- Add mocked integration tests for both screenshot word orders, sequential walking and transit replies, fresh/history-based context, rejected wrong-country same-name restaurants, and an explicit foreign-city destination. All eight suites and syntax checks pass.


## 2026-11-01 — Backend v133 + frontend 1.0.99

- Add a three-button walking/public transport/driving mode table in chat and answer reader, localized in all ten UI languages. Send the selected mode as structured data, retain the final destination, request GPS and reject obsolete controls. Typed mode answers remain supported.
- Resolve named places missing from geocoding by simplified name, then a named Places search inside the explicitly resolved town. Do not substitute the phone's town for an explicit foreign destination.
- When EXA_API_KEY is configured and map POIs are missing, require address agreement from two distinct domains and map confirmation of house number, street and locality before using returned coordinates. No coordinates are inferred from prose and origin GPS is not sent to web search.
- Use the same resolver for pedestrian/driving and public transport. If a named town is already known, ask for street/postcode rather than requesting the same town again.
- Tests cover click-to-backend flow in multiple languages, actual chat payload and GPS intent, missing-map-POI fallbacks, address agreement/conflicts, inadequate geocodes and shared transit resolution. All ten suites and syntax checks pass. The live restaurant route still requires phone/provider validation after deployment.


## 2026-11-01 — Backend v134, frontend 1.0.99 unchanged

- Classify travel destinations into street/postcode addresses, named POIs and geographic places. Keep category, business name and explicit locality separate.
- Support store, restaurant, cafe, accommodation, pharmacy, museum, park, healthcare, education and entertainment prefixes; names with explicit towns also work without a category.
- Reject generic “Magazin” matches and same-name streets for a named-store request. Verify street, house number and locality for an explicit address, including common street abbreviations.
- Route named fallback searches to the appropriate provider category, or a broad named-POI search when category is unknown, inside the explicit town. Preserve station-specific and shopping-mall handling.
- Tests reproduce both Europa/Grays screenshot formulations, city-first phrasing, typed walking continuation, rejected foreign results, rejected same-name streets, town-bound fallback, exact addresses and transit. All eleven suites and syntax checks pass. Real provider/store validation remains separate.


## 2026-11-01 — Backend v135 + frontend 1.0.100

- Reproduce the missing Zani destination in the live UI using a public origin.
- Replace the single-town gate with ranked town candidates; broaden restaurant POI search to catering and rely on the verified spatial search area when town labels vary.
- Replace the two-domain address consensus gate with ranked address evidence, map house/street/locality verification and normal ambiguity choices.
- Request bounded page text as well as highlights to retrieve addresses that snippets omit. Add count/status diagnostics without query, origin, keys or page contents.
- Automated suites pass; live post-deployment validation is pending.


## 2026-11-01 — Backend v136, frontend 1.0.100 unchanged

- Live v135 tracing confirmed: the web request succeeded and supplied address candidates, but no house-level map match was usable.
- For towns explicitly resolved to Great Britain, query the public FSA establishment directory by business name and town to obtain the named business address and recorded coordinates when the general geocoder omits it. No business/location names are hardcoded.
- Do not expose ratings or other unrelated fields. Directory failures remain isolated and existing named-POI/web resolution continues. This directory covers UK food establishments; it is not worldwide coverage.
- Add fixture coverage for a directory result and its coordinate/source mapping. Live validation pending deployment.
