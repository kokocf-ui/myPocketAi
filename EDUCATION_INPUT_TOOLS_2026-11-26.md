# Introducere în câmpurile de lucru — implementare, 26 noiembrie 2026

## Cererea și starea

Utilizatorul a autorizat implementarea pentru materiile cu fereastră de lucru, preferând și scrierea de mână, dar acceptând acolada care crește la Enter. Acest raport înlocuiește starea funcțională constatată în `MATH_INPUT_AUDIT_2026-11-26.md`; auditul rămâne evidență istorică. **Implementat în cod, fără PR/merge/deploy/APK.**

## Simboluri și acolade, fără AI

`education_input_tools.mjs` montează unelte comune lângă câmpurile multiline editabile ale Educației (`#moduleContent` și dialogurile educaționale), inclusiv câmpurile introduse dinamic. Nu se montează în afara modulului Educație, în câmpurile read-only/disabled sau în propriul dialog de transcriere. Întrebarea națională fixă nu poate fi schimbată prin paletă; la „Cerință proprie” primește aceleași unelte. Fiecare câmp primește un singur set.

- „Simboluri și șabloane”: operații, relații, litere, paranteze, acolade, puteri/indici și șabloane pentru sisteme, funcții pe cazuri, fracții, puteri, rădăcini.
- Inserare la cursor/în selecție, cu evenimentul normal `input` pentru ciornele și tutorul existente; fără deschiderea forțată a tastaturii. Limita câmpului este respectată, fără trunchiere tăcută.
- Dacă textul conține o acoladă și rânduri noi, apare o previzualizare SVG cu acoladă scalabilă. Enter adaugă rând și mărește acolada din previzualizare. Merge și înainte de a tasta acolada de închidere.
- **Editorul rămâne text simplu**: nu este un editor matematic WYSIWYG și nu introduce formatare ascunsă în enunț. Rândurile, condițiile și valorile rămân editabile. Șabloanele sunt exemple, etichetate pentru înlocuirea valorilor.

Aplicarea este comună tuturor disciplinelor cu asemenea câmpuri, nu o copie separată pentru fiecare lecție. Paletele de Fizică/Chimie existente sunt păstrate pentru simbolurile lor specializate.

## Sisteme și funcții pe cazuri

`mathSplitExercises` păstrează un bloc cu acoladă ca **un singur exercițiu**, inclusiv acolade imbricate, ramuri numerotate și blocuri încă neînchise. Exercițiile distincte normale continuă să fie separate.

Dispatcherul local nu mai poate alege o singură ecuație dintr-un bloc ca și cum ar fi toată problema. Pentru acolade se admit numai motoarele locale de sisteme 2×2/3×3, care trebuie să parseze întregul sistem. Parserul 3×3 acceptă acum și acoladele exterioare. Funcțiile pe cazuri nesuportate local merg întregi la tutorul AI. Graficul polinomial local refuză blocurile cu acolade: nu desenează numai o ramură ca și cum ar reprezenta întreaga funcție. **Nu s-a implementat un motor nou de grafice pentru funcții pe cazuri.**

## Scriere cu deget/stylus și transcriere verificată

Butonul „Scrie cu degetul / stylusul” deschide un dialog cu:

- suprafață Pointer Events pentru touch/pen/mouse, coordonate adaptate dimensiunii afișate, captură de pointer și `touch-action:none` pe tablă, nu pe întreaga pagină;
- o trasare activă, anulare ultima trasare, ștergere și descărcare PNG;
- păstrarea desenului în memorie la închiderea/redeschiderea tablei aceluiași câmp; **nu stocare persistentă după reîncărcarea paginii/schimbarea lecției**;
- trimitere numai prin apăsarea explicită a butonului „Transcrie (trimite desenul)”, după informarea că imaginea ajunge la Cloudflare Workers AI;
- rezultat într-un câmp editabil, checkbox obligatoriu de verificare și inserare separată. Corectarea textului debifează verificarea. Nicio rezolvare automată;
- anulare/invalidare la schimbarea desenului, a câmpului/cerinței sau închiderea dialogului, protecție contra transcrierilor întârziate și păstrarea selecției la redeschidere;
- păstrarea desenului și mesaj explicit dacă transcrierea nu este disponibilă. Simbolurile și șabloanele continuă să funcționeze offline.

