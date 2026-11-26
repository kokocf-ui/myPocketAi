# Transport mixt: refolosirea rutării locale și variante fără aeroport

## Cerința corectată de utilizator

Nu este suficient un ecran cu două zboruri și avertismente. Legăturile de la
plecare și de la sosire trebuie căutate cu infrastructura locală deja existentă.
Trenurile și autocarele trebuie căutate independent, fără aeroport obligatoriu.

**Stare:** modificări doar pe ramura curentă; fără deploy, fără APK nou.
Producția rămâne backend v186 / APK 501886. PR 558 rămâne draft, fără merge.
Acest raport completează `TRANSIT_APK501886_RETEST_FIXES_2026-11-26.md`.

## Probleme concrete găsite

1. Conectorul unui zbor folosea implicit TransCAPI pentru acces și exclusiv
   MOTIS pentru continuare. Nu refolosea selecția normală TfL/UK/urbană din
   backend. Existența motorului local nu implica folosirea lui aici.
2. Graful de compunere includea doar sursele TransCAPI și MOTIS; nu putea folosi
   rezultatul aceleiași căutări locale care funcționa separat în aplicație.
3. Același graf consuma locuri din lista de noduri pe aeroporturi, deși pentru
   această căutare trebuiau prioritizate gări, terminale de autocar și porturi.
4. Adaptorul grafului accepta `arrivalLatLon`, dar nu `arrivalPoint`; unele
   tronsoane reale din fluxul local puteau fi eliminate. Identificatorii lungi
   ai punctelor geografice puteau depăși limita ID-urilor intermediare generate.
5. Descoperirea coridoarelor tren/autocar cerea cheie Brave separată. Cheia Exa
   existentă era folosită doar la paginile directe, nu și la aceste coridoare.
6. Geografia și validările terestre rulau prea mult în serie. Un timeout extern
   putea elimina chiar și dovezi de rute terestre deja primite și validate.
7. Diagnosticarea accesului putea traduce lipsa furnizorului/cota epuizată în
   „nicio legătură înainte de îmbarcare”, fără o verificare de orar concludentă.

## Modificări implementate

### Un singur flux local pentru punctele călătoriei

`mixed_local_planner.mjs` deleagă **în același proces**, fără apel HTTP la Worker,
către handlerul normal al căutării de transport public. Nu copiază o versiune
simplificată de TfL și nu trimite din nou promptul internațional:

- origine/destinație exacte și data solicitată;
- `mixed_journey:false`, `mixed_composition:false`, istoric gol: fără recursie
  în căutarea de zboruri;
- aceeași selecție de furnizori și aceleași verificări geografice ca în fluxul
  obișnuit; pentru alte perechi domestice cu țară identificată, se refolosesc
  porțile registrului național, fără activarea unor țări noi;
- cache numai în memoria căutării curente, pentru aceeași pereche și aceeași
  oră; maximum 12 delegări locale distincte pentru acea căutare;
- nu persistă adrese/GPS și nu pretinde reutilizarea unor căutări vechi de pe
  telefon pentru care nu deține efectiv datele.

Acest flux este conectat la **ambele capete ale zborurilor**, inclusiv la vechiul
endpoint de detalii, și ca sursă locală în graful terestru. O gară, autogară sau
adresă este un punct la fel de valid ca un aeroport, dacă furnizorul îl acoperă.

### Graful terestru nu depinde de avioane

- Nodurile sunt descoperite pentru tren/autobuz-feribot, fără aeroporturi
  introduse obligatoriu în acest graf. Căutarea aeriană rămâne independentă.
- `arrivalPoint` și `arrivalLatLon` sunt acceptate. ID-urile intermediare sunt
  alocate într-un spațiu unic per interogare, nu prin concatenarea unor ID-uri
  geografice foarte lungi și nici prin potrivirea arbitrară a numelor.
- Termen comun de cel mult 18 secunde pentru căutarea pe graf; cererile care nu
  au început nu mai sunt lansate după anulare. Rezultatele deja primite de la
  o sursă sunt păstrate dacă alta întârzie. Contorul raportează apelurile pornite,
  nu toate sarcinile care fuseseră doar planificate.
