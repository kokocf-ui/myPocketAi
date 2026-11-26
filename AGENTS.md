# AGENTS.md — Evidența Proiectului & Continuitate între Sesiuni (`kokocf-ui/myPocketAi`)

> **CITEȘTE ACEST FIȘIER LA ÎNCEPUTUL ORICĂREI SESIUNI NOI.**
> Istoricul conversațiilor dintr-un chat anterior NU se transferă automat într-un chat nou, dar acest fișier + fișierele de audit din repository + `git log` pe `main` păstrează evidența exactă a ceea ce este gata și a ceea ce urmează. **Actualizează acest fișier la finalul fiecărei etape majore înainte de merge în `main`.**

---

## 1. Reguli permanente de lucru cu utilizatorul

**RAPORT FIZIC APK501885 / CORECȚII LOCALE (2026-11-26, ulterior):**
User a oprit deschiderea PR pentru a raporta capturi: Grays→Victoria lista există,
selectarea cade în eroarepietonală+revine listă, mersulpejosincomplet/neclar pehartă,
număropririabsent; mixtGrays→Oradea28nov fărădatezbor și fărăalternativeutile.
NU declara APK501885 pregătit de trimis în RO/validat fizic! Nu dezinstalare.
Remedieri locale: failure păstrează selecteditinerary+detalii/eroare, invalidează
accessWalkVerified, CTAhartătoateetape chiar fărăaccesverificat/orar; hartă+finalwalk
acceptă arrivalPoint și arrivalLatLon, rejectnullcoords, toatewalksinbounds, statiimarkers,
walkstatus explicit și fără falsăverificare la timeout/limita12, reuseaccessdoarendpoints.
TfLstopcount compară naptanId/id/icsId; fărăcapete/ambiguitate rămânenecunoscut,
NU numără partiallist și NU declararezolvatăacoperireTfLlive.
Zboruri: outer25s putea pierde results în timp ce până9cereri secvențiale continuau!
Deadlinecomun22s propagat aeroport/quota/search, partialflightspăstrate, abortrest;
fără mărire plafoncereri. Taildestairports6..12 verificate și în scenariucrossborder,
nu prioritizaexclusiv primulborderairport. EmptyexactGoogleFlightsresponse e rezultatgol,
nu autherror; quota/authfail tot opresc. UIarată aeroporturigeografice+timeout/plafon,
nu ruteconfirmate. Groundenrichmentfail nu ascunde flightsprimite.
Raport `TRANSIT_PHYSICAL_REPORT_FIXES_2026-11-26.md`; test7noi și mobile360/393/430
`tests_transit_reported_failures{,_browser}.mjs`. PASStransit-audit/national/mixed/check,
browsernaționale5+mixed+regresienouă, frontend/backenddryruns+browsernames.
NUconfirmareliveGraysOradea și NU promite existăzboranumit. Niciun APIHERE sauzborlive,
ZEROHERE/max2total încăneconsumate. Backendv185neschimbat, APKcurent501885fărăacestefixuri.
Nu altAPK/deploy/Oracle/mainmerge înaceastăetapă. Cererea anterioară PR rămâne
neexecutată până verificare; PRpoatefi DRAFTpentru review, nu acorddemerge.

**APK ROMÂNIA LIVRAT 501885 (2026-11-26, etapă încheiată):**
Commit cod e7ee4d0e723eef7a96e7283957f011579994bde6, împins DOAR currentbranch.
Workflowmanual build-android-apk.yml run45879014303 job140113297567 SUCCESS,
signed-branch-preview; debugskipped. Verifică cheia/certificatidenticcuAPKpublicat,
packageai.mypocket.mobile/versionCode501885 (mai mare501884 și testelepublicate),
UIramură+3496packsEducation/lecții/cursuri. ReleaseprereleaseNOTlatest:
https://github.com/kokocf-ui/myPocketAi/releases/download/education-test-45879014303/myPocketAI-signed-education-test.apk
Asset797267170,77650828bytes,SHA256dinGitHubRESTmetadata:
1f3cccdb9333d65a8f6d943eb9890334ebd6dde684e0434cdf5de13aa9624485.
Stepscert/version/snapshot și publish/upload toateSUCCESS confirmateprinJobsAPI.
Downloadbinary și logs în sandbox blocate de hostallowlistrelease-assets/results-
receiver; NU afirma analizăindependentălocalăAPK/cert. Metadata/APIjobconfirmate.
Raport `ROMANIA_APK_501885_VERIFICATION_2026-11-26.json`, checklist românesc
`ROMANIA_APK_TEST_CHECKLIST_2026-11-26.md`. InstaleazăupdateFĂRĂdezinstalare.
LocalPASSnational-transport/transit-audit/check/Androidpreviewgen și browser5suite
360/393/430; synthetic/offlineHERE, ZEROrequestsHERE. Nu probăfizicăRO încă.
Producțiebackendrămânev185, FI/EEactive, DE/NOOFF; APKnuactiveazăHERE și nuinclude
cheia/adaptorserver; nofrontendproddeploy/noOracle/nomainmerge/noachiziție.
HEREfreecycle/eligibility gates rămânnerezolvate, nu seta fictivtrue. Limitauser2
încercăriHEREtotalfărăretry rămâneneconsumată. Nu confunda APKnoucuactivarebackend.

**APK PENTRU TESTARE ROMÂNIA — APROBAT EXPLICIT (2026-11-26, nou):**
User cere APK cu TOATE modificările curente pentru a-l trimite prietenului din RO.
Aceasta înlocuiește vechea restricție fărăAPK DOAR pentru build semnat de test și
link prerelease non-latest; nu autorizează merge main/frontendprod/Oracle/plată.
Folosește workflow build-android-apk.yml / signed-branch-preview, currentbranch,
publish_signed_apk=true, aceeași cheie permanentă, versionCode>501884 și>toate
prereleaseurile publicate. Nu construi debug ca update. UI ramură+Educationassets
bundled; backendul rămâne remote, codul HERE server nu intră în APK, nici cheia.
CapturaUsage a userului: CurrentMonth2026-11-01..26, DatesUTC, NoResults și întârziere
până2zile. Este intervalul raportului, NU expirareazi și NU dovadă completă reset/
consumzero. LimitaHERE2încercăritotal FĂRĂretry rămâne; pânăacumZEROliveHERE.
Istoric lansare build; rezultatul SUCCESS și APK501885 sunt consemnate deasupra.

**ACCES HERE CREAT DE USER / ACORD LIMITAT LIVE (2026-11-26, ulterior):**
User a creat cont HERE și aplicația myPocketAI Public, apoi a confirmat salvarea
cheii în Cloudflare; NU am citit/verificat secretul și NU îl cerem în chat.
Capturile userului confirmă subscripție activă BasePlan + SelfServeAccount0EUR,
PublicTransitMonthlyTieredPricingquantity0 și prețuri0/0.00233/0.00187EURunit.
Cota publică oficială5000free/lună rămâne referință; resetareaUTC și eligibilitatea
concretă sub restricțiile BasePlan NU au fost confirmate de aceste capturi.
User a aprobat backend-only + teste live CONDIȚIONAT de protecția cotei gratuite;
a cerut explicit mai PUȚINE teste decât6. Asistentul a redus limita la MAXIMUM2
ÎNCERCĂRI HERE ÎN TOTAL (una locală, una interurbană), incl.erori, FĂRĂ retry.
Aceasta NU autorizează câte2 la fiecare rerun, workflow sau tură! Restul offline.
Încercări HERE efectuate de agent până aici: ZERO. Niciun deploy/workflow nou.
Nu seta fictiv gates review=true și nu activa4500/lună fără verificarea ciclului,
soldului, utilizatorilor cotei și drepturilor. Consultație oficială repetată:
base-plan-restrictions definește larg Asset, incl.userapp; nu prezenta planul
ca eligibilitate GPScomercială garantată. Dacă nu pot fi confirmate condițiile,
acordul userului cere explicit să NU trimitem nici cele2cereri.
GitHub auth localOK; `gh secret list` a dat403ResourceNotAccessibleByIntegration,
NU dovadă că secretul Cloudflare lipsește, NU cere valoarea și nu loga credentiale.
Această permisiune GitHub nu confirmă starea contului Cloudflare.
Producția rămânev185+APK501884. Restricția veche „niciun cont/cheie creat” de mai
jos descrie DOAR etapa de pregătire, nu starea actuală raportată de utilizator.

**DECIZIE NOUĂ HERE / GRATUIT ÎNAINTE DE PLATĂ (2026-11-26, după a53953e):**
Această intrare ÎNLOCUIE recomandarea istorică de mai jos. User a ales HERE și
acceptă trasee A→B furnizate de API fără orar confirmat: linie, stații, transferuri,
număr opriri numai dacă furnizat/verificabil; fără ore/stații inventate. Orar real
unde există (UK neschimbat), altfel orientativ + avertisment că nu poate fi garantat.
User cere servicii/cote GRATUITE implicit, FĂRĂ abonamente până la profitabilitate
și aprobare explicită; la epuizare oprire, NU depășire/plată/fallback automat.
Pregătit local HERE DE-only `here_national_transit.mjs`, registry/policy/backend,
OFF implicit, fără APIkey/live/cont/card/contract/deploy/APK/Oracle/merge main.
MOTIS păstrat separat. Un singur GET oficial /v8/routes per căutare, alternative
în același apel, return=intermediate, fără retry/bus fallback/redirect. Schema
oficială https://transit.router.hereapi.com/v8/openapi verificată documentar:
sections[].notices noSchedule => estimated, lipsătime => unavailable/route_only,
altfel program furnizat, NU garanție/realtime. Nu routingMode=estimated inventat!
Toate punctele returnate verificate DE prin mecanism comun; nu frontieră continuă.
UI fără limitarea atribuirii700char, păstrează toate textele+URL; aici și în lista
HERE. Nulltime nu produce1970, nu calculează catchability/leaveby/sosire-vs-walk
pentru orientativ; detaliile rămân accesibile. Fără geometrie/locuri/tarife inventate.
Hardcap persistent separat `HereTransitBudget`, SQLite DO singleton fix,
rezervare atomică ÎNAINTE de fetch, incl.erori/noresult, fără refund. Default4500
cereri/lunăUTC, configurabil1..4500, failclosed indisponibil/corupt/epuizat.
Binding+migration here-transit-budget-v1 DOAR în fișier local Wrangler, nu remote;
namespacecomunicare păstrat. Gates HERE_TRANSIT_ENABLED, TERMS_REVIEWED,
FREE_TIER_REVIEWED, EXCLUSIVE_ACCOUNT, UTC_MONTH_REVIEWED (toate prefixHERE_TRANSIT_)
+SecretHERE_TRANSIT_API_KEY+bindingobligatoriu. Nicio variabilă HERE remote.
Contorul NU garantează costzero pe întregcontul: consumextern/cheialteapp/cicludiferit/
consumanterior/ștergerenamespace sunt în afara lui. Înainte de activare verifică
eligibilitatea reală BasePlan, soldul gratuit și reducerea plafonului inițial,
exclusivitate/aliniereUTC, limiteleCloudflare/geocoding. Dacă nu se pot îndeplini
GRATUIT, rămâneOFF. NU cere cheia în chat. Nu activare/deploy fără aprobare separată.
Ghid complet `HERE_GERMANY_PREPARATION_2026-11-26.md`; comparația veche e istorică.
PASS7adaptor+2Worker+2budget, inclusiv runtimeWorkerslocal60concurente→7permise/
53blocate la plafontest7, blocat și dupărestart. BrowserHERE360/393/430 cu lipsăorar+
estimated și atribuirelungă. national-transport/transit-audit/check/browser5suite
PASS, backend+frontendwranglerdryrunPASS. Nu validareJSONschema completă, nu probălive
sau fizicăHERE; acoperirea/contul/ciclul/eligibilitatea rămân neverificate.
Producția rămâne **backendv185 + APK501884**, FI/EEactive, DE/NOOFF.

