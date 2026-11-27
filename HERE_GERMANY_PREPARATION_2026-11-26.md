# HERE pentru Germania — pregătire locală, NEACTIVATĂ

**26 noiembrie 2026 · Producția rămâne backend v185 / APK 501884.**

## Decizia aplicată

HERE este opțiunea aleasă pentru Germania. Un traseu A→B real, furnizat de API,
este util și fără orar: afișăm îmbarcarea, coborârea, linia, transferurile și
numărul de opriri numai când datele permit calculul. Nu fabricăm ore sau stații.
Când orarul lipsește ori HERE îl estimează, mesajul este explicit:
**„Traseu orientativ; orarul nu poate fi garantat. Verifică la operator.”**

Serviciile gratuite / cotele gratuite lunare au prioritate. Nu activăm un
abonament sau consum cu plată decât după ce aplicația este profitabilă și
utilizatorul aprobă separat.

**Actualizare după pregătire:** utilizatorul a creat contul HERE și aplicația,
apoi a confirmat că a salvat cheia în Cloudflare. Valoarea cheii nu a fost
citită sau verificată de agent. Capturile arată Base Plan activ, taxa fixă Self
Serve Account 0 EUR, Public Transit cu cantitate 0 și praguri de preț.
Nu confirmă ciclul UTC, soldul curent complet sau eligibilitatea utilizării.

Utilizatorul a aprobat publicarea numai a backendului și testarea numai după
verificarea protecției cotei gratuite, apoi a cerut mai puține teste decât 6.
**Limita convenită: maximum 2 încercări HERE în total**, una locală și una
interurbană, inclusiv erorile, fără retry și fără reluarea bugetului la rerun.
**Efectuate până aici: 0. Nu s-a publicat backendul și nu s-a pornit workflow.**

## Ce există în cod

- Adaptor separat `here_national_transit.mjs`; nu reutilizează protocolul MOTIS.
- Endpoint fix `https://transit.router.hereapi.com/v8/routes`, cheia exclusiv în
  backend. O singură cerere HERE per căutare, inclusiv alternativele cerute;
  fără retry, paginare, căutare secundară de autobuze sau fallback cu plată.
- Doar **DE→DE** în transportul național, după verificările independente ale
  țării GPS și destinației. Toate punctele/stațiile returnate sunt reverificate
  cu mecanismul domestic comun. Acesta verifică puncte, nu fiecare metru al
  frontierei traversate de șosea/șină. Peste bugetul de verificare al stațiilor,
  varianta nu este afișată; nu pretindem acoperire națională completă.
- Registry selectează HERE dacă este complet configurat. MOTIS rămâne opțiune
  separată; epuizarea cotei HERE NU trece automat la MOTIS sau alt serviciu.
  FI/EE, UK și România își păstrează adaptoarele existente.
- `noSchedule` din schema oficială HERE => ore aproximative, `estimated`.
  Orele lipsă => `unavailable`. Ambele păstrează traseul ca orientativ, fără
  recomandare „poți prinde plecarea”, oră de plecat pe jos sau comparație de
  sosire cu mersul pe jos. Timestampurile estimative primite rămân vizibile,
  marcate orientativ; nu sunt transformate în orar confirmat.
- În lipsa `noSchedule`, orele complete sunt tratate ca programul comunicat de
  provider, NU ca garanție de funcționare / actualizare live. Nu deducem realtime
  numai din prezența timestampurilor. Nu folosim parametrul inventat
  `routingMode=estimated`.
- Întreaga atribuire de la fiecare secțiune este păstrată, cu text și URL,
  inclusiv peste 700 caractere; UI folosește text sigur, nu HTML de la provider.
  Atribuirile HERE apar și lângă lista opțiunilor, și în detaliile selectate.
- Stațiile intermediare primite sunt păstrate și verificate. Dacă lista este
  disponibilă, identificatorii sunt unici și nu există `noIntermediate`, numărul
  opririlor până la coborâre = stații intermediare + 1. Altfel rămâne necunoscut.
