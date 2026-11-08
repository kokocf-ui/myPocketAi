# Educație — Limbi străine (integrarea inițială, 2026-11-08)

## Implementat efectiv în GitHub
- Navigare proprie: Educație → Limbi străine → 14 limbi → variantă (unde există) → nivel → domeniu → spațiu de învățare.
- 14 limbi: română, engleză, franceză, germană, italiană, spaniolă, portugheză, neerlandeză, rusă, poloneză, latină, mandarină, japoneză, greacă.
- Niveluri CEFR A1, A2, B1, B2, C1, C2 pentru limbile vii; traseu independent în 3 niveluri pentru latină și greacă veche.
- Variante separate: greacă modernă / greacă veche și Koine, latină clasică / ecleziastică, engleză UK / US, mandarină simplificată / tradițională.
- Opt teme: alfabet și scriere, saluturi, vocabular, gramatică, ascultare, conversație, lectură, evaluare.
- 90 de exemple introductive curate (84 moderne + 6 greacă veche): original, IPA sau Pinyin / Rōmaji / transliterare, traducere.
- Ascundere/afișare transcriere, ascultare, citire lentă în browser, Android TTS cu locale țintă, dictare Android pentru limbile moderne; dialog de exercițiu și progres local stocat per limbă/variantă. Verificarea răspunsurilor în modul local este o comparație textuală exactă, nu notare fonetică. TTS pentru pronunțiile istorice nu este prezentat drept autentic.
- Lecții contextuale AI pentru toate nivelurile și temele: solicită gramatică, context, dialog, exemple, exerciții. Ieșirea AI este marcată drept generată și necesită verificare.
- UI reutilizează aspectul și fereastra Educației, fără ecran separat.

## Limitări care NU trebuie prezentate ca implementate
- Corpusul offline acoperă exemple A1 de saluturi și câteva noțiuni clasice; nu sunt încă populări verificate offline pentru toate cele opt teme și toate nivelurile în 14 limbi. Lecțiile avansate sunt generate la cerere prin backend AI.
- Nu există încă evaluare oficială CEFR, plasare automată certificată, verificare acustică de foneme/tonuri, scor de pronunție, sistem de repetare spațiată sau sesiune vocală AI complet bidirecțională.
- Pronunțiile diferă regional; nu arătăm transcrieri britanice ca americane, nici exemple în caractere simplificate etichetate tradiționale și nici pronunție latină clasică drept ecleziastică.
- Android TTS / STT depind de vocile și serviciile instalate pe telefon; latina și greaca veche nu sunt prezentate ca fiind recunoscute de motorul de dictare.

## Verificare
- Codul principal a trecut verificarea sintactică izolată și a fost executată în mod simulat navigarea: 14 limbi, 2 variante grecești, 3 niveluri clasice, 8 capitole și 6 exemple grecești.
- `tests_foreign_languages.mjs` adăugat la `npm run test:ui`, `foreign_languages_curriculum.mjs` adăugat la `npm run check`, ambele în workflow-ul PR.
- Aceste modificări nu au încă o execuție completă confirmată de GitHub CI și nici testare pe telefon. Nu le marcați ca validate doar fiindcă testele există.