**ISTORIC — COMPARAȚIE SERVICII/COSTURI DE (2026-11-26, după 4be7e8f):**
User aprobă comparația găzduire proprie vs comercială, NU achiziție/activare.
Raport nou `GERMANY_PROVIDER_COMPARISON_2026-11-26.md`: surse oficiale, scenarii
cost și email englezesc pregătit către triptix, NETRIMIS. Nu a fost modificat
codul produsului/configurația, nu teste API/live/deploy/workflow/Oracle/APK/merge.
Livrat v185+APK501884 neschimbat, DE OFF. Niciun cont/card/cheie/contract creat.
triptix: hosting MOTIS/consultanță confirmate în declarația fondatorului
https://github.com/public-transport/transitous/pull/2606#discussion_r4415897799
(2026-10-29); spune filtrează NC sau obține acorduri. Contact confirmat oficial
https://triptix.tech/legal/imprint/ felix@triptix.tech. Nu deduce acoperire DE,
APIv6 sau licență pentru myPocketAI. Pricing/docs au eșuat la fetch; PREȚNECUNOSCUT.
Cifra1000€/lună din alt comentariu e infrastructura comunitară, NU oferta DE!
HERE public pricing citit3chunks: Public Transit5000free/lună apoi2.33€/1000
în5001–200000; 1.87€/1000 la200001–1M; estimări supuse acordului. O cerere=o
tranzacție PT; Intermodal/RoutingBus au alt sens/preț. Scenarii2calls/search:
5000căutări=10000requests→11.65€,10000→34.95€,50000→221.35€, fărăalteAPI/taxe.
HERE nou candidat, NU implementat/compatibil MOTIS. Necesită adaptor separat,
identificare/reject scheduled-vs-estimated (documentează realtime/timetable/
estimated!), copii integrale sections[].attributions (UI700charNUgarantează).
BasePlan are excluderi AssetManagement/UBI/Optimization+AppID rules; trebuie
clarificat cazul aplicației GPS, nu declara automat eligibil sau interzis.
Coverage-transit e tabel paginat, citite doar primele rânduri; DE indicat în
recent-changes-transit, NU acoperire integrală verificată. Nicio probă ruteHERE.
Prețuri hardware NBG1 citite Hetzner regular-performance: CPX42 8sharedvCPU/
16GB/320GB=69.99€net/lună, CPX62 16shared/32GB/640GB=130.49€net. Sunt referințe,
NU sizing validat/totalTCO/garanție stoc (pagina include unavailable). Nu cita
prețul fromHEL1 ca prețGermania. Trebuie benchmark import/RAM/disc/refresh etc.
Navitia pricing a redirecționat Hove fără tarifDE verificabil; NU99€dinagregator.
Recomandare: ofertă triptix + clarificări HERE înainte de server/plată. User
încă NU a ales furnizor/buget/trimis oferta; continuă de aici fără alte scaffolduri
sau deploy automat. SecretDigitransitNUsefoloseșteDE. Aritmetica verificată offline,
raport/docs only; nu afirma teste software noi în această etapă.


**ETAPĂ GERMANIA / PREGĂTIRE, NU LIVE (2026-11-26, după afc0153):**
User a aprobat continuarea cu DE, fără publicări până la explicarea accesului.
Am verificat politica oficială Transitous: comercial INTERZIS; nu ocoli prin
staging/aliasuri/internal și nu folosi serviciul public nici ca fallback.
Sursă pinuită public-transport/transitous b1ce91355f2f200ff26c6bc3025297eb7eedba24,
website/content/api.html. MOTIS motor MIT != permisiune serviciu/date!
Pregătit `germany_national_transit.mjs` pentru instanță proprie sau furnizor
contractat, GET/api/v6/plan după MOTIS v2.11.4 / e020e64d048d66d076078f900bade368a58b3b22.
Fără endpoint implicit/achiziție/instalare/date importate; Germania NU conectată.
Secretele FI NU se aplică DE. Ghid GERMANY_TRANSPORT_SETUP_2026-11-26.md descrie
opțiuni și catalogul DELFI; nu inventa portal/cheie națională de rutare.
Config viitoare: GERMANY_NATIONAL_ENABLED+GERMANY_MOTIS_TERMS_REVIEWED+
GERMANY_MOTIS_DATA_REVIEWED true, GERMANY_MOTIS_BASE_URL HTTPS origin fără
cale/query/credențiale, GERMANY_MOTIS_ATTRIBUTION max500 obligatoriu. Token Secret
opțional GERMANY_MOTIS_API_TOKEN, numai Bearer dacă gatewayul ales îl suportă;
MOTIS de bază NU emite cheie. Nimic DE setat în Wrangler sau remote.
Registry6profilecuadaptor RO/GB/NO/FI/EE/DE,43fără; DE/NO OFF. DE fără config
not_connected, nu apare ca disponibilă numai fiindcă există cod. Planifică DOAR
DE→DE după GPS+destinație independente; reverifică toate opririle (max36/6.5s/4),
nu frontiera continuă a șinei/șoselei. Query moduri explicite fără avion/flex;
manual redirect fără leak token; etapizare/crono/stopuri/date/anulări; refuză
loopedCalendarSince și rezervări obligatorii. intermediateStops e fărăcapete,
spredeosebire de FIstopCalls. Fără fares/stock/geometrie/acces inventate.
PASS8adaptor+4Worker; schema request/enums/câmpuri după OpenAPI (NU fullJSONschema),
national/transit19/orientation11/check/dryruns2/browser4suite360/393/430,
HTML6991306B. Schema/parseryaml2.8.1 ignorate.bundle-check fărădependencyapp.
Script verify_national_transport_live extins DE, rulat DOAROFFLINE statusnot_run,
live_requestsfalse. Nicio probă DE publică/sintetică prezentată ca live.
**NUdeploy/NUworkflow/NUAPK/NUOracle/NUcost/NUmerge** în această etapă. Livrat
rămâne v185+APK501884. Urmează alegere infrastructură/furnizor+date+licențe+
acoperire înainte de activare; nu porni MOTIS greu în Worker/Oracle existent
fără acord/dimensionare. Austria/Elveția sunt separate, neimplementate aici.


**REZULTAT LIVE DIGITRANSIT — 2026-11-26 (prevalează asupra notelor vechi):**
User a creat abonament comercial, a salvat cheia în Worker și a autorizat explicit
backend+activare+teste live și termenii. Backend **v185**, cod publicat
9a8e50d7391dfc642416fbc66925a5c9d7792925 prin workflow backend_only
**45865953463 SUCCESS**. Cheia rămâne numai în Cloudflare, nu a fost accesată.
FI+EE ENABLED și TERMS_REVIEWED true în wrangler; NO încă OFF. Teste live public
Worker prin workflow autorizat: Helsinki local3 (tram/bus), Helsinki–Tampere3
(train), Tallinn local3 (bus/tram), Tallinn–Tartu3 (bus/train); fiecare verifică
țară, stop_countries_verified, fus, atribuire și date. FI→EE refuzat corect.
Toate pe v185, probe folosesc coordonate de test, NU prezență GPS fizică.
Regresii Eva/weather/location LIVE PASS; legacycommunication410 PASS. Fără
frontend/APK/Oracle/merge. APK existent501884 rămâne; UI din telefon NU este
actualizat prin deploy backend. Nu promite selector FI/EE în APK vechi!
Rapoarte: DIGITRANSIT_LIVE_VERIFICATION_2026-11-26.json (metadate extrase din
check annotations140068713407), DIGITRANSIT_CONNECTION_SETUP_2026-11-26.md.
Artifact live15139533771 și Eva15139558554 în runul de succes. Doar probe limitate,
nu acoperire națională integrală/Android acceptat. Registry păstrează conservator
validation_status contract_tests_only; evidența live este în raport, nu afirmă
că orice configurație viitoare a abonamentului are aceleași rezultate.
Istoric: run45865084267 oprit ÎNAINTE deploy de fixture RO vechi; actualizat test
subset+asertări metadata. Test culinary evalua ${...} ca JS: injectate funcțiile
farewell în fixture (nu schimbat produsul). Toate verificările predeploy PASS.
Run45865489809 publicat v184, prima probă vedeav183 (propagare); verify-only
45865666864 confirmă v184+EvaPASS, dar FI/EE network_error. Schimbat redirect:error
în manual, respingere3xx fără urmărire, compatibil CF; 10teste adaptorPASS inclusiv
no-key-forward/diagnostic fărămesaje brute. v185 confirmat4rute+frontierăPASS.
Nu s-a făcut request direct din sandbox către hosturi nepermise; testele sunt
workflow-ul de release autorizat către Workerul public, cu cheia folosită intern.
Următor: continuare țări; frontend/APK separat numai cu acord. Nu repeta deploy
pentru documentație. Fișiere/rapoarte vechi sunt istorice când spun defaultOFF.


**ACTUALIZARE ACTIVARE AUTORIZATĂ DIGITRANSIT (2026-11-26):**
Utilizatorul a confirmat că a salvat DIGITRANSIT_API_KEY în Cloudflare, a autorizat
publicarea backendului/testele live FI+EE („Da, mergem mai departe”) și apoi a
confirmat explicit revizuirea/acceptarea termenilor+limitelor comerciale („Da”).
Aceasta înlocuiește interdicția veche NUMAI pentru backend+activare FI/EE+probe.
FĂRĂ frontend/APK/Oracle/merge/activare NO. Cheia nu a fost citită sau cerută.
wrangler-backend: ENABLED+TERMS_REVIEWED true, backend v184; workflow existent
backend_only pe ramura curentă, fără merge. Adăugate regresii naționale înainte
și probe public Worker locale+interurbane FI/EE+frontieră refuzată după deploy.
Script smoke_digitransit_worker_live.mjs cere --allow-network, raportează numai
metadate allowlist; nu exportă secrete. Cheia este folosită de Worker, nu runner.
Verificări locale national/check/dryrun PASS. Rezultatul remote ÎNCĂ NECUNOSCUT
la scrierea acestui paragraf; vezi intrarea ulterioară înainte de afirmații live.



**ETAPĂ ACTUALĂ / DIGITRANSIT FI+EE ȘI CHEI API (2026-11-26, după78091ff):**
User cere continuarea conectărilor și linkuri/pași ca să obțină cheia și să o
introducă el în Cloudflare. NU cere cheia în chat/capturi/GitHub/APK. Nu a
revocat refuzul publicării. Raport+ghid `DIGITRANSIT_CONNECTION_SETUP_2026-11-26.md`.
Portal dat în conversație: https://portal-api.digitransit.fi/ ; Sign up/email/2FA
→ Products → produs care include Routing API → Subscribe/formular/termeni →
Profile/Subscriptions/Show. Numele exact al produsului nu e confirmat: cere
captură Products FĂRĂ chei/date personale dacă e neclar. Secret exact
`DIGITRANSIT_API_KEY` în backend **lifewise-ai-api**, nu frontend. Cloudflare
Workers & Pages → Worker → Settings → Variables and Secrets → Add → Secret.
Documentația indică Deploy ca ultim pas de aplicare; avertizat să NU îl apese
încă sub interdicția publicării. Poate obține și păstra privat cheia, apoi spune
numai „am cheia”. `wrangler secret put` poate publica: nu ocoli interdicția.
Cloudflare connector lookup: unsupported; nicio operație remote prin connector.
Cod: `digitransit_national_transit.mjs` Routing v2/planConnection, endpoint
/routing/v2/finland/gtfs/v1 documentat OFICIAL pentru Finlanda ȘI Estonia. Profile
FI/EE distincte, fus Helsinki/Tallinn, același secret și adaptor; interțări
respinse și toate stațiile verificate în țara cererii. Nu e adaptor Entur copiat;
query verificat după schema HSL UI d036f3cc710c005ec244c092a489722165311ea9,
fără câmpuri depreciate. Docs HSL site7ec6fbb56eaee2b37429086c9d5ac220b7bb1f7b.
Necesită separat KEY + DIGITRANSIT_NATIONAL_ENABLED=true +
DIGITRANSIT_TERMS_REVIEWED=true; DEFAULT OFF, nimic setat în Wrangler/remote.
Termenii/limitele produsului trebuie acceptate/revizuite, nu seta singur review.
Secret numai în headerul digitransit-subscription-key; niciodată URL/body/UI;
erorile furnizorului nu sunt expuse. StopCalls complet cu capete validate,
cronologie/anulări/moduri/goluri, bus-only local, fără fare/stock/transferuri false.
Atribuire ©Digitransit+data/oră+CCBY4.0 și OSM/ODbL în date/reply/detalii UI
(opțional, textContent, wrap). `national_transport_validation.mjs` comun NO/FI/EE
max36puncte/6.5s/4concurent; doar stații, nu frontiera continuă a șinei/șoselei,
rute complexe/flex pot fi excluse. NO regresii păstrate.
PASS9 adaptor+5 Worker noi; test:national-transport17comenzi, transit19,
orientation11/check, scheme FI șiNO, dryruns2, browser3suite360/393/430 inclusiv
FI/EE atribuire/timestamp/licențe și NO. HTML6991306B. Scheme/tooling ignorate
.bundle-check, fără dependency nouă. Scriptlive extins FI/EE, rulat DOAR OFFLINE
statusnot_run/live_requestsfalse; sandbox nu permite api.digitransit.fi/Geoapify.
Nu afirma conectat live; 5profileimplementate RO/GB/NO/FI/EE, ultimele3 OFF;
44intrări fărăadaptor. **NUDEPLOY/NUAPK/NUOracle/NUworkflow/NU PR/merge**;
ultimlivrat501884/backendv183. Urmează ajutor portal/secret în cadru autorizat,
probe reale+următoarele țări; nu publica implicit pentru a verifica cheia.


