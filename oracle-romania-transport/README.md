# Romanian urban planner (Oracle — not yet deployed)

Internal-only REST service for licensed, imported GTFS snapshots:
- GET /healthz
- POST /v1/plan, Authorization: Bearer <private service token>
- Body: {"region":"oradea","from":{"latitude":47.05,"longitude":21.92},"to":{"latitude":47.055,"longitude":21.92},"date":"2026-11-12","afterHHMM":"10:00"}

Always return **only** provider-originated timetable legs and mark walking
to/from stations as unverified until the existing pedestrian router checks them.

## Prerequisites
- Review commercial data reuse/attribution and freshness for each official feed.
- Unzip an authorized feed into a **private directory**; never include in GitHub.
- Import with `node ro_urban_gtfs_import.mjs <extracted-dir> <output-dir>/<region>.json`.
- `sudo install -d -o 10001 -g 10001 -m 0700 /home/ubuntu/pocketai-romania/feeds`;
  copy the private snapshot there and set owner `10001:10001`, mode `0400`.
- Create local `oracle-romania-transport/.env` (mode 0600), with a randomly
  generated `RO_GATEWAY_TOKEN` of at least 32 characters. Never commit it.
- Start `sudo docker compose up -d --build` from this directory only
  after the prerequisites are met.
- The host port is **127.0.0.1:8766**; do not open it in Oracle network lists.
- Cloudflare access requires a properly authenticated outbound tunnel/proxy
  with TLS and a separate token. It is not set up in this PR.
- Snapshot updates require refreshing the private JSON and restarting container.
  Do not serve stale schedules beyond the feed's calendar date.
- No public service, prices, guaranteed walk/transfer distances, or live updates.

Before pilots, enforce request quotas, protect the private tunnel, scan dependency
versions, load-test busy GTFS hubs, review UK/EU GDPR and disable logs containing
precise user coordinates. Server currently writes no request-body logs.

## Actualizare 16.11.2026 — planificator național extensibil

- Motorul **nu mai are lista de patru orașe drept limită geografică**. Există
  42 de sloturi regionale: toate cele 41 de județe și municipiul București,
  în format ISO `ro-ab.json`, `ro-bh.json`, `ro-b.json` etc. Se acceptă și
  fișierele istorice `oradea.json`, `bucharest.json`, `cluj.json`, `iasi.json`.
- `ro_urban_client.mjs` poate cere `region: "romania"` pentru deplasări
  locale/județene de până la 80 km, în afara orașelor inițiale. Pentru rutele
  interurbane lungi rămâne motorul Bilo. O rută regională nu este considerată
  disponibilă înainte să existe GTFS real cu stații lângă ambele adrese.
- Fiecare snapshot regional trebuie importat dintr-o sursă **cu drept de
  reutilizare comercială verificat**, apoi indexat local:
  ```bash
  cd /home/ubuntu/pocketai-oracle-src
  node ro_urban_gtfs_import.mjs /cale/gtfs-dezarhivat /home/ubuntu/pocketai-romania/feeds/ro-bh.json
  node oracle-romania-transport/build-index.mjs RO ro-bh /home/ubuntu/pocketai-romania/feeds
  ```
  Pentru alte județe se schimbă doar codul: `ro-ab`, `ro-tm` etc.
  Rulați comenzile cu un cont care are permisiunile necesare pentru
  directorul privat. Snapshoturile și indexurile trebuie să poată fi citite
  de UID 10001 și să rămână nepublice.
- CLI de transport citește automat doar perechile `<regiune>.json` +
  `<regiune>.index.json`, cu dimensiune și timp de modificare potrivite.
  Orice înlocuire de GTFS cere **reindexare explicită** și o verificare a
  valabilității calendarului. Datele nu sunt citite toate simultan în RAM.
- Containerul Oracle rămâne pe `127.0.0.1:8766` și folosește secretul
  `RO_GATEWAY_TOKEN` (minim 32 caractere), configurat separat de
  `RO_URBAN_API_TOKEN` în Cloudflare numai după instalarea unui canal HTTPS
  autentificat. Nu publicați portul 8766, baza de date sau fișierele GTFS.
- Pentru utilizarea tuturor celor 42 de județe cu trasee reale sunt necesare
  feeduri valide și suficiente pentru fiecare regiune, inclusiv stații și
  orare rurale, nu doar un nume în registru. Date incomplete => informație
  de acoperire incompletă, **niciodată un itinerar inventat**.

### Stare live

Codul este într-un PR draft. Nu este dovedită conectarea la instanța Oracle,
nu există instalare automată de feeduri și nu s-au configurat URL-ul HTTPS ori
secretele din Cloudflare. Continuitatea serviciului de Comunicare are prioritate.


## Importuri GTFS mari prin SQLite (propunere izolată, nepublicată)

Seturi precum București–Ilfov pot avea peste 1,4 milioane de `stop_times`,
ce ar depăși limita de 110 MiB pentru JSON. Varianta nouă creează un index
SQLite pe disc; la fiecare solicitare citește doar cursele și stațiile
relevante și transmite o secțiune limitată planificatorului existent.
Același mecanism este folosit pentru județe și pentru Anglia.

**Condiții înainte de import:** drept de reutilizare comercială și
atribuirea sursei verificate; calendarul și integritatea ZIP confirmate;
spațiu liber suficient pe disc; alte containere neatinse. Nu confundați
orarele statice cu informațiile în timp real.

### Procedură pentru București–Ilfov, numai după verificarea drepturilor

În directorul checkout-ului nou, pe gazda Oracle (unde Python 3 există):

```sh
cd /home/ubuntu/pocketai-transport-src
node --test tests_gtfs_sqlite_indexed.mjs  # prin container Node+Python dacă Node nu este instalat pe gazdă
sudo python3 gtfs_sqlite_store.py import /home/ubuntu/pocketai-gtfs-audit/BUCHAREST-REGION.zip /home/ubuntu/pocketai-romania/feeds/ro-b.sqlite3 ro-b RO
sudo python3 gtfs_sqlite_store.py index /home/ubuntu/pocketai-romania/feeds/ro-b.sqlite3 ro-b RO
sudo chown 10001:10001 /home/ubuntu/pocketai-romania/feeds/ro-b.sqlite3 /home/ubuntu/pocketai-romania/feeds/ro-b.index.json
sudo chmod 0400 /home/ubuntu/pocketai-romania/feeds/ro-b.sqlite3 /home/ubuntu/pocketai-romania/feeds/ro-b.index.json
```

Importul refuză suprascrierea unui feed deja existent. La actualizări se
construiește separat un snapshot nou, se oprește controlat serviciul și se
înlocuiesc împreună baza de date și indexul. Un index invalid, absent ori
învechit este ignorat; nu se fabrică orare. Limitele de procesare excesivă
raportează indisponibilitatea planificatorului, nu o rută fictivă.

Reconfigurați doar containerul local pentru România cu Docker Compose-ul
acestei ramuri; serviciile Comunicare nu trebuie restartate. Verificați
`/healthz`, apoi interogați `/v1/plan` numai prin acces autentificat
intern. Nu publicați portul 8766.

**Nu este o certificare a acoperirii:** sunt necesare probe reale de trasee,
moduri, transferuri, acces pietonal, ore în zile lucrătoare/weekend,
performanță, licență și un canal TLS securizat înainte de activarea Eva.
