# Explicații pe exercițiul concret — 26 noiembrie 2026

## Cererea

Mai puțină teorie generală fără legătură cu problema și explicații mult mai clare în „Rezolvă pas cu pas” și „Metoda de lucru”. Schimbarea privește tutorul și ferestrele de lucru, nu rescrierea programelor sau certificarea materialelor. Fără PR, merge, deploy ori APK în această etapă.

## Cauze identificate

- Promptul de metodă la Matematică interzicea explicit rezolvarea numerică a exercițiului dat.
- La Științe, metoda cerea definiții și reguli generale, în locul aplicării lor.
- Fereastra națională trimitea teoria întregii lecții și un exemplu rezolvat diferit de cerința aleasă.
- Backendul de Istorie/Geografie cerea o lecție completă chiar și pentru corectare.
- Limita de chat de 4.000 caractere respingea întrebarea împreună cu o rezolvare mai amplă; Literatura putea tăia finalul promptului, unde se afla sarcina efectivă.

## Implementare

`education_exercise_tutor.mjs` este contractul comun, serializat explicit în browser și folosit de backend prin `education_lesson_depth.mjs`:

1. Ce dă și ce cere exact problema, pe scurt.
2. De ce metoda aleasă se potrivește datelor/textului/codului furnizat.
3. Pași numerotați cu operația sau dovada concretă, justificarea simplă și rezultatul intermediar.
4. Răspuns identificabil și verificare efectivă pe cerința inițială.
5. Cel mult o greșeală frecventă relevantă. Fără al doilea exercițiu inventat, citate inventate sau teorie de umplutură.

Metoda demonstrează aplicarea până la rezultat, nu doar o rețetă. Corectarea folosește răspunsul real al elevului, caută primul pas greșit/lipsă și nu inventează pașii elevului dacă acesta a dat doar rezultatul. La date lipsă se cer exact datele necesare, fără a fabrica o soluție.

Integrare: Matematică, Științe, Informatică, Literatură, Istorie/Geografie, admitere și remedierea greșelilor din examene. La examenele din alte domenii se folosește o rută educațională generică dedicată, nu chatul obișnuit. Lecțiile complete, eseurile și testele fără răspunsuri rămân activități distincte.

Cele opt ferestre naționale au acum și „Rezolvă pas cu pas”, și „Explică metoda pe acest exercițiu”. Doar corectarea cere o încercare. Contextul AI conține problema, nivelul, încercarea când se corectează și reperul acelei cerințe, nu teoria și exemplul întregii lecții. Ciornele, anularea și reperul offline rămân disponibile.

Matematica locală: metoda aritmetică și cea algebrică din UI folosesc calculele deterministe ale exercițiului, inclusiv rezultatele intermediare și verificarea; clasele primare păstrează explicațiile adaptate vârstei. Motoarele numerice specializate existente de Științe nu au fost rescrise în această etapă și unele răspunsuri locale rămân compacte. Referința offline generală este etichetată separat, nu prezentată ca rezolvarea AI a unei probleme proprii.

Limite: intrările `learning` și `education_study` acceptă maximum 32.000 caractere; chatul obișnuit păstrează 4.000. Literatura păstrează până la 31.000 pentru activitățile de exercițiu. Bugetul obișnuit al răspunsurilor de exercițiu este 3.200 tokenuri; timpul de așteptare la Matematică este 45 s.

## O singură extindere controlată

`educationTutorResponse` poate solicita cel mult o reformulare dacă răspunsul este foarte scurt (sub 180 caractere) sau lung, dar fără minimum doi pași numerotați (peste 900 caractere). Unele formulări de date lipsă sunt exceptate. Dacă extensia eșuează sau rămâne slab structurată, se păstrează primul răspuns. Nu se reîncearcă după eșecul primei generări.

Aceasta este o euristică de structură, **nu verificare de corectitudine sau de calitate pedagogică**. Nu identifică toate formele de teorie generică și nici toate limbile sau clarificările legitime. Poate adăuga o generare, deci latență și consum AI. Testele nu demonstrează calitatea răspunsurilor unui model live.

## Verificări executate

- `npm run check`: trecut.
- `tests_education_exercise_tutor.mjs`: trecut; contractele pentru discipline/moduri, 12 trasee API cu AI simulat, păstrarea enunțului și încercării lungi, o singură extindere, eșecuri și limite.
- 26 comenzi de regresie focalizată pentru pachete, Științe, Astronomie, Matematică, examene, Literatură, traducerea surselor și serviciul separat: trecute după actualizarea aserțiunilor care cereau vechea metodă exclusiv generală.
- `tests_education_workspace_browser.mjs`, Chromium real, 390×844, pe bundle-ul nou Wrangler: trecut. Verifică cele opt materii, mesajul și activitatea fiecărui buton, lipsa teoriei/exemplului fără legătură, metoda fără încercare, ciorne, erori API și traseele universitare/examene existente. API-ul AI este simulat controlat.
- Dry-run Wrangler frontend și backend: trecute; garda numelor funcțiilor browser: trecută. HTML bundle: **7.328.835 caractere / 7.571.254 octeți UTF-8**, sub 8.000.000 octeți.
- Verificarea extinsă `test:ui`: 100 din cele 102 comenzi au trecut, rulând separat și comenzile de după prima oprire. Două eșecuri **preexistente**, reproduse identic pe copia curată a commitului anterior `ee71518`: `tests_education_ui_locales.mjs` (cheia de examene „✍️ Teste cu rezolvare scrisă” nu are traducere statică în engleză) și `tests_extra_tools_workspace.mjs` (așteaptă 24 materii, catalogul are 25). Nu sunt declarate rezolvate; depanarea traducerii rămâne amânată conform cererii utilizatorului.

Nu s-au apelat modele AI live, nu s-a verificat un APK instalat și nu s-a publicat nimic. Rămân necesare verificarea pedagogică pe răspunsuri reale și revizia academică a conținutului.