**ETAPĂ ACTUALĂ / CONECTARE PE FIECARE ȚARĂ (2026-11-26, după b707204):**
Utilizatorul cere conectări pe țări; poate verifica fizic numai Anglia și un
prieten România. Nu promite că formatul UK garantează funcționarea altor țări.
Raport/matrice 49 țări: `NATIONAL_TRANSPORT_CONNECTIONS_2026-11-26.md`.
Primul adaptor nou este NO/Entur (`entur_national_transit.mjs`), HTTP GraphQL
real implementat și integrat în gate/Worker național, dar **default OFF și
NEVERIFICAT LIVE**. Activare numai cu ENTUR_NATIONAL_ENABLED=true +
ENTUR_TERMS_REVIEWED=true + ENTUR_CLIENT_NAME valid; nicio valoare remote/în
wrangler nu a fost setată. Termenii/atribuirea/limitele/privacy încă de revizuit;
fixture-urile cu flagul true NU sunt aprobare de utilizare. Registry: implementări
RO/GB/NO, celelalte46 încă fără adaptor; `validation_status:contract_tests_only`
NO și `countrywide_coverage_verified:false`. Nu spune „toate țările conectate”.
Local + interurban NO, autobuz alternativ la <=80km; timpi/moduri/anulări/goluri
validate; opriri intermediare + capete geoverificate NO (max36 puncte/6.5s/4 în
paralel), fără cache persistent de GPS. Rute complexe pot fi respinse; verifică
stațiile, NU frontiera continuă dintre ele. Fără geometrii/transferuri/tarife/
locuri inventate. Răspuns național generic `national_transport_response.mjs`,
UI comun existent, nu suplimente Directions/UK/RO pentru noul adaptor.
Surse: repo oficial Entur MCP bb688c10d473f639411ab05faa50972e74f1d80a,
schema Entur Tavla1b117d48af5f25a0a85aefa188e2617d658a4573. Interogare validată
cu graphql16.12.0 față de schema publicată (nu API live), script offline
`scripts/check_entur_schema_contract.mjs`; schema/tooling ignorate .bundle-check.
Sandbox permite GitHub/npm, NU api.entur.io/Geoapify; nu ocoli prin workflows.
PASS9 adaptor +3 Worker; test:national-transport15 comenzi, transit19,
orientation11/check/2dryruns, browser360/393/430 coverageRO/GB/NO + detaliiEntur
sintetice. HTML6990923B. Probe live pregătite în
`scripts/verify_national_transport_live.mjs` (NO local+interurban), rulat numai
OFFLINE: statusnot_run/live_requestsfalse. Necesită acces real și config
revizuită; nu îl activa singur. **NUDEPLOY/NUAPK/NUOracle/NUworkflow/NU PR/merge**,
refuz publicare încă în vigoare; ultimlivrat501884/backendv183. Pasul următor:
condiții + live NO, surse/adaptoare/importuri pentru celelalte țări, probe reale
RO/GB; nu depinde de prieteni în fiecare țară pentru teste automate, dar nu
înlocui proba live cu fixture. Testul sourceassert city_choice_resume istoric
rămâne separat, nu declara toată suita repo verde.


**ETAPĂ ACTUALĂ / TRANSPORT NAȚIONAL PE ȚĂRI (2026-11-26, după 5aa5336):**
User vrea Transport public adaptat țării GPS, local + interurban în aceeași țară,
nu transfrontalier; România dincolo de București, o singură aplicație într-un loc
necunoscut. Raport `NATIONAL_TRANSPORT_FOUNDATION_2026-11-26.md`.
`national_transport_registry.mjs`: 49 de fișe ale catalogului european existent,
adaptoare implementate numai RO/GB; configurația separată de acoperirea efectivă,
`countrywide_coverage_verified:false`, țările neconectate NU devin suportate prin
înregistrare. Registry + Worker folosesc aceeași configurație. Notice RO/GB UI.
RO: selecție automată `romania` după verificarea țării; toate cele 42 de sloturi
județene + 4 legacy + agregat opțional încărcabile (47), stații importate reale
lângă ambele capete, planificare separată per feed, fără legături ghicite între
feeduri, bus-only păstrat, limită cumulată 150MiB JSON. În afara razelor legacy,
prag local 18km; rural/regional complet NU rezolvat. Docker dependency closure
reparată; README actualizat fără a pretinde starea remote. Național folosește
originea GPS/codul verificat, nu contexte mixte vechi; țări diferite blocate;
flagul mixt accidental nu lansează suplimente transfrontaliere. Bilo național
folosește localitatea rezolvată din GPS + destinația selectată, nu text/stale origin.
PASS `test:national-transport`13 comenzi incluzând 9 teste noi, transit-audit19,
mixed-orientation11, mixed-indicative/check/dryruns frontend+backend; browser
bundle360/393/430 RO/GB notice + DE neconectat + viewport redus. Snapshot6990923B.
Date sintetice, NU date/operatori/licențe noi sau probă de acoperire live.
Test suplimentar `tests_country_city_choice_resume.mjs` are aserțiune textuală
veche `place_context:state.placeSearchContext||null` față de condiția preexistentă
assistantGeoAllowed în index.js (nemodificat); nu slăbi protecția. Nu se declară
toată suita repo verde. Urmează surse/drepturi/importuri/validări reale pe țară și
operator, nu doar fișe. **Încă NU publicare, NU APK, NU operare Oracle, NU PR/merge**;
ultimul livrat rămâne501884/backendv183. Commit+push doar pe branch curent.


**CERERE ACTUALĂ / TRANSPORT MIXT ORIENTATIV (2026-11-26, dupăd7d9ba8):** user„Încănu”publicare/APK; cereDirections→mixtGPS→destinațiecamRome2Rio, mijloacegăsite,fărăcondițielocuriconfirmate,linkbiletepertren/autocar/avion. Raport `MIXED_INDICATIVE_PLANNING_2026-11-26.md`. Nueraînprincipiugatestoc,ci orare/continuitate+earlyreturn+GPSgeneric+selectdependentaacces. Serviciunou`mixed_indicative_search.mjs`surseindependenteterestre/aeriene,șidomestic>=30kmterestru/>=150kmaer(oriinternațional), memoizat+timeout25/20s+enrichment8.5s,păstreazăcandidați/transferslipsă. BackendincludealternativescândrevinruteRO/UK/MOTIS/TfL; nationalpublictransportindependentneactivat. OrașGPSreverseînainteasearchweb,numaicitycătreweb. `transport_ticket_links.mjs`URLsurse→siteoficialcunoscut→căutareOmioetichetată(NUofertă/inventatdeeplink);URLpăstrateînnormalizări/compactare. Detaliimixtimediatefărănetwork/GPS/navigareautomată; hartăaccesacțiuneseparată;Backrestituietoatealternativele;linkvizibilpersegmentrelevant,inclusivflight+airportground. Lipsurileorare/terminale/transferurirămânmarcate,nurutecompleteinventate. PASS26mixednonbrowser+11orientationsubset+19transit+6Eva/check/dryrunfront/backend/browserbundle360/393/430coexistențătraincoachflight/linkuri/Back; snapshot6990711B. Providerisimulați,nulive,nucertificareRome2Rio/global/stock. Nicioactivarekey/licență/feednou. **NUDEPLOY/NUAPK/PR/MERGE, nuîntrebainsistentpublicare:** refuztemporarexplicitînaceastăcerere,ultimlivrat501884/v183,următor>501884numaidupăacord. GTFSrouterseparatnepublicat. ToateschimbărilelocaleanterioareEva/Maps/transporttrebuiepăstrateînviitoarealivrare.


**CAPTURI EVA PRIMITE / DESPĂRȚIRE (2026-11-26, dupăetapa695b8d4):** cele4capturi15:26dovedesc„Bine,ne auzim mai târziu”→eseunesolicitatdespresurseprimare/secundare,8.3s,întrebareanterioarăvremeOradeaparțialvizibilă. Raport `EVA_FAREWELL_SCREENSHOTS_2026-11-26.md`. Lipsăreprodusă: clasificatorulrecunoșteaneauzimnumaifărăprefixBine. `eva_farewell.mjs`detectorcomunfullutterance,prefixe/adresare,sarcinicitate/urmatecererinoninterceptate; actfarewellseparatnuexit; fărăistoriaanterioarălamodel,scurt/variatAI+validareîntregdraft+fallbacklocalizatlaeseu/indisponibilitate. Clientfărăistoric/GPS/contextevechișiprotecțiechiarservervechitextnepotrivit. Nupretindeasocieregreșitădecereri: coduldejaarebusygate+generationguard,capturanuconfirmărace. PASS6comenzifarewell+11conversation+19transit/check/dryrunfront/backend/browserbundle360/393/430exactfraza+servereseusimulat. Snapshot6985618B<8MB. **NUDEPLOY/NUAPKNOU:** useraatasatcapturile,NUaconfirmatîncăpublicareaetapelorMaps/transport+Eva; ultimlivrat501884/backendv183,următor>501884. Incidentdemonstratreparatlocalpefixtures,NUîncătelefon/live. GTFSrouterseparatnepublicat. Cerereaatasamenteloresteacumîndeplinită;nuceredinnoiaceste4capturi.


**ETAPĂ NOUĂ / MAPS + TRANSPORT PUBLIC (2026-11-26, după501884):** raport `TRANSIT_MAPS_AUDIT_2026-11-26.md`. Transportpublicprimul, Directionsdescrieretransportmixt+mașinădintraducerileselectorului, motorseparatpăstrat. TfLapelbus-onlyconcomitentcontrolat+dedup+rezervăalternativăbusvalidată; TransCAPIpubliclocal<=80kmcereșibus-only; GTFSlocalpăstreazăalternativărutieră. `transit_stop_counts.mjs`: numărpervehiculincluzândcoborârea,numaiGTFScomplet/TfLcuambelecapete; neprecizatdefurnizoraltfel(fărăestimăriBilo/TransCAPI). Detaliicomune/feroviare/hartăinclușinumăr; merspietonal/transfer/navigare/reluarenativăpăstrate. PASS19comenzitest:transit-audit/check/dryrunfront+backend/browserbundle360/393/430; snapshot6982621B<8MB. Providerisimulați,nuprobăserviciirealetoatețările/navigațiefizică. Regexharnessnationalactualizatsemnăturăpreexistentă3argumente,nuschimbatgeocodare. **NUDEPLOY/NUAPKNOU/PR/merge**; ultimlivrat501884/backendv183. Noilemodificărinecesităacordpublicare+APK>501884; GTFSrouterseparatnepublicat. **IncidentEvaNOUîncănereprodus:** fărăatașamentenoiidentificabile; cerutretrimisîntrebarea+răspunsul/captura, nupretinderezolvat. TraducereaAPKîncontinuareamânată.


**CERERE ACTUALĂ AUTORIZATĂ / EVA+METEO+CREATOR (2026-11-26):** utilizatorul AUTORIZEAZĂ explicit publicarea backendului și cere APK finaltoatemodificările>501883. Captură: „Cum vrei tu,dar Costi,cred căesteperfect” dupăîntrebareanume NUtrebuiecercetarecântăreț. Eva feminină. Vremesfatdupăcondițiireale/umbrelălaploaie, orașGraysfărăSouthStifford; locațiefărăcoduripoștalecandidate; atingereavataropreștevoceașiînchideavatarulpestelocație. Creatorul: domeniiseparatepensiune/hotel/restaurant/cafenea/barșipaginiprofesionale.
- Raport `EVA_WEATHER_CREATOR_2026-11-26.md`; moduleidentity/weather și gatecomun+APIv183, numepreferatconfirmatfărăAI/search, sfaturinumericeînurmătoareleore, candidatpostcodeascuns(textșipayload), tap/×stopvoice/nativ/browser/animație+închidefărăaînchidelocația. Surfațaavatarpointer-eventsactiv, buton×accesibil, exitconfirmationpăstrat.
- Creator:10scheme×4grupuridatedistincte,sursăunică`creator_business_profiles.mjs`, editorseparatscroll/focus/Back, drafturipesubtipdoarînsesiune; galerie/previewHTML/AItyped, contactmailto/tel, compozițiimaisobreșiilustrațiidistincteetichetateconcept. CâmpurileîntregiînHTML,rezumatlimitatcătreAI; nunumepreț/stele/reviewsinventate. RezultateAIîntârziateinvalidatelamodificări. NupromiteStudio/rezervăriplătifuncționalenou; Studioindependentnuredeployat, niciunsiteclientpublicatautomat.
- PASSunități+57/57preflightbackend; mobilebundle360/393/43010domenii/drafturi/400pxkeyboard+tap/×vocebridgesimulat. Metodefiziceîncănevalidate. Testtutorharnessactualizatbuget3200PREEXISTENTșidependențăeducationExerciseInstruction, numaitest. VecheaeroareStudioimageFULLSCENEneatinsă. Deploymentbackend-onlyworkflowmanual+liveprobespregătit. **LIVRAT501884+BACKENDv183PUBLICAT:** deploypasSUCCESSrun45846296656sursă9ae99ac; runîntregFAILdinsmokecereagrayspentrupunctGPSsinteticcereversearatăSouthOckendon(NUforțaniciodatăGrays). Verificare-only45847046647SUCCESS, fărăredeploy, Costinopersonsearch/meteoactual/codurineconfirmateascunse/socialPASS;frontendSKIPPED. Appcommit85fec9de682848b8ac94f41c9e6b7975a4ea6753, APKrun45847070121SUCCESS(certificat/identitate/versiune/snapshotverificate,debugSKIPPED),prereleaseeducation-test-45847070121NUlatest,asset796461877/77647460B,digestGitHubsha256:a670b078ee824e100a4d42c4b439353eaa350eca1f0c2d362eb0212b353c4d1e. Direct https://github.com/kokocf-ui/myPocketAi/releases/download/education-test-45847070121/myPocketAI-signed-education-test.apk . Updateaceeașicheiefărădezinstalarepeste501883. Snapshotfinal6981550B;browserfinal4suitesPASS;UI100/102numaicele2istorice. Raportliveartifactexistă,dardownloadeșuatEOFhostBlobextern;asserțiuni/concluziipașiverificateAPI,nurecitatextulAInevăzut. AșteaptăfeedbackfizicAPK;următorul>501884.** FărăPR/merge/frontenddeploy/latest, fărăOracle/schema/translatoramânat.


