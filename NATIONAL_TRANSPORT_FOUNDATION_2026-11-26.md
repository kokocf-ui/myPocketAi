# Transport public național — bază pe țări și selecție locală România

## Cererea și limita acestei etape

Transport public se adaptează la țara **GPS-ului telefonului**, pentru deplasări
locale și interurbane în aceeași țară. Nu este modul transfrontalier din
Directions / Deplasare spre… . Experiența urmărită: o singură aplicație pentru
orientarea într-o localitate/țară necunoscută, fără selectoare obligatorii de județ.

**Aceasta este o etapă de infrastructură, nu implementarea transportului complet
în toate țările. Nu s-au obținut/importat date noi, nu s-au activat furnizori și nu
s-a verificat disponibilitatea lor live. Nu s-a publicat nimic și nu s-a construit
un APK. Ultimul livrat rămâne 501884 / backend v183.**

## Ce am constatat

- Routerul local românesc avea patru regiuni în cod: Oradea, București, Cluj, Iași,
  nu numai București. Asta nu demonstra însă ce funcționează în instalarea live.
- Registrul avea deja cele 42 de coduri de județ/București, dar serverul și
  clientul nu le foloseau pentru selecția automată în afara celor patru zone.
- Catalogul european de surse exista, dar o sursă în catalog nu reprezintă un
  adaptor conectat sau drepturi de utilizare comercială.
- Imaginea Oracle nu copia un modul deja importat de server:
  `transport_route_topology.mjs`.

## Modificări

### 1. Fișă separată pentru fiecare țară din catalog

`national_transport_registry.mjs` centralizează cele **49 de intrări ale
catalogului european existent**, politica domestică și adaptoarele implementate.
`smart_country_registry.mjs` și backendul folosesc această sursă comună în locul
listelor duplicate de adaptoare/configurare.

| Grup | Adaptoare implementate în cod | Ce NU afirmăm |
|---|---|---|
| RO | `ro_urban_gtfs`, `ro_national_transit` (Bilo) | Nu există dovadă de acoperire urbană/rurală sau interurbană integrală |
| GB | `tfl`, `en_urban_gtfs`, `uk_national_transit` | TfL nu înseamnă transport local în întregul Regat Unit; datele engleze nu acoperă automat celelalte națiuni |
| Celelalte 47 de intrări | Niciun adaptor național conectat de această etapă | Referințele la NAP/operatori nu produc rute și nu acordă licențe |

Endpointul de identificare GPS întoarce separat configurația urbană/interurbană,
lista adaptoarelor, starea integrării și `countrywide_coverage_verified:false`.
`coverage_status` rămâne `not_connected` pentru țările neconectate. Câmpul vechi
`supported` păstrează sensul de „există un adaptor configurat pentru țară”, **nu**
„există un traseu oriunde”. Interfața explică pentru RO și GB că acoperirea locală
se verifică la căutare și că „configurat” nu înseamnă orice localitate.

Configurațiile private sunt verificate pentru token de minimum 32 de caractere,
binding cu `fetch` sau URL HTTPS valid, fără acreditări/query/path arbitrar.
Prezența acestora nu demonstrează sănătatea serviciului ori existența feedurilor.

### 2. România: eliminarea limitei de patru zone pentru cererile locale verificate

- Clientul poate cere selecție automată `region: "romania"` pentru perechi locale
  românești verificate, inclusiv în afara celor patru raze inițiale.
- Serverul poate încărca toate cele 42 de sloturi județene, cele patru fișiere
  legacy și un agregat opțional `romania.json`: **47 de nume de fișier acceptate**.
- `romanian_gtfs_dispatch.mjs` verifică stații reale din datele importate lângă
  ambele capete, nu selectează o rețea numai după numele județului sau bounding box.
- Planificarea rămâne în interiorul fiecărui feed. Nu unește ID-uri ori nume de
  stații din feeduri diferite. Deduplică și ordonează rezultatele și păstrează o
  alternativă bus-only documentată când sunt cerute mai multe rezultate.
- Când nu există feed/stații apropiate/conexiune documentată, nu fabrică trasee.
  Nu substituie Bilo unei căutări locale fără acoperire. Liniile fără orar rămân
  explicit fără orar, fără promisiunea serviciului în ziua selectată.
