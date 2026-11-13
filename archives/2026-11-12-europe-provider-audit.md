# Arhivă audit registru european — 12 noiembrie 2026

**Proiect:** myPocketAI / Eva  
**Ramură:** `feature/smart-country-registry` (PR draft #385)  
**Scop:** verificare surse și păstrarea dovezilor, fără activarea furnizorilor live.  
**Metodă:** verificarea paginilor oficiale/documentației; fără cereri API autentificate și fără testarea conexiunilor reale.

## Inventar confirmat
- 49 de coduri de țări/teritorii în `EUROPE_COUNTRIES`, fără duplicate.
- 15 profiluri cu surse nominalizate naționale/regionale la momentul arhivării: RO, GB, FR, DE, NL, NO, SE, FI, CH, AT, ES, IT, IE, BE, CZ.
- Celelalte profiluri sunt **schelete pentru extindere**, cu surse comune pentru descoperire geografică și catalog NAP, nu cu transport local verificat.
- Secțiunile `transport` și `general` sunt prezente pentru fiecare țară.
- Prezența în catalog nu înseamnă acces API, drept de reutilizare, orar live sau conectare la backend.

## Pagini validate ca surse/documentație existente
| ID | Țară / scop | Dovadă | Rezultat / limitări |
|---|---|---|---|
| eu_nap_directory | Europa / NAP | https://transport.ec.europa.eu/transport-themes/smart-mobility/road/its-directive-and-action-plan/national-access-points_en | Director instituțional de **metadate**, nu API universal de rutare |
| ro_open_data, ro_rail_open_data | România | https://data.gov.ro/ | Portal verificat, dar **datasetul feroviar specific nu a fost verificat** |
| ro_bilo_evidence | România | https://bilo.ro/surse-de-date | Pagina surselor confirmată; nu demonstrează drept de folosire a datelor sau acces API |
| ro_rail_infofer | România | https://mersultrenurilor.infofer.ro/ | Site orare confirmat; nu implică API sau reutilizare automată |
| ro_tourism_registry | România | https://se.situr.gov.ro/OpenData/OpenDataMain | Registru oficial de structuri turistice, cu date actualizate |
| ro_pharmacy_registry | România | https://www.ms.ro/ro/informatii-de-interes-public/registre/registrul-farmaciilor/ | Registru oficial identificat; **URL corectat** în catalog |
| ro_nap_road | România | https://nap.cnadnr.ro/ | Hartă/director NAP; nu este planificator de transport |
| fr_nap | Franța | https://transport.data.gouv.fr/ | Portal național cu date statice, timp real și API-uri; licențe la nivel de dataset |
| de_delfi | Germania | https://www.opendata-oepnv.de/ht/en/organisation/delfi/start | Date DELFI existente; acces/termeni pentru seturi de date de verificat |
| it_nap_mmtis | Italia | https://www.cciss.it/nap/mmtis/public/en/static/multimodal | Portal MMTIS și metadate NeTEx confirmate |
| nl_ndov | Țările de Jos | https://www2.ndovloket.nl/ | Date deschise, CC0 indicat pe portal; NDOV **nu este planificator de rute** |
| no_entur | Norvegia | https://developer.entur.no/open-data/timetable | GTFS/NeTEx, licență NLOD; API cu identificarea clientului |
| se_trafiklab | Suedia | https://www.trafiklab.se/ | GTFS, NeTEx, API; condiții și autentificare în funcție de produs |
| fi_digitransit | Finlanda | https://digitransit.fi/en/developers/apis/ | API de itinerarii și date; înregistrare și cheie necesare |
| ch_transportdata | Elveția | https://opentransportdata.swiss/en/cookbook/timetable-cookbook/gtfs/ | GTFS și documentație confirmate |
| es_transport_hermes | Spania | https://datos.gob.es/es/aplicaciones/hermes | Portal Hermes identificat; **nu confirmă API de căutare rute** |
| ie_nta_gtfs | Irlanda | https://data.gov.ie/dataset/nta-gtfs | Date GTFS, licență CC-BY 4.0 |
| ie_nta_live | Irlanda | https://developer.nationaltransport.ie/ | API portal; necesită chei pentru folosire |
| be_rail_open | Belgia | https://www.belgiantrain.be/en/3rd-party-services/mobility-service-providers/public-data/ | Pagina orare și date de timp real confirmată; termenii pentru feed verificabili separat |
| cz_prague_pid | Cehia (Praga) | https://pid.cz/en/opendata/ | GTFS, GTFS-RT și API metropolitan; **nu acoperire națională** |
| geoapify | Comun | https://www.geoapify.com/ | Platformă geocodificare, POI, rutare; necesită cheie/plan |
| photon | Comun | https://photon.komoot.io/ | Căutare OSM și geocodificare; serviciul public nu este garantat pentru încărcări mari |
| europeana_culture | Europa / patrimoniu | https://www.europeana.eu/en/apis | API cultural; cont și cheie necesare |

## Verificări parțiale sau încă deschise
- **gb_bus_open_data:** cererea automată a primit 403; indisponibilitatea pentru crawler **nu demonstrează** indisponibilitatea API-ului.
- **at_mobility_data:** pagina a fost accesată, dar nu a returnat conținut lizibil pentru audit; verificare suplimentară necesară.
- **ro_rail_open_data:** confirmat catalogul `data.gov.ro`, nu exact setul de date sau actualitatea lui.
- **tomtom_places:** modulul există în repository cu activare opțională; nu s-au verificat cheile, planul sau disponibilitatea live.
- **gb_tfl, gb_national_rail, fr_open_data:** înregistrate în catalog, dar nu verificate individual în această rundă.
- **ro_urban_oracle:** adaptor în repository, dar conectarea și datele GTFS din server nu au fost testate live.
- Identificarea unora dintre surse nu stabilește dreptul de extragere automată de pe site-uri publice; se va verifica licența/contractul pentru fiecare adaptor.

## Stadiu tehnic și reguli de siguranță
- Registrul are integrare **opt-in** la căutarea POI cu destinație geocodificată și cod de țară verificat.
- Nu s-a activat `SMART_COUNTRY_REGISTRY_ENABLED` în producție.
- Căutările GPS fără țara verificată păstrează modul vechi. Nu se pretinde rutare internațională completă.
- `planMixedTransportSources` selectează furnizori în funcție de etape validate, dar **nu** este încă legat la planificatorul final al rutelor, nu colectează zboruri și nu verifică orele reale de transfer.
- Execuția GitHub Actions, testele live, validarea licențelor și testarea APK **nu sunt confirmate** la data arhivării.
- A nu se face merge/deploy automat până la validarea acestor puncte.

## Următoarele priorități
1. Verificarea tuturor țărilor fără furnizori naționali specifici și clasificarea lor pe categorii.
2. Confirmarea licențelor și autentificării, mai ales pentru aplicație distribuită public.
3. Implementarea adaptorilor locali și integrarea incrementală a planificatorului mixt.
4. Teste automate + probe reale România/UK/Italia, apoi aprobarea explicită pentru merge/deploy.

**Notă arhivă:** Acesta este un audit documentar punctual, nu certificare a acoperirii europene sau a accesului în producție.