**CORECȚIE NOUĂ MAXIME / BANCURI / ASISTENT (2026-11-26, după acceptare vizuală501882):** capturile sunt EXEMPLIFICATIVE, nu listă de copiat/atribuit. Numele autorului singur, fără „autorul este”/„De…”. `fun_editorial_content.mjs` înlocuiește cele365maximesintetice:36intrări verificate (25atribuite/6autori +11proverbe fără autor); pasajul popular „Unde-s doi…” atribuit corect luiVasileAlecsandri. Original/operă/localizator/link/drepturi/traducereproprie stocate; sursa pliabilă, explicația separată editorial. Rotație36zile, NU365unice. Bancuri30dialoguricomplete cu umor cotidian românesc, fără combinare de fragmente; selecție fixată/listă separată păstrate.
- `assistant_understanding.mjs`: gateconservatorcomunclient/server, sensneclar≠adresă; expresii/metafore/corecții/sarciniinformative înaintea doveziigeografice; nuGPS/contexttraseuvechipentrucereregenerală; controale/locuri/cererilocaleexplicitspatialepăstrate. Promptultimulmesaj+oîntrebareclarificare, varietateexemple/perspectivefărăinventarefapte; detectareaproximativăultimele3răspunsuri, retryAImaxim1. ModificăriserverNUpublicate, vor necesitadeployseparatautorizat; APKconținefrontendnou, darfoloseșteAPIremoteexistent.
- Raport `EDITORIAL_ASSISTANT_2026-11-26.md`. Unităținoi+conversation+16regresiifocalizate, surse36/30; mobilebundle393/360toate36surse/nume+5cererifărăGPS/stalefields; regresieDivertisment393/360/430PASS. `npm run check`, dryrunfrontend/backend/nameguard/snapshotPASS; snapshot6960616B<8MB. AI/provideri simulați, nuprobăcalitativămodeldeployed. `tests.mjs:27`2000!=5000 identicpeHEAD1866535; nureparatcolateral. **LIVRAT501883:** appcommit `b448f2b9516412c1771719a0140af364cb2b740f`, run45841412388SUCCESS, semnare/certificat/identitate/versionCode/snapshotverificate,debugSKIPPED; prerelease `education-test-45841412388`NUlatest,asset796329101/77641360B,digestGitHub `sha256:1f26d943e70e508270c235113d5ec24cd174b3852488a52c25029d5feaa1fe27`. Direct https://github.com/kokocf-ui/myPocketAi/releases/download/education-test-45841412388/myPocketAI-signed-education-test.apk . Aceeașicheie,updatepeste501882fărădezinstalare. Buildintermediar45841006585aREUTILIZAT501882dinmarkerreleaseabsent,NUlivrat; release marcat superseded, markerrestaurat+allocatorrobustAPK/versionCode. `test:ui`100/102 dupăactualizareharnessVMculinar(noiledependențestate/helper),numaicele2istorice; suitefocalizateși testconversationPASS. **Serverul NUeste deployed**, solicităacordseparatpentruactivarecompletă. FărăPR/merge/deploy/latest; așteaptăfeedbackAPK. UrmătorulAPK>501883.


**CORECȚII NOI DIN CAPTURI FIZICE APK501881 (2026-11-26):** vocalul vechi încă „Așteaptă livrarea”; nu fabrica receipt. Fotografiile trebuie direct în conversație; salvarea Android trebuie funcțională. Revizuire TOATE opțiunile Divertisment: interpretare astrogramă, bancuri coerente cu selecție fixată/listă separată, Sudoku/integrame; scoate Rebus; definiția →/↓ selectează direcția și introduce cuvânt întreg, nu literă cu literă. Implementat în `communication_media_ui.mjs`, `PocketAttachmentExport.java`, modulele `extra_fun_*`: inline images E2EE/cache curățat; export SAF first-party11MiB cu rezultat salvat/anulat/eroare; receipt și din conversație preluată (pending_messages nu mai singura cale), batch80/inflight/dedup/zeroackrespins, diagnosticvizibil, niciun receipt fabricat. Incidentul real NUeste demonstrat rezolvat. Bancuri22dialoguricomplete (fărărecombinare), selecțiefixată; maxime365variatecu24temeexplicațielegate; astrogramă156combinațiisimbolice+legendă/limite; horoscopzilecutemetextcoerente; Rebusascuns, Sudoku/integrameînferestrededicate, tastaturănumericăinternă+undo, definițieeditorcuvântîntreg+intersecții+normalizarediacritice. AndroidBack/visualViewport/Tab/Escape.
- Raport `CHAT_MEDIA_ENTERTAINMENT_2026-11-26.md`. PASSbrowserebundle393/360/430toate4opțiuni+chatWebCryptoreal+imaginiambele sensuri+SAFsimulatcu3rezultate+receiptfărăpending501; unitățimedia/astro156+Divertisment+chat/Oracle/e2e/check/snapshotPASS. FărătestfizicSAF/Oracledouătelefoane, geocodersimulat. **LIVRAT501882:** appcommit `ea16a87290ab3950a30a3dbf2e0d93e9ac003a22`, run45835785202SUCCESS(compileJava/semnare/verificarecertificat+identitate+versiune+snapshotSUCCESS,debugSKIPPED),prerelease `education-test-45835785202`NUlatest,asset796190334uploaded77634768B,digestGitHub `sha256:315e0c05bad0c76919f77619da912353aa4add5cad11619aacc4e7c11fb747e3`. Direct https://github.com/kokocf-ui/myPocketAi/releases/download/education-test-45835785202/myPocketAI-signed-education-test.apk . Updateaceeașicheiefărădezinstalare,peste501881. HTMLprod7011578B/Worker7348378B/rawsnapshot6936845B. Regresiibrowsercontainment+practice19PASS;109/111UIaceleași2istorice. `test:android`areîncăofailureregulăglobalăshopping:window.confirmPREEXISTENTînpractical_workshop_ui(doveditîn4817108),celelalte7comenziAndroidPASS. LogbrutCIhostexternEOF; concluziipași/noterelease/assetverificateAPI. AșteaptăfeedbackfizicSAF+confirmarevocalvechi; următorulAPK>501882. FărăPR/merge/deploy/latest. Nu pretinde livrarea vocalului vechi reparată și nu repara traducerea amânată în această etapă.


**CERERE ACTUALĂ / MOTOR LIMBI PENTRU TOATE VARIANTELE + CHAT VOCALE (2026-11-26):** utilizatorul vrea aceleași funcționalități la toate limbile, preferă propoziții create de asistent după situație (aeroport/bucătărie/restaurant/cumpărături/saluturi), nu numai șabloane statice. Captura chat arată vocale fără oră/trimis/primit/citit/redat; întreabă despre întârziere. Implementate `foreign_language_practice{,_ui}.mjs`: motor comun14limbi/19variante, nivel+situație/proprie+obiectiv(conversație/gramatică/vocabular/ascultare),6exemple+exerciții înfereastrăpaginată, încă6explicit/evitareduplicate/TTStarget0.8/0.4/checkdupăreperAI/cancel/Back/cacheultimsetvalidmarcatoffline. Accesprimarcapitole+toatetaburileresurse. Limbiclasice: contextistoric/lectură,nuaeroportantic. FoloseșteAPIeducațieexistent `foreign_language/practice`, fărăbackendnounicideploy. JSONnevalid/incomplet/identitategreșită/duplicatrespins,timeout60s/staleguard; conținutAIorientativ,nucertificare/verificarelingvistică. Pacheteleresursestaticerămânintroductive,numaien-GB/USauextindereastaticăanterioară; NUpretindeegalareaconținutuluistaticpentrutoatelimbile.
- Chat: footerullipseatotaldin`buildInlineVoice`deșireceipturiexistau; restaurateora/direcție/staresubbarăfărăbutoanesuplimentaresauoverlap. `played_at`confirmăÎNCEPEREAredării,nuaudițieintegrală: etichetă„Redareconfirmată”,legendaexplicităînmeniuchat; Citit≠Ascultat. Playerulpăstratlapoll,propriavocalăNUconfirmăredareladestinatar;receipturieșuatecuretry/batch80.
- `communication_delivery_ui.mjs`:pendingrowvizibilcriptare/trimitere/secunde/confirmare/fărăconfirmarepentruTEXT/AUDIO/FIȘIERE, timpclientpânălaconfirmareSERVER(nulivrare);POST60s/probe4s;timeout/lostack=rezultatnecunoscut,nufals„netrimis”. RetryexplicitacelașiID/payloadcriptat+dEdUPOracleexistent; mainSendpentrutextneschimbatrefoloseștejob,voice/filela fel; nuștergeciornanouăscrisăîntretimp. Joburinumaiînmemoriasesiunii,nunououtboxdurabil. Chatdeschisvizibilpoll3s(anteriormesaje8s),contacte/liste8s/background16spăstrate; statusultimcheck/eșec/timptrimitereselectată. **NUesteinstant/WebSocket,nuafirmatbenchmarkreal**. FărăschimbareOracle/schema/deploy; criptare/semnătură/permisiunipăstrate,nuchatprivattrimislaAI.
- Raport `ADAPTIVE_LANGUAGES_CHAT_RECEIPTS_2026-11-26.md`. Testenoibrowserpebundle:19variante×2seturi/toate4obiective/scenarii/cache/eșec/cancel/430px;chat393/360/430WebCrypto+audiorealcuOraclesimulat,footergeometrie/receipt/ownplay/retry/poll3s/pending/lostackidempotent/draftnou/fișiere/legendă. Regresiiresurse/containment/workspace/inputșiunitpacksPASS;108/110comenziUI(102istorice+8comunicare)aceleași2eroriistorice. Snapshotraw6911637B<8MB. FărăAI/TTSfizic/Oracledouădispozitiveverificat,traducereaAPKnedecalaratăreparată. UrmeazăbuildsemnataceeașicheieversionCode>501880,ramuracurentă; fărăPR/merge/deploy/latest. **APK501881LIVRAT:** appcommit962cb3272680113e0d4938692210dec90e5ac61b,run45830522404success(certificat/identitate/versiune/snapshotverificate,debugskipped),prerelease `education-test-45830522404`NUlatest,asset796055249uploaded77627300B,digestGitHub `sha256:48a0873c6af8123b86839be5f32fe6951fb82eb464e23fa4f0777cf0de37889f`. Direct https://github.com/kokocf-ui/myPocketAi/releases/download/education-test-45830522404/myPocketAI-signed-education-test.apk . Updateaceeașicheiefărădezinstalare,peste501880. HTMLprod6986371B/Worker7322860B. Așteaptăfeedbackfizic; nuafirmaAIlingvisticperfect,chatinstant/măsurareOraclelive/ascultareintegrală. MotorulfoloseșterutaAIexistentă,nuestenecesardeploybackendnou.


**CORECȚIA NOUĂ / SUPRASEDEAZĂ DESIGNUL INLINE DIN APK501879 (2026-11-26):** utilizatorul a instalat501879 și a trimis8capturi: cartonașeLimbi/search încăsuprapuse, ghid4fraze/gramatică2teme/audioopțiuninumere+lentaproapeidentic; workspace nu trebuie amestecatcuteme, rezultateNUsubformular. Regula explicită: **un ecran, ferestre delimitate/derulabile sau paginate, fără căutare prin derularea paginii principale**. Implementat `education_lesson_workspace.mjs`: lansator → dialogseparat, intrareprima dupăclasă la8materiinaționale, cerințăproprie fărătemăobligatorie+selectoropțional, cheidraftvechi păstrate. Reperlocal+AIverificare/metodă/soluție încititorpaginat, revenirelaciornă/redeschiderezultat/cancelclose/Back. Toateuneltelecomune păstrate. Nu mai considera vechiul panoucomunMath acceptat.
- CartonașeLimbi:blockflow (vechiulflexcolumn+wrap+basis100%creacoloaneorizontale); navigareLimbi cusingurpanoudelimitatdeasupradockului; search/metadate înfluxfărăcompresie. Gramatică/ghid: unmaterialodată, anterior/următor/finalexplicit, explicațiepliabilăpăstrată. Audio: denumire+sens/context+poziție, toateintrările+formelepachetului, săgeți; NUMAIcomparațietextuală.
- **Extindereconținutnumaien-GB/en-US**: fiecare36intrări,12temegramaticale,6situațiighid,50rânduriforme,86modeleaudio; conținutulvechipăstrat exact. Alte17variante rămânintroductive, nu pretindeextindereegală/cursCEFRcomplet. JSONcanonice,hashrefreshnumai, sursăunică/traducerecomunăpăstrate. Total19pachete132904B (260intrări/47teme/230forme/55grupuri însumatepevariante).
- AudioJSbrowser+Android0.80normal/0.40lent; Javaclamp0.30–1.15 înlocuiește0.65–1.15, invalidează/opreșteenunțulvechi înaintearatei, verificăeroareasetSpeechRate. PASSbridgepayload/contractJava nu înseamnăpronunțiesauvitezăverificatepe telefon. APKtraducererămâneamânată/deschisă.
- Raport **`EDUCATION_SEPARATE_WINDOWS_2026-11-26.md`**. PASSbundle+touchgeometry393/360/430, cartonașerealefărăoverlap,8materiimenurian/clasă+modal+paginarerezultat+drafts,19variante/audio86+bridge0.8/0.4/12teme,8input,36practical,study/sciencebrowsere,check/hash/contracts/snapshot. UI100/102 aceleași2eroriistorice, rezultatelocale `.bundle-check/mobile-window-ui-results.json`. HTMLprod6957968B/rawsnapshot6883618B/Worker7293518B. FărăfizicAI/TTS/stylusverificat. UrmeazăAPKcorectivsemnataceeașicheie,versionCode>501879,dinramuracurentă; fărăPR/merge/deploy/latest. Nu pretindebuildreușitînainteaconfirmăriiCI. **LIVRAT501880:** aplicațiecommit8b7fa58ea787e839376e082aa7dd567469f30300, run45826031309success (certificat/identitate/versiune/snapshotverificate,debugskipped); prerelease `education-test-45826031309`NUlatest,asset795945895uploaded77619232B,digestGitHub `sha256:20170c72304f6881e12dca9ff96f3b71ada16c67bece7e94d1b36862e348589a`. Linkdirect https://github.com/kokocf-ui/myPocketAi/releases/download/education-test-45826031309/myPocketAI-signed-education-test.apk . Aceeașicheie,updatefărădezinstalare,peste501879. Așteaptăacceptarepe telefon; viteză/pronunție/traducereNUverificatefizic.


