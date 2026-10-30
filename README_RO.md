# Pocket AI — Backend v95

- Istoric: maximum 12 mesaje recente (v94 păstra 4), maximum 1.200 caractere pentru fiecare mesaj.
- Continuitate: corecturile utilizatorului au prioritate; răspunsurile anterioare sunt context, nu dovezi.
- Exa: diferențiază rezultatele cu fragmente informative de URL-urile fără evidență extrasă.
- Elimină eticheta înșelătoare de material verificat; fragmentele sunt rezultate de căutare, nu verificare independentă.
- Adaugă diagnostice pentru rezultate, fragmente, domenii și contextul conversației.
- Păstrează transportul, GPS-ul, căutarea POI, calculele, limbile și traducerile din v94.
- Nu modifică frontendul sau index.js.

## Instalare
Înlocuiește numai backend.js în GitHub și publică Worker-ul lifewise-ai-api în Cloudflare. Verifică versiunea v95 la endpointul rădăcină. Backupul v94 este inclus.

## Limită
Backendul folosește numai istoricul primit de la frontend. Nu poate recupera mesaje mai vechi pe care frontendul nu le trimite.
