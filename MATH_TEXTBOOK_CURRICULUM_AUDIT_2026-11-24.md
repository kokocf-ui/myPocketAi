# Audit Matematică — Educație (24 nov 2026)

Audit programatic pe `curriculum_pack_catalog.mjs` + `math_curriculum_readiness.mjs` + tabloul de completare (`MATH_50_COUNTRIES_COMPLETION_BOARD_2026.md`).
Scop: stabili unde e „programa specifică per țară” și unde e „corelată cu manualele per an de studiu / per țară”.

## 1. Acoperire țări (programă specifică)

- **19 / 50 jurisdicții implementate** → 305 pachete decuplate (`public/packs/p-*.json`).
  - `RO`, `HU`, `ES`, `IT`, `PT`, `PL`, `MD`, `GB-ENG`, `FR`, `DE`, `AT`, `CH`, `BE`, `NL`, `LU`, `IE`, `GB-SCT`, `GB-WLS`, `GB-NIR`.
- **31 jurisdicții cu 0 pachete** (Batch 5–8 doar `PLANNED` în tablou):
  - Nordic & Baltic (Batch 5): `DK`, `FI`, `IS`, `NO`, `SE`, `EE`, `LV`, `LT`
  - Central & Med (Batch 6): `CZ`, `SK`, `SI`, `HR`, `BG`, `EL` (`GR`), `CY`, `MT`
  - SE & Est Europe (Batch 7): `BA`, `ME`, `MK`, `RS`, `AL`, `XK`, `UA`, `BY`
  - Caucasus & Microstate (Batch 8): `TR`, `RU`, `AD`, `LI`, `MC`, `SM`, `VA`, `AM`, `AZ`, `GE`
- **817** combinații țară/an total (50 jurisdicții × stagii), din care **305** au pachete.
- → Acoperire curriculum-specifică: **~38%** (19/50 țări).

## 2. Corelare inițială cu manualele (înainte de remedierea din 24 nov 2026)

Verificat inițial conținutul câmpurilor `textbooks[]`, `manualExample`, `source`, `status` pe cele 305 pachete:

| Metric | Valoare inițială | Observație |
|---|---|---|
| Pachete cu `manualExample` (manual concret per an) | **1 / 305** | Doar `HU`, clasa a 5-a (`OH-MAT05TA` / NAT 2020) |
| Pachete cu `textbooks[]` nevid | 286 / 305 | Era doar referința la cadru/programă, nu manuale/registre concrete |
| Pachete cu `source` nevid | 300 / 305 | Link la cadru național (KMK, BOE, MEN ordin, Éduscol…) |
| `status` al pachetelor | **305 / 305 = `general-learning`** | Nimic marcat `framework-verified` / `grade-content-unverified` |

Exemplu inițial (`RO`, clasa I): `textbooks` = „Manuale aprobate MEN (manuale.edu.ro) · Clasa a 1-a” cu link la **portal**, nu la un manual concret (editură, autori, ordin).
Exemplu inițial (`DE`, clasa 1): `textbooks` = „KMK Bildungsstandards · Klasse 1” — cadru, nu manual.

## 3. Semnal din testul de readiness

`tests_math_curriculum_readiness.mjs`:
- 817 combinații țară/an, **0 aprobate complet**, **4 sursă-mapate**, **7 recenzii parțiale**.
- Mesaj explicit: „Technical green does not imply curriculum complete.”

## 4. Concluzie din audit

- Curriculum-specific: 19/50 țări (Batch 1–4 făcute; Batch 5–8 planificate).
- Manuale efective / referințe de manual per an: necesitau corelare explicită pe pachetele școlare existente și includere nativă în Batch 5–8.

## 5. Direcții de continuare

- **W1 — Extindere acoperire:** implementa Batch 5 (Nordic & Baltic, 8 țări), apoi Batch 6 / 7 / 8.
- **W2 — Corelare manuale:** structură per-an/țară de manuale/registre reale (titlu, autori/autoritate, editură, ordin/act aprobare, programă, link) + populare `manualExample` și `textbooks[]`.
- **W3 — Ambele**, cu onestitate strictă: listele de manuale aprobate reale per an necesită surse oficiale verificabile (fără inventarea edițiilor/autorilor în țările cu piață editorială liberă la alegerea școlii).

