# Pilot OCR matematic din fotografie — Cloudflare Workers AI

## Stare
Prototip în ramură de test, **dezactivat implicit**. Nu înlocuiește ML Kit, nu trimite fotografii automat și nu confirmă sau rezolvă exerciții automat.

## Cum funcționează
1. Utilizatorul fotografiază pagina prin cameră/galerie, ca înainte. OCR ML Kit rămâne local.
2. În dialogul **Verifică fotografia**, noul APK oferă în zona derulantă o opțiune **Verifică simbolurile cu AI (pilot)**. Nu apare niciun buton nou pe ecranul principal.
3. La deschidere se explică unde va fi trimisă fotografia. Numai apăsarea butonului explicit de consimțământ trimite fotografia acelei pagini către Cloudflare Workers AI.
4. Android păstrează doar URI-ul ultimei fotografii matematice în memoria activității. La solicitarea explicită, pregătește o versiune redusă și o transmite pe bucăți către WebView-ul de origine autorizată.
5. Backendul verifică autentificarea, dimensiunea și formatul imaginii. Trimite un singur apel către modelul `@cf/moondream/moondream3.1-9B-A2B`. Cererea cere transcriere, fără rezolvare. Nu există retry automat.
6. Transcrierea AI apare **neconfirmată** ca alternativă. Utilizatorul compară și selectează un singur exercițiu. Regulile de verificare OCR rămân obligatorii.

## Activare (proprietar, după verificarea CI)
- Necesită **APK nou** ce conține bridge-ul Android `PocketAndroidMathVision`.
- În Cloudflare Worker `lifewise-ai-api`:
  - secret `POCKET_MATH_PILOT_TOKEN`: cel puțin 32 caractere aleatorii. Este același secret utilizat de pilotul opțional pentru dictarea matematică; nu trebuie introdus în GitHub sau în conversație.
  - variabilă `POCKET_MATH_VISION_ENABLED=1`: activează explicit acest endpoint. Dacă variabila lipsește, endpointul întoarce 503 și nu face inferență.
  - bindingul `AI` este deja definit în `wrangler-backend.toml`.
- În dialogul pilotului, utilizatorul introduce secretul în câmpul mascat. Se ține doar în memoria sesiunii aplicației.

**Cost:** Cloudflare are o alocare gratuită zilnică, dar nu putem promite cost zero pentru orice configurație de cont sau după depășirea acesteia. Pilotul este dezactivat implicit, necesită acțiune manuală pentru fiecare fotografie și nu face reîncercări automate. Înainte de activare, verificați planul și limitele din Dashboard. Nu activați plata automată/planul cu facturare doar pentru acest pilot.

## Calitate, siguranță, confidențialitate
- Exercițiile cu `√`, `x²`, fracții, `-1`, paranteze și mai multe subpuncte trebuie comparate vizual. Modelul poate greși, chiar când răspunsul pare sigur.
- Rezultatul AI nu este considerat sursă exactă; dacă împarte greșit exercițiile, se păstrează transcrierea originală și se corectează manual.
- Endpointul nu salvează în cod imaginea, rezultatul sau secretul și nu le include în logurile aplicației. Fotografia este trimisă furnizorului Cloudflare numai după acordul explicit. Politicile de procesare ale furnizorului sunt separate de această implementare.
- Nu folosiți fotografia documentelor personale pentru această funcție.
- Endpointul cere JPEG/PNG, limita ~1 MB imagine; Android micșorează imaginea înainte de transmitere. Reguli de origine pentru Android WebView.
- Dezactivare imediată: eliminați `POCKET_MATH_VISION_ENABLED` sau schimbați valoarea la `0`. OCR local rămâne funcțional.

## Verificare
```sh
npm run check
node tests_math_photo_vision.mjs
npm run test:ui
npm run test:android
gradle -p android --no-daemon assembleDebug
```

Testul cu mock nu dovedește acuratețea în lumea reală. Validarea finală pe Android trebuie să compare aceeași fotografie în ML Kit și Moondream, fără dubluri sau pierderea exercițiilor, iar activarea trebuie făcută numai dacă rezultatul pilotului aduce o îmbunătățire repetabilă.