- Coordonatele, timpii, identitatea transferului și continuitatea rămân validate.
  Nu se inventează mersul pe jos între două stații doar fiindcă sunt apropiate.
  O delegare locală deja pornită poate termina un adaptor care are doar propriul
  timeout; termenul grafului nu este promisiunea anulării instantanee a tuturor
  operațiilor interne ale fiecărui furnizor.

### Descoperire terestră independentă

- Coridoarele pot folosi și Exa existent când Brave nu este configurat.
- Limita explicită a acestei extinderi este de cel mult **6 căutări de coridor**
  după cele două interogări directe. Se explorează cel mult două localități de
  schimbare provenite din geografie, nu dintr-o rută fixată în cod.
- Răspunsurile de acces/cotă blocate opresc căutările ulterioare ale coridorului;
  nu există abonament cumpărat, activare de nivel plătit sau nou furnizor plătit.
  Limita per căutare **nu este o garanție a soldului gratuit al contului**.
- Geografia independentă pornește în paralel. Validarea unei pagini directe nu
  mai așteaptă terminarea întregului coridor, iar fiecare rezultat validat poate
  fi păstrat înaintea termenului extern de 19,5–20 secunde.
- O eroare ulterioară nu șterge paginile/tronsoanele deja primite. După anulare,
  wrapperul de rețea nu mai lansează alte interogări către surse.

### Afișare

Variantele terestre sunt afișate înaintea listei geografice de aeroporturi.
Transportul mixt explică explicit că poate folosi transport local, tren,
autocar și avion, fără aeroport obligatoriu. Lipsa rezultatelor terestre este
explicată separat, nu ascunsă de existența a două zboruri. Selectarea unui card
folosește datele primite în căutarea inițială, fără altă căutare declanșată la tap.

## Verificări efectuate — exclusiv offline / date sintetice

`tests_mixed_shared_local_surface.mjs` verifică efectiv handlerul normal Worker:

- aceeași rutare locală TfL pentru acces la un terminal și continuarea inversă;
- destinație regională Luton prin aceeași ramură UK ca o căutare obișnuită;
- nicio cerere AI, nicio căutare aeriană recursivă și cache per pereche/oră;
- un traseu **autobuz local → autocar**, cap-coadă pe fixture, fără aeroport;
- coridor **tren → autocar** prin Exa, fără cheie Brave sau zbor;
- coordonate de sosire în format `arrivalPoint` și ID-uri geografice lungi;
- păstrarea unei variante terestre dacă altă sursă expiră ori căutarea de coridor
  eșuează după rezultatele directe;
- păstrarea porților de autorizare națională și respingerea coordonatelor goale.

PASS: transit-audit (include noul test în gate-ul APK/deploy), mixed-orientation,
national-transport, check, boot syntax, fixed-point access, flight-ground tests.
Browser 360/393/430: regresiile fizice anterioare și ecran mixt cu **numai tren /
autocar**, detalii, revenire, linkuri și fără solicitare de rețea la selectare.
Dry-run frontend/backend și verificarea numelor din bundle: PASS; nu publicare.

## Ce NU afirmăm că este rezolvat live

- Nu există încă o probă reală după modificări pentru Grays–Luton, Debrecen–Oradea
  sau întregul Grays–Oradea din data utilizatorului. Fixture-ul Luton nu este un
  orar confirmat și nu dovedește o plecare reală.
- O pagină a unui operator între două **orașe** nu furnizează automat stațiile
  exacte, data sau transferul. Rămâne afișată ca dovadă de tronson publicat;
  nu alegem o autogară/gara aproximativă și nu o declarăm legătură verificată.
- Folosirea aceleiași rutări locale nu adaugă acoperire unui furnizor acolo unde
  datele lipsesc. În special, un segment transfrontalier trebuie susținut de o
  sursă autorizată; nu este transformat în două călătorii domestice fictive.
- Nu sunt active servicii noi pentru Germania/Norvegia/Ungaria și nu este
  conectat prin aceste modificări un nou feed internațional de orare.
- HERE rămâne OFF. Consum HERE al agentului: **0**, maximum autorizat **2 total**
  neschimbat. Fără Oracle, main merge, deploy de frontend sau cumpărături.
