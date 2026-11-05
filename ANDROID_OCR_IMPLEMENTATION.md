# Pocket AI — Android-first camera and text recognition

Status: implementation specification. Frontend photo picker is a prototype, not production OCR. Target deliverable is an installable Android APK, not a browser-only feature.

## Android stack
- Use native Android camera capture (CameraX or Android photo capture intent) and Android Photo Picker/gallery; respect lifecycle, rotation and runtime permissions. Do not request persistent gallery access if system Photo Picker suffices.
- Use Google ML Kit Text Recognition v2 on-device for Latin script in the MVP. Add other supported script recognizers as required by selected language; detect unsupported scripts and report honestly. Bundle models where practical for offline first-use, or clearly show first-run model-download status.
- Expose native OCR to the existing web UI through a narrowly scoped Android bridge when an Android WebView shell is used. Native-only camera, bitmap and OCR operations stay in Android; never assume window.TextDetector exists.
- Allow document/photo crop, rotate, retake, multiple blocks, selectable recognized text and manual corrections. Do not submit images invisibly.
- Keep source image local by default; submit only user-approved text to the AI backend. If future image understanding needs remote image upload, ask permission and implement size limits, deletion policy and transport security first.
- Offer actions: Solve step by step; Explain; Translate (with selectable source/target language); Read aloud. Show the recognized text for confirmation and allow corrections.
- Prefer on-device OCR even without internet. Explain that AI problem solving and online translation may still require network connectivity; don't represent all functions as offline.
- Preserve selected subject, existing navigation, bottom bar and shared 3D visual style. Education landing shows eight subject tiles and no chat input. Open subject to access subject-specific chat and photo actions.
- Languages: localize all new labels for all ten supported UI languages (ro/en/fr/de/it/es/pt/nl/ru/pl) before release. Avoid Romanian-English mixed screens.
- Test Android APK on real devices: camera permission denied, camera absent, gallery image, blurry/rotated pages, handwriting versus printed text, mathematical notation, diacritics, long pages, offline OCR, online AI, screen-reader navigation, back from OCR to selected subject, background/resume.
- Keep browser implementation only as an honest fallback: file selection and manual transcription, with TextDetector only when actually available. It must never claim OCR success without real recognized text.

## Acceptance gate
Do not call the feature complete until an APK build contains the native bridge and ML Kit OCR, a real camera and gallery workflow runs on a physical Android phone, and OCR-to-solve/translate is tested end-to-end.
