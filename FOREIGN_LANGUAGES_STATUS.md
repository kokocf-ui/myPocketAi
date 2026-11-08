# Educație — Limbi străine · implementare funcțională (8 noiembrie 2026)

## Arhitectură integrată
Acces: Educație → Limbi străine → 14 limbi → variante regionale / istorice, unde este cazul → CEFR A1–C2 sau 3 niveluri clasice → 8 discipline → lecție. Integrare fără a modifica ecranele de Matematică și Științe.

Limbi: română, engleză, franceză, germană, italiană, spaniolă, portugheză, neerlandeză, rusă, poloneză, latină, chineză mandarină, japoneză, greacă.

Variante: engleză UK/US, chineză simplificată/tradițională, latină clasică/ecleziastică, greacă modernă/clasică/Koine. Fiecare variantă folosește nivelurile proprii, fără a amesteca în tăcere scriptul sau pronunția alteia.

## Conținutul și activitățile
Toate cele 14 limbi dispun de traseu de studiu pe nivelurile aplicabile și pe opt teme: alfabet/scriere, saluturi, vocabular, gramatică, ascultare, conversație, citire/traducere, evaluare/recapitulare.
- Peste 180 de fișe și expresii locale introductive cu text original, transcriere IPA / Pinyin tonal / Rōmaji / transliterare istorică și traducere. Pentru orice nivel și temă, motorul solicită profesorului AI o lecție structurată corespunzătoare (obiective, vocabular, gramatică, dialoguri, exerciții, corectură).
- Întrebări interactive, verificarea textului pe răspunsurile locale, progres salvat pe limbă/variantă, lecții parcurse, recapitulare spațiată la nivel introductiv și recapitulare AI contextualizată la niveluri superioare.
- Test introductiv local: nivel de bază, fără a pretinde o încadrare CEFR. Evaluare orientativă extinsă A1–C2 pe șase cerințe progresive sau trei cerințe de filologie clasică; recomandarea AI este validată împotriva setului permis de niveluri și este marcată necertificată. Utilizatorul poate selecta nivelul și manual.
- Profesor AI cu moduri de conversație, explicații, ascultare, evaluare, pronunție explicată și recapitulare; istoric de dialog limitat per sesiune, răspunsuri etapizate.
- Android TTS în limba-țintă, viteză redusă, verificarea disponibilității motorului de limbă, Android STT în limba-țintă și inserare în câmpul de conversație. Browser speech synthesis când este disponibil.
- Pronunția istorică nu este simulată ca voce autentică; textul dictat nu poate demonstra acuratețea fonetică, astfel încât aplicația nu inventează scoruri pentru foneme sau tonuri.

## Implementare vs certificare
Modulul oferă acces funcțional la curricula și exerciții pentru toate nivelurile, dar conținutul avansat este generat la cerere, nu o enciclopedie offline prevalidată pentru fiecare combinație. Validarea pedagogică formală CEFR nu a fost efectuată. Recunoașterea vocală nu echivalează cu evaluare fonetică acustică; un motor extern specializat ar fi necesar pentru scoruri precise ale tonurilor și sunetelor, deci acestea nu sunt prezentate ca funcționalitate existentă.

## Verificare
- Parse JavaScript verificat local pentru codul frontend și codul de interfață rezultat din interpolarea șablonului.
- Simulare de navigare verificată pe cele 14 limbi, inclusiv selecția modern / vechi / Koine, cele trei niveluri clasice și accesul la lecții.
- Teste automate adăugate și extinse: `tests_foreign_languages.mjs`, motor `foreign_languages_learning.mjs`, conținut `foreign_languages_examples.mjs`, `npm run check`, `npm run test:ui` și PR workflow.
- Nu există încă un rezultat confirmat al întregului workflow CI și nici o compilare Android + testare WebView/voce pe dispozitiv pentru ultima versiune. Nu declara validare pe dispozitiv până la rularea ei.

Aceasta descrie starea verificabilă în repository, nu promite exhaustivitate academică offline, acuratețe garantată a lecțiilor AI sau certificare CEFR.
