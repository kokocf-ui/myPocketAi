# AGENTS.md — Evidența Proiectului & Continuitate între Sesiuni (`kokocf-ui/myPocketAi`)

> **CITEȘTE ACEST FIȘIER LA ÎNCEPUTUL ORICĂREI SESIUNI NOI.**
> Istoricul conversațiilor dintr-un chat anterior NU se transferă automat într-un chat nou, dar acest fișier + fișierele de audit din repository + `git log` pe `main` păstrează evidența exactă a ceea ce este gata și a ceea ce urmează. **Actualizează acest fișier la finalul fiecărei etape majore înainte de merge în `main`.**

---

## 1. Reguli permanente de lucru cu utilizatorul
1. **Utilizatorul lucrează exclusiv de pe telefonul mobil:**
   - Execută direct toate verificările (`npm run check`, testele `tests_*.mjs`, `node scripts/build_curriculum_packs.mjs --verify`), commit-urile, `git push` pe ramura activă a sesiunii, deschiderea și merge-ul Pull Request-ului în `main`, precum și verificarea rulărilor GitHub Actions.
   - Când se generează un **APK Signed Release** (`.github/workflows/build-android-signed-release.yml` pe `main`), oferă linkul direct `.apk` din **GitHub Releases** (`myPocketAI-signed-release.apk`) astfel încât utilizatorul să îl poată descărca cu o singură atingere pe telefon (fără dezarhivare `.zip`).
2. **Evidență permanentă pe GitHub (`kokocf-ui/myPocketAi`):**
   - Fă commit + `git push origin <ramura-activă>` după fiecare sub-etapă importantă ca nimic să nu se piardă dacă sesiunea se întrerupe.
3. **Constrângeri tehnice critice:**
   - **Plafon HTML offline `< 8.000.000 bytes` (`tests_education_hg_theory_coverage.mjs`):** tot conținutul curricular nou se stochează în **pachete statice decuplate** în `./public/packs/p-<sha256_24>.json` (servite prin `/api/curriculum-pack` din Cloudflare Workers Static Assets, cu `0 KB` adăugați în Worker JS / HTML).
   - **Onestitate curriculară și drepturi de autor (`EDUCATION_COMPLETION_POLICY.md`):**
     - `0` text/exerciții copiate din manuale comerciale protejate; în `textbooks[]` și `manualExample` se stochează exclusiv metadate bibliografice și ordine/registre oficiale.
     - Nu marca un an drept certificat integral (`fullyApproved`) fără verificare capitol-cu-capitol pe programa și manualele oficiale ale anului respectiv.
     - Cetatea Vaticanului (`VA`) păstrează `external-curriculum` pentru stagiile preuniversitare (fără inventarea unei programe școlare K–12 vaticane).

---

## 2. Ce este DEJA FINALIZAT și LIVE pe `main` (nu reface de la zero!)

### A. Matematică (`Educație`) — 50 / 50 jurisdicții europene în pachete decuplate (24 nov 2026, PR #542, Release `v1.0.1820`)
- **Acoperire:** **50 / 50 jurisdicții** din `EDUCATION_EUROPE_COUNTRIES` (`799` pachete decuplate în `./public/packs/`, `21.176,0 KB`, versiune `13n6kwc`):
  - **Batch 1 (`RO`):** Clasele I–XII (`1..12` + `9-SCI`) + Universitate Licență 1–3 (`math_romania_full_2026.mjs`, `math_ro5_*`, `math_ro678_*`, `math_ro9_science_2026.mjs`).
  - **Trasee dedicate / Batch 2–4 (`18` țări):** `HU, ES, IT, PT, PL, MD, GB-ENG, FR, DE, AT, CH, BE, NL, LU, IE, GB-SCT, GB-WLS, GB-NIR`.
  - **Batch 5 (`8` țări — Nordic & Baltic):** `DK, FI, IS, NO, SE, EE, LV, LT` (`math_batch5_nordic_baltic_2026.mjs` — `1.899` lecții).
  - **Batch 6 (`8` țări — Central & Med):** `CZ, SK, SI, HR, BG, GR, CY, MT` (`math_batch6_central_med_2026.mjs` — `1.901` lecții).
  - **Batch 7 (`8` țări — SE & Est):** `BA, ME, MK, RS, AL, XK, UA, BY` (`math_batch7_southeast_east_2026.mjs` — `1.888` lecții; include nota de pilot 2026/27 pentru clasa a 12-a din Ucraina).
  - **Batch 8 (`7` țări — Turcia, Rusia & Microstate):** `TR, RU, AD, LI, MC, SM, VA` (`math_batch8_microstates_eurasia_2026.mjs` — `1.423` lecții; include tranziția pe cohorte TYMM în Turcia și `VA` universitar `univ-1..univ-4`).