**CORECȚIE ACTUALĂ DUPĂ TEST APK FIZIC (2026-11-26):** utilizatorul a trimis3capturi: resurse Limbi vișinii și taburi aparent inerte; profesor AI câmp/butoane comprimate; Matematică RO VIII intervale, activități/workspace suprapuse. Nu considera testele browser anterioare dovadă că APK-ul arăta corect. Implementate: paletăalbastră generală; resurse cu headercompact/taburi2×2/corpderulabil unic, titluactiv, scrollreset, notepliabile păstrate; taburiinactive până la packvalid (evitănull). Tutor cu headersingur și corpderulabil, textarea104px minimum, unelte/acțiuni în flux fărăcompresie; busy/controller locale, cancelclose și retry. Mathnationalpanel cu workspace are scrollunic, listă+workspace fărăflexshrink/overlap. Stilfinal restrâns `education_mobile_containment.mjs`; fără schimbaredock/motoare/date. AndroidBack închide customtopmodal înaintea modulului.
- Nou `tests_education_mobile_containment_browser.mjs`: **tap() + elementFromPoint + dreptunghiuri**,393×817/360×640 și430pxtastatură, toate4taburi vizibile/paletă/TTSsimulat, packîntârziat, tutorlung/inputtools/acțiuni/send/eșec/anulare/Back, exact lecția RO8intervale, teorie+reper+verificare. PASS bundle și capturiChromiuminspectate; NU telefon fizic. BrowsereLimbi19variante/workspace8materii/input8/practical36 și check/contracte/study/science/Android/snapshot/gărzi PASS. UI100/102 aceleași2eroriistorice. HTMLprod **6.944.852B**, raw/snapshot6.871.477B, Worker7.280.175B.
- Raport `EDUCATION_MOBILE_CONTAINMENT_2026-11-26.md`. Se pregătește APKcorectiv semnat de test din ramura curentă, aceeașicheie/snapshot, fărămerge/deploy. Joburilepreviewserializate, versionCodepeste stabil ȘI prereleaseurileeducaționale anterioare (utilizatorul are501878). **APKcorectiv livrat:** run45818418399 success, aplicațiecommit19aafa8, versionCode501879 (pesteanterior501878), prerelease `education-test-45818418399` NUlatest,77.610.304B, certificat/identitate/versiune/snapshotverificate înCI, debugskipped. Linkdirect https://github.com/kokocf-ui/myPocketAi/releases/download/education-test-45818418399/myPocketAI-signed-education-test.apk . DigestGitHub `sha256:d3fb36652847855d6fa9452f9a81d01f1e9133e631dd51bcf3373108a61a2565`. Așteaptăconfirmareutilizatorpe dispozitiv, nu pretinde testfizic. La viitorul release stabil trebuie de asemenea versionCode peste ultimul test instalat. TraducereaAPK/audiofizic/AI live rămândeschise; nu declara reparate de layout.



**ETAPA ACTUALĂ / CURSURI PRACTICE ȘI APK CERUT (2026-11-26):** utilizatorul consideră cursurile insuficient gândite și cere APK după îmbunătățire. Implementate **36 ateliere distincte / 6 cursuri** orientate pe livrabile: scenariu, structură, materiale, siguranță, greșeală, întrebare locală cu explicație, transfer și checklist. Caiete locale separate țară/curs/capitol, draft/autoevaluare distincte de citire și grilă; grila NU mai marchează completed. Șablon intact nu trece, editarea invalidează review; completitudine declarată, NU evaluare semantică/certificare. Șase parcursuri și proiecte finale editabile, portofoliu PDF numai lucrările proprii; proiectul cere6review-uri și se invalidează la revizia capitolelor. AI opțional separat, fără upload automat. Traducere comună numai instrucțiuni, nu ciorne. Ateliere de meserii numai simulări pe hârtie, fără execuții periculoase.
- **Decuplate materialele practice existente și noi:**6JSON-uri canonice `public/education/practical/course-v1/`271.439B, încărcare selectivă/cache/retry/protecție la navigare. Cele5exporturi de date vechi au paritate exactă prin adaptoare Node, fără copie în HTML/Worker. Hash-uri editoriale: `node tests_practical_workshops.mjs --refresh-hashes` (numaihash, nu generare). Rute/staging aditive. HTML producție **6.937.763B**, raw/snapshot6.864.388B; Worker7.272.957B; staging3.791asseturi/92.625.161B. Nu este măsurare de spațiu pe telefon.
- PASS check/practical/limbi/study/science/input, browser producție toate36ateliere, stări/ciorne/portofoliu/payloadPDF/traducere simulată/cache/race, browsere limbi/input/study. UI100/102 aceleași2erori istorice. Testul science-container-translation avea delimitatorul semnăturii vechi; actualizat numai delimitatorul, testul trece; NU dovadă de reparare APK. Raport `PRACTICAL_COURSES_REDESIGN_2026-11-26.md`.
- **Autorizare nouă explicită: APK după această etapă.** Se pregătește manual pe ramura activă prin `build-android-apk.yml`, job `signed-branch-preview`: assembleRelease cu cheia permanentă, certificat comparat cu release stabil, UI și toate pachetele în snapshot. Input nou `publish_signed_apk` implicitfalse → true numai pentru cererea utilizatorului; publică prerelease de test cu link direct `.apk`, NU latest/producție. Fără schimbare de ramură/merge/deploy. **APK livrat:** run45815458856 success, commitaplicație24c2db8; verificarea certificatului/identității/versiunii/snapshoturilor success, debugskipped. Prerelease `education-test-45815458856` (NUlatest), versionCode501878,77.608.928B. Linkdirect: https://github.com/kokocf-ui/myPocketAi/releases/download/education-test-45815458856/myPocketAI-signed-education-test.apk . DigestGitHub `sha256:32b879b1eb22cab1b5cc21e52e039d0cefd199856e01b7460050d125c3050026`. Fără instalare locală pe telefon; confirmăriCI/API, logul integral blocat de host sandbox. Traducerea APK și audio fizic rămân neverificate/deschise; nu promite rezolvare din simulări.



**ETAPA ACTUALĂ / LIMBI STRĂINE (2026-11-26):** utilizatorul cere dicționare, teme (conjugări etc.), transcriere, ascultare/audio și ghid de conversație. Implementată zonă nouă „Dicționar · conjugări · ghid · audio” din capitole și lecții, fără eliminarea cursului/AI/dictării existente. **14 limbi / 19 variante**, pachete canonice `public/education/languages/resources-v1/`100.524B, încărcate doar la deschidere. 212intrări,27teme,154rânduri de forme,49grupuri **însumate pe variante, nu distincte**;12intrări/pachet modern,8/clasic. Resurse introductive, NU dicționare exhaustive/cursuri A1–C2 certificate. Forme de „a fi” + modele regulate unde există; rusa/mandarina/japoneza tratate după sistemul propriu. LA/EL veche/Koine au lexic de lectură, nu ghid modern. IPA/Pinyin/Rōmaji/transliterare etichetate separat. Nu s-au copiat vechile carduri JS în pachetele noi.
- `foreign_language_resource_loader.mjs`, UI separat; validare schemă/identitate/variante/ID/referințe, format hash runtime/digest staging, cache distinct și retry/quota. Editorul modifică JSON apoi `scripts/check_foreign_language_resources.mjs --refresh-hashes` NUMAI hash, nu regenerează conținutul. Rute/staging aditive; noul payload absent HTML/Worker.
- Explicații RO; sensuri RO (EN pentru cuvintele românești). Buton explicit **Tradu/reîncearcă explicațiile** → `eduTranslateMaterial` comun, proiecție numai explicații/sensuri/note, NICIODATĂ forme/enunțuri/răspunsuri/transcrieri țintă. Original vizibil și păstrat la eșec; fără fișe traduse duplicate. Nu este reparare verificată a APK-ului.
- Ascultare TTS normal/lent, voce regională instalată selectată explicit; fallback avertizat, LA cu voceIT/ELveche cu voceELmodern numai aproximativ. Laborator cu text ascuns și verificare textuală, NU scor fonetic. Înregistrare/redare proprie prin MediaRecorder dacă suport/permisiune: max45sec/4MiB, doar memoria dialogului, fără upload, stop/delete/cleanup la secțiune/exemplu/închidere/pagehide, permisiune întârziată invalidată. Suport WebView fizic neverificat; nu pretinde universal.
- PASS `npm run check`, `test:foreign-resources`, noile teste browser mobile pe bundle pentru19variante/căutare/gramatică/răspuns/ghid/TTS/traducere simulată/MediaRecorder real cu microfonChromiumsimulat/refuz/curse/cleanup/cache/retry, regresii study/science/input și browserele lor. Toate102comenzi UI executate individual:100PASS, aceleași2restanțe istorice. Staging3.785asseturi/92.353.722B. HTML brut6.992.354B, **producție7.065.132B** (<8MB, marjă934.868B), Worker7.449.864B/7.275,26KiB. Raport `FOREIGN_LANGUAGES_RESOURCES_2026-11-26.md`. Fără AI/TTS live/APK fizic, PR/merge/deploy/APK nou; traducerea APK rămâne amânată. Asset-uri înaintea frontendului la publicarea viitoare autorizată; păstrează planul legacy din decuplare.


**CONTINUARE ACTUALĂ / DECUPLARE ÎN SIGURANȚĂ PENTRU SPAȚIU (2026-11-26):** utilizatorul recomandă să continuăm unde este sigur. Implementate încă **631 fișe originale** în 4 pachete canonice `public/education/study-v1/`: Matematică RO V–VIII182, completări RO Fizică107/Chimie14/Biologie134, Biologie liceală90, Fizică gimnazială originală engleză104. Banca EN este original independent declarat, nu o copie tradusă; nu o șterge prin deducție din limbă. Texte/ordine/ID/formule/proveniență păstrate exact; comparate toate exporturile de date din25module. Modulele-fragment sunt adaptoare după ID la același JSON, nu alte copii de lecții. Suplimentele brute Biology upper/Physics English extensions au fost retrase după absorbție integrală.
- `education_study_pack_loader.mjs`: identitate/schemă/limbă/ani/câmpuri/ID-uri validate, rețea→cache, quota fără pierderea conținutului online, retry; încărcare Math numaiRO și Științe numai materia selectată, atomic după toate dependențele și verificarea navigării. Lipsa noului pachet offline NU deschide cititor/an gol. Prima descărcare e necesară chiar dacă referințele vechi sunt cached. Cache-ul nu este stocare garantată.
- **Eliminate și datele tranzitive din Worker pentru aceste 8 pachete:** 4study noi +4shared-v2 anterioare. `education_study_node_source.mjs` citește fișiere numai în Node prin `process.getBuiltinModule`; fără import static JSON/`node:*`, structuri goale în Worker, hidratare reală în browser. Nu generaliza la tot Workerul. Constanta HTML nefolosită de numărare Chimie a fost scoasă; exportul Node rămâne56.
- HTML brut **6.969.173B**, producție **7.041.362B** (−449.984B producție față de540bd5b); marjă958.638B până la8.000.000. Worker **7.251,47KiB / gzip2.023,24KiB** (−aprox537,91KiB). Nu este măsurare de spațiu liber pe telefon/APK: conținutul separat/cache-ul consumă stocare, APK nou nu există. Staging3.766asset-uri/92.253.198B.
- Validat: `test:education-study`, `test:science-source`, input/tutor, regresii focalizate, paritate25exporturi, staging, dry-run/gărzi; noubrowser pe bundle (RO-only/lazy, cititoare V–VIII/Biologie, update fără frontend nou, cursă de navigare, offline lipsă/retry), browsere producție8materii/input, browsere Fizică/Chimie/Astronomie/Matematică. `test:ui`100/102 aceleași2restanțe istorice; vechiul test de predicat HTML RO rămâne restanță documentată, nu pretins trecut. Workflow nou `education-study-packs.yml` numai verificări/dry-run, NU deploy.
- Rămân MATH_DEPTH_STAGES, teoria comună, HG/Informatică, Fizică liceu RO/EN și alte bănci universitare. Auditul mai găsește59constante mari (unele UI/metadate); NU sunt59pachete didactice și nu indică duplicate semantice. **Decuplare generală nefinalizată.** Raport complet: `EDUCATION_SAFE_DECOUPLING_2026-11-26.md`. Rute aditive, publică asset-urile înaintea frontendului când va exista autorizare; păstrează planul legacy v1/v2 anterior. Fără deploy/APK/PR/merge în această etapă, fără AI live/APK fizic; traducerea APK rămâne amânată.

