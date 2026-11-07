# Biblioteca de teorie – Matematică, Fizică, Chimie

Interfața existentă **Educație** include acum dialogul „Teorie”, fără schimbarea modulului:
- Matematică: după alegerea nivelului, în lista ramurilor, plus buton în fereastra de lucru.
- Științe: două butoane dedicate, Fizică și Chimie, în bara existentă.
- Dialog modal adaptabil: căutare manuală, maximum patru sugestii pe măsură ce tastezi, enunț și formulă.
- Dictare: exclusiv prin puntea vocală Android nativă în modul `theory`; în browser rămâne disponibilă tastarea.
- Înapoi: închide dialogul și revine la aceeași fereastră; recunoașterea vocală se oprește când dialogul se închide.
- Catalog local: `education_theory.mjs`, 58 fișe (20 matematică, 19 fizică, 19 chimie), cu sinonime și filtrare pe nivel. Conținutul este introdus și în HTML-ul generat de `index.js` pentru utilizare imediată fără request separat.

## Verificare
`npm run check`; `npm run test:ui`; `npm run test:android`. Testele noi sunt `tests_education_theory.mjs` și `tests_education_theory_ui.mjs`.

## Limitări
Catalogul de 58 fișe este o bază reală, **nu** o acoperire completă a tuturor definițiilor și teoremelor universitare. Enunțurile sunt în română; traduceri corecte în celelalte limbi nu sunt încă populate. Pe telefon trebuie testate dialogul, tastatura, microfonul, Back și accesibilitatea. Nu modificați logica de rezolvare a exercițiilor pentru a afișa teoria.
