# myPocket AI — backend v104 + frontend v1.0.73

31 octombrie 2026. Pachet cumulativ: include modificările v103/v1.0.72 încă neinstalate. Instalează direct acest pachet; nu este necesară instalarea celui anterior.

## Instalare

În rădăcina repository-ului `kokocf-ui/myPocketAi`, înlocuiește `backend.js`, `index.js`, `README.md`, `README_ro.md`, `package.json`, `tests.mjs`; adaugă sau înlocuiește `tests_reader.mjs`. Nu modifica fișierele Wrangler, numele Workers, domeniile, secretele sau binding-ul AI. Publică backend-ul apoi frontend-ul și reîncarcă aplicația. Workflow-ul existent GitHub publică ambele Workers la actualizările main.

Asistentul nu a modificat GitHub și nu a publicat aplicația. Codul pornește de la snapshotul GitHub backend v102 / frontend v1.0.71, peste care sunt incluse toate corecțiile deja pregătite în pachetul v103.

## Corecții noi

- Căutarea web Brave nu mai transformă limba interfeței în țară: română nu mai înseamnă România, engleză nu mai înseamnă UK etc. În lipsa unei țări explicite se trimite `country=ALL`. Limba de căutare/răspuns rămâne selectată separat. O țară cerută explicit este păstrată.
- Întrebările de continuare precum „Dar hotel de 5 stele găsești?” sau „Dar de 4 stele?” păstrează destinația din cererea anterioară a utilizatorului. Un răspuns anterior greșit al asistentului, de exemplu România, nu stabilește destinația.
- Contextul include categoria, destinația, stelele și cererea de zonă centrală. Este transmis separat între frontend și backend, păstrat în conversația salvată și șters la conversație nouă sau schimbare de subiect. Astfel nu depinde exclusiv de prezența cererii inițiale în fereastra limitată de istoric.
- O destinație nouă explicită are prioritate. O cerere nouă completă resetează criteriile omise; o continuare păstrează criteriile relevante. Fără context suficient se cere destinația, fără alegerea unei țări din limbă.
- Întrebările despre distanță, precum „Câți kilometri sunt până în Paris?”, folosesc GPS-ul disponibil ca plecare. Dacă plecarea este scrisă explicit, are prioritate față de GPS. Fără GPS sau plecare se cere orașul/codul poștal.
- Distanța generală este calculată determinist și etichetată clar „în linie dreaptă”. Nu se prezintă ca distanță rutieră. Pentru o cerere explicită rutieră/cu mașina se folosește Geoapify Routing în modul drive; dacă traseul nu poate fi verificat, nu se inventează o distanță.
- Instrucțiunile generale ale modelului separă limba de țară, jurisdicție și punct de plecare. Aceste instrucțiuni nu sunt o garanție pentru toate întrebările libere; cazurile de mai sus au rutare deterministă.

## Modificări incluse din pachetul anterior

- Introducerea începe cu rezultatul, de exemplu „Am găsit 18 hoteluri de 5 stele în Amsterdam, conform datelor de hartă disponibile.” Valorile sunt generate din rezultatele reale. Raza, clasificarea și distanțele sunt explicate la final.
- Destinația explicită are prioritate față de GPS. Destinațiile neidentificate sau ambigue cer clarificare. Zona centrală rămâne o aproximare explicită de 2 km în jurul punctului cartografic returnat de geocodare.
- Filtrul de stele folosește clasificarea disponibilă în datele hărții, nu scorurile recenziilor. Hotelurile fără clasificare sau cu altă clasificare sunt excluse când se cere un număr de stele. Zero rezultate confirmabile nu înseamnă că nu există asemenea hoteluri în oraș.
- Răspunsurile peste 4 rânduri randate au o previzualizare de 4 rânduri și o fereastră de lectură care se deschide automat pentru răspunsurile noi. În istoric deschiderea este manuală.
- Fereastra are pauză/reluare, revenire la început și viteze 0,5× / 1× / 1,5×. Atingerea sau derularea manuală opresc autoderularea; reluarea continuă de la poziția curentă. La final sau în fundal se oprește. Setarea de mișcare redusă începe cu autoderularea oprită.
- Linkurile HTTP/HTTPS sunt apăsabile, iar textul nu este executat ca HTML. Controalele ferestrei sunt traduse în cele 10 limbi existente. Bara de navigare de jos rămâne fixă.
- Fotografiile rămân eliminate. Siglele rămân în dreapta numelui. Nu se adaugă camere, tarife sau rezervări.

## Verificări

`npm test` și `npm run check` au trecut. Testele cu servicii și DOM simulate acoperă:

- New York 3 stele → continuare 5 stele; schimbarea stelelor și orașului; ignorarea unui răspuns anterior greșit despre România;
- păstrarea contextului separat când cererea inițială lipsește din istoric; ștergerea contextului la schimbarea subiectului;
- GPS UK → Paris, plecare explicită prioritară, GPS lipsă, distanță în linie dreaptă vs rutieră și furnizor rutier indisponibil;
- țară globală pentru limba română și păstrarea unei țări cerute explicit;
- regresiile pentru destinații, stele, căutări lângă utilizator, conversație generală și fereastra de lectură.

Testul ferestrei compilează JavaScript-ul extras din HTML-ul generat. Nu s-au făcut teste vizuale în browser/pe telefon sau apeluri cu cheile reale Cloudflare. Parsarea regulilor noi este testată în română și engleză, nu pentru toate formulările posibile din cele 10 limbi.

## Teste recomandate după publicare

1. „Caută hotel de 3 stele în New York”.
2. În aceeași conversație: „Dar hotel de 5 stele găsești?”. Destinația trebuie să rămână New York, chiar dacă nu există clasificări confirmabile în sursă.
3. „Câți kilometri sunt până în Paris?”. Cu GPS trebuie indicată plecarea GPS și tipul distanței; fără GPS trebuie cerută plecarea.
4. Verifică deschiderea, pauza și derularea manuală a unui răspuns lung.
