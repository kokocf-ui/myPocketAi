# Test de referință România — Oradea, 12.11.2026

## Scop
Comparație între date publice independente și rezultate care ar trebui recuperate de Eva, pe un cerc de 5 km, fără a presupune că backend-ul funcționează.
**Status: referințe externe identificate. Testul end-to-end Eva NU a fost executat.**

## Punct de test
- Țara: România (RO), municipiul Oradea, Bihor
- Adresă: Calea Republicii nr. 12
- Coordonate de referință: 47.0594, 21.9349
- Rază: 5000 metri, distanță geodezică, nu traseu pietonal
- Dovadă pentru coordonate: https://www.istoriaadresei.com/calea-republicii-12-oradea-410025-romania

## Referințe publice identificate
| Categorie | Exemplu | Adresă | Dovadă |
|---|---|---|---|
| restaurant | Japanos Oradea | Strada Republicii 13, Oradea | listare locală (căutare business din 12.11.2026) |
| restaurant | ReWine Bistro | Strada Republicii 31, Oradea | listare locală (căutare business din 12.11.2026) |
| farmacie | Farmacia Vitalogy Republicii | Strada Republicii 26, Oradea | listare locală (căutare business din 12.11.2026) |
| farmacie | Farmacia DONA | Strada Republicii 28, Oradea | listare locală (căutare business din 12.11.2026) |
| supermarket | Carrefour Express | Calea Republicii 1, Oradea | listare locală (căutare business din 12.11.2026) |
| muzeu | Casa Darvas-La Roche | Strada Iosif Vulcan 11, Oradea | listare locală (căutare business din 12.11.2026) |
| hotel | Ivana Hotel | Calea Republicii 15, Oradea | https://bihor.info/en/oradea/where-to-stay/ivana-hotel/ |
| muzeu | Muzeul Farmaciei | Strada Republicii 33, Oradea | https://www.visitoradea.com/ro/what-to-see/muzeul-farmaciei |
| parcare | Parcări stradale Republicii | Strada Republicii | https://oradea.ro/pentru-cetateni/parcari/parcari-publice-stradale/tipuri-de-parcari-tarife-plata/ |

**Notă:** Adresele de pe Republicii sunt apropiate de punctul de referință, însă această inventariere nu este o listă completă a tuturor POI din cercul de 5 km. Nu a fost verificată individual distanța geodezică pentru fiecare rezultat. Nu înseamnă că fiecare unitate este deschisă acum.

## Verificări backend încercate
1. `https://lifewise-ai-v2.kokocf.workers.dev/__ui_version` — inaccesibil prin instrumentul web în sesiunea curentă.
2. Aceeași adresă, cerere HTTPS din container — rezolvare DNS eșuată în mediul de test (NameResolutionError); acest lucru **nu demonstrează** indisponibilitatea serviciului pentru utilizator.
3. Conectorul GitHub a confirmat existența `backend.js` și a motorului de căutări POI, dar o inspecție de cod nu înlocuiește o execuție live.

## Cazuri de test pentru implementare
- RO-01: `restaurant`, lat 47.0594, lon 21.9349, radius 5000
- RO-02: `pharmacy`, aceleași coordonate și rază
- RO-03: `supermarket`, aceleași coordonate și rază
- RO-04: `museum`, aceleași coordonate și rază
- RO-05: `parking`, aceleași coordonate și rază
- RO-06: `hotel`, aceleași coordonate și rază

### Criterii
- Confirmă țara RO din destinația verificată, nu din limba telefonului sau locația britanică.
- Nu interoga surse exclusiv britanice.
- Respectă raza de 5 km; nu confunda drumul pietonal cu distanța de căutare.
- Elimini dublurile reale, nu unități distincte ale aceleiași rețele.
- Nicio adresă, fotografie, program sau disponibilitate nu trebuie inventate.
- Raportează separat zero rezultate reale și eroare tehnică sau lipsă autorizație.
- Compară rezultatele Eva cu referințele publice, apoi verifică fiecare nepotrivire.

## Concluzie
**Datele locale de comparație există pe internet. Nu se poate declara încă testul backend trecut.**
Nu s-a modificat backend-ul de producție, nu s-a creat un APK, și nu au fost executate interogări live către Eva în mediul curent.

## 22:55 — Test tehnic adăugat pe ramura separată
- `tests_country_provider_bridge.mjs` include scenariul Oradea, 47.0594 / 21.9349, radius 5000 metri.
- Verifică numai Geoapify + Photon pentru România; directorul britanic și TfL nu trebuie interogate.
- Două exemple simulate în interiorul razei trebuie păstrate; un exemplu simulat la peste 5 km și unul fără coordonate trebuie eliminate.
- `country_provider_bridge.mjs` filtrează rezultatele după distanța geodezică numai când există centru și rază valide și colectează diagnostice pe furnizori.
- **Neconfirmat:** rularea GitHub Actions (niciun status CI returnat pentru ultimul commit), rezultatele live din Eva, timpii de răspuns și verificarea fizică a obiectivelor.
- Testele nu au fost adăugate la APK sau activarea live. Feedback-ul local din Oradea rămâne esențial pentru verificarea diferențelor față de inventarul extern.