**CERERE ACTUALĂ / SURSA UNICĂ ȘI DECUPLARE (2026-11-26):** utilizatorul cere verificarea pachetelor rămase cuplate, decuplarea lor și eliminarea fișelor RO/EN traduse duplicate/triplicate; numai originalul, traducere exclusiv prin motorul comun. Increment implementat: `public/education/science/shared-v2/{physics,chemistry,biology,astronomy}.json`, schema v2, **33 fișe comune + 92 legi/referințe + 28 cursuri de bază Chimie universitară**, numai sursa română explicită. JSON-urile sunt sursa editorială; modulele vechi sunt adaptoare Node, nu bănci bilingve. Legile/cursurile sunt încărcate la alegerea materiei, nu mai sunt în HTML; cititorul și titlurile folosesc motorul comun inclusiv pentru EN. Traducerile UI și materialele naționale distincte rămân. Paritate exactă a celor 153 surse vs `d3fa0b8`. Vechiul modul de aprofundări și asset-urile bilingve shared/v1 retrase din repo; `build_science_shared_packs` validează JSON/recalculează numai hash, nu regenerează conținut JS.
- Cache/rute v2 separate, validare strictă fără câmpuri EN, rețea apoi cache; cache-ul bilingv v1 al materiei este șters numai după salvarea v2. Offline nu garantează traducere la prima vizită. **Nu publica staging-ul peste clienții vechi**: rutele v1 ar dispărea; pentru deploy ulterior păstrează artifacte/rute legacy separat până la retragerea clienților, apoi rollback și upgrade testate. Niciun deploy/APK/PR/merge în etapă.
- **Migrare generală NEFINALIZATĂ.** Rămân în HTML Matematică, teorie comună, planuri HG, Informatică, cazuri Fizică liceu RO/EN, bănci universitare și alte ghiduri bilingve. `scripts/audit_education_coupling.mjs` este inventar euristic reproductibil, NU listă de ștergere automată. 3.762 JSON-uri scanate fără obiecte cu ambele chei exacte ro/en după migrare; nu este dovada eliminării duplicatelor semantice sau din JS. Nu șterge surse originale englezești / țări distincte pe baza limbii.
- Verificat: `test:science-source`, input/tutor, progresie, universitar, pachete/legi europene, 49 trasee Chimie, Fizică VI–XII, Astronomie 12 ani, browser nou source-only pe bundle de producție (RO→EN cu motor simulat, eșec/original/retry și cache), ferestrele și uneltele la 8 materii, staging, dry-run și garda numelor. `test:ui` 100/102, aceleași două eșecuri istorice. Testul suplimentar `tests_science_ro_course_quality.mjs:75` are predicat HTML vechi absent și în baseline; nu declara trecut. HTML brut7.420.048 octeți, producție7.491.346 (<8.000.000). Raport complet și restanțe: `EDUCATION_SOURCE_PACKS_2026-11-26.md`. Fără AI live / Android fizic; problema traducerii APK rămâne amânată, nu declarată rezolvată.

**IMPLEMENTARE INTRARE EDUCAȚIE (2026-11-26, înlocuiește lipsurile din auditul de mai jos):** utilizatorul a autorizat implementarea simbolurilor/acoladelor și scrierii cu deget/stylus pentru toate materiile cu editor. `education_input_tools.mjs` montează unelte comune pe textarea editabile din Educație și dialogurile ei: simboluri, șabloane editabile (sisteme/funcții pe cazuri/fracții), inserare la selecție, previzualizare SVG cu acoladă ce crește la Enter. Textul rămâne simplu/editabil, NU editor WYSIWYG. Blocurile cu acolade nu mai sunt separate de `mathSplitExercises`; dispatcherul local admite numai motoarele de sisteme care parsează blocul întreg; graficul local refuză funcțiile pe cazuri, fără grafic parțial inventat.
- Tabla Pointer Events are pen/touch/mouse, undo/clear/download PNG, desen păstrat în memoria aceluiași câmp până la reîncărcare/schimbare lecție, nu ciornă persistentă a cernelii. Trimitere explicită către Cloudflare Workers AI, transcriere editabilă, confirmare obligatorie, inserare separată, nicio rezolvare automată. Schimbarea desenului/câmpului invalidează rezultatul; erorile păstrează desenul. Simbolurile și șabloanele nu cer AI.
- `education_ink_api.mjs`, `/api/education-ink`, proxy same-origin fără dublă inferență; PNG max1MB, corp max1,5MB citit limitat, consimțământ, fără stocare/log imagini. Un singur model moondream3.1, fără fallback plătit; consumă cota Workers AI. Flag `POCKET_EDUCATION_INK_ENABLED="true"` în `wrangler-backend.toml` pentru PUBLICAREA VIITOARE, nu activare live făcută acum; fără flag/AI răspunde503. Nu folosește codul pilotului foto și nu adaugă auth/rate-limiting distribuit față de API-ul public existent.
- Verificat: `npm run check`, `test:education-input`, 21 regresii focalizate, browser mobil real pe bundle (8 materii, Enter, pointer pen/touch, touchscreen emulat, ciornă, verificare/inserare, erori/răspuns întârziat, ecrane generale și Limbi străine), browserul vechi, dry-run frontend/backend + garda numelor. Testele AI sunt simulate, **nu inferență live sau stylus/APK fizic**. `test:ui`:100/102 după rerularea Limbi străine; aceleași două restanțe istorice de mai jos. Raport exact: `EDUCATION_INPUT_TOOLS_2026-11-26.md`. Fără PR/merge/deploy/APK. Traducerea APK rămâne amânată. Nu declara recunoașterea perfectă, cost garantat zero, WYSIWYG complet sau grafic nou pe cazuri.

**ULTIMA CERERE / AUDIT INTRARE MATEMATICĂ (2026-11-26):** utilizatorul a refuzat publicarea/APK și a cerut verificarea paletei de simboluri și a introducerii cu deget/stylus, inclusiv acolade la funcții. Audit efectuat, **nu implementare**: în ambele spații de Matematică (general și lecții naționale) lipsesc paleta matematică și tabla de scriere. În ecranele generale Fizică/Chimie, paleta funcționează (inserare √ verificată în Chromium mobil real). `mathSplitExercises` separă greșit în două sarcini funcția pe cazuri `f(x) = {\n x^2, dacă x < 0\n 2x+1, dacă x ≥ 0\n}`; graficul local nu o suportă. Nu confunda fotografia/ML Kit/pilotul opțional pentru text tipărit cu recunoașterea scrierii de mână, nici gesturile figurilor cu o tablă. Niciun stylus/APK fizic testat. Raport: `MATH_INPUT_AUDIT_2026-11-26.md`; reproducere: `scripts/audit_math_input_browser.mjs` pe bundle nou/curent. Rămân de implementat paleta+șabloanele, păstrarea sistemelor/funcțiilor ca un singur enunț și un flux complet scriere→transcriere verificată→rezolvare. Nu declara acestea gata pe baza testelor foto/voce existente. Fără PR/merge/deploy/APK în acest audit.

**CERERE NOUĂ ȘI STARE (2026-11-26, explicații pe exercițiul concret):** utilizatorul reclamă teorie generală multă și aplicare prea scurtă în „Rezolvă pas cu pas” și „Metoda de lucru”. Implementat contract comun `education_exercise_tutor.mjs`: operație/dovadă din enunț + de ce + rezultat intermediar, teorie introductivă minimă, verificare concretă. Integrat browser/backend pentru matematică, științe, informatică, literatură, istorie/geografie, admitere/examene. Eliminată interdicția aplicării numerice la metoda matematică și contextul cu teoria/exemplul altei probleme. Ferestrele naționale au solve/method fără încercare obligatorie; corectarea cere încercare. Metoda matematică locală din UI folosește rezolvarea deterministă concretă. Intrări educaționale max32.000 caractere, chat obișnuit tot4.000. Cel mult o extindere AI pentru răspunsuri foarte scurte/nestructurate; euristică, NU certificat de corectitudine, poate adăuga latență/consum. Motoarele locale specializate de Științe rămân existente, uneori compacte; nu pretinde rescriere universală. Raport: `EDUCATION_EXERCISE_TUTOR_2026-11-26.md`.
- Validat: contract/API cu AI simulat (12 trasee), 26 comenzi focalizate, browser mobil real pe bundle nou (8 materii, 3 acțiuni, ciorne, erori, universitar/examene), dry-run frontend/backend, garda numelor. HTML7.571.254 octeți UTF-8. Fără AI live sau APK instalat, PR/merge/deploy/APK.
- `test:ui`: 100/102 comenzi trecute; cele două eșecuri reproduse identic pe baseline `ee71518`: `tests_education_ui_locales.mjs` (traducere statică lipsă pentru noul test scris de examene), `tests_extra_tools_workspace.mjs` (așteaptă24 materii, catalogul are25). Nu ascunde aceste restanțe și nu declara suita integral verde. Depanarea traducerii APK rămâne amânată.

**CERERE ACTUALĂ ȘI CONTINUITATE (2026-11-26, revizie spații de lucru / științe / examene):** utilizatorul a cerut să continuăm după pachetele RO, înlocuind oprirea istorică de mai jos: restaurarea ferestrei de lucru dispărute, verificarea nivelului universitar la Științe și a Astronomiei, teste rezolvate de elev/student cu metodă și soluție pas cu pas la greșeli, unificarea Bac XII/XIII. Implementat pe ramura activă, **fără PR/merge/deploy/APK în această etapă**. Raport exact: `EDUCATION_REVIEW_2026-11-26.md`.
- Cauză: ecranele naționale noi montau doar butoanele de citire, nu editorul. `education_lesson_workspace.mjs` este comun celor 8 materii naționale (Matematică, Literatură, Istorie, Geografie, Informatică, Fizică, Chimie, Biologie): cerință separată, încercare, ciorne per context, corectare online cu reper și pași, referință locală fără verdict automat fals. Nu elimina cititorul separat.
- Științele universitare și Astronomia aveau deja cursuri în motorul anterior (test comun: 30 specializări / 189 capitole / 612 subteme). Sunt păstrate, **nu declarate acreditate sau complete pe programele facultăților**. `public/education/science/review/RO.json` este singura sursă pentru 28 aplicații originale noi: 24 universitare (2/materie/an I–III, cele 4 științe), plus 4 Astronomie IX–XII. UI `science_review_supplements.mjs`: secțiune suplimentară la lista capitolelor, încărcare separată, cache și fereastră de lucru. Suplimente orientative, nu pachete naționale anuale de 30–36 lecții; revizie independentă încă necesară.
- Examene: `exam_lesson_practice.mjs` reutilizează testele pachetelor existente pentru EN VIII/Bac/Licență (nu duplică textele); la științe universitare folosește suplimentul, nu pretinde testarea întregii facultăți. Filtrare pe capitole la matematică; la celelalte materii, alegere explicită a lecției. Asistentul dezvoltă automat metoda pentru grilele greșite fără a modifica scorul local. Grilele vechi sunt diagnostic de bază, nu simulări complete de Bac. Enunț separat obligatoriu pentru corectarea unei probleme proprii. Reparat `refreshRomanian` nedeclarat. O singură intrare Bac XII/XIII (seral), păstrând diferențele de profil/probă. Examene universitare I–III separate de admitere.
- Publicare conținut: `stage_education_pack_assets.mjs` și `education_pack_service.mjs` acceptă acum pachetele naționale pentru toate cele 8 discipline + suplimentul de Științe; **nu mai este valabil restul istoric „nu publică încă math/științe”**. Staging validat local, serviciul separat încă neactivat live.
- Verificări: `tests_education_review_2026.mjs`, suitele naționale/universitare/Astronomie/examene, dry-run Wrangler + garda de nume și `tests_education_workspace_browser.mjs` în Chromium real (390×844), inclusiv bundle de producție. AI este simulat controlat în testul browser; nu afirma evaluare live a calității răspunsurilor sau confirmare pe APK. Workflow: `education-workspace-review.yml`. Rămân revizia academică, universități naționale complete, simulări complete pe profile/probe și traducerea amânată.


**Prioritatea actualizată de utilizator:** în APK-ul signed de test, problema traducerii persistă (textul apare în română). Nu considera localizarea rezolvată pe baza testelor simulate sau a secțiunii istorice de mai jos. Utilizatorul dorește să amânăm depanarea traducerii până după Educație și să continuăm acum implementarea Literaturii. Lecțiile noi rămân în pachete, cu o singură sursă; nu pretinde finalizare sau revizuire unde lipsesc. Nu oferi APK debug; numai signed release, cu aceeași cheie și fără a cere dezinstalarea aplicației existente.

**Regulă generală pentru toate materiile (decizia utilizatorului, nov. 2026):** regulile stabilite la Literatură se aplică la orice materie din Educație: programa oficială + manualele țării ca surse (fără teme inventate, fără text copiat din manuale), limba națională de școlarizare ca sursă unică, toate limbile oficiale la țările multilingve, densitate după manual (~30–36 lecții pe an, grupate pe unitățile manualului/programei), rol de „dascăl înțelegător” (explicație pas cu pas + greșeala frecventă la fiecare lecție, răspunsuri la test). Ordinea (confirmată prin ask_user): întâi se termină Literatura pentru **toți anii** (primar → liceu) și toate țările, pe lățime (anul 1 peste tot, apoi anul 2 etc.), apoi Istorie → Geografie → Informatică.

