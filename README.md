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

## Work in progress — backend v150 / frontend 1.0.115 (2026-11-02)

- Wikipedia summaries for explicit factual questions and known destinations, displayed in a dedicated assistant overlay with source attribution and optional photo.
- Plan route action uses verified article coordinates when available; country-only selections ask for a specific destination.
- Accommodation category discovery expanded to hotels, guesthouses, motels, hostels and mapped holiday units, with tourist-centre preference for city searches unless another area is specified.
- Optional accommodation search is offered after a route result originating from the encyclopedia flow.
- Availability, rates and Airbnb inventories are **not** verified; international mixed-mode live itinerary coverage is **not** complete. Never invent departures or accommodation offers.
- Keep previously phone-validated navigation intact. Existing unit test failures still need investigation.

## Backend v147 — verify destinations before transport choices (2026-11-01)

For an explicit journey request, resolve and verify destination coordinates before showing travel modes. Official TfL records confirm rail/tube stations; named landmarks use map provider evidence and popular-name aliases such as Arsenal Stadium → Emirates Stadium, London (no hardcoded coordinates). Reject unrelated long-distance names and unverified landmarks rather than routing blindly. Return straight-line distance so the existing frontend hides the walking mode on journeys over 3 km. The existing frontend 1.0.114 remains unchanged. Added mocked location regression and live Arsenal probes. The unrelated legacy Brave Search assertion remains known; phone validation is still required.

## Frontend 1.0.114 — refresh departures without restarting the conversation (2026-11-01)

The selected public transport destination is retained as verified coordinates when refreshing departure options. Refresh obtains a current GPS origin and sends both as structured fields to the existing transit endpoint; it no longer restarts the destination prompt. Journeys whose boarding departure cannot be reached using the provider's walk-to-stop estimate plus the safety margin are filtered before display. The selected journey panel no longer offers a generic walking retry when the departure is too late: a map-based walking route action is visible only for a verified access route. Frontend-only change; existing 1.0.113 selection dialog remains. Added targeted transit refresh regression tests to GitHub Actions. Android Chrome verification remains outstanding.

## Frontend 1.0.113 — native selection dialog (2026-11-01)

The frontend now uses a native HTML dialog for long transport-mode and destination-choice lists. Each response renders one direct first-tap trigger; option rows are created inside the dialog, not moved from the chat after a MutationObserver callback. Up to eight mapped named-place choices are visible within a scrollable modal. The legacy table observer remains only for other long panels. The modal closes via X, Escape or selecting a choice, with preserved chat context, ten languages and fixed bottom navigation. Backend unchanged. New isolated modal test and travel-mode handler regressions run before the pre-existing general test suite (whose Brave/news assertion is a separate known issue). Physical Android Chrome verification remains necessary.


## Frontend 1.0.112 — dialoguri generale pentru opțiuni și liste

Listele de opțiuni care nu încap confortabil în conversație sunt mutate într-un dialog suprapus cu închidere și revenire. Se păstrează elementele interactive originale și bara inferioară. Stilurile roșii din 1.0.111 rămân incluse. Testare vizuală pe telefon necesară.

## v1.0.111 — matching red action buttons (2026-11-01)

Home buttons across views and the expandable Selected transport summary now use the exact red gradient, border and shadow from the Quick selections button. Home and Quick selections share equal-width layout and aligned heights. No backend or route logic changes.

## UI styling update — frontend 1.0.110 (2026-11-01)
Home buttons in all views match Quick Selections gradient, equal-width paired actions sized to longest label; selected transport details in the route map use the same visible gradient. No route or backend logic changed.

# myPocket AI — backend v146 + frontend v1.0.109

## Named geographic places and stations — v145 (2026-11-01)

- A bare geographical district ("West Dulwich") is resolved as an exact mapped area before generic business lookup. Never return an unrelated nearby hotel merely because its name contains "West".
- An explicit station query ("Victoria station" or "London Victoria station") consults TfL's verified station records rather than categorizing a station as a hotel or business. Verified TfL station short names receive their operator-backed rail/underground station label.
- The v144 live diagnostics correctly resolved West Dulwich. TfL provided the short name "Victoria"; v145 fixes the display label. Full v145 live verification is separate from source and fixture testing.
- Regression test `tests_geographic_station_intent.mjs` checks these three inputs, a Decathlon control and no invented results when a district cannot be verified.

