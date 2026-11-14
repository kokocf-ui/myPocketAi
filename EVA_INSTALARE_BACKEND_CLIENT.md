# Instructaj Eva — instalarea site-ului și a backendului în contul clientului

**Stare:** procedură de instalare pentru prototipul Site Studio. Nu publică automat din APK. Rezervările sunt solicitări ce trebuie confirmate manual de proprietar; e-mailurile automate, plățile online și gestionarea disponibilității în timp real nu sunt implementate.

## Alege întâi ce instalezi

- **Site simplu de prezentare:** exportul HTML din Eva poate fi publicat la Cloudflare Pages, Netlify sau într-un hosting clasic. Nu are nevoie de backend dacă nu folosește formulare, rezervări, conturi sau administrare live.
- **Site interactiv:** publică *împreună* frontendul și backendul Site Studio. Pachetul cuprinde autentificare, panou privat, mesaje, solicitări de rezervări/programări, galerie și publicare. Nu instala numai fișierul HTML — formularele nu pot funcționa fără backend.
- **Cine plătește:** clientul își creează și păstrează propriul cont, domeniul și eventualul abonament. Creatorul poate ajuta la instalare numai cu permisiune explicită și contract separat. Nu solicita parola clientului.

## Pregătire

1. Clientul creează un cont la [Cloudflare](https://dash.cloudflare.com/) pe e-mailul său. Verifică planurile și prețurile actuale înainte să activeze resurse; gratuitatea și limitele pot fi modificate.
2. Dacă dorește domeniu personalizat, îl deține sau îl cumpără pe numele său și îl adaugă la Cloudflare. Pentru început poate folosi adresa temporară `*.workers.dev`.
3. Instalatorul pregătește calculatorul cu **Node.js LTS** și acces la terminal. Nu sunt necesare chei OpenAI, EXA sau alte generări AI.
4. Descarcă **pachetul separat Eva Client Backend** care conține numai fișierele `studio_*.mjs`, cele câteva module locale folosite de renderer și `wrangler.eva-client.jsonc`. Nu este necesar să predai întregul cod myPocketAI clientului.
5. Deschide terminalul în folderul extras. Modifică în `wrangler.eva-client.jsonc` câmpul `name` într-un nume unic, de exemplu `eva-pensiunea-exemplu`. Nu introduce parole sau secrete în fișier.

## Instalarea tehnică — o singură dată pentru fiecare client

Execută din folderul pachetului, în sesiunea autorizată a **contului clientului**:

```bash
npx wrangler@latest login
npx wrangler@latest deploy --config wrangler.eva-client.jsonc
```

Urmează linkul de autentificare Cloudflare deschis de Wrangler, selectează contul corect al clientului și confirmă deploy-ul. La final Wrangler afișează o adresă de forma `https://eva-pensiunea-exemplu.<subdomeniu>.workers.dev`.

Pentru cheia inițială de configurare, execută:

```bash
npx wrangler@latest secret put STUDIO_BOOTSTRAP_SECRET --config wrangler.eva-client.jsonc
```

Introdu în terminal o valoare aleatorie de minimum 20 de caractere (recomandat peste 32). **Nu o lipi în chat, e-mail sau în cod.** Este secretul privat de instalare; clientul îl folosește o singură dată pentru crearea primului cont.

Deschide în browser adresa Workerului, apoi apasă **„Prima configurare”**. Proprietarul introduce:
- adresa sa de e-mail;
- parola proprie (cel puțin 12 caractere, combinând litere și cifre/simboluri);
- cheia inițială introdusă în Cloudflare.

Apasă **„Configurează contul”**, apoi autentifică-te. Fiecare Worker poate crea primul administrator numai o dată. Secretul de configurare poate fi apoi șters din dashboard după ce proprietarul a verificat accesul.

## Predarea proiectului făcut de Eva

1. În Eva selectează **Creează pagini web**. Completează domeniul afacerii, prezentarea, fotografiile și opțional „Mesagerie” / „Solicitări de rezervări”.
2. Deschide previzualizarea, apoi apasă **„Pregătește predarea site-ului”**. Salvează fișierul `.pocket-site.json`.
3. Pe adresa Workerului clientului, intră în panoul Studio și apasă **„Importă proiect Pocket AI”**.
4. Selectează fișierul de proiect. Verifică fotografiile, tipurile de camere, datele de contact, opțiunile de backend și condițiile de administrare.
5. Dacă se vor colecta date personale prin formulare, completează în Studio **URL-ul HTTPS al politicii de confidențialitate a clientului**. Fără acesta publicarea cu formulare trebuie să fie blocată. Clientul este responsabil să publice o informare adecvată, inclusiv privind durata păstrării și drepturile persoanelor.
6. Apasă **„Creează proiectul”**, apoi **„Salvează”** dacă faci corecții. Verifică previzualizarea.
7. Apasă **„Publică versiunea salvată”** doar după confirmarea proprietarului. Site-ul public devine disponibil la `https://<worker>/s/<id-site>`.
8. Dacă dorește domeniu personalizat, în dashboard Cloudflare intră în **Workers & Pages → Worker → Settings → Domains & Routes → Add → Custom Domain**. Configurează DNS potrivit și verifică HTTPS. Domeniul trebuie să aparțină clientului.

## Cum verifici că instalarea este reușită

- `https://<worker>/health` trebuie să răspundă cu `ok:true` și `studio_independent`. `aiEnabled:false` este normal: generările AI nu sunt necesare pentru funcționarea backendului.
- Site-ul public se deschide fără butoane de editare. Pe telefon, fotografiile și galeria se văd corect.
- Trimite un **mesaj de test** prin formularul public. În panoul privat, deschide **„Mesaje și solicitări de rezervare”** și apasă „Actualizează solicitările”.
- Trimite o **solicitare de rezervare de test**, cu o categorie de cameră existentă sau data și ora cerute. Verifică în inbox că apare ca **nouă**, nu confirmată automat.
- Apasă **„Marchează contactat”** numai după ce ai contactat persoana. Pentru o ștergere solicitată de persoană, folosește **„Șterge datele”**.
- Testează că un vizitator nu poate deschide inboxul administratorului.
- Proprietarul trebuie să știe cum să refacă site-ul, cum să contacteze furnizorul și cum sunt păstrate copiile de siguranță.

## Limitări de știut înainte de un client real

1. Mesajele sunt păstrate în inboxul privat al Workerului, nu sunt livrate automat prin Gmail/Outlook. Butonul de răspuns deschide clientul local de e-mail. Livrarea SMTP/API necesită un furnizor separat.
2. „Solicitare primită” **nu este „rezervare confirmată”**. Nu există încă sincronizare cu sistemele externe de booking, plăți, stocuri, mese, personal, camere sau canale OTA.
3. Există limitare de bază anti-spam și un plafon provizoriu de mesaje; nu înlocuiesc un serviciu de securitate/monitorizare și o politică de retenție.
4. Fotografiile și mesajele stau în spațiul Cloudflare **al clientului**, nu la creator. Limitele și costurile resurselor sunt ale furnizorului. Pentru galerii mari trebuie introdusă stocare separată (de exemplu R2).
5. Nu este implementat un sistem complet de backup/export/restaurare automată pentru baza de date. Înainte de predare comercială definitivă se verifică restaurarea, retenția și portabilitatea datelor.
6. Nu conecta manual conturile personale ale clientului la proiect fără permisiunea acestuia.

## Ce primește clientul

- adresa web și accesul propriu la Cloudflare;
- propriul cont de administrator Studio, fără dependență de parola creatorului;
- fișierul editabil `.pocket-site.json` și, dacă dorește, exportul HTML static;
- acest ghid și instrucțiuni personalizate pentru domeniu;
- explicația costurilor pe care le va suporta el, nu creatorul;
- acord de mentenanță numai dacă se dorește serviciul, cu preț, număr de modificări incluse, termene și condiții de încetare.

**Surse oficiale:** [Workers Deploy](https://developers.cloudflare.com/workers/wrangler/commands/workers/), [Durable Objects](https://developers.cloudflare.com/durable-objects/get-started/), [Custom Domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/), [Permissions](https://developers.cloudflare.com/workers/authorization/workers/).