- Traseele critice/neviabile/anulate, modurile necunoscute/avion și răspunsurile
  invalide sunt refuzate. Redirecturile nu sunt urmate, cheia nu este redirecționată.
- Nicio geometrie de drum, rută pietonală verificată, tarif sau disponibilitate
  de locuri nu este inventată. Selectarea traseului fără orar deschide detaliile,
  nu pornește automat o navigare bazată pe prinderea unei plecări.

## Plafonul gratuit: oprire, nu doar alertă

`here_transit_budget.mjs` implementează un Durable Object separat,
`HereTransitBudget`, cu tranzacții persistente. Un singleton fix este comun
cererilor din aplicație: **nu** este contor per utilizator, per proces sau KV
neatomic. Namespace-ul comunicării existente nu este modificat.

- Plafon implicit: **4.500 rezervări de cerere / lună UTC**, sub referința publică
  de 5.000 tranzacții Public Transit gratuite/lună. Poate fi redus la 1–4.500;
  valorile invalide sau mai mari nu configurează serviciul.
- Fiecare încercare rezervă înainte de accesul HERE; se numără inclusiv erorile,
  timeouturile, răspunsurile fără rute și rezultatele refuzate ulterior.
  Nu există refund, retry sau coadă de plată.
- La plafon: `free_quota_exhausted`, zero cereri HERE suplimentare. Dacă nu se
  poate confirma/salva contorul: `budget_unavailable`, tot zero cereri HERE.
- Repornirea Workerului nu resetează contorul; resetarea normală este numai la
  o lună UTC ulterioară. Date corupte sau ceasul întors înapoi => blocare.
- `wrangler-backend.toml` include **doar pregătirea locală** a bindingului și
  migrării SQLite `here-transit-budget-v1`, nu activarea providerului.

### Limitele garanției financiare — condiții înainte de activare

Contorul limitează traficul trimis prin **această integrare**, nu contul HERE
în ansamblu. Nu poate observa alte aplicații/chei/Workers, apeluri manuale,
utilizarea anterioară pornirii lui sau alte produse facturate. Nu reprezintă o
confirmare că HERE ori Cloudflare garantează zero costuri pe cont.

Activarea rămâne blocată până când sunt verificate explicit:

1. Planul HERE curent permite dezvoltarea și viitoarea utilizare comercială a
   acestei aplicații GPS, inclusiv restricțiile Base Plan. Tarifele publice sunt
   referințe, nu contractul contului. Nu promitem eligibilitate sau lipsa unui
   card obligatoriu fără verificarea efectivă a condițiilor.
2. Alocarea de tranzacții, contorizarea alternativelor/erorilor și perioada de
   resetare **coincid cu luna UTC** folosită aici. Dacă nu coincid, nu se setează
   gate-ul de mai jos: trebuie adaptat contorul înainte de activare.
3. Contul/alocarea Public Transit este exclusiv pentru acest singleton; niciun
   consumator extern nu folosește aceeași cotă. Înainte de primul apel se
   verifică soldul deja consumat; plafonul acestei luni se reduce la soldul
   gratuit rămas, cu marjă de siguranță. Dacă este epuizat, providerul rămâne OFF.
4. Toate instanțele de producție folosesc același binding/namespace și nume fix.
   Nu se șterge namespace-ul, nu se schimbă numele singletonului și nu se
   reconstruiește contorul în aceeași lună fără reconcilierea consumului HERE.
   Un mediu de test cu același cont NU primește un buget independent.
5. Sunt verificate și limitele/costurile Cloudflare Workers/Durable Objects și
   verificărilor geografice existente. Nu se comandă upgrade/abonament pentru
   această etapă. Un hard-stop furnizat de contul HERE, dacă este disponibil,
   trebuie folosit suplimentar; existența lui nu este încă confirmată.
6. Sunt aprobate separat activarea, testele live și publicarea interfeței/APK.