## 6. Progres — corelare pe manual pentru TOATE cele 19 țări implementate (24 nov 2026)

Implementat și testat: **corelarea pe manual pentru RO (clasele I–XII)** și **pentru celelalte 18 țări implementate** (fără clasa a IX-a științe `9-SCI` tratată dedicat în `math_ro9_science_2026.mjs`; anii universitari rămân la standardele ARACIS / Bologna / EHEA, fără manual școlar unic).

- **Module noi:**
  - `math_ro_textbook_correlation_2026.mjs` (`RO`, clasele I–XII, manuale aprobate reale)
  - `math_textbook_correlation_all_2026.mjs` (celelalte 18 țări: `HU`, `ES`, `IT`, `PT`, `PL`, `MD`, `GB-ENG`, `FR`, `DE`, `AT`, `CH`, `BE`, `NL`, `LU`, `IE`, `GB-SCT`, `GB-WLS`, `GB-NIR`)
  - Stochează **DOAR** referința bibliografică / oficială la manualul sau cadrul aprobat (`title`, `authors`, `publisher`, `approvalOrder`, `syllabus`, `url`), **NU** conținut copiat.
  - Surse: CNEE, `manuale.edu.ro`, ordine ME/OMEC, Oktatási Hivatal (`OH-MAT`), MEC/CTICE Moldova, BOE/LOMLOE, Indicazioni Nazionali MIM, Aprendizagens Essenciais DGE / MEGA, Podstawa programowa MEN / CKE, Éduscol, DfE / NCETM, KMK, BMBWF Schulbuchaktion, Lehrplan 21 / PER / EDK, FWB / Vlaanderen, SLO / CvTE, MENJE / SCRIPT, NCCA, SQA, WJEC, CCEA.
- **Integrat în `curriculum_pack_catalog.mjs`:** fiecare pachet școlar poartă acum `manualExample` și `textbooks[]` structurat (cu editură/autori/ordin/programă), în locul linkului generic la portal.
- **Test nou:** `tests_math_ro_textbook_correlation_2026.mjs` (verifică toate cele 12 clase RO, cele 18 țări, cele 232/232 pachete școlare, absența conținutului copiat și menținerea la `0 KB` în Worker JS). Adăugat în `test:ui` și în workflow-urile CI de acceptanță/deploy.
- **Regresie:** toate testele matematicii trec; total pachete rămâne **305**; `readiness` raportează în continuare **0 aprobate complet** (corelare ≠ verificare anuală exhaustivă).

Exemple reale corelate în România:
- Clasele I–IV: Tudora Pițilă, Cleopatra Mihăilescu (+ Camelia Coman la III–IV) — Editura Didactică și Pedagogică (OMEN 3970/2018 & OME 5348/2021);
- Clasa a V-a: Marius Perianu, Ștefan Smărăndoiu, Cătălin Stănică — Art Klett (OM 5293/2017 & OME 4065/2022);
- Clasa a VI-a: Maria Zaharia — Paralela 45 (OME 5022/2023);
- Clasa a VII-a: Marius Perianu, Dana Heuberger, Ștefan Smărăndoiu, Cătălin Stănică, Ioan Balica — Art Klett (OME 5420/2024);
- Clasa a VIII-a: Marius Perianu, Dana Heuberger, Ștefan Smărăndoiu, Gabriel Popa, Cătălin Stănică — Art Klett (OMEC 6400/2025);
- Clasa a IX-a: Gabriel Ciupală, Dan Dumitrescu, Cătălin Gherghe — Intuitext (OMEC 5779/2026, locul 1 MEC 2026);
- Clasele X–XII: Marius Burtea, Georgeta Burtea — Carminis (lista CNEE manuale aprobate în uz, M1/M2).

**Rezultat intermediar (după Secțiunea 6):** **232 / 232 pachete școlare** au `manualExample` + `textbooks[]` (diferența până la **305** = cele **73 pachete universitare**, corect fără manual școlar).

## 7. Finalizare 50 / 50 jurisdicții europene (Batch 5–8 + corelare completă pe manuale/registre oficiale — 24 nov 2026)

Au fost implementate integral și verificate toate cele **31 de jurisdicții europene rămase** din `EDUCATION_EUROPE_COUNTRIES` (`50 / 50` în total), cu pachete decuplate în `./public/packs/` (`0 KB` adăugați în bundle-ul Worker JS) și corelare nativă de la bun început în `math_textbook_correlation_all_2026.mjs`:

- **Bancă comună extinsă de concepte originale:** `math_batch5_8_bank_2026.mjs` (16 concepte noi cu exemplu rezolvat pas cu pas, exerciții, răspunsuri și prevenirea greșelilor frecvente pentru ciclurile primare de 7 ani `IS`/`NO`, ciclurile gimnaziale de 6 ani `LT`/`MT` și liceele de 5 ani `BG`/`SM`) + generatorul determinist `scripts/generate_math_batch5_8_plans.mjs` (0 concepte reutilizate în interiorul aceleiași țări; ≥ 3 lecții originale per an/arie).
- **Batch 5 — Nordic & Baltic (`DK`, `FI`, `IS`, `NO`, `SE`, `EE`, `LV`, `LT`):** `math_batch5_nordic_baltic_2026.mjs` + `math_batch5_plan_2026.mjs` (**1.899 lecții**, **449 sloturi an/arie**; include nota pentru reforma suedeză *Gy25*, *LK20* Norvegia, *LOPS 2019* Finlanda, *Skola2030* Letonia, *UTA* Lituania).
- **Batch 6 — Europa Centrală & Mediteraneană (`CZ`, `SK`, `SI`, `HR`, `BG`, `GR`, `CY`, `MT`):** `math_batch6_central_med_2026.mjs` + `math_batch6_plan_2026.mjs` (**1.901 lecții**, **461 sloturi an/arie**; corelare cu `ebooks.edu.gr` Διόφαντος Grecia, `edicnyportal.iedu.sk` Slovacia, doložka MŠMT Cehia, cataloagele MZOM Croația, ZRSŠ Slovenia, МОН Bulgaria, ΥΠΑΝ Cipru, MATSEC Malta).
- **Batch 7 — Europa de Sud-Est & de Est (`BA`, `ME`, `MK`, `RS`, `AL`, `XK`, `UA`, `BY`):** `math_batch7_southeast_east_2026.mjs` + `math_batch7_plan_2026.mjs` (**1.888 lecții**, **452 sloturi an/arie**; include nota onestă pentru **clasa a 12-a din Ucraina — regim pilot în 2026/27** înainte de lansarea generală din 1 septembrie 2027, nucleul comun APOSO BiH și registrele `lib.imzo.gov.ua`, `e-padruchnik.adu.by`, `e-ucebnici.mon.gov.mk`, ЗУОВ Serbia, ZUNS Muntenegru, ASCAP Albania, MASHTI Kosovo).
- **Batch 8 — Turcia, Rusia & Microstate (`TR`, `RU`, `AD`, `LI`, `MC`, `SM`, `VA`):** `math_batch8_microstates_eurasia_2026.mjs` + `math_batch8_plan_2026.mjs` (**1.423 lecții**, **348 sloturi an/arie**; include tranziția pe cohorte **TYMM 2024–2026** vs programa MEB 2018 la clasele 4/8/12 în Turcia, *Escola Andorrana* + sistemele ES/FR în Andorra, *LiLe / Lehrplan 21* în Liechtenstein, alinierea franco-monegască în Monaco, San Marino și **excepția onestă pentru Cetatea Vaticanului (`VA`)**: stagiile preuniversitare rămân `external-curriculum` fără inventarea unei programe școlare vaticane K–12, iar pachetele decuplate acoperă ciclul universitar `univ-1..univ-4`).

### Bilanț final verificat automat (`tests_math_ro_textbook_correlation_2026.mjs` + `tests_math_batch5..8_*.mjs`)
- **Jurisdicții europene acoperite în `ALL_DECOUPLED_CURRICULUM_PACKS`:** **50 / 50 (100%)**
- **Total pachete decuplate în `public/packs/`:** **799 pachete** (`21.176,0 KB`, versiune `13n6kwc`, `0 KB` în Worker JS)
- **Pachete școlare corelate cu manual/cadru oficial (`manualExample` + `textbooks[]`):** **602 / 602 (100%)**
- **Pachete universitare (`manualExample: null`, standarde ARACIS / Bologna / EHEA):** **197 / 197 (100%)**
- **Onestitate de readiness (`mathCurriculumReadiness().fullyApproved`):** **0** (nicio lecție nu copiază manuale protejate și nu pretinde certificare ministerială integrală).