- Pentru extinderea în zone noi, „local” folosește pragul existent de 18 km;
  distanțele mai mari rămân pe calea interurbană. Vechile raze urbane sunt păstrate
  pentru compatibilitate. Nu este încă un motor rural/regional complet.
- Încărcarea are limită **cumulată de 150 MiB JSON**, nu 150 MiB în fiecare dintre
  cele 47 de sloturi; RAM-ul real și huburile aglomerate necesită teste cu feeduri.
- Dockerfile include acum toate dependențele locale ale serverului. Nicio imagine
  sau instanță Oracle nu a fost construită, pornită ori modificată la distanță.

### 3. GPS și separarea modurilor

După verificarea independentă a ambelor țări, planificatoarele primesc originea
GPS și țara verificată a destinației, nu origini rămase dintr-o căutare mixtă ori
un cod de țară neactualizat din autocomplete. La Bilo, originea națională este
localitatea rezolvată din GPS, iar destinația este cea selectată; un text rămas
cu altă pereche de orașe nu le înlocuiește. Cererile naționale nu activează
căutarea mixtă suplimentară, chiar dacă primesc accidental și `mixed_journey`.
Destinațiile din altă țară sunt respinse înainte de apelarea routerului.

Modul Directions / Deplasare spre… își păstrează motorul separat și alternativele
mixte orientative. Rutarea pietonală și marcajele de acces neverificat rămân.

## Verificări locale

- `npm run test:national-transport`: **13 comenzi PASS**; include **9 teste noi**:
  toate fișele de țară, configurații private valide/invalide, coordonate locale în
  Timișoara/Brașov/Constanța/Suceava, sloturi și buget cumulat, date efective lângă
  ambele capete, bus-only, lipsă feed/conexiuni, linie fără orar, client→server HTTP
  cu token, Worker cu GPS și destinație externă blocată, Bilo cu localitatea GPS
  în loc de originea textuală veche, dependențele Docker.
- `npm run test:transit-audit`: 19 comenzi PASS.
- `npm run test:mixed-orientation`: 11 comenzi PASS.
- `node tests_mixed_indicative_planning.mjs`: PASS.
- `npm run check`: PASS; verificări de sintaxă pentru modulele noi: PASS.
- Wrangler dry-run frontend și backend: PASS, **fără deploy**.
- Browser Chromium pe bundle-ul frontend: **360/393/430 px PASS** pentru mesajele
  RO/GB, GPS simulat, câmpul de destinație utilizabil, fără overflow orizontal,
  țară neconectată DE și viewport redus pentru tastatură.
- Snapshot HTML local: **6.990.923 B < 8.000.000 B**; nu este un APK.

Testele folosesc **date sintetice și răspunsuri de furnizor simulate**. Nu sunt
acceptanță fizică Android și nu demonstrează rute sau orare live.

O verificare suplimentară în afara suitei de mai sus,
`tests_country_city_choice_resume.mjs`, eșuează la aserțiunea textuală veche
`place_context:state.placeSearchContext||null`. Codul frontend folosea deja înaintea
acestei etape condiția `assistantGeoAllowed?(state.placeSearchContext||null):null`;
`index.js` și testul respectiv nu au fost modificate. Nu am slăbit acea protecție
pentru a satisface un șir căutat de test și nu declar întreaga suită a repo-ului verde.

## Ce mai trebuie pentru obiectivul complet

1. Inventar real, pe țară/operator/zonă, al surselor și drepturilor de reutilizare.
2. România: date licențiate și actualizate pentru alte orașe/județe, importuri
   private, verificarea calendarelor și acoperirii. Numai conectarea codului nu
   adaugă efectiv niciun orar nou în telefon.
3. Pentru alte țări: adaptoare reale, normalizare, verificări de țară și orare,
   limite/costuri/chei unde sunt necesare. Catalogul singur nu este implementare.
4. Rețele rurale, regionale, conexiuni între operatori/feeduri și first/last mile:
   date despre transferuri și validare, nu presupuneri după proximitate.
5. Teste cu furnizorii reali, încărcare/memorie și trasee fizice reprezentative.
6. Publicare backend/router/APK **numai după autorizare explicită**.
