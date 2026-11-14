# Instructaj Eva — instalarea site-ului și a backendului în contul clientului

**Stare (14 noiembrie 2026):** codul Site Studio include frontend, backend, rezervări cu capacitate și confirmare opțional automată, catalog și stocuri, procesare prin Stripe Checkout, notificări opționale prin Cloudflare Email Service, media și backup R2. Fluxurile au teste automate, dar nu au fost verificate cap-coadă pe un cont Cloudflare și Stripe real. Instalarea este ghidată pe calculator, nu este publicare automată din APK. Pentru fiecare client sunt necesare conturile și autorizările proprii.

## Alege întâi ce instalezi

- **Site simplu de prezentare:** exportul HTML din Eva poate fi publicat la Cloudflare Pages, Netlify sau într-un hosting clasic. Nu are nevoie de backend dacă nu folosește formulare, rezervări, conturi sau administrare live.
- **Site interactiv:** publică *împreună* frontendul și backendul Site Studio. Pachetul cuprinde autentificare, panou privat, mesaje, solicitări de rezervări/programări, galerie și publicare. Nu instala numai fișierul HTML — formularele nu pot funcționa fără backend.
- **Cine plătește:** clientul își creează și păstrează propriul cont, domeniul și eventualul abonament. Creatorul poate ajuta la instalare numai cu permisiune explicită și contract separat. Nu solicita parola clientului.

## Pregătire

