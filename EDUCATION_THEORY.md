# Biblioteca de teorie — integrare în Educație

Catalogul românesc `education_theory.mjs` conține 58 de fișe verificate editorial la nivel introductiv: Matematică (20), Fizică (19), Chimie (19). Fiecare fișă are enunț, formulă unde există, sinonime și nivel; `searchTheory` acceptă textul obținut din tastatură sau dictare, fără a accesa servicii externe.

## Următoarea integrare în aplicația principală

În interiorul modulului Educație, după selecția materiei, afișați două opțiuni: „Exerciții” și „Teorie”. „Teorie” folosește aceeași fereastră modală și navigația existentă, nu o pagină nouă. Folosiți `searchTheory(input, {subject,level,limit:4})` pentru sugestii, iar fișa selectată afișează **enunțul**, **formula** și eventual figura deja asociată motorului matematic. Dictarea trebuie să reutilizeze microfonul existent; nu se pornește automat. Selecția „Înapoi” revine la materia curentă. Pentru că interfața existentă `index.js` nu a putut fi citită integral prin conector, această modificare **nu pretinde că a conectat deja butonul în aplicația Android**.

## Validare

`node tests_education_theory.mjs` — 58 de fișe, 3 discipline, sinonime, niveluri, filtrare. Adăugați testul la CI înainte de merge. Conținutul este un catalog inițial, nu o acoperire exhaustivă a manualelor universitare. Verificați curricula înainte de declararea unei discipline „completă”.
