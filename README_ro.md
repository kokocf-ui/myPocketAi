# myPocket AI — frontend v1.0.70

Actualizare: 31 octombrie 2026. Backend compatibil: v101, fără modificări în acest pachet.

## Instalare în repository-ul existent

Înlocuiește DOAR `index.js` din rădăcina repository-ului cu `index.js` din această arhivă. Fișierul `wrangler-frontend.toml` existent indică deja acest nume. Actualizează documentația `README_ro.md` și `README.md` cu fișierele incluse. Păstrează backend.js și configurația existentă. După publicare, reîncarcă aplicația.

## Corecții

- Numele locației și sigla sunt în același antet, numele în stânga și sigla de 44 px în dreapta. Numele lungi se pot întinde pe mai multe rânduri în spațiul rămas; sigla rămâne în dreapta.
- Deschiderea detaliilor resetează derularea la început. Poziția listei nu mai taie sigla sau numele sub antet.
- Galeria fără fotografii nu mai ocupă spațiu gol.
- Lista de rezultate și bara de navigare de jos rămân nemodificate.

## Fotografii și prețuri

Acest pachet corectează aranjarea detaliilor, nu adaugă un furnizor de fotografii sau tarife. Fotografiile sunt afișate numai când există adrese de imagini în datele locației sau în răspunsul Wikidata/Wikimedia Commons. O siglă disponibilă nu înseamnă că există și fotografii ale hotelului respectiv. Nu se înlocuiesc imaginile lipsă cu poze ale altui hotel.

Backend-ul v101 nu furnizează tarife în răspunsul căutării de hoteluri. Frontendul nu calculează și nu inventează aceste prețuri. O funcție de prețuri de rezervare necesită datele sejurului, numărul de persoane și o sursă de oferte curente. Camerele nu fac obiectul acestei actualizări.

## Validare

Worker-ul și JavaScript-ul extras din HTML-ul generat trec verificarea de sintaxă. Testele cu DOM simulat verifică structura comună nume/siglă, resetarea derulării și numele scurte/lungi/lipsă. Regula CSS ascunde galeria goală. Nu s-a făcut test vizual în browser sau pe telefon și nu s-a publicat în contul utilizatorului.
