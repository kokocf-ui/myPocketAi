# Omio – integrare etapizată pentru Eva / myPocketAI

Stadiu la 2026-11-16: utilizatorul a fost acceptat în Omio Travel (program Impact 7385). Aprobarea afilierii NU echivalează cu aprobarea folosirii linkurilor într-o aplicație Android și NU oferă automat acces Meta Search API.

Sursa pentru URL-ul oficial: https://www.omio.com/affiliate/search-widget
Condiții contractuale privind aplicațiile afiliate: https://www.omio.com/static_content/web/content/rest/Omio_affiliates_agreement.pdf

## Etapa pregătită în această ramură
- `omio_affiliate.mjs` produce redirecturi Impact către rute Omio, cu plecare, destinație, dată, retur opțional, limbă, monedă și mod de transport.
- Este obligatoriu ID-ul real **Impact Radius Partner ID** (diferit de advertiser 4057579 și program 7385).
- `mobileAppApproved:true` se setează doar după aprobarea scrisă a canalului Android de către Omio.
- În lipsa datelor sau a aprobării, funcția întoarce `null`; nu se face redirect și nu se inventează prețuri/orare.
- Orice click de rezervare trebuie să fie inițiat de utilizator; plata rămâne la Omio. Nu trimite coordonate GPS sau adresa exactă drept nume de oraș.

## Activare viitoare
1. Obțineți Omio/Impact Partner ID din cont și acordul scris de promovare în myPocketAI Android.
2. Conectați butonul «Compară și rezervă prin Omio» doar la rezultatele «Deplasare spre → Transport mixt», după alegerea calendarului. Folosiți localitatea verificată de plecare și de sosire, nu adresa exactă.
3. Activați flag-ul doar după aprobarea Omio; test click real și atribuire Impact în cont, fără cumpărare de probă.
4. Solicitați separat acces la Meta Search API/documentație/sandbox, pentru listarea prețurilor și orarelor direct în Eva.
5. Nu modificați motoarele naționale/local-urbane România/Anglia, navigarea GPS și rutarea deja stabilizată.

Test local: `node tests_omio_affiliate.mjs`.
