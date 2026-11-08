# Informatică — starea implementării (2026-11-08)

## Confirmat în cod
- Materia „Informatică” folosește un flux educațional separat, fără schimbarea modulului: nivel → ramură/specializare → capitole în ordine → spațiu de lucru.
- **Trei niveluri**: Începător (inițiere digitală), Mediu (gimnaziu/liceu), Avansat (universitate/specializări).
- **17 ramuri**, **65 capitole** populate. Fiecare lecție are teorie, exemplu propriu și întrebare cu patru variante și răspuns determinist.
- Începător: 4 ramuri / 12 lecții: dispozitive și software, logică, instrumente digitale, siguranță.
- Mediu: 5 ramuri / 24 lecții: algoritmi, programare, web, baze de date, sisteme/rețele.
- Avansat: 8 ramuri / 29 lecții: inginerie software, informatică teoretică, IA/ML, securitate defensivă, data science, cloud, embedded/IoT și HCI/grafică.
- Spațiul de lucru: întrebare sau cod introdus manual, fișier text (până la 512 KB, trunchiat pentru procesare), fotografie/album cu revizuire OCR, dictare Android, lecție și quiz local chiar dacă AI nu răspunde.
- Asistent: explicare, rezolvare pas cu pas și **revizuire statică** de cod; cu anulare prin AbortController, timp de răspuns afișat și menționarea explicită a limitelor.
- Un singur buton Citește/Oprește; se conectează la starea globală de redare.
- Butoane salvare PDF și imprimare prin fluxul Android existent; numele PDF include capitolul curent.
- Liste: căutare incrementală, afișare maxim patru opțiuni pe pagină, cu navigare la următoarele.

## Testare automată
- `tests_computing_curriculum.mjs`: 3 niveluri, 17 ramuri, 65 de lecții, unicitatea identificatorilor, întrebări și verificare locală, integrare UI, pornire script, OCR, voce și PDF.
- `tests_frontend_boot_syntax.mjs`: compilarea completă a scriptului browserului.
- Testele rulează în `.github/workflows/deploy-cloudflare.yml` înainte de publicarea frontendului.
- Publicarea interfeței pe Cloudflare a trecut pentru commitul `95494dfc`, după corectarea verificărilor automatizate.

## Limitări declarate
- **Nu există compilator/executor real** pentru Python, JavaScript, C/C++, Java sau alte limbaje. „Analizează codul” este o analiză statică AI și nu pretinde execuție sau rezultate verificate în runtime.
- Testarea manuală pe telefon se face doar la finalul întregului modul Educație, conform `EDUCATION_COMPLETION_POLICY.md`.
- Adaptarea fină la programele școlare oficiale ale fiecărei țări din Europa rămâne pentru revizuirea curriculară comună, după ultimele trei module, conform acordului utilizatorului.
- Serviciile cu cost nu sunt obligatorii.

## Următoarea ordine agreată
1. Pregătire examene
2. Cursuri practice
3. Testare integrată Educație și discuție despre extinderea alinierii curriculare europene la materiile anterioare.
