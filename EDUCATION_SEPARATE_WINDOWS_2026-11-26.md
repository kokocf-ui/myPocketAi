# Corrective iteration after physical APK 501879 feedback

## Acceptance and scope

The user's eight physical screenshots reject the previous inline/shared-scrolling workspace design. That design is superseded, not accepted. Keep one bounded screen: topic menus, a separate work-area window, and a separate paginated result reader. Long content may scroll inside its window; users must not hunt below the main page for work/results.

## Implemented

- National lesson workspaces for Mathematics, Physics, Chemistry, Biology, History, Geography, Computing and Literature now launch in a separate modal. The existing lesson entry point becomes a prominent launch button instead of inserting the editor beside activities.
- Each of those national class/year menus has a first work-area action without requiring a topic selection. It starts with a custom problem and optionally loads a lesson from that year. Existing task-specific draft keys are preserved; custom-year drafts have their own key. All existing checking/method/solution/local-reference/cancel/clear and shared symbols/stylus actions remain.
- Local references and AI correction/method/solution results use the existing paginated reader, not inline prose. Closing the reader returns to the unchanged editor. A reopen-last-result action avoids another AI call. Closing/replacing the editor cancels pending requests. Android Back closes the top result/workspace layer first.
- Foreign lesson cards use block flow. Their old column flex layout inherited wrapping and 100% child flex-bases, spilling into horizontal columns. Child geometry/overlap is now tested on actual lesson DOM, not just resource dialogs. The final language navigation override restores one bounded panel above the dock instead of page-wide downward scrolling.
- Dictionary metadata/search are in normal block flow with explicit field height, margins and sizing. No absolute/flex field collapse. Grammar is one topic at a time, with an expandable explanation/common-mistake section and explicit previous/next/end-of-pack controls. Guide groups also have previous/next/end controls.
- English GB/US introductory packs expanded from 12 to **36 lexical/phrase entries**, from 2 to **12 grammar topics**, from 3 to **6 conversation situations** per variant. Each grammar topic has an explanation, examples/forms, common-mistake guidance and an answerable check. Existing dictionary/grammar records are unchanged prefixes; old guide references are preserved. These are not complete CEFR courses or certifications. Other languages retain their existing introductory content: no claim of equivalent expansion there.
- Audio catalog has **86 descriptive models per English variant**: all 36 dictionary/phrase records plus all 50 grammar rows. Other variants likewise expose all dictionary and grammar rows in their packs. Options show position, text and meaning/context, rather than unexplained numbers. Search/pagination remains available in the common select menu; explicit previous/next buttons traverse models without reopening it. Purpose is listening/repetition/text comparison, not automatic pronunciation grading. Grammar rows have no invented phonetic transcription.
- Normal/slow rates changed from 0.88/0.70 to **0.80/0.40** on both browser and Android bridge paths. Android now accepts 0.30–1.15 instead of clamping to 0.65, invalidates/stops the old utterance before applying the rate, and reports a setSpeechRate failure rather than silently continuing. This is a code/contract correction, **not acoustic evidence on the user's phone**. Voice quality, installed language data, regional voice and effective engine speed require physical verification. Classical voice approximations remain labelled.

## Content/build safety

Only editorial JSON is the source for the new English material; none of it is embedded in the HTML. Explanation translation still delegates to the common translator and excludes target forms/examples. English variants share target language, not translated RO/EN duplicate worksheets. Expanded phrases use labelled broad British IPA; the US pack explicitly discloses that its regional synthesis can differ. No previously existing teaching data was deleted.

19 packs total: 132,904 bytes; 260 entries / 47 topics / 230 form rows / 55 guide groups, counted across regional/historical variants, not claimed distinct across variants. Per English variant: 36 entries / 12 topics / 50 form rows / 6 guide groups / 86 audio models.

Final local production HTML: **6,957,968 bytes**; Android snapshot: **6,883,618 bytes**; Worker bundle: **7,293,518 bytes**. HTML stays below 8,000,000 bytes. Generated snapshots and browser captures are ignored build artifacts, not committed.

## Validation

Passed on the production Wrangler dry-run bundle:

- Browser names and external study-data bundle guards; syntax check; Android UI/native and snapshot contracts.
- Touch + elementFromPoint + rectangle checks at 393×817, 360×640 and keyboard-sized 430px: all resource tabs, no card column overlap, dictionary search, delayed loading, tutor input/tools/actions, cancel/error retry, Android Back, exact RO VIII intervals, first class work-area entry, separate editor, paginated multi-page result, draft return/reopen.
- Eight national subjects including their actual class/year menus; method/solve/correction payloads, persistent isolated drafts, local reference reader, API failure, 12 university supplement routes, Astronomy years and examination regressions.
- 19 language variants; all 12 English topic next steps; descriptive complete audio list and arrows; actual JS Android-bridge payloads 0.80/0.40 with unchanged text/locale; Java clamp/order/error contracts; browser regional voices; simulated microphone permissions/capture lifecycle; translation projection/failure; cached/offline retry.
- Input tools on eight subjects, symbols/brace growth, consent/review handwriting flow; all 36 practical workshops; lazy study packs and source-only science browser suites.
- Canonical language, practical, study and science schema/hash/routes/cache tests; tutor and educational review contracts.
- All 102 UI commands executed individually: **100 pass, the same two documented pre-existing failures** (`tests_education_ui_locales.mjs:88` EN exams label, `tests_extra_tools_workspace.mjs:23` expected catalogue count 24 vs 25). Full results in ignored `.bundle-check/mobile-window-ui-results.json`. No claim of an entirely green UI suite.
- Inspected final Chromium resource/card/work-area/result captures. These are not screenshots of the user's APK.

## Delivery

Implementation commit **8b7fa58ea787e839376e082aa7dd567469f30300** pushed to `arena/8ae2700b-mypocketai`. Authorized manual workflow run **45826031309** completed successfully: signed branch release built; permanent certificate / package identity / increasing version / bundled snapshots checked; direct-download publishing succeeded; debug job skipped.

- VersionCode **501880**, above installed 501879; same permanent signing key, update without uninstalling.
- Prerelease `education-test-45826031309`, not latest; no main merge, production deployment or PR.
- Direct APK: https://github.com/kokocf-ui/myPocketAi/releases/download/education-test-45826031309/myPocketAI-signed-education-test.apk
- GitHub asset **795945895**, uploaded, **77,619,232 bytes**.
- GitHub metadata digest: `sha256:20170c72304f6881e12dca9ff96f3b71ada16c67bece7e94d1b36862e348589a` (not a locally recalculated APK hash).

This confirms build/delivery and CI certificate checks, not successful installation or physical UI/audio acceptance. Future stable updates must also exceed the test version installed on the phone.

The existing APK translation issue remains deferred/unverified. No live AI, physical Android speech/pronunciation, or physical stylus validation is claimed.
