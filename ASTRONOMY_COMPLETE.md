# Științe — Astronomie (integrare 2026-11-08)

## Cuprins și navigare
Științe → Astronomie → Începător / Mediu / Avansat → (la Avansat: specializare) → capitol → spațiu de lucru.

- 9 capitole fundamentale: sistem solar, cerul și coordonatele, distanțe, gravitație și orbite, stele, galaxii, observații, cosmologie și exoplanete.
- 7 trasee universitare: astrofizică stelară, mecanică cerească, astronomie galactică, cosmologie și relativitate, științe planetare, instrumentație și astrometrie, astrofizică de energii înalte.
- 82 de fișe teoretice originale, nivelate, indexate pentru căutare incrementală; nu pretind exhaustivitate universitară.
- Funcțiile de lucru comune păstrate: editare, simboluri, dictare, foto/OCR cu revizuire, explicații și navigare Înapoi.

## Calcule deterministe locale
Paralaxă unghiulară -> parseci; viteză orbitală circulară; viteză de evadare; rezoluție limitată de difracție pentru apertură circulară; luminozitate Stefan–Boltzmann; adâncime idealizată de tranzit; conversii AU/ly/pc. Datele sunt recunoscute doar când unitățile și denumirile sunt explicite. Intrările neacceptate sunt trimise spre explicație AI cu avertizare, nu inventate ca rezultate verificate. Răspunsul „Explică metoda” omite rezultatul numeric.

Exemple de test:
- `Paralaxă: p=0.5 arcsec` -> `2 pc`.
- `Viteza orbitala: M=5.972e24 kg; r=6.371e6 m` -> viteză în m/s, model newtonian.
- `Viteza de evadare: M=5.972e24 kg; r=6.371e6 m` -> m/s.
- `Rezolutie telescop: lambda=5e-7 m; D=2 m` -> unghi în radiani.
- `Stefan Boltzmann luminozitate: raza=6.957e8 m; T=5772 K` -> W.
- `Tranzit: Rp=1e7 m; Rs=1e8 m` -> adâncime 1 %.

## Reprezentări
Opt scheme SVG didactice separate: sistem solar, orbită eliptică, paralaxă, diagramă H–R, tranzit, expansiune cosmică, telescop, galaxie spirală. Sunt reprezentări orientative, nu efemeride sau simulări exacte.
Model orbital 3D interactiv de proiecție: rotire prin gest și slider, înclinare, zoom; încadrat în spațiul propriu. Dimensiunile, perioadele și distanțele NU sunt la scară.

## Limitări și verificare
Nu pretindem poziții planetare curente, orare de răsărit, efemeride sau calcul de orbită N-body. Acestea necesită servicii de date și contexte de observație suplimentare.
`npm run check` include modulele Astronomiei. `npm run test:ui` include `tests_astronomy_complete.mjs`, precum și regresiile pentru Fizică, Biologie, Chimie, Matematică și navigarea generală. Workflow-ul de PR urmărește fișierele noi.
Codul și testele sunt în repository, dar verificarea CI executată și proba practică pe Android/WebView sunt etape separate; nu marca drept „validat pe telefon” fără rulare reală.
