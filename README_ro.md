# myPocket AI — backend v108 + frontend v1.0.77

31 octombrie 2026. Baza este ramura GitHub `main`, commit `1437f076edd8e5752cbc5b11bb9b28c917dcbbbf` (backend v107 / frontend 1.0.76). Actualizarea directă a fost refuzată de integrarea GitHub: HTTP 403 „Resource not accessible by integration”. Repository-ul nu a fost modificat. Încarcă manual fișierele din acest pachet în rădăcina repository-ului; workflow-ul existent publică ambele Workers la actualizarea ramurii `main`.

## Corecții

- Meteo folosește acum Open-Meteo, fără generare de temperaturi prin modelul lingvistic. Cererea numește localitatea, data și fusul orar; răspunsul zilnic arată minima și maxima, iar probabilitatea precipitațiilor și vântul maxim apar doar când sunt disponibile. Condițiile actuale sunt identificate drept estimări ale modelului meteo.
- „Câte grade vor fi mâine în Oradea?” → „Dar în Grays?” păstrează ziua și înlocuiește localitatea. Nu formează „Oradea în Grays”. Contextul meteo este transmis separat de istoricul de mesaje, se păstrează la arhivare/restaurare și se șterge la conversație nouă sau schimbarea subiectului.
- O localitate explicită are prioritate față de GPS. Un oraș negăsit nu este înlocuit cu poziția telefonului. Când orașul este ambiguu, utilizatorul alege numărul sau țara. Pentru „aici” se folosesc coordonate GPS valide; altfel este cerută localitatea.
- Sunt recunoscute azi, mâine, poimâine, acum și date ISO `AAAA-LL-ZZ`. Pentru alte formulări de dată se poate solicita data exactă. Limita prognozei: azi și următoarele 15 zile, după fusul localității. Data din răspuns este întotdeauna explicită.
- HTTP 429, timeout, răspunsuri fără data cerută, temperaturi nule, unități greșite sau valori inconsistente produc mesaj de indisponibilitate, fără temperaturi inventate. Sursa Open-Meteo și momentul preluării sunt vizibile. Momentul preluării nu este prezentat ca moment al actualizării modelului furnizorului.
- Cele 10 limbi au etichete meteo deterministe. Recunoașterea formulărilor a fost verificată în principal în română și engleză; nu este garantată orice formulare în toate limbile.
- Dublurile Paris cu aceleași componente administrative, în ordine diferită, sunt comasate când coordonatele sunt apropiate. Localitățile diferite din Texas/Illinois rămân opțiuni distincte.

## Fișiere și publicare

Fișierele actualizării: `backend.js`, `index.js`, `README.md`, `README_ro.md`, `VERSION_LOG.md`, `package.json`, `tests.mjs`, `tests_reader.mjs`, `tests_weather.mjs`.

Sunt păstrate numele Workers, endpoint-ul API, configurațiile Wrangler, binding-ul AI, secretele existente și workflow-ul de publicare. Nu se modifică bara fixă de navigare sau avatarul. Fotografii de hotel și tarife live nu sunt implementate.

`tests_reader.mjs` era absent din GitHub, deși `package.json` îl menționa; este inclus acum. `tests_weather.mjs` adaugă regresiile meteo.

## Serviciul meteo

API public: https://api.open-meteo.com/v1/forecast. Pentru testarea personală necomercială nu este necesară o cheie. Pentru utilizare comercială/abonamente/reclame, Open-Meteo cere un plan comercial: https://open-meteo.com/en/terms. Secretul opțional `OPEN_METEO_API_KEY` selectează endpoint-ul `customer-api.open-meteo.com`; cheia nu este inclusă în cod sau în răspunsuri. Nu este cumpărat sau activat vreun abonament de această actualizare.

Documentație: https://open-meteo.com/en/docs. Datele sunt atribuite Open-Meteo (CC BY 4.0).

## Validare

`npm test` rulează regresiile backend, interfață simulată și meteo. `npm run check` verifică sintaxa Workers. Scriptul client este extras din HTML-ul generat și compilat în test.

Testele includ schimbarea orașului fără contaminare din răspunsurile asistentului, păstrarea/schimbarea zilei, alegerea Parisului, GPS, eșecuri ale furnizorului și verificarea că fluxul meteo nu apelează modelul lingvistic. Regresiile existente pentru hoteluri, trasee, GPS și cititorul cu autoderulare sunt păstrate.

Un apel real Open-Meteo a răspuns HTTP 200 pentru coordonate din Grays, cu datele 2026-10-31 și 2026-11-01 și unitatea °C. Testele automate folosesc servicii simulate și nu confirmă singure aspectul pe telefon sau publicarea Cloudflare.

## Test pe telefon după publicare

Începe o conversație nouă: „Câte grade vor fi mâine în Oradea?” → „Dar în Grays?” → „Dar în Barcelona?” → „Dar poimâine?”. Localitatea trebuie înlocuită, ziua păstrată până la ultima întrebare, iar sursa și data trebuie afișate. Numerele provin din prognoză și pot coincide între orașe; nu trebuie forțate să fie diferite.