**O marjă de 500 nu rezolvă consumul extern sau un ciclu de facturare diferit.**
Dacă o condiție nu poate fi îndeplinită gratuit, integrarea rămâne oprită.

## Configurație viitoare — NU setată remote

Nu trimite cheia în chat. Numai după verificările și aprobările de mai sus:

| Nume | Rol |
|---|---|
| `HERE_TRANSIT_API_KEY` | Secret backend, niciodată frontend/APK |
| `HERE_TRANSIT_ENABLED` | `true` numai la activarea aprobată |
| `HERE_TRANSIT_TERMS_REVIEWED` | `true` numai după verificarea drepturilor de utilizare |
| `HERE_TRANSIT_FREE_TIER_REVIEWED` | `true` după verificarea cotei/consumului inițial și blocării costurilor |
| `HERE_TRANSIT_EXCLUSIVE_ACCOUNT` | `true` numai dacă nu există consumatori ai cotei în afara acestui singleton |
| `HERE_TRANSIT_UTC_MONTH_REVIEWED` | `true` numai după confirmarea ciclului UTC compatibil |
| `HERE_TRANSIT_MONTHLY_LIMIT` | Întreg 1–4.500; implicit 4.500, redus la soldul gratuit rămas la prima activare |
| `HERE_TRANSIT_BUDGET` | Binding Durable Object; lipsa lui blochează serviciul |

Niciun flag sau secret HERE nu a fost adăugat configurației live. Configurarea
cheii în dashboard și apăsarea Deploy sunt acțiuni distincte; nu activăm acum.

## Verificări executate

**Doar local/sintetic, fără cheie sau apel autentificat HERE:**

- 7 teste adaptor/policy/response + 2 teste Worker/backend.
- 2 teste contor: runtime Workers local cu SQLite, 60 cereri concurente la un
  plafon de test 7 => exact 7 permise / 53 blocate; după repornire rămâne blocat.
  Separat: lună nouă, date corupte, ceas invers, eroare de stocare și plafon invalid.
- Browser Chromium la 360/393/430 px: fără orar + ore estimative, stații/linie,
  atribuire lungă integrală, fără calcul de prindere a plecării sau overflow.
- `npm run test:national-transport`, `npm run test:transit-audit`,
  `npm run test:national-transport:browser`, `npm run check` — PASS.
- Împachetare backend și frontend `wrangler deploy --dry-run` — PASS,
  **nu deploy**. Contractul cererii și câmpurile normalizate au fost verificate
  față de documentația/schema oficială; nu pretindem validare JSON Schema completă.

Comandă dedicată: `npm run test:national-here`.
Testele de browser folosesc `CHROMIUM_PATH` și bibliotecile locale necesare.
Testul contorului necesită Miniflare local; nu utilizează resurse Cloudflare remote.

## Ce NU este încă verificat

Eligibilitatea utilizării concrete, soldul actual complet și ciclul cotei, acoperirea rutelor
HERE în Germania, exactitatea în teren și respectarea vizuală finală a tuturor
condițiilor contului HERE. Nu există dovadă de traseu live HERE, deploy, APK nou,
contact comercial, achiziție, modificare Oracle sau merge în main.

## Referințe oficiale consultate

- Schema și parametrii: https://transit.router.hereapi.com/v8/openapi
- Exemplu A→B: https://docs.here.com/transit/docs/route-example
- Atribuiri: https://docs.here.com/transit/docs/copyrights
- Acoperire/limite de calitate: https://docs.here.com/transit/docs/coverage
- Preț public de referință: https://www.here.com/get-started/pricing
- Restricții: https://www.here.com/get-started/pricing/base-plan-restrictions

Raportul comparativ anterior rămâne istoric:
`GERMANY_PROVIDER_COMPARISON_2026-11-26.md`. Alegerea HERE și acceptarea rutelor
orientative din acest document înlocuiesc recomandarea anterioară de a aștepta
oferta MOTIS sau de a refuza toate variantele fără orar confirmat.
