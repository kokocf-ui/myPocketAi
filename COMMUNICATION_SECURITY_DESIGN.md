# Comunicare — design de produs și securitate (11 noiembrie 2026)

## Scop
Conectare între utilizatorii myPocket AI fără dependența de WhatsApp/SMS pentru:
- liste de cumpărături sincronizate (familie, grup);
- chat privat și grupuri cu text, fotografii, capturi, documente, clipuri;
- rapoarte de erori cu captură și versiunea aplicației, trimise proprietarului
  proiectului sau unui contact autorizat din aplicație.

Atenție: acesta este un design, NU un chat gata de utilizat și NU o promisiune
de criptare end-to-end înainte de auditare.

## Condiții preliminare obligatorii
1. Profilul local actual cu e-mail NU reprezintă autentificare: trebuie
   adăugată verificarea e-mailului prin cod scurt/OTP sau magic link și
   sesiune securizată cu identificator intern UUID, nu email drept identificator public.
2. Contacte exclusiv prin invitație acceptată: cod/QR sau adresă cu cerere
   de acceptare. Fără importarea automată a agendei telefonului.
3. Controale: blochează, raportează, elimină membru, revocă acces la listă,
   dezactivează notificări, șterge contul și exportă informațiile proprii.
4. Ecranul de comunicare să nu trimită automat date despre sănătate, documente
   personale, localizare GPS, istoricul discuțiilor cu Eva, vârsta ori e-mailul.
5. Modelul Eva NU primește acces la mesaje private; doar utilizatorul poate
   selecta un mesaj pentru analiză, cu consimțământ explicit.

## Etapa A — liste partajate
- Buton din Listă cumpărături: Partajează → Contacte → trimite invitație;
  contactul primește o notificare discretă („Listă nouă partajată”).
- Membri: owner, editor, viewer; verificare autorizare pe backend la FIECARE
  scriere și citire, inclusiv pentru imagini/istoric.
- Model de operații idempotente: add, change_quantity, check, uncheck, remove.
  Identificatori permanenți pentru produse; idempotency_key pentru retry.
- Concurență: revision/version + rezolvare a conflictelor pe operații, fără
  suprascrierea oarbă a listei întregi. Arhivare și controlul revocării.
- Sincronizare activă prin WebSocket/Durable Objects (sau polling adaptiv
  temporar), cu sincronizare la reconectare. Offline queue în aplicație.
- Notificări push Android FCM (numai după consimțământ) fără conținutul listei
  în payload, cu retry și deduplicare după event_id.

## Etapa B — raportare erori
- Setări → Ajutor → Raportează problemă sau chat → atașează raport.
- Utilizatorul poate atașa capturi/poze/video și adaugă explicația textului.
- Diagnostice opționale: versiunea aplicației, telefon/Android (fără ID hardware),
  modul curent, codul erorii și pasul de reproducere, toate afișate înainte de
  trimitere. Nu colecta automat conversația, datele din Cont, documente,
  tokenuri, GPS, istoricul complet.
- Confirmare de trimitere + număr de raport + stare deschis/rezolvat.
- Atașamente cu tip MIME real verificat și limite; upload cu URL temporar;
  scanare de fișier acolo unde este posibil; eliminare metadate EXIF/GPS
  la opțiunea utilizatorului.
- Doar reporterul și personalul autorizat pot accesa raportul; fără URL-uri publice.

## Etapa C — chat individual și de grup
- Alege persoană/grup → mesaj → media → notificare → răspuns în aplicație.
- Păstrează separat mesajele sociale de conversațiile cu Eva.
- Mesajele private să folosească criptare end-to-end CU O BIBLIOTECĂ
  AUDITATĂ de protocoale tip Signal (nu implementare criptografică inventată).
- Cheile se generează pe dispozitiv; serverul vede doar envelope criptate,
  destinatari, ID, moment, status minimal. Atașamentele se criptează pe
  dispozitiv cu chei distincte, transmise criptat.
- Verificarea identității contactelor, schimbările de dispozitiv/cheie,
  recuperarea contului, multi-device, backup și rotația de chei sunt părți
  ale proiectului, nu detalii opționale.
- Blocare, limitarea invitațiilor, anti-spam, rate limits și mecanism de raportare
  a abuzului prin partajarea voluntară a mesajelor relevante.
- Ștergere, retenție limitată, politica de confidențialitate și evaluare GDPR
  UK/UE înaintea unui pilot de grup.

## Arhitectură adoptată — doar serverul Oracle
- Oracle Cloud VM `pocketai-core`: singurul server care procesează și stochează
  conturile de Comunicare, invitațiile, contactele, mesajele și listele.
- PostgreSQL privat în Docker: conturi, OTP, sesiuni (hash de token),
  contacte, drepturi, mesaje criptate și operații de sincronizare.
- Node.js API `oracle-communication/server.mjs` în rețeaua internă Docker;
  Caddy termină HTTPS pe domeniul configurat și permite numai originea
  frontendului myPocket AI. Portul PostgreSQL nu este public.
- SMTP configurat pe Oracle pentru e-mailurile cu cod de verificare; OTP
  expiră după 10 minute. Orice cont necesită verificare.
- Mesajele text beta se criptează local folosind ECDH P-256 și AES-GCM,
  cu chei private neexportabile în IndexedDB. Acesta este un pilot
  **neauditat**, NU un protocol Signal verificat, nu are recuperarea cheii
  sau un mecanism complet de apărare la înlocuirea cheilor de către server.
- Cloudflare este păstrat numai pentru aplicația frontală existentă și
  pentru funcțiile Evei. Serviciul său AI nu primește mesaje/conturi;
  vechea rută Durable Object de Comunicare a fost eliminată.
- Notificările Android, atașamentele și criptarea E2EE auditată rămân
  lucrări necesare înainte de lansarea publică.
- Codurile de invitație se transmit între utilizatori explicit; nu sunt
  plasate automat în URL-ul frontendului Cloudflare.
- Instalarea live necesită configurația HTTPS, SMTP și verificarea
  conectării reale la Oracle. Codul din GitHub nu este dovadă de deploy.


## Ordine de lansare
1. Model autentificare verificabilă și contacte prin invitații.
2. Liste partajate + push, testată întâi între două telefoane.
3. Rapoarte cu capturi și atașamente într-un inbox privat de test.
4. Chat text E2EE, apoi imagini și atașamente, apoi video și grupuri.
5. Audit independent securitate, abuz, permisiuni, GDPR, backup și
   sincronizare multi-device înainte de publicare pentru public larg.

## Criterii acceptare beta
- Niciun utilizator fără invitație nu vede lista sau mesajele altuia.
- Deconectare/ștergere cont revocă toate sesiunile.
- Trimiterea în timp ce destinatarul e offline ajunge după reconectare,
  fără duplicate.
- Două telefoane bifând același produs nu dublează cantitatea.
- Media rămâne privată, iar un link expirat nu poate fi refolosit.
- Mesajele și fișierele nu pot fi citite de proprietarul backendului când
  se declară E2EE (verificat prin audit tehnic, nu doar etichetă).