### Serviciul nou

`education_ink_api.mjs` + ruta `/api/education-ink`, prin proxy same-origin din `index.js` și bindingul backend existent. Este o rută educațională separată de vechiul pilot foto, nu cere codul pilotului și nu folosește ML Kit drept recunoaștere a scrisului de mână.

Activarea necesită `POCKET_EDUCATION_INK_ENABLED="true"` și bindingul `AI`; variabila este adăugată în configurația backend **pentru o publicare viitoare**, nu activată live în această etapă. Lipsa configurării produce 503. Endpointul folosește politica publică a API-ului existent, nu introduce autentificare de utilizator sau un nou sistem distribuit de rate limiting.

Protecții: POST JSON, consimțământ explicit, respingere `Sec-Fetch-Site: cross-site`, citire limitată a corpului (1.500.000 octeți inclusiv fără Content-Length), PNG base64 verificat, imagine maximum 1.000.000 octeți, dimensiuni limitate, o singură generare, fără retransmitere printr-un fallback HTTP la 503, fără stocare/logarea imaginii ori transcrierii. Frontendul folosește o tablă de 1200×700 și termen-limită 45 s. Model: `@cf/moondream/moondream3.1-9B-A2B`; instrucțiunea cere doar transcriere, rânduri și condiții păstrate, fără rezolvare/completare și `[?]` la semne ilizibile. Nu există fallback la un alt serviciu plătit. Utilizarea consumă cota Workers AI; codul nu garantează că abonamentul/configurația unui cont nu poate avea costuri. Nici recunoașterea corectă a unui scris concret nu este garantată.

## Verificări

- `npm run check`, `npm run test:education-input`: trecute. Testele noi verifică inserarea, creșterea acoladei, gruparea blocurilor, evitarea soluțiilor locale parțiale, sistemele 2×2/3×3, consimțământul, limitele și proxy-ul fără a doua inferență.
- `tests_education_input_browser.mjs` pe bundle Wrangler în Chromium real 390×844: trecut. Cele opt materii naționale, câmp propriu/read-only, inserare la selecție fără focus forțat, Enter, șabloane, evenimente pen/touch și touchscreen emulat, undo/clear, ciornă în memorie, transcriere corectată și confirmată, eșec API, rezultat întârziat, ecranele generale Matematică/Fizică/Chimie/Informatică, examene și dialog de Limbi străine. **Modelul este simulat; pen este eveniment de browser, nu stylus fizic testat.**
- `tests_education_workspace_browser.mjs` pe același bundle: trecut; lecții, ciorne, corectare, universitar și examene.
- 21 comenzi de regresie focalizată: trecute (pachete naționale, Matematică, Științe, examene, serviciu de conținut, pilot foto). `tests_frontend_boot_syntax.mjs` și localizarea celor 44 limbi: trecute.
- Cele 102 comenzi `test:ui` au fost executate individual. După remedierea pornirii helperului în contextul VM și rerularea testului de Limbi străine, **100 trec; cele două restanțe istorice rămân**: `tests_education_ui_locales.mjs` (eticheta examenelor fără traducere statică) și `tests_extra_tools_workspace.mjs` (așteaptă24 materii, catalogul are25). Nu sunt declarate rezolvate.
- Dry-run frontend/backend și garda numelor browser: trecute. HTML final: **7.347.956 caractere / 7.590.375 octeți UTF-8**, sub 8.000.000 octeți. Instalarea observerului este amânată până la terminarea scriptului, pentru helperii injectați de esbuild; nu confunda testarea sursei cu testarea bundle-ului.

## Limite rămase

Nu s-a făcut inferență live, test cu scrisul utilizatorului, test cu stylus fizic sau APK instalat. Recunoașterea live și serviciul trebuie verificate după publicarea autorizată; interfața avertizează și nu introduce automat rezultate neverificate. Traducerea APK rămâne depanare separată, amânată. Nu se pretinde WYSIWYG complet, OCR perfect, salvare persistentă a desenelor sau grafice locale pentru funcții pe cazuri.
