# Conectări naționale — primul adaptor nou și verificare fără prezență fizică

> **Etapă Germania, ulterioară actualizării FI/EE:** adaptor MOTIS 2 DE pregătit și
> testat numai offline/sintetic, fără serviciu/date/configurație/live. Ghid:
> `GERMANY_TRANSPORT_SETUP_2026-11-26.md`. Sunt acum 6 profiluri cu cod de adaptor,
> 43 fără; DE și NO sunt OFF. Nu confunda implementarea cu țară conectată.
> Nicio publicare nouă: backendul livrat rămâne v185, APK 501884.


> **Actualizare ulterioară, aceeași zi:** FI/EE au acum adaptor Digitransit și
> backend **v185 activat cu acordul utilizatorului**, cu patru probe live locale/
> interurbane reușite și FI→EE refuzat. Detalii în
> `DIGITRANSIT_CONNECTION_SETUP_2026-11-26.md` și
> `DIGITRANSIT_LIVE_VERIFICATION_2026-11-26.json`.
> Sunt 5 profiluri cu adaptoare (RO/GB/NO/FI/EE), 44 fără adaptor; NO rămâne OFF.
> Frontendul/APK-ul nu au fost publicate în această etapă. Secțiunile de mai jos
> descriu etapa istorică Norvegia, nu starea actuală FI/EE sau backend v185.


## Cererea curentă

Utilizatorul cere continuarea conectării pentru fiecare țară. Poate verifica
fizic numai Anglia, iar un prieten România. Nu presupunem că este necesar să aibă
un cunoscut în fiecare țară pentru a verifica un API. Totuși, aceeași metodă de
acceptanță nu înseamnă același protocol, aceeași licență sau acoperire garantată.

**Rezultatul acestei etape: Norvegia are acum un adaptor HTTP/GraphQL implementat
și integrat în fluxul național, testat local și după schema publicată de Entur.
Este dezactivat implicit și NU este verificat live. Nu sunt conectate toate cele
49 de intrări ale catalogului. Celelalte țări fără adaptor rămân neconectate.**

Nu am publicat Workerul, frontendul, Oracle ori un APK; nu am configurat secrete
sau comutatoare remote și nu am pornit workflow-uri GitHub. Ultimul livrat rămâne
APK 501884 / backend v183. Modificările sunt numai pe ramura activă.

## De ce Norvegia este primul pas nou

Entur publică un planificator și o schemă GraphQL, deci putem verifica un contract
real fără să presupunem că folosește formatul din Anglia. Referințe consultate în
repository-urile organizației Entur, prin GitHub API:

- [README și endpointuri publicate](https://github.com/entur/opentripplanner-mcp/blob/bb688c10d473f639411ab05faa50972e74f1d80a/README.md).
- [Parametrii trip, variabilele Location/Modes și câmpurile răspunsului](https://github.com/entur/opentripplanner-mcp/blob/bb688c10d473f639411ab05faa50972e74f1d80a/src/main/java/org/entur/mcp/services/OtpSearchService.java).
- [Schema introspectată publicată de Entur Tavla](https://github.com/entur/tavla/blob/1b117d48af5f25a0a85aefa188e2617d658a4573/tavla/graphql-tools/schema.json).
- [Explicația provenienței/generării schemei](https://github.com/entur/tavla/blob/1b117d48af5f25a0a85aefa188e2617d658a4573/docs/graphql.md).

Am folosit contractul API și schema, nu am copiat implementarea Java. Documentația
oficială despre date, condiții de utilizare, limite și atribuire trebuie revizuită
separat înainte de activare. Codul open-source al unui client nu acordă implicit
permisiunea de reutilizare a serviciului sau a tuturor datelor sale.

**Limitarea mediului:** accesul extern este permis numai către anumite gazde,
inclusiv GitHub și registry.npmjs.org, nu către `api.entur.io` sau Geoapify. Nu am
încercat ocolirea restricției prin workflow-uri/proxy-uri și nu prezint testele cu
răspunsuri sintetice drept apeluri live către Entur.

## Implementare

- `entur_national_transit.mjs`: endpoint HTTPS fix, variabile GraphQL, header de
  identificare `ET-Client-Name`, termen de răspuns 7,5 s, maximum 6 opțiuni.
- Adaptorul este disponibil în configurație numai dacă sunt setate explicit
  `ENTUR_NATIONAL_ENABLED=true`, `ENTUR_TERMS_REVIEWED=true` și un
  `ENTUR_CLIENT_NAME` valid. **Nu am setat aceste valori în configurația livrată.**
  Valorile din fixture sunt exclusiv pentru teste, nu constatări juridice.
- Profilul NO oferă același adaptor pentru local și interurban. `domesticPlanner`
  îl dispecerizează numai în Transport public național, după verificarea separată
  a țării GPS și a destinației. Nu este folosit ca înlocuitor pentru RO/GB sau
  Directions și nu mapăm țările vecine pe API-ul Norvegiei.
- Moduri: autobuz, autocar, troleibuz, tren, metrou, tramvai, feribot, funicular,
  instalații pe cablu/lift și monorai, numai dacă sunt întoarse de furnizor. Fără
  zboruri, mașini, taxiuri sau biciclete în această integrare. Nu afirmăm că toate
  aceste moduri există în fiecare localitate sau au date complete.
- Căutările locale de până la 80 km pot cere concurent și o alternativă rutieră,
  păstrată alături de alte moduri când sunt cerute mai multe variante.
- Normalizarea respinge ore invalide, anulări raportate, moduri necunoscute,
  lipsa coordonatelor, decalaje spațiale/temporale între etape și capete care nu
  corespund punctelor cerute. Nu repară lipsurile prin transferuri inventate.
- Orele planificate și cele estimate sunt păstrate separat; timp real numai pe
  etapele marcate explicit. Fără tarif, loc sau bilet confirmat inventat.
- Numărul opririlor provine din lista intermediară cerută integral de la API,
  plus coborârea, numai cu ID-uri coerente și fără duplicate. Nu este estimat din
  durată/distanță. Geometria și accesul pietonal nu devin automat „verificate”.
- Țara este verificată pentru toate capetele etapelor și peroanele intermediare
  întoarse. O pereche NO→NO cu o oprire în SE este respinsă. Rezultatele geografice
  sunt deduplicate numai în cererea curentă, fără cache persistent de coordonate.
- Limite conservative: maximum 36 de puncte geografice distincte/cerere și 6,5 s
  pentru verificarea lor, loturi de maximum 4. Rutele complexe peste acest buget
  pot fi respinse până există o soluție de validare mai eficientă și documentată.
  Acest control verifică stațiile raportate, **nu dovedește frontiera continuă a
  fiecărei șosele/șine dintre ele**. Nu pretindem verificarea fizică a traseului.
- `national_transport_response.mjs`: răspuns național comun, atribuire Entur,
  detalii pe etape și disponibilitate onestă; UI comun existent. Erorile API,
  cota, accesul refuzat, lipsa rezultatelor și țara neverificată sunt distincte.
- Registry întoarce `validation_status: contract_tests_only` pentru NO;
  `countrywide_coverage_verified` rămâne `false`. Fără activare, `supported=false`.

## Verificări executate

1. `tests_entur_national_transit.mjs`: **9 teste PASS** — activare, toate cele 49
   de politici de țară, request/schema/variabile, cronologie/coordonate/anulări,
   opriri străine sau neverificate, limite, erori HTTP/GraphQL, bus-only și traseu
   sintetic pe jos + tren + feribot cu actualizări explicite per etapă.
2. `tests_entur_national_backend.mjs`: **3 teste PASS** — Worker→Entur cu GPS
   verificat, fără scăpări către Bilo/TfL/suplimente mixte; blocare fără activare
   sau către altă țară; refuzul unui traseu cu oprire suedeză intermediară.
3. `npm run test:national-transport`: cele **15 comenzi de test PASS** (cele două
   suite noi plus cele 13 existente).
4. `npm run test:transit-audit`: **19 comenzi PASS**; `test:mixed-orientation`:
   **11 comenzi PASS**; `npm run check`: PASS.
5. **Validare GraphQL reală a formei interogării**, cu `graphql@16.12.0` din npm,
   față de schema publicată de Entur: PASS. Acesta nu este un test al serviciului
   live sau al prospețimii schemei. Schema și pachetul folosite sunt în directorul
   ignorat `.bundle-check/entur-reference`, nu în bundle-ul aplicației.
   Repetare cu snapshot/tooling local: `node scripts/check_entur_schema_contract.mjs
   <schema.json> <graphql/index.js>`.
6. Wrangler frontend/backend **dry-run PASS**, fără publicare.
7. Chromium pe bundle de producție **360/393/430 px PASS**: căutare GPS simulată
   RO/GB/NO, mesaj de acoperire, DE neconectat, viewport redus; răspuns sintetic
   Entur în detaliile naționale comune, număr de opriri, operator și link extern
   pentru bilete, fără overflow orizontal. Nu este test fizic Android/navigare.
8. Snapshot HTML: **6.990.923 B**, sub 8.000.000 B. Nu s-a construit un APK.
9. `scripts/verify_national_transport_live.mjs` executat numai implicit/offline:
   raport `status: not_run`, `live_requests: false`. Nicio probă live nu este
   revendicată. Raportul de lucru este `.bundle-check/national-live-NO.json`.

Suita întregului repository nu este declarată verde. Rămâne consemnată separat
aserțiunea textuală veche `tests_country_city_choice_resume.mjs` din etapa
precedentă; nu au fost slăbite protecții frontend pentru a o satisface.

## Cum verificăm fără prieteni în fiecare țară

Aceeași scară de acceptanță, **nu aceeași conexiune copiată**:

1. Sursă oficială sau furnizor documentat, acoperire locală/interurbană declarată,
   licență, limite, autentificare și atribuire verificate.
2. Adaptor specific protocolului și teste negative (țară greșită, oră invalidă,
   transfer lipsă, anulări, cotă/erori). Fixture-urile rămân etichetate sintetice.
3. Contract validat după o schemă/documentație cu versiune identificabilă.
4. Probe **live** reproductibile pentru cel puțin un traseu local și unul
   interurban, apoi limite/frontieră/rural/ore speciale. Fără publicare automată.
5. UI și navigare testate separat; verificările fizice din Anglia/România sunt
   utile pentru experiența comună, nu certifică datele altor țări.

Scriptul live NO folosește două perechi de stații publice (Oslo local și
Oslo–Lillehammer), o dată viitoare, API-ul real și verificarea țării. Necesită
mediu cu acces la gazdele furnizorilor, configurație deja revizuită și cheia
geocoderului. Rulează online numai cu `--allow-network`; nu generează chei, nu
setează singur acordul de utilizare și nu schimbă deploymentul. Nu executa un
workflow remote sau un deploy doar pentru a ocoli restricțiile mediului curent.
Chiar un `live_smoke_pass` nu declară acoperire națională integrală.

## Situația fiecărei intrări din catalog la finalul acestei etape

Tabelul de mai jos separă codul implementat de descoperirea surselor. Referințele
sunt cele deja existente în catalog, **nu o recertificare actuală a tuturor
site-urilor, licențelor ori serviciilor**. Un NAP/catalog sau date pentru o singură
regiune nu echivalează cu un planificator național.

| Țară | Stare integrare | Sursa specifică din catalog / limită cunoscută |
|---|---|---|
| AD — Andorra | Neconectată — adaptor/import necesar | Sursă națională specifică de identificat și evaluat; numai directorul european NAP comun |
| AL — Albania | Neconectată — adaptor/import necesar | Sursă națională specifică de identificat și evaluat; numai directorul european NAP comun |
| AM — Armenia | Neconectată — adaptor/import necesar | Sursă națională specifică de identificat și evaluat; numai directorul european NAP comun |
| AT — Austria | Neconectată — adaptor/import necesar | Austria transport association open data (national; review_required) |
| AZ — Azerbaidjan | Neconectată — adaptor/import necesar | Sursă națională specifică de identificat și evaluat; numai directorul european NAP comun |
| BA — Bosnia și Herțegovina | Neconectată — adaptor/import necesar | Sursă națională specifică de identificat și evaluat; numai directorul european NAP comun |
| BE — Belgia | Neconectată — adaptor/import necesar | Belgian national rail timetable data SNCB/NMBS (national; review_required) |
| BG — Bulgaria | Neconectată — adaptor/import necesar | Sursă națională specifică de identificat și evaluat; numai directorul european NAP comun |
| BY — Belarus | Neconectată — adaptor/import necesar | Sursă națională specifică de identificat și evaluat; numai directorul european NAP comun |
| CH — Elveția | Neconectată — adaptor/import necesar | Swiss national public transport GTFS (national; review_required) |
| CY — Cipru | Neconectată — adaptor/import necesar | Sursă națională specifică de identificat și evaluat; numai directorul european NAP comun |
| CZ — Cehia | Neconectată — adaptor/import necesar | Prague integrated transport GTFS/realtime (prague_region; review_required) |
| DE — Germania | Neconectată — adaptor/import necesar | DELFI national timetables (GTFS/NeTEx; registration) (national; registration_required) |
| DK — Danemarca | Neconectată — adaptor/import necesar | Sursă națională specifică de identificat și evaluat; numai directorul european NAP comun |
| EE — Estonia | Neconectată — adaptor/import necesar | Sursă națională specifică de identificat și evaluat; numai directorul european NAP comun |
| ES — Spania | Neconectată — adaptor/import necesar | Spanish national transport data discovery (Hermes) (national; review_required) |
| FI — Finlanda | Neconectată — adaptor/import necesar | Digitransit Routing API (national; api_key_required) |
| FR — Franța | Neconectată — adaptor/import necesar | France national transport open-data access point (national; review_required) |
| GB — Regatul Unit | Adaptoare existente; acoperire live nereverificată | UK bus open data (national; review_required); Transport for London Unified API (london; existing_adapter); National Rail data (national; review_required) |
| GE — Georgia | Neconectată — adaptor/import necesar | Sursă națională specifică de identificat și evaluat; numai directorul european NAP comun |
| GR — Grecia | Neconectată — adaptor/import necesar | Sursă națională specifică de identificat și evaluat; numai directorul european NAP comun |
| HR — Croația | Neconectată — adaptor/import necesar | Sursă națională specifică de identificat și evaluat; numai directorul european NAP comun |
| HU — Ungaria | Neconectată — adaptor/import necesar | Sursă națională specifică de identificat și evaluat; numai directorul european NAP comun |
| IE — Irlanda | Neconectată — adaptor/import necesar | Ireland NTA GTFS national schedules (national; reuse_terms_review); Ireland NTA realtime APIs (national; api_key_required) |
| IS — Islanda | Neconectată — adaptor/import necesar | Sursă națională specifică de identificat și evaluat; numai directorul european NAP comun |
| IT — Italia | Neconectată — adaptor/import necesar | Italian NAP for multimodal transport (NeTEx/SIRI) (national; review_required) |
| LI — Liechtenstein | Neconectată — adaptor/import necesar | Sursă națională specifică de identificat și evaluat; numai directorul european NAP comun |
| LT — Lituania | Neconectată — adaptor/import necesar | Sursă națională specifică de identificat și evaluat; numai directorul european NAP comun |
| LU — Luxemburg | Neconectată — adaptor/import necesar | Sursă națională specifică de identificat și evaluat; numai directorul european NAP comun |
| LV — Letonia | Neconectată — adaptor/import necesar | Sursă națională specifică de identificat și evaluat; numai directorul european NAP comun |
| MC — Monaco | Neconectată — adaptor/import necesar | Sursă națională specifică de identificat și evaluat; numai directorul european NAP comun |
| MD — Republica Moldova | Neconectată — adaptor/import necesar | Sursă națională specifică de identificat și evaluat; numai directorul european NAP comun |
| ME — Muntenegru | Neconectată — adaptor/import necesar | Sursă națională specifică de identificat și evaluat; numai directorul european NAP comun |
| MK — Macedonia de Nord | Neconectată — adaptor/import necesar | Sursă națională specifică de identificat și evaluat; numai directorul european NAP comun |
| MT — Malta | Neconectată — adaptor/import necesar | Sursă națională specifică de identificat și evaluat; numai directorul european NAP comun |
| NL — Țările de Jos | Neconectată — adaptor/import necesar | NDOV public transport feed (agreement needed) (national; agreement_required) |
| NO — Norvegia | Adaptor Entur implementat; implicit OFF; live neverificat | Entur Journey Planner v3 (national; attribution_required) |
| PL — Polonia | Neconectată — adaptor/import necesar | Sursă națională specifică de identificat și evaluat; numai directorul european NAP comun |
| PT — Portugalia | Neconectată — adaptor/import necesar | Sursă națională specifică de identificat și evaluat; numai directorul european NAP comun |
| RO — România | Adaptoare existente; acoperire live nereverificată | Romanian rail timetable data via data.gov.ro (national; review_required); Bilo: documented Romanian rail and bus source attribution (national; review_required); Infofer national rail timetable (national; review_required); Romania transport NAP (national; review_required) |
| RS — Serbia | Neconectată — adaptor/import necesar | Sursă națională specifică de identificat și evaluat; numai directorul european NAP comun |
| SE — Suedia | Neconectată — adaptor/import necesar | Trafiklab public transport open-data APIs (national; registration_review) |
| SI — Slovenia | Neconectată — adaptor/import necesar | Sursă națională specifică de identificat și evaluat; numai directorul european NAP comun |
| SK — Slovacia | Neconectată — adaptor/import necesar | Sursă națională specifică de identificat și evaluat; numai directorul european NAP comun |
| SM — San Marino | Neconectată — adaptor/import necesar | Sursă națională specifică de identificat și evaluat; numai directorul european NAP comun |
| TR — Turcia | Neconectată — adaptor/import necesar | Sursă națională specifică de identificat și evaluat; numai directorul european NAP comun |
| UA — Ucraina | Neconectată — adaptor/import necesar | Sursă națională specifică de identificat și evaluat; numai directorul european NAP comun |
| VA — Statul Cetății Vaticanului | Neconectată — adaptor/import necesar | Sursă națională specifică de identificat și evaluat; numai directorul european NAP comun |
| XK — Kosovo | Neconectată — adaptor/import necesar | Sursă națională specifică de identificat și evaluat; numai directorul european NAP comun |

## Ce rămâne efectiv de făcut

- **RO/GB:** inventar și probe reale ale serviciilor/feedurilor deja configurate;
  extindere pe operatori și localități, nu numai nume de țări sau orașe în registru.
- **NO:** revizuire condiții/atribuire/limite și confidențialitate, probe live,
  teste cu orare reale și optimizarea verificării geografice pentru rute complexe;
  activare/publicare numai după acordul explicit al utilizatorului.
- **Celelalte 46:** integrare și validare după sursa/protocolul propriu. Prioritate
  tehnică: surse naționale documentate; acolo unde sunt doar date GTFS/NeTEx, sunt
  necesare importuri și router propriu, nu doar adăugarea unui URL în Worker.
- Țările din afara catalogului european nu sunt implementate prin această etapă.
  Obiectivul „orice localitate din orice țară” rămâne obiectiv, nu funcție dovedită.
