# Mathematics — All 50 Countries Completion Board (Clasa 1 → Universitate, 2026/27)

Architecture: **Zero-Worker-Overhead Decoupled Curriculum Packs (`./public/packs/p-<sha256_24>.json`)**
- Served via `/api/curriculum-pack` (`X-Pocket-Client: 1` protected) from Cloudflare Workers Static Assets (`0 KB` added to Worker JS).
- Cached automatically on the user's phone (`localStorage` + `CacheStorage`) for instant offline reading.
- 100% original worked lessons (definition, notation/formula, step-by-step worked example, independent practice, answers, mistake prevention, and honest curriculum/textbook framing).

## Batch Status Overview

| Batch | Jurisdictions | Target Scope (`Clasa 1 → Universitate`) | Status |
|---|---|---|---|
| **Batch 1** | `RO` (România) | Clasa I–IV (OMEN 3418/2013 & 5003/2014 + `manuale.edu.ro`), Clasa V–VIII (MEN 3393/2017 + Art Klett), Clasa IX–XII (`9`, `9-SCI`, `10`, `11`, `12` — OMEC 6930/2025 & OMECI 5099/2009 M1/M2 Bacalaureat), Universitate Licență Anul I–III (ARACIS / Bologna) — **328 original RO lessons across all 16 tracks** | **IMPLEMENTED (2026-11-23)** |
| **Existing Full / Multi-Stage Tracks** | `HU` (Ungaria — Grades 1–13 + BSc 1–3 + MSc 1–2), `ES` (Spania — Primaria 1–6, ESO 1–4 A/B, Bachillerato 1–2), `IT` (Italia — Primaria 1–5, Secondaria I 1–3, Secondaria II 1–5) | Complete school tracks in decoupled packs; `ES` & `IT` school years and university completed in Batch 3 | **IN PRODUCTION (`public/packs/`)** |
| **Batch 2** | `MD` (Republica Moldova), `GB-ENG` (Anglia), `FR` (Franța), `DE` (Germania) | `MD` Clasa I–XII + univ 1–4; `GB-ENG` Y1–Y13 + BSc 1–3 (Y3/Y4/Y6/Y10, Y11 non-trig stay native); `FR` CP–Terminale + Licence L1–L3/M1 (5e stays native); `DE` Klasse 1–13 + Bachelor 1–3/Master 1 — **657 original lessons from 206 original concepts (205 used), 229 topic slots with ≥3 country lessons each, 60 new packs**; framing: MEC Moldova, DfE NC/GCSE/A level + QAA MSOR, Éduscol, KMK (partial-source-review, not certified) | **IMPLEMENTED (2026-11-23)** |
| **Batch 3** | `ES` (Spania), `IT` (Italia), `PT` (Portugalia), `PL` (Polonia) | `ES` Primaria 1–6, ESO 1–4 (A/B), Bachillerato 1–2 (CYT/HCS/General) + Grado 1–4; `IT` Primaria 1–5, Secondaria I 1–3, Secondaria II 1–5 + Laurea 1–3/LM 1; `PT` 1.º–4.º, 7.º–9.º, 10.º–12.º (Matemática A) + Licenciatura 1–3/Mestrado 1 (5.º/6.º stay native); `PL` klasy I–III, V–VIII, liceum 1–4 + licencjat 1–3/magisterskie 1 (klasa IV stays native) — **760 original lessons from 238 concepts (35 new in `math_batch3_bank_2026.mjs`), 241 topic slots with ≥3 country lessons each, 47 new packs**; framing: BOE RD 157/217/243-2022 (LOMLOE), Indicazioni Nazionali (DM 221/2025, Licei 2010), DGE Aprendizagens Essenciais, podstawa programowa 2024 + CKE (partial-source-review, not certified) | **IMPLEMENTED (2026-11-23)** |
| **Batch 4** | `AT`, `CH`, `BE`, `NL`, `LU`, `IE`, `GB-SCT`, `GB-WLS`, `GB-NIR` (9 Western & Isles systems) | Primary → Secondary → Upper Secondary → University decoupled packs (2080 lessons, 527 verified year/topic slots) | **IMPLEMENTED (2026-11-23)** |
| **Batch 5** | `DK`, `FI`, `IS`, `NO`, `SE`, `EE`, `LV`, `LT` (8 Nordic & Baltic systems) | Grunnskole/Perusopetus/Põhikool → Gymnasium/Lukio/Gümnaasium → University decoupled packs (**1,899 lessons, 449 verified year/topic slots**) | **IMPLEMENTED (2026-11-24)** |
| **Batch 6** | `CZ`, `SK`, `SI`, `HR`, `BG`, `GR`, `CY`, `MT` (8 Central & Mediterranean EU systems) | Primary → Secondary → Matura/Panhellenic/MATSEC → University decoupled packs (**1,901 lessons, 461 verified year/topic slots**) | **IMPLEMENTED (2026-11-24)** |
| **Batch 7** | `BA`, `ME`, `MK`, `RS`, `AL`, `XK`, `UA`, `BY` (8 Southeast & Eastern European systems) | Primary → Secondary → Upper Secondary (incl. `UA` Grade 12 2026/27 NUS pilot note) → University decoupled packs (**1,888 lessons, 452 verified year/topic slots**) | **IMPLEMENTED (2026-11-24)** |
| **Batch 8** | `TR`, `RU`, `AD`, `LI`, `MC`, `SM`, `VA` (7 Remaining European & Microstate jurisdictions — completing **50 / 50** in `EDUCATION_EUROPE_COUNTRIES`) | Full study-year & microstate treaty-aligned (`AD` Escola Andorrana + ES/FR, `LI` LiLe/Lehrplan 21, `MC` DENJS/Éduscol, `SM` San Marino, `TR` TYMM phased cohort, `RU` ФГОС, `VA` university-only with honest `external-curriculum` school stages — **1,423 lessons, 348 verified year/topic slots**) | **IMPLEMENTED (2026-11-24)** |

