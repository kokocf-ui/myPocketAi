# Pocket AI — Reguli obligatorii pentru asistentul AI generalist

Data cerinței: 2026-11-02. Stare: specificație aprobată pentru următoarea actualizare; nu reprezintă o funcționalitate implementată.

## Principiu general
Pocket AI trebuie să poată înțelege, cerceta și răspunde la cereri factuale din orice domeniu, fără ca utilizatorul să fie obligat să selecteze o categorie sau să folosească un anumit cuvânt-cheie. Categoriile și „Selecții rapide” sunt scurtături UI, nu restricții de cunoaștere.

Cererile trebuie rezolvate în secțiunea activă, fără transfer automat între ecrane. Asistentul alege singur în fundal căutarea sau instrumentul potrivit. Pentru întrebări obișnuite, explicații, creativitate sau conversație, nu forțează căutarea web inutilă. Pentru fapte recente, programe, evenimente, reglementări și alte informații care se schimbă, caută și verifică sursele, dacă acestea sunt disponibile. Nu inventează rezultate când căutarea eșuează.

## Legislație: regulă globală pentru toate țările
Suportul pentru legislație se aplică tuturor țărilor și jurisdicțiilor, fără listă restrictivă de țări prestabilite. Include, fără limitare, dreptul muncii, circulație, taxe, imigrație, drepturi și obligații, drept civil/comercial/penal, protecția consumatorului și norme administrative.

- Identifică țara indicată de utilizator și, dacă este necesar, statul/regiunea/provincia, nivelul federal/local și data la care se aplică întrebarea. Nu deduce jurisdicția din limba interfeței, naționalitatea presupusă ori răspunsurile anterioare.
- Dacă jurisdicția lipsește și schimbă substanțial răspunsul, pune o singură întrebare de clarificare; altfel menționează explicit presupunerea.
- Prioritizează surse oficiale actuale: portaluri legislative, gazete/monitoare oficiale, instanțe, ministere, autorități de reglementare. Verifică articolul, numărul actului, data publicării, intrării în vigoare, modificării ori abrogării dacă sunt relevante.
- Distinge între legislația în vigoare, proiecte legislative, reguli istorice, interpretări, practici de aplicare și sancțiuni. Nu inventa cuantumuri, articole, excepții sau termene.
- Oferă explicații inteligibile și surse verificabile/linkuri către texte oficiale; semnalează clar ce nu a putut fi confirmat. Nu prezintă informația generală drept consultanță juridică individuală.

## Domenii generaliste, fără limitare la exemple
- Istorie, cultură, geografie, muzee, obiective, evenimente istorice și patrimoniu.
- Filme: titlu, distribuție, gen, anul apariției, disponibilitatea verificabilă, proiecții locale și ore (dacă sunt disponibile).
- Teatru, concerte, spectacole, festivaluri: oraș, perioadă, loc, program, organizator, preț/bilete și pagina oficială atunci când pot fi confirmate.
- Știri și actualitate politică internațională, națională și locală: evenimente politice, alegeri, declarații, instituții, decizii și analize neutre. Verifică data publicării și data evenimentului, compară mai multe surse credibile, separă afirmațiile politice de faptele confirmate și expune perspective relevante fără partizanat, propagandă sau echivalență falsă.
- Rețete culinare din bucătăriile tuturor țărilor: descriere, numărul de porții, ingrediente cu unități și cantități, timp de pregătire, timp de gătire, temperaturi în °C/°F când sunt relevante, ustensile esențiale, instrucțiuni clare, cronologice și verificabile, timpi pentru fiecare etapă, sugestii de servire, înlocuiri și alergeni când sunt relevanți. Pentru o rețetă generală cunoscută nu este obligatorie căutarea web; pentru rețeta unui bucătar, restaurant sau pentru noutăți specifice, verifică sursa.
- Știință, educație, economie, tehnologie, sport, servicii, produse, sănătate și alte subiecte accesibile legitim. Ajustează rigoarea la riscul domeniului.

## Cerințe de cercetare și prezentare
1. Decide semantic dacă cererea necesită date actuale/căutare externă. Nu condiționa căutarea numai de „?” sau o listă închisă de cuvinte; exemple de interogări fără semn de întrebare: „Caută festivaluri în Oradea”, „Codul muncii în Japonia”, „Filme la cinema în Londra”.
2. Folosește motoarele de căutare existente (Exa, Brave, Tavily unde sunt configurate) și servicii specifice domeniului când există, fără să promită o disponibilitate neverificată.
3. Identifică limba răspunsului separat de țară/locație; datele verificate provin din sursele destinației, în limba adecvată.
4. Pentru rezultate sensibile la timp, afișează data verificării, data desfășurării și fusul orar după caz. Nu prezenta programe trecute ca evenimente viitoare.
5. Afișează concise datele esențiale, linkuri de sursă relevante, și, unde există și este permis, imagini/media verificate. Dacă nu există rezultate sau sursele nu sunt concludente, spune precis acest lucru.
6. Refolosește contextul conversației, dar nu schimba ecranul activ și nu transforma automat o căutare de informații într-o cerere de traseu.

