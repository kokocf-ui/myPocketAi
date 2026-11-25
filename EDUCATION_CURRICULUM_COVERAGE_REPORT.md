# Educație — inventar reproducibil al acoperirii curriculare

Acest raport descrie registrele existente, nu certifică manuale complete, competențe ale elevilor sau verificare pedagogică. Reproduce-l cu `node scripts/audit_education_curriculum_coverage.mjs --markdown`. Anii universitari sunt incluși în matricea pe materii, dar nu în rutele școlare Literatura. Sursele și programele se pot schimba; nu deduce valabilitatea lor doar din existența unui link.

## Imagine de ansamblu

- Matematică: 799 pachete în 50 sisteme; auditul enumeră 817 trasee, 4 candidați anuali și 7 încadrări parțiale. Câmpul fullyApproved=0 este implicit în cod, nu un rezultat al verificării independente a fiecărui an și nu demonstrează că acoperirea generală lipsește.
- Fizică, Chimie, Biologie, Astronomie: 2697 pachete în total. Indicatorul fullyApproved=0 este stabilit implicit în cod, nu o măsurătoare a lipsei conținutului sau un audit al tuturor anilor. Materialele și notele comune rămân parțial în HTML și Worker.
- Matricea generală: 50 sisteme, 11 materii, 7420 selecții valide: 66 încadrări de tip cadru verificat, 655 cu conținut pe clasă neverificat și 6699 generale; 685 selecții fără unități. Clasificarea este cea a matricei, nu un audit complet al pachetelor sau al cititoarelor. Pentru Matematică și cele patru Științe, matricea atribuie eticheta generală prin construcție: aceste numere nu dovedesc lipsa acoperirii generale sau lipsa pachetelor.
- Literatura: 624 rute școlare. Auditul marchează implicit toate țările reviewed=false; aceasta nu dovedește că ele nu au fost revizuite, ci că auditul nu conține evidența unei aprobări individuale. Eticheta de material exact este un rezultat tehnic de rutare, nu o aprobare curriculară.

| Materie Științe | Sisteme cu pachet | Pachete școlare | Pachete universitare | Lecții în pachete | Flag implicit fullyApproved |
|---|---:|---:|---:|---:|---:|
| physics | 50 | 327 | 202 | 7412 | 0 |
| chemistry | 50 | 343 | 201 | 6614 | 0 |
| biology | 50 | 612 | 200 | 6087 | 0 |
| astronomy | 50 | 612 | 200 | 4624 | 0 |

## 50 de sisteme: Istorie, Geografie, Informatică și Literatură

Istorie/Geografie/Informatică: `C/N/G` înseamnă număr de selecții în matrice cu cadru identificat / conținut de clasă neverificat / parcurs general (inclusiv universitate). Această clasificare nu este un audit exhaustiv al tuturor lecțiilor și nici nu dovedește absența conținutului național din alte surse. Pentru Literatură: `E/R/S/F/O` sunt capitole școlare rutate în limba română către material exact / material românesc pe an / practică europeană comună / suport general / numai online; nu sunt ani compleți, nu includ toate limbile sau universitatea și nu măsoară calitatea lecțiilor.

