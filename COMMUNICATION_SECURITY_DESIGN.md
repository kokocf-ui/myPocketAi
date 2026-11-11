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


## Adăugarea contactelor la distanță — UK, România, internațional

Metoda recomandată implicit: **invitație prin link privat**, indiferent de țara
celor două persoane. QR afișează același link, dar nu este obligatoriu.

1. În Comunicare → Adaugă contact: „Trimite invitație”, „Caută după telefon”,
   „Scanează QR / Introdu ID Eva”. Folosim funcția de partajare Android pentru
   expediere prin WhatsApp, SMS, e-mail etc.; nu expediem fără confirmare.
2. Invitația constă dintr-un token aleator criptografic de unică folosință,
   cu expirare (propunere inițială: 24 h), revocabil, stocat pe server doar
   sub formă de amprentă sigură. Nu încorporăm e-mailuri, numere sau date
   personale în link. Nu includem un URL final până când domeniul și
   asocierea Android App Links sunt configurate.
3. Destinatarul deschide linkul din orice țară; dacă Eva este instalată,
   intră în ecranul „Cerere de contact”, altfel pagina de instalare.
   După instalare trebuie să poată relua invitația în siguranță.
4. Destinatarul se autentifică printr-un cont verificat și **acceptă explicit**
   cererea, după care relația este creată pentru cei doi identificatori interni.
   Expirarea, folosirea anterioară, refuzul și anularea sunt verificate pe
   server. Nu acordăm acces automat la liste sau documente.
5. Căutarea după telefon este **opțională**: utilizatorul își adaugă
   numărul în format internațional E.164, îl verifică prin OTP/SMS și
   activează separat „Permite să fiu găsit după telefon” (implicit dezactivat).
   SMS poate avea costuri; fără furnizor OTP activ nu promitem că această
   metodă este funcțională.
6. Căutarea există numai pentru conturi autentificate, cu limitări severe,
   protecție anti-enumerare și fără listări în masă. Nu expunem automat
   existența unui cont pentru un număr de telefon. Nu folosim un simplu hash
   nesărat al numerelor ca protecție, deoarece spațiul numerelor este ușor
   de enumerat.
7. ID-ul Eva/QR este o alternativă pentru utilizatorii care nu doresc
   să furnizeze telefonul. Nu importăm automat agenda și nu trimitem datele
   din contacte către server fără acord separat.
8. Prietenia aprobată permite doar contactul în Comunicare: permisiunea
   de chat/mesaje vocale trebuie convenită reciproc; o listă sau un document
   se partajează **separat și explicit** către acel contact ori grup.
9. Un contact poate fi blocat sau eliminat; invitațiile și drepturile
   active trebuie revocate server-side. Aprobarea nu oferă acces la
   conversațiile private purtate cu Eva.
10. Test de acceptare: invitatul din România deschide linkul trimis din
    UK, inclusiv pe un telefon fără aplicația instalată, și poate accepta
    doar după autentificare verificată. Încercările de reutilizare a
    tokenului și căutarea numerelor ascunse nu trebuie să funcționeze.

**Status:** această secțiune este specificație de produs, nu funcționalitate
gata de utilizare. Este necesară implementarea autentificării verificate,
a serviciului de invitații, a linkurilor către aplicație și a interfeței.

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


## Mesaje vocale — doar contacte/grupuri cu acord explicit
- Chatul și mesajele vocale NU sunt accesibile automat tuturor utilizatorilor aplicației.
  O listă de cumpărături partajată NU acordă implicit acces la chat.
- Chat unu-la-unu: invitație → acceptare de ambele părți → chat activ.
  Oricare dintre participanți poate revoca accesul sau bloca persoana.
- Grup: participare doar după invitație acceptată, ieșire oricând, trimitere
  vocală doar când participantul și grupul au permisiunea activă.
- În conversație: microfon → ține apăsat pentru înregistrare → glisare pentru
  anulare → eliberează pentru trimitere; redare în chat, indicator durată și
  progres, fără pornirea automată a sunetului. Solicităm permisiunea de microfon
  numai când este necesară.
- Limite beta propuse pentru mesajele vocale: maximum 3 minute / 10 MiB;
  formate compatibile Android (OGG/WebM/MP4 unde sunt suportate).
  Serverul trebuie să valideze tipul real și limitele, nu doar metadatele trimise.
- Vocalele și atașamentele se criptează pe dispozitiv cu bibliotecă auditată
  înainte de transmisie; fișierele criptate sunt stocate privat cu retenție
  limitată și acces revocabil. Nu pretindem E2EE până la implementare și audit.
- Fără transcriere automată și fără trimitere a audio către Eva/AI.
  „Transcrie” sau „Întreab-o pe Eva” poate exista ulterior numai ca acțiune
  inițiată explicit de utilizator, cu informare despre procesare.
- Notificările push nu includ în payload fișierul audio, transcrierea ori textul
  mesajului. Pentru utilizatorii offline, mesajul se livrează după reconectare
  fără duplicate.
- Backendul trebuie să valideze identitatea sesiunii, participantul, invitația
  acceptată și permisiunile la **fiecare** upload/download/stream/metadata,
  nu doar la deschiderea ecranului. URL-uri semnate scurt, fără acces public.
- Teste obligatorii: persoane neinvitate, invitații în așteptare, contact blocat,
  permisiune revocată, membru scos din grup, replay/duplicate, acces la audio
  după revocare, captură din alt cont, fișier malițios, fișiere prea mari.

**Stadiu 11.11.2026:** reguli de autorizare și validare adăugate și testate în
`oracle-comunicare/voice_policy.mjs` (PR #337). Acestea sunt un strat
de politică pur, nu un endpoint de mesagerie, nu un recorder Android și nu E2EE.
Integrarea cu autentificarea verificată, stocarea privată, aplicația Android și
transportul criptat rămâne de implementat.

## Arhitectură propusă (aliniată infrastructurii actuale)
- Cloudflare Workers: API autentificare, ACL, validare și rate limiting.
- Cloudflare D1: conturi verificate, membership, liste, operații și metadate;
  nu stoca parole în clar, tokenuri ori conversații cu Eva.
- Cloudflare Durable Objects: conexiuni WebSocket, ordonarea operațiilor de
  listă și livrarea notificărilor active.
- Cloudflare R2 privat: media cu retenție/ștergere configurabilă și URL-uri
  semnate scurt; nu expune bucketuri publice.
- FCM: push Android cu payload minim. Nu păstra tokenurile FCM în frontend
  sau în mesajele trimise modelului.
- Pentru chat E2EE, Workers transportă numai ciphertext; D1/R2 au criptare la
  nivel de stocare, însă aceasta nu este, singură, E2EE.

## Ordine de lansare
1. Model autentificare verificabilă și contacte prin invitații.
2. Liste partajate + push, testată întâi între două telefoane.
3. Rapoarte cu capturi și atașamente într-un inbox privat de test.
4. Chat text E2EE, apoi mesaje vocale private E2EE, imagini și atașamente, apoi video și grupuri.
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
