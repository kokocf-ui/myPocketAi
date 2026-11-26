# Decuplare suplimentară, fără rescrierea materialelor — 26 noiembrie 2026

## Cererea și rezultatul

Utilizatorul a recomandat continuarea decuplării unde se poate face în siguranță, pentru mai mult spațiu liber. Am separat încă **631 de fișe originale** din HTML, fără a le înlocui cu rezumate sau a le modifica explicațiile, exemplele, exercițiile și răspunsurile.

| Material | Fișe | Sursă |
|---|---:|---|
| Matematică România V | 71 | română |
| Matematică România VI / VII / VIII | 36 / 32 / 43 | română |
| Fizică România VI–VIII, completări originale | 107 | română |
| Chimie România VIII, completări originale | 14 | română |
| Biologie România V–VIII, completări originale | 134 | română |
| Biologie liceală, banca pe poziția anului | 90 | română |
| Fizică gimnazială, banca originală engleză | 104 | engleză |
| **Total** | **631** | fiecare bancă are o singură limbă sursă |

Banca engleză este declarată în sursele anterioare ca material original independent, cu identificatori proprii și trasee de utilizare distincte. Nu am șters-o ca presupusă traducere a materialului românesc. Nu s-au adăugat variante pretraduse ale fișelor; traducerile UI și aliasurile de titluri existente au rămas. Nu s-au autorat lecții sau făcut o nouă certificare curriculară.

## Spațiul câștigat — măsurat separat

Comparație cu etapa precedentă, commit `540bd5b`:

| Măsurătoare | Înainte | După | Reducere |
|---|---:|---:|---:|
| HTML Node neîmpachetat, UTF-8 | 7.420.048 B | **6.969.173 B** | **450.875 B** |
| HTML generat de bundle-ul Wrangler, UTF-8 | 7.491.346 B | **7.041.362 B** | **449.984 B** |
| Worker dry-run, necomprimat | 7.789,38 KiB | **7.251,47 KiB** | **aprox. 537,91 KiB** |
| Worker dry-run, gzip | 2.164,21 KiB | **2.023,24 KiB** | **aprox. 140,97 KiB** |

Fișierul Worker efectiv generat are 7.425.509 B. HTML-ul de producție are acum **958.638 B marjă** până la plafonul de 8.000.000 B. Valorile KiB din Wrangler sunt rotunjite de unealtă.

Acesta este spațiu câștigat în documentul inițial și bundle, **nu o măsurătoare a spațiului liber pe telefon**. Nu există APK nou. Conținutul nu a fost distrus: cele patru asset-uri noi au în total 457.028 B și sunt descărcate separat când sunt necesare; descărcarea/cache-ul lor consumă spațiu local. Nu garanta reducerea stocării totale a telefonului sau a APK-ului fără măsurarea unui release viitor.

## Pachete și sursă editorială

`public/education/study-v1/`:

- `math.json` — 167.570 B: `ro5`, `ro678`, plus referințele curriculare/manuale originale;
- `physics.json` — 133.686 B: `roLower`, `englishLower`, materiale originale distincte;
- `chemistry.json` — 8.468 B: `roLower`;
- `biology.json` — 147.304 B: `roLower`, `upper`.

Schema `mypocket-education-study/v1` are identitate, versiune SHA-256 și bănci cu `sourceLanguage` + `content`, nu copii RO/EN ale aceleiași fișe. Sunt păstrate exact structurile consumate înainte de aplicație, inclusiv ordinea fișelor, identificatorii, formulele și metadatele. Au fost comparate exact toate exporturile de date din cele **25 de module afectate inițial**, înainte și după migrare. Cele 20 de module-fragment vechi sunt adaptoare cu selecție după ID către aceeași sursă JSON; nu mai conțin alte copii ale textelor. Cele două module de suplimente brute (Biologie liceală și extinderi Fizică engleză) au fost retrase după absorbirea integrală a rezultatelor lor în pachete.

`scripts/check_education_study_packs.mjs` doar verifică implicit/`--verify`; `--refresh-hashes` recalculează explicit hash-urile după editarea JSON-ului. Nu există regenerare automată a fișelor din vechile bănci JS.

### Conținutul nu mai este inclus tranzitiv în Worker

O simplă extragere din HTML lăsa inițial JSON-urile în bundle, prin închiderile funcțiilor serializate cu `.toString()`. A fost eliminată și această cuplare:

- `education_study_node_source.mjs` urmează modelul existent `curriculum_pack_protocol.mjs`: citire sincronă de fișiere **numai în Node**, prin `process.getBuiltinModule`, fără importuri statice JSON sau `node:*`;
- în Worker modulele respective primesc structuri goale; browserul este hidratat numai din asset-urile cerute la navigare;
- aceeași separare a fost aplicată și celor patru pachete `science/shared-v2` din etapa anterioară; au fost eliminate și copiile lor din bundle, fără schimbarea JSON-urilor sau rutelor lor;
- constanta HTML nefolosită `CHEMISTRY_UNIVERSITY_COURSE_COUNT` a fost scoasă, astfel încât un număr calculat la build să nu mai țină în bundle banca de cursuri; exportul Node rămâne disponibil și testat;
- `scripts/check_education_study_bundle.mjs` verifică lipsa celor opt importuri statice editoriale în ieșirea esbuild și un buget de dimensiune; testul VM verifică evaluarea fără Node; browserele reale verifică structuri inițial goale și hidratarea funcțională.

Acest rezultat privește **aceste opt pachete**, nu toate datele educaționale din Worker. Cititorul Node este pentru tool-uri/teste; nu pretinde că Workerul poate genera aceste materiale din fișiere locale la o eroare de rețea.

## Încărcare și protecții