| Sistem | Istorie C/N/G | Geografie C/N/G | Informatică C/N/G | Literatură: rute școlare | Literatură E/R/S/F/O |
|---|---:|---:|---:|---:|---:|
| AD | 0/0/13 | 0/0/13 | 0/0/13 | 12 | 0/0/120/0/0 |
| AL | 0/0/13 | 0/0/13 | 0/0/13 | 12 | 0/0/120/0/0 |
| AT | 0/0/14 | 0/0/14 | 0/0/14 | 13 | 0/0/10/192/0 |
| BA | 0/0/14 | 0/0/14 | 0/0/14 | 13 | 0/0/130/0/0 |
| BE | 0/0/13 | 0/0/13 | 0/0/13 | 12 | 0/0/120/0/0 |
| BG | 0/0/13 | 0/0/13 | 0/0/13 | 12 | 0/0/120/0/0 |
| BY | 0/0/12 | 0/0/12 | 0/0/12 | 11 | 0/0/110/0/0 |
| CH | 0/0/13 | 0/0/13 | 0/0/13 | 12 | 0/0/120/0/0 |
| CY | 0/0/13 | 0/0/13 | 0/0/13 | 12 | 0/0/120/0/0 |
| CZ | 0/0/14 | 0/0/14 | 0/0/14 | 13 | 0/0/130/0/0 |
| DE | 0/0/14 | 0/0/14 | 0/0/14 | 13 | 0/0/130/0/0 |
| DK | 0/0/13 | 0/0/13 | 0/0/13 | 12 | 0/0/120/0/0 |
| EE | 0/0/13 | 0/0/13 | 0/0/13 | 12 | 0/0/120/0/0 |
| ES | 0/0/13 | 0/0/13 | 0/0/13 | 12 | 0/0/120/0/0 |
| FI | 0/0/13 | 0/0/13 | 0/0/13 | 12 | 0/0/120/0/0 |
| FR | 0/0/13 | 0/0/13 | 0/0/13 | 12 | 10/0/110/4/0 |
| GR | 0/0/13 | 0/0/13 | 0/0/13 | 12 | 0/0/120/0/0 |
| HR | 0/0/13 | 0/0/13 | 0/0/13 | 12 | 0/0/10/176/0 |
| HU | 0/0/14 | 0/0/14 | 0/0/14 | 13 | 12/0/0/196/0 |
| IE | 0/0/15 | 0/0/15 | 0/0/15 | 14 | 0/0/140/0/0 |
| IS | 0/0/15 | 0/0/15 | 0/0/15 | 14 | 0/0/140/0/0 |
| IT | 0/0/14 | 0/0/14 | 0/0/14 | 13 | 0/0/130/0/0 |
| LI | 0/0/14 | 0/0/14 | 0/0/14 | 13 | 0/0/130/0/0 |
| LT | 0/0/13 | 0/0/13 | 0/0/13 | 12 | 0/0/120/0/0 |
| LU | 0/0/14 | 0/0/14 | 0/0/14 | 13 | 0/0/130/0/0 |
| LV | 0/0/13 | 0/0/13 | 0/0/13 | 12 | 0/0/120/0/0 |
| MC | 0/0/13 | 0/0/13 | 0/0/13 | 12 | 0/0/120/0/0 |
| MD | 0/0/13 | 0/0/13 | 0/0/13 | 12 | 0/0/10/176/0 |
| ME | 0/0/14 | 0/0/14 | 0/0/14 | 13 | 0/0/130/0/0 |
| MK | 0/0/14 | 0/0/14 | 0/0/14 | 13 | 0/0/130/0/0 |
| MT | 0/0/14 | 0/0/14 | 0/0/14 | 13 | 0/0/130/0/0 |
| NL | 0/0/15 | 0/0/15 | 0/0/15 | 14 | 0/0/140/0/0 |
| NO | 0/0/14 | 0/0/14 | 0/0/14 | 13 | 0/0/130/0/0 |
| PL | 0/0/13 | 0/0/13 | 0/0/13 | 12 | 0/0/10/176/0 |
| PT | 0/0/13 | 0/0/13 | 0/0/13 | 12 | 0/0/120/0/0 |
| RO | 4/0/9 | 0/0/13 | 0/0/13 | 12 | 0/158/0/0/0 |
| RS | 0/0/13 | 0/0/13 | 0/0/13 | 12 | 0/0/10/176/0 |
| RU | 0/0/12 | 0/0/12 | 0/0/12 | 11 | 0/0/110/0/0 |
| SE | 0/0/13 | 0/0/13 | 0/0/13 | 12 | 0/0/120/0/0 |
| SI | 0/0/14 | 0/0/14 | 0/0/14 | 13 | 0/0/130/0/0 |
| SK | 0/0/14 | 0/0/14 | 0/0/14 | 13 | 0/0/130/0/0 |
| SM | 0/0/14 | 0/0/14 | 0/0/14 | 13 | 0/0/130/0/0 |
| TR | 0/0/13 | 0/0/13 | 0/0/13 | 12 | 0/0/10/176/0 |
| UA | 0/0/13 | 0/0/13 | 0/0/13 | 12 | 0/0/120/0/0 |
| VA | 0/0/13 | 0/0/13 | 0/0/13 | 12 | 0/0/120/0/0 |
| XK | 0/0/13 | 0/0/13 | 0/0/13 | 12 | 0/0/120/0/0 |
| GB-ENG | 9/0/5 | 9/0/5 | 0/0/14 | 13 | 0/0/130/0/0 |
| GB-SCT | 0/0/14 | 0/0/14 | 0/0/14 | 13 | 0/0/130/0/0 |
| GB-WLS | 0/0/14 | 0/0/14 | 0/0/14 | 13 | 0/0/130/0/0 |
| GB-NIR | 0/0/15 | 0/0/15 | 0/0/15 | 14 | 0/0/140/0/0 |

## Limitări și următorii pași

- Nu considera domeniile închise doar pentru că există un selector, un cadru sau un pachet; sunt necesare verificări pe surse oficiale, an/cohortă, limbă, capitol, exerciții și cititor.
- Literatura: materiale naționale exacte există pentru capitole selectate HU I–IV și FR CP; acestea rămân parțiale și necesită revizuire pedagogică și lingvistică independentă.
- Istorie, Geografie și Informatică necesită conținut național/anual și integrarea cititorului. Limbi străine, examene și cursuri practice rămân și ele în scopul Educației.
- Pachetele coexistă cu conținut încorporat; publicarea independentă este un pilot local, nu funcționalitate activată în producție. Cache-ul nu demonstrează pornirea complet offline.
