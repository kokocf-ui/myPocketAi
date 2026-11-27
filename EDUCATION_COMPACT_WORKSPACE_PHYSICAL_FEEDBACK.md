# Shared work area — correction after physical screenshots

## User report and scope

The user returned with twelve physical Android screenshots (filenames `Screenshot_20261127_080004...080400_ai_mypocket_mobile_MainActivity.jpg`). The shared work area used by Mathematics, History, Literature, Computing and other national lesson packs is too long and confusing. Screens show duplicated work-area headings/custom-task menus, two large textareas each followed by duplicate input aids, and a long vertical list of seven commands. Physics, Chemistry and Astronomy were explicitly identified as the exceptions/reference; do not redesign their presentation. Mixed transport is not part of this change.

The user also rejected APK501888's public-transport changes as making the experience more complicated. Treat that physical retest as negative; the successful build/browser gates are not user acceptance. Transport remains unresolved/deferred.

## Corrective presentation

- New `education_compact_workspace.mjs`, serialized into the existing shared work-area script; no curriculum/data changes and no replacement of the subject's tutor/solver.
- One work-area header, then context/task selection without a second work-area heading. A class/year custom problem has one selector, not two copies of “Custom task”. Choosing a lesson retains both useful selectors (lesson + exercise), aligned in one compact context row.
- Clearly labelled **Enunț / Rezolvarea mea** in one bounded form. Both editors remain visible in portrait; long user/question text can scroll inside its own textarea, not move all commands below a long page.
- One visible symbols/handwriting tool strip follows the selected editor. Input goes to the selected field; readonly provided questions cannot be changed through the palette. There are still field-specific tool instances behind the shared strip so draft/handwriting/selection behavior remains intact.
- Three primary commands always visible: **Verifică / Rezolvă / Metoda**, retaining their full accessible names. Secondary commands (local reference, reopen result, cancel, clear this task draft) are available in a small **Alte opțiuni** panel, not a permanent long button stack. Opening that panel makes no AI request.
- Results still open in the existing separate paged reader; Back returns to the preserved editor. Reopening a result does not request it again.
- The modal follows `visualViewport` size/top offset so controls stay above a keyboard even if `innerHeight` does not shrink. While keyboard space is constrained, only the selected editor is displayed; its active state survives a button click/blur.
- Compact presentation applies to shared work areas for Math, History, Geography, Computing, Literature, Biology and other subjects using that component. Physics/Chemistry/Astronomy are explicitly excluded. Existing specialist math/science editors, lesson menus/data, solver behavior and normal course navigation are not restyled.

The input-tool initializer is explicitly exported to the browser global object for this component. A first dry-run caught an esbuild `.toString()` name collision; the property-based reference/export fixes it. The final bundle name guard and actual bundled browser tests pass. Do not rely solely on unbundled Node/browser tests for serialized browser functions.

## Executed validation

All AI/media calls are mocked, and curriculum assets are local. No provider/AI credits or paid fallback used.

- New `tests_education_compact_workspace_browser.mjs`: actual class/year **and** lesson entry points for six affected subjects (Math, History, Geography, Computing, Literature, Biology), at **360×640, 393×817, 430×932**. Form/modal no-scroll geometry, one header/select/tool strip for custom tasks, both editors, primary action touch hit testing, correct tutor subject/problem/student-answer context, task draft isolation/reopen, local context selectors, separate result + native Back, failure without draft loss, explicit cancel/late reply, explicit clear, symbols targeting and keyboard-sized layout. Also simulates a shorter visual viewport with unchanged layout height. Physics/Chemistry/Astronomy exclusion checked.
- Existing `tests_education_workspace_browser.mjs`: eight national subjects, 12 university supplement routes, four Astronomy years and exam practice pass. Only UI interaction with the relocated local-reference action is updated.
- Existing `tests_education_input_browser.mjs`: eight subjects, symbols/templates, growing brace, pen/touch, undo/clear, consent/review/correction, errors and stale OCR guards pass. Tool lookup follows the new active toolbar for compact workspaces; readonly-question safety assertions remain.
- Existing `tests_education_mobile_containment_browser.mjs`: 393×817, 360×640 and keyboard 430px, language/tutor/resource regressions, input tools, exact RO VIII intervals, draft/result/Back pass. Only the explicit “More options” step for local reference is added.
- `tests_education_exercise_tutor.mjs`, `tests_education_review_2026.mjs`, `tests_education_input_tools.mjs`, `tests_math_shared_workspace_layout.mjs`, `tests_education_national_reader.mjs`, `tests_science_resolution_symbols.mjs`, `tests_android_ui_preview.mjs`, generated frontend boot syntax: PASS.
- Wrangler frontend **dry-run** and bundled browser-name guard: PASS. New compact browser suite and existing workspace browser suite also pass against the real compiled bundle.
- Source-only capture inspection: `.bundle-check/compact-workspace/custom-360.png` and other phone widths (ignored artifacts). These are Chromium renderings, not physical APK screenshots.

## Delivery boundary

Source correction only in this phase. No new APK, production frontend/backend deployment, main merge, transport changes or paid service activation. The existing large working tree predates this correction and was preserved, not reset/staged wholesale. Physical acceptance of the compact work area is still pending; do not label the user's issue physically resolved based only on these tests.

## Subsequent explicit APK delivery request — completed

The user correctly noted that source-only work cannot be checked on their phone and explicitly requested the APK. The existing signed branch-test workflow was dispatched, without a production/backend deployment.

- Source **92e844bf41842bef412ca6f78964db73e636d490**; run **45965463970**, signed job **140392969235 SUCCESS**, debug skipped.
- Build, permanent-signing-certificate match, app identity, increasing **versionCode501889**, branch snapshot and prerelease publication all PASS in CI.
- Download: https://github.com/kokocf-ui/myPocketAi/releases/download/education-test-45965463970/myPocketAI-signed-education-test.apk
- Release460329771, asset799624363,77,661,520 bytes; GitHub SHA256 metadata `e8bb78a21c3f1ddfa53f254963b39b6f927696c8b40f0a0212f224b6ebbaa336`. No independent local APK/signature inspection claimed.
- Install over the existing application without uninstalling or clearing data. Physical layout acceptance is pending. Physics/Chemistry/Astronomy are excluded from the compact shared-workspace style.

This supersedes the previous source-only delivery boundary. Backend v187, production frontend, Oracle and HERE/paid-service state remain unchanged. Transport is unresolved; this build makes no further transport changes. The signing workflow's release notes now identify Education-layout testing rather than claiming a transport fix.