## Update — 2026-11-01 (v143 / 1.0.108)

- Chain-name searches such as "Decathlon" return up to eight distinct mapped nearby branches when multiple locations are available. The first four are visible; "Show more locations" reveals the rest, with straight-line GPS distances where available. A specific location qualifier such as "Lakeside" is still prioritized.
- Public-transport journeys retain the original POI and expose a final-mile walking action from the **last vehicle's alighting stop** to that POI, using verified stop and destination coordinates. This is an on-demand map route, not automatic transit detection or voice navigation.
- Restaurant, café/tea-room and local grocery searches use distinct provider categories; convenience shops are included alongside supermarkets.
- Verified in live GitHub Actions (backend v143): 7 distinct Decathlon candidates for a generic name, no restaurant/café duplicates in the West Thurrock public-area fixture, grocery sample included Londis and Longdan, and a verified 596-metre final walking route to the Decathlon POI.
- Dedicated destination, final-mile and food-category fixture tests pass. The broader legacy `npm test` still fails on an unrelated Brave/news test assertion; that issue has not been disguised or changed.
- GitHub Actions: `.github/workflows/test-destinations.yml`; focused tests: `npm run test:destinations` and `npm run test:local-categories`.


**Current source versions (2026-11-01):** backend v142; frontend APP.version 1.0.105. The Cloudflare deployment must be checked separately against the live service.

**Destination resolution:** User-entered names are treated as names, even without a business category or town. Geoapify name search is followed by GPS-biased Photon/other map-provider validation; results must have confirmed coordinates. Do not infer that the word "Street" alone makes a station name a street address. For UK public-transport destinations such as "London Liverpool Street", the TfL operator station record is preferred when verified. Frontend mode choices reuse retained destination context.

**Live QA:** GitHub Actions workflow `.github/workflows/test-destinations.yml` checks Decathlon, name-only/area/category variants, and Liverpool Street public-transport continuation against Cloudflare. The 2026-11-01 run 41320428179 confirmed Decathlon via Photon on backend v141 but failed Liverpool Street. The latter caused the v142 TfL `SearchMatch.name` fix; its live effectiveness is not yet confirmed in that earlier run. Use `npm run check`, `npm test` and `npm run test:destinations` for code/fixture validation.

**Repository cleanup:** `SHA256SUMS.txt` was removed because it contained obsolete hashes and was not generated by the current build. Tests, Wrangler configurations, deployment workflow and `VERSION_LOG.md` remain in use. Historical version entries below are retained for reference.

v137 / 1.0.101: explicit named venues with a town are resolved before broad category searches; unrelated business lists are not substituted for an unverified address. Destination candidate choices render as independent in-conversation tables. End-to-end live verification remains pending.

v135: rank town and address candidates instead of requiring one town or matching addresses from two domains. Request address-bearing page text when map POIs are absent; confirm provider coordinates against the selected address. Keep lightweight stage counts for failed lookup diagnosis.

v134: distinguish street/postcode addresses, named points of interest and geographic places. Separate business category from name and locality; support a name plus town without requiring an explicit category. Reject same-name streets for a business request, verify street/house number for an address, and keep the explicit town during named-POI fallback.

v133 / 1.0.99: choose walking, public transport or driving through a three-button table. The selected mode is sent as structured data with the retained destination and a GPS request. Named venues missing from geocoding are checked by simplified name, POIs in the explicit town, then (when Exa is configured) agreeing web addresses verified by map house/street/locality data.

v132: preserve named venues and explicit towns in either wording order, remove conversational option clauses from geocoder queries, retain the destination after walking/public-transport mode replies, and reject unrelated venue/locality matches. Mode clarification now includes public transport.

v131 / 1.0.98: compact step tables and local clock times in the first transport answer; direct map-to-options return; no provider diagnostics in itinerary prose. Keep distinct travel corridors and preserve the returned option with the shortest boarding walk. GPS and provider feasibility checks still apply.

v130 recognizes first-boarding-stop requests as public transport and retains the final destination across a walking-to-stop follow-up. No generic stop name is geocoded globally.

