# Germania — servicii comerciale versus găzduire proprie

Verificat la **26 noiembrie 2026**. Cercetare pentru myPocketAI, cu monetizare
planificată. Nu este ofertă contractuală, aviz juridic sau comandă de servicii.

## Concluzie pentru decizie

**Nu recomand cumpărarea imediată a unui server.** Întâi merită cerută o ofertă
triptix pentru Germania și clarificate eligibilitatea, datele și costurile HERE.
Apoi alegem pe baza unei probe locale/interurbane, nu numai a unei liste de țări.

| Variantă | Ce este confirmat | Cost public verificabil | Ce încă lipsește |
|---|---|---|---|
| **triptix — MOTIS găzduit** | Fondatorul declară hosting/consultanță MOTIS și filtrarea datelor noncomerciale sau acorduri cu proprietarii | **Necunoscut; cerere de ofertă.** Site-ul are link Pricing, dar pagina nu a putut fi citită în această verificare | Preț DE, versiune API, autentificare, acoperire după filtrare, SLA, condiții reale |
| **HERE Public Transit v8** | API de rute, moduri locale/interurbane, opriri intermediare cu coordonate; tarif public pe cerere | **5.000 tranzacții/lună gratuite; 2,33 €/1.000 în pragul 5.001–200.000**, conform paginii publice, sub rezerva acordului | Eligibilitatea exactă a aplicației; orare efective versus estimated; probe DE; adaptor HERE separat și atribuiri complete |
| **MOTIS găzduit de noi** | Motorul MIT și adaptorul pregătit local pot fi folosite într-o arhitectură proprie, după verificarea datelor | Licența motorului nu are tarif SaaS; **serverul/operarea/datele pot costa**, exemple infra mai jos | Dimensionare/import real, licențe, surse locale+interurbane, refresh, securitate, monitorizare, backup |
| **Navitia/Hove** | Site-ul Navitia consultat redirecționează spre Hove, care oferă soluții de informare călători | **Nu am validat un tarif actual pentru serviciul necesar** | Ofertă, acoperire Germania, contract API; nu îl tratăm ca alternativă gata de activare |

**Niciunul nu este activat pentru DE.** Nu am creat cont, trimis mesaj, acceptat
condiții, introdus card sau pornit o probă API cu consum. Finlanda/Estonia și
backendul publicat v185 nu au fost modificate. Nu am construit APK.

## 1. triptix: prima cerere de ofertă recomandată

- Site oficial: https://triptix.tech/
- Contact oficial publicat în imprint: **felix@triptix.tech**.
- Identitate/contact: https://triptix.tech/legal/imprint/
- Declarația publică a fondatorului, 29 octombrie 2026:
  https://github.com/public-transport/transitous/pull/2606#discussion_r4415897799

În acea discuție, fondatorul explică separat că triptix oferă hosting MOTIS și
consultanță și că, pentru oferta comercială, filtrează feeduri noncomerciale sau
obține acorduri. Aceasta este o pistă verificabilă, **nu un acord pentru myPocketAI**
și nu dovedește că toate datele dorite în Germania sunt deja incluse.

Compatibilitatea cu adaptorul nostru `/api/v6/plan`, normalizarea timpilor și
listele complete de opriri trebuie confirmate pe contract/mediu de probă. Nu
presupunem versiunea numai din numele MOTIS. Contractul actual local este pinuit
la v2.11.4; versiuni mai noi pot necesita retestare.

Nu am obținut un tarif actual: `/pricing` și `/docs`, deși legate de homepage,
nu au putut fi citite în această sesiune, iar căutarea nu a furnizat un tarif.
**Nu inventăm un abonament lunar.** Suma de circa 1.000 €/lună din alt comentariu
al discuției este pentru infrastructura serviciului comunitar la scara descrisă
acolo, NU o ofertă triptix și NU o estimare a necesarului Germaniei/myPocketAI.

### Mesaj pregătit, netrimis

**To:** felix@triptix.tech  
**Subject:** Commercial MOTIS hosting enquiry — domestic public transport in Germany

> Hello,
>
> I am developing myPocketAI, a mobile assistant with planned future commercial
> use. I am evaluating a managed routing service for domestic public transport
> within Germany, including local buses, trams, metro/suburban rail and intercity
> rail/coach journeys. This is a pre-launch evaluation, not a claim of existing
> user traffic.
>
> Could you provide information and a quote covering:
>
> 1. Commercial data rights and attribution requirements, including any gaps after
>    excluding non-commercial feeds. Which German local/rural networks and
>    intercity operators are included?
> 2. MOTIS API version and compatibility with GET /api/v6/plan, full intermediate
>    stop coordinates, scheduled versus realtime times and cancellation data.
> 3. Pricing scenarios at 1,000, 10,000 and 100,000 routing requests per month;
>    setup/minimum fees, overage, VAT, contract term and cancellation conditions.
> 4. An evaluation environment and whether a hard spending/request limit can be
>    enforced without automatic paid overage.
> 5. Feed refresh frequency, timetable horizon, uptime/support terms, EU hosting,
>    coordinate logging/retention and availability of a data processing agreement.
>
> Our app will independently verify the GPS country, destination and reported
> stops and reject cross-border itineraries in domestic mode. We do not need
> ticket sales or seat guarantees for this initial scope.
>
> Please quote Germany separately. Optional Austria/Switzerland expansion can be
> listed separately, without assuming the same coverage or commercial rights.
>
> Thank you.