**Literatură, pachete naționale (nov. 2026):** limba națională de școlarizare, pe lățime (primar pentru toate țările întâi), toate limbile oficiale la țările multilingve; doar commit + push pe ramura activă, fără PR/merge/APK până la alt semnal. Vaticanul (VA) a fost eliminat din Educație la cererea utilizatorului (49 de jurisdicții selectabile); regula veche „VA păstrează external-curriculum” privește doar datele rămase în cod. AT/HR/MD/PL/RS/TR: lecțiile urmează programa oficială + manualele (fără teme inventate); anii cu pachet național sunt în `LIT_NATIONAL_PACK_YEARS` (ascund cele 16 rânduri generice). Densitate: fiecare an urmează unitățile manualului (~30–36 lecții, format `units` + `l01..lNN`); întâi se extind țările deja făcute. Rol de „dascăl înțelegător”: fără text copiat din manuale, dar materia acoperită integral; fiecare lecție `units` are pași simpli + greșeala frecventă (`steps`) și răspunsuri la test (`answers`), `labels` cu 9 elemente — obligatoriu pentru orice pachet nou. Stare (nov. 2026): toate cele 28 de pachete de anul 1 existente sunt în secvența manualului cu strat de dascăl (954 de lecții); urmează anul 1 pentru țările fără pachet, apoi anul 2. Starea și limbile decise: secțiunea „Literatură: pachete naționale pe an” din `PRIORITATE_EDUCATIE_DECOUPLARE.md`. RO clasa I: pachet `RO/ro-1.json` (36 de lecții, strat de dascăl), făcut la cererea utilizatorului („Dacă nici România nu respectă programa armonizată cu materia, facem și la ea modificări”); clasele 2–12 RO urmează aceeași regulă mai târziu. Nu adăuga RO în `LIT_NATIONAL_PACK_YEARS`: pachetul preia planul în `litProgram` când e încărcat, iar rândurile vechi rămân rezervă offline (testul android_corrections cere 9 lecții offline la clasa 1). Anul 1, țări noi (nov. 2026): SM, AD, MC (CP), LU (E1), GB-WLS en, MT en, GB-SCT P1/GB-NIR Y1/IE JI (pachet englez de prim an școlar), XK sr, BA hr/bs/sr, ME cnr/sr, RU, BY ru. Derivatele se fac din JSON-ul construit (script `derive_json.py` în /tmp, nepersistent) cu înlocuiri verificate prin assert; listele rămase sunt în PRIORITATE. Tot la anul 1 (nov. 2026) au fost scrise original CZ cs, SK sk, SI sl, UA uk, BG bg, MK mk, AL sq, GR el, NL nl G1 (grădiniță, fără citire formală) BY be, EE et, LV lv, LT lt, GB-WLS cy (Y1), MT mt și IE ga (JI); XK sq și MK sq sunt derivate din AL, iar CY el din GR (doar sursă, etichetă, orașe/râuri). Total 65 de pachete / 2070 de lecții: anul 1 este acoperit în toate țările și limbile oficiale din scop (FR CP și HU rămân pachete vechi, nereconstruite). Pachetele et, lv, lt, cy, mt și ga sunt scrise de agent fără verificare nativă și trebuie revizuite de un vorbitor nativ. Următorul pas: anul 2, breadth-first.

**ORDINE NOUĂ (decizia utilizatorului, 25 nov. 2026, înlocuiește breadth-first):** „mergem cu o țară odată, de la 1 la universitate”. Pentru fiecare țară se fac TOATE cele 4 materii rămase (Literatură, Istorie, Geografie, Informatică), de la clasa 1 la universitate; la Literatură, universitatea = Facultatea de Litere/Filologie, Licență anii I–III (cursurile principale: teorie literară, istoria literaturii naționale și universale, pe planurile universităților mari din țară; fără Master). Prima țară: **România**; apoi țările după mărime (DE, FR, IT, ES, PL, …). Stare RO Literatură: clasa 1 (`RO/ro-1.json`, 36), clasa 2 (`RO/ro-2.json`, 34, CLR OMEN 3418/2013), clasa 3 (`RO/ro-3.json`, 33), clasa 4 (`RO/ro-4.json`, 33; LLR OMEN 5003/2014) — ciclul primar complet —, clasa 5 (`RO/ro-5.json`, 32), clasa 6 (`RO/ro-6.json`, 32), clasa 7 (`RO/ro-7.json`, 32) și clasa 8 (`RO/ro-8.json`, 32; stage lower, OMEN 3393/2017) — gimnaziul complet —, clasa 9 (`RO/ro-9.json`, 37; stage medium, NOUA programă MEC 2026, MO 141 bis/2026, în vigoare din 2026–2027, 5 module + limbă) și clasa 10 (`RO/ro-10.json`, 33; programa OMECI 5099/2009, în vigoare până la noua programă din 2027–2028), clasa 11 (`RO/ro-11.json`, 35; OMEdC 3252/2006), clasa 12 (`RO/ro-12.json`, 33; OMEdC 5959/2006) gata — liceul complet; Licență anul I (`RO/ro-uni-ba-1.json`, 32; stage advanced, id `uni-ba-1`; sinteză comună ARACIS + planurile UB/UBB/UAIC, doar Română A — ales de utilizator) gata; Licență anul II (`RO/ro-uni-ba-2.json`, 30: morfologie, istoria limbii și filologie, literatura secolului XIX, literatura universală Ev Mediu–romantism, comparatistică și teorii ale textului) gata; Licență anul III (`RO/ro-uni-ba-3.json`, 31: interbelic, postbelic și contemporan, literatura universală modernă, sintaxă, pragmatică și stilistică, critică literară, metodologia licenței) gata — Literatura RO completă 1–Licență III; urmează Istorie, Geografie, Informatică RO. Testul `tests_literature_national_packs.mjs` caută acum intrarea din catalog după țară+etapă+clasă (o țară are mai mulți ani).

**ISTORIE RO (2026-11, decizii utilizator):** același motor ca Literatura (țară → clasă → unități → lecții cu teorie, pas cu pas, exemple, exerciții, test cu răspunsuri); începe din clasa a IV-a (în RO nu există Istorie în clasele 1–3); universitate = Licență I–III Facultatea de Istorie, sinteză comună ARACIS verificată pe planurile UB/UBB/UAIC. Pachete: `public/education/history/authored/<CC>/<lang>-<an>.json` + `catalog.json` (schema `mypocket-literature-authored/v2`), verificate/scrise cu `node scripts/build_literature_national_packs.mjs --subject=history [--write]`; încărcare cu `literatureLoadAuthoredCatalog/literatureLoadNationalYear({subject:'history'})`; UI în `education_national_subject_packs.mjs` (hgWithNationalYear la alegerea clasei, hgRenderNationalChapters/hgRenderNationalLesson, cititorul comun `litShowMaterialReader`); fără pachet rămân capitolele existente. Test: `tests_history_national_packs.mjs`. Stare: clasele IV–XII gata (9 pachete / 273 lecții): IV OMEN 5003/2014 (33); V–VIII OMEN 3393/2017 (35, 28, 27, 40); IX noua programă OMEC 6930/2025 (27); X OMEC 4598/2004 (30); XI OMECI 5099/2009 (26, cu temele (*) pentru 2 ore); XII OMECI 5099/2009 — istoria românilor, temele programei de bacalaureat (27). Programele noi X–XII (OMEC 4106/2026) se aplică din 2027–2028 pentru X, deci pachetele X–XII trebuie revăzute atunci. Licență I–III (`RO/ro-uni-ba-1..3.json`, câte 26 lecții, 6 unități; sinteză ARACIS verificată pe planurile UB/UBB/UAIC: I – introducere și științe auxiliare, preistorie, antichitate, Ev Mediu occidental și Bizanț, spațiul românesc sec. XIV–XVIII, istoriografie; II – modernă universală, relații internaționale XVIII–XIX, modernă a României, Transilvania și Sud-Estul european; III – contemporană universală și a României, integrare europeană, ONU, teoria istoriei, istoriografie română, metodologie, istorie publică). Selectorul universitar RO (`hgYearGroups` în `index.js`) arată Licență I–III (`uni-ba-N`); la celelalte țări rămâne o singură intrare. **Istoria RO completă: 12 pachete / 351 lecții (IV → Licență III).** Urmează Geografie și Informatică RO; după Informatică ne oprim din Educație și se livrează APK semnat.

**GEOGRAFIE RO (2026-11):** același motor (`public/education/geography/authored/`, `--subject=geography`, test `tests_geography_national_packs.mjs`, inclus în workflow-ul `literature-50-grade-depth.yml`); începe din clasa a IV-a. Stare: clasa a IV-a (`RO/ro-4.json`, 32 lecții, cele 4 unități sugerate de programa OMEN 5003/2014 Anexa 2) V–VIII după programa OMEN 3393/2017 (V 30, VI 30, VII 31, VIII 30), IX după OMEC 6930/2025 (30), X după OMECT 4598/2004 – geografie umană (29), XI după OMEdC 3252/2006 – probleme fundamentale ale lumii contemporane (30), XII după OMEdC 5959/2006 – Europa, România, UE (30) și Licență I–III (30, 29, 30; sinteză ARACIS verificată pe planurile UB/UBB/UAIC, `ro-uni-ba-1..3.json`). **Geografia RO completă: 12 pachete / 361 lecții.** Programele noi 2025 pentru X–XII se aplică ulterior (de reautorizat când intră în vigoare). Informatica RO a urmat (vezi mai jos).

**INFORMATICĂ RO (2026-11):** același motor (`public/education/computing/authored/`, `--subject=computing`, test `tests_computing_national_packs.mjs`, în workflow-ul `literature-50-grade-depth.yml`); UI: `computing_national_packs.mjs` (injectat în `index.js` înainte de `COMPUTING_UI_SCRIPT`), alegerea clasei din `computing_ui.mjs` trece prin `computingWithNational`; fără pachet rămân ramurile/capitolele vechi. Începe din clasa a V-a (decizia utilizatorului). Pachete: V–VIII OMEN 3393/2017 (`ro-5..8`, 28/28/28/24); IX–XII matematică-informatică intensiv informatică (`ro-9..12`, 35/28/32/28; IX OMEC 3716/2026 Anexa 49, X–XII OMECI 5099/2009 Anexa 5); TIC pentru celelalte profiluri, pachet separat (`ro-tic-9..12`, 26/24/24/24; variantele de specializare de la XI–XII sunt unități etichetate „Filologie · …”, „Științele naturii · …”); la IX–XII apare ecranul de alegere a traseului. Licență I–III Informatică (`ro-uni-ba-1..3`, 30/30/29; sinteză ARACIS verificată pe planurile UB FMI, UBB Informatică română, UAIC Informatică; opționalele nu sunt acoperite); la Avansat apare „Alege anul de studiu”. **Informatica RO completă: 15 pachete / 418 lecții** (statut `partial-original-material-independent-review-pending`). Mesaje de commit cu numere greșite: `5ddde426` (scrie 35, real 32), `c56ed460` (scrie 25, real 24). **Educația se oprește aici (decizia utilizatorului):** urmează PR → main → release semnat cu link direct `.apk`; DE și celelalte țări rămân amânate până la un nou semnal.
**MATEMATICĂ + ȘTIINȚE RO (2026-11-26):** același motor de pachete autorizate (`--subject=math|physics|chemistry|biology`), lecții originale în format de dascăl (pași, ultimul „Greșeala frecventă”, test cu răspunsuri, fără secțiune pentru părinți), 30–36 lecții/an impuse de teste. **Matematică** (`public/education/math/authored/RO/`, UI `math_national_packs.mjs`, test `tests_math_national_packs.mjs`): I–IV OMEN 3418/2013 + 5003/2014, V–VIII OMEN 3393/2017 (rescriere completă; vechile `math_ro5_*`/`math_ro678_*` rămân doar fallback), IX–XII doar mate-info M1 (IX OMEC 2025, aplicabilă din 2026–2027; X 4598/2004, XI 3252/2006, XII 5959/2006), Licență I–III Matematică (sinteză ARACIS) — 15 pachete / 479 lecții. **Științe** (UI `science_national_packs.mjs`, test `tests_science_national_packs.mjs`): Științe ale naturii III–IV în Biologie → Primar (Biologie Primar 1–2 ascunsă pentru RO), un singur traseu profil real la IX–XII: Fizică IX–XII (124 lecții), Chimie IX–XII (125), Biologie IX (OMEC 6930/2025), X plante și animale (4598/2004), XI anatomia și fiziologia omului (3252/2006), XII genetică și ecologie umană (5959/2006) — biologie 6 pachete / 187 lecții. Generic rămân capitolele vechi pentru alte țări. Noile programe X–XII de Biologie (OMEC 4106/2026, anexele 75–76) nu sunt încă aplicate, deoarece intră în vigoare ulterior. Statut `partial-original-material-independent-review-pending`; nu se declară verificare capitol-cu-capitol pe manuale. Rămase: `scripts/stage_education_pack_assets.mjs` nu publică încă pachetele math/fizică/chimie/biologie în serviciul separat; DE și celelalte țări urmează după semnalul utilizatorului.

