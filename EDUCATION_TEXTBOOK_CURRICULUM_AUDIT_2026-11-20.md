# Audit transversal Educație: structură după clasă, curriculum și manual
**20 noiembrie 2026 — verificare statică a surselor din repo + registre/cadre oficiale.**

## Concluzie
myPocketAI încă nu poate afirma că toate meniurile Educație corespund manualelor elevilor din toate țările europene. Cele mai multe module au un **catalog tematic general** și, în unele cazuri, un filtru pe nivel (`minLevel`), nu o mapare demonstrată **țară → anul școlar → clasă → filieră/regiune → disciplină → manual ales → unități → lecții**.

Alegerea unui singur „manual național” pentru fiecare țară ar fi o altă eroare: în România există mai multe manuale aprobate la aceeași clasă; în Anglia școlile publică planurile proprii, iar manualele diferă; în Germania contează landul; în Spania comunitatea autonomă. **Programa oficială este baza comună, manualul este o alegere de editură/ediție/scoală.**

### Constatări dovedite de testele utilizatorului (100335–100339)
1. Cititorul de literatură transformă automat liniuțele în `a.`, `b.`, `c.` și reîncepe literele după alte blocuri. Titlurile de secțiuni și definițiile apar ca subpuncte amestecate; unele etichete cu `**bold**` sunt afișate literal.
2. România, clasele IX–XII: `Gramatică → Teorie` este un subcapitol cu nume prea general. Când AI primește doar `Teorie`, poate inventa un exemplu nepotrivit (în filmare: o lucrare despre `O scrisoare pierdută` fără selectarea operei). Corecție: capitole gramaticale reale, obiectiv explicit și protecție față de deturnarea lecției.
3. Clasa a IX-a: pas obligatoriu cu **Trunchi comun / Științe sociale / Filologie**. Aceste specializări sunt autentice în programa 2026, dar pot fi un **selector secundar/opțional**, nu un obstacol înainte de cele patru activități principale.
4. „Pagina N din M” a cititorului de telefon nu reprezintă automat numărul de foi A4; trebuie păstrate două concepte distincte.

### Modificări în această ramură
- `literature_study_typography.mjs`: marcator simplu **•** pentru liniuțe și litere generate; **1., 2., 3.** numai pentru exerciții numerotate; subtitluri scurte recunoscute ca antete; `**` eliminat din numele definițiilor.
- `literature_ro_grammar_path.mjs`: clasele I–VIII utilizează cele 24 de capitole gramaticale proprii existente; clasele IX–XII au teme gramaticale explicit formulate pentru anul școlar ales. Eticheta „Teorie” nu mai este un subcapitol de sine stătător în Gramatică, ci un **mod de studiu în interiorul fiecărei lecții**.
- `literature_task_ui.mjs`: conexiunea dintre lecția selectată și cererea către AI include acum obiectivul ei, cu interdicția de a genera o operă literară în locul lecției de gramatică; pentru clasa a IX-a profilul rămâne modificabil prin controlul „Profil (opțional)”, fără ecran obligatoriu.
- Teste regresive extinse pentru a/b/c, subtitluri, Markdown, clasele II, VII, IX, XI.

## Inventar static — alte materii

| Materie / fișier | Ce există în cod | Risc / ce nu este încă demonstrat | Următoarea corecție necesară |
|---|---|---|---|
| Matematică — `index.js`, `math_*.mjs` | Algebra, geometrie, probleme/rezolvitoare, formule, grafice | Lista de opțiuni nu reprezintă automat cuprinsul manualului fiecărei clase și țări | Etapă, clasă, capitol, subcapitol și exemple/exerciții distincte |
| Fizică — `physics_curriculum.mjs` | Capitole cu `minLevel` și lecții locale | `minLevel` ≠ programă specifică pentru clasa VIII, X etc. | Separarea disciplinelor/temelor pe clasă și an de implementare |
| Chimie — `chemistry_curriculum.mjs` | Atom, sistem periodic, legături etc. cu `minLevel` | Nu este demonstrat că întreaga ordine este cea din manualele RO, HU, FR, UK | Catalog național/școlar pentru an, păstrând laboratorul și simbolurile |
| Biologie — `biology_curriculum.mjs` | Biologie celulară, anatomie, genetică etc. cu `minLevel` | Temele pot fi văzute la niveluri diferite, nu în aceeași clasă | Mapare exactă de capitole și profunzime pentru școlarizare |
| Astronomie — `astronomy_curriculum.mjs` | Materiale originale generale | Nu este disciplină separată obligatorie la toate clasele/țările | Marcare drept studiu opțional sau parte din Fizică/Geografie |
| Istorie/Geografie — `education_school_paths.mjs`, `education_grade_lessons_ro.mjs`, `education_grade_lessons_eng.mjs`, `education_general_paths.mjs` | Există lecții distincte RO și Anglia și trasee generale pentru alte sisteme | `HG_SCHOOL_SOURCES` validează doar unele clase/discipline; `education_general_paths` este generic, nu manual obligatoriu | Identificare perioadă/clasă/țară, sursa istorică, capitole pe programă națională |
| Informatică — `computing_curriculum.mjs` | Căi pe nivel, teme de programare și teorie | Căile nu dovedesc corespondentul an școlar–manual, iar competențele digitale din primar diferă de informatică liceală | Curriculă pe vârstă și profil; lecții proprii anului |
| Limbi străine — `foreign_languages_curriculum.mjs` | 14 limbi, progres de competență | Nivelul CEFR este diferit de clasa elevului și de manualul clasei | Două moduri clare: „Școlar, după țară/clasă/manual” și „Învățare liberă, după CEFR” |
| Examene — `exam_curriculum_europe.mjs` | Catalog pe țări de examene, întrebări de antrenament | Subiectele originale nu sunt examene oficiale și nu pot suplini probele reale | An/sesiune, tip de examen și sursă oficială, bine delimitate de fișe de studiu |

