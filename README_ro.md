# myPocket AI — frontend v1.0.69 + backend v101

Actualizare: 31 octombrie 2026.
Bază: frontend v1.0.68 (corecția butoanelor) și backend v100.

## Instalare

1. Actualizează Worker-ul backend existent cu `backend/worker.js`, apoi publică.
2. Actualizează Worker-ul frontend existent cu `frontend/index.js`, apoi publică.
3. Reîncarcă aplicația. Dacă vezi încă interfața veche, închide fila și redeschide aplicația.

Fișierele sunt codul complet al celor două Workers. Copiază conținutul în fișierul de intrare deja configurat pentru fiecare Worker; nu trebuie schimbat numele Worker-ului, domeniul sau configurarea de deploy. Păstrează secretele și binding-ul AI existente. Nu sunt necesare chei noi.

## Corecții

- Linkul Website deschide site-ul direct într-o filă a browserului. Fereastra internă cu iframe a fost eliminată, deoarece site-urile pot refuza încorporarea.
- Linkurile acceptă HTTPS, HTTP și domenii fără prefix. Schemele executabile și URL-urile cu utilizator/parolă sunt respinse.
- Rezultatele și detaliile au acum suport pentru sigle. Sunt folosite imaginile logo furnizate explicit, siglele Wikidata/Wikimedia Commons și, ca rezervă, pictograma domeniului site-ului.
- Backend-ul separă `logos` de `images` și poate recupera site-ul oficial din Wikidata. Păstrează și adresele website/contact:website din datele brute Geoapify.
- Siglele din listă sunt încărcate la apropierea de zona vizibilă; datele media sunt reutilizate la deschiderea detaliilor.
- Dacă nu există o siglă accesibilă, rămâne pictograma categoriei. Nu fiecare locație are website sau identificator Wikidata. Pictogramele de domeniu sunt solicitate prin Google S2, apoi direct de la site; afișarea depinde de disponibilitatea surselor externe.
- Bara de navigare și geometria listei nu au fost modificate.

## Verificări efectuate

- Sintaxa ambelor Workers și a JavaScript-ului extras din HTML-ul generat: validă.
- Teste cu răspunsuri simulate: separarea sigle/fotografii/site, identificatori invalizi, surse indisponibile, validarea URL-urilor, încărcarea siglei și revenirea la pictogramă, link extern și prevenirea duplicatelor: trecute.
- Nu s-a efectuat test vizual într-un browser sau pe telefon și nici publicare în contul utilizatorului. Disponibilitatea siglelor reale trebuie verificată după instalare.
