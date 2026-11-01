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
