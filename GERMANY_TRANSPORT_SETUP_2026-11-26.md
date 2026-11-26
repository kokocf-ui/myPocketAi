# Germania — adaptor pregătit, serviciu încă neconectat

## Starea exactă

**Nu am conectat Germania live.** Am implementat și integrat în Worker un adaptor
național DE pentru o instanță **MOTIS 2 administrată de noi sau furnizată printr-un
acord comercial**, după contractul REST oficial. Nu există endpoint implicit,
abonament nou, date importate sau dovadă de acoperire. Nu este un API Deutsche Bahn.

Nu am publicat această etapă, pornit workflow-uri, configurat secrete/variabile
remote, cumpărat găzduire ori construit APK. Backendul livrat rămâne **v185**,
Finlanda/Estonia active conform raportului anterior; APK livrat **501884**.

Registrul conține acum **6 profiluri cu cod de adaptor**: RO, GB, NO, FI, EE, DE.
Aceasta NU înseamnă șase țări conectate live. DE/NO sunt OFF; FI/EE au probe live
limitate; RO/GB sunt integrările existente. **43 de profiluri** încă fără adaptor.
`nationalTransportCoverage('DE')` fără configurație rămâne `not_connected`,
`urban_configured:false`, `intercity_configured:false`, cu acoperire integrală
neverificată. UI nu permite căutarea numai pentru că există codul adaptorului.

## Descoperirea care schimbă alegerea furnizorului

Politica publicată de **Transitous** interzice explicit utilizarea comercială.
Condițiile publice includ proiect open-source, necomercial și utilizare limitată.
Din moment ce utilizatorul intenționează monetizare, nu folosim serviciul public
pentru producție, teste automate ori ca fallback anonim. Nici aliasurile interne,
staging sau serverele din spatele serviciului nu sunt o soluție de ocolire.

