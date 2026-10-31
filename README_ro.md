# myPocket AI — backend v111 + frontend v1.0.80

31 octombrie 2026. Baza verificată: GitHub main `b3880eb61a8c56b3bc2ad036497edde143cc8a63` (v110 / 1.0.79).

## Mai multe trasee pietonale

Pentru aceeași plecare și destinație se cer variante Geoapify `balanced` și `short`. Geometriile identice (rotunjite la cinci zecimale, fără coordonate consecutive repetate) sunt afișate o singură dată. Un punct de trecere adaugă a treia cerere, cu trei puncte și `intermediate_waypoint_mode=pass_through`. Fiecare variantă păstrează propriile distanțe, durate, coordonate și indicații. O variantă eșuată nu anulează celelalte trasee verificate; eșecul variantei prin punctul solicitat este comunicat expres.

Selectorul compact apare în conversație, cititor și hartă. Alegerea schimbă împreună harta, străzile și linkul de navigație. „Compară printr-un punct…” acceptă nume, adresă sau cod poștal și păstrează destinația și plecarea. Se poate scrie și „Prin Chafford Hundred” sau cererea completă „Traseu pietonal până la Lakeside shopping centre prin Chafford Hundred”. Formularul funcționează în toate cele zece limbi. Un punct ambiguu solicită alegerea fără a pierde Lakeside. Centrul cartografic al unui cartier este un punct de referință, nu o intrare pietonală verificată.

Linkul Google Maps include punctul de trecere, coordonatele destinației și modul pietonal. Google Maps poate recalcula și nu garantează geometria identică. Nu se pretinde măsurarea traficului pietonal, confortului traversărilor sau liniștii traseului. Nu se folosesc parametri nedocumentați ori opțiuni de trafic/evitare dedicate mașinilor pentru mersul pe jos. Dacă rezultă o singură geometrie distinctă, răspunsul precizează asta. Expresiile cunoscute despre scări/treceri rămase în engleză sunt normalizate în română fără a inventa urcare/coborâre sau modifica numele străzilor.

Testele automate backend/client și verificarea sintaxei JavaScript generat trec. Sunt acoperite variante distincte/duplicate, eșecuri parțiale, puncte ambigue și continuări, păstrarea destinației, schimbarea sincronizată hartă/străzi/navigație și etichetele în zece limbi. Verificarea furnizorului real și cea pe telefon sunt consemnate separat după publicare.

## Corecție v110

Validarea rutelor acceptă unități metrice fără diferență între majuscule/minuscule (`meters`, `Meters`, `METERS`); milele sunt în continuare respinse. v109 compara strict cu `Meters`, deși exemplul real al furnizorului folosește `meters`. Testele reproduc acum răspunsul cu litere mici.

După o eroare, cererea rămâne în starea de reîncercare. „Lakeside shopping center Grays” înlocuiește numele anterior când utilizatorul repetă destinația completă; nu concatenează două copii ale numelui și nu trimite continuarea la modelul general. Localitatea de după „shopping center” este tratată ca precizare geografică, nu ca parte obligatorie a denumirii centrului comercial. Sunt acceptate și continuările provenite dintr-un context v109 cu `pending: null`.

În caz de eșec, API-ul returnează un cod de diagnostic limitat și, dacă există, statusul HTTP al furnizorului; nu expune cheia sau URL-ul cererii. Testele verifică expres că o completare a destinației după un eșec nu apelează modelul lingvistic și nu generează indicații/estimări.

Publicarea directă în GitHub este autorizată. Verificarea pe telefon a traseului rămâne necesară după publicare. Pentru retestare este recomandată o conversație nouă, ca indicațiile neverificate generate anterior să nu fie confundate cu traseul corectat.

## Traseu pietonal

Butonul din selecții rapide pornește acum aceeași conversație folosită pentru cererile tastate. Intentul pietonal este transmis explicit, inclusiv pentru interfața în altă limbă. Formularea veche „traseu exclusiv pietonal” este recunoscută; menționarea mijloacelor de transport interzise nu mai activează transportul public.

„Folosește locația mea” continuă cererea de traseu existentă. Păstrează destinația și profilul pietonal, solicitând GPS doar dacă nu sunt disponibile coordonate valide. Confirmarea nu este înlocuită cu un simplu răspuns despre localizarea telefonului. Există recuperare din istoricul mesajelor utilizatorului când lipsește contextul structurat; răspunsurile asistentului nu sunt folosite ca dovadă de localizare.

Pentru un centru comercial fără localitate/țară explicită, căutarea încearcă Geoapify Places într-o rază de 25 km de GPS, cu filtrare după nume și categorie. Căutarea geografică alternativă este limitată la aceeași zonă. Dacă nu identifică destinația, cere localitatea/țara; nu înlocuiește Lakeside din apropiere cu un omonim din SUA. O țară/localitate explicită are prioritate și permite căutarea la distanță. Căutarea locală nu garantează că toate intrările furnizorului sunt exhaustive.