- La intrarea în Matematică se descarcă banca V–VIII numai pentru țara `RO`; Norvegia și celelalte țări nu cer acest pachet. Pachetele anuale existente și suplimentele pe țară rămân separate.
- La alegerea Fizicii, Chimiei sau Biologiei se cere numai pachetul de studiu al materiei, în paralel cu pachetul comun de referințe. Astronomia nu descarcă o bancă de studiu fără legătură.
- Băncile sunt instalate în memoria browserului numai după validarea tuturor dependențelor cerute și confirmarea că utilizatorul este încă pe aceeași selecție. Un răspuns întârziat al Biologiei nu poate modifica banca/ecranul Fizicii.
- Validarea controlează identitatea, limbile sursă, băncile cunoscute, anii, temele, câmpurile didactice necesare, ID-urile unice și metadatele de proveniență pentru Matematică. Staging verifică hash-ul integral. Browserul verifică schema și formatul versiunii, nu autenticitatea criptografică a unui răspuns remote.
- Rețea întâi; cache `pocketai.education.study.v1.<materie>` la indisponibilitate. Datele invalide nu suprascriu copia validă. Epuizarea cotei localStorage nu ascunde conținutul online valid. Nu se șterg ciornele sau cache-urile traducerilor.
- Dacă pachetul lipsește și nu a fost salvat, navigarea arată mesaj și retry, **nu un an/lector gol prezentat drept material complet**. Noul frontend are nevoie de o primă descărcare a noilor asset-uri pentru a le putea reutiliza offline, chiar dacă referințele vechi sunt deja în cache. Cache-ul poate fi evacuat; pornirea complet offline și traducerea inițială offline nu sunt garantate.

## Publicare viitoare, neexecutată

Serviciul `education_pack_service.mjs` și staging-ul admit strict cele patru rute noi `/education/study-v1/{math,physics,chemistry,biology}.json`. Actualizarea conținutului și proxierea same-origin prin serviciu au fost testate cu răspunsuri locale, fără reconstruirea frontendului.

Aceste rute sunt **aditive**: nu se înlocuiesc rute/scheme deja folosite de frontendul `540bd5b`. Pentru o publicare ulterioară trebuie făcute disponibile asset-urile înaintea frontendului care le cere, apoi verificat upgrade-ul și rollback-ul. Nu șterge artifactele/rutele legacy cerute încă de clienții mai vechi din etapele anterioare. Riscul v1/v2 consemnat în `EDUCATION_SOURCE_PACKS_2026-11-26.md` nu este anulat prin această etapă.

Nu s-au executat deploy Cloudflare, build APK, PR sau merge. Noile workflow-uri rulează verificări, staging și dry-run, nu publicare.

## Verificări executate

**PASS:**

- paritate exactă a exporturilor celor 25 de module, față de snapshotul de dinaintea migrării;
- `npm run check`, `npm run test:education-study`, `npm run test:science-source`, `npm run test:education-input`;
- Matematică V, VI–VIII, România integrală și corelarea cu manualele; Fizică pedagogie/formule, reparațiile video și acoperirea europeană; profunzime Biologie și Chimie; progresie, universitar, legi și pachete Științe; arhitectura anuală și revizia ferestrelor de lucru;
- staging: **3.766 asset-uri validate, 92.253.198 B**; fără publicare;
- dry-run Wrangler frontend, garda numelor funcțiilor din bundle și noua gardă de dimensiune/importuri;
- `tests_education_study_browser.mjs` pe bundle-ul de producție, Chromium mobil 390×844: încărcare selectivă, cititoare Matematică V–VIII și Biologie, update editorial fără reload/frontend nou, răspuns întârziat la schimbarea materiei, cache offline, referințe cached dar studiu lipsă, eroare/retry;
- `tests_science_source_browser.mjs` pe același bundle: referințe/cursuri, delegare către motorul comun, eșecul traducerii și cache;
- browserele de producție pentru ferestrele și uneltele celor 8 materii, inclusiv ciorne, câmpuri, scris pen/touch emulat, erori și evaluare simulată;
- browserele mobile existente: Fizică VI–XII (lecții și activități), Chimie (49 trasee și lecții/practice RO), Astronomie (12 ani/practice, 8 grafice), Matematică Norvegia (fișă, offline/retry), cele patru pachete comune de Științe.

Cele **102 comenzi `test:ui`** au fost rulate individual după modificările finale: **100 PASS / 2 eșecuri istorice neschimbate** — `tests_education_ui_locales.mjs:88` (cheie de examene EN) și `tests_extra_tools_workspace.mjs:23` (25 vs 24 materii). Restanța separată de predicat HTML vechi din `tests_science_ro_course_quality.mjs` rămâne consemnată în raportul anterior; nu este declarată trecută sau reparată aici.

Testele cu AI folosesc răspunsuri simulate. Nu certifică inferență live, calitatea traducerii, stylus fizic sau APK instalat. Traducerea defectă raportată pe APK rămâne amânată conform utilizatorului.

## Ce rămâne intenționat

Auditul `node scripts/audit_education_coupling.mjs` mai găsește **59 de constante JSON ≥10 KB** în HTML; unele sunt metadate/UI, nu fișe. Rămân, între altele, `MATH_DEPTH_STAGES`, catalogul teoriei comune, planurile Istorie–Geografie, Informatică, cazurile Fizică liceală RO/EN și alte bănci universitare. Nu au fost șterse sau migrate grăbit, deoarece au consumatori comuni și necesită o etapă proprie cu verificarea originalității, evaluării și graficelor.

Scanarea celor 3.766 JSON-uri de conținut nu găsește obiecte cu ambele chei exacte `ro` și `en`; acesta rămâne doar un inventar structural, nu dovada eliminării tuturor duplicatelor semantice sau din JS. **Decuplarea generală nu este finalizată.**
