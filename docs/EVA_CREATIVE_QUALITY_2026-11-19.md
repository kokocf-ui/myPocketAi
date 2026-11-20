# Eva — calitate comună pentru orice creație, 19 noiembrie 2026

## Scop

O cerere de creație poate veni din Asistentul AI, Educație, literatura și eseuri,
Mini-cartea narată și alte module care folosesc backendul text AI. Nu este
acceptabil ca aceeași cerere să primească un text bine dezvoltat într-un modul
și o compunere puerilă în altul.

## Decizii

1. `eva_creative_quality.mjs` clasifică cererile reale de creație, distingând
poveste, documentar, eseu, scenariu, poezie, discurs și text publicitar.
Nu confundă „Cum scriu o poveste?” cu „Scrie o poveste!”.
2. Implicit, vocea este matură și profesionistă. Dacă utilizatorul alege
„Poveste pentru copii”, limbajul este potrivit vârstei, dar fără infantilizare.
3. Cererile creative cu date reale păstrează delimitarea verificabil /
interpretare / ficțiune. Un model performant nu trebuie să inventeze surse.
4. Cererile creative nu sunt trunchiate după bugetul conversațiilor scurte.
Modelul primește instrucțiuni concrete despre scenă, argumente, dialog sau
structură, în loc de șabloane morale și generalități.
5. Poeziile, discursurile și textele scurte folosesc Llama 70B; poveștile, documentarele și lucrările ample folosesc GPT-OSS 120B.
Dacă modelul nu furnizează text vizibil, există maximum un fallback.
Un eșec de cotă nu declanșează reluări inutile.
6. Pentru mini-carte, dacă modelul livrează capitole invalide, există
maximum o încercare de refacere a structurii prin Llama 70B.
7. **Comutator de revenire:** `POCKET_EVA_CREATIVE_QUALITY_ENABLED=0`
restabilește modelul vechi și instrucțiunile anterioare, fără reconstruirea APK.
Rutarea AI generală `POCKET_EVA_SMART_ROUTER_ENABLED` rămâne separată și
dezactivată implicit.

## Limite

Această schimbare acoperă căile care folosesc generarea de text în backend.
Nu poate îmbunătăți prin prompt funcțiile bazate pe șabloane statice,
transportul verificat prin API sau imaginile. Răspunsurile rămân probabilistice.
Calitatea literară nu poate fi garantată doar prin teste automate; o verificăm
și în probe reale, apoi în aplicația de pe telefon.

## Verificare

Teste unitare pentru 9 genuri și șase solicitări necreative, detectarea
repetițiilor / finalurilor incomplete, alegerea modelelor și conservarea
informațiilor. Teste de integrare: Asistent, Educație, Mini-carte, fallback
la generație invalidă și rollback prin variabila de mediu.

## Descoperire în proba live

Înainte de corecția P0, o poveste despre un mesaj ascuns într-o gară a fost deviată pe rând către căutarea conversațiilor și căutarea localurilor fără GPS. Cererile explicite de creație din Asistent sunt acum tratate înaintea acestor rutări, cu o verificare de regresie. Primul test live Llama 70B a produs 413 cuvinte, dar tonul era prea generic; a fost selectat GPT-OSS pentru povești și au fost întărite criteriile de scene, miză și final.
