# myPocket AI — backend v113 + frontend v1.0.81

Bază: GitHub main bfda880de066460180bb5f2f566a2c83f405565c (v111 / 1.0.80), 31 octombrie 2026.

## Alternative pietonale automate

Utilizatorul nu mai trebuie să cunoască un punct intermediar. Aplicația calculează variante pietonale și caută automat alei, căi pietonale și acces la gări/metrou în apropierea destinației prin Geoapify Places. Verifică cel mult patru accese separate geografic, calculând rute mode=walk/type=short. Căutarea este limitată, nu garantează toate variantele posibile.

Două cereri Places caută la 1.100 m în jurul destinației. Nu introducem automat centrul unui cartier. Excludem accesele explicit private/interzise și punctele prea apropiate de plecare/destinație ori care presupun ocoluri mari. Geometria calculată trebuie să treacă la maximum 45 m de accesul ales. Se elimină ocolurile mai mari decât traseul minim + max(400m, min(1200m, 45% din minim)). Variantele care împart cel puțin 88% din ambele coridoare, într-o toleranță de 40m, se unifică. Afișăm cel mult trei trasee distincte, începând cu cel mai scurt verificat. Uneori datele/furnizorul oferă o singură variantă; acest lucru este spus explicit.

Metadatele despre pasarelă necesită o cale pietonală marcată ca pod și geometria corespunzătoare din API-ul public OpenStreetMap. Geometria pasarelei trebuie să se regăsească la maximum 20 m de traseul calculat. Cache: cinci minute, cel mult 24 de poduri. Denumirile variantelor folosesc numărul traseului și străzile diferite furnizate de serviciu. Verificarea geometrică nu reprezintă confirmarea în timp real a accesibilității, închiderilor, traficului sau siguranței traversărilor.

## Alegerea simplă

Selectorul afișează distanța și durata fiecărei variante. Pe hartă, traseul ales este albastru, celelalte gri. Selectorul sau atingerea unei linii gri schimbă împreună geometria, indicațiile și navigația. Formularul de punct intermediar a fost eliminat. „Caută alte trasee pietonale” repetă căutarea automată cu aceeași plecare/destinație și șterge constrângerile intermediare rămase din v111. Controalele sunt traduse în toate cele zece limbi.

Linkul Google Maps păstrează accesele alese automat și modul pietonal. Google Maps poate recalcula; poate afișa previzualizarea sau cere pornirea finală. Navigația vocală continuă și recalcularea internă nu sunt implementate. Cererile tastate explicit „prin...” rămân disponibile pentru utilizatorii care cunosc zona, dar nu sunt necesare în fluxul pietonal.

## Păstrat și verificat

Se păstrează conversația comună între module, alegerea exactă a hotelurilor, GPS-ul, prognozele Open-Meteo, previzualizarea pe patru rânduri, linkurile sigure, cititorul și navigația inferioară fixă. Geometria, străzile, distanțele și duratele provin din Geoapify, fără generare de trasee de către modelul lingvistic. Erorile păstrează destinația pentru reîncercare.

npm test și npm run check verifică backendul și codul clientului cu furnizori/DOM simulate, inclusiv descoperirea automată, suprapunerea traseelor, aceleași capete, respingerea acceselor private/centrelor de cartier/ocolurilor, verificarea pasarelei și eșecurile parțiale. Nu există test vizual pe telefon în mediul local. Verificarea reală între locuri publice urmează publicării; traseul de la poziția dispozitivului necesită testarea pe telefon.

Fișierele se publică în rădăcina repository-ului; se păstrează configurațiile Wrangler, secretele și workflow-ul existent. Nu există coordonate sau trasee Lakeside/Mill Lane/Mayflower codificate în produs.

Documentație: https://apidocs.geoapify.com/docs/routing/ ; https://apidocs.geoapify.com/docs/places/ ; https://wiki.openstreetmap.org/wiki/API_v0.6 ; https://developers.google.com/maps/documentation/urls/get-started . Legătura pietonală a gării Chafford Hundred este documentată de operator: https://www.c2c-online.co.uk/stations/chafford-hundred-station/ .