1 November 2026. v129 fixes conversational transit destination parsing: transport mode and comparison instructions cannot replace the requested station; Londra/Londrei is normalized to London while retaining Victoria Station. Official station guards use corrected regex boundaries.

Based on GitHub main 9fca0a7f1e32284250c57322ba4d4cac1b78e778 (backend v127; frontend header v1.0.96). APP and CLIENT_CONFIG version identifiers are synchronized to 1.0.97. Existing station ambiguity handling and Londra→London clarification are retained.

## Destination → transport choice → walk to boarding stop

Enter a public-transport destination. Choose one of the provider's journeys. The app extracts the first vehicle's exact departure stop, stop id, line, indicator and direction where the operator supplies them. If coordinates are missing, it looks up that operator StopPoint id; it never substitutes a geocoded street or a similarly named stop. Missing verified coordinates leave the itinerary visible with an explanation, without invented navigation.

Selection automatically requests a real walking route from fresh device GPS to that boarding point. A validated result opens the existing in-app walking map; use its Follow route in Pocket AI button to start GPS tracking. Google Maps stays optional. The selected transport itinerary is retained in a collapsible section above the walking instructions, including the destination, vehicle legs, line and departure information. Closing the map returns to the selected journey. The same selection action is available for public-transport answers in the personal assistant and full-answer reader. The current module is preserved.

A response to an old selection cannot overwrite a newer choice. Leaving the view, new chat or returning to the list cancels a pending walking request. The returned walking route must be walking-only, retain the exact requested stop coordinates and finish within 120m of them. Fresh walking duration plus the existing five-minute safety margin is checked against the first vehicle departure. An uncatchable departure prompts refreshing the choices; unknown times/durations are disclosed. These are estimates, not a guarantee of catching a service or a continuous live-departure monitor.

The UI/boarding schema is not tied to a city or named station. This update uses the existing configured TfL journey provider and Geoapify pedestrian routing. It does not add worldwide transit timetable coverage, independent disruption/closure verification, spoken turn-by-turn navigation or automatic off-route recalculation. International transit requires an appropriate provider's verified journeys and stop coordinates. Existing GPS following works with the app open.

## Installation and verification

The archive contains complete backend.js and index.js files, documentation and tests. Upload its root files to the same GitHub repository. Keep the existing Wrangler configs, secrets, AI binding, Worker names and deployment workflow. Install backend and frontend together: the new frontend relies on the new boarding_stop metadata. No provider key values are included and no new key is required for this extension.

Run npm test and npm run check. All suites pass, including new tests for exact/duplicate-name boarding stops, operator-id fallback, absent coordinates, selection→walking/map integration, feasible departures, stale response cancellation, GPS/provider failures, preserving the current section, multilingual walking intent and all ten interface languages. Previous repository tests contained an obsolete backend-version expectation and an obsolete automatic module-transfer expectation; these now reflect the current version and the agreed stay-in-section behavior. Validation uses provider and browser/GPS mocks plus generated client JavaScript compilation. There was no live validation of the new release or physical-phone test because these files are prepared for manual upload.

After deployment: search a destination → choose a transport option → verify the boarding stop/line → inspect the walking map → start in-app GPS following → close the map and review the selected itinerary. Test a second option and confirm the stop changes accordingly. If you can no longer catch the departure, refresh the options.

## In-app map following

The primary action is now “Follow route in Pocket AI”, a button that opens the existing route map and starts GPS watching only after an explicit tap. It does not open a new browser tab or the Google Maps application. “Google Maps (external)” remains a separate optional link.

A single live-position marker moves on the map. The map follows fresh GPS fixes; dragging pauses following and Recenter restores it. Approximate remaining distance is projected along the selected route geometry. Poor accuracy, stale GPS and off-route positions are reported instead of displaying precise guidance. Stop, closing the map, switching routes/views or resetting chat clears the GPS watch, timer and marker; late callbacks are ignored. GPS updates are processed locally and may refresh the existing session location cache; they do not issue periodic backend routing requests.

This is foreground visual route following with a direction list. It does not add spoken turn-by-turn instructions, automatic maneuver selection, arrival confirmation, background/screen-off guarantees or automatic rerouting. Browser location permission and a working GPS signal are required. Keep the app open. All new controls and status messages cover all ten UI languages.

## Automatic walking alternatives