Acest mesaj este doar un draft; **nu a fost trimis** și nu conține date personale,
secrete sau volume prezentate fals ca trafic existent.

## 2. HERE: preț verificabil, dar nu este un drop-in MOTIS

### Tarif Public Transit, nu alt produs HERE

Sursa oficială consultată:
https://www.here.com/get-started/pricing — secțiunea **HERE Transit → Public Transit**.

| Tranzacții Public Transit/lună | Tarif afișat / 1.000 |
|---|---:|
| 0–5.000 | Gratuit |
| 5.001–200.000 | 2,33 € |
| 200.001–1.000.000 | 1,87 € |
| Peste 1.000.000 | Contact |

Pagina precizează că prețurile sunt **estimări indicative**, iar oferta finală
depinde de acord. Confirmăm în cont moneda, tratamentul taxelor, pragurile și
facturarea înainte de activare. Nu extrapolăm gratuitatea la toate API-urile.

**O cerere = o tranzacție** pentru Public Transit, conform paginii. Nu confunda:

- Public Transit cu **Intermodal Routing**, care are alte praguri/reguli;
- `Routing Bus` rutier, care calculează traseul unui vehicul, cu rutele de
  transport public care respectă orare;
- numărul căutărilor utilizatorului cu numărul total de cereri facturabile.

Exemple calculate **numai în primul prag plătit**, fără alte API-uri/costuri:

| Căutări utilizator/lună | La 1 cerere/căutare | La 2 cereri/căutare |
|---|---:|---:|
| 1.000 | 0 € | 0 € |
| 2.500 | 0 € | 0 € |
| 5.000 | 0 € | 11,65 € |
| 10.000 | 11,65 € | 34,95 € |
| 50.000 | 104,85 € | 221,35 € |

Formula pentru aceste exemple:
`max(0, cereri_lunare - 5000) × 2,33 / 1000`.

Scenariul de două cereri reprezintă, de exemplu, o căutare generală plus una
bus-only. **Nu există încă adaptor HERE** în acest flux și nu am măsurat traficul.
Mai multe alternative pot fi cerute în aceeași cerere; nu înseamnă automat o
tranzacție pentru fiecare itinerar în Public Transit. Retry-urile, cererile de
stații/plecări și eventualul consum comun al contului trebuie incluse în calcul.

Geocodarea țării, căutarea destinației, hărțile, alte produse HERE/Geoapify și
Workerul sunt costuri/cote separate. Nu am dedus din acest tabel un cost total
al aplicației. Limita proprie de consum/blocarea la prag ar trebui implementată
și verificată înainte de utilizare; **nu este activă acum**, iar o alertă de
buget nu este automat un hard stop.

### Acoperire și calitatea datelor

- Endpointul documentat este `https://transit.router.hereapi.com/v8/routes`.
- `return=intermediate` cere opririle intermediare cu nume/coordonate/timpi.
- Modurile includ autobuz, metrou, tramvai/light rail și trenuri regionale/
  intercity/rapide. Aceasta nu dovedește acoperirea tuturor operatorilor DE.
- HERE documentează trei niveluri: **realtime, timetable și estimated**. În
  nivelul estimated poate lipsi orarul granular și rețeaua poate fi incompletă.
  Pentru cerința noastră de curse verificabile, **nu vom prezenta un rezultat
  estimated ca orar confirmat**. Trebuie verificat mecanismul de identificare/
  filtrare înainte de alegerea serviciului.
- Tabelul de acoperire este pe oraș/operator, nu o garanție națională; versiunea
  extrasă este paginată și nu a permis verificarea completă a Germaniei. Jurnalul
  oficial conține modificări DE, inclusiv realtime adăugat și retras. Retragerea
  realtime nu înseamnă automat retragerea orarului, dar impune etichete corecte.
- Atribuirile `sections[].attributions` cerute de operatori trebuie afișate
  **integral lângă rută**. Nu presupunem că textul generic limitat la 700 de
  caractere din UI-ul actual este suficient pentru toate răspunsurile HERE.
- HERE necesită un adaptor distinct și teste noi. Nu punem URL-ul HERE în
  `GERMANY_MOTIS_BASE_URL`; protocoalele nu sunt compatibile.

### Condiții comerciale și cont