1. Clientul creează un cont la [Cloudflare](https://dash.cloudflare.com/) pe e-mailul său. Verifică planurile și prețurile actuale înainte să activeze resurse; gratuitatea și limitele pot fi modificate.
2. Dacă dorește domeniu personalizat, îl deține sau îl cumpără pe numele său și îl adaugă la Cloudflare. Pentru început poate folosi adresa temporară `*.workers.dev`.
3. Instalatorul pregătește calculatorul cu **Node.js LTS** și acces la terminal. Nu sunt necesare chei OpenAI, EXA sau alte generări AI.
4. Descarcă **pachetul separat Eva Client Backend** care conține modulele `studio_*.mjs`, inclusiv `studio_commerce.mjs` și `studio_notifications.mjs`, câteva module locale pentru afișare, instalatorul și configurația Wrangler. Nu este necesar să predai întregul cod myPocketAI clientului.
5. Deschide terminalul în folderul extras. **Nu modifica manual configurația pentru instalarea ghidată**: programul `instalare-eva.mjs` îți cere numele unic al site-ului și creează automat un fișier local separat. Nu introduce parole sau secrete în fișiere.

## Instalarea ghidată — o singură dată pentru fiecare client

**Varianta recomandată:** pentru fiecare client extrage pachetul într-un **folder separat**. Nu reutiliza un folder cu `wrangler.eva-installed.jsonc`: conține configurația unui alt site. Din folderul `eva-client-backend`, deschide un terminal și execută:

```bash
node instalare-eva.mjs
```

1. Introdu un nume unic al Workerului clientului, de exemplu `eva-pensiunea-aramis`. Instalatorul generează automat `wrangler.eva-installed.jsonc`, separat de configurația originală; păstrează-l pentru actualizări.
2. Instalatorul pornește autentificarea oficială Cloudflare (Wrangler OAuth) și afișează contul. **Verifică împreună cu clientul că este contul lui** și confirmă cu `DA`. Nu transmite prin Eva parola sau un API token.
3. Instalatorul publică backendul cu cele două Durable Objects SQLite și creează în Cloudflare secretul de configurare inițială. Secretul este afișat numai în terminalul local.
4. Deschide adresa `https://<worker>.<subdomeniu>.workers.dev`, selectează **„Prima configurare”**. Proprietarul introduce e-mailul său, parola proprie și cheia temporară afișată.
5. După ce proprietarul se poate autentifica, **revocă cheia temporară** din același folder:

```bash
node instalare-eva.mjs --finish
```

Instalatorul rulează `wrangler secret delete` după confirmarea ta. Secretul nu este stocat în proiect, nici în Eva. Clientul păstrează contul Cloudflare și propria parolă.

Pentru a verifica independent adresa publică, din folderul pachetului poți executa:

```bash
node instalare-eva.mjs --check https://EXEMPLU.workers.dev
```

În aplicația Eva, la finalizarea proiectului, secțiunea **„Instalează backendul clientului”** prezintă acești pași și permite verificarea aceleiași adrese prin `/health`. Verificarea arată doar că backendul rulează, nu că toate funcțiile comerciale au fost testate.

**Alternativă manuală pentru un instalator tehnic:** `npx wrangler@latest login`, `npx wrangler@latest deploy --config wrangler.eva-client.jsonc`, apoi `npx wrangler@latest secret put STUDIO_BOOTSTRAP_SECRET --config wrangler.eva-client.jsonc`. Este obligatoriu să alegi un nume unic în fișierul de configurare și să revoci secretul după configurarea administratorului.

## Predarea proiectului făcut de Eva

1. În Eva selectează **Creează pagini web**. Completează domeniul afacerii, prezentarea, fotografiile și alege opțional „Mesagerie”, „Rezervări / programări” și „Catalog / comenzi”. La catalog, clientul însuși stabilește prețurile și stocurile. La rezervări, configurarea capacității trebuie confirmată de proprietar.
2. Deschide previzualizarea, apoi apasă **„Pregătește predarea site-ului”**. Salvează fișierul `.pocket-site.json`.
3. Pe adresa Workerului clientului, intră în panoul Studio și apasă **„Importă proiect Pocket AI”**.
4. Selectează fișierul de proiect. Verifică fotografiile, tipurile de camere, capacitatea, perioadele blocate, catalogul de produse, prețurile și stocurile, datele de contact, opțiunile de backend și condițiile de administrare.
5. Dacă se vor colecta date personale prin formulare, completează în Studio **URL-ul HTTPS al politicii de confidențialitate a clientului**. Fără acesta publicarea cu formulare trebuie să fie blocată. Clientul este responsabil să publice o informare adecvată, inclusiv privind durata păstrării și drepturile persoanelor.
6. Apasă **„Creează proiectul”**, apoi **„Salvează”** dacă faci corecții. Verifică previzualizarea.
7. Apasă **„Publică versiunea salvată”** doar după confirmarea proprietarului. Site-ul public devine disponibil la `https://<worker>/s/<id-site>`.
8. Dacă dorește domeniu personalizat, în dashboard Cloudflare intră în **Workers & Pages → Worker → Settings → Domains & Routes → Add → Custom Domain**. Configurează DNS potrivit și verifică HTTPS. Domeniul trebuie să aparțină clientului.

## Cum verifici că instalarea este reușită

- `https://<worker>/health` trebuie să răspundă cu `ok:true` și `studio_independent`. `aiEnabled:false` este normal: generările AI nu sunt necesare pentru funcționarea backendului.
- Site-ul public se deschide fără butoane de editare. Pe telefon, fotografiile și galeria se văd corect.
- Trimite un **mesaj de test** prin formularul public. În panoul privat, deschide **„Mesaje și solicitări de rezervare”** și apasă „Actualizează solicitările”.
- Trimite o **solicitare de rezervare de test**. Dacă este activată confirmarea automată și capacitatea permite, poate apărea **confirmată**; altfel trebuie să fie **nouă**. Pentru o pensiune cu o singură cameră, două cereri pentru aceeași perioadă nu trebuie să se confirme amândouă.
- Apasă **„Marchează contactat”** numai după ce ai contactat persoana. Confirmările manuale verifică disponibilitatea. Nu șterge o comandă plătită fără să verifici obligațiile legale și eventualele rambursări.
- Testează că un vizitator nu poate deschide inboxul administratorului.
- Proprietarul trebuie să știe cum să refacă site-ul, cum să contacteze furnizorul și cum sunt păstrate copiile de siguranță.

## Activarea serviciilor comerciale opționale

### 1. Calendar și confirmări automate

În Studio deschide secțiunea **„Funcții pentru vizitatori (backend)”**. Activează rezervările, introdu capacitatea pentru mese/programări sau numărul real de camere pe categorie. Selectează durata intervalului, adaugă perioadele indisponibile (închideri, renovări, ocupări externe) și abia apoi activează „Confirmă automat numai dacă există capacitate disponibilă”.

Site-ul oferă o pagină publică de **verificare a disponibilității**. Rezultatul este orientativ până când solicitarea este înregistrată; confirmarea efectivă se face de backend în operație atomică. Pentru cazare, confirmările reduc numărul de camere disponibile în perioada selectată. Pentru restaurante, capacitatea reprezintă persoane/locuri, nu o hartă cu mesele individuale. Pentru saloane, intervalele reprezintă capacitatea simultană configurată, nu programul fiecărui angajat.

**Important:** rezervările din Booking.com, Airbnb, Google Calendar și alte sisteme externe nu sunt sincronizate încă. Proprietarul trebuie să introducă manual perioadele ocupate extern, altfel pot apărea suprapuneri.

### 2. Fotografii și backup privat în R2

La instalarea cu `node instalare-eva.mjs`, când se solicită **R2 pentru fotografii și backup**, răspunde `DA` doar cu aprobarea clientului și după verificarea prețurilor Cloudflare. Instalatorul creează două spații private, distincte: `<site>-media` și `<site>-backups`, pe contul lui.

În panoul proprietarului, fotografiile noi se încarcă în R2. Poți migra fotografiile demonstrative prin butonul **„Mută fotografiile demo în R2”**, apoi **Salvează** și **Publică** noua versiune. Editorul afișează câte 12 fotografii pe pagină și acceptă până la 1.000 de referințe în această versiune; capacitatea reală depinde de planul clientului.

Backupurile private conțin proiectul și inboxul. Se pot crea manual; când R2 și alarmele Durable Objects sunt configurate, se programează copii zilnice și se păstrează ultimele 30. Restaurarea se face numai de către proprietar după verificarea versiunii și confirmarea exactă cerută de panou. **Nu înlocuiește o politică completă de retenție, test de restaurare, arhivare contabilă și ștergere conform obligațiilor legale**. Păstrează și exportul editabil `.pocket-site.json` într-un loc sigur. Exportul HTML care folosește imagini R2 rămâne dependent de Workerul clientului; pentru mutarea la altă găzduire, copiază și fotografiile.

### 3. Activarea Stripe Checkout

**Numai în contul Stripe al clientului**, nu în contul creatorului.

1. Clientul creează/verifică un cont Stripe. Citește tarifele, țările și metodele de plată disponibile pentru firma sa. Nu activa plăți reale fără acordul său.
2. În Studio completează catalogul, moneda, prețul real și stocul fiecărui produs; activează **„Produse, comenzi și plăți opționale”** și adaugă un URL HTTPS pentru politica de confidențialitate.
3. Pe calculator, în folderul pachetului backend, configurează **mai întâi cheia de test** Stripe în Worker, fără să o trimiți prin chat:
   ```bash
   npx wrangler@latest secret put STRIPE_SECRET_KEY --config wrangler.eva-installed.jsonc
   ```
4. În Stripe Developers → Webhooks creează un endpoint public pentru `https://ADRESA-WORKER/webhooks/stripe`, cu evenimentele `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.expired`.
5. Copiază secretul webhookului **în terminal**, nu în Eva:
   ```bash
   npx wrangler@latest secret put STRIPE_WEBHOOK_SECRET --config wrangler.eva-installed.jsonc
   ```
6. Testează o comandă cu cardul oficial de test Stripe. În panoul privat, plata trebuie să apară **încasată numai după confirmarea webhookului**, nu după redirecționarea clientului pe site. Încearcă un produs epuizat: nu trebuie permisă supravânzarea.
7. Numai după verificarea completă și autorizarea proprietarului treci la cheile live și webhookul live. Confirma plăți, anulări, eventuale rambursări și registrele contabile din Stripe Dashboard.

Site-ul NU stochează datele cardurilor. Plățile sunt procesate de Stripe Checkout, care poate avea comisioane distincte. Rambursările, disputele și gestionarea fiscală se fac în contul Stripe al clientului; interfața Eva nu implementează automat toate aceste operațiuni.

### 4. Notificări prin Cloudflare Email Service

1. Clientul trebuie să aibă un domeniu în Cloudflare DNS și să-l configureze în **Cloudflare Email Service → Email Sending** (onboarding, verificări DNS SPF/DKIM, limite și costuri). Nu este suficient să introducă doar un e-mail.
2. În instalator răspunde `DA` la e-mailurile automate **numai după** verificarea domeniului. Introdu o adresă de expediere din domeniul verificat, de exemplu `notificari@firma-client.ro`. Instalatorul configurează bindingul `EMAIL`.
3. În Studio activează opțiunea pentru notificări. Verifică e-mailul de contact al afacerii. Testează trimiterea unui mesaj și apoi confirmarea unei rezervări.
4. Verifică în jurnalele furnizorului dacă a fost acceptată trimiterea. Dacă bindingul nu este disponibil, site-ul păstrează mesajele în inbox; **nu promite livrarea e-mailului**.

Cloudflare Email Service este un serviciu separat, iar contul clientului trebuie să respecte limitele de trimitere și politica furnizorului. Nu păstrăm secrete de e-mail în cod sau în APK.

### 5. Checklist pentru predare comercială

- Contul Cloudflare, domeniul, R2 (dacă este folosit), Stripe și e-mailul sunt **în proprietatea și sub controlul clientului**.
- Site-ul funcționează pe HTTPS, pe mobil și desktop; sunt corecte numele, fotografiile, formularele și datele firmei.
- Disponibilitatea unei camere/mese/ore se actualizează corect după confirmare; ocupările din alte sisteme sunt introduse manual.
- O comandă nu poate depăși stocul; prețurile sunt cele salvate de comerciant; plățile se verifică prin webhook.
- Politica de confidențialitate și regulile pentru păstrarea/ștergerea datelor au fost pregătite cu proprietarul.
- Proprietarul știe unde vede inboxul, plățile, calendarul, produsele, backupurile și cum revocă accesul creatorului.
- Serviciile externe au fost testate în contul clientului; **testele automatizate din GitHub nu înlocuiesc acest pas**.

## Limite care nu trebuie ascunse clientului

1. Instalarea este ghidată pe calculator prin Cloudflare OAuth; APK-ul nu poate opera asupra contului clientului fără autorizarea lui.
2. Sincronizarea cu Booking.com/Airbnb/alte calendare, atribuirea pe mese individuale sau pe angajați, plățile pentru rezervările de cazare și facturarea automată completă NU sunt implementate.
3. E-mailul și încasarea necesită configurație reală în contul clientului. Fără secrete Stripe și webhook verificat, comenzile rămân solicitări fără plată.
4. Anti-spamul, backupurile, controalele de acces și limitele demonstrative sunt de bază; înainte de utilizare publică serioasă trebuie făcut audit de securitate și protecția datelor pe un cont real.
5. Opțiunile nu au fost încă verificate printr-un deployment și o plată live cu client real; acestea necesită acord și credențiale ale proprietarului, pe care Eva nu trebuie să le ceară în chat.

## Ce primește clientul

- adresa web și accesul propriu la Cloudflare;
- propriul cont de administrator Studio, fără dependență de parola creatorului;
- fișierul editabil `.pocket-site.json` și, dacă dorește, exportul HTML static;
- acest ghid și instrucțiuni personalizate pentru domeniu;
- explicația costurilor pe care le va suporta el, nu creatorul;
- acord de mentenanță numai dacă se dorește serviciul, cu preț, număr de modificări incluse, termene și condiții de încetare.

**Surse oficiale:** [Workers Deploy](https://developers.cloudflare.com/workers/wrangler/commands/workers/), [Durable Objects](https://developers.cloudflare.com/durable-objects/get-started/), [Custom Domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/), [Permissions](https://developers.cloudflare.com/workers/authorization/workers/).
