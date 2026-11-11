# myPocket AI — Comunicare pe Oracle (gateway existent)

**Stadiu: cod beta, încă NEINSTALAT pe VM.** Acest repository conține
actualizarea containerului `pocketai-comunicare-gateway` deja existent.
Docker continuă să publice numai `127.0.0.1:8765:3000`; NU deschide 8765
în firewall sau în Oracle Cloud Security List.

## Deciziile de produs

- Utilizatorul își alege prenumele; identitatea este o pereche de chei
  ECDSA P-256 semnare + ECDH P-256 pentru criptare, generate pe telefon.
- Fără e-mail sau număr de telefon obligatoriu. WhatsApp și SMS sunt folosite
  doar pentru distribuirea unei invitații prin HTTPS.
- Link: `https://mypocketai.duckdns.org/i/<cod-secret>` afișează **numele
  expeditorului obținut din server**, nu dintr-un parametru editabil în link.
- Doar destinatarul trebuie să accepte; apoi ambii văd contactul.
- Chat text, mesaje media criptate în browser, liste cu revizii și operații
  idempotente. Listele se sincronizează când aplicația este deschisă.
- Pozele, video-urile, audio și PDF-urile acceptate au limită **11 MiB per fișier**
  în clientul beta. Serverul păstrează octeții criptati până la 30 de zile.
- Criptarea este **experimentală, fără audit**, bazată pe ECDH/AES-GCM.
  Nu este protocol Signal și NU are verificare independentă a cheilor.
- Ștergerea datelor WebView sau schimbarea telefonului poate pierde identitatea
  și accesul la mesajele vechi; recuperarea cheilor NU este gata.
- Nu există notificări push Android în fundal, grupuri sau upload segmentat.
  Nu prezenta versiunea actuală drept sistem de mesagerie complet lansat.

## Configurația VM EXISTENTĂ

Oracle Ubuntu 24.04 ARM64. Proiectul Git existent se află în:
`~/pocketai-oracle-src`, branch `infra/oracle-comunicare-gateway`.
Caddy are deja certificat HTTPS valid pentru `mypocketai.duckdns.org`.
Porturile 80/443 sunt permise, iar `netfilter-persistent` este configurat.

**Nu porni alt gateway și nu modifica portul SSH 22.**
Compose pornește același container de gateway și un container PostgreSQL
privat, fără port de DB public. Baza de date are volum Docker persistent.

### Upgrade controlat (după verificarea testelor)

Se execută pe Oracle prin SSH din Termux:

```sh
set -eu
cd ~/pocketai-oracle-src/oracle-comunicare
mkdir -p ~/pocketai-comunicare/config
cp compose.yaml ~/pocketai-comunicare/config/compose.before-oracle-v1.yaml
sudo docker image tag pocketai-comunicare-gateway:local pocketai-comunicare-gateway:before-v1
git -C ~/pocketai-oracle-src pull --ff-only
cd ~/pocketai-oracle-src/oracle-comunicare
umask 077
if [ ! -f .env ]; then
  printf 'PGDATABASE=pocket_comm\nPGUSER=pocket_comm\nPGPASSWORD=%s\n' "$(openssl rand -hex 32)" > .env
  chmod 600 .env
fi
sudo docker compose config --quiet
sudo docker compose up -d --build
sudo docker compose ps
curl --fail --silent http://127.0.0.1:8765/readyz
```

Nu imprima conținutul .env, cheile SSH ori parolele în capturile trimise.

**Schema.sql este aplicată automat doar pe un volum PostgreSQL NOU.**
Actualizările viitoare cer migrări SQL dedicate, nu ștergerea volumului.

### Caddy — expunem doar după ce /readyz răspunde

Configurație propusă (mai întâi backup, validate, apoi reload):

```caddyfile
mypocketai.duckdns.org {
    handle /api/communication {
        reverse_proxy 127.0.0.1:8765
    }
    handle /i/* {
        reverse_proxy 127.0.0.1:8765
    }
    handle {
        respond "myPocket AI — conexiune HTTPS activă" 200
    }
}
```

Rutele sunt semnate de dispozitiv, cu excepția înregistrării inițiale
(cu dovada deținerii cheii private) și a paginii unei invitații cu cod
secret suficient de lung. Gateway-ul 8765 rămâne numai local.

### Comenzi de test

```sh
curl -fsS http://127.0.0.1:8765/readyz
curl -fsS https://mypocketai.duckdns.org/
node --test oracle-comunicare/server.test.mjs
```

Testul de integrare cu PostgreSQL, două chei ECDSA/ECDH și două identități
se execută prin workflow-ul `test-oracle-comunicare.yml` pe ramura GitHub.

### Restabilire în caz de eroare

Nu șterge datele PostgreSQL. Dacă este necesar, oprește doar noul proiect
Compose și folosește backup-ul imaginii și fișierului `compose.yaml`, după
inspectarea volumelor și a rutelor. Caddy rămâne independent; păstrează
`/etc/caddy/Caddyfile.backup`. Restaurarea se face numai după verificarea
configurației active, pentru a evita întreruperea portului 8765.