Pagina oficială Base Plan are excluderi pentru Asset Management, UBI/Telematics
și Optimization și o definiție largă pentru Asset. Nu afirmăm că planificarea
personală în myPocketAI intră sau nu în acele excluderi: **cerem clarificarea
cazului exact**, inclusiv folosirea GPS și a backendului într-o aplicație cu
mai multe funcții. Sunt și reguli App ID separate; nu presupunem că același ID
poate fi partajat între aplicații/versiuni mobile-server fără verificare.

Dacă alegem HERE după clarificări, documentația indică:
**HERE platform → Access Manager → Apps → Register new app → Credentials → API
Keys → Create API key**. Nu este cerere să creezi cheia ori să activezi facturarea
acum. Nu solicităm cheia/cardul/parolele în conversație și nu folosim cheia
Digitransit pentru HERE.

## 3. Găzduire proprie: numai referințe de infrastructură, nu dimensionare MOTIS

Pe paginile oficiale Hetzner consultate, rândurile **NBG1, Germania** arată:

| Instanță | Resurse afișate | Preț lunar fără TVA | Semnificație |
|---|---|---:|---|
| CPX42 | 8 vCPU partajate, 16 GB RAM, 320 GB NVMe | 69,99 € | Referință de buget, NU recomandare de capacitate |
| CPX62 | 16 vCPU partajate, 32 GB RAM, 640 GB NVMe | 130,49 € | Referință de buget, NU instanță testată |

Sursa: https://www.hetzner.com/cloud/regular-performance/

Acestea sunt prețurile regiunii indicate, nu prețul minim „from” din altă țară.
Pagina extrasă afișează și mesaje de indisponibilitate; **nu am verificat stocul
comandabil în consolă**. Prețul final/IP/backup/stocare suplimentară și TVA se
confirmă la configurare. Nu am comandat serverul și nu am evaluat altă regiune
ca fiind echivalentă contractual.

**Nu am demonstrat că 16 sau 32 GB sunt suficienți.** Importul, datele OSM,
orizontul de orare, concurența, accesul pietonal și reimportul fără întrerupere
pot cere alte resurse. Server de import separat, dublarea instanțelor pentru
actualizare și backup pot mări costul. Costul licențelor datelor și al operării
nu dispare pentru că motorul este open-source.

Înaintea achiziției: benchmark controlat cu dataset licențiat, măsurare de RAM
maxim/import, disc temporar+final, durată import, latențe p50/p95, QPS și refresh.
Nici acesta nu se pornește cu costuri sau pe Oracle existent fără acord.

## 4. Acceptanță minimă înainte de a spune „Germania conectată”

1. Acord comercial și drepturi pentru sursele efective; tarife/cote/limită consum.
2. Proba locală Frankfurt, încă un oraș din alt land și un caz rural/regional.
3. Proba interurbană Frankfurt–Berlin și un traseu cu schimbare, orare actuale.
4. Cazuri DE→AT/CH respinse în modul național și stop intermediar străin refuzat.
5. Calendar/plecare corecte, anulări, opriri complete, scheduled versus realtime
   versus estimated, atribuiri integrale, fără tarif/locuri garantate inventate.
6. Datele de localizare trimise și retenția clarificate; chei numai server-side,
   fără URL-uri cu secrete în loguri, aplicație sau rapoarte.
7. Abia apoi publicare autorizată; livrarea frontend/APK este etapă separată.

## Surse oficiale și limite ale cercetării

- triptix homepage și contact: https://triptix.tech/ și
  https://triptix.tech/legal/imprint/ — citite. Pricing/docs: acces eșuat, preț
  necunoscut; declarația hosting este comentariul public al fondatorului de mai sus.
- HERE prețuri: https://www.here.com/get-started/pricing — toate cele trei bucăți
  citite, inclusiv Public Transit. Nu folosim prețul altui API.
- HERE restricții: https://www.here.com/get-started/pricing/base-plan-restrictions
- HERE API: https://docs.here.com/transit/reference/public-transit-api-v8-getroutes
- HERE pornire/cheie: https://docs.here.com/transit/docs/quick-start-1
- HERE calitate: https://docs.here.com/transit/docs/coverage
- HERE tabel de acoperire: https://docs.here.com/transit/docs/coverage-transit
- HERE modificări DE: https://docs.here.com/transit/docs/recent-changes-transit
- HERE atribuiri: https://docs.here.com/transit/docs/copyrights
- Hetzner prețuri: https://www.hetzner.com/cloud/regular-performance/ — rândurile
  CPX42/CPX62 din NBG1, nu oferta minimă afișată pentru HEL1.
- Navitia pricing consultat: https://www.navitia.io/en/pricing — redirecționează
  către https://www.hove.com/fr/ fără tarif verificabil pentru Germania. Nu cităm
  drept ofertă curentă cifrele de pe agregatoare.

Cercetarea constă în citirea paginilor și verificarea aritmeticii. **Nu au fost
apelate API-uri de rutare comerciale**, nu s-au făcut rezervări, cereri de ofertă
trimise sau teste fizice. Nu a fost schimbat codul de producție în această etapă.
