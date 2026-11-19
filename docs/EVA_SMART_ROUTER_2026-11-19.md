# Eva — primul motor AI comun, pilot de integrare

Data: 19 noiembrie 2026

## De ce

Aplicația folosește diferite apeluri Workers AI. Un singur model rapid este insuficient pentru toate sarcinile, dar alegerea unui model mai mare pentru orice cerere ar crește latența și costul.

## Implementarea propusă

`eva_ai_orchestrator.mjs` clasifică solicitările în funcție de modul și de complexitatea lor. Trei niveluri:

- rapid (Llama 3.1 8B Fast): conversații scurte și sarcini simple;
- echilibrat (Llama 3.3 70B): explicații educaționale și analize medii;
- aprofundat (GPT-OSS 120B): documentare, creație lungă, matematică/analiză/programare complexe.

Planificarea este deterministă și nu folosește interogări web suplimentare.

## Siguranță și limitări

- Activare doar cu variabila secretă/de mediu `POCKET_EVA_SMART_ROUTER_ENABLED=1`. **Implicit OFF**, nicio schimbare pentru aplicația instalată.
- Nu modifică furnizorii și orarele pentru transport, căutările de știri sau verificările matematice deterministe.
- Nu transformă contextul AI în dovezi istorice; generarea factuală folosește în continuare surse verificate.
- GPT-OSS folosește `reasoning_effort: low` pentru a păstra loc pentru text și a limita costurile.
- La rezultat gol sau eroare de serviciu există cel mult un fallback; **niciodată la epuizarea cotei**.
- Outputul afișat extrage doar câmpurile vizibile, nu conținutul intern de raționament.
- Nu salvează mesaje, tokenuri sau date private.
- Se fac verificări locale și teste de integrare cu modele simulate, nu inferențe live și nu se generează APK.
- **Nu constituie o migrare completă** a tuturor apelurilor AI; pentru producție trebuie urmărite celelalte căi, latența și costul, pe loturi.

## Condiții de activare în producție

1. CI verde pentru rutare și regresiile educației/documentarelor.
2. Rulare canary separată cu solicitări reale și verificare a textului integral, nu doar verificări sintactice.
3. Măsurarea p50/p95 a latenței, a erorilor, a fallbackurilor și a consumului.
4. Activare graduală, cu revenire la configurația anterioară fără publicarea unui APK nou.
