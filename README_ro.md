# myPocket AI — backend v109 + frontend v1.0.78

Scrierea directă a fost reîncercată și refuzată cu HTTP 403 „Resource not accessible by integration”. Nu s-a modificat GitHub; acest pachet este pentru upload manual.
31 octombrie 2026. Baza verificată: GitHub `main`, commit `3531b287807da5f0b5bdef136c2f740f98048e1f`, backend v108 / frontend 1.0.77. Pachet cumulativ: păstrează meteo, hotelurile, GPS-ul și cititorul cu autoderulare din versiunea anterioară.

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
