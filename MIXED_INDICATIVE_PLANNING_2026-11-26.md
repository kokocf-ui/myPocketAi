# Deplasare spre… / Transport mixt — orientare și bilete

## Cererea actuală
Utilizatorul a spus explicit **„Încă nu”** publicării/APK-ului și a cerut investigarea separată a Transportului mixt: variante de la GPS la destinație, cu mijloacele găsite, în stilul orientativ Rome2Rio; fără condiția locurilor libere confirmate; linkuri pentru bilete pe fiecare segment tren/autocar/avion. **Niciun deploy sau APK nou în această etapă.**

## Audit și cauze constatate în cod
1. Confirmarea stocului de locuri nu era o condiție generală a motorului. `verified` desemnează în principal orarul, punctele și continuitatea unei conexiuni — nu o rezervare. Nu s-au dezactivat verificările geografice și nu s-au inventat orare pentru a simula acoperire universală.
2. Descoperirea independentă de zboruri și pagini ale operatorilor era limitată la ramura internațională. Unele răspunsuri reușite pentru tren/MOTIS/TransCAPI omiteau rezultatele terestre orientative. Ramurile românești și răspunsul final TfL puteau omite complet suplimentele.
3. Originea GPS fără etichetă geografică ajungea ca textul `GPS` în descoperirea operatorilor; nu reprezenta o localitate validă pentru căutare.
4. Selectarea unui itinerar mixt cu stație geolocalizată pornea verificarea accesului pietonal și putea afișa o eroare în locul detaliilor. Aceasta nu trebuie să fie o condiție pentru consultarea unei variante orientative.
5. Linkurile erau frecvent ascunse în numele operatorilor; unele normalizări pierdeau URL-uri furnizate de sursă. La revenire din detaliile unui traseu, alternativele de zbor/autocar puteau dispărea, fiind refăcută numai lista programată.

## Implementare
- `mixed_indicative_search.mjs`: serviciu comun, independent pentru pagini de operatori terestri și zboruri; folosește numai integrările/cheile existente. Caută și intern (terestru >=30 km, aerian >=150 km ori internațional), nu numai peste graniță. Nu se cere dovada unui loc liber, preț complet sau rezervare pentru păstrarea opțiunii.
- Descoperirile pornesc concomitent; bugetele pentru suplimente sunt limitate (aerian 25 s, terestru 20 s, completare aeroporturi 8,5 s). O completare nereușită nu șterge candidatul original. Nu se promite că întreaga căutare, inclusiv graful de orare existent, se termină întotdeauna în aceste durate.
- Backend: suplimente memoizate o dată per cerere mixtă și păstrate în răspunsurile relevante din România, TransCAPI, MOTIS, TfL și fallbackurile fără conexiune completă. `seat_confirmation_required:false` și `planning_scope:indicative_multimodal` separă explicit orientarea de cumpărare. Transportul public național independent nu activează aceste descoperiri noi.
- `mixed_ground_operator_discovery.mjs`: dacă originea este numai GPS, rezolvă orașul prin geocodare inversă înaintea căutării de operatori. Nu trimite adresa/GPS-ul precis către motorul web; acesta primește localități. Fără chei de descoperire, nu pornește inutil geocodarea suplimentară.
- `transport_ticket_links.mjs`: destinații HTTPS sigure pentru bilete. Prioritate: linkul furnizat de sursă, apoi site oficial cunoscut al operatorului; în lipsa acestora, **căutare externă etichetată explicit** pe Omio, nu ofertă sau deep-link inventat. Linkurile publice cunoscute nu au fost testate live din sandbox.
- URL-urile explicite sunt păstrate prin normalizările TransCAPI/Bilo/MOTIS, adaptorul grafului mixt și compactarea segmentelor către/de la aeroporturi.
- UI: origine→destinație vizibilă, notă orientativă, linkuri **„Bilete și rezervare”** pentru segmentele relevante (sau „Caută bilete” pentru căutare externă), avertizare că data, prețul și locurile se verifică pe site. Flight legs și legăturile tren/autocar din transferuri au aceleași acțiuni.
- Selectarea traseului mixt deschide imediat etapele, fără GPS/apel suplimentar și fără a depinde de verificarea accesului. Harta/navigarea până la îmbarcare sunt acțiuni separate, când stația este identificată. Navigarea existentă nu este înlocuită cu o linie inventată.
- Back din detalii reface lista mixtă completă: rutele programate + operatorii orientativi + zborurile.

## Contractul rămas deliberat corect
Un orar din sursă nu este un bilet disponibil. O pagină de rută poate justifica o variantă orientativă chiar fără orar confirmat, dar nu dovedește transferul în aceeași zi. Segmentele lipsă de la GPS la terminal sau de la aeroport la adresa finală sunt păstrate ca porțiuni de verificat, nu declarate complete. O cursă anulată sau o conexiune fizic imposibilă nu este promovată ca itinerar programat valid.

Nu este o integrare cu Rome2Rio și nu se pretinde acoperirea lui globală. Fără date de la furnizorii existenți, Eva nu poate construi în mod onest toate variantele pentru orice destinație. Nicio cheie, licență, sursă comercială ori bază nouă de orare nu a fost activată. Nu există cumpărare/rezervare automată în aplicație.

## Verificări executate
- **26 comenzi `tests_mixed*.mjs` non-browser: PASS**, inclusiv noul scenariu `tests_mixed_indicative_planning.mjs`.
- `npm run test:mixed-orientation`: **11 comenzi PASS** (subset reproductibil al auditului mixt + graful multimodal).
- `npm run test:transit-audit`: **19 comenzi PASS**; `npm run test:eva-farewell`: **6 comenzi PASS**.
- `npm run check`: PASS; frontend/backend Wrangler **dry-run** PASS, nu publicare.
- Test Worker simulat: rută internă Manchester→Lancaster, tren programat reușit + pagină FlixBus fără orar/locuri/preț confirmate; ambele păstrate. Sursa aeriană internă de distanță lungă, eșec de completare transfer și rezolvare localitate GPS verificate separat.
- **Browser real pe bundle frontend de producție, 360/393/430 px: PASS**. Tren+autocar+avion coexistă; selecția detaliilor nu pornește alt apel; linkuri per segment; acces/egres aeroport lipsă marcate; Back păstrează toate alternativele. Providerii sunt simulați, nu test fizic Android.
- Harnessurile vechi au fost adaptate la extragerea funcțiilor în serviciul comun, la dependențele explicite ale VM și la noua etichetă de bilete; nu au fost eliminate aserțiunile de independență, disponibilitate a opțiunilor sau interdicția inventării transferurilor.
- Snapshot Android regenerat: **6,990,711 B < 8,000,000 B**, fișier generat ignorat; nu APK semnat.

## Livrare / continuare
Modificări numai pe ramura curentă, fără PR/merge/deploy/build semnat. Ultima livrare rămâne APK501884/backendv183. Refuzul temporar de publicare rămâne în vigoare; nu se repetă automat solicitarea de deploy la finalul etapei. Când utilizatorul autorizează explicit, toate etapele locale Maps/transport/Eva/Transport mixt trebuie incluse împreună într-un APK >501884 cu aceeași cheie permanentă. Routerul GTFS separat necesită propriul acord/operațiune dacă se dorește publicarea modificărilor sale.