Indicațiile, străzile, distanțele, timpul și geometria provin din Geoapify. Se solicită limba interfeței și unități metrice. Sunt validate distanța și geometria; unitățile incompatibile sau coordonatele invalide nu produc o linie inventată. Dacă furnizorul nu livrează pași, acest lucru este spus explicit. Sunt afișați cel mult 500 de pași furnizați, fără generarea unor pași lipsă.

## Hartă și navigație

Răspunsul conține indicații text, „Vezi traseul pe hartă” și „Pornește navigația în Google Maps”. În fereastra hărții, traseul și lista de indicații sunt disponibile împreună; lista are derulare proprie și rămâne deasupra barei fixe de navigare. Cititorul răspunsului oferă și el acces la hartă/navigație pentru traseul respectiv.

Navigația se deschide în aplicația Google Maps sau în pagina sa, în modul pietonal pentru un traseu pietonal. Destinația folosește coordonatele selectate. Pentru plecarea GPS, Google Maps utilizează poziția curentă; plecarea explicită este păstrată în link. În funcție de dispozitiv, disponibilitatea locației și distanța față de origine, Google Maps poate afișa previzualizarea traseului și poate necesita apăsarea butonului de pornire. Traseul poate fi recalculat de Google Maps. Aplicația Pocket AI nu implementează încă navigație proprie cu urmărire continuă, anunțuri vocale sau recalculare la abatere.

## Transfer între module

Backend-ul indică modulul corespunzător fluxului pe care l-a executat: Hărți pentru trasee/distanțe/localizare, Turism pentru hoteluri și alte căutări turistice, Asistent pentru răspunsuri generale și meteo. Unele categorii utilitare, precum benzinăriile și parcările, rămân la Hărți.

Frontend-ul mută aceeași conversație în modulul recomandat după răspuns, fără arhivare, resetarea GPS-ului sau schimbarea generației conversației. Nu se decide transferul doar după prezența cuvântului „hotel”/„hartă”: întrebările explicative sunt tratate ca întrebări generale.

Rezultatele POI sunt păstrate pentru selecții ulterioare și în conversațiile arhivate. „Du-mă la al doilea hotel” și „Walking route to hotel 2” folosesc coordonatele rezultatului ales, fără o nouă geocodare a numelui. Din detaliile locației există și buton „Traseu pietonal”. Recunoașterea mesajelor tastate este testată în principal în română/engleză; acțiunile și noile etichete au texte în toate cele 10 limbi.

## Instalare și validare

Încarcă în rădăcina repository-ului toate fișierele pachetului: `backend.js`, `index.js`, `package.json`, `tests.mjs`, `tests_reader.mjs`, `tests_weather.mjs`, `tests_routes.mjs`, `README.md`, `README_ro.md`, `VERSION_LOG.md`, `SHA256SUMS.txt`. Nu încărca arhiva ZIP ca înlocuitor pentru aceste fișiere. Păstrează configurațiile Wrangler, secretele, binding-ul AI și workflow-ul existent. Actualizarea ramurii `main` declanșează publicarea Workers conform workflow-ului.

În GitHub lipseau `tests_reader.mjs` și `tests_weather.mjs`, deși erau menționate în `npm test`; sunt incluse împreună cu noile teste de traseu.

`npm test` și `npm run check` trec. Testele folosesc servicii și DOM simulate, execută funcțiile reale de trimitere a mesajelor, schimbare a modulului, deschidere a hărții, selecție din detalii și construire a linkurilor de navigație. Scriptul client generat este compilat. Cheile Geoapify Cloudflare nu sunt disponibile local: noua căutare Lakeside, pașii reali și lansarea Google Maps trebuie verificate pe telefon după publicare. Regresiile meteo v108 sunt păstrate; meteo a fost confirmat de utilizator pe telefon înaintea acestei modificări.

## Test pe telefon

1. Din Asistent: „Arată-mi un traseu pietonal până la Lakeside shopping centre”. Trebuie să treacă la Hărți, să păstreze GPS-ul și să calculeze traseul sau să ceară o clarificare precisă a destinației.
2. Dacă este cerută plecarea: „Folosește locația mea”. Trebuie să continue traseul. Dacă destinația nu este sigură, completează „Grays, UK”.
3. Deschide harta: verifică linia și indicațiile pe străzi. Apasă navigația și verifică destinația și modul pietonal în Google Maps.
4. Din Hărți: „Caută hoteluri în apropierea mea”. Trebuie să treacă la Turism. „Du-mă la al doilea hotel” trebuie să revină la Hărți și să păstreze hotelul ales.
5. „Ce înseamnă clasificarea de patru stele?” trebuie să revină la Asistent fără să șteargă mesajele.
6. Repetă testele meteo Oradea → Grays → Barcelona și mâine → poimâine.

Documentație: https://apidocs.geoapify.com/docs/routing/ · https://apidocs.geoapify.com/docs/places/ · https://developers.google.com/maps/documentation/urls/get-started

Meteo păstrează Open-Meteo și secretul opțional `OPEN_METEO_API_KEY`. Serviciul public este pentru utilizare necomercială; pentru utilizare comercială se aplică termenii furnizorului: https://open-meteo.com/en/terms. Datele sunt atribuite Open-Meteo, CC BY 4.0. Fotografii de hotel și tarife live nu sunt implementate.
