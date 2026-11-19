# Eva – live canary pentru routerul AI

Proba folosește backendul real, dar într-un proces Node izolat de producție.
Variabila POCKET_EVA_SMART_ROUTER_ENABLED este setată la 1 numai în acest proces.

## Date de test

1. Asistent: explicarea unei strategii de sincronizare offline a listelor de cumpărături.
2. Educație: cauze și efecte ale revoluțiilor române de la 1848, explicație pentru liceu.
3. Documentar: Decebal, trei capitole. Pentru a nu depinde de Wikipedia în acest test de integrare, sursa este o **fișă sintetică** cu fapte istorice selectate. Aceasta nu echivalează cu verificarea surselor reale.

## Controale

Maximum 6 apeluri Cloudflare AI pentru cele 3 solicitări (inclusiv fallback).
Nu se folosește Brave, SerpApi, Exa, niciun secret nu intră în raport. Nu se
folosesc conversații private sau date reale ale utilizatorilor. API-ul Cloudflare
este accesat prin tokenul separat CLOUDFLARE_AI_TOKEN din GitHub Actions.
Nu se publică un Worker nou și nu se construiește APK. Nu se activează
selectorul AI în producție.

## Criterii

Raportul include modelul apelat, erorile, durata și textul efectiv afișat.
Un rezultat CI verde înseamnă că scriptul a rulat, **nu neapărat** că
răspunsurile sunt suficient de bune. O decizie de activare necesită evaluarea
textelor și a costurilor înainte de un canary în producție.