Visitors no longer need to know a waypoint. The walking handler calculates balanced/short routes while discovering mapped footways, paths, pedestrian ways and railway/subway access near the destination through Geoapify Places. It considers up to four geographically separated access points and calculates all candidate routes with mode=walk and type=short. This is a bounded search, not an exhaustive alternative-path engine.

A destination-centred 1,100-metre Places search uses two category queries; no neighbourhood centroid or named city is inserted automatically. Explicit no/private access is rejected. Candidates too close to the endpoints, outside the search radius or requiring a large straight-line detour are discarded. Each automatic route must pass within 45 metres of its mapped access point. Large routed detours beyond shortest + max(400m, min(1200m, 45% of shortest)) are removed. A 40-metre corridor comparison suppresses routes sharing at least 88% of both paths; at most three distinct choices are returned, shortest verified first. Map data and provider availability can still yield just one choice; that is reported without inventing another.

Footbridge metadata requires a mapped footway/path/steps/pedestrian bridge and matching bridge geometry from the public OpenStreetMap way API. Its geometry must lie within 20 metres of the returned walking route. OSM bridge geometry is cached for five minutes with a 24-item bound. Route labels use route numbers and differing provider street names. This is geometric evidence, not a live accessibility/closure or traffic guarantee. The app does not claim that an alternative is quieter or safer without such data.

## Choosing a route

The chat reader and map have a compact selector with route distance and duration. The map displays selected geometry in blue, other choices in grey; either the selector or a grey path switches geometry, instructions and navigation together. The old waypoint form is removed. A localized “Find other walking routes” button repeats automatic discovery with the same endpoints and clears old v111 waypoint constraints. Controls support ro/en/fr/de/it/es/pt/nl/ru/pl.

Google Maps URLs retain automatically selected access points and mode=walking. Google Maps can recalculate the route and may show a preview or require a final Start action. Pocket AI supports foreground visual GPS following as described above. Explicit typed via requests remain supported for users who already know a place, but are not required in the walking flow.

## Existing behavior

Preserves shared chat/module handoff, exact hotel-result selection, GPS handling, Open-Meteo weather, four-line answer previews, clickable safe links, reader controls and fixed bottom navigation. Geoapify supplies route geometry, metric distances/times and street instructions; none are generated by the language model. Invalid geometry/units fail safely. Provider failures retain the destination and a retry context.

## Validation and deployment

Run npm test and npm run check. Tests execute the backend, generated client submission and map controls with mocked providers/DOM. New tests cover automatic access discovery, geometric duplicate suppression, same endpoints, private/centroid/snap/detour rejection, bridge geometry verification and partial-provider failure. There is no local physical-phone visual test. Live public-place route validation is performed after deployment; exact device-origin route quality still needs phone QA.

Publish repository-root backend.js, index.js, package.json, tests.mjs, tests_reader.mjs, tests_weather.mjs, tests_routes.mjs, tests_alternatives.mjs, README.md, README_ro.md, VERSION_LOG.md. Keep existing Wrangler configs, secrets, AI binding and deployment workflow. main push deploys both existing Workers.

Primary references: https://apidocs.geoapify.com/docs/routing/ ; https://apidocs.geoapify.com/docs/places/ ; https://wiki.openstreetmap.org/wiki/API_v0.6 ; https://developers.google.com/maps/documentation/urls/get-started . Chafford Hundred's pedestrian connection is documented by its operator: https://www.c2c-online.co.uk/stations/chafford-hundred-station/ . No Lakeside/Mill Lane/Mayflower coordinates or route are hardcoded in the product.


## v146 / 1.0.109 — categorii și afișarea traseelor (2026-11-01)
- Selecții rapide Hărți: Muzee, Parcuri, Grădini zoologice; căutare pe GPS cu raza implicită 5 km.
- Categorie combinată Baruri, ceainării și cafenele, incluzând puburi. Restaurantele rămân separate.
- În lipsa rezultatelor confirmate, nu se inventează obiective. Nu se confundă un furnizor indisponibil cu absența obiectivelor.
- Butoanele Acasă și Selecții rapide sunt uniformizate, iar acțiunile de hartă primesc contrast mai bun; indicațiile pe străzi rămân vizibile în fereastra hărții.
- Validarea pe telefon și căutările live în Cloudflare rămân necesare după publicare.
