# Prioritatea curentă: decuplarea completă Educație, apoi Literatura

Utilizatorul a cerut ca toate pachetele din Educație să fie independente de aplicație. Întâi inventariem și decuplăm conținutul existent, fără a-l pierde sau a pretinde că este complet; apoi continuăm implementarea Literaturii pentru toate țările. O modificare la conținut trebuie să poată fi publicată fără reconstruirea APK-ului. Compactarea HTML-ului nu este decuplare.

## Punctul de pornire

- Ultimul increment de Literatură, `11e694c`, a fost integrat prin PR #551. APK-ul v1.0.1843 a fost o versiune intermediară, nu Literatura completă.
- În manifestul inițial `ayo7z6` există 3.496 de pachete pentru Matematică, Fizică, Chimie, Biologie și Astronomie. Unele date ale acestor materii sunt totuși incluse direct în pagina generată. Celelalte materii trebuie inventariate; Literatura nu era în manifest.
- `index.js` includea catalogul Literatura, iar `literature_task_ui.mjs` include materiale și funcții suplimentare. Apelul la `eduRunWithCurriculumPack` nu descărca Literatura, deoarece cheia lipsea din manifest. `literature_compact_catalog.mjs` reduce repetarea, dar nu scoate datele din aplicație.
- Ultima măsurare a paginii: 7.966.499 caractere și 8.259.683 octeți UTF-8. Testele proiectului verifică separat sub 8.000.000 caractere și sub 8 MiB; acestea nu sunt limitele de spațiu ale telefonului. Cache-ul pachetelor nu demonstrează pornirea integrală offline: WebView-ul Android încarcă pagina de pe Cloudflare cu `LOAD_NO_CACHE`.
- `literature_audit_2026.md` arată starea pedagogică: 12 capitole selectate pentru Ungaria clasele I–IV, nu patru ani compleți. `node scripts/audit_literature_readiness.mjs --require-complete` eșuează intenționat până la autorare și revizuire independentă.

## Progres local: primul pas, nu decuplarea completă

- Catalogul de bază al Literaturii a fost împărțit în 51 de fișiere JSON (50 de jurisdicții plus opțiunea generală `OTHER-EU`), în `public/education/literature/profiles/`. Țările fără profil național în catalogul vechi păstrează explicit `null`, nu o programă inventată. `scripts/build_literature_profiles.mjs` reproduce datele vechi ale browserului și verifică versiunea conținutului; acestea sunt **profiluri pe țară, nu pachete de lecții pe an**.
- La intrarea în Literatură se descarcă profilul selectat; o copie validată este reutilizată dacă rețeaua lipsește. Dacă nu există o copie, se afișează mesaj și opțiune de reîncercare. Cache-ul nu este garantat permanent, iar pornirea aplicației complet offline nu a fost demonstrată.
- Testele compară exact profilurile și trasee reprezentative cu catalogul anterior, verifică actualizarea și comportamentul fără rețea. Testul Chromium mobil a parcurs RO, FR, HU, universitatea, cache offline, profil lipsă și reîncercare. `npm run test:ui`, `npm run check`, `npm run test:android`, testele `tests_literature_*.mjs`, verificarea manifestelor și testul local al asset-urilor prin Wrangler au trecut.
- HTML: 7.255.732 caractere / 7.510.241 octeți UTF-8 față de 7.966.499 / 8.259.683 inițial (măsurători locale). **Bundle-ul Workerului rămâne aproximativ 7.669 KiB necomprimat**; datele rămân în dependențe server-side, deci nu se poate afirma că au fost scoase complet din Worker. Materialele lecțiilor Literatura și alte materii rămân încorporate. Publicarea statică separată de Worker/versiunea aplicației trebuie încă implementată și verificată. Nu a fost lansată o nouă versiune sau un APK pentru acest pas local.

## Ordinea lucrului și verificări

1. Inventariază pe toate materiile datele incluse în HTML, Worker și APK, și ce este efectiv încărcat din pachete. Măsoară separat fiecare categorie.
2. Decuplează Literatura, păstrând traseele țară → nivel → an → capitol → activități și materialele deja existente; apoi elimină conținutul curricular încorporat din celelalte materii.
3. Asigură versionare și publicare independentă, integrarea reală a cititorilor, compatibilitate, lipsa sau invaliditatea pachetului, actualizări și mesaje clare offline. Nu confunda un fallback general cu o lecție completă și nu garanta păstrarea permanentă în cache.
4. Testează paritatea conținutului și navigarea, browserul mobil, Android, prima încărcare, cache-ul offline, publicarea reală și regresiile. Măsoară din nou HTML-ul și bundle-ul. Abia după decuplare, continuă implementarea și revizuirea curriculară a Literaturii.

## Fișiere de pornire

`curriculum_pack_catalog.mjs`, `curriculum_pack_manifest.mjs`, `curriculum_pack_protocol.mjs`, `scripts/build_curriculum_packs.mjs`, `public/packs/`, `education_country_ui.mjs`, `index.js`, `literature_task_ui.mjs`, `literature_audit_2026.md`, `wrangler-frontend.toml`, `.github/workflows/deploy-cloudflare.yml`, testele `tests_curriculum_pack_*` și `tests_literature_*.mjs`.

O copie recuperabilă a stării locale mai vechi, salvată cu acordul utilizatorului înainte de sincronizarea cu ramura GitHub, se află în `recovery/local-before-sync.tar.gz` și în stash-ul Git local. Nu o include în commituri sau în publicare.
