# Eva — răspuns fără legătură la despărțire, 26 noiembrie 2026

## Dovada utilizatorului
Patru capturi `Screenshot_20261126_152{631,635,639,643}_ai_mypocket_mobile_MainActivity.jpg`, atașate în conversație și salvate de platformă în `/tmp/arena-coding-uploads/` (NU copiate în Git).

Mesaj vizibil: **„Bine, ne auzim mai târziu”**. Răspuns afișat după el: „Sunt încântată să te ajut cu informația ta despre surse primare și secundare…”; cititorul complet confirmă mai multe paragrafe necerute, inclusiv „first-hand account”. Durată afișată: 8,3 s. În partea superioară este vizibilă întrebarea anterioară despre vremea din Oradea. Nu se presupune un istoric complet din această porțiune.

## Constatare reproductibilă
Clasificatorul Eva anterior recunoștea `ne auzim…` numai la începutul propoziției și nu recunoștea fraza completă cu prefixul `Bine,`. Nici clasificatorul social general nu acoperea fraza. Ea putea ajunge în fluxul general, fără contractul scurt pentru despărțire. Codul client are deja blocare a trimiterilor concomitente și verificare de generație a conversației; capturile nu demonstrează că o cerere de rețea a fost asociată greșit. Nu se pretinde că știm raționamentul intern al modelului live sau întregul payload din incident.

## Corecții
- Modul comun `eva_farewell.mjs`: identificare a întregii formulări, cu prefixe uzuale și adresare Eva; nu simplă căutare a cuvintelor `ne auzim` oriunde în text. Exemple cu sarcini ulterioare, citate de tradus/explicat sau întâlniri formulate ca întrebare nu sunt interceptate.
- `classifyEvaTurn` folosește act separat `farewell`, numai în Asistent, fără a transforma despărțirea în cerere de închidere a aplicației.
- Backendul nu transmite istoricul vechilor teme modelului la o despărțire. Instrucțiunea cere răspuns scurt, firesc, fără întrebări sau teme reluate. Răspunsurile AI naturale și variate sunt păstrate dacă trec verificarea.
- Verificarea se aplică întregului răspuns, înaintea trunchierii: replică scurtă de despărțire, nu eseu. Răspunsul nerelevant/lung ori indisponibilitatea modelului duc la o încheiere sigură localizată. Nu se declară că filtrul este un verificator semantic universal.
- Clientul folosește același detector pentru conversație/fără GPS și nu trimite istoricul la acest act. Include aceeași protecție a textului afișat, inclusiv dacă un server mai vechi întoarce exact genul de răspuns necerut din captură.
- Celelalte întrebări și fluxurile Maps/Hoteluri rămân separate. Nu este schimbat mecanismul general de asociere a cererilor fără dovadă a unei defecțiuni acolo.

## Verificări
- `npm run test:eva-farewell`: PASS (6 comenzi), inclusiv fraza exactă, variante cu prefix, adresare, mai multe limbi, exemple negative, model care întoarce textul greșit, răspuns AI natural păstrat, excepție de provider, niciun apel la provideri de hartă/meteo/căutare.
- `npm run test:conversation`: PASS (11 comenzi existente).
- `npm run test:transit-audit`: PASS (19 comenzi, schimbările anterioare păstrate).
- Test pe bundle frontend de producție `tests_eva_farewell_browser.mjs`: PASS 360/393/430 px. Istoric anterior meteo și contexte vechi setate deliberat; server simulat întoarce textul despre surse; în mesajul salvat/afișat apare numai despărțirea. Fără istoric în cerere, fără contexte vechi meteo/traseu și fără apeluri GPS suplimentare în timpul trimiterii (aplicația poate face apeluri GPS de inițializare înaintea scenariului).
- `npm run check`, dry-run frontend/backend Wrangler: PASS.
- Snapshot Android regenerat: **6,985,618 B < 8,000,000 B**.

## Publicare
**Nu s-a făcut deploy sau build APK semnat.** Utilizatorul a furnizat capturile, nu a răspuns încă solicitării de autorizare a publicării noilor modificări Maps/transport+Eva. Ultima livrare rămâne APK501884 / backendv183. Testele de mai sus sunt locale cu furnizori simulați, nu certificare că incidentul este deja reparat pe telefon. Următoarea livrare trebuie să includă acest fix împreună cu etapa transportului și să aibă versionCode >501884, aceeași cheie permanentă. Actualizarea routerului GTFS este o operație separată neexecutată.
