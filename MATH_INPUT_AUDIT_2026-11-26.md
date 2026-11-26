# Audit introducere Matematică — 26 noiembrie 2026

> Evidență istorică înainte de implementare. După autorizarea utilizatorului, simbolurile, previzualizarea acoladei, gruparea blocurilor și fluxul de scriere/transcriere au fost implementate în cod. Starea și limitele actuale: `EDUCATION_INPUT_TOOLS_2026-11-26.md`. Nu interpreta lipsurile constatate aici drept starea ultimei versiuni de cod și nici implementarea drept confirmare pe APK/stylus fizic.

Cererea utilizatorului: verificare, fără publicare/APK, a simbolurilor speciale și a introducerii cu stylus/degetul, inclusiv funcții scrise sub acoladă. **Această etapă este audit, nu implementarea funcționalităților lipsă.**

Verificat codul curent `2b6eef9`, bundle-ul frontend Wrangler existent și DOM-ul real în Chromium mobil 390×844. Interacțiunile de paletă au fost efectuate în browser; nu s-a folosit un telefon fizic sau un stylus fizic. Reproducere: `POCKET_BUNDLE=./.bundle-check/index.check.mjs node scripts/audit_math_input_browser.mjs` (Chromium instalat necesar; în mediul sesiunii sunt necesare bibliotecile din `/tmp/pocket-browser-libs/lib`). Scriptul raportează observații, nu certifică suportul pentru scriere/OCR.

## Rezultate

| Funcție | Constatare |
|---|---|
| Paleta în ecranul general Matematică | Lipsește. Butoane găsite: conversație nouă, metodă, rezolvare, grafic, foto, album. |
| Paleta în fereastra lecției naționale de Matematică | Lipsește. Există două textarea (enunț și răspuns), acțiuni de tutor și ciornă, nu tastatură matematică. |
| Paleta în ecranele generale Fizică și Chimie | Există; deschiderea și inserarea lui `√` au funcționat în ambele ecrane. |
| Tablă liberă pentru deget/stylus în Matematică | Nu există în niciunul dintre cele două spații verificate; zero canvas-uri în ele și nicio unealtă de cerneală. Gesturile de manipulare a figurilor nu sunt recunoaștere de scriere. |
| Recunoașterea scrisului de mână | Nu există un flux propriu de captură a traselor și transcriere în exercițiu. Funcția eventuală de scriere din tastatura Android este externă aplicației și nu a fost testată aici. |
| Editor structurat de acolade / sisteme / funcții pe cazuri | Nu există; un textarea poate păstra textul `{ ... }`, dar nu oferă structura matematică bidimensională. |
| Funcție pe cazuri în ecranul general | Defect reprodus: `mathSplitExercises` rupe ramurile în două sarcini. Graficul local nu o suportă (`mathGraphModel` întoarce null). |

Cazul introdus în browser:

```text
f(x) = {
 x^2, dacă x < 0
 2x+1, dacă x ≥ 0
}
```

Textul din editor rămâne întreg, dar împărțirea pentru rezolvare produce:

1. `f(x) = {\nx^2, dacă x < 0`
2. `2x+1, dacă x ≥ 0\n}`

Această eroare privește ecranul general ce folosește `mathSplitExercises`; fereastra națională trimite enunțul ca un singur câmp. Nu s-a testat corectitudinea unei rezolvări AI live pentru funcții pe cazuri.

## Fotografia nu înlocuiește scrierea pe ecran

`handleLearningPhoto` încearcă TextDetector în browser. Android folosește ML Kit, iar codul nativ avertizează explicit că acesta nu este un motor pentru scris de mână/formule. Pilotul `/api/math-vision` este separat, opțional și condiționat de configurare/autorizare; cere transcrierea matematicii tipărite din fotografie. Nu este o tablă de scriere și nu dovedește recunoașterea corectă a acoladelor/scrierii de mână. Nu s-a verificat starea live a pilotului și nu s-au cerut credențiale.

## Implicații pentru implementarea următoare

- Paletă comună pentru Matematică, în ambele ecrane, cu inserare la cursor: acolade, paranteze, exponenți, radicali, relații, litere și șabloane pentru sisteme/funcții pe cazuri.
- Păstrarea unui sistem/unei funcții ca o singură problemă; evitarea separării ramurilor și a graficelor inventate.
- Suprafață de scriere cu Pointer Events pentru touch/pen, anulare/ștergere și păstrarea desenului; apoi integrare reală de transcriere matematică, cu verificarea utilizatorului înainte de rezolvare. Un canvas care doar desenează nu este finalizarea introducerii unui exercițiu.
- Probe necesare atât în browser, cât și într-un APK semnat pe dispozitiv real, fără afirmații că simularea certifică un stylus fizic.

Testele existente `tests_math_photo_vision.mjs`, `tests_math_voice_parentheses.mjs`, `tests_math_input_integrity.mjs` au trecut, dar nu acoperă aceste funcționalități lipsă; trecerea lor nu trebuie prezentată drept confirmarea scrierii de mână. Nicio modificare funcțională, PR, merge, deploy ori APK în acest audit.
