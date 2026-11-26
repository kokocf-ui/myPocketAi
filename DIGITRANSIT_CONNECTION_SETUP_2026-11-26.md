# Digitransit — Finlanda și Estonia: integrare și obținerea cheii

## Starea exactă

- Adaptorul Digitransit Routing v2 este implementat pentru **două profiluri
  naționale distincte: FI și EE**, pe endpointul comun documentat de furnizor.
- Este **dezactivat implicit**, fără cheie reală adăugată și fără probe live.
- Numai testele cu date sintetice și schema publicată sunt verificate în această
  etapă. Adăugarea unei țări în registru nu dovedește acoperirea tuturor zonelor.
- Nu am schimbat secrete sau variabile remote. Nu am publicat Workerul,
  frontendul, Oracle și nu am construit APK. Ultimul livrat: **501884 / v183**.
- Utilizatorul a cerut linkuri și ajutor pentru chei în Cloudflare; nu a retras
  refuzul publicării. Nu transforma pașii de obținere a cheii în acord de deploy.

## 1. Obținerea cheii — pași pentru telefon

**Portal oficial:** https://portal-api.digitransit.fi/

**Instrucțiunile furnizorului:**
https://digitransit.fi/en/developers/api-registration/

1. Deschide portalul și alege **Sign up** (sau **Sign in**, dacă ai deja cont).
2. Folosește o adresă de e-mail la care ai acces. Confirmă mesajul primit.
3. Configurează autentificarea în doi pași conform portalului (e-mail sau
   aplicație de autentificare, după opțiunile oferite). Păstrează accesul la ea.
4. După autentificare, deschide **Products**.
5. Alege produsul care include **Routing API** pentru endpointul național
   `routing/v2/finland/gtfs/v1`, nu numai hărți sau geocodare. Portalul poate schimba
   numele comercial al produsului: dacă nu este clar, cere ajutor cu o captură
   fără chei/date personale. Nu inventăm aici un nume de produs neconfirmat.
6. Citește termenii, politica de date și limitele afișate. Nu activa un produs
   plătit sau accepta un cost neclar numai pentru a urma acest ghid.
7. Apasă **Subscribe** și completează formularul sincer. Descriere posibilă:
   „myPocketAI — aplicație mobilă de asistență, planificarea transportului public
   local și interurban în țara GPS, cu atribuirea datelor Digitransit; integrare
   în curs de testare, fără promisiunea acoperirii integrale.” Nu pretinde
   parteneriat cu furnizorul sau utilizatori/volume inexistenți.
8. Dacă abonamentul necesită aprobare, așteapt-o. După activare, mergi la
   **Profile → Subscriptions** și **Show** pentru cheia principală. Portalul
   documentează și o cheie secundară pentru rotație; aplicația are nevoie de una.
9. Păstrează cheia într-un loc privat, de preferință un manager de parole.
   **Nu o trimite în conversație, capturi, GitHub, fișiere HTML sau APK.**

Furnizorul documentează o cheie de abonament în headerul HTTP
`digitransit-subscription-key`. Codul nostru o trimite numai în acel header,
nu în URL/query string sau în corpul cererii. Nu este o cheie Entur/Norvegia și
nu înlocuiește cheile furnizorilor din Anglia sau România.

## 2. Unde va fi introdusă în Cloudflare

Dashboard: https://dash.cloudflare.com/

**Workerul corect este `lifewise-ai-api`** (`wrangler-backend.toml`), nu Workerul
frontend, Studio sau un serviciu de previzualizare.

La momentul autorizat pentru configurare:

1. **Workers & Pages → lifewise-ai-api → Settings**.
2. **Variables and Secrets → Add**.
3. Tip: **Secret** — nu Plaintext/Text/JSON.
4. **Variable name:** `DIGITRANSIT_API_KEY` (exact, cu majuscule).
5. **Value:** cheia din portal, lipită fără spații ori rânduri suplimentare.
6. Verifică mediul Workerului și numele bindingului, fără a trimite valoarea în
   capturi. Nu șterge și nu înlocui celelalte secrete.

**Oprire înainte de publicare:** documentația Cloudflare indică butonul **Deploy**
ca ultim pas pentru salvarea/aplicarea secretului în dashboard. Acesta este o
modificare live de configurație. Cât timp rămâne instrucțiunea „încă nu publica”,
nu îl apăsa pentru această integrare și nu considera formularul deschis un
secret deja salvat. Dacă portalul oferă separat salvarea unei versiuni nepublicate,
verifică explicit efectul, nu presupune că orice „Save” înseamnă același lucru.
Nu folosim `wrangler secret put` ca ocolire: și acesta poate publica o versiune.

Deocamdată cheia poate fi obținută și păstrată privat. Utilizatorul poate confirma
în chat doar „am cheia” sau trimite captura ecranului **Products**, fără valoare.
Nu i se cer tokenuri Cloudflare/GitHub sau parole pentru a continua.