Referință verificată prin GitHub, commit
`b1ce91355f2f200ff26c6bc3025297eb7eedba24`:
[politica oficială Transitous — Commercial Use și endpointuri interne](https://github.com/public-transport/transitous/blob/b1ce91355f2f200ff26c6bc3025297eb7eedba24/website/content/api.html).

**MOTIS este software, Transitous este un serviciu operat folosind acel software.**
Licența MIT a motorului MOTIS permite utilizare comercială a software-ului; ea nu
acordă acces la infrastructura Transitous și nici drepturi asupra oricăror date
încărcate în motor. Fiecare set de orare, actualizări și date OSM are propriile
condiții, atribuiri, actualizare și acoperire care trebuie verificate.

## Acces și linkuri — nu există încă o cheie de cerut utilizatorului

1. **Date Germania / DELFI:**
   https://www.opendata-oepnv.de/ht/en/organisation/delfi/start
   — catalogul oficial deja referențiat în proiect. Este punct de pornire pentru
   acces la orare, NU un endpoint gata de planificare. Nu am verificat direct
   interfața actuală de înregistrare sau termenii actuali ai fiecărui download în
   acest mediu; nu inventăm butoane, abonamente, costuri sau chei API.
2. **Motor MOTIS / contract:**
   https://github.com/motis-project/motis
   — se poate găzdui separat, după verificarea licențelor datelor și dimensionare.
3. **Instalare și configurare oficială:**
   https://github.com/motis-project/motis/blob/v2.11.4/docs/setup.md
   — import GTFS/NeTEx, OSM pentru acces pietonal, date realtime numai cu surse
   licențiate efectiv disponibile. Configurația exemplu din documentație nu este
   un serviciu Germania deja instalat și nici o dimensionare de producție.

Nu există în această etapă un portal verificat care să elibereze o singură cheie
pentru planificarea comercială completă a Germaniei. **Cheia Digitransit nu se
folosește pentru DE.** Cheile/permisiunile de download ale datelor nu sunt automat
chei pentru un API de rutare.

### Ce trebuie ales înainte de activare

- **Găzduire proprie:** server separat pentru MOTIS, import/refresh de date,
  resurse RAM/disc și monitorizare. Cloudflare Worker rămâne clientul/proxy-ul,
  nu îl transformăm într-un server pentru baza națională de rutare. Nu instalez
  nimic pe infrastructura Oracle existentă fără acord și evaluare de resurse.
- **Serviciu găzduit de un furnizor:** furnizorul trebuie să ofere explicit API-ul
  MOTIS compatibil, acord comercial și datele necesare pentru DE. Nu am ales sau
  validat un furnizor comercial, nu promit cost sau SLA și nu există contract.

Nu este suficientă alegerea unui URL: trebuie demonstrate acoperirea locală și
interurbană, actualitatea orarelor și drepturile de utilizare. Nu considerăm un
API numai de trenuri echivalent cu toate autobuzele/tramvaiele/metroul.

## Implementare locală

`germany_national_transit.mjs` folosește **GET `/api/v6/plan`**, după MOTIS
**v2.11.4**, commit `e020e64d048d66d076078f900bade368a58b3b22`:

- [OpenAPI publicat](https://github.com/motis-project/motis/blob/e020e64d048d66d076078f900bade368a58b3b22/openapi.yaml).
- [Licență MIT a motorului](https://github.com/motis-project/motis/blob/e020e64d048d66d076078f900bade368a58b3b22/LICENSE).

Configurație viitoare **numai pe backend**, nimic setat acum:

| Binding | Scop |
|---|---|
| `GERMANY_NATIONAL_ENABLED` | `true` numai la activarea autorizată |
| `GERMANY_MOTIS_TERMS_REVIEWED` | Acord de utilizare a serviciului verificat |
| `GERMANY_MOTIS_DATA_REVIEWED` | Drepturi/atribuiri/actualitate/sferă date verificate |
| `GERMANY_MOTIS_BASE_URL` | Originea HTTPS a instanței autorizate, fără cale/query/credentiale |
| `GERMANY_MOTIS_ATTRIBUTION` | Atribuirea reală a surselor încărcate, maximum 500 caractere; se poate folosi și un URL de credite complete |
| `GERMANY_MOTIS_API_TOKEN` | **Secret opțional** pentru gateway care acceptă Bearer; nu este o cheie emisă de MOTIS |

Motorul MOTIS de bază nu emite implicit o cheie API. Dacă punem autentificare în
reverse proxy sau furnizorul oferă un gateway Bearer, tokenul se configurează
acolo, apoi în Cloudflare ca Secret. Un gateway care folosește altă autentificare
necesită adaptarea/verificarea contractului; nu introducem tokenuri în URL.

- Fără URL implicit. Respinge URL cu user/password, query, fragment, HTTP, port
  nestandard, IP literal sau gazde locale și domeniile serviciului public
  Transitous/aliasurile sale cunoscute. Nu încercăm să rezolvăm/ocolim aliasuri.
  Flagurile de review sunt necesare; validarea URL nu dovedește licențierea.
- Secretul opțional numai în headerul `Authorization: Bearer …`, niciodată în
  frontend/răspuns/query. Erorile furnizorului nu sunt retransmise cu corp brut.
- Redirect **manual**, respingere 3xx fără trimiterea cheii la altă origine.
- 7,5 s/cerere, până la 6 variante, răspuns maximum 2 MiB verificat înainte de
  parsare; nu există stocare persistentă a coordonatelor călătorului.
- Codul țării provine din GPS verificat independent și destinație geoverificată.
  Numele endpointului, limba sau țara declarată de client nu sunt autoritate.
- **DE→DE exclusiv**; toate stațiile din `from`, `intermediateStops`, `to` sunt
  reverificate în DE. Bugetul comun conservator este 36 puncte/6,5 s/4 concurente;
  rute complexe pot fi refuzate. Verificăm stațiile, nu traseul continuu dintre ele.
- Cere moduri explicite, fără `TRANSIT` generic care ar permite avion/taxi/flex.
  Moduri acceptate: autobuz/autocar, tramvai/metrou/S-Bahn, tren regional/rapid/
  intercity/noapte, feribot, funicular și instalații pe cablu. Disponibilitatea
  lor depinde de date, nu de existența enumului în contract.
- Alternativa bus-only pentru distanțe ≤80 km este căutată separat. Modul bus-only
  filtrează din nou rezultatele, nu se bazează exclusiv pe query.
- `intermediateStops` conține strict opriri intermediare, **nu** include capetele
  ca `stopCalls` Digitransit. Numărul opririlor până la coborâre este calculat doar
  cu lista completă și ID-uri distincte. Lipsa listei nu înseamnă zero opriri.
- Validează coordonate, cronologie, capete ≤150 m de punctele cerute, etape
  adiacente ≤100 m, opriri de transport, îmbarcare/coborâre permise, anulări.
  Respinge extensii sintetice ale calendarului (`loopedCalendarSince`), rezervări
  obligatorii nesuportate și segmente interline neîmbinate. Nu inventează acces,
  transferuri, geometrii, tarif, locuri sau bilet garantat.
- Timp planificat și realtime separat; `scheduled` respectă etapele furnizorului,
  inclusiv servicii suplimentare care nu au fost în orarul inițial.
- Atribuirea surselor este cerută în configurație, plus data/ora primirii și OSM /
  ODbL în date/răspuns/UI generic; nu afișăm DELFI dacă nu știm că este sursa reală.
  Textul de credite prea lung este refuzat, nu trunchiat automat în adaptor.

## Verificări efectuate

- **8 teste adaptor + 4 teste Worker PASS**, cu date explicit sintetice:
  activare/acord/date/endpoint, surse interzise, contract GET v6, token în header,
  lipsa datelor/stopurilor, cronologie/anulări/calendar expirat extins, bus-only,
  interurban, țări străine, buget geocoder, 3xx/403/429/JSON invalid/erori fără secret.
- Contract offline PASS: `scripts/check_germany_motis_contract.mjs` verifică
  parametrii/enumurile cererii și câmpurile citite din răspuns după OpenAPI pinuit.
  **Nu este validator JSON Schema complet** și nu verifică o instanță live.
  OpenAPI și parserul `yaml@2.8.1` sunt în `.bundle-check`, fără dependență nouă
  inclusă în aplicație sau schemă mare adăugată în Git.
- `npm run test:national-transport` PASS, incluzând suitele noi DE și regresiile
  RO/GB/NO/FI/EE; `test:transit-audit`, `test:mixed-orientation`, `check` PASS.
- Dry-run backend și frontend PASS, **fără deploy**.
- **4 suite browser** pe bundle de producție la 360/393/430 px PASS: mesajele
  naționale/DE neconfigurat, NO, FI/EE, detalii DE sintetice (opriri, atribuire,
  timestamp, operator/link, fără overflow). Nu sunt teste fizice în Germania.
- Snapshot HTML **6.991.306 B**, fără APK nou.
- Verificatorul live extins cu Frankfurt local / Frankfurt–Berlin, rulat acum
  **numai offline**: `status:not_run`, `live_requests:false`. Nicio probă API DE.

## Următorul pas real

Alegerea și aprobarea infrastructurii/furnizorului, apoi importul și verificarea
licențelor/calendarelor datelor. Numai după acestea configurăm endpointul,
atribuirea și eventual tokenul privat, autorizăm activarea și efectuăm probe
live locale/interurbane și de frontieră. Niciun cost sau deploy nu este implicit.
Austria și Elveția rămân etape distincte; nu le activăm prin adaptorul DE.
