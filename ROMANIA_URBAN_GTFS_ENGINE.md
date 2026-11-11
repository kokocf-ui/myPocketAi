# România: motor GTFS urban (prototip de calcul, nepublicat)

## Ce există în PR
- `ro_urban_gtfs_import.mjs`: importă **fără rețea** directoare GTFS desfăcute,
  validează CSV-uri şi scrie un JSON privat (mod 0600), fără suprascriere implicită.
- `ro_urban_gtfs.mjs`: alege plecări în fusul Europe/Bucharest pentru o dată,
  respectă calendar/calendar_dates, identifică stațiile apropiate şi permite
  traseu direct sau o singură schimbare la **aceeași stație**, cu timp minim de transfer.
- Câmpurile de orar, stație, linie şi operator sunt obținute din GTFS; nu inventează
  tarife, locuri, poziții live sau trasee pietonale. Distanțele de acces sunt
  **în linie dreaptă**, marcate ca nevalidate pietonal. Traseul final trebuie
  legat de motorul pietonal existent înainte de afișarea unei plecări garantate.

## Surse candidate de date
- București–Ilfov, TPBI: https://gtfs.tpbi.ro/regional/
- Oradea, OTL: https://external.gtfs.ro/oradea/ORADEA.zip
- Cluj-Napoca, CTP: https://external.gtfs.ro/cluj/CLUJ.zip
- Iași, CTP/Tranzy: https://tranzy.ai/opendata

**Licența, actualizarea, acoperirea, condițiile de atribuire și
permisiunea de reutilizare comercială se verifică separat pentru FIECARE
sursă înainte de descărcarea periodică sau publicarea în Eva.**
Nu importăm/copiem datele Bilo: termenii Bilo permit numai
procesare temporară pentru afișarea căutării curente, fără cache persistent.

## Comandă de import (pe un server pe care s-a obținut legal feed-ul)
```bash
node ro_urban_gtfs_import.mjs /data/gtfs-dezarhivat /data/privat/oradea.json
```
Datele reale nu sunt incluse în GitHub. Nu există în prezent niciun endpoint
Android/Cloudflare conectat la acest motor.

## Pași rămași obligatorii înainte de a afirma „transport România complet”
1. Verificare licențe şi încărcare/actualizare verificabilă a feedurilor urbane.
2. Serviciu privat de planificare în Oracle, autentificat între Cloudflare şi server;
   fără deschidere publică a bazei GTFS sau a porturilor Docker.
3. Integrare comună în Asistent AI, Hărți şi Transport mixt cu start/destinație
   alese manual şi ultimul segment pietonal calculat pe drumuri, nu în linie dreaptă.
4. Testare cu date reale la Oradea, București, Cluj, Iași, inclusiv linii
   direct + schimbare, weekend, noapte şi orare cu schimbare de fus/oră.
5. Bilo: configurare secret autorizat, test live cu tren/autocar, cote, licență,
   documentarea tarifelor și lipsa garantării locurilor.
6. Acoperire națională nu este garantată în lipsa feedurilor pentru sate,
   microbuze şi transportatori fără date publice. Mesaj explicit în aplicație.

Acesta este un motor de bază pentru orare statice, **nu un transport public
funcțional pentru toată România**.