### Activarea serviciului este separată de secret

Adaptorul cere simultan:

| Binding backend | Tip | Rol |
|---|---|---|
| `DIGITRANSIT_API_KEY` | **Secret** | Cheia abonamentului |
| `DIGITRANSIT_NATIONAL_ENABLED` | Variabilă text | `true` numai la activarea autorizată |
| `DIGITRANSIT_TERMS_REVIEWED` | Variabilă text | `true` numai după revizuirea/acceptarea reală a condițiilor |

**Nu am setat niciuna în mediul remote și nu am adăugat `true` în Wrangler.**
Cheia singură nu activează integrarea. Valorile `true` din fixture-uri sunt
exclusiv intrări sintetice de test, nu acord de utilizare sau publicare.
Backendul publicat vechi nu capătă această funcție doar fiindcă există secretul;
est nevoie ulterior de codul nou, activare și verificare reală, cu autorizare.

## 3. Implementare tehnică

- `digitransit_national_transit.mjs`: GraphQL **Routing v2 / `planConnection`**,
  nu endpointul vechi și nu interogarea Transmodel a Norvegiei. Endpoint fix:
  `https://api.digitransit.fi/routing/v2/finland/gtfs/v1`.
- Documentația îl declară explicit pentru Finlanda **și Estonia**. Fiecare țară
  are profil propriu în registry, cod propriu în răspuns și fus orar:
  `Europe/Helsinki`, respectiv `Europe/Tallinn`.
- Originea GPS și destinația sunt verificate independent. FI→EE și EE→FI rămân
  respinse în modul național. Toate stațiile întoarse, inclusiv cele intermediare,
  sunt verificate în țara cererii. Nu se deduce țara din hostname, numele
  endpointului sau prefixul ID-ului unei stații.
- `national_transport_validation.mjs` extrage regulile geografice comune pentru
  NO/FI/EE. Protocoalele, interogările, autentificarea și normalizările rămân
  specifice furnizorilor. Testele Norvegiei au fost rulate după extragere.
- Buget comun: 36 de puncte geografice distincte/cerere, loturi de maximum 4,
  termen de 6,5 s pentru verificare, cache numai pe durata cererii. Este o limită
  conservatoare: unele rute complexe sunt respinse. Controlul verifică stațiile
  raportate, nu dovedește conturul geografic continuu al șinei/șoselei dintre ele.
- Maximum 6 variante; query timeout 7,5 s; fără redirect; erori HTTP/GraphQL,
  răspunsuri prea mari sau necunoscute tratate explicit. Fără afișarea corpului
  erorilor furnizorului (care ar putea conține detalii sensibile).
- Moduri cerute explicit: autobuz, autocar, troleibuz, tren, metrou, tramvai,
  feribot, instalații pe cablu/gondolă, funicular, monorai, plus mersul pe jos
  pentru acces/transfer. Nu înseamnă că toate există sau sunt acoperite peste tot.
- Pentru deplasări de până la 80 km, o căutare rutieră suplimentară poate păstra
  un autobuz/autocar valid alături de tren/metrou. Nu impunem locuri confirmate.
- `stopCalls` este lista de apeluri pentru **etapa** respectivă, inclusiv urcarea
  și coborârea, conform schemei. ID-urile capetelor și coordonatele sunt validate.
  Numărul opririlor se afișează numai când lista permite calcul exact, nu prin
  estimarea din distanță/durată sau din întregul traseu al vehiculului.
- Timpul planificat și estimarea sunt păstrate separat. Anulările raportate,
  modurile necunoscute, cronologia/golurile dintre etape și lipsa datelor necesare
  sunt respinse, fără a inventa transferuri. Serviciile cu rezervare specială,
  apel la agenție ori cerințe de îmbarcare neimplementate sunt excluse în această
  versiune; nu sunt prezentate drept curse obișnuite garantate.
- Fără tarif, locuri, rezervare, geometrie sau acces pietonal garantat inventat.
- Atribuirea **© Digitransit + data/ora primirii + CC BY 4.0**, împreună cu
  atribuirea OpenStreetMap/ODbL, este păstrată în date, răspuns și detaliile UI
  comune (`transit-source-attribution`). Se folosesc textContent și text limitat,
  nu HTML arbitrar de la furnizor.

## 4. Verificări și limite

- `tests_digitransit_national_transit.mjs`: **9 teste PASS** — activare/secret,
  v2/variabile, cheie numai în header, cronologie/anulări/stopCalls, FI cu stație
  EE refuzată, actualizări/atribuire, erori fără cheie expusă, bus-only,
  interurban și profil EE cu verificarea independentă a țării/fusului orar.
