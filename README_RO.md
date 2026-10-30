# myPocket AI Frontend v1.0.51

Arhiva conține fișierul complet `index.js`, changelog, raportul verificărilor și checksum.

## Instalare pe telefon
1. Descarcă arhiva ZIP și extrage conținutul.
2. Deschide `index.js` și copiază întregul conținut.
3. În Cloudflare Worker pentru frontend, înlocuiește integral codul existent cu acest fișier.
4. Salvează/deploy și verifică pe telefon.

## Corecții
- Lista din „Selecții rapide” are acum un container de înălțime limitată și derulare internă proprie. Ultimul rezultat are spațiu de derulare suplimentar la bază, pentru a nu rămâne sub zona sigură a telefonului.
- Textele interfeței pentru rezultate, categorii, detalii, coordonate și stări sunt localizate în română, engleză, franceză, germană, italiană, spaniolă, portugheză și neerlandeză.
- Mesajul inițial al conversației și starea „gata de conversație” se actualizează în limba selectată, inclusiv după resetarea conversației.
- Comportamentul butonului Acasă din v1.0.50 este păstrat.

Numele proprii ale locațiilor (de exemplu, numele restaurantelor) rămân în forma furnizată de sursa de hartă și nu sunt traduse.

## Limită de verificare
Verificările automate ale sintaxei și structurii arhivei nu înlocuiesc testarea vizuală pe dispozitivul Android. După publicare, verifică derularea până la ultimul rezultat și schimbarea limbii în ecranul de rezultate.