- **Corelare pe manuale / registre oficiale (`602 / 602` pachete școlare + `197 / 197` pachete universitare):**
  - `math_ro_textbook_correlation_2026.mjs` (manuale aprobate reale RO I–XII) + `math_textbook_correlation_all_2026.mjs` (celelalte 48 jurisdicții preuniversitare).
  - Documentat complet în `MATH_50_COUNTRIES_COMPLETION_BOARD_2026.md` și `MATH_TEXTBOOK_CURRICULUM_AUDIT_2026-11-24.md`.
- **Ultimul APK Signed Release verificat:** [`v1.0.1820`](https://github.com/kokocf-ui/myPocketAi/releases/tag/v1.0.1820) (`myPocketAI-signed-release.apk`).

---

## 3. Ce MAI ESTE DE FĂCUT (Backlog ordonat pentru sesiunile următoare)

1. **Matematică — Selector regional și pe tip de școală / filieră** (planificat în `MATH_50_COUNTRIES_COMPLETION_BOARD_2026.md`):
   - **Spania (`ES`):** cele 17 comunități autonome (+ Ceuta/Melilla), cu decretele regionale LOMLOE (Primaria / ESO / Bachillerato).
   - **Germania (`DE`):** cele 16 *Länder* + tipul de școală (*Gymnasium, Realschule/Mittelschule, Gesamtschule*, Grundschule 6 ani în Berlin/Brandenburg, G8/G9, Grund-/Leistungskurs).
   - **Italia (`IT`):** tipul de școală secundară superioară (*liceo scientifico / scienze applicate / classico / linguistico / scienze umane / artistico, istituto tecnico, istituto professionale*).
   - **Extindere pe același mecanism:** cantoane `CH`, comunități `BE`, tipuri `AT` (AHS vs BHS), entități/cantoane `BA`.
   - *Arhitectură:* refolosește tiparul selectorului GCSE tier + overlay-uri în `./public/packs/` (`0 KB` în Worker HTML).

2. **Matematică — Verificare aprofundată capitol-cu-capitol pe manualele naționale aprobate:**
   - Acolo unde `mathCurriculumReadiness()` marchează încă `partial-source-review` (`fullyApproved === 0`), revizuirea detaliată pe ordinea exactă a unităților din manualele aprobate per an/filieră.

3. **Celelalte discipline din `Educație` pe toate cele 50 de jurisdicții** (vezi `EDUCATION_ALL_50_COMPLETION_BOARD_2026-11-20.md`, `EDUCATION_TEXTBOOK_CURRICULUM_AUDIT_2026-11-20.md`, `EDUCATION_COMPLETION_POLICY.md`, `PHYSICS_ACCEPTANCE_2026-11-21.md`):
   - **Științe (`Fizică`, `Chimie`, `Biologie`, `Astronomie`):** verificare pe țară/clasă/cohortă + decuplare în `./public/packs/` pentru orice extindere de conținut (deoarece HTML-ul offline este la ~`7,99 MB` / plafon `8,00 MB`). Notă: există PR draft `#512` pentru Astronomie.
   - **Istorie și Geografie** (`history`, `geography`): extindere dincolo de `RO`/`GB-ENG` cu epoci, spațiu și surse specifice fiecărei țări în pachete decuplate.
   - **Limbă și literatură**, **Informatică**, **Limbi străine** (mod școlar vs CEFR), **Pregătirea examenelor**: aliniere pe cele 50 de sisteme + corelare onestă cu programele/manualele oficiale.

---

## 4. Comenzi rapide de diagnostic la deschiderea unei sesiuni noi
```bash
git log -5 --oneline
node scripts/build_curriculum_packs.mjs --verify
node tests_math_ro_textbook_correlation_2026.mjs
node tests_math_curriculum_readiness.mjs
node tests_education_hg_theory_coverage.mjs
gh release list --limit 3
```