**CITITOR PACHETE NAȚIONALE (2026-11-25):** cauza reală a „Materialul nu a putut fi pregătit” / a textului AI la Literatură: wrangler (esbuild) redenumește la bundling declarațiile de modul folosite și ca globale în browser (`literatureNationalYearMaterial`→`…2`, `renderStudyBlocks`→`…2`, `eduNationalShowMaterial`→`…2`); funcțiile serializate cu `.toString()` nu mai definesc numele apelat. Testele locale (Node, fără bundling) treceau. Regula: o funcție serializată apelată din alt script se emite ca `var nume=`+fn.toString() (ca `literatureLoadNationalYear`). Gardă: `scripts/check_bundled_browser_names.mjs` rulează în `deploy-cloudflare.yml` pe `wrangler deploy --dry-run` înainte de deploy. Local: `wrangler deploy --config wrangler-frontend.toml --dry-run --outdir /tmp/x && node scripts/check_bundled_browser_names.mjs /tmp/x/index.js`. Cititor: `education_national_reader.mjs` (dialog paginat Educație → overlay → în pagină). Frontendul vine live din Cloudflare: nu e nevoie de APK nou. **Confirmat de utilizator pe telefon (2026-11-25): Istorie/Geografie/Informatică/Literatură funcționează.**

**Divertisment (Mai multe instrumente → Divertisment, nov. 2026):** a dispărut pe telefon pentru că un APK signed de previzualizare de ramură a fost construit din `arena/256bd60a` (ramură fără fișierele Divertisment) și a înghețat un snapshot fără modul. Codul (`extra_tools_six_nav.mjs` grupul `fun`, `extra_fun_ui.mjs`, `extra_fun_core.mjs`, `extra_fun_generator.mjs`) există pe `main` din `a45f2bfe` și pe ramura de integrare. Garda `tests_divertisment_frontend_presence.mjs` verifică HTML-ul servit (același pe care îl împachetează previzualizările) și rulează în build-android-apk (signed-branch-preview), signed release, deploy Cloudflare și Tools menu regression. Nu construi previzualizări din ramuri fără Divertisment; categoria este a 4-a carte (sub pliu, se derulează), nu reveni la grila pe 2 coloane. Restaurat în producție prin PR #552 (merge `ab3946b8`): deploy Cloudflare OK, APK signed **v1.0.1867** (versionCode 501867, peste previzualizarea 501865), link: https://github.com/kokocf-ui/myPocketAi/releases/download/v1.0.1867/myPocketAI-signed-release.apk. Check-ul `four-subject-course` (traducere DE în scienceJourney) rămâne roșu, preexistent, amânat odată cu traducerea.

1. **Utilizatorul lucrează exclusiv de pe telefonul mobil:**
   - Execută direct toate verificările (`npm run check`, testele `tests_*.mjs`, `node scripts/build_curriculum_packs.mjs --verify`), commit-urile, `git push` pe ramura activă a sesiunii, deschiderea și merge-ul Pull Request-ului în `main`, precum și verificarea rulărilor GitHub Actions.
   - Când se generează un **APK Signed Release** (`.github/workflows/build-android-signed-release.yml` pe `main`), oferă linkul direct `.apk` din **GitHub Releases** (`myPocketAI-signed-release.apk`) astfel încât utilizatorul să îl poată descărca cu o singură atingere pe telefon (fără dezarhivare `.zip`).
2. **Evidență permanentă pe GitHub (`kokocf-ui/myPocketAi`):**
   - Fă commit + `git push origin <ramura-activă>` după fiecare sub-etapă importantă ca nimic să nu se piardă dacă sesiunea se întrerupe.
3. **Constrângeri tehnice critice:**
   - **Plafon HTML offline `< 8.000.000 bytes` (`tests_education_hg_theory_coverage.mjs`):** tot conținutul curricular nou se stochează în **pachete statice decuplate** în `./public/packs/p-<sha256_24>.json` (servite prin `/api/curriculum-pack` din Cloudflare Workers Static Assets, cu `0 KB` adăugați în Worker JS / HTML).
   - **Onestitate curriculară și drepturi de autor (`EDUCATION_COMPLETION_POLICY.md`):**
     - `0` text/exerciții copiate din manuale comerciale protejate; în `textbooks[]` și `manualExample` se stochează exclusiv metadate bibliografice și ordine/registre oficiale.
     - Nu marca un an drept certificat integral (`fullyApproved`) fără verificare capitol-cu-capitol pe programa și manualele oficiale ale anului respectiv.
     - Cetatea Vaticanului (`VA`) păstrează `external-curriculum` pentru stagiile preuniversitare (fără inventarea unei programe școlare K–12 vaticane).

---

## 2. Ce este DEJA FINALIZAT și LIVE pe `main` (nu reface de la zero!)

### A. Matematică (`Educație`) — 50 / 50 jurisdicții europene în pachete decuplate (24 nov 2026, PR #542, Release `v1.0.1820`)
- **Acoperire:** **50 / 50 jurisdicții** din `EDUCATION_EUROPE_COUNTRIES` (`799` pachete decuplate în `./public/packs/`, `21.176,0 KB`, versiune `13n6kwc`):
  - **Batch 1 (`RO`):** Clasele I–XII (`1..12` + `9-SCI`) + Universitate Licență 1–3 (`math_romania_full_2026.mjs`, `math_ro5_*`, `math_ro678_*`, `math_ro9_science_2026.mjs`).
  - **Trasee dedicate / Batch 2–4 (`18` țări):** `HU, ES, IT, PT, PL, MD, GB-ENG, FR, DE, AT, CH, BE, NL, LU, IE, GB-SCT, GB-WLS, GB-NIR`.
  - **Batch 5 (`8` țări — Nordic & Baltic):** `DK, FI, IS, NO, SE, EE, LV, LT` (`math_batch5_nordic_baltic_2026.mjs` — `1.899` lecții).
  - **Batch 6 (`8` țări — Central & Med):** `CZ, SK, SI, HR, BG, GR, CY, MT` (`math_batch6_central_med_2026.mjs` — `1.901` lecții).
  - **Batch 7 (`8` țări — SE & Est):** `BA, ME, MK, RS, AL, XK, UA, BY` (`math_batch7_southeast_east_2026.mjs` — `1.888` lecții; include nota de pilot 2026/27 pentru clasa a 12-a din Ucraina).
  - **Batch 8 (`7` țări — Turcia, Rusia & Microstate):** `TR, RU, AD, LI, MC, SM, VA` (`math_batch8_microstates_eurasia_2026.mjs` — `1.423` lecții; include tranziția pe cohorte TYMM în Turcia și `VA` universitar `univ-1..univ-4`).
- **Corelare pe manuale / registre oficiale (`602 / 602` pachete școlare + `197 / 197` pachete universitare):**
  - `math_ro_textbook_correlation_2026.mjs` (manuale aprobate reale RO I–XII) + `math_textbook_correlation_all_2026.mjs` (celelalte 48 jurisdicții preuniversitare).
  - Documentat complet în `MATH_50_COUNTRIES_COMPLETION_BOARD_2026.md` și `MATH_TEXTBOOK_CURRICULUM_AUDIT_2026-11-24.md`.
- **Ultimul APK Signed Release verificat:** actualizat la fiecare merge pe `main` (vezi `gh release list --limit 1`).

### B. Localizare completă în toate cele 44 de limbi (`POCKET_LANGUAGES`) — UI, Cont, Voce, Educație & Backend AI (24 nov 2026)
- **Toate cele 44 de limbi din `language_first_install.mjs`** (`ro..rm`, inclusiv `hy`, `ka`, `az` în `#languageSelect` și în căutarea de limbă):
  - **Interfață statică & Cont (`european_app_locales.mjs`, `account_settings_ui.mjs`, `index.js`):** toate cele 34 limbi europene suplimentare + top-10 au carduri, titluri, etichete Setări/Versiune/Confidențialitate, fereastra `Cont` (`POCKET_ACCOUNT_TUPLES` × 44 limbi) și locale BCP-47 pentru dictare/sinteză vocală (`POCKET_BCP47_LOCALES` + `pocketSpeechLocale`).
  - **Educație static + cititor paginat + toate disciplinele (`education_country_ui.mjs`, `math_reader_locale_ui.mjs`, `index.js`):** pâlnie unificată `eduUiLabel` / `learningLabel` pe 44 limbi, pre-traducere pe loturi în `educationOpenPagedLesson` (`data-edu-translated`, TTS pe pagina tradusă și export PDF tradus), localizare la cerere fără pierderi (`node.__pocketOrigText`) pentru `#educationPagedLessonDialog` și `#moduleContent` pe toate materiile și verificare răspunsuri în Științe (`scienceAttachLessonReview`).
  - **Backend AI (`backend.js`):** `POCKET_LANGUAGE_NAMES` (44 limbi), rută dedicată `education_translate` (până la `24.000` caractere, `llama-3.3-70b-instruct-fp8-fast` cu fallback, fără trunchiere la `4.000` caractere) și suport pe toate cele 44 de limbi în toate cele 8 rute (`assistant`, `learning`, `education_study`, creativ, știri).
  - **Buget HTML Worker:** `7.915.857` caractere (`> 84 KB` sub plafonul de `8.000.000`), verificat automat prin `tests_44_language_localization_2026.mjs`.

---

## 3. Ce MAI ESTE DE FĂCUT (Backlog ordonat pentru sesiunile următoare)

**Prioritate stabilită de utilizator:** verificarea acoperirii și continuarea Literaturii, în paralel cu decuplarea completă Educație; ulterior Istorie, Geografie și Informatică. Obiectivul este nivelul general/național: utilizatorul nu dorește aprofundare sau selectoare obligatorii pe landuri/cantoane/regiuni. Preferă un motor comun de traducere în limba selectată, indiferent de țara de studiu, în locul multiplicării manuale a lecțiilor în trei limbi; păstrează originale lingvistice în exerciții și explică pierderea disponibilității offline inițiale când traducerile pre-scrise sunt eliminate și asigură un înlocuitor testat. Vezi `PRIORITATE_EDUCATIE_DECOUPLARE.md` și `EDUCATION_CURRICULUM_COVERAGE_REPORT.md` pentru starea exactă. Extragerile de Literatură, Științe și Matematică sunt parțiale; pilotul serviciului separat (`EDUCATION_PACK_PUBLICATION.md`) este testat local, nu activat în producție. Nu certifică decuplarea completă sau finalizarea curriculară.

1. **Matematică — Selector regional și pe tip de școală / filieră** (plan istoric în `MATH_50_COUNTRIES_COMPLETION_BOARD_2026.md`; nu este prioritar și nu trebuie implementat ca cerință a utilizatorului, care dorește acum nivelul general fără aprofundare regională):
   - **Spania (`ES`):** cele 17 comunități autonome (+ Ceuta/Melilla), cu decretele regionale LOMLOE (Primaria / ESO / Bachillerato).
   - **Germania (`DE`):** cele 16 *Länder* + tipul de școală (*Gymnasium, Realschule/Mittelschule, Gesamtschule*, Grundschule 6 ani în Berlin/Brandenburg, G8/G9, Grund-/Leistungskurs).
   - **Italia (`IT`):** tipul de școală secundară superioară (*liceo scientifico / scienze applicate / classico / linguistico / scienze umane / artistico, istituto tecnico, istituto professionale*).
   - **Extindere pe același mecanism:** cantoane `CH`, comunități `BE`, tipuri `AT` (AHS vs BHS), entități/cantoane `BA`.
   - *Arhitectură:* refolosește tiparul selectorului GCSE tier + overlay-uri în `./public/packs/` (`0 KB` în Worker HTML).

2. **Matematică — Verificare aprofundată capitol-cu-capitol pe manualele naționale aprobate:**
   - Acolo unde `mathCurriculumReadiness()` marchează încă `partial-source-review` (`fullyApproved === 0`), revizuirea detaliată pe ordinea exactă a unităților din manualele aprobate per an/filieră.

3. **Celelalte discipline din `Educație` pe toate cele 50 de jurisdicții** (vezi `EDUCATION_ALL_50_COMPLETION_BOARD_2026-11-20.md`, `EDUCATION_TEXTBOOK_CURRICULUM_AUDIT_2026-11-20.md`, `EDUCATION_COMPLETION_POLICY.md`, `PHYSICS_ACCEPTANCE_2026-11-21.md`):
   - **Științe (`Fizică`, `Chimie`, `Biologie`, `Astronomie`):** verificare pe țară/clasă/cohortă + decuplare în `./public/packs/` pentru orice extindere de conținut (deoarece HTML-ul offline este la ~`7,99 MB` / plafon `8,00 MB`). Notă: există PR draft `#512` pentru Astronomie.
   - **Istorie și Geografie** (`history`, `geography`): extindere dincolo de `RO`/`GB-ENG` cu epoci, spațiu și surse specifice fiecărei țări în pachete decuplate.
   - **Limbă și literatură**, **Informatică**, **Limbi străine** (mod școlar vs CEFR), **Pregătirea examenelor**: aliniere pe cele 50 de sisteme + corelare onestă cu programele/manualele oficiale.

---

## 4. Comenzi rapide de diagnostic la deschiderea unei sesiuni noi
```bash
git log -5 --oneline
node scripts/build_curriculum_packs.mjs --verify
node tests_math_ro_textbook_correlation_2026.mjs
node tests_math_curriculum_readiness.mjs
node tests_44_language_localization_2026.mjs
node tests_education_hg_theory_coverage.mjs
gh release list --limit 3
```