## Standard de afișare a duratelor traseelor (toate tipurile de transport)
Duratele se calculează în continuare în unități numerice (secunde/minute) pentru precizie, comparare, alegere de trasee, calculul plecărilor și verificarea fezabilității; se schimbă numai formatarea vizibilă utilizatorului. Aplică aceeași regulă în răspunsurile din backend și în toate ecranele, tabelele cu variante, ferestrele de hartă, traseele pietonale/rutiere și variantele de transport public, inclusiv plimbarea până la prima stație și durata segmentelor, unde se afișează o durată.

- Sub 60 de minute: afișează numai minutele (ex. 45 minute).
- De la 60 de minute la sub 24 de ore: afișează ore și minute (ex. 135 minute → 2 ore 15 minute; 120 minute → 2 ore).
- De la 24 de ore în sus: afișează zile, ore și minute (ex. 1.575 minute → 1 zi 2 ore 15 minute; 2.880 minute → 2 zile).
- Omite componentele cu valoare zero, dar afișează „0 minute” la durata zero. Rotunjește la minute numai la afișare, cu păstrarea unităților interne originale. Folosește singular/plural corect pentru fiecare limbă selectată în aplicație (toate cele zece limbi).
- Formatarea duratei NU schimbă orele de plecare/sosire, timpii de transfer, algoritmul rutelor, sortarea alternativelor, numărul de opțiuni, zonele orare sau API-ul brut. Pentru traversări de fus orar, durata rămâne timpul scurs real, independent de ora locală.
- Verifică expres prezentarea duratelor în backend.js (ex.: ~1088, ~1359–1360, ~1522, ~1532) și frontend index.js (~1755, ~1757, ~2001, ~2114), fără a modifica algoritmii de rutare.

## Probleme deschise — trasee mixte naționale și internaționale (prioritate majoră)
**Stare: NEREZOLVAT / NEIMPLEMENTAT COMPLET la 2026-11-02.** Cele trei variante auto nu reprezintă trei itinerarii multimodale. Nu declara funcția rezolvată până când nu există teste end-to-end cu operatori reali, ore de plecare/legături verificabile și navigație până la adresa finală.

### Ce trebuie să obțină utilizatorul
- Planificare door-to-door de la locația GPS sau de la o adresă dată până la destinația exactă, inclusiv localități din afara Regatului Unit; păstrează secțiunea curentă în Asistent.
- Combină automat segmente de mers pe jos, autobuz, tren/Overground, metrou, tramvai, autocar/microbuz, avion și feribot după caz. Nu limita căutarea la categorii de vehicule sau la țări memorate într-o listă.
- Pentru rute britanice, preferă trenul și Overground, apoi metroul; autobuzul este alternativă sau legătură utilă. Caută ruta cea mai logică și evită devierile inutile.
- Maximum 3–4 itinerarii **reale, distincte, fezabile**, nu duplicări cu denumiri diferite; dacă există doar 1–2 variante verificabile, afișează doar atât. Variantele trebuie să includă ora plecării/sosirii, durata în zile/ore/minute, timpul până la primul vehicul, transferurile, liniile, stațiile de schimb, direcția și mersul final.
- Dacă distanța este peste 5 km, ascunde doar opțiunea de mers pe jos pentru întregul traseu. Segmentele pietonale de acces, transfer și sosire rămân obligatorii în itinerariile mixte.
- Verifică timpii reali de mers și conexiunile, introdu o marjă fezabilă de schimbare a mijlocului de transport, nu alege servicii deja pierdute; respectă zilele și fusurile orare diferite. Nu inventa curse, prețuri, disponibilitate, terminale ori peroane.
- După alegerea unei variante, păstrează exact itinerariul selectat și arată în fereastra suprapusă toți pașii numerotați, harta, navigarea până la îmbarcare, apoi mersul din ultima stație la destinația exactă; „Înapoi” păstrează continuitatea.
- Dacă un serviciu este anulat/inaccesibil, recalculează din poziția actuală și oferă alte variante verificate, fără să reia de la zero întrebările deja rezolvate.
- Dacă nu există acces la orare pentru un segment internațional, marchează explicit partea neverificată și nu o prezenta ca itinerar complet confirmat.