## Batch 2 notes (2026-11-23)

- Modules: `math_batch2_bank_{primary,lower,upper,university}_2026.mjs` (shared original concept bank) + `math_batch2_md_uk_fr_de_2026.mjs` (country/year/topic plan, local currency, unit names, honest framing). Imported only by `curriculum_pack_catalog.mjs`.
- No concept is reused in two places within the same country; Moldova uses its own curriculum framing (not Romania's).
- England Y11 trigonometry: pack cards lead the branch; `Trigonometrie și teorema lui Pitagora în spațiu` (G20) and `Teorema sinusurilor, teorema cosinusului și aria cu sinus` (G22) are Higher-only; exact values (G21) are on both tiers.
- Test: `tests_math_batch2_md_uk_fr_de_2026.mjs` (wired into math acceptance, Cloudflare deploy and Android release workflows).
- Open items: chapter-level checks against approved Moldovan/German/French textbooks were not done; German annual order varies by Land and school type; French programmes are being renewed in stages.

## Batch 3 notes (2026-11-23)

- Modules: `math_batch3_bank_2026.mjs` (35 new original concepts: year-6 primary, Matemática A citizenship models, D'Hondt, polynomial division/Horner, conics, Rouché–Frobenius, De Moivre, confidence intervals, quadratic optimisation, etc.) + `math_batch3_es_it_pt_pl_2026.mjs` (plan, euro/złoty, local unit names, honest framing). Reuses the Batch 2 shared banks; imported only by `curriculum_pack_catalog.mjs`.
- No concept is reused within a country, except between parallel tracks of the same year (4º ESO Matemáticas A/B; Bachillerato CYT/HCS/General), which a learner never takes together.
- Routing: `mathCountryCourseEntries` now merges pack lessons into the Spain/Italy branches (LOMLOE/Indicazioni focal lessons lead, Batch 3 lessons follow, generic bank last, deduplicated by id). Portugal 5.º/6.º and Poland klasa IV keep their native inline courses.
- Test: `tests_math_batch3_es_it_pt_pl_2026.mjs` (wired into math acceptance, Cloudflare deploy and Android release workflows).
- Open items: Spanish year distribution depends on the comunidad autónoma; Italian liceo content varies by liceo type; Portugal covers Matemática A only (not Matemática B / professional courses); Polish new podstawa (2026/27) applies first to klasy I and IV, other cohorts follow the previous programme. No chapter-level check against approved textbooks.

## Batch 4 notes (2026-11-23)

- Modules: `scripts/generate_math_batch4_plan.mjs` (deterministic planner) → `math_batch4_plan_2026.mjs` (frozen plan: 515 slots, 3–6 concepts each, no concept reused within a country) + `math_batch4_western_isles_2026.mjs` (native-language unit titles, euro / Swiss francs / pounds sterling, honest per-country framing, official source per stage). Reuses the Batch 2 and Batch 3 banks only; imported only by `curriculum_pack_catalog.mjs`.
- Lessons per country: AT 223, CH 232, BE 232, NL 232, LU 237, IE 228, GB-SCT 236, GB-WLS 229, GB-NIR 231. Imperial units only for the UK nations.
- Native early years kept: NL groep 1–2 and IE Junior/Senior Infants keep their inline early-years lessons (no pack).
- Sources used for framing: AT Lehrpläne 2023 + SRP Grundkompetenzen; CH Lehrplan 21 / PER / Piano di studio; BE FWB tronc commun (S1 from 2026/27) + Flemish minimumdoelen/eindtermen; NL kerndoelen rekenen-wiskunde (in law from 1 Aug 2026); LU plan d'études 2026; IE NCCA (revised LC spec from Sept 2027); GB-SCT SQA N5/Higher/AH; GB-WLS WJEC GCSE Mathematics and Numeracy (Double Award, from Sept 2025); GB-NIR CCEA GCSE.
- Test: `tests_math_batch4_western_isles_2026.mjs` (wired into math acceptance, Cloudflare deploy and Android release workflows).
- Open items: CH content depends on the canton/language region, BE on the community, AT upper years on the school type (AHS vs BHS) — to be covered by the regional selector. No chapter-level check against approved textbooks.

## Batches 5–8 & Full 50/50 Textbook Correlation notes (2026-11-24)

- Modules: `math_batch5_8_bank_2026.mjs` (16 new original concepts for 6–7 year primary/lower-secondary tracks and 5-year upper-secondary tracks), `scripts/generate_math_batch5_8_plans.mjs` → `math_batch{5..8}_plan_2026.mjs` + `math_batch5_nordic_baltic_2026.mjs`, `math_batch6_central_med_2026.mjs`, `math_batch7_southeast_east_2026.mjs`, `math_batch8_microstates_eurasia_2026.mjs` (**7,111 new original lessons across 1,710 verified year/topic slots**).
- Full 50-country textbook & official framework correlation: `math_ro_textbook_correlation_2026.mjs` (`RO` Grades I–XII approved manuals: E.D.P. Pițilă/Mihăilescu, Art Klett Perianu et al., Paralela 45 Zaharia, Intuitext Ciupală/Dumitrescu/Gherghe OMEC 5779/2026, Carminis Burtea CNEE) + `math_textbook_correlation_all_2026.mjs` (all 48 other school-pack jurisdictions across Batches 1–8; Vatican City `VA` preserves `external-curriculum` on school stages without inventing a Vatican K–12 syllabus and serves decoupled university packs `univ-1..univ-4`), storing bibliographic/ministerial metadata only (`0` copied prose, `0 KB` added to Worker JS).
- Coverage across decoupled packs (`ALL_DECOUPLED_CURRICULUM_PACKS`, **799 total across 50 / 50 European jurisdictions**, `21,176.0 KB` in `public/packs/`): **602 / 602 school packs** carry `manualExample` + structured `textbooks[]`; **197 / 197 university packs** keep `manualExample: null` (ARACIS / Bologna / EHEA / QAA standards).
- Tests & audit: `tests_math_batch5_nordic_baltic_2026.mjs`, `tests_math_batch6_central_med_2026.mjs`, `tests_math_batch7_southeast_east_2026.mjs`, `tests_math_batch8_microstates_eurasia_2026.mjs`, `tests_math_ro_textbook_correlation_2026.mjs`, `MATH_TEXTBOOK_CURRICULUM_AUDIT_2026-11-24.md`.

## Queued after Batch 4: regional / school-type curriculum selector (decided 2026-11-23)

User decision: implement **after Batch 4**, with **full coverage from the start**.

- **Spain (`ES`)** — selector for all 17 comunidades autónomas (+ Ceuta/Melilla under the MEFP decree). Each variant cites its regional decree (Primaria / ESO / Bachillerato) and adjusts the year placement of the national saberes básicos.
- **Germany (`DE`)** — selector for all 16 Länder **and** school type (Gymnasium, Realschule/Mittelschule, Gesamtschule). Structural differences must be modelled: 6-year Grundschule in Berlin/Brandenburg, G8/G9 (Abitur after year 12 or 13), Grund-/Leistungskurs. Each variant cites the Land's Lehrplan/Kerncurriculum.
- **Italy (`IT`)** — no regional curricula. The selector is the upper-secondary school type: liceo scientifico (incl. scienze applicate), classico, linguistico, scienze umane, artistico, musicale/coreutico, istituto tecnico, istituto professionale. It follows the Licei 2010 decree and the technical/professional guidelines.
- **Design** — reuse the GCSE tier selector pattern: the choice is asked once, saved on the phone and changeable anytime. Default is "Orientativ – comun tuturor" (today's behaviour). Variants are overlays on the base pack (year placement, added/removed lessons, regional source citation), with prose in `public/packs/` only (0 KB Worker). No variant is published without an official regional source; anything unverified stays "orientativ".
- **Reuse** — the same mechanism will serve `CH` cantons, `BE` communities and `AT` school types (Batch 4 backfill).
