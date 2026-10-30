# myPocket AI Frontend v1.0.50

## Instalare
1. Descarcă arhiva ZIP și extrage fișierul `index.js`.
2. În Cloudflare Worker-ul frontend, înlocuiește integral conținutul fișierului existent cu acest `index.js`.
3. Salvează și publică Worker-ul.

## Corecții
- Cardurile de pe Acasă au acum distanțe egale între rânduri; rândurile 2 și 3 nu mai sunt deplasate artificial și nu ar trebui să fie tăiate de bara de navigare.
- Butonul Acasă închide și fereastra „Selecții rapide”, inclusiv când este afișat un tabel/listă de rezultate.
- Textele generate de interfața „Selecții rapide” sunt localizate pentru cele opt limbi disponibile.
- Listele de rezultate au derulare internă și spațiu inferior; conversația este derulată până la ultimul element.

## Păstrat
- Avatarul existent, inclusiv datele imaginii și comportamentul său.
- Fluxurile existente pentru GPS, solicitări de rutare și conversații.

## Limită de verificare
Sintaxa JavaScript și integritatea ZIP au fost verificate automat. Nu a fost disponibil un browser Android real în acest mediu; verificarea vizuală finală trebuie făcută după publicare pe telefon.
