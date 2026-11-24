# Literature audit — 2026-11-24

## Scope

The Literature journey follows country → level → year → branch → chapter → activity. Framework links and advisory notices remain distinct from claims of a complete official curriculum. Regional requirements, prescribed books and university courses vary by jurisdiction, institution and year; this implementation does not certify them as exhaustive.

## What was verified and changed

- Older French metadata placed 6e in primary and 5e–3e in upper secondary, although the current selector places all four in lower secondary. Browser expansion now respects the selected stage and removes only stale generated rows from another stage; server expansion gives precedence to the current selector. Existing national rows are retained.
- The generated European practice chapters now have ten topic-matched original passages, worked explanations and six relevant questions each, in Romanian and English, with primary and secondary question sets. Exercise/test answers are not disclosed beforehand. They are teaching examples, not national examination papers or a full textbook.
- Existing non-Romanian national rows without a chapter-specific offline body first use their existing online route. If it fails, a limited RO/EN general subject-area reference is clearly labelled as **not** the full specific chapter, an official syllabus or a grammar rule for another language. It is never used to pretend to correct a learner's answers. Romanian and university authored paths remain intact.
- The workspace explains that offline examples may be in Romanian or English rather than the subject language, and that other languages or specific lessons may need internet. The reader itself carries the disclosure for exported or printed material.
- The new stage regression checks 624 school-year selections in 50 systems and the four RO/EN modes for 5,312 generated browser chapters. The activity regression checks passage/topic association, 1,380 pre-existing non-Romanian national rows with the explicitly limited fallback, all Romanian university units in all four activity modes, and actual serialized-client failure routing. These are coverage tests, not independent curricular or pedagogical certification.
- The real Chromium mobile test navigates Romania grade 9, France 6e and a poetry exercise, Hungary's honest offline fallback, and a university lesson with reader pagination and Back. Other country, age, language and device combinations are not all separately browser-tested.

## Pack and language decisions

Literature currently embeds its compact authored modules and materializes year rows lazily; it is **not** in `ALL_DECOUPLED_CURRICULUM_PACKS`. The `eduRunWithCurriculumPack` call proceeds without a Literature download. This avoids fabricating packs that the Literature reader would not use. A future decoupling would need actual reader integration, offline cache, versioning and deployment tests. The generated examples are offline in RO/EN; selected Romanian university material is authored in RO. Other output languages or chapter-specific details can require the online service, and a general fallback is not equivalent to that missing detailed material.

Server and browser still construct some generated chapter wording differently. Stage identity is tested, but exact chapter-by-chapter equivalence and exhaustive national curricular coverage are not claimed. Further educational review and sourced, language-specific authoring remain appropriate for deeper national parity.
