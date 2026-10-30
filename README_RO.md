# myPocket AI — Frontend v1.0.52

Arhiva conține înlocuirea completă a fișierului frontend Cloudflare Worker (`index.js`).

## Instalare de pe Android
1. Descarcă arhiva ZIP și extrage `index.js`.
2. În Cloudflare Workers, deschide worker-ul frontend `lifewise-ai-v2`.
3. Înlocuiește integral codul existent cu tot conținutul din `index.js`.
4. Salvează și publică versiunea.

## Modificări v1.0.52
- Titlul ecranului de căutare folosește aceeași traducere ca opțiunea rapidă selectată (de exemplu, „Petrol stations” în engleză, nu „Benzinării”).
- Ecranul cu rezultate folosește înălțimea vizibilă dinamică a telefonului; lista are zona proprie de derulare și spațiu suplimentar după ultimul rezultat, pentru a evita mascarea acestuia de bara browserului.
- Păstrate funcțiile GPS, căutarea backend, avatarul și navigarea de la versiunea v1.0.51.

## Limitări de verificare
Verificarea sintaxei JavaScript și a integrității ZIP se face înainte de livrare. Nu este disponibilă aici testarea vizuală pe telefonul utilizatorului sau publicarea în Cloudflare; acestea trebuie confirmate după instalare.