### Blocaje confirmate în sursă, nu presupuneri
- În `backend.js`, ~625–675, fluxul de transport public se bazează pe TfL și conține o întoarcere timpurie pentru o **listă fixă de destinații internaționale**, cu `reason:'international_provider_not_connected'`. Aceasta oferă un mesaj explicativ, nu o rută mixtă.
- Lista de expresii pentru țările externe nu acoperă destinații precum Oradea. Este o limitare de arhitectură, nu un motiv să adăugăm Oradea ca excepție nouă.
- În `backend.js`, ~836–980, alternativele publice sunt construite din răspunsuri TfL la mai multe preferințe; serviciile suplimentare BODS/RTT apar în diagnostice, dar nu sunt integrate într-un planificator de conexiuni interoperatori și internaționale.
- În `index.js`, ~1625–1672, alegerea modului afișează doar mers pe jos / transport public / mașină; modul public trebuie să poată declanșa un planificator multimodal global, fără a crea un ecran separat inutil.
- Codul de afișare a pașilor din frontend există pentru itinerariile TfL, dar trebuie să accepte și un format normalizat cu segmente provenite de la furnizori diferiți.

### Direcția tehnică pentru implementare
1. Un contract comun de date pentru fiecare segment: mod, operator, linie/număr, origine/destinație, lat/lon, fus orar, plecare/sosire, durată, sursă și stare de verificare.
2. Rezolvarea geografică globală a destinației și alegerea providerilor după geografie/servicii (nu după cuvinte-cheie fixe). Verifică existența și dreptul de folosire a unui serviciu/API internațional de planificare; integrarea nu se consideră disponibilă doar pentru că este menționată.
3. Îmbină segmentele verificate în itinerarii complete, validează transferurile și ordonează/deduplichează până la maximum 3–4 variante.
4. Afișează pașii și harta fără transfer automat din Asistent în alt modul. Păstrează traseele rutiere și pietonale existente, precum și funcția de reîmprospătare a plecărilor.

### Teste de acceptare obligatorii
- Grays → West Dulwich: opțiuni reale incluzând c2c + metrou + Southeastern când există o conexiune fezabilă; nu deviere inutilă prin Brixton și nici destinație schimbată.
- Grays → London Victoria Underground: rute reale, oră de îmbarcare posibilă, stație finală corectă, ultima porțiune pietonală până la destinația selectată.
- West Thurrock/Grays → Oradea (România): datele internaționale, avion/tren/autocar după caz, transport local și mersul final, fără inventarea unui orar dacă nu avem provider.
- Orice destinație internațională neenumerată anterior: nu trebuie să fie tratată de TfL ca destinație internă doar pentru că lipsește dintr-o expresie regulată.
- Obiectiv la peste 5 km: opțiunea exclusiv pietonală este ascunsă, dar primul și ultimul segment pietonal rămân în traseul mixt.
- Regresie: 3 variante auto, rutarea locală și dialogurile existente continuă să funcționeze.

## Probleme observate la auditul din 2026-11-02
- backend.js, în zona ~3090–3095: declanșarea cercetării web depinde de semnul întrebării ori de o listă de termeni; comenzi imperative pentru filme/festivaluri/alte teme pot fi ratate.
- backend.js, în zona ~3096: lista de țări explicit recunoscute pentru filtrare nu este globală; trebuie extinsă strategia internațională, nu doar lista.
- backend.js, în zona ~3231: sursele sunt ținute în metadata și ascunse implicit; pentru legislație și evenimente sursele verificabile trebuie să poată fi accesate clar de utilizator.
- Frontend index.js: auditul a identificat un bug separat al expresiilor regulate insuficient escapate în HTML-ul generat, cu dispariția literei „s” în prezentări și transcriere. Corecția este programată pentru următorul update; nu se modifică acum codul.

## Criterii de acceptare pentru următoarele teste
- „Ce prevede Codul muncii în Japonia despre concediu?” -> determină jurisdicția, găsește surse oficiale și semnalează necunoscutele.
- „Reguli pentru șoferi în Germania” -> caută regulile actuale fără a cere schimbarea modulului.
- „Caută festivaluri în Oradea luna viitoare” -> caută chiar fără semn de întrebare, verifică datele și oferă surse.
- „Filme la cinema în Londra în weekend” -> diferențiază programul actual de informațiile generale despre filme.
- „Povestește-mi istoria Oradei” -> prezentare corectă, lizibilă, fără detalii fabricate.
- „Știri politice din Canada din ultima săptămână” -> rezumat neutru, evenimente și date clare, surse și fapte verificate.
- „Dă-mi o rețetă de sarmale pentru 6 persoane” -> ingredientele și cantitățile, pașii, timpii, temperatura și porțiile, fără a forța un apel web inutil.
- „Traseu de 45 de minute” -> 45 minute; „Traseu de 135 de minute” -> 2 ore 15 minute; „Traseu de 1.575 de minute” -> 1 zi 2 ore 15 minute. Verificare în RO, EN și celelalte opt limbi.
- Cererile de traseu care afișează deja trei opțiuni trebuie să continue să funcționeze identic după introducerea regulilor de cercetare.

## Limite oneste
„Din orice domeniu” înseamnă domenii legale și informații accesibile în mod legitim, nu promisiunea că orice informație există sau este disponibilă în timp real. Informațiile neverificate se marchează clar, iar aplicația nu inventează acces, orare, acte normative ori prețuri.