- `tests_digitransit_national_backend.mjs`: **5 teste PASS** — Worker FI, lipsă
  secret/comutatoare, destinație și stație străine blocate, secret absent din
  HTML, Worker EE pe endpointul comun fără presupunerea că GPS-ul este Finlanda.
- `npm run test:national-transport`: **17 comenzi de test PASS** (2 suite noi +
  cele 15 din etapa precedentă); transit-audit: **19 PASS**; mixed-orientation:
  **11 PASS**; `npm run check`: PASS.
- Schema/query validate cu `graphql@16.12.0` după schema publicată de furnizor,
  inclusiv verificarea absenței câmpurilor depreciate: PASS. Script reproductibil
  `scripts/check_digitransit_schema_contract.mjs <schema.graphql> <graphql/index.js>`.
  Schema și pachetul de validare rămân în `.bundle-check`, nu în aplicație/Git.
- Verificarea schemei Entur după refactor: PASS. Nu este test API live.
- Dry-run frontend + backend: PASS, **fără deploy**.
- Browser pe bundle de producție 360/393/430 px: **3 suite PASS** — mesajele de
  acoperire RO/GB/NO/FI/EE și DE neconectat; detalii NO; detalii FI/EE cu atribuire,
  oră, licențe, opriri și link extern operator. Fără overflow orizontal.
- Snapshot HTML: **6.991.306 B < 8.000.000 B**, nu APK nou.
- `scripts/verify_national_transport_live.mjs --country=FI` și `--country=EE`
  executate numai **offline**: `status: not_run`, `live_requests: false`.
  Scriptul are perechi locale/interurbane Helsinki/Tampere, Tallinn/Tartu,
  verifică GPS-ul și rezultatele când va exista acces real/configurație revizuită.

**Nu sunt probe live:** mediul curent nu are acces la `api.digitransit.fi` sau
Geoapify și utilizatorul încă nu a furnizat cheia prin mecanismul privat. Nu se
ocolesc restricțiile prin workflow/proxy/deploy. Nu se declară acoperire integrală,
acceptanță fizică Android sau întreaga suită a repository-ului verde.

## 5. Surse consultate și trasabilitate

Documentație furnizor, commit `7ec6fbb56eaee2b37429086c9d5ac220b7bb1f7b`:

- [Înregistrare, Products/Profile/chei și headerul de abonament](https://github.com/HSLdevcom/digitransit-site/blob/7ec6fbb56eaee2b37429086c9d5ac220b7bb1f7b/src/pages/en/developers/api-registration/index.md).
- [Endpointurile Routing v2, inclusiv Finlanda și Estonia](https://github.com/HSLdevcom/digitransit-site/blob/7ec6fbb56eaee2b37429086c9d5ac220b7bb1f7b/src/pages/en/developers/apis/1-routing-api/index.md).
- [Exemple planConnection](https://github.com/HSLdevcom/digitransit-site/blob/7ec6fbb56eaee2b37429086c9d5ac220b7bb1f7b/src/pages/en/developers/apis/1-routing-api/itinerary-planning/index.md).
- [Termeni: atribuire, data/ora primirii, CC BY/ODbL și responsabilități](https://github.com/HSLdevcom/digitransit-site/blob/7ec6fbb56eaee2b37429086c9d5ac220b7bb1f7b/src/pages/en/developers/apis/7-terms-of-use/index.md).

Contract tehnic mai nou, cu `stopCalls` și `TripOnServiceDate.realTimeTripState`:
[schema publicată de aplicația oficială](https://github.com/HSLdevcom/digitransit-ui/blob/d036f3cc710c005ec244c092a489722165311ea9/packages/private/schema/schema.graphql).
Nu presupunem că toate exemplele mai vechi au fost actualizate simultan; query-ul
nostru este validat după această schemă identificabilă, nu inventat după Entur.

[Cloudflare: adăugarea secretelor în dashboard și efectul Deploy](https://github.com/cloudflare/cloudflare-docs/blob/6486a835f361cdca5c5a013ee9b9eb92e0ee74a2/src/content/docs/workers/configuration/secrets.mdx).

## Următorii pași

1. Utilizatorul creează abonamentul și păstrează cheia privat; clarificăm produsul
   din portal pe captură fără chei dacă este nevoie.
2. Revizuim termenii efectivi/limitele abonamentului și atribuirea/privacy, apoi
   configurăm secretul și activarea numai în cadrul autorizat.
3. Probe live locale/interurbane și cazuri de frontieră, fără a deduce că toate
   localitățile sunt acoperite din două rute reușite.
4. Continuăm separat celelalte țări. Starea codului: RO/GB existente, NO și FI/EE
   noi implicit OFF; **44 de intrări** ale catalogului încă fără adaptor național.
5. Publicare backend/router/frontend/APK numai după acord explicit; fișierele
   salvate pe ramură nu schimbă instalarea curentă din telefon.
