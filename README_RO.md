# Pocket AI — Backend v97

Arhivă de actualizare completă pentru backend. Actualizarea este construită pe arhiva `PocketAI_backend_v96_BRAVE_KEY_FIX.zip` din Biblioteca utilizatorului.

## Fișiere
- `backend.js` — fișier complet, înlocuiește backend-ul existent.
- `tests_v97.mjs` — teste automate cu răspunsuri simulate.
- `package.json` — configurare Node.js pentru teste.
- `CHANGELOG.txt` — modificările din v97.
- `TEST_REPORT.txt` — rezultatele verificărilor locale.
- `SHA256SUMS.txt` — amprente SHA-256 ale fișierelor livrate.

## Ce aduce v97
- Acordă prioritate surselor găsite independent de mai multe motoare (Exa, Brave, Tavily), fără să considere simplul acord drept dovadă.
- Ține cont de vechimea informațiilor pentru întrebări despre prețuri, noutăți și date actuale.
- Preferă mai clar sursele oficiale pentru întrebări juridice și de reglementare.
- Expune diagnostice despre confirmarea între motoare și activarea filtrării după vechime.
- Păstrează căutarea paralelă, extrasele din paginile originale, eliminarea duplicatelor, izolarea locației, cele 10 limbi și funcțiile existente.

## Secrete Cloudflare
Backend-ul citește numele exacte:
- `EXA_API_KEY`
- `BRAVE_API_KEY`
- `TAVILY_API_KEY`

Nu introduce cheile în fișiere. Ele rămân configurate în Cloudflare Worker Secrets.

## Instalare
1. Descarcă și păstrează arhiva ca copie de siguranță.
2. În Cloudflare Workers, deschide worker-ul backend Pocket AI.
3. Înlocuiește integral conținutul fișierului backend cu `backend.js` din arhivă.
4. Salvează și publică worker-ul.
5. Verifică endpoint-ul rădăcină: versiunea trebuie să fie `v97`.
6. Testează o întrebare despre o informație recentă și verifică sursele returnate.

Nu modifica frontend-ul pentru acest update.

## Verificare locală
```bash
node --check backend.js
node tests_v97.mjs
```

Testele folosesc răspunsuri simulate pentru furnizorii externi. Ele nu garantează funcționarea cheilor, cotelor sau serviciilor live din Cloudflare.