Vezi și `EDUCATION_COUNTRY_CURRICULUM_AUDIT_2026-11-08.md` și `EDUCATION_MATERIAL_AUDIT_2026-11-14.md`; inventarele confirmă aceeași deosebire între **conținut local disponibil** și **curriculum național verificat**.

## Reguli pe țară / an școlar, verificate la nivelul cadrului public

| Țară | Referință curriculară și constrângere | Manuale / selecție |
|---|---|---|
| **România** | Ministerul Educației, programe de clasă; pentru a IX-a în 2026/27 TC, TC+CS Științe sociale și TC+CS Filologie; X–XII au tranziție diferită | `https://www.edu.ro/manuale-scolare` și `https://manuale.edu.ro`; manuale multiple/edituri distincte; în octombrie 2026 au fost publicate manuale noi pentru a IX-a, 63 discipline |
| **Anglia (GB-ENG)** | DfE National Curriculum: KS1, KS2, KS3, KS4; Mathematics Years 1–6 este publicat pe an, dar școlile au libertate de organizare până la sfârșitul KS; academies au reguli diferite | Fără manual unic național: alegere după school scheme/editor și programa publicată de școală. Nu combina cu Scoția/Țara Galilor |
| **Franța** | Éduscol programe pe cicluri (2/3/4), școală/liceu, cu tranziții 2026/27 distincte pe clasă | Manuale variabile după editură/școală; nu echivala „cycle” cu o singură clasă |
| **Germania** | KMK standarde federale + Lehrpläne ale fiecărui **Land**, cu tip de școală | Necesită Land, tip școală, clasă și ediție; fără ele numai „program general” |
| **Spania** | BOE RD 157/2022 Primaria, RD 217/2022 ESO și curriculumul comunității autonome | Necesită comunitate autonomă și anul, nu doar „Spania” |
| **Ungaria** | NAT 2020 + Kerettantervek, organizare diferită a școlii generale/gimnázium/technikum | Alege traseul școlar și manualul utilizat; țara singură nu este suficientă |
| **Polonia** | Reforma intră din 2026/27 în clasele I și IV, gradual ulterior; alte cohorte nu trebuie tratate identic | Catalog de manuale aprobate `https://podreczniki.men.gov.pl`; clase și ediții trebuie potrivite reformei |
| **Italia** | Noile Indicazioni nazionali pentru primul ciclu se introduc progresiv în 2026/27, nu pentru toate clasele dintr-odată | Manual și anul școlar ales de școală; liceul cere surse separate |

**Surse oficiale-cheie:**
- România: `https://edu.ro/press_rel_11_2026`, `https://www.edu.ro/press_rel_73_26_manuale_IX`, `https://www.edu.ro/manuale-scolare`
- Anglia: `https://www.gov.uk/national-curriculum`, `https://www.gov.uk/government/publications/national-curriculum-in-england-mathematics-programmes-of-study/national-curriculum-in-england-mathematics-programmes-of-study`
- Franța: `https://eduscol.education.gouv.fr/4509/mathematiques`
- Germania: `https://www.kmk.org/en/downloads-dokumente/rechtsvorschriften-/-lehrplaene/uebersicht-lehrplaene.html`
- Spania: `https://boe.es/diario_boe/txt.php?id=BOE-A-2022-4975`
- Ungaria: `https://www.oktatas.hu/kozneveles/kerettantervek/2020_nat`
- Polonia: `https://www.gov.pl/web/edukacja/nowe-podstawy-programowe-wychowania-przedszkolnego-i-ksztalcenia-ogolnego-dla-szkoly-podstawowej-wraz-ze-zmianami-w-ramowych-planach-nauczania-dla-publicznych-szkol-podstawowych--rozporzadzenia-podpisane`
- Italia: `https://www.mim.gov.it`

## Criteriu de acceptare, nu doar număr de butoane
1. Un elev alege **țară → nivel/clasă → manual dacă există unul identificat → capitol → subcapitol → Teorie / Exemple / Exerciții / Test**; niciun titlu nu trebuie să fie „Teorie” singur ca subiect de gramatică.
2. Materialul începe cu lecția aleasă; nu introduce opere sau capitole din altă clasă ca umplutură.
3. Un paragraf, un titlu, un exemplu și un exercițiu sunt vizual distincte; nu apar marcatori a./b./c. generați de interfață și nu apare Markdown brut.
4. Programele și manualele **neconfirmate** trebuie semnalate explicit, fără a inventa o carte obligatorie sau a impune o listă de autori.
5. Teste în aplicația Android, nu numai `main`: primar II, gimnaziu VII, liceu IX (profil opțional) și XII; verifică Înapoi și PDF.

**Statut:** au fost remediate defectele cititorului și fluxului de literatură. Auditul celorlalte materii este un **inventar de lacune**, NU implementarea unei biblioteci complete de manuale pentru toate țările; aceasta cere o mapare și o verificare pe fiecare țară, disciplină și an școlar.
