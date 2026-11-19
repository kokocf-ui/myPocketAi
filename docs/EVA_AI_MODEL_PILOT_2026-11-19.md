# Eva – comparație controlată a motorului AI (19 noiembrie 2026)

Experimentul **nu** modifică motorul din aplicația publică, APK-ul, Cloudflare Worker ori transportul.

## Obiectiv

Compară cele trei modele Workers AI pe **aceleași patru solicitări sintetice**:
istorie/documentar (Decebal), educație/matematică, transport multimodal
(când lipsesc datele în timp real) și poveste pentru copii.

Modele: @cf/meta/llama-3.1-8b-instruct-fast,
@cf/meta/llama-3.3-70b-instruct-fp8-fast, @cf/openai/gpt-oss-120b.

## Controlul consumului

- 3 modele × 4 solicitări = **cel mult 12 apeluri**, fără retry.
- Maximum 350–440 tokenuri la ieșire pe solicitare, timeout 60 secunde.
- La HTTP 403/401/404 se blochează **modelul** după prima eroare.
- La HTTP 429 se oprește **tot experimentul**; nu se epuizează cota prin retry.
- Fără Brave/SerpApi/Exa, fără GPS, conversații, chei în raport sau date personale.
- Se reutilizează credentialele Cloudflare existente exclusiv în GitHub Actions.
- Dacă lipsesc credentialele, raportul va indica „skipped”, nu rezultate false.

## Ce măsurăm

Răspunsul fiecărui model, timpul de răspuns, numărul de tokenuri
(dacă furnizorul îl transmite), starea HTTP clasificată și verificări automate.
Indicatorii automați nu stabilesc dacă povestea este captivantă
sau dacă fiecare detaliu factual este corect; acestea cer evaluare
umană: adevăr, coerență, utilitate, expresivitate.

## Lansare

O singură execuție GitHub Actions la publicarea ramurii
feature/eva-ai-model-pilot-20261119.
Rezultatele sunt stocate exclusiv în artifactul eva-ai-model-pilot-results
(JSON + Markdown), disponibil timp de 7 zile.

## După evaluare

Dacă un model dovedește un avantaj clar, următoarea etapă este un router comun
pentru cereri simple versus complexe, cu limite de cost și verificare de surse.
Niciun rezultat de pilot nu activează automat modelul nou în producție.
