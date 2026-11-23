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
| **Batch 4** | `AT`, `CH`, `BE`, `NL`, `LU`, `IE`, `GB-SCT`, `GB-WLS`, `GB-NIR` (9 Western & Isles systems) | Primary → Secondary → Upper Secondary → University decoupled packs | **PLANNED** |
| **Batch 5** | `DK`, `FI`, `IS`, `NO`, `SE`, `EE`, `LV`, `LT` (8 Nordic & Baltic systems) | Grunnskole/Peruskoulu → Gymnasium/Lukio → University decoupled packs | **PLANNED** |
| **Batch 6** | `CZ`, `SK`, `SI`, `HR`, `BG`, `EL`, `CY`, `MT` (8 Central & Mediterranean EU systems) | Primary → Secondary → Matura/Panhellenic → University decoupled packs | **PLANNED** |
| **Batch 7** | `BA`, `ME`, `MK`, `RS`, `AL`, `XK`, `UA`, `BY` (8 Southeast & Eastern European systems) | Primary → Secondary → Upper Secondary → University decoupled packs | **PLANNED** |
| **Batch 8** | `TR`, `AM`, `AZ`, `GE`, `RU`, `AD`, `LI`, `MC`, `SM`, `VA` (10 Caucasus, Microstates & Remaining European Council/EHEA jurisdictions) | Full study-year & microstate treaty-aligned (`FR`/`IT`/`CH`/`ES`) decoupled packs | **PLANNED** |

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
